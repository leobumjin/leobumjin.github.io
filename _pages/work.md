---
layout: default
title: Work
permalink: /work/
---

<div class="work-page">
  <div class="work-layout">
    <aside class="work-nav" aria-label="Work sections">
      <div class="work-nav-box">
        <a class="work-nav-link work-nav-top-link" href="#">Work</a>
        <a class="work-nav-link" href="#work-publications">Publications</a>
        <a class="work-nav-link" href="#work-projects">Projects</a>
        <a class="work-nav-link" href="#work-experiences">Experience</a>
        <a class="work-nav-link" href="#work-education">Education</a>
      </div>
    </aside>

    <div class="work-main">
      <div id="work-top"></div>
      <section class="work-hero">
        <div class="work-hero-copy">
          <h1>Work</h1>
          <p class="work-intro">
            Research History
          </p>
        </div>
      </section>

      <section class="work-section" id="work-publications">
        <div class="work-section-heading">
          <h2 class="home-section-label">Publications</h2>
        </div>
        <div class="work-list" id="work-publications-list">
          <p class="posts-archive-summary">Loading publications...</p>
        </div>
      </section>

      <section class="work-section" id="work-projects">
        <div class="work-section-heading">
          <h2 class="home-section-label">Projects</h2>
        </div>
        <div class="work-list" id="work-projects-list">
          <p class="posts-archive-summary">Loading projects...</p>
        </div>
      </section>

      <section class="work-section" id="work-experiences">
        <div class="work-section-heading">
          <h2 class="home-section-label">Experience</h2>
        </div>
        <div class="work-list" id="work-experiences-list">
          <p class="posts-archive-summary">Loading experience...</p>
        </div>
      </section>

      <section class="work-section" id="work-education">
        <div class="work-section-heading">
          <h2 class="home-section-label">Education</h2>
        </div>
        <div class="work-list" id="work-education-list">
          <p class="posts-archive-summary">Loading education...</p>
        </div>
      </section>
    </div>
  </div>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var svgBasePath = '{{ "/assets/svg/" | relative_url }}';
    var topButton = document.querySelector('.work-nav-top-link');

    var sections = [
      { id: 'work-publications-list', path: '{{ "/data/publication.json" | relative_url }}', type: 'publication' },
      { id: 'work-projects-list', path: '{{ "/data/projects.json" | relative_url }}', type: 'project' },
      { id: 'work-experiences-list', path: '{{ "/data/experiences.json" | relative_url }}', type: 'experience' },
      { id: 'work-education-list', path: '{{ "/data/education.json" | relative_url }}', type: 'education' }
    ];

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    if (topButton) {
      topButton.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    function findMappedIcon(linkMapping, label) {
      if (!linkMapping || !label) return '';
      if (Object.prototype.hasOwnProperty.call(linkMapping, label)) {
        return linkMapping[label];
      }
      var wanted = String(label).toLowerCase();
      var keys = Object.keys(linkMapping);
      for (var i = 0; i < keys.length; i += 1) {
        if (keys[i].toLowerCase() === wanted) return linkMapping[keys[i]];
      }
      return '';
    }

    function inferIconFromUrl(url) {
      var value = String(url || '').toLowerCase();
      if (!value) return 'link.svg';
      if (value.indexOf('github.com') !== -1) return 'github.svg';
      if (value.indexOf('youtube.com') !== -1 || value.indexOf('youtu.be') !== -1) return 'youtube.svg';
      if (value.indexOf('drive.google.com') !== -1 || value.indexOf('1drv.ms') !== -1 || value.indexOf('googleusercontent.com') !== -1) return 'google-drive.svg';
      return 'link.svg';
    }

    function iconThemeClass(iconFileName) {
      var name = String(iconFileName || '').toLowerCase();
      if (name === 'youtube.svg') return ' work-link-youtube';
      return '';
    }

    function renderLinks(links, metadata, type) {
      if (!Array.isArray(links) || !links.length) return '';
      var linkMapping = metadata && metadata['link-mapping'] ? metadata['link-mapping'] : {};
      return links.map(function (link) {
        var label = link.label || 'Link';
        var mappedIcon = findMappedIcon(linkMapping, label);
        var url = String(link.url || '');

        if (!mappedIcon && /github\.com/i.test(url)) {
          mappedIcon = findMappedIcon(linkMapping, 'Github');
        }

        if (type === 'publication' && mappedIcon) {
          var publicationThemeClass = iconThemeClass(mappedIcon);
          return '' +
            '<a class="work-link-icon' + publicationThemeClass + '" href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer" aria-label="' + escapeHtml(label) + '">' +
              '<img src="' + escapeHtml(svgBasePath + mappedIcon) + '" alt="' + escapeHtml(label) + '" loading="lazy">' +
            '</a>';
        }

        var iconName = mappedIcon || inferIconFromUrl(url);
        var linkThemeClass = iconThemeClass(iconName);
        return '' +
          '<a class="work-link work-link-with-icon' + linkThemeClass + '" href="' + escapeHtml(url) + '" target="_blank" rel="noreferrer">' +
            '<img class="work-link-inline-icon" src="' + escapeHtml(svgBasePath + iconName) + '" alt="" loading="lazy" aria-hidden="true">' +
            '<span>' + escapeHtml(label) + '</span>' +
          '</a>';
      }).join('');
    }

    function renderNotes(notes) {
      if (!Array.isArray(notes) || !notes.length) return '';
      return '<ul class="work-item-notes">' + notes.map(function (note) {
        return '<li>' + escapeHtml(note) + '</li>';
      }).join('') + '</ul>';
    }

    function parseHexColor(hex) {
      if (typeof hex !== 'string') return null;
      var value = hex.trim();
      if (!value) return null;
      if (value.charAt(0) === '#') value = value.slice(1);
      if (value.length === 3) {
        value = value.split('').map(function (c) { return c + c; }).join('');
      }
      if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
      return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16)
      };
    }

    function getReadableTextColor(bgColor) {
      var rgb = parseHexColor(bgColor);
      if (!rgb) return '#ffffff';
      var luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
      return luminance > 0.6 ? '#111111' : '#ffffff';
    }

    function findChipConfig(colorMapping, chip) {
      if (!colorMapping || !chip) return null;
      if (Object.prototype.hasOwnProperty.call(colorMapping, chip)) {
        return colorMapping[chip];
      }
      var chipLower = String(chip).toLowerCase();
      var keys = Object.keys(colorMapping);
      for (var i = 0; i < keys.length; i += 1) {
        if (keys[i].toLowerCase() === chipLower) {
          return colorMapping[keys[i]];
        }
      }
      return null;
    }

    function renderChipLabel(chip) {
      return allowBasicInlineHtml(
        escapeHtml(chip || '')
        .replace(/\\n/g, '<br>')
        .replace(/\n/g, '<br>')
      );
    }

    function allowBasicInlineHtml(value) {
      return String(value || '')
        .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
        .replace(/&lt;strong&gt;/gi, '<strong>')
        .replace(/&lt;\/strong&gt;/gi, '</strong>');
    }

    function renderAuthors(authors) {
      if (!authors) return '';
      var safe = allowBasicInlineHtml(escapeHtml(String(authors)));

      if (!/<strong>\s*bumjin park\s*<\/strong>/i.test(safe)) {
        safe = safe.replace(/\bbumjin park\b/gi, '<strong>Bumjin Park</strong>');
      }

      return safe;
    }

    function formatPublicationVenue(rawVenue, dateText) {
      var venue = String(rawVenue || '').trim();
      if (!venue) return '';
      var parts = venue.split(',');
      var result = '';

      if (parts.length > 1) {
        result = parts.slice(1).join(',').trim();
      } else {
        result = venue;
      }

      var date = String(dateText || '').trim();
      if (date) {
        var suffix = ', ' + date;
        if (result.slice(-suffix.length) === suffix) {
          result = result.slice(0, -suffix.length).trim();
        } else if (result === date) {
          result = parts[0] ? String(parts[0]).trim() : '';
        }
      }

      return result;
    }

    function renderItem(item, type, metadata) {
      var title = '';
      var kind = '';
      var meta = '';
      var metaHtml = '';
      var venueHtml = '';
      var compactMeta = '';
      var headerDate = '';
      var summary = '';
      var notes = '';
      var actions = '';
      var chipStyle = '';
      var colorMapping = metadata && metadata['color-mapping'] ? metadata['color-mapping'] : {};

      if (type === 'publication' && item.chip) {
        var chipConfig = findChipConfig(colorMapping, item.chip);
        var lightColor = '';
        var darkColor = '';

        if (typeof chipConfig === 'string') {
          lightColor = chipConfig;
          darkColor = chipConfig;
        } else if (chipConfig && typeof chipConfig === 'object') {
          lightColor = chipConfig.white || chipConfig.light || '';
          darkColor = chipConfig.dark || lightColor;
        }

        if (lightColor || darkColor) {
          if (!lightColor) lightColor = darkColor;
          if (!darkColor) darkColor = lightColor;

          var lightText = getReadableTextColor(lightColor);
          var darkText = getReadableTextColor(darkColor);
          chipStyle = ' style="' +
            '--chip-bg-light: ' + escapeHtml(lightColor) + '; ' +
            '--chip-bg-dark: ' + escapeHtml(darkColor) + '; ' +
            '--chip-fg-light: ' + escapeHtml(lightText) + '; ' +
            '--chip-fg-dark: ' + escapeHtml(darkText) + '; ' +
            'border-color: transparent;"';
        }
      }

      if (type === 'publication') {
        title = item.title || '';
        meta = item.authors || '';
        metaHtml = renderAuthors(item.authors || '');
        summary = '';
        kind = formatPublicationVenue(item.venue || '', item.date || '');
        if (!kind) {
          kind = String(item.venue || '').trim();
        }
        venueHtml = kind ? escapeHtml(kind) : '';
        notes = item.chip ? '<div class="work-item-chips"><span class="work-item-chip"' + chipStyle + '>' + renderChipLabel(item.chip) + '</span></div>' : '';
        actions = renderLinks(item.links, metadata, type);

        var pubMetaParts = [];
        if (item.chip) {
          pubMetaParts.push('<span class="work-item-pub-part"><span class="work-item-chip"' + chipStyle + '>' + renderChipLabel(item.chip) + '</span></span>');
        }
        if (venueHtml) {
          pubMetaParts.push('<span class="work-item-pub-part"><span class="work-item-venue-label">' + venueHtml + '</span></span>');
        }
        if (item.date) {
          pubMetaParts.push('<span class="work-item-pub-part"><span class="work-item-year-label">' + escapeHtml(item.date) + '</span></span>');
        }
        compactMeta = pubMetaParts.join('');
      } else if (type === 'project') {
        title = item.title || '';
        headerDate = item.date || '';
        meta = '';
        var projectMetaParts = [];
        if (item.organization) {
          projectMetaParts.push('<span class="work-item-meta-chip">' + escapeHtml(item.organization) + '</span>');
        }
        if (item.focus) {
          projectMetaParts.push('<span class="work-item-venue-label">' + escapeHtml(item.focus) + '</span>');
        }
        if (item.tools) {
          projectMetaParts.push('<span class="work-item-venue-label">' + escapeHtml(item.tools) + '</span>');
        }
        compactMeta = projectMetaParts.join('<span class="work-item-pub-sep"> | </span>');
        actions = renderLinks(item.links, metadata, type);
      } else if (type === 'experience') {
        title = item.title || '';
        headerDate = item.date || '';
        meta = '';
        var expMetaParts = [];
        if (item.organization) {
          expMetaParts.push('<span class="work-item-meta-chip">' + escapeHtml(item.organization) + '</span>');
        }
        if (item.focus) {
          expMetaParts.push('<span class="work-item-venue-label">' + escapeHtml(item.focus) + '</span>');
        }
        compactMeta = expMetaParts.join('<span class="work-item-pub-sep"> | </span>');
        actions = renderLinks(item.links, metadata, type);
      } else if (type === 'education') {
        title = item.institution || '';
        headerDate = item.date || '';
        meta = '';
        var eduMetaParts = [];
        if (item.degree) {
          eduMetaParts.push('<span class="work-item-meta-chip">' + escapeHtml(item.degree) + '</span>');
        }
        if (item.major || item.focus) {
          eduMetaParts.push('<span class="work-item-venue-label">' + escapeHtml(item.major || item.focus) + '</span>');
        }
        compactMeta = eduMetaParts.join('<span class="work-item-pub-sep"> | </span>');
      }

      return '' +
        '<article class="work-item is-compact' + (type === 'publication' ? ' is-publication' : '') + '">' +
          '<div class="work-item-date-column">' +
            '<div class="work-item-date">' + escapeHtml(item.date || '') + '</div>' +
            (type === 'publication' && item.chip ? '<div class="work-item-chips"><span class="work-item-chip"' + chipStyle + '>' + renderChipLabel(item.chip) + '</span></div>' : '') +
          '</div>' +
          '<div class="work-item-main">' +
            '<div class="work-item-header">' +
              '<h2 class="work-item-title">' + escapeHtml(title) + '</h2>' +
              (type !== 'publication' && kind ? '<span class="work-item-kind">' + escapeHtml(kind) + '</span>' : '') +
              (type !== 'publication' && headerDate ? '<span class="work-item-header-date">' + escapeHtml(headerDate) + '</span>' : '') +
            '</div>' +
            (meta ? '<p class="work-item-meta">' + (type === 'publication' ? metaHtml : escapeHtml(meta)) + '</p>' : '') +
            (compactMeta ? '<p class="work-item-pub-meta">' + compactMeta + '</p>' : '') +
            (summary ? '<p class="work-item-summary">' + escapeHtml(summary) + '</p>' : '') +
            (type === 'publication' ? '' : notes) +
          '</div>' +
          '<div class="work-item-actions">' + actions + '</div>' +
        '</article>';
    }

    sections.forEach(function (section) {
      var root = document.getElementById(section.id);
      if (!root) return;

      fetch(section.path, { cache: 'no-store' })
        .then(function (response) {
          if (!response.ok) throw new Error('Failed to load data.');
          return response.json();
        })
        .then(function (data) {
          var items = data && Array.isArray(data.items) ? data.items : [];
          var metadata = data && data.metadata ? data.metadata : {};
          if (!items.length) {
            root.innerHTML = '<p class="posts-archive-summary">No entries yet.</p>';
            return;
          }
          root.innerHTML = items.map(function (item) {
            return renderItem(item, section.type, metadata);
          }).join('');
        })
        .catch(function () {
          root.innerHTML = '<p class="posts-archive-summary">Unable to load entries.</p>';
        });
    });
  });
</script>
