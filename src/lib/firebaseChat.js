import { initializeApp } from 'firebase/app';
import {
  FacebookAuthProvider,
  connectAuthEmulator,
  getAuth,
  signInAnonymously,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import {
  connectDatabaseEmulator,
  getDatabase,
  limitToLast,
  onValue,
  push,
  query,
  ref,
  serverTimestamp,
} from 'firebase/database';
import { FALLBACK_AVATAR, avatarUrl } from './avatars.js';

export function createFirebaseChat(config, { emulator = false, limit = 100 } = {}) {
  const app = initializeApp(config);
  const auth = getAuth(app);
  const db = getDatabase(app);

  if (emulator) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectDatabaseEmulator(db, '127.0.0.1', 9000);
  }

  const messagesRef = ref(db, 'messages');

  return {
    mode: emulator ? 'emulator' : 'firebase',
    supportsFacebook: true,
    async signInAnon(avatarId) {
      const { user } = await signInAnonymously(auth);
      return { uid: user.uid, name: 'Anon', avatar: avatarUrl(avatarId) };
    },
    async signInFacebook() {
      const { user } = await signInWithPopup(auth, new FacebookAuthProvider());
      const name = (user.displayName ?? 'Thief').split(' ')[0];
      return { uid: user.uid, name, avatar: user.photoURL ?? FALLBACK_AVATAR };
    },
    signOut: () => signOut(auth),
    subscribe(cb, onError) {
      return onValue(
        query(messagesRef, limitToLast(limit)),
        (snapshot) => {
          const list = [];
          snapshot.forEach((child) => {
            list.push({ id: child.key, ...child.val() });
          });
          cb(list);
        },
        onError,
      );
    },
    async send({ uid, name, avatar }, text) {
      await push(messagesRef, { uid, name, avatar, text, createdAt: serverTimestamp() });
    },
  };
}
