import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import usePageMeta from "./hooks/usePageMeta";
import Navbar from "./components/Navbar";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import PatientList from "./components/PatientList";
import DoctorList from "./components/DoctorList";
import AppointmentList from "./components/AppointmentList";
import ManageUsers from "./components/ManageUsers";
import InvoiceList from "./components/InvoiceList";
import MedicineList from "./components/MedicineList";
import LabReportList from "./components/LabReportList";
import ShiftList from "./components/ShiftList";
import InventoryList from "./components/InventoryList";
import VideoCallList from "./components/VideoCallList";
import Insights from "./components/Insights";
import Login from "./components/Login";
import Register from "./components/Register";

const PAGE_META = {
  "/dashboard": { title: "Dashboard | HMS", description: "Your hospital management dashboard." },
  "/patients": { title: "Patients | HMS", description: "Manage your patients." },
  "/doctors": { title: "Doctors | HMS", description: "Manage your doctors." },
  "/appointments": { title: "Appointments | HMS", description: "Manage appointments and scheduling." },
  "/admin": { title: "Admin | HMS", description: "Manage hospital users and roles." },
  "/invoices": { title: "Billing | HMS", description: "Manage invoices and billing." },
  "/pharmacy": { title: "Pharmacy | HMS", description: "Manage medicines and the pharmacy." },
  "/lab-reports": { title: "Lab Reports | HMS", description: "Manage lab reports." },
  "/shifts": { title: "Scheduling | HMS", description: "Manage staff shifts." },
  "/inventory": { title: "Inventory | HMS", description: "Manage hospital inventory." },
  "/telemedicine": { title: "Telemedicine | HMS", description: "Manage video consultations." },
  "/insights": { title: "Insights | HMS", description: "Analytics and insights for your hospital." },
};

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: "HMS", description: "Hospital management." };
  usePageMeta(meta);
  if (!user) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <main id="main-content" className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><PatientList /></ProtectedRoute>} />
      <Route path="/doctors" element={<ProtectedRoute><DoctorList /></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><AppointmentList /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute>{user?.role === "ADMIN" ? <ManageUsers /> : <Navigate to="/dashboard" />}</ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><InvoiceList /></ProtectedRoute>} />
      <Route path="/pharmacy" element={<ProtectedRoute><MedicineList /></ProtectedRoute>} />
      <Route path="/lab-reports" element={<ProtectedRoute><LabReportList /></ProtectedRoute>} />
      <Route path="/shifts" element={<ProtectedRoute><ShiftList /></ProtectedRoute>} />
      <Route path="/inventory" element={<ProtectedRoute><InventoryList /></ProtectedRoute>} />
      <Route path="/telemedicine" element={<ProtectedRoute><VideoCallList /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md focus:bg-primary focus:text-primary-foreground focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>
          <div className="min-h-screen bg-background">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
