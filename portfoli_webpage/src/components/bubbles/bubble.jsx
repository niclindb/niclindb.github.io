import { MeshDistortMaterial, Text } from '@react-three/drei'
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import labelFont from '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff?url';

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

const DROPLET_COUNT = 14;
const POP_DURATION = 0.6; // seconds

// Small droplets that fly outward and fade when a bubble pops.
function Droplets({ radius }) {
  const group = useRef();
  const start = useRef(null);
  const [directions] = useState(() =>
    Array.from({ length: DROPLET_COUNT }, (_, i) => {
      const angle = (i / DROPLET_COUNT) * Math.PI * 2 + Math.random() * 0.4;
      const speed = 0.8 + Math.random() * 0.6;
      return [Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * 0.6];
    })
  );

  useFrame(({ clock }) => {
    if (!group.current) return;
    if (start.current === null) start.current = clock.elapsedTime;
    const t = Math.min((clock.elapsedTime - start.current) / POP_DURATION, 1);
    const ease = 1 - Math.pow(1 - t, 3);

    group.current.children.forEach((droplet, i) => {
      const [dx, dy, dz] = directions[i];
      const distance = radius * (0.9 + ease * 0.9);
      droplet.position.set(dx * distance, dy * distance - t * t * 0.4, dz * distance);
      droplet.scale.setScalar((1 - t) * radius);
      droplet.material.opacity = 0.8 * (1 - t);
    });
    group.current.visible = t < 1;
  });

  return (
    <group ref={group}>
      {directions.map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshPhysicalMaterial
            color="#ffffff"
            roughness={0}
            clearcoat={1}
            iridescence={1}
            transparent
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function Bubble({
  children,
  scale: baseScale = 1,
  position = [0, 0, 0],
  isSelected,
  isOtherSelected,
  onClick,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [popCount, setPopCount] = useState(0);

  const [{ scale, opacity }, api] = useSpring(() => ({
    scale: baseScale,
    opacity: 1,
    config: { mass: 1, tension: 300, friction: 22 },
  }));

  useEffect(() => {
    if (isSelected) {
      // Stretch a little, then burst
      setPopCount((n) => n + 1);
      api.start({
        to: [
          { scale: baseScale * 1.18, config: { tension: 700, friction: 14 } },
          { scale: 0.001, config: { duration: 90 } },
        ],
      });
    } else {
      api.start({
        scale: isOtherSelected ? baseScale * 0.85 : hovered ? baseScale * 1.08 : baseScale,
        opacity: isOtherSelected ? 0.25 : 1,
        config: { mass: 1, tension: 300, friction: 22 },
      });
    }
  }, [isSelected, isOtherSelected, hovered, baseScale, api]);

  return (
    <group position={position} {...props}>
      <animated.group
        scale={scale}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <AnimatedMeshDistortMaterial
            distort={0.08}
            speed={1.5}
            transmission={1.05}
            thickness={-0.5}
            roughness={0}
            iridescence={1}
            iridescenceIOR={1}
            iridescenceThicknessRange={[0, 1200]}
            clearcoat={1}
            clearcoatRoughness={0}
            envMapIntensity={1.5}
            transparent={true}
            opacity={opacity}
            depthWrite={false}
          />
        </mesh>
        {children && !isOtherSelected && (
          <Text
            font={labelFont}
            fontSize={0.3}
            color="#23244d"
            anchorX="center"
            anchorY="middle"
            maxWidth={1.6}
            lineHeight={1.1}
            textAlign="center"
            side={THREE.DoubleSide}
          >
            {children}
          </Text>
        )}
      </animated.group>
      {isSelected && <Droplets key={popCount} radius={baseScale} />}
    </group>
  );
}
