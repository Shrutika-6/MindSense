import chromadb

client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(name="mental_health_techniques")

emotion = "I am feeling really sad and hopeless today"

results = collection.query(
    query_texts=[emotion],
    n_results=2
)

print("Top matching techniques for:", emotion)
print("---")
for i, doc in enumerate(results["documents"][0]):
    print(f"Match {i+1}:")
    print(doc)
    print("---")
    