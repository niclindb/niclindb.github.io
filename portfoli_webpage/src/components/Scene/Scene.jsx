import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import BubbleGroup from '../bubbles/bubbleGroup'
import AmbientBubbles from '../bubbles/AmbientBubbles'

// Phones have dense screens but weak GPUs, and the glassy bubbles are
// costly per pixel, so they render at up to 1.5x instead of 2x
const DPR = typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches
  ? [1, 1.5]
  : [1, 2];

// The 3D bubble scene. It's loaded in its own chunk so the header and
// page text show before three.js has downloaded. paused stops drawing
// frames while an open section covers it.
export default function Scene({ paused = false, ...props }) {
  return (
    // Hidden from screen readers: BubbleMenu offers the same choices as
    // real buttons
    // A narrow fov keeps the bubbles round at the edges of the screen
    <Canvas
      camera={{ fov: 35, position: [0, 0, 14] }}
      dpr={DPR}
      frameloop={paused ? 'demand' : 'always'}
      aria-hidden="true"
    >
      <ambientLight intensity={0.3} />
      <AmbientBubbles />
      <BubbleGroup {...props} />
      {/* Same sky as drei's "dawn" preset, served from this site instead of a CDN */}
      <Environment files={`${import.meta.env.BASE_URL}dawn.hdr`} background blur={0.5} />
    </Canvas>
  );
}
