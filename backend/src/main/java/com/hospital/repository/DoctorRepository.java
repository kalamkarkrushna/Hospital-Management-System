package com.hospital.repository;

import com.hospital.model.Doctor;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DoctorRepository extends CrudRepository<Doctor, Integer> {
    @Query("SELECT * FROM Doctors WHERE hospital_id = :hid")
    List<Doctor> findByHospitalId(@Param("hid") Integer hospitalId);
}
