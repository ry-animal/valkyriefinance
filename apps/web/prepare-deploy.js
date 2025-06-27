#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

console.log('📦 Preparing workspace dependencies for Vercel deployment...');

// Read web app package.json
const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Workspace dependency mappings
const workspaceMappings = {
  '@valkyrie/common': 'file:../../packages/common',
  '@valkyrie/contracts': 'file:../../packages/contracts',
  '@valkyrie/ui': 'file:../../packages/ui',
  '@valkyrie/config': 'file:../../packages/config',
};

// Function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️  Source directory not found: ${src}`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src);
  for (const entry of entries) {
    const srcPath = path.join(src, entry);
    const destPath = path.join(dest, entry);

    if (fs.statSync(srcPath).isDirectory()) {
      // Skip node_modules and .turbo directories
      if (entry !== 'node_modules' && entry !== '.turbo' && entry !== '.next') {
        copyDir(srcPath, destPath);
      }
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy workspace packages to make them available
console.log('📦 Copying workspace packages...');
const packageDirs = [
  { src: '../../packages/common', dest: './packages/common' },
  { src: '../../packages/contracts', dest: './packages/contracts' },
  { src: '../../packages/ui', dest: './packages/ui' },
  { src: '../../packages/config', dest: './packages/config' },
];

packageDirs.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    console.log(`  📁 Copying ${src} → ${dest}`);
    copyDir(src, dest);
  }
});

// Replace workspace dependencies
let modified = false;
if (packageJson.dependencies) {
  Object.keys(packageJson.dependencies).forEach((dep) => {
    if (
      packageJson.dependencies[dep] === 'workspace:*' ||
      packageJson.dependencies[dep] === 'workspace:^'
    ) {
      if (workspaceMappings[dep]) {
        packageJson.dependencies[dep] = workspaceMappings[dep];
        modified = true;
        console.log(`  ✓ ${dep}: workspace:* → ${workspaceMappings[dep]}`);
      }
    }
  });
}

if (modified) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json');
} else {
  console.log('ℹ️  No workspace dependencies found');
}

console.log('✅ Web app prepared for deployment');
