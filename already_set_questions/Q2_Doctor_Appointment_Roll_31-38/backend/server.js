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
app.use(express.static(distPath));
app.use(express.static(path.join(__dirname, '..', 'frontend')));

let memoryDoctors = [
  { _id: '1', name: 'Dr. Sarah Smith', specialty: 'Cardiology', available: true },
  { _id: '2', name: 'Dr. John Adams', specialty: 'Dermatology', available: true },
  { _id: '3', name: 'Dr. Emily Lee', specialty: 'Pediatrics', available: false }
];
let memoryAppointments = [
  { _id: '101', patientName: 'Rahul Verma', doctorName: 'Dr. Sarah Smith', date: '2026-10-15', time: '10:00 AM' }
];

let db = null;
const client = new MongoClient('mongodb://127.0.0.1:27017');
client.connect()
  .then(async () => {
    db = client.db(DB_NAME);
    console.log(`[MongoDB] Connected to ${DB_NAME}`);
    if (await db.collection('doctors').countDocuments() === 0) {
      await db.collection('doctors').insertMany(memoryDoctors);
    }
  })
  .catch(() => console.log('[MongoDB] Offline - Using memory'));

// 1. GET Doctors
app.get('/api/doctors', async (req, res) => {
  if (db) return res.json(await db.collection('doctors').find().toArray());
  res.json(memoryDoctors);
});

// 2. TOGGLE Doctor Availability
app.put('/api/doctors/:id', async (req, res) => {
  const { id } = req.params;
  if (db) {
    const doc = await db.collection('doctors').findOne({ _id: id });
    const newStatus = !(doc && doc.available);
    await db.collection('doctors').updateOne({ _id: id }, { $set: { available: newStatus } });
    return res.json({ available: newStatus });
  }
  memoryDoctors = memoryDoctors.map(d => d._id === id ? { ...d, available: !d.available } : d);
  res.json({ message: 'Toggled' });
});

// 3. GET Appointments
app.get('/api/appointments', async (req, res) => {
  if (db) return res.json(await db.collection('appointments').find().toArray());
  res.json(memoryAppointments);
});

// 4. BOOK Appointment
app.post('/api/appointments', async (req, res) => {
  const appt = { ...req.body, _id: new ObjectId().toString() };
  if (db) await db.collection('appointments').insertOne(appt);
  else memoryAppointments.push(appt);
  res.status(201).json(appt);
});

// 5. CANCEL Appointment
app.delete('/api/appointments/:id', async (req, res) => {
  const { id } = req.params;
  if (db) await db.collection('appointments').deleteOne({ _id: id });
  else memoryAppointments = memoryAppointments.filter(a => a._id !== id);
  res.json({ message: 'Cancelled' });
});

app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
