import chromadb
import os

client = chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(name="mental_health_techniques")

knowledge_folder = "./knowledge_base"

for filename in os.listdir(knowledge_folder):
    if filename.endswith(".txt"):
        filepath = os.path.join(knowledge_folder, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        doc_id = filename.replace(".txt", "")
        
        collection.upsert(
            documents=[content],
            ids=[doc_id]
        )
        print(f"Loaded: {filename}")

print(f"\nTotal documents loaded: {collection.count()}")
