# Shopping Cart API Documentation

## Overview
Simple shopping cart system for managing user shopping carts.

## API Endpoints

All endpoints require authentication (JWT token in Authorization header).

### 1. Get Cart
**Endpoint:** `GET /api/cart`

**Description:** Retrieve the current user's cart

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "price": 100000,
          "inventory": 50,
          "image": "product.jpg"
        },
        "quantity": 2,
        "price": 100000
      }
    ],
    "totalPrice": 200000,
    "createdAt": "2026-04-04T...",
    "updatedAt": "2026-04-04T..."
  }
}
```

---

### 2. Add to Cart
**Endpoint:** `POST /api/cart/add`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

**Description:** 
- Add a new product to cart or increase quantity if already exists
- Checks product existence and inventory
- Calculates total price automatically

**Response:** Returns updated cart

---

### 3. Update Cart Item
**Endpoint:** `POST /api/cart/update`

**Request Body:**
```json
{
  "productId": "product_id",
  "quantity": 5
}
```

**Description:**
- Update quantity of an item in cart
- If quantity = 0, item is removed automatically
- Checks inventory availability

**Response:** Returns updated cart

---

### 4. Remove from Cart
**Endpoint:** `DELETE /api/cart/remove/:productId`

**Description:** Remove a specific product from cart

**Response:** Returns updated cart

---

### 5. Clear Cart
**Endpoint:** `DELETE /api/cart/clear`

**Description:** Remove all items from cart

**Response:**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": {
    "_id": "cart_id",
    "user": "user_id",
    "items": [],
    "totalPrice": 0
  }
}
```

---

## Error Responses

```json
{
  "message": "Error description"
}
```

Common errors:
- `400` - Invalid product or quantity
- `404` - Product not found / Cart not found
- `400` - Not enough inventory
- `401` - Unauthorized (missing/invalid token)

---

## Features

✅ Add/Update/Remove items  
✅ Automatic inventory validation  
✅ Real-time total price calculation  
✅ User-specific carts  
✅ Product details in response  
✅ Simple & lightweight  

---

## Usage Example

```bash
# Get cart
curl -H "Authorization: Bearer TOKEN" http://localhost:5000/api/cart

# Add to cart
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"507f1f77bcf86cd799439011","quantity":2}'

# Update cart
curl -X POST http://localhost:5000/api/cart/update \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"507f1f77bcf86cd799439011","quantity":5}'

# Remove from cart
curl -X DELETE http://localhost:5000/api/cart/remove/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer TOKEN"

# Clear cart
curl -X DELETE http://localhost:5000/api/cart/clear \
  -H "Authorization: Bearer TOKEN"
```
