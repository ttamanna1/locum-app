import express from 'express';
import companyRoutes from './companyRoutes.js';
import pharmacistRoutes from './pharmacistRoutes.js';
import jobRoutes from './jobRoutes.js';
import { companyLogin, companyRegister } from '../controllers/companies.js';
import { pharmacistLogin, pharmacistRegister } from '../controllers/pharmacists.js';

const router = express.Router();

// Standalone paths
router.post('/company-register', companyRegister);
router.post('/company-login', companyLogin);
router.post('/pharmacist-register', pharmacistRegister);
router.post('/pharmacist-login', pharmacistLogin);

// Prefixed routes
router.use('/companies', companyRoutes);
router.use('/pharmacist-profile', pharmacistRoutes);
router.use('/jobs', jobRoutes);

export default router;
