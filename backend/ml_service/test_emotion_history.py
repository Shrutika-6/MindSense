from emotion_history import log_emotion, get_recent_emotions, check_repeated_negative

log_emotion("user123", "sad")
log_emotion("user123", "sad")
log_emotion("user123", "fear")

history = get_recent_emotions("user123", days=3)
print("Recent emotions:", [r["emotion"] for r in history])

repeated = check_repeated_negative("user123", "sad", days=3)
print("Repeated negative emotions detected:", repeated)
