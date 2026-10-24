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

  const [{ scale }, api] = useSpring(() => ({ scale: baseScale }));

  const hidden = isSelected || isOtherSelected;
  const [gone, setGone] = useState(false);

  // While a section is open every bubble is gone: the popped one bursts at
  // once and the rest vanish once the gum bubble has covered them, leaving
  // only what was inside. On Back they blow back up one after another.
  useEffect(() => {
    if (!hidden) return undefined;
    const timer = setTimeout(() => {
      setGone(true);
      api.set({ scale: 0.001 });
    }, isSelected ? 0 : 400);
    return () => clearTimeout(timer);
  }, [hidden, isSelected, api]);

  useEffect(() => {
    if (hidden || !gone) return;
    setGone(false);
    api.start({
      scale: baseScale,
      delay: 150 + phase * 50,
      config: { mass: 1.2, tension: 220, friction: 14 },
    });
  }, [hidden, gone, baseScale, phase, api]);

  // Only react to hover changes, so this doesn't cut the reinflate short
  const wasHovered = useRef(hovered);
  useEffect(() => {
    if (wasHovered.current === hovered) return;
    wasHovered.current = hovered;
    if (hidden) return;
    api.start({
      scale: hovered ? baseScale * 1.08 : baseScale,
      config: { mass: 1.2, tension: 220, friction: 14 },
    });
  }, [hidden, hovered, baseScale, api]);

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
        visible={!gone && !isSelected}
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
              depthWrite={false}
            />
          </mesh>
        </group>
        {children && (
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
