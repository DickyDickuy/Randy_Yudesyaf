const initCursor = () => {
  const cursor = document.querySelector('#cursor'); // slow square
  const cursorDot = document.querySelector('#cursorDot'); // fast dot
  if (!cursor || !cursorDot) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

  // On reduced motion, disable custom cursors entirely
  if (prefersReducedMotion) {
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
  // For touch devices: only show/update while finger is down
  let trackingTouch = false;
  let activeTouchPointerId = null;

  // Easing for cursor movement
  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
  // Increase ease factor so the square catches up faster
  const easeAmount = 0.36;

  // Cache cursor sizes to avoid calc() in transforms on mobile
  let cursorHalfW = cursor.offsetWidth / 2;
  let cursorHalfH = cursor.offsetHeight / 2;
  let dotHalfW = cursorDot.offsetWidth / 2;
  let dotHalfH = cursorDot.offsetHeight / 2;
  const recalcCursorSize = () => {
    cursorHalfW = cursor.offsetWidth / 2;
    cursorHalfH = cursor.offsetHeight / 2;
    dotHalfW = cursorDot.offsetWidth / 2;
    dotHalfH = cursorDot.offsetHeight / 2;
  };
  window.addEventListener('resize', recalcCursorSize);

  const updatePosition = () => {
    // Dot: snap to target immediately (native-feel)
  cursorDot.style.transform = `translate3d(${targetX - dotHalfW}px, ${targetY - dotHalfH}px, 0)`;
    // Square: ease toward the dot position
    if (trackingTouch) {
      // On touch, remove delay so it doesn't feel laggy
      currentX = targetX;
      currentY = targetY;
    } else {
      const ease = easeInOut(easeAmount);
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
    }
    cursor.style.transform = `translate3d(${currentX - cursorHalfW}px, ${currentY - cursorHalfH}px, 0)`;
    rafId = requestAnimationFrame(updatePosition);
  };

  const handleMove = (event) => {
    // Only track touch position while finger is down; mouse/pen always track
    if (event.pointerType === 'touch' && !trackingTouch) return;
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
    // Keep animating while an active touch is in progress
    if (trackingTouch) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  document.addEventListener('pointermove', handleMove);
  document.addEventListener('pointerleave', handleLeave);

  // Touch-specific show/hide of a minimal cursor indicator
  let prevTouchAction = '';
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      trackingTouch = true;
      activeTouchPointerId = e.pointerId;
      document.body.classList.add('show-touch-cursor');
      targetX = e.clientX;
      targetY = e.clientY;
      // Disable browser touch gestures to ensure continuous pointer events
      const el = document.documentElement;
      prevTouchAction = el.style.touchAction;
      el.style.touchAction = 'none';
      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }
    }
  });
  const endTouch = (e) => {
    if (e.pointerType === 'touch') {
      trackingTouch = false;
      activeTouchPointerId = null;
      document.body.classList.remove('show-touch-cursor');
      // Restore touch gestures
      document.documentElement.style.touchAction = prevTouchAction;
      handleLeave();
    }
  };
  document.addEventListener('pointerup', endTouch);
  document.addEventListener('pointercancel', endTouch);

  // Higher frequency updates on Chromium for smoother touch tracking
  document.addEventListener('pointerrawupdate', (e) => {
    if (e.pointerType === 'touch') {
      if (!trackingTouch) return;
      if (activeTouchPointerId !== null && e.pointerId !== activeTouchPointerId) return;
      targetX = e.clientX;
      targetY = e.clientY;
      if (rafId === null) {
        rafId = requestAnimationFrame(updatePosition);
      }
    }
  });

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
  const autoplayDelayMs = 1500; // delay autoplay attempt after reload

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
        playsinline: 1,
        // For loop to work YouTube requires a playlist param.
        // Use list if provided, otherwise repeat the same videoId.
        playlist: ytInfo.listId || ytInfo.videoId,
        ...(ytInfo.listId ? { listType: 'playlist', list: ytInfo.listId } : {}),
      },
      events: {
        onReady: () => {
          // Attempt autoplay after a short delay; if blocked, fall back to muted autoplay
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
                  // likely blocked: try muted autoplay (guaranteed by policy)
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
          setTimeout(attemptAutoplay, autoplayDelayMs);
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

  // Preload player immediately; autoplay will be attempted after a short delay when ready
  ensurePlayer();
}



// --- Carousel Logic ---
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  // Setup skeleton for initially present items
  const setupImgSkeleton = (container) => {
    const img = container.querySelector('img');
    if (!img) return;
    const clearLoading = () => {
      container.classList.remove('is-loading');
      img.removeEventListener('load', clearLoading);
      img.removeEventListener('error', clearLoading);
    };
    // If already loaded from cache
    if (img.complete && img.naturalWidth > 0) {
      clearLoading();
    } else {
      container.classList.add('is-loading');
      img.addEventListener('load', clearLoading, { once: true });
      img.addEventListener('error', clearLoading, { once: true });
    }
  };
  Array.from(track.children).forEach((c) => setupImgSkeleton(c));

  // Duplicate images for seamless looping
  const imgs = Array.from(track.children);
  imgs.forEach(img => {
    const clone = img.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
    setupImgSkeleton(clone);
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
  // Track wheel momentum window (max 5s) and source of velocity
  let wheelMomentumUntil = 0; // timestamp (ms) when wheel momentum should end
  let vxSource = null; // 'wheel' | 'drag' | null

  function animate(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000); // seconds, cap to avoid jumps
    lastTime = now;

    // Apply friction when not dragging
    if (!isDragging) {
      if (vx > 0) vx = Math.max(0, vx - friction * dt);
      else if (vx < 0) vx = Math.min(0, vx + friction * dt);
    }

    // Enforce max 5s wheel momentum: after the window, clamp wheel-induced vx back to 0
    if (!isDragging && vxSource === 'wheel') {
      const nowMs = performance.now();
      if (nowMs > wheelMomentumUntil) {
        // Apply strong braking to quickly settle to drift
        const extraFriction = 600; // px/s^2
        if (vx > 0) vx = Math.max(0, vx - extraFriction * dt);
        else if (vx < 0) vx = Math.min(0, vx + extraFriction * dt);
        if (Math.abs(vx) < 1) {
          vx = 0;
          vxSource = null;
        }
      }
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
  // Allow wheel-induced momentum for up to 5 seconds from the last wheel event
  wheelMomentumUntil = lastWheelTime + 5000;
  vxSource = 'wheel';
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
    vxSource = 'drag';
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
    vxSource = 'drag';
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
  const skeleton = preview ? preview.querySelector('.cs-preview__skeleton') : null;
  if (!items.length || !preview || !img) return;

  const padY = 24; // vertical clamp so the preview stays within the section
  const section = document.querySelector('.cs-section');
  if (!section) return;

  let currentEl = null;

  // Position the preview centered on the hovered item, within the section
  function positionPreviewFor(el) {
    if (!el) return;
    const secRect = section.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    const secWidth = secRect.width;
    const previewH = preview.offsetHeight || 0;

    // Horizontal position: center in the right side of the section
    const desiredCenter = secWidth * 0.55;
    const centerX = Math.max(secWidth * 0.38, Math.min(secWidth * 0.62, desiredCenter));
    preview.style.left = `${centerX}px`;

    // Vertical position: align to item center relative to the section, clamped
    const itemMidY = itemRect.top - secRect.top + itemRect.height / 2;
    let top = itemMidY - previewH / 2;
    const maxTop = section.offsetHeight - previewH - padY;
    top = Math.max(padY, Math.min(maxTop, top));
    preview.style.top = `${top}px`;
  }

  let currentSrcToken = 0;
  const setPreviewSrc = (src) => {
    const token = ++currentSrcToken;
    preview.classList.remove('is-img-loaded');
    img.onload = () => {
      if (currentSrcToken !== token) return;
      preview.classList.add('is-img-loaded');
    };
    img.onerror = () => {
      if (currentSrcToken !== token) return;
      preview.classList.add('is-img-loaded');
    };
    img.src = src;
    // If image already cached
    if (img.complete && img.naturalWidth > 0) {
      preview.classList.add('is-img-loaded');
    }
  };

  // Initialize default preview load state
  if (img.complete && img.naturalWidth > 0) {
    preview.classList.add('is-img-loaded');
  }

  items.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const src = el.getAttribute('data-preview');
      if (src) setPreviewSrc(src);
      currentEl = el;
      preview.classList.add('is-visible');
      positionPreviewFor(el);
    });
    el.addEventListener('mouseleave', () => {
      preview.classList.remove('is-visible');
      currentEl = null;
    });
  });

  // Keep the preview anchored to the item while scrolling/resizing
  let rafId = null;
  const scheduleReposition = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      if (currentEl) positionPreviewFor(currentEl);
    });
  };
  window.addEventListener('scroll', scheduleReposition, { passive: true });
  window.addEventListener('resize', scheduleReposition);
}