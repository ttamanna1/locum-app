import Job from '../models/job.js';
import Company from '../models/company.js';

// Get all jobs
// Method: Get
// Path: /jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ bookedBy: null });
    return res.json(jobs);
  } catch (error) {
    console.error('Error fetching shifts.', error);
    res.status(500).json({ error: 'Error fetching shifts.' });
  }
};

// Get single job
// Method: Get    
// Paths: /jobs/:jobId 
export const getSingleJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, bookedBy: null });
    if (!job) {
      return res.status(404).json({ error: 'Shift not found.' });
    }
    return res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching shift.', error);
    res.status(500).json({ error: 'Error fetching shift.' });
  }
};

// Get jobs for specific company
// Method: Get
// Path: /companies/:companyId/jobs
export const getAllCompanyJobs = async (req, res) => {
  const { companyId } = req.params;
  try {
    const jobs = await Job.find({ owner: companyId, bookedBy: null });
    return res.json(jobs);
  } catch (error) {
    console.error('Error fetching shifts.', error);
    res.status(500).json({ error: 'Error fetching shifts.' });
  }
};

// Get single job for a specific company
// Method: Get    
// Path: /companies/:companyId/jobs/:jobId
export const getSingleCompanyJob = async (req, res) => {
  const { jobId, companyId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, owner: companyId, bookedBy: null });
    if (!job) {
      return res.status(404).json({ error: 'Shift not found or does not belong to this company.' });
    }
    return res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching shift.', error);
    res.status(500).json({ error: 'Error fetching shift.' });
  }
};

// Create
// Method: Post
// Path: /companies/:companyId/jobs and /jobs
export const createJob = async (req, res) => {
  try {
    req.body.owner = req.currentCompany._id;
    const jobToCreate = await Job.create(req.body);
    return res.status(201).json(jobToCreate);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Update
// Method: Put
// Path: /companies/:companyId/jobs/:jobId and /jobs/:jobId
export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    if (!jobToUpdate.owner.equals(req.currentCompany._id)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!jobToUpdate) {
      return res.status(404).json({ error: 'shift not found.' });
    }
    const jobToUpdate = await Job.findByIdAndUpdate(jobId, req.body, { new: true });
    return res.json(jobToUpdate);
  } catch (error) {
    console.error('Error updating shift', error);
    res.status(500).json({ error: 'Error updating shift.' });
  }
};

// Delete 
// Method: Delete
// Path: /companies/:companyId/jobs/:jobId and /jobs/:jobId
export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobToDelete = await Job.findByIdAndDelete({ _id: jobId, owner: req.currentCompany._id });
    if (!jobToDelete) {
      return res.status(400).json({ error: 'Shift not found.' });
    }
    return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

// Get booked jobs for specific company
// Method: Get
// Path: /companies/:companyId/jobs/booked
export const getBookedJobsForCompany = async (req, res) => {
  const { companyId } = req.params;
  try {
    const jobs = await Job.find({ owner: companyId, bookedBy: { $ne: null } }); // $ne: not equal to null
    return res.json(jobs);
  } catch (error) {
    console.error('Error fetching shifts.', error);
    res.status(500).json({ error: 'Error fetching shifts.' });
  }
};

// Book job
// Method: Post
// Path: /pharmacist-profile/jobs
export const bookJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Shift not found.' });
    }
    if (job.bookedBy) {
      return res.status(400).json({ error: 'Shift already booked.' });
    }
    job.bookedBy = req.pharmacist._id;
    await job.save();
    return res.json(job);
  } catch (error) {
    console.error('Error booking shift.', error);
    res.status(500).json({ error: 'Error booking shift.' });
  }
};

// Get pharmacist booked jobs
// Method: Get
// Path: /pharmacist-profile/jobs
export const getPharmacistJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ bookedBy: req.currentPharmacist._id });
    return res.json(jobs);
  } catch (error) {
    console.error('Error fetching shifts.', error);
    res.status(500).json({ error: 'Error fetching shifts.' });
  }
};

// Get single booked job
// Method: Get  
// Path: /pharmacist-profile/jobs/:jobId
export const getSinglePharmacistJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, bookedBy: req.currentPharmacist._id });
    if (!job) {
      return res.status(404).json({ error: 'Shift not found or booked by another pharmacist.' });
    }
    return res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching shift.', error);
    return res.status(500).json({ error: 'Error fetching shift.' });
  }
};

// Cancel booked job
// Method: Post
// Path: /pharmacist-profile/jobs/:jobId/cancelled
export const cancelJob = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findOne({ _id: jobId, bookedBy: req.currentPharmacist._id });
    if (!job) {
      return res.status(404).json({ error: 'Shift not found or booked by another pharmacist.' });
    }
    //Find company to notify cancellation
    const company = await Company.findById(job.owner);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
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
    console.error('Error cancelling shift.', error);
    return res.status(500).json({ error: 'Error cancelling shift' });
  }
};

// Get cancelled jobs 
// Method: Get
// Path: /pharmacist-profile/jobs/cancelled
export const getCancelledJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ previousBookedBy: req.currentPharmacist._id, bookedBy: null });
    return res.json(jobs);
  } catch (error) {
    console.error('Error fetching shifts.', error);
    res.status(500).json({ error: 'Error fetching shifts.'});
  }
};