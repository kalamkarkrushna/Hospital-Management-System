import { useState, useEffect } from "react";
import { getAppointments, getPatients, getDoctors, bookAppointment, cancelAppointment, rescheduleAppointment } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Trash2, Calendar, Plus } from "lucide-react";

export default function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patientMap, setPatientMap] = useState({});
  const [doctorMap, setDoctorMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [reschedId, setReschedId] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [msg, setMsg] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ patientId: "", doctorId: "", date: "" });

  const load = () => {
    setLoading(true);
    Promise.all([getAppointments(), getPatients(), getDoctors()]).then(
      ([apps, pats, docs]) => {
        setAppointments(apps);
        setPatients(pats);
        setDoctors(docs);
        setPatientMap(Object.fromEntries(pats.map((p) => [p.id, p.name])));
        setDoctorMap(Object.fromEntries(docs.map((d) => [d.id, d.name])));
        setLoading(false);
      }
    );
  };
  useEffect(() => { load(); }, []);

  const filtered = appointments.filter((a) =>
    `${a.id} ${patientMap[a.patientId] || ""} ${doctorMap[a.doctorId] || ""} ${a.appointmentDate}`.toLowerCase().includes(search.toLowerCase())
  );

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleCancel = async () => {
    if (!cancelId) return;
    const result = await cancelAppointment(cancelId);
    if (result.error) showMsg("error", result.error); else showMsg("success", result.message || "Cancelled");
    setCancelId(null);
    load();
  };

  const startResched = (a) => { setReschedId(a.id); setNewDate(a.appointmentDate); };
  const handleResched = async (id) => {
    if (!newDate) return;
    const result = await rescheduleAppointment(id, newDate);
    if (result.error) showMsg("error", result.error); else showMsg("success", result.message || "Rescheduled");
    setReschedId(null); setNewDate(""); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const result = await bookAppointment(parseInt(addForm.patientId), parseInt(addForm.doctorId), addForm.date);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", result.message || "Appointment booked"); setShowAdd(false); setAddForm({ patientId: "", doctorId: "", date: "" }); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Appointments</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input aria-label="Search appointments" placeholder="Search appointments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Book</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div role="status" className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border flex-wrap items-end">
            <div className="grid gap-1 flex-1 min-w-[160px]">
              <label htmlFor="addApptPatient" className="text-xs text-muted-foreground">Patient</label>
              <select id="addApptPatient" value={addForm.patientId} onChange={(e) => setAddForm({ ...addForm, patientId: e.target.value })} required
                className="h-7 rounded-md border border-input bg-background px-2 text-sm">
                <option value="">Select patient</option>
                {patients.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
              </select>
            </div>
            <div className="grid gap-1 flex-1 min-w-[160px]">
              <label htmlFor="addApptDoctor" className="text-xs text-muted-foreground">Doctor</label>
              <select id="addApptDoctor" value={addForm.doctorId} onChange={(e) => setAddForm({ ...addForm, doctorId: e.target.value })} required
                className="h-7 rounded-md border border-input bg-background px-2 text-sm">
                <option value="">Select doctor</option>
                {doctors.map((d) => (<option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>))}
              </select>
            </div>
            <div className="grid gap-1 w-36">
              <label htmlFor="addApptDate" className="text-xs text-muted-foreground">Date</label>
              <Input id="addApptDate" type="date" value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} required />
            </div>
            <Button type="submit" size="sm" className="mt-4 sm:mt-0">Book</Button>
            <Button type="button" variant="outline" size="sm" className="mt-4 sm:mt-0" onClick={() => { setShowAdd(false); setAddForm({ patientId: "", doctorId: "", date: "" }); }}>Cancel</Button>
          </form>
        )}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground/50 text-center py-8">{search ? "No matching appointments." : "No appointments booked yet."}</p>
        ) : (
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="text-muted-foreground">{a.id}</TableCell>
                  <TableCell className="font-medium">{patientMap[a.patientId] || `Patient #${a.patientId}`}</TableCell>
                  <TableCell>{doctorMap[a.doctorId] || `Doctor #${a.doctorId}`}</TableCell>
                  <TableCell>
                    {reschedId === a.id ? (
                      <div className="flex items-center gap-1">
                        <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="h-6 w-32" />
                        <Button size="xs" onClick={() => handleResched(a.id)} className="mr-1">Save</Button>
                        <Button size="xs" variant="outline" onClick={() => { setReschedId(null); setNewDate(""); }}>X</Button>
                      </div>
                    ) : (
                      <Badge variant="secondary">{a.appointmentDate}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {reschedId !== a.id && (
                      <>
                        <Button size="icon-xs" variant="ghost" aria-label={`Reschedule appointment ${a.id}`} onClick={() => startResched(a)}><Calendar className="w-3 h-3" /></Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon-xs" variant="ghost" aria-label={`Cancel appointment ${a.id}`} onClick={() => setCancelId(a.id)}><Trash2 className="w-3 h-3" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Cancel Appointment</DialogTitle>
                              <DialogDescription>Are you sure you want to cancel this appointment? This cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild><Button variant="outline">Keep</Button></DialogClose>
                              <Button variant="destructive" onClick={handleCancel}>Cancel Appointment</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </CardContent>
    </Card>
  );
}
