import express from 'express';
import { 
  createJob,
  deleteJob,
  getAllJobs, 
  getSingleJob, 
  updateJob 
} from '../controllers/jobs.js';
import { secureCompanyRoute } from '../config/secureRoutes.js';

const router = express.Router();

router.route('/')
  .get(getAllJobs)
  .post(secureCompanyRoute, createJob);

router.route('/:jobId')
  .get(getSingleJob)
  .put(secureCompanyRoute, updateJob)
  .delete(secureCompanyRoute, deleteJob);

export default router;