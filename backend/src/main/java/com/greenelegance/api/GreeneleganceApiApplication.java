package com.greenelegance.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class GreeneleganceApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GreeneleganceApiApplication.class, args);
	}

	@Bean
	public CommandLineRunner dataLoader(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			userRepository.findByUsername("admin").ifPresent(admin -> {
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setIsActive(true); // Đảm bảo luôn kích hoạt
				userRepository.save(admin);
			});
		};
	}
}
