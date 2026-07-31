import { useState, useEffect } from "react";
import { getLabReports, addLabReport, updateLabReport, deleteLabReport, getPatients, getDoctors } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function LabReportList() {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ patientId: "", doctorId: "", testName: "", result: "", notes: "", reportDate: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ patientId: "", doctorId: "", testName: "", result: "", notes: "", reportDate: new Date().toISOString().split("T")[0] });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => Promise.all([getLabReports(), getPatients(), getDoctors()]).then(([r, pat, doc]) => { setItems(r); setPatients(pat); setDoctors(doc); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter((r) => `${r.id} ${r.testName} ${r.result}`.toLowerCase().includes(search.toLowerCase()));

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteLabReport(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Lab report deleted");
    setDeleteId(null); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...addForm, patientId: Number(addForm.patientId), doctorId: Number(addForm.doctorId) };
    const result = await addLabReport(payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Lab report added"); setShowAdd(false); setAddForm({ patientId: "", doctorId: "", testName: "", result: "", notes: "", reportDate: new Date().toISOString().split("T")[0] }); load(); }
  };

  const startEdit = (r) => { setEditId(r.id); setEditForm({ patientId: String(r.patientId), doctorId: String(r.doctorId), testName: r.testName, result: r.result, notes: r.notes || "", reportDate: r.reportDate }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ patientId: "", doctorId: "", testName: "", result: "", notes: "", reportDate: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.testName) payload.testName = editForm.testName;
    if (editForm.result) payload.result = editForm.result;
    if (editForm.notes) payload.notes = editForm.notes;
    if (editForm.reportDate) payload.reportDate = editForm.reportDate;
    const result = await updateLabReport(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Lab report updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Lab Reports</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
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
            <Input placeholder="Test name" value={addForm.testName} onChange={(e) => setAddForm({ ...addForm, testName: e.target.value })} required />
            <Input placeholder="Result" value={addForm.result} onChange={(e) => setAddForm({ ...addForm, result: e.target.value })} required />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ patientId: "", doctorId: "", testName: "", result: "", notes: "", reportDate: new Date().toISOString().split("T")[0] }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Patient</TableHead><TableHead>Test</TableHead><TableHead>Result</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="text-muted-foreground">{r.id}</TableCell>
                {editId === r.id ? (
                  <>
                    <TableCell><select value={editForm.patientId} onChange={(e) => setEditForm({ ...editForm, patientId: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background">{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></TableCell>
                    <TableCell><Input value={editForm.testName} onChange={(e) => setEditForm({ ...editForm, testName: e.target.value })} className="h-6" /></TableCell>
                    <TableCell><Input value={editForm.result} onChange={(e) => setEditForm({ ...editForm, result: e.target.value })} className="h-6" /></TableCell>
                    <TableCell><Input type="date" value={editForm.reportDate} onChange={(e) => setEditForm({ ...editForm, reportDate: e.target.value })} className="h-6 w-32" /></TableCell>
                    <TableCell className="text-right whitespace-nowrap"><Button size="xs" onClick={() => saveEdit(r.id)} className="mr-1">Save</Button><Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{patients.find((p) => p.id === r.patientId)?.name || `#${r.patientId}`}</TableCell>
                    <TableCell>{r.testName}</TableCell>
                    <TableCell className={r.result?.toLowerCase().includes("positive") || r.result?.toLowerCase().includes("abnormal") ? "text-destructive font-medium" : ""}>{r.result}</TableCell>
                    <TableCell className="text-sm">{r.reportDate}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" onClick={() => startEdit(r)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog><DialogTrigger asChild><Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(r.id)}><Trash2 className="w-3 h-3" /></Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Delete Report</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
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
