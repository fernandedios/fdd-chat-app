import { avatarUrl } from './avatars.js';

const KEY = 'p5chat:messages';

// No-backend chat for local dev and tests. Tabs stay in sync via BroadcastChannel.
export function createLocalChat({
  storage = globalThis.localStorage,
  channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('p5chat'),
  limit = 100,
} = {}) {
  const listeners = new Set();
  const uid = crypto.randomUUID();

  const read = () => {
    try {
      return JSON.parse(storage.getItem(KEY)) ?? [];
    } catch {
      return [];
    }
  };
  const emit = () => {
    const list = read().slice(-limit);
    listeners.forEach((cb) => cb(list));
  };

  channel?.addEventListener('message', emit);

  return {
    mode: 'local',
    supportsFacebook: false,
    async signInAnon(avatarId) {
      return { uid, name: 'Anon', avatar: avatarUrl(avatarId) };
    },
    async signInFacebook() {
      throw new Error('Facebook login needs Firebase configured');
    },
    async signOut() {},
    subscribe(cb) {
      listeners.add(cb);
      cb(read().slice(-limit));
      return () => listeners.delete(cb);
    },
    async send(identity, text) {
      const message = { id: crypto.randomUUID(), ...identity, text, createdAt: Date.now() };
      storage.setItem(KEY, JSON.stringify([...read(), message].slice(-limit)));
      emit();
      channel?.postMessage('update');
    },
    clear() {
      storage.removeItem(KEY);
      emit();
    },
  };
}
