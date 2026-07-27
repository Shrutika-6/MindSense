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
from emotion_history import get_recent_emotions, log_memory, get_memories, get_random_memory, log_emotion
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

@app.route("/history", methods=["POST"])
def add_history():
    data = request.get_json()
    user_id = data.get("user_id", "anonymous")
    emotion = data.get("emotion", "neutral")
    try:
        log_emotion(user_id, emotion)
        return jsonify({"message": "Emotion logged successfully", "success": True})
    except Exception as e:
        print("Log history error:", e)
        return jsonify({"error": str(e), "success": False}), 500
@app.route("/history/latest", methods=["GET"])
def get_latest_emotion():
    user_id = request.args.get("user_id", "anonymous")
    try:
        from pymongo import MongoClient
        client = MongoClient("mongodb://127.0.0.1:27017/")
        db = client["mindsenseDB"]
        collection = db["emotion_logs"]
        record = collection.find_one(
            {"user_id": user_id},
            {"_id": 0, "emotion": 1, "timestamp": 1},
            sort=[("timestamp", -1)]
        )
        if not record:
            return jsonify({"latest": None})
        record["timestamp"] = record["timestamp"].isoformat()
        return jsonify({"latest": record})
    except Exception as e:
        print("Latest emotion error:", e)
        return jsonify({"latest": None}), 200

@app.route("/memories", methods=["POST"])
def post_memory():
    data = request.get_json()
    user_id = data.get("user_id", "anonymous")
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "Missing memory text"}), 400
        
    api_key = os.environ.get("GROQ_API_KEY")
    if api_key:
        try:
            from groq import Groq
            groq_client = Groq(api_key=api_key)
            classification = groq_client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {
                        "role": "system",
                        "content": """You are a sentiment filter for a Self-Compassion Jar. 
The jar must ONLY hold positive, happy, or gratitude-filled memories (accomplishments, compliments, moments of peace, things that made the user smile).
It must NOT contain neutral, empty, flat, sad, critical, depressing, sick, or anxious statements (such as: 'i am not feeling anything', 'nothing', 'i am not feeling well', 'i failed', 'i feel down').
Analyze the text and respond with exactly one word: 'POSITIVE' or 'NEGATIVE'."""
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ]
            )
            sentiment = classification.choices[0].message.content.strip().upper()
            print(f"Memory classification: {sentiment} for text: {text}")
            if "NEGATIVE" in sentiment:
                return jsonify({
                    "is_positive": False,
                    "message": "It sounds like you're having a tough moment. The Self-Compassion Jar is reserved for happy/gratitude memories to lift you up later. Consider talking to the MindSense Companion about this instead!"
                }), 200
        except Exception as e:
            print("Groq sentiment check error:", e)

    try:
        log_memory(user_id, text)
        return jsonify({
            "is_positive": True,
            "message": "Memory saved successfully!"
        })
    except Exception as e:
        print("Save memory error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/memories", methods=["GET"])
def fetch_memories():
    user_id = request.args.get("user_id", "anonymous")
    try:
        records = get_memories(user_id)
        return jsonify({"memories": records})
    except Exception as e:
        print("Fetch memories error:", e)
        return jsonify({"memories": []}), 200

@app.route("/memories/random", methods=["GET"])
def fetch_random_memory():
    user_id = request.args.get("user_id", "anonymous")
    try:
        record = get_random_memory(user_id)
        if not record:
            return jsonify({"memory": None})
        return jsonify({"memory": record})
    except Exception as e:
        print("Fetch random memory error:", e)
        return jsonify({"memory": None}), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_ENV") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)