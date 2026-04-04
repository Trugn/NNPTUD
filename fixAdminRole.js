const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Role = require('./models/Role');

const assignAdminRole = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🔧 Assigning admin role to admin_user...\n');

    // Get admin role
    const adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      console.error('❌ Admin role not found!');
      process.exit(1);
    }

    // Find admin_user
    const user = await User.findOne({ username: 'admin_user' });
    if (!user) {
      console.error('❌ admin_user not found!');
      process.exit(1);
    }

    console.log(`📝 Before: ${user.username} has roles:`, user.roles);

    // Assign admin role
    user.roles = [adminRole._id];
    await user.save();

    console.log(`✓ After save: ${user.username} has roles:`, user.roles);

    // Verify
    const updated = await User.findById(user._id)
      .populate('roles')
      .select('username email roles');

    console.log('\n✅ Verification:');
    console.log(`  Username: ${updated.username}`);
    console.log(`  Email: ${updated.email}`);
    console.log(`  Role(s): ${updated.roles.map(r => r.name).join(', ')}`);

    if (updated.roles.some(r => r.name === 'admin')) {
      console.log('\n🎉 SUCCESS! admin_user is now an ADMIN!');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

assignAdminRole();
