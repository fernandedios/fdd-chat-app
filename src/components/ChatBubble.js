import React, { Component } from 'react';

class ChatBubble extends Component {
  render() {
    const { avatar, name, text } = this.props.message;
    return (
      <div className="bubble">
        <div className="portrait">
          <div className="portframe"></div>
          <div className="portimg"><img src={avatar} /></div>
        </div>
        <div className="bubble-name"><span>{name}</span></div>
        <div className="bubble-body">{text}</div>
      </div>
    );
  }
}

export default ChatBubble;
