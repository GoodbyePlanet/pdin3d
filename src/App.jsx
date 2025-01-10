import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useAtom } from 'jotai';
import { Canvas, useFrame } from '@react-three/fiber';
import { Reflector, Sparkles, useGLTF, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer, Glitch, Noise } from '@react-three/postprocessing';
import { GlitchMode } from 'postprocessing';
import { useGlitch } from './hooks/glitch.js';
import { isSceneLoadedAtom } from './atoms.js';

function App() {
  const glitchActive = useGlitch();
  const [__, setSceneLoaded] = useAtom(isSceneLoadedAtom);

  useEffect(() => {
    setTimeout(() => {
      setSceneLoaded(true);
    }, 2700);
  }, []);

  return (
    <Canvas concurrent gl={{ alpha: false }} camera={{ position: [0, 3, 100], fov: 30 }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <PDLogo rotation={[Math.PI / 2, 0, 0]} position={[0, 1.6, 1]} scale={[2.5, 2.5, 2.5]} />
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
            active={glitchActive}
            delay={[1.5, 3.5]}
            duration={[0.6, 1.0]}
            strength={[0.1, 0.2]}
            mode={GlitchMode.CONSTANT_MILD}
            ratio={0.85}
          />
          <Noise opacity={0.05} />
        </EffectComposer>
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        <directionalLight position={[0, 0, 0]} />
        <CameraPositionControl />
      </Suspense>
    </Canvas>
  );
}

function PDLogo(props) {
  const blue = new THREE.Color('#2BB3FF');
  blue.multiplyScalar(4);
  const glowBlue = new THREE.MeshBasicMaterial({ color: blue, toneMapped: false });

  const { nodes } = useGLTF('/pd-lp-1.1.glb');
  return (
    <group {...props} dispose={null}>
      <Sparkles count={500} scale={[20, 20, 10]} size={1.5} speed={2} />
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
  const [roughness, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg']);

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

export default App;
