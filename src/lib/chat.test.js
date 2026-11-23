import { describe, expect, it } from 'vitest';
import { loadChat } from './chat.js';

describe('loadChat', () => {
  it('falls back to local mode without Firebase config', async () => {
    const chat = await loadChat({});
    expect(chat.mode).toBe('local');
    expect(chat.supportsFacebook).toBe(false);
  });
});
