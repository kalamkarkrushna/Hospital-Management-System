package com.hospital.repository;

import com.hospital.model.Hospital;
import org.springframework.data.repository.CrudRepository;

public interface HospitalRepository extends CrudRepository<Hospital, Integer> {
}
