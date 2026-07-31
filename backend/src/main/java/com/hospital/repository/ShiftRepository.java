package com.hospital.repository;

import com.hospital.model.Shift;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ShiftRepository extends CrudRepository<Shift, Integer> {
    @Query("SELECT * FROM shifts WHERE hospital_id = :hid")
    List<Shift> findByHospitalId(@Param("hid") Integer hospitalId);
}
