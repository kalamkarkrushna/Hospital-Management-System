import { useState, useEffect } from "react";
import { getUsers, addUser, updateUser, deleteUser } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "STAFF" });
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "" });
  const [deleteId, setDeleteId] = useState(null);

  const load = () => getUsers().then(setUsers);
  useEffect(() => { load(); }, []);

  const showMsg = (text, type = "success") => { setMsg(text); setTimeout(() => setMsg(""), 3000); };

  const handleAdd = async (e) => {
    e.preventDefault();
    const result = await addUser(form);
    showMsg(result.message || "User added", result.error ? "error" : "success");
    setForm({ name: "", email: "", password: "", role: "STAFF" });
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteUser(deleteId);
    if (result.error) showMsg(result.error, "error"); else showMsg("User deleted");
    setDeleteId(null);
    load();
  };

  const startEdit = (u) => { setEditId(u.id); setEditForm({ name: u.name, email: u.email, role: u.role }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ name: "", email: "", role: "" }); };

  const saveEdit = async (id) => {
    const result = await updateUser(id, editForm);
    if (result.error) showMsg(result.error, "error"); else showMsg("User updated");
    cancelEdit();
    load();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-6">
          <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="h-7 rounded-md border border-input bg-input/20 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>
          <Button type="submit">Add</Button>
        </form>
        {msg && <p className={`text-sm mb-3 ${msg.includes("error") || msg.includes("Error") ? "text-destructive" : "text-accent"}`}>{msg}</p>}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                {editId === u.id ? (
                  <>
                    <TableCell><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-6" /></TableCell>
                    <TableCell><Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="h-6" /></TableCell>
                    <TableCell>
                      <select value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        className="h-6 px-1 border border-input rounded text-xs bg-card">
                        <option value="STAFF">Staff</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="xs" onClick={() => saveEdit(u.id)} className="mr-1">Save</Button>
                      <Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-muted-foreground truncate max-w-[120px] sm:max-w-none">{u.email}</TableCell>
                    <TableCell>
                      <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>{u.role}</Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" onClick={() => startEdit(u)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(u.id)}><Trash2 className="w-3 h-3" /></Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Delete User</DialogTitle>
                            <DialogDescription>Are you sure you want to delete {u.name}? This cannot be undone.</DialogDescription>
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