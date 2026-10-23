import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SceneErrorBoundary from './SceneFallback';

function BrokenScene() {
  throw new Error('Could not load kiara_1_dawn_1k.hdr');
}

test('shows the plain HTML sections when the scene throws', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <SceneErrorBoundary>
      <BrokenScene />
    </SceneErrorBoundary>
  );
  expect(screen.getByRole('heading', { name: 'About Me' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Education' })).toBeInTheDocument();
  expect(screen.getByText(/Northern Michigan University/)).toBeInTheDocument();
});

test('renders children when the scene works', () => {
  render(
    <SceneErrorBoundary>
      <p>scene</p>
    </SceneErrorBoundary>
  );
  expect(screen.getByText('scene')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'About Me' })).not.toBeInTheDocument();
});
