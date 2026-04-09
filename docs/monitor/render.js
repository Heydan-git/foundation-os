/**
 * Foundation OS — Monitor Dashboard render
 * Vanilla JS, DOM APIs only. Zero innerHTML (security reminder constraint).
 *
 * Lit window.MONITOR_DATA (data.js charge avec defer AVANT ce script) et
 * reconstruit les 6 sections dans #root via createElement/textContent/appendChild.
 */
;(function () {
  'use strict'

  /** Helper : create an element with className and text content. */
  function el(tag, className, text) {
    var node = document.createElement(tag)
    if (className) node.className = className
    if (text !== undefined && text !== null) node.textContent = String(text)
    return node
  }

  /** Helper : append multiple children to a parent. */
  function appendAll(parent, children) {
    for (var i = 0; i < children.length; i++) {
      if (children[i]) parent.appendChild(children[i])
    }
    return parent
  }

  /** Map a status value to a CSS badge class name. */
  function badgeClassFor(status) {
    switch (status) {
      case 'DONE':
        return 'badge badge-done'
      case 'WIP':
      case 'IN_PROGRESS':
        return 'badge badge-wip'
      case 'PAUSED':
        return 'badge badge-paused'
      case 'PARKING':
        return 'badge badge-parking'
      case 'ARCHIVED':
        return 'badge badge-archived'
      case 'PENDING':
      default:
        return 'badge badge-pending'
    }
  }

  /** Icon symbol for timeline entries based on status. */
  function timelineIconFor(status) {
    switch (status) {
      case 'DONE':
        return '✓'
      case 'WIP':
      case 'IN_PROGRESS':
        return '◉'
      case 'PAUSED':
        return '⏸'
      case 'PARKING':
        return '◇'
      case 'ARCHIVED':
        return '×'
      case 'PENDING':
      default:
        return '○'
    }
  }

  /* ────────────────────────────────────────────────────────────── */
  /*  Section renderers                                              */
  /* ────────────────────────────────────────────────────────────── */

  function renderHero(meta) {
    var hero = el('header', 'hero')
    hero.appendChild(el('h1', null, 'Foundation OS — Monitor'))
    var metaLine = el('div', 'hero-meta')
    metaLine.appendChild(el('span', null, 'updated ' + meta.updatedAt))
    metaLine.appendChild(el('span', null, '·'))
    metaLine.appendChild(el('span', null, meta.updatedInSession))
    metaLine.appendChild(el('span', null, '·'))
    metaLine.appendChild(el('span', null, 'schema v' + meta.version))
    hero.appendChild(metaLine)
    return hero
  }

  function renderNextAction(meta) {
    var banner = el('div', 'next-action')
    banner.appendChild(el('div', 'next-action-label', '→ NEXT'))
    banner.appendChild(el('div', 'next-action-text', meta.nextAction))
    return banner
  }

  function renderPlanCard(plan) {
    var card = el('article', 'card')

    // Header row : badge + priority + title
    var header = el('div', 'card-header')
    header.appendChild(el('span', badgeClassFor(plan.status), plan.status))
    if (plan.priority) header.appendChild(el('span', 'priority-tag', plan.priority))
    card.appendChild(header)

    card.appendChild(el('h3', 'card-title', plan.title))

    if (plan.path) card.appendChild(el('div', 'card-path', plan.path))

    // Progress bar
    if (plan.progress) {
      var prog = el('div', 'progress')
      var bar = el('div', 'progress-bar')
      var fill = el('div', 'progress-fill')
      var pct =
        plan.progress.total > 0
          ? Math.min(100, Math.round((plan.progress.done / plan.progress.total) * 100))
          : 0
      fill.style.width = pct + '%'
      bar.appendChild(fill)
      prog.appendChild(bar)
      prog.appendChild(
        el(
          'div',
          'progress-text',
          plan.progress.done + '/' + plan.progress.total + ' ' + (plan.progress.unit || '')
        )
      )
      card.appendChild(prog)
    }

    if (plan.currentPhase) card.appendChild(el('div', 'card-text', plan.currentPhase))

    // Expandable sessions timeline via <details>
    if (plan.sessions && plan.sessions.length > 0) {
      var details = document.createElement('details')
      var summary = document.createElement('summary')
      summary.textContent = plan.sessions.length + ' sessions'
      details.appendChild(summary)

      var timeline = el('div', 'timeline')
      for (var i = 0; i < plan.sessions.length; i++) {
        var session = plan.sessions[i]
        var row = el('div', 'timeline-row')
        row.appendChild(el('span', 'timeline-icon', timelineIconFor(session.status)))
        row.appendChild(el('span', 'timeline-id', session.id))
        row.appendChild(el('span', 'timeline-title', session.title))
        if (session.date) row.appendChild(el('span', 'timeline-date', session.date))
        timeline.appendChild(row)
      }
      details.appendChild(timeline)
      card.appendChild(details)
    }

    if (plan.notes) card.appendChild(el('div', 'card-notes', plan.notes))

    return card
  }

  function renderPlansSection(plans) {
    var section = el('section', 'section')
    var title = el('div', 'section-title')
    title.appendChild(el('h2', null, 'Plans'))
    title.appendChild(el('span', 'section-count', plans.length + ' total'))
    section.appendChild(title)

    var grid = el('div', 'grid grid-plans')
    for (var i = 0; i < plans.length; i++) {
      grid.appendChild(renderPlanCard(plans[i]))
    }
    section.appendChild(grid)
    return section
  }

  function renderSimpleCard(item, titleKey) {
    var card = el('article', 'card')
    var header = el('div', 'card-header')
    header.appendChild(el('span', badgeClassFor(item.status), item.status))
    card.appendChild(header)
    card.appendChild(el('h3', 'card-title', item[titleKey] || item.name || item.title || item.id))
    if (item.path) card.appendChild(el('div', 'card-path', item.path))
    if (item.detail) card.appendChild(el('div', 'card-text', item.detail))
    if (item.blockedBy) {
      var blocked = el('div', 'card-text')
      blocked.textContent = 'blocked by : ' + item.blockedBy
      blocked.style.fontStyle = 'italic'
      card.appendChild(blocked)
    }
    return card
  }

  function renderModulesSection(modules) {
    var section = el('section', 'section')
    var title = el('div', 'section-title')
    title.appendChild(el('h2', null, 'Modules'))
    title.appendChild(el('span', 'section-count', modules.length + ' total'))
    section.appendChild(title)

    var grid = el('div', 'grid grid-two-col')
    for (var i = 0; i < modules.length; i++) {
      grid.appendChild(renderSimpleCard(modules[i], 'name'))
    }
    section.appendChild(grid)
    return section
  }

  function renderInitiativesSection(initiatives) {
    var section = el('section', 'section')
    var title = el('div', 'section-title')
    title.appendChild(el('h2', null, 'Initiatives'))
    title.appendChild(el('span', 'section-count', initiatives.length + ' total'))
    section.appendChild(title)

    var grid = el('div', 'grid grid-two-col')
    for (var i = 0; i < initiatives.length; i++) {
      grid.appendChild(renderSimpleCard(initiatives[i], 'title'))
    }
    section.appendChild(grid)
    return section
  }

  function renderDecisionItem(decision) {
    var item = el('article', 'list-item')
    var header = el('div', 'list-item-header')
    header.appendChild(el('span', 'list-item-id', decision.id))
    header.appendChild(el('span', 'list-item-date', decision.date))
    header.appendChild(el('span', 'list-item-title', decision.title))
    item.appendChild(header)
    item.appendChild(el('div', 'list-item-summary', decision.summary))
    return item
  }

  function renderDecisionsSection(decisions) {
    var section = el('section', 'section')
    var title = el('div', 'section-title')
    title.appendChild(el('h2', null, 'Decisions actives'))
    title.appendChild(el('span', 'section-count', decisions.length + ' total'))
    section.appendChild(title)

    var list = el('div', null)
    for (var i = 0; i < decisions.length; i++) {
      list.appendChild(renderDecisionItem(decisions[i]))
    }
    section.appendChild(list)
    return section
  }

  function renderSessionItem(session) {
    var item = el('article', 'list-item')
    var header = el('div', 'list-item-header')
    header.appendChild(el('span', 'list-item-date', session.date))
    header.appendChild(el('span', badgeClassFor(session.tag), session.tag))
    header.appendChild(el('span', 'list-item-title', session.title))
    item.appendChild(header)
    item.appendChild(el('div', 'list-item-summary', session.summary))
    return item
  }

  function renderRecentSessionsSection(sessions) {
    var section = el('section', 'section')
    var title = el('div', 'section-title')
    title.appendChild(el('h2', null, 'Sessions recentes'))
    title.appendChild(el('span', 'section-count', sessions.length + ' (max 5)'))
    section.appendChild(title)

    var list = el('div', null)
    for (var i = 0; i < sessions.length; i++) {
      list.appendChild(renderSessionItem(sessions[i]))
    }
    section.appendChild(list)
    return section
  }

  function renderFooter(meta) {
    var footer = el('footer', 'footer')
    footer.textContent =
      'Foundation OS Monitor Dashboard · v' + meta.version + ' · vanilla HTML/CSS/JS · zero build'
    return footer
  }

  /* ────────────────────────────────────────────────────────────── */
  /*  Main mount                                                     */
  /* ────────────────────────────────────────────────────────────── */

  function mount() {
    var root = document.getElementById('root')
    if (!root) {
      console.error('[monitor] #root element not found.')
      return
    }

    var data = window.MONITOR_DATA
    if (!data) {
      root.appendChild(
        el(
          'div',
          'error',
          '[FAIL] window.MONITOR_DATA is undefined. Check that data.js loaded before render.js.'
        )
      )
      return
    }

    try {
      var fragment = document.createDocumentFragment()
      fragment.appendChild(renderHero(data.meta))
      fragment.appendChild(renderNextAction(data.meta))
      fragment.appendChild(renderPlansSection(data.plans || []))
      fragment.appendChild(renderModulesSection(data.modules || []))
      fragment.appendChild(renderInitiativesSection(data.initiatives || []))
      fragment.appendChild(renderDecisionsSection(data.decisions || []))
      fragment.appendChild(renderRecentSessionsSection(data.recentSessions || []))
      fragment.appendChild(renderFooter(data.meta))

      // Clear root then mount (idempotent si re-render)
      while (root.firstChild) root.removeChild(root.firstChild)
      root.appendChild(fragment)
    } catch (err) {
      console.error('[monitor] render error:', err)
      while (root.firstChild) root.removeChild(root.firstChild)
      root.appendChild(
        el('div', 'error', '[FAIL] render exception : ' + (err && err.message ? err.message : err))
      )
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount)
  } else {
    mount()
  }
})()
