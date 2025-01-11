import { useAtom } from 'jotai';
import { PositionalAudio } from '@react-three/drei';
import { isBigNoiseActiveAtom, isSoundEnabledAtom } from '../atoms.js';

export default function Sound() {
  const [soundEnabled] = useAtom(isSoundEnabledAtom);
  const [isBigNoise] = useAtom(isBigNoiseActiveAtom);

  return (
    <mesh>
      {soundEnabled && (
        <>
          {!isBigNoise && <PositionalAudio autoplay loop url="/noise.mp3" distance={1} />}
          {isBigNoise && <PositionalAudio autoplay loop url="/big_noise.mp3" distance={1} />}
        </>
      )}
    </mesh>
  );
};
