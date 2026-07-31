package com.hospital.service;

import com.hospital.model.LabReport;
import com.hospital.repository.LabReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LabReportService {
    private final LabReportRepository repository;

    public LabReportService(LabReportRepository repository) {
        this.repository = repository;
    }

    public List<LabReport> getAll(int hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }

    public Optional<LabReport> getById(int id, int hospitalId) {
        return repository.findById(id).filter(l -> l.getHospitalId() == hospitalId);
    }

    public LabReport create(LabReport report) {
        return repository.save(report);
    }

    public LabReport update(int id, LabReport updated, int hospitalId) {
        LabReport existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lab report not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Lab report not found");
        if (updated.getPatientId() != null) existing.setPatientId(updated.getPatientId());
        if (updated.getDoctorId() != null) existing.setDoctorId(updated.getDoctorId());
        if (updated.getTestName() != null) existing.setTestName(updated.getTestName());
        if (updated.getResult() != null) existing.setResult(updated.getResult());
        if (updated.getNotes() != null) existing.setNotes(updated.getNotes());
        if (updated.getReportDate() != null) existing.setReportDate(updated.getReportDate());
        return repository.save(existing);
    }

    public void delete(int id, int hospitalId) {
        LabReport existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Lab report not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Lab report not found");
        repository.deleteById(id);
    }
}
