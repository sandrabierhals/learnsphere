// Add padding to body based on header and footer height
const h = document.querySelector('header');
const f = document.querySelector('footer');

document.body.style.paddingTop = h ? `${h.clientHeight}px` : '0';
document.body.style.paddingBottom = f ? `${f.clientHeight}px` : '0';
