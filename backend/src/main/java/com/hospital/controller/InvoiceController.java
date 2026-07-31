package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.Invoice;
import com.hospital.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {
    private final InvoiceService service;

    public InvoiceController(InvoiceService service) {
        this.service = service;
    }

    @GetMapping
    public List<Invoice> getAll(Authentication auth) {
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
    public ResponseEntity<?> create(@RequestBody Invoice invoice, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            invoice.setHospitalId(p.hospitalId());
            return ResponseEntity.ok(service.create(invoice));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Invoice invoice, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            return ResponseEntity.ok(service.update(id, invoice, p.hospitalId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable int id, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            service.delete(id, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", "Invoice deleted"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
