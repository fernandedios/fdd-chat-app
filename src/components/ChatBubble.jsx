const initials = (name = '') =>
  name
    .split(/\s+/)
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function ChatBubble({ message, mine, typing }) {
  const { avatar, name, text } = message;

  return (
    <div className={mine ? 'bubble bubble-mine' : 'bubble'}>
      <div className="portrait">
        <span className="portrait-ring" />
        {avatar ? (
          <img className="portrait-photo" src={avatar} alt="" referrerPolicy="no-referrer" />
        ) : (
          <span className="portrait-photo portrait-initials">{initials(name)}</span>
        )}
      </div>
      <div className="bubble-main">
        <div className="bubble-name">
          <span>{name}</span>
        </div>
        <p className="bubble-body">
          {typing ? (
            <span className="typing" aria-label="Typing">
              <i />
              <i />
              <i />
            </span>
          ) : (
            text
          )}
        </p>
      </div>
    </div>
  );
}
