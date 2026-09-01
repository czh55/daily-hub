import * as THREE from "three";
import { ROOMS } from "./config.js";

const T = 0.12;
const H = 2.66;

function mulberry32(seed) {
  return function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function woodTexture(THREE, opts) {
  const {
    w = 512,
    h = 512,
    c1 = "#2a1c12",
    c2 = "#3d2818",
    c3 = "#1a120c",
    seed = 1,
  } = opts;
  const rnd = mulberry32(seed);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = c1;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 90; i += 1) {
    const x = (i / 90) * w + Math.sin(i * 0.55) * 10;
    ctx.strokeStyle = i % 4 === 0 ? c3 : c2;
    ctx.globalAlpha = 0.12 + rnd() * 0.16;
    ctx.lineWidth = 0.8 + rnd() * 2.4;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    for (let y = 0; y <= h; y += 6) {
      ctx.lineTo(x + Math.sin(y * 0.035 + i) * 7 + (rnd() - 0.5) * 1.5, y);
    }
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 14;
    d[i] = Math.max(0, Math.min(180, d[i] + n));
    d[i + 1] = Math.max(0, Math.min(160, d[i + 1] + n * 0.85));
    d[i + 2] = Math.max(0, Math.min(130, d[i + 2] + n * 0.6));
    d[i] *= 0.82;
    d[i + 1] *= 0.8;
    d[i + 2] *= 0.78;
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function fabricTexture(THREE, hex, seed) {
  const rnd = mulberry32(seed);
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, 256, 256);
  const img = ctx.getImageData(0, 0, 256, 256);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (rnd() - 0.5) * 10;
    d[i] = Math.max(0, d[i] + n);
    d[i + 1] = Math.max(0, d[i + 1] + n);
    d[i + 2] = Math.max(0, d[i + 2] + n * 0.8);
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function std(THREE, map, color, roughness = 0.88) {
  return new THREE.MeshStandardMaterial({
    map,
    color,
    roughness,
    metalness: 0.0,
    envMapIntensity: 0,
  });
}

export function createMaterials(THREE) {
  const floorMap = woodTexture(THREE, {
    c1: "#2b1d13",
    c2: "#3f2a1a",
    c3: "#1b120c",
    seed: 11,
  });
  floorMap.repeat.set(6, 5);

  const oakMap = woodTexture(THREE, {
    c1: "#3a2819",
    c2: "#4a3420",
    c3: "#24180f",
    seed: 22,
  });
  oakMap.repeat.set(2, 1);

  const teakMap = woodTexture(THREE, {
    c1: "#2e2015",
    c2: "#3c2a1b",
    c3: "#1a120c",
    seed: 33,
  });

  const extMap = woodTexture(THREE, {
    c1: "#22180f",
    c2: "#2e2116",
    c3: "#140f0a",
    seed: 44,
  });
  extMap.repeat.set(3, 2);

  const deckMap = woodTexture(THREE, {
    c1: "#2c1e14",
    c2: "#3a281a",
    c3: "#1a120c",
    seed: 55,
  });
  deckMap.repeat.set(3, 2);

  return {
    floor: std(THREE, floorMap, 0xb0a090, 0.9),
    oak: std(THREE, oakMap, 0xa89880, 0.86),
    teak: std(THREE, teakMap, 0x9a8a72, 0.88),
    exterior: std(THREE, extMap, 0x8a7a68, 0.92),
    deck: std(THREE, deckMap, 0xa09078, 0.9),
    plaster: new THREE.MeshStandardMaterial({
      color: 0x3a342c,
      roughness: 0.94,
      metalness: 0,
    }),
    plasterDark: new THREE.MeshStandardMaterial({
      color: 0x2c2822,
      roughness: 0.95,
      metalness: 0,
    }),
    stone: new THREE.MeshStandardMaterial({
      color: 0x1c1a16,
      roughness: 0.96,
      metalness: 0,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x1a2430,
      roughness: 0.72,
      metalness: 0.04,
      transparent: true,
      opacity: 0.55,
    }),
    sofa: std(THREE, fabricTexture(THREE, "#2a2420", 7), 0x9a9088, 0.95),
    linen: std(THREE, fabricTexture(THREE, "#2c2824", 8), 0xa09890, 0.96),
    cushion: std(THREE, fabricTexture(THREE, "#1e2830", 9), 0x889098, 0.95),
    moss: std(THREE, fabricTexture(THREE, "#243024", 10), 0x889080, 0.95),
    rug: std(THREE, fabricTexture(THREE, "#1e1c18", 12), 0x888078, 0.97),
    grass: new THREE.MeshStandardMaterial({
      color: 0x141810,
      roughness: 0.98,
      metalness: 0,
    }),
    dirt: new THREE.MeshStandardMaterial({
      color: 0x16120c,
      roughness: 0.97,
      metalness: 0,
    }),
    metalMatte: new THREE.MeshStandardMaterial({
      color: 0x2a2620,
      roughness: 0.7,
      metalness: 0.18,
    }),
    lampShade: new THREE.MeshStandardMaterial({
      color: 0x4a3a28,
      roughness: 0.9,
      metalness: 0,
      emissive: 0x3a2814,
      emissiveIntensity: 0.18,
    }),
    screen: new THREE.MeshStandardMaterial({
      color: 0x12161a,
      roughness: 0.85,
      metalness: 0.05,
      emissive: 0x1a2430,
      emissiveIntensity: 0.12,
    }),
    photo: new THREE.MeshStandardMaterial({
      color: 0x2a2620,
      roughness: 0.88,
      metalness: 0,
      emissive: 0x1a1814,
      emissiveIntensity: 0.08,
    }),
    leaf: new THREE.MeshStandardMaterial({
      color: 0x1a2418,
      roughness: 0.92,
      metalness: 0,
    }),
    path: new THREE.MeshStandardMaterial({
      color: 0x2a2620,
      roughness: 0.95,
      metalness: 0,
    }),
  };
}

function mesh(geo, mat, x, y, z, shadows = true) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if (shadows) {
    m.castShadow = true;
    m.receiveShadow = true;
  }
  return m;
}

function box(THREE, w, h, d, mat, x, y, z) {
  return mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z);
}

function mark(obj, data) {
  obj.userData = { ...obj.userData, ...data, clickable: true };
  obj.traverse((c) => {
    if (c.isMesh) c.userData = { ...c.userData, ...data, clickable: true };
  });
  return obj;
}

function addLamp(THREE, parent, x, y, z, color, intensity, distance) {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(x, y, z);
  light.castShadow = false;
  parent.add(light);
  return light;
}

function plant(THREE, mats, s = 1) {
  const g = new THREE.Group();
  g.add(box(THREE, 0.16 * s, 0.14 * s, 0.16 * s, mats.teak, 0, 0.07 * s, 0));
  const pot = mesh(
    new THREE.CylinderGeometry(0.09 * s, 0.11 * s, 0.16 * s, 8),
    mats.stone,
    0,
    0.2 * s,
    0,
  );
  g.add(pot);
  g.add(
    mesh(
      new THREE.SphereGeometry(0.16 * s, 8, 6),
      mats.leaf,
      0,
      0.4 * s,
      0,
    ),
  );
  g.add(
    mesh(
      new THREE.SphereGeometry(0.12 * s, 8, 6),
      mats.leaf,
      0.08 * s,
      0.48 * s,
      0.02 * s,
    ),
  );
  return g;
}

function buildExterior(THREE, root, mats) {
  const ground = mesh(
    new THREE.CircleGeometry(28, 48),
    mats.grass,
    0,
    -0.04,
    0.2,
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.castShadow = false;
  root.add(ground);

  root.add(box(THREE, 18, 0.18, 16.4, mats.dirt, 0, -0.12, 0.1));
  root.add(box(THREE, 13.4, 0.28, 11.6, mats.stone, 0, -0.02, 0));

  const path = box(THREE, 1.35, 0.04, 3.6, mats.path, 0.9, 0.02, -7.0);
  root.add(path);

  const fenceMat = mats.exterior;
  for (let i = -9; i <= 9; i += 1.4) {
    root.add(box(THREE, 0.08, 0.7, 0.08, fenceMat, i, 0.35, -8.4));
    root.add(box(THREE, 0.08, 0.7, 0.08, fenceMat, i, 0.35, 7.6));
  }
  root.add(box(THREE, 18.2, 0.06, 0.06, fenceMat, 0, 0.62, -8.4));
  root.add(box(THREE, 18.2, 0.06, 0.06, fenceMat, 0, 0.62, 7.6));

  function tree(x, z, s) {
    const t = new THREE.Group();
    t.add(
      mesh(
        new THREE.CylinderGeometry(0.12 * s, 0.16 * s, 1.4 * s, 6),
        mats.teak,
        0,
        0.7 * s,
        0,
      ),
    );
    t.add(
      mesh(
        new THREE.SphereGeometry(0.7 * s, 8, 6),
        mats.leaf,
        0,
        1.7 * s,
        0,
      ),
    );
    t.add(
      mesh(
        new THREE.SphereGeometry(0.5 * s, 8, 6),
        mats.leaf,
        0.35 * s,
        1.85 * s,
        -0.1 * s,
      ),
    );
    t.position.set(x, 0, z);
    root.add(t);
  }
  tree(-8.2, -6.2, 1.15);
  tree(8.6, -5.4, 0.95);
  tree(-8.8, 5.4, 1.05);
  tree(8.2, 6.2, 0.85);

  const bike = new THREE.Group();
  const tire = new THREE.TorusGeometry(0.22, 0.035, 8, 16);
  bike.add(mesh(tire, mats.metalMatte, -0.38, 0.22, 0));
  bike.add(mesh(tire, mats.metalMatte, 0.38, 0.22, 0));
  bike.add(box(THREE, 0.72, 0.03, 0.03, mats.metalMatte, 0, 0.38, 0));
  bike.add(box(THREE, 0.03, 0.28, 0.03, mats.metalMatte, 0.22, 0.5, 0));
  bike.position.set(-1.15, 0, -6.15);
  bike.rotation.y = 0.4;
  root.add(bike);
}

function hWall(THREE, mats, parent, x, z, len, y, h, interior = true) {
  parent.add(
    box(THREE, len, h, T, interior ? mats.plaster : mats.exterior, x, y + h / 2, z),
  );
}

function vWall(THREE, mats, parent, x, z, len, y, h, interior = true) {
  parent.add(
    box(THREE, T, h, len, interior ? mats.plaster : mats.exterior, x, y + h / 2, z),
  );
}

function windowPane(THREE, mats, parent, w, h, x, y, z, rotY = 0) {
  const g = new THREE.Group();
  g.add(box(THREE, w + 0.08, h + 0.08, 0.06, mats.oak, 0, 0, 0));
  g.add(box(THREE, w, h, 0.03, mats.glass, 0, 0, 0.01));
  g.add(box(THREE, 0.03, h, 0.04, mats.oak, 0, 0, 0.01));
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  parent.add(g);
}

function doorSwing(THREE, mats, parent, x, y, z, rotY) {
  const g = new THREE.Group();
  g.add(box(THREE, 0.86, 2.1, 0.05, mats.teak, 0, 1.05, 0));
  g.add(box(THREE, 0.06, 0.08, 0.04, mats.metalMatte, 0.34, 1.05, 0.03));
  g.position.set(x, y, z);
  g.rotation.y = rotY;
  parent.add(g);
}

function buildStructure(THREE, root, mats) {
  const house = new THREE.Group();
  house.name = "house";

  const floors = [
    ["study", mats.floor],
    ["bedroom", mats.floor],
    ["hall", mats.floor],
    ["living", mats.floor],
    ["kitchen", mats.floor],
    ["dining", mats.floor],
    ["bath", mats.floor],
  ];
  for (const [id, mat] of floors) {
    const b = ROOMS[id].bounds;
    const f = box(THREE, b.w - 0.02, 0.06, b.d - 0.02, mat, b.x, 0.03, b.z);
    mark(f, { type: "room", roomId: id });
    house.add(f);
  }
  const bal = ROOMS.balcony.bounds;
  const deck = box(THREE, bal.w - 0.02, 0.05, bal.d - 0.02, mats.deck, bal.x, 0.03, bal.z);
  mark(deck, { type: "room", roomId: "balcony" });
  house.add(deck);

  // 南外墙（大门开口）
  hWall(THREE, mats, house, -2.85, -5.26, 6.3, 0, H, false);
  hWall(THREE, mats, house, 3.8, -5.26, 4.4, 0, H, false);
  doorSwing(THREE, mats, house, 0.55, 0, -5.18, 0.45);

  // 北外墙（客厅 / 厨房窗）
  hWall(THREE, mats, house, -3.7, 5.26, 4.6, 0, 1.08, false);
  hWall(THREE, mats, house, 0.95, 5.26, 2.1, 0, H, false);
  hWall(THREE, mats, house, 4.85, 5.26, 2.3, 0, H, false);
  windowPane(THREE, mats, house, 1.7, 1.25, 0.95, 1.45, 5.2);
  windowPane(THREE, mats, house, 1.15, 1.05, 4.85, 1.4, 5.2);

  // 西外墙
  vWall(THREE, mats, house, -6.06, -3.1, 4.2, 0, H, false);
  vWall(THREE, mats, house, -6.06, 0.5, 3.0, 0, H, false);
  vWall(THREE, mats, house, -6.06, 3.6, 3.2, 0, 1.08, false);
  windowPane(THREE, mats, house, 1.35, 1.15, -6.0, 1.45, -3.15, Math.PI / 2);
  windowPane(THREE, mats, house, 1.25, 1.1, -6.0, 1.4, 0.45, Math.PI / 2);

  // 东外墙
  vWall(THREE, mats, house, 6.06, -3.1, 4.2, 0, H, false);
  vWall(THREE, mats, house, 6.06, 0.3, 2.6, 0, H, false);
  vWall(THREE, mats, house, 6.06, 3.4, 3.6, 0, H, false);
  windowPane(THREE, mats, house, 0.7, 0.55, 6.0, 1.7, -2.4, Math.PI / 2);
  windowPane(THREE, mats, house, 1.05, 1.1, 6.0, 1.4, 0.3, Math.PI / 2);
  windowPane(THREE, mats, house, 1.15, 1.05, 6.0, 1.4, 3.5, Math.PI / 2);

  // 内墙 x = -1.4
  vWall(THREE, mats, house, -1.4, -4.55, 1.3, 0, H, true);
  vWall(THREE, mats, house, -1.4, -1.85, 1.7, 0, H, true);
  vWall(THREE, mats, house, -1.4, -0.55, 0.9, 0, H, true);
  vWall(THREE, mats, house, -1.4, 1.55, 1.3, 0, H, true);
  vWall(THREE, mats, house, -1.4, 2.55, 1.1, 0, H, true);
  vWall(THREE, mats, house, -1.4, 4.7, 1.12, 0, H, true);

  // 内墙 x = 3.4
  vWall(THREE, mats, house, 3.4, -4.55, 1.3, 0, H, true);
  vWall(THREE, mats, house, 3.4, -1.85, 1.7, 0, H, true);
  vWall(THREE, mats, house, 3.4, 4.15, 2.1, 0, H, true);

  // 水平内墙
  hWall(THREE, mats, house, -3.7, -1.0, 4.6, 0, H, true);
  hWall(THREE, mats, house, -5.15, 2.0, 1.7, 0, H, true);
  hWall(THREE, mats, house, -2.15, 2.0, 1.5, 0, H, true);
  hWall(THREE, mats, house, -0.2, -2.6, 2.4, 0, H, true);
  hWall(THREE, mats, house, 2.85, -2.6, 1.1, 0, H, true);
  hWall(THREE, mats, house, 4.7, -1.0, 2.6, 0, H, true);
  hWall(THREE, mats, house, 5.55, 1.6, 1.0, 0, H, true);

  // 门套
  doorSwing(THREE, mats, house, -1.32, 0, -3.2, -0.15);
  doorSwing(THREE, mats, house, -1.32, 0, 0.45, 0.2);
  doorSwing(THREE, mats, house, 3.48, 0, -3.2, 0.25);

  // 踢脚线
  const base = mats.teak;
  house.add(box(THREE, 12.2, 0.08, 0.04, base, 0, 0.08, -5.18));
  house.add(box(THREE, 12.2, 0.08, 0.04, base, 0, 0.08, 5.18));

  // 屋檐外轮廓：只做一圈梁，不封屋顶，上帝视角能看进室内
  const eaveY = H + 0.06;
  house.add(box(THREE, 13.0, 0.1, 0.42, mats.exterior, 0, eaveY, -5.42));
  house.add(box(THREE, 13.0, 0.1, 0.42, mats.exterior, 0, eaveY, 5.42));
  house.add(box(THREE, 0.42, 0.1, 11.3, mats.exterior, -6.28, eaveY, 0));
  house.add(box(THREE, 0.42, 0.1, 11.3, mats.exterior, 6.28, eaveY, 0));
  house.add(box(THREE, 12.36, 0.08, 0.16, mats.oak, 0, H + 0.04, -5.2));
  house.add(box(THREE, 12.36, 0.08, 0.16, mats.oak, 0, H + 0.04, 5.2));
  house.add(box(THREE, 0.16, 0.08, 10.56, mats.oak, -6.0, H + 0.04, 0));
  house.add(box(THREE, 0.16, 0.08, 10.56, mats.oak, 6.0, H + 0.04, 0));

  // 阳台栏杆
  for (let x = -5.85; x <= -1.7; x += 0.28) {
    house.add(box(THREE, 0.04, 0.95, 0.04, mats.oak, x, 0.55, 5.12));
    house.add(box(THREE, 0.04, 0.95, 0.04, mats.oak, x, 0.55, 2.12));
  }
  for (let z = 2.2; z <= 5.05; z += 0.28) {
    house.add(box(THREE, 0.04, 0.95, 0.04, mats.oak, -5.95, 0.55, z));
  }
  house.add(box(THREE, 4.3, 0.04, 0.05, mats.oak, -3.75, 1.02, 5.12));
  house.add(box(THREE, 0.05, 0.04, 3.0, mats.oak, -5.95, 1.02, 3.6));

  root.add(house);
  return house;
}

function buildStudy(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(-3.7, 0, -3.1);

  const desk = new THREE.Group();
  desk.add(box(THREE, 1.55, 0.05, 0.68, mats.oak, 0, 0.74, 0));
  desk.add(box(THREE, 0.07, 0.72, 0.07, mats.oak, -0.7, 0.36, -0.26));
  desk.add(box(THREE, 0.07, 0.72, 0.07, mats.oak, 0.7, 0.36, -0.26));
  desk.add(box(THREE, 0.07, 0.72, 0.07, mats.oak, -0.7, 0.36, 0.26));
  desk.add(box(THREE, 0.07, 0.72, 0.07, mats.oak, 0.7, 0.36, 0.26));
  desk.add(box(THREE, 0.42, 0.28, 0.52, mats.teak, 0.52, 0.28, 0));
  desk.position.set(-1.35, 0, -0.15);
  desk.rotation.y = Math.PI / 2;
  mark(desk, { type: "hotspot", roomId: "study", contentIds: ["daily-tech-learning", "dayai"] });
  g.add(desk);

  const monitor = box(THREE, 0.52, 0.32, 0.03, mats.screen, -1.55, 1.05, -0.15);
  monitor.rotation.y = Math.PI / 2;
  g.add(monitor);
  g.add(box(THREE, 0.18, 0.02, 0.26, mats.metalMatte, -1.42, 0.78, -0.15));

  const lamp = new THREE.Group();
  lamp.add(box(THREE, 0.12, 0.02, 0.12, mats.metalMatte, 0, 0.01, 0));
  lamp.add(box(THREE, 0.025, 0.32, 0.025, mats.metalMatte, 0, 0.17, 0));
  lamp.add(mesh(new THREE.ConeGeometry(0.09, 0.1, 10), mats.lampShade, 0.05, 0.36, 0));
  lamp.position.set(-1.15, 0.76, 0.22);
  g.add(lamp);
  addLamp(THREE, g, -1.12, 1.12, 0.2, 0xb38950, 1.15, 4.2);

  const chair = new THREE.Group();
  chair.add(box(THREE, 0.42, 0.05, 0.42, mats.oak, 0, 0.46, 0));
  chair.add(box(THREE, 0.42, 0.38, 0.05, mats.linen, 0, 0.68, 0.2));
  chair.add(box(THREE, 0.4, 0.04, 0.4, mats.linen, 0, 0.5, 0));
  for (const [x, z] of [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]]) {
    chair.add(box(THREE, 0.04, 0.46, 0.04, mats.oak, x, 0.23, z));
  }
  chair.position.set(-0.55, 0, -0.15);
  g.add(chair);

  const shelf = new THREE.Group();
  shelf.add(box(THREE, 1.2, 1.55, 0.28, mats.teak, 0, 0.78, 0));
  for (let i = 0; i < 4; i += 1) {
    shelf.add(box(THREE, 1.12, 0.025, 0.24, mats.oak, 0, 0.28 + i * 0.36, 0.01));
  }
  for (let i = 0; i < 9; i += 1) {
    const book = box(
      THREE,
      0.08 + (i % 3) * 0.02,
      0.22,
      0.16,
      i % 2 ? mats.moss : mats.cushion,
      -0.42 + (i % 5) * 0.18,
      0.42 + Math.floor(i / 5) * 0.36,
      0,
    );
    shelf.add(book);
  }
  shelf.position.set(0.85, 0, -1.85);
  mark(shelf, { type: "hotspot", roomId: "study", contentIds: ["bear2cursor", "language-paraphrase"] });
  g.add(shelf);

  const board = box(THREE, 1.05, 0.7, 0.03, mats.plasterDark, 1.95, 1.45, -0.2);
  board.rotation.y = -Math.PI / 2;
  mark(board, { type: "hotspot", roomId: "study", contentIds: ["daily-algo"] });
  g.add(board);
  g.add(box(THREE, 0.22, 0.02, 0.16, mats.linen, -1.2, 0.775, 0.18));

  const p = plant(THREE, mats, 0.95);
  p.position.set(1.7, 0, 1.55);
  g.add(p);

  house.add(g);
}

function buildBedroom(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(-3.7, 0, 0.5);

  const bed = new THREE.Group();
  bed.add(box(THREE, 1.55, 0.22, 2.05, mats.oak, 0, 0.22, 0));
  bed.add(box(THREE, 1.48, 0.16, 1.95, mats.linen, 0, 0.38, 0));
  bed.add(box(THREE, 0.5, 0.14, 0.32, mats.linen, -0.38, 0.5, -0.78));
  bed.add(box(THREE, 0.5, 0.14, 0.32, mats.linen, 0.38, 0.5, -0.78));
  bed.add(box(THREE, 1.55, 0.55, 0.08, mats.oak, 0, 0.5, -1.02));
  bed.position.set(-0.85, 0, 0.05);
  mark(bed, { type: "hotspot", roomId: "bedroom", contentIds: ["daily-photos"] });
  g.add(bed);

  g.add(box(THREE, 0.4, 0.48, 0.4, mats.oak, -1.75, 0.24, -0.85));
  const lamp = mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.16, 10), mats.lampShade, -1.75, 0.58, -0.85);
  g.add(lamp);
  addLamp(THREE, g, -1.75, 0.78, -0.85, 0xb38950, 0.85, 3.4);

  const wardrobe = box(THREE, 1.15, 1.9, 0.48, mats.teak, 1.35, 0.95, -1.15);
  g.add(wardrobe);
  g.add(box(THREE, 0.02, 1.7, 0.01, mats.metalMatte, 1.35, 0.95, -0.9));

  const frames = new THREE.Group();
  const sizes = [
    [0.38, 0.28, 0.55, 1.55],
    [0.28, 0.36, 0.05, 1.5],
    [0.32, 0.24, -0.42, 1.62],
    [0.22, 0.22, 0.32, 1.95],
  ];
  for (const [w, h, yOff, zOff] of sizes) {
    const f = new THREE.Group();
    f.add(box(THREE, w, h, 0.03, mats.oak, 0, 0, 0));
    f.add(box(THREE, w - 0.05, h - 0.05, 0.02, mats.photo, 0, 0, 0.012));
    f.position.set(2.15, yOff, zOff - 1.4);
    f.rotation.y = -Math.PI / 2;
    frames.add(f);
  }
  mark(frames, { type: "hotspot", roomId: "bedroom", contentIds: ["daily-photos"] });
  g.add(frames);

  const cam = new THREE.Group();
  cam.add(box(THREE, 0.14, 0.08, 0.09, mats.metalMatte, 0, 0.04, 0));
  cam.add(mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 10), mats.metalMatte, 0.08, 0.04, 0));
  cam.position.set(1.55, 0.52, 0.55);
  g.add(box(THREE, 0.7, 0.48, 0.38, mats.oak, 1.55, 0.24, 0.55));
  g.add(cam);

  house.add(g);
}

function buildBalcony(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(-3.7, 0, 3.6);

  const table = box(THREE, 0.7, 0.06, 0.7, mats.oak, 0.15, 0.52, 0.1);
  g.add(table);
  g.add(box(THREE, 0.06, 0.5, 0.06, mats.oak, 0.15, 0.25, 0.1));

  const chair = (x, z, rot) => {
    const c = new THREE.Group();
    c.add(box(THREE, 0.4, 0.05, 0.4, mats.oak, 0, 0.42, 0));
    c.add(box(THREE, 0.4, 0.32, 0.04, mats.oak, 0, 0.6, 0.18));
    c.position.set(x, 0, z);
    c.rotation.y = rot;
    g.add(c);
  };
  chair(-0.45, 0.15, 0.6);
  chair(0.7, 0.35, -0.8);

  const map = box(THREE, 0.32, 0.01, 0.22, mats.moss, 0.2, 0.56, 0.08);
  mark(map, { type: "hotspot", roomId: "balcony", contentIds: ["tour-map"] });
  g.add(map);

  const tripod = new THREE.Group();
  tripod.add(box(THREE, 0.03, 0.95, 0.03, mats.metalMatte, 0, 0.48, 0));
  tripod.add(box(THREE, 0.16, 0.05, 0.1, mats.metalMatte, 0, 0.98, 0));
  tripod.position.set(-1.55, 0, 0.85);
  mark(tripod, { type: "hotspot", roomId: "balcony", contentIds: ["daily-photos"] });
  g.add(tripod);

  const p1 = plant(THREE, mats, 1.05);
  p1.position.set(-1.85, 0, -1.1);
  g.add(p1);
  const p2 = plant(THREE, mats, 0.8);
  p2.position.set(1.7, 0, 1.1);
  g.add(p2);

  house.add(g);
}

function buildLiving(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(1.0, 0, 1.3);

  const rug = box(THREE, 2.6, 0.02, 2.2, mats.rug, -0.15, 0.07, 0.15);
  g.add(rug);

  const sofa = new THREE.Group();
  sofa.add(box(THREE, 2.05, 0.38, 0.82, mats.sofa, 0, 0.32, 0));
  sofa.add(box(THREE, 2.05, 0.42, 0.16, mats.sofa, 0, 0.62, 0.34));
  sofa.add(box(THREE, 0.16, 0.42, 0.82, mats.sofa, -0.95, 0.58, 0));
  sofa.add(box(THREE, 0.16, 0.42, 0.82, mats.sofa, 0.95, 0.58, 0));
  sofa.add(box(THREE, 0.42, 0.12, 0.36, mats.cushion, -0.45, 0.58, -0.05));
  sofa.add(box(THREE, 0.42, 0.12, 0.36, mats.moss, 0.4, 0.58, -0.02));
  sofa.position.set(-0.35, 0, 1.35);
  sofa.rotation.y = Math.PI;
  mark(sofa, { type: "hotspot", roomId: "living", contentIds: ["daily-lyric-learning"] });
  g.add(sofa);

  const table = box(THREE, 0.95, 0.06, 0.55, mats.oak, -0.3, 0.32, 0.25);
  g.add(table);
  g.add(box(THREE, 0.06, 0.3, 0.06, mats.oak, -0.65, 0.15, 0.05));
  g.add(box(THREE, 0.06, 0.3, 0.06, mats.oak, 0.05, 0.15, 0.05));
  g.add(box(THREE, 0.06, 0.3, 0.06, mats.oak, -0.65, 0.15, 0.45));
  g.add(box(THREE, 0.06, 0.3, 0.06, mats.oak, 0.05, 0.15, 0.45));

  const player = new THREE.Group();
  player.add(box(THREE, 0.42, 0.08, 0.42, mats.teak, 0, 0.04, 0));
  player.add(mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.02, 20), mats.metalMatte, 0, 0.09, 0));
  player.position.set(-1.55, 0.48, -0.15);
  g.add(box(THREE, 1.15, 0.42, 0.38, mats.oak, -1.55, 0.21, -0.15));
  mark(player, { type: "hotspot", roomId: "living", contentIds: ["daily-lyric-learning"] });
  g.add(player);

  const speakerL = box(THREE, 0.22, 0.55, 0.2, mats.teak, -2.05, 0.35, 1.55);
  const speakerR = box(THREE, 0.22, 0.55, 0.2, mats.teak, 0.95, 0.35, 1.55);
  g.add(speakerL);
  g.add(speakerR);

  const tv = new THREE.Group();
  tv.add(box(THREE, 1.35, 0.72, 0.05, mats.screen, 0, 0.55, 0));
  tv.add(box(THREE, 1.5, 0.38, 0.36, mats.oak, 0, 0.19, 0.05));
  tv.position.set(-0.2, 0, -1.85);
  mark(tv, { type: "hotspot", roomId: "living", contentIds: ["bilibili-workshow", "drama-analysis"] });
  g.add(tv);

  const floorLamp = new THREE.Group();
  floorLamp.add(box(THREE, 0.22, 0.03, 0.22, mats.metalMatte, 0, 0.02, 0));
  floorLamp.add(box(THREE, 0.03, 1.45, 0.03, mats.metalMatte, 0, 0.74, 0));
  floorLamp.add(mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.2, 12), mats.lampShade, 0, 1.55, 0));
  floorLamp.position.set(1.55, 0, 1.7);
  g.add(floorLamp);
  addLamp(THREE, g, 1.55, 1.5, 1.7, 0xb38950, 1.05, 5.2);

  const p = plant(THREE, mats, 1.15);
  p.position.set(1.7, 0, -2.0);
  g.add(p);

  house.add(g);
}

function buildKitchen(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(4.7, 0, 3.4);

  g.add(box(THREE, 2.35, 0.88, 0.58, mats.teak, 0, 0.44, 1.35));
  g.add(box(THREE, 2.35, 0.04, 0.6, mats.oak, 0, 0.9, 1.35));
  g.add(box(THREE, 0.58, 0.88, 2.1, mats.teak, 0.88, 0.44, 0.2));
  g.add(box(THREE, 0.6, 0.04, 2.1, mats.oak, 0.88, 0.9, 0.2));
  g.add(box(THREE, 1.6, 0.7, 0.32, mats.teak, -0.2, 1.85, 1.38));

  g.add(box(THREE, 0.42, 0.04, 0.38, mats.metalMatte, -0.55, 0.93, 1.35));
  g.add(box(THREE, 0.36, 0.06, 0.36, mats.metalMatte, 0.35, 0.94, 1.35));
  g.add(box(THREE, 0.58, 1.55, 0.55, mats.plasterDark, 0.88, 0.78, -1.15));

  mark(g, { type: "room", roomId: "kitchen" });
  addLamp(THREE, g, 0.1, 1.55, 0.8, 0xb38950, 0.7, 3.6);
  house.add(g);
}

function buildDining(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(4.7, 0, 0.3);

  const table = box(THREE, 1.15, 0.06, 0.75, mats.oak, 0, 0.74, 0);
  mark(table, { type: "hotspot", roomId: "dining", contentIds: ["audio-workshop"] });
  g.add(table);
  g.add(box(THREE, 0.08, 0.72, 0.08, mats.oak, -0.45, 0.36, -0.28));
  g.add(box(THREE, 0.08, 0.72, 0.08, mats.oak, 0.45, 0.36, -0.28));
  g.add(box(THREE, 0.08, 0.72, 0.08, mats.oak, -0.45, 0.36, 0.28));
  g.add(box(THREE, 0.08, 0.72, 0.08, mats.oak, 0.45, 0.36, 0.28));

  const chair = (x, z, rot) => {
    const c = new THREE.Group();
    c.add(box(THREE, 0.38, 0.05, 0.38, mats.oak, 0, 0.46, 0));
    c.add(box(THREE, 0.38, 0.36, 0.04, mats.oak, 0, 0.66, 0.17));
    c.position.set(x, 0, z);
    c.rotation.y = rot;
    g.add(c);
  };
  chair(0, 0.62, Math.PI);
  chair(0, -0.62, 0);

  g.add(box(THREE, 0.12, 0.03, 0.1, mats.metalMatte, 0.22, 0.79, 0.08));
  g.add(mesh(new THREE.CylinderGeometry(0.045, 0.035, 0.08, 10), mats.oak, -0.18, 0.8, -0.05));

  const pendant = mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.12, 12), mats.lampShade, 0, 1.85, 0);
  g.add(pendant);
  g.add(box(THREE, 0.015, 0.55, 0.015, mats.metalMatte, 0, 2.2, 0));
  addLamp(THREE, g, 0, 1.75, 0, 0xb38950, 0.95, 4.0);

  house.add(g);
}

function buildBath(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(4.7, 0, -3.1);

  g.add(box(THREE, 1.05, 0.78, 0.48, mats.oak, 0.55, 0.39, -1.55));
  g.add(box(THREE, 0.32, 0.06, 0.32, mats.stone, 0.55, 0.82, -1.55));
  const mirror = box(THREE, 0.7, 0.55, 0.02, mats.glass, 0.55, 1.45, -1.72);
  mirror.material = mats.glass.clone();
  mirror.material.opacity = 0.35;
  mirror.material.roughness = 0.55;
  g.add(mirror);

  g.add(mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.4, 12), mats.stone, -0.55, 0.22, -1.35));
  g.add(box(THREE, 0.95, 1.95, 0.04, mats.glass, 0.7, 0.98, 0.55));
  g.add(box(THREE, 0.04, 1.95, 1.15, mats.oak, 0.22, 0.98, 0.55));
  g.add(box(THREE, 0.28, 0.62, 0.08, mats.linen, -0.85, 0.9, -0.4));

  mark(g, { type: "room", roomId: "bath" });
  addLamp(THREE, g, 0.2, 2.1, -0.4, 0xb38950, 0.45, 3.2);
  house.add(g);
}

function buildHall(THREE, house, mats) {
  const g = new THREE.Group();
  g.position.set(1.0, 0, -3.9);
  g.add(box(THREE, 1.15, 0.72, 0.36, mats.teak, -1.35, 0.36, -0.85));
  g.add(box(THREE, 0.7, 0.08, 0.28, mats.oak, 1.4, 0.92, -0.9));
  g.add(box(THREE, 0.04, 0.7, 0.04, mats.oak, 1.15, 0.55, -0.9));
  g.add(box(THREE, 0.04, 0.7, 0.04, mats.oak, 1.65, 0.55, -0.9));
  const p = plant(THREE, mats, 0.75);
  p.position.set(1.85, 0, 0.55);
  g.add(p);
  mark(g, { type: "room", roomId: "hall" });
  addLamp(THREE, g, 0.2, 2.15, 0, 0xb38950, 0.55, 3.8);
  house.add(g);
}

export function createCharacter(THREE, mats) {
  const g = new THREE.Group();
  g.name = "resident";
  g.add(mesh(new THREE.SphereGeometry(0.09, 10, 8), mats.oak, 0, 1.52, 0));
  g.add(mesh(new THREE.CapsuleGeometry(0.13, 0.42, 6, 10), mats.linen, 0, 1.12, 0));
  g.add(mesh(new THREE.CapsuleGeometry(0.045, 0.32, 4, 6), mats.linen, -0.16, 1.08, 0));
  g.add(mesh(new THREE.CapsuleGeometry(0.045, 0.32, 4, 6), mats.linen, 0.16, 1.08, 0));
  g.add(mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 6), mats.teak, -0.07, 0.45, 0));
  g.add(mesh(new THREE.CapsuleGeometry(0.05, 0.38, 4, 6), mats.teak, 0.07, 0.45, 0));
  const glow = new THREE.PointLight(0xb38950, 0.35, 2.2, 2);
  glow.position.set(0, 1.2, 0);
  g.add(glow);
  g.position.set(-3.55, 0, 0.4);
  return g;
}

export function createPathLine(THREE, points) {
  const curve = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.15);
  const spaced = curve.getPoints(160);
  const geo = new THREE.BufferGeometry().setFromPoints(spaced);
  const mat = new THREE.LineDashedMaterial({
    color: 0x6a5840,
    dashSize: 0.18,
    gapSize: 0.12,
    transparent: true,
    opacity: 0.55,
  });
  const line = new THREE.Line(geo, mat);
  line.computeLineDistances();
  line.position.y = 0.08;
  line.name = "day-path";
  return { line, curve };
}

export function createWorld(THREE) {
  const root = new THREE.Group();
  const mats = createMaterials(THREE);
  buildExterior(THREE, root, mats);
  const house = buildStructure(THREE, root, mats);
  buildStudy(THREE, house, mats);
  buildBedroom(THREE, house, mats);
  buildBalcony(THREE, house, mats);
  buildLiving(THREE, house, mats);
  buildKitchen(THREE, house, mats);
  buildDining(THREE, house, mats);
  buildBath(THREE, house, mats);
  buildHall(THREE, house, mats);
  const character = createCharacter(THREE, mats);
  root.add(character);
  return { root, mats, house, character };
}

export function createLights(THREE, scene) {
  const hemi = new THREE.HemisphereLight(0x2a3a58, 0x1a140e, 0.42);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x1a2438, 0.18);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0x6a5a48, 0.38);
  sun.position.set(-14, 9.5, 4.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.bias = -0.00035;
  sun.shadow.intensity = 0.72;
  scene.add(sun);

  const skyFill = new THREE.DirectionalLight(0x3a4a68, 0.22);
  skyFill.position.set(6, 16, -4);
  scene.add(skyFill);

  const westGlow = new THREE.DirectionalLight(0x4a3a30, 0.16);
  westGlow.position.set(-10, 3.2, 2);
  scene.add(westGlow);
}

export function createSky(THREE) {
  const geo = new THREE.SphereGeometry(42, 32, 20);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {},
    vertexShader: `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vDir;
      void main() {
        vec3 zenith = vec3(0.035, 0.055, 0.10);
        vec3 horizon = vec3(0.07, 0.085, 0.13);
        vec3 west = vec3(0.20, 0.12, 0.08);
        float h = vDir.y;
        vec3 col = mix(horizon, zenith, smoothstep(-0.12, 0.72, h));
        float w = pow(max(dot(normalize(vDir), normalize(vec3(-1.0, 0.12, 0.18))), 0.0), 3.4);
        col += west * w * 0.42;
        float ground = smoothstep(0.02, -0.25, h);
        col = mix(col, vec3(0.04, 0.035, 0.03), ground);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  return new THREE.Mesh(geo, mat);
}
