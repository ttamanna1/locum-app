import mongoose from 'mongoose';

const pharmacySchema = new mongoose.Schema({
  company: { type: mongoose.ObjectId, ref: 'Company', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  requiredServices: [{ type: String, required: true }],
  operatingHours: { type: String, required: true },
});

pharmacySchema.set('toJSON', {
  virtuals: true,
});

export default mongoose.model('Pharmacy', pharmacySchema);