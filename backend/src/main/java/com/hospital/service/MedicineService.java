package com.hospital.service;

import com.hospital.model.Medicine;
import com.hospital.repository.MedicineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {
    private final MedicineRepository repository;

    public MedicineService(MedicineRepository repository) {
        this.repository = repository;
    }

    public List<Medicine> getAll(int hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }

    public Optional<Medicine> getById(int id, int hospitalId) {
        return repository.findById(id).filter(m -> m.getHospitalId() == hospitalId);
    }

    public Medicine create(Medicine medicine) {
        return repository.save(medicine);
    }

    public Medicine update(int id, Medicine updated, int hospitalId) {
        Medicine existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Medicine not found");
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getStock() != null) existing.setStock(updated.getStock());
        if (updated.getPrice() != null) existing.setPrice(updated.getPrice());
        if (updated.getExpiryDate() != null) existing.setExpiryDate(updated.getExpiryDate());
        return repository.save(existing);
    }

    public void delete(int id, int hospitalId) {
        Medicine existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Medicine not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Medicine not found");
        repository.deleteById(id);
    }
}
