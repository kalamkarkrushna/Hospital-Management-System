package com.hospital.repository;

import com.hospital.model.User;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    @Query("SELECT * FROM users WHERE hospital_id = :hid")
    List<User> findByHospitalId(@Param("hid") Integer hospitalId);
}
