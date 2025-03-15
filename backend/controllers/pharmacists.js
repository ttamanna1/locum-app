import Pharmacist from '../models/pharmacist.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Pharmacist Registration
// Method: Post
// Path: /pharmacist-register
export const pharmacistRegister = async (req, res) => {
  try {
    const newPharmacist = await Pharmacist.create(req.body);
    return res.status(201).json({ message: `Welcome ${newPharmacist.username}` });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Pharmacist Login
// Method: Post
// Path: /pharmacist-login
export const pharmacistLogin = async (req, res) => {
  try {
    const pharmacistLogin = await Pharmacist.findOne({ username: req.body.email });
    if (!pharmacistLogin || !bcrypt.compareSync(req.body.password, pharmacistLogin.password)) {
      throw new Error(!pharmacistLogin ? 'Email not found' : 'Password incorrect');
    }
    const token = jwt.sign({ sub: pharmacistLogin._id }, process.env.JWT_SECRET, { expiresIn: '30d'});
    return res.status(202).json({ message: `Welcome back ${pharmacistLogin.username}`, token });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid credentials' });
    
  }
};

// Pharmacist Profile
// Method: Get
// Path: /pharmacist-profile
export const pharmacistProfile = async (req, res) => {
  try {
    const pharmacistProfile = await Pharmacist.findById(req.currentPharmacist._id);
    return res.status(200).json(pharmacistProfile);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

// Get pharmacist notifications
// Method: Get
// /pharmacist-profile/notifications
export const pharmacistNotifications = async (req, res) => {
  try {
    const pharmacist = await Pharmacist.findById(req.currentPharmacist._id);
    if (!pharmacist) {
      return res.status(404).json({ error: 'Pharmacist not found.' });
    }
    return res.json(pharmacist.notifications);
  } catch (error) {
    console.error('Error fetching notifications.', error);
    return res.status(500).json({ error: 'Error fetching notifications' });
  }
};
