# Product API Documentation

## Overview

The Product API allows you to manage products in the system. This includes creating, reading, updating, deleting products, and managing product inventory.

## Base URL

```
http://localhost:3000/api/products
```

## Authentication

- Public endpoints: GET requests (no authentication required)
- Admin endpoints: POST, PUT, PATCH, DELETE requests (authentication + admin role required)

## Endpoints

### 1. Get All Products

**GET** `/`

Retrieve a list of all products with category and user information.

**Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
    "message": "Products retrieved successfully",
    "data": [
        {
            "_id": "60d5ec49c1234567890abcd1",
            "name": "Product 1",
            "description": "Product description",
            "price": 99.99,
            "inventory": 50,
            "sold": 10,
            "category": {
                "_id": "60d5ec49c1234567890abcd2",
                "name": "Category 1"
            },
            "image": "/uploads/products/product-1234567890.jpg",
            "user": {
                "_id": "60d5ec49c1234567890abcd3",
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ],
    "count": 1
}
```

---

### 2. Get Product by ID

**GET** `/:id`

Retrieve a specific product by its ID.

**Parameters:**

- `id` (string, required): Product ID

**Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
    "message": "Product retrieved successfully",
    "data": {
        "_id": "60d5ec49c1234567890abcd1",
        "name": "Product 1",
        "description": "Product description",
        "price": 99.99,
        "inventory": 50,
        "sold": 10,
        "category": {
            "_id": "60d5ec49c1234567890abcd2",
            "name": "Category 1",
            "description": "Category description"
        },
        "image": "/uploads/products/product-1234567890.jpg",
        "user": {
            "_id": "60d5ec49c1234567890abcd3",
            "name": "Admin User",
            "email": "admin@example.com",
            "avatar": "/uploads/avatars/avatar-123456.jpg"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

---

### 3. Get Products by Category

**GET** `/category/:categoryId`

Retrieve all products in a specific category.

**Parameters:**

- `categoryId` (string, required): Category ID

**Headers:**

```
Content-Type: application/json
```

**Response:**

```json
{
    "message": "Products retrieved successfully",
    "data": [
        {
            "_id": "60d5ec49c1234567890abcd1",
            "name": "Product 1",
            "description": "Product description",
            "price": 99.99,
            "inventory": 50,
            "sold": 10,
            "category": {
                "_id": "60d5ec49c1234567890abcd2",
                "name": "Category 1"
            },
            "image": "/uploads/products/product-1234567890.jpg",
            "user": {
                "_id": "60d5ec49c1234567890abcd3",
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        }
    ],
    "count": 1
}
```

---

### 4. Create Product

**POST** `/`

Create a new product. **Admin only**

**Headers:**

```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Body (form-data):**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| name | string | Yes | Product name (must be unique) |
| description | string | Yes | Product description |
| price | number | Yes | Product price (must be > 0) |
| inventory | number | Yes | Initial inventory quantity (must be >= 0) |
| category | string | Yes | Category ID |
| image | file | No | Product image (JPEG, PNG, GIF, WebP, max 5MB) |

**Example cURL:**

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=New Product" \
  -F "description=Product Description" \
  -F "price=99.99" \
  -F "inventory=50" \
  -F "category=60d5ec49c1234567890abcd2" \
  -F "image=@/path/to/image.jpg"
```

**Response:**

```json
{
    "message": "Product created successfully",
    "data": {
        "_id": "60d5ec49c1234567890abcd1",
        "name": "New Product",
        "description": "Product Description",
        "price": 99.99,
        "inventory": 50,
        "sold": 0,
        "category": {
            "_id": "60d5ec49c1234567890abcd2",
            "name": "Category 1"
        },
        "image": "/uploads/products/product-1234567890.jpg",
        "user": {
            "_id": "60d5ec49c1234567890abcd3",
            "name": "Admin User",
            "email": "admin@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

---

### 5. Update Product

**PUT** `/:id`

Update an existing product. **Admin only**

**Headers:**

```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Parameters:**

- `id` (string, required): Product ID

**Body (form-data):**
| Key | Type | Required | Description |
|-----|------|----------|-------------|
| name | string | No | Product name |
| description | string | No | Product description |
| price | number | No | Product price (must be > 0) |
| inventory | number | No | Inventory quantity (must be >= 0) |
| category | string | No | Category ID |
| image | file | No | Product image (JPEG, PNG, GIF, WebP, max 5MB) |

**Example cURL:**

```bash
curl -X PUT http://localhost:3000/api/products/60d5ec49c1234567890abcd1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Updated Product" \
  -F "price=109.99" \
  -F "image=@/path/to/image.jpg"
```

**Response:**

```json
{
    "message": "Product updated successfully",
    "data": {
        "_id": "60d5ec49c1234567890abcd1",
        "name": "Updated Product",
        "description": "Product Description",
        "price": 109.99,
        "inventory": 50,
        "sold": 0,
        "category": {
            "_id": "60d5ec49c1234567890abcd2",
            "name": "Category 1"
        },
        "image": "/uploads/products/product-1234567890.jpg",
        "user": {
            "_id": "60d5ec49c1234567890abcd3",
            "name": "Admin User",
            "email": "admin@example.com"
        },
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

---

### 6. Delete Product

**DELETE** `/:id`

Delete a product. **Admin only**

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Parameters:**

- `id` (string, required): Product ID

**Response:**

```json
{
    "message": "Product deleted successfully",
    "data": {
        "_id": "60d5ec49c1234567890abcd1",
        "name": "Deleted Product",
        "description": "Product Description",
        "price": 99.99,
        "inventory": 50,
        "sold": 0,
        "category": "60d5ec49c1234567890abcd2",
        "image": "/uploads/products/product-1234567890.jpg",
        "user": "60d5ec49c1234567890abcd3",
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
    }
}
```

---

### 7. Add Inventory

**PATCH** `/:id/add-inventory`

Add quantity to a product's inventory. **Admin only**

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Parameters:**

- `id` (string, required): Product ID

**Body (JSON):**

```json
{
    "quantity": 25
}
```

**Response:**

```json
{
    "message": "Inventory added successfully",
    "data": {
        "product": {
            "_id": "60d5ec49c1234567890abcd1",
            "name": "Product 1",
            "description": "Product description",
            "price": 99.99,
            "inventory": 75,
            "sold": 10,
            "category": {
                "_id": "60d5ec49c1234567890abcd2",
                "name": "Category 1"
            },
            "image": "/uploads/products/product-1234567890.jpg",
            "user": {
                "_id": "60d5ec49c1234567890abcd3",
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        },
        "previousInventory": 50,
        "addedQuantity": 25,
        "newInventory": 75
    }
}
```

---

### 8. Reduce Inventory

**PATCH** `/:id/reduce-inventory`

Reduce inventory when a product is sold. **Admin only**

**Headers:**

```
Content-Type: application/json
Authorization: Bearer <token>
```

**Parameters:**

- `id` (string, required): Product ID

**Body (JSON):**

```json
{
    "quantity": 5
}
```

**Response:**

```json
{
    "message": "Inventory reduced successfully",
    "data": {
        "product": {
            "_id": "60d5ec49c1234567890abcd1",
            "name": "Product 1",
            "description": "Product description",
            "price": 99.99,
            "inventory": 45,
            "sold": 15,
            "category": {
                "_id": "60d5ec49c1234567890abcd2",
                "name": "Category 1"
            },
            "image": "/uploads/products/product-1234567890.jpg",
            "user": {
                "_id": "60d5ec49c1234567890abcd3",
                "name": "Admin User",
                "email": "admin@example.com"
            },
            "createdAt": "2024-01-15T10:30:00.000Z",
            "updatedAt": "2024-01-15T10:30:00.000Z"
        },
        "previousInventory": 50,
        "reducedQuantity": 5,
        "newInventory": 45,
        "totalSold": 15
    }
}
```

---

## Error Responses

### 400 Bad Request

```json
{
    "error": "Name, description, price, inventory, and category are required"
}
```

### 404 Not Found

```json
{
    "error": "Product not found"
}
```

### 409 Conflict

```json
{
    "error": "Product name already exists"
}
```

### 401 Unauthorized

```json
{
    "error": "Token not provided or invalid"
}
```

### 403 Forbidden

```json
{
    "error": "Only admins can perform this action"
}
```

### 500 Internal Server Error

```json
{
    "error": "Internal server error message"
}
```

---

## Notes

- Product names must be unique
- Only authenticated users with admin role can create, update, or delete products
- All users can view products
- Inventory cannot be negative
- Price must be greater than 0
- Image uploads are limited to 5MB and must be in JPEG, PNG, GIF, or WebP format
- The `sold` field is automatically incremented when inventory is reduced
