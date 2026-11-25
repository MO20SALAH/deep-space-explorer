import React, { memo, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

function createSeededRandom(seed = 77) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/**
 * Generates a soft procedural nebula cloud texture in purple & turquoise tones.
 */
function createNebulaTexture(innerColor, midColor) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const rand = createSeededRandom(innerColor.length * 101);

  ctx.clearRect(0, 0, size, size);

  for (let i = 0; i < 6; i++) {
    const x = size * (0.3 + rand() * 0.4);
    const y = size * (0.3 + rand() * 0.4);
    const radius = size * (0.25 + rand() * 0.25);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    grad.addColorStop(0, innerColor);
    grad.addColorStop(0.45, midColor);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

const TWINKLE_VERTEX_SHADER = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = color;
    vAlpha = 0.45 + 0.55 * sin(uTime * 1.6 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (180.0 / max(-mvPosition.z, 1.0));
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const TWINKLE_FRAGMENT_SHADER = `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float glow = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vColor, glow * vAlpha);
  }
`;

/**
 * StarField component - multi-spectral twinkling star layers,
 * 3D background nebula clouds, and smooth mouse parallax via useRef.
 */
function StarField() {
  const parallaxRef = useRef(null);
  const rotationRef = useRef(null);
  const nebulaRef = useRef(null);
  const twinkleMaterialRef = useRef(null);

  const twinkleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  // Multi-spectral twinkling star geometry (bluish-white, gold, purple, cyan)
  const spectralStarsGeometry = useMemo(() => {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const rand = createSeededRandom(5150);

    const spectralPalette = [
      new THREE.Color('#dbeafe'), // Bluish-white
      new THREE.Color('#fef3c7'), // Golden
      new THREE.Color('#d8b4fe'), // Violet
      new THREE.Color('#7dd3fc'), // Cyan
    ];

    for (let i = 0; i < count; i++) {
      const r = 18 + rand() * 85;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = spectralPalette[Math.floor(rand() * spectralPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = 1.2 + rand() * 3.2;
      phases[i] = rand() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, []);

  const nebulaTextures = useMemo(
    () => ({
      purple: createNebulaTexture(
        'rgba(168, 85, 247, 0.24)',
        'rgba(88, 28, 135, 0.08)'
      ),
      teal: createNebulaTexture(
        'rgba(45, 212, 191, 0.20)',
        'rgba(14, 116, 144, 0.07)'
      ),
    }),
    []
  );

  const nebulaLayers = useMemo(
    () => [
      { pos: [-16, 8, -32], scale: [34, 24, 1], rot: 0.2, map: nebulaTextures.purple },
      { pos: [18, -7, -36], scale: [38, 26, 1], rot: -0.35, map: nebulaTextures.teal },
      { pos: [4, 12, -44], scale: [44, 28, 1], rot: 0.5, map: nebulaTextures.purple },
      { pos: [-12, -11, -38], scale: [32, 22, 1], rot: -0.2, map: nebulaTextures.teal },
    ],
    [nebulaTextures]
  );

  const primaryStarsProps = useMemo(
    () => ({
      radius: 130,
      depth: 65,
      count: 4500,
      factor: 4,
      saturation: 0.4,
      fade: true,
      speed: 0.9,
    }),
    []
  );

  useEffect(() => {
    return () => {
      spectralStarsGeometry.dispose();
      nebulaTextures.purple.dispose();
      nebulaTextures.teal.dispose();
    };
  }, [spectralStarsGeometry, nebulaTextures]);

  useFrame((state, delta) => {
    if (twinkleMaterialRef.current) {
      twinkleMaterialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (rotationRef.current) {
      rotationRef.current.rotation.y += delta * 0.012;
      rotationRef.current.rotation.x += delta * 0.003;
    }

    if (nebulaRef.current) {
      nebulaRef.current.rotation.z += delta * 0.004;
    }

    // Smooth mouse parallax without React re-renders
    if (parallaxRef.current) {
      const targetX = state.pointer.x * 0.65;
      const targetY = state.pointer.y * 0.45;
      parallaxRef.current.position.x = THREE.MathUtils.lerp(
        parallaxRef.current.position.x,
        targetX,
        0.04
      );
      parallaxRef.current.position.y = THREE.MathUtils.lerp(
        parallaxRef.current.position.y,
        targetY,
        0.04
      );
    }
  });

  return (
    <group ref={parallaxRef}>
      {/* Background 3D Nebula Clouds */}
      <group ref={nebulaRef}>
        {nebulaLayers.map((layer, idx) => (
          <mesh
            key={idx}
            position={layer.pos}
            scale={layer.scale}
            rotation={[0, 0, layer.rot]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              map={layer.map}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Multi-layered Star Fields */}
      <group ref={rotationRef}>
        <Stars {...primaryStarsProps} />

        <points geometry={spectralStarsGeometry}>
          <shaderMaterial
            ref={twinkleMaterialRef}
            vertexShader={TWINKLE_VERTEX_SHADER}
            fragmentShader={TWINKLE_FRAGMENT_SHADER}
            uniforms={twinkleUniforms}
            vertexColors
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      </group>
    </group>
  );
}

export default memo(StarField);
