import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ['agent', 'admin', 'ceo', 'marketing', 'conveyance'],
    default: 'agent',
  },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
