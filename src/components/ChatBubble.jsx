export default function ChatBubble({ message, mine }) {
  const { avatar, name, text } = message;

  return (
    <div className={mine ? 'bubble bubble-mine' : 'bubble'}>
      <div className="portrait">
        <span className="portrait-ring" />
        <img className="portrait-photo" src={avatar} alt="" referrerPolicy="no-referrer" />
      </div>
      <div className="bubble-main">
        <div className="bubble-name">
          <span>{name}</span>
        </div>
        <p className="bubble-body">{text}</p>
      </div>
    </div>
  );
}
