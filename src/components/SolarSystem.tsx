import React from 'react';
import Sun from './Sun';
import Planet from './Planet';
import GravityGrid from './GravityGrid';
import LagrangeVertices from './LagrangeVertices';
import { BODIES } from './CelestialBodies';

interface SolarSystemProps {
  timeScale: number;
  showLagrangePoints: boolean;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ timeScale, showLagrangePoints }) => {
  return (
    <>
      <Sun />
      {BODIES.filter(body => body.name !== 'Sun').map((body) => (
        <Planet key={body.name} body={body} timeScale={timeScale} />
      ))}
      <GravityGrid timeScale={timeScale} />
      {showLagrangePoints && <LagrangeVertices timeScale={timeScale} visible={showLagrangePoints} />}
    </>
  );
};

export default SolarSystem;
