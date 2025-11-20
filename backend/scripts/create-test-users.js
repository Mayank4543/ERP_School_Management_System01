// Script to create test users for all roles
// Run: node scripts/create-test-users.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://mayankrathore9897_db_user:schoolmanagmentsystem1234365@cluster0.kepgm9e.mongodb.net/?appName=Cluster0' ;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  mobile_no: String,
  usergroup_id: String,
  school_id: mongoose.Schema.Types.ObjectId,
  ref_id: mongoose.Schema.Types.ObjectId,
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const schoolSchema = new mongoose.Schema({
  name: String,
  code: String,
  slug: String,
  email: String,
  phone: String,
  address: String,
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
});

async function createTestUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.model('User', userSchema, 'users');
    const School = mongoose.model('School', schoolSchema, 'schools');

    // Create or get test school
    let school = await School.findOne({ code: 'TEST001' });
    if (!school) {
      school = await School.create({
        name: 'Test School',
        code: 'TEST001',
        slug: 'test-school',
        email: 'school@test.com',
        phone: '1234567890',
        address: 'Test Address',
      });
      console.log('✅ Created test school:', school.name);
    }

    const password = await bcrypt.hash('password123', 10);

    const testUsers = [
      {
        name: 'Super Admin',
        email: 'superadmin@test.com',
        password,
        mobile_no: '9999999999',
        usergroup_id: 'superadmin',
        school_id: school._id,
        roles: ['superadmin', 'admin'],
        is_activated: true,
      },
      {
        name: 'School Admin',
        email: 'admin@test.com',
        password,
        mobile_no: '9999999998',
        usergroup_id: 'admin',
        school_id: school._id,
        roles: ['admin'],
        is_activated: true,
      },
      {
        name: 'John Teacher',
        email: 'teacher@test.com',
        password,
        mobile_no: '9999999997',
        usergroup_id: 'teacher',
        school_id: school._id,
        roles: ['teacher'],
        is_activated: true,
      },
      {
        name: 'Alice Student',
        email: 'student@test.com',
        password,
        mobile_no: '9999999996',
        usergroup_id: 'student',
        school_id: school._id,
        roles: ['student'],
        is_activated: true,
      },
      {
        name: 'Bob Parent',
        email: 'parent@test.com',
        password,
        mobile_no: '9999999995',
        usergroup_id: 'parent',
        school_id: school._id,
        roles: ['parent'],
        is_activated: true,
      },
      {
        name: 'Library Manager',
        email: 'librarian@test.com',
        password,
        mobile_no: '9999999994',
        usergroup_id: 'librarian',
        school_id: school._id,
        roles: ['librarian'],
        is_activated: true,
      },
      {
        name: 'Account Manager',
        email: 'accountant@test.com',
        password,
        mobile_no: '9999999993',
        usergroup_id: 'accountant',
        school_id: school._id,
        roles: ['accountant'],
        is_activated: true,
      },
      {
        name: 'Front Desk',
        email: 'receptionist@test.com',
        password,
        mobile_no: '9999999992',
        usergroup_id: 'receptionist',
        school_id: school._id,
        roles: ['receptionist'],
        is_activated: true,
      },
    ];

    console.log('\n📝 Creating/Updating test users...\n');

    for (const userData of testUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        // Update existing user with roles and is_activated
        await User.updateOne(
          { email: userData.email },
          { 
            $set: { 
              roles: userData.roles,
              is_activated: true,
              school_id: userData.school_id,
              usergroup_id: userData.usergroup_id
            }
          }
        );
        console.log(`✅ Updated: ${userData.name} (${userData.email})`);
      } else {
        await User.create(userData);
        console.log(`✅ Created: ${userData.name} (${userData.email})`);
      }
    }

    console.log('\n🎉 Test users creation completed!\n');
    console.log('📋 Login Credentials (All passwords: password123):\n');
    console.log('Super Admin : superadmin@test.com');
    console.log('Admin       : admin@test.com');
    console.log('Teacher     : teacher@test.com');
    console.log('Student     : student@test.com');
    console.log('Parent      : parent@test.com');
    console.log('Librarian   : librarian@test.com');
    console.log('Accountant  : accountant@test.com');
    console.log('Receptionist: receptionist@test.com');
    console.log('\n🔐 Password for all: password123\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

createTestUsers();
