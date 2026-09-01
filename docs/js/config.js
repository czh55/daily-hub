/** 房间、一日动线、内容分类 —— 与房子构造和作者生活对齐 */

export const AUTHOR = {
  name: "志恒",
  fullName: "陈志恒",
  role: "互联网研发",
  site: "https://chenzhiheng.cn",
};

/** 房间在世界坐标中的中心与范围（单位：米） */
export const ROOMS = {
  study: {
    id: "study",
    name: "书房",
    life: "白天的主阵地",
    bounds: { x: -3.7, z: -3.1, w: 4.6, d: 4.2 },
  },
  bedroom: {
    id: "bedroom",
    name: "卧室",
    life: "一天的两端",
    bounds: { x: -3.7, z: 0.5, w: 4.6, d: 3.0 },
  },
  balcony: {
    id: "balcony",
    name: "阳台",
    life: "蓝调时刻",
    bounds: { x: -3.7, z: 3.6, w: 4.6, d: 3.2 },
  },
  hall: {
    id: "hall",
    name: "玄关",
    life: "进出的门槛",
    bounds: { x: 1.0, z: -3.9, w: 4.8, d: 2.6 },
  },
  living: {
    id: "living",
    name: "客厅",
    life: "声音和影像",
    bounds: { x: 1.0, z: 1.3, w: 4.8, d: 7.8 },
  },
  kitchen: {
    id: "kitchen",
    name: "厨房",
    life: "两次认真对待食物",
    bounds: { x: 4.7, z: 3.4, w: 2.6, d: 3.6 },
  },
  dining: {
    id: "dining",
    name: "餐厅",
    life: "一个人吃，耳机里有别人",
    bounds: { x: 4.7, z: 0.3, w: 2.6, d: 2.6 },
  },
  bath: {
    id: "bath",
    name: "卫生间",
    life: "把一天洗干净再开始",
    bounds: { x: 4.7, z: -3.1, w: 2.6, d: 4.2 },
  },
};

export const CONTENTS = {
  "daily-photos": {
    id: "daily-photos",
    name: "摄影分享",
    description: "每日摄影作品",
    url: "https://chenzhiheng.cn/daily-photos/",
    rooms: ["bedroom", "balcony"],
    fallback: "墙上的光，和阳台上刚举起的那一次。",
  },
  "daily-algo": {
    id: "daily-algo",
    name: "算法题目",
    description: "每日算法练习",
    url: "https://chenzhiheng.cn/daily-algo/",
    rooms: ["study"],
    fallback: "坐下第一件事，是一道会说话的题。",
  },
  "daily-tech-learning": {
    id: "daily-tech-learning",
    name: "技术学习",
    description: "每日技术深度总结",
    url: "https://chenzhiheng.cn/daily-tech-learning/",
    rooms: ["study"],
    fallback: "把今天新懂的那一层，写成增量知识。",
  },
  dayai: {
    id: "dayai",
    name: "AI 实践",
    description: "AI 实践与行业记录",
    url: "https://chenzhiheng.cn/DayAI/",
    rooms: ["study"],
    fallback: "工具在变，他记下正在发生的事。",
  },
  "language-paraphrase": {
    id: "language-paraphrase",
    name: "语言学习",
    description: "场景式英语改写",
    url: "https://chenzhiheng.cn/language_paraphrase/",
    rooms: ["study"],
    fallback: "改一句英语，像把句子重新住进场景里。",
  },
  bear2cursor: {
    id: "bear2cursor",
    name: "笔记与知识",
    description: "知识世界旅行",
    url: "https://chenzhiheng.cn/bear2cursor/",
    rooms: ["study"],
    fallback: "旧笔记被一站一站安放到地图上。",
  },
  "audio-workshop": {
    id: "audio-workshop",
    name: "播客记录",
    description: "播客知识墙",
    url: "https://chenzhiheng.cn/audio-workshop/",
    rooms: ["dining"],
    fallback: "早餐时，别人的思考进到这间屋子。",
  },
  "daily-lyric-learning": {
    id: "daily-lyric-learning",
    name: "音乐 / 歌词",
    description: "每日英文歌词学习",
    url: "https://chenzhiheng.cn/daily-lyric-learning/",
    rooms: ["living"],
    fallback: "唱片转着，他把一句歌词拆开看。",
  },
  "bilibili-workshow": {
    id: "bilibili-workshow",
    name: "视频观看",
    description: "B 站 / 小红书总结墙",
    url: "https://chenzhiheng.cn/bilibili-workshow/",
    rooms: ["living"],
    fallback: "别人的剪辑看完，留下自己的总结。",
  },
  "drama-analysis": {
    id: "drama-analysis",
    name: "影视记录",
    description: "剧集剧情分析",
    url: "https://chenzhiheng.cn/drama-analysis/",
    rooms: ["living"],
    fallback: "一盏灯，一段剧，一层自己的读法。",
  },
  "tour-map": {
    id: "tour-map",
    name: "旅行规划",
    description: "行程与地图",
    url: "https://chenzhiheng.cn/tour_map/",
    rooms: ["balcony"],
    fallback: "蓝调天色里，下一趟路开始显形。",
  },
};

/**
 * 一日动线。via 是从上一点走到此站的走廊坐标（xz），避免穿墙。
 * 相机略俯，仍能看清房间，而不是第一人称。
 */
export const DAY_STOPS = [
  {
    id: "wake",
    time: "07:00",
    title: "醒来",
    roomId: "bedroom",
    stand: [-3.5, 0.35],
    via: [],
    camera: [ -1.6, 4.6, 2.4 ],
    lookAt: [ -3.6, 0.7, 0.45 ],
    contentIds: ["daily-photos"],
    narrative:
      "窗帘缝里还是冷蓝。他坐起来，目光先落到墙上那几张照片——昨天的光，今天还在。",
  },
  {
    id: "wash",
    time: "07:25",
    title: "洗漱",
    roomId: "bath",
    stand: [4.55, -3.15],
    via: [
      [-0.95, 0.4],
      [1.05, 0.35],
      [1.05, -3.3],
      [4.5, -3.3],
    ],
    camera: [ 2.2, 4.2, -1.4 ],
    lookAt: [ 4.6, 0.8, -3.1 ],
    contentIds: [],
    narrative:
      "水声很短。镜子里的人还没完全醒，但一天已经开始了。这间屋子不对外分享，只负责把他洗干净。",
  },
  {
    id: "cook-morning",
    time: "07:50",
    title: "做早餐",
    roomId: "kitchen",
    stand: [4.55, 3.45],
    via: [
      [1.05, -3.3],
      [1.05, 0.35],
      [4.55, 0.3],
      [4.55, 3.4],
    ],
    camera: [ 2.4, 4.4, 1.6 ],
    lookAt: [ 4.65, 0.85, 3.35 ],
    contentIds: [],
    narrative:
      "实木台面上切开一块面包。咖啡机低低响着。这是家里最朴素的仪式，和代码无关。",
  },
  {
    id: "breakfast",
    time: "08:15",
    title: "早餐与播客",
    roomId: "dining",
    stand: [4.5, 0.25],
    via: [[4.55, 0.3]],
    camera: [ 2.1, 4.3, 2.1 ],
    lookAt: [ 4.6, 0.75, 0.25 ],
    contentIds: ["audio-workshop"],
    narrative:
      "一个人吃，耳机里却有别人的思考。他把听到的记进播客知识墙，早餐因此多了一层回声。",
  },
  {
    id: "algo",
    time: "09:00",
    title: "算法",
    roomId: "study",
    stand: [-3.55, -2.85],
    via: [
      [1.05, 0.35],
      [1.05, -3.3],
      [-3.55, -3.25],
    ],
    camera: [ -1.2, 4.5, -0.6 ],
    lookAt: [ -3.7, 0.75, -3.15 ],
    contentIds: ["daily-algo"],
    narrative:
      "坐下第一件事不是打开消息。是一道题。变量被他起成会说话的名字，上午从此有了形状。",
  },
  {
    id: "tech",
    time: "10:30",
    title: "技术与 AI",
    roomId: "study",
    stand: [-3.7, -3.35],
    via: [[-3.7, -3.2]],
    camera: [ -1.35, 4.4, -1.0 ],
    lookAt: [ -3.75, 0.8, -3.2 ],
    contentIds: ["daily-tech-learning", "dayai"],
    narrative:
      "屏幕亮着，但不刺眼。他把今天学到的一层写成增量知识，也记下工具和行业里正在发生的事。",
  },
  {
    id: "notes",
    time: "11:40",
    title: "语言与笔记",
    roomId: "study",
    stand: [-2.4, -3.6],
    via: [[-2.6, -3.5]],
    camera: [ -0.8, 4.3, -1.5 ],
    lookAt: [ -3.2, 0.85, -3.4 ],
    contentIds: ["language-paraphrase", "bear2cursor"],
    narrative:
      "改一句英语，迁一条旧笔记。知识像旅行，一站一站被安放到他自己的地图上。",
  },
  {
    id: "lunch",
    time: "12:40",
    title: "午餐",
    roomId: "dining",
    stand: [4.5, 0.25],
    via: [
      [-3.5, -3.25],
      [1.05, -3.3],
      [1.05, 0.35],
      [4.5, 0.3],
    ],
    camera: [ 2.0, 4.2, 2.0 ],
    lookAt: [ 4.6, 0.7, 0.25 ],
    contentIds: ["audio-workshop"],
    narrative:
      "简单吃一点。中午的光已经偏白，他还没准备好离开这张桌子太久——耳机可以先摘下。",
  },
  {
    id: "music",
    time: "14:20",
    title: "音乐与歌词",
    roomId: "living",
    stand: [0.35, 1.55],
    via: [[1.05, 0.4], [0.4, 1.5]],
    camera: [ 3.2, 4.6, -0.8 ],
    lookAt: [ 0.7, 0.6, 1.6 ],
    contentIds: ["daily-lyric-learning"],
    narrative:
      "下午的沙发陷下去一点。唱片转着，他跟着一句英文歌词把情绪拆开看。研发之外，这是他真正的耳朵。",
  },
  {
    id: "video",
    time: "16:00",
    title: "影像",
    roomId: "living",
    stand: [0.85, 0.85],
    via: [[0.8, 1.1]],
    camera: [ 3.4, 4.5, -1.2 ],
    lookAt: [ 1.1, 0.65, 1.4 ],
    contentIds: ["bilibili-workshow", "drama-analysis"],
    narrative:
      "电视里是别人的剪辑和别人的剧本。他看完，会留下自己的总结——看，也是一种书写。",
  },
  {
    id: "bluehour",
    time: "17:40",
    title: "蓝调",
    roomId: "balcony",
    stand: [-3.7, 3.65],
    via: [
      [1.05, 1.4],
      [1.05, 3.55],
      [-3.6, 3.55],
    ],
    camera: [ -0.6, 4.8, 1.4 ],
    lookAt: [ -3.6, 0.7, 3.55 ],
    contentIds: ["tour-map", "daily-photos"],
    narrative:
      "天色沉成蓝调。西边只剩一层薄暖。他站在栏杆边想下一趟路，偶尔举起相机。房子此刻最像他本人。",
  },
  {
    id: "cook-evening",
    time: "19:00",
    title: "晚饭",
    roomId: "kitchen",
    stand: [4.55, 3.45],
    via: [
      [1.05, 3.55],
      [1.05, 0.35],
      [4.55, 0.3],
      [4.55, 3.4],
    ],
    camera: [ 2.3, 4.3, 1.5 ],
    lookAt: [ 4.65, 0.8, 3.35 ],
    contentIds: [],
    narrative:
      "再回到灶台。一天里第二次认真对待食物。锅沿的水汽比屏幕温和得多。",
  },
  {
    id: "night-living",
    time: "20:30",
    title: "夜里的客厅",
    roomId: "living",
    stand: [0.55, 1.45],
    via: [[4.55, 0.3], [1.05, 0.4], [0.55, 1.4]],
    camera: [ 3.3, 4.4, -0.9 ],
    lookAt: [ 0.8, 0.55, 1.5 ],
    contentIds: ["daily-lyric-learning", "drama-analysis"],
    narrative:
      "灯只开一盏。继续一段剧，或把白天的声音再听一遍。客厅把晚上慢慢收窄。",
  },
  {
    id: "sleep",
    time: "22:40",
    title: "睡前",
    roomId: "bedroom",
    stand: [-3.55, 0.4],
    via: [
      [1.05, 0.4],
      [-0.95, 0.4],
      [-3.5, 0.4],
    ],
    camera: [ -1.5, 4.4, 2.5 ],
    lookAt: [ -3.6, 0.65, 0.45 ],
    contentIds: ["daily-photos"],
    narrative:
      "墙上的照片暗下来。他躺下之前，房间把这一天轻轻收好。明天会再从同一面墙开始。",
  },
];

export const GOD_VIEW = {
  position: [8.6, 19.2, 13.4],
  target: [0.1, 0.15, 0.15],
};

export const ROOM_CAMERAS = {
  study: { position: [-0.4, 5.4, 0.2], target: [-3.7, 0.55, -3.15] },
  bedroom: { position: [-0.7, 5.2, 3.1], target: [-3.65, 0.5, 0.45] },
  balcony: { position: [0.2, 5.4, 1.6], target: [-3.6, 0.45, 3.55] },
  living: { position: [3.6, 5.6, -1.6], target: [0.7, 0.45, 1.35] },
  kitchen: { position: [2.0, 5.0, 1.2], target: [4.65, 0.65, 3.35] },
  dining: { position: [1.8, 4.9, 2.4], target: [4.6, 0.55, 0.25] },
  bath: { position: [1.9, 4.8, -1.1], target: [4.6, 0.6, -3.1] },
  hall: { position: [1.1, 5.0, -0.6], target: [1.0, 0.5, -3.85] },
};
