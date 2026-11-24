// script yang dipakai di semua halaman: dark mode, menu hp, animasi reveal, modal
// dipanggil paling akhir sebelum </body>

document.addEventListener("DOMContentLoaded", function () {
  // ----- dark mode -----
  // simpen preferensi di localStorage biar nyala terus
  const btnMode = document.getElementById("btnMode");
  const icon = document.getElementById("iconMode");

  function pasangIcon(dark) {
    if (icon) icon.textContent = dark ? "☀️" : "🌙";
  }

  let modeGelap = localStorage.getItem("modeGelap") === "1";
  if (modeGelap) {
    document.body.classList.add("dark");
  }
  pasangIcon(modeGelap);

  if (btnMode) {
    btnMode.addEventListener("click", function () {
      modeGelap = !modeGelap;
      document.body.classList.toggle("dark", modeGelap);
      localStorage.setItem("modeGelap", modeGelap ? "1" : "0");
      pasangIcon(modeGelap);
    });
  }

  // ----- menu hamburger buat hp -----
  const btnHamburger = document.getElementById("btnHamburger");
  const navMenu = document.getElementById("navMenu");

  if (btnHamburger && navMenu) {
    btnHamburger.addEventListener("click", function () {
      navMenu.classList.toggle("buka");
    });

    // tutup menu lagi klik link
    navMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMenu.classList.remove("buka");
      });
    });
  }

  // ----- tandain nav yang aktif sesuai nama file -----
  const halamanIni = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(function (a) {
    const target = a.getAttribute("href");
    if (target === halamanIni) a.classList.add("aktif");
  });

  // ----- animasi reveal pas discroll -----
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("tampak");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      io.observe(el);
    });
  }

  // ----- modal umum (dipanggil dari mana aja) -----
  window.bukaModal = function (id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("buka");
  };

  window.tutupModal = function (id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("buka");
  };

  // tutup modal kalau klik overlay di luar box
  document.querySelectorAll(".modal-overlay").forEach(function (m) {
    m.addEventListener("click", function (e) {
      if (e.target === m) m.classList.remove("buka");
    });
  });

  document.querySelectorAll("[data-tutup]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      tutupModal(btn.getAttribute("data-tutup"));
    });
  });

  // ----- toast sederhana -----
  let toastTimer;
  window.showToast = function (pesan) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = pesan;
    t.classList.add("muncul");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("muncul");
    }, 2500);
  };
});