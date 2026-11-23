// Emulator mode uses a demo-* project, which never touches real Firebase.
const EMULATOR_CONFIG = {
  apiKey: 'demo-key',
  authDomain: 'demo-p5chat.firebaseapp.com',
  databaseURL: 'http://127.0.0.1:9000?ns=demo-p5chat',
  projectId: 'demo-p5chat',
};

// Picks the backend: Firebase when configured, otherwise a localStorage demo.
export async function loadChat(env = import.meta.env) {
  if (env.MODE === 'emulator') {
    const { createFirebaseChat } = await import('./firebaseChat.js');
    return createFirebaseChat(EMULATOR_CONFIG, { emulator: true });
  }

  if (!env.VITE_FIREBASE_API_KEY) {
    const { createLocalChat } = await import('./localChat.js');
    return createLocalChat();
  }

  const { createFirebaseChat } = await import('./firebaseChat.js');
  return createFirebaseChat({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: env.VITE_FIREBASE_DATABASE_URL,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  });
}
