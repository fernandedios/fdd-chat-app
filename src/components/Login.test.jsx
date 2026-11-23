import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login.jsx';

describe('Login', () => {
  it('joins with the clicked avatar', async () => {
    const onAnon = vi.fn();
    render(<Login onAnon={onAnon} />);
    await userEvent.click(screen.getByRole('button', { name: 'Join as Ryuji' }));
    expect(onAnon).toHaveBeenCalledWith('ryuji');
  });

  it('shows Facebook login only when supported', () => {
    const { rerender } = render(<Login onAnon={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /facebook/i })).not.toBeInTheDocument();

    rerender(<Login supportsFacebook onAnon={vi.fn()} />);
    expect(screen.getByRole('button', { name: /facebook/i })).toBeInTheDocument();
  });

  it('shows errors', () => {
    render(<Login onAnon={vi.fn()} error="Popup blocked" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Popup blocked');
  });
});
