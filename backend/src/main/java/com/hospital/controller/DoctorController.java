package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.Doctor;
import com.hospital.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {
    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    public List<Doctor> getAllDoctors(Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return doctorService.getAllDoctors(p.hospitalId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDoctor(@PathVariable int id, Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return doctorService.getDoctorById(id, p.hospitalId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            doctor.setHospitalId(p.hospitalId());
            Doctor saved = doctorService.addDoctor(doctor);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable int id, @RequestBody Doctor doctor, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            Doctor updated = doctorService.updateDoctor(id, doctor, p.hospitalId());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable int id, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            doctorService.deleteDoctor(id, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", "Doctor deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
