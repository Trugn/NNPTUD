# 📋 Hướng dẫn Assign Role bằng Postman

## 🚀 Các bước chuẩn bị

### 1️⃣ Import Collection vào Postman

1. Mở **Postman**
2. Click **Collections** → **Import**
3. Chọn file `POSTMAN_ROLE_ASSIGNMENT.json`
4. Click **Import**

✅ Collection `NNPTUD - Role Assignment API` sẽ được import

---

### 2️⃣ Thiết lập Environment Variables

1. Click **Environments** (góc trái)
2. Click **+** để tạo mới hoặc chọn environment hiện tại
3. Thêm các biến:

| Variable | Value | Mô tả |
|----------|-------|-------|
| `base_url` | `http://localhost:5000` | URL server |
| `access_token` | `` | JWT token (sẽ được set sau login) |
| `userId` | `` | ID user cần assign role |
| `verificationToken` | `` | Email verification token |

4. Click **Save**

---

## 📝 Các bước tạo Admin Account

### **Bước 1: Register Admin User**

1. Mở collection `NNPTUD - Role Assignment API`
2. Chọn request **"1. Register Admin User"**
3. Click **Send**

**Response:**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin_user",
    "email": "admin@example.com",
    ...
  },
  "verificationToken": "abc123xyz..."
}
```

✅ Copy `verificationToken` từ response

---

### **Bước 2: Lưu Verification Token**

1. Vào **Environments** 
2. Set `verificationToken` = giá trị từ step 1
3. Click **Save**

---

### **Bước 3: Verify Email**

1. Chọn request **"2. Verify Email"**
2. Click **Send**

**Response:**
```json
{
  "message": "Email verified successfully",
  "user": {
    "isVerified": true,
    ...
  }
}
```

✅ Email đã được xác minh

---

### **Bước 4: Login**

1. Chọn request **"3. Login as Admin User"**
2. Click **Send**

**Response:**
```json
{
  "message": "Login successful",
  "user": {...},
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "..."
}
```

✅ Copy `accessToken`

---

### **Bước 5: Lưu Access Token**

1. Vào **Environments**
2. Set `access_token` = giá trị từ step 4
3. Click **Save**

---

### **Bước 6: Lấy All Users**

1. Chọn request **"4. Get All Users"**
2. Click **Send**

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin_user",
    "email": "admin@example.com",
    "roles": ["507f191e810c19729de860e1"],
    ...
  },
  ...
]
```

✅ Copy `_id` của user (chính là admin_user)

---

### **Bước 7: Lưu User ID**

1. Vào **Environments**
2. Set `userId` = ID từ step 6
3. Click **Save**

---

### **Bước 8: Assign Admin Role**

1. Chọn request **"5. Assign Admin Role to User"**
2. Kiểm tra body:
   ```json
   {
     "roleName": "admin"
   }
   ```
3. Click **Send**

**Response:**
```json
{
  "message": "User role changed to 'admin' successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin_user",
    "email": "admin@example.com",
    "roles": [
      {
        "_id": "507f191e810c19729de860e1",
        "name": "admin",
        "displayName": "Administrator",
        "permissions": [...]
      }
    ]
  }
}
```

✅ **Admin account tạo thành công!** 🎉

---

## 🔄 Gán Role khác

### Thay đổi Role của User

1. **Change to Moderator:**
   - Chọn request **"6. Assign Moderator Role to User"**
   - Click **Send**

2. **Change to User:**
   - Chọn request **"7. Assign User Role to User"**
   - Click **Send**

3. **Change to Guest:**
   - Chọn request **"8. Assign Guest Role to User"**
   - Click **Send**

---

## 📌 Lưu ý quan trọng

### ✅ Danh sách Role có sẵn:
- `admin` - Toàn quyền
- `moderator` - Quyền hạn chế
- `user` - User thường
- `guest` - Quyền tối thiểu

### ⚠️ Lỗi có thể gặp:

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-----------|---------|
| `401 Unauthorized` | Không có token hoặc token hết hạn | Login lại & copy token mới |
| `404 User not found` | User ID không đúng | Kiểm tra ID từ "Get All Users" |
| `404 Role not found` | Role name không tồn tại | Kiểm tra tên role: admin, moderator, user, guest |
| `403 Forbidden` | Không có quyền assign role | Phải dùng admin account |

### 🔐 Permissions của mỗi Role:

**Admin:**
- create_user, read_user, update_user, delete_user
- manage_roles, manage_permissions
- view_logs, export_data

**Moderator:**
- read_user, update_user, view_logs

**User:**
- read_user

**Guest:**
- (Không có)

---

## 🛠️ Troubleshooting

### MongoDB chưa có roles?

Chạy:
```bash
npm run seed
```

### Token hết hạn?

Login lại và copy token mới vào environment

### Quên userId?

Gọi **"4. Get All Users"** để lấy ID

---

## ✨ Tóm tắt nhanh

```
1. Register → Verify Email → Login → Get Token
2. Copy Token vào Environment
3. Get All Users → Copy User ID vào Environment
4. Assign Role (chọn request phù hợp) → Send
5. Done! ✅
```

---

## 📚 Response Examples

### ✅ Thành công (Status: 200)
```json
{
  "message": "User role changed to 'admin' successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "admin_user",
    "email": "admin@example.com",
    "roles": [{"name": "admin", ...}]
  }
}
```

### ❌ Lỗi (Status: 400/401/404/500)
```json
{
  "error": "Role 'superadmin' not found"
}
```

---

**Bạn cần trợ giúp thêm? Hỏi tôi! 🚀**
