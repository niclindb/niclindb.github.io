import Header from './components/Header/Header'
import ContentPanel from './components/ContentPanel/ContentPanel'
import SceneErrorBoundary from './components/SceneFallback/SceneFallback'
import PopOverlay from './components/PopOverlay/PopOverlay'
import BubbleMenu from './components/BubbleMenu/BubbleMenu'
import { sections } from './content';
import { parseHash, syncHash } from './deepLink';
import { lazy, Suspense, useState, useCallback, useEffect } from 'react';
import './App.css';

const Scene = lazy(() => import('./components/Scene/Scene'));

// A link like niclindb.github.io/#web-apps opens that section on arrival
const initialLink = typeof window === 'undefined' ? null : parseHash(window.location.hash);

export default function App() {
  const [selectedBubble, setSelectedBubble] = useState(initialLink?.index ?? null);
  // The pop animation in progress, and whether the content is showing yet
  const [pop, setPop] = useState(null);
  const [showPanel, setShowPanel] = useState(initialLink !== null);
  // A project to scroll to when the section opens from a link
  const [linkedProject, setLinkedProject] = useState(initialLink?.project ?? null);
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
    setLinkedProject(null);
    setPop((prev) => ({ origin, id: (prev?.id ?? 0) + 1 }));
  }, []);

  // Moving between sections slides the content instead of popping again
  const handleNavigate = useCallback((index, direction) => {
    setSelectedBubble(index);
    setLinkedProject(null);
    setEntrance(direction);
  }, []);

  const handleBackClick = useCallback(() => {
    setReturningBubble(selectedBubble);
    setSelectedBubble(null);
    setShowPanel(false);
    setPop(null);
    setLinkedProject(null);
  }, [selectedBubble]);

  useEffect(() => syncHash(selectedBubble), [selectedBubble]);

  // Following a section link while already on the site opens it the same way
  useEffect(() => {
    const onHashChange = () => {
      const link = parseHash(window.location.hash);
      if (!link) return;
      setSelectedBubble(link.index);
      setShowPanel(true);
      setPop(null);
      setEntrance('pop');
      setReturningBubble(null);
      setLinkedProject(link.project);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

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
              // Nothing moves behind an open section, so skip drawing it
              paused={selectedBubble !== null && showPanel && !pop}
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
              linkedProject={linkedProject}
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
