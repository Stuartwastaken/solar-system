import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetInfo } from './PlanetData';

const AU_SCALE = 20; // 1 AU = 20 units in our 3D scene
const EARTH_RADIUS = 1; // Earth radius in 3D units (so Earth's diameter is ~2 in this scene)

type PlanetProps = {
  data: PlanetInfo;
};

export default function Planet({ data }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // We compute the angular speed based on the orbital period in Earth years.
  // We'll say 1 Earth year = 2 * PI in angle. If planet has period T, speed = (2*pi)/T.
  const orbitalSpeed = (2 * Math.PI) / data.orbitalPeriodEarthYears;

  // Scale orbit radius
  const orbitRadius = data.orbitRadiusAU * AU_SCALE;
  // Scale planet radius
  const planetRadius = data.sizeRelativeToEarth * EARTH_RADIUS;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      const angle = t * orbitalSpeed;
      meshRef.current.position.x = orbitRadius * Math.cos(angle);
      meshRef.current.position.z = orbitRadius * Math.sin(angle);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[planetRadius, 32, 32]} />
      <meshStandardMaterial color={data.color} />
    </mesh>
  );
}
