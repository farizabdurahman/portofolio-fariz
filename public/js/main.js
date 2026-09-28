// public/js/main.js
(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $all = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------------- THEME TOGGLE ---------------- */
  const root = document.documentElement;
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) root.setAttribute('data-theme', savedTheme);

  $('#themeToggle').addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });

  /* ---------------- MOBILE NAV ---------------- */
  const navLinks = $('#navLinks');
  $('#navToggle').addEventListener('click', () => navLinks.classList.toggle('open'));
  $all('.nav-link').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

  /* ---------------- ACTIVE NAV LINK ON SCROLL ---------------- */
  const sections = $all('main section[id]');
  const navLinkMap = {};
  $all('.nav-link').forEach(l => { navLinkMap[l.getAttribute('href').slice(1)] = l; });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $all('.nav-link').forEach(l => l.classList.remove('active'));
        const link = navLinkMap[entry.target.id];
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(s => observer.observe(s));

  /* ---------------- HELPERS ---------------- */
  async function fetchJSON(url, opts) {
    const res = await fetch(url, opts);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Request gagal (${res.status})`);
    }
    return res.json();
  }

  function initials(name) {
    if (!name) return 'AF';
    return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }

  /* ---------------- LOAD PROFILE ---------------- */
  fetchJSON('/api/profile').then(profile => {
    if (!profile || !profile.full_name) return;

    document.title = `${profile.full_name} — ${profile.role || 'Portfolio'}`;
    $('#heroTagline').textContent = profile.tagline || '';
    $('#aboutText').textContent = profile.about || '';

    // Kalau belum ada foto asli (photo_url kosong) dan avatar belum berisi <img>,
    // tampilkan inisial sebagai placeholder. Kalau sudah ada foto di HTML, biarkan.
    const avatarEl = $('#avatarPlaceholder');
    if (!avatarEl.querySelector('img')) {
      avatarEl.textContent = initials(profile.full_name);
    }

    const pillText = $('#availabilityText');
    pillText.textContent = profile.available
      ? `Terbuka untuk peluang baru${profile.role ? ' · ' + profile.role : ''}`
      : `Sedang tidak available${profile.role ? ' · ' + profile.role : ''}`;
    if (!profile.available) $('#availabilityPill .status-dot').style.background = 'var(--accent-2)';

    const facts = [];
    if (profile.role) facts.push(['Peran', profile.role]);
    if (profile.location) facts.push(['Lokasi', profile.location]);
    facts.push(['Fokus', 'Full-stack & QA mindset']);
    $('#quickFacts').innerHTML = facts.map(([label, val]) => `
      <div class="quickfact">
        <span class="quickfact-value">${escapeHTML(val)}</span>
        <span class="quickfact-label">${escapeHTML(label)}</span>
      </div>
    `).join('');

    $('#factList').innerHTML = `
      <li><span>💼</span><div><strong>Peran saat ini</strong>${escapeHTML(profile.role || '—')}</div></li>
      <li><span>📍</span><div><strong>Lokasi</strong>${escapeHTML(profile.location || '—')}</div></li>
      <li><span>🧭</span><div><strong>Fokus kerja</strong>Full-stack development &amp; quality assurance</div></li>
    `;

    // Kontak
    const contactLinks = [];
    if (profile.email_public !== false) {
      // email selalu ditampilkan; diambil dari endpoint /api/profile jika ada, fallback statis
    }
    renderContactLinks();
  }).catch(err => {
    console.error('Gagal memuat profil:', err);
    $('#availabilityText').textContent = 'Full-Stack Developer';
  });

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  /* ---------------- CONTACT LINKS (statis, data pribadi) ---------------- */
  function renderContactLinks() {
    const items = [
      {
        label: 'Email',
        value: 'farizabdurahmanfakhri@gmail.com',
        href: 'mailto:farizabdurahmanfakhri@gmail.com',
        icon: '✉️'
      },
      {
        label: 'Instagram',
        value: '@frz.a08',
        href: 'https://instagram.com/frz.a08',
        icon: '📷'
      }
    ];
    $('#contactLinks').innerHTML = items.map(it => `
      <a class="contact-link-item" href="${it.href}" target="_blank" rel="noopener">
        <span class="contact-link-icon">${it.icon}</span>
        <span class="contact-link-text"><strong>${it.label}</strong><span>${it.value}</span></span>
      </a>
    `).join('');
  }

  /* ---------------- SKILLS ---------------- */
  fetchJSON('/api/skills').then(({ grouped }) => {
    const order = ['Frontend', 'Backend', 'Database', 'Tools'];
    const cats = Object.keys(grouped).sort((a, b) => order.indexOf(a) - order.indexOf(b));
    $('#skillsGroups').innerHTML = cats.map(cat => `
      <div class="skill-group">
        <span class="skill-group-label">${escapeHTML(cat)}</span>
        <div class="skill-chips">
          ${grouped[cat].map(s => `<span class="skill-chip">${s.icon || ''} ${escapeHTML(s.label)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }).catch(err => console.error('Gagal memuat skills:', err));

  /* ---------------- PROJECTS ---------------- */
  let allProjects = [];
  let activeTag = 'Semua';

  fetchJSON('/api/projects').then(projects => {
    allProjects = projects;
    const tagSet = new Set();
    projects.forEach(p => p.tags.forEach(t => tagSet.add(t)));
    const tags = ['Semua', ...Array.from(tagSet)];

    $('#tagFilters').innerHTML = tags.map(t => `
      <button class="tag-filter-btn ${t === activeTag ? 'active' : ''}" data-tag="${escapeHTML(t)}">${escapeHTML(t)}</button>
    `).join('');

    $all('.tag-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeTag = btn.dataset.tag;
        $all('.tag-filter-btn').forEach(b => b.classList.toggle('active', b === btn));
        renderProjects();
      });
    });

    renderProjects();
  }).catch(err => {
    console.error('Gagal memuat proyek:', err);
    $('#projectGrid').innerHTML = `<p style="color:var(--text-dim)">Proyek belum bisa dimuat. Coba refresh halaman.</p>`;
  });

  function renderProjects() {
    const list = activeTag === 'Semua' ? allProjects : allProjects.filter(p => p.tags.includes(activeTag));
    $('#projectGrid').innerHTML = list.map(p => `
      <article class="project-card" data-slug="${p.slug}">
        <div class="project-cover" style="background:${p.cover_gradient || 'var(--accent-grad)'}">${p.cover_emoji || '💻'}</div>
        <div class="project-body">
          <span class="project-status">${escapeHTML(p.status || 'Completed')}</span>
          <h3>${escapeHTML(p.title)}</h3>
          <p class="project-summary">${escapeHTML(p.summary || '')}</p>
          <div class="project-tags">${p.tags.map(t => `<span class="project-tag">${escapeHTML(t)}</span>`).join('')}</div>
        </div>
      </article>
    `).join('');

    $all('.project-card').forEach(card => {
      card.addEventListener('click', () => openProjectModal(card.dataset.slug));
    });
  }

  /* ---------------- PROJECT MODAL ---------------- */
  const modalBackdrop = $('#modalBackdrop');

  function openProjectModal(slug) {
    const p = allProjects.find(x => x.slug === slug);
    if (!p) return;

    $('#modalCover').style.background = p.cover_gradient || 'var(--accent-grad)';
    $('#modalCover').textContent = p.cover_emoji || '💻';
    $('#modalMeta').textContent = [p.role, p.year].filter(Boolean).join(' · ');
    $('#modalTitle').textContent = p.title;
    $('#modalDesc').textContent = p.description || p.summary || '';
    $('#modalTags').innerHTML = p.tags.map(t => `<span class="project-tag">${escapeHTML(t)}</span>`).join('');

    const links = [];
    if (p.live_url) links.push(`<a href="${p.live_url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Lihat live</a>`);
    if (p.repo_url) links.push(`<a href="${p.repo_url}" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">Lihat kode</a>`);
    if (!links.length) links.push(`<span style="font-size:13px;color:var(--text-faint)">Tautan belum ditambahkan — bisa diedit di server/seed.js</span>`);
    $('#modalLinks').innerHTML = links.join('');

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
  $('#modalClose').addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------------- EXPERIENCE TIMELINE ---------------- */
  fetchJSON('/api/experience').then(items => {
    $('#timeline').innerHTML = items.map(e => {
      const dateStr = [e.start_date, e.end_date].filter(Boolean).join(' – ') || '—';
      return `
        <div class="timeline-item">
          <span class="timeline-dot"></span>
          <div class="timeline-card">
            <div class="timeline-top">
              <span class="timeline-badge ${e.category}">${escapeHTML(e.category || 'Work')}</span>
              <span class="timeline-date">${escapeHTML(dateStr)}</span>
            </div>
            <h3>${escapeHTML(e.title)}</h3>
            <span class="timeline-org">${escapeHTML(e.organization)}${e.location ? ' · ' + escapeHTML(e.location) : ''}</span>
            <p class="timeline-desc">${escapeHTML(e.description || '')}</p>
          </div>
        </div>
      `;
    }).join('');
  }).catch(err => console.error('Gagal memuat pengalaman:', err));

  /* ---------------- CONTACT FORM ---------------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const submitBtn = $('#submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    const payload = {
      name: $('#name').value.trim(),
      email: $('#email').value.trim(),
      message: $('#message').value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim…';

    try {
      await fetchJSON('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      status.textContent = 'Pesan terkirim. Terima kasih sudah menghubungi!';
      status.classList.add('ok');
      form.reset();
    } catch (err) {
      status.textContent = err.message || 'Pesan gagal terkirim. Coba lagi.';
      status.classList.add('err');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Kirim pesan';
    }
  });
})();
