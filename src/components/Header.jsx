export default function Header({ mode, onLeave }) {
  return (
    <header className="header">
      <h1 className="logo" aria-label="IM">
        <span className="logo-i" />
        <span className="logo-m" />
      </h1>
      <div className="header-actions">
        {mode !== 'firebase' && <span className="tag">{mode} mode</span>}
        {onLeave && (
          <button type="button" className="strip strip-anon strip-button" onClick={onLeave}>
            Leave
          </button>
        )}
      </div>
    </header>
  );
}
