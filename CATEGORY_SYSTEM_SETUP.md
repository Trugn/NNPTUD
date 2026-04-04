# Category System - Hướng Dẫn Cài Đặt Nhanh

## 📋 Tóm Tắt

Hệ thống Category hoàn chỉnh đã được triển khai với:
- ✅ Model Category (name, slug, description, image, isActive)
- ✅ 9 Endpoints CRUD đầy đủ
- ✅ Authentication & Admin middleware
- ✅ Image upload (uploads/categories/)
- ✅ Auto-generate slug từ tên
- ✅ Postman Collection cho testing

## 📁 Files Được Tạo

```
models/
├── Category.js                          ← Model danh mục

controllers/
├── categoryController.js                ← Logic xử lý

routes/
├── categoryRoutes.js                    ← Các endpoints

middleware/
├── checkAdminMiddleware.js              ← Kiểm tra admin
├── categoryUploadMiddleware.js           ← Upload ảnh

uploads/
└── categories/                          ← Thư mục lưu ảnh

CATEGORY_POSTMAN_COLLECTION.json         ← Postman test
CATEGORY_API_DOCUMENTATION.md            ← Tài liệu đầy đủ
CATEGORY_SYSTEM_SETUP.md                 ← File này
```

## 🚀 Bước 1: Cài Đặt Dependency

```bash
npm install slugify
```

**Đã cài**: ✅ (Slugify đã được cài đặt)

## 🔧 Bước 2: Kiểm Tra Server

Server đã được cập nhật để hỗ trợ Category routes:

**File**: `server.js`
```javascript
const categoryRoutes = require('./routes/categoryRoutes');
app.use('/api/categories', categoryRoutes);
```

## 🧪 Bước 3: Testing với Postman

### 3.1 Import Collection
1. Mở Postman
2. Click: `File` → `Import`
3. Chọn: `CATEGORY_POSTMAN_COLLECTION.json`

### 3.2 Thiết lập Variables

Trong Postman, vào `Collections` → `Category API Collection` → `Variables`:

| Variable | Value | Ví Dụ |
|----------|-------|-------|
| `baseUrl` | URL server | `http://localhost:5000` |
| `token` | User token | Copy từ login response |
| `adminToken` | Admin token | Copy từ login response |
| `categoryId` | Category ID | Từ create/get response |

### 3.3 Flow Testing

#### A. Public Routes (Không cần token)
```
1. GET /api/categories/active
   └─ Response: Danh sách danh mục hoạt động

2. GET /api/categories/slug/dien-tu
   └─ Response: Chi tiết danh mục
```

#### B. Authenticated Routes (Cần user token)
```
1. GET /api/categories
   └─ Response: Tất cả danh mục

2. GET /api/categories/:id
   └─ Response: Chi tiết danh mục
```

#### C. Admin Routes (Cần admin token)
```
1. POST /api/categories
   ├─ Request: name, description
   └─ Response: Category mới được tạo

2. POST /api/categories (WITH IMAGE)
   ├─ Request: form-data (name, description, image)
   └─ Response: Category với ảnh

3. PUT /api/categories/:id
   ├─ Request: name, description, image?
   └─ Response: Category được cập nhật

4. PATCH /api/categories/:id/toggle-status
   └─ Response: Category status thay đổi

5. DELETE /api/categories/:id
   └─ Response: Category được xóa
```

## 📊 Test Data Mẫu (JSON)

### Tạo Category Mới
```json
{
  "name": "Điện Tử",
  "description": "Các sản phẩm điện tử công nghệ cao"
}
```

### Test Data Set
```json
[
  {
    "name": "Điện Tử",
    "description": "Các sản phẩm điện tử công nghệ cao"
  },
  {
    "name": "Thời Trang",
    "description": "Quần áo, giày dép và phụ kiện"
  },
  {
    "name": "Sách & Báo",
    "description": "Sách, báo, tạp chí"
  },
  {
    "name": "Đồ Ăn & Thức Uống",
    "description": "Thực phẩm, thức uống"
  },
  {
    "name": "Thể Thao & Ngoài Trời",
    "description": "Dụng cụ thể thao"
  }
]
```

## 🔑 API Endpoints

### Public (No Auth)
```
GET    /api/categories/active              ← Danh mục hoạt động
GET    /api/categories/slug/:slug          ← Theo slug
```

### Protected (Need Auth)
```
GET    /api/categories                     ← Tất cả
GET    /api/categories/:id                 ← Theo ID
```

### Admin (Need Admin Role)
```
POST   /api/categories                     ← Tạo
PUT    /api/categories/:id                 ← Cập nhật
DELETE /api/categories/:id                 ← Xóa
PATCH  /api/categories/:id/toggle-status   ← Toggle status
```

## 🖼️ Upload Ảnh

### Cấu Hình
- **Thư mục**: `uploads/categories/`
- **Loại**: JPEG, PNG, GIF, WebP
- **Kích thước**: Max 5MB
- **Tên file**: Auto-generated (category-[timestamp]-[random].ext)

### Postman Test Upload
1. Chọn request "Create Category (With Image)"
2. Click vào field `image`
3. Chọn "Select File"
4. Chọn ảnh từ máy tính (JPG, PNG, GIF, WebP)
5. Gửi request

Response sẽ chứa URL ảnh:
```json
{
  "message": "Category created successfully",
  "data": {
    "image": "/uploads/categories/category-1712234567-123456789.jpg"
  }
}
```

## 🔐 Security

- **Authentication**: JWT token (Bearer)
- **Authorization**: Role-based (Admin check)
- **Image Validation**: Type & size check
- **Slug Unique**: Prevent duplicates
- **Name Unique**: Prevent duplicates

## 📝 Model Schema

```javascript
{
  _id: ObjectId,
  name: String,                   // Danh mục name (3-100 chars, unique)
  slug: String,                   // Auto-generated từ name (unique)
  description: String,            // Mô tả (max 500 chars)
  image: String,                  // URL ảnh hoặc null
  isActive: Boolean,              // Default: true
  createdAt: DateTime,            // Auto
  updatedAt: DateTime             // Auto
}
```

## ✅ Verification Checklist

- [ ] Slugify package được cài đặt
- [ ] Category model tạo thành công
- [ ] Category controller hoạt động
- [ ] Category routes được đăng ký
- [ ] Admin middleware hoạt động
- [ ] uploads/categories folder tồn tại
- [ ] Server chạy bình thường
- [ ] Postman collection imported
- [ ] Public endpoints hoạt động
- [ ] Admin endpoints hoạt động

## 🐛 Troubleshooting

### Lỗi: "Only admin can access this resource"
→ Kiểm tra: User có role admin không?

### Lỗi: "Category already exists"
→ Kiểm tra: Tên danh mục đã tồn tại?

### Lỗi: "Invalid file type"
→ Kiểm tra: File có phải JPG, PNG, GIF, WebP không?

### Lỗi: "File too large"
→ Kiểm tra: File có vượt quá 5MB không?

### Lỗi: "No token provided"
→ Kiểm tra: Authorization header được gửi không? (Bearer token)

## 📚 Tài Liệu Chi Tiết

Xem file: `CATEGORY_API_DOCUMENTATION.md` để biết:
- Response examples chi tiết
- Error codes
- Validation rules
- Best practices

## 🎯 Tiếp Theo

1. Integrate Category vào Product model (reference Category)
2. Tạo Category filter cho Product list
3. Tạo Category management UI
4. Thêm Category soft delete
5. Thêm Category statistics

---

**Created**: April 4, 2026
**Version**: 1.0
**Status**: ✅ Ready to use
