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
  <div class="home-intro">
  <section class="home-hero">
    <div class="home-profile-heading">
      <div class="home-hero-media">
        <div class="home-hero-avatar">
          <img src="{{ '/assets/img/bumjini2.png' | relative_url }}" alt="Portrait of Bumjin Park">
        </div>
      </div>
      <div class="home-profile-heading-copy">
      <p class="home-eyebrow"><span>PhD Student</span><span>AI Researcher</span></p>
      <p class="home-summary">
        I am a <strong>Ph.D. student at KAIST AI</strong>.
      </p>
      </div>
    </div>
    <div class="home-hero-copy">
      <p class="home-summary home-summary-subtle">
        My research explores how large language models <strong>represent, reason over, and revise knowledge</strong>, with a particular focus on <strong>non-monotonic reasoning, belief revision, and learning under changing information</strong>. I study how models maintain or update their beliefs when evidence is introduced, contradicted, or retracted, and how they resolve conflicts among competing rules, constraints, and sources of information.
      </p>
    </div>

  </section>

  <section class="home-profile-meta" aria-label="Profile details">
    <p class="home-profile-line">
      I combine <strong>formal approaches to knowledge representation and reasoning</strong> with empirical studies of language models, including <strong>interpretability and learning-based methods</strong>. My goal is to understand how models acquire and maintain structured knowledge, adapt to changing evidence, and make consistent decisions under conflicting information.
    </p>
    <p class="home-profile-line">
      With a background in <strong>mathematics, computer science, and AI</strong> (B.S. in Mathematics and Software Engineering; M.S. in AI), I aim to develop AI systems that can <strong>reason reliably, revise their knowledge appropriately, and act consistently with evidence and constraints</strong>.
    </p>
    <p class="home-profile-line"><strong>Research interests:</strong> Non-monotonic Reasoning, Belief Revision, Learning under Changing Knowledge, Interpretability, AI Safety</p>
    <div class="home-contact-links">
      <a class="home-contact-link" href="https://www.linkedin.com/in/leobumjin/" target="_blank" rel="noreferrer">
        <img src="{{ '/assets/svg/linkedin.svg' | relative_url }}" alt="" aria-hidden="true">
        <span>LinkedIn</span>
      </a>
      <a class="home-contact-link" href="https://www.instagram.com/leobumjin" target="_blank" rel="noreferrer">
        <img src="{{ '/assets/svg/instagram.svg' | relative_url }}" alt="" aria-hidden="true">
        <span>Instagram</span>
      </a>
      <details class="home-contact-email">
        <summary class="home-contact-link">
          <img src="{{ '/assets/svg/mail.svg' | relative_url }}" alt="" aria-hidden="true">
          <span>Email</span>
        </summary>
        <div class="home-contact-email-panel">
          <div class="home-contact-email-row">
            <span class="home-contact-email-address">bumjin@kaist.ac.kr</span>
            <button type="button" class="home-contact-copy-btn" data-copy="bumjin@kaist.ac.kr" aria-label="Copy KAIST email">
              <img src="{{ '/assets/svg/copy.svg' | relative_url }}" alt="" aria-hidden="true">
            </button>
          </div>
          <div class="home-contact-email-row">
            <span class="home-contact-email-address">bumjini42@gmail.com</span>
            <button type="button" class="home-contact-copy-btn" data-copy="bumjini42@gmail.com" aria-label="Copy Gmail email">
              <img src="{{ '/assets/svg/copy.svg' | relative_url }}" alt="" aria-hidden="true">
            </button>
          </div>
        </div>
      </details>
    </div>
  </section>

  </div>

  <section class="home-news" aria-labelledby="home-news-title">
    <div class="home-section-heading">
      <p class="home-section-label" id="home-news-title">News</p>
    </div>

    <div class="home-news-list" id="home-news-list">
      <p class="home-news-empty">Loading updates...</p>
    </div>
  </section>
</div>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const newsRoot = document.getElementById('home-news-list');
    const copyButtons = document.querySelectorAll('.home-contact-copy-btn');

    const copyText = function(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
      }
      return new Promise(function(resolve, reject) {
        try {
          const temp = document.createElement('textarea');
          temp.value = text;
          temp.setAttribute('readonly', '');
          temp.style.position = 'absolute';
          temp.style.left = '-9999px';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    };

    copyButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const target = btn.getAttribute('data-copy') || '';
        if (!target) return;
        const row = btn.closest('.home-contact-email-row');
        const addressNode = row ? row.querySelector('.home-contact-email-address') : null;
        const originalText = addressNode ? addressNode.textContent : '';

        copyText(target).then(function() {
          btn.classList.add('is-copied');
          if (addressNode) {
            addressNode.textContent = 'Copied to Clipboard';
            addressNode.classList.add('is-copied');
          }
          setTimeout(function() {
            btn.classList.remove('is-copied');
            if (addressNode) {
              addressNode.textContent = originalText;
              addressNode.classList.remove('is-copied');
            }
          }, 1400);
        }).catch(function() {
          if (addressNode) {
            addressNode.textContent = 'Copy failed';
            addressNode.classList.add('is-copied');
            setTimeout(function() {
              addressNode.textContent = originalText;
              addressNode.classList.remove('is-copied');
            }, 1400);
          }
        });
      });
    });

    if (!newsRoot) return;

    const escapeHtml = function(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const formatInlineBreaks = function(value) {
      return escapeHtml(value)
        .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    };

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

    const normalizeItem = function(item) {
      const parts = String(item.date || '').split('-');
      const year = parts[0] || '';
      const month = Number(parts[1]);
      const day = Number(parts[2]);
      const monthName = month >= 1 && month <= 12
        ? new Date(Date.UTC(2000, month - 1, 1)).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) : '';
      const date = [monthName, day || ''].filter(Boolean).join(' ');
      return {
        year: year,
        date: date,
        fullDate: date ? date + (day ? ', ' : ' ') + year : year,
        title: item.title || 'Untitled',
        url: item.url || '',
        highlight: ['broadcast', 'conference'].includes(item.highlight) ? item.highlight : '',
        visible: item.visible !== false
      };
    };

    const sanitizeUrl = function(url) {
      const raw = String(url || '').trim();
      if (!raw) return '';
      try {
        const resolved = new URL(raw, window.location.origin);
        if (resolved.protocol === 'http:' || resolved.protocol === 'https:' || resolved.protocol === 'mailto:') {
          return resolved.href;
        }
        return '';
      } catch (e) {
        return '';
      }
    };

    const renderNewsCard = function(item, dateText) {
      const date = dateText ? '<p class="home-news-date">' + escapeHtml(dateText) + '</p>' : '';
      const safeUrl = sanitizeUrl(item.url || '');
      const title = formatInlineBreaks(item.title || '');
      const body = safeUrl
        ? '<a class="home-news-title-link" href="' + escapeHtml(safeUrl) + '" target="_blank" rel="noreferrer">' +
            title + '</a>'
        : '<span class="home-news-text">' + title + '</span>';

      return '' +
        '<article class="home-news-item' + (item.highlight ? ' home-news-highlight-' + item.highlight : '') + '">' +
          '<div class="home-news-rail">' +
            '<div class="home-news-date-wrap">' + date + '</div>' +
          '</div>' +
          '<div class="home-news-main">' + body + '</div>' +
        '</article>';
    };

    const renderNews = function(rawItems) {
      if (!rawItems.length) {
        renderEmpty('No updates yet.');
        return;
      }

      const items = rawItems.map(normalizeItem).filter(function(item) {
        return item.visible;
      });

      if (!items.length) {
        renderEmpty('No updates yet.');
        return;
      }


      newsRoot.innerHTML = items.map(function(item) {
        return renderNewsCard(item, item.fullDate);
      }).join('');
    };

    let cachedNewsItems = [];
    const media = window.matchMedia ? window.matchMedia('(max-width: 900px)') : null;
    const rerender = function() {
      if (cachedNewsItems.length) renderNews(cachedNewsItems);
    };

    if (media) {
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', rerender);
      } else if (typeof media.addListener === 'function') {
        media.addListener(rerender);
      }
    }

    fetch('{{ "/data/news.json" | relative_url }}', { cache: 'no-store' })
      .then(function(response) {
        if (!response.ok) throw new Error('Failed to load news.');
        return response.text();
      })
      .then(function(text) {
        cachedNewsItems = parseItems(text);
        renderNews(cachedNewsItems);
      })
      .catch(function() {
        renderEmpty('No updates yet.');
      });
  });
</script>
