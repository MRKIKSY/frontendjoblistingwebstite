require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Job = require('./models/Job'); // Import the Job model

// Create Express app
const app = express();
app.use(bodyParser.json());
app.use(cors({
  origin: ["https://frontendjoblistingwebstite.onrender.com", "https://backendjoblistingwebsite.onrender.com"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(helmet());
app.use(morgan('combined'));

// Routes
app.post('/api/jobs', async (req, res) => {
  console.log('Received POST request:', req.body);
  try {
    const newJob = new Job(req.body);
    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Error saving job:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error.message || error);
    res.status(500).json({ error: error.message || 'Error deleting job' });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error.message || error);
    res.status(500).json({ error: error.message || 'Error updating job' });
  }
});

app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error.message || error);
    res.status(500).json({ error: error.message || 'Error fetching jobs' });
  }
});

app.get('/api/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error.message || error);
    res.status(500).json({ error: error.message || 'Error fetching job' });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 8000, () => { // Use PORT environment variable or default to 8000
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });
