#!/usr/bin/env bash

# Checks that the plan and review templates render to the end when a part of
# their data is missing or empty, that a page that cannot render says so instead
# of stopping in silence, and that a review page names the lens of a finding.
#
# Usage: plugins/workflow/tests/page-templates.sh

set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
work="$(mktemp -d)"

if ! command -v node >/dev/null; then
  printf '\033[31mfail\033[0m node is not installed, so no template was checked\n'
  exit 1
fi

cat >"$work/render.js" <<'SCRIPT'
const fs = require("fs");

const [file, name, endMarker] = process.argv.slice(2);
const html = fs.readFileSync(file, "utf8");
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => match[1]);
const render = scripts[scripts.length - 1];
const empty = new Function(`${scripts.find((script) => script.includes(`const ${name} = {`))}; return ${name};`)();

const samples = {
  REVIEW: {
    mode: "own",
    title: "A title",
    lede: "A lede.",
    context: { title: "Context", paras: ["One paragraph."] },
    problem: { title: "Problem", paras: ["One paragraph."] },
    solution: { title: "Solution", paras: ["One paragraph."], svg: "" },
    findings: {
      title: "Findings",
      sub: "",
      rows: [
        ["src/tasks.ts:3", "Sort the list.", "suggestion"],
        ["src/tasks.ts:5", "Check the owner.", "fixed", "security"],
      ],
    },
    steps: { title: "Steps", sub: "", list: [{ title: "A step", file: "src/tasks.ts", lines: [1, 2], what: "A function." }] },
    commits: { title: "Commits", sub: "", list: [{ subject: "feat: add a list", why: "One idea.", steps: 1, status: "todo" }] },
    checks: { title: "Checks", rows: [["Tests", "4 passed.", "pass"]] },
    gotchas: { title: "Gotchas", rows: [["A surprise", "Its reason."]] },
    notes: { title: "Notes", rows: [["A topic", "A note."]] },
    changes: { title: "", sub: "" },
  },
  PLAN: {
    project: "tasks",
    revision: 1,
    title: "A title",
    lede: "A lede.",
    decided: { title: "Decided", sub: "", rows: [["Channel", "Email.", "default"]] },
    open: { title: "Open", rows: [{ q: "Which hour?", o: "7 or 8.", d: "Before the last slice." }] },
    agreements: { title: "Agreements", rows: [["Tests", "Each slice has tests."]] },
    sections: [{ id: "run", kind: "table", eyebrow: "Run", title: "This session.", rows: [["All", "Here.", "Small."]] }],
    gaps: { title: "Gaps", sub: "", rows: [["A gap", "Its resolution."]] },
    lanes: { title: "Lanes", sub: "", svg: "<svg></svg>" },
    phases: [{ name: "First", intro: "An intro.", slices: [{ title: "A slice", outcome: "Something to try.", size: "S", status: "todo" }] }],
    risks: { title: "Risks", rows: [["A risk", "Its signal."]] },
    out: { title: "Out", rows: [["An item", "Its reason."]] },
  },
};

// Stands in for the page. It records every text that the script puts on the
// page, so a check can tell whether the script reached its last statement.
function page() {
  const written = [];
  const element = () =>
    new Proxy(function () {}, {
      get: (target, key) => {
        if (key === "length") return 0;
        if (key === Symbol.toPrimitive) return () => "";
        if (key === "forEach") return () => {};
        return element();
      },
      set: (target, key, value) => {
        if (key === "textContent" || key === "innerHTML") written.push(String(value));
        return true;
      },
      apply: () => element(),
    });
  return { document: element(), written };
}

const requiredTexts = {
  REVIEW: [["names the lens of a finding", ">security</span>"]],
  PLAN: [],
};

function outcome(data, mustShow) {
  const { document, written } = page();
  try {
    if (data === undefined) new Function("document", "window", render)(document, document);
    else new Function(name, "document", "window", render)(data, document, document);
  } catch (error) {
    return `threw ${error.constructor.name}: ${error.message}`;
  }
  if (written.some((text) => text.includes("This page stopped"))) return "stopped with a message";
  if (mustShow) return written.some((text) => text.includes(mustShow)) ? "shown" : "not shown";
  return written.some((text) => text.includes(endMarker)) ? "rendered" : "ended early";
}

const cases = [["with every part", samples[name], "rendered"]];
for (const part of Object.keys(empty).filter((key) => typeof empty[key] === "object")) {
  const without = structuredClone(samples[name]);
  delete without[part];
  cases.push([`without ${part}`, without, "rendered"]);
  const hollow = structuredClone(samples[name]);
  hollow[part] = Array.isArray(empty[part]) ? null : {};
  cases.push([`with an empty ${part}`, hollow, "rendered"]);
}
cases.push(["with no data object", undefined, "stopped with a message"]);
for (const [label, text] of requiredTexts[name]) cases.push([label, samples[name], "shown", text]);

let failures = 0;
for (const [label, data, expected, mustShow] of cases) {
  const actual = outcome(data, mustShow);
  const passed = actual === expected;
  if (!passed) failures += 1;
  const mark = passed ? "\x1b[32mpass\x1b[0m" : "\x1b[31mfail\x1b[0m";
  console.log(`${mark} ${name} ${label}${passed ? "" : `: ${actual}`}`);
}
process.exit(failures ? 1 : 0);
SCRIPT

failures=0
node "$work/render.js" "$root/skills/review/assets/review.html" REVIEW "</b> step" || failures=1
node "$work/render.js" "$root/skills/plan/assets/plan.html" PLAN "</b> decisions" || failures=1

exit "$failures"
