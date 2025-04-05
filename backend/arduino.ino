/*
Light sensor
Date: 2025-04-04
*/
const int tiltPin = 2;    // Pin connected to tilt sensor
const int lightPin = A0;  // Pin connected to light sensor (photoresistor)

void setup() {
  pinMode(tiltPin, INPUT);    // Set tiltPin as input
  Serial.begin(9600);         // For debugging
}

void loop() {
  int lightLevel = analogRead(lightPin);   // Read the light sensor (0 to 1023)
  int sensorVal = digitalRead(tiltPin);    // Read the tilt sensor (HIGH or LOW)
  
  // Print light sensor value
  Serial.print("light: ");
  Serial.println(lightLevel);
  
  // Check tilt sensor and print status
  if (sensorVal == HIGH) {
    Serial.println("tilt: true");
  } else {
    Serial.println("tilt: false");
  }
  
  delay(500);  // Wait for 500ms before looping again
}