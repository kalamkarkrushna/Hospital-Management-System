import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register } from "../api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import LiquidEther from "./LiquidEther";

export default function Register() {
  const [form, setForm] = useState({ hospitalName: "", name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await register(form.hospitalName, form.name, form.email, form.password, form.phone);
      if (result.error) {
        setError(result.error);
      } else {
        loginUser(result);
        navigate("/");
      }
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 relative">
      <div className="fixed inset-0 z-0">
        <LiquidEther
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          colors={["#5227FF","#FF9FFC","#B497CF"]}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          isBounce={false}
          resolution={0.5}
        />
      </div>
      <Card className="w-full max-w-sm relative z-10 bg-white/10 dark:bg-white/5 backdrop-blur-xl ring-0 border border-white/20 dark:border-white/10">
        <CardHeader>
          <CardTitle className="text-center text-lg">Create Hospital Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-1.5">
              <Label htmlFor="hospitalName">Hospital Name</Label>
              <Input id="hospitalName" placeholder="My Hospital" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@hospital.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Create Account</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary underline-offset-4 hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}