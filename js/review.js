(function() {
  'use strict';

  if (document.body) {
    document.body.style.display = 'block';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    console.log('VPN Comparison initialized');
    
    convertYesNoToSVG();
    wrapServiceDetailPairs();
    setupTableSorting();
    setupSearchFilter();
    setupSmoothScrolling();
    setupBackToTop();
    setupAnimations();
    setupKeyboardShortcuts();
    setupStickyNav();
    setupSectionHighlighting();
    addPlayfulTouches();
    
    console.log('All features loaded');
  }

  function convertYesNoToSVG() {
    const checkSVG = '<svg class="icon-check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    const xSVG = '<svg class="icon-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    
    const cells = document.querySelectorAll('.comparison-table td');
    cells.forEach(cell => {
      if (cell.querySelector('a') || cell.querySelector('svg')) {
        return;
      }
      
      const text = cell.textContent.trim();
      
      if (text === 'Yes' || text.startsWith('Yes ')) {
        cell.innerHTML = checkSVG + ' ' + text;
      } else if (text === 'No' || text.startsWith('No ')) {
        cell.innerHTML = xSVG + ' ' + text;
      }
    });
    
    console.log('Converted Yes/No to SVG icons');
  }

  function setupStickyNav() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    const navOffsetTop = nav.offsetTop;
    
    const spacer = document.createElement('div');
    spacer.className = 'nav-spacer';
    nav.parentNode.insertBefore(spacer, nav);

    let isSticky = false;

    window.addEventListener('scroll', () => {
      const isMobile = window.innerWidth <= 768;
      const threshold = isMobile ? 200 : 0;
      
      const shouldBeSticky = window.scrollY > (navOffsetTop - threshold);
      
      if (shouldBeSticky !== isSticky) {
        isSticky = shouldBeSticky;
        
        if (isSticky) {
          const navHeight = nav.offsetHeight;
          nav.classList.add('sticky');
          spacer.classList.add('active');
          spacer.style.height = navHeight + 'px';
        } else {
          nav.classList.remove('sticky');
          spacer.classList.remove('active');
        }
      }
    }, { passive: true });
    
    console.log('Sticky nav setup complete');
  }

  function setupSectionHighlighting() {
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    
    if (sections.length === 0 || navLinks.length === 0) {
      console.log('No sections or nav links found');
      return;
    }

    const linkMap = new Map();
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      linkMap.set(href, link);
    });

    const visibleSections = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        
        if (entry.isIntersecting) {
          visibleSections.set(id, entry.intersectionRatio);
        } else {
          visibleSections.delete(id);
        }
      });
      
      let maxRatio = 0;
      let mostVisibleSection = null;
      
      visibleSections.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          mostVisibleSection = id;
        }
      });
      
      if (mostVisibleSection) {
        const activeLink = linkMap.get('#' + mostVisibleSection);
        
        navLinks.forEach(link => link.classList.remove('active'));
        
        if (activeLink) {
          activeLink.classList.add('active');
          console.log('Active section:', mostVisibleSection);
        }
      }
    }, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      rootMargin: '-100px 0px -30% 0px'
    });

    sections.forEach(section => {
      observer.observe(section);
      console.log('Observing section:', section.id);
    });
    
    console.log(`Section highlighting setup complete for ${sections.length} sections`);
  }

  function wrapServiceDetailPairs() {
    const detailLists = document.querySelectorAll('.service-details');
    
    detailLists.forEach(dl => {
      const pairs = [];
      const elements = Array.from(dl.children);
      
      for (let i = 0; i < elements.length; i += 2) {
        const dt = elements[i];
        const dd = elements[i + 1];
        
        if (dt && dd && dt.tagName === 'DT' && dd.tagName === 'DD') {
          const wrapper = document.createElement('div');
          wrapper.className = 'detail-pair';
          wrapper.appendChild(dt.cloneNode(true));
          wrapper.appendChild(dd.cloneNode(true));
          pairs.push(wrapper);
        }
      }
      
      dl.innerHTML = '';
      pairs.forEach(pair => dl.appendChild(pair));
    });
    
    console.log('Wrapped service detail pairs for grid layout');
  }

  function addPlayfulTouches() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.animation = 'subtleWiggle 0.5s ease';
      });
      card.addEventListener('animationend', function() {
        this.style.animation = '';
      });
    });

    if (!document.getElementById('wiggle-animation')) {
      const style = document.createElement('style');
      style.id = 'wiggle-animation';
      style.textContent = `
        @keyframes subtleWiggle {
          0%, 100% { transform: translateY(-4px) rotate(0deg); }
          33% { transform: translateY(-4px) rotate(-0.5deg); }
          66% { transform: translateY(-4px) rotate(0.5deg); }
        }
      `;
      document.head.appendChild(style);
    }

    const rows = document.querySelectorAll('.comparison-table tbody tr');
    rows.forEach(row => {
      row.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(8px)';
      });
      row.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

  function setupTableSorting() {
    const tables = document.querySelectorAll('.comparison-table');
    if (tables.length === 0) return;

    tables.forEach(table => {
      const headers = table.querySelectorAll('thead th');
      let currentSort = { column: -1, direction: 'asc' };

      headers.forEach((header, index) => {
        const arrow = document.createElement('span');
        arrow.className = 'sort-arrow';
        arrow.innerHTML = '↕';
        header.appendChild(arrow);
        
        header.addEventListener('click', () => {
          sortTable(table, index, currentSort);
        });
        header.style.cursor = 'pointer';
      });
    });
  }

  function sortTable(table, columnIndex, currentSort) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    let direction = 'asc';
    if (currentSort.column === columnIndex && currentSort.direction === 'asc') {
      direction = 'desc';
    }
    
    rows.sort((a, b) => {
      let aValue = a.cells[columnIndex]?.textContent.trim() || '';
      let bValue = b.cells[columnIndex]?.textContent.trim() || '';
      
      const aNum = parseFloat(aValue);
      const bNum = parseFloat(bValue);
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      const comparison = aValue.localeCompare(bValue, undefined, { 
        numeric: true, 
        sensitivity: 'base' 
      });
      
      return direction === 'asc' ? comparison : -comparison;
    });
    
    tbody.style.transition = 'opacity 0.2s ease';
    tbody.style.opacity = '0.5';
    
    setTimeout(() => {
      rows.forEach(row => tbody.appendChild(row));
      tbody.style.opacity = '1';
    }, 200);
    
    currentSort.column = columnIndex;
    currentSort.direction = direction;
    
    updateSortIndicators(table, columnIndex, direction);
  }

  function updateSortIndicators(table, activeColumn, direction) {
    const headers = table.querySelectorAll('thead th');
    
    headers.forEach((th, index) => {
      th.classList.remove('sorted');
      const arrow = th.querySelector('.sort-arrow');
      if (!arrow) return;
      
      if (index === activeColumn) {
        th.classList.add('sorted');
        arrow.innerHTML = direction === 'asc' ? '↑' : '↓';
      } else {
        arrow.innerHTML = '↕';
      }
    });
  }

  function setupSearchFilter() {
    const tables = document.querySelectorAll('.comparison-table');
    if (tables.length === 0) return;

    const firstTable = tables[0];
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <input 
        type="search" 
        id="vpnSearch" 
        class="search-input"
        placeholder="Search across all tables... (Cmd/Ctrl+K)" 
        autocomplete="off"
        spellcheck="false"
      >
      <button id="clearSearch" class="btn">
        Clear
      </button>
    `;
    
    const wrapper = firstTable.closest('.table-wrapper');
    if (wrapper) {
      wrapper.parentNode.insertBefore(searchContainer, wrapper);
    }
    
    const searchInput = document.getElementById('vpnSearch');
    const clearButton = document.getElementById('clearSearch');
    
    let debounceTimer;
    
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        filterAllTables(this.value.toLowerCase(), tables);
      }, 150);
    });
    
    clearButton.addEventListener('click', function() {
      searchInput.value = '';
      filterAllTables('', tables);
      searchInput.focus();
      
      this.style.animation = 'shake 0.4s ease';
      setTimeout(() => {
        this.style.animation = '';
      }, 400);
    });

    if (!document.getElementById('shake-animation')) {
      const style = document.createElement('style');
      style.id = 'shake-animation';
      style.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function filterAllTables(searchTerm, tables) {
    let totalVisibleCount = 0;
    
    tables.forEach(table => {
      const tbody = table.querySelector('tbody');
      const rows = tbody.querySelectorAll('tr:not(.no-results)');
      let visibleCount = 0;
      
      rows.forEach((row, index) => {
        const text = row.textContent.toLowerCase();
        const isVisible = text.includes(searchTerm);
        
        if (isVisible) {
          row.style.display = '';
          visibleCount++;
          totalVisibleCount++;
        } else {
          row.style.display = 'none';
        }
      });
      
      const existingMessage = tbody.querySelector('.no-results');
      if (existingMessage) {
        existingMessage.remove();
      }
      
      if (searchTerm && visibleCount === 0) {
        const noResultsRow = document.createElement('tr');
        noResultsRow.className = 'no-results';
        noResultsRow.innerHTML = `
          <td colspan="100" style="text-align: center; padding: var(--space-xl); font-size: 1.25rem; color: var(--color-text-secondary); font-family: var(--font-handdrawn);">
            No matches in this table. Try different keywords!
          </td>
        `;
        tbody.appendChild(noResultsRow);
      }
    });
  }

  function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
          const nav = document.querySelector('.main-nav');
          const navHeight = nav ? nav.offsetHeight : 0;
          const offsetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
          
          history.pushState(null, null, href);
          
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  }

  function setupBackToTop() {
    const button = document.createElement('button');
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
    `;
    
    document.body.appendChild(button);
    
    let isVisible = false;
    
    window.addEventListener('scroll', () => {
      const shouldShow = window.scrollY > 400;
      
      if (shouldShow !== isVisible) {
        isVisible = shouldShow;
        button.classList.toggle('visible', shouldShow);
      }
    }, { passive: true });
    
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  function setupAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    document.querySelectorAll('.section').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
    
    document.querySelectorAll('.service-card').forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`;
      observer.observe(el);
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('vpnSearch');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      
      if (e.key === 'Escape') {
        const searchInput = document.getElementById('vpnSearch');
        if (searchInput && document.activeElement === searchInput) {
          searchInput.value = '';
          searchInput.blur();
          const tables = document.querySelectorAll('.comparison-table');
          filterAllTables('', tables);
        }
      }
    });
  }

})();
