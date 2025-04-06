import axios from "axios";

export const logout = async () => {
  const response = await axios.post("/api/auth/logout");
  return response.data;
};
