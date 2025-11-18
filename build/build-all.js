#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('');
console.log('╔═══════════════════════════════════════╗');
console.log('║      Building All Categories          ║');
console.log('╚═══════════════════════════════════════╝');
console.log('');

let total = 0;
let success = 0;
let failed = 0;
let skipped = 0;

const scriptDir = __dirname;
const projectRoot = fs.existsSync(path.join(scriptDir, '..', 'reviews')) 
  ? path.join(scriptDir, '..') 
  : path.dirname(scriptDir);

const reviewsDir = path.join(projectRoot, 'reviews');
const buildScript = path.join(projectRoot, 'build', 'build.js');

console.log(`Project Root: ${projectRoot}`);
console.log(`Reviews: ${reviewsDir}`);
console.log('');

if (!fs.existsSync(reviewsDir)) {
  console.error('✗ Error: reviews/ directory not found');
  console.error(`  Expected at: ${reviewsDir}`);
  process.exit(1);
}

if (!fs.existsSync(buildScript)) {
  console.error('✗ Error: build/build.js not found');
  console.error(`  Expected at: ${buildScript}`);
  process.exit(1);
}

const entries = fs.readdirSync(reviewsDir, { withFileTypes: true });
const directories = entries
  .filter(entry => entry.isDirectory())
  .map(entry => entry.name)
  .filter(name => !name.startsWith('.') && name !== 'node_modules')
  .sort();

if (directories.length === 0) {
  console.log('No review folders found in reviews/');
  process.exit(0);
}

console.log(`Found ${directories.length} review folder(s):`);
directories.forEach(dir => console.log(`  • ${dir}`));
console.log('');

for (const dir of directories) {
  const dirPath = path.join(reviewsDir, dir);
  const readmePath = path.join(dirPath, 'README.md');
  
  if (!fs.existsSync(readmePath)) {
    console.log(`Skipping ${dir} (no README.md)`);
    skipped++;
    continue;
  }
  
  total++;
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Building: ${dir}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    execSync(`node "${buildScript}" "${dirPath}"`, {
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    console.log(`✓ Successfully built: ${dir}`);
    success++;
  } catch (error) {
    console.error(`✗ Build failed: ${dir}`);
    failed++;
  }
  
  console.log('');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Building Main Index...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

try {
  execSync(`node "${path.join(projectRoot, 'build', 'build-main.js')}"`, {
    stdio: 'inherit',
    cwd: projectRoot
  });
  console.log('✓ Main index built successfully!');
} catch (error) {
  console.error('✗ Main index build failed!');
  failed++;
}

console.log('');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Build Summary:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`✓ Successful: ${success}`);
console.log(`✗ Failed:     ${failed}`);
console.log(`Skipped:    ${skipped}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total:        ${total}`);
console.log('');

if (failed === 0) {
  console.log('All builds completed successfully!');
  process.exit(0);
} else {
  console.log('Some builds failed. Check output above for details.');
  process.exit(1);
}
