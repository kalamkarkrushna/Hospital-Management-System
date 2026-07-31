package com.hospital.service;

import com.hospital.model.Shift;
import com.hospital.repository.ShiftRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShiftService {
    private final ShiftRepository repository;

    public ShiftService(ShiftRepository repository) {
        this.repository = repository;
    }

    public List<Shift> getAll(int hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }

    public Optional<Shift> getById(int id, int hospitalId) {
        return repository.findById(id).filter(s -> s.getHospitalId() == hospitalId);
    }

    public Shift create(Shift shift) {
        return repository.save(shift);
    }

    public Shift update(int id, Shift updated, int hospitalId) {
        Shift existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shift not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Shift not found");
        if (updated.getUserId() != null) existing.setUserId(updated.getUserId());
        if (updated.getDate() != null) existing.setDate(updated.getDate());
        if (updated.getStartTime() != null) existing.setStartTime(updated.getStartTime());
        if (updated.getEndTime() != null) existing.setEndTime(updated.getEndTime());
        return repository.save(existing);
    }

    public void delete(int id, int hospitalId) {
        Shift existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shift not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Shift not found");
        repository.deleteById(id);
    }
}
