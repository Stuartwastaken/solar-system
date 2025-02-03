import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { CelestialBody } from './CelestialBodies';
import { Html } from '@react-three/drei';

const AU_SCALE = 20; // 1 AU equals 20 scene units

interface PlanetProps {
  body: CelestialBody;
}

const Planet: React.FC<PlanetProps> = ({ body }) => {
  const meshRef = useRef<Mesh>(null);
  const orbitRadius = body.orbitRadiusAU * AU_SCALE;
  const planetRadius = body.sizeRelativeToEarth; // using Earth's radius as unit

  useFrame(({ clock }) => {
    if (meshRef.current && body.orbitalPeriodEarthYears > 0) {
      const t = clock.getElapsedTime();
      const angle = t * body.angularSpeed; // angularSpeed pre-computed
      meshRef.current.position.x = orbitRadius * Math.cos(angle);
      meshRef.current.position.z = orbitRadius * Math.sin(angle);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[planetRadius, 32, 32]} />
      <meshStandardMaterial color={body.color} />
      {/* Place a label above the planet */}
      <Html 
        position={[0, planetRadius + 2, 0]}
        center
        style={{ color: body.color, fontSize: '24px', fontWeight: 'bold' }}
      >
        {body.name}
      </Html>
    </mesh>
  );
};

export default Planet;
