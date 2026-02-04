import React from 'react';
import { FAVORITE_TYPES } from '../hooks/useFavorites';
import FavoriteButton from './FavoriteButton';

// Ikoner och labels för varje favorit-typ
const TYPE_CONFIG = {
  [FAVORITE_TYPES.FOOD]: {
    label: 'Livsmedel',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.06 22.99h1.66c.84 0 1.53-.64 1.63-1.46L23 5.05l-5 2v5h-2V5.05l-5-2v8.77c.75.26 1.42.66 2 1.18V7.05l3 1.2v5.75H11V5.05L1 9.52c.12.95.78 1.77 1.72 2.08l5.28 1.75v6.65h1.66c0-1.1.9-2 2-2h4.34c1.1 0 2 .9 2 2zm-1.06-3h-2v-3h2v3z"/>
      </svg>
    ),
    color: '#4CAF50'
  },
  [FAVORITE_TYPES.TEMPERATURE]: {
    label: 'Temperaturer',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 13V5c0-1.66-1.34-3-3-3S9 3.34 9 5v8c-1.21.91-2 2.37-2 4 0 2.76 2.24 5 5 5s5-2.24 5-5c0-1.63-.79-3.09-2-4zm-4-8c0-.55.45-1 1-1s1 .45 1 1h-1v1h1v2h-1v1h1v2h-2V5z"/>
      </svg>
    ),
    color: '#FF5722'
  },
  [FAVORITE_TYPES.SOUSVIDE]: {
    label: 'Sous Vide',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
        <circle cx="12" cy="11" r="3"/>
      </svg>
    ),
    color: '#9C27B0'
  },
  [FAVORITE_TYPES.RECIPE]: {
    label: 'Recept',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
      </svg>
    ),
    color: '#E87D48'
  },
  [FAVORITE_TYPES.CONVERSION]: {
    label: 'Omvandlingar',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
      </svg>
    ),
    color: '#2196F3'
  },
  [FAVORITE_TYPES.RICE]: {
    label: 'Ris',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    color: '#795548'
  },
  [FAVORITE_TYPES.EGG]: {
    label: 'Agg',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3C8.5 3 5 9.5 5 14c0 3.31 2.69 6 6 6h2c3.31 0 6-2.69 6-6 0-4.5-3.5-11-7-11z"/>
      </svg>
    ),
    color: '#FFC107'
  }
};

/**
 * Sektion som visar alla favoriter
 */
export function FavoritesSection({
  favorites,
  onToggleFavorite,
  onSelectFavorite,
  onClose
}) {
  const allFavorites = [];

  Object.entries(favorites).forEach(([type, items]) => {
    items.forEach(item => {
      allFavorites.push({ ...item, type });
    });
  });

  // Sortera efter tillagd tid (nyast först)
  allFavorites.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

  if (allFavorites.length === 0) {
    return (
      <div className="favorites-section empty">
        <div className="favorites-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <p>Inga favoriter an</p>
          <p className="hint">Klicka pa hjartat for att spara</p>
        </div>
      </div>
    );
  }

  // Gruppera efter typ
  const grouped = {};
  allFavorites.forEach(fav => {
    if (!grouped[fav.type]) grouped[fav.type] = [];
    grouped[fav.type].push(fav);
  });

  return (
    <div className="favorites-section">
      <div className="favorites-header">
        <h3>Mina favoriter ({allFavorites.length})</h3>
        {onClose && (
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>

      <div className="favorites-list">
        {Object.entries(grouped).map(([type, items]) => {
          const config = TYPE_CONFIG[type] || { label: type, color: '#666' };

          return (
            <div key={type} className="favorites-group">
              <div className="favorites-group-header" style={{ color: config.color }}>
                {config.icon}
                <span>{config.label}</span>
                <span className="count">({items.length})</span>
              </div>

              <div className="favorites-group-items">
                {items.map(item => (
                  <div
                    key={`${type}-${item.id}`}
                    className="favorite-item"
                    onClick={() => onSelectFavorite && onSelectFavorite(type, item)}
                  >
                    <div className="favorite-item-content">
                      <span className="favorite-name">{item.name}</span>
                      {item.data?.subtitle && (
                        <span className="favorite-subtitle">{item.data.subtitle}</span>
                      )}
                    </div>
                    <FavoriteButton
                      isFavorite={true}
                      onToggle={() => onToggleFavorite(type, item.id, item.name, item.data)}
                      size="small"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// CSS för FavoritesSection (läggs till i App.jsx)
export const favoritesSectionStyles = `
.favorites-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.favorites-section.empty {
  text-align: center;
  padding: 40px 20px;
}

.favorites-empty {
  color: #999;
}

.favorites-empty svg {
  margin-bottom: 16px;
}

.favorites-empty p {
  margin: 8px 0;
}

.favorites-empty .hint {
  font-size: 13px;
  color: #bbb;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.favorites-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.favorites-header .close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.favorites-header .close-btn:hover {
  color: #666;
}

.favorites-group {
  margin-bottom: 20px;
}

.favorites-group:last-child {
  margin-bottom: 0;
}

.favorites-group-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.favorites-group-header .count {
  font-weight: 400;
  opacity: 0.7;
}

.favorites-group-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.favorite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.favorite-item:hover {
  background: #f0f1f2;
  transform: translateX(4px);
}

.favorite-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.favorite-name {
  font-weight: 500;
  color: #333;
}

.favorite-subtitle {
  font-size: 12px;
  color: #888;
}
`;

export default FavoritesSection;
