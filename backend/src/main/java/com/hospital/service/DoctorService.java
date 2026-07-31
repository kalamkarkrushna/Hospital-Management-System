package com.hospital.service;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors(int hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId);
    }

    public boolean existsById(int id) {
        return doctorRepository.existsById(id);
    }

    public Optional<Doctor> getDoctorById(int id, int hospitalId) {
        return doctorRepository.findById(id)
                .filter(d -> d.getHospitalId() == hospitalId);
    }

    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(int id, Doctor updated, int hospitalId) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        if (existing.getHospitalId() != hospitalId) {
            throw new IllegalArgumentException("Doctor not found");
        }

        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getSpecialization() != null) existing.setSpecialization(updated.getSpecialization());

        return doctorRepository.save(existing);
    }

    public void deleteDoctor(int id, int hospitalId) {
        Doctor existing = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        if (existing.getHospitalId() != hospitalId) {
            throw new IllegalArgumentException("Doctor not found");
        }

        doctorRepository.deleteById(id);
    }
}
