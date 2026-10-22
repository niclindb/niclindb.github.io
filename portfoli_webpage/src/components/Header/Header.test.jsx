import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders name and contact links', () => {
  render(<Header />);
  expect(screen.getByText('Nick Lindberg')).toBeInTheDocument();
  expect(screen.getByTitle('GitHub')).toHaveAttribute('href', 'https://github.com/niclindb');
  expect(screen.getByTitle('Resume')).toHaveAttribute('href', '/portfolio/Resume.pdf');
  expect(screen.getByTitle('Contact Me')).toHaveAttribute('href', expect.stringMatching(/^mailto:/));
});
