const mongoose = require('mongoose');
require('dotenv').config();

const Role = require('./models/Role');
const Permission = require('./models/Permission');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Starting seed data...');

    // Clear existing data
    await Role.deleteMany({});
    await Permission.deleteMany({});
    console.log('✓ Cleared existing roles and permissions');

    // Create Permissions
    const permissions = await Permission.create([
      {
        name: 'create_user',
        displayName: 'Create User',
        description: 'Create new users',
        module: 'User',
        isActive: true,
      },
      {
        name: 'read_user',
        displayName: 'Read User',
        description: 'View user list',
        module: 'User',
        isActive: true,
      },
      {
        name: 'update_user',
        displayName: 'Update User',
        description: 'Update user information',
        module: 'User',
        isActive: true,
      },
      {
        name: 'delete_user',
        displayName: 'Delete User',
        description: 'Delete users',
        module: 'User',
        isActive: true,
      },
      {
        name: 'manage_roles',
        displayName: 'Manage Roles',
        description: 'Manage user roles',
        module: 'Role',
        isActive: true,
      },
      {
        name: 'manage_permissions',
        displayName: 'Manage Permissions',
        description: 'Manage permissions',
        module: 'Permission',
        isActive: true,
      },
      {
        name: 'view_logs',
        displayName: 'View Logs',
        description: 'View audit logs',
        module: 'System',
        isActive: true,
      },
      {
        name: 'export_data',
        displayName: 'Export Data',
        description: 'Export system data',
        module: 'System',
        isActive: true,
      },
    ]);

    console.log(`✓ Created ${permissions.length} permissions`);

    // Create Roles
    const adminRole = await Role.create({
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full access to all features',
      permissions: permissions.map(p => p._id),
      isActive: true,
    });

    const moderatorRole = await Role.create({
      name: 'moderator',
      displayName: 'Moderator',
      description: 'Limited admin access',
      permissions: [
        permissions.find(p => p.name === 'read_user')._id,
        permissions.find(p => p.name === 'update_user')._id,
        permissions.find(p => p.name === 'view_logs')._id,
      ],
      isActive: true,
    });

    const userRole = await Role.create({
      name: 'user',
      displayName: 'User',
      description: 'Standard user',
      permissions: [
        permissions.find(p => p.name === 'read_user')._id,
      ],
      isActive: true,
    });

    const guestRole = await Role.create({
      name: 'guest',
      displayName: 'Guest',
      description: 'Guest user with minimal access',
      permissions: [],
      isActive: true,
    });

    console.log('✓ Created 4 roles:');
    console.log('  - admin (full access)');
    console.log('  - moderator (limited access)');
    console.log('  - user (standard user)');
    console.log('  - guest (minimal access)');

    console.log('\n✅ Seed data completed successfully!');
    console.log('\nRoles created:');
    console.log(`- Admin ID: ${adminRole._id}`);
    console.log(`- Moderator ID: ${moderatorRole._id}`);
    console.log(`- User ID: ${userRole._id}`);
    console.log(`- Guest ID: ${guestRole._id}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
