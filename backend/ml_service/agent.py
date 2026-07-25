from groq import Groq
import chromadb
from emotion_history import log_emotion, get_recent_emotions, check_repeated_negative
from dotenv import load_dotenv
import os

load_dotenv()

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="mental_health_techniques")

CRISIS_KEYWORDS = [
    "suicide", "suicidal",
    "kill myself", "killing myself",
    "end my life", "end it all",
    "self harm", "self-harm", "selfharm",
    "hurt myself",
    "don't want to live", "dont want to live",
    "want to die", "wanna die",
    "no reason to live", "can't go on", "cannot go on"
]
def check_crisis(user_message):
    message_lower = user_message.lower()
    return any(keyword in message_lower for keyword in CRISIS_KEYWORDS)

def get_rag_response(emotion, user_message):
    results = collection.query(
        query_texts=[f"user feels {emotion}: {user_message}"],
        n_results=2
    )
    retrieved = results["documents"][0]
    context = "\n\n".join(retrieved)
    return context

def decide_action(user_id, emotion, user_message):
    if check_crisis(user_message):
        return "crisis"
    if check_repeated_negative(user_id, emotion, days=3):
        return "repeated_negative"
    return "normal"

def run_agent(user_id, emotion, user_message):
    log_emotion(user_id, emotion)
    
    action = decide_action(user_id, emotion, user_message)
    
    if action == "crisis":
        return {
            "action": "crisis",
            "response": "I'm really concerned about you right now. Please reach out to a mental health helpline immediately. In India, you can call iCall: 9152987821 or Vandrevala Foundation: 1860-2662-345, available 24/7. You are not alone and help is available right now."
        }
    
    if action == "repeated_negative":
        system_extra = "This user has been experiencing negative emotions for multiple days. Be extra warm and gently suggest they consider speaking to a professional counselor in addition to the technique."
    else:
        system_extra = "Suggest one technique warmly and concisely."

    context = get_rag_response(emotion, user_message)
    
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": f"""You are MindSense, a compassionate AI mental health companion.
Use ONLY these verified techniques to help the user:

{context}

{system_extra}
Never diagnose or replace professional therapy.
Keep response warm, caring and under 4 sentences."""
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    )
    
    return {
        "action": action,
        "response": response.choices[0].message.content
    }
