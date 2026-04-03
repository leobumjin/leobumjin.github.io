---
layout: about
title: Home
permalink: /
subtitle: Bumjin Park
order: 1
profile: false
news: false
selected_papers: false
social: false
_styles: >
---

<div class="home-editorial">
  <section class="home-hero">
    <div class="home-hero-copy">
      <p class="home-eyebrow">AI Researcher</p>
      <h1>(Leo) Bumjin Park</h1>
      <p class="home-summary">
        I study interpretable and reliable AI systems, with a focus on language models,
        reasoning, and model behavior.
      </p>
      <p class="home-summary home-summary-subtle">
        This homepage is a quiet archive of research, writing, and ongoing work.
      </p>
    </div>

    <div class="home-hero-media">
      <img src="{{ '/assets/img/bumjini.jpg' | relative_url }}" alt="Portrait of Bumjin Park">
    </div>
  </section>

  <section class="home-news" aria-labelledby="home-news-title">
    <div class="home-section-heading">
      <p class="home-section-label">News</p>
    </div>

    <div class="home-news-list" id="home-news-list">
      <p class="home-news-empty">Loading updates...</p>
    </div>
  </section>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const newsRoot = document.getElementById('home-news-list');

    if (!newsRoot) return;

    const renderEmpty = function(message) {
      newsRoot.innerHTML = '<p class="home-news-empty">' + message + '</p>';
    };

    const parseItems = function(rawText) {
      if (!rawText || !rawText.trim()) return [];

      try {
        const parsed = JSON.parse(rawText);
        if (Array.isArray(parsed)) return parsed;
        if (parsed && Array.isArray(parsed.items)) return parsed.items;
        return [];
      } catch (error) {
        return [];
      }
    };

    fetch('{{ "/data/news.json" | relative_url }}', { cache: 'no-store' })
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load news.');
        return response.text();
      })
      .then(function(text) {
        const items = parseItems(text);

        if (!items.length) {
          renderEmpty('No updates yet.');
          return;
        }

        const html = items.map(function(item) {
          if (typeof item === 'string') {
            return '<article class="home-news-item"><p class="home-news-text">' + item + '</p></article>';
          }

          const date = item.date ? '<p class="home-news-date">' + item.date + '</p>' : '';
          const titleText = item.title || item.headline || '';
          const href = item.url || item.link || '';
          const markerColor = item.color || '';
          const links = Array.isArray(item.urls)
            ? item.urls
                .filter(function(linkItem) {
                  return linkItem && linkItem.url;
                })
                .map(function(linkItem) {
                  const label = linkItem.title || 'Open';
                  return '<a class="home-news-link" href="' + linkItem.url + '" target="_blank" rel="noreferrer">' + label + '</a>';
                })
                .join('')
            : (href ? '<a class="home-news-link" href="' + href + '" target="_blank" rel="noreferrer">Open</a>' : '');
          const body = titleText ? '<p class="home-news-text">' + titleText + '</p>' : '';

          return '' +
            '<article class="home-news-item">' +
              '<div class="home-news-rail">' +
                '<div class="home-news-date-wrap">' + date + '</div>' +
                '<div class="home-news-marker" aria-hidden="true"' + (markerColor ? ' style="--news-marker-color: ' + markerColor + ';"' : '') + '>' +
                  '<span class="home-news-dot"></span>' +
                  '<span class="home-news-stem"></span>' +
                '</div>' +
              '</div>' +
              '<div class="home-news-main">' + body + '</div>' +
              '<div class="home-news-actions">' + links + '</div>' +
            '</article>';
        }).join('');

        newsRoot.innerHTML = html;
      })
      .catch(function() {
        renderEmpty('No updates yet.');
      });
  });
</script>
