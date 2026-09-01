(() => {
  const hotspots = [...document.querySelectorAll(".hotspot")];
  const panel = document.querySelector(".story-panel");
  const scrim = document.querySelector(".panel-scrim");
  const closeButton = document.querySelector(".panel-close");
  const navButtons = document.querySelectorAll(".panel-nav button");
  const house = document.querySelector(".house");
  let activeIndex = 0;

  const text = (selector, value) => {
    const element = panel.querySelector(selector);
    if (element) element.textContent = value || "";
  };

  function showStory(index) {
    activeIndex = (index + hotspots.length) % hotspots.length;
    const hotspot = hotspots[activeIndex];
    const data = hotspot.dataset;

    text(".panel-index", `${String(activeIndex + 1).padStart(2, "0")} / ${String(hotspots.length).padStart(2, "0")}`);
    text(".panel-zone", `${data.zone} · ${data.time}`);
    text(".panel-icon", hotspot.querySelector(".hotspot__icon")?.textContent);
    text("#panel-title", data.name);
    text(".panel-desc", data.description);
    text(".panel-latest p", data.snippet || "这一页正在整理，欢迎稍后再来坐坐。");
    text(".panel-latest small", data.meta);
    panel.querySelector(".panel-link").href = data.url;

    hotspots.forEach((item, itemIndex) => {
      item.setAttribute("aria-expanded", String(itemIndex === activeIndex));
    });
    panel.classList.add("is-open");
    scrim.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeStory() {
    panel.classList.remove("is-open");
    scrim.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    hotspots[activeIndex]?.focus();
  }

  hotspots.forEach((hotspot, index) => {
    hotspot.setAttribute("aria-expanded", "false");
    hotspot.addEventListener("click", () => showStory(index));
  });

  closeButton.addEventListener("click", closeStory);
  scrim.addEventListener("click", closeStory);
  navButtons.forEach((button) => {
    button.addEventListener("click", () => showStory(activeIndex + Number(button.dataset.direction)));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closeStory();
    if (panel.classList.contains("is-open") && event.key === "ArrowRight") showStory(activeIndex + 1);
    if (panel.classList.contains("is-open") && event.key === "ArrowLeft") showStory(activeIndex - 1);
  });

  document.querySelectorAll(".view-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".view-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      house.classList.toggle("is-route", button.dataset.view === "day");
    });
  });

  const soundButton = document.querySelector(".sound-toggle");
  soundButton.addEventListener("click", () => {
    const enabled = soundButton.getAttribute("aria-pressed") !== "true";
    soundButton.setAttribute("aria-pressed", String(enabled));
    soundButton.title = enabled ? "声场动效已开启（无音频播放）" : "环境声音为概念交互";
  });

  if (window.matchMedia("(pointer: fine)").matches) {
    const stage = document.querySelector(".house-stage");
    stage.addEventListener("pointermove", (event) => {
      if (house.classList.contains("is-route")) return;
      const bounds = stage.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      house.style.marginLeft = `${x * 6}px`;
      house.style.marginTop = `${y * 4}px`;
    });
    stage.addEventListener("pointerleave", () => {
      house.style.marginLeft = "";
      house.style.marginTop = "";
    });
  }
})();
