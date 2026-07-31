package com.hospital.controller;

import com.hospital.config.HospitalUserPrincipal;
import com.hospital.model.User;
import com.hospital.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getUsers(Authentication auth) {
        var principal = (HospitalUserPrincipal) auth.getPrincipal();
        return userRepository.findByHospitalId(principal.hospitalId());
    }

    @PostMapping("/users")
    public Map<String, String> addUser(@RequestBody Map<String, String> body, Authentication auth) {
        var principal = (HospitalUserPrincipal) auth.getPrincipal();
        User user = new User();
        user.setHospitalId(principal.hospitalId());
        user.setName(body.get("name"));
        user.setEmail(body.get("email"));
        user.setPassword(body.get("password"));
        String role = body.getOrDefault("role", "STAFF");
        if (!Set.of("ADMIN", "STAFF").contains(role)) {
            return Map.of("error", "Invalid role. Must be ADMIN or STAFF");
        }
        user.setRole(role);
        userRepository.save(user);
        return Map.of("message", "User added");
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @RequestBody Map<String, String> body, Authentication auth) {
        var principal = (HospitalUserPrincipal) auth.getPrincipal();
        var opt = userRepository.findById(id);
        if (opt.isEmpty() || opt.get().getHospitalId() != principal.hospitalId()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        User user = opt.get();
        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));
        if (body.containsKey("password") && !body.get("password").isEmpty()) user.setPassword(body.get("password"));
        if (body.containsKey("role")) {
            String newRole = body.get("role");
            if (!Set.of("ADMIN", "STAFF").contains(newRole)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid role. Must be ADMIN or STAFF"));
            }
            user.setRole(newRole);
        }
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User updated"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id, Authentication auth) {
        var principal = (HospitalUserPrincipal) auth.getPrincipal();
        var opt = userRepository.findById(id);
        if (opt.isEmpty() || opt.get().getHospitalId() != principal.hospitalId()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }
        if (opt.get().getId() == principal.userId()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot delete yourself"));
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted"));
    }

    @GetMapping("/me")
    public Map<String, Object> me(Authentication auth) {
        var principal = (HospitalUserPrincipal) auth.getPrincipal();
        Map<String, Object> m = new HashMap<>();
        m.put("userId", principal.userId());
        m.put("hospitalId", principal.hospitalId());
        m.put("role", principal.role());
        return m;
    }
}
