(() => {
  const a = document.getElementById('support-a');
  const b = document.getElementById('support-b');
  if (!a || !b) return;
  function render() {
    document.getElementById('support-a-state').dataset.valid = String(a.checked);
    document.getElementById('support-b-state').dataset.valid = String(b.checked);
    document.getElementById('support-conclusion').textContent = a.checked || b.checked ? 'C remains justified' : 'C is unsupported';
    document.getElementById('support-explanation').textContent = a.checked && b.checked
      ? 'Both independent supports are valid. Either one is sufficient for C.'
      : a.checked || b.checked
        ? `C remains justified through ${a.checked ? 'A' : 'B'}. Withdrawing one support does not invalidate the other.`
        : 'Neither support remains valid. Without another support, C is no longer justified; this does not prove C false.';
  }
  a.addEventListener('change', render);
  b.addEventListener('change', render);
  render();
})();
