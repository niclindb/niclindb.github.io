import Header from './components/Header/Header'
import ContentPanel from './components/ContentPanel/ContentPanel'
import SceneErrorBoundary from './components/SceneFallback/SceneFallback'
import PopOverlay from './components/PopOverlay/PopOverlay'
import BubbleMenu from './components/BubbleMenu/BubbleMenu'
import { sections } from './content';
import { lazy, Suspense, useState, useCallback } from 'react';
import './App.css';

const Scene = lazy(() => import('./components/Scene/Scene'));

export default function App() {
  const [selectedBubble, setSelectedBubble] = useState(null);
  // The pop animation in progress, and whether the content is showing yet
  const [pop, setPop] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  // How the content arrives: after a pop, or sliding from a neighbour
  const [entrance, setEntrance] = useState('pop');
  // The bubble the content floated back into, which reinflates first
  const [returningBubble, setReturningBubble] = useState(null);
  // Where each bubble sits on screen
  const [bubbleHomes, setBubbleHomes] = useState([]);
  // The bubble focused from the keyboard, which lifts like on hover
  const [focusedBubble, setFocusedBubble] = useState(null);

  // origin is where the bubble was on screen, so the pop starts there
  const handleBubbleSelect = useCallback((index, origin) => {
    setSelectedBubble(index);
    setFocusedBubble(null);
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

  const handleLayout = useCallback((homes) => setBubbleHomes(homes), []);
  const handleBurst = useCallback(() => setShowPanel(true), []);
  const handlePopDone = useCallback(() => setPop(null), []);

  return (
    <div className="app">
      <Header />

      <main className="app__main">
        <SceneErrorBoundary>
          <Suspense fallback={null}>
            <Scene
              onBubbleSelect={handleBubbleSelect}
              selectedBubble={selectedBubble}
              returningBubble={returningBubble}
              focusedBubble={focusedBubble}
              onLayout={handleLayout}
            />
          </Suspense>

          {selectedBubble === null && (
            <BubbleMenu
              homes={bubbleHomes}
              onSelect={handleBubbleSelect}
              onFocusChange={setFocusedBubble}
              restoreFocusTo={returningBubble}
            />
          )}
          {selectedBubble === null && (
            <p className="app__hint">
              <span className="app__hint-pointer">Pop a bubble to explore</span>
              <span className="app__hint-touch">Tap a bubble to explore</span>
            </p>
          )}
          {selectedBubble !== null && showPanel && (
            <ContentPanel
              index={selectedBubble}
              entrance={entrance}
              home={bubbleHomes[selectedBubble]}
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
      </main>

      {/* Tells screen readers which section is showing */}
      <p className="visually-hidden" aria-live="polite">
        {selectedBubble !== null && showPanel ? sections[selectedBubble].title : ''}
      </p>
    </div>
  );
}
