import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Sun from './components/Sun';
import Planet from './components/Planet';
import GravityGrid from './components/GravityGrid';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 30, 50], fov: 60 }}>
        <ambientLight intensity={0.1} />
        {/* Sun's light */}
        <pointLight intensity={1.0} position={[0, 0, 0]} />

        <Sun />
        <Planet orbitRadius={15} color="blue" size={1} speed={0.5} />
        <Planet orbitRadius={25} color="red" size={1.5} speed={0.3} />

        {/* Gravity grid (toggle visibility or effect in code or with React state) */}
        <GravityGrid />

        {/* Orbit controls for user interaction */}
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
}

export default App;
