// ============================================================
// Portfolio v4 — Smooth scroll (Lenis) + scroll animations (GSAP)
// ============================================================
(() => {
  "use strict";
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  // Fallback: no GSAP (CDN blocked) or reduced motion → just show everything
  if (!hasGSAP || REDUCED) {
    document.body.classList.remove("js-anim");
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis smooth scrolling ---------- */
  if (typeof Lenis !== "undefined") {
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    if (document.body.classList.contains("is-loading")) lenis.stop();
    window.addEventListener("app:ready", () => lenis.start(), { once: true });
  }

  /* ---------- Hero intro (after boot) ---------- */
  window.addEventListener("app:ready", () => {
    gsap.fromTo(".reveal-hero",
      { opacity: 0, y: 40, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "expo.out", stagger: 0.09, clearProps: "transform,filter" });
    gsap.from(".nav", { y: -30, opacity: 0, duration: 0.9, ease: "expo.out", clearProps: "transform,opacity" });
    setupScroll();
  }, { once: true });

  function setupScroll() {
    // Hero parallax out
    gsap.to(".hero-copy", { yPercent: -18, opacity: 0.2, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-term", { yPercent: -8, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Section headers
    gsap.utils.toArray(".sec-head").forEach((h) => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: "top 85%" } });
      tl.from(h.querySelector(".sec-num"), { scale: 0, opacity: 0, duration: 0.5, ease: "back.out(2)" })
        .from(h.querySelector(".sec-title"), { x: -30, opacity: 0, duration: 0.8, ease: "expo.out" }, "-=0.25")
        .from(h.querySelector(".sec-line"), { scaleX: 0, duration: 1, ease: "expo.out" }, "-=0.6");
      typeTitle(h.querySelector(".sec-title"));
    });

    // Generic reveals, batched for stagger
    ScrollTrigger.batch(".reveal", {
      start: "top 88%",
      once: true,
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, clearProps: "transform" }),
    });

    // About code lines cascade
    gsap.from("#aboutCode .ln", { opacity: 0, x: -12, duration: 0.5, stagger: 0.04, ease: "power2.out", scrollTrigger: { trigger: "#aboutCode", start: "top 80%" } });

    // Git log rail fills as you scroll
    gsap.to("#gitlogFill", { scaleY: 1, ease: "none", scrollTrigger: { trigger: "#gitlog", start: "top 70%", end: "bottom 60%", scrub: true } });

    // Project architecture nodes
    gsap.utils.toArray(".project").forEach((p) => {
      gsap.from(p.querySelectorAll(".arch-node"), { x: -30, opacity: 0, duration: 0.7, stagger: 0.12, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 75%" } });
      gsap.from(p.querySelector(".project-idx"), { yPercent: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: p, start: "top 75%" } });
    });

    // Language bar grows
    gsap.from(".lang-bar span", { scaleX: 0, duration: 1.2, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: ".gh", start: "top 80%" } });

    // Contact headline
    gsap.from(".contact-big", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".contact", start: "top 70%" } });

    // Dim the WebGL background once past the hero
    ScrollTrigger.create({
      trigger: ".hero", start: "bottom 60%",
      onEnter: () => (document.getElementById("webgl").style.opacity = 0.45),
      onLeaveBack: () => (document.getElementById("webgl").style.opacity = 1),
    });

    // Re-measure after fonts/images settle
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  // Type section titles like a terminal once visible
  function typeTitle(el) {
    if (!el) return;
    const com = el.querySelector(".c-com");
    const textNode = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
    if (!textNode) return;
    const full = textNode.textContent;
    textNode.textContent = full.replace(/\S/g, " ");
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => {
        let i = 0;
        const id = setInterval(() => {
          i++;
          textNode.textContent = full.slice(0, i) + full.slice(i).replace(/\S/g, " ");
          if (i >= full.length) clearInterval(id);
        }, 38);
      },
    });
    if (com) com.style.marginRight = "0";
  }
})();
