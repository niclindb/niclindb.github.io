import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { prefersReducedMotion } from '../../motion';

// How far the view can swing from straight on, in radians
const SWING_SIDEWAYS = Math.PI / 4;
const SWING_UP_DOWN = Math.PI / 7;
// How long the view rests where it was left before drifting back
const SETTLE_DELAY_S = 1.5;

// Drag (or swipe on a phone) to look around the bubbles. The view only
// turns, never zooms or slides, and stays within a range where the grid is
// still easy to read. When let go, it drifts back to straight on, so the
// bubbles end up where the keyboard focus rings and the Back animation
// expect them. While a section opens it can't be moved and hurries home,
// and it's put exactly there before the scene stops drawing.
export default function LookAround({ disabled = false, paused = false }) {
  const controls = useRef();
  const dragging = useRef(false);
  const idle = useRef(0);
  const { camera, invalidate } = useThree();
  const reduceMotion = prefersReducedMotion();
  const home = useRef(camera.position.clone());

  useEffect(() => {
    if (disabled) dragging.current = false;
  }, [disabled]);

  // Nothing is drawn while a section covers the scene, so be home by then
  useEffect(() => {
    if (!paused || !controls.current) return;
    camera.position.copy(home.current);
    controls.current.update();
    invalidate();
  }, [paused, camera, invalidate]);

  useFrame((_, rawDelta) => {
    const c = controls.current;
    if (!c || dragging.current) return;
    if (camera.position.distanceToSquared(home.current) < 1e-6) return;
    idle.current += Math.min(rawDelta, 0.1);
    if (!disabled && idle.current < SETTLE_DELAY_S) return;
    if (reduceMotion) {
      camera.position.copy(home.current);
    } else {
      // Ease back, and quickly once a bubble has popped
      const rate = disabled ? 8 : 2.5;
      camera.position.lerp(home.current, 1 - Math.exp(-Math.min(rawDelta, 0.1) * rate));
    }
    c.update();
  });

  return (
    <OrbitControls
      ref={controls}
      enabled={!disabled}
      enableZoom={false}
      enablePan={false}
      enableDamping={!reduceMotion}
      dampingFactor={0.08}
      rotateSpeed={0.5}
      minAzimuthAngle={-SWING_SIDEWAYS}
      maxAzimuthAngle={SWING_SIDEWAYS}
      minPolarAngle={Math.PI / 2 - SWING_UP_DOWN}
      maxPolarAngle={Math.PI / 2 + SWING_UP_DOWN}
      onStart={() => { dragging.current = true; idle.current = 0; }}
      onEnd={() => { dragging.current = false; idle.current = 0; }}
    />
  );
}
