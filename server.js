const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

app.get('/api/servers', (req, res) => {
  res.json([
    { id: 'home', name: 'Home', icon: 'H', unread: 6 },
    { id: 'design', name: 'Design', icon: 'D', unread: 3 },
    { id: 'dev', name: 'Dev', icon: 'V', unread: 11 },
    { id: 'gaming', name: 'Gaming', icon: 'G', unread: 2 }
  ]);
});

app.get('/api/channels', (req, res) => {
  const channels = {
    home: [
      { id: 'welcome', name: 'welcome', unread: 1 },
      { id: 'announcements', name: 'announcements', unread: 0 },
      { id: 'general', name: 'general', unread: 4 },
      { id: 'voice-lounge', name: 'voice-lounge', unread: 0 }
    ],
    design: [
      { id: 'brand', name: 'brand', unread: 2 },
      { id: 'ux', name: 'ux', unread: 1 },
      { id: 'figma', name: 'figma', unread: 4 }
    ],
    dev: [
      { id: 'frontend', name: 'frontend', unread: 5 },
      { id: 'backend', name: 'backend', unread: 3 },
      { id: 'launch', name: 'launch', unread: 8 }
    ],
    gaming: [
      { id: 'matchmaking', name: 'matchmaking', unread: 1 },
      { id: 'team-chat', name: 'team-chat', unread: 2 },
      { id: 'clips', name: 'clips', unread: 0 }
    ]
  };

  const selected = req.query.server || 'home';
  res.json(channels[selected] || channels.home);
});

app.get('/api/messages', (req, res) => {
  const messages = {
    home: [
      { user: 'Nova', tag: 'admin', mood: 'online', text: 'Welcome to DoChat! We are building the best community experience in the browser.', time: '9:12 PM' },
      { user: 'Rae', tag: 'design', mood: 'online', text: 'The new UI is looking cleaner. We are going for a premium feel without overloading the layout.', time: '9:14 PM' },
      { user: 'Jin', tag: 'dev', mood: 'idle', text: 'I pushed the latest channel updates. Check the app flow in the preview.', time: '9:16 PM' }
    ],
    design: [
      { user: 'Ari', tag: 'brand', mood: 'online', text: 'DoChat needs strong identity. The colors should feel friendly, modern, and confident.', time: '8:45 PM' },
      { user: 'Rae', tag: 'design', mood: 'online', text: 'I am leaning into soft gradients and crisp typography for the landing page.', time: '8:48 PM' },
      { user: 'Nina', tag: 'ux', mood: 'idle', text: 'The onboarding flow should feel fast and exciting, almost instant.', time: '8:52 PM' }
    ],
    dev: [
      { user: 'Jin', tag: 'dev', mood: 'online', text: 'The server is ready. We are wiring the mock data and app states next.', time: '7:32 PM' },
      { user: 'Cora', tag: 'devops', mood: 'online', text: 'Deployment strategy is simple: static frontend plus API endpoints for demo data.', time: '7:35 PM' },
      { user: 'Luca', tag: 'lead', mood: 'idle', text: 'We are aiming for a clean MVP with a strong social-first experience.', time: '7:38 PM' }
    ],
    gaming: [
      { user: 'Bryn', tag: 'player', mood: 'online', text: 'The voice rooms are ready for testing tonight.', time: '9:02 PM' },
      { user: 'Tess', tag: 'community', mood: 'idle', text: 'Let us keep the vibe fun and welcoming for all new players.', time: '9:05 PM' },
      { user: 'Ike', tag: 'events', mood: 'online', text: 'Weekend challenge is going live. Theme is co-op strategy with custom badges.', time: '9:08 PM' }
    ]
  };

  const selected = req.query.channel || 'general';
  const data = messages[selected] || messages.home;
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`DoChat server is running on http://localhost:${PORT}`);
});
