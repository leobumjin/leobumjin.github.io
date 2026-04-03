---
layout: default
title: Publications
permalink: /materials/
description: 
---

<div class="publications">
  <div class="paper-grid">
    {%- if site.materials -%}
      {%- assign sorted_materials = site.materials | where_exp: "item", "item.date != nil" | sort: "date" | reverse -%}
    {%- else -%}
      {%- assign sorted_materials = "" | split: "," -%}
    {%- endif -%}
    
    {%- for paper in sorted_materials -%}
      {% assign paper_gradient = paper.gradient | default: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(251, 253, 255) 100%)" %}
      {% assign paper_hover = paper.hover-gradient | default: "linear-gradient(135deg,rgb(249, 254, 255) 0%,rgb(245, 254, 255) 100%)" %}
      
      <div class="paper-item">
        {% if paper.redirect -%}
          <a href="{{ paper.redirect }}" class="paper-card-link">
        {%- else -%}
          <a href="{{ paper.url | relative_url }}" class="paper-card-link">
        {%- endif %}
          <div class="paper-card" style="background: {{ paper_gradient }};" data-hover-gradient="{{ paper_hover }}">
            {%- if paper.img -%}
              <div class="paper-image">
                <img src="{{ paper.img | relative_url }}" alt="{{ paper.title }}">
                <div class="paper-overlay">
                  <h2>{{ paper.title }}</h2>
                  {%- if paper.pdf or paper.code or paper.github -%}
                    <div class="paper-links">
                      {%- if paper.pdf -%}
                        <span class="paper-link pdf" onclick="window.open('{{ paper.pdf }}', '_blank'); event.stopPropagation();">PDF</span>
                      {%- endif -%}
                      
                      {%- if paper.code -%}
                        <span class="paper-link code" onclick="window.open('{{ paper.code }}', '_blank'); event.stopPropagation();">Code</span>
                      {%- endif -%}
                      
                      {%- if paper.github -%}
                        <span class="paper-link github" onclick="window.open('{{ paper.github }}', '_blank'); event.stopPropagation();">
                          <i class="fab fa-github"></i>
                        </span>
                      {%- endif -%}
                    </div>
                  {%- endif -%}
                </div>
              </div>
            {%- endif -%}
          </div>
        </a>
      </div>
    {%- endfor -%}
  </div>
</div>

<style>
  .paper-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 40px;
    background-color: transparent;
    padding: 20px;
    border-radius: 10px;
  }
  
  .paper-item {
    min-height: 200px;
    display: flex;
  }
  
  .paper-card-link {
    display: block;
    width: 100%;
    height: 100%;
    text-decoration: none;
  }
  
  .paper-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: none;
    height: 100%;
    width: 100%;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    background-color: transparent !important;
  }
  
  .paper-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0,0,0,0.1);
  }
  
  .paper-image {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: visible;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .paper-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.5s ease;
    filter: drop-shadow(0 0 5px rgba(0,0,0,0.05));
  }
  
  .paper-card:hover .paper-image img {
    transform: scale(1.05);
  }
  
  .paper-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(240, 251, 255, 0.8) 0%, rgba(173, 216, 230, 0) 100%);
    color: #333;
    padding: 20px;
    opacity: 1;
    transition: opacity 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
  }
  
  .paper-card:hover .paper-overlay {
    opacity: 1;
  }
  
  .paper-overlay h2 {
    margin: 0 0 10px 0;
    font-size: 1.2rem;
    background-color: rgba(255, 255, 255, 0.9);
    padding:10px;
    border-radius: 20px;
  }
  
  .paper-links {
    display: flex;
    gap: 10px;
    margin-top: 10px;
  }
  
  .paper-link {
    background: rgba(41, 128, 185, 0.2);
    color: #333;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.8rem;
    backdrop-filter: blur(5px);
    transition: background 0.3s;
    cursor: pointer;
  }
  
  .paper-link:hover {
    background: rgba(41, 128, 185, 0.4);
  }
</style>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.paper-grid');
    const items = Array.from(container.querySelectorAll('.paper-item'));
    
    // Apply subtle rotation for visual interest
    items.forEach((item) => {
      const randomAngle = (Math.random() * 2 - 1) + 'deg';
      const card = item.querySelector('.paper-card');
      
      if (card) {
        card.style.transform = `rotate(${randomAngle})`;
        
        card.addEventListener('mouseenter', () => {
          card.style.transform = 'translateY(-5px) rotate(0deg)';
        });
        
        card.addEventListener('mouseleave', () => {
          card.style.transform = `rotate(${randomAngle})`;
        });
      }
    });
  });
</script>
  