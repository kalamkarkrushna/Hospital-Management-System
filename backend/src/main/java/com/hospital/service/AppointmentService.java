package com.hospital.service;

import com.hospital.model.Appointment;
import com.hospital.repository.AppointmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public String bookAppointment(int patientId, int doctorId, String date, int hospitalId) {
        if (!patientRepository.existsById(patientId)) {
            return "Patient does not exist";
        }
        if (!doctorRepository.existsById(doctorId)) {
            return "Doctor does not exist";
        }
        if (appointmentRepository.countByDoctorIdAndDateAndHospitalId(doctorId, date, hospitalId) > 0) {
            return "Doctor not available on this date";
        }
        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        appointment.setDoctorId(doctorId);
        appointment.setAppointmentDate(date);
        appointment.setHospitalId(hospitalId);
        appointmentRepository.save(appointment);
        return "Appointment booked successfully";
    }

    public List<Appointment> getAllAppointments(int hospitalId) {
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public String cancelAppointment(int id, int hospitalId) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (existing.getHospitalId() != hospitalId) {
            throw new IllegalArgumentException("Appointment not found");
        }

        appointmentRepository.deleteById(id);
        return "Appointment cancelled successfully";
    }

    public String rescheduleAppointment(int id, String newDate, int hospitalId) {
        Appointment existing = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (existing.getHospitalId() != hospitalId) {
            throw new IllegalArgumentException("Appointment not found");
        }

        int doctorId = existing.getDoctorId();
        if (appointmentRepository.countByDoctorIdAndDateAndHospitalId(doctorId, newDate, hospitalId) > 0) {
            return "Doctor not available on this date";
        }

        existing.setAppointmentDate(newDate);
        appointmentRepository.save(existing);
        return "Appointment rescheduled successfully";
    }
}
