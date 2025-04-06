import axios from "axios";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const getUsers = async () => {
  try {
    const response = await axios.get("/api/admin/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (user: User) => {
  try {
    const response = await axios.post("/api/admin/users", user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (user: User) => {
  try {
    const response = await axios.put("/api/admin/users", user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (user: User) => {
  try {
    const response = await axios.delete("/api/admin/users", {
      data: user,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};
