import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import BubbleGroup from './components/bubbles/bubbleGroup'
import Header from './components/Header/Header'
import ContentPanel from './components/ContentPanel/ContentPanel'
import SceneErrorBoundary from './components/SceneFallback/SceneFallback'
import PopOverlay from './components/PopOverlay/PopOverlay'
import { useState, useCallback } from 'react';
import './App.css';

export default function App() {
  const [selectedBubble, setSelectedBubble] = useState(null);
  // The pop animation in progress, and whether the card is showing yet
  const [pop, setPop] = useState(null);
  const [showPanel, setShowPanel] = useState(false);

  // origin is where the bubble was on screen; without one (e.g. the card's
  // prev/next buttons) the pop starts from the middle.
  const handleBubbleSelect = useCallback((index, origin) => {
    setSelectedBubble(index);
    setShowPanel(false);
    setPop((prev) => ({ origin, id: (prev?.id ?? 0) + 1 }));
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedBubble(null);
    setShowPanel(false);
    setPop(null);
  }, []);

  const handleBurst = useCallback(() => setShowPanel(true), []);
  const handlePopDone = useCallback(() => setPop(null), []);

  return (
    <div className="app">
      <Header />

      <SceneErrorBoundary>
        {/* A narrow fov keeps the bubbles round at the edges of the screen */}
        <Canvas camera={{ fov: 35, position: [0, 0, 14] }}>
          <ambientLight intensity={0.3} />
          <BubbleGroup 
            onBubbleSelect={handleBubbleSelect} 
            selectedBubble={selectedBubble} 
          />
          <Environment preset="dawn" background blur={0.5} />
        </Canvas>

        {selectedBubble === null && (
          <p className="app__hint">Pop a bubble to explore</p>
        )}
        {selectedBubble !== null && showPanel && (
          <ContentPanel
            index={selectedBubble}
            onClose={handleBackClick}
            onNavigate={handleBubbleSelect}
          />
        )}
        {pop && (
          <PopOverlay
            key={pop.id}
            origin={pop.origin}
            onBurst={handleBurst}
            onDone={handlePopDone}
          />
        )}
      </SceneErrorBoundary>
    </div>
  );
}
