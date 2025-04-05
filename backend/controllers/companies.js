import Company from '../models/company.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Company Registration
// Method: Post
// Path: /company-register
export const companyRegister = async (req, res, next) => {
  try {
    const newCompany = await Company.create(req.body);
    return res.status(201).json({ message: `Welcome ${newCompany.username}` });
  } catch (error) {
    next({ status: 400, message: 'Error registering company.' });
  }
};

// Company Login
// Method: Post
// Path: /company-login
export const companyLogin = async (req, res, next) => {
  try {
    const companyLogin = await Company.findOne({ email: req.body.email });
    if (!companyLogin || !bcrypt.compareSync(req.body.password, companyLogin.password)) {
      return next({ status: 401, message: 'Invalid email or password.' });
    }
    const token = jwt.sign({ sub: companyLogin._id }, process.env.JWT_SECRET, { expiresIn: '30d'});
    return res.status(202).json({ message: `Welcome back ${companyLogin.username}`, token });
  } catch (error) {
    next({ status: 500, message: 'Error logging in company.' });
  }
};

// All Companies
// Method: Get
// Path: /companies
export const getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find();
    return res.json(companies);
  } catch (error) {
    next({ status: 500, message: 'Error fetching companies.' })
  }
};

// Company Profile
// Method: Get
// Path: /companies/:companyId
export const companyProfile = async (req, res, next) => {
  try {
    const companyProfile = await Company.findById(req.currentCompany._id);
    if (!companyProfile) {
      return next({ status: 404, message: 'Company not found.' });
    }
    return res.status(200).json(companyProfile);
  } catch (error) {
    next({ status: 500, message: 'Error fetching company profile.' });
  }
};

//Get company notifications
// Method: Get
// Path: /companies/:companyId/notifications
export const companyNotifications = async (req, res, next) => {
  const { companyId } = req.params;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return next({ status: 404, message: 'Company not found.' });
    }
    return res.status(200).json(company.notifications);
  } catch (error) {
    next({ status: 500, message: 'Error fetching notifications.' });
  }
};