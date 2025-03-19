import express from 'express';
import { 
  pharmacistNotifications, 
  pharmacistProfile, 
} from '../controllers/pharmacists.js';
import { securePharmacistRoute } from '../config/secureRoutes.js';
import { 
  bookJob, 
  cancelJob, 
  getCancelledJobs, 
  getPharmacistJobs, 
  getSinglePharmacistJob 
} from '../controllers/jobs.js';

const router = express.Router();

router.route('/') 
  .get(securePharmacistRoute, pharmacistProfile);

router.route('/notifications')
  .get(securePharmacistRoute, pharmacistNotifications);

router.route('/jobs')
  .get(securePharmacistRoute, getPharmacistJobs)
  .post(securePharmacistRoute, bookJob);

router.route('/jobs/:jobId')
  .get(securePharmacistRoute, getSinglePharmacistJob);

router.route('/jobs/:jobId/cancelled')
  .get(securePharmacistRoute, getCancelledJobs)
  .post(securePharmacistRoute, cancelJob);

export default router;
