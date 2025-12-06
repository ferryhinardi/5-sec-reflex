'use client';

import { useEffect, useState } from 'react';

interface StreakNotificationProps {
  combo: number;
}

export default function StreakNotification({ combo }: StreakNotificationProps) {
  const [show, setShow] = useState(false);
  const [displayCombo, setDisplayCombo] = useState(0);

  useEffect(() => {
    if (combo > 0 && combo % 5 === 0 && combo !== displayCombo) {
      setDisplayCombo(combo);
      setShow(true);
      const timer = setTimeout(() => setShow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [combo, displayCombo]);

  if (!show) return null;

  return (
    <div className="streak-notification show">
      {displayCombo}x STREAK!
    </div>
  );
}
