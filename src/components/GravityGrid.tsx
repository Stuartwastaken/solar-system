import React, { useRef, useEffect } from 'react';
import { useFrame, extend, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { BODIES, AU_SCALE } from './CelestialBodies';

const NUM_BODIES = BODIES.length; // 9

// This custom shader calculates a warp (dip) in the grid based on the gravitational influence
// of each body. The displacement is computed from the distance between each grid vertex (in XZ)
// and the planet positions. A non-linear warp factor is computed and applied as a vertical dip.
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
      vec3 pos = position; // pos is in the XZ plane (y is up)
      float displacement = 0.0;
      // For each body, compare the vertex's (x,z) to the planet's (x,z)
      for (int i = 0; i < NUM_BODIES; i++) {
        if (i < numPlanets) {
          float d = distance(vec2(pos.x, pos.z), vec2(planetPositions[i].x, planetPositions[i].z));
          displacement += planetMasses[i] / (d + 1.0);
        }
      }
      // Compute a rounded warp factor (adjust 0.05 for sensitivity)
      float warp = 1.0 - exp(-displacement * 0.05);
      // Apply the warp along the y axis (vertical dip)
      pos.y -= warp * 100.0;
      vWarp = warp;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader – mix between light grey and dark grey based on the warp depth
  `
    varying float vWarp;
    void main() {
      float shade = mix(0.8, 0.2, vWarp);
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
      // Default PlaneGeometry is in the XY plane; rotate about the X axis by -90°
      geometryRef.current.rotateX(-Math.PI / 2);
    }
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const positions: THREE.Vector3[] = [];
    const masses: number[] = [];
    // For each body in the shared BODIES array, compute its current position.
    BODIES.forEach((body) => {
      const orbitRadius = body.orbitRadiusAU * AU_SCALE;
      // For bodies with no orbital period (e.g. the Sun) position remains at (0,0,0)
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
    // The grid lies in the XZ plane; adjust position as needed.
    <mesh rotation={[0, 0, 0]}  position={[0, -20, 0]}>
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
