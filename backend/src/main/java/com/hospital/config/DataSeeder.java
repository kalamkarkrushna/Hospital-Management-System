package com.hospital.config;

import com.hospital.model.*;
import com.hospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Order(2)
public class DataSeeder implements CommandLineRunner {
    private final HospitalRepository hospitalRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final MedicineRepository medicineRepository;
    private final LabReportRepository labReportRepository;
    private final ShiftRepository shiftRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final VideoCallRepository videoCallRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(HospitalRepository hospitalRepository, UserRepository userRepository,
                      PatientRepository patientRepository, DoctorRepository doctorRepository,
                      AppointmentRepository appointmentRepository, InvoiceRepository invoiceRepository,
                      MedicineRepository medicineRepository, LabReportRepository labReportRepository,
                      ShiftRepository shiftRepository, InventoryItemRepository inventoryItemRepository,
                      VideoCallRepository videoCallRepository, SubscriptionRepository subscriptionRepository,
                      PasswordEncoder passwordEncoder) {
        this.hospitalRepository = hospitalRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.invoiceRepository = invoiceRepository;
        this.medicineRepository = medicineRepository;
        this.labReportRepository = labReportRepository;
        this.shiftRepository = shiftRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.videoCallRepository = videoCallRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (hospitalRepository.count() > 0) {
            System.out.println("Data already exists, skipping seed");
            return;
        }

        System.out.println("Seeding demo data...");

        Hospital hospital = new Hospital();
        hospital.setName("City General Hospital");
        hospital.setEmail("info@citygeneral.com");
        hospital.setPhone("+1-555-0100");
        hospital.setAddress("123 Main Street, New York, NY 10001");
        hospital = hospitalRepository.save(hospital);
        int hid = hospital.getId();

        User admin = new User();
        admin.setHospitalId(hid);
        admin.setName("Admin User");
        admin.setEmail("admin@hospital.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);

        User staff = new User();
        staff.setHospitalId(hid);
        staff.setName("Dr. Sarah Wilson");
        staff.setEmail("doctor@hospital.com");
        staff.setPassword(passwordEncoder.encode("doctor123"));
        staff.setRole("STAFF");
        userRepository.save(staff);

        Subscription sub = new Subscription();
        sub.setHospitalId(hid);
        sub.setPlan("PREMIUM");
        sub.setStatus("ACTIVE");
        sub.setStartDate("2026-01-01");
        sub.setEndDate("2027-01-01");
        subscriptionRepository.save(sub);

        String[][] patientData = {
            {"John Doe", "45", "Male"},
            {"Jane Smith", "32", "Female"},
            {"Robert Johnson", "58", "Male"},
            {"Emily Davis", "27", "Female"},
            {"Michael Brown", "71", "Male"},
        };
        for (String[] p : patientData) {
            Patient pt = new Patient();
            pt.setHospitalId(hid);
            pt.setName(p[0]);
            pt.setAge(Integer.parseInt(p[1]));
            pt.setGender(p[2]);
            patientRepository.save(pt);
        }

        String[][] doctorData = {
            {"Dr. Sarah Wilson", "Cardiology"},
            {"Dr. James Taylor", "Neurology"},
            {"Dr. Lisa Anderson", "Pediatrics"},
            {"Dr. David Martinez", "Orthopedics"},
        };
        for (String[] d : doctorData) {
            Doctor doc = new Doctor();
            doc.setHospitalId(hid);
            doc.setName(d[0]);
            doc.setSpecialization(d[1]);
            doctorRepository.save(doc);
        }

        String[][] appointmentData = {
            {"1", "1", "2026-08-15"},
            {"2", "2", "2026-08-16"},
            {"3", "3", "2026-08-17"},
            {"4", "4", "2026-08-18"},
            {"5", "1", "2026-08-19"},
        };
        for (String[] a : appointmentData) {
            Appointment ap = new Appointment();
            ap.setHospitalId(hid);
            ap.setPatientId(Integer.parseInt(a[0]));
            ap.setDoctorId(Integer.parseInt(a[1]));
            ap.setAppointmentDate(a[2]);
            appointmentRepository.save(ap);
        }

        String[][] invoiceData = {
            {"1", "Consultation Fee", "150.00", "PAID", "2026-07-15"},
            {"2", "Lab Tests", "250.00", "PAID", "2026-07-16"},
            {"3", "Surgery", "5000.00", "PENDING", "2026-07-20"},
            {"4", "Prescription", "75.00", "PAID", "2026-07-22"},
            {"5", "X-Ray", "200.00", "PENDING", "2026-07-25"},
        };
        for (String[] i : invoiceData) {
            Invoice inv = new Invoice();
            inv.setHospitalId(hid);
            inv.setPatientId(Integer.parseInt(i[0]));
            inv.setDescription(i[1]);
            inv.setAmount(Double.parseDouble(i[2]));
            inv.setStatus(i[3]);
            inv.setDate(i[4]);
            invoiceRepository.save(inv);
        }

        String[][] medicineData = {
            {"Paracetamol", "500", "5.99", "2027-12-31"},
            {"Amoxicillin", "200", "12.50", "2027-06-30"},
            {"Ibuprofen", "300", "8.99", "2027-10-15"},
            {"Metformin", "150", "15.00", "2027-08-20"},
            {"Atorvastatin", "100", "22.50", "2027-09-01"},
            {"Omeprazole", "250", "10.99", "2027-11-30"},
        };
        for (String[] m : medicineData) {
            Medicine med = new Medicine();
            med.setHospitalId(hid);
            med.setName(m[0]);
            med.setStock(Integer.parseInt(m[1]));
            med.setPrice(Double.parseDouble(m[2]));
            med.setExpiryDate(m[3]);
            medicineRepository.save(med);
        }

        String[][] labData = {
            {"1", "1", "Complete Blood Count", "Normal", "All values within normal range", "2026-07-10"},
            {"2", "2", "MRI Scan", "Abnormal", "Minor irregularities detected in left hemisphere", "2026-07-12"},
            {"3", "3", "X-Ray Chest", "Normal", "No abnormalities detected", "2026-07-14"},
            {"4", "4", "Blood Lipid Panel", "Borderline", "Slightly elevated cholesterol levels", "2026-07-16"},
        };
        for (String[] l : labData) {
            LabReport lr = new LabReport();
            lr.setHospitalId(hid);
            lr.setPatientId(Integer.parseInt(l[0]));
            lr.setDoctorId(Integer.parseInt(l[1]));
            lr.setTestName(l[2]);
            lr.setResult(l[3]);
            lr.setNotes(l[4]);
            lr.setReportDate(l[5]);
            labReportRepository.save(lr);
        }

        String[][] shiftData = {
            {"2", "2026-08-01", "09:00", "17:00"},
            {"2", "2026-08-02", "09:00", "17:00"},
            {"2", "2026-08-03", "13:00", "21:00"},
            {"2", "2026-08-04", "09:00", "17:00"},
        };
        for (String[] s : shiftData) {
            Shift sh = new Shift();
            sh.setHospitalId(hid);
            sh.setUserId(Integer.parseInt(s[0]));
            sh.setDate(s[1]);
            sh.setStartTime(s[2]);
            sh.setEndTime(s[3]);
            shiftRepository.save(sh);
        }

        String[][] inventoryData = {
            {"Surgical Masks", "1000", "boxes", "100"},
            {"Latex Gloves", "500", "boxes", "50"},
            {"Syringes", "2000", "pieces", "200"},
            {"Bandages", "300", "rolls", "50"},
        };
        for (String[] inv : inventoryData) {
            InventoryItem item = new InventoryItem();
            item.setHospitalId(hid);
            item.setName(inv[0]);
            item.setQuantity(Integer.parseInt(inv[1]));
            item.setUnit(inv[2]);
            item.setReorderLevel(Integer.parseInt(inv[3]));
            inventoryItemRepository.save(item);
        }

        String[][] videoData = {
            {"1", "1", "2026-08-20", "SCHEDULED", "https://meet.example.com/abc123"},
            {"4", "2", "2026-08-22", "SCHEDULED", "https://meet.example.com/def456"},
        };
        for (String[] v : videoData) {
            VideoCall vc = new VideoCall();
            vc.setHospitalId(hid);
            vc.setPatientId(Integer.parseInt(v[0]));
            vc.setDoctorId(Integer.parseInt(v[1]));
            vc.setScheduledDate(v[2]);
            vc.setStatus(v[3]);
            vc.setMeetingLink(v[4]);
            videoCallRepository.save(vc);
        }

        System.out.println("Demo data seeded successfully!");
    }
}
