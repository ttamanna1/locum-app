import express from 'express';
import { 
  companyNotifications, 
  companyRegister, 
  companyLogin, 
  getAllCompanies, 
  companyProfile 
} from '../controllers/companies.js';
import { secureCompanyRoute } from '../config/secureRoutes.js';
import { 
  createJob, 
  deleteJob, 
  getAllCompanyJobs, 
  getBookedJobsForCompany, 
  getSingleCompanyJob, 
  updateJob } from '../controllers/jobs.js';

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

router.route('/companies/:companyId/jobs')
  .get(getAllCompanyJobs)
  .post(secureCompanyRoute, createJob);

router.route('/companies/:companyId/jobs/:jobId')
  .get(getSingleCompanyJob)
  .put(secureCompanyRoute, updateJob)
  .delete(secureCompanyRoute, deleteJob);

router.route('/companies/:companyId/jobs/booked')
  .get(secureCompanyRoute, getBookedJobsForCompany);

export default router;
