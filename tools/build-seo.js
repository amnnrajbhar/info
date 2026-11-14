// ============================================================
// build-seo.js — pre-renders crawlable HTML from js/data.js
//
// Most of the page is rendered by JavaScript. Google runs JS, but many
// crawlers (LinkedIn, Bing previews, AI/answer engines, job boards) don't.
// This script writes plain semantic HTML for each section into index.html
// between <!--SEO:name--> ... <!--/SEO:name--> markers. app.js removes
// these .seo-fallback blocks on load and renders the animated version.
//
// Run after editing js/data.js:   node tools/build-seo.js
// ============================================================
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dataSrc = fs.readFileSync(path.join(root, "js/data.js"), "utf8");
const D = new Function(`${dataSrc}; return { PERSONAL, STATS, EXPERIENCE, PROJECTS_FEATURED, PROJECTS_OTHER, SKILLS, PLAYBOOK, DOMAINS };`)();

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const link = (url, text) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>`;

const blocks = {
  about: `<div class="seo-fallback">
  <p>${esc(D.PERSONAL.bio)}</p>
  <ul>
    <li>Role: ${esc(D.PERSONAL.title)}</li>
    <li>Location: ${esc(D.PERSONAL.location)}</li>
    <li>Education: ${esc(D.PERSONAL.education)}</li>
    ${D.STATS.map((s) => `<li>${esc(s.value)}${esc(s.suffix)} ${esc(s.label)}</li>`).join("\n    ")}
  </ul>
</div>`,

  approach: `<div class="seo-fallback">
  <ol>
${D.PLAYBOOK.map((p) => `    <li><strong>${esc(p.title)}:</strong> ${esc(p.text)} (Proof: ${esc(p.proof)})</li>`).join("\n")}
  </ol>
  <p>Domains: ${esc(D.DOMAINS.join(", "))}</p>
</div>`,

  experience: `<div class="seo-fallback">
${D.EXPERIENCE.map((x) => `  <article>
    <h3>${esc(x.role)} at ${esc(x.company)}${x.clients?.length ? ` (clients: ${esc(x.clients.map((c) => c.name).join(", "))})` : ""}</h3>
    <p>${esc(x.dates)}</p>
    <ul>${x.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>
    <p>Tech: ${esc(x.stack.join(", "))}</p>
  </article>`).join("\n")}
</div>`,

  projects: `<div class="seo-fallback">
${D.PROJECTS_FEATURED.map((p) => `  <article>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.description)}</p>
    <p>Problem: ${esc(p.problem)}</p>
    <p>Solution: ${esc(p.solution)}</p>
    <p>Tech: ${esc(p.techStack.join(", "))}</p>
    <p>${p.liveUrl ? link(p.liveUrl, `${p.title} live demo`) : ""} ${p.githubUrl ? link(p.githubUrl, `${p.title} source code`) : ""}</p>
  </article>`).join("\n")}
</div>`,

  others: `<div class="seo-fallback">
  <ul>
${D.PROJECTS_OTHER.map((p) => `    <li>${link(p.liveUrl, p.title)}: ${esc(p.description)} (${esc(p.techStack.join(", "))})</li>`).join("\n")}
  </ul>
</div>`,

  skills: `<div class="seo-fallback">
  <ul>
${D.SKILLS.map((c) => `    <li><strong>${esc(c.category)}:</strong> ${esc(c.items.join(", "))}</li>`).join("\n")}
  </ul>
</div>`,
};

// where each block lives (inserted right after the opening tag of the container)
const anchors = {
  about: '<div class="stats" id="stats">',
  approach: '<ol class="playbook" id="playbook">',
  experience: '<span class="gitlog-rail"><span class="gitlog-fill" id="gitlogFill"></span></span>',
  projects: '<div class="featured" id="featured">',
  others: '<div class="others" id="others">',
  skills: '<div class="skills-panel" id="skillsPanel">',
};

const file = path.join(root, "index.html");
let html = fs.readFileSync(file, "utf8");
for (const [name, anchor] of Object.entries(anchors)) {
  const re = new RegExp(`<!--SEO:${name}-->[\\s\\S]*?<!--/SEO:${name}-->`);
  const block = `<!--SEO:${name}-->\n${blocks[name]}\n<!--/SEO:${name}-->`;
  if (re.test(html)) html = html.replace(re, block);
  else {
    if (!html.includes(anchor)) throw new Error(`anchor not found for ${name}`);
    html = html.replace(anchor, `${anchor}${block}`);
  }
}
fs.writeFileSync(file, html);
console.log("✔ SEO fallback content written to index.html");
