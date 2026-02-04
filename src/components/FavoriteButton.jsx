import React from 'react';

/**
 * Återanvändbar favorit-knapp
 * @param {boolean} isFavorite - Om objektet är en favorit
 * @param {function} onToggle - Callback när knappen klickas
 * @param {string} size - 'small' | 'medium' | 'large'
 * @param {string} className - Extra CSS-klasser
 */
export function FavoriteButton({ isFavorite, onToggle, size = 'medium', className = '' }) {
  const sizes = {
    small: { button: '28px', icon: '14px' },
    medium: { button: '36px', icon: '18px' },
    large: { button: '44px', icon: '22px' }
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`favorite-button ${isFavorite ? 'active' : ''} ${className}`}
      title={isFavorite ? 'Ta bort favorit' : 'Lagg till favorit'}
      style={{
        width: currentSize.button,
        height: currentSize.button,
        minWidth: currentSize.button,
        borderRadius: '50%',
        border: 'none',
        background: isFavorite ? '#E87D48' : 'rgba(0,0,0,0.05)',
        color: isFavorite ? 'white' : '#666',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        fontSize: currentSize.icon,
        padding: 0,
        flexShrink: 0
      }}
    >
      {isFavorite ? (
        <svg width={currentSize.icon} height={currentSize.icon} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      ) : (
        <svg width={currentSize.icon} height={currentSize.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      )}
    </button>
  );
}

export default FavoriteButton;
