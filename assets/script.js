// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href');
    if(id.length>1){
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});

// Header background on scroll
const hdr = document.querySelector('header');
if(hdr){
  const updateHdr = ()=>{
    const y = window.scrollY || document.documentElement.scrollTop;
    hdr.style.background = y>80 ? 'rgba(15,16,18,0.9)' : 'rgba(15,16,18,0.6)';
  };
  updateHdr();
  window.addEventListener('scroll', updateHdr, {passive:true});
}

// Fade-in on view
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.transform='translateY(0)';
      entry.target.style.opacity='1';
      io.unobserve(entry.target);
    }
  });
},{threshold:0.15});

document.querySelectorAll('.card').forEach(el=>{
  el.style.transform='translateY(14px)';
  el.style.opacity='0';
  io.observe(el);
});
