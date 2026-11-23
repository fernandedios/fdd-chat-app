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
| `npm test` / `npm run test:watch` | Vitest + Testing Library, tests live in `tests/` |
| `npm run lint` | ESLint |
| `npm run check` | Lint, test and build, same as CI |
| `npm run build` / `npm run preview` | Production build into `dist/` and preview it |
| `npm run emulators` + `npm run dev:emulator` | Run against local Firebase emulators (needs Java), in two terminals |
| `npm run deploy` | Check, then deploy hosting and database rules to Firebase |

AI character chat
------------

After joining, open **Characters** to chat one on one with the Phantom Thieves (Ren, Ryuji, Ann, Yusuke, Makoto, Futaba, Haru, Morgana) or Akechi. Each character has a short original bio and speech style in `src/lib/characters.js` that becomes the system prompt.

1. Click **Characters**, fill in **AI settings** and save:
   - **API base URL**: any OpenAI compatible endpoint, for example `https://api.openai.com/v1`, `https://openrouter.ai/api/v1`, or a local server such as Ollama (`http://localhost:11434/v1`) or LM Studio (`http://localhost:1234/v1`).
   - **API key**: your key for that provider. Leave it empty for local servers that do not need one.
   - **Model**: a chat model your provider offers.
   Use **Test connection** to check the URL and key. On success the model field suggests the models your server reports.
2. Pick a character and start chatting. Replies stream in as they are generated.

Notes:

- Settings and AI chat history are stored only in your browser's `localStorage`. Requests go directly from the browser to the URL you set, so this app never sees your key. Anyone with access to that browser profile can read the key, so use a key with a spending limit.
- The provider must allow browser (CORS) requests. OpenAI and OpenRouter do. For Ollama, start it with `OLLAMA_ORIGINS=*` (or your app's origin). For anything else, use the proxy below.
- AI chats are private to you and are not sent to the group chat or to Firebase. **Clear chat** wipes the history for the open character.
- The last 20 messages are sent as context with every request.

### AI servers without CORS (local or LAN)

If the browser console says the request was "blocked by CORS policy", the AI server is not allowing browser requests. The dev and preview servers can proxy it so the browser only talks to the app's own origin:

```sh
AI_PROXY_TARGET=http://192.168.1.50:8080 npm run dev
```

You can also put `AI_PROXY_TARGET=...` in `.env.local`. The terminal prints `AI proxy: /ai-proxy -> <target>` when it is active. Then set the **API base URL** in the app to `/ai-proxy/v1` (keep the key and model as usual) and press **Test connection**. Every request to `/ai-proxy/*` is forwarded to the target, streaming included, with the browser's `Origin` header removed. This proxy only exists in `npm run dev` and `npm run preview`; a deployed static site still needs an AI server that allows CORS.

Troubleshooting:

| Message in the app | Fix |
| --- | --- |
| Could not reach the AI server ... (CORS) | The base URL still points straight at the server. Use `/ai-proxy/v1`. |
| AI proxy is off | Restart `npm run dev` with `AI_PROXY_TARGET` set. Changing `.env.local` also needs a restart. |
| AI proxy could not reach ... ECONNREFUSED / ETIMEDOUT | The server is not listening on that host and port, or only on `127.0.0.1`. Bind it to `0.0.0.0` and check the firewall. |
| AI request failed (404) | The target or base URL path is wrong. `AI_PROXY_TARGET` should be just `http://host:port`, the base URL `/ai-proxy/v1`. |
| AI request failed (401 or 403) | Wrong or missing API key. |

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

Disclaimer
------------

This is an unofficial, non-commercial fan project. Persona 5, Persona 5 the Animation, their characters, names and artwork are trademarks and copyright of ATLUS, SEGA and their respective owners. This project is not affiliated with, sponsored or endorsed by them. The avatar images remain the property of their copyright owners and are used here for fan purposes only. Character bios in this repo are original summaries. AI replies are generated by the model you configure and do not represent the official characters or their creators. The MIT License covers this project's source code only, not any third party characters or artwork.

Thanks
------

*FDD Concept: Chat/Messaging Application* © 2017, Fernan de Dios. Released under the [MIT License].<br>

> [fernandedios.com](http://fernandedios.com) &nbsp;&middot;&nbsp;
> GitHub [@fernandedios](https://github.com/fernandedios) &nbsp;&middot;&nbsp;
> Twitter [@fernan_de_dios](https://twitter.com/fernan_de_dios)

[MIT License]: http://mit-license.org/
