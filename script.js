document.addEventListener('DOMContentLoaded', () => {
    // تحديد عنصر القائمة باستخدام id
    const nav = document.getElementById('primary-navigation');
    // تحديد زر الإغلاق/الفتح
    const toggle = document.querySelector('.nav-toggle');
  
    // عند الضغط على زر الإغلاق/الفتح
    toggle.addEventListener('click', () => {
      // يضيف أو يزيل .open ويعيد الحالة الجديدة (true/false)
      const isOpen = nav.classList.toggle('open'); 
      // تحديث سمة aria-expanded للـ accessibility
      toggle.setAttribute('aria-expanded', String(isOpen)); 
    });
  
    // اختياري: إغلاق القائمة عند الضغط على رابط داخلها (تجربة مستخدم أفضل للموبايل)
    nav.addEventListener('click', (e) => {
      // التحقق مما إذا كان العنصر المضغوط هو وسم 'A' (رابط) وأن القائمة مفتوحة
      if (e.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });