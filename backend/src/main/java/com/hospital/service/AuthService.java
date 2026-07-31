package com.hospital.service;

import com.hospital.model.Hospital;
import com.hospital.model.Subscription;
import com.hospital.model.User;
import com.hospital.repository.HospitalRepository;
import com.hospital.repository.SubscriptionRepository;
import com.hospital.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, HospitalRepository hospitalRepository,
                       SubscriptionRepository subscriptionRepository, JwtService jwtService,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.hospitalRepository = hospitalRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public Map<String, Object> register(String hospitalName, String name, String email,
                                         String password, String phone) {
        if (userRepository.findByEmail(email).isPresent()) {
            return Map.of("error", "Email already registered");
        }

        Hospital hospital = new Hospital();
        hospital.setName(hospitalName);
        hospital.setEmail(email);
        hospital.setPhone(phone);
        hospital = hospitalRepository.save(hospital);

        Subscription sub = new Subscription();
        sub.setHospitalId(hospital.getId());
        sub.setPlan("FREE");
        sub.setStatus("ACTIVE");
        sub.setStartDate(LocalDate.now().toString());
        subscriptionRepository.save(sub);

        User user = new User();
        user.setHospitalId(hospital.getId());
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("ADMIN");
        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), hospital.getId(), user.getRole(), email);
        return Map.of("token", token, "role", user.getRole(), "hospitalId", hospital.getId(),
                "hospitalName", hospital.getName(), "userName", user.getName());
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return Map.of("error", "Invalid email or password");
        }

        Hospital hospital = hospitalRepository.findById(user.getHospitalId()).orElse(null);
        String token = jwtService.generateToken(user.getId(), user.getHospitalId(), user.getRole(), email);

        return Map.of("token", token, "role", user.getRole(), "hospitalId", user.getHospitalId(),
                "hospitalName", hospital != null ? hospital.getName() : "", "userName", user.getName());
    }
}
