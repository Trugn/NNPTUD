# Order API - Testing Guide

## Overview

Hướng dẫn chi tiết để kiểm tra các endpoint của Order API

## Prerequisites

1. Server đang chạy: `npm start`
2. Token của user thường: `USER_TOKEN`
3. Token của admin: `ADMIN_TOKEN`
4. Product IDs từ database
5. Postman hoặc curl

## Setup

### 1. Chuẩn bị dữ liệu

- Đảm bảo có ít nhất 2 sản phẩm trong database với stock > 0
- Ghi lại Product IDs

### 2. Lấy Tokens

```bash
# Login user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Login admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

## Test Steps

### Test 1: Create Order (Tạo Đơn Hàng)

**Endpoint:** `POST /api/orders`

**Command:**

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID_1",
        "quantity": 2
      },
      {
        "product": "PRODUCT_ID_2",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường ABC",
      "city": "TP. Hồ Chí Minh",
      "district": "Quận 1",
      "ward": "Phường 1",
      "postalCode": "700001"
    },
    "paymentMethod": "cash_on_delivery",
    "notes": "Giao hàng vào buổi sáng nếu được"
  }'
```

**Expected Response (201):**

```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "ORDER_ID_1",
    "user": {...},
    "items": [...],
    "totalAmount": 300000,
    "orderStatus": "pending",
    "paymentStatus": "pending",
    ...
  }
}
```

**Verification:**

- [x] Order được tạo
- [x] Order status là "pending"
- [x] Payment status là "pending"
- [x] Tất cả items được lưu
- [x] Total amount chính xác

---

### Test 2: Create Order with Insufficient Stock

**Endpoint:** `POST /api/orders`

**Command:**

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "PRODUCT_ID_1",
        "quantity": 1000
      }
    ],
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường ABC",
      "city": "TP. Hồ Chí Minh"
    }
  }'
```

**Expected Response (400):**

```json
{
  "error": "Insufficient stock for product Product Name"
}
```

---

### Test 3: Get User's Orders

**Endpoint:** `GET /api/orders/me`

**Command:**

```bash
curl -X GET "http://localhost:5000/api/orders/me?page=1&limit=10" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response (200):**

```json
{
  "orders": [
    {
      "_id": "ORDER_ID_1",
      "user": {...},
      "totalAmount": 300000,
      "orderStatus": "pending",
      ...
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

**Verification:**

- [x] Chỉ hiển thị các order của user hiện tại
- [x] Pagination hoạt động đúng

---

### Test 4: Get User's Orders with Status Filter

**Endpoint:** `GET /api/orders/me?status=pending`

**Command:**

```bash
curl -X GET "http://localhost:5000/api/orders/me?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response (200):**

```json
{
  "orders": [
    {...}
  ],
  "pagination": {...}
}
```

**Verification:**

- [x] Chỉ hiển thị orders có status = pending

---

### Test 5: Get Order Detail

**Endpoint:** `GET /api/orders/me/:id`

**Command:**

```bash
curl -X GET http://localhost:5000/api/orders/me/ORDER_ID_1 \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response (200):**

```json
{
  "_id": "ORDER_ID_1",
  "user": {...},
  "items": [...],
  "totalAmount": 300000,
  "shippingAddress": {...},
  "paymentMethod": "cash_on_delivery",
  "orderStatus": "pending",
  "paymentStatus": "pending",
  ...
}
```

---

### Test 6: Get Order Detail - Unauthorized

**Endpoint:** `GET /api/orders/me/:other_user_order_id`

**Command:**

```bash
curl -X GET http://localhost:5000/api/orders/me/OTHER_USER_ORDER_ID \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response (403):**

```json
{
  "error": "Access denied"
}
```

---

### Test 7: Update Order

**Endpoint:** `PUT /api/orders/me/:id`

**Command:**

```bash
curl -X PUT http://localhost:5000/api/orders/me/ORDER_ID_1 \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0987654321",
      "address": "456 Đường XYZ",
      "city": "Hà Nội"
    },
    "notes": "Ghi chú mới"
  }'
```

**Expected Response (200):**

```json
{
  "message": "Order updated successfully",
  "order": {
    "_id": "ORDER_ID_1",
    "shippingAddress": {...},
    "notes": "Ghi chú mới",
    ...
  }
}
```

---

### Test 8: Update Order - After Shipped (Should Fail)

Trước tiên, update order status to "shipped" (Admin only), sau đó thử update:

**Command:**

```bash
curl -X PUT http://localhost:5000/api/orders/me/ORDER_ID_1 \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "New note"}'
```

**Expected Response (400):**

```json
{
  "error": "Cannot update order with current status"
}
```

---

### Test 9: Cancel Order

**Endpoint:** `PATCH /api/orders/me/:id/cancel`

**Command:**

```bash
curl -X PATCH http://localhost:5000/api/orders/me/ORDER_ID_1/cancel \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cancelReason": "Tôi muốn hủy đơn hàng"}'
```

**Expected Response (200):**

```json
{
  "message": "Order cancelled successfully",
  "order": {
    "_id": "ORDER_ID_1",
    "orderStatus": "cancelled",
    "cancelReason": "Tôi muốn hủy đơn hàng",
    ...
  }
}
```

**Verification:**

- [x] Order status thay đổi thành "cancelled"
- [x] Stock của sản phẩm được hoàn lại

---

### Test 10: Cancel Order - Already Delivered (Should Fail)

**Command:**

```bash
curl -X PATCH http://localhost:5000/api/orders/me/DELIVERED_ORDER_ID/cancel \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cancelReason": "Tôi muốn hủy"}'
```

**Expected Response (400):**

```json
{
  "error": "Cannot cancel order with current status"
}
```

---

### Test 11: Admin - Get All Orders

**Endpoint:** `GET /api/orders`

**Command:**

```bash
curl -X GET "http://localhost:5000/api/orders?page=1&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**

```json
{
  "orders": [...],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 5,
    "pages": 1
  }
}
```

**Verification:**

- [x] Hiển thị tất cả orders (không chỉ của user hiện tại)

---

### Test 12: Admin - Get All Orders with Filters

**Endpoint:** `GET /api/orders?status=pending&paymentStatus=completed`

**Command:**

```bash
curl -X GET "http://localhost:5000/api/orders?status=processing&paymentStatus=completed&page=1&limit=20" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**

```json
{
  "orders": [...],
  "pagination": {...}
}
```

---

### Test 13: Admin - Get Order Statistics

**Endpoint:** `GET /api/orders/stats`

**Command:**

```bash
curl -X GET http://localhost:5000/api/orders/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**

```json
{
  "orders": [
    {
      "_id": "pending",
      "count": 2,
      "totalAmount": 600000
    },
    {
      "_id": "processing",
      "count": 1,
      "totalAmount": 200000
    },
    {
      "_id": "cancelled",
      "count": 1,
      "totalAmount": 150000
    }
  ],
  "payments": [
    {
      "_id": "pending",
      "count": 3
    },
    {
      "_id": "completed",
      "count": 1
    }
  ]
}
```

---

### Test 14: Admin - Update Order Status

**Endpoint:** `PATCH /api/orders/:id/status`

**Command:**

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID_1/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "trackingNumber": "VN123456789"
  }'
```

**Expected Response (200):**

```json
{
  "message": "Order status updated successfully",
  "order": {
    "_id": "ORDER_ID_1",
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "trackingNumber": "VN123456789",
    ...
  }
}
```

---

### Test 15: Admin - Update Order

**Endpoint:** `PUT /api/orders/:id`

**Command:**

```bash
curl -X PUT http://localhost:5000/api/orders/ORDER_ID_1 \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderStatus": "processing",
    "paymentStatus": "pending",
    "notes": "Ghi chú từ admin"
  }'
```

**Expected Response (200):**

```json
{
  "message": "Order updated successfully",
  "order": {...}
}
```

---

### Test 16: Admin - Cancel Order

**Endpoint:** `PATCH /api/orders/:id/cancel`

**Command:**

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID_2/cancel \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cancelReason": "Hủy do lỗi hệ thống"}'
```

**Expected Response (200):**

```json
{
  "message": "Order cancelled successfully",
  "order": {...}
}
```

---

### Test 17: Admin - Delete Pending Order

**Endpoint:** `DELETE /api/orders/:id`

**Command:**

```bash
curl -X DELETE http://localhost:5000/api/orders/PENDING_ORDER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (200):**

```json
{
  "message": "Order deleted successfully"
}
```

**Verification:**

- [x] Order bị xóa khỏi database

---

### Test 18: Admin - Delete Shipped Order (Should Fail)

**Command:**

```bash
curl -X DELETE http://localhost:5000/api/orders/SHIPPED_ORDER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**Expected Response (400):**

```json
{
  "error": "Can only delete pending or cancelled orders"
}
```

---

## Error Cases to Test

| Test Case                             | Expected Status | Expected Response                             |
| ------------------------------------- | --------------- | --------------------------------------------- |
| Create order without items            | 400             | "Order must contain at least one item"        |
| Create order without shipping address | 400             | "Shipping address is required"                |
| Create order with insufficient stock  | 400             | "Insufficient stock for product {name}"       |
| Get other user's order as user        | 403             | "Access denied"                               |
| Update delivered order as user        | 400             | "Cannot update order with current status"     |
| Cancel delivered order                | 400             | "Cannot cancel order with current status"     |
| Delete shipped order                  | 400             | "Can only delete pending or cancelled orders" |
| Access without token                  | 401             | "Token is not valid"                          |
| Access with invalid permission        | 403             | "Access denied"                               |

---

## Using Postman

1. Import `ORDER_POSTMAN_COLLECTION.json`
2. Set variables:
   - `token`: Paste your user token
   - `admin_token`: Paste your admin token
3. Run các requests theo thứ tự

---

## Using Thunder Client

1. Import `ORDER_POSTMAN_COLLECTION.json` (Thunder Client hỗ trợ Postman format)
2. Set headers và parameters như cần thiết
3. Click Send

---

## Database Validation

Sau khi test, kiểm tra database để xác minh:

```javascript
// Xem orders
db.orders.find();

// Xem product stock sau khi tạo/hủy order
db.products.find();

// Xem user's cart sau khi tạo order (phải empty)
db.carts.findOne({ user: ObjectId("USER_ID") });
```

---

## Common Issues

### Issue 1: Token Invalid

**Solution:** Ensure token không hết hạn, copy đúng từ login response

### Issue 2: Product Not Found

**Solution:** Verify product IDs đúng, kiểm tra trong database

### Issue 3: Access Denied

**Solution:** Verify user có đúng roles/permissions

### Issue 4: Stock Not Updated

**Solution:** Recheck product stock sau khi tạo order

---

## Performance Testing

### Test High Load

```bash
# Tạo 100 orders
for i in {1..100}; do
  curl -X POST http://localhost:5000/api/orders \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{...}'
done
```

### Test Response Time

```bash
time curl -X GET "http://localhost:5000/api/orders?page=1&limit=100" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## Notes

- Tất cả timestamps là UTC
- Prices là số nguyên (tính bằng đồng)
- Order không thể update/delete khi status là shipped hoặc delivered
- Stock tự động hoàn lại khi order bị cancel
- Cart tự động clear khi order được tạo
