import React from 'react';
import Sun from './Sun';
import Planet from './Planet';
import { PLANETS } from './PlanetData';

export default function SolarSystem() {
  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.1} />
      <pointLight intensity={1.2} position={[0, 0, 0]} />

      {/* Sun at center */}
      <Sun />

      {/* Map through all planets */}
      {PLANETS.map((planet) => (
        <Planet key={planet.name} data={planet} />
      ))}
    </>
  );
}
