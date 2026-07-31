package com.hospital.service;

import com.hospital.model.Invoice;
import com.hospital.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InvoiceService {
    private final InvoiceRepository repository;

    public InvoiceService(InvoiceRepository repository) {
        this.repository = repository;
    }

    public List<Invoice> getAll(int hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }

    public Optional<Invoice> getById(int id, int hospitalId) {
        return repository.findById(id).filter(i -> i.getHospitalId() == hospitalId);
    }

    public Invoice create(Invoice invoice) {
        return repository.save(invoice);
    }

    public Invoice update(int id, Invoice updated, int hospitalId) {
        Invoice existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Invoice not found");
        if (updated.getPatientId() != null) existing.setPatientId(updated.getPatientId());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getAmount() != null) existing.setAmount(updated.getAmount());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getDate() != null) existing.setDate(updated.getDate());
        return repository.save(existing);
    }

    public void delete(int id, int hospitalId) {
        Invoice existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Invoice not found");
        repository.deleteById(id);
    }
}
