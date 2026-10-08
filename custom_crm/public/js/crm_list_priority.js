/**
 * CRM List View Priority Colorizer
 * Non-destructive client extension: sets `data-priority` attribute on existing DOM elements
 * to preserve Vue 3 Virtual DOM, event listeners, and filtering reactivity.
 */
(function () {
  const VALID_PRIORITIES = new Set(["High", "Medium", "Low"]);

  function updatePriorityBadges() {
    try {
      // Find list view header
      const header = document.querySelector(".mb-2.grid.items-center");
      if (!header) return;

      const headerChildren = Array.from(header.children);
      let priorityColIdx = -1;

      headerChildren.forEach((child, idx) => {
        // Skip selectable checkbox
        if (child.querySelector('input[type="checkbox"]')) return;
        const text = child.textContent.trim().toLowerCase();
        if (text === "priority") {
          priorityColIdx = idx;
        }
      });

      if (priorityColIdx === -1) {
        // Priority column not present in current list view; clear any existing attributes
        document.querySelectorAll("[data-priority]").forEach((el) => {
          el.removeAttribute("data-priority");
        });
        return;
      }

      // Find all rows in current list view
      const rows = document.querySelectorAll(".grid.items-center.gap-4.px-2");
      rows.forEach((row) => {
        const cells = Array.from(row.children);
        if (priorityColIdx >= cells.length) return;

        const cell = cells[priorityColIdx];
        if (!cell) return;

        // Target the label container rendered by frappe-ui
        const targetDiv = cell.querySelector(".truncate.text-base") || cell;
        const text = targetDiv.textContent.trim();

        if (VALID_PRIORITIES.has(text)) {
          if (targetDiv.getAttribute("data-priority") !== text) {
            targetDiv.setAttribute("data-priority", text);
          }
        } else if (targetDiv.hasAttribute("data-priority")) {
          targetDiv.removeAttribute("data-priority");
        }
      });
    } catch (err) {
      console.error("[CRM Priority List View] Error updating priority badges:", err);
    }
  }

  // Debounced observer to batch DOM mutations efficiently
  let timeoutId = null;
  const observer = new MutationObserver(() => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      requestAnimationFrame(updatePriorityBadges);
    }, 40);
  });

  function startObserver() {
    try {
      const appRoot = document.getElementById("app") || document.body;
      if (appRoot) {
        updatePriorityBadges();
        observer.observe(appRoot, { childList: true, subtree: true });
      } else {
        setTimeout(startObserver, 150);
      }
    } catch (err) {
      console.error("[CRM Priority List View] Failed to initialize observer:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    startObserver();
  }
})();