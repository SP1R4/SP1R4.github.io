// Renders the projects page from the GitHub API with a static fallback.

const LANG_COLORS = {
  Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
  Go: '#00ADD8', Rust: '#dea584', C: '#555555', 'C++': '#f34b7d',
  'C#': '#178600', Java: '#b07219', Ruby: '#701516', PHP: '#4F5D95',
  Shell: '#89e051', HTML: '#e34c26', CSS: '#563d7c', Lua: '#000080',
  Nix: '#7e7eff', Dart: '#00B4AB', Kotlin: '#A97BFF', Swift: '#F05138',
};

const EXCLUDE = ['SP1R4', 'noctis-linktree', 'sp1r4.github.io'];
const FEATURED = ['BackupHandler', 'PhantomTrap', 'Qsafe', 'hashcracker'];

const FALLBACK_REPOS = [
  { name: 'BackupHandler', description: 'Full-featured backup solution with local/SSH/S3/MySQL support, Tailscale VPN, AES-256 encryption, dedup, scheduling, and Telegram notifications', language: 'Python', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/BackupHandler', topics: ['backup', 'encryption', 'python'] },
  { name: 'PhantomTrap', description: 'High-interaction honeypot framework with behavioral fingerprinting, campaign detection, and real-time dashboard', language: 'Python', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/PhantomTrap', topics: ['honeypot', 'cybersecurity', 'python'] },
  { name: 'Qsafe', description: 'Post-quantum file encryption tool using Kyber1024 + AES-256-GCM', language: 'C', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/Qsafe', topics: ['cryptography', 'post-quantum', 'security'] },
  { name: 'hashcracker', description: 'Professional hash identification and cracking toolkit. Identifies 60+ hash types with confidence scoring, cracks via hashcat & John the Ripper.', language: 'Python', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/hashcracker', topics: ['cybersecurity', 'hash-cracking', 'python'] },
  { name: 'FundsForwarder', description: 'Ethereum funds forwarding tool — automatically routes incoming ETH/ERC-20 transactions to a target wallet', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/FundsForwarder', topics: ['blockchain', 'ethereum', 'web3'] },
  { name: 'Contract-Downloader', description: 'CLI tool to download Ethereum smart contract source code and bytecode from Etherscan', language: 'Python', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/Contract-Downloader', topics: ['ethereum', 'smart-contracts', 'python'] },
  { name: 'CMDR', description: 'Bash CLI tool to store, tag, categorize, and run shell commands with JSON-based storage', language: 'Shell', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/CMDR', topics: ['bash', 'cli', 'productivity'] },
  { name: 'AddressTrackerBot', description: 'Telegram bot that monitors Ethereum addresses and sends transaction notifications', language: 'Python', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/AddressTrackerBot', topics: ['blockchain', 'telegram-bot', 'python'] },
  { name: 'tailscale-setup', description: 'Automated Tailscale mesh VPN deployment toolkit with SSH key auth and AnyDesk for Linux and Windows', language: 'Shell', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/SP1R4/tailscale-setup', topics: ['tailscale', 'vpn', 'automation'] },
];

function buildCard(repo, i, featured) {
  const a = document.createElement('a');
  a.className = 'project-card';
  a.href = /^https:\/\/github\.com\//i.test(repo.html_url) ? repo.html_url : '#';
  a.target = '_blank';
  a.rel = 'noopener';
  a.style.setProperty('--i', i);

  const name = document.createElement('div');
  name.className = 'proj-name';
  name.innerHTML = `<svg viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
  const nameText = document.createElement('span');
  nameText.textContent = repo.name;
  name.appendChild(nameText);
  if (featured) {
    const badge = document.createElement('span');
    badge.className = 'featured-badge';
    badge.textContent = 'Featured';
    name.appendChild(badge);
  }

  const desc = document.createElement('div');
  desc.className = 'proj-desc';
  desc.textContent = repo.description || 'No description';

  const meta = document.createElement('div');
  meta.className = 'proj-meta';

  if (repo.language) {
    const lang = document.createElement('span');
    lang.className = 'proj-lang';
    const dot = document.createElement('span');
    dot.className = 'proj-lang-dot';
    dot.style.background = LANG_COLORS[repo.language] || '#888';
    const langName = document.createElement('span');
    langName.textContent = repo.language;
    lang.appendChild(dot);
    lang.appendChild(langName);
    meta.appendChild(lang);
  }

  if (repo.stargazers_count > 0) {
    const stars = document.createElement('span');
    stars.className = 'proj-stat';
    stars.innerHTML = `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const count = document.createElement('span');
    count.textContent = repo.stargazers_count;
    stars.appendChild(count);
    meta.appendChild(stars);
  }

  if (repo.forks_count > 0) {
    const forks = document.createElement('span');
    forks.className = 'proj-stat';
    forks.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><line x1="12" y1="12" x2="12" y2="15"/></svg>`;
    const count = document.createElement('span');
    count.textContent = repo.forks_count;
    forks.appendChild(count);
    meta.appendChild(forks);
  }

  if (repo.topics && repo.topics.length > 0) {
    repo.topics.slice(0, 3).forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'proj-tag';
      tag.textContent = t;
      meta.appendChild(tag);
    });
  }

  a.appendChild(name);
  a.appendChild(desc);
  a.appendChild(meta);
  return a;
}

function renderProjects(repos) {
  const featuredEl = document.getElementById('featured');
  const container = document.getElementById('projects');
  container.innerHTML = '';

  const allRepos = repos
    .filter(r => !r.fork && !r.private && !EXCLUDE.includes(r.name))
    .sort((a, b) => (b.stargazers_count - a.stargazers_count) || new Date(b.updated_at || 0) - new Date(a.updated_at || 0));

  if (allRepos.length === 0) {
    container.innerHTML = '<div class="loading">No public repositories found.</div>';
    return;
  }

  let fi = 0;
  FEATURED.forEach(name => {
    const repo = allRepos.find(r => r.name === name);
    if (repo) {
      featuredEl.appendChild(buildCard(repo, fi++, true));
    }
  });

  const remaining = allRepos.filter(r => !FEATURED.includes(r.name));
  remaining.forEach((repo, i) => {
    container.appendChild(buildCard(repo, i, false));
  });
}

fetch('https://api.github.com/users/SP1R4/repos?sort=updated&per_page=30')
  .then(r => {
    if (!r.ok) throw new Error('API error');
    return r.json();
  })
  .then(repos => renderProjects(repos))
  .catch(() => renderProjects(FALLBACK_REPOS));
