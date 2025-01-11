import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { isBigNoiseActiveAtom, isGlitchActiveAtom } from '../atoms.js';

export const useGlitch = () => {
  const [glitchActive, setGlitchActive] = useAtom(isGlitchActiveAtom);
  const [_, setIsBigNoiseActive] = useAtom(isBigNoiseActiveAtom);

  useEffect(() => {
    const handleMouseDown = () => {
      setGlitchActive(true);
      setIsBigNoiseActive(true);
    }
    const handleMouseUp = () => {
      setGlitchActive(false);
      setIsBigNoiseActive(false);
    }

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return glitchActive;
};
