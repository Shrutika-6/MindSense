from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "system",
            "content": """You are MindSense, a compassionate AI mental health companion. 
Your role is to provide emotional support and suggest evidence-based coping techniques.
You must never diagnose, prescribe medication, or replace professional therapy.
If a user expresses thoughts of self-harm or suicide, always refer them to a professional helpline immediately.
Keep responses warm, concise, and supportive — maximum 3 sentences."""
        },
        {
            "role": "user",
            "content": "I just detected that the user is feeling sad. Suggest one simple, caring coping technique."
        }
    ]
)

print(response.choices[0].message.content)
