(function () {
  var config = window.__PAGE_VIEWS_CONFIG__ || {};
  var cache = {};

  function isEnabled() {
    return !!(config && config.enabled && config.endpoint);
  }

  function normalizePath(pathValue) {
    var value = String(pathValue || '').trim();
    if (!value) return '/';

    try {
      if (/^https?:\/\//i.test(value)) {
        value = new URL(value).pathname;
      }
    } catch (error) {
      return '/';
    }

    if (!value.startsWith('/')) value = '/' + value;
    return value;
  }

  function formatViews(countText, locale) {
    var count = String(countText || '').trim();
    if (!count) return '';
    return locale === 'ko' ? ('조회 ' + count) : (count + ' views');
  }

  function endpointForPath(pathValue) {
    var base = String(config.endpoint || '').replace(/\/+$/, '');
    var path = normalizePath(pathValue);
    return base + '/counter/' + path + '.json';
  }

  function fetchCount(pathValue) {
    var path = normalizePath(pathValue);
    if (cache[path]) return cache[path];

    cache[path] = fetch(endpointForPath(path), {
      headers: { 'Accept': 'application/json' }
    }).then(function (response) {
      if (!response.ok) return null;
      return response.json();
    }).then(function (payload) {
      return payload && payload.count != null ? String(payload.count) : null;
    }).catch(function () {
      return null;
    });

    return cache[path];
  }

  function currentTrackedPath() {
    try {
      var canonical = document.querySelector('link[rel="canonical"]');
      if (canonical && canonical.href) {
        return normalizePath(new URL(canonical.href).pathname);
      }
    } catch (error) {
      // Fall back to GoatCounter/runtime path below.
    }

    try {
      if (window.goatcounter && typeof window.goatcounter.get_data === 'function') {
        var data = window.goatcounter.get_data();
        if (data && data.p) return normalizePath(data.p);
      }
    } catch (error) {
      // Fall back to the pathname below.
    }

    return normalizePath(window.location.pathname);
  }

  function setElementCount(node, countText) {
    if (!node || !countText) return;
    var locale = String(node.getAttribute('data-page-views-locale') || 'en').toLowerCase();
    node.textContent = formatViews(countText, locale === 'ko' ? 'ko' : 'en');
    node.hidden = false;
  }

  function hydrateNode(node) {
    if (!node) return;

    var path = node.hasAttribute('data-page-views-current')
      ? currentTrackedPath()
      : normalizePath(node.getAttribute('data-page-views-path'));

    fetchCount(path).then(function (countText) {
      if (!countText) return;
      setElementCount(node, countText);

      var meta = node.closest('.post-meta');
      if (!meta) return;

      var divider = meta.querySelector('.post-view-divider');
      if (divider) divider.hidden = false;
    });
  }

  function hydrateAll() {
    if (!isEnabled()) return;

    var nodes = document.querySelectorAll('[data-page-views-path], [data-page-views-current]');
    if (!nodes.length) return;

    nodes.forEach(hydrateNode);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateAll);
  } else {
    hydrateAll();
  }
})();
