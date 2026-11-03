// Controls for level-up selection; held-item selection keeps its own behavior.
window.PSBotSkillControls = function ({ cfg, state, site, panel }) {
  const key = 'psbot.autoPickSkills';
  try { cfg.autoPickSkills = localStorage.getItem(key) !== '0'; }
  catch { cfg.autoPickSkills = true; }

  panel.querySelectorAll('[data-tab="donate"], [data-pane="donate"], button[data-shop]').forEach(el => el.remove());
  const row = document.createElement('div');
  row.className = 'psb-tip';
  const label = document.createElement('label');
  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.checked = cfg.autoPickSkills;
  label.append(toggle, document.createTextNode(' Tự chọn skill khi lên cấp'));
  const recent = document.createElement('div');
  recent.style.cssText = 'margin-top:5px;overflow-wrap:anywhere';
  row.append(label, recent);
  panel.querySelector('[data-pane="ctl"]').append(row);
  const render = () => {
    recent.textContent = 'Thẻ/chiêu vừa chọn: ' + (state.lastChosenCard || 'Chưa có');
  };
  const record = card => {
    if (!card || !card.name) return;
    state.lastChosenCard = String(card.name);
    render();
  };
  toggle.onchange = () => {
    cfg.autoPickSkills = toggle.checked;
    try { localStorage.setItem(key, toggle.checked ? '1' : '0'); } catch {}
  };
  const cards = () => {
    try { return site.levelUp()?.cards || []; } catch { return []; }
  };
  const click = event => {
    if (!event.isTrusted || panel.contains(event.target)) return;
    record(cards().find(card => card.el && (card.el === event.target || card.el.contains(event.target))));
  };
  const keydown = event => {
    if (!event.isTrusted || event.repeat || event.ctrlKey || event.altKey || event.metaKey ||
        event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    record(cards().find(card => String(card.key) === event.key));
  };
  document.addEventListener('click', click, true);
  document.addEventListener('keydown', keydown, true);
  render();
  return {
    record,
    cleanup() {
      document.removeEventListener('click', click, true);
      document.removeEventListener('keydown', keydown, true);
      row.remove();
    }
  };
};
