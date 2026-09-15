#!/usr/bin/env node
/** AICIRCUS image auto-integrator (dependency-free). */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const incoming = path.join(root, 'assets', 'incoming');
const manifestPath = path.join(root, 'data', 'image-manifest.json');
const rules = [
  { re: /(ego).*(icon|logo)|^(1000017557|1000018768)\./i, key: 'ego_icon', name: 'ego-icon.jpg' },
  { re: /(fate|fatelog).*(icon|logo)|fatelog_icon/i, key: 'fatelog_icon', name: 'fatelog-icon.jpg' }
];
fs.mkdirSync(incoming, { recursive: true });
fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
fs.mkdirSync(path.join(root, 'assets', 'icons'), { recursive: true });
let manifest = { version: 1, updated: new Date().toISOString().slice(0,10), assets: {} };
if (fs.existsSync(manifestPath)) { try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (_) {} }
let changed = 0;
for (const file of fs.readdirSync(incoming)) {
  const src = path.join(incoming, file);
  if (!fs.statSync(src).isFile()) continue;
  const rule = rules.find(r => r.re.test(file));
  if (!rule) continue;
  const dst = path.join(root, 'assets', 'icons', rule.name);
  fs.copyFileSync(src, dst);
  manifest.assets[rule.key] = `assets/icons/${rule.name}`;
  changed++;
}
manifest.updated = new Date().toISOString().slice(0,10);
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Integrated ${changed} image(s).`);
