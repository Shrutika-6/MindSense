import requests

print("TEST 1: Normal sadness")
response = requests.post("http://127.0.0.1:5000/chat", json={
    "user_id": "testuser1",
    "emotion": "sad",
    "message": "I have been feeling really low lately"
})
print(response.json())
print("---")

print("TEST 2: Crisis detection")
response = requests.post("http://127.0.0.1:5000/chat", json={
    "user_id": "testuser2",
    "emotion": "sad",
    "message": "I dont want to live anymore"
})
print(response.json())
print("---")

print("TEST 3: Mood history")
response = requests.get("http://127.0.0.1:5000/history?user_id=user123&days=7")
print(response.json())
