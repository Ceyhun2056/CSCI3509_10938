// Builds the class wall website from the files in students/.
// Usage:
//   node build.js --check   -> only validate student files (used by CI)
//   node build.js           -> validate + build the site into dist/ (used by CD)

const fs = require("fs");
const path = require("path");

const STUDENTS_DIR = path.join(__dirname, "students");
const DIST_DIR = path.join(__dirname, "dist");
const checkOnly = process.argv.includes("--check");

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// 1. Read and validate every student file
const errors = [];
const people = [];
const files = fs
  .readdirSync(STUDENTS_DIR)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"))
  .sort();

for (const file of files) {
  const where = `students/${file}`;
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(STUDENTS_DIR, file), "utf8"));
  } catch (e) {
    errors.push(`${where}: is not valid JSON (${e.message})`);
    continue;
  }
  if (typeof data.name !== "string" || !data.name.trim()) errors.push(`${where}: "name" is missing or empty`);
  if (typeof data.message !== "string" || !data.message.trim()) errors.push(`${where}: "message" is missing or empty`);
  else if (data.message.length > 140) errors.push(`${where}: "message" is longer than 140 characters`);
  if (data.emoji !== undefined && typeof data.emoji !== "string") errors.push(`${where}: "emoji" must be text`);
  people.push(data);
}

if (errors.length) {
  console.error("❌ Found problems in student files:\n");
  errors.forEach((e) => console.error("  - " + e));
  console.error("\nFix these and push again.");
  process.exit(1);
}

console.log(`✅ ${files.length} student file(s) look good.`);
if (checkOnly) process.exit(0);

// 2. Build the website
const motto = fs.existsSync("motto.txt") ? fs.readFileSync("motto.txt", "utf8").trim() : "";
const commit = (process.env.GITHUB_SHA || "local").slice(0, 7);
const builtAt = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

const cards = people
  .map(
    (p) => `
      <article class="card">
        <div class="emoji">${escapeHtml(p.emoji || "👋")}</div>
        <h2>${escapeHtml(p.name)}</h2>
        <p>${escapeHtml(p.message)}</p>
      </article>`
  )
  .join("");

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Class Wall</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Our Class Wall</h1>
    ${motto ? `<p class="motto">“${escapeHtml(motto)}”</p>` : ""}
    <p class="count">${people.length} student${people.length === 1 ? "" : "s"} shipped to production</p>
  </header>
  <main class="grid">${cards || '<p class="empty">No one yet. Be the first to open a pull request!</p>'}
  </main>
  <footer>Deployed from commit <code>${commit}</code> at ${builtAt}</footer>
</body>
</html>`;

fs.mkdirSync(DIST_DIR, { recursive: true });
fs.writeFileSync(path.join(DIST_DIR, "index.html"), html);
fs.copyFileSync(path.join(__dirname, "style.css"), path.join(DIST_DIR, "style.css"));
console.log("🚀 Site built into dist/");
