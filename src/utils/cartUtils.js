// src/utils/cartUtils.js

// Get cart items from localStorage
export const getCartItems = () => {
  try {
    const items = localStorage.getItem('cartItems');
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading cart items:', error);
    return [];
  }
};

// Save cart items to localStorage
export const saveCartItems = (items) => {
  try {
    localStorage.setItem('cartItems', JSON.stringify(items));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { items } }));
  } catch (error) {
    console.error('Error saving cart items:', error);
  }
};

// Add item to cart
export const addToCart = (item) => {
  const items = getCartItems();
  
  // Check if item already exists (same report ID and license)
  const existingItemIndex = items.findIndex(
    cartItem => cartItem.reportId === item.reportId && cartItem.license === item.license
  );
  
  if (existingItemIndex > -1) {
    // Item already exists, return false to indicate duplicate
    return false;
  }
  
  // Add new item with unique cart ID
  const newItem = {
    ...item,
    cartId: Date.now() + Math.random(), // Unique ID for cart item
    addedAt: new Date().toISOString()
  };
  
  items.push(newItem);
  saveCartItems(items);
  return true;
};

// Remove item from cart
export const removeFromCart = (cartId) => {
  const items = getCartItems();
  const updatedItems = items.filter(item => item.cartId !== cartId);
  saveCartItems(updatedItems);
};

// Clear entire cart
export const clearCart = () => {
  saveCartItems([]);
};

// Get cart total count
export const getCartCount = () => {
  return getCartItems().length;
};