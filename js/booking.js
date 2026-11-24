// logika halaman booking: step 1-3, slot waktu, validasi, simpan ke localStorage
// slot penuh disimulasikan dengan random (pakai seed sederhana biar konsisten per tanggal)

let stepAktif = 1;
let pilihan = {
  layanan: null,   // objek layanan
  stylist: null,   // objek stylist
  tanggal: null,   // string yyyy-mm-dd
  jam: null,       // string hh:mm
};

// ----- util slot "penuh" -----
// hash sederhana dari tanggal+jam, biar slot penuh gak berubah-ubah tiap reload
function hashSlot(tgl, jam) {
  let h = 0;
  const s = tgl + jam;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) % 997;
  }
  return h;
}

// sekitar 30% slot dianggap penuh (simulasi)
function slotPenuh(tgl, jam) {
  return hashSlot(tgl, jam) < 300;
}

// ----- render step 1: daftar layanan -----
function gambarPilihanLayanan() {
  const wrap = document.getElementById("pilihLayanan");
  wrap.innerHTML = "";
  LAYANAN.forEach(function (l) {
    const row = document.createElement("label");
    row.style.cssText =
      "display:flex; align-items:center; gap:14px; padding:14px; border:1.5px solid var(--border);" +
      "border-radius:12px; cursor:pointer; transition:all .15s;";
    row.innerHTML =
      '<img src="' + l.foto + '" style="width:58px; height:58px; object-fit:cover; border-radius:10px;" alt="">' +
      '<div style="flex:1;">' +
        '<div style="font-weight:700;">' + l.nama + "</div>" +
        '<div style="font-size:0.83rem; color:var(--abu);">⏱ ' + l.durasi + " menit · " + formatRupiah(l.harga) + "</div>" +
      "</div>" +
      '<input type="radio" name="layanan" value="' + l.id + '" style="width:auto;">';

    const radio = row.querySelector("input");
    // highlight kartu yang kepilih
    row.addEventListener("click", function () {
      pilihan.layanan = l;
      document.querySelectorAll("#pilihLayanan > label").forEach(function (r) {
        r.style.borderColor = "var(--border)";
        r.style.background = "transparent";
      });
      row.style.borderColor = "var(--kuning)";
      row.style.background = "rgba(245,185,66,0.08)";
      radio.checked = true;
      updateRingkasan();
    });

    // kalo datang dari halaman lain ?layanan=id langsung kepilih
    if (pilihan.layanan && pilihan.layanan.id === l.id) {
      row.style.borderColor = "var(--kuning)";
      row.style.background = "rgba(245,185,66,0.08)";
      radio.checked = true;
    }
    wrap.appendChild(row);
  });
}

// ----- render step 2: kartu stylist -----
function gambarPilihanStylist() {
  const wrap = document.getElementById("pilihStylist");
  wrap.innerHTML = "";
  STYLIST.forEach(function (s) {
    const kartu = document.createElement("div");
    kartu.style.cssText =
      "display:flex; align-items:center; gap:12px; padding:12px; border:1.5px solid var(--border);" +
      "border-radius:12px; cursor:pointer; transition:all .15s;";
    kartu.innerHTML =
      '<img src="' + s.foto + '" style="width:52px; height:52px; object-fit:cover; border-radius:50%;" alt="">' +
      '<div style="font-size:0.85rem;">' +
        '<div style="font-weight:700;">' + s.panggilan + "</div>" +
        '<div style="color:var(--abu);">' + s.role + " · ★" + s.rating.toFixed(1) + "</div>" +
      "</div>";

    kartu.addEventListener("click", function () {
      pilihan.stylist = s;
      document.querySelectorAll("#pilihStylist > div").forEach(function (k) {
        k.style.borderColor = "var(--border)";
        k.style.background = "transparent";
      });
      kartu.style.borderColor = "var(--kuning)";
      kartu.style.background = "rgba(245,185,66,0.08)";
      updateRingkasan();
    });

    if (pilihan.stylist && pilihan.stylist.id === s.id) {
      kartu.style.borderColor = "var(--kuning)";
      kartu.style.background = "rgba(245,185,66,0.08)";
    }
    wrap.appendChild(kartu);
  });
}

// ----- render slot waktu berdasar tanggal -----
function gambarSlot() {
  const wrap = document.getElementById("slotWrap");
  const infoHari = document.getElementById("infoHari");
  const tgl = pilihan.tanggal;

  if (!tgl) {
    wrap.innerHTML = '<p style="color:var(--abu); font-size:0.9rem;">Pilih tanggal dulu untuk melihat slot yang tersedia.</p>';
    return;
  }

  const d = new Date(tgl + "T00:00:00");
  const hari = d.getDay();

  // senin libur
  if (JAM_OPERASIONAL[hari].length === 0) {
    infoHari.textContent = NAMA_HARI[hari] + " — Rapih. libur ya, coba tanggal lain.";
    wrap.innerHTML = "";
    return;
  }

  infoHari.textContent =
    NAMA_HARI[hari] + ", " + d.getDate() + " " + NAMA_BULAN[d.getMonth()] + " " + d.getFullYear() +
    " — slot tersedia di bawah:";

  wrap.innerHTML = "";
  const grid = document.createElement("div");
  grid.className = "slot-grid";

  JAM_OPERASIONAL[hari].forEach(function (jam) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "slot";
    b.textContent = jam;

    if (slotPenuh(tgl, jam)) {
      b.classList.add("penuh");
      b.disabled = true;
      b.title = "Slot ini sudah penuh";
    } else {
      b.addEventListener("click", function () {
        pilihan.jam = jam;
        grid.querySelectorAll(".slot").forEach(function (s) {
          s.classList.remove("dipilih");
        });
        b.classList.add("dipilih");
        updateRingkasan();
      });
    }
    grid.appendChild(b);
  });

  wrap.appendChild(grid);
}

// ----- ringkasan pesanan -----
function updateRingkasan() {
  const isi = document.getElementById("isiRingkasan");
  const totalEl = document.getElementById("totalHarga");
  let total = 0;
  let html = "";

  if (pilihan.layanan) {
    total += pilihan.layanan.harga;
    html += baris("Layanan", pilihan.layanan.nama + " (" + formatRupiah(pilihan.layanan.harga) + ")");
  }
  if (pilihan.stylist) {
    html += baris("Kapster", pilihan.stylist.panggilan);
  }
  if (pilihan.tanggal) {
    const d = new Date(pilihan.tanggal + "T00:00:00");
    html += baris("Tanggal", NAMA_HARI[d.getDay()] + ", " + d.getDate() + " " + NAMA_BULAN[d.getMonth()]);
  }
  if (pilihan.jam) {
    html += baris("Jam", pilihan.jam + " WIB");
  }

  isi.innerHTML = html || '<p style="color:var(--abu); font-size:0.9rem;">Belum ada pilihan. Mulai dari step 1 ya.</p>';
  totalEl.textContent = formatRupiah(total);

  function baris(k, v) {
    return '<div class="ringkasan-item"><span>' + k + '</span><span class="nilai">' + v + "</span></div>";
  }
}

// ----- navigasi step -----
function pindahStep(step) {
  // validasi sebelum maju
  if (step > stepAktif) {
    if (stepAktif === 1 && !pilihan.layanan) {
      showToast("Pilih salah satu layanan dulu ya 🙏");
      return;
    }
    if (stepAktif === 2) {
      if (!pilihan.stylist) {
        showToast("Pilih kapsternya dulu 🙏");
        return;
      }
      if (!pilihan.jam) {
        showToast("Pilih slot jamnya dulu 🙏");
        return;
      }
    }
  }

  stepAktif = step;
  document.querySelectorAll(".step-isi").forEach(function (el, i) {
    el.style.display = i + 1 === step ? "block" : "none";
  });

  // update stepper
  document.querySelectorAll(".step").forEach(function (s) {
    const n = parseInt(s.getAttribute("data-step"));
    s.classList.toggle("aktif", n === step);
    s.classList.toggle("selesai", n < step);
  });

  document.getElementById("btnPrev").disabled = step === 1;
  document.getElementById("btnNext").style.display = step === 3 ? "none" : "inline-block";

  if (step === 2) gambarPilihanStylist();
  if (step === 3) updateRingkasan();
}

document.getElementById("btnPrev").addEventListener("click", function () {
  if (stepAktif > 1) pindahStep(stepAktif - 1);
});
document.getElementById("btnNext").addEventListener("click", function () {
  pindahStep(stepAktif + 1);
});

// ----- input tanggal -----
document.getElementById("tglBooking").addEventListener("change", function () {
  pilihan.tanggal = this.value || null;
  pilihan.jam = null;
  gambarSlot();
  updateRingkasan();
});

// ----- submit + validasi -----
document.getElementById("btnSubmit").addEventListener("click", function () {
  const nama = document.getElementById("nama").value.trim();
  const telp = document.getElementById("telp").value.trim();
  const setuju = document.getElementById("setuju").checked;
  let valid = true;

  function tandai(idErr, kondisi) {
    const el = document.getElementById(idErr);
    el.style.display = kondisi ? "block" : "none";
    if (kondisi) valid = false;
  }

  tandai("errNama", nama.length < 3);
  tandai("errTelp", !/^0\d{9,12}$/.test(telp.replace(/[\s-]/g, "")));
  tandai("errSetuju", !setuju);

  if (!valid) {
    showToast("Masih ada data yang kurang / salah 🙏");
    return;
  }

  // bikin kode reservasi: RPH + 4 digit acak
  const kode = "RPH-" + Math.floor(1000 + Math.random() * 9000);

  const booking = {
    kode: kode,
    nama: nama,
    telp: telp,
    catatan: document.getElementById("catatan").value.trim(),
    layanan: pilihan.layanan.nama,
    harga: pilihan.layanan.harga,
    durasi: pilihan.layanan.durasi,
    stylist: pilihan.stylist.panggilan,
    tanggal: pilihan.tanggal,
    jam: pilihan.jam,
    dibuat: new Date().toISOString(),
  };

  // simpen ke localStorage (data simulasi, tanpa backend)
  // riwayat juga disimpen biar halaman konfirmasi bisa liat beberapa booking
  localStorage.setItem("rapihBookingTerakhir", JSON.stringify(booking));
  const riwayat = JSON.parse(localStorage.getItem("rapihRiwayat") || "[]");
  riwayat.push(booking);
  localStorage.setItem("rapihRiwayat", JSON.stringify(riwayat));

  bukaModal("modalSukses");
});

// ----- init -----
// dukung query ?layanan=id dari halaman katalog / beranda
const dariUrl = new URLSearchParams(location.search).get("layanan");
if (dariUrl) {
  const l = LAYANAN.find(function (x) { return x.id === dariUrl; });
  if (l) pilihan.layanan = l;
}

// batas minimal tanggal = hari ini
const inputTgl = document.getElementById("tglBooking");
inputTgl.min = new Date().toISOString().split("T")[0];

gambarPilihanLayanan();
updateRingkasan();