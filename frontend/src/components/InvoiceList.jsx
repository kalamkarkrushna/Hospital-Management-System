import { useState, useEffect } from "react";
import { getInvoices, addInvoice, updateInvoice, deleteInvoice, getPatients } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Search, Pencil, Trash2, Plus } from "lucide-react";

export default function InvoiceList() {
  const [items, setItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ patientId: "", description: "", amount: "", status: "", date: "" });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ patientId: "", description: "", amount: "", status: "PENDING", date: new Date().toISOString().split("T")[0] });
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => Promise.all([getInvoices(), getPatients()]).then(([inv, pat]) => { setItems(inv); setPatients(pat); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => `${i.id} ${i.description} ${i.status}`.toLowerCase().includes(search.toLowerCase()));

  const showMsg = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg(null), 3000); };

  const handleDelete = async () => {
    if (!deleteId) return;
    const result = await deleteInvoice(deleteId);
    if (result.error) showMsg("error", result.error); else showMsg("success", "Invoice deleted");
    setDeleteId(null); load();
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const payload = { ...addForm, patientId: Number(addForm.patientId), amount: Number(addForm.amount) };
    const result = await addInvoice(payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Invoice created"); setShowAdd(false); setAddForm({ patientId: "", description: "", amount: "", status: "PENDING", date: new Date().toISOString().split("T")[0] }); load(); }
  };

  const startEdit = (i) => { setEditId(i.id); setEditForm({ patientId: String(i.patientId), description: i.description, amount: String(i.amount), status: i.status, date: i.date }); };
  const cancelEdit = () => { setEditId(null); setEditForm({ patientId: "", description: "", amount: "", status: "", date: "" }); };

  const saveEdit = async (id) => {
    const payload = {};
    if (editForm.description) payload.description = editForm.description;
    if (editForm.amount) payload.amount = Number(editForm.amount);
    if (editForm.status) payload.status = editForm.status;
    if (editForm.date) payload.date = editForm.date;
    const result = await updateInvoice(id, payload);
    if (result.error) { showMsg("error", result.error); } else { showMsg("success", "Invoice updated"); cancelEdit(); load(); }
  };

  if (loading) return <p className="text-muted-foreground text-center py-8">Loading...</p>;

  const patientName = (id) => patients.find((p) => p.id === id)?.name || `Patient #${id}`;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <CardTitle>Billing & Invoices</CardTitle>
          <div className="flex gap-2 sm:ml-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 w-full sm:w-56" />
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
              <option value="">Select patient</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <Input placeholder="Description" value={addForm.description} onChange={(e) => setAddForm({ ...addForm, description: e.target.value })} required className="w-48" />
            <Input placeholder="Amount" type="number" step="0.01" value={addForm.amount} onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })} required className="w-28" />
            <Input type="date" value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} className="w-36" />
            <Button type="submit" size="sm">Save</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => { setShowAdd(false); setAddForm({ patientId: "", description: "", amount: "", status: "PENDING", date: new Date().toISOString().split("T")[0] }); }}>Cancel</Button>
          </form>
        )}
        <div className="overflow-x-auto"><Table>
          <TableHeader>
            <TableRow><TableHead>ID</TableHead><TableHead>Patient</TableHead><TableHead>Description</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="text-muted-foreground">{i.id}</TableCell>
                {editId === i.id ? (
                  <>
                    <TableCell><select value={editForm.patientId} onChange={(e) => setEditForm({ ...editForm, patientId: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background w-24">{patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></TableCell>
                    <TableCell><Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="h-6 w-32" /></TableCell>
                    <TableCell><Input value={editForm.amount} onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })} className="h-6 w-20" /></TableCell>
                    <TableCell><select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="h-8 rounded-md border px-2 text-xs bg-background">{["PENDING","PAID","CANCELLED"].map((s) => <option key={s} value={s}>{s}</option>)}</select></TableCell>
                    <TableCell><Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} className="h-6 w-32" /></TableCell>
                    <TableCell className="text-right whitespace-nowrap"><Button size="xs" onClick={() => saveEdit(i.id)} className="mr-1">Save</Button><Button size="xs" variant="outline" onClick={cancelEdit}>Cancel</Button></TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{patientName(i.patientId)}</TableCell>
                    <TableCell className="text-sm">{i.description}</TableCell>
                    <TableCell className="font-mono">${Number(i.amount).toFixed(2)}</TableCell>
                    <TableCell><Badge variant={i.status === "PAID" ? "default" : i.status === "CANCELLED" ? "destructive" : "secondary"}>{i.status}</Badge></TableCell>
                    <TableCell className="text-sm">{i.date}</TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Button size="icon-xs" variant="ghost" onClick={() => startEdit(i)}><Pencil className="w-3 h-3" /></Button>
                      <Dialog><DialogTrigger asChild><Button size="icon-xs" variant="ghost" onClick={() => setDeleteId(i.id)}><Trash2 className="w-3 h-3" /></Button></DialogTrigger>
                        <DialogContent><DialogHeader><DialogTitle>Delete Invoice</DialogTitle><DialogDescription>Are you sure? This cannot be undone.</DialogDescription></DialogHeader>
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
