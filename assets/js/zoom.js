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
  })
});
