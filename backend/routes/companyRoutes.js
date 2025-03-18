import express from 'express';
import { 
  companyNotifications, 
  companyRegister, 
  companyLogin, 
  getAllCompanies, 
  companyProfile } from '../controllers/companies.js';
import { secureCompanyRoute } from '../config/secureRoutes.js';

const router = express.Router();

router.route('/company-register')
  .post(companyRegister);

router.route('/company-login')
  .post(companyLogin);

router.route('/companies')
  .get(getAllCompanies);

router.route('/companies/:companyId')
  .get(secureCompanyRoute, companyProfile);

router.route('/companies/:companyId/notifications')
  .get(secureCompanyRoute, companyNotifications);

export default router;
