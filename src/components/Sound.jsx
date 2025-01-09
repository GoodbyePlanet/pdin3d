import { useAtom } from 'jotai';
import { PositionalAudio } from '@react-three/drei';
import { isSoundEnabledAtom } from '../atoms.js';

export default function Sound() {
  const [soundEnabled] = useAtom(isSoundEnabledAtom);

  return (
    <mesh>
      {soundEnabled && (
        <>
          <PositionalAudio autoplay loop url="/sounds/can39t-run-dark-electronic-10801.mp3" distance={0.6} />
        </>
      )}
    </mesh>
  );
};
