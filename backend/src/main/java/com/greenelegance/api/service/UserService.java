package com.greenelegance.api.service;

import com.greenelegance.api.dto.UserDto;
import com.greenelegance.api.dto.admin.UserRequest;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.repository.UserRepository;
import com.greenelegance.api.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        
        // Fetch stats for all users in a single query to prevent N+1 queries
        List<Object[]> statsRaw = orderRepository.getUserOrderStats();
        Map<Long, Object[]> statsMap = statsRaw.stream()
                .collect(Collectors.toMap(
                        row -> (Long) row[0],
                        row -> row,
                        (existing, replacement) -> existing
                ));

        return users.stream()
                .map(user -> {
                    UserDto dto = mapToDtoBasic(user);
                    Object[] stats = statsMap.get(user.getId());
                    if (stats != null) {
                        dto.setTotalOrders(((Number) stats[1]).longValue());
                        dto.setTotalSpent(stats[2] != null ? new java.math.BigDecimal(stats[2].toString()) : java.math.BigDecimal.ZERO);
                    } else {
                        dto.setTotalOrders(0L);
                        dto.setTotalSpent(java.math.BigDecimal.ZERO);
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<com.greenelegance.api.entity.Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public UserDto createUser(UserRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "staff123"))
                .fullName(request.getFullName())
                .role(request.getRole() != null ? request.getRole() : "STAFF")
                .isActive(request.getIsActive() != null ? request.getIsActive() : true)
                .build();

        return mapToDto(userRepository.save(user));
    }

    public UserDto updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        // Không cho phép sửa tên đăng nhập để tránh rủi ro
        user.setFullName(request.getFullName());
        user.setRole(request.getRole());
        user.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return mapToDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));
        
        if ("admin".equals(user.getUsername())) {
            throw new RuntimeException("Không thể khóa/xóa tài khoản Super Admin!");
        }
        
        user.setIsActive(false);
        userRepository.save(user);
    }

    private UserDto mapToDtoBasic(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole());
        dto.setActive(user.getIsActive() != null && user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLoyaltyPoints(user.getLoyaltyPoints());
        return dto;
    }

    private UserDto mapToDto(User user) {
        UserDto dto = mapToDtoBasic(user);
        dto.setTotalOrders(orderRepository.countByUserId(user.getId()));
        dto.setTotalSpent(orderRepository.sumTotalSpentByUserId(user.getId()));
        return dto;
    }
}
