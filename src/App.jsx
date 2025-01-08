import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useState } from 'react';
import * as THREE from 'three';
import { Reflector, Sparkles, useGLTF, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer } from '@react-three/postprocessing';

function App() {
  return (
    // <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }}>
    <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 3, 100], fov: 30 }}>
      <color attach="background" args={['black']} />
      <fog attach="fog" args={['black', 15, 20]} />
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <PDLogo rotation={[1.5, 0, 0]} position={[0, 1.6, 1]} scale={[2.5, 2.5, 2.5]} />
          <Ground />
        </group>
        <EffectComposer>
          <Bloom mipmapBlur intensity={1.2} />
        </EffectComposer>
        <ambientLight intensity={0.5} />
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        <directionalLight position={[-50, 0, -40]} intensity={0.7} />
        {/*<Environment preset="sunset" />*/}
        <Intro />
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
      {/*<Sparkles count={500} scale={[20, 20, 20]} size={1.5} speed={2} />*/}
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
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg']);
  return (
    <Reflector blur={[400, 100]} resolution={512} args={[25, 25]} mirror={0.9} mixBlur={1} mixStrength={1.5}
               rotation={[-Math.PI / 2, -0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a6dbf7" metalness={0.4} roughnessMap={floor} normalMap={normal}
                                      normalScale={[2, 2]} {...props} />}
    </Reflector>
  );
}

function Intro() {
  const [vec] = useState(() => new THREE.Vector3());
  return useFrame((state) => {
    state.camera.position.lerp(vec.set(state.mouse.x * 5, 3 + state.mouse.y * 2, 14), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}


export default App;
