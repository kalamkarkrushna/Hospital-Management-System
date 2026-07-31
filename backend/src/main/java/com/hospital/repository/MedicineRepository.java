package com.hospital.repository;

import com.hospital.model.Medicine;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MedicineRepository extends CrudRepository<Medicine, Integer> {
    @Query("SELECT * FROM medicines WHERE hospital_id = :hid")
    List<Medicine> findByHospitalId(@Param("hid") Integer hospitalId);
}
