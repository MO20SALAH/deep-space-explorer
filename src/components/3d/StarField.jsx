import React, { memo, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

/**
 * StarField component - creates a deep space star environment
 * with continuous subtle animated rotation via useRef + useFrame.
 */
function StarField() {
  const groupRef = useRef(null);

  const primaryStarsProps = useMemo(
    () => ({
      radius: 120,
      depth: 60,
      count: 6000,
      factor: 4,
      saturation: 0.3,
      fade: true,
      speed: 1.2,
    }),
    []
  );

  const distantStarsProps = useMemo(
    () => ({
      radius: 200,
      depth: 80,
      count: 2000,
      factor: 7,
      saturation: 0.8,
      fade: true,
      speed: 0.8,
    }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Slow realistic cosmological rotation without triggering React re-renders
      groupRef.current.rotation.y += delta * 0.015;
      groupRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary high-density sparkling stars */}
      <Stars {...primaryStarsProps} />
      {/* Distant larger cosmic stars */}
      <Stars {...distantStarsProps} />
    </group>
  );
}

export default memo(StarField);
