document.addEventListener('DOMContentLoaded', () => {

  /* ✅===== NAVIGATION TOGGLE =====✅ */
  const nav = document.getElementById('primary-navigation');
  const toggle = document.querySelector('.nav-toggle');
  
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open'); 
    toggle.setAttribute('aria-expanded', String(isOpen)); 
  });

  nav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });


  /* ✅===== DARK / LIGHT MODE =====✅ */
  const themeToggle = document.getElementById("theme-toggle");

  // load saved theme
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    if (themeToggle) themeToggle.checked = true;
  }

  // toggle theme
  themeToggle?.addEventListener("change", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("darkMode", "enabled");
    } else {
      localStorage.setItem("darkMode", "disabled");
    }
  });

});
