FDD Concept: Chat/Messaging Application
=========

> Persona 5 Inspired Chat App

Working prototype of a chat/messaging application built with ReactJs and Firebase

Getting Started
------------

Checkout this repo, install dependencies, configure, then start the app.

```html
$ git clone git@github.com:fernandedios/fdd-chat-app.git
$ cd fdd-chat-app
$ npm install

-- configure app

$ npm start
```

Configuration
------------

This web application requires the following as starting point:
- [Facebook Application]
- [Google Firebase]

### Local Development Variables
```js
export default {
  apiKey: 'your_firebase_api_key',
  authDomain: 'your_firebase_auth_domain',
  databaseURL: 'https://your_firebase_db_url',
  projectId: 'your_firebase_project_id',
  storageBucket: 'your_firebase_storage_bucket',
  messagingSenderId: 'your_firebase_messaging_sender_id',
  appId: 'your_facebook_application_id'
};
```

Save as 'keys.js' and place it inside the src/config folder.

### Production Environment Variables
You will need to add the above values as environment variables

Preview
---------
Access the [application preview].


Thanks
------

*FDD Concept: Chat/Messaging Application* © 2017, Fernan de Dios. Released under the [MIT License].<br>

> [fernandedios.com](http://fernandedios.com) &nbsp;&middot;&nbsp;
> GitHub [@fernandedios](https://github.com/fernandedios) &nbsp;&middot;&nbsp;
> Twitter [@fernan_de_dios](https://twitter.com/fernan_de_dios)

[MIT License]: http://mit-license.org/
[Facebook Application]: http://developers.facebook.com/
[Google Firebase]: https://firebase.google.com
[application preview]: https://chat-app-sampler.herokuapp.com/
