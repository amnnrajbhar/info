// ============================================================
// Portfolio v3 — GSAP Scroll Animations
// Counter animations, timeline reveals, staggered entries
// ============================================================

(function () {
  "use strict";

  // Wait for GSAP to be available
  function waitForGSAP(cb) {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      cb();
    } else {
      setTimeout(() => waitForGSAP(cb), 100);
    }
  }

  waitForGSAP(() => {
    // Check reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Show final counter values immediately
      animateCountersImmediate();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ── Stat Counter Animation ──
    const statValues = document.querySelectorAll(".stat-value");
    statValues.forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const isDecimal = el.dataset.decimal === "true";

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(
            { val: 0 },
            {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: function () {
                const v = this.targets()[0].val;
                el.textContent = (isDecimal ? v.toFixed(1) : Math.round(v)) + suffix;
              },
            }
          );
        },
      });
    });

    // ── Timeline Line Draw ──
    const timeline = document.querySelector(".timeline");
    if (timeline) {
      gsap.fromTo(
        timeline,
        { "--line-height": "0%" },
        {
          "--line-height": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: timeline,
            start: "top 80%",
            end: "bottom 60%",
            scrub: 0.8,
          },
        }
      );
    }

    // ── Timeline Items Stagger ──
    const timelineItems = document.querySelectorAll(".timeline-item");
    timelineItems.forEach((item, i) => {
      gsap.from(item, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        delay: i * 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%",
          once: true,
        },
      });
    });

    // ── Project Cards Stagger ──
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.6,
        delay: i * 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true,
        },
      });
    });

    // ── Skill Cards Stagger ──
    const skillCards = document.querySelectorAll(".skill-card");
    skillCards.forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 30,
        scale: 0.95,
        duration: 0.5,
        delay: i * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          once: true,
        },
      });
    });

    // ── Hero Text Stagger ──
    const heroEls = document.querySelectorAll(".hero-text .fade-up");
    gsap.from(heroEls, {
      opacity: 0,
      y: 30,
      stagger: 0.12,
      duration: 0.7,
      ease: "power3.out",
      delay: 0.5,
    });

    // ── CTA Card Pop ──
    const ctaCard = document.querySelector(".cta-card");
    if (ctaCard) {
      gsap.from(ctaCard, {
        opacity: 0,
        y: 50,
        scale: 0.96,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ctaCard,
          start: "top 85%",
          once: true,
        },
      });
    }
  });

  // Immediate counters for reduced motion
  function animateCountersImmediate() {
    document.querySelectorAll(".stat-value").forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const isDecimal = el.dataset.decimal === "true";
      el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
    });
  }
})();
