import React from 'react';
import { extend, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Create a custom shader material for a conical (rounded) depression.
// Uniforms:
//   dipRadius: the radius within which the grid is warped (e.g., 500)
//   maxDip: the maximum depth at the center (e.g., dipRadius * tan(θ) with θ ≈ 0.3 radians)
const GravityGridMaterial = shaderMaterial(
  {
    dipRadius: 500.0,
    maxDip: 154.65, // 500 * tan(0.3) ≈ 154.65
  },
  // Vertex Shader
  `
    uniform float dipRadius;
    uniform float maxDip;
    void main() {
      vec3 pos = position;
      // Compute radial distance from the center (the sun)
      float r = length(vec2(pos.x, pos.z));
      float dip = 0.0;
      if (r < dipRadius) {
        // Computse a smooth falloff: at r=0, factor = 1; at r=dipRadius, factor = 0.
        float factor = 1.0 - (r / dipRadius);
        // Use a quadratic falloff for a rounded shape.
        dip = maxDip * factor * factor;
      }
      // Lower the vertex by the computed dip
      pos.y -= dip;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    void main() {
      // Render a constant grey color.
      gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0);
    }
  `
);

// Extend the JSX namespace so we can use <gravityGridMaterial />
extend({ GravityGridMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      gravityGridMaterial: Object3DNode<THREE.ShaderMaterial, typeof GravityGridMaterial>;
    }
  }
}

const GravityGrid: React.FC = () => {
  return (
    // Rotate the mesh so that the grid lies flat in the XZ plane.
    // Here we use a very large plane (10000 x 10000) with many subdivisions.
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <planeGeometry args={[10000, 10000, 200, 200]} />
      {/* Render as wireframe for a transparent grid look */}
      <gravityGridMaterial
        wireframe={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default GravityGrid;
