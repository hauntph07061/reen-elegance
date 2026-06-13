package com.greenelegance.api.controller;

import com.greenelegance.api.dto.AuthRequest;
import com.greenelegance.api.dto.AuthResponse;
import com.greenelegance.api.dto.UserProfileDTO;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.UserRepository;
import com.greenelegance.api.security.JwtUtil;
import com.greenelegance.api.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) {
        try {
            // Xác thực tài khoản / mật khẩu
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Tên đăng nhập hoặc mật khẩu không chính xác.");
        }

        // Lấy thông tin user và tạo Token
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        
        User user = (User) userDetails;

        return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getRole(), user.getFullName()));
    }

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails) principal).getUsername();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }
        throw new RuntimeException("Unauthorized");
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMyProfile() {
        return ResponseEntity.ok(getCurrentUser());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDTO dto) {
        User user = getCurrentUser();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhone(dto.getPhone());
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> payload) {
        User user = getCurrentUser();
        String currentPassword = payload.get("currentPassword");
        String newPassword = payload.get("newPassword");

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mật khẩu hiện tại không đúng."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Đổi mật khẩu thành công."));
    }
}
