package com.hospital.service;

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PatientService {
    private static final Set<String> VALID_GENDERS = Set.of("Male", "Female", "Other");

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient addPatient(Patient patient) {
        if (patient.getGender() == null || !VALID_GENDERS.contains(patient.getGender())) {
            throw new IllegalArgumentException("Gender must be one of: Male, Female, Other");
        }
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients(int hospitalId) {
        return patientRepository.findByHospitalId(hospitalId);
    }

    public boolean existsById(int id) {
        return patientRepository.existsById(id);
    }

    public Optional<Patient> getPatientById(int id, int hospitalId) {
        return patientRepository.findById(id)
                .filter(p -> p.getHospitalId() == hospitalId);
    }

    public Patient updatePatient(int id, Patient updated, int hospitalId) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        if (existing.getHospitalId() != hospitalId) {
            throw new IllegalArgumentException("Patient not found");
        }

        if (updated.getGender() != null && !VALID_GENDERS.contains(updated.getGender())) {
            throw new IllegalArgumentException("Gender must be one of: Male, Female, Other");
        }

        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getAge() != null) existing.setAge(updated.getAge());
        if (updated.getGender() != null) existing.setGender(updated.getGender());

        return patientRepository.save(existing);
    }

    public void deletePatient(int id, int hospitalId) {
        Patient existing = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));

        if (existing.getHospitalId() != hospitalId) {
            throw new IllegalArgumentException("Patient not found");
        }

        patientRepository.deleteById(id);
    }
}
