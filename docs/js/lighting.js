/** 全球蓝调 + 每房基础 / 功能 / 氛围三层光，进房按时间分段点亮。 */

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

function point(THREE, color, intensity, distance, x, y, z) {
  const light = new THREE.PointLight(color, intensity, distance, 2);
  light.position.set(x, y, z);
  light.castShadow = false;
  return light;
}

export function createLightRig(THREE, scene, world) {
  const hemi = new THREE.HemisphereLight(0x4a5a78, 0x2a2014, 1.2);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x2c384c, 0.5);
  scene.add(ambient);

  const downFill = new THREE.DirectionalLight(0x5a6a80, 0.35);
  downFill.position.set(1.5, 18, 2);
  scene.add(downFill);

  const sun = new THREE.DirectionalLight(0x8a7860, 0.7);
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

  const skyFill = new THREE.DirectionalLight(0x4a5a78, 0.35);
  skyFill.position.set(6, 16, -4);
  scene.add(skyFill);

  const westGlow = new THREE.DirectionalLight(0x5a4638, 0.35);
  westGlow.position.set(-10, 3.2, 2);
  scene.add(westGlow);

  const roomFill = new THREE.AmbientLight(0xb38950, 0.04);
  scene.add(roomFill);

  const channels = [];

  const add = (id, light, layer, roomId, god, room) => {
    channels.push({ id, light, layer, roomId, god, room });
    if (!light.parent) scene.add(light);
  };

  add("hemi", hemi, "global", null, 1.2, 0.7);
  add("ambient", ambient, "global", null, 0.5, 0.28);
  add("downFill", downFill, "global", null, 0.35, 0.1);
  add("sun", sun, "global", null, 0.7, 0.22);
  add("skyFill", skyFill, "global", null, 0.35, 0.2);
  add("westGlow", westGlow, "global", null, 0.35, 0.18);
  add("roomFill", roomFill, "global", null, 0.04, 0.38);

  // 书房：天花底、台灯功能、书架低位氛围
  add("study.base", point(THREE, WARM, 0.22, 8.5, -3.7, 1.85, -3.1), "base", "study", 0.22, 1.8);
  add("study.task", point(THREE, WARM, 0.22, 3.4, -4.82, 1.12, -2.9), "task", "study", 0.22, 1.7);
  add("study.mood", point(THREE, WARM, 0.12, 2.6, -2.85, 0.42, -4.95), "mood", "study", 0.12, 0.85);

  // 卧室：更暗的底、床头功能、更低更柔的氛围
  add("bedroom.base", point(THREE, WARM, 0.16, 6.5, -3.7, 1.8, 0.5), "base", "bedroom", 0.16, 1.15);
  add("bedroom.task", point(THREE, WARM, 0.18, 3.0, -5.45, 0.78, -0.35), "task", "bedroom", 0.18, 1.25);
  add("bedroom.mood", point(THREE, WARM, 0.1, 2.2, -5.4, 0.45, -0.35), "mood", "bedroom", 0.1, 0.6);

  // 客厅：弱底、落地灯阅读、电视冷色氛围
  add("living.base", point(THREE, WARM, 0.2, 8.0, 1.0, 1.9, 1.3), "base", "living", 0.2, 1.5);
  add("living.task", point(THREE, WARM, 0.2, 3.8, 2.55, 1.5, 3.0), "task", "living", 0.2, 1.4);
  add("living.mood", point(THREE, COOL_TV, 0.1, 2.8, 0.8, 0.7, -0.55), "mood", "living", 0.1, 0.7);

  // 餐厅：弱底、收束吊灯、桌面反光 + 屏幕色光
  add("dining.base", point(THREE, WARM, 0.16, 5.5, 4.7, 1.85, 0.3), "base", "dining", 0.16, 1.2);
  add("dining.task", point(THREE, WARM, 0.18, 2.6, 4.7, 1.55, 0.3), "task", "dining", 0.18, 1.45);
  add("dining.mood", point(THREE, WARM, 0.08, 1.8, 4.7, 0.78, 0.3), "mood", "dining", 0.08, 0.7);
  add("dining.color", point(THREE, SCREEN, 0.04, 1.4, 4.92, 0.85, 0.38), "mood", "dining", 0.04, 0.4);

  // 厨房：弱底、吊柜下沿打台面
  add("kitchen.base", point(THREE, WARM, 0.16, 5.6, 4.7, 1.85, 3.4), "base", "kitchen", 0.16, 1.25);
  add("kitchen.task", point(THREE, WARM, 0.16, 2.4, 4.5, 1.18, 4.78), "task", "kitchen", 0.16, 1.45);

  // 卫生间：基础 + 镜前功能
  add("bath.base", point(THREE, WARM, 0.14, 4.6, 4.7, 1.85, -3.1), "base", "bath", 0.14, 1.05);
  add("bath.task", point(THREE, WARM, 0.12, 2.0, 5.25, 1.45, -4.82), "task", "bath", 0.12, 0.95);

  // 玄关：一点基础
  add("hall.base", point(THREE, WARM, 0.14, 4.4, 1.0, 1.85, -3.9), "base", "hall", 0.14, 1.0);

  const glow = world?.character?.getObjectByName("character-glow");
  if (glow) add("character", glow, "global", null, 0.12, 0.22);

  const rig = {
    channels,
    anim: null,
    activeRoom: null,
    mode: "god",

    targetFor(ch, mode, roomId) {
      if (ch.layer === "global") {
        if (mode !== "god" && roomId === "balcony" && ch.id === "westGlow") return 0.42;
        if (mode !== "god" && roomId === "balcony" && ch.id === "sun") return 0.22;
        if (mode !== "god" && roomId === "balcony" && ch.id === "roomFill") return 0.08;
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
      this.anim.t += dt / this.anim.dur;
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
