import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Deterministic PRNG so procedural planet textures remain crisp and consistent.
 */
function createSeededRandom(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Generates high-resolution procedural textures for:
 * - map (surreal obsidian oceans, crystalline ridges, glowing fissures)
 * - bumpMap (deep terrain relief & craters)
 * - roughnessMap (specular seas vs rough highlands)
 * - emissiveMap (bioluminescent / cosmic lava canyons)
 */
function createPlanetTextureMaps() {
  const width = 1024;
  const height = 512;
  const rand = createSeededRandom(1337);

  const colorCanvas = document.createElement('canvas');
  const bumpCanvas = document.createElement('canvas');
  const roughCanvas = document.createElement('canvas');
  const emissiveCanvas = document.createElement('canvas');

  [colorCanvas, bumpCanvas, roughCanvas, emissiveCanvas].forEach((c) => {
    c.width = width;
    c.height = height;
  });

  const cCtx = colorCanvas.getContext('2d');
  const bCtx = bumpCanvas.getContext('2d');
  const rCtx = roughCanvas.getContext('2d');
  const eCtx = emissiveCanvas.getContext('2d');

  // 1. Deep cosmic ocean base
  const oceanGrad = cCtx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#040b1e');
  oceanGrad.addColorStop(0.5, '#071b3d');
  oceanGrad.addColorStop(1, '#040b1e');
  cCtx.fillStyle = oceanGrad;
  cCtx.fillRect(0, 0, width, height);

  bCtx.fillStyle = '#181818';
  bCtx.fillRect(0, 0, width, height);

  rCtx.fillStyle = '#383838'; // Smooth reflective oceans
  rCtx.fillRect(0, 0, width, height);

  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, width, height);

  // 2. Continents & crystalline highlands
  const landmasses = Array.from({ length: 18 }, () => ({
    x: rand() * width,
    y: 65 + rand() * (height - 130),
    rx: 55 + rand() * 115,
    ry: 35 + rand() * 75,
    rot: (rand() - 0.5) * Math.PI,
    hueShift: rand(),
  }));

  landmasses.forEach(({ x, y, rx, ry, rot, hueShift }) => {
    const baseColor = hueShift > 0.5 ? '#164e63' : '#2e1065';
    const midColor = hueShift > 0.5 ? '#0e7490' : '#4c1d95';
    const peakColor = hueShift > 0.5 ? '#22d3ee' : '#a855f7';

    // Outer shelf
    cCtx.fillStyle = baseColor;
    cCtx.beginPath();
    cCtx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    cCtx.fill();

    bCtx.fillStyle = '#6e6e6e';
    bCtx.beginPath();
    bCtx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    bCtx.fill();

    rCtx.fillStyle = '#c2c2c2';
    rCtx.beginPath();
    rCtx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
    rCtx.fill();

    // Inner mountain plateaus
    cCtx.fillStyle = midColor;
    cCtx.beginPath();
    cCtx.ellipse(x + 8, y - 4, rx * 0.65, ry * 0.65, rot, 0, Math.PI * 2);
    cCtx.fill();

    bCtx.fillStyle = '#b5b5b5';
    bCtx.beginPath();
    bCtx.ellipse(x + 8, y - 4, rx * 0.65, ry * 0.65, rot, 0, Math.PI * 2);
    bCtx.fill();

    // Crystalline ridges
    cCtx.fillStyle = peakColor;
    cCtx.globalAlpha = 0.35;
    cCtx.beginPath();
    cCtx.ellipse(x + 4, y - 6, rx * 0.32, ry * 0.32, rot, 0, Math.PI * 2);
    cCtx.fill();
    cCtx.globalAlpha = 1;

    bCtx.fillStyle = '#efefef';
    bCtx.beginPath();
    bCtx.ellipse(x + 4, y - 6, rx * 0.32, ry * 0.32, rot, 0, Math.PI * 2);
    bCtx.fill();
  });

  // 3. Impact craters for deep bump relief
  for (let i = 0; i < 40; i++) {
    const cx = rand() * width;
    const cy = 50 + rand() * (height - 100);
    const cr = 5 + rand() * 18;

    bCtx.strokeStyle = '#ffffff';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr, 0, Math.PI * 2);
    bCtx.stroke();

    bCtx.fillStyle = '#121212';
    bCtx.beginPath();
    bCtx.arc(cx, cy, cr * 0.78, 0, Math.PI * 2);
    bCtx.fill();
  }

  // 4. Glowing cosmic fissures & crystal veins
  for (let i = 0; i < 26; i++) {
    let fx = rand() * width;
    let fy = 70 + rand() * (height - 140);
    const isCyan = rand() > 0.45;
    const glowColor = isCyan ? '#38bdf8' : '#c084fc';

    cCtx.strokeStyle = glowColor;
    cCtx.lineWidth = 1.6;
    cCtx.globalAlpha = 0.85;

    eCtx.strokeStyle = glowColor;
    eCtx.lineWidth = 2.2;
    eCtx.shadowColor = glowColor;
    eCtx.shadowBlur = 8;

    bCtx.strokeStyle = '#050505'; // Deep etched canyons
    bCtx.lineWidth = 2.5;

    cCtx.beginPath();
    eCtx.beginPath();
    bCtx.beginPath();
    cCtx.moveTo(fx, fy);
    eCtx.moveTo(fx, fy);
    bCtx.moveTo(fx, fy);

    const segments = 5 + Math.floor(rand() * 5);
    for (let s = 0; s < segments; s++) {
      fx += (rand() - 0.5) * 55;
      fy += (rand() - 0.5) * 35;
      cCtx.lineTo(fx, fy);
      eCtx.lineTo(fx, fy);
      bCtx.lineTo(fx, fy);
    }

    cCtx.stroke();
    eCtx.stroke();
    bCtx.stroke();
    cCtx.globalAlpha = 1;
    eCtx.shadowBlur = 0;
  }

  // 5. Polar aurora ice caps
  cCtx.fillStyle = 'rgba(224, 242, 254, 0.85)';
  cCtx.fillRect(0, 0, width, 30);
  cCtx.fillRect(0, height - 30, width, 30);

  const map = new THREE.CanvasTexture(colorCanvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas);

  [map, bumpMap, roughnessMap, emissiveMap].forEach((tex) => {
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
  });

  return { map, bumpMap, roughnessMap, emissiveMap };
}

/**
 * Generates swirling atmospheric cloud bands.
 */
function createCloudsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const rand = createSeededRandom(9001);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 65; i++) {
    const x = rand() * canvas.width;
    const y = 45 + rand() * (canvas.height - 90);
    const rx = 45 + rand() * 140;
    const ry = 6 + rand() * 22;

    const grad = ctx.createRadialGradient(x, y, 2, x, y, rx);
    grad.addColorStop(0, 'rgba(224, 242, 254, 0.5)');
    grad.addColorStop(0.6, 'rgba(186, 230, 253, 0.2)');
    grad.addColorStop(1, 'rgba(186, 230, 253, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, (rand() - 0.5) * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

/**
 * Generates radial concentric dust ring texture aligned with RingGeometry planar UVs.
 */
function createCosmicRingTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const center = size / 2;

  ctx.clearRect(0, 0, size, size);

  const grad = ctx.createRadialGradient(
    center,
    center,
    center * 0.56,
    center,
    center,
    center * 0.98
  );
  grad.addColorStop(0.0, 'rgba(56, 189, 248, 0.0)');
  grad.addColorStop(0.15, 'rgba(56, 189, 248, 0.42)');
  grad.addColorStop(0.32, 'rgba(129, 140, 248, 0.18)');
  grad.addColorStop(0.48, 'rgba(168, 85, 247, 0.48)');
  grad.addColorStop(0.65, 'rgba(253, 230, 138, 0.22)');
  grad.addColorStop(0.82, 'rgba(56, 189, 248, 0.32)');
  grad.addColorStop(1.0, 'rgba(56, 189, 248, 0.0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(center, center, center, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

/**
 * Fresnel Glow Shader for blue & purple atmospheric rim lighting.
 */
const FRESNEL_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDir = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRESNEL_FRAGMENT_SHADER = `
  uniform vec3 uColorInner;
  uniform vec3 uColorOuter;
  varying vec3 vNormal;
  varying vec3 vViewDir;

  void main() {
    float viewDot = max(dot(normalize(vNormal), normalize(vViewDir)), 0.0);
    float fresnel = pow(1.0 - viewDot, 3.2);
    vec3 glowColor = mix(uColorInner, uColorOuter, fresnel);
    gl_FragColor = vec4(glowColor, fresnel * 0.85);
  }
`;

function PlanetModel() {
  const planetRef = useRef(null);
  const cloudsRef = useRef(null);
  const ringGroupRef = useRef(null);
  const particlesRef = useRef(null);

  const planetMaps = useMemo(() => createPlanetTextureMaps(), []);
  const cloudsTexture = useMemo(() => createCloudsTexture(), []);
  const ringTexture = useMemo(() => createCosmicRingTexture(), []);

  const fresnelUniforms = useMemo(
    () => ({
      uColorInner: { value: new THREE.Color('#38bdf8') },
      uColorOuter: { value: new THREE.Color('#a855f7') },
    }),
    []
  );

  // Sparkling cosmic ring particles geometry
  const ringParticlesGeometry = useMemo(() => {
    const count = 1800;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const rand = createSeededRandom(2026);

    const palette = [
      new THREE.Color('#38bdf8'),
      new THREE.Color('#818cf8'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#fde68a'),
      new THREE.Color('#e0f2fe'),
    ];

    for (let i = 0; i < count; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = 2.6 + rand() * 1.85;
      const yOffset = (rand() - 0.5) * 0.08;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = yOffset;

      const c = palette[Math.floor(rand() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const geometries = useMemo(
    () => ({
      planet: [2.0, 64, 64],
      clouds: [2.045, 64, 64],
      atmosphere: [2.07, 64, 64],
      ring: [2.65, 4.35, 128],
    }),
    []
  );

  const transforms = useMemo(
    () => ({
      group: [0, 0, 0],
      ringTilt: [Math.PI * 0.39, Math.PI * 0.09, -Math.PI * 0.14],
      warmLight: [8, 3, 5],
      rimLight: [-6, 2.5, -7],
    }),
    []
  );

  // Dispose GPU textures & geometries cleanly on unmount
  useEffect(() => {
    return () => {
      planetMaps.map.dispose();
      planetMaps.bumpMap.dispose();
      planetMaps.roughnessMap.dispose();
      planetMaps.emissiveMap.dispose();
      cloudsTexture.dispose();
      ringTexture.dispose();
      ringParticlesGeometry.dispose();
    };
  }, [
    planetMaps,
    cloudsTexture,
    ringTexture,
    ringParticlesGeometry,
  ]);

  // Smooth direct mutations via useRef + useFrame
  useFrame((state, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.06;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.11;
      cloudsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.12) * 0.02;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z += delta * 0.045;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.z += delta * 0.025;
    }
  });

  return (
    <group position={transforms.group}>
      {/* Dramatic Multi-Source Space Lighting */}
      <ambientLight color="#0a162e" intensity={0.4} />

      {/* Warm dim side key light for cinematic contrast */}
      <directionalLight
        position={transforms.warmLight}
        intensity={2.1}
        color="#ffd6a5"
      />

      {/* Strong cyan Rim Light from behind to carve planet silhouette */}
      <directionalLight
        position={transforms.rimLight}
        intensity={3.0}
        color="#38BDF8"
      />

      {/* 1. Core Surreal Planet Mesh */}
      <mesh ref={planetRef}>
        <sphereGeometry args={geometries.planet} />
        <meshStandardMaterial
          map={planetMaps.map}
          bumpMap={planetMaps.bumpMap}
          bumpScale={0.085}
          roughnessMap={planetMaps.roughnessMap}
          roughness={0.85}
          metalness={0.18}
          emissive="#ffffff"
          emissiveMap={planetMaps.emissiveMap}
          emissiveIntensity={0.9}
        />
      </mesh>

      {/* 2. Separate Animated Atmospheric Cloud Layer */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={geometries.clouds} />
        <meshStandardMaterial
          map={cloudsTexture}
          transparent
          opacity={0.48}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Fresnel Glow Shader Atmosphere (Cyan -> Purple Edge Halo) */}
      <mesh>
        <sphereGeometry args={geometries.atmosphere} />
        <shaderMaterial
          vertexShader={FRESNEL_VERTEX_SHADER}
          fragmentShader={FRESNEL_FRAGMENT_SHADER}
          uniforms={fresnelUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Tilted Cosmic Rings (Gradient Dust + Sparkling Particles) */}
      <group rotation={transforms.ringTilt}>
        <mesh ref={ringGroupRef}>
          <ringGeometry args={geometries.ring} />
          <meshBasicMaterial
            map={ringTexture}
            transparent
            opacity={0.78}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <points ref={particlesRef} geometry={ringParticlesGeometry}>
          <pointsMaterial
            size={0.035}
            vertexColors
            transparent
            opacity={0.85}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

export default memo(PlanetModel);
