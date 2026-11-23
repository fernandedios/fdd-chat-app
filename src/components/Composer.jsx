import { useState } from 'react';
import { MAX_MESSAGE_LENGTH } from '../lib/avatars.js';

// onSend resolves to true when the draft can be cleared.
export default function Composer({ onSend, busy, error, placeholder = 'Message' }) {
  const [text, setText] = useState('');

  async function submit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value || busy) return;
    if (await onSend(value)) setText('');
  }

  return (
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
          placeholder={placeholder}
          autoComplete="off"
          maxLength={MAX_MESSAGE_LENGTH}
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      </label>
      <button type="submit" className="p5-send" disabled={busy || !text.trim()} aria-label="Send">
        <span>S</span>
        <span>e</span>
        <span>n</span>
        <span>d</span>
      </button>
    </form>
  );
}
