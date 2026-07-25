const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const EmotionModel = require('./models/Emotion'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/emotionDB"); 

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmotionModel.findOne({ email: email }) 
  .then(user => {
    if (user) {
     if (user.password === password){
      res.json("Success")
     } else {
      res.json("Incorrect password")
     }  
  } else {
    res.json("User not found");
  }
})
})     


app.post('/user', (req, res) => {
 EmotionModel.create(req.body)
    .then(emotionDB => res.json(emotionDB))
    .catch(err => res.json(err));
});

app.listen(3001, () => {
  console.log('Server is running' )
});