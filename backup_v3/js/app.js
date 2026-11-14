// ============================================================
// Portfolio v3 — Main Application
// Navbar, scroll progress, section reveals, dynamic rendering, themes
// ============================================================

(function () {
  "use strict";

  // ── Loading Screen ──
  window.addEventListener("load", () => {
    const loader = document.getElementById("loadingScreen");
    if (loader) {
      setTimeout(() => loader.classList.add("hidden"), 400);
    }
  });

  // ── Render Data ──
  document.addEventListener("DOMContentLoaded", () => {
    initThemeToggle();
    renderAbout();
    renderExperience();
    renderProjects();
    renderSkills();
    renderGitHubStats();
    renderContact();
    renderFooter();
    initNavbar();
    initScrollProgress();
    initSectionReveal();
    initScrollToTop();
    lazyLoadThreeScene();
  });

  // ── Theme Toggle (Dark / Light) ──
  function initThemeToggle() {
    const themeBtn = document.getElementById("themeToggle");
    const mobileThemeBtn = document.getElementById("mobileThemeToggle");
    const savedTheme = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    let currentTheme = savedTheme || (prefersLight ? "light" : "dark");
    applyTheme(currentTheme);

    function applyTheme(theme) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
      const isDark = theme === "dark";
      const iconClass = isDark ? "fa-moon" : "fa-sun";

      if (themeBtn) {
        themeBtn.innerHTML = `<i class="fas ${iconClass}"></i>`;
        themeBtn.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} theme`);
      }
      if (mobileThemeBtn) {
        mobileThemeBtn.innerHTML = `<i class="fas ${iconClass}"></i> <span>${isDark ? "Light Mode" : "Dark Mode"}</span>`;
      }
    }

    function toggle() {
      currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(currentTheme);
    }

    if (themeBtn) themeBtn.addEventListener("click", toggle);
    if (mobileThemeBtn) mobileThemeBtn.addEventListener("click", toggle);
  }

  // ── About Section ──
  function renderAbout() {
    const statsEl = document.getElementById("aboutStats");
    if (statsEl) {
      statsEl.innerHTML = STATS.map(
        (s) => `
        <div class="stat-card fade-up">
          <span class="stat-value" data-target="${s.value}" data-suffix="${s.suffix}" data-decimal="${s.isDecimal}">0${s.suffix}</span>
          <span class="stat-label">${s.label}</span>
        </div>`
      ).join("");
    }
    const bioEl = document.getElementById("aboutBio");
    if (bioEl) bioEl.textContent = PERSONAL.bio;
    const eduEl = document.getElementById("aboutEdu");
    if (eduEl) eduEl.textContent = PERSONAL.education;
    const locEl = document.getElementById("aboutLocation");
    if (locEl) locEl.textContent = PERSONAL.location;
    const availEl = document.getElementById("aboutAvailability");
    if (availEl) availEl.textContent = PERSONAL.availability;
  }

  // ── Experience Timeline ──
  function renderExperience() {
    const el = document.getElementById("timeline");
    if (!el) return;
    el.innerHTML = EXPERIENCE.map(
      (exp) => `
      <div class="timeline-item fade-up">
        <div class="timeline-dot ${exp.active ? "active" : ""}"></div>
        <div class="timeline-date">${exp.dateShort}</div>
        <div class="timeline-content">
          <h3 class="timeline-role">${exp.role}</h3>
          <p class="timeline-company">${exp.company}</p>
          <div class="timeline-stack">
            ${exp.stack.map((t) => `<span class="tech-pill">${t}</span>`).join("")}
          </div>
          <ul class="timeline-highlights">
            ${exp.highlights.map((h) => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      </div>`
    ).join("");
  }

  // ── Projects ──
  function renderProjects() {
    const featuredEl = document.getElementById("projectsFeatured");
    if (featuredEl) {
      featuredEl.innerHTML = PROJECTS_FEATURED.map((p) => createFeaturedCard(p)).join("");
      // Tilt effect
      featuredEl.querySelectorAll(".project-card").forEach(initTiltEffect);
    }
    const otherEl = document.getElementById("projectsOther");
    if (otherEl) {
      otherEl.innerHTML = PROJECTS_OTHER.map(
        (p) => `
        <div class="project-mini-card fade-up">
          <div class="mini-card-header">
            <span class="mini-card-emoji">${p.emoji}</span>
            <strong>${p.title}</strong>
          </div>
          <p>${p.description}</p>
          <div class="tech-pills-mini">
            ${p.techStack.map((t) => `<span class="tech-pill">${t}</span>`).join("")}
          </div>
          <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-project" aria-label="View ${p.title} live demo">
            Live <i class="fas fa-external-link-alt"></i>
          </a>
        </div>`
      ).join("");
    }
  }

  function createFeaturedCard(p) {
    const githubBtn = p.githubUrl
      ? `<a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-project outline" aria-label="${p.title} source code"><i class="fab fa-github"></i> Code</a>`
      : "";

    const archHtml = p.architecture
      ? `<div class="detail-section">
          <h4>Architecture & Data Flow</h4>
          <div class="arch-flow">
            ${p.architecture
              .map(
                (step, idx) => `
              <div class="arch-step">
                <div class="arch-icon"><i class="fas ${step.icon}"></i></div>
                <div class="arch-info">
                  <strong>${step.name}</strong>
                  <span>${step.type}</span>
                </div>
              </div>
              ${idx < p.architecture.length - 1 ? '<div class="arch-arrow"><i class="fas fa-chevron-right"></i></div>' : ""}
            `
              )
              .join("")}
          </div>
        </div>`
      : "";

    return `
    <article class="project-card fade-up" data-project="${p.id}">
      <div class="project-card-inner">
        <div class="project-card-header">
          <span class="project-emoji">${p.emoji}</span>
          <h3>${p.title}</h3>
        </div>
        <p class="project-card-description">${p.description}</p>
        <div class="project-card-metrics">
          ${p.metrics.map((m) => `<div class="metric-item"><span class="metric-value">${m.value}</span><span class="metric-label">${m.label}</span></div>`).join("")}
        </div>
        <div class="project-card-stack">
          ${p.techStack.map((t) => `<span class="tech-pill">${t}</span>`).join("")}
        </div>
        <div class="project-card-links">
          <a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-project" aria-label="View ${p.title} live demo">
            Live Demo <i class="fas fa-external-link-alt"></i>
          </a>
          ${githubBtn}
        </div>
        <button class="project-expand-btn" aria-expanded="false" aria-label="Show ${p.title} details">
          <span>View Architecture & Details</span> <i class="fas fa-chevron-down"></i>
        </button>
        <div class="project-card-detail" aria-hidden="true">
          ${archHtml}
          <div class="detail-section">
            <h4>Problem</h4>
            <p>${p.problem}</p>
          </div>
          <div class="detail-section">
            <h4>Solution</h4>
            <p>${p.solution}</p>
          </div>
          <div class="detail-section">
            <h4>Key Features</h4>
            <ul>${p.features.map((f) => `<li>${f}</li>`).join("")}</ul>
          </div>
        </div>
      </div>
    </article>`;
  }

  function initTiltEffect(card) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / 25;
      const y = (e.clientY - rect.top - rect.height / 2) / 25;
      card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    });

    // Expand/collapse detail
    const expandBtn = card.querySelector(".project-expand-btn");
    const detail = card.querySelector(".project-card-detail");
    if (expandBtn && detail) {
      expandBtn.addEventListener("click", () => {
        const isExpanded = detail.classList.toggle("expanded");
        expandBtn.setAttribute("aria-expanded", isExpanded);
        detail.setAttribute("aria-hidden", !isExpanded);
        expandBtn.querySelector("span").textContent = isExpanded ? "Hide Details" : "View Architecture & Details";
        expandBtn.querySelector("i").style.transform = isExpanded ? "rotate(180deg)" : "rotate(0)";
      });
    }
  }

  // ── Skills ──
  function renderSkills() {
    const el = document.getElementById("skillsGrid");
    if (!el) return;
    el.innerHTML = SKILLS.map(
      (s) => `
      <div class="skill-card fade-up">
        <div class="skill-card-header">
          <i class="fas ${s.icon}"></i>
          <h3>${s.category}</h3>
        </div>
        <div class="skill-card-items">
          ${s.items.map((i) => `<span class="skill-pill">${i}</span>`).join("")}
        </div>
      </div>`
    ).join("");
  }

  // ── GitHub Stats ──
  function renderGitHubStats() {
    const el = document.getElementById("githubGrid");
    if (!el || typeof GITHUB_STATS === "undefined") return;

    const languagesHtml = GITHUB_STATS.topLanguages
      .map(
        (l) => `
        <div class="github-lang-item">
          <div class="lang-label">
            <span class="lang-dot" style="background-color: ${l.color}"></span>
            <span>${l.name}</span>
            <span class="lang-percent">${l.percent}%</span>
          </div>
          <div class="lang-bar-bg">
            <div class="lang-bar-fill" style="width: ${l.percent}%; background-color: ${l.color}"></div>
          </div>
        </div>`
      )
      .join("");

    const statsHtml = GITHUB_STATS.stats
      .map(
        (s) => `
        <div class="github-stat-box">
          <span class="stat-num">${s.value}</span>
          <span class="stat-title">${s.label}</span>
        </div>`
      )
      .join("");

    el.innerHTML = `
      <div class="github-card glass-card fade-up">
        <div class="github-card-header">
          <i class="fab fa-github"></i>
          <div>
            <h3>@${GITHUB_STATS.username}</h3>
            <p>GitHub Repository & Code Activity</p>
          </div>
          <a href="${GITHUB_STATS.profileUrl}" target="_blank" rel="noopener noreferrer" class="btn-project outline ms-auto">
            View GitHub <i class="fas fa-external-link-alt"></i>
          </a>
        </div>
        <div class="github-card-body">
          <div class="github-stats-col">
            <h4>Technology Distribution</h4>
            ${languagesHtml}
          </div>
          <div class="github-metrics-col">
            <h4>Activity Highlights</h4>
            <div class="github-metrics-grid">
              ${statsHtml}
            </div>
          </div>
        </div>
      </div>`;
  }

  // ── Contact ──
  function renderContact() {
    const el = document.getElementById("contactLinks");
    if (!el) return;
    const links = [
      { icon: "fa-envelope", label: "Email", href: `mailto:${PERSONAL.email}` },
      { icon: "fa-linkedin-in", label: "LinkedIn", href: PERSONAL.linkedin, external: true },
      { icon: "fa-github", label: "GitHub", href: PERSONAL.github, external: true },
      { icon: "fa-phone", label: "Phone", href: `tel:${PERSONAL.phone}` },
      { icon: "fa-map-marker-alt", label: PERSONAL.location, href: "https://maps.google.com/?q=Mumbai,India", external: true },
    ];
    el.innerHTML = links
      .map(
        (l) => `
      <a href="${l.href}" class="contact-chip" ${l.external ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${l.label}">
        <i class="${l.icon.startsWith("fa-linkedin") || l.icon.startsWith("fa-github") ? "fab" : "fas"} ${l.icon}"></i>
        <span>${l.label}</span>
      </a>`
      )
      .join("");
  }

  // ── Footer ──
  function renderFooter() {
    const el = document.getElementById("footerLinks");
    if (!el) return;
    const socials = [
      { icon: "fab fa-github", href: PERSONAL.github, label: "GitHub" },
      { icon: "fab fa-linkedin-in", href: PERSONAL.linkedin, label: "LinkedIn" },
      { icon: "fas fa-envelope", href: `mailto:${PERSONAL.email}`, label: "Email" },
    ];
    el.innerHTML = socials
      .map(
        (s) => `<a href="${s.href}" ${s.href.startsWith("http") ? 'target="_blank" rel="noopener noreferrer"' : ""} aria-label="${s.label}"><i class="${s.icon}"></i></a>`
      )
      .join("");
  }

  // ── Navbar ──
  function initNavbar() {
    const nav = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navMobile = document.getElementById("navMobile");
    let lastScrollY = 0;
    let ticking = false;

    // Scroll hide/show
    window.addEventListener("scroll", () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.pageYOffset;
          if (currentY > 100) {
            nav.classList.add("scrolled");
            if (currentY > lastScrollY && currentY > 200) {
              nav.classList.add("hidden");
            } else {
              nav.classList.remove("hidden");
            }
          } else {
            nav.classList.remove("scrolled", "hidden");
          }
          lastScrollY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    });

    // Hamburger toggle
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("active");
      navMobile.classList.toggle("open");
      hamburger.setAttribute("aria-expanded", isOpen);
    });

    // Close mobile nav on link click
    navMobile.querySelectorAll(".nav-link, .nav-cta").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMobile.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    // Active section via IntersectionObserver
    const sections = document.querySelectorAll("section[id]");
    const allLinks = document.querySelectorAll(".nav-link[data-section]");
    const mobileLinks = navMobile.querySelectorAll(".nav-link");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            allLinks.forEach((l) => l.classList.toggle("active", l.dataset.section === id));
            mobileLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
          }
        });
      },
      { threshold: 0.15, rootMargin: "-80px 0px -40% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  // ── Scroll Progress ──
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;
    window.addEventListener("scroll", () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(scrollTop / docHeight) * 100}%`;
    });
  }

  // ── Section Reveal (IntersectionObserver) ──
  function initSectionReveal() {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const elements = document.querySelectorAll(".fade-up");

    if (prefersReduced) {
      elements.forEach((el) => el.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    elements.forEach((el) => observer.observe(el));
  }

  // ── Scroll to Top ──
  function initScrollToTop() {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.pageYOffset > 400);
    });
    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ── Lazy-load Three.js Hero ──
  function lazyLoadThreeScene() {
    const canvas = document.getElementById("hero-canvas");
    const fallback = document.getElementById("heroFallback");
    if (!canvas) return;

    // Show fallback immediately
    if (fallback) fallback.style.display = "block";

    // Check reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Check mobile
    if (window.innerWidth < 768) return;

    // Lazy load Three.js after first paint
    requestAnimationFrame(() => {
      const threeScript = document.createElement("script");
      threeScript.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
      threeScript.onload = () => {
        const sceneScript = document.createElement("script");
        sceneScript.src = "js/three-scene.js";
        sceneScript.onload = () => {
          if (typeof initHeroScene === "function") {
            initHeroScene(canvas);
            canvas.style.display = "block";
            if (fallback) fallback.style.display = "none";
          }
        };
        document.head.appendChild(sceneScript);
      };
      document.head.appendChild(threeScript);
    });
  }
})();
