export default function Header({ mode, nav = [] }) {
  return (
    <header className="header">
      <h1 className="logo" aria-label="IM">
        <span className="logo-i" />
        <span className="logo-m" />
      </h1>
      <nav className="header-actions" aria-label="Main">
        {mode !== 'firebase' && <span className="tag">{mode} mode</span>}
        {nav.map(({ label, active, onClick }) => (
          <button
            key={label}
            type="button"
            className={active ? 'strip strip-anon strip-button active' : 'strip strip-anon strip-button'}
            aria-current={active ? 'page' : undefined}
            onClick={onClick}
          >
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
