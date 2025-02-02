import React from 'react';
import Sun from './Sun';
import Planet from './Planet';
import GravityGrid from './GravityGrid';
import { PLANETS } from './PlanetData';

const SolarSystem: React.FC = () => {
  return (
    <>
      <Sun />
      {PLANETS.map((planet) => (
        <Planet key={planet.name} data={planet} />
      ))}
      <GravityGrid />
    </>
  );
};

export default SolarSystem;
