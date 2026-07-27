# 🧠 MindSense — AI-Powered Wellness Companion

> A modern, full-stack mental health and wellness platform that combines real-time facial keypoint tracking, custom CNN classification, an AI Coping Companion chatbot backed by Retrieval-Augmented Generation (RAG), and interactive self-care coaches.

---

## 🛠️ Technology Stack & Badges

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![ChromaDB](https://img.shields.io/badge/ChromaDB-lightgrey?style=for-the-badge)

---

## 📐 System Architecture

The application is structured as a decoupled multi-service architecture:

```mermaid
graph TD
  User[Browser / React Client App]
  Express[Express Auth Server :3001]
  Flask[Flask ML Server :5000]
  Mongo[(MongoDB :27017)]
  Chroma[(ChromaDB Vector Store)]
  Groq[Groq Llama LLM]

  User -- Signup, Login & Verify Token --> Express
  Express -- Read/Write Users --> Mongo
  User -- Mirror Cam Feed & Chat --> Flask
  Flask -- Vector Search --> Chroma
  Flask -- Context Grounded RAG Prompts --> Groq
```

---

## 🚀 Key Features

*   **📸 Real-Time Emotion Scanner**: Circular mirrored camera feed overlaid with holographic scanning laser sweeps, coordinates, and scopes. Instantly logs percentages of 7 key emotional classifications.
*   **💬 RAG AI Coping Companion**: Chatbot powered by ChromaDB vector store and Groq's Llama LLM. Dynamically generates custom cognitive coping techniques grounded in professional therapy guides.
*   **🚨 Crisis Safety Net**: Real-time keyword scanning automatically routes users to professional emergency channels.
*   **🌬️ Breathing Coach Ring**: Guided breathing circular tracker that pulses, expands, and contracts matching Inhale (4s), Hold (4s), and Exhale (6s) cycles.
*   **🔮 Self-Compassion Jar**: Virtual joy jar with glowing spheres. Drawing a memory shakes the jar and triggers a rising floating bubble animation that pops to reveal self-compassion cards.
*   **📊 Mood Dashboard**: Statistical mood tracking over time powered by MongoDB logs and visualized via Recharts.
*   **🛡️ Secure Route Guards**: Frontend and backend JWT guards that block URL bypass attempts, accompanied by an app-startup session validator and confirmation logout modals.

---

## 📸 Screenshots

### Interactive Mental Wellness Dashboard (Home)
![Home Dashboard](./screenshots/home_dashboard.png)

### Real-Time Facial Expression Mapping (Camera Scanner)
![Emotion Scanner](./screenshots/emotion_scanner.png)

---

## ⚙️ How to Run Locally

### Prerequisites
*   Node.js (v18+)
*   Python (3.9+)
*   MongoDB running locally on port `27017`

### 1. Start the MongoDB Express Auth Backend
```bash
cd backend/auth_service
npm install
npm start
```
*Runs on port `3001`.*

### 2. Start the Flask ML & RAG Backend
```bash
cd backend/ml_service
python -m venv venv

# Activate Virtual Environment (Windows)
.\venv\Scripts\activate

# Install packages
pip install -r requirements.txt

# Create environment file (.env)
echo "GROQ_API_KEY=your_groq_api_key" > .env

# Initialize ChromaDB Vector Database
python load_knowledge.py

# Start Server
python app.py
```
*Runs on port `5000`.*

### 3. Start the React Frontend client
```bash
cd frontend
npm install
npm start
```
*Runs on port `3000`.*
