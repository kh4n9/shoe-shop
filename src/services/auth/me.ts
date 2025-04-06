import axios from "axios";

export const getMe = async () => {
  const response = await axios.get("/api/auth/me");
  return response.data;
};
