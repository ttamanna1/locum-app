import Job from '../models/job.js';
import Company from '../models/company.js';

// Get all jobs
// Method: Get
// Path: /jobs
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ bookedBy: null });
    return res.json(jobs);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Get single job
// Method: Get    
// Paths: /jobs/:jobId 
export const getSingleJob = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, bookedBy: null });
    if (!job) {
      return next({ status: 404, message: 'Shift not found.' });
    }
    return res.status(200).json(job);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Get jobs for specific company
// Method: Get
// Path: /companies/:companyId/jobs
export const getAllCompanyJobs = async (req, res, next) => {
  const { companyId } = req.params;
  try {
    const jobs = await Job.find({ owner: companyId, bookedBy: null });
    if (jobs.length === 0) {
      return next({ status: 404, message: 'No shifts.' });
    }
    return res.json(jobs);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Get single job for a specific company
// Method: Get    
// Path: /companies/:companyId/jobs/:jobId
export const getSingleCompanyJob = async (req, res, next) => {
  const { jobId, companyId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, owner: companyId, bookedBy: null });
    if (!job) {
      return next({ status: 404, message: 'Shift not found or does not belong to this company.' });
    }
    return res.status(200).json(job);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Create
// Method: Post
// Path: /companies/:companyId/jobs and /jobs
export const createJob = async (req, res, next) => {
  try {
    req.body.owner = req.currentCompany._id;
    const jobToCreate = await Job.create(req.body);
    return res.status(201).json(jobToCreate);
  } catch (error) {
    next({ status: 400, message: 'Error creating shift.' });
  }
};

// Update
// Method: Put
// Path: /companies/:companyId/jobs/:jobId and /jobs/:jobId
export const updateJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const jobToUpdate = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
    if (!jobToUpdate) {
      return next({ status: 404, message: 'Shift not found.' });
    }
    if (!jobToUpdate.owner.equals(req.currentCompany._id)) {
      return next({ status: 401, message: 'Unauthorized' });
    }
    return res.json(jobToUpdate);
  } catch (error) {
    next({ status: 500, message: 'Error updating shift.' });
  }
};

// Delete 
// Method: Delete
// Path: /companies/:companyId/jobs/:jobId and /jobs/:jobId
export const deleteJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const jobToDelete = await Job.findOneAndDelete({ _id: jobId, owner: req.currentCompany._id });
    if (!jobToDelete) {
      return next({ status: 400, message: 'Shift not found.' });
    }
    return res.sendStatus(204);
  } catch (error) {
    next({ status: 400, message: 'Error deleting shift.' });
  }
};

// Get booked jobs for specific company
// Method: Get
// Path: /companies/:companyId/jobs/booked
export const getBookedJobsForCompany = async (req, res, next) => {
  const { companyId } = req.params;
  try {
    const jobs = await Job.find({ owner: companyId, bookedBy: { $ne: null } }); // $ne: not equal to null
    if (jobs.length === 0) {
      return next({ status: 404, message: 'No shifts booked.' });
    };
    return res.json(jobs);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Book job
// Method: Post
// Path: /pharmacist-profile/jobs
export const bookJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return next({ status: 404, message: 'Shift not found.' });
    }
    if (job.bookedBy) {
      return next({ status: 400, message: 'Shift already booked.' });
    }
    job.bookedBy = req.currentPharmacist._id;
    await job.save();
    return res.json(job);
  } catch (error) {
    next({ status: 500, message: 'Error booking shift.' });
  }
};

// Get pharmacist booked jobs
// Method: Get
// Path: /pharmacist-profile/jobs
export const getPharmacistJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ bookedBy: req.currentPharmacist._id });
    if (!jobs || jobs.length === 0) {
      return next({ status: 404, message: 'No shifts booked.' });
    };
    return res.json(jobs);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Get single booked job
// Method: Get  
// Path: /pharmacist-profile/jobs/:jobId
export const getSinglePharmacistJob = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, bookedBy: req.currentPharmacist._id });
    if (!job) {
      return next({ status: 404, message: 'Shift not found or booked by another pharmacist.' });
    }
    return res.status(200).json(job);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};

// Cancel booked job
// Method: Post
// Path: /pharmacist-profile/jobs/:jobId/cancelled
export const cancelJob = async (req, res, next) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, bookedBy: req.currentPharmacist._id });
    if (!job) {
      return next({ status: 404, message: 'Shift not found or booked by another pharmacist.' });
    }
    //Find company to notify cancellation
    const company = await Company.findById(job.owner);
    if (!company) {
      return next({ status: 404, message: 'Company not found.' });
    }
    //Add notification to company
    const notification = `Shift ${job.pharmacy}, ${jobId} on ${job.date} has been cancelled by ${req.currentPharmacist.name}.`;
    company.notifications.push(notification);
    await company.save();
    // Cancel job
    job.previousBookedBy = job.bookedBy;
    job.bookedBy = null;
    await job.save();
    return res.status(200).json({ message: 'Shift cancelled successfully.' });
  } catch (error) {
    next({ status: 500, message: 'Error cancelling shift.' });
  }
};

// Get cancelled jobs 
// Method: Get
// Path: /pharmacist-profile/jobs/cancelled
export const getCancelledJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ previousBookedBy: req.currentPharmacist._id, bookedBy: null });
    if (jobs.length === 0) {
      return next({ status: 404, message: 'No shifts cancelled.' });
    };
    return res.json(jobs);
  } catch (error) {
    next({ status: 500, message: 'Error fetching shifts.' });
  }
};