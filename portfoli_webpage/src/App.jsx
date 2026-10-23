import { Canvas } from '@react-three/fiber'
import {
  Environment,
  OrbitControls,
} from '@react-three/drei'
import BubbleGroup from './components/bubbles/bubbleGroup'
import Header from './components/Header/Header'
import SceneErrorBoundary from './components/SceneFallback/SceneFallback'
import { useState } from 'react';

export default function App() {
  const [selectedBubble, setSelectedBubble] = useState(null);

  const handleBubbleSelect = (index) => {
    setSelectedBubble(index);
  };

  const handleBackClick = () => {
    setSelectedBubble(null);
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Header */}
      <Header />
      
      {/* Three.js Canvas */}
      <SceneErrorBoundary>
        <Canvas camera={{ fov: 100 }}>
          <ambientLight intensity={0.3} />
          <BubbleGroup 
            onBubbleSelect={handleBubbleSelect} 
            selectedBubble={selectedBubble} 
          />
          <Environment preset="dawn" background blur={0.5} />
          <OrbitControls/>
        
        </Canvas>
      </SceneErrorBoundary>
      
      {/* Back button - rendered in regular DOM */}
      {selectedBubble !== null && (
        <button
          onClick={handleBackClick}
          className="header__social-link back-button"
          aria-label="Go back"
          title="Back"
          style={{
            position: 'absolute',
            top: '100px', // Adjusted to account for header
            left: '20px',
            zIndex: 1000,
            // keep visual styling from header CSS; only position here
          }}
        >
          <span className="header__social-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </span>
          <span className="header__social-text">Back</span>
          <span className="header__social-hover-effect"></span>
        </button>
      )}
    </div>
  );
}