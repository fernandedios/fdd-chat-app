FDD Concept: Chat/Messaging Application
=========

> Persona 5 Inspired Chat App

Chat app built with React 19, Vite and Firebase (Realtime Database + Auth). The UI (bubbles, portrait frames, input, send button, login frame, logo) is drawn with CSS polygons traced from the original artwork. The only images are the chat name tag (`src/assets/bubble-name.png`) and the avatar portraits in `public/avatars`.

Quick start
------------

Requires Node 22.12 or newer.

```sh
git clone git@github.com:fernandedios/fdd-chat-app.git
cd fdd-chat-app
npm install
npm run dev
```

With no Firebase config the app runs in **local mode**: messages live in `localStorage` and sync between tabs, so you can open two tabs and chat with yourself. Facebook login is hidden in this mode.

Scripts
------------

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server (local mode, or Firebase if `.env.local` is set) |
| `npm test` / `npm run test:watch` | Vitest + Testing Library |
| `npm run lint` | ESLint |
| `npm run check` | Lint, test and build, same as CI |
| `npm run build` / `npm run preview` | Production build into `dist/` and preview it |
| `npm run emulators` + `npm run dev:emulator` | Run against local Firebase emulators (needs Java), in two terminals |
| `npm run deploy` | Check, then deploy hosting and database rules to Firebase |

Firebase setup
------------

1. Create a Firebase project and a Realtime Database.
2. In Authentication, enable the **Anonymous** provider. For Facebook login, also enable **Facebook** and paste your Facebook app ID and secret (the Facebook app needs the OAuth redirect URI that Firebase shows you).
3. Add a web app in project settings, then copy `.env.example` to `.env.local` and fill in the values.
4. `npx firebase-tools login` and `npx firebase-tools use --add` to pick the project.
5. `npm run deploy`. This also publishes `database.rules.json`, which only lets signed in users read, and validates every message write.

Deploying from GitHub
------------

`.github/workflows/ci.yml` runs `npm run check` on every push and PR. To also deploy on pushes to `master`, add these in the repo settings:

- Variables: `FIREBASE_PROJECT_ID`, `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_DATABASE_URL`, `VITE_FIREBASE_APP_ID`
- Secret: `FIREBASE_SERVICE_ACCOUNT` (JSON key of a service account with Firebase Hosting Admin and Firebase Realtime Database Admin roles)

`dist/` is plain static files, so Netlify, Vercel or Cloudflare Pages work too: build command `npm run build`, output `dist`, and the same `VITE_*` env vars. Database rules still need `npx firebase-tools deploy --only database` once.

Thanks
------

*FDD Concept: Chat/Messaging Application* © 2017, Fernan de Dios. Released under the [MIT License].<br>

> [fernandedios.com](http://fernandedios.com) &nbsp;&middot;&nbsp;
> GitHub [@fernandedios](https://github.com/fernandedios) &nbsp;&middot;&nbsp;
> Twitter [@fernan_de_dios](https://twitter.com/fernan_de_dios)

[MIT License]: http://mit-license.org/
