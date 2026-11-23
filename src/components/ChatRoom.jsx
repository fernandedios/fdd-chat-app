import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble.jsx';
import Composer from './Composer.jsx';

export default function ChatRoom({ chat, identity }) {
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => chat.subscribe(setMessages, (err) => setError(err.message)), [chat]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  async function send(text) {
    setSending(true);
    setError('');
    try {
      await chat.send(identity, text);
      return true;
    } catch (err) {
      setError(err.message || 'Message failed to send');
      return false;
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="room">
      <ul className="chat" role="log" aria-live="polite" aria-label="Messages">
        {messages.length === 0 && <li className="empty">No messages yet. Say something.</li>}
        {messages.map((message) => (
          <li key={message.id}>
            <ChatBubble message={message} mine={message.uid === identity.uid} />
          </li>
        ))}
        <li ref={endRef} aria-hidden="true" />
      </ul>
      <Composer onSend={send} busy={sending} error={error} />
    </main>
  );
}
