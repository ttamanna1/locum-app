import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const pharmacistSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  GPhCNumber: { type: Number, required: true, unique: true },
  notifications: [{ type: String }],
  profileImage: { type: String },
  documents: [{ type: String }],
  address: { type: String, required: true },
});

pharmacistSchema.set('toJSON', {
  virtuals: true,
  transform(doc, json){
    delete json.password;
  }
});

pharmacistSchema
  .virtual('passwordConfirmation')
  .set(function(value){
    this._passwordConfirmation = value;
  });

pharmacistSchema.pre('validate', async function(next){
  if(this.isModified('password') && this._password !== this.passwordConfirmation){
    this.invalidate('passwordConfirmation', 'Passwords do not match');
  };

  const existingEmail = await this.constructor.findOne({ email: this.email })
  if (existingEmail && existingEmail._id.toString() !== this._id.toString()){
    this.invalidate('email', 'Email already exists');
  };

  next();
});

pharmacistSchema.pre('save', function(next){
  if(this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(12));
  }
  next();
});

export default mongoose.model('Pharmacist', pharmacistSchema);