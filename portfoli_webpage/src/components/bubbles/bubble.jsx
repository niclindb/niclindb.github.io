import { MeshDistortMaterial, Text } from '@react-three/drei'
import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import labelFont from '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff?url';

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

const worldPos = new THREE.Vector3();
const edgePos = new THREE.Vector3();

export default function Bubble({
  children,
  scale: baseScale = 1,
  position = [0, 0, 0],
  phase = 0,
  isSelected,
  isOtherSelected,
  onClick,
  ...props
}) {
  const [hovered, setHovered] = useState(false);
  const drift = useRef();
  const body = useRef();
  const { camera, size } = useThree();

  const [{ scale, opacity }, api] = useSpring(() => ({
    scale: baseScale,
    opacity: 1,
    config: { mass: 1, tension: 300, friction: 22 },
  }));

  useEffect(() => {
    api.start({
      // The selected bubble vanishes at once: the full-screen pop takes over
      scale: isSelected ? 0.001 : isOtherSelected ? baseScale * 0.85 : hovered ? baseScale * 1.08 : baseScale,
      opacity: isOtherSelected ? 0.25 : 1,
      immediate: (key) => isSelected && key === 'scale',
      config: { mass: 1.2, tension: 220, friction: 14 },
    });
  }, [isSelected, isOtherSelected, hovered, baseScale, api]);

  // Bubbles drift on the air and their skin wobbles, but each stays near
  // its spot in the grid.
  useFrame(({ clock }) => {
    const t = clock.elapsedTime + phase;
    if (drift.current) {
      drift.current.position.set(
        position[0] + Math.sin(t * 0.55) * 0.09 + Math.sin(t * 1.3) * 0.03,
        position[1] + Math.sin(t * 0.8) * 0.16,
        position[2] + Math.sin(t * 0.45) * 0.12
      );
      drift.current.rotation.z = Math.sin(t * 0.5) * 0.06;
    }
    if (body.current) {
      const squash = Math.sin(t * (hovered ? 4.5 : 2.2)) * (hovered ? 0.045 : 0.03);
      body.current.scale.set(1 + squash, 1 - squash, 1 + squash * 0.5);
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    // Where the bubble is on screen, so the pop can start from there
    drift.current.getWorldPosition(worldPos);
    edgePos.set(worldPos.x + baseScale, worldPos.y, worldPos.z);
    worldPos.project(camera);
    edgePos.project(camera);
    const x = ((worldPos.x + 1) / 2) * size.width;
    const y = ((1 - worldPos.y) / 2) * size.height;
    const radius = Math.abs(((edgePos.x + 1) / 2) * size.width - x);
    onClick({ x, y, radius });
  };

  return (
    <group ref={drift} position={position} {...props}>
      <animated.group
        scale={scale}
        visible={!isSelected}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
        onClick={handleClick}
      >
        <group ref={body}>
          <mesh>
            <sphereGeometry args={[1, 64, 64]} />
            <AnimatedMeshDistortMaterial
              distort={hovered ? 0.18 : 0.12}
              speed={2}
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
        </group>
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
    </group>
  );
}
