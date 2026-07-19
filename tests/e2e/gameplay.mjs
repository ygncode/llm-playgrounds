import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = "e2e-shots";
mkdirSync(OUT, { recursive: true });

const failures = [];
const report = [];

function fail(msg) { failures.push(msg); }
function log(msg) { report.push(msg); }
async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` });
  log(`✓ ${name}.png`);
}

async function openPhone(browser, width, height, name) {
  const context = await browser.newContext({
    viewport: { width, height },
    screen: { width, height },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1",
  });
  // deterministic first endless zombie: row 2
  await context.addInitScript(() => {
    Math.random = () => 0.5;
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => fail(`[${name}] page error: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error") fail(`[${name}] console: ${m.text()}`); });
  return { context, page };
}

async function metrics(page) {
  return await page.evaluate(() => {
    const rect = (sel) => {
      const e = document.querySelector(sel);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { l:+r.left.toFixed(1), t:+r.top.toFixed(1), r:+r.right.toFixed(1), b:+r.bottom.toFixed(1), w:+r.width.toFixed(1), h:+r.height.toFixed(1) };
    };
    const vw = innerWidth, vh = innerHeight;
    const seeds = [...document.querySelectorAll(".seed-packet")].map((e) => {
      const r = e.getBoundingClientRect();
      return { id:e.dataset.id, l:r.left, r:r.right, t:r.top, b:r.bottom };
    });
    return {
      vw, vh,
      lawn: rect("#lawn"),
      hud: rect(".hud"),
      seedBar: rect("#seed-bar"),
      hudRight: rect(".hud-right"),
      shovel: rect("#shovel-slot"),
      progress: rect("#progress"),
      mowers: [...document.querySelectorAll(".mow")].map((e) => {
        const r = e.getBoundingClientRect();
        return { l:+r.left.toFixed(1), t:+r.top.toFixed(1), r:+r.right.toFixed(1), b:+r.bottom.toFixed(1), w:+r.width.toFixed(1), h:+r.height.toFixed(1) };
      }),
      seedCount: seeds.length,
      allSeedsVisible: seeds.every((s) => s.l >= -1 && s.r <= vw + 1 && s.t >= -1 && s.b <= vh + 1),
      pageScroll: { sw: document.documentElement.scrollWidth, sh: document.documentElement.scrollHeight },
      rotate: document.body.classList.contains("need-landscape"),
      plants: document.querySelectorAll(".plant").length,
      zombies: document.querySelectorAll(".zombie").length,
      peas: document.querySelectorAll(".pea").length,
      paused: !document.querySelector("#pause-overlay")?.classList.contains("hidden"),
    };
  });
}

async function startEndless(page) {
  await page.goto(`${BASE}/games/pagoda-patch/`, { waitUntil: "networkidle" });
  await page.tap("#btn-endless");
  await page.waitForTimeout(700);
}

async function testCombat(browser) {
  const { context, page } = await openPhone(browser, 844, 390, "combat");
  await startEndless(page);

  let m = await metrics(page);
  log(`combat initial: ${JSON.stringify(m)}`);
  if (m.rotate) fail("combat: landscape incorrectly rotate-gated");
  if (m.seedCount < 9) fail(`combat: expected many endless seeds, got ${m.seedCount}`);

  // Plant peashooter in deterministic zombie row 2
  await page.locator('.seed-packet[data-id="peashooter"]').tap();
  await page.locator('.cell[data-row="2"][data-col="2"]').tap({ force: true });
  await page.waitForTimeout(300);
  if (await page.locator(".plant.peashooter").count() !== 1) fail("combat: peashooter was not planted by touch");

  // Pause and resume
  await page.tap("#btn-pause");
  await page.waitForTimeout(150);
  if (!(await page.locator("#pause-overlay").isVisible())) fail("combat: pause overlay did not open");
  await shot(page, "30-mobile-pause");
  await page.tap("#btn-resume");
  await page.waitForTimeout(150);
  if (await page.locator("#pause-overlay").isVisible()) fail("combat: resume did not close overlay");

  // Wait for first deterministic endless zombie and detect a shot at any sample
  let sawZombie = false, sawPea = false;
  for (let i = 0; i < 32; i++) {
    await page.waitForTimeout(250);
    const z = await page.locator(".zombie").count();
    const p = await page.locator(".pea").count();
    sawZombie ||= z > 0;
    sawPea ||= p > 0;
    if (sawZombie && sawPea) break;
  }
  if (!sawZombie) fail("combat: no zombie spawned after 8s");
  if (!sawPea) fail("combat: peashooter never fired at same-row zombie");

  // Confirm projectiles actually damage zombies
  let sawDamage = false;
  for (let i = 0; i < 16; i++) {
    const hp = await page.locator(".zombie .hp-fill").first().getAttribute("style").catch(() => "");
    const match = hp?.match(/width:\s*([\d.]+)%/);
    if (match && Number(match[1]) < 100) { sawDamage = true; break; }
    await page.waitForTimeout(200);
  }
  if (!sawDamage && await page.locator(".zombie").count()) fail("combat: pea did not reduce zombie HP");

  // Collect a sky sun via touch and verify energy increases
  const sun = page.locator(".sun").first();
  if (await sun.count()) {
    const before = Number(await page.locator("#sun-count").textContent());
    await sun.tap({ force: true });
    await page.waitForTimeout(120);
    const after = Number(await page.locator("#sun-count").textContent());
    if (after <= before) fail(`combat: collecting sun did not increase energy (${before} → ${after})`);
  } else {
    fail("combat: expected a falling sky sun");
  }

  await shot(page, "31-mobile-combat");

  // Shovel plant via touch
  await page.tap("#shovel-slot");
  await page.locator('.cell[data-row="2"][data-col="2"]').tap({ force: true });
  await page.waitForTimeout(200);
  if (await page.locator(".plant.peashooter").count()) fail("combat: shovel did not remove plant");

  // Mute toggle
  const beforeMute = await page.locator("#btn-mute").textContent();
  await page.tap("#btn-mute");
  const afterMute = await page.locator("#btn-mute").textContent();
  if (beforeMute === afterMute) fail("combat: mute UI did not toggle");

  await context.close();
}

async function testViewport(browser, width, height, name) {
  const { context, page } = await openPhone(browser, width, height, name);
  await startEndless(page);
  await page.waitForTimeout(350);
  const m = await metrics(page);
  log(`${name}: ${JSON.stringify(m)}`);
  await shot(page, `40-${name}`);

  if (m.rotate) fail(`${name}: landscape incorrectly gated`);
  if (!m.lawn || m.lawn.l < -1 || m.lawn.r > width + 1) fail(`${name}: lawn clipped horizontally ${JSON.stringify(m.lawn)}`);
  if (!m.lawn || m.lawn.t < (m.hud?.b || 0) - 2 || m.lawn.b > (m.progress?.t || height) + 2) {
    fail(`${name}: lawn clipped vertically ${JSON.stringify(m.lawn)}`);
  }
  if (!m.hudRight || m.hudRight.r > width + 1) fail(`${name}: right controls clipped`);
  if (m.pageScroll.sw > width + 2 || m.pageScroll.sh > height + 2) fail(`${name}: viewport overflow ${JSON.stringify(m.pageScroll)}`);
  if (!m.shovel || m.shovel.r > width + 1 || m.shovel.b > height + 1) fail(`${name}: shovel clipped`);

  // First 3 essential packets must be visible even when extras scroll
  const essential = await page.evaluate(() => [...document.querySelectorAll(".seed-packet")].slice(0,3).every((e) => {
    const r=e.getBoundingClientRect(); return r.left>=0 && r.right<=innerWidth;
  }));
  if (!essential) fail(`${name}: essential seed packets clipped`);

  await context.close();
}

async function testRotate(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    screen: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/games/pagoda-patch/`, { waitUntil: "networkidle" });
  await page.tap("#btn-endless");
  await page.waitForTimeout(500);
  if (!(await page.locator("#rotate-overlay").isVisible())) fail("rotate: overlay missing in portrait gameplay");

  // Simulate turning phone to landscape and ensure game reflows / unlocks
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(600);
  if (await page.locator("#rotate-overlay").isVisible()) fail("rotate: overlay remained after landscape resize");
  const m = await metrics(page);
  if (!m.lawn || m.lawn.r > 845 || m.lawn.b > 391) fail(`rotate: lawn bad after rotation ${JSON.stringify(m.lawn)}`);
  await shot(page, "50-after-portrait-to-landscape");
  await context.close();
}

const browser = await chromium.launch({ headless: true });
try {
  await testCombat(browser);
  await testViewport(browser, 667, 375, "iphone-se-land");
  await testViewport(browser, 740, 360, "android-small-land");
  await testViewport(browser, 568, 320, "tiny-land");
  await testViewport(browser, 1024, 768, "tablet-land");
  await testRotate(browser);
} finally {
  await browser.close();
}

console.log("\n=== GAMEPLAY E2E ===");
report.forEach((r) => console.log(r));
console.log("\n=== FAILURES ===");
failures.forEach((f) => console.log("✗", f));
if (!failures.length) console.log("none");
process.exit(failures.length ? 1 : 0);
