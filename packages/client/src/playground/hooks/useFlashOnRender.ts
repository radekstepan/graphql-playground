import { useEffect, useRef } from "react";
import { useRendersCount } from "react-use";

// Flash a component when it re-renders.
export const useFlashOnRender = () => {
  const componentRef = useRef<any>(null);

  const r = useRendersCount();
  useEffect(() => {
    const node = componentRef.current;
    if (node) {
      node.classList.remove('flash');
      void node.offsetWidth; // force reflow
      node.classList.add('flash');

      const onAnimationEnd = () => node.classList.remove('flash');
      node.addEventListener('animationend', onAnimationEnd);
      return () => node.removeEventListener('animationend', onAnimationEnd);
    }
  }, [r]);

  return componentRef;
};