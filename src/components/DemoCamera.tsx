import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BODIES, AU_SCALE } from './CelestialBodies';

interface DemoCameraProps {
  orbitRadius?: number;     // Base orbit radius (in scene units) around the locked target
  orbitSpeed?: number;      // Angular speed (radians per second) for orbiting around the target
  zoomAmplitude?: number;    // Amplitude of the zoom (oscillation in the orbit radius)
  zoomSpeed?: number;        // Frequency (radians per second) of the zoom oscillation
  verticalOffset?: number;   // Fixed vertical offset (Y) above the target
  smoothing?: number;        // Lerp factor for smoothing camera movement (0-1)
  timeScale?: number;        // Factor to speed up or slow down the simulation
}

// Define the sequence of targets and how long to lock onto each (in simulation seconds)
interface TargetSegment {
  name: string;
  duration: number;
}

const targetSequence: TargetSegment[] = [
  { name: 'Earth', duration: 5 },
  { name: 'Jupiter', duration: 5 },
  { name: 'Uranus', duration: 5 },
  { name: 'Neptune', duration: 5 },
];

const DemoCamera: React.FC<DemoCameraProps> = ({
  orbitRadius = 150,
  orbitSpeed = 1.0,
  zoomAmplitude = 50,
  zoomSpeed = 1.0,
  verticalOffset = 50,
  smoothing = 0.1,
  timeScale = 1,
}) => {
  const { camera } = useThree();

  // Total duration for one complete cycle of targets.
  const totalDuration = targetSequence.reduce((acc, seg) => acc + seg.duration, 0);

  // Store the current segment index, the locked target position, and the start time of the current segment.
  const currentSegmentIndex = useRef<number>(0);
  const lockedTarget = useRef<THREE.Vector3>(new THREE.Vector3());
  const segmentStartTime = useRef<number>(0);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * timeScale;
    // Determine current time within the cycle.
    const cycleTime = t % totalDuration;

    // Find which segment the current cycle time falls into.
    let accumulated = 0;
    let segmentIndex = 0;
    for (let i = 0; i < targetSequence.length; i++) {
      accumulated += targetSequence[i].duration;
      if (cycleTime < accumulated) {
        segmentIndex = i;
        break;
      }
    }

    // If we have entered a new segment, update the locked target position.
    if (segmentIndex !== currentSegmentIndex.current) {
      currentSegmentIndex.current = segmentIndex;
      segmentStartTime.current = t;
      const targetName = targetSequence[segmentIndex].name;
      const targetData = BODIES.find(b => b.name === targetName);
      if (targetData) {
        // Compute the target's current position (assumed in the XZ plane) using AU_SCALE.
        const orbit = targetData.orbitRadiusAU * AU_SCALE;
        const angle = t * targetData.angularSpeed;
        lockedTarget.current = new THREE.Vector3(
          orbit * Math.cos(angle),
          0,
          orbit * Math.sin(angle)
        );
      } else {
        lockedTarget.current = new THREE.Vector3(0, 0, 0);
      }
    }

    // Use the locked target as the center of the current segment.
    const targetPos = lockedTarget.current.clone();

    // Compute a dynamic orbit radius that oscillates (for zoom in/out effects).
    const dynamicRadius = orbitRadius + zoomAmplitude * Math.sin(zoomSpeed * t);
    // Compute an independent orbit angle for the camera.
    const orbitAngle = t * orbitSpeed;
    // Compute an offset vector (in the XZ plane) and add a vertical offset.
    const offset = new THREE.Vector3(
      dynamicRadius * Math.cos(orbitAngle),
      verticalOffset,
      dynamicRadius * Math.sin(orbitAngle)
    );
    const desiredPos = targetPos.clone().add(offset);

    // Smoothly interpolate the camera position.
    camera.position.lerp(desiredPos, smoothing);
    camera.lookAt(targetPos);
  });

  return null;
};

export default DemoCamera;
