const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Role = require('./models/Role');

const testAssignRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🔍 Testing assignRole logic...\n');

    // 1. Get all roles
    const allRoles = await Role.find();
    console.log('📋 Available roles:', allRoles.map(r => ({ id: r._id, name: r.name })));

    // 2. Get admin role
    const adminRole = await Role.findOne({ name: 'admin' });
    console.log('\n✓ Admin role:', adminRole ? adminRole._id : 'NOT FOUND');

    // 3. Get all users
    const allUsers = await User.find().select('username email roles');
    console.log('\n📝 All users:');
    allUsers.forEach(u => {
      console.log(`  - ${u.username} (${u.email}): roles = ${u.roles.length ? u.roles.map(r => r.toString()).join(', ') : 'NONE'}`);
    });

    // 4. Test assign admin role to first user
    if (allUsers.length > 0) {
      const testUser = allUsers[0];
      console.log(`\n🔧 Assigning admin role to ${testUser.username}...`);
      
      testUser.roles = [adminRole._id];
      await testUser.save();
      
      // 5. Verify in DB
      const updatedUser = await User.findById(testUser._id)
        .populate('roles')
        .select('username email roles');
      
      console.log('✓ Database result after save:');
      console.log(`  Username: ${updatedUser.username}`);
      console.log(`  Email: ${updatedUser.email}`);
      console.log(`  Roles: ${updatedUser.roles.map(r => r.name).join(', ')}`);
      
      if (updatedUser.roles.some(r => r.name === 'admin')) {
        console.log('\n✅ SUCCESS: Role assigned correctly in DB!');
      } else {
        console.log('\n❌ ERROR: Role NOT saved in DB!');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testAssignRole();
