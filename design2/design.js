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

  // Easing for cursor movement
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  const easeAmount = 0.22;

  const updatePosition = () => {
    // Use ease-in-out for smoother following
    const ease = easeInOut(easeAmount);
    currentX += (x - currentX) * ease;
    currentY += (y - currentY) * ease;
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
    // Leader: switch to Manrope for more balanced, symmetric letterforms
    { text: 'Leader', fontFamily: '"Manrope", sans-serif', fontStyle: 'normal', textTransform: 'uppercase' },
    { text: 'Brother', fontFamily: '"Poppins", sans-serif', fontStyle: 'normal', textTransform: 'none' },
    { text: 'Father', fontFamily: '"Crimson Pro", serif', fontStyle: 'normal', textTransform: 'none' },
    { text: 'Human', fontFamily: '"Quicksand", sans-serif', fontStyle: 'normal', textTransform: 'none' },
    // New variants
    { text: 'Traveler', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', textTransform: 'none' },
    { text: 'Gamer', fontFamily: '"Press Start 2P", cursive', fontStyle: 'normal', textTransform: 'none' },
  ];

  const measurer = document.createElement('span');
  measurer.className = 'pill pill--measure';
  document.body.appendChild(measurer);

  let maxWidth = 0;
  variants.forEach(({ text, fontFamily, fontStyle, textTransform }) => {
    measurer.style.fontFamily = fontFamily;
    measurer.style.fontStyle = fontStyle;
    measurer.style.textTransform = textTransform || 'none';
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
  const applyVariant = ({ text, fontFamily, fontStyle, textTransform }) => {
    pill.textContent = text;
    pill.style.fontFamily = fontFamily;
    pill.style.fontStyle = fontStyle;
    pill.style.textTransform = textTransform || 'none';
  };

  applyVariant(variants[index]);

  setInterval(() => {
    index = (index + 1) % variants.length;
    applyVariant(variants[index]);
  }, 1000);
};



// --- Carousel Logic ---
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  // Duplicate images for seamless looping
  const imgs = Array.from(track.children);
  imgs.forEach(img => {
    const clone = img.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  let trackWidth = 0;
  let imgWidths = [];
  function measureWidths() {
    imgWidths = Array.from(track.children).map(img => img.offsetWidth + parseFloat(getComputedStyle(track).gap || 0));
    trackWidth = imgWidths.reduce((a, b) => a + b, 0);
  }
  measureWidths();
  window.addEventListener('resize', measureWidths);

  // Physics state
  let pos = 0;                 // px
  let vx = 0;                  // px/s (carousel velocity from drag/scroll)
  const driftV = -20;          // px/s base drift to the left (constant slow movement)
  const friction = 120;        // px/s^2 deceleration (higher for ~5 sec max glide)

  let animating = true;
  let lastTime = performance.now();

  function animate(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000); // seconds, cap to avoid jumps
    lastTime = now;

    // Apply friction when not dragging
    if (!isDragging) {
      if (vx > 0) vx = Math.max(0, vx - friction * dt);
      else if (vx < 0) vx = Math.min(0, vx + friction * dt);
    }

    // Integrate position with drift (disabled while dragging for direct control)
    const base = isDragging ? 0 : driftV;
    pos += (base + vx) * dt;

    // Looping logic
    if (pos < -trackWidth / 2) {
      pos += trackWidth / 2;
    } else if (pos > 0) {
      pos -= trackWidth / 2;
    }
    track.style.transform = `translateX(${pos}px)`;

    if (animating) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // Scroll event to add momentum
  let lastWheelTime = 0;
  window.addEventListener('wheel', (e) => {
    // Allow browser zoom (ctrl/cmd + wheel)
    if (e.ctrlKey || e.metaKey) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // Add to velocity in px/s, scaled from wheel delta (reversed: down=left)
      vx -= e.deltaY * 0.75; // scroll down = negative deltaY = carousel moves left
      lastWheelTime = performance.now();
      // Prevent page scroll if at top or bottom
      const atTop = window.scrollY === 0;
      const atBottom = Math.abs(window.innerHeight + window.scrollY - document.body.scrollHeight) < 2;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
      }
    }
  }, { passive: false });

  // --- Drag to scroll (mouse/touch) ---
  let isDragging = false;
  let dragStartX = 0;
  let dragLastX = 0;
  let dragLastTime = 0;
  let lastDragVelocity = 0; // px/s


  track.style.cursor = 'grab';
  track.addEventListener('pointerdown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragLastX = e.clientX;
    dragLastTime = performance.now();
    lastDragVelocity = 0;
    if (track.setPointerCapture) {
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    }
    track.style.cursor = 'grabbing';
    document.body.style.cursor = 'none'; // Always hide native cursor
    e.preventDefault();
  });

  track.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max(1, now - dragLastTime);
    const dx = e.clientX - dragLastX;
    pos += dx; // direct follow under pointer
    lastDragVelocity = (dx / (dt / 1000)); // px/s
    dragLastX = e.clientX;
    dragLastTime = now;
    // Looping logic
    if (pos < -trackWidth / 2) {
      pos += trackWidth / 2;
    } else if (pos > 0) {
      pos -= trackWidth / 2;
    }
    track.style.transform = `translateX(${pos}px)`;
  });

  track.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    isDragging = false;
  // Use last drag velocity for momentum at 25% (clamped)
  const maxV = 300; // px/s (quarter of previous)
  const injected = lastDragVelocity * 0.25;
  vx = Math.abs(injected) > 5 ? Math.max(-maxV, Math.min(maxV, injected)) : 0;
    if (track.releasePointerCapture) {
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    track.style.cursor = 'grab';
    document.body.style.cursor = 'none'; // Always hide native cursor
  });

  track.addEventListener('pointerleave', (e) => {
    if (!isDragging) return;
    isDragging = false;
  const maxV = 300;
  const injected = lastDragVelocity * 0.25;
  vx = Math.abs(injected) > 5 ? Math.max(-maxV, Math.min(maxV, injected)) : 0;
    if (track.releasePointerCapture) {
      try { track.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    track.style.cursor = 'grab';
    document.body.style.cursor = 'none';
  });

  // Pause animation if not visible
  function onVisibility() {
    animating = !document.hidden;
    if (animating) requestAnimationFrame(animate);
  }
  document.addEventListener('visibilitychange', onVisibility);
}

const init = () => {
  initCursor();
  initPillRotation();
  initCarousel();
};

document.addEventListener('DOMContentLoaded', init);