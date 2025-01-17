import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAtom } from 'jotai';
import { GlitchMode } from 'postprocessing';
import { Canvas, useFrame } from '@react-three/fiber';
import { PointMaterial, Points, Reflector, useGLTF, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer, Glitch, Noise } from '@react-three/postprocessing';
import { isGlitchActiveAtom, isSceneLoadedAtom } from './atoms.js';
import Footer from './components/Footer.jsx';
import Sound from './components/Sound.jsx';
import useIsMobile from './hooks/useIsMobileDevice.js';
import * as random from 'maath/random/dist/maath-random.esm';


export default function App() {
  const [_, setSceneLoaded] = useAtom(isSceneLoadedAtom);
  const [isGlitchActive, setGlitchActive] = useAtom(isGlitchActiveAtom);
  const isMobileDevice = useIsMobile();

  useEffect(() => {
    setTimeout(() => {
      setSceneLoaded(true);
    }, 2000);
  }, []);

  const handleGoToPD = () => {
    setGlitchActive(true);
    setTimeout(() => {
      window.open('https://productdock.com', '_self');
    }, 2000);
  };

  return (
    <>
      <Canvas concurrent gl={{ alpha: false }} camera={{ position: [0, 3, 100], fov: 30 }}>
        <color attach="background" args={['black']} />
        <fog attach="fog" args={['black', 15, 20]} />
        <Suspense fallback={null}>
          <PDLogo isMobileDevice={isMobileDevice}
                  scale={[2.5, 2.5, 2.5]}
                  rotation={[Math.PI / 2, 0, 0]}
                  position={[0, 1.6, 1]}
          />
          <Ground mirror={1}
                  blur={[500, 100]}
                  mixBlur={12}
                  mixStrength={0.5}
                  rotation={[-Math.PI / 2, 0, 0]}
                  position={[0, 0, 0]}
          />
          <EffectComposer>
            <Bloom mipmapBlur intensity={1.2} />
            <Glitch
              active={isGlitchActive}
              delay={[1.5, 3.5]}
              duration={[0.6, 1.0]}
              strength={[0.1, 0.2]}
              mode={GlitchMode.CONSTANT_WILD}
              ratio={0.85}
            />
            <Noise opacity={0.07} />
          </EffectComposer>
          <ambientLight intensity={0.5} />
          <spotLight position={[0, 10, 0]} intensity={0.3} />
          <directionalLight position={[0, 0, 0]} />
          <CameraPositionControl />
        </Suspense>
        <Sound />
      </Canvas>
      <Footer onGoToPDClick={handleGoToPD} />
    </>
  );
}

function Stars(props) {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(3000), { radius: 2 }));
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#89CFF0" size={0.02} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

function PDLogo(props) {
  const blue = new THREE.Color('#2BB3FF');
  blue.multiplyScalar(4);
  const glowBlue = new THREE.MeshBasicMaterial({ color: blue, toneMapped: false });
  const { nodes } = useGLTF('/models/pd-lp-1.1.glb');

  return (
    <group {...props} dispose={null}>
      <Stars />
      <mesh
        geometry={nodes.Curve.geometry}
        material={glowBlue}
        position={[-1.759, 0, 1.392]}
        scale={31.937}
      />
    </group>
  );
}

function Ground(props) {
  const [roughness, normal] =
    useTexture(['/textures/SurfaceImperfections003_1K_var1.jpg', '/textures/SurfaceImperfections003_1K_Normal.jpg']);

  return (
    <Reflector resolution={1024} args={[100, 100]} {...props}>
      {(Material, props) => (
        <Material
          color="#f0f0f0"
          metalness={0}
          roughnessMap={roughness}
          normalMap={normal}
          normalMap-colorSpace={THREE.LinearSRGBColorSpace}
          normalScale={[2, 2]}
          {...props}
        />
      )}
    </Reflector>
  );
}

function CameraPositionControl() {
  const [vec] = useState(() => new THREE.Vector3());
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}
