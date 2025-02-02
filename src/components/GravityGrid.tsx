import React from 'react';

export default function GravityGrid() {
  // In the future, use a custom shader to displace vertices based on potential.
  return (
    <gridHelper args={[1000, 1000, 'white', 'gray']} position={[0, -5, 0]} />
  );
}