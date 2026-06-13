import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      setCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

      addToCart: (product, quantity = 1) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.product.id === product.id);
        const maxStock = product.stockQuantity ?? 999;

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > maxStock) {
            import('react-hot-toast').then(m => m.default.error(`Bạn chỉ có thể mua tối đa ${maxStock} sản phẩm này!`));
            set({
              cart: currentCart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: maxStock }
                  : item
              ),
            });
          } else {
            set({
              cart: currentCart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: newQuantity }
                  : item
              ),
            });
          }
        } else {
          if (quantity > maxStock) {
            import('react-hot-toast').then(m => m.default.error(`Bạn chỉ có thể mua tối đa ${maxStock} sản phẩm này!`));
            set({ cart: [...currentCart, { product, quantity: maxStock }] });
          } else {
            set({ cart: [...currentCart, { product, quantity }] });
          }
        }
      },

      removeFromCart: (productId) => {
        set({
          cart: get().cart.filter((item) => item.product.id !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        
        const currentCart = get().cart;
        const itemToUpdate = currentCart.find(item => item.product.id === productId);
        if (itemToUpdate) {
            const maxStock = itemToUpdate.product.stockQuantity ?? 999;
            if (quantity > maxStock) {
                import('react-hot-toast').then(m => m.default.error(`Bạn chỉ có thể mua tối đa ${maxStock} sản phẩm này!`));
                set({
                  cart: currentCart.map((item) =>
                    item.product.id === productId ? { ...item, quantity: maxStock } : item
                  ),
                });
                return;
            }
        }

        set({
          cart: currentCart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => {
          const price = item.product.salePrice || item.product.regularPrice;
          return total + price * item.quantity;
        }, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'green-elegance-cart-storage',
      partialize: (state) => ({ cart: state.cart }), // Chỉ lưu trữ mảng giỏ hàng dưới localStorage
    }
  )
);
