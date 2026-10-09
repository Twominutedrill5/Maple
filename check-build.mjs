// check-build.mjs — Maple's Dog Grooming
//
// Runs after `vite build` and fails if the built site points at anything
// that isn't actually there. Catches the class of bug where the source works
// in `npm run dev` but the production build is quietly missing files.
//
// Two checks:
//   1. Every /path referenced by the built HTML exists in dist/
//   2. No source .js writes an asset path as a plain string — Vite can't
//      rewrite those when it renames files, so they break only in a build

import { readdir, readFile, access } from "node:fs/promises";
import { join, extname } from "node:path";

const DIST = "dist";
const SRC_IGNORE = new Set(["node_modules", "dist", ".git", "public"]);
const problems = [];

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SRC_IGNORE.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

// --- 1. dead references in the built HTML -------------------------------
const distFiles = await walk(DIST);
const htmlFiles = distFiles.filter((f) => extname(f) === ".html");

if (!htmlFiles.length) {
  problems.push(`No HTML found in ${DIST}/ — did the build run?`);
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const refs = new Set(
    [...html.matchAll(/(?:src|href)="(\/[^"]*)"/g)].map((m) => m[1])
  );

  for (const ref of refs) {
    if (ref.startsWith("//")) continue; // protocol-relative, external
    const target = join(DIST, decodeURIComponent(ref.split("?")[0]));
    if (!(await exists(target))) {
      problems.push(`${file} → ${ref} (no such file in ${DIST}/)`);
    }
  }
}

// --- 2. asset paths hidden in JS strings ---------------------------------
const srcFiles = (await walk(".")).filter(
  (f) => extname(f) === ".js" && !f.includes("check-build")
);

// Comments are stripped first, so documenting the rule doesn't trip it.
const stripComments = (code) =>
  code
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/.*$/gm, "$1");

for (const file of srcFiles) {
  const code = stripComments(await readFile(file, "utf8"));
  code.split("\n").forEach((line, i) => {
    if (/["'`]\/(assets|socials)\//.test(line)) {
      problems.push(
        `${file}:${i + 1} hardcoded asset path — import it instead, or Vite ` +
          `won't update it when it renames the file`
      );
    }
  });
}

// --- report --------------------------------------------------------------
if (problems.length) {
  console.error(`\n✗ Build check failed (${problems.length} problem(s)):\n`);
  for (const p of problems) console.error("   " + p);
  console.error("");
  process.exit(1);
}

console.log(
  `\n✓ Build check passed — ${htmlFiles.length} pages, every reference resolves.\n`
);
