import { useState } from "react";
import { addPatient } from "../api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";

export default function AddPatient() {
  const [form, setForm] = useState({ name: "", age: "", gender: "" });
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const patient = { name: form.name, age: parseInt(form.age), gender: form.gender };
    const result = await addPatient(patient);
    if (result.error) {
      setMsg({ type: "error", text: result.error });
    } else {
      setMsg({ type: "success", text: `Patient added successfully! ID: ${result.id}` });
      setForm({ name: "", age: "", gender: "" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Patient</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="age">Age</Label>
              <Input id="age" placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="gender">Gender</Label>
              <select id="gender" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required
                className="h-7 rounded-md border border-input bg-input/20 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/30">
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <Button type="submit">Add Patient</Button>
        </form>
        {msg && (
          <p className={`mt-4 text-sm font-medium ${msg.type === "success" ? "text-accent" : "text-destructive"}`}>{msg.text}</p>
        )}
      </CardContent>
    </Card>
  );
}