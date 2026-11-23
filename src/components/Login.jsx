import { AVATARS, avatarUrl } from '../lib/avatars.js';

export default function Login({ supportsFacebook, onFacebook, onAnon, busy, error }) {
  return (
    <main className="login">
      <div className="login-panel">
        {supportsFacebook && (
          <button
            type="button"
            className="strip strip-fb strip-button login-fb"
            disabled={busy}
            onClick={onFacebook}
          >
            <span className="strip-icon" aria-hidden="true">
              f
            </span>
            <span>Login with Facebook</span>
          </button>
        )}
        <h2 className={supportsFacebook ? 'strip strip-anon login-anon' : 'strip strip-anon login-anon solo'}>
          <span>Login as anonymous, choose avatar below</span>
        </h2>
        <div className="avatar-grid">
          {AVATARS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className="avatar-pick"
              disabled={busy}
              aria-label={`Join as ${label}`}
              onClick={() => onAnon(id)}
            >
              <img src={avatarUrl(id)} alt="" />
            </button>
          ))}
        </div>
        {error && (
          <p className="error login-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
