import { render, screen, within } from '@testing-library/react';
import { sections } from '../../content';
import SectionContent from './SectionContent';

const skills = sections.find((section) => section.label === 'Skills');

test('shows where each skill was used', () => {
  render(<SectionContent section={skills} />);
  const skill = screen.getByText('C++').closest('li');
  expect(within(skill).getByText(/parallel merge sort/)).toBeInTheDocument();
});

test('lists skills without a where as plain chips', () => {
  render(<SectionContent section={skills} />);
  expect(screen.getByText('Python')).toHaveClass('chip');
});
