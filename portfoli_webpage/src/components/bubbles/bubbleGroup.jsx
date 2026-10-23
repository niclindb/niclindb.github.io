import { Float } from '@react-three/drei'
import Bubble from './bubble'
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

export default function BubbleGroup({ onBubbleSelect, selectedBubble }) {
  const { size } = useThree();
  const layout = gridLayout(size.width / size.height, sections.length);

  return (
    <>
      {layout.map((bubble, index) => (
        <Float
          key={index}
          speed={1.4}
          floatIntensity={0.35}
          rotationIntensity={0.15}
          floatingRange={[-0.08, 0.08]}
        >
          <Bubble
            scale={bubble.scale}
            position={bubble.position}
            isSelected={selectedBubble === index}
            isOtherSelected={selectedBubble !== null && selectedBubble !== index}
            onClick={() => onBubbleSelect(index)}
          >
            {sections[index].label}
          </Bubble>
        </Float>
      ))}
    </>
  )
}
