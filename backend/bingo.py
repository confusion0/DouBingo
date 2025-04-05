from __future__ import annotations
import json
import random

import os
from dotenv import load_dotenv

import google.generativeai as genai

load_dotenv()
GOOGLE_API = os.getenv("GOOGLE_API")

# pip install google-generativeai ivan its ok im using deepseek rn we can compare later
# sure it doesnt matte what we use as long as it works
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

class Bingo:
    def __init__(self, n: int, win_k: int):
        """
            Parameters:
                n: the size of the board
                win_k: the number in a row needed to win
        """
        if win_k > n:
            raise ValueError("win_k value must be less than or equal to n")
        self.n = n
        self.win_k = win_k
        self.found = [[False] * n for _ in range(n)]

        random.shuffle(animals)
        self.animals = [["Placeholder"] * n for _ in range(n)]
        for idx in range(min(len(animals), n * n)):
            i, j = divmod(idx, n)
            self.animals[i][j] = animals[idx]

    def check_bingo(self) -> bool:
        for i in range(self.n):
            for j in range(self.n):
                if not self.found[i][j]:
                    continue
                dirs = [(0, 1), (1, 0), (1, 1), (1, -1)]
                for dr, dc in dirs:
                    cur = 0
                    r = i
                    c = j
                    while 0 <= r < self.n and 0 <= c < self.n and cur < self.win_k and self.found[r][c]:
                        r += dr
                        c += dc
                        cur += 1
                    if cur >= self.win_k:
                        return True

        return False

    def mark_cell(self, r: int, c: int) -> None:
        self.found[r][c] = True
    
    def to_string(self) -> str:
        return json.dumps({
            "n": self.n,
            "win_k": self.win_k,
            "found": self.found,
            "animals": self.animals
        })

    @staticmethod
    def from_string(string: str) -> Bingo:
        data = json.loads(string)
        result = Bingo(data["n"], data["win_k"])
        result.found = data["found"]
        result.animals = data["animals"]
        return result


def classify(name: str) -> str:
    genai.configure(api_key=GOOGLE_API)

    # change model here
    model = genai.GenerativeModel("gemini-2.0-flash")

    pre_prompt = f"Classify '{name}' into one of these {str(animals)}. Only respond with the name of the animal. Respond with 'Invalid' if it matches none"
    response = model.generate_content(contents=pre_prompt)
    res = response.text.strip()

    if res not in animals:
        res = "Invalid"
    return res


