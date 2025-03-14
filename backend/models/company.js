import mongoose from 'mongoose';
import bcrypt from 'mongoose';

const companySchema = new mongoose.Schema({
  company: { type: String, required: true },
  username: { type: String, required: true, unique: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pharmacies: [{ type: mongoose.ObjectId, ref: 'Pharmacy', required: true}],
  notifications: [{ type: String }],
});

companySchema.set('toJSON', {
  virtuals: true,
  transform(doc, json){
    delete json.password;
  }
});

companySchema.virtual('jobsCreated', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'owner',
});

companySchema
  .virtual('passwordConfirmation')
  .set(function(value){
    this._passwordConfirmation = value;
  });

companySchema.pre('validate', async function(next){
  if(this.isModified('password') && this._password !== this.passwordConfirmation){
    this.invalidate('passwordConfirmation', 'Passwords do not match');
  };

  const existingUsername = await this.constructor.findOne({ username: this.username })
  if (existingUsername && existingUsername._id.toString() !== this._id.toString()){
    this.invalidate('username', 'Username already exists');
  };

  const existingEmail = await this.constructor.findOne({ email: this.email })
  if (existingEmail && existingEmail._id.toString() !== this._id.toString()){
    this.invalidate('email', 'Email already exists');
  };

  next();
});

companySchema.pre('save', function(next){
  if(this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(12));
  }
  next();
});

export default mongoose.model('Company', companySchema);