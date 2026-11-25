import React, { memo, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StarField from './StarField';
import PlanetModel from './PlanetModel';

/**
 * SpaceCanvas component - renders a full-viewport, high-performance (60fps)
 * 3D space scene with stars, rotating planet, and orbit controls.
 * Wrapped in React.memo to prevent unnecessary re-renders during UI/route updates.
 */
function SpaceCanvas() {
  const cameraConfig = useMemo(
    () => ({ position: [0, 0.3, 6.2], fov: 45, near: 0.1, far: 1000 }),
    []
  );

  const dprRange = useMemo(() => [1, 2], []);

  const glConfig = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    }),
    []
  );

  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#030712] overflow-hidden select-none">
      <Canvas camera={cameraConfig} dpr={dprRange} gl={glConfig}>
        <Suspense fallback={null}>
          {/* Animated 3D Starfield */}
          <StarField />

          {/* 3D Planet Model with atmosphere and space lighting */}
          <PlanetModel />

          {/* User interaction: smoothly rotate and zoom with mouse */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            enablePan={false}
            minDistance={3.2}
            maxDistance={14.0}
            rotateSpeed={0.8}
            zoomSpeed={0.8}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default memo(SpaceCanvas);
