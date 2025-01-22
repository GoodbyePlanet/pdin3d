import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAtom } from 'jotai';
import { GlitchMode } from 'postprocessing';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointMaterial, Points, Reflector, useGLTF, useTexture } from '@react-three/drei';
import { Bloom, EffectComposer, Glitch, Noise } from '@react-three/postprocessing';
import { isGlitchActiveAtom, isSceneLoadedAtom } from './atoms.js';
import Footer from './components/Footer.jsx';
import Sound from './components/Sound.jsx';
import * as random from 'maath/random/dist/maath-random.esm';

const LIGHT_BLUE = '#89CFF0';
const DARK_BLUE = '#00A3CC';
const GREY = '#F0F0F0';

export default function App() {
  const [_, setSceneLoaded] = useAtom(isSceneLoadedAtom);
  const [isGlitchActive, setGlitchActive] = useAtom(isGlitchActiveAtom);

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
          <PDLogo
            scale={[2.5, 2.5, 2.5]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 1.6, 1]}
          />
          <Ground
            mirror={1}
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
  const { pointer } = useThree();
  const [materialColor, setMaterialColor] = useState(new THREE.Color(LIGHT_BLUE));

  useFrame((_, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Interpolate color based on mouse position
    const orange = new THREE.Color(DARK_BLUE);
    const blue = new THREE.Color(LIGHT_BLUE);
    const t = (pointer.x + 1) / 2; // Normalize mouse.x from [-1, 1] to [0, 1]
    const newColor = orange.clone().lerp(blue, t); // Interpolate between orange and blue
    setMaterialColor(newColor);
  });

  return (
    <group rotation={[2, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color={materialColor} size={0.025} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

function PDLogo(props) {
  const blue = new THREE.Color(LIGHT_BLUE);
  blue.multiplyScalar(4);
  const [materialColor, setMaterialColor] = useState(new THREE.MeshBasicMaterial({ color: blue, toneMapped: false }));

  const { nodes } = useGLTF('/models/pd-lp-1.1.glb');
  const { pointer } = useThree();

  useFrame(() => {
    const orange = new THREE.Color(DARK_BLUE);
    orange.multiplyScalar(4);
    const blue = new THREE.Color(LIGHT_BLUE);
    blue.multiplyScalar(4);
    const t = (pointer.x + 1) / 2; // Normalize mouse.x from [-1, 1] to [0, 1]
    const newColor = orange.clone().lerp(blue, t); // Interpolate between orange and blue

    const c = new THREE.MeshBasicMaterial({ color: newColor, toneMapped: false });
    setMaterialColor(c);
  });

  return (
    <group {...props} dispose={null}>
      <Stars color={materialColor} />
      <mesh
        geometry={nodes.Curve.geometry}
        material={materialColor}
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
          color={GREY}
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
    state.camera.position.lerp(vec.set(state.pointer.x * 5, 3 + state.pointer.y * 2, 14), 0.05);
    state.camera.lookAt(0, 0, 0);
  });
}
