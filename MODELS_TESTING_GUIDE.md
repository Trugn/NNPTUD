# 8 Models API Testing Guide

## Overview
This guide explains how to test all 8 core models using the **MODELS_POSTMAN_COLLECTION.json** file.

## Included Models (8 Total)
1. **User** - User account information, authentication, roles, and profile
2. **Role** - User roles that group together permissions
3. **Permission** - Individual permissions users can have
4. **RefreshToken** - Long-lived tokens for obtaining new access tokens
5. **Session** - Active user sessions with device tracking
6. **PasswordReset** - Temporary tokens for password reset functionality
7. **EmailVerification** - Email verification process and token management
8. **LoginAttempt** - Login attempt tracking for security and brute-force detection

## Getting Started

### 1. Import the Collection
1. Open Postman
2. Go to **File → Import**
3. Select **MODELS_POSTMAN_COLLECTION.json**
4. Collection will be imported with all endpoints and environment variables

### 2. Configure Environment Variables
Before testing, set these variables in Postman:

```
base_url: http://localhost:3000
access_token: [obtained from login]
admin_access_token: [obtained from admin login]
refresh_token: [obtained from login]
verification_token: [from registration response]
reset_token: [from forgot password]
user_id: [user's MongoDB ID]
target_user_id: [target user's ID for admin operations]
role_id: [role's MongoDB ID]
```

## Testing Flow

### Step 1: Register & Verify Email
1. **Register User** - Creates User and EmailVerification models
   - Saves `verification_token` from response
   
2. **Verify Email** - Uses EmailVerification model
   - Input the token received from registration

### Step 2: Authentication
1. **Login User** - Creates Session, RefreshToken, and logs LoginAttempt
   - Save `access_token` and `refresh_token` from response
   - Save `user_id` from response

2. **Get Current User** - Retrieves authenticated user profile
   - Uses access_token

### Step 3: Token Management
1. **Refresh Token** - Uses RefreshToken model
   - Gets new access token without re-login
   - Can check Session and RefreshToken model updates

2. **Logout** - Updates RefreshToken and Session models
   - Revokes the refresh token
   - Deactivates the session

### Step 4: Password Management
1. **Change Password** - Updates User model directly
   - Requires current authentication

2. **Forgot Password** - Creates PasswordReset model
   - Saves `reset_token` from response

3. **Reset Password** - Uses PasswordReset model
   - Updates User password
   - Marks PasswordReset token as used

### Step 5: Profile Management
1. **Update User** - Updates User model fields
   - fullName, email, etc.

2. **Upload Avatar** - Updates User model
   - Uploads image file to user profile

### Step 6: Admin Operations (Requires Admin Account)
1. **Create User** - Creates new User model
   - Requires `create_user` permission

2. **Get All Users** - List all users
   - Requires `read_user` permission

3. **Assign Role** - Updates User and Role models
   - Links roles to users
   - Requires `manage_roles` permission

4. **Toggle User Status** - Updates User model
   - Activate/deactivate user accounts
   - Requires `update_user` permission

5. **Delete User** - Removes user record
   - Requires `delete_user` permission

## Model Relationships

```
User
├── roles → [Role]
│   └── permissions → [Permission]
├── refreshTokens → [RefreshToken]
├── sessions → [Session]
└── loginAttempts → [LoginAttempt]

PasswordReset → User
EmailVerification → User
```

## Testing Checklist

- [ ] Register new user (User, EmailVerification created)
- [ ] Verify email address (EmailVerification updated)
- [ ] Login successfully (Session, RefreshToken, LoginAttempt created)
- [ ] Get current user profile
- [ ] Refresh token (RefreshToken used)
- [ ] Change password (User updated)
- [ ] Logout (RefreshToken revoked, Session closed)
- [ ] Test forgot password (PasswordReset created)
- [ ] Test reset password (User updated, PasswordReset marked used)
- [ ] Upload avatar (User updated)
- [ ] Admin: Create user
- [ ] Admin: Get all users
- [ ] Admin: Assign role to user (User-Role relationship)
- [ ] Admin: Toggle user status
- [ ] Admin: Delete user

## Error Handling

Common responses:
- **400**: Invalid request data
- **401**: Missing or invalid token
- **403**: Permission denied (incorrect role)
- **404**: Resource not found
- **409**: Conflict (user already exists)
- **500**: Server error

## Notes

- LoginAttempt is automatically created on each login attempt (success or failure)
- RefreshToken can only be used once; after refresh, a new token is issued
- Session has IP address and user agent logging for security
- Permission denial automatically creates a failed audit log scenario
- Email verification must be completed before login is allowed
