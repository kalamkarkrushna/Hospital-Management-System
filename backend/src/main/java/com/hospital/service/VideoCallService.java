package com.hospital.service;

import com.hospital.model.VideoCall;
import com.hospital.repository.VideoCallRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VideoCallService {
    private final VideoCallRepository repository;

    public VideoCallService(VideoCallRepository repository) {
        this.repository = repository;
    }

    public List<VideoCall> getAll(int hospitalId) {
        return repository.findByHospitalId(hospitalId);
    }

    public Optional<VideoCall> getById(int id, int hospitalId) {
        return repository.findById(id).filter(v -> v.getHospitalId() == hospitalId);
    }

    public VideoCall create(VideoCall call) {
        return repository.save(call);
    }

    public VideoCall update(int id, VideoCall updated, int hospitalId) {
        VideoCall existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Video call not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Video call not found");
        if (updated.getPatientId() != null) existing.setPatientId(updated.getPatientId());
        if (updated.getDoctorId() != null) existing.setDoctorId(updated.getDoctorId());
        if (updated.getScheduledDate() != null) existing.setScheduledDate(updated.getScheduledDate());
        if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
        if (updated.getMeetingLink() != null) existing.setMeetingLink(updated.getMeetingLink());
        return repository.save(existing);
    }

    public void delete(int id, int hospitalId) {
        VideoCall existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Video call not found"));
        if (existing.getHospitalId() != hospitalId) throw new IllegalArgumentException("Video call not found");
        repository.deleteById(id);
    }
}
