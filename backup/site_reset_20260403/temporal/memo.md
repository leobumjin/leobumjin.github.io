---
layout: default
title: Memo
permalink: /memo/
display_categories: ['AI', 'Vienna 1900', 'Art']
---
<!-- pages/projects.md -->
<div class="projects">
  {%- if site.enable_project_categories and page.display_categories %}
    <!-- Display categorized projects -->
    {%- for category in page.display_categories %}
    <h2 class="category">{{ category }}</h2>
    {%- if site.memo -%}
      {%- assign categorized_projects = site.memo | where: "category", category -%}
      {%- assign sorted_projects = categorized_projects | where_exp: "item", "item.date != nil" | sort: "date" %}
    {%- else -%}
      {%- assign sorted_projects = "" | split: "," -%}
    {%- endif -%}
    {%- assign sorted_projects = sorted_projects | reverse %}

    <!-- Generate cards for each project -->
    {% if page.horizontal -%}
    <div class="container">
      <div class="row row-cols-2">
      {%- for project in sorted_projects -%}
        {% include projects_horizontal.html %}
      {%- endfor %}
      </div>
    </div>
    {%- else -%}
    <div class="grid">
      {%- for project in sorted_projects -%}
        {% include projects.html %}
      {%- endfor %}
    </div>
    {%- endif -%}
    {% endfor %}
  
  {%- else -%}
  <!-- Display projects without categories -->
    {%- if site.memo -%}
      {%- assign sorted_projects = site.memo | where_exp: "item", "item.date != nil" | sort: "date" -%}
    {%- else -%}
      {%- assign sorted_projects = "" | split: "," -%}
    {%- endif -%}
    {%- assign sorted_projects = sorted_projects | reverse %}

    <!-- Generate cards for each project -->
    {% if page.horizontal -%}
    <div class="container">
      <div class="row row-cols-2">
      {%- for project in sorted_projects -%}
        {% include projects_horizontal.html %}
      {%- endfor %}
      </div>
    </div>
    {%- else -%}
    <div class="grid">
      {%- for project in sorted_projects -%}
        {% include projects.html %}
      {%- endfor %}
    </div>
    {%- endif -%}
  {%- endif -%}
  </div>
  