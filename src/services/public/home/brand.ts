import axios from "axios";

export const getBrands = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/public/home/brands`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const getBrandById = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/public/home/brands/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching brand:", error);
    throw error;
  }
};
