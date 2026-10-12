import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './style.css';

function AppointmentsView({ appointments, doctors, onCancel, onToggleDoctor }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3>Scheduled Appointments ({appointments.length})</h3>
          <button onClick={() => navigate('/book')} className="btn btn-primary">
            Book New Appointment
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>PATIENT</th><th>DOCTOR</th><th>DATE</th><th>TIME</th><th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id}>
                <td>{a.patientName}</td><td>{a.doctorName}</td><td>{a.date}</td><td>{a.time}</td>
                <td>
                  <button onClick={() => onCancel(a._id)} className="btn btn-danger btn-sm">
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>No appointments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Doctor Availability</h3>
        <table className="table">
          <thead>
            <tr>
              <th>DOCTOR</th><th>SPECIALIZATION</th><th>STATUS</th><th>TOGGLE</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td><td>{d.spec}</td>
                <td>
                  <span className={`badge ${d.available ? 'badge-good' : 'badge-warn'}`}>
                    {d.available ? 'Available' : 'Busy'}
                  </span>
                </td>
                <td>
                  <button onClick={() => onToggleDoctor(d._id)} className="btn btn-secondary btn-sm">
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BookView({ doctors, onBook }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: '',
    doctorName: doctors[0]?.name || '',
    date: '',
    time: '10:00 AM'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook(form);
    navigate('/');
  };

  return (
    <div className="card">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Patient Full Name:</label>
          <input
            required
            placeholder="Enter patient name"
            value={form.patientName}
            onChange={e => setForm({ ...form, patientName: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Select Doctor:</label>
          <select value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })}>
            {doctors.map(d => (
              <option key={d._id} value={d.name}>
                {d.name} ({d.spec})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Appointment Date:</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Time Slot:</label>
          <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
            <option>10:00 AM</option>
            <option>11:30 AM</option>
            <option>02:00 PM</option>
            <option>04:00 PM</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
          <button type="submit" className="btn btn-primary">Confirm Booking</button>
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const loadData = async () => {
    const docRes = await fetch('/api/doctors');
    setDoctors(await docRes.json());
    const apptRes = await fetch('/api/appointments');
    setAppointments(await apptRes.json());
  };

  useEffect(() => { loadData(); }, []);

  const handleBook = async (formData) => {
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    alert('Appointment booked successfully');
    loadData();
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleToggleDoctor = async (id) => {
    await fetch(`/api/doctors/${id}`, { method: 'PUT' });
    loadData();
  };

  return (
    <Router>
      <div className="container">
        <header className="header">
          <h1>MediSchedule - Doctor Appointment App (Roll 31-38)</h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Appointments</Link>
            <Link to="/book" className="nav-link">Book Now</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route
              path="/"
              element={
                <AppointmentsView
                  appointments={appointments}
                  doctors={doctors}
                  onCancel={handleCancel}
                  onToggleDoctor={handleToggleDoctor}
                />
              }
            />
            <Route
              path="/book"
              element={<BookView doctors={doctors} onBook={handleBook} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
