const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav');
const navLinks = [...navigation.querySelectorAll('a')];
const sections = navLinks.map((link) => document.querySelector(link.hash));

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.querySelector('use').setAttribute('href', open ? '#close' : '#menu');
  navigation.toggleAttribute('data-open', open);
}

menuToggle.addEventListener('click', () => setMenu(!navigation.hasAttribute('data-open')));
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.hasAttribute('data-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

function highlightSection() {
  const readingLine = window.innerHeight * 0.43;
  const activeSection = sections.findLast((section) => section.getBoundingClientRect().top <= readingLine);
  for (const link of navLinks) {
    if (link.hash === `#${activeSection?.id}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}

let scrollFrame = 0;
function scheduleHighlight() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    highlightSection();
  });
}

window.addEventListener('scroll', scheduleHighlight, { passive: true });
window.addEventListener('resize', scheduleHighlight);
highlightSection();

if ('IntersectionObserver' in window) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      reveal.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => reveal.observe(element));
}

const posterDialog = document.querySelector('.poster-dialog');
const posterImage = posterDialog.querySelector('img');
const posterTitle = posterDialog.querySelector('h2');

document.querySelectorAll('[data-poster]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !posterDialog.showModal) return;
    event.preventDefault();
    posterTitle.textContent = link.dataset.title;
    posterImage.alt = link.querySelector('img').alt;
    posterImage.src = link.href;
    posterDialog.showModal();
  });
});

posterDialog.addEventListener('click', (event) => {
  if (event.target === posterDialog) posterDialog.close();
});
