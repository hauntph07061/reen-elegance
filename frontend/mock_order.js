const testOrder = {
  fullName: "Nguyễn Văn Shipper",
  phone: "0987123456",
  email: "khachhang@example.com",
  province: "Hà Nội",
  district: "Cầu Giấy",
  ward: "Dịch Vọng Hậu",
  addressDetail: "Số 10, Ngõ 123 Xuân Thủy",
  deliveryDate: "2026-06-10",
  deliveryTimeSlot: "14:00 - 16:00",
  cardMessage: "Chúc mừng sinh nhật mẹ yêu",
  paymentMethod: "COD",
  items: [
    { productId: 1, quantity: 2 },
    { productId: 2, quantity: 1 }
  ]
};

fetch("http://localhost:8080/api/v1/orders", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(testOrder)
})
  .then(r => r.json())
  .then(data => console.log("✅ Tạo đơn hàng thành công:", data))
  .catch(err => console.error("❌ Lỗi tạo đơn:", err));
