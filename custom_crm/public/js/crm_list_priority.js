/**
 * CRM List View Priority Colorizer
 * Dynamically colors Priority cells (High = Red, Medium = Orange, Low = Green)
 * Built for custom_crm app.
 */
(function () {
  const COLOR_CONFIG = {
    High: {
      bg: 'rgba(239, 68, 68, 0.15)',
      color: '#ef4444',
      dot: '#ef4444'
    },
    Medium: {
      bg: 'rgba(245, 158, 11, 0.15)',
      color: '#f59e0b',
      dot: '#f59e0b'
    },
    Low: {
      bg: 'rgba(34, 197, 94, 0.15)',
      color: '#22c55e',
      dot: '#22c55e'
    }
  };

  function createBadge(text) {
    const conf = COLOR_CONFIG[text];
    if (!conf) return null;

    const span = document.createElement('span');
    span.className = 'custom-priority-badge indicator-pill';
    span.setAttribute('data-priority', text);
    span.style.cssText = [
      'display: inline-flex',
      'align-items: center',
      'gap: 6px',
      'padding: 2px 8px',
      'border-radius: 9999px',
      'font-size: 12px',
      'font-weight: 500',
      'line-height: 1.25',
      `background-color: ${conf.bg}`,
      `color: ${conf.color}`,
      'width: fit-content',
      'cursor: pointer'
    ].join('; ');

    const dot = document.createElement('span');
    dot.className = 'indicator-dot';
    dot.style.cssText = [
      'width: 6px',
      'height: 6px',
      'border-radius: 50%',
      `background-color: ${conf.dot}`,
      'display: inline-block',
      'flex-shrink: 0',
      'pointer-events: none'
    ].join('; ');

    const label = document.createElement('span');
    label.style.cssText = [
      'pointer-events: none',
      `color: ${conf.color}`
    ].join('; ');
    label.textContent = text;

    span.appendChild(dot);
    span.appendChild(label);
    return span;
  }

  function formatPriorityCells() {
    const rows = document.querySelectorAll('.grid.items-center');
    if (!rows.length) return;

    let priorityColIdx = -1;
    const header = document.querySelector('.mb-2.grid.items-center');
    if (header) {
      const headerCols = Array.from(header.children).filter(el => !el.querySelector('input[type="checkbox"]'));
      headerCols.forEach((col, idx) => {
        const text = col.textContent.trim().toLowerCase();
        if (text === 'priority') {
          priorityColIdx = idx;
        }
      });
    }

    rows.forEach(row => {
      if (row.classList.contains('bg-surface-gray-2')) return;

      const cells = Array.from(row.children).filter(el => !el.querySelector('input[type="checkbox"]'));
      cells.forEach((cell, idx) => {
        if (priorityColIdx !== -1 && idx !== priorityColIdx) return;

        const targetDiv = cell.querySelector('.truncate.text-base') || cell;
        const text = targetDiv.textContent.trim();

        if (COLOR_CONFIG[text]) {
          const existingBadge = targetDiv.querySelector('.custom-priority-badge');
          if (existingBadge && existingBadge.getAttribute('data-priority') === text) {
            return;
          }

          const badge = createBadge(text);
          if (badge) {
            targetDiv.innerHTML = '';
            targetDiv.appendChild(badge);
          }
        }
      });
    });
  }

  formatPriorityCells();

  let timeoutId = null;
  const observer = new MutationObserver(() => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(formatPriorityCells, 30);
  });

  function startObserver() {
    const target = document.getElementById('app') || document.body;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
    } else {
      setTimeout(startObserver, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
