const PROFILE_KEY = "amazon_user_profile";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const DEFAULT_USER_ID = "user-001";

const getActiveUserId = () => {
  try {
    const saved = localStorage.getItem("amazon_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed?.id) return parsed.id;
    }
  } catch { }
  return DEFAULT_USER_ID;
};

const getHeaders = () => ({
  "Content-Type": "application/json",
  "x-user-id": getActiveUserId(),
});

// A safe fallback profile 
const STATIC_FALLBACK_USER = {
  id: DEFAULT_USER_ID,
  name: "Happy Lakhotia",
  email: "happy.lakhotia@example.in",
  phone: "9876543210",
  address: "IIIT KOTA, Ranpur",
  apartment: "Block-B Hostel-3",
  city: "Kota",
  state: "Rajasthan",
  zipCode: "325003",
};

export const getUserProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error("API Profile fetch failed");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Profile DB API fetch failed, falling back to localStorage/static. Error:", error.message);
    try {
      const data = localStorage.getItem(PROFILE_KEY);
      return data ? JSON.parse(data) : { ...STATIC_FALLBACK_USER };
    } catch {
      return { ...STATIC_FALLBACK_USER };
    }
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
  } catch (err) {
    console.error("Failed to save profile locally", err);
  }

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error("API Profile update failed");
    return await response.json();
  } catch (error) {
    console.warn("⚠️ Profile DB API update failed. Proceeding locally.", error.message);
    return profileData;
  }
};


export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to sign in.");
  }

  const user = await response.json();
  localStorage.setItem("amazon_user", JSON.stringify(user));
  return user;
};


export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to register account.");
  }

  const user = await response.json();
  localStorage.setItem("amazon_user", JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  try {
    localStorage.removeItem("amazon_user");
    localStorage.removeItem(PROFILE_KEY);
  } catch (err) {
    console.error("Sign out failed", err);
  }
};
