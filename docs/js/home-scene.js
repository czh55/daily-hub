/**
 * 个人生活空间 · 3D 居家场景
 * 蓝调时刻 · 实木低亮度 · 一日动线导览
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ===== 房间与内容配置（动线 = 一日生活） =====
export const LIFE_PATH = [
  {
    id: 'bedroom',
    time: '07:00',
    label: '晨起',
    name: '卧室',
    mood: '晨光尚未完全驱散夜的余温，木质床头与低垂的窗帘框住一段安静的苏醒时刻。',
    position: { x: -5, y: 0, z: -4 },
    cameraOffset: { x: -5, y: 8, z: -2 },
    lookAt: { x: -5, y: 0, z: -4 },
    contents: [
      {
        emoji: '🐻',
        title: 'Bear2Cursor',
        desc: '知识世界旅行 · Bear 笔记迁移与知识库漫游',
        url: 'https://chenzhiheng.cn/bear2cursor/',
      },
    ],
  },
  {
    id: 'kitchen',
    time: '08:00',
    label: '早餐',
    name: '厨房',
    mood: '灶台边的水汽与木台面的纹理，是工作日清晨最踏实的仪式感。',
    position: { x: 6, y: 0, z: 2 },
    cameraOffset: { x: 6, y: 7, z: 4 },
    lookAt: { x: 6, y: 0, z: 2 },
    contents: [
      {
        emoji: '✍️',
        title: 'Language Paraphrase',
        desc: '场景式英语学习墙 · 语言改写练习',
        url: 'https://chenzhiheng.cn/language_paraphrase/',
      },
    ],
  },
  {
    id: 'study',
    time: '09:30',
    label: '专注',
    name: '书房',
    mood: '实木书桌、显示器与堆叠的笔记，互联网研发者的日常战场。',
    position: { x: -5, y: 0, z: 4 },
    cameraOffset: { x: -5, y: 7, z: 6 },
    lookAt: { x: -5, y: 0, z: 4 },
    contents: [
      {
        emoji: '🧮',
        title: 'Daily Algo',
        desc: '每日算法练习 · 变量语义法',
        url: 'https://chenzhiheng.cn/daily-algo/',
      },
      {
        emoji: '💻',
        title: 'Daily Tech Learning',
        desc: '每日技术深度总结 · AI 增量知识库',
        url: 'https://chenzhiheng.cn/daily-tech-learning/',
      },
      {
        emoji: '🤖',
        title: 'DayAI',
        desc: '每日 AI 资讯总结与实践记录',
        url: 'https://chenzhiheng.cn/DayAI/',
      },
    ],
  },
  {
    id: 'living',
    time: '14:00',
    label: '午后',
    name: '客厅',
    mood: '沙发陷落的角度刚好，音响与屏幕在低光中等待被唤醒。',
    position: { x: 2, y: 0, z: 0 },
    cameraOffset: { x: 2, y: 8, z: 3 },
    lookAt: { x: 2, y: 0, z: 0 },
    contents: [
      {
        emoji: '🎵',
        title: 'Daily Lyric Learning',
        desc: '每日英文歌词学习 · 音乐分享',
        url: 'https://chenzhiheng.cn/daily-lyric-learning/',
      },
      {
        emoji: '📺',
        title: 'Bilibili Workshow',
        desc: 'B 站 / 小红书视频观看总结墙',
        url: 'https://chenzhiheng.cn/bilibili-workshow/',
      },
      {
        emoji: '🎭',
        title: 'Drama Analysis',
        desc: '剧集剧情总结墙 · 影视戏剧分析',
        url: 'https://chenzhiheng.cn/drama-analysis/',
      },
    ],
  },
  {
    id: 'reading',
    time: '17:00',
    label: '阅读',
    name: '阅读角',
    mood: '窗边的单人椅与落地灯，播客与书籍在黄昏前交换灵感。',
    position: { x: 0, y: 0, z: -5 },
    cameraOffset: { x: 0, y: 6, z: -3 },
    lookAt: { x: 0, y: 0, z: -5 },
    contents: [
      {
        emoji: '🎧',
        title: 'Audio Workshop',
        desc: '播客知识墙 · 音频工作坊',
        url: 'https://chenzhiheng.cn/audio-workshop/',
      },
    ],
  },
  {
    id: 'balcony',
    time: '18:30',
    label: '蓝调',
    name: '阳台',
    mood: '蓝调时刻的光线从玻璃渗入，相机与城市的轮廓一同沉入暮色。',
    position: { x: 0, y: 0, z: -9 },
    cameraOffset: { x: 0, y: 6, z: -7 },
    lookAt: { x: 0, y: 0, z: -9 },
    contents: [
      {
        emoji: '📷',
        title: 'Daily Photos',
        desc: '每日摄影作品 · 光影记录',
        url: 'https://chenzhiheng.cn/daily-photos/',
      },
    ],
  },
  {
    id: 'travel',
    time: '20:00',
    label: '规划',
    name: '旅行角',
    mood: '墙上的地图与桌上的行程本，下一次出发在灯光下悄然成形。',
    position: { x: 8, y: 0, z: -3 },
    cameraOffset: { x: 8, y: 7, z: -1 },
    lookAt: { x: 8, y: 0, z: -3 },
    contents: [
      {
        emoji: '🗺️',
        title: 'Tour Map',
        desc: '旅行攻略 · 世界地图与行程规划',
        url: 'https://chenzhiheng.cn/tour_map/',
      },
    ],
  },
];

// ===== 材质工厂：低亮度实木 =====
function createWoodMaterial(hue = 0.08, sat = 0.25, lightness = 0.18) {
  const color = new THREE.Color();
  color.setHSL(hue, sat, lightness);
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0.02,
  });
}

function createWallMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.06, 0.12, 0.14),
    roughness: 0.95,
    metalness: 0.0,
  });
}

function createFloorMaterial() {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.07, 0.2, 0.12),
    roughness: 0.9,
    metalness: 0.02,
  });
}

function createFabricMaterial(lightness = 0.15) {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color().setHSL(0.05, 0.08, lightness),
    roughness: 0.98,
    metalness: 0.0,
  });
}

// ===== 场景构建 =====
export class HomeScene {
  constructor(container) {
    this.container = container;
    this.roomMeshes = {};
    this.currentRoomIndex = -1;
    this.isTouring = false;
    this.cameraAnimating = false;

  this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1520);
    this.scene.fog = new THREE.FogExp2(0x1a2744, 0.014);

    this.camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    // 上帝视角默认位置
    this.godViewPosition = new THREE.Vector3(2, 22, 14);
    this.godViewTarget = new THREE.Vector3(2, 0, 0);
    this.camera.position.copy(this.godViewPosition);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.82;
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(this.godViewTarget);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2.1;
    this.controls.minDistance = 4;
    this.controls.maxDistance = 35;
    this.controls.update();

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clickableMeshes = [];

    this._setupLights();
    this._buildHouse();
    this._buildExterior();

    window.addEventListener('resize', () => this._onResize());
    this.renderer.domElement.addEventListener('click', (e) => this._onClick(e));
    this.renderer.domElement.addEventListener('mousemove', (e) => this._onMouseMove(e));
  }

  _setupLights() {
    // 蓝调时刻环境光（保持低亮度但可辨识轮廓）
    const ambient = new THREE.AmbientLight(0x4a6a8a, 0.48);
    this.scene.add(ambient);

    // 窗外暮色（冷蓝）
    const twilight = new THREE.DirectionalLight(0x6b8cae, 0.55);
    twilight.position.set(-8, 12, -10);
    twilight.castShadow = true;
    twilight.shadow.mapSize.set(1024, 1024);
    twilight.shadow.camera.near = 1;
    twilight.shadow.camera.far = 50;
    twilight.shadow.camera.left = -20;
    twilight.shadow.camera.right = 20;
    twilight.shadow.camera.top = 20;
    twilight.shadow.camera.bottom = -20;
    this.scene.add(twilight);

    // 室内暖光（极低亮度，无强反光）
    const warm1 = new THREE.PointLight(0x6b5535, 0.32, 14);
    warm1.position.set(2, 3, 0);
    this.scene.add(warm1);

    const warm2 = new THREE.PointLight(0x5a4a35, 0.2, 10);
    warm2.position.set(-5, 2.5, 4);
    this.scene.add(warm2);

    const warm3 = new THREE.PointLight(0x4a5a6a, 0.15, 8);
    warm3.position.set(0, 2, -5);
    this.scene.add(warm3);

    // 阳台蓝调补光（强化蓝调时刻氛围）
    const balconyLight = new THREE.PointLight(0x5a7aaa, 0.45, 18);
    balconyLight.position.set(0, 2, -9);
    this.scene.add(balconyLight);
  }

  _addBox(w, h, d, x, y, z, material, parent, castShadow = true) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  _buildRoom(x, z, w, d, roomId, label) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    this.scene.add(group);

    const floorMat = createFloorMaterial();
    const wallMat = createWallMaterial();
    const woodMat = createWoodMaterial();
    const woodDark = createWoodMaterial(0.06, 0.2, 0.12);
    const fabricMat = createFabricMaterial();

    // 地板
    this._addBox(w, 0.08, d, 0, 0, 0, floorMat, group);

    // 墙壁（三面，开口朝连接处）
    const wallH = 3.2;
    this._addBox(w, wallH, 0.12, 0, 0, -d / 2, wallMat, group);
    this._addBox(0.12, wallH, d, -w / 2, 0, 0, wallMat, group);
    this._addBox(0.12, wallH, d, w / 2, 0, 0, wallMat, group);

    // 房间标识平面（可点击）
    const zoneGeo = new THREE.BoxGeometry(w - 0.3, 0.05, d - 0.3);
    const zoneMat = new THREE.MeshStandardMaterial({
      color: 0x2a3a50,
      transparent: true,
      opacity: 0.0,
      roughness: 1,
    });
    const zone = new THREE.Mesh(zoneGeo, zoneMat);
    zone.position.set(0, 0.1, 0);
    zone.userData = { roomId, label };
    group.add(zone);
    this.clickableMeshes.push(zone);
    this.roomMeshes[roomId] = zone;

    return { group, woodMat, woodDark, fabricMat, w, d };
  }

  _buildHouse() {
    // 卧室 (-5, -4) 5x4
    const bedroom = this._buildRoom(-5, -4, 5, 4, 'bedroom', '卧室');
    this._addBox(2, 0.4, 1.8, 0, 0, -0.5, bedroom.woodMat, bedroom.group);
    this._addBox(0.15, 0.6, 1.8, -0.8, 0.2, -0.5, bedroom.woodDark, bedroom.group);
    this._addBox(0.8, 0.5, 0.6, 1.2, 0, 0.8, bedroom.woodMat, bedroom.group);

    // 书房 (-5, 4) 5x4
    const study = this._buildRoom(-5, 4, 5, 4, 'study', '书房');
    this._addBox(1.8, 0.75, 0.9, 0, 0, 0, study.woodMat, study.group);
    this._addBox(0.6, 0.5, 0.4, 0, 0.75, 0, study.woodDark, study.group);
    this._addBox(0.5, 1.2, 0.08, -1.5, 0, -1, study.woodDark, study.group);
    this._addBox(0.4, 0.6, 0.4, 1.5, 0, 1, study.woodMat, study.group);

    // 客厅 (2, 0) 6x5
    const living = this._buildRoom(2, 0, 6, 5, 'living', '客厅');
    this._addBox(2.2, 0.45, 0.9, -1, 0, 0.5, living.fabricMat, living.group);
    this._addBox(0.15, 0.5, 0.9, -2, 0.225, 0.5, living.woodDark, living.group);
    this._addBox(0.8, 0.35, 0.5, 1.5, 0, -1, living.woodMat, living.group);
    this._addBox(2, 0.08, 0.6, 0.5, 0.5, -1.5, living.woodDark, living.group);
    this._addBox(0.3, 0.6, 0.3, 2, 0, 1.5, living.woodMat, living.group);

    // 厨房 (6, 2) 4x3
    const kitchen = this._buildRoom(6, 2, 4, 3, 'kitchen', '厨房');
    this._addBox(2, 0.9, 0.6, 0, 0, 0, kitchen.woodMat, kitchen.group);
    this._addBox(0.5, 0.8, 0.5, -1, 0, 0.8, kitchen.woodDark, kitchen.group);

    // 阅读角 (0, -5) 4x3
    const reading = this._buildRoom(0, -5, 4, 3, 'reading', '阅读角');
    this._addBox(0.9, 0.5, 0.9, 0, 0, 0, reading.fabricMat, reading.group);
    this._addBox(0.12, 1.8, 0.12, -1.2, 0, 0.8, reading.woodDark, reading.group);
    this._addBox(0.5, 0.6, 0.4, 1, 0, -0.5, reading.woodMat, reading.group);

    // 阳台 (0, -9) 5x2.5
    const balcony = this._buildRoom(0, -9, 5, 2.5, 'balcony', '阳台');
    this._addBox(0.12, 2.5, 2.5, 0, 0, -1.2, createWallMaterial(), balcony.group);
    this._addBox(0.3, 0.4, 0.25, 0.5, 0, 0.3, balcony.woodMat, balcony.group);

    // 旅行角 (8, -3) 3x3
    const travel = this._buildRoom(8, -3, 3, 3, 'travel', '旅行角');
    this._addBox(1.2, 0.7, 0.5, 0, 0, 0, travel.woodMat, travel.group);
    this._addBox(0.08, 1.2, 0.8, -1, 0.7, -0.8, travel.woodDark, travel.group);
    this._addBox(0.6, 0.5, 0.4, 0.8, 0, 0.8, travel.woodMat, travel.group);

    // 走廊连接地面
    const corridorMat = createFloorMaterial();
    const corridorGroup = new THREE.Group();
    this.scene.add(corridorGroup);
    this._addBox(3, 0.08, 8, -5, 0, 0, corridorMat, corridorGroup);
    this._addBox(8, 0.08, 3, 0, 0, -6.5, corridorMat, corridorGroup);
    this._addBox(4, 0.08, 3, 5, 0, 0, corridorMat, corridorGroup);
  }

  _buildExterior() {
    const extGroup = new THREE.Group();
    this.scene.add(extGroup);

  const groundMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.08, 0.15, 0.08),
      roughness: 0.95,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 60),
      groundMat
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.05;
    ground.receiveShadow = true;
    extGroup.add(ground);

    // 外墙轮廓（上帝视角可见）
    const extWallMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.06, 0.1, 0.11),
      roughness: 0.95,
      metalness: 0.0,
    });

    const houseW = 22;
    const houseD = 18;
    const wallH = 3.5;

    // 四面外墙（略高出室内）
    this._addBox(houseW, wallH, 0.2, 2, 0, -11, extWallMat, extGroup);
    this._addBox(houseW, wallH, 0.2, 2, 0, 7, extWallMat, extGroup);
    this._addBox(0.2, wallH, houseD, -10, 0, -2, extWallMat, extGroup);
    this._addBox(0.2, wallH, houseD, 10, 0, -2, extWallMat, extGroup);

    // 屋顶（低亮度平顶，上帝视角主要可见）
    const roofMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.05, 0.08, 0.1),
      roughness: 0.95,
      metalness: 0.0,
    });
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(houseW + 0.4, 0.15, houseD + 0.4),
      roofMat
    );
    roof.position.set(2, 3.6, -2);
    roof.receiveShadow = true;
    extGroup.add(roof);

    // 远山剪影（蓝调氛围）
    const hillMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(0.12, 0.2, 0.12),
      roughness: 1,
    });
    for (let i = 0; i < 5; i++) {
      const hill = new THREE.Mesh(
        new THREE.ConeGeometry(8 + i * 3, 6 + i * 2, 6),
        hillMat
      );
      hill.position.set(-20 + i * 10, 2, -25 - i * 3);
      extGroup.add(hill);
    }
  }

  _onResize() {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  _onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickableMeshes);
    this.renderer.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default';
  }

  _onClick(event) {
    if (this.cameraAnimating || this.isTouring) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const hits = this.raycaster.intersectObjects(this.clickableMeshes);
    if (hits.length > 0) {
      const roomId = hits[0].object.userData.roomId;
      const index = LIFE_PATH.findIndex((r) => r.id === roomId);
      if (index >= 0) {
        this.focusRoom(index);
      }
    }
  }

  focusRoom(index, onComplete) {
    const room = LIFE_PATH[index];
    if (!room) return;

    this.currentRoomIndex = index;
    this.cameraAnimating = true;

    const targetPos = new THREE.Vector3(
      room.cameraOffset.x,
      room.cameraOffset.y,
      room.cameraOffset.z
    );
    const targetLook = new THREE.Vector3(
      room.lookAt.x,
      room.lookAt.y,
      room.lookAt.z
    );

    this._animateCamera(targetPos, targetLook, 1200, () => {
      this.cameraAnimating = false;
      if (onComplete) onComplete();
    });

    if (this.onRoomChange) {
      this.onRoomChange(room, index);
    }
  }

  resetGodView() {
    this.currentRoomIndex = -1;
    this.cameraAnimating = true;
    this._animateCamera(
      this.godViewPosition.clone(),
      this.godViewTarget.clone(),
      1500,
      () => {
        this.cameraAnimating = false;
      }
    );
    if (this.onRoomChange) {
      this.onRoomChange(null, -1);
    }
  }

  startTour(onStep) {
    if (this.isTouring) return;
    this.isTouring = true;
    let step = 0;

    const next = () => {
      if (step >= LIFE_PATH.length) {
        this.isTouring = false;
        this.resetGodView();
        return;
      }
      this.focusRoom(step, () => {
        if (onStep) onStep(step);
        step++;
        setTimeout(next, 2800);
      });
    };
    next();
  }

  _animateCamera(targetPos, targetLook, duration, onComplete) {
    const startPos = this.camera.position.clone();
    const startTarget = this.controls.target.clone();
    const startTime = performance.now();

    const tick = () => {
      const elapsed = performance.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      this.camera.position.lerpVectors(startPos, targetPos, ease);
      this.controls.target.lerpVectors(startTarget, targetLook, ease);
      this.controls.update();

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        if (onComplete) onComplete();
      }
    };
    tick();
  }

  animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
