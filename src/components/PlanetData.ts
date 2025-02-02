// Relative to Earth's orbit = 1 AU -> We'll scale Earth's orbit to 20 in 3D space.
// Relative to Earth's diameter = 1 -> We'll give Earth a radius of ~1 in 3D units (so diameter ~2).
// Orbital period is in Earth years. Example: Mercury ~0.24, Venus ~0.62, etc.

// This is a simplified subset of real data.
export interface PlanetInfo {
    name: string;
    color: string;
    orbitRadiusAU: number;     // orbit distance in AU
    sizeRelativeToEarth: number; // ratio of planet radius to Earth
    orbitalPeriodEarthYears: number;
  }
  
  export const PLANETS: PlanetInfo[] = [
    {
      name: 'Mercury',
      color: 'gray',
      orbitRadiusAU: 0.39,
      sizeRelativeToEarth: 0.38,
      orbitalPeriodEarthYears: 0.24
    },
    {
      name: 'Venus',
      color: 'yellow',
      orbitRadiusAU: 0.72,
      sizeRelativeToEarth: 0.95,
      orbitalPeriodEarthYears: 0.62
    },
    {
      name: 'Earth',
      color: 'blue',
      orbitRadiusAU: 1.0,
      sizeRelativeToEarth: 1.0,
      orbitalPeriodEarthYears: 1.0
    },
    {
      name: 'Mars',
      color: 'red',
      orbitRadiusAU: 1.52,
      sizeRelativeToEarth: 0.53,
      orbitalPeriodEarthYears: 1.88
    },
    {
      name: 'Jupiter',
      color: 'orange',
      orbitRadiusAU: 5.2,
      sizeRelativeToEarth: 11.21,
      orbitalPeriodEarthYears: 11.86
    },
    {
      name: 'Saturn',
      color: 'goldenrod',
      orbitRadiusAU: 9.58,
      sizeRelativeToEarth: 9.45,
      orbitalPeriodEarthYears: 29.46
    },
    {
      name: 'Uranus',
      color: 'lightblue',
      orbitRadiusAU: 19.2,
      sizeRelativeToEarth: 4.01,
      orbitalPeriodEarthYears: 84.01
    },
    {
      name: 'Neptune',
      color: 'blue',
      orbitRadiusAU: 30.05,
      sizeRelativeToEarth: 3.88,
      orbitalPeriodEarthYears: 164.8
    }
  ];
  