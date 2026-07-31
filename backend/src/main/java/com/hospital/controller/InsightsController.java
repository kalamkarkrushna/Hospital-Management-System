package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/insights")
public class InsightsController {
    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentRepository appointmentRepo;
    private final UserRepository userRepo;
    private final InvoiceRepository invoiceRepo;
    private final MedicineRepository medicineRepo;
    private final LabReportRepository labReportRepo;
    private final ShiftRepository shiftRepo;
    private final InventoryItemRepository inventoryRepo;
    private final VideoCallRepository videoCallRepo;

    public InsightsController(
            PatientRepository patientRepo, DoctorRepository doctorRepo,
            AppointmentRepository appointmentRepo, UserRepository userRepo,
            InvoiceRepository invoiceRepo, MedicineRepository medicineRepo,
            LabReportRepository labReportRepo, ShiftRepository shiftRepo,
            InventoryItemRepository inventoryRepo, VideoCallRepository videoCallRepo) {
        this.patientRepo = patientRepo;
        this.doctorRepo = doctorRepo;
        this.appointmentRepo = appointmentRepo;
        this.userRepo = userRepo;
        this.invoiceRepo = invoiceRepo;
        this.medicineRepo = medicineRepo;
        this.labReportRepo = labReportRepo;
        this.shiftRepo = shiftRepo;
        this.inventoryRepo = inventoryRepo;
        this.videoCallRepo = videoCallRepo;
    }

    @GetMapping
    public Map<String, Integer> getInsights(Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        int hid = p.hospitalId();
        return Map.of(
            "patients", patientRepo.findByHospitalId(hid).size(),
            "doctors", doctorRepo.findByHospitalId(hid).size(),
            "appointments", appointmentRepo.findByHospitalId(hid).size(),
            "users", userRepo.findByHospitalId(hid).size(),
            "invoices", invoiceRepo.findByHospitalId(hid).size(),
            "medicines", medicineRepo.findByHospitalId(hid).size(),
            "labReports", labReportRepo.findByHospitalId(hid).size(),
            "shifts", shiftRepo.findByHospitalId(hid).size(),
            "inventoryItems", inventoryRepo.findByHospitalId(hid).size(),
            "videoCalls", videoCallRepo.findByHospitalId(hid).size()
        );
    }
}
