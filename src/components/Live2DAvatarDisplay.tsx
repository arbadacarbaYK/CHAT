import React from 'react';

export const Live2DAvatarDisplay: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: 400, height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Cross-platform SVG avatar */}
      <svg width="320" height="480" viewBox="0 0 320 480" style={{ background: 'transparent', borderRadius: 16, boxShadow: '0 2px 8px #0002' }}>
        {/* Head */}
        <ellipse cx="160" cy="140" rx="90" ry="110" fill="#ffe0c0" stroke="#222" strokeWidth="4" />
        {/* Hair */}
        <ellipse cx="160" cy="110" rx="95" ry="80" fill="#6b4e2a" stroke="#222" strokeWidth="4" />
        {/* Face outline */}
        <ellipse cx="160" cy="170" rx="80" ry="100" fill="#ffe0c0" />
        {/* Eyes */}
        <ellipse cx="120" cy="170" rx="18" ry="12" fill="#fff" />
        <ellipse cx="200" cy="170" rx="18" ry="12" fill="#fff" />
        <ellipse cx="120" cy="170" rx="8" ry="8" fill="#6b4e2a" />
        <ellipse cx="200" cy="170" rx="8" ry="8" fill="#6b4e2a" />
        {/* Eyebrows */}
        <rect x="100" y="150" width="40" height="6" rx="3" fill="#6b4e2a" />
        <rect x="180" y="150" width="40" height="6" rx="3" fill="#6b4e2a" />
        {/* Nose */}
        <ellipse cx="160" cy="200" rx="6" ry="3" fill="#e0b090" />
        {/* Mouth */}
        <ellipse cx="160" cy="225" rx="18" ry="8" fill="#e08080" />
        {/* Body */}
        <rect x="100" y="260" width="120" height="160" rx="40" fill="#f7c873" stroke="#222" strokeWidth="4" />
        {/* Collar */}
        <polygon points="160,260 140,300 180,300" fill="#fff" />
        {/* Tie */}
        <rect x="152" y="300" width="16" height="40" rx="6" fill="#e08080" />
      </svg>
      <div style={{ position: 'absolute', left: 0, top: 0, color: '#222', background: '#fff8', padding: 4, borderRadius: 8, fontSize: 14, zIndex: 2 }}>
        <span>Cross-platform avatar (SVG)</span>
      </div>
    </div>
  );
}; 