import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type PlanetProps = {
  orbitRadius: number;
  color: string;
  size: number;
  speed: number;
};

export default function Planet({ orbitRadius, color, size, speed }: PlanetProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = orbitRadius * Math.cos(t);
      ref.current.position.z = orbitRadius * Math.sin(t);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
