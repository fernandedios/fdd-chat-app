import React, { Component } from 'react';
import firebase from 'firebase';

import ChatBubble from './ChatBubble';

class ChatRoom extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      messages: [],
      message: '',
      avatar: '',
      name: ''
    };
  }

  componentWillMount() {
    firebase.initializeApp({
      apiKey: '',
      authDomain: '',
      databaseURL: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: ''
    });
  }

  componentDidMount() {
    // bind firebase data change to function
    firebase.database().ref('messages/').on('value', (snapshot) => {
      const currentMessages = snapshot.val();

      if (currentMessages !== null) {
        this.setState({
          messages: currentMessages
        });
      }
    });
  }

  submitMessage(event) {
    event.preventDefault();
    const { messages, message, avatar, name } = this.state;
    //console.log(this.state.message);

    const nextMessage = {
      id: messages.length,
      text: message,
      avatar,
      name
    };

    /* const list = Object.assign([], this.state.messages);
    list.push(nextMessage);

    this.setState({
      messages: list
    }); */

    firebase.database().ref(`messages/${nextMessage.id}`).set(nextMessage)
      .then(() => { this.setState({ message: '' }); })
      .catch(error => { console.log(error); });
  }

  render() {
    const currentMessage = this.state.messages.map((message) => {
      // this.state.messages.map((message, i) => {
      // console.log(i);

      setTimeout(() => {
        this.refs.container_chat.scrollTop = this.refs.container_chat.scrollHeight;
      }, 1000);

      return (
        <li key={message.id}>
          <ChatBubble message={message} />
        </li>
      );
    });

    const { name, avatar } = this.props;

    return (
      <div className="full">
        <div ref="container_chat" id="container-chat" className="container">
          <div className="content-container">
            <ul className="chat">
              {currentMessage}
            </ul>
            <div className="push"></div>
          </div>
        </div>

        <div className="footer">
          <div id="chat-panel">
            <form onSubmit={this.submitMessage.bind(this)}>
              <input
                type="text"
                className="p5input"
                placeholder="Message"
                value={this.state.message}
                onChange={event => {
                  this.setState({ message: event.target.value, avatar, name });
                }}
              />
              <button type="submit" className="p5button" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatRoom;
