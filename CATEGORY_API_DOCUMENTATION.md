# Category API Documentation

## Tổng Quan

Category API cung cấp các endpoint để quản lý danh mục sản phẩm. Hệ thống bao gồm:

- **Model**: Category với các trường: name, slug, description, image, isActive
- **Controller**: Xử lý logic CRUD và các thao tác khác
- **Routes**: 9 endpoint để quản lý danh mục
- **Middleware**: Authentication và kiểm tra quyền Admin

## Cấu Trúc Model Category

```javascript
{
  _id: ObjectId,
  name: String (required, unique, 3-100 chars),
  slug: String (auto-generated từ name, unique, lowercase),
  description: String (max 500 chars),
  image: String (đường dẫn file trong uploads/categories),
  isActive: Boolean (default: true),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

## Các Endpoint

### 1. Public Routes (Không cần xác thực)

#### 1.1 Lấy danh mục hoạt động
```
GET /api/categories/active
```

**Response (200 OK):**
```json
{
  "message": "Active categories retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Điện Tử",
      "slug": "dien-tu",
      "description": "Các sản phẩm điện tử công nghệ cao",
      "image": "/uploads/categories/category-1712234567-123456789.jpg",
      "isActive": true,
      "createdAt": "2024-04-04T10:00:00.000Z",
      "updatedAt": "2024-04-04T10:00:00.000Z"
    }
  ]
}
```

#### 1.2 Lấy danh mục theo slug
```
GET /api/categories/slug/:slug
```

**Example:** `GET /api/categories/slug/dien-tu`

**Response (200 OK):**
```json
{
  "message": "Category retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện Tử",
    "slug": "dien-tu",
    "description": "Các sản phẩm điện tử công nghệ cao",
    "image": "/uploads/categories/category-1712234567-123456789.jpg",
    "isActive": true,
    "createdAt": "2024-04-04T10:00:00.000Z",
    "updatedAt": "2024-04-04T10:00:00.000Z"
  }
}
```

### 2. Protected Routes (Cần xác thực)

Yêu cầu header:
```
Authorization: Bearer <your_token>
```

#### 2.1 Lấy tất cả danh mục
```
GET /api/categories
```

**Response (200 OK):**
```json
{
  "message": "Categories retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Điện Tử",
      "slug": "dien-tu",
      "description": "Các sản phẩm điện tử công nghệ cao",
      "image": "/uploads/categories/category-1712234567-123456789.jpg",
      "isActive": true,
      "createdAt": "2024-04-04T10:00:00.000Z",
      "updatedAt": "2024-04-04T10:00:00.000Z"
    }
  ]
}
```

#### 2.2 Lấy danh mục theo ID
```
GET /api/categories/:id
```

**Example:** `GET /api/categories/507f1f77bcf86cd799439011`

**Response (200 OK):**
```json
{
  "message": "Category retrieved successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện Tử",
    "slug": "dien-tu",
    "description": "Các sản phẩm điện tử công nghệ cao",
    "image": "/uploads/categories/category-1712234567-123456789.jpg",
    "isActive": true,
    "createdAt": "2024-04-04T10:00:00.000Z",
    "updatedAt": "2024-04-04T10:00:00.000Z"
  }
}
```

### 3. Admin Routes (Chỉ Admin)

Yêu cầu:
- Authorization header với admin token
- User phải có role **admin**

#### 3.1 Tạo danh mục (không có ảnh)
```
POST /api/categories
```

**Request Body (JSON):**
```json
{
  "name": "Điện Tử",
  "description": "Các sản phẩm điện tử công nghệ cao"
}
```

**Response (201 Created):**
```json
{
  "message": "Category created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện Tử",
    "slug": "dien-tu",
    "description": "Các sản phẩm điện tử công nghệ cao",
    "image": null,
    "isActive": true,
    "createdAt": "2024-04-04T10:00:00.000Z",
    "updatedAt": "2024-04-04T10:00:00.000Z"
  }
}
```

#### 3.2 Tạo danh mục (có ảnh)
```
POST /api/categories
Content-Type: multipart/form-data
```

**Form Data:**
- `name`: "Thời Trang" (text)
- `description`: "Quần áo, giày dép..." (text)
- `image`: [file] (image file)

**Response (201 Created):**
```json
{
  "message": "Category created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Thời Trang",
    "slug": "thoi-trang",
    "description": "Quần áo, giày dép và phụ kiện thời trang",
    "image": "/uploads/categories/category-1712234568-234567890.jpg",
    "isActive": true,
    "createdAt": "2024-04-04T10:05:00.000Z",
    "updatedAt": "2024-04-04T10:05:00.000Z"
  }
}
```

#### 3.3 Cập nhật danh mục (không ảnh)
```
PUT /api/categories/:id
```

**Request Body (JSON):**
```json
{
  "name": "Điện Tử - Cập nhật",
  "description": "Mô tả mới"
}
```

**Response (200 OK):**
```json
{
  "message": "Category updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện Tử - Cập nhật",
    "slug": "dien-tu-cap-nhat",
    "description": "Mô tả mới",
    "image": "/uploads/categories/category-1712234567-123456789.jpg",
    "isActive": true,
    "createdAt": "2024-04-04T10:00:00.000Z",
    "updatedAt": "2024-04-04T10:15:00.000Z"
  }
}
```

#### 3.4 Cập nhật danh mục (có ảnh)
```
PUT /api/categories/:id
Content-Type: multipart/form-data
```

**Form Data:**
- `name`: "Thời Trang - Cập nhật" (text)
- `description`: "Mô tả mới" (text)
- `image`: [file] (image file)

**Response (200 OK):**
```json
{
  "message": "Category updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Thời Trang - Cập nhật",
    "slug": "thoi-trang-cap-nhat",
    "description": "Mô tả mới",
    "image": "/uploads/categories/category-1712234569-345678901.jpg",
    "isActive": true,
    "createdAt": "2024-04-04T10:05:00.000Z",
    "updatedAt": "2024-04-04T10:20:00.000Z"
  }
}
```

#### 3.5 Xóa danh mục
```
DELETE /api/categories/:id
```

**Response (200 OK):**
```json
{
  "message": "Category deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện Tử - Cập nhật",
    "slug": "dien-tu-cap-nhat",
    "description": "Mô tả mới",
    "image": "/uploads/categories/category-1712234567-123456789.jpg",
    "isActive": true,
    "createdAt": "2024-04-04T10:00:00.000Z",
    "updatedAt": "2024-04-04T10:15:00.000Z"
  }
}
```

#### 3.6 Thay đổi trạng thái danh mục
```
PATCH /api/categories/:id/toggle-status
```

**Response (200 OK):**
```json
{
  "message": "Category status updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Điện Tử - Cập nhật",
    "slug": "dien-tu-cap-nhat",
    "description": "Mô tả mới",
    "image": "/uploads/categories/category-1712234567-123456789.jpg",
    "isActive": false,
    "createdAt": "2024-04-04T10:00:00.000Z",
    "updatedAt": "2024-04-04T10:25:00.000Z"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message"
}
```

**Ví dụ:**
- `"Category name is required"`
- `"Category already exists"`

### 401 Unauthorized
```json
{
  "error": "No token provided" / "Invalid token" / "Token expired"
}
```

### 403 Forbidden
```json
{
  "error": "Only admin can access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Category not found"
}
```

### 409 Conflict
```json
{
  "error": "Category name already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Error message"
}
```

## Quy Tắc Slug

- Slug được tự động sinh từ tên danh mục
- Slug là duy nhất (unique) trong hệ thống
- Các ký tự đặc biệt được chuyển đổi thành gạch ngang
- Hỗ trợ tiếng Việt

**Ví dụ:**
- `"Điện Tử"` → `"dien-tu"`
- `"Thời Trang"` → `"thoi-trang"`
- `"Sắc Đẹp & Chăm Sóc"` → `"sac-dep-cham-soc"`

## Quy Tắc Upload Ảnh

### Cấu hình:
- **Thư mục**: `uploads/categories/`
- **Loại file**: JPEG, PNG, GIF, WebP
- **Kích thước tối đa**: 5MB
- **Định dạng tên**: `category-[timestamp]-[random].ext`

### Ví dụ Ảnh URL:
```
/uploads/categories/category-1712234567123456789-987654321.jpg
```

## Quy Tắc Quyền Hạn

### Public Routes:
- ✅ Lấy danh mục hoạt động
- ✅ Lấy danh mục theo slug

### Protected Routes (Cần authentication):
- ✅ Lấy tất cả danh mục
- ✅ Lấy danh mục theo ID

### Admin Routes (Cần admin role):
- ✅ Tạo danh mục
- ✅ Cập nhật danh mục
- ✅ Xóa danh mục
- ✅ Thay đổi trạng thái

## Test Data Mẫu

Dưới đây là một số category dữ liệu mẫu:

```json
[
  {
    "name": "Điện Tử",
    "description": "Các sản phẩm điện tử công nghệ cao"
  },
  {
    "name": "Thời Trang",
    "description": "Quần áo, giày dép và phụ kiện thời trang"
  },
  {
    "name": "Sách & Báo",
    "description": "Sách, báo, tạp chí và các ấn phẩm khác"
  },
  {
    "name": "Đồ Ăn & Thức Uống",
    "description": "Thực phẩm, thức uống và các sản phẩm liên quan"
  },
  {
    "name": "Thể Thao & Ngoài Trời",
    "description": "Dụng cụ thể thao và các sản phẩm ngoài trời"
  }
]
```

## Sử Dụng Postman

### 1. Import Collection
- Mở Postman
- Click `Import`
- Chọn file `CATEGORY_POSTMAN_COLLECTION.json`

### 2. Thiết lập Variables
Cập nhật các biến trong tab `Variables`:

```
baseUrl: http://localhost:5000
token: <your_user_token>
adminToken: <your_admin_token>
categoryId: <category_id>
```

### 3. Testing Flow

**A. Public Testing (Không cần token):**
1. GET Active Categories
2. GET Category By Slug

**B. Authenticated Testing (Cần user token):**
1. GET All Categories
2. GET Category By ID

**C. Admin Testing (Cần admin token):**
1. Create Category (Without Image)
2. Create Category (With Image)
3. Update Category
4. Toggle Category Status
5. Delete Category

## Lưu Ý

1. **Token**: Lấy token từ endpoint `/api/auth/register` hoặc `/api/auth/login`
2. **Admin Role**: User cần có role `admin` để access admin routes
3. **Slug Unique**: Tên danh mục phải duy nhất
4. **Image Optional**: Ảnh không bắt buộc khi tạo/cập nhật danh mục
5. **Validation**: 
   - Tên danh mục: 3-100 ký tự
   - Mô tả: tối đa 500 ký tự
   - Ảnh: tối đa 5MB

## Folder Structure

```
├── models/
│   └── Category.js              # Schema danh mục
├── controllers/
│   └── categoryController.js     # Logic xử lý
├── routes/
│   └── categoryRoutes.js         # Các endpoint
├── middleware/
│   ├── checkAdminMiddleware.js  # Kiểm tra admin
│   └── categoryUploadMiddleware.js # Upload ảnh
├── uploads/
│   └── categories/              # Thư mục lưu ảnh
├── CATEGORY_POSTMAN_COLLECTION.json  # Postman test
└── CATEGORY_API_DOCUMENTATION.md     # Tài liệu này
```
