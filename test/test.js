#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const results = {
  passed: [],
  failed: [],
  warnings: []
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function pass(message) {
  results.passed.push(message);
  log(`✓ ${message}`, colors.green);
}

function fail(message, details = null) {
  results.failed.push({ message, details });
  log(`✗ ${message}`, colors.red);
  if (details) {
    log(`  ${details}`, colors.red);
  }
}

function warn(message, details = null) {
  results.warnings.push({ message, details });
  log(`⚠ ${message}`, colors.yellow);
  if (details) {
    log(`  ${details}`, colors.yellow);
  }
}

function section(title) {
  console.log('');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan);
  log(title, colors.cyan + colors.bold);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.cyan);
}

const scriptDir = __dirname;
const projectRoot = fs.existsSync(path.join(scriptDir, 'reviews')) 
  ? scriptDir 
  : fs.existsSync(path.join(scriptDir, '..', 'reviews'))
  ? path.join(scriptDir, '..')
  : path.dirname(scriptDir);

console.log('');
log('╔═══════════════════════════════════════╗', colors.blue + colors.bold);
log('║     COMPREHENSIVE BUILD TEST          ║', colors.blue + colors.bold);
log('╚═══════════════════════════════════════╝', colors.blue + colors.bold);
console.log('');
log(`Project Root: ${projectRoot}`, colors.blue);
console.log('');

section('1. Project Structure');

const requiredDirs = [
  { path: 'reviews', required: true, description: 'Review categories directory' },
  { path: 'build', required: true, description: 'Build scripts directory' },
  { path: 'templates', required: true, description: 'HTML templates directory' },
  { path: 'css', required: false, description: 'Stylesheets directory' },
  { path: 'js', required: false, description: 'JavaScript directory' }
];

for (const dir of requiredDirs) {
  const dirPath = path.join(projectRoot, dir.path);
  if (fs.existsSync(dirPath)) {
    if (fs.statSync(dirPath).isDirectory()) {
      pass(`${dir.path}/ directory exists`);
    } else {
      fail(`${dir.path} exists but is not a directory`);
    }
  } else {
    if (dir.required) {
      fail(`${dir.path}/ directory missing`, dir.description);
    } else {
      warn(`${dir.path}/ directory not found`, 'Will be copied if it exists');
    }
  }
}

const siteDir = path.join(projectRoot, 'site');
if (fs.existsSync(siteDir)) {
  pass('site/ directory exists');
} else {
  try {
    fs.mkdirSync(siteDir, { recursive: true });
    fs.rmdirSync(siteDir);
    pass('site/ directory can be created');
  } catch (error) {
    fail('Cannot create site/ directory', error.message);
  }
}

section('2. Build Scripts');

const buildScripts = [
  { name: 'build.js', required: true },
  { name: 'build-all.js', required: true },
  { name: 'build-main.js', required: true }
];

for (const script of buildScripts) {
  const scriptPath = path.join(projectRoot, 'build', script.name);
  if (fs.existsSync(scriptPath)) {
    try {
      const content = fs.readFileSync(scriptPath, 'utf-8');
      if (content.length > 0) {
        pass(`build/${script.name} exists and is readable`);
      } else {
        fail(`build/${script.name} is empty`);
      }
    } catch (error) {
      fail(`build/${script.name} cannot be read`, error.message);
    }
  } else {
    if (script.required) {
      fail(`build/${script.name} not found`);
    } else {
      warn(`build/${script.name} not found`);
    }
  }
}

section('3. Templates');

const templateFiles = [
  { name: 'github.html', required: true },
  { name: 'footer.html', required: true }
];

for (const template of templateFiles) {
  const templatePath = path.join(projectRoot, 'templates', template.name);
  if (fs.existsSync(templatePath)) {
    try {
      const content = fs.readFileSync(templatePath, 'utf-8');
      if (content.length > 0) {
        pass(`templates/${template.name} exists and is readable`);
      } else {
        fail(`templates/${template.name} is empty`);
      }
    } catch (error) {
      fail(`templates/${template.name} cannot be read`, error.message);
    }
  } else {
    if (template.required) {
      fail(`templates/${template.name} not found`);
    } else {
      warn(`templates/${template.name} not found`);
    }
  }
}

section('4. Global Theme');

const globalThemePath = path.join(projectRoot, 'theme.json');
if (fs.existsSync(globalThemePath)) {
  try {
    const themeContent = fs.readFileSync(globalThemePath, 'utf-8');
    const theme = JSON.parse(themeContent);
    
    if (theme.theme) {
      pass('theme.json exists and is valid JSON');
      
      const requiredColors = [
        'colorBgPrimary',
        'colorBgSecondary',
        'colorAccentPrimary',
        'colorAccentSecondary',
        'colorAccentSuccess',
        'colorAccentDanger'
      ];
      
      const missingColors = requiredColors.filter(color => !theme.theme[color]);
      if (missingColors.length === 0) {
        pass('All required theme colors defined');
      } else {
        warn('Some theme colors missing', `Missing: ${missingColors.join(', ')}`);
      }
    } else {
      warn('theme.json missing "theme" property');
    }
  } catch (error) {
    fail('theme.json is invalid JSON', error.message);
  }
} else {
  warn('Global theme.json not found', 'Default theme will be used');
}

section('5. Review Folders');

const reviewsDir = path.join(projectRoot, 'reviews');
let reviewFolders = [];

if (fs.existsSync(reviewsDir)) {
  const items = fs.readdirSync(reviewsDir);
  reviewFolders = items.filter(item => {
    const itemPath = path.join(reviewsDir, item);
    return fs.statSync(itemPath).isDirectory() && 
           !item.startsWith('.') && 
           item !== 'node_modules';
  });
  
  if (reviewFolders.length === 0) {
    fail('No review folders found in reviews/');
  } else {
    pass(`Found ${reviewFolders.length} review folder(s)`);
    log(`  Folders: ${reviewFolders.join(', ')}`, colors.blue);
  }
} else {
  fail('Cannot access reviews/ directory');
}

section('6. Review Folder Contents - Comprehensive README Validation');

function extractCategory(firstLine) {
  const match = firstLine.match(/^#\s+Best\s+(.+?)\s+Curated by Github Users/i);
  if (match) {
    return match[1].trim();
  }
  
  const fallbackMatch = firstLine.match(/Best\s+(.+?)\s+Curated/i);
  if (fallbackMatch) {
    return fallbackMatch[1].trim();
  }
  
  return null;
}

function validateReadmeStructure(content) {
  const issues = [];
  const warnings = [];
  const info = [];
  
  const lines = content.split('\n');
  
  const titleLines = lines.filter(line => line.match(/^#\s+[^#]/));
  if (titleLines.length === 0) {
    issues.push('Missing main title (# heading)');
  } else if (titleLines.length > 1) {
    issues.push(`Multiple main titles found (${titleLines.length}). Should only have one # heading`);
  } else {
    info.push('✓ Main title present');
  }
  
  if (titleLines.length > 0) {
    const titleLine = titleLines[0];
    if (!titleLine.match(/^#\s+Best\s+.+?\s+Curated by Github Users/i)) {
      issues.push('Title format incorrect. Expected: "# Best [Category] Curated by Github Users"');
    }
  }
  
  const sections = lines.filter(line => line.match(/^##\s+[^#]/));
  if (sections.length === 0) {
    warnings.push('No sections (## headings) found');
  } else {
    info.push(`✓ ${sections.length} section(s) found`);
  }
  
  const subsections = lines.filter(line => line.match(/^###\s+[^#]/));
  info.push(`${subsections.length} subsection(s) found`);
  
  const serviceCards = lines.filter(line => line.match(/^###\s+\d+\./));
  if (serviceCards.length > 0) {
    info.push(`✓ ${serviceCards.length} service card(s) detected`);
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/^###\s+\d+\./)) {
        const cardTitle = lines[i];
        
        if (i + 1 < lines.length && lines[i + 1].trim()) {
          const nextLine = lines[i + 1];
          if (!nextLine.match(/^!\[.*?\]\(.*?\)/)) {
            warnings.push(`Service card "${cardTitle.trim()}" missing image on next line`);
          }
        }
      }
    }
  }
  
  let lastHeadingLevel = 0;
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      if (level > lastHeadingLevel + 1 && lastHeadingLevel > 0) {
        warnings.push(`Heading hierarchy skip detected: ${line.substring(0, 50)}...`);
      }
      lastHeadingLevel = level;
    }
  }
  
  const hasFooter = sections.some(section => section.match(/^##\s+Footer/i));
  if (!hasFooter) {
    warnings.push('No Footer section found (recommended)');
  } else {
    info.push('✓ Footer section present');
  }
  
  return { issues, warnings, info };
}

function validateMarkdownElements(content, folderPath) {
  const issues = [];
  const warnings = [];
  const info = [];
  
  const imageMatches = content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);
  const images = Array.from(imageMatches);
  
  if (images.length > 0) {
    info.push(`${images.length} image(s) referenced`);
    
    for (const match of images) {
      const imagePath = match[2];
      
      if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        continue;
      }
      
      const fullImagePath = path.join(folderPath, imagePath);
      if (!fs.existsSync(fullImagePath)) {
        issues.push(`Image not found: ${imagePath}`);
      }
    }
  }
  
  const linkMatches = content.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);
  const links = Array.from(linkMatches).filter(m => !m[0].startsWith('!['));
  
  if (links.length > 0) {
    info.push(`${links.length} link(s) found`);
  }
  
  const tableMatches = content.match(/\|[^\n]+\|/g);
  if (tableMatches && tableMatches.length >= 3) {
    info.push('✓ Markdown table(s) detected');
    
    const tables = content.split(/\n\s*\n/).filter(block => 
      block.includes('|') && block.split('\n').filter(l => l.includes('|')).length >= 2
    );
    
    for (const table of tables) {
      const rows = table.split('\n').filter(line => line.trim().startsWith('|'));
      if (rows.length < 2) {
        warnings.push('Table appears incomplete (less than 2 rows)');
      }
      
      const hasSeparator = rows.some(row => row.match(/\|[\s:-]+\|/));
      if (!hasSeparator) {
        warnings.push('Table missing header separator row (|---|---|)');
      }
    }
  }
  
  const iconUsage = {
    checkmark: (content.match(/[✓✅]/g) || []).length,
    cross: (content.match(/[✗❌]/g) || []).length,
    warning: (content.match(/[⚠⚠️]/g) || []).length
  };
  
  if (iconUsage.checkmark > 0 || iconUsage.cross > 0 || iconUsage.warning > 0) {
    info.push(`Special icons: ✓${iconUsage.checkmark} ✗${iconUsage.cross} ⚠${iconUsage.warning}`);
  }
  
  const directives = {
    annotation: (content.match(/<!--\s*annotation:/gi) || []).length,
    callout: (content.match(/<!--\s*callout:/gi) || []).length,
    navigation: (content.match(/<!--\s*navigation\s*-->/gi) || []).length,
    note: (content.match(/<!--\s*note:/gi) || []).length
  };
  
  const totalDirectives = Object.values(directives).reduce((a, b) => a + b, 0);
  if (totalDirectives > 0) {
    info.push(`Directives: annotation(${directives.annotation}) callout(${directives.callout}) navigation(${directives.navigation}) note(${directives.note})`);
  }
  
  const unclosedDirectives = content.match(/<!--[^>]*$/gm);
  if (unclosedDirectives) {
    issues.push(`${unclosedDirectives.length} unclosed HTML comment(s) detected`);
  }
  
  const boldCount = (content.match(/\*\*[^*]+\*\*/g) || []).length;
  const italicCount = (content.match(/(?<!\*)\*(?!\*)([^*]+)(?<!\*)\*(?!\*)/g) || []).length;
  
  if (boldCount > 0 || italicCount > 0) {
    info.push(`Formatting: **bold**(${boldCount}) *italic*(${italicCount})`);
  }
  
  const inlineCodeCount = (content.match(/`[^`]+`/g) || []).length;
  if (inlineCodeCount > 0) {
    info.push(`Inline code blocks: ${inlineCodeCount}`);
  }
  
  const labeledListItems = (content.match(/^[\s-]*\*\s+\*\*[^*]+\*\*:/gm) || []).length;
  if (labeledListItems > 0) {
    info.push(`✓ ${labeledListItems} labeled list item(s) (recommended format)`);
  }
  
  return { issues, warnings, info };
}

function validateTableStructure(content, folderPath) {
  const issues = [];
  const warnings = [];
  const info = [];
  
  const tableRegex = /\|[^\n]+\|[\s\S]*?\n\|[-:\s|]+\|\n((?:\|[^\n]+\|\n?)*)/g;
  const tables = Array.from(content.matchAll(tableRegex));
  
  if (tables.length === 0) {
    return { issues, warnings, info, hasTable: false };
  }
  
  info.push(`${tables.length} table(s) found`);
  
  for (let tableIndex = 0; tableIndex < tables.length; tableIndex++) {
    const table = tables[tableIndex];
    const fullTable = table[0];
    const dataRows = table[1];
    
    const allLines = fullTable.split('\n').filter(line => line.trim().startsWith('|'));
    const headerLine = allLines[0];
    const separatorLine = allLines[1];
    const bodyLines = allLines.slice(2);
    
    const headerCols = headerLine.split('|').filter(cell => cell.trim()).length;
    
    for (let i = 0; i < bodyLines.length; i++) {
      const row = bodyLines[i];
      const cols = row.split('|').filter(cell => cell.trim()).length;
      if (cols !== headerCols) {
        warnings.push(`Table ${tableIndex + 1}, Row ${i + 1}: Column count mismatch (expected ${headerCols}, got ${cols})`);
      }
    }
    
    const imagesInTable = Array.from(fullTable.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g));
    for (const imgMatch of imagesInTable) {
      const imagePath = imgMatch[2];
      if (!imagePath.startsWith('http://') && !imagePath.startsWith('https://')) {
        const fullImagePath = path.join(folderPath, imagePath);
        if (!fs.existsSync(fullImagePath)) {
          issues.push(`Table ${tableIndex + 1}: Image not found - ${imagePath}`);
        }
      }
    }
    
    const firstThreeRows = bodyLines.slice(0, 3);
    for (let i = 0; i < firstThreeRows.length; i++) {
      const row = firstThreeRows[i];
      const hasLink = row.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (!hasLink) {
        warnings.push(`Table ${tableIndex + 1}, Row ${i + 1}: No link found (recommended for ranking tables)`);
      }
    }
    
    if (bodyLines.length === 0) {
      warnings.push(`Table ${tableIndex + 1}: No data rows`);
    } else {
      info.push(`Table ${tableIndex + 1}: ${headerCols} columns, ${bodyLines.length} data row(s)`);
    }
  }
  
  return { issues, warnings, info, hasTable: true };
}

let foldersWithIssues = 0;
let totalIssues = 0;
let totalWarnings = 0;

for (const folder of reviewFolders) {
  const folderPath = path.join(reviewsDir, folder);
  const readmePath = path.join(folderPath, 'README.md');
  
  console.log('');
  log(`━━━ ${folder} ━━━`, colors.blue + colors.bold);
  
  if (!fs.existsSync(readmePath)) {
    fail(`  README.md missing`);
    foldersWithIssues++;
    totalIssues++;
    continue;
  }
  
  let readmeContent;
  try {
    readmeContent = fs.readFileSync(readmePath, 'utf-8');
  } catch (error) {
    fail(`  Cannot read README.md: ${error.message}`);
    foldersWithIssues++;
    totalIssues++;
    continue;
  }
  
  if (readmeContent.trim().length === 0) {
    fail(`  README.md is empty`);
    foldersWithIssues++;
    totalIssues++;
    continue;
  }
  
  const structure = validateReadmeStructure(readmeContent);
  
  structure.issues.forEach(issue => {
    fail(`  ${issue}`);
    totalIssues++;
  });
  
  structure.warnings.forEach(warning => {
    warn(`  ${warning}`);
    totalWarnings++;
  });
  
  structure.info.forEach(info => {
    log(`  ${info}`, colors.blue);
  });
  
  const elements = validateMarkdownElements(readmeContent, folderPath);
  
  elements.issues.forEach(issue => {
    fail(`  ${issue}`);
    totalIssues++;
  });
  
  elements.warnings.forEach(warning => {
    warn(`  ${warning}`);
    totalWarnings++;
  });
  
  elements.info.forEach(info => {
    log(`  ${info}`, colors.blue);
  });
  
  const tableValidation = validateTableStructure(readmeContent, folderPath);
  
  tableValidation.issues.forEach(issue => {
    fail(`  ${issue}`);
    totalIssues++;
  });
  
  tableValidation.warnings.forEach(warning => {
    warn(`  ${warning}`);
    totalWarnings++;
  });
  
  tableValidation.info.forEach(info => {
    log(`  ${info}`, colors.blue);
  });
  
  const themePath = path.join(folderPath, 'theme.json');
  if (fs.existsSync(themePath)) {
    try {
      const themeContent = fs.readFileSync(themePath, 'utf-8');
      const theme = JSON.parse(themeContent);
      if (theme.theme) {
        pass(`  theme.json valid`);
      } else {
        warn(`  theme.json missing "theme" property`);
        totalWarnings++;
      }
    } catch (error) {
      fail(`  theme.json invalid: ${error.message}`);
      totalIssues++;
    }
  }
  
  const imagesDir = path.join(folderPath, 'images');
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => 
      f.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)
    );
    log(`  images/ directory: ${imageFiles.length} image file(s)`, colors.blue);
  } else {
    warn(`  No images/ directory found`);
    totalWarnings++;
  }
  
  if (structure.issues.length > 0 || elements.issues.length > 0 || tableValidation.issues.length > 0) {
    foldersWithIssues++;
  }
}

console.log('');
if (foldersWithIssues === 0 && reviewFolders.length > 0) {
  pass(`All ${reviewFolders.length} review folder(s) passed validation`);
} else if (reviewFolders.length > 0) {
  log(`${foldersWithIssues} of ${reviewFolders.length} folder(s) have issues`, colors.yellow);
  log(`Total issues: ${totalIssues}, Total warnings: ${totalWarnings}`, colors.yellow);
}

section('7. CSS and JavaScript Files');

const cssDir = path.join(projectRoot, 'css');
if (fs.existsSync(cssDir)) {
  const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
  if (cssFiles.length > 0) {
    pass(`Found ${cssFiles.length} CSS file(s)`);
    
    if (cssFiles.includes('main.css')) {
      pass('main.css exists (required by generated HTML)');
    } else {
      warn('main.css not found', 'Generated HTML references css/main.css');
    }
  } else {
    warn('No CSS files found in css/ directory');
  }
}

const jsDir = path.join(projectRoot, 'js');
if (fs.existsSync(jsDir)) {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
  if (jsFiles.length > 0) {
    pass(`Found ${jsFiles.length} JS file(s)`);
    
    if (jsFiles.includes('main.js')) {
      pass('main.js exists (required by generated HTML)');
    } else {
      warn('main.js not found', 'Generated HTML references js/main.js');
    }
  } else {
    warn('No JavaScript files found in js/ directory');
  }
}

section('8. File Permissions');

try {
  fs.readdirSync(reviewsDir);
  pass('Can read from reviews/ directory');
} catch (error) {
  fail('Cannot read from reviews/ directory', error.message);
}

const testFile = path.join(projectRoot, '.test-write-permission');
try {
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
  pass('Can write to project directory');
} catch (error) {
  fail('Cannot write to project directory', error.message);
}

section('9. Node.js Environment');

pass(`Node.js version: ${process.version}`);

const requiredModules = ['fs', 'path', 'child_process'];
for (const mod of requiredModules) {
  try {
    require(mod);
    pass(`Module '${mod}' available`);
  } catch (error) {
    fail(`Module '${mod}' not available`, error.message);
  }
}

console.log('');
log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.bold);
log('FINAL SUMMARY', colors.bold);
log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.bold);
console.log('');

log(`✓ Passed:   ${results.passed.length}`, colors.green + colors.bold);
log(`✗ Failed:   ${results.failed.length}`, colors.red + colors.bold);
log(`⚠ Warnings: ${results.warnings.length}`, colors.yellow + colors.bold);

console.log('');

if (results.failed.length === 0) {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green + colors.bold);
  log('✓ ALL TESTS PASSED!', colors.green + colors.bold);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.green + colors.bold);
  console.log('');
  log('You are ready to run the build scripts:', colors.green);
  log('  node build/build-all.js', colors.blue);
  console.log('');
  
  if (results.warnings.length > 0) {
    log('Note: There are warnings, but they should not prevent building.', colors.yellow);
    console.log('');
  }
  
  process.exit(0);
} else {
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.red + colors.bold);
  log('✗ TESTS FAILED!', colors.red + colors.bold);
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.red + colors.bold);
  console.log('');
  log('Please fix the following issues before building:', colors.red);
  console.log('');
  
  results.failed.forEach((failure, index) => {
    log(`${index + 1}. ${failure.message}`, colors.red);
    if (failure.details) {
      log(`   ${failure.details}`, colors.red);
    }
  });
  
  console.log('');
  process.exit(1);
}
