from threading import Thread
from waitress import serve

import secrets
from werkzeug.security import generate_password_hash, check_password_hash

from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send
import requests

import serial
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity,
    verify_jwt_in_request
)
from flask_cors import CORS
import json

import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from datetime import timedelta

from bingo import Bingo

from openai import OpenAI

load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app)

CORS( 
    app,
    supports_credentials=True,
    origins=["http://localhost:3000", "https://dou-bingo-9lx4.vercel.app"]
)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

jwt = JWTManager(app)

cluster = MongoClient(os.getenv('MONGODB_URI'), serverSelectionTimeoutMS=5000, tls=True, tlsAllowInvalidCertificates=True)
db = cluster["animal-bingo"]

arduino = None
arduino_light = None
arduino_tilt = None

def init_serial():
    global arduino
    if arduino is None or not arduino.is_open:
        try:
            arduino = serial.Serial('COM5', baudrate=9600, timeout=1)
            print("Connected to COM5")
        except serial.SerialException as e:
            print(f"[ERROR] Could not open COM5: {e}")
            arduino = None


@app.route('/sign-up', methods=['POST'])
def signup():
    try:
        data = request.json

        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Please enter a username and password."}), 400

        users_collection = db["users"]
        
        if users_collection.find_one({"username": username}):
            return jsonify({"error": "That username is taken."}), 400
        
        hashed_password = generate_password_hash(password)
        
        inserted = users_collection.insert_one({
            "username": username,
            "password": hashed_password,
            "score": 0,
            "bingo": Bingo(4, 3).to_string(),
        })
        access_token = create_access_token(identity=str(inserted.inserted_id))

        return jsonify({"access_token": access_token}), 200
    
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "An error occurred during signup."}), 500


@app.route('/log-in', methods=['POST'])
def login():
    try:
        data = request.json

        username = data.get("username")
        password = data.get("password")
        
        if not username or not password:
            return jsonify({"error": "Please enter a username and password."}), 400

        users_collection = db["users"]
        user = users_collection.find_one({"username": username})

        if not user or not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid username or password."}), 400
        
        access_token = create_access_token(identity=str(user["_id"]))

        return jsonify({"access_token": str(access_token)}), 200
    
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"error": "An error occurred during login."}), 500


def detect_animal(image_bytes):
    response = requests.post(
        "https://api-inference.huggingface.co/models/microsoft/resnet-50",
        headers={"Authorization": f"Bearer {os.getenv("HUGGING_FACE_API")}"},
        data=image_bytes
    )

    if response.status_code == 200:
        predictions = response.json()

        print(predictions)

        return predictions[0]["label"] if predictions else None
    else:
        raise Exception(f"Request failed with status code {response.status_code}: {response.text}")

def check_bingo(found, n, win_k):
    for i in range(n):
        for j in range(n):
            if not found[i][j]:
                continue
            dirs = [(0, 1), (1, 0), (1, 1), (1, -1)]
            for dr, dc in dirs:
                cur = 0
                r = i
                c = j
                while 0 <= r < n and 0 <= c < n and cur < win_k and found[r][c]:
                    r += dr
                    c += dc
                    cur += 1
                if cur >= win_k:
                    return True

    return False

@app.route('/detect-animal', methods=['POST'])
def detect_animal_route():
    try:
        verify_jwt_in_request()
    except Exception as e:
        print(f"[ERROR] {e}")
        return {"error": "Please log in."}, 400
    
    try:
        user_id = get_jwt_identity()

        print(arduino_light, arduino_tilt)

        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        image_file = request.files['image']
        image_bytes = image_file.read()

        users_collection = db["users"]
        user_raw = users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user_raw:
            return jsonify({"error": "User not found."}), 400
        
        bingo_raw = json.loads(user_raw["bingo"])

        detected_animal = detect_animal(image_bytes)
        animals = [
            "Squirrel",
            "Raccoon",
            "White-tailed Deer",
            "Coyote",
            "Canada Goose",
            "Rabbit",
            "Skunk",
            "Chipmunk",
            "Groundhog",
            "Red Fox",
            "Black Bear",
            "Beaver",
            "Moose",
            "Bald Eagle",
            "Crow",
            "Seagull"
        ]
        
        client = OpenAI(api_key=os.getenv("DEEPSEEK_API_KEY"), base_url="https://api.deepseek.com")
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{
                "role": "system", 
                "content": f'''
                    You are an animal classification system. You will be given an input of an obscure animal name. 
                    Your job is to generalize the animal into one of these animals: {str(animals)}.

                    If the input cannot be generalized into one of these animals, return "Unknown".

                    Do not output anything other than the animal name.
                '''
                },
                {
                    "role": "user", 
                    "content": f"Classify the animal: {detected_animal}"
                },
            ],
            stream=False
        )

        raw = response.choices[0].message.content.strip()
        
        if raw == "Unknown":
            return jsonify({ "error": "Animal not in bingo squares." }), 400
        if raw not in animals:
            return jsonify({ "error": "AI detection failed." }), 400
        
        print(f"Detected '{detected_animal}', Generalized: '{raw}', Light: {arduino_light}, Tilt: {arduino_tilt}")
        found = bingo_raw["found"]
        animals = bingo_raw["animals"]

        for i in range(len(animals)):
            for j in range(len(animals[i])):
                if animals[i][j] == raw:
                    if found[i][j]:
                        return jsonify({ "error": f"The given animal ({raw}) has already been found!" }), 400
                    found[i][j] = True
                    break
        
        bingo_result = check_bingo(found, len(animals), 3)

        users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {
            "bingo": json.dumps({
                "animals": animals,
                "found": found
            })
        }})
        
        points = 100
        if bingo_result:
            points += 1000

            if arduino_light is not None and arduino_light > 400:
                points += 500
            if arduino_tilt:
                points += 500

            users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {
                "bingo": Bingo(4, 3).to_string()
            }})
        
        users_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {
            "score": points
        }})

        user_raw = users_collection.find_one({"_id": ObjectId(user_id)})
            
        if not user_raw:
            return jsonify({"error": "User not found."}), 400
            
        bingo_raw = json.loads(user_raw["bingo"])
            
        return jsonify({
            "animals": bingo_raw["animals"],
            "found": bingo_raw["found"],
            "detected": raw,
            "bingo": bingo_result,
            "points": points,
            "light": arduino_light is not None and arduino_light > 400,
            "tilt": arduino_tilt
        }), 200
    
    except Exception as e:
        print(f"[ERROR] {e}")
        print(dir(e), type(e))
        return jsonify({"error": "An error occurred while processing the image."}), 500


@app.route('/leaderboard', methods=['GET'])
def leaderboard():
    try:
        verify_jwt_in_request()
    except Exception as e:
        print(f"[ERROR] {e}")
        return {"error": "Please log in."}, 400
    
    users_collection = db["users"]

    lb_data = []
    for value in users_collection.find().sort("score", pymongo.DESCENDING):
        lb_data.append({
            "username": value["username"],
            "score": value["score"]
        })

    return jsonify(lb_data), 200


@app.route('/user', methods=['GET'])
def user_route():
    try:
        verify_jwt_in_request()
    except Exception:
        return {"error": "Please log in."}, 400
    
    user_id = get_jwt_identity()
    
    users_collection = db["users"]

    user_raw = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user_raw:
        return jsonify({"error": "User not found."}), 400
    
    user_data = {
        "score": user_raw["score"]
    }
    return jsonify(user_data), 200


@app.route('/bingo-data', methods=['GET'])
def bingo_data_route():
    try:
        verify_jwt_in_request()
    except Exception as e:
        print(f"[ERROR] {e}")
        return {"error": "Please log in."}, 400
    
    user_id = get_jwt_identity()
    
    users_collection = db["users"]
    user_raw = users_collection.find_one({"_id": ObjectId(user_id)})

    if not user_raw:
        return jsonify({"error": "User not found."}), 400
    
    bingo_raw = json.loads(user_raw["bingo"])

    bingo_data = {
        "score": user_raw["score"],
        "found": bingo_raw["found"],
        "animals": bingo_raw["animals"]
    }

    return jsonify(bingo_data), 200

@app.route('/regenerate-bingo-data', methods=['POST'])
def regenerate_bingo_data_route():
    try:
        verify_jwt_in_request()
    except Exception:
        return {"error": "Please log in."}, 400
    
    user_id = get_jwt_identity()
    
    users_collection = db["users"]

    user_raw = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user_raw:
        return jsonify({"error": "User not found."}), 400

    users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": {
        "bingo": Bingo(4, 3).to_string()
    }})

    return jsonify({"success": True}), 200


def read_from_arduino():
    global arduino_light
    global arduino_tilt

    if arduino is None:
        print("Arduino not available.")
        return

    while arduino and arduino.is_open:
        try:
            data = arduino.readline().decode('utf-8').strip()

            if data:
                if data.startswith("light"):
                    arduino_light = int(data.split(": ")[1])
                    
                    socketio.emit('light', {'light': arduino_light})
                if data.startswith("tilt"):
                    if data.split(": ")[1] == "true":
                        arduino_tilt = True
                    else:
                        arduino_tilt = False

                    socketio.emit('tilt', {'tilt': arduino_tilt})
            
        except Exception as e:
            print(f"Error reading from Arduino: {e}")

if __name__ == '__main__':
    if os.getenv("ENVIRONMENT") == "production":
        serve(app, host='0.0.0.0', port=8000)
    else:
        init_serial()
        server_thread = Thread(target=lambda: serve(app, host='0.0.0.0', port=8000))
        server_thread.start()

        read_from_arduino()