from agent import run_agent

print("TEST 1: Normal sadness")
result = run_agent("user456", "sad", "I am feeling a bit sad today")
print("Action:", result["action"])
print("Response:", result["response"])
print("---")

print("TEST 2: Repeated negative")
result = run_agent("user123", "sad", "I have been feeling really low again")
print("Action:", result["action"])
print("Response:", result["response"])
print("---")

print("TEST 3: Crisis detection")
result = run_agent("user789", "sad", "I don't want to live anymore")
print("Action:", result["action"])
print("Response:", result["response"])
