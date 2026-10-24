import { initial, step, won, copy, reachable, DIRS, height } from './engine.js';
import { World, PALETTE } from './world.js';
import { approachedBlock, blockInteraction, routeToBlock } from './interactions.js';

const $ = (id) => document.getElementById(id);
const STORAGE = 'starstep.gardens.v1';
let saved = { stars: [], best: {}, last: 0, sound: false };
try {
  const value = JSON.parse(localStorage.getItem(STORAGE) || 'null');
  if (value) {
    saved.stars = Array.isArray(value.stars)
      ? value.stars.filter((n) => Number.isInteger(n) && n >= 1 && n <= 10)
      : [];
    saved.best = value.best && typeof value.best === 'object' ? value.best : {};
    saved.last = Number.isInteger(value.last) ? Math.min(9, Math.max(0, value.last)) : 0;
    saved.sound = value.sound === true;
  }
} catch {}
const persist = () => {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(saved));
  } catch {}
};
let levels = [],
  index = saved.last,
  state,
  level,
  world,
  interaction = null,
  interactionTimer,
  interactionFrame,
  history = [],
  messageTimer,
  winTimer,
  audioContext,
  routeTimer,
  celebrated = false;
function notify(text, duration = 2400) {
  clearTimeout(messageTimer);
  $('message').textContent = text;
  $('message').classList.add('visible');
  messageTimer = setTimeout(() => $('message').classList.remove('visible'), duration);
}
function sound(kind) {
  if (!saved.sound) return;
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioContext.state === 'suspended') audioContext.resume();
    const notes =
      kind === 'win' ? [523.25, 659.25, 783.99, 1046.5] : kind === 'push' ? [164.81, 220] : [392];
    notes.forEach((frequency, i) => {
      const oscillator = audioContext.createOscillator(),
        gain = audioContext.createGain();
      oscillator.type = kind === 'push' ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      const t = audioContext.currentTime + i * 0.12;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(kind === 'win' ? 0.075 : 0.025, t + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (kind === 'win' ? 0.75 : 0.14));
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(t);
      oscillator.stop(t + 1);
    });
  } catch {}
}
function updateSoundButton() {
  $('sound').setAttribute('aria-label', saved.sound ? 'Mute sound' : 'Enable sound');
  $('sound').title = saved.sound ? 'Mute sound' : 'Enable sound';
  $('sound').innerHTML = saved.sound
    ? '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Zm4 3c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/></svg>'
    : '<svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5Zm5 4 5 6m0-6-5 6"/></svg>';
}
function closeBlockActions() {
  clearTimeout(interactionTimer);
  cancelAnimationFrame(interactionFrame);
  interaction = null;
  const panel = $('block-actions');
  const hadFocus = panel.contains(document.activeElement);
  panel.hidden = true;
  document.body.classList.remove('choosing-block');
  world?.selectBlock(null);
  if (hadFocus) $('scene').focus({ preventScroll: true });
}
function positionBlockActions() {
  if (!interaction) return;
  const panel = $('block-actions');
  const point = world.blockScreenPosition(interaction.block);
  const gap = 24, margin = 16;
  let left = point.right + gap;
  if (left + panel.offsetWidth > window.innerWidth - margin)
    left = point.left - panel.offsetWidth - gap;
  panel.style.left = `${Math.max(margin, Math.min(left, window.innerWidth - panel.offsetWidth - margin))}px`;
  panel.style.top = `${Math.max(margin, Math.min(point.y - panel.offsetHeight / 2, window.innerHeight - panel.offsetHeight - margin))}px`;
  interactionFrame = requestAnimationFrame(positionBlockActions);
}
function showBlockActions(dir) {
  if (!state || document.querySelector('dialog[open]')) return;
  const choice = blockInteraction(level, state, dir);
  if (!choice) return;
  cancelRoute();
  closeBlockActions();
  interaction = choice;
  $('block-action-kicker').textContent = `BLOCK · HEIGHT ${choice.block.h}`;
  $('climb-block').disabled = !choice.climb.enabled;
  $('push-block').disabled = !choice.push.enabled;
  $('climb-description').textContent = choice.climb.description;
  $('push-description').textContent = choice.push.description;
  $('block-actions').hidden = false;
  document.body.classList.add('choosing-block');
  $('message').classList.remove('visible');
  world.selectBlock(choice.block);
  positionBlockActions();
  const focus = choice.climb.enabled ? 'climb-block'
    : choice.push.enabled ? 'push-block' : 'close-block-actions';
  $(focus).focus({ preventScroll: true });
}
function chooseBlockAction(action) {
  if (!interaction || world.animation) return;
  const choice = blockInteraction(level, state, interaction.dir);
  if (!choice || choice.block.id !== interaction.block.id) {
    closeBlockActions();
    return;
  }
  const option = action === 'walk' ? choice.climb : choice.push;
  if (!option.enabled) return;
  const dir = choice.dir;
  closeBlockActions();
  move(dir, { action });
}
function promptAfterMove(choice) {
  if (!choice) return;
  const expected = state;
  const show = () => {
    if (state !== expected || document.querySelector('dialog[open]')) return;
    if (world.animation) {
      interactionTimer = setTimeout(show, 30);
      return;
    }
    showBlockActions(choice.dir);
  };
  interactionTimer = setTimeout(show, 190);
}
function updateUI() {
  $('push-count').textContent = state.pushes;
  $('undo').disabled = history.length === 0;
  $('journey-count').textContent = `${new Set(saved.stars).size} / 10 stars`;
  $('prev-level').disabled = index === 0;
  $('next-level').disabled = index === levels.length - 1;
}
function cancelRoute() {
  clearTimeout(routeTimer);
  routeTimer = null;
}
function loadLevel(i) {
  cancelRoute();
  closeBlockActions();
  clearTimeout(winTimer);
  for (const dialog of document.querySelectorAll('dialog[open]')) dialog.close();
  index = i;
  level = levels[i];
  state = initial(level);
  history = [];
  celebrated = false;
  saved.last = i;
  persist();
  $('level-kicker').textContent = `LEVEL ${String(i + 1).padStart(2, '0')} / 10`;
  const title = level.name.split(' ');
  const split = title.length > 2 ? Math.ceil(title.length / 2) : 1;
  $('level-title').replaceChildren(
    document.createTextNode(title.slice(0, split).join(' ')),
    document.createElement('br'),
    document.createTextNode(' ' + title.slice(split).join(' ')),
  );
  $('level-description').textContent = level.description;
  $('hint-text').textContent = level.hint;
  $('hint-text').hidden = true;
  document.querySelector('.level-info').classList.remove('expanded');
  $('hint-button').setAttribute('aria-expanded', 'false');
  $('dock-level').innerHTML = `${String(i + 1).padStart(2, '0')} <span>/ 10</span>`;
  $('block-legend').replaceChildren(
    ...state.blocks
      .slice()
      .sort((a, b) => a.h - b.h)
      .map((b) => {
        const el = document.createElement('span');
        el.className = 'legend-block';
        el.style.background = PALETTE[b.h - 1];
        el.style.height = `${14 + b.h * 7}px`;
        el.textContent = b.h;
        el.title = `Height ${b.h} — same weight as every block`;
        return el;
      }),
  );
  world.load(level, state);
  updateUI();
  $('message').classList.remove('visible');
}
function finish() {
  closeBlockActions();
  celebrated = true;
  const id = level.id;
  if (!saved.stars.includes(id)) saved.stars.push(id);
  if (saved.best[id] === undefined || state.pushes < saved.best[id]) saved.best[id] = state.pushes;
  persist();
  updateUI();
  sound('win');
  $('win-title').textContent =
    saved.stars.length === 10 ? 'A sky full of stars.' : 'You found your star.';
  $('win-description').textContent =
    saved.stars.length === 10
      ? 'Ten gardens, ten stars. Look how far your little steps have taken you.'
      : `${level.name}, complete. Take a breath. There is another garden waiting.`;
  $('win-pushes').textContent = state.pushes;
  $('win-moves').textContent = state.moves;
  $('continue').innerHTML =
    index < 9 ? 'On to the next garden <span>→</span>' : 'Explore the gardens again <span>✦</span>';
  clearTimeout(winTimer);
  const currentLevel = index;
  winTimer = setTimeout(() => {
    if (currentLevel === index && won(level, state)) $('win-dialog').showModal();
  }, 420);
}
function move(dir, { action, automated = false } = {}) {
  if (!state || document.querySelector('dialog[open]')) return false;
  if (world.animation) return false;
  if (!automated) cancelRoute();
  if (!action && blockInteraction(level, state, dir)) {
    showBlockActions(dir);
    return false;
  }
  closeBlockActions();
  const next = step(level, state, dir, action || 'walk');
  if (!next) {
    const [dx, dz] = DIRS[dir],
      x = state.player[0] + dx,
      z = state.player[1] + dz;
    if (
      Number.isFinite(height(level, state, x, z)) &&
      Math.abs(height(level, state, x, z) - height(level, state, ...state.player)) > 1
    )
      notify('One height at a time. A little step is missing here.');
    else notify('There’s no path that way. Try another side.');
    return false;
  }
  history.push(copy(state));
  const before = state;
  const pushed = next.pushes > state.pushes;
  state = next;
  world.sync(state, true, pushed);
  sound(pushed ? 'push' : 'step');
  updateUI();
  if (won(level, state) && !celebrated) {
    cancelRoute();
    finish();
  } else if (!action && !automated) {
    promptAfterMove(approachedBlock(level, before, state, dir));
  }
  return true;
}
function pick(x, z) {
  if (document.querySelector('dialog[open]') || world.animation) return;
  cancelRoute();
  closeBlockActions();
  const dx = x - state.player[0],
    dz = z - state.player[1];
  if (Math.abs(dx) + Math.abs(dz) === 1) {
    move(DIRS.findIndex((d) => d[0] === dx && d[1] === dz));
    return;
  }
  if (dx === 0 && dz === 0) return;
  const block = state.blocks.find((b) => b.x === x && b.z === z);
  const approach = block && routeToBlock(level, state, block);
  const route = block ? approach?.path
    : reachable(level, state).find((r) => r.p[0] === x && r.p[1] === z)?.path;
  if (!route) {
    notify('There’s no path there yet. Try another side or build a step.');
    return;
  }
  let i = 0;
  const walk = () => {
    if (i >= route.length) {
      if (approach) showBlockActions(approach.dir);
      return;
    }
    const before = state;
    const { dir } = route[i++];
    if (move(dir, { automated: true }) && !won(level, state)) {
      if (i === route.length && !approach)
        promptAfterMove(approachedBlock(level, before, state, dir));
      routeTimer = setTimeout(walk, 205);
    }
  };
  walk();
}
function undo() {
  cancelRoute();
  closeBlockActions();
  if (!history.length) return;
  clearTimeout(winTimer);
  $('win-dialog').close();
  state = history.pop();
  celebrated = false;
  world.sync(state, false);
  updateUI();
}
function openLevels() {
  cancelRoute();
  closeBlockActions();
  $('levels-grid').replaceChildren(
    ...levels.map((l, i) => {
      const button = document.createElement('button');
      button.className = 'level-card' + (i === index ? ' current' : '');
      button.innerHTML = `<span class="number">${String(i + 1).padStart(2, '0')}</span><span class="name">${l.name}</span><span class="star">${saved.stars.includes(l.id) ? '✦' : '·'}</span>`;
      button.setAttribute(
        'aria-label',
        `Level ${i + 1}: ${l.name}${saved.stars.includes(l.id) ? ', completed' : ''}`,
      );
      button.onclick = () => loadLevel(i);
      return button;
    }),
  );
  $('levels-dialog').showModal();
}
function relativeDirection(label) {
  const base = { up: 0, right: 1, down: 2, left: 3 }[label];
  return (base - world.quarter + 4) % 4;
}
function attachControls() {
  $('climb-block').onclick = () => chooseBlockAction('walk');
  $('push-block').onclick = () => chooseBlockAction('push');
  $('close-block-actions').onclick = closeBlockActions;
  $('cancel-block-actions').onclick = closeBlockActions;
  document.addEventListener('pointerdown', (e) => {
    if (!$('block-actions').contains(e.target)) closeBlockActions();
  }, true);
  $('hint-button').onclick = () => {
    const show = $('hint-text').hidden;
    $('hint-text').hidden = !show;
    document.querySelector('.level-info').classList.toggle('expanded', show);
    $('hint-button').setAttribute('aria-expanded', String(show));
  };
  $('undo').onclick = undo;
  $('restart').onclick = () => {
    loadLevel(index);
    notify('A fresh start. Take your time.');
  };
  $('prev-level').onclick = () => {
    if (index > 0) loadLevel(index - 1);
  };
  $('next-level').onclick = () => {
    if (index < 9) loadLevel(index + 1);
  };
  $('open-levels').onclick = openLevels;
  $('open-help').onclick = () => {
    cancelRoute();
    closeBlockActions();
    $('help-dialog').showModal();
  };
  $('rotate-left').onclick = () => {
    cancelRoute();
    world.rotate(-1);
  };
  $('rotate-right').onclick = () => {
    cancelRoute();
    world.rotate(1);
  };
  $('sound').onclick = () => {
    saved.sound = !saved.sound;
    persist();
    updateSoundButton();
    if (saved.sound) sound('step');
  };
  updateSoundButton();
  $('continue').onclick = () => {
    if (index < 9) loadLevel(index + 1);
    else {
      $('win-dialog').close();
      openLevels();
    }
  };
  $('replay').onclick = () => $('win-dialog').close();
  for (const button of document.querySelectorAll('.close-dialog'))
    button.onclick = () => button.closest('dialog').close();
  for (const dialog of document.querySelectorAll('dialog'))
    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
        dialog.close();
    });
  for (const button of document.querySelectorAll('[data-dir]'))
    button.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      move(relativeDirection(button.dataset.dir));
    });
  window.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]') || e.ctrlKey || e.metaKey || e.altKey) return;
    const key = e.key.toLowerCase(),
      map = {
        arrowup: 'up',
        w: 'up',
        arrowright: 'right',
        d: 'right',
        arrowdown: 'down',
        s: 'down',
        arrowleft: 'left',
        a: 'left',
      };
    if (map[key]) {
      e.preventDefault();
      move(relativeDirection(map[key]));
    } else if (interaction && (key === '1' || key === '2')) {
      e.preventDefault();
      if (!e.repeat) chooseBlockAction(key === '1' ? 'walk' : 'push');
    } else if (key === 'escape') {
      e.preventDefault();
      closeBlockActions();
    } else if (key === 'z') {
      e.preventDefault();
      undo();
    } else if (key === 'r' && !e.repeat) {
      e.preventDefault();
      loadLevel(index);
    } else if (key === 'q' && !e.repeat) world.rotate(-1);
    else if (key === 'e' && !e.repeat) world.rotate(1);
  });
}

async function start() {
  try {
    const response = await fetch('./levels.json');
    if (!response.ok) throw Error('The gardens could not be loaded.');
    levels = await response.json();
    world = new World($('scene'), pick);
    attachControls();
    loadLevel(index);
    $('loading').remove();
  } catch (error) {
    console.error(error);
    $('loading').innerHTML =
      '<span class="loading-star">✦</span><p>This garden needs a browser with WebGL enabled.</p><p>Try reloading, or open it in a current version of Chrome, Safari, or Firefox.</p><button class="primary-button" id="retry">Try again</button>';
    $('retry').onclick = () => location.reload();
  }
}
start();
