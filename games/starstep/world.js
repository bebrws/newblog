import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';
import { height, DIRS, step } from './engine.js';

export const PALETTE = ['#df8871', '#76aaa7', '#788dbb', '#a08eaf'];
const UNIT = 0.57,
  geometryCache = new Map(),
  materialCache = new Map();
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const material = (color, roughness = 0.9) => {
  const k = color + roughness;
  if (!materialCache.has(k))
    materialCache.set(k, new THREE.MeshStandardMaterial({ color, roughness }));
  return materialCache.get(k);
};
function box(w, h, d, r = 0.04) {
  const k = [w, h, d, r].join(',');
  if (!geometryCache.has(k))
    geometryCache.set(k, new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)));
  return geometryCache.get(k);
}
const sphereGeometry = new THREE.SphereGeometry(1, 16, 12);
function mesh(geometry, mat, parent, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function cube(parent, x, y, z, w, h, d, color, r = 0.04) {
  return mesh(box(w, h, d, r), material(color), parent, x, y, z);
}
function ball(parent, x, y, z, sx, sy, sz, color) {
  const m = mesh(sphereGeometry, material(color), parent, x, y, z);
  m.scale.set(sx, sy, sz);
  return m;
}
function randomizer(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
function numberMaterial(n) {
  const key = 'number' + n;
  if (materialCache.has(key)) return materialCache.get(key);
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);
  ctx.fillStyle = 'rgba(255,250,226,.75)';
  ctx.font = '500 65px Georgia';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(n, 64, 68);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false });
  materialCache.set(key, m);
  return m;
}

function makeGirl() {
  const g = new THREE.Group();
  const body = new THREE.Group();
  g.add(body);
  // Bobbed hair, a linen shirt, yellow overalls and small leather shoes.
  const skin = '#edb98e',
    hair = '#514137',
    shirt = '#fff2d7',
    yellow = '#dca94d';
  const torso = cube(body, 0, 0.59, 0, 0.3, 0.36, 0.23, shirt, 0.1);
  torso.rotation.z = -0.025;
  ball(body, 0, 0.45, 0, 0.195, 0.15, 0.15, yellow);
  cube(body, 0, 0.59, 0.133, 0.19, 0.24, 0.032, yellow, 0.018);
  for (const x of [-0.105, 0.105]) {
    cube(body, x, 0.695, 0.095, 0.038, 0.2, 0.045, yellow, 0.01);
    ball(body, x, 0.65, 0.16, 0.017, 0.017, 0.008, '#997642');
  }
  cube(body, 0, 0.53, 0.156, 0.09, 0.065, 0.015, '#c18e3b', 0.01);
  ball(body, 0, 0.83, 0, 0.071, 0.1, 0.07, skin);
  ball(body, 0, 1.035, -0.012, 0.25, 0.28, 0.245, hair);
  ball(body, 0, 1.025, 0.088, 0.198, 0.22, 0.182, skin);
  // The hair cap and tapered side locks retain a clear silhouette at game scale.
  ball(body, 0, 1.195, 0.006, 0.234, 0.119, 0.221, hair);
  for (const s of [-1, 1]) {
    ball(body, s * 0.211, 1.025, 0.01, 0.057, 0.205, 0.16, hair);
    ball(body, s * 0.181, 1.105, 0.14, 0.076, 0.125, 0.07, hair);
    ball(body, s * 0.194, 1.011, 0.068, 0.037, 0.052, 0.035, skin);
    ball(body, s * 0.076, 1.051, 0.25, 0.018, 0.026, 0.012, '#3e3931');
    ball(body, s * 0.074, 1.061, 0.261, 0.005, 0.007, 0.004, '#fffbeb');
    ball(body, s * 0.105, 0.996, 0.246, 0.043, 0.021, 0.007, '#e4a283');
  }
  ball(body, -0.075, 1.17, 0.187, 0.12, 0.072, 0.071, hair);
  ball(body, 0.07, 1.172, 0.181, 0.11, 0.08, 0.071, hair);
  ball(body, 0, 1.018, 0.269, 0.023, 0.029, 0.028, skin);
  cube(body, 0, 0.966, 0.254, 0.04, 0.008, 0.008, '#ac745c', 0.002);
  // A little ochre hair clip.
  cube(body, -0.205, 1.133, 0.117, 0.057, 0.028, 0.022, '#ddac53', 0.006).rotation.z = 0.4;
  const arms = [],
    legs = [];
  for (const s of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(s * 0.19, 0.7, 0);
    body.add(arm);
    ball(arm, s * 0.022, -0.06, 0, 0.073, 0.1, 0.073, shirt);
    ball(arm, s * 0.035, -0.19, 0.018, 0.051, 0.105, 0.051, skin);
    ball(arm, s * 0.033, -0.27, 0.027, 0.052, 0.057, 0.048, skin);
    arm.rotation.z = s * 0.1;
    arms.push(arm);
    const leg = new THREE.Group();
    leg.position.set(s * 0.093, 0.39, 0);
    body.add(leg);
    cube(leg, 0, -0.105, 0, 0.117, 0.23, 0.135, yellow, 0.035);
    ball(leg, 0, -0.25, 0.006, 0.048, 0.1, 0.047, skin);
    cube(leg, 0, -0.331, 0.033, 0.133, 0.094, 0.207, '#8b694c', 0.035);
    cube(leg, 0, -0.367, 0.03, 0.138, 0.026, 0.211, '#c9aa7c', 0.01);
    legs.push(leg);
  }
  g.userData = { body, arms, legs };
  return g;
}

function leaves(group, x, y, z, random, count = 5) {
  const colors = ['#738343', '#87954e', '#5e7540', '#9ba15a'];
  for (let i = 0; i < count; i++) {
    const leaf = ball(
      group,
      x + (random() - 0.5) * 0.3,
      y + random() * 0.12,
      z + (random() - 0.5) * 0.3,
      0.1 + random() * 0.045,
      0.026,
      0.055,
      colors[i % colors.length],
    );
    leaf.rotation.set(random() * 0.5, random() * 6.28, random() * 0.5);
  }
}
function ivy(parent, x, y, z, length, random) {
  const points = [];
  for (let i = 0; i < 9; i++) {
    const yy = y - (i * length) / 8;
    const xx = x + Math.sin(i * 0.7) * 0.055;
    points.push(new THREE.Vector3(xx, yy, z));
    if (i % 2 === 0) leaves(parent, xx, yy, z, random, 3);
  }
  const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 12, 0.009, 4, false);
  geo.userData.disposable = true;
  mesh(geo, material('#657248'), parent);
}
function cypress(parent, x, y, z, scale, random) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  parent.add(g);
  const pot = mesh(
    new THREE.CylinderGeometry(0.19, 0.14, 0.27, 9),
    material('#bdaa7c'),
    g,
    0,
    0.135,
    0,
  );
  pot.geometry.userData.disposable = true;
  cube(g, 0, 0.27, 0, 0.35, 0.055, 0.35, '#cbb78a', 0.04);
  cube(g, 0, 0.42, 0, 0.047, 0.3, 0.047, '#81714a', 0.01);
  for (let i = 0; i < 5; i++)
    ball(
      g,
      Math.sin(i * 2) * 0.025,
      0.49 + i * 0.18,
      0,
      0.17 - i * 0.026,
      0.235,
      0.14 - i * 0.023,
      i % 2 ? '#70814b' : '#647747',
    );
}

export class World {
  constructor(container, onPick) {
    this.container = container;
    this.onPick = onPick;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog('#e6e4e2', 35, 85);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
    this.renderer.setClearColor(0, 0);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;
    container.append(this.renderer.domElement);
    this.camera = new THREE.OrthographicCamera(-8, 8, 8, -8, 0.1, 150);
    this.scene.add(new THREE.HemisphereLight('#fff5d9', '#a5a6b6', 2));
    const sun = new THREE.DirectionalLight('#fff0cc', 3.2);
    sun.position.set(-9, 15, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -12;
    sun.shadow.camera.right = 12;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -12;
    sun.shadow.camera.near = 0.1;
    sun.shadow.camera.far = 55;
    sun.shadow.normalBias = 0.035;
    sun.shadow.bias = -0.00015;
    sun.shadow.radius = 4;
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight('#d9dffc', 0.8);
    fill.position.set(8, 7, -7);
    this.scene.add(fill);
    this.board = new THREE.Group();
    this.scene.add(this.board);
    this.scenery = new THREE.Group();
    this.scene.add(this.scenery);
    this.quarter = 0;
    this.angle = Math.PI / 4;
    this.targetAngle = this.angle;
    this.blocks = new Map();
    this.animation = null;
    this.target = new THREE.Vector3();
    this.clock = new THREE.Clock();
    this.elapsed = 0;
    this.sparkles = [];
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.pickables = [];
    this.hover = mesh(
      new THREE.PlaneGeometry(0.88, 0.88),
      new THREE.MeshBasicMaterial({
        color: '#fffae5',
        transparent: true,
        opacity: 0.2,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
      this.board,
    );
    this.hover.rotation.x = -Math.PI / 2;
    this.hover.visible = false;
    this.renderer.domElement.addEventListener('pointermove', (e) => this.point(e, false));
    this.renderer.domElement.addEventListener('pointerleave', () => {
      this.hover.visible = false;
    });
    this.renderer.domElement.addEventListener('pointerup', (e) => this.point(e, true));
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);
    this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      document.getElementById('message').textContent =
        'The garden paused. Reload the page to restore the 3D view.';
      document.getElementById('message').classList.add('visible');
    });
    this.makeScenery();
    this.resize();
    this.renderer.setAnimationLoop(() => this.tick());
  }
  point(event, click) {
    if (!this.level) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    this.pointer.set(
      ((event.clientX - r.left) / r.width) * 2 - 1,
      -((event.clientY - r.top) / r.height) * 2 + 1,
    );
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.pickables, false)[0];
    if (hit) {
      const { x, z } = hit.object.userData.tile;
      this.hover.position.set(
        x - this.ox,
        height(this.level, this.state, x, z) * UNIT + 0.055,
        z - this.oz,
      );
      this.hover.visible = true;
      if (click) this.onPick(x, z);
    } else this.hover.visible = false;
  }
  makeScenery() {
    const rand = randomizer(54);
    const locations = [
      [-11, -3, -9, 1.4],
      [11, -4, -13, 1.15],
      [-9, -4, 7, 0.75],
      [12, -6, 5, 0.8],
      [0, -8, -20, 1.6],
    ];
    for (const [x, y, z, s] of locations) {
      const island = new THREE.Group();
      island.position.set(x, y, z);
      island.scale.setScalar(s);
      this.scenery.add(island);
      cube(island, 0, -0.25, 0, 2.7, 0.5, 2.35, '#bcad8d', 0.1);
      cube(island, 0, 0.01, 0, 2.65, 0.1, 2.3, '#b6b585', 0.06);
      for (let i = 0; i < 9; i++) {
        const bx = (rand() - 0.5) * 2,
          bz = (rand() - 0.5) * 1.7;
        const rock = cube(
          island,
          bx,
          -0.7 - rand() * 0.5,
          bz,
          0.4 + rand() * 0.6,
          0.6 + rand() * 0.6,
          0.4 + rand() * 0.5,
          '#b5a88d',
          0.03,
        );
        rock.rotation.z = (rand() - 0.5) * 0.3;
      }
      cypress(island, -0.6, 0.07, -0.3, 0.85, rand);
      cypress(island, 0.7, 0.07, 0.5, 0.6, rand);
      cube(island, 0.45, 0.23, -0.7, 0.85, 0.42, 0.16, '#d5c5a2', 0.05);
      cube(island, 0.75, 0.46, -0.7, 0.22, 0.9, 0.25, '#d5c5a2', 0.04);
      for (let i = 0; i < 4; i++)
        leaves(island, (rand() - 0.5) * 2, 0.1, (rand() - 0.5) * 1.6, rand, 5);
    }
  }
  clearBoard() {
    this.blockOutline?.material.dispose();
    this.board.traverse((o) => {
      if (o.geometry?.userData.disposable) o.geometry.dispose();
    });
    this.board.clear();
    this.blocks.clear();
    this.pickables = [];
    this.sparkles = [];
    this.animation = null;
  }
  load(level, state) {
    this.clearBoard();
    this.level = level;
    this.state = state;
    this.ox = (level.width - 1) / 2;
    this.oz = (level.depth - 1) / 2;
    const random = randomizer(level.id * 3271),
      w = level.width,
      d = level.depth;
    // Floating limestone foundation: three masonry courses over broken bedrock.
    cube(this.board, 0, -0.36, 0, w + 0.13, 0.67, d + 0.13, '#b8a17d', 0.08);
    const stones = ['#c8b593', '#c1ad8a', '#ceb998', '#c4af8c'];
    for (let row = 0; row < 2; row++) {
      for (let x = 0; x < w; x++)
        for (const s of [-1, 1])
          cube(
            this.board,
            x - this.ox,
            -0.29 - row * 0.29,
            s * (d / 2 + 0.015),
            0.976,
            0.276,
            0.16,
            stones[Math.floor(random() * 4)],
            0.025,
          );
      for (let z = 0; z < d; z++)
        for (const s of [-1, 1])
          cube(
            this.board,
            s * (w / 2 + 0.015),
            -0.29 - row * 0.29,
            z - this.oz,
            0.16,
            0.276,
            0.976,
            stones[Math.floor(random() * 4)],
            0.025,
          );
    }
    for (let i = 0; i < w * 2; i++) {
      const r = cube(
        this.board,
        (random() - 0.5) * (w - 0.3),
        -0.8 - random() * 0.65,
        (random() - 0.5) * (d - 0.3),
        0.6 + random() * 0.75,
        0.65 + random() * 0.9,
        0.6 + random() * 0.7,
        stones[Math.floor(random() * 4)],
        0.025,
      );
      r.rotation.set((random() - 0.5) * 0.12, (random() - 0.5) * 0.1, (random() - 0.5) * 0.12);
    }
    const floorColors = ['#e5d3ad', '#e9d9b8', '#e1cfab', '#e7d5b1', '#e2d0ad', '#ecdcba'];
    for (let z = 0; z < d; z++)
      for (let x = 0; x < w; x++) {
        if (level.holes?.some((p) => p[0] === x && p[1] === z)) continue;
        const tile = cube(
          this.board,
          x - this.ox,
          -0.05,
          z - this.oz,
          0.972,
          0.135,
          0.972,
          floorColors[Math.floor(random() * floorColors.length)],
          0.045,
        );
        tile.userData.tile = { x, z };
        this.pickables.push(tile);
        // Small mineral flecks keep the surfaces tactile, with no visual noise.
        if (random() > 0.5) {
          const patch = cube(
            this.board,
            x - this.ox + (random() - 0.5) * 0.55,
            0.02,
            z - this.oz + (random() - 0.5) * 0.55,
            0.08 + random() * 0.14,
            0.002,
            0.022,
            '#d5c29f',
            0.001,
          );
          patch.rotation.y = random() * 3;
          patch.castShadow = false;
        }
      }
    for (const [x, z] of level.walls) {
      const wall = cube(
        this.board,
        x - this.ox,
        0.51,
        z - this.oz,
        0.96,
        1.02,
        0.96,
        '#b5ae8d',
        0.055,
      );
      cube(this.board, x - this.ox, 1.03, z - this.oz, 1, 0.08, 1, '#c6bd9b', 0.025);
      for (let i = 1; i <= 2; i++)
        cube(this.board, x - this.ox, i * 0.32, z - this.oz, 0.971, 0.012, 0.971, '#a49c7e', 0.002);
      if (random() > 0.4) leaves(this.board, x - this.ox + 0.2, 1.09, z - this.oz, random, 5);
      if (random() > 0.78) ivy(this.board, x - this.ox, 1.04, z - this.oz + 0.51, 0.65, random);
    }
    const platforms = [...(level.platforms || []), level.goal];
    for (const p of platforms) {
      const h = p.h * UNIT;
      const goal = p === level.goal;
      const m = cube(
        this.board,
        p.x - this.ox,
        h / 2,
        p.z - this.oz,
        0.985,
        h,
        0.985,
        goal ? '#dcc99f' : '#bdbd9a',
        0.06,
      );
      m.userData.tile = { x: p.x, z: p.z };
      this.pickables.push(m);
      for (let i = 1; i < p.h; i++)
        cube(
          this.board,
          p.x - this.ox,
          i * UNIT,
          p.z - this.oz,
          0.991,
          0.012,
          0.991,
          goal ? '#bfa980' : '#a3a784',
          0.003,
        );
      cube(
        this.board,
        p.x - this.ox,
        h + 0.012,
        p.z - this.oz,
        1.025,
        0.075,
        1.025,
        goal ? '#e9d4a8' : '#ccd1ab',
        0.034,
      );
      if (goal) {
        ivy(this.board, p.x - this.ox + 0.4, h, p.z - this.oz + 0.51, h * 0.68, random);
        leaves(this.board, p.x - this.ox + 0.38, h + 0.06, p.z - this.oz - 0.25, random, 5);
      }
    }
    for (const b of state.blocks) {
      const group = new THREE.Group();
      const h = b.h * UNIT,
        color = PALETTE[b.h - 1] || PALETTE[3];
      const main = cube(group, 0, h / 2, 0, 0.9, h, 0.9, color, 0.055);
      main.userData.tile = { x: b.x, z: b.z };
      this.pickables.push(main);
      const seamColor = new THREE.Color(color).multiplyScalar(0.82);
      for (let i = 1; i < b.h; i++)
        cube(group, 0, i * UNIT, 0, 0.905, 0.012, 0.905, seamColor.getStyle(), 0.004);
      const top = cube(
        group,
        0,
        h - 0.015,
        0,
        0.83,
        0.045,
        0.83,
        new THREE.Color(color).lerp(new THREE.Color('#faf1d4'), 0.13).getStyle(),
        0.027,
      );
      const number = mesh(
        new THREE.PlaneGeometry(0.3, 0.3),
        numberMaterial(b.h),
        group,
        0,
        h + 0.014,
        0.04,
      );
      number.rotation.x = -Math.PI / 2;
      number.castShadow = false;
      number.geometry.userData.disposable = true;
      // Discreet front-face height markings stay visible from the isometric view.
      for (let i = 0; i < b.h; i++)
        cube(
          group,
          0.31,
          0.15 + i * UNIT,
          0.453,
          0.08,
          0.015,
          0.006,
          new THREE.Color(color).lerp(new THREE.Color('#fff0c8'), 0.32).getStyle(),
          0.002,
        );
      group.position.set(b.x - this.ox, 0, b.z - this.oz);
      group.userData.main = main;
      this.board.add(group);
      this.blocks.set(b.id, group);
    }
    // The island's edges carry scattered plants, flowers, and trailing ivy.
    const corners = [
      [-w / 2 + 0.14, -d / 2 + 0.12],
      [w / 2 - 0.13, -d / 2 + 0.12],
      [-w / 2 + 0.14, d / 2 - 0.12],
      [w / 2 - 0.12, d / 2 - 0.12],
    ];
    for (const [x, z] of corners) {
      leaves(this.board, x, 0.085, z, random, 9);
      for (let i = 0; i < 3; i++) {
        const fx = x + (random() - 0.5) * 0.25,
          fz = z + (random() - 0.5) * 0.22;
        ball(this.board, fx, 0.14, fz, 0.026, 0.03, 0.026, '#f9efd5');
        ball(this.board, fx + 0.032, 0.15, fz, 0.023, 0.026, 0.024, '#f8eed6');
        ball(this.board, fx + 0.013, 0.162, fz, 0.01, 0.01, 0.01, '#d7b660');
      }
    }
    ivy(this.board, -w / 2 + 0.7, -0.05, d / 2 + 0.11, 1.0, random);
    ivy(this.board, w / 2 - 0.45, -0.07, d / 2 + 0.1, 0.75, random);
    ivy(this.board, w / 2 + 0.08, -0.04, -d / 2 + 0.7, 1.4, random);
    // Planters sit outside the playable grid, so decoration never hides a tile.
    cypress(this.board, -w / 2 - 0.13, 0.01, -d / 2 - 0.1, 0.64, random);
    cypress(this.board, w / 2 + 0.08, 0.01, -d / 2 - 0.1, 0.72, random);
    this.girl = makeGirl();
    this.board.add(this.girl);
    this.girl.rotation.y = Math.PI;
    this.girl.position.set(
      state.player[0] - this.ox,
      height(level, state, ...state.player) * UNIT + 0.03,
      state.player[1] - this.oz,
    );
    this.ring = mesh(
      new THREE.RingGeometry(0.27, 0.34, 40),
      new THREE.MeshBasicMaterial({
        color: '#fff4c3',
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
      this.board,
    );
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.castShadow = false;
    this.ring.geometry.userData.disposable = true;
    this.makeStar();
    this.board.add(this.hover);
    this.hover.visible = false;
    this.quarter = 0;
    this.angle = Math.PI / 4;
    this.targetAngle = this.angle;
    this.target.set(0, 0.35, 0);
    const outlineBox = new THREE.BoxGeometry(0.98, 1, 0.98);
    const outlineGeometry = new THREE.EdgesGeometry(outlineBox);
    outlineBox.dispose();
    outlineGeometry.userData.disposable = true;
    this.blockOutline = new THREE.LineSegments(
      outlineGeometry,
      new THREE.LineBasicMaterial({ color: '#b78432', depthTest: false }),
    );
    this.blockOutline.renderOrder = 10;
    this.blockOutline.visible = false;
    this.board.add(this.blockOutline);
    this.guides = new THREE.Group();
    this.board.add(this.guides);
    this.updateGuides();
    this.resize();
  }
  makeStar() {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const a = Math.PI / 2 + (i * Math.PI) / 5,
        r = i % 2 ? 0.21 : 0.46;
      const x = Math.cos(a) * r,
        y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.13,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.045,
      bevelSegments: 3,
      steps: 1,
    });
    geometry.center();
    geometry.userData.disposable = true;
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffd46d',
      emissive: '#ffc545',
      emissiveIntensity: 0.6,
      roughness: 0.37,
      metalness: 0.12,
    });
    this.star = new THREE.Group();
    this.starMesh = mesh(geometry, mat, this.star);
    this.star.rotation.y = Math.PI / 4;
    const p = this.level.goal;
    this.star.position.set(p.x - this.ox, p.h * UNIT + 0.73, p.z - this.oz);
    this.board.add(this.star);
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const ctx = c.getContext('2d');
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,216,105,.7)');
    gradient.addColorStop(0.25, 'rgba(255,215,109,.25)');
    gradient.addColorStop(1, 'rgba(255,215,109,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(c);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0.65,
      }),
    );
    glow.scale.set(2.1, 2.1, 1);
    this.star.add(glow);
    const starLight = new THREE.PointLight('#ffd679', 2.5, 4, 2);
    this.star.add(starLight);
    const random = randomizer(this.level.id + 40);
    for (let i = 0; i < 12; i++) {
      const spark = mesh(
        new THREE.OctahedronGeometry(0.021 + random() * 0.012),
        new THREE.MeshBasicMaterial({ color: '#fff3b0' }),
        this.board,
      );
      spark.geometry.userData.disposable = true;
      spark.userData = {
        phase: random() * 6.28,
        radius: 0.5 + random() * 0.4,
        speed: 0.2 + random() * 0.3,
      };
      this.sparkles.push(spark);
    }
  }
  resize() {
    const w = this.container.clientWidth,
      h = this.container.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    const aspect = w / h;
    const size = this.level ? Math.max(this.level.width, this.level.depth) : 6;
    const viewHeight = Math.max(size * 1.15 + 1.3, (size * 1.5 + 1.4) / aspect);
    this.camera.left = (-viewHeight * aspect) / 2;
    this.camera.right = (viewHeight * aspect) / 2;
    this.camera.top = viewHeight / 2;
    this.camera.bottom = -viewHeight / 2;
    this.camera.updateProjectionMatrix();
  }
  selectBlock(block) {
    if (!this.blockOutline) return;
    this.blockOutline.visible = Boolean(block);
    if (!block) return;
    this.blockOutline.scale.y = block.h * UNIT + 0.08;
    this.blockOutline.position.set(block.x - this.ox, block.h * UNIT / 2, block.z - this.oz);
    this.girl.rotation.y = Math.atan2(block.x - this.state.player[0], block.z - this.state.player[1]);
  }
  blockScreenPosition(block) {
    const point = new THREE.Vector3(
      block.x - this.ox, block.h * UNIT + 0.15, block.z - this.oz,
    ).project(this.camera);
    const rect = this.container.getBoundingClientRect();
    const edges = [[-0.5, -0.5], [-0.5, 0.5], [0.5, -0.5], [0.5, 0.5]].map(([dx, dz]) => {
      const edge = new THREE.Vector3(
        block.x + dx - this.ox, block.h * UNIT, block.z + dz - this.oz,
      ).project(this.camera);
      return rect.left + (edge.x + 1) * rect.width / 2;
    });
    return {
      left: Math.min(...edges),
      right: Math.max(...edges),
      y: rect.top + (1 - point.y) * rect.height / 2,
    };
  }
  updateGuides() {
    if (!this.guides) return;
    this.guides.clear();
    for (let d = 0; d < 4; d++) {
      if (!step(this.level, this.state, d, 'walk') && !step(this.level, this.state, d, 'push'))
        continue;
      const [dx, dz] = DIRS[d],
        x = this.state.player[0] + dx,
        z = this.state.player[1] + dz;
      const g = mesh(
        sphereGeometry,
        new THREE.MeshBasicMaterial({
          color: this.state.blocks.some((b) => b.x === x && b.z === z) ? '#d5af6b' : '#fff7d8',
          transparent: true,
          opacity: 0.5,
        }),
        this.guides,
        x - this.ox,
        height(this.level, this.state, x, z) * UNIT + 0.045,
        z - this.oz,
      );
      g.scale.set(0.06, 0.015, 0.06);
      g.castShadow = false;
    }
  }
  rotate(delta) {
    this.quarter = (this.quarter + delta + 4) % 4;
    this.targetAngle += (delta * Math.PI) / 2;
  }
  sync(state, animate = true, pushed = false) {
    this.state = state;
    this.hover.visible = false;
    const destination = new THREE.Vector3(
      state.player[0] - this.ox,
      height(this.level, state, ...state.player) * UNIT + 0.03,
      state.player[1] - this.oz,
    );
    const dx = destination.x - this.girl.position.x,
      dz = destination.z - this.girl.position.z;
    const facing = Math.abs(dx) + Math.abs(dz) > 0.01 ? Math.atan2(dx, dz) : this.girl.rotation.y;
    const blockMoves = [];
    for (const b of state.blocks) {
      const group = this.blocks.get(b.id);
      group.userData.main.userData.tile = { x: b.x, z: b.z };
      blockMoves.push({
        group,
        from: group.position.clone(),
        to: new THREE.Vector3(b.x - this.ox, 0, b.z - this.oz),
      });
    }
    if (animate && !reduceMotion)
      this.animation = {
        from: this.girl.position.clone(),
        to: destination,
        start: performance.now(),
        duration: pushed ? 230 : 180,
        blocks: blockMoves,
        facing,
        pushed,
      };
    else {
      this.girl.position.copy(destination);
      this.girl.rotation.y = facing;
      for (const b of blockMoves) b.group.position.copy(b.to);
      this.animation = null;
    }
    this.updateGuides();
  }
  tick() {
    const dt = Math.min(this.clock.getDelta(), 0.05);
    this.elapsed += dt;
    this.angle = THREE.MathUtils.damp(this.angle, this.targetAngle, 7, dt);
    this.camera.position.set(Math.sin(this.angle) * 18, 16, Math.cos(this.angle) * 18);
    this.camera.lookAt(this.target);
    if (this.girl) {
      const { body, arms, legs } = this.girl.userData;
      if (this.animation) {
        const a = this.animation,
          t = Math.min((performance.now() - a.start) / a.duration, 1),
          ease = t * t * (3 - 2 * t);
        this.girl.position.lerpVectors(a.from, a.to, ease);
        this.girl.position.y += Math.sin(t * Math.PI) * (a.pushed ? 0.015 : 0.1);
        this.girl.rotation.y = a.facing;
        for (const b of a.blocks) b.group.position.lerpVectors(b.from, b.to, ease);
        body.rotation.x = a.pushed ? 0.14 : 0;
        arms.forEach((arm, i) => {
          arm.rotation.x = a.pushed ? -1.05 : Math.sin(t * Math.PI * 2 + i * Math.PI) * 0.3;
        });
        legs.forEach((leg, i) => {
          leg.rotation.x = Math.sin(t * Math.PI * 2 + i * Math.PI) * 0.32;
        });
        if (t === 1) {
          this.animation = null;
          body.rotation.x = 0;
          arms.forEach((a) => (a.rotation.x = 0));
          legs.forEach((l) => (l.rotation.x = 0));
        }
      } else if (!reduceMotion) body.position.y = Math.sin(this.elapsed * 2.3) * 0.009;
      this.ring.position.copy(this.girl.position);
      this.ring.position.y += 0.012;
      const p = this.level.goal;
      this.star.position.y =
        p.h * UNIT + 0.76 + (reduceMotion ? 0 : Math.sin(this.elapsed * 1.6) * 0.075);
      this.star.rotation.y = this.angle + (reduceMotion ? 0 : Math.sin(this.elapsed * 0.5) * 0.22);
      for (let i = 0; i < this.sparkles.length; i++) {
        const sp = this.sparkles[i],
          u = sp.userData,
          t = this.elapsed * u.speed + u.phase;
        sp.position.set(
          this.star.position.x + Math.cos(t) * u.radius,
          this.star.position.y + Math.sin(t * 1.3 + i) * 0.6,
          this.star.position.z + Math.sin(t) * u.radius * 0.65,
        );
        sp.scale.setScalar(0.65 + Math.sin(t * 3) * 0.35);
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
}
