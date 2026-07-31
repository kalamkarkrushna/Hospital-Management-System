import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getInsights } from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";


export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getInsights().then(setStats).catch(() => {});
  }, []);

  const cards = [
    { label: "Patients", value: stats?.patients, color: "bg-primary" },
    { label: "Doctors", value: stats?.doctors, color: "bg-accent" },
    { label: "Appointments", value: stats?.appointments, color: "bg-secondary" },
    { label: "Staff Users", value: stats?.users, color: "bg-foreground" },
    { label: "Invoices", value: stats?.invoices, color: "bg-emerald-500" },
    { label: "Pharmacy", value: stats?.medicines, color: "bg-violet-500" },
    { label: "Lab Reports", value: stats?.labReports, color: "bg-amber-500" },
    { label: "Shifts", value: stats?.shifts, color: "bg-rose-500" },
    { label: "Inventory", value: stats?.inventoryItems, color: "bg-cyan-500" },
    { label: "Telemedicine", value: stats?.videoCalls, color: "bg-orange-500" },
  ];

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-1">
        {user?.hospitalName || "Dashboard"}
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        {user?.role === "ADMIN" ? "Administrator" : "Staff"} &middot; Plan: FREE
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {cards.map((c) => (
          <Card key={c.label} size="sm" className="min-w-0">
            <CardContent className="flex flex-col gap-2 pt-4">
              {stats ? (
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${c.color} rounded-lg flex items-center justify-center text-primary-foreground text-base sm:text-lg font-heading font-bold`}>
                  {c.value ?? 0}
                </div>
              ) : (
                <Skeleton className="w-10 h-10 rounded-lg" />
              )}
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}