# 🚀 Quick Start - NNPTUD Backend

## ⚡ 5-Minute Setup

### 1️⃣ Install Dependencies (2 min)
```bash
npm install
```

Output should show:
```
up to date, audited 15 packages in 2s
```

### 2️⃣ Verify MongoDB Connection

**Make sure MongoDB is running:**

Windows:
```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# If not running, start it
Start-Service MongoDB
```

macOS:
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# If not running, start it
brew services start mongodb-community
```

Linux:
```bash
sudo systemctl start mongodb
sudo systemctl status mongodb
```

Or run MongoDB manually:
```bash
mongod
```

### 3️⃣ Start Server (1 min)
```bash
npm run dev
```

Expected output:
```
✓ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

✅ **Server is now running!**

---

## 🧪 Quick Test (2 min)

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

### Test 2: Register User
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

Expected response (201):
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {...},
  "verificationToken": "..."
}
```

✅ **Backend is working!**

---

## 📮 Test in Postman

### Setup Environment
1. Open Postman
2. Import: `POSTMAN_COLLECTION.json`
3. Select Environment: `NNPTUD Dev`
4. Base URL should be: `http://localhost:5000`

### Test Workflow
1. Register User (`[1] Register User`)
2. Verify Email (`[2] Verify Email`)
3. Login (`[3] Login`)
4. Get Profile (`[A] Get Current User`)

✅ **All working!**

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `POSTMAN_COLLECTION.json` | Import into Postman |
| `POSTMAN_GUIDE.md` | Step-by-step testing guide |
| `API_DOCUMENTATION.md` | All endpoints reference |
| `ENDPOINTS_REFERENCE.json` | Quick endpoint lookup |
| `.env` | Configuration (PORT, JWT, MongoDB) |

---

## 🐛 Common Issues & Fixes

### ❌ "Cannot find module"
```bash
# Solution: Install dependencies
npm install
```

### ❌ "MongoDB connection failed"
```bash
# Solution: Start MongoDB
mongod

# Or check if running:
mongo --eval "db.adminCommand('ping')"
```

### ❌ "Port 5000 already in use"
```bash
# Solution: Change port in .env
PORT=5001

# Or kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9
```

### ❌ "Token expired"
```bash
# Solution: Use refresh token endpoint
POST /api/auth/refresh-token
{
  "refreshToken": "your_refresh_token"
}
```

### ❌ "Permission denied" on upload
```bash
# Solution: Check uploads/avatars folder exists
mkdir -p uploads/avatars

# Or check permissions
chmod 755 uploads/avatars
```

---

## 📊 Environment Variables

Verify `.env` file has:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nnptud
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h
REFRESH_TOKEN_EXPIRE=7d
```

---

## 🎯 Test Checklist

- [ ] Server starts without errors
- [ ] Health check responds (GET /health)
- [ ] Can register user (POST /api/auth/register)
- [ ] Can verify email (POST /api/auth/verify-email)
- [ ] Can login (POST /api/auth/login)
- [ ] Can get profile (GET /api/users/me)
- [ ] Can update profile (PUT /api/users/:id)
- [ ] Can upload avatar (POST /api/users/upload-avatar)
- [ ] Avatar file appears in uploads/avatars/
- [ ] Can change password (POST /api/users/change-password)
- [ ] Can logout (POST /api/users/logout)

✅ All checked = **Backend is fully functional!**

---

## 📞 Next Steps

1. **Full Testing:** Follow `POSTMAN_GUIDE.md`
2. **Read API Docs:** Check `API_DOCUMENTATION.md`
3. **Understand Structure:** Review `PROJECT_STRUCTURE.md`
4. **Start Development:** Modify files as needed

---

## 💡 Tips

- **Need help?** Check `COMPLETE_CHECKLIST.md`
- **Want to understand code?** Read `PROJECT_STRUCTURE.md`
- **Testing endpoints?** Use `POSTMAN_COLLECTION.json`
- **Need quick reference?** Check `ENDPOINTS_REFERENCE.json`

---

## 🚀 You're Ready!

Your backend is:
- ✅ Fully configured
- ✅ Ready to test
- ✅ Ready for development
- ✅ Ready for integration with frontend

**Happy coding! 🎉**

---

## 📝 System Requirements

- Node.js v14+ ✅
- MongoDB v4+  ✅
- npm v6+ ✅
- Postman (for testing) ✅
- 150MB free disk space ✅

All met? You're good to go!

