// Shared utility functions

// HTML escape — DOM-based (more robust than regex)
export function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
