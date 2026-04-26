import { useEffect, useState, useRef } from 'react';

const DEFAULT_THRESHOLD = 0.2;

/**
 * Observes an element and flips `isVisible` to true once it enters the viewport.
 * If `animated` is false the element is visible immediately (no observer created).
 *
 * @param {boolean} animated  Whether to animate entrance (default true)
 * @param {number}  threshold IntersectionObserver threshold (default 0.2)
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useEntranceAnimation(animated = true, threshold = DEFAULT_THRESHOLD) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (!animated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [animated, threshold]);

  return { ref, isVisible };
}
