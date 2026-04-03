---
layout: default
title: Research
permalink: /study/
description: 
---

<div class="research-articles">
  <h2>Study</h2>
  <ul class="study-list">
    {%- if site.study -%}
      {%- assign sorted_papers = site.study | where_exp: "item", "item.date != nil" | sort: "date" | reverse -%}
    {%- else -%}
      {%- assign sorted_papers = "" | split: "," -%}
    {%- endif -%}
    {%- for paper in sorted_papers -%}
      <li style="background-color: {{ paper.background_color | default: 'rgb(225, 225, 225)' }};">
        <a href="{%- if paper.redirect -%}{{ paper.redirect }}{%- elsif paper.url -%}{{ paper.url | relative_url }}{%- else -%}#{%- endif -%}">
          <span class="study-title">{{ paper.title }}</span>
          <span class="study-date">{{ paper.date | date: "%Y.%m.%d" }}</span>
        </a>
      </li>
    {%- endfor -%}
  </ul>


<style>
body {
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
  min-height: 100vh;
}

.research-articles {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Georgia', serif;
  background: rgba(255, 255, 255, 0.95);
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  margin-top: 2em;
  margin-bottom: 2em;
}

.study-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.study-list li {
  margin-bottom: 0.2em;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.2em;
  padding: 1em;
  border-radius: 8px;
  margin-bottom: 0.2em;
}

.study-list li:last-child {
  border-bottom: none;
}

.study-list a {
  text-decoration: none;
  color: inherit;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0;
}

.study-list a:hover {
  color: #666;
}

.study-title {
  font-size: 1.1em;
  font-weight: 500;
  color: #333;
}

.study-date {
  font-size: 0.9em;
  color: #888;
  font-family: monospace;
}
</style>
  