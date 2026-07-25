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
from agent import run_agent
from emotion_history import get_recent_emotions
import os

app = Flask(__name__)
CORS(app)

model = load_model("my_model.h5")

emotion_labels = ["angry", "disgust", "fear", "happy", "sad", "surprise", "neutral"]

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def decode_image(image_base64):
    try:
        header, encoded = image_base64.split(",", 1)
        image_bytes = base64.b64decode(encoded)
        pil_image = Image.open(BytesIO(image_bytes)).convert("L")
        opencv_image = np.array(pil_image)
        faces = face_cascade.detectMultiScale(opencv_image, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            cropped_face = opencv_image[y:y+h, x:x+w]
        else:
            cropped_face = opencv_image
        resized_face = cv2.resize(cropped_face, (48, 48), interpolation=cv2.INTER_AREA)
        image_array = np.array(resized_face) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        image_array = np.expand_dims(image_array, axis=-1)
        return image_array
    except Exception as e:
        print("Image decoding error:", e)
        return None

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "MindSense AI Backend is live!"})

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

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message", "")
    detected_emotion = data.get("emotion", "neutral")
    user_id = data.get("user_id", "anonymous")

    if not user_message or not detected_emotion:
        return jsonify({"error": "Missing message or emotion"}), 400

    try:
        result = run_agent(user_id, detected_emotion, user_message)
        return jsonify({
            "action": result["action"],
            "response": result["response"]
        })
    except Exception as e:
        print("Agent error:", e)
        return jsonify({"response": "I'm here for you. Please try again in a moment."}), 200

@app.route("/history", methods=["GET"])
def get_history():
    user_id = request.args.get("user_id", "anonymous")
    days = int(request.args.get("days", 7))
    try:
        records = get_recent_emotions(user_id, days=days)
        return jsonify({"history": records})
    except Exception as e:
        print("History error:", e)
        return jsonify({"history": []}), 200

if __name__ == "__main__":
    app.run(debug=True)
    