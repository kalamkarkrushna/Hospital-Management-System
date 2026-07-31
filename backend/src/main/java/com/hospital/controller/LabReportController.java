package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.LabReport;
import com.hospital.service.LabReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lab-reports")
public class LabReportController {
    private final LabReportService service;

    public LabReportController(LabReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<LabReport> getAll(Authentication auth) {
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
    public ResponseEntity<?> create(@RequestBody LabReport report, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            report.setHospitalId(p.hospitalId());
            return ResponseEntity.ok(service.create(report));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody LabReport report, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            return ResponseEntity.ok(service.update(id, report, p.hospitalId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            service.delete(id, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", "Lab report deleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
