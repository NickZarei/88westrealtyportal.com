import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';

mongoose.connect(process.env.MONGO_URI!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    res.status(200).json({ 
      success: true, 
      user: { 
        id: user._id, 
        name: user.name, 
        role: user.role 
      } 
    });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
}