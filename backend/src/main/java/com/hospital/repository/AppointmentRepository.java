package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends CrudRepository<Appointment, Integer> {
    @Query("SELECT * FROM Appointments WHERE hospital_id = :hid")
    List<Appointment> findByHospitalId(@Param("hid") Integer hospitalId);

    @Query("SELECT COUNT(*) FROM Appointments WHERE Doctor_Id = :doctorId AND Appointment_Date = :date AND hospital_id = :hid")
    int countByDoctorIdAndDateAndHospitalId(@Param("doctorId") Integer doctorId,
                                             @Param("date") String date,
                                             @Param("hid") Integer hospitalId);
}
