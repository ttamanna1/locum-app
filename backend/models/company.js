import mongoose from 'mongoose';
import bcrypt from 'mongoose';

//TODO: Configure validation for the company schema

const companySchema = new mongoose.Schema({
  company: { type: String, required: true },
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pharmacies: [{ type: mongoose.ObjectId, ref: 'Pharmacy', required: true}],
});

companySchema.set('toJSON', {
  virtuals: true,
  transform(doc, json){
    delete json.password;
  }
});

export default mongoose.model('Company', companySchema);