import prisma from "../config/prisma.js";
import { DEFAULT_USER_ID } from "../utils/constants.js";

/**
 * Retrieve user by ID, with a safe fallback to auto-create the default mock user
 * @param {string} id 
 * @returns {Promise<Object>} user
 */
export const getUserById = async (id) => {
  let user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user && id === DEFAULT_USER_ID) {
    user = await prisma.user.upsert({
      where: { id: DEFAULT_USER_ID },
      update: {},
      create: {
        id: DEFAULT_USER_ID,
        name: "Happy Lakhotia",
        email: "happy.lakhotia@example.in",
        phone: "9876543210",
        address: "Flat 101, A-Wing, Royal Residency",
        apartment: "Bandra West, Near Metro Station",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
      },
    });
  }

  return user;
};

/**
 * Update user profile address and details
 * @param {string} id 
 * @param {Object} profileData 
 * @returns {Promise<Object>} updatedUser
 */
export const updateUserProfile = async (id, profileData) => {
  // Ensure the user record exists first
  await getUserById(id);

  // Extract name parts or full name if provided
  let fullName = profileData.name;
  if (!fullName && profileData.firstName) {
    fullName = `${profileData.firstName} ${profileData.lastName || ""}`.trim();
  }

  return await prisma.user.update({
    where: { id },
    data: {
      name: fullName || undefined,
      email: profileData.email || undefined,
      phone: profileData.phone !== undefined ? profileData.phone : undefined,
      address: profileData.address !== undefined ? profileData.address : undefined,
      apartment: profileData.apartment !== undefined ? profileData.apartment : undefined,
      city: profileData.city !== undefined ? profileData.city : undefined,
      state: profileData.state !== undefined ? profileData.state : undefined,
      zipCode: profileData.zipCode !== undefined ? profileData.zipCode : undefined,
    },
  });
};

/**
 * Register a new user in database
 * @param {Object} userData - { name, email, password }
 * @returns {Promise<Object>} user
 */
export const registerUser = async ({ name, email, password }) => {
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    throw new Error("All fields are required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw new Error("An account with this email address already exists");
  }

  // Generate a premium unique user ID
  const newUserId = `user-${Math.random().toString(36).substring(2, 11)}`;

  return await prisma.user.create({
    data: {
      id: newUserId,
      name: name.trim(),
      email: normalizedEmail,
      password: password.trim(), // Storing plain text password for this e-commerce mock demo
      phone: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });
};

/**
 * Login a user by validating their email and password
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} user
 */
export const loginUser = async ({ email, password }) => {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || user.password !== password.trim()) {
    throw new Error("Invalid email or password");
  }

  return user;
};
