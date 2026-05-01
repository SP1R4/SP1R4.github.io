// Renders the blog post list from posts.json with tag filtering.

let posts = [];
let activeFilter = null;

function formatDate(d) {
  const date = new Date(d + 'T00:00:00');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getAllTags() {
  const tags = new Set();
  posts.forEach(p => (p.tags || []).forEach(t => tags.add(t)));
  return [...tags].sort();
}

function renderFilterBar() {
  const bar = document.getElementById('filter-bar');
  bar.innerHTML = '';
  const tags = getAllTags();
  if (tags.length <= 1) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';

  const allBtn = document.createElement('button');
  allBtn.className = 'filter-pill' + (activeFilter === null ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => { activeFilter = null; renderFilterBar(); renderList(); });
  bar.appendChild(allBtn);

  tags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-pill' + (activeFilter === tag ? ' active' : '');
    btn.textContent = tag;
    btn.addEventListener('click', () => { activeFilter = tag; renderFilterBar(); renderList(); });
    bar.appendChild(btn);
  });
}

function renderList() {
  const list = document.getElementById('post-list');
  const countEl = document.getElementById('post-count');
  list.innerHTML = '';
  if (posts.length === 0) {
    list.innerHTML = '<div class="empty-state">No posts yet.</div>';
    countEl.textContent = '';
    return;
  }
  const sorted = [...posts]
    .filter(p => !activeFilter || (p.tags && p.tags.includes(activeFilter)))
    .sort((a, b) => b.date.localeCompare(a.date));

  countEl.textContent = sorted.length + ' post' + (sorted.length !== 1 ? 's' : '') + (activeFilter ? ' in "' + activeFilter + '"' : '');

  if (sorted.length === 0) {
    list.innerHTML = '<div class="empty-state">No posts in this category.</div>';
    return;
  }

  sorted.forEach((post, i) => {
    const el = document.createElement('a');
    el.className = 'post-card';
    el.href = post.html;
    el.style.setProperty('--i', i);

    const title = document.createElement('div');
    title.className = 'post-title';
    title.textContent = post.title;

    const desc = document.createElement('div');
    desc.className = 'post-desc';
    desc.textContent = post.description;

    const meta = document.createElement('div');
    meta.className = 'post-meta';
    const date = document.createElement('span');
    date.textContent = formatDate(post.date);
    meta.appendChild(date);
    if (post.tags) {
      post.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'post-tag';
        tag.textContent = t;
        meta.appendChild(tag);
      });
    }

    el.appendChild(title);
    el.appendChild(desc);
    el.appendChild(meta);
    list.appendChild(el);
  });
}

fetch('posts.json')
  .then(r => r.json())
  .then(data => {
    posts = data;
    renderFilterBar();
    renderList();
  });
