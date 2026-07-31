package com.hospital.repository;

import com.hospital.model.VideoCall;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VideoCallRepository extends CrudRepository<VideoCall, Integer> {
    @Query("SELECT * FROM video_calls WHERE hospital_id = :hid")
    List<VideoCall> findByHospitalId(@Param("hid") Integer hospitalId);
}
