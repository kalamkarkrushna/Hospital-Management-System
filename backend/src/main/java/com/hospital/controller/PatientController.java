package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.Patient;
import com.hospital.service.PatientService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patients")
public class PatientController {
    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public List<Patient> getAllPatients(Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return patientService.getAllPatients(p.hospitalId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPatient(@PathVariable int id, Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return patientService.getPatientById(id, p.hospitalId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addPatient(@RequestBody Patient patient, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            patient.setHospitalId(p.hospitalId());
            Patient saved = patientService.addPatient(patient);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePatient(@PathVariable int id, @RequestBody Patient patient, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            Patient updated = patientService.updatePatient(id, patient, p.hospitalId());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePatient(@PathVariable int id, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            patientService.deletePatient(id, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", "Patient deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
