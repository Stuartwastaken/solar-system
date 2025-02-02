import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { PlanetInfo } from './PlanetData';

const AU_SCALE = 20;
const EARTH_RADIUS = 1;

interface PlanetProps {
  data: PlanetInfo;
}

const Planet: React.FC<PlanetProps> = ({ data }) => {
  const meshRef = useRef<Mesh>(null);
  const orbitalSpeed = (2 * Math.PI) / data.orbitalPeriodEarthYears;
  const orbitRadius = data.orbitRadiusAU * AU_SCALE;
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
};

export default Planet;
