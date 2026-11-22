import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StarField from './StarField';
import PlanetModel from './PlanetModel';

/**
 * SpaceCanvas component - renders a full-viewport, high-performance (60fps)
 * 3D space scene with stars, rotating planet, and orbit controls.
 */
export default function SpaceCanvas() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full bg-[#030712] overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 0.3, 6.2], fov: 45, near: 0.1, far: 1000 }}
        dpr={[1, 2]} // Crisp rendering on high-DPI retina screens without lag
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
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
