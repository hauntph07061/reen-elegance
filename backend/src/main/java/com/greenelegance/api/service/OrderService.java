package com.greenelegance.api.service;

import com.greenelegance.api.dto.OrderCreationRequest;
import com.greenelegance.api.dto.OrderCreationResponse;
import com.greenelegance.api.dto.OrderItemRequest;
import com.greenelegance.api.entity.Order;
import com.greenelegance.api.entity.OrderItem;
import com.greenelegance.api.entity.Product;
import com.greenelegance.api.repository.OrderRepository;
import com.greenelegance.api.repository.ProductRepository;
import com.greenelegance.api.repository.UserRepository;
import com.greenelegance.api.repository.PointsLedgerRepository;
import com.greenelegance.api.repository.SettingRepository;
import com.greenelegance.api.entity.User;
import com.greenelegance.api.entity.PointsLedger;
import com.greenelegance.api.util.MessageConstants;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PointsLedgerRepository pointsLedgerRepository;
    private final SettingRepository settingRepository;
    private final PasswordEncoder passwordEncoder;
    private static final String UPLOAD_DIR = "./uploads";

    public String uploadProof(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException(MessageConstants.FILE_EMPTY);
        }

        // Tạo thư mục nếu chưa tồn tại
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Tạo tên file ngẫu nhiên để tránh trùng lặp
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        Path targetLocation = uploadPath.resolve(fileName);

        // Copy file
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        // Trả về đường dẫn ảo để frontend có thể hiển thị thông qua static resource mapper
        return "/uploads/" + fileName;
    }

    @Transactional
    public OrderCreationResponse createOrder(OrderCreationRequest request) {
        // Sinh mã đơn hàng duy nhất nếu chưa có (Thường sinh từ frontend và chuyển qua, hoặc backend sinh)
        String orderCode = request.getOrderCode() != null && !request.getOrderCode().trim().isEmpty()
                ? request.getOrderCode() 
                : generateOrderCode();

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Xử lý tài khoản Khách hàng
        boolean[] isNewUserHolder = {false};
        User customer = userRepository.findByUsername(request.getPhone())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(request.getPhone());
                    newUser.setFullName(request.getFullName());
                    newUser.setEmail(request.getEmail());
                    newUser.setPhone(request.getPhone());
                    newUser.setRole("CUSTOMER");
                    newUser.setPassword(passwordEncoder.encode(request.getPhone()));
                    isNewUserHolder[0] = true;
                    return userRepository.save(newUser);
                });

        // Tự động cập nhật thông tin liên lạc mới nhất của khách hàng nếu có thay đổi
        boolean needUpdate = false;
        if (!request.getFullName().equals(customer.getFullName())) {
            customer.setFullName(request.getFullName());
            needUpdate = true;
        }
        if (request.getEmail() != null && !request.getEmail().equals(customer.getEmail())) {
            customer.setEmail(request.getEmail());
            needUpdate = true;
        }
        if (customer.getPhone() == null) {
            customer.setPhone(request.getPhone());
            needUpdate = true;
        }

        if (needUpdate) {
            customer = userRepository.save(customer);
        }

        Order order = Order.builder()
                .user(customer)
                .orderCode(orderCode)
                .status("PENDING_CONFIRMATION")
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .province(request.getProvince())
                .district(request.getDistrict())
                .ward(request.getWard())
                .addressDetail(request.getAddressDetail())
                .deliveryDate(request.getDeliveryDate())
                .deliveryTimeSlot(request.getDeliveryTimeSlot())
                .cardMessage(request.getCardMessage())
                .paymentMethod(request.getPaymentMethod())
                .proofImagePath(request.getProofImagePath())
                .build();

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new RuntimeException(MessageConstants.PRODUCT_NOT_FOUND_ID + itemReq.getProductId()));

            // Kiểm tra số lượng tồn kho
            if (product.getStockQuantity() != null && product.getStockQuantity() < itemReq.getQuantity()) {
                throw new RuntimeException(String.format(MessageConstants.PRODUCT_OUT_OF_STOCK_TEMPLATE, product.getName()));
            }

            // Trừ tồn kho nếu có
            if (product.getStockQuantity() != null) {
                product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
                productRepository.save(product);
            }

            // Đơn giá lấy từ salePrice nếu có, ngược lại lấy regularPrice
            BigDecimal price = product.getSalePrice() != null ? product.getSalePrice() : product.getRegularPrice();
            BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(price)
                    .build();

            orderItems.add(orderItem);
        }

        // Tính phí giao hàng (miễn phí nếu đơn >= 500k)
        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(500000)) >= 0 
                ? BigDecimal.ZERO 
                : BigDecimal.valueOf(30000);

        BigDecimal grandTotal = subtotal.add(shippingFee);

        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setGrandTotal(grandTotal);
        order.setItems(orderItems);

        return new OrderCreationResponse(orderRepository.save(order), isNewUserHolder[0]);
    }

    private String generateOrderCode() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = String.format("%04d%02d%02d", now.getYear(), now.getMonthValue(), now.getDayOfMonth());
        int randomStr = (int) (1000 + Math.random() * 9000);
        return "LHD-" + dateStr + "-" + randomStr;
    }

    public Order getOrderByCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode)
                .orElseThrow(() -> new RuntimeException(MessageConstants.ORDER_NOT_FOUND_CODE + orderCode));
    }

    @Transactional(readOnly = true)
    public Page<Order> getOrders(Pageable pageable, String status, LocalDateTime startDate, LocalDateTime endDate, String keyword) {
        return orderRepository.findOrdersByFilters(status, startDate, endDate, keyword, pageable);
    }

    @Transactional(readOnly = true)
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(MessageConstants.ORDER_NOT_FOUND_ID + id));
    }

    @Transactional
    public Order updateOrderStatus(Long id, String newStatus) {
        Order order = getOrderById(id);
        String oldStatus = order.getStatus();
        
        order.setStatus(newStatus);
        Order savedOrder = orderRepository.save(order);
        
        // Cộng điểm thưởng nếu giao thành công (chỉ cộng 1 lần khi chuyển từ trạng thái khác sang DELIVERED)
        if ("DELIVERED".equals(newStatus) && !"DELIVERED".equals(oldStatus) && savedOrder.getUser() != null) {
            String rateStr = settingRepository.findBySettingKey("loyalty_earn_rate")
                                .map(s -> s.getSettingValue())
                                .orElse("10000");
            try {
                int earnRate = Integer.parseInt(rateStr);
                if (earnRate > 0) {
                    int pointsEarned = savedOrder.getGrandTotal().intValue() / earnRate;
                    if (pointsEarned > 0) {
                        User user = savedOrder.getUser();
                        user.setLoyaltyPoints(user.getLoyaltyPoints() + pointsEarned);
                        userRepository.save(user);
                        
                        PointsLedger ledger = PointsLedger.builder()
                                .user(user)
                                .order(savedOrder)
                                .pointsChange(pointsEarned)
                                .description(MessageConstants.POINTS_EARNED_DESCRIPTION + savedOrder.getOrderCode())
                                .build();
                        pointsLedgerRepository.save(ledger);
                    }
                }
            } catch (NumberFormatException e) {
                // Ignore if setting is invalid
            }
        }
        
        return savedOrder;
    }

    public byte[] exportOrdersToExcel(String status, LocalDateTime startDate, LocalDateTime endDate, String keyword) throws IOException {
        List<Order> orders = orderRepository.findAllOrdersByFilters(status, startDate, endDate, keyword);

        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Danh_sach_don_hang");

            // Header Font
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            // Header Style
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_GREEN.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerCellStyle.setAlignment(HorizontalAlignment.CENTER);

            // Create Header Row
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Mã Đơn", "Ngày Tạo", "Khách Hàng", "SĐT", "Khu Vực", "Tổng Tiền", "Trạng Thái"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerCellStyle);
            }

            // Create Data Style
            CellStyle dataCellStyle = workbook.createCellStyle();
            dataCellStyle.setAlignment(HorizontalAlignment.LEFT);

            int rowIdx = 1;
            for (Order order : orders) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(order.getOrderCode());
                row.createCell(1).setCellValue(order.getCreatedAt() != null ? order.getCreatedAt().toString() : "");
                row.createCell(2).setCellValue(order.getFullName());
                row.createCell(3).setCellValue(order.getPhone());
                row.createCell(4).setCellValue(order.getDistrict() + " - " + order.getProvince());
                row.createCell(5).setCellValue(order.getGrandTotal() != null ? order.getGrandTotal().doubleValue() : 0);
                row.createCell(6).setCellValue(order.getStatus());
            }

            // Auto-size columns
            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }
}
