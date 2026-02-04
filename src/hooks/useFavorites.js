import { useState, useEffect, useCallback } from 'react';

// Favorit-typer som stöds
export const FAVORITE_TYPES = {
  FOOD: 'food',           // Livsmedel från näringsdatabasen
  TEMPERATURE: 'temp',    // Innertemperaturer
  SOUSVIDE: 'sousvide',   // Sous vide-inställningar
  RECIPE: 'recipe',       // Grundrecept
  CONVERSION: 'conv',     // Måttomvandlingar
  RICE: 'rice',           // Ristyper
  EGG: 'egg',             // Äggkokning
};

const STORAGE_KEY = 'koksguiden-favorites-v2';

/**
 * Hook för att hantera favoriter av alla typer
 * Migrerar automatiskt från gamla formatet (v1) till nya (v2)
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return {};

    // Försök ladda nya formatet
    const savedV2 = localStorage.getItem(STORAGE_KEY);
    if (savedV2) {
      try {
        return JSON.parse(savedV2);
      } catch (e) {
        console.error('Failed to parse favorites v2:', e);
      }
    }

    // Migrera från gamla formatet
    const savedV1 = localStorage.getItem('koksguiden-favorites');
    if (savedV1) {
      try {
        const oldFavorites = JSON.parse(savedV1);
        // Gamla formatet var en array med food items
        const migrated = {
          [FAVORITE_TYPES.FOOD]: oldFavorites.map(f => ({
            id: f.code,
            name: f.name,
            data: f
          }))
        };
        return migrated;
      } catch (e) {
        console.error('Failed to migrate favorites:', e);
      }
    }

    return {};
  });

  // Spara till localStorage när favorites ändras
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites]);

  /**
   * Lägg till eller ta bort en favorit
   * @param {string} type - Typ av favorit (från FAVORITE_TYPES)
   * @param {string} id - Unikt ID för favoriten
   * @param {string} name - Visningsnamn
   * @param {object} data - Extra data att spara
   */
  const toggleFavorite = useCallback((type, id, name, data = {}) => {
    setFavorites(prev => {
      const typeList = prev[type] || [];
      const exists = typeList.find(f => f.id === id);

      if (exists) {
        // Ta bort
        return {
          ...prev,
          [type]: typeList.filter(f => f.id !== id)
        };
      } else {
        // Lägg till
        return {
          ...prev,
          [type]: [...typeList, { id, name, data, addedAt: Date.now() }]
        };
      }
    });
  }, []);

  /**
   * Kolla om något är en favorit
   */
  const isFavorite = useCallback((type, id) => {
    const typeList = favorites[type] || [];
    return typeList.some(f => f.id === id);
  }, [favorites]);

  /**
   * Hämta alla favoriter av en viss typ
   */
  const getFavoritesByType = useCallback((type) => {
    return favorites[type] || [];
  }, [favorites]);

  /**
   * Hämta alla favoriter (platt lista)
   */
  const getAllFavorites = useCallback(() => {
    const all = [];
    Object.entries(favorites).forEach(([type, items]) => {
      items.forEach(item => {
        all.push({ ...item, type });
      });
    });
    return all.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
  }, [favorites]);

  /**
   * Rensa alla favoriter av en viss typ
   */
  const clearFavoritesByType = useCallback((type) => {
    setFavorites(prev => ({
      ...prev,
      [type]: []
    }));
  }, []);

  /**
   * Räkna antal favoriter
   */
  const getFavoritesCount = useCallback(() => {
    return Object.values(favorites).reduce((sum, list) => sum + list.length, 0);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
    getAllFavorites,
    clearFavoritesByType,
    getFavoritesCount,
    FAVORITE_TYPES
  };
}

export default useFavorites;
