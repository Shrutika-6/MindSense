const mongoose = require('mongoose');

const EmotionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const EmotionModel = mongoose.model("emotionDB", EmotionSchema);
module.exports = EmotionModel;

