const fs = require("fs");
const path = require("path");

const root = path.join("frontend");
const exts = new Set([".js", ".jsx", ".ts", ".tsx"]);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === "node_modules" ||
      entry.name === ".next" ||
      entry.name === "out"
    )
      continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name))) files.push(full);
  }
}

walk(root);

const methods = "get|post|put|patch|delete";
const apiCallRegex = new RegExp(
  `\\baxios\\.(${methods})\\(([\`"'])/api(?=[/\`"'?])`,
  "g",
);

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("/api")) continue;
  if (
    !text.includes("import axios from 'axios'") &&
    !text.includes('import axios from "axios"')
  )
    continue;

  let next = text
    .replace("import axios from 'axios'", "import api from '@/lib/api'")
    .replace('import axios from "axios"', "import api from '@/lib/api'")
    .replace(apiCallRegex, "api.$1($2");

  if (next !== text) {
    fs.writeFileSync(file, next, "utf8");
    console.log(file);
  }
}
