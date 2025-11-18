#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

function parseTopThreeFromTable(readmeContent, folder) {
  const topThree = [];
  
  const tableRegex = /\|[^\n]+\|[\s\S]*?\n\|[-:\s|]+\|\n((?:\|[^\n]+\|\n?)+)/;
  const tableMatch = readmeContent.match(tableRegex);
  
  if (!tableMatch) {
    return topThree;
  }
  
  const rowsText = tableMatch[1];
  const rows = rowsText.split('\n').filter(row => row.trim().startsWith('|'));
  
  for (let i = 0; i < Math.min(3, rows.length); i++) {
    const row = rows[i];
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
    
    if (cells.length < 2) continue;
    
    const serviceCell = cells[1];
    
    const imgMatch = serviceCell.match(/!\[([^\]]*)\]\(([^)]+)\)/);
    let imagePath = null;
    let altText = '';
    if (imgMatch) {
      altText = imgMatch[1];
      imagePath = `${folder}/${imgMatch[2]}`;
    }
    
    const linkMatch = serviceCell.match(/\[([^\]]+)\]\(([^)]+)\)/);
    let name = '';
    let url = '';
    if (linkMatch) {
      name = linkMatch[1];
      url = linkMatch[2];
    } else {
      name = altText || cells[0];
    }
    
    if (name && imagePath) {
      topThree.push({
        name: name,
        image: imagePath,
        url: url
      });
    }
  }
  
  return topThree;
}

function findReviewFolders(projectRoot) {
  const reviewsDir = path.join(projectRoot, 'reviews');
  const reviews = [];
  
  if (!fs.existsSync(reviewsDir)) {
    console.warn('reviews/ directory not found');
    return reviews;
  }
  
  const items = fs.readdirSync(reviewsDir);
  
  for (const item of items) {
    const itemPath = path.join(reviewsDir, item);
    const stats = fs.statSync(itemPath);
    
    if (!stats.isDirectory()) continue;
    if (item.startsWith('.') || item === 'node_modules') continue;
    
    const readmePath = path.join(itemPath, 'README.md');
    if (!fs.existsSync(readmePath)) continue;
    
    const readmeContent = fs.readFileSync(readmePath, 'utf-8');
    const firstLine = readmeContent.split('\n')[0];
    
    const category = extractCategory(firstLine);
    if (!category) {
      console.warn(`Could not extract category from: ${item}/README.md`);
      continue;
    }
    
    const siteIndexPath = path.join(projectRoot, 'site', item, 'index.html');
    const hasIndex = fs.existsSync(siteIndexPath);
    
    const themePath = path.join(itemPath, 'theme.json');
    let theme = null;
    if (fs.existsSync(themePath)) {
      try {
        const themeData = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
        theme = themeData.theme || null;
      } catch (e) {
        console.warn(`Could not parse theme.json in ${item}`);
      }
    }
    
    const topThree = parseTopThreeFromTable(readmeContent, item);
    
    reviews.push({
      folder: item,
      category: category,
      title: firstLine.replace(/^#\s*/, '').trim(),
      hasIndex: hasIndex,
      theme: theme,
      topThree: topThree
    });
  }
  
  reviews.sort((a, b) => a.category.localeCompare(b.category));
  
  return reviews;
}

function loadGlobalTheme(projectRoot) {
  const themePath = path.join(projectRoot, 'theme.json');
  if (fs.existsSync(themePath)) {
    try {
      const themeData = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
      return themeData.theme || null;
    } catch (e) {
      console.warn('Could not parse global theme.json');
    }
  }
  
  return {
    colorBgPrimary: '#0a0a0a',
    colorBgSecondary: '#121212',
    colorAccentPrimary: '#3b82f6',
    colorAccentSecondary: '#8b5cf6',
    colorAccentSuccess: '#10b981',
    colorAccentDanger: '#ef4444'
  };
}

function generateCategoryCards(reviews) {
  let html = '';
  
  for (const review of reviews) {
    const link = review.hasIndex ? `${review.folder}/index.html` : `${review.folder}/README.md`;
    
    const themeColors = review.theme || {};
    const accentColor = themeColors.colorAccentPrimary || 'var(--color-accent-primary)';
    
    let topThreeHTML = '';
    if (review.topThree && review.topThree.length > 0) {
      review.topThree.forEach(item => {
        topThreeHTML += `
          <div class="top-item">
            <img src="${item.image}" alt="${item.name}" class="item-icon">
            <span class="item-name">${item.name}</span>
          </div>`;
      });
    } else {
      topThreeHTML = '<div class="no-items">No rankings yet</div>';
    }
    
    html += `
      <a href="${link}" class="category-card" style="--card-accent: ${accentColor}">
        <div class="category-header">
          <h2 class="category-title">${review.category}</h2>
        </div>
        <div class="top-three">
          ${topThreeHTML}
        </div>
        <div class="category-footer">
          <span class="category-link">SEE ALL</span>
        </div>
      </a>`;
  }
  
  return html;
}

function generateThemeCSS(theme) {
  return `
  <style>
    :root {
      --color-bg-primary: ${theme.colorBgPrimary};
      --color-bg-secondary: ${theme.colorBgSecondary};
      --color-accent-primary: ${theme.colorAccentPrimary};
      --color-accent-secondary: ${theme.colorAccentSecondary};
      --color-accent-success: ${theme.colorAccentSuccess};
      --color-accent-danger: ${theme.colorAccentDanger};
    }
  </style>`;
}

function generateHTML(projectRoot, reviews, theme) {
  const categoryCards = generateCategoryCards(reviews);
  const themeCSS = generateThemeCSS(theme);

  const templateDir = path.join(projectRoot, 'templates');
  const githubFile = templateDir+"/github.html";
  const footerFile = templateDir+"/footer.html";

  if (!fs.existsSync(githubFile)) {
    throw new Error(`Github file not found: ${githubFile}`);
  }  
  if (!fs.existsSync(footerFile)) {
    throw new Error(`Footer file not found: ${footerFile}`);
  }  
     
  let github = fs.readFileSync(githubFile, 'utf-8');
  let footer_data = fs.readFileSync(footerFile, 'utf-8');
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Curated reviews and comparisons by GitHub users. Evidence-based analysis focusing on privacy, security, and transparency.">
  <meta name="keywords" content="reviews, comparisons, privacy, security, open source, github">
  <meta name="author" content="GitHub Community">
  
  <meta property="og:title" content="Open Source Reviews - Curated by GitHub Users">
  <meta property="og:description" content="Evidence-based reviews and comparisons focusing on privacy and security.">
  <meta property="og:type" content="website">
  
  <title>Open Source Reviews - Curated by GitHub Users</title>
  
  <link rel="stylesheet" href="css/main.css">
  ${themeCSS}
  
  <noscript>
    <style>
      body { display: block !important; }
    </style>
  </noscript>
</head>
<body style="display:none;">

<header class="compact-header">
  <div class="header-left">
    <h1 class="main-title">Open Source Reviews</h1>
    <span class="main-subtitle">Curated by GitHub Users</span>
  </div>
  <div class="header-stats">
    <div class="stat-item">
      <span class="stat-number">${reviews.length}</span>
      <span class="stat-label">categories</span>
    </div>
  </div>
</header>

<main class="container">
  <div class="category-grid">
    ${categoryCards}
  </div>
</main>

${github}

<footer class="main-footer">
  <p>A public service by the users of GitHub</p>
${footer_data}
</footer>

<script src="js/main.js"></script>

</body>
</html>`;
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  let copiedCount = 0;
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copiedCount += copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      copiedCount++;
    }
  }
  
  return copiedCount;
}

function build() {
  try {
    const scriptDir = __dirname;
    const projectRoot = fs.existsSync(path.join(scriptDir, '..', 'reviews')) 
      ? path.join(scriptDir, '..') 
      : path.dirname(scriptDir);
    
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   Main Index Builder                  ║');
    console.log('╚═══════════════════════════════════════╝\n');
    
    console.log(`Project Root: ${projectRoot}`);
    console.log('');
    
    console.log('Scanning for review folders...');
    const reviews = findReviewFolders(projectRoot);
    
    if (reviews.length === 0) {
      console.log('No review folders found!');
      console.log('   Make sure /reviews/ subdirectories contain README.md files\n');
      return;
    }
    
    console.log(`✓ Found ${reviews.length} review categories:`);
    reviews.forEach(review => {
      const topCount = review.topThree ? review.topThree.length : 0;
      console.log(`  • ${review.category} (${topCount} top items)`);
    });
    console.log('');
    
    console.log('Loading theme...');
    const theme = loadGlobalTheme(projectRoot);
    console.log('✓ Theme loaded');
    
    console.log('Generating HTML...');
    const html = generateHTML(projectRoot, reviews, theme);
    console.log('✓ HTML generated');
    
    const siteDir = path.join(projectRoot, 'site');
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
      console.log('✓ Created site/ directory');
    }
    
    console.log('Writing index.html...');
    const indexPath = path.join(siteDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf-8');
    console.log('✓ index.html written');
    
    const cssSourceDir = path.join(projectRoot, 'css');
    const cssDestDir = path.join(siteDir, 'css');
    
    if (fs.existsSync(cssSourceDir)) {
      console.log('Copying CSS files...');
      const cssCount = copyDirectory(cssSourceDir, cssDestDir);
      console.log(`✓ Copied ${cssCount} CSS file(s)`);
    } else {
      console.warn('css/ directory not found');
    }
    
    const jsSourceDir = path.join(projectRoot, 'js');
    const jsDestDir = path.join(siteDir, 'js');
    
    if (fs.existsSync(jsSourceDir)) {
      console.log('Copying JS files...');
      const jsCount = copyDirectory(jsSourceDir, jsDestDir);
      console.log(`✓ Copied ${jsCount} JS file(s)`);
    } else {
      console.warn('js/ directory not found');
    }
    
    console.log('\n✓ Build complete!\n');
    console.log('Generated: site/index.html');
    console.log(`Categories: ${reviews.length}\n`);
    
  } catch (error) {
    console.error('\n✗ Build failed:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  build();
}

module.exports = { build, findReviewFolders, extractCategory };
