import { Component } from 'react';
import { bubblePositions } from '../bubbles/bubbleGroup';
import './SceneFallback.css';

// Plain HTML version of the bubble content, shown when the 3D scene fails
// (e.g. WebGL is unavailable or a CDN asset can't be fetched).
export function SceneFallback() {
  return (
    <main className="scene-fallback">
      {bubblePositions.map((bubble) => (
        <section key={bubble.text} className="scene-fallback__section">
          <h2>{bubble.text}</h2>
          <p>{bubble.moreText}</p>
        </section>
      ))}
    </main>
  );
}

export default class SceneErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('3D scene failed to load, showing fallback:', error);
  }

  render() {
    return this.state.hasError ? <SceneFallback /> : this.props.children;
  }
}
