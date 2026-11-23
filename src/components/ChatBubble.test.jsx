import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatBubble from './ChatBubble.jsx';

const message = { id: '1', uid: 'u1', name: 'Anon', avatar: '/avatars/ann.jpg', text: 'Hi there' };

describe('ChatBubble', () => {
  it('renders name, text and avatar', () => {
    const { container } = render(<ChatBubble message={message} />);
    expect(screen.getByText('Anon')).toBeInTheDocument();
    expect(screen.getByText('Hi there')).toBeInTheDocument();
    expect(container.querySelector('img')).toHaveAttribute('src', '/avatars/ann.jpg');
  });

  it('marks own messages', () => {
    const { container } = render(<ChatBubble message={message} mine />);
    expect(container.firstChild).toHaveClass('bubble-mine');
  });
});
