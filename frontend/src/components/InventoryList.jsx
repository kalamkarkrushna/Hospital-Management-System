import { useState, useEffect } from "react";
import { getInventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", quantity: "", unit: "", reorderLevel: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: "", quantity: "", unit: "", reorderLevel: "" });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => getInventory().then((data) => { setItems(data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => `${i.id} ${i.name} ${i.unit}`.toLowerCase().includes(search.toLowerCase()));

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteInventoryItem(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Item deleted");
    setDeleteId(null); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { name: addForm.name, quantity: Number(addForm.quantity), unit: addForm.unit, reorderLevel: Number(addForm.reorderLevel) };
    const result = await addInventoryItem(payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Item added"); setShowAdd(false); setAddForm({ name: "", quantity: "", unit: "", reorderLevel: "" }); load(); }
  };

  const startEdit = (i) => { setEditId(i.id); setEditForm({ name: i.name, quantity: String(i.quantity), unit: i.unit || "", reorderLevel: String(i.reorderLevel || 0) }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ name: "", quantity: "", unit: "", reorderLevel: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.name) payload.name = editForm.name;
    if (editForm.quantity) payload.quantity = Number(editForm.quantity);
    if (editForm.unit) payload.unit = editForm.unit;
    if (editForm.reorderLevel) payload.reorderLevel = Number(editForm.reorderLevel);
    const result = await updateInventoryItem(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Item updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Inventory</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search inventory..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
            </div>
            <Button size="sm" onClick={() => setShowAdd(!showAdd)}><Plus className="w-3.5 h-3.5" /> Add</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {msg && <div className={`mb-3 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</div>}
        {showAdd && (
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-muted/30 rounded-lg border flex-wrap">
            <Input placeholder="Item name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} required />
            <Input placeholder="Quantity" type="number" value={addForm.quantity} onChange={(e) => setAddForm({ ...addForm, quantity: e.target.value })} required className="w-24" />
            <Input placeholder="Unit (e.g. pcs, kg)" value={addForm.unit} onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })} className="w-28" />
            <Input placeholder="Reorder at" type="number" value={addForm.reorderLevel} onChange={(e) => setAddForm({ ...addForm, reorderLevel: e.target.value })} className="w-24" />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ name: "", quantity: "", unit: "", reorderLevel: "" }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Name</TableHead><TableHead>Quantity</TableHead><TableHead>Unit</TableHead><TableHead>Reorder At</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="text-muted-foreground">{i.id}</TableCell>
                {editId === i.id ? (
                  <>
                    <TableCell><Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="h-6" /></TableCell>
                    <TableCell><Input type="number" value={editForm.quantity} onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })} className="h-6 w-16" /></TableCell>
                    <TableCell><Input value={editForm.unit} onChange={(e) => setEditForm({ ...editForm, unit: e.target.value })} className="h-6 w-20" /></TableCell>
                    <TableCell><Input type="number" value={editForm.reorderLevel} onChange={(e) => setEditForm({ ...editForm, reorderLevel: e.target.value })} className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right whitespace-nowrap"><Button size="xs" onClick={() => saveEdit(i.id)} className="mr-1">Save</Button><Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{i.name}</TableCell>
                    <TableCell><span className={i.quantity <= (i.reorderLevel || 0) ? "text-destructive font-medium" : ""}>{i.quantity}</span></TableCell>
                    <TableCell className="text-sm">{i.unit || "—"}</TableCell>
                    <TableCell className="text-sm">{i.reorderLevel != null ? i.reorderLevel : "—"}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" onClick={() => startEdit(i)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog><DialogTrigger asChild><Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(i.id)}><Trash2 className="w-3 h-3" /></Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Delete Item</DialogTitle><DialogDescription>Are you sure?</DialogDescription></DialogHeader>
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
