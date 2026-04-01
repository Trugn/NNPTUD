# NNPTUD Backend API

Professional Node.js Backend mang Express.js + MongoDB với đầy đủ Authentication, Authorization, CRUD & File Upload

## ✨ Features

✅ **Authentication:**
- User registration & email verification
- Login/Logout with JWT
- Refresh token mechanism
- Password reset & forgot password
- Login attempt tracking (brute force protection)

✅ **Authorization:**
- Role-based access control (RBAC)
- Permission management
- Fine-grained permission checking
- Admin/Moderator/User/Guest roles

✅ **User Management:**
- Full CRUD operations
- Profile management
- Avatar upload (JPEG, PNG, GIF, WebP)
- Password change
- Account activation/deactivation

✅ **Security & Audit:**
- Password hashing with bcryptjs
- JWT token validation
- Audit logging for all operations
- Session tracking
- Login attempt history

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Password:** bcryptjs
- **File Upload:** multer
- **Misc:** dotenv, cors

## 📦 Project Structure

```
NNPTUD/
├── config/
│   └── db.js                    # Database connection
├── routes/
│   ├── authRoutes.js            # Auth endpoints (register, login, etc)
│   └── userRoutes.js            # User endpoints (profile, CRUD, upload)
├── controllers/
│   ├── authController.js        # Auth business logic
│   └── userController.js        # User business logic
├── models/
│   ├── User.js                  # User schema
│   ├── Role.js                  # Role schema
│   ├── Permission.js            # Permission schema
│   ├── RefreshToken.js          # Refresh token storage
│   ├── Session.js               # User session tracking
│   ├── AuditLog.js              # Audit trail
│   ├── PasswordReset.js         # Password reset tokens
│   ├── EmailVerification.js     # Email verification tokens
│   └── LoginAttempt.js          # Login attempt tracking
├── middleware/
│   ├── authMiddleware.js        # JWT verification, permission check
│   └── uploadMiddleware.js      # Multer configuration
├── uploads/
│   └── avatars/                 # User avatars storage
├── server.js                    # Main application file
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── .gitignore
├── README.md                    # This file
├── API_DOCUMENTATION.md         # Complete API reference
└── SETUP_GUIDE.md               # Installation & testing guide
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
# Create/update .env file:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nnptud
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# 3. Start server
npm run dev
```

The server will start at `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email with token
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Management
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (paginated)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (admin)
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin)
- `POST /api/users/upload-avatar` - Upload user avatar
- `POST /api/users/change-password` - Change user password
- `PATCH /api/users/:id/toggle-status` - Activate/deactivate user

## 🔐 Authentication Flow

```
1. User registers → Email sent
2. User verifies email with token
3. User logs in → Gets accessToken & refreshToken
4. accessToken used for all API requests
5. When accessToken expires → Use refreshToken to get new one
6. User can reset password via forgot-password flow
```

## 📊 Database Models (8 Authentication Models)

| Model | Purpose |
|-------|---------|
| **User** | User accounts with authentication |
| **Role** | User roles (admin, moderator, user, guest) |
| **Permission** | Fine-grained permissions |
| **RefreshToken** | JWT refresh tokens with expiration |
| **Session** | Active user sessions tracking |
| **AuditLog** | All actions history |
| **PasswordReset** | Password reset token management |
| **EmailVerification** | Email verification token management |
| **LoginAttempt** | Failed login tracking (brute force protection) |

## 🛡️ Security Features

✓ Password hashing with bcryptjs (salt rounds: 10)  
✓ JWT tokens with expiration (access: 24h, refresh: 7d)  
✓ Refresh token rotation  
✓ Session tracking per device  
✓ Audit logging for compliance  
✓ Brute force protection (5 attempts in 15 minutes)  
✓ Email verification requirement  
✓ Password reset tokens with 1-hour expiration  
✓ CORS enabled  
✓ File upload validation (type, size)  

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nnptud

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d

# Email (optional - for future emailer integration)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

## 🧪 Testing with Postman

1. Import collection (or create manually)
2. Setup environment with variables
3. Follow test workflow in [SETUP_GUIDE.md](./SETUP_GUIDE.md)

Example requests are in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 📋 Example Request/Response

### Register
```bash
POST /api/auth/register
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
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe"
  },
  "verificationToken": "abc123..."
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "xyz789...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "/uploads/avatars/avatar-1234567890-xyz.jpg",
    "roles": []
  }
}
```

## 🎯 Common Tasks

### Assign Role to User
```javascript
// In MongoDB
db.users.updateOne(
  { _id: ObjectId("...") },
  { $push: { roles: ObjectId("role_id") } }
)
```

### View Audit Logs
```javascript
// In MongoDB
db.auditlogs.find({ action: "login" }).sort({ createdAt: -1 }).limit(10)
```

### Reset User Password
```javascript
// In MongoDB
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { password: "new_hashed_password" } }
)
```

## ⚠️ Important Notes

1. **Change JWT_SECRET** - Never use default in production
2. **Enable HTTPS** - Required for production
3. **Setup Email Service** - For sending verification/reset emails
4. **MongoDB Security** - Use username/password for Atlas
5. **Rate Limiting** - Consider adding global rate limiting middleware
6. **API Versioning** - Consider versioning for future releases

## 🐛 Troubleshooting

**MongoDB connection failed:**
- Check MongoDB is running
- Verify MONGODB_URI in .env
- Check network connectivity

**Token validation error:**
- Ensure Authorization header: `Bearer <token>`
- Check token expiration
- Use refresh token to get new one

**File upload failed:**
- Check file type (JPEG, PNG, GIF, WebP)
- Check file size (max 5MB)
- Ensure uploads/ folder exists and is writable

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for more troubleshooting.

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Setup Guide](./SETUP_GUIDE.md) - Installation & testing guide
- [Models Documentation](./models) - Individual model details

## 🚀 Future Enhancements

- [ ] Email service integration (verification emails, password reset)
- [ ] OAuth2 integration (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] API rate limiting
- [ ] Advanced audit log filtering
- [ ] Data export functionality
- [ ] Admin dashboard API
- [ ] Notification service integration
- [ ] API versioning

## 📄 License

MIT

## 👨‍💻 Support

For issues or questions, please check:
1. [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
2. [SETUP_GUIDE.md](./SETUP_GUIDE.md)
3. Check error messages in server logs

---

**Backend Status:** ✅ Ready for Development & Testing

Happy coding! 🎉
