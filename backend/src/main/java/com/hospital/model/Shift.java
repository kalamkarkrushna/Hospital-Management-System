package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("shifts")
public class Shift {
    @Id private Integer id;
    private Integer userId;
    private String date;
    private String startTime;
    private String endTime;
    @Column("hospital_id") private Integer hospitalId;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }
    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }
    public Integer getHospitalId() { return hospitalId; }
    public void setHospitalId(Integer hospitalId) { this.hospitalId = hospitalId; }
}
