
// models/messageModel.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  from: String,
  to: {type: String, required: true},
  pesan: {type: String, required: true},
  title: String,
  artist: String,
  cover: String,
  spotify_url: String,
  preview_url: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // ini artinya auto delete setelah 7 hari
  }
}, {
  timestamps: true // akan otomatis isi createdAt dan updatedAt
});

export default mongoose.model('Message', messageSchema);
