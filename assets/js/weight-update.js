(function () {
  'use strict';

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text === 'string') node.textContent = text;
    return node;
  }

  function taskIcon(id) {
    var paths = {
      common: ['M3 3h6v6H3z', 'M15 3h6v6h-6z', 'M3 15h6v6H3z', 'M15 15h6v6h-6z'],
      editing: ['M15 5l4 4', 'M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15z', 'M13 20h7'],
      continual_learning: ['M12 3l9 5-9 5-9-5z', 'M3 12l9 5 9-5', 'M3 16l9 5 9-5'],
      unlearning: ['M8 19l-5-5a2 2 0 0 1 0-3l8-8a2 2 0 0 1 3 0l7 7a2 2 0 0 1 0 3l-6 6z', 'M7 7l10 10', 'M8 19h13'],
      metric: ['M4 3v17h17', 'M8 16v-5', 'M13 16V7', 'M18 16V4'],
      dataset: ['M4 6c0-4 16-4 16 0s-16 4-16 0', 'M4 6v12c0 4 16 4 16 0V6', 'M4 12c0 4 16 4 16 0']
    };
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.4');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    (paths[id] || paths.editing).forEach(function (d) {
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      svg.appendChild(path);
    });
    return svg;
  }

  function emphasizedElement(tag, className, text) {
    var node = element(tag, className);
    String(text || '').split(/(\*\*[^*]+\*\*)/g).forEach(function (part) {
      if (part.slice(0, 2) === '**' && part.slice(-2) === '**') {
        node.appendChild(element('strong', '', part.slice(2, -2)));
      } else {
        node.appendChild(document.createTextNode(part));
      }
    });
    return node;
  }

  function typeset(root) {
    if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
    window.MathJax.typesetClear([root]);
    window.MathJax.typesetPromise([root]).catch(function (error) {
      console.warn('Unable to typeset weight-update math:', error);
    });
  }

  function renderDetail(root, item) {
    var detail = root.querySelector('.weight-update-detail');
    detail.replaceChildren();
    var tabs = element('div', 'weight-update-detail-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Method details');
    var panel = element('div', 'weight-update-detail-panel');
    detail.append(element('h3', 'weight-update-detail-title', item.title), tabs, panel);

    function renderPanel(name) {
      panel.replaceChildren();
      if (item.preservation) {
        if (name === 'objective') {
          panel.appendChild(emphasizedElement('p', 'weight-update-summary', item.summary));
          if (item.objective) {
            var loss = element('div', 'weight-update-formula-panel weight-update-formula');
            loss.textContent = '\\[' + item.objective + '\\]';
            panel.appendChild(loss);
          }
        } else if (name === 'weight update') {
          var update = element('div', 'weight-update-formula-panel weight-update-formula');
          update.textContent = '\\[' + item.formula + '\\]';
          panel.append(update, emphasizedElement('p', 'weight-update-formula-explanation', item.formula_explanation));
          var symbols = element('dl', 'weight-update-symbols');
          (item.terms || []).forEach(function (term) {
            symbols.append(element('dt', '', term.name), element('dd', '', term.description));
          });
          panel.appendChild(symbols);
        } else {
          panel.appendChild(emphasizedElement('p', 'weight-update-summary', name === 'limitations' ? item.limitations : item.preservation));
        }
        typeset(panel);
        return;
      }
      if (name === 'summary') {
        panel.appendChild(emphasizedElement('p', 'weight-update-summary', item.summary));
        if (!item.formula) {
          typeset(panel);
          return;
        }
      }
      if (name === 'summary' && item.formula) {
        var formulaPanel = element('section', 'weight-update-formula-panel');
        formulaPanel.setAttribute('aria-label', 'Weight update formula');
        if (item.objective) {
          var objective = element('div', 'weight-update-formula');
          objective.textContent = '\\[' + item.objective + '\\]';
          formulaPanel.appendChild(objective);
        }
        var formula = element('div', 'weight-update-formula weight-update-hover-formula');
        var termsById = {};
        (item.terms || []).forEach(function (term) { termsById[term.id] = term; });
        (item.formula_tokens || []).forEach(function (token) {
          var term = termsById[token.term];
          var part = element('span', term ? 'weight-update-formula-token has-tooltip' : 'weight-update-formula-token');
          part.textContent = '\\(' + token.tex + '\\)';
          if (term) {
            var tooltip = term.name + ': ' + term.description;
            part.setAttribute('data-tooltip', tooltip);
            part.setAttribute('aria-label', tooltip);
            part.tabIndex = 0;
          }
          formula.appendChild(part);
        });
        if (!item.formula_tokens || !item.formula_tokens.length) formula.textContent = '\\[' + item.formula + '\\]';
        formulaPanel.append(
          formula,
          emphasizedElement('p', 'weight-update-formula-explanation', item.formula_explanation)
        );
        panel.appendChild(formulaPanel);
        typeset(panel);
        return;
      }
      var steps = element('ol', 'weight-update-steps');
      (item.steps || []).forEach(function (step) { steps.appendChild(emphasizedElement('li', '', step)); });
      panel.append(element('h4', 'weight-update-subheading', item.process_title || 'One training step'), steps);
      typeset(panel);
    }

    function selectTab(name, button) {
      tabs.querySelectorAll('[role="tab"]').forEach(function (tab) {
        var active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderPanel(name);
    }

    (item.detail_tabs || ['Summary', 'Process']).filter(function (label) {
      return label !== 'Formula';
    }).forEach(function (label, index) {
      var name = label.toLowerCase();
      var button = element('button', 'weight-update-detail-tab', label);
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.addEventListener('click', function () { selectTab(name, button); });
      tabs.appendChild(button);
      if (index === 0) selectTab(name, button);
    });
    if (item.publication && item.paper_url) {
      var paper = element('a', 'weight-update-paper', item.publication);
      paper.href = item.paper_url;
      paper.target = '_blank';
      paper.rel = 'noopener noreferrer';
      tabs.appendChild(paper);
    }
  }

  function entriesFrom(object, requiredKey) {
    return Object.keys(object || {}).map(function (key) { return { key: key, value: object[key] }; })
      .filter(function (entry) { return entry.value && entry.value.label && entry.value[requiredKey]; });
  }

  function render(root, data) {
    var isEvaluation = !!root.getAttribute('data-explorer-kind');
    var tasks = entriesFrom(data && data.tasks, 'methods');
    if (!tasks.length) throw new Error('No weight-update tasks found.');
    root.replaceChildren();

    var taskSection = element('section', 'weight-update-task-section');
    taskSection.appendChild(element('p', 'weight-update-eyebrow', 'Task'));
    var taskList = element('div', 'weight-update-task-list');
    taskList.setAttribute('role', 'tablist');
    taskList.setAttribute('aria-label', 'Training tasks');
    taskSection.appendChild(taskList);
    var workspace = element('div', 'weight-update-workspace');
    var menu = element('div', 'weight-update-menu');
    var methodsLabel = element('p', 'weight-update-menu-label', isEvaluation ? 'Entries' : 'Method');
    menu.appendChild(methodsLabel);
    var searchBox = element('div', 'weight-update-search-box');
    var search = element('input', 'weight-update-search');
    search.type = 'search';
    search.placeholder = isEvaluation ? 'Search entries…' : 'Search methods…';
    search.setAttribute('aria-label', isEvaluation ? 'Search evaluation entries' : 'Search methods');
    searchBox.appendChild(search);
    menu.appendChild(searchBox);
    var methodList = element('div', 'weight-update-method-list');
    methodList.setAttribute('role', 'tablist');
    methodList.setAttribute('aria-label', 'Training methods');
    menu.appendChild(methodList);
    var noMatches = element('p', 'weight-update-no-matches', isEvaluation ? 'No matching entries.' : 'No matching methods.');
    noMatches.setAttribute('role', 'status');
    noMatches.hidden = true;
    menu.appendChild(noMatches);
    var detail = element('div', 'weight-update-detail');
    workspace.append(menu, detail);
    root.append(taskSection, workspace);

    function filterMethods() {
      var query = search.value.trim().toLowerCase();
      var count = 0;
      methodList.querySelectorAll('[role="tab"]').forEach(function (button) {
        var matches = button.textContent.toLowerCase().includes(query);
        button.hidden = !matches;
        if (matches) count += 1;
      });
      noMatches.hidden = count > 0;
    }
    search.addEventListener('input', filterMethods);

    function selectMethod(entry, button) {
      methodList.querySelectorAll('[role="tab"]').forEach(function (tab) {
        var active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      renderDetail(root, entry.value);
    }

    function selectTask(task, button) {
      taskList.querySelectorAll('[role="tab"]').forEach(function (tab) {
        var active = tab === button;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      methodList.replaceChildren();
      methodList.scrollTop = 0;
      noMatches.hidden = true;
      var methods = entriesFrom(task.value.methods, 'title').sort(function (a, b) {
        if (Array.isArray(task.value.method_order)) {
          return task.value.method_order.indexOf(a.key) - task.value.method_order.indexOf(b.key);
        }
        return a.value.label.localeCompare(b.value.label, 'en', { sensitivity: 'base' });
      });
      if (!methods.length) {
        detail.replaceChildren(element('p', 'weight-update-error', 'No methods are available for this task.'));
        return;
      }
      methods.forEach(function (entry, index) {
        var methodButton = element('button', 'weight-update-tab', entry.value.label);
        methodButton.type = 'button';
        methodButton.setAttribute('role', 'tab');
        methodButton.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        methodButton.addEventListener('click', function () { selectMethod(entry, methodButton); });
        methodList.appendChild(methodButton);
        if (index === 0) selectMethod(entry, methodButton);
      });
      filterMethods();
    }

    tasks.forEach(function (task, index) {
      var button = element('button', 'weight-update-task');
      button.type = 'button';
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.setAttribute('aria-label', task.value.label);
      var icon = taskIcon(task.key);
      var label = element('span', 'weight-update-task-label', task.value.label);
      var count = entriesFrom(task.value.methods, 'title').length;
      var countLabel = element('span', 'weight-update-task-count', '(' + count + ')');
      button.setAttribute('aria-label', task.value.label + ' (' + count + ')');
      button.append(icon, label, countLabel);
      button.addEventListener('click', function () { selectTask(task, button); });
      taskList.appendChild(button);
      if (index === 0) selectTask(task, button);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.weight-update-explorer[data-weight-update-urls]').forEach(function (root) {
      var urls = JSON.parse(root.getAttribute('data-weight-update-urls') || '[]');
      Promise.all(urls.map(function (url) {
        return fetch(url, { credentials: 'same-origin' }).then(function (response) {
          if (!response.ok) throw new Error(url + ': HTTP ' + response.status);
          return response.json();
        });
      }))
        .then(function (taskList) {
          var tasks = {};
          taskList.forEach(function (task) {
            if (task && task.categories) {
              Object.keys(task.categories).forEach(function (key) { tasks[key] = task.categories[key]; });
            } else if (task && task.id) tasks[task.id] = task;
          });
          render(root, { tasks: tasks });
        })
        .catch(function (error) {
          console.warn('Unable to load weight-update notes:', error);
          root.replaceChildren(element('p', 'weight-update-error', 'Unable to load the weight-update notes.'));
        });
    });
  });
}());
