---
layout: default
title: Posts
permalink: /essay/
description:
---

<div class="posts-archive">
  <section class="posts-archive-hero">
    <p class="home-section-label">Posts</p>
    <h1 id="postsArchiveQuote">Loading quote...</h1>
    <p class="posts-archive-intro" id="postsArchiveAuthor"></p>
  </section>

  <div class="posts-archive-filter-shell" id="postsArchiveFilterShell" hidden>
    <div class="posts-archive-filter" id="postsArchiveFilter"></div>
  </div>

  <section class="posts-archive-groups" id="postsArchiveGroups">
    <p class="posts-archive-summary">Loading posts...</p>
  </section>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function () {
    var groupsRoot = document.getElementById('postsArchiveGroups');
    var filterShell = document.getElementById('postsArchiveFilterShell');
    var filterBar = document.getElementById('postsArchiveFilter');
    var quoteTitle = document.getElementById('postsArchiveQuote');
    var quoteAuthor = document.getElementById('postsArchiveAuthor');
    if (!groupsRoot) return;
    var allItems = [];
    var activeCategory = '';
    var colorMapping = {};
    var mediaOrder = [];

    function escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function filenameToUrl(filename) {
      if (!filename) return '#';
      var match = String(filename).match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
      if (!match) return '#';
      return '{{ "/blog/" | relative_url }}' + match[1] + '/' + match[4] + '/';
    }

    function formatDate(dateValue) {
      if (!dateValue) return '';
      var parsed = new Date(dateValue + 'T00:00:00');
      if (Number.isNaN(parsed.getTime())) return dateValue;
      return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    function pickDailyQuote(quotes) {
      if (!Array.isArray(quotes) || !quotes.length) return null;
      var now = new Date();
      var dayKey = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      var dayIndex = Math.floor(dayKey / 86400000) % quotes.length;
      return quotes[dayIndex];
    }

    function renderFilterBar() {
      if (!filterBar) return;
      if (!activeCategory) {
        filterBar.innerHTML = '';
        if (filterShell) filterShell.hidden = true;
        return;
      }

      if (filterShell) filterShell.hidden = false;
      filterBar.innerHTML =
        '<button class="posts-archive-filter-pill is-active" type="button" data-category-filter="' + escapeHtml(activeCategory) + '">' +
          escapeHtml(activeCategory) +
        '</button>';
    }

    function renderItems(items) {
      return items.map(function (item) {
        var postUrl = filenameToUrl(item.eng_url);
        var media = item.media || '';
        var dotColor = colorMapping[media] || item.color || '';
        var color = dotColor ? ' style="background:' + escapeHtml(dotColor) + ';"' : '';
        var title = escapeHtml(item.title || 'Untitled');
        var category = escapeHtml(item.category || '');
        var date = escapeHtml(formatDate(item.date));
        return '' +
          '<article class="posts-archive-item">' +
            '<div class="posts-archive-rail">' +
              '<div class="posts-archive-date-wrap">' +
                '<p class="posts-archive-date">' + date + '</p>' +
              '</div>' +
              '<div class="posts-archive-marker" aria-hidden="true">' +
                '<span class="posts-archive-dot"' + color + '></span>' +
                '<span class="posts-archive-stem"></span>' +
              '</div>' +
            '</div>' +
            '<div class="posts-archive-main">' +
              '<h2 class="posts-archive-title"><a href="' + postUrl + '">' + title + '</a></h2>' +
            '</div>' +
            '<div class="posts-archive-side">' +
              (category ? '<button class="posts-archive-category" type="button" data-category-filter="' + category + '">' + category + '</button>' : '') +
            '</div>' +
          '</article>';
      }).join('');
    }

    function renderPosts() {
      var visibleItems = activeCategory
        ? allItems.filter(function (item) { return (item.category || '') === activeCategory; })
        : allItems;

      if (!visibleItems.length) {
        groupsRoot.innerHTML = '<p class="posts-archive-summary">No posts yet.</p>';
        renderFilterBar();
        return;
      }

      var groups = [];
      var seen = {};

      mediaOrder.forEach(function (mediaName) {
        var groupItems = visibleItems.filter(function (item) { return (item.media || '') === mediaName; });
        if (!groupItems.length) return;
        seen[mediaName] = true;
        groups.push({ name: mediaName, items: groupItems });
      });

      visibleItems.forEach(function (item) {
        var mediaName = item.media || 'Other';
        if (seen[mediaName]) return;
        seen[mediaName] = true;
        groups.push({
          name: mediaName,
          items: visibleItems.filter(function (entry) { return (entry.media || 'Other') === mediaName; })
        });
      });

      groupsRoot.innerHTML = groups.map(function (group) {
        return '' +
          '<section class="posts-archive-group">' +
            '<div class="posts-archive-section-heading">' +
              '<p class="home-section-label">' + escapeHtml(group.name) + '</p>' +
            '</div>' +
            '<div class="posts-archive-list">' +
              '<div class="posts-archive-items">' + renderItems(group.items) + '</div>' +
            '</div>' +
          '</section>';
      }).join('');

      renderFilterBar();
    }

    Promise.all([
      fetch('{{ "/data/posts.json" | relative_url }}').then(function (response) {
        if (!response.ok) throw new Error('Failed to load posts.');
        return response.json();
      }),
      fetch('{{ "/data/quote.json" | relative_url }}').then(function (response) {
        if (!response.ok) throw new Error('Failed to load quotes.');
        return response.json();
      }).catch(function () {
        return [];
      })
    ])
      .then(function (results) {
        var postData = results[0];
        var quotes = results[1];
        var items = Array.isArray(postData) ? postData : (Array.isArray(postData.posts) ? postData.posts : []);
        var meta = postData && typeof postData === 'object' && !Array.isArray(postData) ? postData['meta-data'] || {} : {};

        colorMapping = meta['color-mapping'] || {};
        mediaOrder = Object.keys(colorMapping);

        var selectedQuote = pickDailyQuote(quotes);
        if (quoteTitle) {
          quoteTitle.textContent = selectedQuote && selectedQuote.quote ? '"' + selectedQuote.quote + '"' : 'Posts';
        }
        if (quoteAuthor) {
          quoteAuthor.textContent = selectedQuote && selectedQuote.author ? selectedQuote.author : '';
        }

        if (!Array.isArray(items) || !items.length) {
          groupsRoot.innerHTML = '<p class="posts-archive-summary">No posts yet.</p>';
          return;
        }

        allItems = items.slice().sort(function (a, b) {
          return new Date(b.date || 0) - new Date(a.date || 0);
        });
        renderPosts();
      })
      .catch(function () {
        if (quoteTitle) quoteTitle.textContent = 'Posts';
        if (quoteAuthor) quoteAuthor.textContent = '';
        groupsRoot.innerHTML = '<p class="posts-archive-summary">Unable to load posts.</p>';
      });

    document.addEventListener('click', function (event) {
      var trigger = event.target.closest('[data-category-filter]');
      if (!trigger) return;

      var selected = trigger.getAttribute('data-category-filter') || '';
      activeCategory = activeCategory === selected ? '' : selected;
      renderPosts();
    });
  });
</script>
