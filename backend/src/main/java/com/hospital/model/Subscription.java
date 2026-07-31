package com.hospital.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("subscriptions")
public class Subscription {
    @Id
    private Integer id;

    @Column("hospital_id")
    private Integer hospitalId;

    private String plan;
    private String status;

    @Column("start_date")
    private String startDate;

    @Column("end_date")
    private String endDate;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public Integer getHospitalId() { return hospitalId; }
    public void setHospitalId(Integer hospitalId) { this.hospitalId = hospitalId; }
    public String getPlan() { return plan; }
    public void setPlan(String plan) { this.plan = plan; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
}
