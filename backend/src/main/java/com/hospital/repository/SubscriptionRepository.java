package com.hospital.repository;

import com.hospital.model.Subscription;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SubscriptionRepository extends CrudRepository<Subscription, Integer> {
    @Query("SELECT * FROM subscriptions WHERE hospital_id = :hid")
    Optional<Subscription> findByHospitalId(@Param("hid") Integer hospitalId);
}
