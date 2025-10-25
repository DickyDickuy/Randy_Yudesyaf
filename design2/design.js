const initCursor = () => {
  const cursor = document.querySelector('#cursor'); // slow square
  const cursorDot = document.querySelector('#cursorDot'); // fast dot
  if (!cursor || !cursorDot) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (prefersReducedMotion || isCoarsePointer) {
    cursor.remove();
    cursorDot.remove();
    document.body.style.cursor = 'auto';
    return;
  }

  // Target = native pointer (tracked by dot instantly)
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  // Current = square position (lags behind target)
  let currentX = targetX;
  let currentY = targetY;
  let rafId = null;

  // Easing for cursor movement
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  // Increase ease factor so the square catches up faster
  const easeAmount = 0.36;

  const updatePosition = () => {
    // Dot: snap to target immediately (native-feel)
    cursorDot.style.transform = `translate(calc(${targetX}px - 50%), calc(${targetY}px - 50%))`;
    // Square: ease toward the dot position
    const ease = easeInOut(easeAmount);
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    cursor.style.transform = `translate(calc(${currentX}px - 50%), calc(${currentY}px - 50%))`;
    rafId = requestAnimationFrame(updatePosition);
  };

  const handleMove = (event) => {
    // Update target instantly; dot will snap each frame
    targetX = event.clientX;
    targetY = event.clientY;

    // Context-aware dot color: turn cream on orange backgrounds
    const el = event.target;
    const onPill = !!el.closest('.pill');
    const onCsItem = !!el.closest('.cs-item');
    const audio = el.closest('.audio-toggle');
    const onOrangeAudio = !!(audio && audio.classList.contains('is-playing') && !audio.classList.contains('is-muted'));
    const shouldCream = onPill || onCsItem || onOrangeAudio;
    cursorDot.classList.toggle('is-cream', shouldCream);
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
    // Leader: go bold, tall and distinct
    { text: 'Leader', fontFamily: '"Bebas Neue", sans-serif', fontStyle: 'normal', textTransform: 'uppercase', fontWeight: '700' },
    // Brother: rounded, friendlier look for contrast
    { text: 'Brother', fontFamily: '"Manrope", sans-serif', fontStyle: 'normal', textTransform: 'none', fontWeight: '700' },
    { text: 'Father', fontFamily: '"Crimson Pro", serif', fontStyle: 'normal', textTransform: 'none', fontWeight: '600' },
    { text: 'Human', fontFamily: '"Quicksand", sans-serif', fontStyle: 'normal', textTransform: 'none', fontWeight: '600' },
    // New variants
    { text: 'Traveler', fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic', textTransform: 'none', fontWeight: '600' },
    { text: 'Gamer', fontFamily: '"Minecraft", "Minecraft Ten", "Press Start 2P", monospace', fontStyle: 'normal', textTransform: 'none', fontWeight: '700' },
  ];

  const measurer = document.createElement('span');
  measurer.className = 'pill pill--measure';
  document.body.appendChild(measurer);

  let maxWidth = 0;
  variants.forEach(({ text, fontFamily, fontStyle, textTransform, fontWeight }) => {
    measurer.style.fontFamily = fontFamily;
    measurer.style.fontStyle = fontStyle;
    measurer.style.textTransform = textTransform || 'none';
    measurer.style.fontWeight = fontWeight || '400';
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
  const applyVariant = ({ text, fontFamily, fontStyle, textTransform, fontWeight }) => {
    pill.textContent = text;
    pill.style.fontFamily = fontFamily;
    pill.style.fontStyle = fontStyle;
    pill.style.textTransform = textTransform || 'none';
    pill.style.fontWeight = fontWeight || '400';
  };

  applyVariant(variants[index]);

  setInterval(() => {
    index = (index + 1) % variants.length;
    applyVariant(variants[index]);
  }, 1000);
};

// --- Background music (YouTube) ---
function initBackgroundMusic() {
  const btn = document.getElementById('audioToggle');
  const containerId = 'ytAudio';
  if (!btn) return;

  let player = null;
  let isMuted = true;
  let isPlaying = false;

  // Read URL or ID from data attribute; supports full YouTube links
  const configured = (btn.getAttribute('data-yt') || '').trim();

  function extractYouTubeInfo(input) {
    // Returns { videoId, listId }
    if (!input) return { videoId: 'g7KGDppyV4w', listId: null };
    try {
      const u = new URL(input);
      // youtu.be/VIDEOID
      if (u.hostname.includes('youtu.be')) {
        const vid = u.pathname.replace('/', '') || null;
        const listId = u.searchParams.get('list');
        return { videoId: vid || 'g7KGDppyV4w', listId };
      }
      // youtube.com/watch?v=VIDEOID or /embed/VIDEOID
      const v = u.searchParams.get('v')
        || (u.pathname.includes('/embed/') ? u.pathname.split('/embed/')[1]?.split(/[?&]/)[0] : null);
      const listId = u.searchParams.get('list');
      return { videoId: v || 'g7KGDppyV4w', listId };
    } catch {
      // Not a URL – treat as plain video ID
      return { videoId: input, listId: null };
    }
  }
  const ytInfo = extractYouTubeInfo(configured);

  function updateButton() {
    btn.classList.toggle('is-muted', isMuted);
    btn.classList.toggle('is-playing', isPlaying);
    btn.setAttribute('aria-pressed', String(!isMuted));
    btn.title = isMuted ? 'Unmute music' : 'Mute music';
  }
  updateButton();

  function loadYT() {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) return resolve(window.YT);
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = () => resolve(window.YT);
      document.head.appendChild(tag);
    });
  }

  async function ensurePlayer() {
    if (player) return player;
    const YT = await loadYT();
    player = new YT.Player(containerId, {
      height: '0',
      width: '0',
      videoId: ytInfo.videoId,
      playerVars: {
        autoplay: 1, // try to start automatically
        controls: 0,
        modestbranding: 1,
        loop: 1,
        // For loop to work YouTube requires a playlist param.
        // Use list if provided, otherwise repeat the same videoId.
        playlist: ytInfo.listId || ytInfo.videoId,
        ...(ytInfo.listId ? { listType: 'playlist', list: ytInfo.listId } : {}),
      },
      events: {
        onReady: () => {
          // Attempt autoplay with sound; if blocked, fall back to muted autoplay
          const attemptAutoplay = () => {
            try {
              player.setVolume(60);
              player.unMute();
              player.playVideo();
              isPlaying = true;
              isMuted = false;
              updateButton();
              // verify after a short delay
              setTimeout(() => {
                const state = player.getPlayerState && player.getPlayerState();
                // 1 = PLAYING, 3 = BUFFERING
                if (state !== 1 && state !== 3) {
                  // likely blocked: try muted autoplay
                  player.mute();
                  isMuted = true;
                  player.playVideo();
                  isPlaying = true;
                  updateButton();
                }
              }, 300);
            } catch (_) {
              // last resort: muted autoplay
              try {
                player.mute();
                player.playVideo();
                isMuted = true;
                isPlaying = true;
                updateButton();
              } catch {}
            }
          };
          attemptAutoplay();
        }
      }
    });
    return player;
  }

  btn.addEventListener('click', async () => {
    const p = await ensurePlayer();
    if (!isPlaying) {
      p.playVideo();
      p.setVolume(60);
      p.unMute();
      isPlaying = true;
      isMuted = false;
      updateButton();
      return;
    }
    // Toggle mute
    isMuted = !isMuted;
    if (isMuted) p.mute(); else p.unMute();
    updateButton();
  });

  // Preload player immediately and attempt autoplay
  ensurePlayer();
}



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
  initBackgroundMusic();
  initCaseStudies();
};

document.addEventListener('DOMContentLoaded', init);

// --- Case studies hover preview ---
function initCaseStudies() {
  const items = Array.from(document.querySelectorAll('.cs-item'));
  const preview = document.querySelector('.cs-preview');
  const img = preview ? preview.querySelector('.cs-preview__img') : null;
  if (!items.length || !preview || !img) return;

  const padY = 24; // keep preview within viewport vertically

  function positionPreview(yCenter) {
    const vw = window.innerWidth;
    const left = Math.max(vw * 0.38, Math.min(vw * 0.62, vw * 0.55));
    const desiredTop = yCenter - preview.offsetHeight / 2;
    const top = Math.max(padY, Math.min(window.innerHeight - preview.offsetHeight - padY, desiredTop));
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
  }

  items.forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
      const src = el.getAttribute('data-preview');
      if (src) img.src = src;
      preview.classList.add('is-visible');
      const rect = el.getBoundingClientRect();
      positionPreview(rect.top + rect.height / 2);
    });
    el.addEventListener('mousemove', (e) => {
      positionPreview(e.clientY);
    });
    el.addEventListener('mouseleave', () => {
      preview.classList.remove('is-visible');
    });
  });
}