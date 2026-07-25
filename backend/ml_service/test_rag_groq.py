import chromadb
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection(name="mental_health_techniques")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))

detected_emotion = "sad"
user_message = f"The user is feeling {detected_emotion} today."

results = collection.query(
    query_texts=[user_message],
    n_results=2
)

retrieved_techniques = results["documents"][0]
context = "\n\n".join(retrieved_techniques)

response = groq_client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "system",
            "content": f"""You are MindSense, a compassionate AI mental health companion.
Use ONLY the following verified techniques to help the user — do not make up anything outside of this:

{context}

Keep your response warm, concise, and supportive — maximum 3 sentences.
Never diagnose or replace professional therapy.
If user mentions self-harm, refer to a helpline immediately."""
        },
        {
            "role": "user",
            "content": user_message
        }
    ]
)

print("Detected emotion:", detected_emotion)
print("---")
print("MindSense says:")
print(response.choices[0].message.content)
