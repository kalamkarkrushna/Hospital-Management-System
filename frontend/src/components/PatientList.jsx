import { useState, useEffect } from "react";
import { getPatients, addPatient, deletePatient, updatePatient } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", age: "", gender: "" });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", age: "", gender: "" });

  const load = () => getPatients().then((data) => { setPatients(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = patients.filter((p) =>
    `${p.id} ${p.name} ${p.gender}`.toLowerCase().includes(search.toLowerCase())
  );

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deletePatient(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Patient deleted");
    setDeleteId(null);
    load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const patient = { name: addForm.name, age: parseInt(addForm.age), gender: addForm.gender };
    const result = await addPatient(patient);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", `Patient added (ID: ${result.id})`); setShowAdd(false); setAddForm({ name: "", age: "", gender: "" }); load(); }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setEditForm({ name: p.name, age: p.age.toString(), gender: p.gender });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({ name: "", age: "", gender: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.name) payload.name = editForm.name;
    if (editForm.age) payload.age = parseInt(editForm.age);
    if (editForm.gender) payload.gender = editForm.gender;
    const result = await updatePatient(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Patient updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Patients</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border flex-wrap items-end">
            <div className="grid gap-1 flex-1 min-w-[140px]">
              <label className="text-xs text-muted-foreground">Name</label>
              <Input placeholder="Full name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
            </div>
            <div className="grid gap-1 w-20">
              <label className="text-xs text-muted-foreground">Age</label>
              <Input placeholder="Age" type="number" value={addForm.age} onChange={(e) => setAddForm({ ...addForm, age: e.target.value })} required />
            </div>
            <div className="grid gap-1 w-28">
              <label className="text-xs text-muted-foreground">Gender</label>
              <select value={addForm.gender} onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })} required
                className="h-7 rounded-md border border-input bg-background px-2 text-sm">
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <Button type="submit" size="sm" className="mt-4 sm:mt-0">Save</Button>
            <Button type="button" variant="outline" size="sm" className="mt-4 sm:mt-0" onClick={() => { setShowAdd(false); setAddForm({ name: "", age: "", gender: "" }); }}>Cancel</Button>
          </form>
        )}
        {filtered.length === 0 ? (
          <p className="text-muted-foreground/50 text-center py-8">{search ? "No matching patients." : "No patients yet."}</p>
        ) : (
          <div className="overflow-x-auto"><Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="text-muted-foreground">{p.id}</TableCell>
                  {editId === p.id ? (
                    <>
                      <TableCell><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-6" /></TableCell>
                      <TableCell><Input value={editForm.age} type="number" onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} className="h-6 w-16" /></TableCell>
                      <TableCell>
                        <select value={editForm.gender} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                          className="h-6 px-1 border border-input rounded text-xs bg-card">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button size="xs" onClick={() => saveEdit(p.id)} className="mr-1">Save</Button>
                        <Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.age}</TableCell>
                      <TableCell><Badge variant="secondary">{p.gender}</Badge></TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        <Button size="icon-xs" variant="ghost" onClick={() => startEdit(p)}><Pencil className="w-3.5 h-3.5" /></Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(p.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Patient</DialogTitle>
                              <DialogDescription>Are you sure you want to delete {p.name}? This cannot be undone.</DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table></div>
        )}
      </CardContent>
    </Card>
  );
}
