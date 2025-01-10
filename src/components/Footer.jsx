import { useAtom } from 'jotai';
import Gears from './Gears.jsx';
import SoundIcon from './SoundIcon.jsx';
import { isSceneLoadedAtom } from '../atoms.js';

import './Footer.css';

export default function Footer({onGoToPDClick}) {
  const [sceneLoaded, _] = useAtom(isSceneLoadedAtom);

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
        <SoundIcon />
      </div>
    </div>
  );
}
