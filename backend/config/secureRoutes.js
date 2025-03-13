import jwt from 'jsonwebtoken';
import Company from '../models/company.js';
import Pharmacist from '../models/pharmacist.js';

export default async function securePharmacistRoute(req, res, next) {
  try {
    if (!req.headers.authorization) throw new Error('Missing Headers');
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const pharmacistToVerify = await Pharmacist.findById(payload.sub);
    if (!pharmacistToVerify) throw new Error('Pharmacist not found');
    req.currentPharmacist = pharmacistToVerify;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default async function secureCompanyRoute(req, res, next) {
  try {
    if (!req.headers.authorization) throw new Error('Missing Headers');
    const token = req.headers.authorization.replace('Bearer ', '');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const companyToVerify = await Company.findById(payload.sub);
    if (!companyToVerify) throw new Error('Company not found');
    req.currentCompany = companyToVerify;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};