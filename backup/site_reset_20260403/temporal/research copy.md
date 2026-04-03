---
layout: default
title: Research
permalink: /research/
description: 
---

<div class="research-articles">
  <h1>Research Thread</h1>
  <h2>Articles</h2>
  {%- assign sorted_papers = site.research | sort: "date" | reverse -%}
  {%- assign last_month = "" -%}
  {%- assign last_year = "" -%}
  {%- for paper in sorted_papers -%}
    {%- assign paper_year = paper.date | date: "%Y" -%}
    {%- assign paper_month = paper.date | date: "%B %Y" -%}
    {%- if paper_month != last_month -%}
      {%- if forloop.first == false -%}
        </div>
      {%- endif -%}
      <div class="month-section">
        <div class="month-header">{{ paper_month | upcase }}</div>
    {%- endif -%}
    <a class="paper-link-block" href="{%- if paper.redirect -%}{{ paper.redirect }}{%- elsif paper.url -%}{{ paper.url | relative_url }}{%- else -%}#{%- endif -%}" style="text-decoration:none;color:inherit;">
      <div class="paper-list-item{% if paper.highlight %} highlight{% endif %}" {% if paper.background_color %}style="background-color: {{ paper.background_color }};"{% endif %}>
        <div class="paper-title">
          {%- if paper.italic_title -%}
            <em>{{ paper.title }}</em>
          {%- else -%}
            <strong>{{ paper.title }}</strong>
          {%- endif -%}
          {%- if paper.year or paper.authors -%}
            <span class="paper-authors">
              {%- if paper.authors -%}
                {{ paper.authors }}
              {%- endif -%}
              {%- if paper.year -%}
                , {{ paper.year }}
              {%- endif -%}
            </span>
          {%- endif -%}
        </div>
        <div class="paper-desc">{{ paper.description }}</div>
      </div>
    </a>
    {%- assign last_month = paper_month -%}
    {%- assign last_year = paper_year -%}
    {%- if forloop.last -%}
      </div>
    {%- endif -%}
  {%- endfor -%}


<style>
.research-articles {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Georgia', serif;
}
.month-header {
  font-weight: bold;
  font-size: 1.1em;
  /* margin-top: 2em; */
  /* margin-bottom: 0.5em; */
  /* border-top: 2px solid #aaa; */
  padding-top: 1em;
  letter-spacing: 1px;
  padding-left: 0.5em;
  background:#ffffff;
}
.month-section {
  background: #faf8f5;
  /* border: 1px solid #e0e0e0; */
  margin-bottom: 1em;
  border-radius: 0px;
  /* padding: 1em 1.5em 0em 0em; */
  padding-left: 0em;
}
.paper-list-item {
  border-top: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  padding: 1em 1em;
  background-color: rgb(255, 255, 235);
}
.paper-list-item:last-child {
  border-bottom: none;
}
.paper-title {
  font-size: 1.1em;
  margin-bottom: 0.2em;
}
.paper-title em, .paper-title strong {
  font-size: 1.15em;
}
.paper-authors {
  font-style: italic;
  color: #888;
  margin-left: 0.5em;
  font-size: 0.95em;
}
.paper-desc {
  color: #333;
  font-size: 1em;
  margin-top: 0.2em;
}
.highlight {
  background: #f5ecd7;
  border-left: 4px solid #bfa14a;
  padding-left: 1em;
}
</style>
  