import { render, screen } from '@testing-library/react';
import Header from './Header';

test('renders name and links', () => {
  render(<Header />);
  expect(screen.getByText('Nick Lindberg')).toBeInTheDocument();
  expect(screen.getByTitle('GitHub')).toHaveAttribute('href', 'https://github.com/niclindb');
  expect(screen.getByTitle('LinkedIn')).toHaveAttribute('href', 'https://www.linkedin.com/in/nick-lindberg-2262aa393');
  expect(screen.getByTitle('Resume')).toHaveAttribute('href', '/Resume.pdf');
  expect(screen.getByRole('button', { name: 'Contact Nick' })).toBeInTheDocument();
});
