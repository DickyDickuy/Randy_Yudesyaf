const initCursor = () => {
  const cursor = document.querySelector('#cursor');
  if (!cursor) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (prefersReducedMotion || isCoarsePointer) {
    cursor.remove();
    document.body.style.cursor = 'auto';
    return;
  }

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let currentX = x;
  let currentY = y;
  let rafId = null;

  const updatePosition = () => {
    currentX += (x - currentX) * 0.22;
    currentY += (y - currentY) * 0.22;
    cursor.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
    rafId = requestAnimationFrame(updatePosition);
  };

  const handleMove = (event) => {
    x = event.clientX;
    y = event.clientY;
    if (rafId === null) {
      rafId = requestAnimationFrame(updatePosition);
    }
  };

  const handleLeave = () => {
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  document.addEventListener('pointermove', handleMove);
  document.addEventListener('pointerleave', handleLeave);

  const interactiveElements = document.querySelectorAll('[data-cursor]');

  interactiveElements.forEach((el) => {
    const variant = el.dataset.cursor;

    const enter = () => {
      cursor.classList.add('is-hover');
      if (variant === 'solid') {
        cursor.classList.add('is-solid');
      }
    };

    const leave = () => {
      cursor.classList.remove('is-hover');
      if (variant === 'solid') {
        cursor.classList.remove('is-solid');
      }
    };

    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
  });
};

const initPillRotation = () => {
  const pill = document.querySelector('.pill');
  if (!pill) return;

  const variants = [
    { text: 'Leader', fontFamily: '"Oswald", sans-serif', fontStyle: 'normal' },
    { text: 'Brother', fontFamily: '"Poppins", sans-serif', fontStyle: 'normal' },
    { text: 'Father', fontFamily: '"Merriweather", serif', fontStyle: 'normal' },
    { text: 'Human', fontFamily: '"Quicksand", sans-serif', fontStyle: 'normal' }
  ];

  const measurer = document.createElement('span');
  measurer.className = 'pill pill--measure';
  document.body.appendChild(measurer);

  let maxWidth = 0;
  variants.forEach(({ text, fontFamily, fontStyle }) => {
    measurer.style.fontFamily = fontFamily;
    measurer.style.fontStyle = fontStyle;
    measurer.textContent = text;
    const width = measurer.getBoundingClientRect().width;
    if (width > maxWidth) {
      maxWidth = width;
    }
  });

  measurer.remove();

  if (maxWidth > 0) {
    pill.style.width = `${Math.ceil(maxWidth)}px`;
  }

  let index = 0;
  const applyVariant = ({ text, fontFamily, fontStyle }) => {
    pill.textContent = text;
    pill.style.fontFamily = fontFamily;
    pill.style.fontStyle = fontStyle;
  };

  applyVariant(variants[index]);

  setInterval(() => {
    index = (index + 1) % variants.length;
    applyVariant(variants[index]);
  }, 1000);
};

const init = () => {
  initCursor();
  initPillRotation();
};

document.addEventListener('DOMContentLoaded', init);