package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public List<Appointment> getAllAppointments(Authentication auth) {
        var p = (HospitalUserPrincipal) auth.getPrincipal();
        return appointmentService.getAllAppointments(p.hospitalId());
    }

    @PostMapping
    public Map<String, String> bookAppointment(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            int patientId = Integer.parseInt(body.get("patientId").toString());
            int doctorId = Integer.parseInt(body.get("doctorId").toString());
            String date = body.get("appointmentDate").toString();
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            String message = appointmentService.bookAppointment(patientId, doctorId, date, p.hospitalId());
            return Map.of("message", message);
        } catch (Exception e) {
            return Map.of("message", "Error: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable int id, Authentication auth) {
        try {
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            String message = appointmentService.cancelAppointment(id, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable int id, @RequestBody Map<String, Object> body, Authentication auth) {
        try {
            String newDate = body.get("appointmentDate").toString();
            var p = (HospitalUserPrincipal) auth.getPrincipal();
            String message = appointmentService.rescheduleAppointment(id, newDate, p.hospitalId());
            return ResponseEntity.ok(Map.of("message", message));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
