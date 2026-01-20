---
layout: default
title: Notes
permalink: /mirror/
description: 
---

<div class="posts-container">
  <div class="posts-header">
    <!-- Header section with apricot background -->
  </div>
  
  <div class="posts-content">
    <table class="posts-table">
      <thead>
        <tr>
          <th class="col-date">Date</th>
          <th class="col-title">Title</th>
          <th class="col-category">C</th>
          <th class="col-media">M</th>
        </tr>
      </thead>
      <tbody>
        {%- assign sorted_papers = site.mirror | where_exp: "item", "item.date != nil" | sort: "date" | reverse -%}
        {%- for paper in sorted_papers -%}
        <tr class="post-row">
          <td class="col-date">{{ paper.date | date: "%Y.%m.%d" }}</td>
          <td class="col-title">
            <a href="{%- if paper.redirect -%}{{ paper.redirect }}{%- elsif paper.url -%}{{ paper.url | relative_url }}{%- else -%}#{%- endif -%}">
              {{ paper.title }}
            </a>
          </td>
          <td class="col-category">
            {%- if paper.category -%}
              {{ paper.category }}
            {%- else -%}
              -
            {%- endif -%}
          </td>
          <td class="col-media">
            {%- if paper.media -%}
              {{ paper.media }}
            {%- else -%}
              Article
            {%- endif -%}
          </td>
        </tr>
        {%- endfor -%}
      </tbody>
    </table>
  </div>
</div>

<style>
/* Theme Color Variables */
    :root {
      --theme-bg-color:rgb(255, 233, 213); /* Change this color to update the entire theme */
      --theme-hover-color:rgb(255, 227, 201); /* Darker shade for hover effects */
}

/* AritaBuriKR Font */
@font-face {
  font-family: 'AritaBuriKR';
  src: url('/assets/fonts/AritaBuriKR-Medium.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'AritaBuriKR';
  src: url('/assets/fonts/AritaBuriKR-Bold.ttf') format('truetype');
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: 'AritaBuriKR';
  src: url('/assets/fonts/AritaBuriKR-Light.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
}

/* Override body and container backgrounds to theme color */
body {
  background-color: var(--theme-bg-color) !important;
  font-family: 'AritaBuriKR', sans-serif !important;
}

.container {
  background-color: var(--theme-bg-color) !important;
  font-family: 'AritaBuriKR', sans-serif !important;
}

/* Navbar background to theme color */
.navbar {
  background-color: var(--theme-bg-color) !important;
}

header {
  background-color: var(--theme-bg-color) !important;
}

.posts-container {
  font-family: 'AritaBuriKR', sans-serif !important;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  padding: 0;
  background-color: var(--theme-bg-color) !important;
}

.posts-header {
  background-color: var(--theme-bg-color);
  padding: 2em 0;
  margin-bottom: 0;
}

.posts-content {
  background-color: var(--theme-bg-color);
  padding: 2em 0;
  min-height: 60vh;
  position: relative;
}

.posts-table {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  border-collapse: collapse;
  border-spacing: 0;
  color: #333; /* Dark text color */
  background-color: transparent !important;
  border: none !important;
  font-family: 'AritaBuriKR', sans-serif !important;
  table-layout: fixed;
}

.posts-table thead {
  border-bottom: 2px solid #000;
  background-color: transparent !important;
}

.posts-table thead th {
  padding: 1em 0;
  text-align: left;
  font-weight: normal;
  font-size: 1em;
  color: #333;
  background-color: transparent !important;
  border: none !important;
  border-top: none !important;
  border-left: none !important;
  border-right: none !important;
}

.posts-table thead th.col-date {
  width: 12%;
  padding-left: 1.5em;
  padding-right: 0;
}

.posts-table thead th.col-title {
  width: 50%;
  padding-left: 1.5em;
  padding-right: 1.5em;
}

.posts-table thead th.col-category {
  width: 20%;
  padding-left: 0;
  padding-right: 0;
  text-align: right;
}

.posts-table thead th.col-media {
  width: 18%;
  padding-left: 0;
  padding-right: 1.5em;
  text-align: right;
}

.posts-table thead th:hover {
  background-color: transparent !important;
}

.posts-table thead tr:hover {
  background-color: transparent !important;
}



.posts-table tbody tr {
  border-bottom: 1px solid #000 !important;
  border-top: none !important;
  background-color: transparent !important;
  transition: background-color 0.2s ease;
}

.posts-table tbody tr:hover {
  background-color: var(--theme-hover-color) !important;
}

.posts-table tbody tr:last-child {
  border-bottom: none;
}

.posts-table tbody tr:nth-child(even) {
  background-color: transparent !important;
}

.posts-table tbody tr:nth-child(odd) {
  background-color: transparent !important;
}

.posts-table tbody td {
  padding: 1em 0;
  font-size: 1em;
  color: #333;
  background-color: transparent !important;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
  border-left: none !important;
  border-right: none !important;
}

.posts-table tbody td.col-date {
  text-align: left;
  padding-left: 1.5em;
  padding-right: 0;
}

.posts-table tbody td.col-title {
  text-align: left;
  padding-left: 1.5em;
  padding-right: 1.5em;
  font-size: 0.95em;
}

.posts-table tbody td.col-title a {
  color: #333;
  text-decoration: none;
  word-break: break-word;
  line-height: 1.3;
}

.posts-table tbody td.col-title a:hover {
  text-decoration: underline;
}

.posts-table tbody td.col-category {
  text-align: right;
  white-space: nowrap;
  padding-left: 0;
  padding-right: 0;
}

.posts-table tbody td.col-media {
  text-align: right;
  padding-left: 0;
  padding-right: 1.5em;
}

.post-row {
  display: table-row;
}

/* Responsive design */
@media (max-width: 768px) {
  .posts-table {
    font-size: 0.82em;
  }
  
  .posts-table thead th,
  .posts-table tbody td {
    padding: 0.55em 0.6em;
  }

  .posts-table thead th {
    font-size: 0.9em;
  }

  .posts-table tbody td {
    font-size: 0.9em;
  }
  
  .posts-table tbody td.col-title {
    font-size: 0.82em;
    line-height: 1.3;
  }
}
</style>
