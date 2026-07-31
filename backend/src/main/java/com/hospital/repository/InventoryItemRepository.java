package com.hospital.repository;

import com.hospital.model.InventoryItem;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryItemRepository extends CrudRepository<InventoryItem, Integer> {
    @Query("SELECT * FROM inventory_items WHERE hospital_id = :hid")
    List<InventoryItem> findByHospitalId(@Param("hid") Integer hospitalId);
}
