import Bubble from './bubble'
import * as THREE from 'three';
import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { sections } from '../../content';

// Bubbles sit in a centred grid: one row on wide screens, three columns on
// tablets and two on phones. The last row is centred when it isn't full.
function gridLayout(aspect, count) {
  const columns = aspect < 0.8 ? 2 : aspect < 1.3 ? 3 : count;
  const radius = columns === 2 ? 0.8 : 1;
  const gap = columns === 2 ? 0.4 : 0.6;
  const step = radius * 2 + gap;
  const rows = Math.ceil(count / columns);
  // Nudge the grid down a little so it sits centred below the header
  const top = ((rows - 1) * step) / 2 - 0.3;

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / columns);
    const inRow = Math.min(columns, count - row * columns);
    const col = i % columns;
    return {
      position: [(col - (inRow - 1) / 2) * step, top - row * step, 0],
      scale: radius,
    };
  });
}

export default function BubbleGroup({ onBubbleSelect, selectedBubble, returningBubble, focusedBubble, onLayout }) {
  const { size, camera } = useThree();
  const layout = gridLayout(size.width / size.height, sections.length);

  // Tell the page where each bubble sits on screen, so content can float
  // back to it
  useEffect(() => {
    if (!onLayout) return;
    const toScreen = (v) => ({
      x: ((v.x + 1) / 2) * size.width,
      y: ((1 - v.y) / 2) * size.height,
    });
    onLayout(layout.map(({ position, scale }) => {
      const centre = toScreen(new THREE.Vector3(...position).project(camera));
      const edge = toScreen(new THREE.Vector3(position[0] + scale, position[1], position[2]).project(camera));
      return { ...centre, radius: Math.abs(edge.x - centre.x) };
    }));
    // layout is derived from size
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.width, size.height, camera, onLayout]);

  return (
    <>
      {layout.map((bubble, index) => (
        <Bubble
          key={index}
          scale={bubble.scale}
          position={bubble.position}
          index={index}
          phase={index * 1.7}
          returning={returningBubble === index}
          focused={focusedBubble === index}
          isSelected={selectedBubble === index}
          isOtherSelected={selectedBubble !== null && selectedBubble !== index}
          onClick={(origin) => onBubbleSelect(index, origin)}
        >
          {sections[index].label}
        </Bubble>
      ))}
    </>
  )
}
