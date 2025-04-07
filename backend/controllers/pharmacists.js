import Pharmacist from '../models/pharmacist.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Pharmacist Registration
// Method: Post
// Path: /pharmacist-register
export const pharmacistRegister = async (req, res, next) => {
  try {
    const newPharmacist = await Pharmacist.create(req.body);
    return res.status(201).json({ message: `Welcome ${newPharmacist.firstName}` });
  } catch (error) {
    next({ status: 400, message: 'Error registering pharmacist.' });
  }
};

// Pharmacist Login
// Method: Post
// Path: /pharmacist-login
export const pharmacistLogin = async (req, res, next) => {
  try {
    const pharmacistLogin = await Pharmacist.findOne({ email: req.body.email });
    if (!pharmacistLogin || !bcrypt.compareSync(req.body.password, pharmacistLogin.password)) {
      return next({ status: 401, message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ sub: pharmacistLogin._id }, process.env.JWT_SECRET, { expiresIn: '30d'});
    return res.status(202).json({ message: `Welcome back ${pharmacistLogin.firstName}`, token });
  } catch (error) {
    next({ status: 500, message: 'Error logging in pharmacist.' });
  }
};

// Pharmacist Profile
// Method: Get
// Path: /pharmacist-profile
export const pharmacistProfile = async (req, res, next) => {
  try {
    const pharmacistProfile = await Pharmacist.findById(req.currentPharmacist._id);
    if (!pharmacistProfile) {
      return next({ status: 404, message: 'Pharmacist not found.' });
    }
    return res.status(200).json(pharmacistProfile);
  } catch (error) {
    next({ status: 500, message: 'Error fetching pharmacist profile.' });
  }
};

// Get pharmacist notifications
// Method: Get
// /pharmacist-profile/notifications
export const pharmacistNotifications = async (req, res, next) => {
  try {
    const pharmacist = await Pharmacist.findById(req.currentPharmacist._id);
    if (!pharmacist) {
      return next({ status: 404, message: 'Pharmacist not found.' });
    }
    return res.json(pharmacist.notifications);
  } catch (error) {
    next({ status: 500, message: 'Error fetching notifications.' });
  }
};
