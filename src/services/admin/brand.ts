import axios from "axios";

interface Brand {
  name: string;
  description: string;
}

export const getBrands = async () => {
  try {
    const response = await axios.get("/api/admin/brands");
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    throw error;
  }
};

export const createBrand = async (brand: Brand) => {
  try {
    const response = await axios.post("/api/admin/brands", brand);
    return response.data;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
};

export const updateBrand = async (brand: Brand) => {
  try {
    const response = await axios.put("/api/admin/brands", brand);
    return response.data;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
};

export const deleteBrand = async (brand: Brand) => {
  try {
    const response = await axios.delete("/api/admin/brands", {
      data: brand,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
};

export const getBrandById = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/brands/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brand by id:", error);
    throw error;
  }
};
