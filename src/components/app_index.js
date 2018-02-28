import React, { Component } from 'react';
import FacebookAuth from 'react-facebook-auth';

import ChatRoom from './ChatRoom';
import keys from '../config/keys';

const fb = ({ onClick }) => (
  <div id="login-button" onClick={onClick}></div>
);

class AppIndex extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { avatar: '', name: '' };
  }

  authenticate(response) {
    //console.log(response);
    const fullName = response.name;
    const name = fullName.split(' ');

    this.setState({ name: name[0], avatar: `http://graph.facebook.com/${response.id}/picture` });
  }

  doAnon(event) {
    this.setState({ name: 'Anon', avatar: `images/${event.target.id}.jpg` });
  }

  render() {
    const { name, avatar } = this.state;

    if (avatar === '' && name === '') {
      return (
        <div id="login-panel">
          <FacebookAuth
            appId={keys.appId}
            callback={this.authenticate.bind(this)}
            component={fb}
          />
          <div id="anon-head"></div>
          <div id="avatar-container">
            <div id="prot" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="ryuji" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="ann" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="yusuke" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="makoto" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="futaba" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="haru" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
            <div id="mona" onClick={this.doAnon.bind(this)} className="avatar-img"></div>
          </div>
        </div>
      );
    }

    return (
      <ChatRoom avatar={avatar} name={name} />
    );
  }
}

export default AppIndex;
