# 🌱 Setup Roles & Permissions

## ⚡ Quick Setup

### 1. Chạy Seed Script
```bash
npm run seed
```

Output sẽ là:
```
🌱 Starting seed data...
✓ Cleared existing roles and permissions
✓ Created 8 permissions
✓ Created 4 roles:
  - admin (full access)
  - moderator (limited access)
  - user (standard user)
  - guest (minimal access)

✅ Seed data completed successfully!

Roles created:
- Admin ID: 507f1f77bcf86cd799439011
- Moderator ID: 507f1f77bcf86cd799439012
- User ID: 507f1f77bcf86cd799439013
- Guest ID: 507f1f77bcf86cd799439014
```

✅ **Roles đã được khởi tạo trong database!**

---

## 🔄 Cách Hoạt Động

### Registration Flow (Sau khi seed roles)

```
1. User đăng ký
   ↓
2. Hệ thống tìm role "user" mặc định
   ↓
3. Gán role "user" cho user mới
   ↓
4. User có thể sử dụng các features của "user" role
```

### Roles & Permissions

#### **1. Admin Role** 
Quyền hạn:
- ✅ create_user - Tạo user mới
- ✅ read_user - Xem danh sách users
- ✅ update_user - Cập nhật user
- ✅ delete_user - Xóa user
- ✅ manage_roles - Quản lý roles
- ✅ manage_permissions - Quản lý permissions
- ✅ view_logs - Xem audit logs
- ✅ export_data - Export data

#### **2. Moderator Role**
Quyền hạn:
- ✅ read_user - Xem danh sách users
- ✅ update_user - Cập nhật user
- ✅ view_logs - Xem audit logs

#### **3. User Role** (Gán mặc định cho user mới)
Quyền hạn:
- ✅ read_user - Xem danh sách users

#### **4. Guest Role**
Quyền hạn:
- (Không có quyền gì)

---

## 🎯 Cách Sử Dụng

### Sau khi Setup

1. **Tạo admin account:**
   - Đăng ký user bình thường
   - Truy cập MongoDB, tìm user đó
   - Thêm admin role vào roles array

2. **Test Role-Based Access:**
   - Login với user account → Chỉ có read_user
   - Login với admin account → Có tất cả permissions

### Gán Role cho User (Manual)

**MongoDB:**
```javascript
// Tìm admin role
const adminRole = db.roles.findOne({ name: 'admin' });

// Tìm user cần set
const user = db.users.findOne({ email: 'user@example.com' });

// Gán role
db.users.updateOne(
  { _id: user._id },
  { $push: { roles: adminRole._id } }
);
```

**Via API (Sau khi có admin role):**
```bash
PUT /api/users/:id
Authorization: Bearer {admin-token}
Content-Type: application/json

{
  "roles": ["507f1f77bcf86cd799439011"]  // admin role ID
}
```

---

## 🔐 Permission Checking

### Khi gọi API Protected

```
1. Request: GET /api/users
   Header: Authorization: Bearer {token}
   ↓
2. Backend kiểm tra token → Lấy user info
   ↓
3. Tìm tất cả roles của user
   ↓
4. Tìm tất cả permissions từ các roles
   ↓
5. Kiểm tra có "read_user" permission?
   ↓ 
6. Nếu có → Return users
   Nếu không → Return 403 Forbidden
```

---

## 📝 Default Setup

### Permissions (8 cái):
1. create_user, read_user, update_user, delete_user (User module)
2. manage_roles, manage_permissions (Role & Permission modules)
3. view_logs, export_data (System module)

### Roles (4 cái):
1. **admin** - Đủ tất cả 8 permissions
2. **moderator** - 3 permissions (read, update, view_logs)
3. **user** - 1 permission (read_user) ← **Gán mặc định khi đăng ký**
4. **guest** - 0 permissions

---

## 🚀 Setup Workflow

### First Time Setup:

```bash
# 1. Install dependencies
npm install

# 2. Chắc sure MongoDB running
mongod

# 3. Seed roles & permissions
npm run seed

# 4. Start server
npm run dev

# 5. Register user bình thường
# User sẽ tự động có role "user"

# 6. Để promote user to admin:
# - Access MongoDB
# - Tìm admin role ID từ seed output
# - Update user document, add admin role ID vào roles array
```

---

## ✅ Verification

### Check roles đã được tạo:

**MongoDB Command:**
```javascript
use nnptud
db.roles.find().pretty()

// Should show:
// {
//   _id: ObjectId(...),
//   name: "admin",
//   displayName: "Administrator",
//   ...
// }
```

### Check user có role:

```javascript
db.users.findOne({ email: "your@email.com" }).roles
// Should show: [ObjectId(...)]
```

### Check permissions:

```javascript
db.permissions.find().pretty()
// Should show 8 permissions
```

---

## 🔧 Troubleshooting

### ❌ "Cannot find Role"
**Solution:** Run seed first
```bash
npm run seed
```

### ❌ "Permission denied" but should have permission
**Solution:** Check user's roles
```javascript
db.users.findOne({ email: "your@email.com" });
// Check roles array is not empty
```

### ❌ "Seed script fails"
**Solution:** Check MongoDB is running
```bash
# Windows
Get-Service MongoDB

# macOS
brew services list | grep mongodb

# Linux
sudo systemctl status mongodb
```

---

## 📊 Role Assignment Tips

### For Testing:
1. Create test admin user with all permissions
2. Create test moderator user with limited
3. Create test regular user (gets "user" role automatically)

### For Production:
1. Run seed once to create base roles
2. Assign admin role to yourself
3. Use admin panel to manage other roles

---

## 📚 Related Files

- `seed.js` - Seed script
- `models/Role.js` - Role model
- `models/Permission.js` - Permission model
- `controllers/authController.js` - Uses roles on registration
- `middleware/authMiddleware.js` - Checks permissions

---

**Status:** ✅ Ready to seed

**Next:** Run `npm run seed` to create roles and permissions!

