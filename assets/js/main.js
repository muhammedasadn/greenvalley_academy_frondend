tailwind.config = {
  theme: {
    extend: {
      colors: {
        primary: '#00301C',
        secondary: '#D1FB5F',
      },
      fontFamily: {
        heading: ['Roboto', 'sans-serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const counter = document.getElementById('slide-current');
  const bar = document.getElementById('progress-bar');
  const DURATION = 5000;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (idx + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
    counter.textContent = String(current + 1).padStart(2, '0');

    startProgress();
  }

  function startProgress() {
    bar.style.transition = 'none';
    bar.style.width = '0%';
    clearTimeout(timer);

    // Trigger reflow to restart CSS transition.
    void bar.offsetWidth;

    bar.style.transition = `width ${DURATION}ms linear`;
    bar.style.width = '100%';
    timer = setTimeout(() => goTo(current + 1), DURATION);
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      clearTimeout(timer);
      goTo(parseInt(dot.dataset.slide, 10));
    });
  });

  document.getElementById('prev-btn').addEventListener('click', () => {
    clearTimeout(timer);
    goTo(current - 1);
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    clearTimeout(timer);
    goTo(current + 1);
  });

  const section = document.querySelector('section');
  section.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    bar.style.transition = 'none';
  });
  section.addEventListener('mouseleave', () => startProgress());

  let touchX = null;
  section.addEventListener(
    'touchstart',
    (e) => {
      touchX = e.touches[0].clientX;
    },
    { passive: true }
  );

  section.addEventListener(
    'touchend',
    (e) => {
      if (touchX === null) {
        return;
      }

      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) {
        clearTimeout(timer);
        goTo(dx < 0 ? current + 1 : current - 1);
      }
      touchX = null;
    },
    { passive: true }
  );

  const mobToggle = document.getElementById('mob-toggle');
  const mobMenu = document.getElementById('mob-menu');

  mobToggle.addEventListener('click', () => {
    const open = !mobMenu.classList.contains('hidden');
    mobMenu.classList.toggle('hidden', open);
    mobToggle.setAttribute('aria-expanded', String(!open));
  });

  mobMenu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      mobMenu.classList.add('hidden');
      mobToggle.setAttribute('aria-expanded', 'false');
    })
  );

  startProgress();
});