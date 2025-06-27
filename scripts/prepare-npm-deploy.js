#!/usr/bin/env node

const fs = require('node:fs');
const _path = require('node:path');

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
