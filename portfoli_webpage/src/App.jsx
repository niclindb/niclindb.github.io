import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import BubbleGroup from './components/bubbles/bubbleGroup'
import AmbientBubbles from './components/bubbles/AmbientBubbles'
import Header from './components/Header/Header'
import ContentPanel from './components/ContentPanel/ContentPanel'
import SceneErrorBoundary from './components/SceneFallback/SceneFallback'
import PopOverlay from './components/PopOverlay/PopOverlay'
import { useState, useCallback, useRef } from 'react';
import './App.css';

export default function App() {
  const [selectedBubble, setSelectedBubble] = useState(null);
  // The pop animation in progress, and whether the content is showing yet
  const [pop, setPop] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  // How the content arrives: after a pop, or sliding from a neighbour
  const [entrance, setEntrance] = useState('pop');
  // The bubble the content floated back into, which reinflates first
  const [returningBubble, setReturningBubble] = useState(null);
  const bubbleHomes = useRef([]);

  // origin is where the bubble was on screen, so the pop starts there
  const handleBubbleSelect = useCallback((index, origin) => {
    setSelectedBubble(index);
    setShowPanel(false);
    setEntrance('pop');
    setReturningBubble(null);
    setPop((prev) => ({ origin, id: (prev?.id ?? 0) + 1 }));
  }, []);

  // Moving between sections slides the content instead of popping again
  const handleNavigate = useCallback((index, direction) => {
    setSelectedBubble(index);
    setEntrance(direction);
  }, []);

  const handleBackClick = useCallback(() => {
    setReturningBubble(selectedBubble);
    setSelectedBubble(null);
    setShowPanel(false);
    setPop(null);
  }, [selectedBubble]);

  const handleLayout = useCallback((homes) => { bubbleHomes.current = homes; }, []);
  const handleBurst = useCallback(() => setShowPanel(true), []);
  const handlePopDone = useCallback(() => setPop(null), []);

  return (
    <div className="app">
      <Header />

      <SceneErrorBoundary>
        {/* A narrow fov keeps the bubbles round at the edges of the screen */}
        <Canvas camera={{ fov: 35, position: [0, 0, 14] }}>
          <ambientLight intensity={0.3} />
          <AmbientBubbles />
          <BubbleGroup 
            onBubbleSelect={handleBubbleSelect} 
            selectedBubble={selectedBubble} 
            returningBubble={returningBubble}
            onLayout={handleLayout}
          />
          <Environment preset="dawn" background blur={0.5} />
        </Canvas>

        {selectedBubble === null && (
          <p className="app__hint">Pop a bubble to explore</p>
        )}
        {selectedBubble !== null && showPanel && (
          <ContentPanel
            index={selectedBubble}
            entrance={entrance}
            home={bubbleHomes.current[selectedBubble]}
            onClose={handleBackClick}
            onNavigate={handleNavigate}
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
