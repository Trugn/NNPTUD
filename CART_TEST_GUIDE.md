# 🛒 Hướng dẫn Test Shopping Cart

## 📋 Prerequisites
- Server chạy trên `http://localhost:5000`
- Postman đã cài đặt
- Database MongoDB kết nối

---

## 🚀 Các bước test

### **Bước 1: Tạo tài khoản Admin**

**Endpoint:** `POST /api/auth/register`

```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123",
  "fullName": "Admin User"
}
```

**Response mong đợi (201):**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "_id": "user_id_here",
      "username": "admin",
      "email": "admin@example.com",
      "fullName": "Admin User"
    },
    "verificationToken": "token_here"
  }
}
```

✅ **Lưu lại:** `user_id` và `verificationToken`

---

### **Bước 2: Xác thực Email**

**Endpoint:** `POST /api/auth/verify-email`

```json
{
  "email": "admin@example.com",
  "token": "YOUR_VERIFICATION_TOKEN_HERE"
}
```

**Thay `YOUR_VERIFICATION_TOKEN_HERE` bằng token nhận ở Bước 1**

**Response mong đợi (200):**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### **Bước 3: Đăng nhập - Lấy Admin Token**

**Endpoint:** `POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Response mong đợi (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id_here",
      "username": "admin",
      "email": "admin@example.com",
      "roles": ["admin"]
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "refresh_token_here"
  }
}
```

✅ **Lưu lại:** `accessToken` (dùng cho tất cả request tiếp theo)

---

### **Bước 4: Lấy danh sách sản phẩm (để lấy Product ID)**

**Endpoint:** `GET /api/products`

**Header:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id_1",
      "name": "Product 1",
      "price": 150000,
      "inventory": 50
    },
    {
      "_id": "product_id_2",
      "name": "Product 2",
      "price": 200000,
      "inventory": 30
    }
  ]
}
```

✅ **Lưu lại:** Một `product_id` bất kỳ (hoặc tạo sản phẩm mới)

---

### **Bước 5: Tạo sản phẩm test (nếu chưa có)**

**Endpoint:** `POST /api/products`

```json
{
  "name": "Test Product",
  "description": "This is a test product",
  "price": 150000,
  "inventory": 100,
  "category": "507f1f77bcf86cd799439013"
}
```

➡️ Lấy category ID từ GET `/api/categories`

---

## 🛒 **Test Shopping Cart API**

### **Test 1: Xem giỏ hàng rỗng**

**Endpoint:** `GET /api/cart`

**Header:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response mong đợi:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalPrice": 0
  }
}
```

---

### **Test 2: Thêm sản phẩm vào giỏ**

**Endpoint:** `POST /api/cart/add`

**Header:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 2
}
```

**Response mong đợi (200):**
```json
{
  "success": true,
  "message": "Product added to cart",
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Test Product",
          "price": 150000,
          "inventory": 100
        },
        "quantity": 2,
        "price": 150000
      }
    ],
    "totalPrice": 300000
  }
}
```

✅ **Kiểm tra:** `totalPrice = 150000 * 2 = 300000` ✓

---

### **Test 3: Thêm lại sản phẩm (test cộng số lượng)**

**Endpoint:** `POST /api/cart/add`

**Body:**
```json
{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 3
}
```

**Response mong đợi:**
- Quantity tăng từ 2 lên 5
- totalPrice = 150000 * 5 = 750000

```json
{
  "totalPrice": 750000,
  "items": [
    {
      "quantity": 5,
      "price": 150000
    }
  ]
}
```

✅ **Kiểm tra:** Số lượng được cộng dồn (2 + 3 = 5) ✓

---

### **Test 4: Cập nhật số lượng sản phẩm**

**Endpoint:** `POST /api/cart/update`

**Body:**
```json
{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 8
}
```

**Response mong đợi:**
```json
{
  "totalPrice": 1200000,
  "items": [
    {
      "quantity": 8,
      "price": 150000
    }
  ]
}
```

✅ **Kiểm tra:** Quantity = 8, totalPrice = 150000 * 8 = 1200000 ✓

---

### **Test 5: Cập nhật quantity = 0 (auto remove)**

**Endpoint:** `POST /api/cart/update`

**Body:**
```json
{
  "productId": "YOUR_PRODUCT_ID",
  "quantity": 0
}
```

**Response mong đợi:**
```json
{
  "items": [],
  "totalPrice": 0
}
```

✅ **Kiểm tra:** Sản phẩm bị xóa tự động ✓

---

### **Test 6: Xoá sản phẩm khỏi giỏ**

**Endpoint:** `DELETE /api/cart/remove/YOUR_PRODUCT_ID`

**Header:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response mong đợi:**
```json
{
  "success": true,
  "message": "Product removed from cart",
  "data": {
    "items": [],
    "totalPrice": 0
  }
}
```

---

### **Test 7: Thêm nhiều sản phẩm**

**Bước 1:** Add Product 1
```json
{
  "productId": "product_1_id",
  "quantity": 2
}
```

**Bước 2:** Add Product 2
```json
{
  "productId": "product_2_id",
  "quantity": 3
}
```

**Response mong đợi:**
```json
{
  "items": [
    {
      "product": { "_id": "product_1_id", "price": 150000 },
      "quantity": 2
    },
    {
      "product": { "_id": "product_2_id", "price": 200000 },
      "quantity": 3
    }
  ],
  "totalPrice": 900000  // 150000*2 + 200000*3
}
```

✅ **Kiểm tra:** totalPrice đúng ✓

---

### **Test 8: Clear giỏ hàng**

**Endpoint:** `DELETE /api/cart/clear`

**Header:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Response mong đợi:**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": {
    "items": [],
    "totalPrice": 0
  }
}
```

---

## 📌 Sử dụng Postman Collection

### **Cách 1: Import Collection**
1. Mở Postman
2. Click **Import** → chọn file `CART_POSTMAN_COLLECTION.json`
3. Collection được thêm vào Postman

### **Cách 2: Environment Variables**
Postman tự động save:
- `ADMIN_TOKEN` - Token admin
- `ADMIN_ID` - ID admin  
- `PRODUCT_ID` - ID sản phẩm test

### **Cách 3: Test theo thứ tự**
1. Register Admin
2. Verify Email (dùng token từ bước 1)
3. Login Admin → `ADMIN_TOKEN` được save tự động
4. Create Test Product → `PRODUCT_ID` được save tự động
5. Test tất cả Shopping Cart endpoints

---

## ❌ Error Test

### **Test 1: Add với quantity < 1**
```json
{
  "productId": "product_id",
  "quantity": 0
}
```
**Response:** 400 - Invalid product or quantity

### **Test 2: Add product không tồn tại**
```json
{
  "productId": "invalid_id",
  "quantity": 1
}
```
**Response:** 404 - Product not found

### **Test 3: Add quá số lượng kho**
```json
{
  "productId": "product_id",
  "quantity": 1000000
}
```
**Response:** 400 - Not enough inventory

### **Test 4: Request không có Authorization**
**Response:** 401 - No token provided / Unauthorized

---

## 🎯 Tóm tắt Test Scenarios

| # | Scenario | Expected Result |
|---|----------|-----------------|
| 1 | Get cart rỗng | items = [], totalPrice = 0 |
| 2 | Add 1 product qty 2 | totalPrice = 300000 |
| 3 | Add lại qty 3 | qty tổng = 5, totalPrice = 750000 |
| 4 | Update qty = 8 | totalPrice = 1200000 |
| 5 | Update qty = 0 | Product removed, items = [] |
| 6 | Delete product | items = [], totalPrice = 0 |
| 7 | Add 2 products | totalPrice = 900000 |
| 8 | Clear cart | items = [], totalPrice = 0 |

---

## 💡 Tips

✅ **Lưu token sau login** - dùng cho tất cả request khác  
✅ **Thay thế VARIABLES** - `{{ADMIN_TOKEN}}`, `{{PRODUCT_ID}}`  
✅ **Check MongoDB** - xem cart được lưu không  
✅ **Test API offline** - dùng cURL hoặc Thunder Client  

---

## 🔧 Debug

**Nếu gặp lỗi:**

1. ✅ Server đang chạy? → `npm start` hoặc `node server.js`
2. ✅ MongoDB kết nối? → Check console output
3. ✅ Token hợp lệ? → Copy token chính xác từ login response
4. ✅ Product tồn tại? → GET /api/products để kiểm tra

---

**Chúc bạn test thành công!** 🚀
