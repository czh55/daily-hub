/**
 * 个人生活空间 · UI 控制器
 */

import { HomeScene, LIFE_PATH } from './home-scene.js';

const container = document.getElementById('canvas-container');
const loadingScreen = document.getElementById('loading-screen');
const loadingBar = document.getElementById('loading-bar-inner');
const roomPanel = document.getElementById('room-panel');
const timelineBar = document.getElementById('timeline-bar');
const hintOverlay = document.getElementById('hint-overlay');
const btnGodView = document.getElementById('btn-god-view');
const btnTour = document.getElementById('btn-tour');
const btnHub = document.getElementById('btn-hub');

let scene;

function initUI() {
  // 构建时间轴
  LIFE_PATH.forEach((room, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'timeline-line';
      timelineBar.appendChild(line);
    }
    const dot = document.createElement('div');
    dot.className = 'timeline-dot';
    dot.dataset.label = room.label;
    dot.dataset.index = i;
    dot.title = `${room.time} · ${room.name}`;
    dot.addEventListener('click', () => {
      if (!scene.isTouring) scene.focusRoom(i);
    });
    timelineBar.appendChild(dot);
  });
}

function updateTimeline(index) {
  const dots = timelineBar.querySelectorAll('.timeline-dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function showRoomPanel(room) {
  if (!room) {
    roomPanel.classList.remove('visible');
    updateTimeline(-1);
    return;
  }

  document.getElementById('room-time').textContent = `${room.time} · ${room.label}`;
  document.getElementById('room-name').textContent = room.name;
  document.getElementById('room-mood').textContent = room.mood;

  const list = document.getElementById('content-list');
  list.innerHTML = '';
  room.contents.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'content-item';
    a.href = item.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.innerHTML = `
      <div class="content-item-header">
        <span class="content-emoji">${item.emoji}</span>
        <span class="content-title">${item.title}</span>
      </div>
      <div class="content-desc">${item.desc}</div>
    `;
    li.appendChild(a);
    list.appendChild(li);
  });

  roomPanel.classList.add('visible');
}

function simulateLoading() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 25;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
          hintOverlay.classList.add('fade-out');
        }, 8000);
      }, 300);
    }
    loadingBar.style.width = `${progress}%`;
  }, 150);
}

function init() {
  initUI();
  simulateLoading();

  scene = new HomeScene(container);
  scene.onRoomChange = (room, index) => {
    showRoomPanel(room);
    updateTimeline(index);
  };

  function loop() {
    scene.animate();
    requestAnimationFrame(loop);
  }
  loop();

  btnGodView.addEventListener('click', () => {
    if (!scene.isTouring) scene.resetGodView();
  });

  btnTour.addEventListener('click', () => {
    if (!scene.isTouring) {
      scene.startTour((step) => updateTimeline(step));
    }
  });

  btnHub.addEventListener('click', () => {
    window.location.href = 'hub/';
  });
}

init();
