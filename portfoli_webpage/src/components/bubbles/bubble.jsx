import { MeshDistortMaterial, Text } from '@react-three/drei'
import * as THREE from 'three';
import { useState } from 'react';
import { useSpring, animated } from '@react-spring/three';
import labelFont from '@fontsource/space-grotesk/files/space-grotesk-latin-500-normal.woff?url';

const AnimatedMeshDistortMaterial = animated(MeshDistortMaterial);

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

  // Calculate animation values
  const { scale, pos, opacity } = useSpring({
    scale: isSelected ? baseScale * 40 : isOtherSelected ? baseScale * 3 : hovered ? baseScale * 1.15 : baseScale,
    pos: isSelected ? [0, 0, -60] : isOtherSelected ? [
      position[0] * 15,
      position[0] === 0 ? (position[1] - 5.5) * 7 : position[1] * 7, 
      position[2] - 15
    ] : position,
    opacity: isOtherSelected ? 0.3 : 1,
    config: { mass: 1, tension: 300, friction: 25 },
  });

  return (
    <animated.group
      {...props}
      scale={scale}
      position={pos}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      onClick={onClick}
    >
      <animated.mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <AnimatedMeshDistortMaterial
          distort={0.25}
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
      </animated.mesh>
      {children && !isSelected && (
        <Text
          font={labelFont}
          fontSize={0.34}
          color="#23244d"
          position={[0, 0.15, 0]}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.5}
          lineHeight={1.1}
          textAlign="center"
          side={THREE.DoubleSide}
        >
          {children}
        </Text>
      )}
    </animated.group>
  );
}