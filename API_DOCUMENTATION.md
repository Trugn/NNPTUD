# NNPTUD Backend API - Complete Documentation

## 📁 Cấu trúc project

```
NNPTUD/
├── config/           # Database configuration
├── routes/           # API routes
│   ├── authRoutes.js          # Authentication endpoints
│   └── userRoutes.js          # User CRUD & profile
├── controllers/      # Business logic
│   ├── authController.js      # Auth logic
│   └── userController.js      # User logic
├── models/           # Database schemas
│   ├── User.js
│   ├── Role.js
│   ├── Permission.js
│   ├── RefreshToken.js
│   ├── Session.js
│   ├── PasswordReset.js
│   ├── EmailVerification.js
│   └── LoginAttempt.js
├── middleware/       # Middleware
│   ├── authMiddleware.js      # Token verification, permission check
│   └── uploadMiddleware.js    # File upload configuration
├── uploads/          # Uploaded files (avatars)
├── server.js         # Main file
├── package.json
├── .env
└── .gitignore
```

## 🚀 Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Setup MongoDB
- Ensure MongoDB is running on `localhost:27017`
- Or update `MONGODB_URI` in `.env`

### 3. Setup environment variables
```bash
# .env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nnptud
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
```

### 4. Run server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## 🔐 Authentication Endpoints

### 1. Register
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "fullName": "John Doe"
}

Response: 201
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "verificationToken": "..."
}
```

### 2. Verify Email
```
POST /api/auth/verify-email
Content-Type: application/json

Body:
{
  "token": "verification_token_from_email"
}

Response: 200
{
  "message": "Email verified successfully"
}
```

### 3. Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123",
  "deviceName": "iPhone 12"  // Optional
}

Response: 200
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "...",
  "user": {
    "id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "/uploads/avatars/...",
    "roles": [...]
  }
}
```

### 4. Logout
```
POST /api/users/logout
Authorization: Bearer <accessToken>
Content-Type: application/json

Body:
{
  "refreshToken": "refresh_token_from_login"
}

Response: 200
{
  "message": "Logout successful"
}
```

### 5. Refresh Token
```
POST /api/auth/refresh-token
Content-Type: application/json

Body:
{
  "refreshToken": "refresh_token_from_login"
}

Response: 200
{
  "accessToken": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

### 6. Forgot Password
```
POST /api/auth/forgot-password
Content-Type: application/json

Body:
{
  "email": "john@example.com"
}

Response: 200
{
  "message": "If email exists, password reset link will be sent",
  "resetToken": "..."  // For testing only
}
```

### 7. Reset Password
```
POST /api/auth/reset-password
Content-Type: application/json

Body:
{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response: 200
{
  "message": "Password reset successful"
}
```

## 👤 User Endpoints

### 1. Get Current User
```
GET /api/users/me
Authorization: Bearer <accessToken>

Response: 200
{
  "id": "...",
  "username": "...",
  "email": "...",
  "fullName": "...",
  "phone": "...",
  "avatar": "...",
  "isVerified": true,
  "isActive": true,
  "roles": [...],
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 2. Get All Users (Admin)
```
GET /api/users?page=1&limit=10&search=john
Authorization: Bearer <accessToken>

Response: 200
{
  "users": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "pages": 5
  }
}
```

### 3. Get User by ID
```
GET /api/users/:id
Authorization: Bearer <accessToken>

Response: 200
{
  "id": "...",
  "username": "...",
  "email": "...",
  "fullName": "...",
  "phone": "...",
  "avatar": "...",
  ...
}
```

### 4. Update User Profile
```
PUT /api/users/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

Body:
{
  "fullName": "John Doe Updated",
  "phone": "0123456789"
}

Response: 200
{
  "message": "User updated successfully",
  "user": {...}
}
```

### 5. Upload Avatar
```
POST /api/users/upload-avatar
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data

Body:
- file: [image file] (JPEG, PNG, GIF, WebP - max 5MB)

Response: 200
{
  "message": "Avatar uploaded successfully",
  "avatar": "/uploads/avatars/avatar-1234567890-xyz.jpg",
  "user": {...}
}
```

### 6. Change Password
```
POST /api/users/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

Body:
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}

Response: 200
{
  "message": "Password changed successfully"
}
```

### 7. Create User (Admin)
```
POST /api/users
Authorization: Bearer <accessToken>
Content-Type: application/json

Body:
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "fullName": "New User",
  "roles": ["role_id1", "role_id2"]  // Optional
}

Response: 201
{
  "message": "User created successfully",
  "user": {...}
}
```

### 8. Delete User (Admin)
```
DELETE /api/users/:id
Authorization: Bearer <accessToken>

Response: 200
{
  "message": "User deleted successfully"
}
```

### 9. Toggle User Status (Admin)
```
PATCH /api/users/:id/toggle-status
Authorization: Bearer <accessToken>

Response: 200
{
  "message": "User activated/deactivated successfully",
  "user": {...}
}
```

## 🔐 Authentication Headers

All protected endpoints require:
```
Authorization: Bearer <accessToken>
```

## 📊 Error Responses

```json
// 400 Bad Request
{
  "error": "Validation error message"
}

// 401 Unauthorized
{
  "error": "Invalid token or Token expired"
}

// 403 Forbidden
{
  "error": "Permission denied",
  "requiredPermissions": ["manage_roles"]
}

// 404 Not Found
{
  "error": "User not found"
}

// 409 Conflict
{
  "error": "Email or username already exists"
}

// 429 Too Many Requests
{
  "error": "Too many login attempts. Please try again later."
}

// 500 Internal Server Error
{
  "error": "Internal server error"
}
```

## 🛡️ Permission System

### Available Permissions:
- `create_user` - Create new users
- `read_user` - View user list
- `update_user` - Update user info
- `delete_user` - Delete users
- `manage_roles` - Manage roles
- `manage_permissions` - Manage permissions
- `view_logs` - View audit logs
- `export_data` - Export data

### Available Roles:
- `admin` - Full access
- `moderator` - Limited access
- `user` - Standard user
- `guest` - Read-only access

## 📝 Testing with Postman

### 1. Import environment variables:
```json
{
  "access_token": "{{Bearer token from login response}}",
  "user_id": "{{User ID}}",
  "refresh_token": "{{Refresh token from login}}"
}
```

### 2. Set Authorization for requests:
```
Type: Bearer Token
Token: {{access_token}}
```

## 🔒 Security Best Practices

1. **JWT Secret**: Change `JWT_SECRET` in `.env` for production
2. **Password**: Always use HTTPS in production
3. **Refresh Tokens**: Stored in database with expiration
4. **Audit Logging**: All changes are logged
5. **Brute Force Protection**: 5 failed attempts = 15-minute lockout
6. **Email Verification**: Required for account activation
7. **Password Reset**: Token expires in 1 hour
8. **File Upload**: Restricted to images, max 5MB

## 📊 Audit Log

All actions are logged:
- Login attempts (success/failed)
- User CRUD operations
- Password changes
- Permission changes
- File uploads

## 🎯 Next Steps

1. Setup roles and permissions in database
2. Test authentication flow
3. Configure email service for verification & password reset
4. Deploy to production with environment variables
