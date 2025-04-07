import { getProductById } from "@/services/public/home/product";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

// Add product to cart if not exist, if exist, increase quantity
export const addToCart = async (
  productId: string,
  size: string,
  color: string,
  quantity: number
) => {
  try {
    const product = await getProductById(productId);
    const cart = localStorage.getItem("cart");
    if (cart) {
      const cartItems = JSON.parse(cart);
      const existingItem = cartItems.find(
        (item: CartItem) =>
          item.productId === productId &&
          item.size === size &&
          item.color === color
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.push({
          productId,
          name: product.name,
          price: product.price,
          size: size,
          color: color,
          quantity: quantity,
        });
      }
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.setItem(
        "cart",
        JSON.stringify([
          {
            productId,
            name: product.name,
            price: product.price,
            size: size,
            color: color,
            quantity: quantity,
          },
        ])
      );
    }
  } catch (error) {
    console.error(error);
  }
};

// Get cart items
export const getCart = async () => {
  try {
    const cart = localStorage.getItem("cart");
    return cart;
  } catch (error) {
    console.error(error);
  }
};

// Remove product from cart
export const removeFromCart = async (productId: string) => {
  try {
    const cart = localStorage.getItem("cart");
    if (cart) {
      const cartItems = JSON.parse(cart);
      const newCart = cartItems.filter(
        (item: CartItem) => item.productId !== productId
      );
      localStorage.setItem("cart", JSON.stringify(newCart));
    }
  } catch (error) {
    console.error(error);
  }
};

// Clear cart
export const clearCart = async () => {
  try {
    localStorage.removeItem("cart");
  } catch (error) {
    console.error(error);
  }
};
