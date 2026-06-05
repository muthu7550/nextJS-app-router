// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: String,
    required: [true, 'Please provide a price'],
  },
  image: {
    type: String,
    // required: [true, 'Please provide an image URL'],
  },
  itemCount: {
    type: Number,
    required: [true, 'Please provide an Item Count'],

  },
  userName: {
    type: String,
    required: [true, 'Please provide an UserName'],
    
  },
    userId: {
    type: String,
    required: [true, 'Please provide an User ID'],
    
  },

});

// Use the existing model if it exists, or create a new one
export default mongoose.models.Users || mongoose.model('Users', UserSchema);