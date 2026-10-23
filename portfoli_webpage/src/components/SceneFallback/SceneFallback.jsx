import { Component } from 'react';
import { sections } from '../../content';
import SectionContent from '../ContentPanel/SectionContent';
import './SceneFallback.css';

// Plain HTML version of the bubble content, shown when the 3D scene fails
// (e.g. WebGL is unavailable or a CDN asset can't be fetched).
export function SceneFallback() {
  return (
    <main className="scene-fallback">
      {sections.map((section) => (
        <section key={section.label} className="scene-fallback__section card">
          <SectionContent section={section} />
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
