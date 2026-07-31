package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("Appointments")
public class Appointment {
    @Id
    private Integer id;

    @Column("Patient_Id")
    private Integer patientId;

    @Column("Doctor_Id")
    private Integer doctorId;

    @Column("Appointment_Date")
    private String appointmentDate;

    @Column("hospital_id")
    private Integer hospitalId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }
    public Integer getHospitalId() { return hospitalId; }
    public void setHospitalId(Integer hospitalId) { this.hospitalId = hospitalId; }
}
