---
layout: default
title: Work
permalink: /research/
---

<div class="work-page">
  <div class="work-layout">
    <aside class="work-nav" aria-label="Work sections">
      <div class="work-nav-box">
        <a class="work-nav-link" href="#work-publications">Publications</a>
        <a class="work-nav-link" href="#work-projects">Projects</a>
        <a class="work-nav-link" href="#work-experiences">Experience</a>
        <a class="work-nav-link" href="#work-education">Education</a>
      </div>
    </aside>

    <div class="work-main">
      <section class="work-hero">
        <div class="work-hero-copy">
          <p class="home-section-label">Work</p>
          <h1>Work</h1>
          <p class="work-intro">
            A structured overview of research output, applied projects, institutional roles,
            and academic training.
          </p>
        </div>
      </section>

      <section class="work-section" id="work-publications">
        <div class="work-section-heading">
          <p class="home-section-label">Publications</p>
        </div>
        <div class="work-list" id="work-publications-list">
          <p class="posts-archive-summary">Loading publications...</p>
        </div>
      </section>

      <section class="work-section" id="work-projects">
        <div class="work-section-heading">
          <p class="home-section-label">Projects</p>
        </div>
        <div class="work-list" id="work-projects-list">
          <p class="posts-archive-summary">Loading projects...</p>
        </div>
      </section>

      <section class="work-section" id="work-experiences">
        <div class="work-section-heading">
          <p class="home-section-label">Experience</p>
        </div>
        <div class="work-list" id="work-experiences-list">
          <p class="posts-archive-summary">Loading experience...</p>
        </div>
      </section>

      <section class="work-section" id="work-education">
        <div class="work-section-heading">
          <p class="home-section-label">Education</p>
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

    function renderLinks(links) {
      if (!Array.isArray(links) || !links.length) return '';
      return links.map(function (link) {
        return '<a class="work-link" href="' + escapeHtml(link.url) + '" target="_blank" rel="noreferrer">' + escapeHtml(link.label) + '</a>';
      }).join('');
    }

    function renderNotes(notes) {
      if (!Array.isArray(notes) || !notes.length) return '';
      return '<ul class="work-item-notes">' + notes.map(function (note) {
        return '<li>' + escapeHtml(note) + '</li>';
      }).join('') + '</ul>';
    }

    function renderItem(item, type) {
      var title = '';
      var kind = '';
      var meta = '';
      var summary = '';
      var notes = '';
      var actions = '';

      if (type === 'publication') {
        title = item.title || '';
        meta = item.authors || '';
        summary = '';
        kind = item.venue || '';
        notes = item.chip ? '<div class="work-item-chips"><span class="work-item-chip">' + escapeHtml(item.chip) + '</span></div>' : '';
        actions = renderLinks(item.links);
      } else if (type === 'project') {
        title = item.title || '';
        kind = item.organization || '';
        meta = item.tools || '';
        summary = item.summary || '';
        notes = renderNotes(item.highlights);
        actions = renderLinks(item.links);
      } else if (type === 'experience') {
        title = item.title || '';
        kind = item.organization || '';
        meta = item.focus || '';
        notes = renderNotes(item.highlights);
        actions = renderLinks(item.links);
      } else if (type === 'education') {
        title = item.institution || '';
        meta = item.degree || '';
        notes = renderNotes(item.highlights);
      }

      return '' +
        '<article class="work-item">' +
          '<div class="work-item-date-column">' +
            '<div class="work-item-date">' + escapeHtml(item.date || '') + '</div>' +
            (type === 'publication' && item.chip ? '<div class="work-item-chips"><span class="work-item-chip">' + escapeHtml(item.chip) + '</span></div>' : '') +
          '</div>' +
          '<div class="work-item-main">' +
            '<div class="work-item-header">' +
              '<h2 class="work-item-title">' + escapeHtml(title) + '</h2>' +
              (kind ? '<span class="work-item-kind">' + (type === 'publication' ? ', ' : '') + escapeHtml(kind) + '</span>' : '') +
            '</div>' +
            (meta ? '<p class="work-item-meta">' + escapeHtml(meta) + '</p>' : '') +
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
          if (!items.length) {
            root.innerHTML = '<p class="posts-archive-summary">No entries yet.</p>';
            return;
          }
          root.innerHTML = items.map(function (item) {
            return renderItem(item, section.type);
          }).join('');
        })
        .catch(function () {
          root.innerHTML = '<p class="posts-archive-summary">Unable to load entries.</p>';
        });
    });
  });
</script>
