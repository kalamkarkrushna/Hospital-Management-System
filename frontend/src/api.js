const BASE_URL = "http://localhost:8080/api";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function api(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...options.headers },
  });
  if (res.status === 403 || res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  return res.json();
}

/* Auth */
export function login(email, password) {
  return api("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(hospitalName, name, email, password, phone) {
  return api("/auth/register", {
    method: "POST",
    body: JSON.stringify({ hospitalName, name, email, password, phone }),
  });
}

/* Patients */
export function getPatients() {
  return api("/patients");
}

export function getPatient(id) {
  return api(`/patients/${id}`);
}

export function addPatient(patient) {
  return api("/patients", {
    method: "POST",
    body: JSON.stringify(patient),
  });
}

export function updatePatient(id, patient) {
  return api(`/patients/${id}`, {
    method: "PUT",
    body: JSON.stringify(patient),
  });
}

export function deletePatient(id) {
  return api(`/patients/${id}`, {
    method: "DELETE",
  });
}

/* Doctors */
export function getDoctors() {
  return api("/doctors");
}

export function getDoctor(id) {
  return api(`/doctors/${id}`);
}

export function addDoctor(doctor) {
  return api("/doctors", {
    method: "POST",
    body: JSON.stringify(doctor),
  });
}

export function updateDoctor(id, doctor) {
  return api(`/doctors/${id}`, {
    method: "PUT",
    body: JSON.stringify(doctor),
  });
}

export function deleteDoctor(id) {
  return api(`/doctors/${id}`, {
    method: "DELETE",
  });
}

/* Appointments */
export function getAppointments() {
  return api("/appointments");
}

export function bookAppointment(patientId, doctorId, appointmentDate) {
  return api("/appointments", {
    method: "POST",
    body: JSON.stringify({ patientId, doctorId, appointmentDate }),
  });
}

export function cancelAppointment(id) {
  return api(`/appointments/${id}`, {
    method: "DELETE",
  });
}

export function rescheduleAppointment(id, appointmentDate) {
  return api(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify({ appointmentDate }),
  });
}

/* Admin / Users */
export function getUsers() {
  return api("/admin/users");
}

export function addUser(user) {
  return api("/admin/users", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export function updateUser(id, data) {
  return api(`/admin/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteUser(id) {
  return api(`/admin/users/${id}`, {
    method: "DELETE",
  });
}

/* Invoices */
export function getInvoices() { return api("/invoices"); }
export function getInvoice(id) { return api(`/invoices/${id}`); }
export function addInvoice(invoice) { return api("/invoices", { method: "POST", body: JSON.stringify(invoice) }); }
export function updateInvoice(id, data) { return api(`/invoices/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export function deleteInvoice(id) { return api(`/invoices/${id}`, { method: "DELETE" }); }

/* Medicines */
export function getMedicines() { return api("/medicines"); }
export function getMedicine(id) { return api(`/medicines/${id}`); }
export function addMedicine(medicine) { return api("/medicines", { method: "POST", body: JSON.stringify(medicine) }); }
export function updateMedicine(id, data) { return api(`/medicines/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export function deleteMedicine(id) { return api(`/medicines/${id}`, { method: "DELETE" }); }

/* Lab Reports */
export function getLabReports() { return api("/lab-reports"); }
export function getLabReport(id) { return api(`/lab-reports/${id}`); }
export function addLabReport(report) { return api("/lab-reports", { method: "POST", body: JSON.stringify(report) }); }
export function updateLabReport(id, data) { return api(`/lab-reports/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export function deleteLabReport(id) { return api(`/lab-reports/${id}`, { method: "DELETE" }); }

/* Shifts */
export function getShifts() { return api("/shifts"); }
export function getShift(id) { return api(`/shifts/${id}`); }
export function addShift(shift) { return api("/shifts", { method: "POST", body: JSON.stringify(shift) }); }
export function updateShift(id, data) { return api(`/shifts/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export function deleteShift(id) { return api(`/shifts/${id}`, { method: "DELETE" }); }

/* Inventory */
export function getInventory() { return api("/inventory"); }
export function getInventoryItem(id) { return api(`/inventory/${id}`); }
export function addInventoryItem(item) { return api("/inventory", { method: "POST", body: JSON.stringify(item) }); }
export function updateInventoryItem(id, data) { return api(`/inventory/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export function deleteInventoryItem(id) { return api(`/inventory/${id}`, { method: "DELETE" }); }

/* Video Calls */
export function getVideoCalls() { return api("/video-calls"); }
export function getVideoCall(id) { return api(`/video-calls/${id}`); }
export function addVideoCall(call) { return api("/video-calls", { method: "POST", body: JSON.stringify(call) }); }
export function updateVideoCall(id, data) { return api(`/video-calls/${id}`, { method: "PUT", body: JSON.stringify(data) }); }
export function deleteVideoCall(id) { return api(`/video-calls/${id}`, { method: "DELETE" }); }

/* Insights */
export function getInsights() { return api("/insights"); }
