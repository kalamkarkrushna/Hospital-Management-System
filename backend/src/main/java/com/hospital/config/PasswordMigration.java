package com.hospital.config;

import com.hospital.model.User;
import com.hospital.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class PasswordMigration implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public PasswordMigration(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        for (User user : userRepository.findAll()) {
            String pw = user.getPassword();
            if (pw != null && !pw.startsWith("$2a$") && !pw.startsWith("$2b$") && !pw.startsWith("$2y$")) {
                user.setPassword(passwordEncoder.encode(pw));
                userRepository.save(user);
                System.out.println("Migrated password for user: " + user.getEmail());
            }
        }
    }
}
