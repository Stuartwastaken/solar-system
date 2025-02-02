import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SolarSystem from './components/SolarSystem';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 40, 100], fov: 60 }}>
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        <SolarSystem />
      </Canvas>
    </div>
  );
}

export default App;
