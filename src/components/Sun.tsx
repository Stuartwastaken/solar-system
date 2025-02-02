import React from 'react';

export default function Sun() {
  // Let's scale the sun so it doesn't fill the entire view.
  // Actual ratio is ~109 Earth diameters, but we might choose a smaller factor for convenience.
  const sunRadius = 10;

  return (
    <mesh>
      <sphereGeometry args={[sunRadius, 32, 32]} />
      <meshStandardMaterial emissive="yellow" emissiveIntensity={1} color="orange" />
    </mesh>
  );
}
