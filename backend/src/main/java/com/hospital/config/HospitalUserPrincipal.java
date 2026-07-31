package com.hospital.config;

public record HospitalUserPrincipal(int userId, int hospitalId, String role) {
}
