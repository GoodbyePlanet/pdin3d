import { useAtom } from 'jotai';
import Gears from './Gears.jsx';
import SoundIcon from './SoundIcon.jsx';
import { isSceneLoadedAtom, isSoundEnabledAtom } from '../atoms.js';

import './Footer.css';

export default function Footer({onGoToPDClick}) {
  const [sceneLoaded, _] = useAtom(isSceneLoadedAtom);
  const [soundEnabled, setIsSoundEnabled] = useAtom(isSoundEnabledAtom);

  const handleSoundEnable = () => setIsSoundEnabled(!soundEnabled);

  if (!sceneLoaded) {
    return null;
  }

  return (
    <div className="footer">
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
  );
}
