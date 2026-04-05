# Order API Documentation

## Overview

API quản lý đơn hàng (Order) với đầy đủ chức năng CRUD (Create, Read, Update, Delete). Hỗ trợ:

- Tạo đơn hàng từ giỏ hàng
- Xem các đơn hàng của người dùng
- Cập nhật thông tin đơn hàng
- Hủy đơn hàng
- Quản lý trạng thái đơn hàng (Admin)
- Thống kê đơn hàng (Admin)

## Base URL

```
http://localhost:5000/api/orders
```

## Authentication

Tất cả các endpoint yêu cầu token JWT trong header:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. Tạo Đơn Hàng (Create Order)

**POST** `/`

**Required Headers:**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "items": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2
    },
    {
      "product": "PRODUCT_ID2",
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
  "notes": "Ghi chú thêm (tùy chọn)"
}
```

**Response (201 Created):**

```json
{
  "message": "Order created successfully",
  "order": {
    "_id": "ORDER_ID",
    "user": {
      "_id": "USER_ID",
      "username": "user1",
      "email": "user@example.com",
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "avatar": "avatar.jpg"
    },
    "items": [
      {
        "product": {
          "_id": "PRODUCT_ID",
          "name": "Product 1",
          "price": 100000,
          "image": "product.jpg"
        },
        "quantity": 2,
        "price": 100000,
        "subtotal": 200000
      }
    ],
    "totalAmount": 200000,
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
    "paymentStatus": "pending",
    "orderStatus": "pending",
    "notes": "Ghi chú thêm",
    "trackingNumber": null,
    "cancelReason": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Lấy Danh Sách Đơn Hàng Của Người Dùng (Get User Orders)

**GET** `/me`

**Query Parameters:**

- `status` (optional): Filter by order status (pending, processing, shipped, delivered, cancelled)
- `page` (optional, default: 1): Số trang
- `limit` (optional, default: 10): Số item trên một trang

**Example URL:**

```
GET /api/orders/me?status=pending&page=1&limit=10
```

**Response (200 OK):**

```json
{
  "orders": [
    {
      "_id": "ORDER_ID",
      "user": {
        "_id": "USER_ID",
        "username": "user1",
        "email": "user@example.com",
        "fullName": "Nguyễn Văn A",
        "phone": "0912345678",
        "avatar": "avatar.jpg"
      },
      "items": [...],
      "totalAmount": 200000,
      "shippingAddress": {...},
      "paymentMethod": "cash_on_delivery",
      "paymentStatus": "pending",
      "orderStatus": "pending",
      "notes": "Ghi chú",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

---

### 3. Lấy Chi Tiết Đơn Hàng (Get Order Detail)

**GET** `/me/:id`

**Example URL:**

```
GET /api/orders/me/ORDER_ID
```

**Response (200 OK):**

```json
{
  "_id": "ORDER_ID",
  "user": {...},
  "items": [...],
  "totalAmount": 200000,
  "shippingAddress": {...},
  "paymentMethod": "cash_on_delivery",
  "paymentStatus": "pending",
  "orderStatus": "pending",
  "notes": "Ghi chú",
  "trackingNumber": null,
  "cancelReason": null,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 4. Cập Nhật Đơn Hàng (Update Order)

**PUT** `/me/:id`

**Request Body** (User chỉ có thể cập nhật một số trường):

```json
{
  "shippingAddress": {
    "fullName": "Nguyễn Văn A",
    "phone": "0912345699",
    "address": "456 Đường XYZ",
    "city": "TP. Hồ Chí Minh",
    "district": "Quận 2",
    "ward": "Phường 2",
    "postalCode": "700002"
  },
  "notes": "Ghi chú cập nhật",
  "paymentMethod": "credit_card"
}
```

**Response (200 OK):**

```json
{
  "message": "Order updated successfully",
  "order": {...}
}
```

---

### 5. Hủy Đơn Hàng (Cancel Order)

**PATCH** `/me/:id/cancel`

**Request Body:**

```json
{
  "cancelReason": "Tôi muốn hủy đơn hàng này"
}
```

**Response (200 OK):**

```json
{
  "message": "Order cancelled successfully",
  "order": {
    "_id": "ORDER_ID",
    "orderStatus": "cancelled",
    "cancelReason": "Tôi muốn hủy đơn hàng này",
    ...
  }
}
```

**Note:** Chỉ có thể hủy các đơn hàng ở trạng thái pending, processing. Không thể hủy các đơn hàng đã shipped, delivered hoặc cancelled.

---

### 6. Lấy Danh Sách Tất Cả Đơn Hàng (Admin)

**GET** `/`

**Required Permission:** `view_orders`

**Query Parameters:**

- `status` (optional): Filter by order status
- `paymentStatus` (optional): Filter by payment status (pending, completed, failed, refunded)
- `page` (optional, default: 1): Số trang
- `limit` (optional, default: 10): Số item trên một trang

**Example URL:**

```
GET /api/orders?status=processing&paymentStatus=completed&page=1&limit=20
```

**Response (200 OK):**

```json
{
  "orders": [...],
  "pagination": {
    "current": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

### 7. Lấy Thống Kê Đơn Hàng (Admin)

**GET** `/stats`

**Required Permission:** `view_orders`

**Response (200 OK):**

```json
{
  "orders": [
    {
      "_id": "pending",
      "count": 10,
      "totalAmount": 5000000
    },
    {
      "_id": "processing",
      "count": 5,
      "totalAmount": 2500000
    },
    {
      "_id": "shipped",
      "count": 20,
      "totalAmount": 10000000
    },
    {
      "_id": "delivered",
      "count": 150,
      "totalAmount": 75000000
    },
    {
      "_id": "cancelled",
      "count": 8,
      "totalAmount": 4000000
    }
  ],
  "payments": [
    {
      "_id": "pending",
      "count": 10
    },
    {
      "_id": "completed",
      "count": 165
    },
    {
      "_id": "failed",
      "count": 5
    },
    {
      "_id": "refunded",
      "count": 3
    }
  ]
}
```

---

### 8. Cập Nhật Trạng Thái Đơn Hàng (Admin)

**PATCH** `/:id/status`

**Required Permission:** `update_orders`

**Request Body:**

```json
{
  "orderStatus": "shipped",
  "paymentStatus": "completed",
  "trackingNumber": "TRACK123456"
}
```

**Response (200 OK):**

```json
{
  "message": "Order status updated successfully",
  "order": {
    "_id": "ORDER_ID",
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "trackingNumber": "TRACK123456",
    ...
  }
}
```

---

### 9. Cập Nhật Đơn Hàng (Admin)

**PUT** `/:id`

**Required Permission:** `update_orders`

**Request Body** (Admin có thể cập nhật tất cả các trường):

```json
{
  "shippingAddress": {...},
  "notes": "Ghi chú từ admin",
  "paymentMethod": "bank_transfer",
  "orderStatus": "processing",
  "paymentStatus": "completed",
  "trackingNumber": "TRACK123456",
  "cancelReason": null
}
```

**Response (200 OK):**

```json
{
  "message": "Order updated successfully",
  "order": {...}
}
```

---

### 10. Hủy Đơn Hàng (Admin)

**PATCH** `/:id/cancel`

**Required Permission:** `update_orders`

**Request Body:**

```json
{
  "cancelReason": "Hủy do lỗi hệ thống"
}
```

**Response (200 OK):**

```json
{
  "message": "Order cancelled successfully",
  "order": {...}
}
```

---

### 11. Xóa Đơn Hàng (Admin)

**DELETE** `/:id`

**Required Permission:** `delete_orders`

**Note:** Chỉ có thể xóa các đơn hàng ở trạng thái pending hoặc cancelled.

**Response (200 OK):**

```json
{
  "message": "Order deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Order must contain at least one item"
}
```

### 401 Unauthorized

```json
{
  "error": "Token is not valid"
}
```

### 403 Forbidden

```json
{
  "error": "Access denied - You do not have permission to perform this action"
}
```

### 404 Not Found

```json
{
  "error": "Order not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error message"
}
```

---

## Order Status Flow

```
pending -> processing -> shipped -> delivered
   |           |
   └─── cancelled ───┘
```

- **pending:** Đơn hàng vừa được tạo
- **processing:** Đơn hàng đang được xử lý
- **shipped:** Đơn hàng đã được gửi
- **delivered:** Đơn hàng đã được giao
- **cancelled:** Đơn hàng bị hủy

---

## Payment Methods

- `credit_card`: Thẻ tín dụng
- `debit_card`: Thẻ ghi nợ
- `bank_transfer`: Chuyển khoản ngân hàng
- `cash_on_delivery`: Thanh toán khi nhận hàng
- `paypal`: PayPal

---

## Payment Status

- `pending`: Đang chờ thanh toán
- `completed`: Đã thanh toán
- `failed`: Thanh toán thất bại
- `refunded`: Đã hoàn tiền

---

## Required Permissions

| Endpoint                 | Permission       |
| ------------------------ | ---------------- |
| Create Order             | None (user only) |
| Get User Orders          | None             |
| Get Order Detail (own)   | None             |
| Update Order (own)       | None             |
| Cancel Order (own)       | None             |
| Get All Orders           | `view_orders`    |
| Get Order Statistics     | `view_orders`    |
| Get Order Detail (admin) | `view_orders`    |
| Update Order (admin)     | `update_orders`  |
| Update Order Status      | `update_orders`  |
| Cancel Order (admin)     | `update_orders`  |
| Delete Order             | `delete_orders`  |

---

## Integration with Cart

Khi tạo đơn hàng thành công:

1. Sản phẩm được trừ khỏi kho (stock)
2. Giỏ hàng của người dùng sẽ được xóa rỗng

---

## Examples

### Example 1: Tạo đơn hàng từ giỏ hàng

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": "507f1f77bcf86cd799439011",
        "quantity": 2
      },
      {
        "product": "507f1f77bcf86cd799439012",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "fullName": "Nguyễn Văn A",
      "phone": "0912345678",
      "address": "123 Đường ABC",
      "city": "TP. Hồ Chí Minh"
    },
    "paymentMethod": "cash_on_delivery"
  }'
```

### Example 2: Lấy đơn hàng của người dùng

```bash
curl -X GET "http://localhost:5000/api/orders/me?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example 3: Cập nhật trạng thái đơn hàng (Admin)

```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "orderStatus": "shipped",
    "paymentStatus": "completed",
    "trackingNumber": "VN123456"
  }'
```

### Example 4: Hủy đơn hàng

```bash
curl -X PATCH http://localhost:5000/api/orders/me/ORDER_ID/cancel \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cancelReason": "Thay đổi ý định"
  }'
```
