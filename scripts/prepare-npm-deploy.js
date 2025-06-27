#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

// Read the root package.json
const _rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Read web app package.json
const webPackageJsonPath = 'apps/web/package.json';
const webPackageJson = JSON.parse(fs.readFileSync(webPackageJsonPath, 'utf8'));

// Read server app package.json
const serverPackageJsonPath = 'apps/server/package.json';
const serverPackageJson = JSON.parse(fs.readFileSync(serverPackageJsonPath, 'utf8'));

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

// Function to replace workspace dependencies
function replaceWorkspaceDependencies(packageJson) {
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

  return modified;
}

// Copy workspace packages to make them available
console.log('📦 Copying workspace packages...');
const packageDirs = [
  { src: 'packages/common', dest: 'apps/web/packages/common' },
  { src: 'packages/contracts', dest: 'apps/web/packages/contracts' },
  { src: 'packages/ui', dest: 'apps/web/packages/ui' },
  { src: 'packages/config', dest: 'apps/web/packages/config' },
  { src: 'packages/common', dest: 'apps/server/packages/common' },
  { src: 'packages/config', dest: 'apps/server/packages/config' },
];

packageDirs.forEach(({ src, dest }) => {
  if (fs.existsSync(src)) {
    console.log(`  📁 Copying ${src} → ${dest}`);
    copyDir(src, dest);
  }
});

// Process web app package.json
console.log('🔧 Processing apps/web/package.json...');
const webModified = replaceWorkspaceDependencies(webPackageJson);
if (webModified) {
  fs.writeFileSync(webPackageJsonPath, JSON.stringify(webPackageJson, null, 2));
  console.log('✅ Updated apps/web/package.json');
} else {
  console.log('ℹ️  No workspace dependencies found in web package.json');
}

// Process server app package.json
console.log('🔧 Processing apps/server/package.json...');
const serverModified = replaceWorkspaceDependencies(serverPackageJson);
if (serverModified) {
  fs.writeFileSync(serverPackageJsonPath, JSON.stringify(serverPackageJson, null, 2));
  console.log('✅ Updated apps/server/package.json');
} else {
  console.log('ℹ️  No workspace dependencies found in server package.json');
}

console.log('✅ Prepared package.json files for npm deployment');
console.log('📦 All workspace dependencies converted to file: paths');
