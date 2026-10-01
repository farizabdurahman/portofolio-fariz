const db = require('./db');

db.exec('DELETE FROM profile');
db.exec('DELETE FROM skills');
db.exec('DELETE FROM projects');
db.exec('DELETE FROM experience');

db.prepare(`
  INSERT INTO profile (id, full_name, nick_name, role, tagline, about, photo_url, resume_url, location, available)
  VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  'Fariz Abdurahman Fakhri',
  'Ais',
  'Full-Stack Developer',
  'Building digital products from the server side all the way to the users screen.',
  'Hi, I’m Fariz—or Ais. I’m a full-stack developer who loves turning ideas into end-to-end web applications, handling everything from database design and backend logic to user-friendly interfaces. I’m also active in Quality Assurance, so I’m used to looking at code not just in terms of functionality, but also considering how it might break—all to ensure a more robust final product.',
  null,
  null,
  'Indonesia',
  1
);

const skills = [
  ['HTML5', 'Frontend', 'Advanced', '🧱'],
  ['CSS3', 'Frontend', 'Advanced', '🎨'],
  ['JavaScript', 'Frontend', 'Advanced', '⚡'],
  ['React', 'Frontend', 'Intermediate', '⚛️'],
  ['Tailwind CSS', 'Frontend', 'Intermediate', '💨'],
  ['Node.js', 'Backend', 'Advanced', '🟢'],
  ['Express.js', 'Backend', 'Advanced', '🚂'],
  ['REST API', 'Backend', 'Advanced', '🔌'],
  ['Authentication (JWT)', 'Backend', 'Intermediate', '🔐'],
  ['SQL', 'Database', 'Intermediate', '🗄️'],
  ['SQLite', 'Database', 'Intermediate', '📦'],
  ['MongoDB', 'Database', 'Intermediate', '🍃'],
  ['Git & GitHub', 'Tools', 'Advanced', '🐙'],
  ['Postman', 'Tools', 'Advanced', '📮'],
  ['Manual & QA Testing', 'Tools', 'Advanced', '🧪'],
  ['Linux / Troubleshooting', 'Tools', 'Advanced', '🐧'],
];
const insertSkill = db.prepare(`
  INSERT INTO skills (label, category, level, icon, sort_order) VALUES (?, ?, ?, ?, ?)
`);
skills.forEach((s, i) => insertSkill.run(s[0], s[1], s[2], s[3], i));

const projects = [
  {
    title: 'To Do List App',
    slug: 'to-do-list-app',
    summary: 'Aplikasi manajemen tugas harian dengan CRUD penuh.',
    description: 'Aplikasi To-Do List untuk mengelola tugas harian: tambah, edit, tandai selesai, dan hapus tugas. Dibangun sebagai latihan penerapan CRUD end-to-end antara frontend dan backend, lengkap dengan penyimpanan data yang persisten.',
    cover_emoji: '✅',
    cover_gradient: 'linear-gradient(135deg,#6366f1,#a855f7)',
    tags: 'JavaScript,Node.js,Express,REST API',
    role: 'Full-Stack Developer',
    year: '2026',
    status: 'Completed',
    live_url: 'https://todolist-eight-gamma-31.vercel.app/',
    repo_url: 'https://github.com/farizabdurahman/todolist.git',
    featured: 1,
  },
  {
    title: 'VideoBelajar App',
    slug: 'videobelajar-app',
    summary: 'Platform belajar berbasis video dengan struktur course.',
    description: 'Platform e-learning berbasis video (VideoBelajar App) yang memungkinkan pengguna menjelajahi materi belajar dalam bentuk course dan video terstruktur. Fokus pengembangan pada arsitektur backend yang rapi dan pengalaman pengguna yang intuitif di sisi frontend.',
    cover_emoji: '🎬',
    cover_gradient: 'linear-gradient(135deg,#ec4899,#f97316)',
    tags: 'JavaScript,Node.js,Express,Database,UI/UX',
    role: 'Full-Stack Developer',
    year: '2026',
    status: 'Completed',
    live_url: 'https://videobelajar-fe-1.vercel.app/',
    repo_url: 'https://github.com/farizabdurahman/videobelajar-app.git',
    featured: 1,
  },
  {
    title: 'OpenBoard',
    slug: 'openboard',
    summary: 'virtual whiteboard untuk kolaborasi real-time.',
    description: 'OpenBoard adalah aplikasi papan tulis virtual yang memungkinkan kolaborasi real-time antar pengguna. Pengguna dapat menggambar, menulis, dan berbagi ide secara interaktif, cocok untuk rapat online, pembelajaran jarak jauh, atau sesi brainstorming.',
    cover_emoji: '➕',
    cover_gradient: 'linear-gradient(135deg,#334155,#64748b)',
    tags: 'React,Node.js,Real-time,Collaboration',
    role: 'Full-Stack Developer',
    year: '',
    status: 'Completed',
    live_url: 'https://open-board-eight.vercel.app/',
    repo_url: 'https://github.com/grup-belajar/open-board.git',
    featured: 0,
  },
];
const insertProject = db.prepare(`
  INSERT INTO projects (title, slug, summary, description, cover_emoji, cover_gradient, tags, role, year, status, live_url, repo_url, featured, sort_order)
  VALUES (@title, @slug, @summary, @description, @cover_emoji, @cover_gradient, @tags, @role, @year, @status, @live_url, @repo_url, @featured, @sort_order)
`);
projects.forEach((p, i) => insertProject.run({ ...p, sort_order: i }));

const experience = [
  {
    title: 'Technical Support & IT Support',
    organization: 'PT. Grafika Tritunggal Lestari',
    location: 'Indonesia',
    type: 'Full-time',
    category: 'Work',
    start_date: 'September 1, 2023',
    end_date: '~18 months',
    description: 'Menangani troubleshooting perangkat dan jaringan, dukungan teknis untuk operasional kantor, serta pemeliharaan sistem IT sehari-hari selama kurang lebih 18 bulan.',
  },
  {
    title: 'QA HUB',
    organization: 'PT. Astro Technologies Indonesia',
    location: 'Indonesia',
    type: 'Full-time',
    category: 'Work',
    start_date: 'August 8, 2025',
    end_date: 'Present',
    description: 'Berperan dalam quality assurance produk digital: pengujian fitur, pelacakan bug, dan memastikan kualitas rilis sebelum sampai ke pengguna.',
  },
  {
    title: '(Tambahkan Award / Sertifikasi Kamu)',
    organization: 'Nama Penyelenggara',
    location: '',
    type: '',
    category: 'Award',
    start_date: '',
    end_date: '',
    description: 'Placeholder — edit di server/seed.js untuk menambahkan penghargaan, sertifikasi, atau pelatihan yang pernah kamu ikuti.',
  },
];
const insertExp = db.prepare(`
  INSERT INTO experience (title, organization, location, type, category, start_date, end_date, description, sort_order)
  VALUES (@title, @organization, @location, @type, @category, @start_date, @end_date, @description, @sort_order)
`);
experience.forEach((e, i) => insertExp.run({ ...e, sort_order: i }));

console.log('✅ Database berhasil di-seed dengan data Fariz Abdurahman Fakhri.');
console.log(`   Profile : 1`);
console.log(`   Skills  : ${skills.length}`);
console.log(`   Projects: ${projects.length}`);
console.log(`   Experience/Award entries: ${experience.length}`);
