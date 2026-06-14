import { create } from 'zustand';
import { useCustomerAuthStore } from './useCustomerAuthStore';

export const useFavoriteStore = create((set, get) => ({
  favoriteIds: [],
  isLoading: false,

  fetchFavorites: async () => {
    const { customerToken } = useCustomerAuthStore.getState();
    
    if (!customerToken) {
      // Guest/Anonymous user - read from localStorage
      try {
        const localFavs = localStorage.getItem('ge_favorites');
        if (localFavs) {
          set({ favoriteIds: JSON.parse(localFavs) });
        } else {
          set({ favoriteIds: [] });
        }
      } catch (e) {
        console.error('Failed to parse local favorites', e);
        set({ favoriteIds: [] });
      }
      return;
    }

    set({ isLoading: true });
    try {
      // Sync guest favorites from localStorage to database on login
      const localFavsStr = localStorage.getItem('ge_favorites');
      if (localFavsStr) {
        try {
          const localFavIds = JSON.parse(localFavsStr);
          if (Array.isArray(localFavIds) && localFavIds.length > 0) {
            // Send requests to add local favorites to database
            await Promise.allSettled(
              localFavIds.map(id =>
                fetch(`${import.meta.env.VITE_API_URL}/v1/favorites/${id}`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${customerToken}` }
                })
              )
            );
            // Clear local cache after successful sync
            localStorage.removeItem('ge_favorites');
          }
        } catch (e) {
          console.error('Failed to sync local favorites', e);
        }
      }

      // Fetch official favorite IDs from server
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
    const { favoriteIds } = get();
    const isFav = favoriteIds.includes(productId);

    if (!customerToken) {
      // Guest user logic - save to localStorage
      const updatedIds = isFav
        ? favoriteIds.filter(id => id !== productId)
        : [...favoriteIds, productId];
      
      set({ favoriteIds: updatedIds });
      localStorage.setItem('ge_favorites', JSON.stringify(updatedIds));
      return true;
    }

    // Authenticated user logic
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

  clearFavorites: () => {
    localStorage.removeItem('ge_favorites');
    set({ favoriteIds: [] });
  }
}));
