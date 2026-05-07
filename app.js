document.body.classList.add("is-loading");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function markReady() {
  requestAnimationFrame(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  });
}

function setYear() {
  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }
}

function collectMotionTargets() {
  const selectors = [
    ".hero-text > *",
    ".hero-card",
    ".sidebar-card",
    ".info-card",
    ".timeline-item",
    ".project-card",
    ".credentials li",
    ".contact-card",
    ".experience-links a"
  ];

  const nodes = new Set();
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => nodes.add(node));
  });

  return Array.from(nodes);
}

function applyStagger() {
  const sections = document.querySelectorAll(".section, .hero, .sidebar, .site-footer");

  sections.forEach((section) => {
    const items = section.querySelectorAll(
      ".hero-text > *, .hero-card, .info-card, .timeline-item, .project-card, .credentials li, .contact-card, .experience-links a, .sidebar-card"
    );

    items.forEach((item, index) => {
      item.classList.add("motion-item");
      item.style.setProperty("--stagger", `${Math.min(index, 8) * 55}ms`);
    });
  });
}

function setupReveal() {
  const targets = collectMotionTargets();
  targets.forEach((node) => node.classList.add("motion-item"));

  if (reduceMotion) {
    targets.forEach((node) => node.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -12% 0px" }
  );

  targets.forEach((node) => observer.observe(node));
}

function setupActiveNav() {
  const sideLinks = document.querySelectorAll(".side-menu a[href^='#']");
  const sections = document.querySelectorAll("section[id]");
  if (!sideLinks.length || !sections.length) return;

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        sideLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", active);
        });
      });
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: 0.1 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

setYear();
applyStagger();
setupReveal();
setupActiveNav();
markReady();
