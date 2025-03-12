import Company from '../models/company';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Company Registration
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

// Company Profile
// Method: Get
// Path: /companies/:companyId
export const companyProfile = async (req, res) => {
  try {
    const companyProfile = await Company.findById(req.params.companyId);
    return res.status(200).json(companyProfile);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};