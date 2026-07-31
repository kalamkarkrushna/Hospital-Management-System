import { useState, useEffect } from "react";
import { getInsights } from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import {
  Users, Stethoscope, CalendarCheck, Shield, DollarSign, Pill, FileText, Clock, Package, Video, Sparkles,
} from "lucide-react";

const insightCards = [
  { key: "patients", label: "Patients", icon: Users, color: "bg-primary" },
  { key: "doctors", label: "Doctors", icon: Stethoscope, color: "bg-accent" },
  { key: "appointments", label: "Appointments", icon: CalendarCheck, color: "bg-secondary" },
  { key: "users", label: "Staff Users", icon: Shield, color: "bg-foreground" },
  { key: "invoices", label: "Invoices", icon: DollarSign, color: "bg-emerald-600" },
  { key: "medicines", label: "Medicines", icon: Pill, color: "bg-violet-600" },
  { key: "labReports", label: "Lab Reports", icon: FileText, color: "bg-amber-600" },
  { key: "shifts", label: "Scheduled Shifts", icon: Clock, color: "bg-cyan-600" },
  { key: "inventoryItems", label: "Inventory Items", icon: Package, color: "bg-rose-600" },
  { key: "videoCalls", label: "Video Calls", icon: Video, color: "bg-indigo-600" },
];

export default function Insights() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getInsights().then(setStats);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-heading font-bold text-foreground mb-1 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> AI-Powered Insights
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        Real-time analytics across all hospital operations.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {insightCards.map((c) => {
          const Icon = c.icon;
          const value = stats?.[c.key];
          return (
            <Card key={c.key} size="sm">
              <CardContent className="flex flex-col gap-2 pt-4">
                {value !== undefined ? (
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 ${c.color} rounded-lg flex items-center justify-center text-primary-foreground text-base sm:text-lg font-heading font-bold`}>
                    {value}
                  </div>
                ) : (
                  <Skeleton className="w-10 h-10 rounded-lg" />
                )}
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground">{c.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
