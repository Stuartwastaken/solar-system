import React, { useRef, useEffect } from 'react';
import { useFrame, extend, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { BODIES, AU_SCALE } from './CelestialBodies';

const NUM_BODIES = BODIES.length; // e.g., 9

// Custom shader material that computes a warp (dip) in the grid based on gravitational influence.
// Here we use an exponential function (then take a square root) so the warp is less pointy,
// and we mix the color from light grey to dark grey for deeper dips.
const GravityGridMaterial = shaderMaterial(
  {
    planetPositions: new Array(NUM_BODIES).fill(new THREE.Vector3()),
    planetMasses: new Array(NUM_BODIES).fill(0.0),
    numPlanets: NUM_BODIES,
    time: 0.0,
  },
  // Vertex Shader
  `
    #define NUM_BODIES ${NUM_BODIES}
    uniform vec3 planetPositions[NUM_BODIES];
    uniform float planetMasses[NUM_BODIES];
    uniform int numPlanets;
    uniform float time;
    varying float vWarp;
    
    void main() {
      vec3 pos = position; // Our plane is defined in the XZ plane (with y as up)
      float displacement = 0.0;
      // For each body, compare this vertex's (x,z) to the planet's (x,z)
      for (int i = 0; i < NUM_BODIES; i++) {
        if (i < numPlanets) {
          float d = distance(vec2(pos.x, pos.z), vec2(planetPositions[i].x, planetPositions[i].z));
          displacement += planetMasses[i] / (d + 1.0);
        }
      }
      // Compute a warp factor; the exponential function gives a non-linear (rounded) response.
      float warp = 1.0 - exp(-displacement * 0.05);
      warp = sqrt(warp); // Smoothing: take square root so the dip is less sharp.
      // Apply the warp as a vertical dip (on y)
      pos.y -= warp * 100.0;
      vWarp = warp;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader – darken the grid in areas with a stronger warp.
  `
    varying float vWarp;
    void main() {
      // Mix from a light grey (0.6) to a darker grey (0.1) as warp increases.
      float shade = mix(0.6, 0.1, vWarp);
      gl_FragColor = vec4(vec3(shade), 1.0);
    }
  `
);

extend({ GravityGridMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gravityGridMaterial: Object3DNode<THREE.ShaderMaterial, typeof GravityGridMaterial>;
    }
  }
}

const GravityGrid: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const geometryRef = useRef<THREE.PlaneGeometry>(null);

  // Rotate the plane geometry so its vertices are defined in the XZ plane.
  useEffect(() => {
    if (geometryRef.current) {
      // By default, PlaneGeometry is in the XY plane; rotate about X by -90°.
      geometryRef.current.rotateX(-Math.PI / 2);
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const positions: THREE.Vector3[] = [];
    const masses: number[] = [];
    // For each body in BODIES, compute its current position on the XZ plane.
    BODIES.forEach((body) => {
      const orbitRadius = body.orbitRadiusAU * AU_SCALE;
      // For bodies with an orbital period (i.e. not the Sun), compute position using angular speed.
      const angle = body.orbitalPeriodEarthYears > 0 ? t * body.angularSpeed : 0;
      const x = orbitRadius * Math.cos(angle);
      const z = orbitRadius * Math.sin(angle);
      positions.push(new THREE.Vector3(x, 0, z));
      masses.push(body.mass);
    });
    if (materialRef.current) {
      materialRef.current.uniforms.planetPositions.value = positions;
      materialRef.current.uniforms.planetMasses.value = masses;
      materialRef.current.uniforms.numPlanets.value = NUM_BODIES;
      materialRef.current.uniforms.time.value = t;
    }
  });

  return (
    // The mesh is positioned so that the grid lies beneath the solar system.
    <mesh position={[0, 25, 0]}>
      <planeGeometry ref={geometryRef} args={[3000, 3000, 100, 100]} />
      <gravityGridMaterial
        ref={materialRef}
        side={THREE.DoubleSide}
        wireframe={true}
        polygonOffset
        polygonOffsetFactor={1}
        polygonOffsetUnits={1}
      />
    </mesh>
  );
};

export default GravityGrid;
