/* main.js */
document.addEventListener("DOMContentLoaded", () => {

  /* NAV toggle mobile */
  const nav = document.getElementById('primary-navigation');
  const navToggle = document.querySelector('.nav-toggle');
  navToggle?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    // show/hide menu for small screens by toggling style
    if (isOpen) nav.style.display = 'block'; else nav.style.display = '';
  });

  /* THEME toggle with localStorage */
  const themeToggle = document.getElementById('theme-toggle');
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark');
    if (themeToggle) themeToggle.checked = true;
  }
  themeToggle?.addEventListener('change', () => {
    const enabled = themeToggle.checked;
    document.body.classList.toggle('dark', enabled);
    localStorage.setItem('darkMode', enabled ? 'enabled' : 'disabled');
  });

  /* SCROLL REVEAL simple */
  const revealEls = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => obs.observe(el));


  /* NOTE: AUTH MODAL LOGIC HAS BEEN REMOVED SINCE HTML ELEMENTS ARE MISSING */
  /* AND SERVER.JS IS A SEPARATE BACKEND FILE. */


  /* -------- AI mock + camera + scanner (UPDATED IDS) -------- */
  const imgInput = document.getElementById('imgInput'); // file input
  const uploadedImg = document.getElementById('uploadedImg'); // img tag to display chosen image or snapshot
  const camera = document.getElementById('camera'); // video tag for camera stream
  const snap = document.getElementById('snap'); // canvas tag for snapshot
  const openCameraBtn = document.getElementById('openCameraBtn'); // Open/Close Camera button
  const scanBtn = document.getElementById('scanBtn'); // Analyze Skin button
  const scannerOverlay = document.getElementById('scannerOverlay'); // scanning animation overlay
  const aiResults = document.getElementById('ai-results'); // results container
  const resultList = document.getElementById('resultList'); // ul to hold analysis metrics
  const skinTypeEl = document.getElementById('skinType'); // span for skin type text
  const recommendEl = document.getElementById('recommend'); // p for recommendation text

  let stream=null;

  imgInput?.addEventListener('change', ()=>{
    const f = imgInput.files[0];
    if(!f) return;
    
    // Set the uploaded image as the source
    uploadedImg.src = URL.createObjectURL(f);
    uploadedImg.onload = ()=> { URL.revokeObjectURL(uploadedImg.src); }
    
    // Hide camera stream if an image is uploaded
    if(stream) { stream.getTracks().forEach(t=>t.stop()); stream=null; }
    camera.classList.add('hidden');
    openCameraBtn.textContent = 'Open/Close Camera'; // Reset button text
    uploadedImg.classList.remove('hidden');
    
    aiResults.classList.add('hidden');
  });

  openCameraBtn?.addEventListener('click', async ()=>{
    if(stream){ // if already running, stop and reset
      stream.getTracks().forEach(t=>t.stop()); stream=null; 
      camera.classList.add('hidden');
      uploadedImg.classList.remove('hidden');
      uploadedImg.src = '750x750bb.jpeg'; // Reset preview to default image
      openCameraBtn.textContent = 'Open/Close Camera';
      return;
    }
    
    try{
      // Request user-facing camera stream
      stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}, audio:false});
      camera.srcObject = stream;
      
      // Hide preview image and show camera
      uploadedImg.classList.add('hidden');
      camera.classList.remove('hidden');
      openCameraBtn.textContent = 'Close Camera';
      aiResults.classList.add('hidden');

    }catch(err){ 
      alert('لا يمكن الوصول للكاميرا: تأكد من أنك تسمح بالوصول في متصفحك.'); 
      console.error(err);
    }
  });

  function showScanner(){
    scannerOverlay.classList.remove('hidden');
    aiResults.classList.add('hidden');
  }
  function hideScanner(){ scannerOverlay.classList.add('hidden'); }

  // Mock AI analysis: produces 15 metrics + skin type + recommendation
  scanBtn?.addEventListener('click', async ()=>{
    // Check if an image is present (either uploaded or camera is active)
    let imagePresent = uploadedImg.src && uploadedImg.src !== '750x750bb.jpeg' && !uploadedImg.classList.contains('hidden');
    let videoPresent = camera && stream && !camera.classList.contains('hidden');
    
    // 1. Capture from video if camera is running
    if(videoPresent){
      // capture from video to canvas
      const c = snap;
      c.width = camera.videoWidth; c.height = camera.videoHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(camera, 0, 0, c.width, c.height);
      
      // Update the display image with the snapshot
      uploadedImg.src = c.toDataURL('image/jpeg');
      uploadedImg.classList.remove('hidden');
      camera.classList.add('hidden');
      
      // Stop the stream after taking a snapshot
      stream.getTracks().forEach(t=>t.stop()); stream=null;
      openCameraBtn.textContent = 'Open/Close Camera';
      
      imagePresent = true; // Image is now present
    }
    
    // 2. Final check for image
    if(!imagePresent){ 
        alert('من فضلك ارفع صورة أو افتح الكاميرا أولاً لأخذ لقطة.'); 
        return; 
    }

    // Show scanner animation
    showScanner();

    // simulate processing time (2.4s)
    await new Promise(r => setTimeout(r, 2400));

    // create mock results (15 items)
    const keys = [
      'التجاعيد','المسام','الاحمرار','البثور','البقع الداكنة',
      'الجفاف','الزيوت','المسامات الكبيرة','ترهل الجلد','خطوط التعبير',
      'ايضاحات اللون','ملمس الجلد','حساسية','نقص إشراق','مسام دقيقة'
    ];
    // random-ish scores but repeatable by time
    const seed = Math.floor(Date.now()/1000)%1000;
    resultList.innerHTML = '';
    keys.forEach((k,i)=>{
      // Generate a score between 8% and 95%
      const v = Math.max(8, Math.min(95, Math.abs(Math.round((Math.sin((seed+i)/7) * 50) + 50))));
      const li = document.createElement('li');
      li.innerHTML = `<span>${k}</span><strong>${v}%</strong>`;
      resultList.appendChild(li);
    });

    // skin type mock
    const types = ['عادية','دهنية','جافة','مختلطة','حساسة'];
    const type = types[(seed%types.length)];
    skinTypeEl.textContent = type;

    // recommendations simple
    const reco = {
      'دهنية':'استخدم منظف لطيف ومرطّب خالي من الزيوت',
      'جافة':'تركيز على مرطّبات قوية وحمّام زيوت خفيف',
      'مختلطة':'استعمل منتجات موجهة لكل منطقة (T-zone)',
      'حساسة':'تجنّب العطور والمواد القاسية، استشر الطبيب',
      'عادية':'حافظ على روتين بسيط مع الحماية من الشمس'
    };
    recommendEl.textContent = reco[type] || 'اتباع روتين يومي مناسب للبشرة';

    hideScanner();
    aiResults.classList.remove('hidden');

    // small flourish animation
    aiResults.classList.add('pulse');
    setTimeout(()=>aiResults.classList.remove('pulse'),700);
  });

  /* go to ai section */
  document.getElementById('scrollToAI')?.addEventListener('click', ()=> {
    document.getElementById('ai-skin').scrollIntoView({behavior:'smooth', block:'center'});
  });

  /* contact form basic */
  document.getElementById('contactForm')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('تم إرسال الرسالة — سنرد عليك قريبا');
    e.target.reset();
  });

});