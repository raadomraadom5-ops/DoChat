const mockServers = [
  { id: 'home', name: 'Home', icon: 'H', unread: 6 },
  { id: 'design', name: 'Design', icon: 'D', unread: 3 },
  { id: 'dev', name: 'Dev', icon: 'V', unread: 11 },
  { id: 'gaming', name: 'Gaming', icon: 'G', unread: 2 }
];

const mockMembers = [
  { name: 'Nova', status: 'online' },
  { name: 'Rae', status: 'online' },
  { name: 'Jin', status: 'idle' },
  { name: 'Ari', status: 'online' },
  { name: 'Tess', status: 'offline' },
  { name: 'Luca', status: 'online' }
];

const state = {
  selectedServer: 'home',
  selectedChannel: 'general',
  channels: []
};

const modal = document.getElementById('authModal');
const authTitle = document.getElementById('authTitle');
const authTabs = document.querySelectorAll('.auth-tab');
const authForms = {
  login: document.getElementById('loginForm'),
  signup: document.getElementById('signupForm')
};
const authButtons = document.querySelectorAll('.auth-toggle');
const closeButton = document.querySelector('.close-modal');

function formatCompactNumber(value) {
  if (value >= 1000000) {
    const formatted = (value / 1000000).toFixed(value >= 10000000 ? 0 : 1).replace(/\.0$/, '');
    return `${formatted}M+`;
  }

  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\.0$/, '');
    return `${formatted}k+`;
  }

  return `${Math.max(1, value)}+`;
}

function getStoredUserName() {
  return localStorage.getItem('dochatUser') || '';
}

function setSessionUser(username) {
  localStorage.setItem('dochatUser', username);
  localStorage.setItem('dochatLoggedIn', 'true');
}

function isLoggedIn() {
  return Boolean(localStorage.getItem('dochatLoggedIn') || getStoredUserName());
}

function updateAuthButtons() {
  const user = getStoredUserName();
  const buttons = document.querySelectorAll('.auth-toggle');

  buttons.forEach((button) => {
    const mode = button.dataset.mode || 'login';
    if (user) {
      button.textContent = mode === 'login' ? 'Open app' : 'Continue';
      button.setAttribute('data-logged-in', 'true');
    } else {
      button.textContent = mode === 'login' ? 'Log in' : 'Sign up';
      button.removeAttribute('data-logged-in');
    }
  });
}

function getOnlineMemberCount() {
  const stored = Number(localStorage.getItem('dochatOnlineMembers') || 0);
  const baseCount = mockMembers.filter((member) => member.status !== 'offline').length;
  const userBoost = getStoredUserName() ? 1 : 0;

  return stored > 0 ? stored : baseCount + userBoost;
}

function updateLandingStats() {
  const activeRoomsEl = document.getElementById('activeRoomsStat');
  const messagesSentEl = document.getElementById('messagesSentStat');
  const communityAccessEl = document.getElementById('communityAccessStat');

  if (!activeRoomsEl && !messagesSentEl && !communityAccessEl) return;

  const userName = getStoredUserName();
  const storedRoomNames = JSON.parse(localStorage.getItem('dochatRooms') || '[]');
  const roomCount = Array.isArray(storedRoomNames) && storedRoomNames.length ? storedRoomNames.length : mockServers.length;
  const createdRooms = Number(localStorage.getItem('dochatCreatedRooms') || roomCount);
  const onlineMembers = getOnlineMemberCount();
  const activeRooms = Math.max(roomCount + (userName ? 2 : 0), createdRooms + (userName ? 2 : 0), 10);
  const messageValue = Math.max(Number(localStorage.getItem('dochatMessagesSent') || 1200000), 1200000);

  if (activeRoomsEl) {
    activeRoomsEl.textContent = formatCompactNumber(activeRooms);
  }

  if (messagesSentEl) {
    messagesSentEl.textContent = formatCompactNumber(userName ? messageValue + 4200 : messageValue);
  }

  if (communityAccessEl) {
    communityAccessEl.textContent = userName ? `${Math.max(onlineMembers, 1)} online` : '24/7';
  }
}

function openAuth(mode = 'login') {
  if (!modal) return;
  if (isLoggedIn()) {
    window.location.href = './app/';
    return;
  }

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  setAuthMode(mode);
}

function closeAuth() {
  if (!modal) return;
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

function setAuthMode(mode) {
  authTabs.forEach((tab) => {
    const isActive = tab.dataset.authTab === mode;
    tab.classList.toggle('active', isActive);
  });

  Object.entries(authForms).forEach(([key, form]) => {
    const isActive = key === mode;
    form.classList.toggle('active', isActive);
  });

  if (authTitle) {
    authTitle.textContent = mode === 'login' ? 'Welcome back' : 'Create your account';
  }
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const isLogin = form.id === 'loginForm';
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const username = nameInput ? nameInput.value.trim() : (emailInput ? emailInput.value.split('@')[0] : 'DoChat User');

  if (!username) return;

  setSessionUser(username);
  localStorage.setItem('dochatOnlineMembers', String(getOnlineMemberCount() + 1));
  localStorage.setItem('dochatCreatedRooms', String(Math.max(4, Number(localStorage.getItem('dochatCreatedRooms') || 4) + (isLogin ? 0 : 1))));

  updateAuthButtons();
  updateLandingStats();
  closeAuth();
  form.reset();

  window.location.href = './app/';
}

authButtons.forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.loggedIn === 'true') {
      window.location.href = './app/';
      return;
    }
    openAuth(button.dataset.mode || 'login');
  });
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab));
});

if (closeButton) {
  closeButton.addEventListener('click', closeAuth);
}

if (modal) {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeAuth();
  });
}

const serverList = document.getElementById('serverList');
const channelList = document.getElementById('channelList');
const messagesEl = document.getElementById('messages');
const activeChannel = document.getElementById('activeChannel');
const memberList = document.getElementById('memberList');
const composerForm = document.getElementById('composerForm');
const messageInput = document.getElementById('messageInput');

function syncRoomAndMessageCounts() {
  const savedRooms = JSON.parse(localStorage.getItem('dochatRooms') || '[]');
  const currentRooms = Array.isArray(savedRooms) && savedRooms.length ? savedRooms : mockServers.map((server) => server.name);
  localStorage.setItem('dochatRooms', JSON.stringify(currentRooms));

  if (!localStorage.getItem('dochatMessagesSent')) {
    localStorage.setItem('dochatMessagesSent', '1200000');
  }

  if (!localStorage.getItem('dochatCreatedRooms')) {
    localStorage.setItem('dochatCreatedRooms', String(currentRooms.length));
  }
}

function renderServers() {
  if (!serverList) return;

  serverList.innerHTML = mockServers
    .map(
      (server) => `
        <button class="server-badge ${server.id === state.selectedServer ? 'active' : ''}" data-server="${server.id}">
          <span>${server.icon}</span>
          ${server.unread > 0 ? `<i>${server.unread}</i>` : ''}
        </button>
      `
    )
    .join('');

  serverList.querySelectorAll('.server-badge').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedServer = button.dataset.server;
      state.selectedChannel = getDefaultChannelForServer(state.selectedServer);
      render();
    });
  });
}

function getDefaultChannelForServer(serverId) {
  const map = {
    home: 'general',
    design: 'brand',
    dev: 'frontend',
    gaming: 'team-chat'
  };

  return map[serverId] || 'general';
}

function renderChannels() {
  if (!channelList) return;

  const channels = state.channels.length ? state.channels : [{ id: 'general', name: 'general', unread: 0 }];

  channelList.innerHTML = channels
    .map(
      (channel) => `
        <button class="channel-item ${channel.id === state.selectedChannel ? 'selected' : ''}" data-channel="${channel.id}">
          <span># ${channel.name}</span>
          ${channel.unread ? `<em>${channel.unread}</em>` : ''}
        </button>
      `
    )
    .join('');

  channelList.querySelectorAll('.channel-item').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedChannel = button.dataset.channel;
      renderMessages();
      renderChannels();
    });
  });
}

function renderMembers() {
  if (!memberList) return;

  memberList.innerHTML = mockMembers
    .map(
      (member) => `
        <div class="member-item">
          <div class="member-avatar">${member.name.charAt(0)}</div>
          <div class="member-meta">
            <strong>${member.name}</strong>
            <span class="status ${member.status}">${member.status}</span>
          </div>
        </div>
      `
    )
    .join('');
}

function renderMessages() {
  if (!messagesEl || !activeChannel) return;

  activeChannel.textContent = state.selectedChannel;

  fetch(`/api/messages?channel=${state.selectedChannel}`)
    .then((res) => res.json())
    .then((messages) => {
      messagesEl.innerHTML = messages
        .map(
          (message) => `
            <article class="message-item">
              <div class="message-avatar ${message.tag || 'user'}">${message.user.charAt(0)}</div>
              <div class="message-content">
                <div class="message-header">
                  <strong>${message.user}</strong>
                  <span>${message.tag}</span>
                  <time>${message.time}</time>
                </div>
                <p>${message.text}</p>
              </div>
            </article>
          `
        )
        .join('');
    })
    .catch(() => {
      messagesEl.innerHTML = '<p class="fallback">No messages yet.</p>';
    });
}

function render() {
  renderServers();
  updateLandingStats();

  if (!channelList) return;

  fetch(`/api/channels?server=${state.selectedServer}`)
    .then((res) => res.json())
    .then((channels) => {
      state.channels = channels;
      renderChannels();
      const channelExists = channels.some((channel) => channel.id === state.selectedChannel);
      if (!channelExists) {
        state.selectedChannel = channels[0]?.id || 'general';
      }
      renderMessages();
    });

  renderMembers();
}

if (composerForm) {
  composerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = messageInput.value.trim();

    if (!text) return;

    const username = localStorage.getItem('dochatUser') || 'You';
    const existingTotal = Number(localStorage.getItem('dochatMessagesSent') || 1200000);
    localStorage.setItem('dochatMessagesSent', String(existingTotal + 1));
    localStorage.setItem('dochatOnlineMembers', String(Math.max(getOnlineMemberCount(), 1)));

    const html = `
      <article class="message-item outgoing">
        <div class="message-avatar user">${username.charAt(0).toUpperCase()}</div>
        <div class="message-content">
          <div class="message-header">
            <strong>${username}</strong>
            <span>member</span>
            <time>now</time>
          </div>
          <p>${text}</p>
        </div>
      </article>
    `;

    messagesEl.insertAdjacentHTML('beforeend', html);
    messageInput.value = '';
    messagesEl.scrollTop = messagesEl.scrollHeight;
    updateLandingStats();
  });
}

if (authForms.login) authForms.login.addEventListener('submit', handleAuthSubmit);
if (authForms.signup) authForms.signup.addEventListener('submit', handleAuthSubmit);

syncRoomAndMessageCounts();
updateAuthButtons();
updateLandingStats();

if (window.location.pathname.includes('/app/') || window.location.pathname.endsWith('/app/') || window.location.pathname.endsWith('/app') || window.location.pathname.endsWith('/app/index.html')) {
  if (!isLoggedIn()) {
    window.location.href = '../index.html';
  }
}

render();
