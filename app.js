'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Formularze demonstracyjne zatrzymują poprawne zgłoszenia w przeglądarce.
document.addEventListener('submit', event => {
  if (!event.target.matches('.demo')) return;
  event.preventDefault();
  const status = $('[role=status]', event.target);
  if (status) status.textContent = document.documentElement.lang === 'de'
    ? 'Demo – es werden keine Daten gesendet.'
    : 'Dane poprawne. demo – formularz nie wysyła danych';
});
if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.filter(entry => entry.isIntersecting).forEach(entry => {
      entry.target.classList.add('reveal');
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.08});
  $$('.section').forEach(section => observer.observe(section));
}
function readStorage(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function writeStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch { /* Zmiany pozostają w bieżącej sesji. */ }
}

const dishes=$$('[data-kind]');
$$('[data-filter]').forEach(button=>button.onclick=()=>{
  $$('[data-filter]').forEach(filter=>filter.setAttribute('aria-pressed',String(filter===button)));
  dishes.forEach(dish=>dish.hidden=button.dataset.filter!=='all'&&!dish.dataset.kind.split(' ').includes(button.dataset.filter));
  $('#count').textContent='Pozycje w menu: '+dishes.filter(dish=>!dish.hidden).length;
});
const opening=Date.parse($('time').dateTime);
function clock(){
  const seconds=Math.max(0,Math.floor((opening-Date.now())/1000));
  $('#timer').textContent=seconds?Math.floor(seconds/86400)+' dni · '+Math.floor(seconds/3600)%24+' godz. · '+Math.floor(seconds/60)%60+' min · '+seconds%60+' s':'Planowana data otwarcia już minęła.';
}
clock();
setInterval(clock,1000);
