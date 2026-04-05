// Initialize medium zoom.
$(document).ready(function() {
  var scrollLockY = 0;

  function lockPageScroll() {
    scrollLockY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + scrollLockY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function unlockPageScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo(0, scrollLockY);
  }

  function isMobileZoomView() {
    return window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
  }

  // Get theme background color from CSS variable or use default
  var bgColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-bg-color') || 
      getComputedStyle(document.documentElement)
      .getPropertyValue('--global-bg-color') ||
      'rgb(255, 233, 213)';  // Default theme color
  
  // Convert rgb to rgba with transparency
  if (bgColor.startsWith('rgb(')) {
    bgColor = bgColor.replace('rgb(', 'rgba(').replace(')', ', 0.95)');
  } else if (!bgColor.includes('rgba')) {
    bgColor = bgColor + 'ee';  // Add transparency if hex
  }
  
  var isMobileViewport = isMobileZoomView();
  var zoomMargin = isMobileViewport ? 16 : 72;

  medium_zoom = mediumZoom('[data-zoomable]', {
    margin: zoomMargin,
    background: bgColor,
  });

  var zoomCaptionEl = null;

  function ensureZoomCaptionElement() {
    if (zoomCaptionEl) return zoomCaptionEl;
    zoomCaptionEl = document.createElement('div');
    zoomCaptionEl.className = 'medium-zoom-caption';
    document.body.appendChild(zoomCaptionEl);
    return zoomCaptionEl;
  }

  medium_zoom.on('open', function (event) {
    if (isMobileZoomView()) {
      lockPageScroll();
    }
    if (isMobileZoomView()) {
      if (zoomCaptionEl) zoomCaptionEl.classList.remove('is-visible');
      return;
    }
    var target = event && event.target;
    if (!target || !target.getAttribute) return;
    var caption = (target.getAttribute('data-zoom-caption') || '').trim();
    if (!caption) return;
    var el = ensureZoomCaptionElement();
    el.textContent = caption;
    el.classList.add('is-visible');
  });

  medium_zoom.on('closed', function () {
    if (isMobileZoomView()) {
      unlockPageScroll();
    }
    if (!zoomCaptionEl) return;
    zoomCaptionEl.classList.remove('is-visible');
  });
});
