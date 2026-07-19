/**
 * YGN Arcade hub — renders games from games.json
 */
(async () => {
  const grid = document.getElementById("game-grid");
  const countEl = document.getElementById("game-count");
  const ghLink = document.getElementById("github-link");

  let data;
  try {
    const res = await fetch("./games.json", { cache: "no-cache" });
    data = await res.json();
  } catch (err) {
    grid.innerHTML = `<p class="lede">Could not load games.json — open via a local server (not file://).</p>`;
    return;
  }

  // Optional: point GitHub nav at your repo
  if (data.github) {
    ghLink.href = data.github;
    ghLink.hidden = false;
  } else {
    ghLink.hidden = true;
  }

  const games = data.games || [];
  const playable = games.filter((g) => g.status !== "coming-soon").length;
  countEl.textContent = `${playable} playable · ${games.length} total`;

  grid.innerHTML = games.map(cardHTML).join("");
})();

function cardHTML(g) {
  const soon = g.status === "coming-soon";
  const href = soon ? "#" : `./games/${g.id}/`;
  const tags = (g.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const badge = soon
    ? `<span class="badge soon">Soon</span>`
    : g.badge
      ? `<span class="badge new">${esc(g.badge)}</span>`
      : "";

  const inner = `
    <div class="card-cover" style="--cover:${esc(g.cover || "linear-gradient(135deg,#444,#222)")}">
      <div class="pattern"></div>
      ${badge}
      <span class="emoji" aria-hidden="true">${g.emoji || "🎮"}</span>
    </div>
    <div class="card-body">
      <h3>${esc(g.title)}</h3>
      ${g.subtitle ? `<div class="subtitle">${esc(g.subtitle)}</div>` : ""}
      <p>${esc(g.blurb || "")}</p>
      <div class="tags">${tags}</div>
      <span class="play-btn ${soon ? "disabled" : ""}">
        ${soon ? "Coming soon" : "Play →"}
      </span>
    </div>
  `;

  if (soon) {
    return `<article class="game-card coming-soon">${inner}</article>`;
  }
  return `<a class="game-card" href="${href}">${inner}</a>`;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
