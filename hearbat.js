// Sticky TOC — highlight the section currently in view and smooth-scroll on click.
(() => {
  const links = Array.from(document.querySelectorAll('[data-toc]'));
  if (!links.length) return;

  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const setActive = (id) => {
    links.forEach((a) => {
      const match = a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', match);
    });
  };

  // Keep section headings clear of the sticky masthead when scrolled to.
  sections.forEach((s) => { s.style.scrollMarginTop = '76px'; });

  // ----- Mobile: collapse the TOC into a floating, tappable button -----
  const toc = document.querySelector('.toc');
  let closeMobile = () => {};
  if (toc) {
    // Wrap the title + list so they can be shown as a popover card on mobile.
    const panel = document.createElement('div');
    panel.className = 'toc__panel';
    const title = toc.querySelector('.toc__title');
    const list = toc.querySelector('.toc__list');
    if (title) panel.appendChild(title);
    if (list) panel.appendChild(list);
    toc.appendChild(panel);

    // Floating button (only visible on mobile, via CSS).
    const fab = document.createElement('button');
    fab.type = 'button';
    fab.className = 'toc__fab';
    fab.setAttribute('aria-label', 'Table of contents');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
      '<line x1="9" y1="7" x2="20" y2="7"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="17" x2="20" y2="17"/>' +
      '<circle cx="4.5" cy="7" r="1.2" fill="currentColor" stroke="none"/>' +
      '<circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none"/>' +
      '<circle cx="4.5" cy="17" r="1.2" fill="currentColor" stroke="none"/></svg>';
    toc.appendChild(fab);

    const setOpen = (open) => {
      toc.classList.toggle('is-open', open);
      fab.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    closeMobile = () => setOpen(false);

    fab.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!toc.classList.contains('is-open'));
    });

    // Tap anywhere outside the open panel to close it.
    document.addEventListener('click', (e) => {
      if (toc.classList.contains('is-open') && !toc.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  // Smooth scroll
  links.forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', href);
      setActive(target.id);
      closeMobile(); // collapse the floating menu after picking a section
    });
  });

  // Track which section is currently in view.
  // Use a top-anchored line so a section becomes "active" once its top crosses ~25% from the viewport top.
  const observer = new IntersectionObserver(
    (entries) => {
      // Prefer the section closest to (but past) the trigger line.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length) {
        setActive(visible[0].target.id);
      }
    },
    {
      rootMargin: '-25% 0px -65% 0px',
      threshold: 0,
    }
  );

  sections.forEach((s) => observer.observe(s));

  // Initial active
  if (sections[0]) setActive(sections[0].id);
})();

// Carousel (infinite loop via slide cloning)
(() => {
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const track = root.querySelector('.carousel__track');
    const realSlides = Array.from(root.querySelectorAll('.carousel__slide'));
    const prev = root.querySelector('.carousel__btn--prev');
    const next = root.querySelector('.carousel__btn--next');
    const dotsWrap = root.querySelector('.carousel__dots');
    if (!track || !realSlides.length) return;

    const n = realSlides.length;

    // Clone the first and last slides for the infinite loop illusion
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[n - 1].cloneNode(true);
    firstClone.setAttribute('aria-hidden', 'true');
    lastClone.setAttribute('aria-hidden', 'true');
    track.appendChild(firstClone);
    track.insertBefore(lastClone, realSlides[0]);

    // Indexes 0..n+1; real slides live at positions 1..n
    let i = 1;
    let animating = false;

    const dots = realSlides.map((_, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__dot';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', `Screen ${idx + 1}`);
      b.addEventListener('click', () => go(idx + 1));
      dotsWrap && dotsWrap.appendChild(b);
      return b;
    });

    const setActiveDot = () => {
      const real = ((i - 1) % n + n) % n;
      dots.forEach((d, idx) => d.classList.toggle('is-active', idx === real));
    };

    const update = (animate = true) => {
      track.style.transition = animate ? '' : 'none';
      track.style.transform = `translateX(-${i * 100}%)`;
      setActiveDot();
    };

    const go = (target) => {
      if (animating) return;
      animating = true;
      i = target;
      update(true);
    };

    track.addEventListener('transitionend', () => {
      animating = false;
      if (i === 0) {
        i = n;
        update(false);
      } else if (i === n + 1) {
        i = 1;
        update(false);
      }
    });

    prev && prev.addEventListener('click', () => go(i - 1));
    next && next.addEventListener('click', () => go(i + 1));

    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });
    root.tabIndex = 0;

    update(false);
  });
})();
