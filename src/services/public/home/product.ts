import axios from "axios";

export const getProducts = async (brandId?: string, categoryId?: string) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}/public/home/products`;
    if (brandId) {
      url += `?brand=${brandId}`;
    }
    if (categoryId) {
      url += `?category=${categoryId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/public/home/products/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const getBestSellingProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/public/home/products/best-selling`
    );
    console.log("RESPONSE", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching best selling products:", error);
    throw error;
  }
};
