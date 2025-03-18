import express from 'express';
import { 
  companyNotifications, 
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
  updateJob 
} from '../controllers/jobs.js';

const router = express.Router();

router.route('/')
  .get(getAllCompanies);

router.route('/:companyId')
  .get(secureCompanyRoute, companyProfile);

router.route('/:companyId/notifications')
  .get(secureCompanyRoute, companyNotifications);

router.route('/:companyId/jobs')
  .get(getAllCompanyJobs)
  .post(secureCompanyRoute, createJob);

router.route('/:companyId/jobs/:jobId')
  .get(getSingleCompanyJob)
  .put(secureCompanyRoute, updateJob)
  .delete(secureCompanyRoute, deleteJob);

router.route('/:companyId/jobs/booked')
  .get(secureCompanyRoute, getBookedJobsForCompany);

export default router;
