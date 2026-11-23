import { useState } from 'react';
import AiSettings from './AiSettings.jsx';
import Disclaimer from './Disclaimer.jsx';
import { CHARACTERS } from '../lib/characters.js';
import { isConfigured } from '../lib/aiStore.js';

export default function Characters({ settings, onSaveSettings, onPick }) {
  const ready = isConfigured(settings);
  const [editing, setEditing] = useState(!ready);

  function save(next) {
    onSaveSettings(next);
    setEditing(!isConfigured(next));
  }

  return (
    <main className="characters">
      <div className="characters-inner">
        {editing ? (
          <AiSettings settings={settings} onSave={save} />
        ) : (
          <button type="button" className="strip strip-anon strip-button ai-edit" onClick={() => setEditing(true)}>
            AI settings: {settings.model}
          </button>
        )}

        <h2 className="strip strip-anon characters-title">
          <span>Pick someone to chat with</span>
        </h2>

        <ul className="character-grid">
          {CHARACTERS.map((character) => (
            <li key={character.id} className="character-card">
              <button
                type="button"
                className="character-pick"
                disabled={!ready}
                aria-label={`Chat with ${character.name}`}
                onClick={() => onPick(character.id)}
              >
                <span className="portrait">
                  <span className="portrait-ring" />
                  <img className="portrait-photo" src={character.avatar} alt="" />
                </span>
                <span className="character-name">{character.name}</span>
                <span className="character-codename">{character.codename}</span>
              </button>
            </li>
          ))}
        </ul>

        <Disclaimer />
      </div>
    </main>
  );
}
