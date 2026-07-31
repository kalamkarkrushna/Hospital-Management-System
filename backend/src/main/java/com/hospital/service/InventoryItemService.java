package com.hospital.service;

import com.hospital.model.InventoryItem;
import com.hospital.repository.InventoryItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryItemService {
    private final InventoryItemRepository repository;

    public InventoryItemService(InventoryItemRepository repository) {
        this.repository = repository;
    }

    public List<InventoryItem> getAll(int hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }

    public Optional<InventoryItem> getById(int id, int hospitalId) {
        return repository.findById(id).filter(i -> i.getHospitalId() == hospitalId);
    }

    public InventoryItem create(InventoryItem item) {
        return repository.save(item);
    }

    public InventoryItem update(int id, InventoryItem updated, int hospitalId) {
        InventoryItem existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Item not found");
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getQuantity() != null) existing.setQuantity(updated.getQuantity());
        if (updated.getUnit() != null) existing.setUnit(updated.getUnit());
        if (updated.getReorderLevel() != null) existing.setReorderLevel(updated.getReorderLevel());
        return repository.save(existing);
    }

    public void delete(int id, int hospitalId) {
        InventoryItem existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Item not found");
        repository.deleteById(id);
    }
}
