(function() {
  'use strict';
  
  function initPage() {
    document.body.style.display = 'block';
    document.body.style.opacity = '0';
    
    void document.body.offsetWidth;
    
    document.body.style.transition = 'opacity 0.3s ease';
    document.body.style.opacity = '1';
  }
  
  function initKeyboardNav() {
    const cards = Array.from(document.querySelectorAll('.category-card'));
    let focusIndex = -1;
    
    document.addEventListener('keydown', (e) => {
      if (document.activeElement.tagName === 'INPUT') return;
      
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        focusIndex = (focusIndex + 1) % cards.length;
        cards[focusIndex].focus();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        focusIndex = focusIndex <= 0 ? cards.length - 1 : focusIndex - 1;
        cards[focusIndex].focus();
      }
    });
    
    cards.forEach((card, index) => {
      card.setAttribute('tabindex', '0');
      
      card.addEventListener('focus', () => {
        focusIndex = index;
      });
      
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }
  
  function init() {
    initPage();
    initKeyboardNav();
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();
