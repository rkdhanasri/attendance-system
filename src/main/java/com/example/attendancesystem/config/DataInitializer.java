package com.example.attendancesystem.config;

import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("DataInitializer running...");

        if (userRepository.findByUsername("admin") != null) {
            System.out.println("Admin user already exists. Skipping initialization.");
            return;
        }

        User adminUser = new User();
        adminUser.setUsername("admin");
        adminUser.setPassword(passwordEncoder.encode("admin123"));
        adminUser.setRole("ADMIN");
        adminUser.setMainAdmin(true);
        userRepository.save(adminUser);

        System.out.println("Created main admin user 'admin / admin123'");
    }
}
