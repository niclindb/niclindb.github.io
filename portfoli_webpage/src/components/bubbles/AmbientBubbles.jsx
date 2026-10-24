import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { prefersReducedMotion } from '../../motion';

const COUNT = 18;
const dummy = new THREE.Object3D();

// Tiny bubbles drifting up behind the main ones, for a bit of depth
export default function AmbientBubbles() {
  const mesh = useRef();
  const still = prefersReducedMotion();
  const bubbles = useMemo(
    () => Array.from({ length: COUNT }, () => ({
      x: (Math.random() - 0.5) * 18,
      y: (Math.random() - 0.5) * 12,
      z: -3 - Math.random() * 5,
      size: 0.06 + Math.random() * 0.16,
      speed: 0.25 + Math.random() * 0.45,
      sway: Math.random() * Math.PI * 2,
    })),
    []
  );

  useFrame(({ clock }, delta) => {
    if (!mesh.current) return;
    const t = clock.elapsedTime;
    bubbles.forEach((b, i) => {
      if (!still) {
        b.y += b.speed * delta;
        if (b.y > 7) {
          b.y = -7;
          b.x = (Math.random() - 0.5) * 18;
        }
      }
      dummy.position.set(b.x + Math.sin(t * 0.8 + b.sway) * 0.25, b.y, b.z);
      dummy.scale.setScalar(b.size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} raycast={() => null}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshPhysicalMaterial
        color="#ffffff"
        roughness={0}
        metalness={0.1}
        clearcoat={1}
        iridescence={1}
        iridescenceThicknessRange={[100, 800]}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
