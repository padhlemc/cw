import React, { useState, useEffect } from 'react';

export default function App() {
  const [tab, setTab] = useState('book'); // 'book', 'appointments', 'doctors'
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({ patientName: '', doctorName: '', date: '', time: '10:00 AM' });

  const loadData = async () => {
    const docRes = await fetch('/api/doctors');
    const docData = await docRes.json();
    setDoctors(docData);
    if (docData.length > 0 && !form.doctorName) {
      setForm(f => ({ ...f, doctorName: docData[0].name }));
    }

    const apptRes = await fetch('/api/appointments');
    setAppointments(await apptRes.json());
  };

  useEffect(() => { loadData(); }, []);

  const handleBook = async (e) => {
    e.preventDefault();
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    alert('Appointment booked!');
    setForm(f => ({ ...f, patientName: '', date: '' }));
    loadData();
    setTab('appointments');
  };

  const handleCancel = async (id) => {
    await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    loadData();
  };

  const handleToggleDoctor = async (id) => {
    await fetch(`/api/doctors/${id}`, { method: 'PUT' });
    loadData();
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'sans-serif', padding: 15 }}>
      <h2>🩺 MediSchedule - Doctor Appointment App (Roll 31-38)</h2>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setTab('book')} style={{ padding: '8px 16px', background: tab === 'book' ? '#2563eb' : '#e2e8f0', color: tab === 'book' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          📅 Book Appointment
        </button>
        <button onClick={() => setTab('appointments')} style={{ padding: '8px 16px', background: tab === 'appointments' ? '#2563eb' : '#e2e8f0', color: tab === 'appointments' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          📋 Appointments ({appointments.length})
        </button>
        <button onClick={() => setTab('doctors')} style={{ padding: '8px 16px', background: tab === 'doctors' ? '#2563eb' : '#e2e8f0', color: tab === 'doctors' ? '#fff' : '#000', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
          👨‍⚕️ Doctor Schedules
        </button>
      </div>

      {/* 1. Book View */}
      {tab === 'book' && (
        <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 450, background: '#f8fafc', padding: 20, borderRadius: 6, border: '1px solid #e2e8f0' }}>
          <h3>Book an Appointment</h3>
          <input placeholder="Patient Full Name" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} required style={{ padding: 8 }} />
          <select value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} style={{ padding: 8 }}>
            {doctors.map(d => (
              <option key={d._id} value={d.name}>
                {d.name} ({d.specialty}) {d.available ? '✅ Available' : '❌ Busy'}
              </option>
            ))}
          </select>
          <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required style={{ padding: 8 }} />
          <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={{ padding: 8 }}>
            <option>10:00 AM</option>
            <option>11:30 AM</option>
            <option>02:00 PM</option>
            <option>04:30 PM</option>
          </select>
          <button type="submit" style={{ padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Confirm Booking
          </button>
        </form>
      )}

      {/* 2. Appointments List */}
      {tab === 'appointments' && (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th>Patient</th><th>Doctor</th><th>Date & Time</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a._id}>
                <td>{a.patientName}</td><td>{a.doctorName}</td><td>{a.date} at {a.time}</td>
                <td>
                  <button onClick={() => handleCancel(a._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer' }}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr><td colSpan="4" style={{ textAlign: 'center' }}>No active appointments.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {/* 3. Doctor Schedules */}
      {tab === 'doctors' && (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th>Doctor Name</th><th>Specialty</th><th>Status</th><th>Toggle Availability</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map(d => (
              <tr key={d._id}>
                <td>{d.name}</td><td>{d.specialty}</td>
                <td>{d.available ? '🟢 Available' : '🔴 Busy / Off Duty'}</td>
                <td>
                  <button onClick={() => handleToggleDoctor(d._id)} style={{ padding: '4px 8px', cursor: 'pointer' }}>
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
