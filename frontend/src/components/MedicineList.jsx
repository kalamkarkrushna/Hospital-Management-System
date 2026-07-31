import { useState, useEffect } from "react";
import { getMedicines, addMedicine, updateMedicine, deleteMedicine } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function MedicineList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", stock: "", price: "", expiryDate: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", stock: "", price: "", expiryDate: "" });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => getMedicines().then((data) => { setItems(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter((m) => `${m.id} ${m.name}`.toLowerCase().includes(search.toLowerCase()));

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteMedicine(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Medicine deleted");
    setDeleteId(null); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { name: addForm.name, stock: Number(addForm.stock), price: Number(addForm.price), expiryDate: addForm.expiryDate };
    const result = await addMedicine(payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Medicine added"); setShowAdd(false); setAddForm({ name: "", stock: "", price: "", expiryDate: "" }); load(); }
  };

  const startEdit = (m) => { setEditId(m.id); setEditForm({ name: m.name, stock: String(m.stock), price: String(m.price), expiryDate: m.expiryDate || "" }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ name: "", stock: "", price: "", expiryDate: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.name) payload.name = editForm.name;
    if (editForm.stock) payload.stock = Number(editForm.stock);
    if (editForm.price) payload.price = Number(editForm.price);
    if (editForm.expiryDate) payload.expiryDate = editForm.expiryDate;
    const result = await updateMedicine(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Medicine updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Pharmacy - Medicines</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search medicines..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border flex-wrap">
            <Input placeholder="Medicine name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
            <Input placeholder="Stock" type="number" value={addForm.stock} onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })} required className="w-24" />
            <Input placeholder="Price" type="number" step="0.01" value={addForm.price} onChange={(e) => setAddForm({ ...addForm, price: e.target.value })} required className="w-24" />
            <Input type="date" value={addForm.expiryDate} onChange={(e) => setAddForm({ ...addForm, expiryDate: e.target.value })} className="w-36" />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ name: "", stock: "", price: "", expiryDate: "" }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Stock</TableHead><TableHead>Price</TableHead><TableHead>Expiry</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="text-muted-foreground">{m.id}</TableCell>
                {editId === m.id ? (
                  <>
                    <TableCell><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-6" /></TableCell>
                    <TableCell><Input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} className="h-6 w-16" /></TableCell>
                    <TableCell><Input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="h-6 w-20" /></TableCell>
                    <TableCell><Input type="date" value={editForm.expiryDate} onChange={(e) => setEditForm({ ...editForm, expiryDate: e.target.value })} className="h-6 w-32" /></TableCell>
                    <TableCell className="text-right whitespace-nowrap"><Button size="xs" onClick={() => saveEdit(m.id)} className="mr-1">Save</Button><Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell><span className={m.stock <= 10 ? "text-destructive font-medium" : ""}>{m.stock}</span></TableCell>
                    <TableCell className="font-mono">${Number(m.price).toFixed(2)}</TableCell>
                    <TableCell className="text-sm">{m.expiryDate || "—"}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" onClick={() => startEdit(m)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog><DialogTrigger asChild><Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(m.id)}><Trash2 className="w-3 h-3" /></Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Delete Medicine</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
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
