import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import SolarSystem from './components/SolarSystem';

const App: React.FC = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 40, 100], fov: 60 }}>
        <ambientLight intensity={0.2} />
        <pointLight intensity={1.2} position={[0, 0, 0]} />
        <SolarSystem />
        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default App;
