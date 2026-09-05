import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from "three/addons/renderers/CSS2DRenderer.js";
import {
  AUTHOR,
  CONTENTS,
  DAY_STOPS,
  GOD_VIEW,
  ROOM_CAMERAS,
  ROOMS,
} from "./config.js";
import { createLightRig } from "./lighting.js";
import { createPathLine, createSky, createWorld } from "./world.js";

const $ = (id) => document.getElementById(id);

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function lerpVec(a, b, t) {
  return a.clone().lerp(b, t);
}

async function loadFeed() {
  try {
    const res = await fetch("./feed.json", { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function snippetsFromFeed(feed) {
  const map = {};
  if (!feed?.pages) return map;
  for (const page of feed.pages) {
    map[page.id] = page.snippet || page.description || "";
  }
  return map;
}

class Home {
  constructor() {
    this.feedSnippets = {};
    this.mode = "god";
    this.tourIndex = -1;
    this.tourPlaying = false;
    this.camAnim = null;
    this.walk = null;
    this.hover = null;
    this.pointer = new THREE.Vector2();
    this.down = new THREE.Vector2();
    this.clock = new THREE.Clock();
  }

  fail(message) {
    $("loader").style.display = "none";
    const msg = $("fallback-msg");
    if (msg) msg.textContent = message;
    $("fallback").style.display = "flex";
  }

  async start() {
    if (!window.WebGLRenderingContext) {
      this.fail("这所房子需要 WebGL 才能走进去。");
      return;
    }

    try {
      this.buildScene();
    } catch (err) {
      console.error(err);
      this.fail("房子还没搭起来，先看卡片目录。");
      return;
    }

    const feed = await loadFeed();
    this.feedSnippets = snippetsFromFeed(feed);
    this.buildHud();
    this.bind();
    this.placeCharacter(DAY_STOPS[10].stand);
    this.setMoment("下午 · 蓝调时刻");
    this.highlightStop(10, false);
    this.loop();
    requestAnimationFrame(() => $("loader").classList.add("is-done"));
    setTimeout(() => $("hint").classList.add("is-gone"), 7000);
  }

  buildScene() {
    const wrap = $("canvas-wrap");
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x101820, 34, 64);
    this.scene.add(createSky(THREE));

    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 80);
    this.camera.position.set(...GOD_VIEW.position);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h);
    this.renderer.setClearColor(0x0a1018, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NoToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    wrap.appendChild(this.renderer.domElement);

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(w, h);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.inset = "0";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    wrap.appendChild(this.labelRenderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(...GOD_VIEW.target);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 4.5;
    this.controls.maxDistance = 28;
    this.controls.minPolarAngle = 0.16;
    this.controls.maxPolarAngle = 1.12;
    this.controls.enablePan = false;
    this.controls.update();

    const world = createWorld(THREE);
    this.world = world;
    this.scene.add(world.root);
    this.character = world.character;
    this.lights = createLightRig(THREE, this.scene, world);

    const pathPts = this.fullPathPoints();
    const path = createPathLine(THREE, pathPts);
    this.pathCurve = path.curve;
    this.scene.add(path.line);

    this.raycaster = new THREE.Raycaster();
    this.addRoomLabels();
  }

  addRoomLabels() {
    this.labels = [];
    for (const room of Object.values(ROOMS)) {
      if (room.id === "hall") continue;
      const el = document.createElement("div");
      el.className = "label3d";
      el.textContent = room.name;
      const obj = new CSS2DObject(el);
      obj.position.set(room.bounds.x, 2.05, room.bounds.z);
      this.scene.add(obj);
      this.labels.push({ el, roomId: room.id });
    }
  }

  fullPathPoints() {
    const pts = [];
    let last = null;
    for (const stop of DAY_STOPS) {
      for (const [x, z] of stop.via) {
        const p = new THREE.Vector3(x, 0.02, z);
        if (!last || last.distanceTo(p) > 0.05) pts.push(p);
        last = p;
      }
      const stand = new THREE.Vector3(stop.stand[0], 0.02, stop.stand[1]);
      if (!last || last.distanceTo(stand) > 0.05) pts.push(stand);
      last = stand;
    }
    return pts;
  }

  buildHud() {
    const box = $("stops");
    box.innerHTML = "";
    DAY_STOPS.forEach((stop, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "stop";
      btn.dataset.index = String(i);
      btn.innerHTML = `<span class="t">${stop.time}</span><span class="n">${stop.title}</span>`;
      btn.addEventListener("click", () => this.goStop(i, true));
      box.appendChild(btn);
    });
  }

  bind() {
    $("btn-god").addEventListener("click", () => this.toGod());
    $("btn-tour").addEventListener("click", () => this.toggleTour());
    $("panel-close").addEventListener("click", () => this.closePanel());
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.toGod();
      if (e.key === " ") {
        e.preventDefault();
        this.toggleTour();
      }
    });

    const el = this.renderer.domElement;
    el.addEventListener("pointermove", (e) => this.onMove(e));
    el.addEventListener("pointerdown", (e) => {
      this.down.set(e.clientX, e.clientY);
    });
    el.addEventListener("pointerup", (e) => this.onUp(e));
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.labelRenderer.setSize(w, h);
  }

  screenPointer(e) {
    this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  pick(e) {
    this.screenPointer(e);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.world.house.children, true);
    for (const hit of hits) {
      let obj = hit.object;
      while (obj) {
        if (obj.userData?.clickable && (obj.userData.roomId || obj.userData.type)) {
          return obj;
        }
        obj = obj.parent;
      }
    }
    return null;
  }

  onMove(e) {
    const obj = this.pick(e);
    if (this.hover && this.hover !== obj) this.setHover(this.hover, false);
    if (obj) this.setHover(obj, true);
    this.hover = obj;
    this.renderer.domElement.style.cursor = obj ? "pointer" : "grab";
  }

  setHover(obj, on) {
    obj.traverse((c) => {
      if (!c.isMesh || !c.material) return;
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      for (const m of mats) {
        if (!m.emissive) continue;
        if (on) {
          if (m.userData._em == null) m.userData._em = m.emissive.getHex();
          m.emissive.setHex(0x2a2014);
          m.emissiveIntensity = Math.max(m.emissiveIntensity || 0, 0.22);
        } else if (m.userData._em != null) {
          m.emissive.setHex(m.userData._em);
        }
      }
    });
    const roomId = obj.userData.roomId;
    for (const label of this.labels) {
      label.el.classList.toggle("is-hot", on && label.roomId === roomId);
    }
  }

  onUp(e) {
    const dx = e.clientX - this.down.x;
    const dy = e.clientY - this.down.y;
    if (dx * dx + dy * dy > 16) return;
    const obj = this.pick(e);
    if (!obj) return;
    this.tourPlaying = false;
    $("btn-tour").classList.remove("is-on");
    this.enterRoom(obj.userData.roomId, obj.userData.contentIds);
  }

  enterRoom(roomId, contentIds) {
    const cam = ROOM_CAMERAS[roomId];
    if (!cam) return;
    this.mode = "room";
    $("btn-god").classList.remove("is-on");
    this.animateCamera(cam.position, cam.target, 1.15);
    this.lights.play("room", roomId, 1.15);
    const stop = DAY_STOPS.find((s) => s.roomId === roomId && (contentIds?.length ? contentIds.some((id) => s.contentIds.includes(id)) : true))
      || DAY_STOPS.find((s) => s.roomId === roomId);
    const ids = contentIds?.length ? contentIds : this.contentsForRoom(roomId);
    if (stop) {
      this.placeCharacter(stop.stand);
      this.openPanel(stop, ids);
      const idx = DAY_STOPS.indexOf(stop);
      this.highlightStop(idx, false);
    } else {
      this.openPanel({
        time: "",
        title: ROOMS[roomId].name,
        roomId,
        narrative: ROOMS[roomId].life,
        contentIds: ids,
      }, ids);
    }
  }

  contentsForRoom(roomId) {
    return Object.values(CONTENTS)
      .filter((c) => c.rooms.includes(roomId))
      .map((c) => c.id);
  }

  toGod() {
    this.mode = "god";
    this.tourPlaying = false;
    this.tourIndex = -1;
    $("btn-god").classList.add("is-on");
    $("btn-tour").classList.remove("is-on");
    this.animateCamera(GOD_VIEW.position, GOD_VIEW.target, 1.25);
    this.lights.play("god", null, 1.25);
    this.placeCharacter(DAY_STOPS[10].stand);
    this.setMoment("下午 · 蓝调时刻");
    $("tl-now").textContent = "17:40 · 蓝调";
    $("tl-desc").textContent = "默认停在下午，房子内外都被最后一层天光看见。";
    $("panel").classList.remove("is-open");
    this.highlightStop(10, false);
  }

  toggleTour() {
    if (this.tourPlaying) {
      this.tourPlaying = false;
      $("btn-tour").classList.remove("is-on");
      return;
    }
    this.tourPlaying = true;
    $("btn-tour").classList.add("is-on");
    $("btn-god").classList.remove("is-on");
    this.runTourFrom(0);
  }

  async runTourFrom(start) {
    for (let i = start; i < DAY_STOPS.length; i += 1) {
      if (!this.tourPlaying) return;
      await this.goStop(i, true);
      if (!this.tourPlaying) return;
      await this.wait(i === DAY_STOPS.length - 1 ? 2200 : 2600);
    }
    this.tourPlaying = false;
    $("btn-tour").classList.remove("is-on");
  }

  wait(ms) {
    return new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      this._waitTimer = t;
    });
  }

  goStop(index, walk) {
    const stop = DAY_STOPS[index];
    this.tourIndex = index;
    this.mode = "tour";
    $("btn-god").classList.remove("is-on");
    this.highlightStop(index, true);
    this.openPanel(stop, stop.contentIds);
    this.animateCamera(stop.camera, stop.lookAt, 1.2);
    this.lights.play("room", stop.roomId, 1.2);
    if (walk) {
      const waypoints = [...stop.via, stop.stand];
      this.walkAlong(waypoints);
    } else {
      this.placeCharacter(stop.stand);
    }
    return this.wait(200);
  }

  highlightStop(index, updateHead) {
    const buttons = $("stops").querySelectorAll(".stop");
    buttons.forEach((b, i) => b.classList.toggle("is-on", i === index));
    const current = buttons[index];
    if (current) {
      current.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }
    if (updateHead && DAY_STOPS[index]) {
      const s = DAY_STOPS[index];
      $("tl-now").textContent = `${s.time} · ${s.title}`;
      $("tl-desc").textContent = `${ROOMS[s.roomId].name} · ${ROOMS[s.roomId].life}`;
      this.setMoment(`${s.time} · ${ROOMS[s.roomId].name}`);
    }
  }

  closePanel() {
    $("panel").classList.remove("is-open");
  }

  setMoment(text) {
    $("moment").textContent = text;
  }

  openPanel(stop, contentIds) {
    const room = ROOMS[stop.roomId];
    $("panel-kicker").textContent = [stop.time, room?.name].filter(Boolean).join(" · ");
    $("panel-title").textContent = stop.title || room?.name || "";
    $("panel-story").textContent = stop.narrative || room?.life || "";
    const box = $("panel-links");
    box.innerHTML = "";
    const ids = contentIds || [];
    if (!ids.length) {
      const p = document.createElement("p");
      p.className = "panel-empty";
      p.textContent = "这一段只属于生活本身，没有对外分享的条目。动线还在往前走。";
      box.appendChild(p);
    } else {
      for (const id of ids) {
        const c = CONTENTS[id];
        if (!c) continue;
        const a = document.createElement("a");
        a.className = "link";
        a.href = c.url;
        a.target = "_blank";
        a.rel = "noopener";
        const snip = this.feedSnippets[id] || c.fallback;
        a.innerHTML = `<span class="name">${c.name}</span><span class="snip">${snip}</span>`;
        box.appendChild(a);
      }
    }
    $("panel").classList.add("is-open");
  }

  placeCharacter([x, z]) {
    this.character.position.set(x, 0, z);
  }

  walkAlong(waypoints) {
    const pts = [];
    const cur = this.character.position;
    pts.push(new THREE.Vector3(cur.x, 0, cur.z));
    for (const [x, z] of waypoints) {
      const p = new THREE.Vector3(x, 0, z);
      const last = pts[pts.length - 1];
      if (last.distanceTo(p) > 0.08) pts.push(p);
    }
    if (pts.length < 2) return;
    let length = 0;
    for (let i = 1; i < pts.length; i += 1) length += pts[i].distanceTo(pts[i - 1]);
    this.walk = { pts, length: Math.max(length, 0.01), dist: 0, speed: 1.35 };
  }

  animateCamera(pos, target, dur) {
    this.camAnim = {
      fromPos: this.camera.position.clone(),
      toPos: new THREE.Vector3(...pos),
      fromTarget: this.controls.target.clone(),
      toTarget: new THREE.Vector3(...target),
      t: 0,
      dur,
    };
    this.controls.enabled = false;
  }

  loop() {
    const dt = this.clock.getDelta();
    this.lights?.update(dt);
    if (this.camAnim) {
      this.camAnim.t += dt / this.camAnim.dur;
      const k = easeInOut(Math.min(1, this.camAnim.t));
      this.camera.position.copy(lerpVec(this.camAnim.fromPos, this.camAnim.toPos, k));
      this.controls.target.copy(lerpVec(this.camAnim.fromTarget, this.camAnim.toTarget, k));
      if (this.camAnim.t >= 1) {
        this.camAnim = null;
        this.controls.enabled = true;
      }
    }
    if (this.walk) {
      this.walk.dist += dt * this.walk.speed;
      let remain = this.walk.dist;
      let done = true;
      for (let i = 1; i < this.walk.pts.length; i += 1) {
        const a = this.walk.pts[i - 1];
        const b = this.walk.pts[i];
        const seg = b.distanceTo(a);
        if (remain <= seg) {
          const k = seg === 0 ? 1 : remain / seg;
          this.character.position.copy(lerpVec(a, b, k));
          const dir = b.clone().sub(a);
          if (dir.lengthSq() > 0.0001) {
            this.character.rotation.y = Math.atan2(dir.x, dir.z);
          }
          done = false;
          break;
        }
        remain -= seg;
      }
      if (done) {
        const last = this.walk.pts[this.walk.pts.length - 1];
        this.character.position.copy(last);
        this.walk = null;
      }
    }
    const bob = Math.sin(this.clock.elapsedTime * 1.6) * 0.012;
    this.character.position.y = bob;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.loop());
  }
}

const home = new Home();
home.start();
void AUTHOR;
