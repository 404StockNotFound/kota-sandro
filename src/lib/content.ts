export type Project = {
  short: string;
  name: string;
  color: string;
  live: boolean;
  desc: string;
  points: string[];
  stack: string;
  link?: string;
};

export const PROJECTS: Project[] = [
  {
    short: 'FP', name: 'FleetPulse', color: '#4C7FD9', live: true,
    desc: 'Order management + pantau armada live untuk tim logistik.',
    points: ['Booking dengan cek kapasitas', 'Status perjalanan + peta GPS live', 'Alarm ngebut, nyetir malam, jam nyetir'],
    stack: 'next.js · supabase · gps api',
  },
  {
    short: 'LK', name: 'Langkaloka', color: '#F2967A', live: true,
    desc: 'Marketplace dengan panel penjual dan Loka Feed.',
    points: ['Panel toko penjual', 'Pembayaran VA, QRIS, e-wallet', 'Pengiriman & cek resi'],
    stack: 'next.js · typescript · payment api',
    link: 'https://langkaloka.id',
  },
  {
    short: 'MM', name: 'MBD Messaging', color: '#6CC7B8', live: false,
    desc: 'Platform blast WhatsApp & email untuk kampanye perusahaan.',
    points: ['WhatsApp Business Platform resmi', 'Peran admin & operator', 'Keamanan data jadi prioritas'],
    stack: 'node.js · whatsapp api',
  },
  {
    short: 'UO', name: 'UMKM Order', color: '#F4C25B', live: false,
    desc: 'Pesan makanan, katering, laundry lewat WhatsApp.',
    points: ['Satu sistem untuk semua jenis toko', 'Bayar QRIS, transfer, atau tunai', 'Gampang dipakai semua kalangan'],
    stack: 'next.js · supabase',
  },
];

export type Skill = { name: string; short?: string; what: string; where: string; pump?: boolean };

export const SKILLS: Skill[] = [
  { name: 'Next.js', short: 'NEXT', what: 'Tampilan web & aplikasi', where: 'FleetPulse, Langkaloka', pump: true },
  { name: 'TypeScript', short: 'TS', what: 'Kode rapi, jarang error', where: 'semua proyek', pump: true },
  { name: 'Node.js', short: 'NODE', what: 'API, webhook, kirim pesan', where: 'MBD Messaging', pump: true },
  { name: 'Supabase', short: 'SUPA', what: 'Database & login yang aman', where: 'FleetPulse, UMKM Order', pump: true },
  { name: 'Integrasi', what: 'Payment, ekspedisi, GPS armada', where: 'Langkaloka, FleetPulse' },
  { name: 'WhatsApp API', what: 'Blast, notifikasi, pengingat', where: 'MBD Messaging' },
];
export type Milestone = { year: string; title: string; body: string; link?: { label: string; href: string } };

export const JOURNEY: Milestone[] = [
  {
    year: 'Des 2023',
    title: 'Bootcamp JavaScript — Hacktiv8 Indonesia',
    body: 'Titik awal aku serius ngoding. Empat bulan (Des 2023 – Mar 2024) belajar fundamental JavaScript & TypeScript, bikin web dari nol, sampai lulus dengan sertifikat.',
    link: { label: 'Lihat sertifikat', href: 'https://drive.google.com/file/d/1fC6x2FdwUQQnWVNxPMuoglytejE_x9_6/view' },
  },
  { year: 'Jun 2024', title: 'Operation Staff — PT Mandiri Trans Utama', body: 'Masuk tim operasional perusahaan trucking dan mulai bikin sistem internal untuk tim.' },
  { year: '[BLN THN]', title: 'Mulai bangun FleetPulse', body: 'Sistem order & pantau armada: booking dengan cek kapasitas, status perjalanan, peta GPS live, dan alarm keselamatan.' },
  { year: 'Feb 2026', title: 'Membangun Langkaloka', body: 'Marketplace dengan panel penjual dan Loka Feed — sekarang live di langkaloka.id, lagi ditambah pembayaran & cek resi.' },
  { year: 'Sep 2026', title: 'Product Developer — PT Melangkah Bersama Digital', body: 'Membangun dan mengembangkan semua produk MBD.' },
  { year: 'Okt 2026', title: 'Mulai bangun MBD Messaging', body: 'Platform blast WhatsApp & email untuk kampanye perusahaan, dengan keamanan data sebagai prioritas.' },
  { year: 'Nov 2026', title: 'Mulai bangun UMKM Order', body: 'Sistem order lewat WhatsApp untuk UMKM — kuliner, katering, laundry.' },
];
export const ABOUT = {
  headline: 'Aku bikin software yang beneran kepake di lapangan.',
  lead:
    'Halo, aku Sandro, Product Developer di PT Melangkah Bersama Digital. Sehari-hari aku juga kerja di operasional PT Mandiri Trans Utama, jadi aku tahu rasanya pakai sistem yang ribet. Makanya yang aku bangun harus simpel, aman, dan langsung kepake.',
  stats: [
    { value: '4', label: 'produk dibangun' },
    { value: '2', label: 'produk sudah live' },
    { value: '2+ thn', label: 'di operasional logistik' },
  ],
  highlights: [
    { icon: '🚚', title: 'Dari lapangan, buat lapangan', body: 'Kerja di operasional trucking sejak 2024. FleetPulse lahir dari masalah yang aku temui sendiri tiap hari.' },
    { icon: '🛠️', title: 'Dari nol sampai live', body: 'Di MBD aku pegang semua produk: rancang alur, ngoding, sampai rilis dan dipakai orang.' },
    { icon: '🔒', title: 'Aman & gampang dipakai', body: 'Data uang dan order dicek di server. Tampilannya dibikin jelas, biar semua kalangan bisa pakai.' },
  ],
  facts: [
    { label: 'Lokasi', value: 'Indonesia' },
    { label: 'Pendidikan', value: 'Bootcamp JavaScript, Hacktiv8' },
    { label: 'Status', value: 'Terbuka untuk proyek' },
  ],
};

export const SKILL_GROUPS: { title: string; color: string; items: string[] }[] = [
  { title: 'Frontend', color: '#4C7FD9', items: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'EJS', 'Zustand', 'React Three Fiber (3D)'] },
  { title: 'Backend & API', color: '#7CC28C', items: ['Node.js', 'REST API', 'Webhook', 'Otomasi terjadwal', 'Notifikasi real-time'] },
  { title: 'Database', color: '#6CC7B8', items: ['Supabase', 'PostgreSQL', 'Auth & login', 'Row Level Security', 'Desain skema data'] },
  { title: 'Integrasi', color: '#F2967A', items: ['Payment gateway (VA, QRIS, e-wallet)', 'API ekspedisi & cek resi', 'GPS armada (TrackSolid)', 'WhatsApp Business Platform', 'Email blast'] },
  { title: 'Keamanan', color: '#F07C8C', items: ['Validasi sisi server', 'Idempotensi webhook', 'Rate limiting', 'Otorisasi per endpoint', 'Anti double-request'] },
  { title: 'Deploy & Tools', color: '#A9A2E8', items: ['Vercel', 'Git & GitHub', 'Domain & DNS', 'cPanel'] },
  { title: 'Produk & Operasional', color: '#F4C25B', items: ['Analisis kebutuhan', 'Alur ramah semua kalangan', 'Operasional logistik', 'Ngoding bareng AI', '[Tambah skill lain]'] },
];

export const CONTACT = {
  waNumber: '6289525430685',         
  email: 'laksandror@gmail.com',         
  waText: 'Halo Sandro, aku lihat portfolio kamu dan mau ngobrol soal proyek.',
  socials: [
    { key: 'linkedin', label: 'LinkedIn', handle: 'Laksandro Ramadhanu', href: 'https://www.linkedin.com/in/laksandro-ramadhanu/', color: '#0A66C2' },
    { key: 'github', label: 'GitHub', handle: '404StockNotFound', href: 'https://github.com/404StockNotFound', color: '#1F2A3A' },
    { key: 'instagram', label: 'Instagram', handle: '@lilsxxdro', href: 'https://instagram.com/lilsxxdro', color: '#D9488B' },
  ],
};

export const waLink = (text = CONTACT.waText) =>
  `https://wa.me/${CONTACT.waNumber}?text=${encodeURIComponent(text)}`;