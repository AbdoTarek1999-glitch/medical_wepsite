document.addEventListener("DOMContentLoaded", () => {

  /*========== NAV ==========*/
  const nav = document.getElementById('primary-navigation');
  const toggle = document.querySelector('.nav-toggle');

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });


  /*========== DARK MODE ==========*/
  const themeToggle = document.getElementById("theme-toggle");

  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark");
    themeToggle.checked = true;
  }

  themeToggle?.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("darkMode",
      document.body.classList.contains("dark") ? "enabled" : "disabled"
    );
  });



  /*========== AI MOCK ==========*/
  const imgInput = document.getElementById("imgInput");
  const uploadedImg = document.getElementById("uploadedImg");
  const aiResults = document.getElementById("ai-results");
  const resultList = document.getElementById("resultList");
  const skinType = document.getElementById("skinType");
  const recommend = document.getElementById("recommend");

  imgInput?.addEventListener("change", () => {
    const file = imgInput.files[0];
    uploadedImg.src = URL.createObjectURL(file);
  });

  document.getElementById("scanBtn")?.addEventListener("click", () => {
    aiResults.classList.remove("hidden");
    resultList.innerHTML = "";

    const mockData = {
      wrinkles: 72,
      pores: 64,
      redness: 45,
      acne: 52,
      darkspots: 70,
    };

    for (let k in mockData) {
      let li = document.createElement("li");
      li.textContent = `${k} : ${mockData[k]}%`;
      resultList.appendChild(li);
    }

    skinType.textContent = "Combination";
    recommend.textContent = "Hydration treatment recommended";
  });



  /*========== CAMERA ==========*/
  const camera = document.getElementById("camera");
  const camBtn = document.getElementById("openCameraBtn");

  camBtn?.addEventListener("click", async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    camera.srcObject = stream;
  });

});
