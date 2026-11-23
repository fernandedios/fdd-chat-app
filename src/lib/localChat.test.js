import { describe, expect, it, vi } from 'vitest';
import { createLocalChat } from './localChat.js';

const make = (opts) => createLocalChat({ channel: null, ...opts });

describe('localChat', () => {
  it('signs in anonymously with the chosen avatar', async () => {
    const identity = await make().signInAnon('ann');
    expect(identity).toMatchObject({ name: 'Anon', avatar: '/avatars/ann.jpg' });
    expect(identity.uid).toBeTruthy();
  });

  it('delivers sent messages to subscribers', async () => {
    const chat = make();
    const cb = vi.fn();
    chat.subscribe(cb);
    expect(cb).toHaveBeenLastCalledWith([]);

    const me = await chat.signInAnon('mona');
    await chat.send(me, 'hello');
    expect(cb.mock.lastCall[0]).toEqual([expect.objectContaining({ text: 'hello', uid: me.uid })]);
  });

  it('stops notifying after unsubscribe', async () => {
    const chat = make();
    const cb = vi.fn();
    chat.subscribe(cb)();
    await chat.send(await chat.signInAnon('ann'), 'ignored');
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('keeps only the latest messages', async () => {
    const chat = make({ limit: 2 });
    const me = await chat.signInAnon('ann');
    for (const text of ['a', 'b', 'c']) await chat.send(me, text);

    const cb = vi.fn();
    chat.subscribe(cb);
    expect(cb.mock.lastCall[0].map((m) => m.text)).toEqual(['b', 'c']);
  });

  it('recovers from corrupt storage', () => {
    localStorage.setItem('p5chat:messages', '{nope');
    const cb = vi.fn();
    make().subscribe(cb);
    expect(cb).toHaveBeenCalledWith([]);
  });
});
