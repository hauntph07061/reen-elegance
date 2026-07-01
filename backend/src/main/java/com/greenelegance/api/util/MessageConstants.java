package com.greenelegance.api.util;

public class MessageConstants {
    // Bank Account
    public static final String BANK_ACCOUNT_NOT_FOUND = "Account not found";

    // Category
    public static final String CATEGORY_NOT_FOUND = "Category not found";
    public static final String CATEGORY_HAS_PRODUCTS = "Không thể xóa danh mục đang có sản phẩm.";

    // Contact
    public static final String CONTACT_NOT_FOUND = "Contact not found with id: ";

    // Image Upload / Proof
    public static final String FILE_EMPTY = "File tải lên không được rỗng!";
    public static final String FILE_STORAGE_CREATE_ERROR = "Could not create the directory where the uploaded files will be stored.";
    public static final String FILE_IS_EMPTY = "File is empty.";

    // Order
    public static final String PRODUCT_OUT_OF_STOCK_TEMPLATE = "Sản phẩm '%s' không đủ số lượng trong kho!";
    public static final String PRODUCT_NOT_FOUND_ID = "Không tìm thấy sản phẩm có ID: ";
    public static final String ORDER_NOT_FOUND_CODE = "Không tìm thấy đơn hàng với mã: ";
    public static final String ORDER_NOT_FOUND_ID = "Không tìm thấy đơn hàng với ID: ";
    public static final String POINTS_EARNED_DESCRIPTION = "Cộng điểm từ Đơn hàng #";

    // Product
    public static final String PRODUCT_NOT_FOUND_SLUG = "Sản phẩm không tồn tại: ";
    public static final String PRODUCT_NOT_FOUND = "Sản phẩm không tồn tại";

    // User
    public static final String USERNAME_ALREADY_EXISTS = "Tên đăng nhập đã tồn tại!";
    public static final String USER_NOT_FOUND = "Không tìm thấy tài khoản";
    public static final String ADMIN_DELETE_ERROR = "Không thể khóa/xóa tài khoản Super Admin!";
}
