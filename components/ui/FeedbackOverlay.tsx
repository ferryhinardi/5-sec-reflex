'use client';

import { useEffect, useState } from 'react';
import type { Rating } from '@/lib/gameConfig';

interface FeedbackOverlayProps {
  rating: Rating | null;
}

export default function FeedbackOverlay({ rating }: FeedbackOverlayProps) {
  const [activeRating, setActiveRating] = useState<Rating | null>(null);

  useEffect(() => {
    if (rating) {
      setActiveRating(rating);
      const timer = setTimeout(() => setActiveRating(null), 500);
      return () => clearTimeout(timer);
    }
  }, [rating]);

  if (!activeRating) return null;

  return <div className={`feedback-overlay ${activeRating}`} />;
}
