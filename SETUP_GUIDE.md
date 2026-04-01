# Backend Setup & Testing Guide

## 📋 Cách cài đặt step by step

### Step 1: Install Dependencies
```bash
npm install
```

Các package sẽ được cài:
- **express** - Web framework
- **mongoose** - MongoDB ORM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **multer** - File upload handling
- **cors** - CORS middleware
- **dotenv** - Environment variables

### Step 2: Cấu hình MongoDB
Đảm bảo MongoDB đang chạy. Ví dụ:
```bash
# Windows - Start MongoDB Service
net start MongoDB

# macOS - Start MongoDB with Homebrew
brew services start mongodb-community

# Or start manually
mongod
```

### Step 3: Cấu hình Environment Variables
Kiểm tra `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nnptud
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
```

### Step 4: Start Server
```bash
npm run dev
```

Kết quả:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

## 🧪 Testing API với Postman

### Postman Collection Setup

#### 1. Create Environment
```
Environment Name: NNPTUD Dev

Variables:
- base_url: http://localhost:5000
- access_token: (sẽ được set sau khi login)
- refresh_token: (sẽ được set sau khi login)
- user_id: (sẽ được set sau khi tạo user)
```

#### 2. Import Collection
Tạo requests như sau:

### 📝 Test Workflow

#### Phase 1: Authentication

##### Request 1: Register
```
POST {{base_url}}/api/auth/register
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "fullName": "Test User"
}
```

**Save:**
- `verificationToken` từ response

##### Request 2: Verify Email
```
POST {{base_url}}/api/auth/verify-email
Body (JSON):
{
  "token": "{{verificationToken}}"
}
```

##### Request 3: Login
```
POST {{base_url}}/api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "password123",
  "deviceName": "Postman"
}
```

**Save vào Postman Environment:**
- `access_token = {{accessToken}}`
- `refresh_token = {{refreshToken}}`
- `user_id = {{id}}`

#### Phase 2: User Profile

##### Request 4: Get Current User
```
GET {{base_url}}/api/users/me
Headers:
- Authorization: Bearer {{access_token}}
```

##### Request 5: Update Profile
```
PUT {{base_url}}/api/users/{{user_id}}
Headers:
- Authorization: Bearer {{access_token}}
Body (JSON):
{
  "fullName": "Test User Updated",
  "phone": "0123456789"
}
```

##### Request 6: Upload Avatar
```
POST {{base_url}}/api/users/upload-avatar
Headers:
- Authorization: Bearer {{access_token}}
Body (form-data):
- Key: avatar
- Value: [select image file]
```

#### Phase 3: Password Management

##### Request 7: Change Password
```
POST {{base_url}}/api/users/change-password
Headers:
- Authorization: Bearer {{access_token}}
Body (JSON):
{
  "currentPassword": "password123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

##### Request 8: Forgot Password
```
POST {{base_url}}/api/auth/forgot-password
Body (JSON):
{
  "email": "test@example.com"
}
```

**Save:**
- `resetToken` từ response

##### Request 9: Reset Password
```
POST {{base_url}}/api/auth/reset-password
Body (JSON):
{
  "token": "{{resetToken}}",
  "newPassword": "resetpassword123",
  "confirmPassword": "resetpassword123"
}
```

#### Phase 4: Token Management

##### Request 10: Refresh Token
```
POST {{base_url}}/api/auth/refresh-token
Body (JSON):
{
  "refreshToken": "{{refresh_token}}"
}
```

**Update Environment:**
- `access_token = {{new accessToken}}`
- `refresh_token = {{new refreshToken}}`

##### Request 11: Logout
```
POST {{base_url}}/api/users/logout
Headers:
- Authorization: Bearer {{access_token}}
Body (JSON):
{
  "refreshToken": "{{refresh_token}}"
}
```

## 🛠️ Debugging Tips

### Check Errors
```
Authorization header wrong?
→ Should be "Bearer <token>" not just "<token>"

Token expired?
→ Use refresh token to get new one

File upload failed?
→ Check file type (JPEG, PNG, GIF, WebP)
→ Check file size (max 5MB)
→ Check uploads/ folder exists

Database not found?
→ Check MongoDB is running
→ Check MONGODB_URI in .env
```

### View Logs
```bash
# In MongoDB compass or CLI
use nnptud
db.auditlogs.find().pretty()
db.loginattempts.find().pretty()
```

## 📱 cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "passwordConfirm": "password123",
    "fullName": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Current User
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Upload Avatar
```bash
curl -X POST http://localhost:5000/api/users/upload-avatar \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "avatar=@/path/to/image.jpg"
```

## 🔍 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` again |
| MongoDB connection failed | Check MongoDB is running, verify MONGODB_URI |
| CORS error | Ensure cors middleware is enabled in server.js |
| JWT validation failed | Check Authorization header format: `Bearer <token>` |
| File upload failed | Check file type and size |
| Port already in use | Change PORT in .env or kill process using port 5000 |
| Token expired | Use refresh token to get new access token |

## ✅ Verification Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Server starts without errors (`npm run dev`)
- [ ] Registry endpoint working (`GET /health`)
- [ ] Can register new user
- [ ] Can verify email
- [ ] Can login
- [ ] Can upload avatar
- [ ] Can view profile
- [ ] Can refresh token
- [ ] Can logout

## 🚀 Next Steps

1. **Setup Email Service:**
   - Configure nodemailer for sending verification & reset emails
   - Update forgot password to actually send email

2. **Add Role & Permission Management:**
   - Create endpoints to manage roles
   - Create endpoints to manage permissions
   - Assign roles to users

3. **Frontend Integration:**
   - Create React/Vue app to consume these APIs
   - Setup token storage (localStorage/sessionStorage)
   - Create auth context/store

4. **Production Deployment:**
   - Change JWT_SECRET
   - Setup proper MongoDB Atlas
   - Configure HTTPS
   - Setup email service
   - Setup environment for production

## 📚 Documentation Files

- `README.md` - Project overview
- `API_DOCUMENTATION.md` - Complete API reference
- `SETUP_GUIDE.md` - This file
