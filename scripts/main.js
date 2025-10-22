/* Main interactions for the landing page */
(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Build a grid of interactive tiles reminiscent of the hero visual.
  const grid = document.getElementById('tileGrid');
  if (grid) {
    const labels = ['ra', 'un', 'o', 'ui', 'fx', 'nx', 'cmd', 'k'];

    // Positions for tiles (percentage based to create an arc-like spread)
    const spots = [
      {x:12, y:8}, {x:34, y:16}, {x:56, y:26}, {x:73, y:36},
      {x:20, y:48}, {x:42, y:56}, {x:64, y:66}, {x:30, y:72}
    ];

    labels.forEach((text, i)=>{
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.left = spots[i].x + '%';
      tile.style.top = spots[i].y + '%';
      tile.textContent = text;
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-label', 'Interactive tile ' + (i+1));

      // Parallax hover that follows the cursor
      const onMove = (e)=>{
        const rect = tile.getBoundingClientRect();
        const mx = ((e.clientX - rect.left)/rect.width)*100;
        const my = ((e.clientY - rect.top)/rect.height)*100;
        tile.style.setProperty('--mx', mx+'%');
        tile.style.setProperty('--my', my+'%');
      };
      tile.addEventListener('pointermove', onMove);
      tile.addEventListener('pointerenter', ()=> tile.dataset.active = 'true');
      tile.addEventListener('pointerleave', ()=> tile.dataset.active = 'false');

      // Keyboard focus glow
      tile.addEventListener('focus', ()=> tile.dataset.active = 'true');
      tile.addEventListener('blur', ()=> tile.dataset.active = 'false');

      grid.appendChild(tile);
    });
  }

  // Populate scroll strip with demo items (replace with real work)
  const track = document.getElementById('stripTrack');
  if (track) {
    const items = [
      {src:'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop', label:'Motion Study'},
      {src:'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1200&auto=format&fit=crop', label:'Command UI'},
      {src:'https://images.unsplash.com/photo-1526378722422-5a4c7a5a1b50?q=80&w=1200&auto=format&fit=crop', label:'Next.js Tools'},
      {src:'https://images.unsplash.com/photo-1526498460520-4c246339dccb?q=80&w=1200&auto=format&fit=crop', label:'Logos Carousel'},
      {src:'https://images.unsplash.com/photo-1523861751938-068470b3a89e?q=80&w=1200&auto=format&fit=crop', label:'Blur Reveal'}
    ];

    items.forEach(({src,label})=>{
      const card = document.createElement('article');
      card.className = 'card';
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = label;
      img.src = src;
      const chip = document.createElement('span');
      chip.className = 'label';
      chip.textContent = label;
      card.appendChild(img);
      card.appendChild(chip);
      track.appendChild(card);
    });
  }

  // Blur Reveal: cursor/touch-following mask on a blurred overlay
  const reveal = document.getElementById('reveal');
  if (reveal) {
    const blur = reveal.querySelector('.blur');
    const update = (x, y)=>{
      const rect = reveal.getBoundingClientRect();
      const rx = ((x - rect.left) / rect.width) * 100;
      const ry = ((y - rect.top) / rect.height) * 100;
      blur.style.setProperty('--rx', rx + '%');
      blur.style.setProperty('--ry', ry + '%');
    };
    reveal.addEventListener('pointermove', (e)=> update(e.clientX, e.clientY));
    reveal.addEventListener('pointerenter', (e)=> update(e.clientX, e.clientY));
    reveal.addEventListener('pointerdown', (e)=> update(e.clientX, e.clientY));
    // Touch
    reveal.addEventListener('touchmove', (e)=>{
      const t = e.touches[0]; if (!t) return; update(t.clientX, t.clientY);
    }, {passive:true});
  }

  // Logos Carousel: build a marquee list and duplicate for seamless scroll
  const logosTrack = document.getElementById('logosTrack');
  if (logosTrack) {
    const brands = [
      'Apple', 'OpenAI', 'Stripe', 'Airbnb', 'Vercel', 'Arc', 'Aave', 'Polar', 'Basement', 'Figma'
    ];
    const makePill = (name)=>{
      const pill = document.createElement('span');
      pill.className = 'logo-pill';
      const dot = document.createElement('span');
      dot.className = 'logo-dot';
      const text = document.createElement('span');
      text.textContent = name;
      pill.append(dot, text);
      return pill;
    };
    const renderSet = ()=> brands.map(b => makePill(b));
    const set1 = renderSet();
    const set2 = renderSet();
    set1.concat(set2).forEach(el => logosTrack.appendChild(el));
  }
})();
