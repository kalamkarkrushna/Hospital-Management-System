package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.Medicine;
import com.hospital.service.MedicineService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {
    private final MedicineService service;

    public MedicineController(MedicineService service) {
        this.service = service;
    }

    @GetMapping
    public List<Medicine> getAll(Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return service.getAll(p.hospitalId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable int id, Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return service.getById(id, p.hospitalId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Medicine medicine, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            medicine.setHospitalId(p.hospitalId());
            return ResponseEntity.ok(service.create(medicine));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Medicine medicine, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            return ResponseEntity.ok(service.update(id, medicine, p.hospitalId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            service.delete(id, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", "Medicine deleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
