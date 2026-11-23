import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import { createLocalChat } from '../src/lib/localChat.js';

const setup = (chat = createLocalChat({ channel: null })) => {
  const user = userEvent.setup();
  render(<App chat={chat} />);
  return { user, chat };
};

describe('App', () => {
  it('logs in, sends a message and shows it as mine', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Join as Ann' }));

    const input = screen.getByPlaceholderText('Message');
    const send = screen.getByRole('button', { name: 'Send' });
    expect(send).toBeDisabled();

    await user.type(input, 'Looking cool, Joker{Enter}');

    const log = screen.getByRole('log');
    expect(within(log).getByText('Looking cool, Joker')).toBeInTheDocument();
    expect(log.querySelector('.bubble-mine')).not.toBeNull();
    expect(input).toHaveValue('');
  });

  it('ignores whitespace only messages', async () => {
    const { user, chat } = setup();
    const spy = vi.spyOn(chat, 'send');
    await user.click(screen.getByRole('button', { name: 'Join as Haru' }));
    await user.type(screen.getByPlaceholderText('Message'), '   {Enter}');
    expect(spy).not.toHaveBeenCalled();
  });

  it('shows send errors and keeps the draft', async () => {
    const chat = createLocalChat({ channel: null });
    chat.send = vi.fn().mockRejectedValue(new Error('Permission denied'));
    const { user } = setup(chat);

    await user.click(screen.getByRole('button', { name: 'Join as Haru' }));
    await user.type(screen.getByPlaceholderText('Message'), 'hi{Enter}');

    expect(await screen.findByRole('alert')).toHaveTextContent('Permission denied');
    expect(screen.getByPlaceholderText('Message')).toHaveValue('hi');
  });

  it('returns to login on leave', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Join as Ann' }));
    await user.click(screen.getByRole('button', { name: 'Leave' }));
    expect(screen.getByRole('button', { name: 'Join as Ann' })).toBeInTheDocument();
  });

  it('asks for AI settings, then opens a character chat', async () => {
    const aiClient = vi.fn(async function* () {
      yield 'Coffee is ready.';
    });
    const user = userEvent.setup();
    render(<App chat={createLocalChat({ channel: null })} aiClient={aiClient} />);

    await user.click(screen.getByRole('button', { name: 'Join as Ann' }));
    await user.click(screen.getByRole('button', { name: 'Characters' }));
    expect(screen.getByRole('button', { name: 'Chat with Haru Okumura' })).toBeDisabled();

    await user.type(screen.getByPlaceholderText('Model name from your provider'), 'test-model');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    await user.click(screen.getByRole('button', { name: 'Chat with Haru Okumura' }));
    await user.type(screen.getByPlaceholderText('Message Haru'), 'hi{Enter}');

    expect(await screen.findByText('Coffee is ready.')).toBeInTheDocument();
    expect(aiClient.mock.calls[0][0].model).toBe('test-model');
  });
});
