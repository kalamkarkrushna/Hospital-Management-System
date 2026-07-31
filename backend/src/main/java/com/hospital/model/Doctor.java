package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("Doctors")
public class Doctor {
    @Id
    private Integer id;
    private String name;
    private String specialization;

    @Column("hospital_id")
    private Integer hospitalId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public Integer getHospitalId() { return hospitalId; }
    public void setHospitalId(Integer hospitalId) { this.hospitalId = hospitalId; }
}
