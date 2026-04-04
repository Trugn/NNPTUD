# 📮 Hướng dẫn Test API trên Postman

## 🚀 Setup Postman Environment

### 1. Import Collection
1. Mở Postman
2. Click "Import" → Chọn file `POSTMAN_COLLECTION.json`
3. Hoặc: Drag & drop file `POSTMAN_COLLECTION.json` vào Postman

### 2. Tạo Environment
1. Click "Environments" → "Create New"
2. Đặt tên: `NNPTUD Dev`
3. Thêm variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| base_url | http://localhost:5000 | http://localhost:5000 |
| access_token | (None) | (Sẽ được set sau login) |
| refresh_token | (None) | (Sẽ được set sau login) |
| user_id | (None) | (Sẽ được set sau register) |
| verification_token | (None) | (Sẽ được set sau register) |
| reset_token | (None) | (Sẽ được set sau forgot-password) |

4. Click "Save"
5. Chọn environment: Top-right → Select `NNPTUD Dev`

## 📝 Test Workflow Step-by-Step

### **Phase 1: Authentication**

#### Step 1: Register User
```
Folder: Authentication
Request: [1] Register User
Method: POST
```

**Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "fullName": "Test User"
}
```

**Save from Response:**
- Copy `verificationToken` từ response
- Paste vào Environment variable: `verification_token`

**Expected Response:**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User"
  },
  "verificationToken": "abc123..."
}
```

---

#### Step 2: Verify Email
```
Folder: Authentication
Request: [2] Verify Email
Method: POST
```

**Body:**
```json
{
  "token": "{{verification_token}}"
}
```

**Expected Response:**
```json
{
  "message": "Email verified successfully"
}
```

---

#### Step 3: Login
```
Folder: Authentication
Request: [3] Login
Method: POST
```

**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123",
  "deviceName": "Postman"
}
```

**Save from Response:**
- Copy `accessToken` → Paste to `access_token` environment variable
- Copy `refreshToken` → Paste to `refresh_token` environment variable  
- Copy `user.id` → Paste to `user_id` environment variable

**Expected Response:**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "xyz789...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User",
    "avatar": null,
    "roles": []
  }
}
```

---

### **Phase 2: User Profile Management**

#### Step 4: Get Current User
```
Folder: User Management
Request: [A] Get Current User
Method: GET
Header: Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
{
  "id": "...",
  "username": "testuser",
  "email": "test@example.com",
  "fullName": "Test User",
  "phone": null,
  "avatar": null,
  "isVerified": true,
  "isActive": true,
  "lastLogin": "2026-04-04T10:30:00.000Z",
  "roles": [],
  "createdAt": "2026-04-04T10:15:00.000Z",
  "updatedAt": "2026-04-04T10:30:00.000Z"
}
```

---

#### Step 5: Update Profile
```
Folder: User Management
Request: [B] Update Profile
Method: PUT
URL: {{base_url}}/api/users/{{user_id}}
Header: Authorization: Bearer {{access_token}}
```

**Body:**
```json
{
  "fullName": "Test User Updated",
  "phone": "0123456789"
}
```

**Expected Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User Updated",
    "phone": "0123456789",
    "avatar": null
  }
}
```

---

#### Step 6: Upload Avatar
```
Folder: User Management
Request: [D] Upload Avatar
Method: POST
Header: Authorization: Bearer {{access_token}}
```

**Body (form-data):**
- Key: `avatar`
- Type: `File`
- Value: Select image file (JPG, PNG, GIF, WebP - max 5MB)

**Expected Response:**
```json
{
  "message": "Avatar uploaded successfully",
  "avatar": "/uploads/avatars/avatar-1234567890-xyz.jpg",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "fullName": "Test User Updated",
    "avatar": "/uploads/avatars/avatar-1234567890-xyz.jpg"
  }
}
```

---

#### Step 7: Change Password
```
Folder: User Management
Request: [C] Change Password
Method: POST
Header: Authorization: Bearer {{access_token}}
```

**Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Expected Response:**
```json
{
  "message": "Password changed successfully"
}
```

---

### **Phase 3: Password Reset Flow**

#### Step 8: Forgot Password
```
Folder: Authentication
Request: [5] Forgot Password
Method: POST
```

**Body:**
```json
{
  "email": "test@example.com"
}
```

**Save from Response:**
- Copy `resetToken` → Paste to `reset_token` environment variable

**Expected Response:**
```json
{
  "message": "If email exists, password reset link will be sent",
  "resetToken": "reset123..."
}
```

---

#### Step 9: Reset Password
```
Folder: Authentication
Request: [6] Reset Password
Method: POST
```

**Body:**
```json
{
  "token": "{{reset_token}}",
  "newPassword": "resetpassword789",
  "confirmPassword": "resetpassword789"
}
```

**Expected Response:**
```json
{
  "message": "Password reset successful"
}
```

---

### **Phase 4: Token Management**

#### Step 10: Refresh Token
```
Folder: Authentication
Request: [4] Refresh Token
Method: POST
```

**Body:**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Save from Response:**
- Copy `accessToken` → Update `access_token` environment variable
- Copy `refreshToken` → Update `refresh_token` environment variable

**Expected Response:**
```json
{
  "accessToken": "new_eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "new_xyz789..."
}
```

---

#### Step 11: Logout
```
Folder: User Management
Request: [E] Logout
Method: POST
Header: Authorization: Bearer {{access_token}}
```

**Body:**
```json
{
  "refreshToken": "{{refresh_token}}"
}
```

**Expected Response:**
```json
{
  "message": "Logout successful"
}
```

---

### **Phase 5: Admin User Management** (Requires admin permissions)

#### Step 12: Get All Users
```
Folder: Admin - User Management
Request: [1] Get All Users
Method: GET
Header: Authorization: Bearer {{access_token}}
URL: {{base_url}}/api/users?page=1&limit=10&search=
```

**Expected Response:**
```json
{
  "users": [
    {
      "id": "...",
      "username": "testuser",
      "email": "test@example.com",
      ...
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

#### Step 13: Create User (Admin Only)
```
Folder: Admin - User Management
Request: [3] Create User (Admin)
Method: POST
Header: Authorization: Bearer {{access_token}}
```

**Body:**
```json
{
  "username": "admin_created_user",
  "email": "admin@example.com",
  "password": "password123",
  "fullName": "Admin Created User"
}
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "username": "admin_created_user",
    "email": "admin@example.com",
    "fullName": "Admin Created User"
  }
}
```

---

#### Step 14: Delete User (Admin Only)
```
Folder: Admin - User Management
Request: [4] Delete User (Admin)
Method: DELETE
Header: Authorization: Bearer {{access_token}}
URL: {{base_url}}/api/users/{{user_id}}
```

**Expected Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

#### Step 15: Toggle User Status (Admin Only)
```
Folder: Admin - User Management
Request: [5] Toggle User Status (Admin)
Method: PATCH
Header: Authorization: Bearer {{access_token}}
URL: {{base_url}}/api/users/{{user_id}}/toggle-status
```

**Expected Response:**
```json
{
  "message": "User activated/deactivated successfully",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "isActive": false
  }
}
```

---

### **System Check**

#### Health Check
```
Folder: System
Request: Health Check
Method: GET
URL: {{base_url}}/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 🐛 Troubleshooting

### "No token provided" Error
- **Solution:** Set Authorization header with `Bearer {{access_token}}`
- Check that `access_token` environment variable is set

### "Invalid token" Error
- **Solution:** Token might be expired, use refresh token to get new one
- Or login again to get new access token

### "Permission denied" Error
- **Solution:** Your account doesn't have required permissions
- Must be admin to access admin endpoints

### "Email or username already exists" Error
- **Solution:** Use different email/username
- Or delete previous user and try again

### File upload fails
- **Solution:** 
  - Check file format (JPEG, PNG, GIF, WebP only)
  - Check file size (max 5MB)
  - Make sure form-data key is `avatar`

### "EADDRINUSE" Error on server start
- **Solution:** Port 5000 already in use
- Change PORT in .env or kill process using port 5000

---

## 💡 Pro Tips

1. **Use Pre-request Scripts** - Auto-set timestamps or calculate values
2. **Use Post-request Scripts** - Auto-save tokens from responses
3. **Organize Collections** - Use folders for better organization
4. **Share Collections** - Export collection for team collaboration
5. **Mock Responses** - Set up mock servers for testing
6. **Monitor API Usage** - Track request/response times

---

## 📊 Request Checklist

Before each request:
- [ ] Environment is selected (`NNPTUD Dev`)
- [ ] Authorization header is correct (if needed)
- [ ] Body is in correct format (JSON or form-data)
- [ ] Variables are correctly set ({{variable}})
- [ ] Server is running (`npm run dev`)

---

**Test Status:** ✅ Ready to Test

Happy testing! 🎉
