import axios from "axios";

interface Category {
  name: string;
  description: string;
}

export const getCategories = async () => {
  try {
    const response = await axios.get("/api/admin/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (category: Category) => {
  try {
    const response = await axios.post("/api/admin/categories", category);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (category: Category) => {
  try {
    const response = await axios.put("/api/admin/categories", category);
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (category: Category) => {
  try {
    const response = await axios.delete("/api/admin/categories", {
      data: category,
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};

export const getCategoryById = async (id: string) => {
  try {
    const response = await axios.get(`/api/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category by id:", error);
    throw error;
  }
};
