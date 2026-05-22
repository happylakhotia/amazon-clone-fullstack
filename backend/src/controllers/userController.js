import * as userService from "../services/userService.js";
import { DEFAULT_USER_ID } from "../utils/constants.js";

/**
 * Fetch default user profile details
 * Route: GET /api/users/profile
 */
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update default user profile address and info
 * Route: PUT /api/users/profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.headers["x-user-id"] || DEFAULT_USER_ID;
    const updatedUser = await userService.updateUserProfile(userId, req.body);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Register a new user profile
 * Route: POST /api/users/register
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await userService.registerUser({ name, email, password });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Verify credentials and login user
 * Route: POST /api/users/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userService.loginUser({ email, password });
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
