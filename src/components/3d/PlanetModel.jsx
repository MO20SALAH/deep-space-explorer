import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Generates a high-resolution procedural planetary texture
 * featuring oceans, continents, terrain details, and polar caps.
 */
function createProceduralPlanetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep ocean background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#021024');
  oceanGrad.addColorStop(0.5, '#052659');
  oceanGrad.addColorStop(1, '#021024');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Procedural continental landmasses
  ctx.fillStyle = '#1e5f74';
  const continents = [
    { x: 180, y: 180, rx: 120, ry: 80 },
    { x: 420, y: 220, rx: 140, ry: 90 },
    { x: 720, y: 190, rx: 130, ry: 75 },
    { x: 260, y: 340, rx: 110, ry: 70 },
    { x: 600, y: 330, rx: 100, ry: 65 },
    { x: 860, y: 280, rx: 90, ry: 60 },
  ];

  continents.forEach(({ x, y, rx, ry }) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    // Continental interior high ground (greener / earthy)
    ctx.fillStyle = '#2f8f9d';
    ctx.beginPath();
    ctx.ellipse(x + 10, y - 5, rx * 0.65, ry * 0.65, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3bacb6';
    ctx.beginPath();
    ctx.ellipse(x + 5, y - 10, rx * 0.35, ry * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e5f74';
  });

  // Coastal shallows glow
  ctx.strokeStyle = 'rgba(74, 190, 203, 0.4)';
  ctx.lineWidth = 14;
  continents.forEach(({ x, y, rx, ry }) => {
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 6, ry + 6, Math.PI / 8, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Polar Ice Caps
  ctx.fillStyle = '#e8f9fd';
  ctx.fillRect(0, 0, canvas.width, 38);
  ctx.fillRect(0, canvas.height - 38, canvas.width, 38);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Generates procedural atmospheric cloud texture
 */
function createCloudsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Wispy cloud bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * canvas.width;
    const y = 60 + Math.random() * (canvas.height - 120);
    const rx = 40 + Math.random() * 120;
    const ry = 8 + Math.random() * 25;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (Math.random() - 0.5) * 0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * PlanetModel component with realistic lighting, procedural surface,
 * cloud layer, and atmospheric glowing haze.
 */
function PlanetModel() {
  const planetRef = useRef(null);
  const cloudsRef = useRef(null);
  const atmosphereRef = useRef(null);

  // Memoize procedural textures and geometry/position tuples
  const planetTexture = useMemo(() => createProceduralPlanetTexture(), []);
  const cloudsTexture = useMemo(() => createCloudsTexture(), []);

  const geometries = useMemo(
    () => ({
      planet: [2.0, 64, 64],
      clouds: [2.04, 48, 48],
      atmosphere: [2.22, 36, 36],
    }),
    []
  );

  const positions = useMemo(
    () => ({
      group: [0, 0, 0],
      sun: [8, 4, 6],
      rim: [-8, -3, -6],
    }),
    []
  );

  // Dispose GPU textures cleanly on unmount
  useEffect(() => {
    return () => {
      planetTexture.dispose();
      cloudsTexture.dispose();
    };
  }, [planetTexture, cloudsTexture]);

  // Continuous subtle orbital rotation via useRef
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.08;
    }
    if (cloudsRef.current) {
      // Clouds drift slightly faster than planet surface
      cloudsRef.current.rotation.y += delta * 0.11;
      cloudsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
    if (atmosphereRef.current) {
      // Subtle atmospheric pulsation
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.005;
      atmosphereRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={positions.group}>
      {/* 1. Professional Space Lighting */}
      <ambientLight color="#081b33" intensity={0.8} />

      <directionalLight
        position={positions.sun}
        intensity={3.2}
        color="#fffaf0"
        castShadow
      />

      <pointLight position={positions.rim} color="#38bdf8" intensity={0.6} />

      {/* 2. Core Planet Mesh */}
      <mesh ref={planetRef}>
        <sphereGeometry args={geometries.planet} />
        <meshStandardMaterial
          map={planetTexture}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* 3. Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={geometries.clouds} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Outer Atmospheric Glowing Halo */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={geometries.atmosphere} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default memo(PlanetModel);
