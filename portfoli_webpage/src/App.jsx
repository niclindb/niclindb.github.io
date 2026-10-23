import { Canvas } from '@react-three/fiber'
import {
  Environment,
  OrbitControls,
} from '@react-three/drei'
import BubbleGroup from './components/bubbles/bubbleGroup'
import Header from './components/Header/Header'
import ContentPanel from './components/ContentPanel/ContentPanel'
import SceneErrorBoundary from './components/SceneFallback/SceneFallback'
import { useState, useCallback } from 'react';
import './App.css';

export default function App() {
  const [selectedBubble, setSelectedBubble] = useState(null);

  const handleBubbleSelect = useCallback((index) => {
    setSelectedBubble(index);
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedBubble(null);
  }, []);

  return (
    <div className="app">
      <Header />

      <SceneErrorBoundary>
        <Canvas camera={{ fov: 70, position: [0, 0, 7] }}>
          <ambientLight intensity={0.3} />
          <BubbleGroup 
            onBubbleSelect={handleBubbleSelect} 
            selectedBubble={selectedBubble} 
          />
          <Environment preset="dawn" background blur={0.5} />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enabled={selectedBubble === null}
          />
        </Canvas>

        {selectedBubble === null ? (
          <p className="app__hint">Click a bubble to explore</p>
        ) : (
          <ContentPanel
            index={selectedBubble}
            onClose={handleBackClick}
            onNavigate={handleBubbleSelect}
          />
        )}
      </SceneErrorBoundary>
    </div>
  );
}
