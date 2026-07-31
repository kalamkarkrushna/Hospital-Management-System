import { useState, useEffect } from "react";
import { getDoctors, addDoctor, updateDoctor, deleteDoctor } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", specialization: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", specialization: "" });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => getDoctors().then((data) => { setDoctors(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = doctors.filter((d) =>
    `${d.id} ${d.name} ${d.specialization}`.toLowerCase().includes(search.toLowerCase())
  );

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteDoctor(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Doctor deleted");
    setDeleteId(null);
    load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name || !addForm.specialization) return;
    const result = await addDoctor(addForm);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Doctor added"); setShowAdd(false); setAddForm({ name: "", specialization: "" }); load(); }
  };

  const startEdit = (d) => { setEditId(d.id); setEditForm({ name: d.name, specialization: d.specialization }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ name: "", specialization: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.name) payload.name = editForm.name;
    if (editForm.specialization) payload.specialization = editForm.specialization;
    const result = await updateDoctor(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Doctor updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Doctors</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input aria-label="Search doctors" placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div role="status" className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border border-border">
            <Input placeholder="Doctor name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
            <Input placeholder="Specialization" value={addForm.specialization} onChange={(e) => setAddForm({ ...addForm, specialization: e.target.value })} required />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ name: "", specialization: "" }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="text-muted-foreground">{d.id}</TableCell>
                {editId === d.id ? (
                  <>
                    <TableCell><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-6" /></TableCell>
                    <TableCell><Input value={editForm.specialization} onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })} className="h-6" /></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="xs" onClick={() => saveEdit(d.id)} className="mr-1">Save</Button>
                      <Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{d.name}</TableCell>
                    <TableCell><Badge variant="secondary">{d.specialization}</Badge></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" aria-label={`Edit doctor ${d.name}`} onClick={() => startEdit(d)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog>
                        <DialogTrigger asChild>
                            <Button size="icon-xs" variant="ghost" aria-label={`Delete doctor ${d.name}`} onClick={() => setDeleteId(d.id)}><Trash2 className="w-3 h-3" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete Doctor</DialogTitle>
                            <DialogDescription>Are you sure you want to delete {d.name}? This cannot be undone.</DialogDescription>
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
      </CardContent>
    </Card>
  );
}