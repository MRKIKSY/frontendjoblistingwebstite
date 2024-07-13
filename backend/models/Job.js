const mongoose = require('mongoose');
const { Schema } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true }
});

const jobSchema = new Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  salary: { type: Number, required: true }, // Change this to Number
  company: { type: companySchema, required: true }
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
