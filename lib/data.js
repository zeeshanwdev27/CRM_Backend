import mongoose from "mongoose";
import User from "../models/User.js";
import Role from "../models/Role.js";
import Department from "../models/Department.js";
import bcrypt from "bcryptjs";

async function connectDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CrmApp");
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

async function setupAdminRoleAndDepartment() {
  // Define all roles and their permissions
  const roles = [
    {
      name: "Developer",
      description: "Developer with access to development tasks",
      permissions: ["create", "read", "update", "delete"],
      isDefault: true,
    },
    {
      name: "Designer",
      description: "Designer with access to design tasks",
      permissions: ["create", "read", "update"],
      isDefault: false,
    },
    {
      name: "Project Manager",
      description: "Manages projects and team coordination",
      permissions: ["read", "update", "approve_content", "view_reports"],
      isDefault: false,
    },
    {
      name: "QA Engineer",
      description: "Quality assurance and testing",
      permissions: ["read", "update", "view_reports"],
      isDefault: false,
    },
    {
      name: "Marketing",
      description: "Handles marketing campaigns",
      permissions: ["create", "read", "update", "approve_content"],
      isDefault: false,
    },
    {
      name: "Sales",
      description: "Manages sales and client relations",
      permissions: ["read", "update", "export_data"],
      isDefault: false,
    },
    {
      name: "Administrator",
      description: "System administrator with full access",
      permissions: [
        "create",
        "read",
        "update",
        "delete",
        "manage_users",
        "manage_roles",
        "manage_departments",
        "approve_content",
        "view_reports",
        "export_data",
      ],
      isDefault: false,
    },
  ];

  // Define all departments
  const departments = [
    {
      name: "Engineering",
      description: "Engineering department for developers and QA",
      isActive: true,
    },
    {
      name: "Design",
      description: "Design department for UI/UX designers",
      isActive: true,
    },
    {
      name: "Product",
      description: "Product management department",
      isActive: true,
    },
    {
      name: "Marketing",
      description: "Marketing and promotions department",
      isActive: true,
    },
    {
      name: "Sales",
      description: "Sales and client management department",
      isActive: true,
    },
    {
      name: "Support",
      description: "Customer support department",
      isActive: true,
    },
    {
      name: "HR",
      description: "Human resources department",
      isActive: true,
    },
    {
      name: "Admin",
      description: "Admin department for administrators",
      isActive: true,
    },
  ];

  // Create or update roles
  const createdRoles = [];
  for (const role of roles) {
    let existingRole = await Role.findOne({ name: role.name });
    if (!existingRole) {
      existingRole = await Role.create({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        isDefault: role.isDefault,
      });
      console.log(`${role.name} role created`);
    } else {
      console.log(`${role.name} role already exists`);
    }
    createdRoles.push(existingRole);
  }

  // Create or update departments
  const createdDepartments = [];
  for (const dept of departments) {
    let existingDept = await Department.findOne({ name: dept.name });
    if (!existingDept) {
      existingDept = await Department.create({
        name: dept.name,
        description: dept.description,
        isActive: dept.isActive,
      });
      console.log(`${dept.name} department created`);
    } else {
      console.log(`${dept.name} department already exists`);
    }
    createdDepartments.push(existingDept);
  }

  // Find admin role and department for the admin user
  const adminRole = createdRoles.find((role) => role.name === "Administrator");
  const adminDepartment = createdDepartments.find(
    (dept) => dept.name === "Admin"
  );

  return { adminRole, adminDepartment };
}

async function createAdminUser(adminRole, adminDepartment) {
  try {
    // Check if admin already exists
    const existAdmin = await User.findOne({ email: "admin123@gmail.com" });
    if (existAdmin) {
      console.log("Admin already registered");
      return;
    }

    console.log(`Here is Admin Role ${adminRole}, Here is Admin Department ${adminDepartment} which stores in DB`)

    // Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash("admin123", salt);

    // Create admin user
    const adminUser = new User({
      name: "System Admin",
      email: "admin123@gmail.com",
      password: "admin123", // Use hashed password
      phone: "+10000000000",
      role: adminRole._id,
      department: adminDepartment._id,
      status: "Active",
      isVerified: true,
      profileImage: "default-admin.jpg",
    });

    await adminUser.save();

    // Update department manager if needed
    if (!adminDepartment.manager) {
      adminDepartment.manager = adminUser._id;
      await adminDepartment.save();
    }

    console.log("Admin successfully created:");
    console.log(`Email: admin123@gmail.com`);
    console.log(`Password: admin123`);
    console.log("Please change this password immediately after first login!");
  } catch (e) {
    console.error("Error creating admin user:", e);
  }
}

async function main() {
  try {
    await connectDB();

    // Setup all roles and departments, and get admin role/department
    const { adminRole, adminDepartment } = await setupAdminRoleAndDepartment();

    // Create admin user
    await createAdminUser(adminRole, adminDepartment);
  } catch (e) {
    console.error("Error in main execution:", e);
  } finally {
    mongoose.connection.close();
  }
}

main();