import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

/**
 * StarField component - creates a deep space star environment
 * with continuous subtle animated rotation.
 */
export default function StarField() {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow realistic cosmological rotation
      groupRef.current.rotation.y += delta * 0.015;
      groupRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary high-density sparkling stars */}
      <Stars
        radius={120}
        depth={60}
        count={6000}
        factor={4}
        saturation={0.3}
        fade
        speed={1.2}
      />
      {/* Distant larger cosmic stars */}
      <Stars
        radius={200}
        depth={80}
        count={2000}
        factor={7}
        saturation={0.8}
        fade
        speed={0.8}
      />
    </group>
  );
}
