import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../../../models/User';

mongoose.connect(process.env.MONGO_URI!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ success: true, userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
}