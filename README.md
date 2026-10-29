# DoChat

DoChat is an open-source, Discord-inspired chat app prototype. It is designed as a web experience that feels social, polished, and premium while staying simple enough to extend for a real product.

## Overview

This project includes:
- a landing page with branding and product positioning
- a Discord-style app shell for channels, messages, and member activity
- a lightweight Express server to serve the frontend and mock data APIs
- a clean structure that can be expanded into a full-stack React/Node product later

## Features

- Discord-inspired server and channel layout
- message feed and member sidebar
- premium-style UI moments for a social chat experience
- responsive layout for desktop and smaller screens
- mock API routes for server, channel, and message data

## Project Structure

```text
DoChat/
├── public/
│   ├── app.html
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── .gitignore
├── package.json
├── README.md
├── server.js
└──
```

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start
```

3. Open the app in the browser:

- Landing page: `http://localhost:3000/`
- App demo: `http://localhost:3000/app`

## Roadmap

- [ ] Add authentication and user profiles
- [ ] Support real-time messaging with WebSockets
- [ ] Add voice and video room components
- [ ] Create a React frontend for a scalable architecture
- [ ] Add persistent storage with a database
- [ ] Add premium plan toggles and feature gating

## Notes

This project is intentionally built as a concept app inspired by social chat products. It is designed to be original, flexible, and easy to customize for your own community product.

## License

MIT
