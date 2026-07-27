const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const EmotionModel = require('./models/Emotion'); 

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "mindsense_super_secret_key_2026_token";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/emotionDB";

mongoose.connect(MONGODB_URI); 

// User login endpoint generating a signed JWT token
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmotionModel.findOne({ email: email }) 
  .then(user => {
    if (user) {
      if (user.password === password){
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ status: "Success", token: token, email: user.email });
      } else {
        res.json({ status: "Incorrect password" });
      }  
    } else {
      res.json({ status: "User not found" });
    }
  })
  .catch(err => res.status(500).json({ error: err.message }));
});     

// Route verification endpoint to validate JWT token on client requests
app.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ status: "Unauthorized", message: "Token missing" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ status: "Unauthorized", message: "Token format invalid" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ status: "Unauthorized", message: "Token invalid or expired" });
    }
    res.json({ status: "Success", email: decoded.email });
  });
});

// Signup user creation endpoint
app.post('/user', (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters long" });
  }
  EmotionModel.create(req.body)
    .then(emotionDB => res.json(emotionDB))
    .catch(err => res.json(err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});