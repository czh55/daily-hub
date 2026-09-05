/** 全球蓝调 + 每房基础 / 功能 / 氛围三层光，进房按时间分段点亮。
 *  Three r170 的 Lambert 按能量守恒除以 π，强度按 candela / 照度来，不能再用旧版 0.2 那种数。 */

const WARM = 0xb38950;
const COOL_TV = 0x3a4a62;
const SCREEN = 0x5a3a68;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

function phase(t, start, end) {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return easeInOut((t - start) / (end - start));
}

function point(THREE, color, intensity, distance, x, y, z, decay = 2) {
  const light = new THREE.PointLight(color, intensity, distance, decay);
  light.position.set(x, y, z);
  light.castShadow = false;
  return light;
}

export function createLightRig(THREE, scene, world) {
  const hemi = new THREE.HemisphereLight(0x4a5a78, 0x2a2014, 3.8);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x2c384c, 1.35);
  scene.add(ambient);

  const downFill = new THREE.DirectionalLight(0x5a6a80, 1.0);
  downFill.position.set(1.5, 18, 2);
  scene.add(downFill);

  const sun = new THREE.DirectionalLight(0x8a7860, 2.1);
  sun.position.set(-14, 9.5, 4.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 2;
  sun.shadow.camera.far = 40;
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 14;
  sun.shadow.camera.bottom = -14;
  sun.shadow.bias = -0.00035;
  sun.shadow.intensity = 0.72;
  scene.add(sun);

  const skyFill = new THREE.DirectionalLight(0x4a5a78, 1.0);
  skyFill.position.set(6, 16, -4);
  scene.add(skyFill);

  const westGlow = new THREE.DirectionalLight(0x5a4638, 1.0);
  westGlow.position.set(-10, 3.2, 2);
  scene.add(westGlow);

  const roomFill = new THREE.AmbientLight(0xb38950, 0.12);
  scene.add(roomFill);

  const channels = [];

  const add = (id, light, layer, roomId, god, room) => {
    channels.push({ id, light, layer, roomId, god, room });
    if (!light.parent) scene.add(light);
  };

  add("hemi", hemi, "global", null, 3.8, 1.6);
  add("ambient", ambient, "global", null, 1.35, 0.7);
  add("downFill", downFill, "global", null, 1.0, 0.22);
  add("sun", sun, "global", null, 2.1, 0.55);
  add("skyFill", skyFill, "global", null, 1.0, 0.55);
  add("westGlow", westGlow, "global", null, 1.0, 0.45);
  add("roomFill", roomFill, "global", null, 0.12, 1.7);

  // 基础光 decay 更软，铺开房间；功能光 decay 2，只打需求面
  add("study.base", point(THREE, WARM, 0.55, 8.5, -3.7, 1.85, -3.1, 1.2), "base", "study", 0.55, 14);
  add("study.task", point(THREE, WARM, 0.7, 3.4, -4.82, 1.12, -2.9, 2), "task", "study", 0.7, 20);
  add("study.mood", point(THREE, WARM, 0.3, 2.8, -2.85, 0.42, -4.95, 1.6), "mood", "study", 0.3, 7);

  add("bedroom.base", point(THREE, WARM, 0.4, 6.5, -3.7, 1.8, 0.5, 1.2), "base", "bedroom", 0.4, 8);
  add("bedroom.task", point(THREE, WARM, 0.55, 3.0, -5.45, 0.78, -0.35, 2), "task", "bedroom", 0.55, 14);
  add("bedroom.mood", point(THREE, WARM, 0.25, 2.2, -5.4, 0.45, -0.35, 1.6), "mood", "bedroom", 0.25, 5);

  add("living.base", point(THREE, WARM, 0.5, 8.0, 1.0, 1.9, 1.3, 1.2), "base", "living", 0.5, 11);
  add("living.task", point(THREE, WARM, 0.6, 3.8, 2.55, 1.5, 3.0, 2), "task", "living", 0.6, 16);
  add("living.mood", point(THREE, COOL_TV, 0.25, 2.8, 0.8, 0.7, -0.55, 1.6), "mood", "living", 0.25, 6);

  add("dining.base", point(THREE, WARM, 0.4, 5.5, 4.7, 1.85, 0.3, 1.2), "base", "dining", 0.4, 9);
  add("dining.task", point(THREE, WARM, 0.55, 2.6, 4.7, 1.55, 0.3, 2), "task", "dining", 0.55, 16);
  add("dining.mood", point(THREE, WARM, 0.2, 1.8, 4.7, 0.78, 0.3, 1.4), "mood", "dining", 0.2, 6);
  add("dining.color", point(THREE, SCREEN, 0.1, 1.4, 4.92, 0.85, 0.38, 2), "mood", "dining", 0.1, 3.2);

  add("kitchen.base", point(THREE, WARM, 0.4, 5.6, 4.7, 1.85, 3.4, 1.2), "base", "kitchen", 0.4, 9);
  add("kitchen.task", point(THREE, WARM, 0.45, 2.4, 4.5, 1.18, 4.78, 2), "task", "kitchen", 0.45, 18);

  add("bath.base", point(THREE, WARM, 0.4, 4.6, 4.7, 1.85, -3.1, 1.2), "base", "bath", 0.4, 8);
  add("bath.task", point(THREE, WARM, 0.3, 2.0, 5.25, 1.45, -4.82, 2), "task", "bath", 0.3, 8);

  add("hall.base", point(THREE, WARM, 0.4, 4.4, 1.0, 1.85, -3.9, 1.2), "base", "hall", 0.4, 7);

  const glow = world?.character?.getObjectByName("character-glow");
  if (glow) add("character", glow, "global", null, 0.8, 1.6);

  const rig = {
    channels,
    anim: null,
    activeRoom: null,
    mode: "god",

    targetFor(ch, mode, roomId) {
      if (ch.layer === "global") {
        if (mode !== "god" && roomId === "balcony" && ch.id === "westGlow") return 1.4;
        if (mode !== "god" && roomId === "balcony" && ch.id === "sun") return 0.9;
        if (mode !== "god" && roomId === "balcony" && ch.id === "roomFill") return 0.25;
        return mode === "god" ? ch.god : ch.room;
      }
      if (mode === "god") return ch.god;
      return ch.roomId === roomId ? ch.room : ch.god;
    },

    windowFor(ch, mode, roomId) {
      if (mode === "god") {
        if (ch.layer === "mood") return [0, 0.28];
        if (ch.layer === "task") return [0.08, 0.45];
        if (ch.layer === "base") return [0.22, 0.62];
        return [0.32, 1];
      }
      if (ch.layer === "global") return [0, 0.26];
      if (ch.roomId !== roomId) return [0, 0.26];
      if (ch.layer === "base") return [0.26, 0.52];
      if (ch.layer === "task") return [0.52, 0.78];
      return [0.78, 1];
    },

    play(mode, roomId, duration = 1.15) {
      const from = {};
      const to = {};
      const windows = {};
      for (const ch of channels) {
        from[ch.id] = ch.light.intensity;
        to[ch.id] = this.targetFor(ch, mode, roomId);
        windows[ch.id] = this.windowFor(ch, mode, roomId);
      }
      this.mode = mode;
      this.activeRoom = mode === "god" ? null : roomId;
      if (!duration) {
        for (const ch of channels) ch.light.intensity = to[ch.id];
        this.anim = null;
        return;
      }
      this.anim = { t: 0, dur: duration, from, to, windows };
    },

    update(dt) {
      if (!this.anim) return;
      this.anim.t += Math.min(dt, 0.05) / this.anim.dur;
      const t = Math.min(1, this.anim.t);
      for (const ch of channels) {
        const [a, b] = this.anim.windows[ch.id];
        const k = phase(t, a, b);
        const from = this.anim.from[ch.id];
        const to = this.anim.to[ch.id];
        ch.light.intensity = from + (to - from) * k;
      }
      if (t >= 1) this.anim = null;
    },
  };

  rig.play("god", null, 0);
  return rig;
}
