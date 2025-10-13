import api from "../api/axios";

export const getProfile = async () => {
  try {
    const response = await api.get("/users/profile");
    return response.data;
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};
