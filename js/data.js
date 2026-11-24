// data dummy untuk seluruh halaman
// kalo mau nambah layanan / stylist tinggal tambah objek di sini

const LAYANAN = [
  {
    id: "potong",
    nama: "Potong Rambut Pria",
    kategori: "rambut",
    harga: 35000,
    durasi: 30,
    deskripsi: "Potong rambut sesuai request, sebelum mulai kapster kasih rekomendasi model yang cocok dulu.",
    foto: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=640&q=80",
  },
  {
    id: "potong-anak",
    nama: "Potong Rambut Anak",
    kategori: "rambut",
    harga: 25000,
    durasi: 30,
    deskripsi: "Khusus anak usia 4-12 tahun. Kapsternya sabar, jadi anak yang takut gunting tetap aman.",
    foto: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=640&q=80",
  },
  {
    id: "cuci-blow",
    nama: "Cuci & Blow",
    kategori: "rambut",
    harga: 30000,
    durasi: 25,
    deskripsi: "Cuci pakai shampoo + vitamin, diterusin blow biar rambut jadi volumenya.",
    foto: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=640&q=80",
  },
  {
    id: "coloring",
    nama: "Hair Coloring",
    kategori: "rambut",
    harga: 150000,
    durasi: 90,
    deskripsi: "Pewarnaan full atau highlight. Bisa konsultasi warna dulu gratis sebelum dipped.",
    foto: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=640&q=80",
  },
  {
    id: "smoothing",
    nama: "Smoothing / Keratin",
    kategori: "rambut",
    harga: 200000,
    durasi: 120,
    deskripsi: "Buat rambut mengembang yang mau lebih rapi. Tahan sampai 2-3 bulan tergantung perawatan.",
    foto: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f3de51a8e0d4.jpg",
  },
  {
    id: "shaving",
    nama: "Shaving & Beard Trim",
    kategori: "jenggot",
    harga: 25000,
    durasi: 20,
    deskripsi: "Cukur jenggot + rapiin bentuk, pakai hot towel biar kulit gak iritasi.",
    foto: "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c031c1dc8d25.jpg",
  },
  {
    id: "facial",
    nama: "Facial Pria",
    kategori: "perawatan",
    harga: 75000,
    durasi: 45,
    deskripsi: "Deep cleansing + masker. Cocok buat yang kulitnya sering kena debu motor.",
    foto: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=640&q=80",
  },
  {
    id: "hairspa",
    nama: "Hair Spa",
    kategori: "perawatan",
    harga: 65000,
    durasi: 40,
    deskripsi: "Massase kepala + creambath, pas banget buat ngilangin capek kerja.",
    foto: "https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?w=640&q=80",
  },
];

const STYLIST = [
  {
    id: "bang-reza",
    nama: "Reza Prakoso",
    panggilan: "Bang Reza",
    role: "Senior Barber",
    pengalaman: "8 tahun",
    rating: 4.9,
    spesialis: "Fade & pompadour",
    foto: "https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=480&q=80",
  },
  {
    id: "bang-dava",
    nama: "Dava Alfarez",
    panggilan: "Bang Dava",
    role: "Barber",
    pengalaman: "5 tahun",
    rating: 4.7,
    spesialis: "Undercut & beard trim",
    foto: "https://images.unsplash.com/photo-1615109398623-88346a601842?w=480&q=80",
  },
  {
    id: "mbak-sari",
    nama: "Sari Wulandari",
    panggilan: "Mbak Sari",
    role: "Hair Stylist",
    pengalaman: "6 tahun",
    rating: 4.8,
    spesialis: "Coloring & smoothing",
    foto: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=480&q=80",
  },
  {
    id: "mbak-nadia",
    nama: "Nadia Rahma",
    panggilan: "Mbak Nadia",
    role: "Beautician",
    pengalaman: "4 tahun",
    rating: 4.8,
    spesialis: "Facial & hair spa",
    foto: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=480&q=80",
  },
];

// slot jam operasional per hari (format 24 jam)
// hari pakai nomor dari getDay(): 0 = minggu, 1 = senin, dst
const JAM_OPERASIONAL = {
  1: [], // senin libur
  2: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  3: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  4: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
  5: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
  6: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
  0: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"],
};

const NAMA_HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const NAMA_BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

// helper format rupiah biar gak ngetik manual
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}