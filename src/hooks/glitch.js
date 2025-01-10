import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { isGlitchActiveAtom } from '../atoms.js';

export const useGlitch = () => {
  const [glitchActive, setGlitchActive] = useAtom(isGlitchActiveAtom);

  useEffect(() => {
    const handleMouseDown = () => setGlitchActive(true);
    const handleMouseUp = () => setGlitchActive(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return glitchActive;
};
