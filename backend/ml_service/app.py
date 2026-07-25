from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
import base64
import cv2
from io import BytesIO
from PIL import Image
from pymongo import MongoClient
from datetime import datetime
import random

# Initialize Flask app
app = Flask(__name__)

CORS(app)




# Load trained Keras model
model = load_model("my_model.h5")



# Define emotion labels
emotion_labels = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db = client["emotionDB"]
questions_col = db["questions"]
responses_col = db["emotion_responses"]
recommendations_col = db["recommendations"]

# Load Haar Cascade face classifier
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Utility: Decode base64 image and extract face
def decode_image(image_base64):
    try:
        header, encoded = image_base64.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        pil_image = Image.open(BytesIO(image_bytes)).convert("L")  # grayscale
        opencv_image = np.array(pil_image)
        
        # Detect faces in the image
        faces = face_cascade.detectMultiScale(opencv_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        # Crop to face if detected
        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            cropped_face = opencv_image[y:y+h, x:x+w]
            print(f"Face detected and cropped: x={x}, y={y}, w={w}, h={h}")
        else:
            cropped_face = opencv_image
            print("No face detected, using full frame")
            
        # Resize to 48x48
        resized_face = cv2.resize(cropped_face, (48, 48), interpolation=cv2.INTER_AREA)
        
        image_array = np.array(resized_face) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        image_array = np.expand_dims(image_array, axis=-1)
        return image_array
    except Exception as e:
        print("Image decoding error:", e)
        return None


# --------------------------
# Route: Home
# --------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Emotion Detection Flask API is live!"})

# --------------------------
# Route 1: Predict Emotion
# --------------------------
@app.route("/predict", methods=["POST"])
def predict_emotion():
    data = request.get_json()

    if "image" not in data:
        return jsonify({"error": "Missing image data"}), 400

    image_array = decode_image(data["image"])

    if image_array is None:
        return jsonify({"error": "Image processing failed"}), 400

    prediction = model.predict(image_array)
    predicted_emotion = emotion_labels[np.argmax(prediction)]

    return jsonify({"emotion": predicted_emotion})


# --------------------------
# Run Flask App
# --------------------------
if __name__ == "__main__":

    app.run(debug=True)