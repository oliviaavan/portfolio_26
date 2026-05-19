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
