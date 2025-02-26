import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

//TODO: Configure validation for the pharmacist schema

const pharmacistSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

pharmacistSchema.set('toJSON', {
  virtuals: true,
  transform(doc, json){
    delete json.password;
  }
});

export default mongoose.model('Pharmacist', pharmacistSchema);