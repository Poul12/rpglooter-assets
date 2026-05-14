const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// 🎯 TYLKO TE FOLDERY SĄ ASSETAMI GRY
const ROOT_FOLDERS = ["./img", "./sounds"];

// 🚫 CO IGNORUJEMY GLOBALNIE
const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  ".github",
  ".vscode"
]);

const OUTPUT_FILE = "./manifest.json";

// 🔐 hash pliku
function getHash(buffer) {
  return crypto.createHash("md5").update(buffer).digest("hex");
}

// 📁 rekurencyjne zbieranie plików
function getAllFiles(dir, base = "") {
  let results = [];

  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);

  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relativePath = path.join(base, file).replace(/\\/g, "/");

    const stat = fs.statSync(fullPath);

    // 🚫 ignoruj katalogi systemowe
    if (stat.isDirectory() && IGNORE_DIRS.has(file)) {
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relativePath));
    } else {
      const buffer = fs.readFileSync(fullPath);

      results.push({
        path: relativePath,
        hash: getHash(buffer),
        size: stat.size
      });
    }
  }

  return results;
}

// 🧱 budowa manifestu
function buildManifest() {
  let files = [];

  // 📦 tylko wybrane foldery
  for (const folder of ROOT_FOLDERS) {
    //files = files.concat(getAllFiles(folder));
    files = files.concat(getAllFiles(folder, folder.replace("./", "")));
  }

  const manifest = {
    version: Date.now().toString(),
    baseUrl: "https://Poul12.github.io/rpglooter-assets/",
    files: files
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));

  console.log("✅ Manifest wygenerowany");
  console.log("📦 Pliki:", files.length);
  console.log("💾 Zapisano do:", OUTPUT_FILE);
}

buildManifest();