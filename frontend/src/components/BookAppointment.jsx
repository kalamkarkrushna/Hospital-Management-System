import { useState, useEffect } from "react";
import { getPatients, getDoctors, bookAppointment } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function BookAppointment() {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "" });
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    getPatients().then(setPatients);
    getDoctors().then(setDoctors);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await bookAppointment(
      parseInt(form.patientId),
      parseInt(form.doctorId),
      form.date
    );
    setMsg(result.message);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="patient">Patient</Label>
            <select id="patient" value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required
              className="h-7 rounded-md border border-input bg-input/20 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.id} - {p.name}</option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="doctor">Doctor</Label>
            <select id="doctor" value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required
              className="h-7 rounded-md border border-input bg-input/20 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
              <option value="">Select a doctor</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.id} - {d.name} ({d.specialization})</option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <Button type="submit">Book Appointment</Button>
        </form>
        {msg && (
          <p className={`mt-4 text-sm font-medium ${msg.toLowerCase().includes("successfully") ? "text-accent" : "text-destructive"}`}>{msg}</p>
        )}
      </CardContent>
    </Card>
  );
}