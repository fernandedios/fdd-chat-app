import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble.jsx';
import Composer from './Composer.jsx';
import { streamChat } from '../lib/aiClient.js';
import { buildSystemPrompt } from '../lib/characters.js';
import { loadHistory, saveHistory } from '../lib/aiStore.js';

const CONTEXT_MESSAGES = 20;

export default function AiChatRoom({ character, identity, settings, client = streamChat }) {
  const [messages, setMessages] = useState(() => loadHistory(character.id));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
    if (!busy) saveHistory(character.id, messages);
  }, [messages, busy, character.id]);

  async function send(text) {
    const userMessage = { id: crypto.randomUUID(), role: 'user', text };
    const replyId = crypto.randomUUID();
    const history = [...messages, userMessage];
    setMessages([...history, { id: replyId, role: 'assistant', text: '' }]);
    setBusy(true);
    setError('');

    const controller = new AbortController();
    abortRef.current = controller;
    const apiMessages = [
      { role: 'system', content: buildSystemPrompt(character, identity.name) },
      ...history.slice(-CONTEXT_MESSAGES).map((m) => ({ role: m.role, content: m.text })),
    ];

    try {
      for await (const chunk of client({ ...settings, messages: apiMessages, signal: controller.signal })) {
        setMessages((list) => list.map((m) => (m.id === replyId ? { ...m, text: m.text + chunk } : m)));
      }
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message || 'AI request failed');
    } finally {
      // Drop the reply bubble if nothing arrived
      setMessages((list) => list.filter((m) => m.id !== replyId || m.text));
      setBusy(false);
    }
    return true;
  }

  const toBubble = (m) =>
    m.role === 'user'
      ? { name: identity.name, avatar: identity.avatar, text: m.text }
      : { name: character.short, avatar: character.avatar, text: m.text };

  return (
    <main className="room">
      <ul className="chat" role="log" aria-live="polite" aria-label={`Chat with ${character.name}`}>
        {messages.length === 0 && <li className="empty">Say hi to {character.short}.</li>}
        {messages.map((m) => (
          <li key={m.id}>
            <ChatBubble message={toBubble(m)} mine={m.role === 'user'} typing={m.role === 'assistant' && !m.text} />
          </li>
        ))}
        <li ref={endRef} aria-hidden="true" />
      </ul>
      <Composer onSend={send} busy={busy} error={error} placeholder={`Message ${character.short}`} />
    </main>
  );
}
