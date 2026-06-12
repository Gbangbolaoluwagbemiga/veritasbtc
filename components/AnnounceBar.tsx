'use client';

import { useEffect, useState } from 'react';

export default function AnnounceBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('announce-dismissed')) setVisible(true);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem('announce-dismissed', '1');
  }

  if (!visible) return null;

  return (
    <div className="announce-bar">
      <span className="ab-text">
        🎉 <strong>Launch Special:</strong> Every plan is completely{' '}
        <strong>free for your first 30 days</strong>. No credit card needed.{' '}
        <span className="ab-sub">Early adopters lock in prices forever.</span>
      </span>
      <button className="announce-close" onClick={dismiss} aria-label="Dismiss">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
          <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
