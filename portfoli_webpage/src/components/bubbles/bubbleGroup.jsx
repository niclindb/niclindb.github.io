import { Float } from '@react-three/drei'
import Bubble from './bubble'
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

export const bubblePositions = [
    { // center
      position: [0, -.5, 0.25], 
      scale: 1.35,
      floatIntensity: 2.3,
      speed: 1.2,
      rotationIntensity: .8,
      text: "About Me",
      moreText: "I’m a passionate developer with experience in Java, C++, Python, and JavaScript. I enjoy solving problems through clean, efficient code and building applications that are both creative and practical. I’m always exploring new tools and technologies to expand my skillset and bring fresh ideas to life."
    },
    { // left
      position: [-3.1, 1.1, 0], 
      scale: 1.1,
      floatIntensity: 2.7,
      speed: 1.2,
      rotationIntensity: .8,
      text: "React Project",
      moreText: "Custom Shopify Extensions\n   Stack: React, JavaScript, Shopify GraphQL\nFeatures: \n • Product price look-up\n • Inventory management\n • Charge Orders\n • Barcode Printing\n Check out more on my GitHub!"
    },
    { // right
      position: [2.7, -1.8, 0], 
      scale: 1.15,
      floatIntensity: 2.4,
      speed: 1.2,
      rotationIntensity: .8,
      text: "C++ Project",
      moreText: "Parallel Merge Sort\n   Stack: C++ \nFeatures:\n • Efficiently sorts large datasets using parallel processing\n • Demonstrates proficiency in C++ and parallel computing concepts\n\n   Check out more on my GitHub!"
    },
    { // top
      position: [2.48, 1.2, 0.1], 
      scale: 1.1,
      floatIntensity: 2.1,
      speed: 1.2,
      rotationIntensity: .8,
      text: "Skills",
      moreText: "Backend: Node.js, Python, SQL \nFrontend: React, TypeScript, HTML \nOther Languages: Java, C++ \nTools & Platforms: Git, Docker, AWS" 
    },
    { // bottom left
      position: [-2.6, -1.9, 0.1], 
      scale: 1.1,
      floatIntensity: 2.3,
      speed: 1.3,
      rotationIntensity: .8,
      text: "Education",
      moreText: "Northern Michigan University \n\nBachelors degree in Computer Science, Minor in Mathematics"
    },
  ]

export default function BubbleGroup({ onBubbleSelect, selectedBubble }) {
  const { camera } = useThree();
  
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
      ? { x: 0, y: 0, z: 30 }  // Zoom in to selected bubble
      : { x: 0, y: 0, z: 5 };  // Reset to center view
    
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
      {bubblePositions.map((bubble, index) => {
        const bubbleComponent = (
          <Bubble 
            scale={bubble.scale} 
            position={bubble.position}
            isSelected={selectedBubble === index}
            isOtherSelected={selectedBubble !== null && selectedBubble !== index}
            onClick={() => handleBubbleClick(index)}
            moreText={bubble.moreText}
          >
            {bubble.text}
          </Bubble>
        );

        return (
          <Float 
            key={index}
            floatIntensity={bubble.floatIntensity}
            speed={bubble.speed}
            rotationIntensity={bubble.rotationIntensity}
            enabled={selectedBubble !== index} // Disable float for selected bubble
          >
            {bubbleComponent}
          </Float>
        );
      })}
    </>
  )
}