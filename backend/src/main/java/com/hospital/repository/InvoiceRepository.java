package com.hospital.repository;

import com.hospital.model.Invoice;
import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvoiceRepository extends CrudRepository<Invoice, Integer> {
    @Query("SELECT * FROM invoices WHERE hospital_id = :hid")
    List<Invoice> findByHospitalId(@Param("hid") Integer hospitalId);
}
