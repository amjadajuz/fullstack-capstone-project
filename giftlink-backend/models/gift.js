import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  posted_by: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    match: /^[0-9]{5}$/,
    required: true
  },
  date_added: {
    type: Number, 
    required: true
  },
  age_days: {
    type: Number
  },
  age_years: {
    type: Number
  },
  description: {
    type: String,
    maxlength: 1000
  },
  image: {
    type: String 
  }
}, {
  timestamps: true 
});

export default mongoose.model("Gift", giftSchema);
