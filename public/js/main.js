(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const esc = (str) => String(str ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  $('#year').textContent = new Date().getFullYear();

  async function fetchJSON(url, opts) {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request failed (${res.status})`);
    }
    return res.json();
  }

  const state = { projects: [], skills: 0, exp: 0 };
  function renderStats() {
    const done = state.projects.filter(p => p.status !== 'Planned').length;
    const items = [['1+', 'Years of Experience'], [String(done), 'Projects Completed'], [String(state.skills), 'Technical Skills']];
    $('#stats').innerHTML = items.map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('');
  }

  fetchJSON('/api/profile').then(p => {
    if (!p || !p.full_name) return;
    document.title = `${p.full_name} — ${p.role || 'Portfolio'}`;
    $('#heroTagline').textContent = p.tagline || '';
    $('#aboutText').textContent = p.about || '';
    if (p.location) $('#heroLoc').textContent = p.location;
    $('#availabilityText').textContent = p.available ? 'AVAILABLE FOR NEW OPPORTUNITIES' : 'NOT CURRENTLY AVAILABLE';
  }).catch(() => { $('#availabilityText').textContent = 'FULL-STACK DEVELOPER'; });

  const contacts = [
    ['✉', 'farizabdurahmanfakhri@gmail.com', 'mailto:farizabdurahmanfakhri@gmail.com'],
    ['◎', '@frz.a08 (Instagram)', 'https://instagram.com/frz.a08'],
    ['⌖', 'Indonesia', '#contact'],
  ];
  $('#contactLinks').innerHTML = contacts.map(([ic, t, h]) =>
    `<a href="${h}" ${h.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}><span class="ic">${ic}</span>${esc(t)}</a>`).join('');

  fetchJSON('/api/skills').then(({ skills }) => {
    state.skills = skills.length; renderStats();
    $('#skillsGroups').innerHTML = skills.map(s => `<span class="chip">${esc(s.label)}</span>`).join('');
  }).catch(console.error);

  fetchJSON('/api/experience').then(items => {
    $('#timeline').innerHTML = items.filter(e => e.category === 'Work').map(e => `
      <div class="tl"><div><b>${esc(e.title)}</b><small>${esc(e.organization)}</small></div>
      <span>${esc([e.start_date, e.end_date].filter(Boolean).join(' – '))}</span></div>`).join('');
  }).catch(console.error);

  fetchJSON('/api/projects').then(list => {
    state.projects = list.filter(p => p.status !== 'Planned');
    renderStats();
    $('#projectGrid').innerHTML = state.projects.map((p, i) => `
      <article class="proj" data-slug="${esc(p.slug)}">
       <div class="proj-cover" style="background:${p.cover_gradient || '#222'}">${p.cover_emoji || '💻'}<img src="/assets/projects/${esc(p.slug)}.png" alt="" onerror="this.remove()"></div>
        <div class="proj-row"><span class="n">${String(i + 1).padStart(2, '0')}</span>
          <div><b>${esc(p.title)}</b><small>${esc((p.tags || []).join(' · '))}</small></div>
          <span class="arr">→</span></div>
      </article>`).join('');document.querySelectorAll('.proj').forEach(c => c.addEventListener('click', () => {
  const p = state.projects.find(x => x.slug === c.dataset.slug);
  if (p && p.live_url) window.open(p.live_url, '_blank', 'noopener');
  else openModal(c.dataset.slug);
}));

  }).catch(() => { $('#projectGrid').innerHTML = '<p style="color:#9a9a9a">Projects could not be loaded. Please refresh the page.</p>'; });

  const backdrop = $('#modalBackdrop');
  function openModal(slug) {
    const p = state.projects.find(x => x.slug === slug); if (!p) return;
    $('#modalCover').style.background = p.cover_gradient || '#222';
    $('#modalCover').textContent = p.cover_emoji || '💻';
    $('#modalMeta').textContent = [p.role, p.year].filter(Boolean).join(' · ');
    $('#modalTitle').textContent = p.title;
    $('#modalDesc').textContent = p.description || p.summary || '';
    $('#modalTags').innerHTML = (p.tags || []).map(t => `<span class="project-tag">${esc(t)}</span>`).join('');
    const links = [];
    if (p.live_url) links.push(`<a href="${esc(p.live_url)}" target="_blank" rel="noopener">View live</a>`);
    if (p.repo_url) links.push(`<a href="${esc(p.repo_url)}" target="_blank" rel="noopener">View code</a>`);
    $('#modalLinks').innerHTML = links.join('');
    backdrop.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  function closeModal() { backdrop.classList.remove('open'); document.body.style.overflow = ''; }
  $('#modalClose').addEventListener('click', closeModal);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    const FORM_ENDPOINT = 'https://formspree.io/f/xqpaojjn';
  const form = $('#contactForm'), status = $('#formStatus'), btn = $('#submitBtn');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); status.textContent = ''; status.className = 'form-status';
    const name = $('#name').value.trim();
    const email = $('#email').value.trim();
    const message = $('#message').value.trim();
    if (!name || !email || !message) {
      status.textContent = 'Please fill in all fields.'; status.classList.add('err');
      return;
    }
    btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Message failed to send. Please try again.');
      status.textContent = 'Message sent. Thank you for reaching out!'; status.classList.add('ok'); form.reset();
    } catch (err) {
      status.textContent = err.message || 'Message failed to send. Please try again.'; status.classList.add('err');
    } finally { btn.disabled = false; btn.textContent = 'Send message →'; }
  });
})();
