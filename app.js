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

function openAuth(mode = 'login') {
  if (!modal) return;
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

  authTitle.textContent = mode === 'login' ? 'Welcome back' : 'Create your account';
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const isLogin = form.id === 'loginForm';
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const username = nameInput ? nameInput.value.trim() : (emailInput ? emailInput.value.split('@')[0] : 'DoChat User');

  if (username) {
    localStorage.setItem('dochatUser', username);
  }

  const loginButton = document.querySelector('.auth-toggle[data-mode="login"]');
  const signupButton = document.querySelector('.auth-toggle[data-mode="signup"]');

  if (loginButton) loginButton.textContent = isLogin ? 'Logged in' : 'Log in';
  if (signupButton) signupButton.textContent = isLogin ? 'Sign up' : 'Signed up';

  closeAuth();
  form.reset();
}

authButtons.forEach((button) => {
  button.addEventListener('click', () => openAuth(button.dataset.mode || 'login'));
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
  });
}

if (authForms.login) authForms.login.addEventListener('submit', handleAuthSubmit);
if (authForms.signup) authForms.signup.addEventListener('submit', handleAuthSubmit);

render();
