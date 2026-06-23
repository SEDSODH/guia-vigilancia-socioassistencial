// inline.mjs - Gera HTML autocontido com CSS + JS inline via data: URLs
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const ASTRO = join(DIST, '_astro');
const HTML_PATH = join(DIST, 'index.html');
const OUTPUT = join(ROOT, 'guia-vigilancia-self-contained.html');
const IMAGES_DIR = join(DIST, 'images');

function existsSync(p) {
  try { statSync(p); return true; } catch { return false; }
}

if (!existsSync(DIST)) {
  console.error(`ERRO: pasta dist/ nao encontrada. Execute 'npm run build' primeiro.`);
  process.exit(1);
}

// ── 1. Carrega e converte imagens SVG para data URLs ──
// Mapeia cada arquivo SVG em dist/images/ para seu data URL base64
const svgToDataUrl = {};
if (existsSync(IMAGES_DIR)) {
  const svgFiles = readdirSync(IMAGES_DIR).filter(f => f.endsWith('.svg'));
  for (const file of svgFiles) {
    const svgPath = join(IMAGES_DIR, file);
    const svgBytes = readFileSync(svgPath);
    const b64 = svgBytes.toString('base64');
    svgToDataUrl[file] = `data:image/svg+xml;base64,${b64}`;
    console.log(`  SVG ${file}: ${svgBytes.length} bytes -> data URL`);
  }
}

// ── 2. Prepara data URLs para SVGs inline (capa, contra-capa) ──
// Estes são substituídos como HTML inline <svg> (não como data URL)
const svgInlineHtml = {};
for (const file of ['capa.svg', 'contra_capa.svg']) {
  const svgPath = join(IMAGES_DIR, file);
  if (!existsSync(svgPath)) continue;
  let content = readFileSync(svgPath, 'utf-8');
  content = content.replace(/<title>.*?<\/title>/gs, '');
  const alt = file === 'capa.svg'
    ? 'Capa — Guia de Implantação da Vigilância Socioassistencial'
    : 'Contra-Capa — Guia de Implantação da Vigilância Socioassistencial';
  content = content.replace(/<svg([^>]*)>/, `<svg$1><title>${alt}</title>`);
  svgInlineHtml[file] = content;
}

// ── 3. Lista e faz bundle dos arquivos JS ──
const jsFiles = readdirSync(ASTRO).filter(f => f.endsWith('.js')).map(f => join(ASTRO, f));
console.log(`\nFazendo bundle de ${jsFiles.length} arquivos JS com esbuild...`);

const bundles = {};
for (const inputPath of jsFiles) {
  const file = basename(inputPath);
  try {
    let result = execSync(
      `npx esbuild "${inputPath}" --bundle --format=esm --minify`,
      { encoding: 'utf-8', cwd: ROOT }
    );
    // Substitui referencias a /images/xxx.svg dentro do JS bundle pela data URL
    for (const [svgFile, dataUrl] of Object.entries(svgToDataUrl)) {
      const escapedPath = `/images/${svgFile}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedPath, 'g');
      const matches = result.match(regex);
      const count = matches ? matches.length : 0;
      if (count > 0) {
        result = result.replace(regex, dataUrl);
        console.log(`  Substituido "${escapedPath}" no bundle ${file}: ${count}x`);
      }
    }
    bundles[file] = result;
    console.log(`  OK ${file}: ${result.length} chars`);
  } catch (e) {
    console.error(`  ERRO ${file}: ${e.message}`);
    process.exit(1);
  }
}

// ── 4. Le o CSS ──
const cssFile = readdirSync(ASTRO).find(f => f.endsWith('.css'));
const cssContent = readFileSync(join(ASTRO, cssFile), 'utf-8');
console.log(`\nCSS: ${cssContent.length} chars (${cssFile})`);

// ── 5. Le e processa o HTML ──
let html = readFileSync(HTML_PATH, 'utf-8');
console.log(`\nHTML original: ${html.length} chars`);

// Substitui CSS link por <style> inline
html = html.replace(
  /<link rel="stylesheet" href="\/_astro\/[^"]*\.css">/,
  `<style>${cssContent}</style>`
);

// Substitui referências JS por data: URLs base64 (codifica o bundle ja modificado)
for (const [file, content] of Object.entries(bundles)) {
  const b64 = Buffer.from(content, 'utf-8').toString('base64');
  const dataUrl = `data:text/javascript;base64,${b64}`;
  const oldPath = `/_astro/${file}`;
  const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedOldPath, 'g');
  const matches = html.match(regex);
  const count = matches ? matches.length : 0;
  html = html.replace(regex, dataUrl);
  console.log(`  JS ${file}: ${count} refs substituidas, data URL: ${dataUrl.length} chars`);
}

// Substitui SVGs inline (capa, contra-capa) como HTML <svg> (nao como data URL)
console.log('\nEmbutindo SVGs como inline HTML...');
for (const [file, inlineSvg] of Object.entries(svgInlineHtml)) {
  // Tenta <img> e <object> patterns
  const escapedName = file.replace(/\./g, '\\.');
  const regex = new RegExp(
    `(<img\\s+src="/images/${escapedName}"[^>]*>|<object[^>]*data="/images/${escapedName}"[^>]*></object>)`,
    'g'
  );
  const beforeLen = html.length;
  html = html.replace(regex, inlineSvg);
  const found = beforeLen !== html.length;
  console.log(`  ${file}: ${found ? 'inline aplicado' : 'NAO encontrado no HTML'} (${inlineSvg.length} chars)`);
}

// Substitui quaisquer referencias remanescentes a /images/xxx.svg no HTML
// (ex: em script tags inline, atributos onerror, etc.)
console.log('\nSubstituindo referencias residuais a SVGs no HTML...');
for (const [svgFile, dataUrl] of Object.entries(svgToDataUrl)) {
  const escapedPath = `/images/${svgFile}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedPath, 'g');
  const matches = html.match(regex);
  const count = matches ? matches.length : 0;
  if (count > 0) {
    html = html.replace(regex, dataUrl);
    console.log(`  ${svgFile}: ${count} substituicoes no HTML residual`);
  }
}

// ── 6. Verificacao final ──
const astrRefs = (html.match(/\/_astro\/[^"'\s)]+/g) || []);
const imgRefs = (html.match(/\/images\/[^"'\s)]+/g) || []);
if (astrRefs.length > 0) {
  console.log(`\nAVISO: ${astrRefs.length} referencias a /_astro/ ainda presentes:`);
  for (const r of [...new Set(astrRefs)].slice(0, 5)) console.log(`  - ${r}`);
}
if (imgRefs.length > 0) {
  console.log(`\nAVISO: ${imgRefs.length} referencias a /images/ ainda presentes:`);
  for (const r of [...new Set(imgRefs)].slice(0, 5)) console.log(`  - ${r}`);
}

// ── 7. Escreve o HTML final ──
writeFileSync(OUTPUT, html, 'utf-8');
const sizeKB = (html.length / 1024).toFixed(1);
console.log(`\nGerado: ${OUTPUT}`);
console.log(`  Tamanho: ${sizeKB} KB (${(html.length / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`  Refs /_astro/: ${astrRefs.length} | Refs /images/: ${imgRefs.length}`);
