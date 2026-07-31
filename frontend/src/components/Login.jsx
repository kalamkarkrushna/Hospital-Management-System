import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login } from "../api";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import LiquidEther from "./LiquidEther";
import usePageMeta from "../hooks/usePageMeta";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  usePageMeta({
    title: "Sign In | HMS",
    description: "Sign in to your HMS hospital management dashboard.",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      } else {
        loginUser(result);
        navigate("/");
      }
    } catch {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center bg-background px-4 relative">
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
          <CardTitle className="text-center text-lg">Sign in to HMS</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" placeholder="admin@hospital.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="current-password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full">Sign In</Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground">
            No account? <Link to="/register" className="text-primary underline-offset-4 hover:underline">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}