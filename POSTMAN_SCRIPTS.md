# Postman Post-request Scripts

Thêm các scripts này vào Post-request tab của requests để tự động lưu responses vào Environment variables.

## 1. Register Request - Post-request Script

```javascript
// Auto-save verification token
if (pm.response.code === 201) {
  var jsonData = pm.response.json();
  pm.environment.set("verification_token", jsonData.verificationToken);
  console.log("✓ Verification token saved");
}
```

## 2. Login Request - Post-request Script

```javascript
// Auto-save tokens and user ID
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("access_token", jsonData.accessToken);
  pm.environment.set("refresh_token", jsonData.refreshToken);
  pm.environment.set("user_id", jsonData.user.id);
  
  console.log("✓ Access token saved");
  console.log("✓ Refresh token saved");
  console.log("✓ User ID saved");
  
  // Show tokens in console
  console.log("Access Token:", jsonData.accessToken.substring(0, 20) + "...");
  console.log("User ID:", jsonData.user.id);
}
```

## 3. Refresh Token Request - Post-request Script

```javascript
// Auto-update tokens
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("access_token", jsonData.accessToken);
  pm.environment.set("refresh_token", jsonData.refreshToken);
  
  console.log("✓ Tokens refreshed");
  console.log("New Access Token:", jsonData.accessToken.substring(0, 20) + "...");
}
```

## 4. Forgot Password Request - Post-request Script

```javascript
// Auto-save reset token
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("reset_token", jsonData.resetToken);
  
  console.log("✓ Reset token saved");
  console.log("Reset Token:", jsonData.resetToken.substring(0, 30) + "...");
}
```

## 5. Get Current User Request - Post-request Script

```javascript
// Auto-save user info
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("current_user_id", jsonData.id);
  pm.environment.set("current_username", jsonData.username);
  pm.environment.set("current_email", jsonData.email);
  
  console.log("✓ User info updated");
  console.log("Username:", jsonData.username);
  console.log("Email:", jsonData.email);
  console.log("Verified:", jsonData.isVerified ? "Yes" : "No");
  console.log("Active:", jsonData.isActive ? "Yes" : "No");
}
```

## How to Add Scripts in Postman

1. Mở request
2. Chọn tab "Tests" (hoặc "Post-response" tùy version)
3. Paste script vào
4. Click "Send"
5. Check "Console" (bottom-left) để xem output

## Example: Register → Verify Email → Login Flow

**Register:**
1. Go to [1] Register User
2. Add Post-request Script (script #1)
3. Click Send
4. Check Console để confirm `verification_token` được save

**Verify Email:**
1. Go to [2] Verify Email
2. Token sẽ auto-fill: `{{verification_token}}`
3. Click Send

**Login:**
1. Go to [3] Login
2. Add Post-request Script (script #2)
3. Click Send
4. Check Console để confirm tokens được save
5. Các endpoint khác sẽ tự sử dụng `{{access_token}}`

## Common Output Examples

### Successful Register
```
✓ Verification token saved
Response time: 245 ms
Status: 201 Created
```

### Successful Login
```
✓ Access token saved
✓ Refresh token saved
✓ User ID saved
Access Token: eyJhbGciOiJIUzI1NiIs...
User ID: 507f1f77bcf86cd799439011
Response time: 312 ms
Status: 200 OK
```

### Successful Refresh Token
```
✓ Tokens refreshed
New Access Token: eyJhbGciOiJIUzI1NiIs...
Response time: 89 ms
Status: 200 OK
```

## 🎯 Pro Tips

1. **View Environment Variables:**
   - Top-right → Select your environment
   - Click eye icon to see all variables

2. **Debug Failed Requests:**
   - Check Console tab (bottom)
   - Look for error messages
   - Verify request body format

3. **Monitor Network:**
   - Click "Console" tab
   - See all requests/responses
   - Copy responses for debugging

4. **Batch Testing:**
   - Use "Collection Runner"
   - Set up test data file
   - Run multiple requests in sequence

5. **Save Responses:**
   - Example saves both in Post-request script
   - AND in Environment variables
   - Use Environment variables in next requests

---

**Tip:** Nếu token hết hạn (24h), dùng Refresh Token request để lấy token mới!

