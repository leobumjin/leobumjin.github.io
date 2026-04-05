// Initialize medium zoom.
$(document).ready(function() {
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
  
  medium_zoom = mediumZoom('[data-zoomable]', {
    margin: 100,
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
    var target = event && event.target;
    if (!target || !target.getAttribute) return;
    var caption = (target.getAttribute('data-zoom-caption') || '').trim();
    if (!caption) return;
    var el = ensureZoomCaptionElement();
    el.textContent = caption;
    el.classList.add('is-visible');
  });

  medium_zoom.on('closed', function () {
    if (!zoomCaptionEl) return;
    zoomCaptionEl.classList.remove('is-visible');
  });
});
