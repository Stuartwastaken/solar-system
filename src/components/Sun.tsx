import React from 'react';

export default function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[5, 32, 32]} />
      <meshStandardMaterial emissive={"yellow"} emissiveIntensity={1} />
    </mesh>
  );
}
