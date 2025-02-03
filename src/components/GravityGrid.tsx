import React, { useRef } from 'react';
import { useFrame, extend, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

const NUM_BODIES = 9;

const GravityGridMaterial = shaderMaterial(
  {
    planetPositions: new Array(NUM_BODIES).fill(new THREE.Vector3()),
    planetMasses: new Array(NUM_BODIES).fill(0.0),
    numPlanets: NUM_BODIES,
    time: 0.0
  },
  // Vertex Shader – now we add the gravitational displacement to pos.z
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
      // Compute a contribution from each body based on its mass and distance
      for (int i = 0; i < NUM_BODIES; i++) {
        if (i < numPlanets) {
          // Since our plane is in the XY plane, use pos.x and pos.y for distance.
          float d = distance(vec2(pos.x, pos.y), vec2(planetPositions[i].x, planetPositions[i].y));
          displacement += planetMasses[i] / (d + 1.0);
        }
      }
      // Apply the displacement along the Z axis (depth)
      pos.z += displacement;
      vDisplacement = displacement;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader – output a simple grey color
  `
    varying float vDisplacement;
    void main() {
      gl_FragColor = vec4(vec3(0.5), 1.0);
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

interface Body {
  name: string;
  mass: number;
  orbitRadius: number;
  angularSpeed: number;
  initialAngle: number;
}

const bodies: Body[] = [
  { name: 'Sun',     mass: 300,   orbitRadius: 0,  angularSpeed: 0.0,  initialAngle: 0 },
  { name: 'Mercury', mass: 0.055, orbitRadius: 10, angularSpeed: 0.5,  initialAngle: 0 },
  { name: 'Venus',   mass: 0.815, orbitRadius: 15, angularSpeed: 0.4,  initialAngle: 1 },
  { name: 'Earth',   mass: 1.0,   orbitRadius: 20, angularSpeed: 0.3,  initialAngle: 2 },
  { name: 'Mars',    mass: 0.107, orbitRadius: 25, angularSpeed: 0.25, initialAngle: 3 },
  { name: 'Jupiter', mass: 317.8, orbitRadius: 35, angularSpeed: 0.15, initialAngle: 4 },
  { name: 'Saturn',  mass: 95.2,  orbitRadius: 45, angularSpeed: 0.1,  initialAngle: 5 },
  { name: 'Uranus',  mass: 14.5,  orbitRadius: 55, angularSpeed: 0.07, initialAngle: 6 },
  { name: 'Neptune', mass: 17.1,  orbitRadius: 65, angularSpeed: 0.05, initialAngle: 7 }
];

const GravityGrid: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const positions: THREE.Vector3[] = [];
    const masses: number[] = [];
    bodies.forEach((body) => {
      const angle = body.angularSpeed * t + body.initialAngle;
      // For our grid (in the XY plane) we use (x,y)
      const x = body.orbitRadius * Math.cos(angle);
      const y = body.orbitRadius * Math.sin(angle);
      positions.push(new THREE.Vector3(x, y, 0));
      masses.push(body.mass);
    });
    if (materialRef.current) {
      materialRef.current.uniforms.planetPositions.value = positions;
      materialRef.current.uniforms.planetMasses.value = masses;
      materialRef.current.uniforms.numPlanets.value = bodies.length;
      materialRef.current.uniforms.time.value = t;
    }
  });

  return (
    
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
      {/* Large plane: 1000 x 1000 with subdivisions for finer warping */}
      <planeGeometry args={[1000, 1000, 20, 20]} />
      {/* Render as a wireframe (transparent grid with grey lines) */}
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
