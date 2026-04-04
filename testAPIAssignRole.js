// Test script - simulate Postman request to assign role
// Run in Node terminal or use with `node testAPIAssignRole.js`

const BASE_URL = 'http://localhost:5000';

async function testAssignRoleAPI() {
  try {
    console.log('🧪 Testing Assign Role API...\n');

    // Step 1: Login as admin
    console.log('1️⃣ Login as admin_user...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'Admin@123'
      })
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
    }

    const loginData = await loginRes.json();
    const token = loginData.accessToken;
    console.log(`✓ Login successful, token: ${token.substring(0, 20)}...\n`);

    // Step 2: Get all users to find user ID
    console.log('2️⃣ Getting all users...');
    const usersRes = await fetch(`${BASE_URL}/api/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!usersRes.ok) {
      throw new Error(`Get users failed: ${usersRes.status} ${await usersRes.text()}`);
    }

    const users = await usersRes.json();
    console.log(`✓ Got ${users.length} users`);
    
    // Find first non-admin user
    const targetUser = users.find(u => !u.roles?.some(r => r.name === 'admin'));
    if (!targetUser) {
      console.log('⚠️  No non-admin user found to test with');
      process.exit(0);
    }

    console.log(`✓ Target user: ${targetUser.username} (${targetUser._id})\n`);

    // Step 3: Assign moderator role
    console.log('3️⃣ Assigning MODERATOR role...');
    const assignRes = await fetch(`${BASE_URL}/api/users/${targetUser._id}/assign-role`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roleName: 'moderator'
      })
    });

    const responseText = await assignRes.text();
    console.log(`Response Status: ${assignRes.status}`);
    console.log(`Response: ${responseText}\n`);

    if (!assignRes.ok) {
      console.log('❌ API Error!');
      process.exit(1);
    }

    const assignData = JSON.parse(responseText);
    console.log('✅ Success!');
    console.log(`   Message: ${assignData.message}`);
    console.log(`   User: ${assignData.user.username}`);
    console.log(`   New Role: ${assignData.user.roles[0]?.name || 'N/A'}`);

    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Check if Node.js has native fetch (v18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ (native fetch support)');
  console.log('\n✅ Alternative: Use Postman to test');
  console.log('   GET /api/users');
  console.log('   PATCH /api/users/{userId}/assign-role');
  process.exit(1);
}

testAssignRoleAPI();
