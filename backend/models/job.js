import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  pharmacy: { type: mongoose.ObjectId, ref: 'Pharmacy', required: true },
  rate: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  hours: { type: String, required: true },
  owner: { type: mongoose.ObjectId, ref: 'Company', required: true },
  bookedBy: { type: mongoose.ObjectId, ref: 'Pharmacist', default: null },
  previousBookedBy: { type: mongoose.ObjectId, ref: 'Pharmacist', default: null },
});

jobSchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model('Job', jobSchema);