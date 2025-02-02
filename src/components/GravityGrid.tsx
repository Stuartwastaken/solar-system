// src/components/GravityGrid.tsx
import React, { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Define a custom shader material.
// We assume a fixed number of bodies (NUM_BODIES = 9: Sun + 8 planets).
const NUM_BODIES = 9;

const GravityGridMaterial = shaderMaterial(
  // Uniforms: an array of positions (vec3), an array of masses, number of bodies and time.
  {
    planetPositions: new Array(NUM_BODIES).fill(new THREE.Vector3()),
    planetMasses: new Array(NUM_BODIES).fill(0.0),
    numPlanets: NUM_BODIES,
    time: 0.0,
  },
  // Vertex shader:
  `
    #define NUM_BODIES ${NUM_BODIES}
    uniform vec3 planetPositions[NUM_BODIES];
    uniform float planetMasses[NUM_BODIES];
    uniform int numPlanets;
    uniform float time;
    varying float vDisplacement;

    void main() {
      vec3 pos = position;
      float displacement = 0.0;
      // For each body, compute a pull based on distance.
      for (int i = 0; i < NUM_BODIES; i++) {
        if (i < numPlanets) {
          // Compute distance in the xz plane
          float d = distance(vec2(pos.x, pos.z), vec2(planetPositions[i].x, planetPositions[i].z));
          displacement += planetMasses[i] / (d + 1.0);
        }
      }
      // Scale displacement to see a visible bend
      pos.y += displacement * 0.1;
      vDisplacement = displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment shader:
  `
    varying float vDisplacement;
    void main() {
      // Use a gray tone modulated by the displacement.
      gl_FragColor = vec4(vec3(0.5 + vDisplacement * 0.05), 1.0);
    }
  `
);

// Make the material available as a JSX element.
extend({ GravityGridMaterial });

export default function GravityGrid() {
  const ref = useRef<any>();

  // Simulated physics data for the Sun and planets.
  // In a real project, you would import these from your physics/integrator.ts.
  // Each body has a mass, an orbit radius, an angular speed, and an initial phase.
  const bodies = [
    { name: 'Sun',     mass: 1000, orbitRadius: 0,  angularSpeed: 0,    initialAngle: 0 },
    { name: 'Mercury', mass: 0.055, orbitRadius: 10, angularSpeed: 0.5,  initialAngle: 0 },
    { name: 'Venus',   mass: 0.815, orbitRadius: 15, angularSpeed: 0.4,  initialAngle: 1 },
    { name: 'Earth',   mass: 1.0,   orbitRadius: 20, angularSpeed: 0.3,  initialAngle: 2 },
    { name: 'Mars',    mass: 0.107, orbitRadius: 25, angularSpeed: 0.25, initialAngle: 3 },
    { name: 'Jupiter', mass: 317.8, orbitRadius: 35, angularSpeed: 0.15, initialAngle: 4 },
    { name: 'Saturn',  mass: 95.2,  orbitRadius: 45, angularSpeed: 0.1,  initialAngle: 5 },
    { name: 'Uranus',  mass: 14.5,  orbitRadius: 55, angularSpeed: 0.07, initialAngle: 6 },
    { name: 'Neptune', mass: 17.1,  orbitRadius: 65, angularSpeed: 0.05, initialAngle: 7 },
  ];

  // Update the shader uniforms on every frame.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Prepare arrays for positions and masses.
    const positions: THREE.Vector3[] = [];
    const masses: number[] = [];
    bodies.forEach((body) => {
      let angle = body.angularSpeed * t + body.initialAngle;
      let x = body.orbitRadius * Math.cos(angle);
      let z = body.orbitRadius * Math.sin(angle);
      // For the Sun (orbitRadius zero) position remains at the origin.
      positions.push(new THREE.Vector3(x, 0, z));
      masses.push(body.mass);
    });
    // Update the material uniforms.
    if (ref.current) {
      ref.current.uniforms.planetPositions.value = positions;
      ref.current.uniforms.planetMasses.value = masses;
      ref.current.uniforms.numPlanets.value = bodies.length;
      ref.current.uniforms.time.value = t;
    }
  });

  return (
    // Rotate the mesh so the grid lies flat in the xz plane.
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      {/* A large plane with many segments to see the bending effect */}
      <planeBufferGeometry args={[100, 100, 100, 100]} />
      <gravityGridMaterial ref={ref} />
    </mesh>
  );
}
