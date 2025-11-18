#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const DEFAULT_CONFIG = {
  inputFile: 'README.md',
  templateFile: null,
  outputFile: 'index.html',
  
  theme: {
    colorBgPrimary: '#0a0a0a',
    colorBgSecondary: '#121212',
    colorAccentPrimary: '#3b82f6',
    colorAccentSecondary: '#8b5cf6',
    colorAccentSuccess: '#10b981',
    colorAccentDanger: '#ef4444'
  },
  
  classes: {
    serviceIcon: 'service-icon',
    serviceLogo: 'service-logo',
    comparisonTable: 'comparison-table',
    serviceCard: 'service-card',
    serviceTitle: 'service-title',
    serviceDetails: 'service-details',
    subsection: 'subsection',
    subsectionTitle: 'subsection-title',
    annotation: 'annotation',
    callout: 'callout',
    itemList: 'vpn-list',
    tableWrapper: 'table-wrapper',
    twoColumnSubsections: 'two-column-subsections'
  },
  
  layout: {
    twoColumnSections: ['abstract', 'methodology'],
    multiColumnSubsections: ['critical-understanding-architectural-vs-policy-based-privacy', 'critical-understanding-architectural-vs-policy-privacy'],
    enableIllustrations: true,
    illustrations: {
      'abstract': `<svg class="section-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none">
  <!-- Document with shield -->
  <rect x="80" y="60" width="240" height="300" rx="12" fill="currentColor" opacity="0.1" stroke="currentColor" stroke-width="3"/>
  <path d="M120 100 L280 100 M120 130 L280 130 M120 160 L220 160" stroke="currentColor" stroke-width="4" stroke-linecap="round" opacity="0.6"/>
  <circle cx="200" cy="250" r="70" fill="var(--color-bg-primary)" stroke="currentColor" stroke-width="4"/>
  <path d="M200 190 C160 190 140 210 140 240 C140 290 200 320 200 320 C200 320 260 290 260 240 C260 210 240 190 200 190 Z" fill="currentColor" opacity="0.8" stroke="currentColor" stroke-width="3"/>
  <path d="M175 240 L190 255 L225 220" stroke="var(--color-bg-primary)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
      'methodology': `<svg class="section-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" fill="none">
  <!-- Compass/Target -->
  <circle cx="200" cy="200" r="140" stroke="currentColor" stroke-width="4" opacity="0.3"/>
  <circle cx="200" cy="200" r="100" stroke="currentColor" stroke-width="4" opacity="0.5"/>
  <circle cx="200" cy="200" r="60" stroke="currentColor" stroke-width="4" opacity="0.7"/>
  <circle cx="200" cy="200" r="20" fill="currentColor" opacity="0.9"/>
  <line x1="200" y1="50" x2="200" y2="90" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <line x1="200" y1="310" x2="200" y2="350" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <line x1="50" y1="200" x2="90" y2="200" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <line x1="310" y1="200" x2="350" y2="200" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
  <path d="M200 200 L280 140 L260 200 L280 260 Z" fill="currentColor" opacity="0.7" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
</svg>`
    }
  },
  
  parsing: {
    serviceCardPattern: /^\d+\./,
    convertIcons: true,
    enableLinks: true,
    enableImages: true,
    enableBold: true,
    enableItalic: true,
    enableCode: true
  }
};

function findProjectRoot() {
  let currentDir = process.cwd();
  let depth = 0;
  const maxDepth = 5;
  
  while (depth < maxDepth) {
    const buildDir = path.join(currentDir, 'build');
    if (fs.existsSync(buildDir) && fs.statSync(buildDir).isDirectory()) {
      return currentDir;
    }
    
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
    depth++;
  }
  
  return process.cwd();
}

function getRelativePath(from, to) {
  const rel = path.relative(from, to);
  return rel.startsWith('.') ? rel : './' + rel;
}

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof RegExp) return new RegExp(obj.source, obj.flags);
  if (obj instanceof Date) return new Date(obj.getTime());
  if (Array.isArray(obj)) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function loadConfig() {
  let config;
  try {
    config = typeof structuredClone !== 'undefined' ? structuredClone(DEFAULT_CONFIG) : deepClone(DEFAULT_CONFIG);
  } catch (e) {
    config = deepClone(DEFAULT_CONFIG);
  }
  
  let workDir;
  if (process.argv[2]) {
    workDir = path.resolve(process.argv[2]);
  } else {
    workDir = process.cwd();
  }
  
  const projectRoot = findProjectRoot();
  const categoryName = path.basename(workDir);
  
  const templatePath = path.join(projectRoot, 'templates', 'template.html');
  const githubPath = path.join(projectRoot, 'templates', 'github.html');
  const footerPath = path.join(projectRoot, 'templates', 'footer.html');
  const siteDir = path.join(projectRoot, 'site', categoryName);
  const outputPath = path.join(siteDir, 'index.html');
  
  const cssPath = '../css/review.css';
  const jsPath = '../js/review.js';
  
  config.templateFile = templatePath;
  config.githubFile = githubPath;
  config.outputFile = outputPath;
  config.footerFile = footerPath;

  config._paths = {
    workDir: workDir,
    projectRoot: projectRoot,
    categoryName: categoryName,
    siteDir: siteDir,
    cssPath: cssPath,
    jsPath: jsPath,
    relativeToRoot: path.relative(workDir, projectRoot) || '.'
  };
  
  const themePath = path.join(workDir, 'theme.json');
  if (fs.existsSync(themePath)) {
    try {
      const themeConfig = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
      config = mergeConfig(config, themeConfig);
      console.log('✓ Loaded theme.json');
    } catch (error) {
      console.warn('Warning: Could not parse theme.json');
    }
  }
  
  const configPath = path.join(workDir, 'build.config.json');
  if (fs.existsSync(configPath)) {
    try {
      const userConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      config = mergeConfig(config, userConfig);
      console.log('✓ Loaded build.config.json');
    } catch (error) {
      console.warn('Warning: Could not parse build.config.json');
    }
  }
  
  return config;
}

function mergeConfig(defaults, overrides) {
  const result = { ...defaults };
  
  for (const key in overrides) {
    if (overrides[key] && typeof overrides[key] === 'object' && 
        !Array.isArray(overrides[key]) && !(overrides[key] instanceof RegExp)) {
      result[key] = mergeConfig(defaults[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  
  return result;
}

function convertMarkdown(text, isTableCell = false, config) {
  if (!text) return '';
  
  text = text.replace(/\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g, 
    '<a href="$3" target="_blank" rel="noopener noreferrer"><img src="$2" alt="$1"/></a>');
  
  const imgClass = isTableCell ? config.classes.serviceIcon : config.classes.serviceLogo;
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, `<img src="$2" alt="$1" class="${imgClass}"/>`);
  
  if (config.parsing.enableBold) {
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }
  
  if (config.parsing.enableItalic) {
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  }
  
  if (config.parsing.enableLinks) {
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }
  
  if (config.parsing.enableCode) {
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  }
  
  if (config.parsing.convertIcons) {
    text = text.replace(/✓|✔|✅/g, 
      '<svg class="icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>');
    text = text.replace(/✗|✖|❌/g, 
      '<svg class="icon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-danger)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
    text = text.replace(/⚠|⚠️/g, 
      '<svg class="icon-warning" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>');
  }
  
  return text;
}

function titleToId(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseMarkdown(md, config) {
  const lines = md.split('\n');
  const data = {
    title: '',
    subtitle: '',
    badges: [],
    sections: [],
    annotations: [],
    notes: [],
    callouts: [],
    navigation: null,
    footer: null
  };
  
  let currentSection = null;
  let currentService = null;
  let currentSubsection = null;
  let inTable = false;
  let tableDelimiterPassed = false;
  let tableHeaders = [];
  let tableRows = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;
    
    if (trimmed.startsWith('<!-- annotation:')) {
      const text = trimmed.replace('<!-- annotation:', '').replace('-->', '').trim();
      data.annotations.push(text);
      continue;
    }
    

    
    if (trimmed.startsWith('<!-- note:')) {
      const text = trimmed.replace('<!-- note:', '').replace('-->', '').trim();
      data.notes.push(text);
      continue;
    }
    
    if (trimmed.startsWith('<!-- callout:')) {
      const text = trimmed.replace('<!-- callout:', '').replace('-->', '').trim();
      data.callouts.push(text);
      continue;
    }
    
    if (trimmed.startsWith('<!-- navigation -->')) {
      const nextLine = lines[i + 1];
      if (nextLine) {
        data.navigation = nextLine.trim();
        i++;
      }
      continue;
    }
    
    if (trimmed.startsWith('## Footer')) {
      if (currentSection) {
        if (inTable) {
          currentSection.table = { headers: tableHeaders, rows: tableRows };
          inTable = false;
          tableHeaders = [];
          tableRows = [];
          tableDelimiterPassed = false;
        }
        data.sections.push(currentSection);
        currentSection = null;
      }
      
      for (let j = i + 1; j < lines.length; j++) {
        const footerLine = lines[j].trim();
        if (footerLine && !footerLine.startsWith('#')) {
          data.footer = footerLine;
          break;
        }
      }
      continue;
    }
    
    if (trimmed.startsWith('# ') && !data.title) {
      data.title = trimmed.replace(/^# /, '');
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        const nextLine = lines[j].trim();
        if (nextLine && !nextLine.startsWith('#') && !nextLine.startsWith('<!--') && !nextLine.startsWith('[![')) {
          data.subtitle = nextLine;
          break;
        }
      }
      continue;
    }
    
    if (trimmed.startsWith('## ')) {
      if (currentSection) {
        if (inTable) {
          currentSection.table = { headers: tableHeaders, rows: tableRows };
          inTable = false;
          tableHeaders = [];
          tableRows = [];
          tableDelimiterPassed = false;
        }
        data.sections.push(currentSection);
      }
      
      const title = trimmed.replace(/^## /, '');
      currentSection = {
        type: 'section',
        title: title,
        id: titleToId(title),
        content: [],
        subsections: [],
        items: []
      };
      currentService = null;
      currentSubsection = null;
      continue;
    }
    
    if (trimmed.startsWith('### ') && currentSection) {
      const title = trimmed.replace(/^### /, '');
      
      if (title.match(config.parsing.serviceCardPattern)) {
        currentService = {
          title: title,
          content: [],
          details: []
        };
        currentSection.subsections.push(currentService);
        currentSubsection = currentService;
      } else {
        currentService = null;
        currentSubsection = {
          title: title,
          content: [],
          items: []
        };
        currentSection.subsections.push(currentSubsection);
      }
      continue;
    }
    
    if (trimmed.startsWith('|') && currentSection) {
      if (!inTable) {
        tableHeaders = trimmed.split('|').map(h => h.trim()).filter(h => h);
        inTable = true;
        tableDelimiterPassed = false;
      } else if (!tableDelimiterPassed && trimmed.includes('---')) {
        tableDelimiterPassed = true;
      } else {
        const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
        if (cells.length > 0) {
          tableRows.push(cells);
        }
      }
      continue;
    }
    
    if (currentService && trimmed.startsWith('* **')) {
      const match = trimmed.match(/^\* \*\*(.+?):\*\*\s*(.+)/);
      if (match) {
        currentService.details.push({
          label: match[1],
          value: match[2]
        });
      }
      continue;
    }
    
    if (trimmed.match(/^\d+\.\s+\*\*/) && currentSubsection && !currentSubsection.details) {
      const match = trimmed.match(/^\d+\.\s+\*\*(.+?)\*\*[:\s-]+(.+)/);
      if (match) {
        const itemText = trimmed;
        currentSubsection.items.push(itemText);
      }
      continue;
    }
    
    if ((trimmed.startsWith('- **') || trimmed.startsWith('* **')) && currentSection) {
      const match = trimmed.match(/^[*-]\s+\*\*(.+?)\*\*[:\s-]+(.+)/);
      if (match) {
        const item = {
          name: match[1],
          description: match[2]
        };
        
        if (currentSubsection && !currentSubsection.details) {
          if (!currentSubsection.items) currentSubsection.items = [];
          currentSubsection.items.push(item);
        } 
        else if (currentSection.subsections.length === 0) {
          currentSection.items.push(item);
        }
      }
      continue;
    }
    
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('|') && 
        !trimmed.match(/^[*-]\s+\*\*/) &&
        !trimmed.match(/^\d+\.\s+\*\*/) &&
        !trimmed.startsWith('<!--') && trimmed !== '---') {
      if (currentSection) {
        if (currentSubsection && currentSubsection.content) {
          currentSubsection.content.push(trimmed);
        } else if (currentSection.subsections.length === 0) {
          currentSection.content.push(trimmed);
        }
      }
    }
  }
  
  if (currentSection) {
    if (inTable) {
      currentSection.table = { headers: tableHeaders, rows: tableRows };
    }
    data.sections.push(currentSection);
  }
  
  return data;
}

function generateHTML(data, config) {
  let html = '';
  var newLine = "\n";

  if (!fs.existsSync(config.githubFile)) {
    throw new Error(`Github file not found: ${config.githubFile}`);
  }
  if (!fs.existsSync(config.footerFile)) {
    throw new Error(`Footer file not found: ${config.footerFile}`);
  }
    
  let github = fs.readFileSync(config.githubFile, 'utf-8');
  let footer_data = fs.readFileSync(config.footerFile, 'utf-8');

  
  if (data.title) {
    html += `<div class="hero">
<h1 class="mega-title">${convertMarkdown(data.title, false, config)}</h1>${newLine}`;
    if (data.subtitle) {
      html += `<p class="hero-subtitle">${convertMarkdown(data.subtitle, false, config)}</p>${newLine}`;
    }
    html += github + `</div>

${newLine}`;
  }
  
  if (data.sections.length > 0) {
    html += `<nav class="main-nav">
<a href="../index.html" class="back-link">← Back to All Reviews</a>${newLine}`;
    
    if (data.navigation) {
      html += convertMarkdown(data.navigation, false, config);
      html += `${newLine}`;
    } else {
      data.sections.forEach(section => {
        html += `<a href="#${section.id}">${section.title}</a>${newLine}`;
      });
    }
    
    html += `</nav>

${newLine}`;
  }
  
  html += `<div class="container">

${newLine}`;
  
  let annotationIndex = 0;
  let calloutIndex = 0;
  
  data.sections.forEach(section => {
    const isTwoColumn = config.layout.twoColumnSections.includes(section.id);
    const isMultiColumnSubsection = config.layout.multiColumnSubsections.includes(section.id);
    
    let sectionClass = 'section';
    if (isTwoColumn) {
      sectionClass += ' two-column-layout';
    }
    
    html += `<section id="${section.id}" class="${sectionClass}">${newLine}`;
    
    if (isTwoColumn) {
      html += `<div class="section-header">
<h2 class="section-title">${convertMarkdown(section.title, false, config)}</h2>
</div>
<div class="content-column">${newLine}`;
      
      if (section.content && section.content.length > 0) {
        section.content.forEach((para, index) => {
          if (index === 0) {
            html += `<p class="lead">${convertMarkdown(para, false, config)}</p>${newLine}`;
          } else {
            html += `<p>${convertMarkdown(para, false, config)}</p>${newLine}`;
          }
        });
        
        if (annotationIndex < data.annotations.length) {
          html += `<div class="${config.classes.annotation}" style="border-left-color: var(--color-accent-primary);">${convertMarkdown(data.annotations[annotationIndex], false, config)}</div>${newLine}`;
          annotationIndex++;
        }
      }
      
      section.subsections.forEach(subsection => {
        if (!subsection.details) {
          html += `<div class="${config.classes.subsection}">
<h3 class="${config.classes.subsectionTitle}">${subsection.title}</h3>${newLine}`;
          if (subsection.content && subsection.content.length > 0) {
            subsection.content.forEach(para => {
              html += `<p>${convertMarkdown(para, false, config)}</p>${newLine}`;
            });
          }
          if (subsection.items && subsection.items.length > 0) {
            const firstItem = subsection.items[0];
            if (typeof firstItem === 'string') {
              subsection.items.forEach(item => {
                html += `<p>${convertMarkdown(item, false, config)}</p>${newLine}`;
              });
            } else {
              html += `<ul class="${config.classes.itemList}">${newLine}`;
              subsection.items.forEach(item => {
                html += `<li><strong>${item.name}:</strong> ${convertMarkdown(item.description, false, config)}</li>${newLine}`;
              });
              html += `</ul>${newLine}`;
            }
          }
          html += `</div>${newLine}`;
        }
      });
      
      if (calloutIndex < data.callouts.length && section.subsections.length > 0) {
        html += `<div class="${config.classes.callout}">${convertMarkdown(data.callouts[calloutIndex], false, config)}</div>${newLine}`;
        calloutIndex++;
      }
      
      html += `</div>
<div class="illustration-column">${newLine}`;
      if (config.layout.enableIllustrations && config.layout.illustrations[section.id]) {
        html += config.layout.illustrations[section.id];
      }
      html += `</div>${newLine}`;
    } 
    else {
      html += `<div class="section-header">
<h2 class="section-title">${convertMarkdown(section.title, false, config)}</h2>
</div>${newLine}`;
      
      if (section.content && section.content.length > 0) {
        section.content.forEach(para => {
          html += `<p>${convertMarkdown(para, false, config)}</p>${newLine}`;
        });
        
        if (annotationIndex < data.annotations.length) {
          html += `<div class="${config.classes.annotation}" style="border-left-color: var(--color-accent-primary);">${convertMarkdown(data.annotations[annotationIndex], false, config)}</div>${newLine}`;
          annotationIndex++;
        }
      }
      
      if (section.items && section.items.length > 0) {
        html += `<ul class="${config.classes.itemList}">${newLine}`;
        section.items.forEach(item => {
          html += `<li><strong>${item.name}:</strong> ${convertMarkdown(item.description, false, config)}</li>${newLine}`;
        });
        html += `</ul>${newLine}`;
      }
      
      if (section.table) {
        html += `<div class="${config.classes.tableWrapper}">
<table class="${config.classes.comparisonTable}">
<thead><tr>${newLine}`;
        section.table.headers.forEach(header => {
          html += `<th>${convertMarkdown(header, true, config)}</th>${newLine}`;
        });
        html += `</tr></thead>
<tbody>${newLine}`;
        section.table.rows.forEach((row, idx) => {
          const rowClass = idx === 0 ? ' class="top-row"' : '';
          html += `<tr${rowClass}>${newLine}`;
          row.forEach((cell, cellIdx) => {
            const cellClass = cellIdx === 0 ? ' class="rank-cell"' : '';
            html += `<td${cellClass}>${convertMarkdown(cell, true, config)}</td>${newLine}`;
          });
          html += `</tr>${newLine}`;
        });
        html += `</tbody>
</table>
</div>${newLine}`;
      }
      
      if (isMultiColumnSubsection && section.subsections.length >= 2) {
        html += `<div class="${config.classes.twoColumnSubsections}">${newLine}`;
      }
      
      section.subsections.forEach(subsection => {
        if (subsection.hasOwnProperty('details')) {
          let logoHTML = '';
          let otherContent = [];
          
          if (subsection.content && subsection.content.length > 0) {
            subsection.content.forEach(para => {
              const converted = convertMarkdown(para, false, config);
              if (converted.includes(`class="${config.classes.serviceLogo}"`)) {
                logoHTML = converted;
              } else {
                otherContent.push(converted);
              }
            });
          }
          
          html += `<div class="${config.classes.serviceCard}">
<h3 class="${config.classes.serviceTitle}">${logoHTML}${convertMarkdown(subsection.title, false, config)}</h3>${newLine}`;
          if (otherContent.length > 0) {
            otherContent.forEach(content => {
              html += `${content}${newLine}`;
            });
          }
          html += `<dl class="${config.classes.serviceDetails}">${newLine}`;
          subsection.details.forEach(detail => {
            html += `<dt>${detail.label}</dt>
<dd>${convertMarkdown(detail.value, false, config)}</dd>${newLine}`;
          });
          html += `</dl>${newLine}`;
          
          if (subsection.items && subsection.items.length > 0) {
            const firstItem = subsection.items[0];
            if (typeof firstItem === 'string') {
              subsection.items.forEach(item => {
                html += `<p>${convertMarkdown(item, false, config)}</p>${newLine}`;
              });
            } else {
              html += `<ul class="${config.classes.itemList}">${newLine}`;
              subsection.items.forEach(item => {
                html += `<li><strong>${item.name}:</strong> ${convertMarkdown(item.description, false, config)}</li>${newLine}`;
              });
              html += `</ul>${newLine}`;
            }
          }
          
          html += `</div>${newLine}`;
        } else {
          html += `<div class="${config.classes.subsection}">
<h3 class="${config.classes.subsectionTitle}">${subsection.title}</h3>${newLine}`;
          if (subsection.content && subsection.content.length > 0) {
            subsection.content.forEach(para => {
              html += `<p>${convertMarkdown(para, false, config)}</p>${newLine}`;
            });
          }
          if (subsection.items && subsection.items.length > 0) {
            const firstItem = subsection.items[0];
            if (typeof firstItem === 'string') {
              subsection.items.forEach(item => {
                html += `<p>${convertMarkdown(item, false, config)}</p>${newLine}`;
              });
            } else {
              html += `<ul class="${config.classes.itemList}">${newLine}`;
              subsection.items.forEach(item => {
                html += `<li><strong>${item.name}:</strong> ${convertMarkdown(item.description, false, config)}</li>${newLine}`;
              });
              html += `</ul>${newLine}`;
            }
          }
          html += `</div>${newLine}`;
        }
      });
      
      if (isMultiColumnSubsection) {
        html += `</div>${newLine}`;
      }
      
      if (calloutIndex < data.callouts.length && section.subsections.length > 0 && !isMultiColumnSubsection) {
        html += `<div class="${config.classes.callout}">${convertMarkdown(data.callouts[calloutIndex], false, config)}</div>${newLine}`;
        calloutIndex++;
      }
    }
    
    html += `</section>

${newLine}`;
  });
  
  html += `</div>

${newLine}`;
  
  if (data.footer) {
    html += `<footer>
<p>${convertMarkdown(data.footer, false, config)}</p>
${footer_data}
</footer>`;
  }
  
  return html.trim();
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
  </style>
  `;
}

function build() {
  try {
    const config = loadConfig();
    const workDir = config._paths.workDir;
    const projectRoot = config._paths.projectRoot;
    const categoryName = config._paths.categoryName;
    const siteDir = config._paths.siteDir;
    const cssPath = config._paths.cssPath;
    const jsPath = config._paths.jsPath;
    
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║   Universal Markdown Build Script    ║');
    console.log('╚═══════════════════════════════════════╝\n');
    
    console.log(`Project Root: ${projectRoot}`);
    console.log(`Category: ${categoryName}`);
    console.log(`Output: site/${categoryName}/`);
    console.log('');
    
    const markdownPath = path.join(workDir, config.inputFile);
    
    if (!fs.existsSync(markdownPath)) {
      throw new Error(`Input file not found: ${config.inputFile}`);
    }
    if (!fs.existsSync(config.templateFile)) {
      throw new Error(`Template file not found: ${config.templateFile}`);
    }
    if (!fs.existsSync(config.githubFile)) {
      throw new Error(`Github file not found: ${config.githubFile}`);
    }
    
    const markdown = fs.readFileSync(markdownPath, 'utf-8');
    let template = fs.readFileSync(config.templateFile, 'utf-8');
    
    template = template
      .replace(/href="review\.css"/g, `href="${cssPath}"`)
      .replace(/src="review\.js"/g, `src="${jsPath}"`);
    
    console.log(`Reading: ${config.inputFile}`);
    console.log(`Template: templates/template.html`);
    console.log(`CSS: ${cssPath}`);
    console.log(`JS: ${jsPath}`);
    console.log('');
    
    console.log('Parsing markdown...');
    const data = parseMarkdown(markdown, config);
    console.log(`✓ Parsed: ${data.sections.length} sections`);
    
    console.log('Generating HTML...');
    const content = generateHTML(data, config);
    console.log('✓ HTML generated');
    
    console.log('Applying theme...');
    const themeCSS = generateThemeCSS(config.theme);
    console.log('✓ Theme applied');
    
    console.log('Injecting into template...');
    let finalHTML = template
      .replace('<!-- CONTENT -->', content)
      .replace('<!-- THEME -->', themeCSS);
    
    if (data.title) {
      const titleMatch = template.match(/<title>(.*?)<\/title>/);
      if (titleMatch) {
        const originalTitle = titleMatch[1];
        const newTitle = `${data.title} - ${originalTitle}`;
        finalHTML = finalHTML.replace(/<title>.*?<\/title>/, `<title>${newTitle}</title>`);
      }
    }
    
    console.log('✓ Content injected');
    
    if (!fs.existsSync(siteDir)) {
      fs.mkdirSync(siteDir, { recursive: true });
      console.log(`✓ Created: site/${categoryName}/`);
    }
    
    console.log('Copying assets...');
    const entries = fs.readdirSync(workDir, { withFileTypes: true });
    let copiedCount = 0;
    
    const skipFiles = ['README.md', 'theme.json', 'build.config.json', 'index.html'];
    
    for (const entry of entries) {
      if (skipFiles.includes(entry.name)) continue;
      
      const srcPath = path.join(workDir, entry.name);
      const destPath = path.join(siteDir, entry.name);
      
      if (entry.isDirectory()) {
        copyDirectory(srcPath, destPath);
        copiedCount++;
        console.log(`  ✓ Copied directory: ${entry.name}/`);
      } else {
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
      }
    }
    
    if (copiedCount > 0) {
      console.log(`✓ Copied ${copiedCount} asset(s)`);
    }
    
    console.log(`Writing: site/${categoryName}/index.html`);
    fs.writeFileSync(config.outputFile, finalHTML, 'utf-8');
    console.log('✓ Build complete!\n');
    
    console.log(`Generated: ${config.outputFile}\n`);
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

module.exports = { build, parseMarkdown, generateHTML, convertMarkdown, loadConfig, titleToId };
