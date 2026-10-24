import { DIRS, height, reachable, step } from './engine.js';

// Describe both choices using the same rules that execute them.
export function blockInteraction(level, state, dir) {
  const [dx, dz] = DIRS[dir];
  const block = state.blocks.find(
    (b) => b.x === state.player[0] + dx && b.z === state.player[1] + dz,
  );
  if (!block) return null;
  const current = height(level, state, ...state.player);
  const climb = Boolean(step(level, state, dir, 'walk'));
  const push = Boolean(step(level, state, dir, 'push'));
  return {
    block,
    dir,
    climb: {
      enabled: climb,
      description: climb
        ? 'Step onto this block.'
        : block.h > current
          ? 'Too high. Find a step one height below it.'
          : 'Too far down. Find a step one height below you.',
    },
    push: {
      enabled: push,
      description: push
        ? 'Slide it forward and step into its place.'
        : current !== 0
          ? 'Stand on the ground to push.'
          : 'No empty floor tile beyond this block.',
    },
  };
}

// Prefer the block ahead; do not keep prompting for a block we are passing.
export function approachedBlock(level, before, after, dir) {
  const ahead = blockInteraction(level, after, dir);
  if (ahead) return ahead;
  return DIRS.map((_, d) => blockInteraction(level, after, d)).find(
    (choice) => choice &&
      Math.abs(choice.block.x - before.player[0]) +
        Math.abs(choice.block.z - before.player[1]) > 1,
  ) || null;
}

export function routeToBlock(level, state, block) {
  const candidates = [];
  for (const route of reachable(level, state)) {
    const dir = DIRS.findIndex(
      ([dx, dz]) => route.p[0] + dx === block.x && route.p[1] + dz === block.z,
    );
    if (dir < 0) continue;
    const choice = blockInteraction(level, { ...state, player: route.p }, dir);
    if (choice.climb.enabled || choice.push.enabled) candidates.push({ ...route, dir });
  }
  return candidates.sort((a, b) => a.path.length - b.path.length)[0] || null;
}
