import { useState, useEffect } from "react";
import { getShifts, addShift, updateShift, deleteShift, getUsers } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function ShiftList() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ userId: "", date: "", startTime: "", endTime: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ userId: "", date: "", startTime: "", endTime: "" });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => Promise.all([getShifts(), getUsers()]).then(([s, u]) => { setItems(s); setUsers(u); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter((s) => `${s.id} ${s.date}`.includes(search));

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteShift(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Shift deleted");
    setDeleteId(null); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...addForm, userId: Number(addForm.userId) };
    const result = await addShift(payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Shift added"); setShowAdd(false); setAddForm({ userId: "", date: "", startTime: "", endTime: "" }); load(); }
  };

  const startEdit = (s) => { setEditId(s.id); setEditForm({ userId: String(s.userId), date: s.date, startTime: s.startTime, endTime: s.endTime }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ userId: "", date: "", startTime: "", endTime: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.date) payload.date = editForm.date;
    if (editForm.startTime) payload.startTime = editForm.startTime;
    if (editForm.endTime) payload.endTime = editForm.endTime;
    const result = await updateShift(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Shift updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Staff Scheduling</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search shifts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border flex-wrap">
            <select value={addForm.userId} onChange={(e) => setAddForm({ ...addForm, userId: e.target.value })} required className="h-9 rounded-md border px-3 text-sm bg-background">
              <option value="">Staff member</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <Input type="date" value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} required className="w-36" />
            <Input type="time" value={addForm.startTime} onChange={(e) => setAddForm({ ...addForm, startTime: e.target.value })} required className="w-28" />
            <Input type="time" value={addForm.endTime} onChange={(e) => setAddForm({ ...addForm, endTime: e.target.value })} required className="w-28" />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ userId: "", date: "", startTime: "", endTime: "" }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Staff</TableHead><TableHead>Date</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="text-muted-foreground">{s.id}</TableCell>
                {editId === s.id ? (
                  <>
                    <TableCell><select value={editForm.userId} onChange={(e) => setEditForm({ ...editForm, userId: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background">{users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}</select></TableCell>
                    <TableCell><Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="h-6 w-32" /></TableCell>
                    <TableCell><Input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} className="h-6 w-24" /></TableCell>
                    <TableCell><Input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} className="h-6 w-24" /></TableCell>
                    <TableCell className="text-right whitespace-nowrap"><Button size="xs" onClick={() => saveEdit(s.id)} className="mr-1">Save</Button><Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{users.find((u) => u.id === s.userId)?.name || `#${s.userId}`}</TableCell>
                    <TableCell className="text-sm">{s.date}</TableCell>
                    <TableCell className="font-mono text-sm">{s.startTime}</TableCell>
                    <TableCell className="font-mono text-sm">{s.endTime}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" onClick={() => startEdit(s)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog><DialogTrigger asChild><Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(s.id)}><Trash2 className="w-3 h-3" /></Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Delete Shift</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
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
