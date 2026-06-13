import { create } from 'zustand';
import { useCustomerAuthStore } from './useCustomerAuthStore';

export const useFavoriteStore = create((set, get) => ({
  favoriteIds: [],
  isLoading: false,

  fetchFavorites: async () => {
    const { customerToken } = useCustomerAuthStore.getState();
    if (!customerToken) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/favorites/ids`, {
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });
      if (res.ok) {
        const ids = await res.json();
        set({ favoriteIds: ids });
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (productId) => {
    const { customerToken } = useCustomerAuthStore.getState();
    if (!customerToken) {
      // Prompt user to login if needed. We return false so caller can handle it
      return false;
    }

    const { favoriteIds } = get();
    const isFav = favoriteIds.includes(productId);

    // Optimistic UI update
    set({
      favoriteIds: isFav 
        ? favoriteIds.filter(id => id !== productId)
        : [...favoriteIds, productId]
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/v1/favorites/${productId}`, {
        method: isFav ? 'DELETE' : 'POST',
        headers: { 'Authorization': `Bearer ${customerToken}` }
      });

      if (!res.ok) {
        // Revert on failure
        throw new Error('Failed to toggle favorite');
      }
      return true;
    } catch (error) {
      console.error(error);
      // Revert optimistic update
      set({ favoriteIds });
      return false;
    }
  },

  clearFavorites: () => set({ favoriteIds: [] })
}));
