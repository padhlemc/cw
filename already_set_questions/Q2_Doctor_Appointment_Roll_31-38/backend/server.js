const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5002;
const DB_NAME = 'doctor_appointments';

app.use(cors());
app.use(express.json());

const distPath = path.join(__dirname, '..', 'frontend', 'dist');
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(distPath));
app.use(express.static(frontendPath));

let memoryDoctors = [
  { _id: '1', name: 'Dr. Sharma', spec: 'Cardiology', available: true },
  { _id: '2', name: 'Dr. Patel', spec: 'Dermatology', available: true },
  { _id: '3', name: 'Dr. Rao', spec: 'Pediatrics', available: false }
];
let memoryAppointments = [
  { _id: '1', patientName: 'John Doe', doctorName: 'Dr. Sharma', date: '2026-10-15', time: '10:00 AM' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017', { serverSelectionTimeoutMS: 1500 });
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('doctors').countDocuments() === 0) {
      await db.collection('doctors').insertMany(memoryDoctors);
      await db.collection('appointments').insertMany(memoryAppointments);
    }
  })
  .catch(() => console.log('[MongoDB Offline] Running in memory mode'));

// GET Doctors
app.get('/api/doctors', async (req, res) => {
  if (db) return res.json(await db.collection('doctors').find().toArray());
  res.json(memoryDoctors);
});

// Toggle Doctor availability
app.put('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const doc = await db.collection('doctors').findOne({ _id: new ObjectId(id) });
    if (doc) await db.collection('doctors').updateOne({ _id: new ObjectId(id) }, { $set: { available: !doc.available } });
  } else {
    memoryDoctors = memoryDoctors.map(d => d._id === id ? { ...d, available: !d.available } : d);
  }
  res.json({ message: 'Doctor availability updated' });
});

// GET Appointments
app.get('/api/appointments', async (req, res) => {
  if (db) return res.json(await db.collection('appointments').find().toArray());
  res.json(memoryAppointments);
});

// POST Appointment
app.post('/api/appointments', async (req, res) => {
  const newAppt = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('appointments').insertOne(newAppt);
  else memoryAppointments.push(newAppt);
  res.status(201).json(newAppt);
});

// DELETE Appointment
app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const query = ObjectId.isValid(id) && String(new ObjectId(id)) === id ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] } : { _id: id };
    await db.collection('appointments').deleteOne(query);
  } else {
    memoryAppointments = memoryAppointments.filter(a => String(a._id) !== String(id));
  }
  res.json({ message: 'Appointment cancelled' });
});

// SPA wildcard fallback
app.get('*', (req, res) => {
  const fs = require('fs');
  const indexDist = path.join(distPath, 'index.html');
  const indexDev = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexDist)) return res.sendFile(indexDist);
  if (fs.existsSync(indexDev)) return res.sendFile(indexDev);
  res.send('<!DOCTYPE html><html><body><div id="root">Ready</div></body></html>');
});

app.listen(PORT, () => console.log(`Q2 Doctor Appointments Server running on http://localhost:${PORT}`));
