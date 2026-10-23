import { Float } from '@react-three/drei'
import Bubble from './bubble'
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { sections } from '../../content';

// Index i of each layout is the bubble for sections[i] in content.js.
const motion = { speed: 1.2, rotationIntensity: 0.8 };

// Landscape screens: bubbles spread around "About Me" in the middle.
const wideLayout = [
  { position: [0, -0.5, 0.25], scale: 1.35, floatIntensity: 2.3 }, // center
  { position: [-3.1, 1.1, 0], scale: 1.1, floatIntensity: 2.7 }, // top left
  { position: [2.7, -1.8, 0], scale: 1.15, floatIntensity: 2.4 }, // bottom right
  { position: [2.48, 1.2, 0.1], scale: 1.1, floatIntensity: 2.1 }, // top right
  { position: [-2.6, -1.9, 0.1], scale: 1.1, floatIntensity: 2.3 }, // bottom left
];

// Portrait screens (phones): a narrower zig-zag column so nothing is cut off.
const tallLayout = [
  { position: [0, -0.2, 0.25], scale: 1.05, floatIntensity: 1.2 },
  { position: [-1.05, 2.2, 0], scale: 0.9, floatIntensity: 1.2 },
  { position: [1.05, -2.6, 0], scale: 0.9, floatIntensity: 1.2 },
  { position: [1.05, 1.9, 0.1], scale: 0.9, floatIntensity: 1.2 },
  { position: [-1.05, -2.9, 0.1], scale: 0.9, floatIntensity: 1.2 },
];

const HOME_Z = 7;
const SELECTED_Z = 30;

export default function BubbleGroup({ onBubbleSelect, selectedBubble }) {
  const { camera, size } = useThree();
  const layout = size.width / size.height < 0.8 ? tallLayout : wideLayout;
  
  // Animate camera when selection changes
  useEffect(() => {
    const duration = 1000; // 1 second
    const startTime = Date.now();
    
    // Store initial camera position
    const startPosition = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    };
    
    // Target position based on selection
    const targetPosition = selectedBubble !== null 
      ? { x: 0, y: 0, z: SELECTED_Z }  // Zoom in to selected bubble
      : { x: 0, y: 0, z: HOME_Z };  // Reset to center view
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      // Animate all camera positions (x, y, z)
      camera.position.x = startPosition.x + (targetPosition.x - startPosition.x) * easeOutCubic;
      camera.position.y = startPosition.y + (targetPosition.y - startPosition.y) * easeOutCubic;
      camera.position.z = startPosition.z + (targetPosition.z - startPosition.z) * easeOutCubic;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [selectedBubble, camera]);

  const handleBubbleClick = (index) => {
    onBubbleSelect(index);
  };

  return (
    <>
      {layout.map((bubble, index) => {
        const bubbleComponent = (
          <Bubble 
            scale={bubble.scale} 
            position={bubble.position}
            isSelected={selectedBubble === index}
            isOtherSelected={selectedBubble !== null && selectedBubble !== index}
            onClick={() => handleBubbleClick(index)}
          >
            {sections[index].label}
          </Bubble>
        );

        return (
          <Float 
            key={index}
            floatIntensity={bubble.floatIntensity}
            speed={motion.speed}
            rotationIntensity={motion.rotationIntensity}
            enabled={selectedBubble !== index} // Disable float for selected bubble
          >
            {bubbleComponent}
          </Float>
        );
      })}
    </>
  )
}