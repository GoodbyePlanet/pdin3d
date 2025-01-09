import { useEffect, useState } from 'react';

export const useGlitch = () => {
  const [glitchActive, setGlitchActive] = useState(false);

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
}
