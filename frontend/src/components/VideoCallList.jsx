import { useState, useEffect } from "react";
import { getVideoCalls, addVideoCall, updateVideoCall, deleteVideoCall, getPatients, getDoctors } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus, Video } from "lucide-react";

export default function VideoCallList() {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ patientId: "", doctorId: "", scheduledDate: "", status: "", meetingLink: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ patientId: "", doctorId: "", scheduledDate: "", status: "SCHEDULED", meetingLink: "" });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => Promise.all([getVideoCalls(), getPatients(), getDoctors()]).then(([v, pat, doc]) => { setItems(v); setPatients(pat); setDoctors(doc); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter((v) => `${v.id} ${v.status}`.toLowerCase().includes(search.toLowerCase()));

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteVideoCall(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Video call deleted");
    setDeleteId(null); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...addForm, patientId: Number(addForm.patientId), doctorId: Number(addForm.doctorId) };
    const result = await addVideoCall(payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Video call scheduled"); setShowAdd(false); setAddForm({ patientId: "", doctorId: "", scheduledDate: "", status: "SCHEDULED", meetingLink: "" }); load(); }
  };

  const startEdit = (v) => { setEditId(v.id); setEditForm({ patientId: String(v.patientId), doctorId: String(v.doctorId), scheduledDate: v.scheduledDate, status: v.status, meetingLink: v.meetingLink || "" }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ patientId: "", doctorId: "", scheduledDate: "", status: "", meetingLink: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.scheduledDate) payload.scheduledDate = editForm.scheduledDate;
    if (editForm.status) payload.status = editForm.status;
    if (editForm.meetingLink) payload.meetingLink = editForm.meetingLink;
    const result = await updateVideoCall(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Video call updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Telemedicine - Video Calls</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input aria-label="Search video calls" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Schedule</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div role="status" className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border flex-wrap">
            <select value={addForm.patientId} onChange={(e) => setAddForm({ ...addForm, patientId: e.target.value })} required className="h-9 rounded-md border px-3 text-sm bg-background">
              <option value="">Patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={addForm.doctorId} onChange={(e) => setAddForm({ ...addForm, doctorId: e.target.value })} required className="h-9 rounded-md border px-3 text-sm bg-background">
              <option value="">Doctor</option>
              {doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
            <Input type="datetime-local" value={addForm.scheduledDate} onChange={(e) => setAddForm({ ...addForm, scheduledDate: e.target.value })} required className="w-48" />
            <Input placeholder="Meeting link (optional)" value={addForm.meetingLink} onChange={(e) => setAddForm({ ...addForm, meetingLink: e.target.value })} className="w-48" />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ patientId: "", doctorId: "", scheduledDate: "", status: "SCHEDULED", meetingLink: "" }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Patient</TableHead><TableHead>Doctor</TableHead><TableHead>Scheduled</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="text-muted-foreground">{v.id}</TableCell>
                {editId === v.id ? (
                  <>
                    <TableCell><select value={editForm.patientId} onChange={(e) => setEditForm({ ...editForm, patientId: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background">{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></TableCell>
                    <TableCell><select value={editForm.doctorId} onChange={(e) => setEditForm({ ...editForm, doctorId: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background">{doctors.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select></TableCell>
                    <TableCell><Input type="datetime-local" value={editForm.scheduledDate} onChange={(e) => setEditForm({ ...editForm, scheduledDate: e.target.value })} className="h-6 w-40" /></TableCell>
                    <TableCell><select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background">{["SCHEDULED","COMPLETED","CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}</select></TableCell>
                    <TableCell className="text-right whitespace-nowrap"><Button size="xs" onClick={() => saveEdit(v.id)} className="mr-1">Save</Button><Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{patients.find((p) => p.id === v.patientId)?.name || `#${v.patientId}`}</TableCell>
                    <TableCell>{doctors.find((d) => d.id === v.doctorId)?.name || `#${v.doctorId}`}</TableCell>
                    <TableCell className="text-sm">{v.scheduledDate?.replace("T", " ")}</TableCell>
                    <TableCell><Badge variant={v.status === "COMPLETED" ? "default" : v.status === "CANCELLED" ? "destructive" : "secondary"}>{v.status}</Badge></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {v.meetingLink && <a href={v.meetingLink} target="_blank" rel="noopener noreferrer" aria-label={`Join video call ${v.id}`}><Button size="icon-xs" variant="outline"><Video className="w-3 h-3" /></Button></a>}
                      <Button size="icon-xs" variant="ghost" aria-label={`Edit video call ${v.id}`} onClick={() => startEdit(v)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog><DialogTrigger asChild><Button size="icon-xs" variant="ghost" aria-label={`Delete video call ${v.id}`} onClick={() => setDeleteId(v.id)}><Trash2 className="w-3 h-3" /></Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Delete Video Call</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
                          <DialogFooter><DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose><Button variant="destructive" onClick={handleDelete}>Delete</Button></DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
      </CardContent>
    </Card>
  );
}
