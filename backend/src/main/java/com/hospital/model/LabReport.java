package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("lab_reports")
public class LabReport {
    @Id private Integer id;
    private Integer patientId;
    private Integer doctorId;
    private String testName;
    private String result;
    private String notes;
    private String reportDate;
    @Column("hospital_id") private Integer hospitalId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }
    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public String getReportDate() { return reportDate; }
    public void setReportDate(String reportDate) { this.reportDate = reportDate; }
    public Integer getHospitalId() { return hospitalId; }
    public void setHospitalId(Integer hospitalId) { this.hospitalId = hospitalId; }
}
