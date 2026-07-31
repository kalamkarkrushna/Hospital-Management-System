import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ModeToggle } from "./mode-toggle";
import { Button } from "../components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose } from "../components/ui/sheet";
import { Menu } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/patients", label: "Patients" },
  { to: "/doctors", label: "Doctors" },
  { to: "/appointments", label: "Appointments" },
  { to: "/invoices", label: "Billing" },
  { to: "/pharmacy", label: "Pharmacy" },
  { to: "/lab-reports", label: "Lab Reports" },
  { to: "/shifts", label: "Scheduling" },
  { to: "/inventory", label: "Inventory" },
  { to: "/telemedicine", label: "Telemedicine" },
  { to: "/insights", label: "Insights" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="w-full px-6 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg sm:text-xl font-heading font-bold tracking-tight shrink-0">
          HMS
        </Link>
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-none">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2 xl:px-3 py-1.5 rounded text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === to
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/80 hover:bg-primary/80"
              }`}
            >
              {label}
            </Link>
          ))}
          {user?.role === "ADMIN" && (
            <Link to="/admin"
              className={`px-2 xl:px-3 py-1.5 rounded text-xs xl:text-sm font-medium transition-colors whitespace-nowrap ${
                pathname === "/admin" ? "bg-primary-foreground text-primary" : "text-primary-foreground/80 hover:bg-primary/80"
              }`}
            >Admin</Link>
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 lg:border-l lg:border-primary-foreground/20 lg:pl-3 shrink-0">
          <ModeToggle />
          <span className="hidden sm:inline text-xs sm:text-sm text-primary-foreground/70 truncate max-w-[80px] sm:max-w-[120px]">{user?.hospitalName}</span>
          <Button variant="ghost" onClick={logout} className="text-primary-foreground/70 hover:text-primary-foreground text-xs sm:text-sm h-auto px-1.5 sm:px-2 py-1">
            Logout
          </Button>
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon-sm" aria-label="Open navigation menu" className="text-primary-foreground/70 hover:text-primary-foreground">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-popover text-popover-foreground w-full max-w-xs">
              <SheetHeader>
                <SheetTitle>HMS</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 mt-4">
                {links.map(({ to, label }) => (
                  <SheetClose asChild key={to}>
                    <Link to={to} className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                      pathname === to ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}>
                      {label}
                    </Link>
                  </SheetClose>
                ))}
                {user?.role === "ADMIN" && (
                  <SheetClose asChild>
                    <Link to="/admin" className={`block px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                      pathname === "/admin" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    }`}>
                      Admin
                    </Link>
                  </SheetClose>
                )}
                <div className="mt-4 pt-4 border-t border-border">
                  <span className="block px-3 py-1 text-xs text-muted-foreground">{user?.hospitalName}</span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}