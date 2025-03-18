import Company from '../models/company.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Company Registration
// Method: Post
// Path: /company-register
export const companyRegister = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    return res.status(201).json({ message: `Welcome ${newCompany.username}` });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Company Login
// Method: Post
// Path: /company-login
export const companyLogin = async (req, res) => {
  try {
    const companyLogin = await Company.findOne({ username: req.body.email });
    if (!companyLogin || !bcrypt.compareSync(req.body.password, companyLogin.password)) {
      throw new Error(!companyLogin ? 'Email not found' : 'Password incorrect');
    }
    const token = jwt.sign({ sub: companyLogin._id }, process.env.JWT_SECRET, { expiresIn: '30d'});
    return res.status(202).json({ message: `Welcome back ${companyLogin.username}`, token });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Invalid credentials' });
    
  }
};

// All Companies
// Method: Get
// Path: /companies
export const getAllCompanies = async (req, res) => {
  const companies = await Company.find();
  return res.json(companies);
};

// Company Profile
// Method: Get
// Path: /companies/:companyId
export const companyProfile = async (req, res) => {
  try {
    const companyProfile = await Company.findById(req.currentCompany._id);
    return res.status(200).json(companyProfile);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//Get company notifications
// Method: Get
// Path: /companies/:companyId/notifications
export const companyNotifications = async (req, res) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    return res.status(200).json(company.notifications);
  } catch (error) {
    console.error('Error fetching company notifications.', error);
    return res.status(500).json({ error: 'Error fetching company notifications.' });
  }
};