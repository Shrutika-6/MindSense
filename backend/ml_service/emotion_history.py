from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["mindsenseDB"]
collection = db["emotion_logs"]

def log_emotion(user_id, emotion):
    record = {
        "user_id": user_id,
        "emotion": emotion,
        "timestamp": datetime.utcnow()
    }
    collection.insert_one(record)
    print(f"Logged: {emotion} for user {user_id}")

def get_recent_emotions(user_id, days=3):
    from datetime import timedelta
    since = datetime.utcnow() - timedelta(days=days)
    records = list(collection.find(
        {"user_id": user_id, "timestamp": {"$gte": since}},
        {"_id": 0, "emotion": 1, "timestamp": 1}
    ).sort("timestamp", -1))
    return records

def check_repeated_negative(user_id, emotion, days=3):
    records = get_recent_emotions(user_id, days)
    negative_emotions = ["sad", "angry", "fear", "disgust"]
    negative_count = sum(1 for r in records if r["emotion"] in negative_emotions)
    return negative_count >= 3


# --------------------------
# Self-Compassion Jar Helpers
# --------------------------
memories_collection = db["memories"]

def log_memory(user_id, text):
    record = {
        "user_id": user_id,
        "text": text,
        "timestamp": datetime.utcnow()
    }
    memories_collection.insert_one(record)
    print(f"Logged memory for user {user_id}")

def get_memories(user_id):
    return list(memories_collection.find({"user_id": user_id}, {"_id": 0, "text": 1, "timestamp": 1}))

def get_random_memory(user_id):
    import random
    memories = get_memories(user_id)
    if not memories:
        return None
    return random.choice(memories)

