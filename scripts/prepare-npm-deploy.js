#!/usr/bin/env node

const fs = require('node:fs');
const _path = require('node:path');

// Read the root package.json
const _rootPackageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Read web app package.json
const webPackageJsonPath = 'apps/web/package.json';
const webPackageJson = JSON.parse(fs.readFileSync(webPackageJsonPath, 'utf8'));

// Read common package.json
const _commonPackageJson = JSON.parse(fs.readFileSync('packages/common/package.json', 'utf8'));

// Read contracts package.json
const _contractsPackageJson = JSON.parse(
  fs.readFileSync('packages/contracts/package.json', 'utf8')
);

// Replace workspace dependencies with file paths
if (webPackageJson.dependencies) {
  Object.keys(webPackageJson.dependencies).forEach((dep) => {
    if (webPackageJson.dependencies[dep] === 'workspace:*') {
      if (dep === '@valkyrie/common') {
        webPackageJson.dependencies[dep] = 'file:../../packages/common';
      } else if (dep === '@valkyrie/contracts') {
        webPackageJson.dependencies[dep] = 'file:../../packages/contracts';
      }
    }
  });
}

// Write the modified package.json
fs.writeFileSync(webPackageJsonPath, JSON.stringify(webPackageJson, null, 2));

console.log('✅ Prepared package.json for npm deployment');
console.log('📦 Workspace dependencies converted to file: paths');
