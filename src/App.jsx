import { useState } from 'react';
import Header from './components/Header.jsx';
import Login from './components/Login.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import Characters from './components/Characters.jsx';
import AiChatRoom from './components/AiChatRoom.jsx';
import { getCharacter } from './lib/characters.js';
import { clearHistory, loadSettings, saveSettings } from './lib/aiStore.js';

export default function App({ chat, aiClient }) {
  const [identity, setIdentity] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  // 'group', 'characters' or a character id
  const [view, setView] = useState('group');
  const [settings, setSettings] = useState(loadSettings);
  const [aiRoomKey, setAiRoomKey] = useState(0);
  const character = getCharacter(view);

  async function join(signIn) {
    setBusy(true);
    setError('');
    try {
      setIdentity(await signIn());
      setView('group');
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

  function updateSettings(next) {
    saveSettings(next);
    setSettings(next);
  }

  function clearChat() {
    clearHistory(character.id);
    setAiRoomKey((key) => key + 1);
  }

  const nav = identity
    ? [
        { label: 'Group chat', active: view === 'group', onClick: () => setView('group') },
        { label: 'Characters', active: view === 'characters', onClick: () => setView('characters') },
        ...(character ? [{ label: 'Clear chat', onClick: clearChat }] : []),
        { label: 'Leave', onClick: leave },
      ]
    : [];

  let content;
  if (!identity) {
    content = (
      <Login
        busy={busy}
        error={error}
        supportsFacebook={chat.supportsFacebook}
        onAnon={(id) => join(() => chat.signInAnon(id))}
        onFacebook={() => join(() => chat.signInFacebook())}
      />
    );
  } else if (character) {
    content = (
      <AiChatRoom
        key={`${character.id}:${aiRoomKey}`}
        character={character}
        identity={identity}
        settings={settings}
        client={aiClient}
      />
    );
  } else if (view === 'characters') {
    content = <Characters settings={settings} onSaveSettings={updateSettings} onPick={setView} />;
  } else {
    content = <ChatRoom chat={chat} identity={identity} />;
  }

  return (
    <div className="app">
      <Header mode={chat.mode} nav={nav} />
      {content}
    </div>
  );
}
