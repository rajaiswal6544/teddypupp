// End-to-end smoke tests: node tests/e2e.cjs [baseUrl]
// Uses the Playwright library directly (no test runner needed).
const { chromium, devices } = require("playwright");

(async () => {
const BASE = process.argv[2] ?? "http://localhost:3000";
const results = [];
const check = async (name, fn) => {
  try {
    await fn();
    results.push(["PASS", name]);
  } catch (e) {
    results.push(["FAIL", name, String(e.message).split("\n")[0]]);
  }
};
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};

const browser = await chromium.launch();
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await desktop.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(`${page.url()} ${e.message}`));
page.on("console", (m) => m.type() === "error" && !/status of 404/.test(m.text()) && errors.push(`${page.url()} ${m.text()}`));
const go = async (path) => {
  await page.goto(BASE + path, { waitUntil: "load" });
  await page.waitForTimeout(1300); // let the intro curtain lift
};

for (const path of ["/", "/puppies", "/puppies/maltipoo-max-male", "/puppies/pomeranian-ace-boy", "/happy-families", "/how-it-works", "/faq", "/contact", "/gone-home"]) {
  await check(`renders ${path}`, async () => {
    const res = await page.goto(BASE + path, { waitUntil: "load" });
    expect(res.status() === 200, `status ${res.status()}`);
    expect((await page.locator("h1").count()) >= 1, "no h1");
  });
}

await check("404 page for unknown route", async () => {
  const res = await page.goto(BASE + "/no-such-page", { waitUntil: "load" });
  expect(res.status() === 404, `status ${res.status()}`);
  expect(await page.getByText("have you seen this page?").isVisible(), "poster missing");
});

await check("curtain transition navigates between pages", async () => {
  await go("/");
  await page.locator(".tp-header__nav a", { hasText: "FAQ" }).click();
  await page.waitForURL("**/faq", { timeout: 5000 });
  await page.waitForTimeout(900);
  expect((await page.locator(".tp-curtain").getAttribute("data-state")) === "idle", "curtain not idle");
  expect((await page.locator('.tp-nav-link[aria-current="page"]').innerText()).includes("FAQ"), "active nav not updated");
});

await check("hero lineup swaps puppies", async () => {
  await go("/");
  const before = await page.locator(".tp-lineup__pup").evaluateAll((as) => as.map((a) => a.getAttribute("href")).join());
  await page.waitForTimeout(4200);
  const after = await page.locator(".tp-lineup__pup").evaluateAll((as) => as.map((a) => a.getAttribute("href")).join());
  expect(before !== after, "lineup did not change");
});

await check("meet the pups pins and opens doors on scroll", async () => {
  await go("/");
  expect((await page.locator(".tp-meet").getAttribute("data-pinned")) === "true", "not pinned");
  const y = await page.locator(".tp-meet [data-pin-range]").evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => window.scrollTo(0, y + 1400), y);
  await page.waitForTimeout(600);
  const t = await page.locator(".tp-meet__track").evaluate((e) => e.style.transform);
  expect(t.includes("translateX(-"), `track not moving: ${t}`);
  expect((await page.locator('.tp-door[data-open="true"]').count()) >= 3, "doors not opening");
});

await check("home polaroid opens the photo viewer", async () => {
  await go("/");
  await page.locator(".tp-photowall__print").first().scrollIntoViewIfNeeded();
  await page.locator(".tp-photowall__print").first().click();
  const dlg = page.locator('dialog[aria-label="Photo viewer"][open]');
  await dlg.waitFor({ timeout: 3000 });
  expect((await dlg.innerText()).includes("1 / 64"), "counter wrong");
  await dlg.getByRole("button", { name: "Next" }).click();
  expect((await dlg.innerText()).includes("2 / 64"), "next failed");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  expect((await page.locator("dialog[open]").count()) === 0, "did not close");
});

await check("puppy filters narrow the list", async () => {
  await go("/puppies");
  await page.getByRole("button", { name: "Poodle" }).click();
  const n = await page.locator(".tp-sketches li").count();
  expect(n === 2, `expected 2 poodles, got ${n}`);
  expect((await page.locator('[aria-live="polite"]').first().innerText()).includes("2 puppies"), "count text");
  await page.getByRole("button", { name: "Boys" }).click();
  expect((await page.locator(".tp-sketches li").count()) === 1, "boy poodles");
});

await check("puppy filters honour ?breed= links", async () => {
  await go("/puppies?breed=shih-tzu");
  expect((await page.locator(".tp-sketches li").count()) === 2, "shih tzu link");
});

await check("gallery flips photos and opens full screen", async () => {
  await go("/puppies/maltipoo-max-male");
  await page.getByRole("button", { name: "Next photo" }).click();
  expect((await page.locator(".tp-storypage").innerText()).includes("2 / 2"), "counter");
  await page.locator(".tp-storypage__leaf").click();
  await page.locator('dialog[aria-label="Max photos"][open] video').waitFor({ timeout: 3000 });
  await page.keyboard.press("Escape");
});

await check("enquiry form validates then submits", async () => {
  await go("/puppies/maltipoo-max-male");
  const form = page.locator(".tp-letter form");
  await form.scrollIntoViewIfNeeded();
  await form.getByRole("button", { name: "Send enquiry" }).click();
  expect((await form.locator('[aria-invalid="true"]').count()) === 2, "expected name+phone errors");
  await form.getByLabel("Your name").fill("Test Person");
  await form.getByLabel("Phone or WhatsApp").fill("+971 50 123 4567");
  await form.getByRole("button", { name: "Send enquiry" }).click();
  await page.getByText("Thank you — we got your message!").waitFor({ timeout: 5000 });
});

await check("contact letter is posted", async () => {
  await go("/contact");
  await page.getByRole("button", { name: "Post my letter" }).click();
  expect(await page.locator(".tp-letterform__alert").isVisible(), "no validation alert");
  await page.getByLabel("Your name (required)").fill("Test Person");
  await page.getByLabel(/Phone or WhatsApp number/).fill("+971501234567");
  await page.getByRole("button", { name: "Post my letter" }).click();
  await page.getByText("letter received!").waitFor({ timeout: 6000 });
});

await check("FAQ search filters and notes unfold", async () => {
  await go("/faq");
  await page.getByLabel("sniff out a question").fill("Korea");
  await page.waitForTimeout(200);
  const n = await page.locator(".tp-note:not(.tp-note--empty)").count();
  expect(n >= 1 && n < 9, `search count ${n}`);
  expect((await page.locator(".tp-note mark").count()) > 0, "no highlight");
  await page.getByLabel("sniff out a question").fill("");
  const btn = page.locator(".tp-note__q button").first();
  await btn.click();
  expect((await btn.getAttribute("aria-expanded")) === "true", "did not unfold");
  await page.getByLabel("sniff out a question").fill("zzzz");
  expect(await page.locator(".tp-note--empty").isVisible(), "no empty state");
});

await check("how-it-works tabs switch journeys", async () => {
  await go("/how-it-works");
  expect(await page.locator("#panel-imported").isHidden(), "imported should start hidden");
  await page.getByRole("tab", { name: /Imported/ }).click();
  expect(await page.locator("#panel-local").isHidden(), "local should hide");
  expect(await page.locator("#panel-imported").isVisible(), "imported should show");
});

await check("API rejects invalid enquiries", async () => {
  const res = await page.request.post(BASE + "/api/enquiry", { data: { name: "", phone: "abc" } });
  expect(res.status() === 422, `status ${res.status()}`);
  const ok = await page.request.post(BASE + "/api/enquiry", { data: { name: "Bo", phone: "+971501234567" } });
  expect(ok.status() === 200, `ok status ${ok.status()}`);
});

const mobile = await browser.newContext({ ...devices["iPhone 13"] });
const m = await mobile.newPage();
await check("mobile menu opens, navigates and closes", async () => {
  await m.goto(BASE + "/", { waitUntil: "load" });
  await m.waitForTimeout(1300);
  await m.getByRole("button", { name: "Menu" }).click();
  const dlg = m.locator('dialog[aria-label="Site menu"][open]');
  await dlg.waitFor({ timeout: 3000 });
  await dlg.getByRole("link", { name: "Happy families" }).click();
  await m.waitForURL("**/happy-families", { timeout: 5000 });
  await m.waitForTimeout(800);
  expect((await m.locator("dialog[open]").count()) === 0, "menu still open");
  expect(await m.locator("[data-whatsapp-bar]").isVisible(), "mobile bar hidden");
});

await check("no console errors or hydration warnings", async () => {
  expect(errors.length === 0, errors.slice(0, 3).join(" | "));
});

await browser.close();
for (const r of results) console.log(r.join("  "));
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} passed`);
process.exit(failed ? 1 : 0);
})();
