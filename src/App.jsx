import { useState } from 'react';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import ChatRoom from './components/ChatRoom.jsx';

export default function App({ chat }) {
  const [identity, setIdentity] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function join(signIn) {
    setBusy(true);
    setError('');
    try {
      setIdentity(await signIn());
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function leave() {
    await chat.signOut();
    setIdentity(null);
  }

  return (
    <div className="app">
      <Header mode={chat.mode} onLeave={identity ? leave : undefined} />
      {identity ? (
        <ChatRoom chat={chat} identity={identity} />
      ) : (
        <Login
          busy={busy}
          error={error}
          supportsFacebook={chat.supportsFacebook}
          onAnon={(id) => join(() => chat.signInAnon(id))}
          onFacebook={() => join(() => chat.signInFacebook())}
        />
      )}
    </div>
  );
}
