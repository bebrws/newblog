// Pure puzzle rules, shared by the game and the level verifier.
// Coordinates are [x,z]. One height unit is independent of rendering scale.
export const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
export const key = (x, z) => `${x},${z}`;
export const copy = (s) => ({
  player: [...s.player],
  blocks: s.blocks.map((b) => ({ ...b })),
  moves: s.moves || 0,
  pushes: s.pushes || 0,
});
export function initial(level) {
  return {
    player: [...level.start.player],
    blocks: level.start.blocks.map((b) => ({ ...b })),
    moves: 0,
    pushes: 0,
  };
}
export function inside(l, x, z) {
  return (
    x >= 0 &&
    z >= 0 &&
    x < l.width &&
    z < l.depth &&
    !l.holes?.some((p) => p[0] === x && p[1] === z)
  );
}
export function wall(l, x, z) {
  return l.walls.some((p) => p[0] === x && p[1] === z);
}
export function fixedHeight(l, x, z) {
  if (l.goal.x === x && l.goal.z === z) return l.goal.h;
  return l.platforms?.find((p) => p.x === x && p.z === z)?.h || 0;
}
export function height(l, s, x, z) {
  if (!inside(l, x, z) || wall(l, x, z)) return Infinity;
  return s.blocks.find((b) => b.x === x && b.z === z)?.h || fixedHeight(l, x, z);
}
export function won(l, s) {
  return s.player[0] === l.goal.x && s.player[1] === l.goal.z;
}
/** WALK may climb one unit. PUSH works only from ground, moves one block,
 * and requires a vacant ground destination. Invalid actions never mutate. */
export function step(l, s, dir, mode = 'walk') {
  const [dx, dz] = DIRS[dir],
    [x, z] = s.player,
    nx = x + dx,
    nz = z + dz;
  if (!inside(l, nx, nz) || wall(l, nx, nz)) return null;
  const block = s.blocks.find((b) => b.x === nx && b.z === nz);
  const current = height(l, s, x, z);
  if (mode === 'push' && block) {
    const tx = nx + dx,
      tz = nz + dz;
    if (current !== 0 || !inside(l, tx, tz) || height(l, s, tx, tz) !== 0) return null;
    const next = copy(s);
    const b = next.blocks.find((b) => b.id === block.id);
    b.x = tx;
    b.z = tz;
    next.player = [nx, nz];
    next.moves++;
    next.pushes++;
    return next;
  }
  if (Math.abs(height(l, s, nx, nz) - current) > 1) return null;
  const next = copy(s);
  next.player = [nx, nz];
  next.moves++;
  return next;
}
export function reachable(l, s) {
  const queue = [{ p: s.player, path: [] }],
    seen = new Set([key(...s.player)]);
  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    for (let d = 0; d < 4; d++) {
      const ns = step(l, { ...s, player: item.p }, d, 'walk');
      if (ns && !seen.has(key(...ns.player))) {
        seen.add(key(...ns.player));
        queue.push({ p: ns.player, path: [...item.path, { dir: d, mode: 'walk' }] });
      }
    }
  }
  return queue;
}
