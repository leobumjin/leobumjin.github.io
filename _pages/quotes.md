---
layout: default
title: Quotes
permalink: /quotes/
---

<div class="quotes-page">
  <header class="quotes-page-header">
    <h1>Quotes<span aria-hidden="true">.</span></h1>
  </header>
  <div class="quotes-collection" id="quotesCollection" aria-live="polite">Loading quotes…</div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function () {
  var root = document.getElementById('quotesCollection');
  fetch('{{ "/assets/jsons/quotes.json" | relative_url }}')
    .then(function (response) {
      if (!response.ok) throw new Error('Unable to load quotes');
      return response.json();
    })
    .then(function (data) {
      root.replaceChildren();
      (data.quotes || []).forEach(function (quote) {
        var figure = document.createElement('figure');
        figure.id = quote.id;
        var blockquote = document.createElement('blockquote');
        var text = document.createElement('p');
        String(quote.full || quote.text || '').split(/(\*\*[^*]+\*\*)/g).forEach(function (part) {
          if (part.startsWith('**') && part.endsWith('**')) {
            var strong = document.createElement('strong');
            strong.textContent = part.slice(2, -2);
            text.appendChild(strong);
          } else {
            text.appendChild(document.createTextNode(part));
          }
        });
        blockquote.appendChild(text);
        var caption = document.createElement('figcaption');
        caption.textContent = quote.author || '';
        if (quote.source) {
          var source = document.createElement('cite');
          source.textContent = quote.source;
          caption.append(document.createTextNode(' — '), source);
        }
        figure.append(blockquote, caption);
        root.appendChild(figure);
      });
      if (!root.children.length) root.textContent = 'No quotes yet.';
    })
    .catch(function () { root.textContent = 'Unable to load quotes.'; });
});
</script>
