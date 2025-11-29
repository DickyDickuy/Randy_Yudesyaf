// --- Data (generated UI) ---
const CAROUSEL_ITEMS = [
  { src: 'Assets/img/cool_photo/2014.png', label: '08-2014', alt: '2014' },
  { src: 'Assets/img/cool_photo/2014(2).png', label: '2014', alt: '2014' },
  { src: 'Assets/img/cool_photo/2015.jpg', label: '2015', alt: '2015' },
  { src: 'Assets/img/cool_photo/2015(2).jpg', label: '2015', alt: '2015' },
  { src: 'Assets/img/cool_photo/2016.jpg', label: '2016', alt: '2016' },
  { src: 'Assets/img/cool_photo/2017.jpg', label: '2017', alt: '2017' },
  { src: 'Assets/img/cool_photo/2018.jpg', label: '2018', alt: '2018' },
  { src: 'Assets/img/cool_photo/2019.jpg', label: '2019', alt: '2019' },
  { src: 'Assets/img/cool_photo/2020.jpg', label: '2020', alt: '2020' },
  { src: 'Assets/img/cool_photo/2021.jpg', label: '2021', alt: '2021' },
  { src: 'Assets/img/cool_photo/2022.png', label: '2022', alt: '2022' },
  { src: 'Assets/img/cool_photo/2023.jpg', label: '2023', alt: '2023' },
  { src: 'Assets/img/cool_photo/2023(1).jpg', label: '2023', alt: '2023' },
  { src: 'Assets/img/cool_photo/2024.jpg', label: '2024', alt: '2024' },
  { src: 'Assets/img/cool_photo/2024(1).jpg', label: '2024', alt: '2024' },
  { src: 'Assets/img/cool_photo/2025.png', label: '2025', alt: '2025' },
];

const CASE_STUDIES = [
  { title: 'Art Installation HUT Astra 65 at Menara Astra & AMDI Building', preview: 'Assets/img/event/Art Installation HUT Astra 65 at Menara Astra & AMDI Building 👷🏽_♂️🪜.jpg', tags: ['Event Organizer'] },
  { title: 'Break Out Day Festival by Djarum', preview: 'Assets/img/event/Break Out Day Festival by Djarum2O24.jpg', tags: ['Event Organizer'] },
  { title: 'Campaign Activation Flip 2023', preview: 'Assets/img/event/Campaign Activavtion FLIP 2023.jpg', tags: ['Event Organizer'] },
  { title: 'Ed Sheeran Divide World Tour 2019 Gelora Bung Karno Stadium Jakarta', preview: 'Assets/img/event/ED SHEERAN Divide World Tour 2019 Gelora Bung Karno Stadium 🏟 Jakarta, May 3rd 2019PK Entertain.jpg', tags: ['Event Organizer'] },
  { title: 'Esmod Jakarta Creative Show 2023', preview: 'Assets/img/event/Esmod Jakarta Creative Show 2023 4.jpg', tags: ['Event Organizer'] },
  { title: 'Godrej Pekan Raya Jakarta 2023', preview: 'Assets/img/event/Godrej PRJ 2023.gif', tags: ['Event Organizer'] },
  { title: 'Grand Opening Premium Guest House OCBC 2024', preview: 'Assets/img/event/Grand Opening Premium Guest House OCBC 2024.jpg', tags: ['Event Organizer'] },
  { title: 'HSBC 2025 Summit', preview: 'Assets/img/event/hsbc 2025 summit.jpg', tags: ['Event Organizer'] },
  { title: 'HSBC Iftar', preview: 'Assets/img/event/HSBC Iftar.jpg', tags: ['Event Organizer'] },
  { title: 'Java Jazz Festival 2017', preview: 'Assets/img/event/Java Jazz Festival 2017.PNG', tags: ['Event Organizer'] },
  { title: 'Joyland Festival 2019', preview: 'Assets/img/event/Joyland Festival 2019.jpg', tags: ['Event Organizer'] },
  { title: 'Synchronize Fest 2019', preview: 'Assets/img/event/menyambut malam dengan ungu nya awan di hari terakhir.jpg', tags: ['Event Organizer'] },
  { title: 'OCBC Intimate Dinner 2024', preview: 'Assets/img/event/OCBC Intimate Dinner 2024 2.jpg', tags: ['Event Organizer'] },
  { title: 'OLX Indonesia at Indonesia E-Commerce Summit Expo 2017', preview: 'Assets/img/event/OLXindo_IESE 2017.PNG', tags: ['Event Organizer'] },
  { title: 'Pokemon Press Conference 2025', preview: 'Assets/img/event/POKEMON PRESS CONFERENCE 2025 - The Pokemon Company menggelar acara press conference pada tangga.jpg', tags: ['Event Organizer'] },
  { title: 'Menara Astra 2022', preview: 'Assets/img/event/RAMADAN ART INSTALLATION MENARA ASTRA 2022.PNG', tags: ['Ramadhan Art Installation'] },
  { title: 'Road To MotoGP Mandalika 2024', preview: 'Assets/img/event/Road To MotoGP Mandalika 2024.jpeg', tags: ['Event Organizer'] },
  { title: 'Road To Summit Concept, HSBC 2024', preview: 'Assets/img/event/Road To SummitConcept, HSBC 2024.jpg', tags: ['Event Organizer', 'Tenant'] },
];

function renderCarousel(track, items) {
  const frag = document.createDocumentFragment();
  items.forEach(({ src, label, alt }) => {
    const wrap = document.createElement('div');
    wrap.className = 'carousel-img-container';
    const img = document.createElement('img');
    img.className = 'carousel-img';
    img.src = src;
    img.alt = alt || label || '';
    const overlay = document.createElement('div');
    overlay.className = 'carousel-img-overlay';
    const year = document.createElement('span');
    year.className = 'carousel-img-year';
    year.textContent = label || '';
    overlay.appendChild(year);
    wrap.appendChild(img);
    wrap.appendChild(overlay);
    frag.appendChild(wrap);
  });
  track.appendChild(frag);
}

function renderCaseStudies(listEl, studies) {
  const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
  const frag = document.createDocumentFragment();
  studies.forEach((s, i) => {
    const li = document.createElement('li');
    li.className = 'cs-item';
    if (s.preview) li.setAttribute('data-preview', s.preview);
    const num = document.createElement('span');
    num.className = 'cs-number';
    num.textContent = pad2(i + 1);
    const title = document.createElement('h3');
    title.className = 'cs-title';
    title.textContent = s.title;
    const tags = document.createElement('ul');
    tags.className = 'cs-tags';
    (s.tags || []).forEach((t) => {
      const liTag = document.createElement('li');
      liTag.textContent = t;
      tags.appendChild(liTag);
    });
    li.appendChild(num);
    li.appendChild(title);
    li.appendChild(tags);
    frag.appendChild(li);
  });
  listEl.appendChild(frag);
}

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

  const updatePosition = () => {
    // Dot: snap to target immediately (native-feel)
    // Use translate(-50%, -50%) from CSS to center, so just position at target coordinates
    cursorDot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
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
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    rafId = requestAnimationFrame(updatePosition);
  };

  const handleMove = (event) => {
    // Only track touch position while finger is down; mouse/pen always track
    if (event.pointerType === 'touch' && !trackingTouch) return;
    
    // Check if hovering over Spotify iframe specifically - if so, hide custom cursor and show native cursor
    const el = event.target;
    const onSpotifyIframe = !!el.closest('iframe[src*="spotify"]');
    
    if (onSpotifyIframe) {
      // Hide custom cursors and show native cursor when over Spotify iframe
      cursor.style.opacity = '0';
      cursorDot.style.opacity = '0';
      document.body.style.cursor = 'auto';
      return;
    } else {
      // Show custom cursors and hide native cursor everywhere else
      cursor.style.opacity = '1';
      cursorDot.style.opacity = '1';
      document.body.style.cursor = 'none';
    }
    
    // Update target instantly; dot will snap each frame
    targetX = event.clientX;
    targetY = event.clientY;

    // Context-aware dot color: turn cream on orange backgrounds
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
  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      trackingTouch = true;
      activeTouchPointerId = e.pointerId;
      document.body.classList.add('show-touch-cursor');
      targetX = e.clientX;
      targetY = e.clientY;
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

// --- Spotify Music Player ---
function initSpotifyPlayer() {
  const playlistToggle = document.getElementById('playlistToggle');
  const spotifyPlaylist = document.getElementById('spotifyPlaylist');
  const trackTitle = document.querySelector('.track-title');
  const trackArtist = document.querySelector('.track-artist');
  
  if (!playlistToggle || !spotifyPlaylist) return;

  // Update track info with playlist info
  trackTitle.textContent = 'Mood';

  // Toggle playlist visibility
  playlistToggle.addEventListener('click', () => {
    const isExpanded = spotifyPlaylist.classList.contains('expanded');
    
    if (isExpanded) {
      spotifyPlaylist.classList.remove('expanded');
      playlistToggle.style.transform = 'rotate(180deg)';
    } else {
      spotifyPlaylist.classList.add('expanded');
      playlistToggle.style.transform = 'rotate(00deg)';
    }
  });

  // Handle popup visibility with improved hover detection
  const spotifyContainer = document.querySelector('.spotify-container');
  const spotifyPopup = document.getElementById('spotifyPopup');
  const audioToggle = document.getElementById('audioToggle');
  let hoverTimeout;
  let isPopupVisible = false;

  const showPopup = () => {
    clearTimeout(hoverTimeout);
    isPopupVisible = true;
    spotifyPopup.style.opacity = '1';
    spotifyPopup.style.visibility = 'visible';
    spotifyPopup.style.transform = 'translateY(0) scale(1)';
    spotifyContainer.classList.add('active');
    spotifyPopup.classList.add('active');
  };

  const hidePopup = () => {
    hoverTimeout = setTimeout(() => {
      isPopupVisible = false;
      spotifyPopup.style.opacity = '0';
      spotifyPopup.style.visibility = 'hidden';
      spotifyPopup.style.transform = 'translateY(10px) scale(0.95)';
      spotifyContainer.classList.remove('active');
      spotifyPopup.classList.remove('active');
      // Close playlist when hiding popup
      spotifyPlaylist.classList.remove('expanded');
      playlistToggle.style.transform = 'rotate(180deg)';
    }, 150);
  };

  // Check if device supports touch
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  if (isTouchDevice) {
    // Touch device behavior
    audioToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (isPopupVisible) {
        hidePopup();
      } else {
        showPopup();
      }
    });
    
    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
      if (!spotifyContainer.contains(e.target) && isPopupVisible) {
        hidePopup();
      }
    });
  } else {
    // Desktop hover behavior
    spotifyContainer.addEventListener('mouseenter', showPopup);
    spotifyContainer.addEventListener('mouseleave', hidePopup);
    
    // Keep popup visible when hovering over it
    spotifyPopup.addEventListener('mouseenter', showPopup);
    spotifyPopup.addEventListener('mouseleave', hidePopup);
  }
}



// --- Carousel Logic ---
function initCarousel() {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  // If no items present (after refactor), render from data
  if (!track.children.length) {
    renderCarousel(track, CAROUSEL_ITEMS);
  }

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
    // Don't hijack touch start to preserve natural page scrolling on touch
    if (e.pointerType === 'touch') return;
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
    // Prevent default only for mouse/pen drag to avoid selecting text/images
    if (e.pointerType !== 'touch') e.preventDefault();
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

  const finishDrag = (pointerId) => {
    if (!isDragging) return;
    isDragging = false;
    const maxV = 300;
    const injected = lastDragVelocity * 0.25;
    vx = Math.abs(injected) > 5 ? Math.max(-maxV, Math.min(maxV, injected)) : 0;
    vxSource = 'drag';
    if (track.releasePointerCapture && typeof pointerId !== 'undefined') {
      try { track.releasePointerCapture(pointerId); } catch (err) {}
    }
    track.style.cursor = 'grab';
    document.body.style.cursor = 'none';
  };

  track.addEventListener('pointerup', (e) => finishDrag(e.pointerId));
  track.addEventListener('pointerleave', () => finishDrag());

  // Pause animation if not visible
  function onVisibility() {
    animating = !document.hidden;
    if (animating) requestAnimationFrame(animate);
  }
  document.addEventListener('visibilitychange', onVisibility);
}

const init = () => {
  // Render data-driven sections first
  const csList = document.getElementById('csList');
  if (csList && !csList.children.length) {
    renderCaseStudies(csList, CASE_STUDIES);
  }

  initCursor();
  initPillRotation();
  initCarousel();
  initSpotifyPlayer();
  initCaseStudies();
  initStickyNotes();
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
    
    // Smooth inertia effect using CSS transition on top/left properties
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

// --- Sticky Notes functionality ---
function initStickyNotes() {
  const stickyNotes = document.querySelectorAll('.sticky-note');
  if (!stickyNotes.length) return;

  // Add click handlers for zoom effect
  stickyNotes.forEach((note) => {
    note.addEventListener('click', () => {
      // The zoom effect is handled by CSS :active pseudo-class
      // Add a brief additional effect if needed
      note.style.transform = note.style.transform.replace('scale(1.1)', '') + ' scale(1.15)';
      
      setTimeout(() => {
        note.style.transform = note.style.transform.replace(' scale(1.15)', '');
      }, 150);
    });
  });
}