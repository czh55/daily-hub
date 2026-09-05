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
  const hemi = new THREE.HemisphereLight(0x4a5a78, 0x2a2014, 0.85);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0x2c384c, 0.28);
  scene.add(ambient);

  const downFill = new THREE.DirectionalLight(0x5a6a80, 0.22);
  downFill.position.set(1.5, 18, 2);
  scene.add(downFill);

  const sun = new THREE.DirectionalLight(0x8a7860, 0.55);
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

  const skyFill = new THREE.DirectionalLight(0x4a5a78, 0.22);
  skyFill.position.set(6, 16, -4);
  scene.add(skyFill);

  const westGlow = new THREE.DirectionalLight(0x5a4638, 0.28);
  westGlow.position.set(-10, 3.2, 2);
  scene.add(westGlow);

  const channels = [];

  const add = (id, light, layer, roomId, god, room) => {
    channels.push({ id, light, layer, roomId, god, room });
    if (!light.parent) scene.add(light);
  };

  add("hemi", hemi, "global", null, 0.85, 0.28);
  add("ambient", ambient, "global", null, 0.28, 0.08);
  add("downFill", downFill, "global", null, 0.22, 0.05);
  add("sun", sun, "global", null, 0.55, 0.14);
  add("skyFill", skyFill, "global", null, 0.22, 0.08);
  add("westGlow", westGlow, "global", null, 0.28, 0.12);

  // 书房：天花底、台灯功能、书架低位氛围
  add("study.base", point(THREE, WARM, 0.08, 5.0, -3.7, 2.2, -3.1), "base", "study", 0.08, 0.45);
  add("study.task", point(THREE, WARM, 0.12, 2.8, -4.82, 1.12, -2.9), "task", "study", 0.12, 1.35);
  add("study.mood", point(THREE, WARM, 0.04, 1.8, -2.85, 0.42, -4.95), "mood", "study", 0.04, 0.55);

  // 卧室：更暗的底、床头功能、更低更柔的氛围
  add("bedroom.base", point(THREE, WARM, 0.06, 4.2, -3.7, 2.15, 0.5), "base", "bedroom", 0.06, 0.28);
  add("bedroom.task", point(THREE, WARM, 0.1, 2.4, -5.45, 0.78, -0.35), "task", "bedroom", 0.1, 0.95);
  add("bedroom.mood", point(THREE, WARM, 0.03, 1.6, -5.4, 0.45, -0.35), "mood", "bedroom", 0.03, 0.4);

  // 客厅：弱底、落地灯阅读、电视冷色氛围
  add("living.base", point(THREE, WARM, 0.08, 6.0, 1.0, 2.2, 1.3), "base", "living", 0.08, 0.38);
  add("living.task", point(THREE, WARM, 0.1, 3.2, 2.55, 1.5, 3.0), "task", "living", 0.1, 1.15);
  add("living.mood", point(THREE, COOL_TV, 0.04, 2.2, 0.8, 0.7, -0.55), "mood", "living", 0.04, 0.5);

  // 餐厅：弱底、收束吊灯、桌面反光 + 屏幕色光
  add("dining.base", point(THREE, WARM, 0.05, 3.5, 4.7, 2.15, 0.3), "base", "dining", 0.05, 0.22);
  add("dining.task", point(THREE, WARM, 0.1, 1.8, 4.7, 1.55, 0.3), "task", "dining", 0.1, 0.95);
  add("dining.mood", point(THREE, WARM, 0.02, 1.3, 4.7, 0.78, 0.3), "mood", "dining", 0.02, 0.45);
  add("dining.color", point(THREE, SCREEN, 0, 0.9, 4.92, 0.85, 0.38), "mood", "dining", 0, 0.28);

  // 厨房：弱底、吊柜下沿打台面
  add("kitchen.base", point(THREE, WARM, 0.06, 3.8, 4.7, 2.1, 3.4), "base", "kitchen", 0.06, 0.3);
  add("kitchen.task", point(THREE, WARM, 0.08, 1.6, 4.5, 1.18, 4.78), "task", "kitchen", 0.08, 1.05);

  // 卫生间：基础 + 镜前功能
  add("bath.base", point(THREE, WARM, 0.05, 3.6, 4.7, 2.1, -3.1), "base", "bath", 0.05, 0.32);
  add("bath.task", point(THREE, WARM, 0.06, 1.5, 5.25, 1.45, -4.82), "task", "bath", 0.06, 0.7);

  // 玄关：一点基础
  add("hall.base", point(THREE, WARM, 0.06, 3.2, 1.0, 2.1, -3.9), "base", "hall", 0.06, 0.35);

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
