import React from 'react';
import { Stars } from '@react-three/drei';

const BackgroundStars: React.FC = () => {
  return (
    <Stars 
      radius={300}      // Radius of the inner sphere (distance from center)
      depth={60}        // Depth of area where stars are randomly placed
      count={5000}      // How many stars
      factor={4}        // Size factor: higher = bigger stars
      saturation={0}    // 0 means stars are white
      fade              // Stars fade with distance (optional)
    />
  );
};

export default BackgroundStars;
