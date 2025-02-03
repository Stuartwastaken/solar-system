import React from 'react';
import Sun from './Sun';
import Planet from './Planet';
import GravityGrid from './GravityGrid';
import { BODIES } from './CelestialBodies';

const SolarSystem: React.FC = () => {
  return (
    <>
      <Sun />
      {BODIES.filter(body => body.name !== 'Sun').map((body) => (
        <Planet key={body.name} body={body} />
      ))}
      <GravityGrid />
    </>
  );
};

export default SolarSystem;
