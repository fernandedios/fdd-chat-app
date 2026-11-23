import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AiChatRoom from '../../src/components/AiChatRoom.jsx';
import { getCharacter } from '../../src/lib/characters.js';
import { loadHistory } from '../../src/lib/aiStore.js';

const identity = { uid: 'me', name: 'Anon', avatar: '/avatars/ann.jpg' };
const settings = { baseUrl: 'https://api.example.com/v1', apiKey: 'k', model: 'm' };
const ryuji = getCharacter('ryuji');

describe('AiChatRoom', () => {
  it('streams the character reply and saves the history', async () => {
    const client = vi.fn(async function* () {
      yield 'Yo';
      yield ', what up?';
    });
    render(<AiChatRoom character={ryuji} identity={identity} settings={settings} client={client} />);

    await userEvent.type(screen.getByPlaceholderText('Message Ryuji'), 'hey{Enter}');

    const log = screen.getByRole('log');
    expect(await within(log).findByText('Yo, what up?')).toBeInTheDocument();
    expect(within(log).getByText('hey')).toBeInTheDocument();

    const { messages } = client.mock.calls[0][0];
    expect(messages[0].role).toBe('system');
    expect(messages[0].content).toContain('Ryuji Sakamoto');
    expect(messages.at(-1)).toEqual({ role: 'user', content: 'hey' });
    expect(loadHistory('ryuji').map((m) => m.text)).toEqual(['hey', 'Yo, what up?']);
  });

  it('shows errors and drops the empty reply', async () => {
    const client = vi.fn(async function* () {
      yield* [];
      throw new Error('AI request failed (401): bad key');
    });
    render(<AiChatRoom character={ryuji} identity={identity} settings={settings} client={client} />);

    await userEvent.type(screen.getByPlaceholderText('Message Ryuji'), 'hey{Enter}');

    expect(await screen.findByRole('alert')).toHaveTextContent('bad key');
    expect(screen.queryByLabelText('Typing')).not.toBeInTheDocument();
  });
});
