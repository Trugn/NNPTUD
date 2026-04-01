# 📁 Project Structure Overview

## Directory Map

```
NNPTUD/
│
├── 📂 config/
│   └── db.js                           # MongoDB connection setup
│
├── 📂 routes/
│   ├── authRoutes.js                   # Authentication endpoints
│   ├── userRoutes.js                   # User management endpoints
│   └── index.js                        # (deprecated) - use authRoutes + userRoutes
│
├── 📂 controllers/
│   ├── authController.js               # Auth business logic (register, login, etc)
│   └── userController.js               # User business logic (CRUD, profile, avatar)
│
├── 📂 models/                          # Database schemas - 9 models in total
│   ├── User.js                         # User - Account credentials & profile
│   ├── Role.js                         # Role - User roles (admin, moderator, etc)
│   ├── Permission.js                   # Permission - Fine-grained access control
│   ├── RefreshToken.js                 # RefreshToken - JWT refresh token storage
│   ├── Session.js                      # Session - Active user sessions
│   ├── AuditLog.js                     # AuditLog - Action history & compliance
│   ├── PasswordReset.js                # PasswordReset - Password reset tokens
│   ├── EmailVerification.js            # EmailVerification - Email confirmation
│   └── LoginAttempt.js                 # LoginAttempt - Failed login tracking
│
├── 📂 middleware/
│   ├── authMiddleware.js               # JWT token verification & permission check
│   └── uploadMiddleware.js             # Multer configuration for avatar upload
│
├── 📂 uploads/
│   ├── avatars/                        # User avatar images storage
│   └── README.md                       # Uploads folder documentation
│
├── 📂 node_modules/                    # (git ignored) Dependencies
│
├── server.js                           # Main application entry point
├── package.json                        # Dependencies & scripts
├── .env                                # Environment variables (git ignored)
├── .gitignore                          # Git ignore rules
│
├── 📄 README.md                        # Project overview & quick start
├── 📄 API_DOCUMENTATION.md             # Complete API endpoint reference
├── 📄 SETUP_GUIDE.md                   # Installation & testing guide
├── 📄 PROJECT_STRUCTURE.md             # This file - detailed structure explanation
└── 📄 POSTMAN_COLLECTION.json          # Postman API collection for testing
```

## 🔧 Core Files Explained

### server.js
**Main application entry point**
- Initialize Express app
- Setup middleware (CORS, JSON parser, static files)
- Connect to MongoDB
- Mount routes
- Error handling
- Start server on PORT

### package.json
**Project metadata & dependencies**
```json
{
  "name": "nnptud-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "Web framework",
    "mongoose": "MongoDB ORM",
    "jsonwebtoken": "JWT authentication",
    "bcryptjs": "Password hashing",
    "multer": "File upload handling",
    "cors": "Cross-origin requests",
    "dotenv": "Environment variables"
  }
}
```

### .env
**Environment variables (DO NOT COMMIT)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nnptud
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
```

## 📂 Directories Explained

### `config/`
**Configuration files**
- `db.js` - MongoDB connection configuration
- Future: Email config, payment config, etc

### `routes/`
**Express route handlers**
- `authRoutes.js` - Public auth endpoints (register, login, verify email, forgot password)
- `userRoutes.js` - Protected user endpoints (profile, CRUD, avatar upload)
- Routes use controllers for actual business logic

**Route Structure:**
```
/api/auth/*               → Public (no auth required)
/api/users/*              → Protected (auth required)
  - /me                   → Get current user
  - /                      → Get all users (paginated)
  - /:id                  → Get/Update/Delete specific user
  - /upload-avatar        → Upload user avatar
  - /change-password      → Change password
  - /toggle-status        → Activate/deactivate user
```

### `controllers/`
**Business logic layer**
- `authController.js` - Authentication logic
  - register()
  - verifyEmail()
  - login()
  - logout()
  - refreshToken()
  - forgotPassword()
  - resetPassword()
  - getCurrentUser()

- `userController.js` - User management logic
  - getAllUsers()
  - getUserById()
  - createUser()
  - updateUser()
  - uploadAvatar()
  - deleteUser()
  - changePassword()
  - toggleUserStatus()

### `models/`
**Database schemas (MongoDB)**

#### Authentication Models:
1. **User** - User accounts
   - username, email, password (hashed)
   - profile: fullName, phone, avatar
   - status: isVerified, isActive, lastLogin
   - relations: roles[]
   - methods: comparePassword()

2. **Role** - User roles
   - name: admin, moderator, user, guest
   - permissions[]
   - isActive

3. **Permission** - Fine-grained permissions
   - name: create_user, read_user, delete_user, etc
   - module: User, Role, Permission, System
   - isActive

4. **RefreshToken** - JWT refresh tokens
   - user: ref(User)
   - token, tokenHash
   - expiresAt, isRevoked
   - tracking: userAgent, ipAddress

5. **Session** - Active sessions
   - user: ref(User)
   - accessToken
   - refresh token: ref(RefreshToken)
   - expiresAt, logoutAt, isActive
   - tracking: userAgent, ipAddress, deviceName

6. **AuditLog** - Action history
   - user: ref(User)
   - action: login, logout, create, update, delete
   - resource: User, Role, Permission, System
   - changes: before/after state
   - status: success, failed
   - tracking: ipAddress, userAgent

7. **PasswordReset** - Password reset flow
   - user: ref(User)
   - token, tokenHash
   - expiresAt (1 hour)
   - isUsed, usedAt
   - tracking: ipAddress

8. **EmailVerification** - Email confirmation
   - user: ref(User)
   - email
   - token, tokenHash
   - expiresAt (24 hours)
   - isVerified, verifiedAt
   - attempts tracking

9. **LoginAttempt** - Failed login tracking
   - email
   - isSuccess
   - failureReason: invalid_credentials, account_locked, etc
   - auto-expire after 30 days
   - tracking: ipAddress, userAgent, location

### `middleware/`
**Request processing middleware**

- `authMiddleware.js`
  - `verifyToken()` - Check JWT validity
  - `checkPermission()` - Check user permissions
  - `trackLoginAttempt()` - Track login attempts
  - `logAudit()` - Log actions to AuditLog

- `uploadMiddleware.js`
  - Configure multer for file uploads
  - File validation: type, size
  - Storage configuration
  - Single file: avatar (5MB max)

### `uploads/`
**User-uploaded files storage**
- `avatars/` - User profile pictures
- Automatically managed: deleted when user updates/deletes

## 🔄 Data Flow Examples

### Registration Flow
```
1. POST /api/auth/register
   ↓
2. authController.register()
   - Validate input
   - Create User (password hashed by pre-save hook)
   - Create EmailVerification token
   - Log to AuditLog
   ↓
3. Response with verification token
```

### Login Flow
```
1. POST /api/auth/login
   ↓
2. authController.login()
   - Find user by email
   - Verify password with bcrypt
   - Check if verified & active
   - Generate JWT accessToken
   - Create RefreshToken record
   - Create Session record
   - Update user.lastLogin
   - Track LoginAttempt (success)
   - Log to AuditLog
   ↓
3. Response with tokens & user info
```

### Avatar Upload Flow
```
1. POST /api/users/upload-avatar
   ↓
2. uploadMiddleware (multer)
   - Validate file type
   - Validate file size
   - Save to uploads/avatars/
   ↓
3. userController.uploadAvatar()
   - Delete old avatar file if exists
   - Update user.avatar path
   - Log to AuditLog
   ↓
4. Response with new avatar URL
```

### Permission Check Flow
```
1. Protected request with Bearer token
   ↓
2. authMiddleware.verifyToken()
   - Verify JWT signature
   - Check expiration
   - Extract user ID
   ↓
3. authMiddleware.checkPermission(['delete_user'])
   - Get user with roles.permissions
   - Check if user has required permission
   - Allow/Deny request
   ↓
4. If denied: Log to AuditLog, return 403
   If allowed: Continue to controller
```

## 📊 Database Relationships

```
User (Many) ←→ (Many) Role ←→ (Many) Permission
  ↓
RefreshToken (can have many)
Session (can have many)
AuditLog (many actions)
LoginAttempt (many attempts)
PasswordReset (multiple resets)
EmailVerification (one per registration)
```

## 🛡️ Security Layers

1. **Password Security**
   - Hashed with bcryptjs (10 salt rounds)
   - Never sent in responses
   - Secure comparison in login

2. **Token Security**
   - JWT with expiration (24h access, 7d refresh)
   - Refresh token rotation
   - Token revocation on logout

3. **Permission Security**
   - Database-backed role/permission system
   - Fine-grained permission checking
   - Permission verification on every request

4. **Attack Prevention**
   - Brute force detection (5 attempts = 15-min lockout)
   - Email verification requirement
   - Password reset tokens with expiration
   - Audit logging for compliance

5. **File Security**
   - File type validation
   - File size limits (5MB)
   - Unique file naming
   - Automatic cleanup of old files

## 📈 Scalability Considerations

**For future improvements:**
- Move uploads to cloud storage (S3, Azure Blob)
- Add Redis for token caching
- Implement rate limiting globally
- Add database indexing optimization
- Consider API versioning (/v1/api/users)
- Add GraphQL support
- Implement pagination everywhere
- Add search/filter optimization

## 🚀 Deployment Structure

**For production deployment:**
```
/var/www/nnptud/
├── app/
│   └── (all project files)
├── logs/
│   └── (application logs)
└── .env (production environment)
```

---

**Last Updated:** March 2026
**Status:** ✅ Production Ready
