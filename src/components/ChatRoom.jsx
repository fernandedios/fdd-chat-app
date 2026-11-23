import { useEffect, useRef, useState } from 'react';
import ChatBubble from './ChatBubble.jsx';
import { MAX_MESSAGE_LENGTH } from '../lib/avatars.js';

export default function ChatRoom({ chat, identity }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const endRef = useRef(null);

  useEffect(() => chat.subscribe(setMessages, (err) => setError(err.message)), [chat]);

  useEffect(() => {
    endRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  async function submit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value || sending) return;

    setSending(true);
    setError('');
    try {
      await chat.send(identity, value);
      setText('');
    } catch (err) {
      setError(err.message || 'Message failed to send');
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

      <form className="composer" onSubmit={submit}>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <label className="p5-input">
          <span className="sr-only">Message</span>
          <input
            type="text"
            placeholder="Message"
            autoComplete="off"
            maxLength={MAX_MESSAGE_LENGTH}
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </label>
        <button type="submit" className="p5-send" disabled={sending || !text.trim()} aria-label="Send">
          <span>S</span>
          <span>e</span>
          <span>n</span>
          <span>d</span>
        </button>
      </form>
    </main>
  );
}
