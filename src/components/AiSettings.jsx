import { useState } from 'react';
import { listModels } from '../lib/aiClient.js';

export default function AiSettings({ settings, onSave, list = listModels }) {
  const [form, setForm] = useState(settings);
  const [models, setModels] = useState([]);
  const [status, setStatus] = useState(null);
  const field = (key) => ({
    value: form[key],
    onChange: (event) => setForm({ ...form, [key]: event.target.value }),
  });

  function submit(event) {
    event.preventDefault();
    onSave({ baseUrl: form.baseUrl.trim(), apiKey: form.apiKey.trim(), model: form.model.trim() });
  }

  async function test() {
    setStatus({ text: 'Testing...' });
    try {
      const ids = await list(form);
      setModels(ids);
      setStatus({ ok: true, text: ids.length ? `Connected. ${ids.length} models found.` : 'Connected.' });
      if (!form.model && ids.length) setForm((f) => ({ ...f, model: ids[0] }));
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    }
  }

  return (
    <form className="ai-settings" onSubmit={submit} aria-label="AI settings">
      <h2 className="strip strip-anon ai-settings-title">
        <span>AI settings</span>
      </h2>
      <label>
        <span>API base URL</span>
        <input type="text" required placeholder="https://api.openai.com/v1 or /ai-proxy/v1" {...field('baseUrl')} />
      </label>
      <label>
        <span>API key</span>
        <input type="password" autoComplete="off" placeholder="Leave empty for local servers" {...field('apiKey')} />
      </label>
      <label>
        <span>Model</span>
        <input type="text" required list="ai-models" placeholder="Model name from your provider" {...field('model')} />
        <datalist id="ai-models">
          {models.map((id) => (
            <option key={id} value={id} />
          ))}
        </datalist>
      </label>
      {status && (
        <p className={status.ok === false ? 'ai-status ai-status-error' : 'ai-status'} role="status">
          {status.text}
        </p>
      )}
      <p className="ai-note">
        Saved only in this browser. Messages go straight from your browser to this URL, never through
        this app&apos;s server.
      </p>
      <div className="ai-actions">
        <button type="button" className="strip strip-anon strip-button" disabled={!form.baseUrl.trim()} onClick={test}>
          Test connection
        </button>
        <button type="submit" className="strip strip-anon strip-button ai-save">
          Save
        </button>
      </div>
    </form>
  );
}
