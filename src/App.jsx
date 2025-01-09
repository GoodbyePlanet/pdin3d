import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useAtom } from 'jotai';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Sparkles, useGLTF, useTexture } from '@react-three/drei';
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
        <group position={[0, 0, 0]}>
          <PDLogo rotation={[1.5, 0, 0]} position={[0, 1.6, 1]} scale={[2.5, 2.5, 2.5]} />
          <Ground />
        </group>
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
        <directionalLight position={[-50, 0, -40]} intensity={0.7} />
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
      <Sparkles count={1000} scale={[20, 20, 10]} size={1.5} speed={2} />
      <mesh
        geometry={nodes.Curve.geometry}
        material={glowBlue}
        position={[-1.759, 0, 1.392]}
        scale={31.937}
      />
    </group>
  );
}

function Ground() {
  const [floor] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg']);
  return (
    <mesh position-y={0} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[100, 100]} />
      <MeshReflectorMaterial
        // reflectorOffset={-5}
        roughnessMap={floor}
        // normalMap={normal}
        roughness={1.2}
        resolution={512}
        blur={[400, 100]}
        mixBlur={1}
        depthScale={1}
        opacity={0.5}
        transparent
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#333"
        metalness={0.5}
        mixStrength={5.5} // Strength of the reflections
        mixContrast={1} // Contrast of the reflections
        dithering
        mirror={0.5} />
    </mesh>
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
