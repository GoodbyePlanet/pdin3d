import { useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import Gears from './Gears.jsx';
import SoundIcon from './SoundIcon.jsx';
import { isBigNoiseActiveAtom, isGlitchActiveAtom, isSceneLoadedAtom, isSoundEnabledAtom } from '../atoms.js';
import useIsMobile from '../hooks/useIsMobileDevice.js';

import './Footer.css';

export default function Footer({onGoToPDClick}) {
  const noGlitchHereRef = useRef();
  const [sceneLoaded, _] = useAtom(isSceneLoadedAtom);
  const [soundEnabled, setIsSoundEnabled] = useAtom(isSoundEnabledAtom);
  const [__, setIsGlitchActive] = useAtom(isGlitchActiveAtom);
  const [___, setIsBigNoiseActive] = useAtom(isBigNoiseActiveAtom);
  const isMobileDevice = useIsMobile();

  useEffect(() => {
    const handleMouseDown = (event) => {
      if (noGlitchHereRef.current && noGlitchHereRef.current.contains(event.target)) {
        return; // Exit early, we don't want glitch when clicking on buttons
      }

      if (!isMobileDevice) {
        setIsGlitchActive(true);
        setIsBigNoiseActive(true);
      }
    }
    const handleMouseUp = () => {
      setIsGlitchActive(false);
      setIsBigNoiseActive(false);
    }
    const handleTouchStart = () => setIsGlitchActive(false);
    const handleTouchEnd = () => setIsGlitchActive(false);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchstart', handleTouchStart);
      window.addEventListener('touchend', handleTouchEnd);
   };
  }, []);

  const handleSoundEnable = () => setIsSoundEnabled(!soundEnabled);

  if (!sceneLoaded) {
    return null;
  }

  return (
    <div className="footer">
      <div className="noGlitch" ref={noGlitchHereRef}>
        <div className="item">
          <Gears />
        </div>
        <div className="item">
          <div onClick={onGoToPDClick} className="pulsating-circle"></div>
        </div>
        <div className="item">
          <SoundIcon onSoundIconClick={handleSoundEnable} />
        </div>
      </div>
    </div>
  );
}
