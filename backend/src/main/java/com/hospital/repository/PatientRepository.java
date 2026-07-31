package com.hospital.repository;

import com.hospital.model.Patient;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PatientRepository extends CrudRepository<Patient, Integer> {
    @Query("SELECT * FROM Patients WHERE hospital_id = :hid")
    List<Patient> findByHospitalId(@Param("hid") Integer hospitalId);
}
