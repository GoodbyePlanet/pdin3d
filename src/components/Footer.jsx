import { useAtom } from 'jotai';
import Gears from './Gears.jsx';
import SoundIcon from './SoundIcon.jsx';
import { isSceneLoadedAtom } from '../atoms.js';

import './Footer.css';

export default function Footer() {
  const [sceneLoaded, __] = useAtom(isSceneLoadedAtom);

  if (!sceneLoaded) {
    return null;
  }

  return (
    <div className="footer">
      <div className="item">
        <Gears />
      </div>
      <div className="item">
        <div className="pulsating-circle"></div>
      </div>
      <div className="item">
        <SoundIcon />
      </div>
    </div>
  );
}
