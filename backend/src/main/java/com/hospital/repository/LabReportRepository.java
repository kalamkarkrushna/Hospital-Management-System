package com.hospital.repository;

import com.hospital.model.LabReport;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LabReportRepository extends CrudRepository<LabReport, Integer> {
    @Query("SELECT * FROM lab_reports WHERE hospital_id = :hid")
    List<LabReport> findByHospitalId(@Param("hid") Integer hospitalId);
}
