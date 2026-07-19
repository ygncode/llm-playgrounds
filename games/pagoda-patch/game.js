/**
 * ခြံစောင့် · Pagoda Patch — Burmese-style campaign
 */
(() => {
  "use strict";

  const ROWS = 5;
  const COLS = 9;
  const SAVE_KEY = "garden-defense-v2";

  // ═══════════════════════════════════════════════════════════
  // PLANTS
  // ═══════════════════════════════════════════════════════════
  const PLANTS = {
    sunflower: {
      id: "sunflower", name: "နေကြာ · Sun", emoji: "🌻",
      cost: 50, hp: 80, cooldown: 7.5, sunInterval: 7.5, sunAmount: 25,
    },
    twinflower: {
      id: "twinflower", name: "နေကြာနှစ်လုံး · Twin", emoji: "🌼",
      cost: 125, hp: 80, cooldown: 12, sunInterval: 7.5, sunAmount: 50,
    },
    peashooter: {
      id: "peashooter", name: "ပဲပစ် · Pea", emoji: "🟢",
      cost: 100, hp: 100, cooldown: 7.5, fireInterval: 1.4, damage: 20,
    },
    wallnut: {
      id: "wallnut", name: "ထန်းလုံး · Toddy", emoji: "🥥",
      cost: 50, hp: 400, cooldown: 20,
    },
    potatomine: {
      id: "potatomine", name: "အာလူးမိုင်း · Spud", emoji: "🥔",
      cost: 25, hp: 60, cooldown: 14, armTime: 9, blastDamage: 1800, mine: true,
    },
    puffshroom: {
      id: "puffshroom", name: "မှိုပွင့် · Puff", emoji: "🍄",
      cost: 0, hp: 60, cooldown: 5, fireInterval: 1.5, damage: 20, shortRange: 3.2,
    },
    fumeshroom: {
      id: "fumeshroom", name: "မှိုငွေ့ · Fume", emoji: "☁️",
      cost: 75, hp: 100, cooldown: 8, fireInterval: 1.5, damage: 20, pierce: true, range: 4.5,
    },
    snowpea: {
      id: "snowpea", name: "ရေခဲပဲ · Ice", emoji: "❄️",
      cost: 175, hp: 100, cooldown: 10, fireInterval: 1.4, damage: 20, slow: true,
    },
    repeater: {
      id: "repeater", name: "ပဲနှစ်ချက် · Dual", emoji: "💚",
      cost: 200, hp: 100, cooldown: 10, fireInterval: 1.4, damage: 20, double: true,
    },
    cherrybomb: {
      id: "cherrybomb", name: "ချယ်ရီဗုံး · Boom", emoji: "🍒",
      cost: 150, hp: 9999, cooldown: 30, fuse: 1.0, blastDamage: 1800, instant: true, aoe: "3x3",
    },
    jalapeno: {
      id: "jalapeno", name: "ငရုတ်သီး · Chili", emoji: "🌶️",
      cost: 125, hp: 9999, cooldown: 35, fuse: 0.7, blastDamage: 1800, instant: true, aoe: "row",
    },
    tallnut: {
      id: "tallnut", name: "ထန်းကြီး · Tall", emoji: "🧱",
      cost: 125, hp: 800, cooldown: 25, blockLeap: true,
    },
    starfruit: {
      id: "starfruit", name: "ပိန္နဲ · Star", emoji: "⭐",
      cost: 125, hp: 100, cooldown: 10, fireInterval: 1.6, damage: 20, starShot: true,
    },
  };

  // ═══════════════════════════════════════════════════════════
  // ZOMBIES
  // ═══════════════════════════════════════════════════════════
  const ZOMBIE_TYPES = {
    basic:   { hp: 100, speed: 17, damage: 20, eatInterval: 0.9, score: 10 },
    flag:    { hp: 100, speed: 26, damage: 20, eatInterval: 0.85, score: 15 },
    cone:    { hp: 280, speed: 16, damage: 20, eatInterval: 0.9, score: 25 },
    bucket:  { hp: 550, speed: 14, damage: 25, eatInterval: 0.85, score: 50 },
    newspaper: { hp: 200, speed: 15, damage: 20, eatInterval: 0.85, score: 30, enrageAt: 0.45, enrageSpeed: 38 },
    runner:  { hp: 80,  speed: 42, damage: 30, eatInterval: 0.7, score: 20 },
    door:    { hp: 450, speed: 13, damage: 20, eatInterval: 0.9, score: 40 },
    dancer:  { hp: 220, speed: 16, damage: 20, eatInterval: 0.9, score: 45, summon: true },
    balloon: { hp: 140, speed: 22, damage: 20, eatInterval: 0.9, score: 35, flying: true },
    giant:   { hp: 1400, speed: 9, damage: 50, eatInterval: 0.7, score: 120, smash: true },
    boss:    { hp: 5000, speed: 4, damage: 80, eatInterval: 0.6, score: 500, isBoss: true },
  };

  // ═══════════════════════════════════════════════════════════
  // LEVELS — each is a mini-game with its own rules
  // ═══════════════════════════════════════════════════════════
  const LEVELS = [
    {
      id: "suburb",
      num: 1,
      name: "ရန်ကုန်ခြံ · Yangon Yard",
      emoji: "☀️",
      theme: "day",
      blurb: "အိမ်ရှေ့ခြံလေး။ သင်ခန်းစာမပြီးခင် zombie ရောက်လာပြီ။",
      mod: "နေ့ခင်းခြံ — နေရောင်ကျလာမယ်။ အခြေခံသင်ခန်းစာ!",
      startSun: 50,
      skySun: true,
      plants: ["sunflower", "peashooter", "wallnut"],
      mowers: true,
      waves: [
        [{ t: 7, row: 2, type: "basic" }, { t: 14, row: 0, type: "basic" }, { t: 18, row: 4, type: "basic" }],
        [{ t: 2, row: 1, type: "basic" }, { t: 4, row: 3, type: "basic" }, { t: 10, row: 2, type: "basic" }, { t: 14, row: 0, type: "flag" }, { t: 16, row: 4, type: "basic" }],
        [{ t: 1, row: 0, type: "basic" }, { t: 2, row: 2, type: "basic" }, { t: 3, row: 4, type: "basic" }, { t: 8, row: 1, type: "cone" }, { t: 12, row: 3, type: "basic" }, { t: 16, row: 2, type: "flag" }],
      ],
      starRules: { time2: 120, time3: 90, noMower: true },
    },
    {
      id: "night",
      num: 2,
      name: "အင်းလေးည · Inle Night",
      emoji: "🌙",
      theme: "night",
      blurb: "နေဝင်ပြီ။ မှိုပွင့်တွေက မင်းရဲ့ မိတ်ဆွေသစ်။",
      mod: "နေရောင်မကျဘူး! မှိုပွင့် (Puff) က အခမဲ့။ ကိုယ့်နေရောင် ကိုယ်စိုက်။",
      startSun: 50,
      skySun: false,
      plants: ["sunflower", "puffshroom", "peashooter", "wallnut", "fumeshroom"],
      mowers: true,
      waves: [
        [{ t: 6, row: 1, type: "basic" }, { t: 10, row: 3, type: "basic" }, { t: 16, row: 2, type: "basic" }],
        [{ t: 2, row: 0, type: "basic" }, { t: 4, row: 4, type: "basic" }, { t: 8, row: 2, type: "cone" }, { t: 12, row: 1, type: "basic" }, { t: 14, row: 3, type: "basic" }],
        [{ t: 1, row: 0, type: "basic" }, { t: 2, row: 2, type: "cone" }, { t: 3, row: 4, type: "basic" }, { t: 8, row: 1, type: "newspaper" }, { t: 10, row: 3, type: "cone" }, { t: 15, row: 2, type: "flag" }, { t: 18, row: 0, type: "basic" }, { t: 18, row: 4, type: "basic" }],
        [{ t: 1, row: 1, type: "cone" }, { t: 2, row: 3, type: "cone" }, { t: 5, row: 0, type: "newspaper" }, { t: 6, row: 2, type: "bucket" }, { t: 7, row: 4, type: "newspaper" }, { t: 12, row: 1, type: "flag" }, { t: 14, row: 3, type: "basic" }, { t: 16, row: 2, type: "cone" }],
      ],
      starRules: { time2: 160, time3: 120, noMower: true },
    },
    {
      id: "minefield",
      num: 3,
      name: "ရှမ်းအာလူးခင်း · Shan Spuds",
      emoji: "🥔",
      theme: "day",
      blurb: "အုပ်လိုက်လာမယ်။ မင်းမှာ အာလူးမိုင်း ရှိတယ်။ တွက်ကြည့်။",
      mod: "အာလူးမိုင်း အချိန်ယူပြီး ပြင်ဆင်တယ်။ အက်ကွဲမြေမှာ မစိုက်ရ။",
      startSun: 75,
      skySun: true,
      plants: ["sunflower", "peashooter", "potatomine", "wallnut", "cherrybomb"],
      mowers: true,
      blocked: [[0, 3], [1, 5], [2, 2], [2, 6], [3, 4], [4, 3], [4, 7]],
      waves: [
        [{ t: 5, row: 0, type: "basic" }, { t: 6, row: 2, type: "basic" }, { t: 7, row: 4, type: "basic" }, { t: 14, row: 1, type: "basic" }, { t: 15, row: 3, type: "basic" }],
        [{ t: 1, row: 0, type: "flag" }, { t: 2, row: 1, type: "basic" }, { t: 3, row: 2, type: "basic" }, { t: 4, row: 3, type: "basic" }, { t: 5, row: 4, type: "flag" }, { t: 12, row: 2, type: "cone" }, { t: 14, row: 0, type: "cone" }, { t: 16, row: 4, type: "cone" }],
        [{ t: 1, row: 1, type: "runner" }, { t: 3, row: 3, type: "runner" }, { t: 6, row: 0, type: "cone" }, { t: 8, row: 2, type: "bucket" }, { t: 10, row: 4, type: "cone" }, { t: 14, row: 1, type: "basic" }, { t: 15, row: 2, type: "runner" }, { t: 16, row: 3, type: "basic" }],
        [{ t: 0.5, row: 0, type: "basic" }, { t: 1, row: 1, type: "cone" }, { t: 1.5, row: 2, type: "flag" }, { t: 2, row: 3, type: "cone" }, { t: 2.5, row: 4, type: "basic" }, { t: 8, row: 0, type: "runner" }, { t: 9, row: 2, type: "bucket" }, { t: 10, row: 4, type: "runner" }, { t: 14, row: 1, type: "newspaper" }, { t: 15, row: 3, type: "newspaper" }, { t: 18, row: 2, type: "bucket" }],
      ],
      starRules: { time2: 150, time3: 110, noMower: true },
    },
    {
      id: "fog",
      num: 4,
      name: "ပုဂံမြူ · Bagan Mist",
      emoji: "🌫️",
      theme: "fog",
      blurb: "မြူဆိုင်းလို့ မမြင်ရ။ သူတို့က မင်းကို မြင်နေတယ်။",
      mod: "ညာဘက်ခြံကို မြူဖုံးထားတယ်။ နား + ရေခဲပဲ ကို ယုံပါ။",
      startSun: 50,
      skySun: true,
      fog: true,
      plants: ["sunflower", "peashooter", "snowpea", "wallnut", "potatomine", "fumeshroom"],
      mowers: true,
      waves: [
        [{ t: 6, row: 2, type: "basic" }, { t: 12, row: 0, type: "basic" }, { t: 14, row: 4, type: "basic" }, { t: 18, row: 1, type: "basic" }],
        [{ t: 2, row: 1, type: "cone" }, { t: 4, row: 3, type: "basic" }, { t: 8, row: 0, type: "basic" }, { t: 10, row: 4, type: "cone" }, { t: 14, row: 2, type: "newspaper" }, { t: 18, row: 1, type: "basic" }],
        [{ t: 1, row: 0, type: "basic" }, { t: 2, row: 2, type: "cone" }, { t: 3, row: 4, type: "basic" }, { t: 7, row: 1, type: "door" }, { t: 10, row: 3, type: "cone" }, { t: 14, row: 2, type: "flag" }, { t: 16, row: 0, type: "newspaper" }, { t: 18, row: 4, type: "basic" }],
        [{ t: 1, row: 0, type: "cone" }, { t: 2, row: 1, type: "basic" }, { t: 3, row: 2, type: "door" }, { t: 4, row: 3, type: "basic" }, { t: 5, row: 4, type: "cone" }, { t: 10, row: 1, type: "bucket" }, { t: 12, row: 3, type: "door" }, { t: 15, row: 0, type: "runner" }, { t: 16, row: 2, type: "flag" }, { t: 17, row: 4, type: "runner" }, { t: 20, row: 2, type: "bucket" }],
      ],
      starRules: { time2: 170, time3: 130, noMower: true },
    },
    {
      id: "storm",
      num: 5,
      name: "မုတ်သုံမိုး · Monsoon",
      emoji: "⚡",
      theme: "storm",
      blurb: "မိုးကြိုးက ဘက်ရွေးပြီးပြီ။ Spoiler: မင်းဘက် မဟုတ်ဘူး။",
      mod: "လျှပ်စီးကျမယ် — အပင်ရော zombie ရော ရှို့မယ်။ ရွေ့လျားနေ!",
      startSun: 75,
      skySun: true,
      storm: true,
      plants: ["sunflower", "peashooter", "repeater", "wallnut", "jalapeno", "snowpea"],
      mowers: true,
      waves: [
        [{ t: 5, row: 1, type: "basic" }, { t: 8, row: 3, type: "basic" }, { t: 14, row: 0, type: "basic" }, { t: 16, row: 4, type: "cone" }],
        [{ t: 1, row: 0, type: "basic" }, { t: 2, row: 2, type: "cone" }, { t: 3, row: 4, type: "basic" }, { t: 8, row: 1, type: "newspaper" }, { t: 10, row: 3, type: "runner" }, { t: 14, row: 2, type: "flag" }],
        [{ t: 1, row: 0, type: "cone" }, { t: 2, row: 1, type: "basic" }, { t: 3, row: 2, type: "bucket" }, { t: 4, row: 3, type: "basic" }, { t: 5, row: 4, type: "cone" }, { t: 10, row: 1, type: "door" }, { t: 12, row: 3, type: "newspaper" }, { t: 16, row: 0, type: "runner" }, { t: 17, row: 2, type: "flag" }, { t: 18, row: 4, type: "runner" }],
        [{ t: 0.5, row: 0, type: "flag" }, { t: 1, row: 1, type: "cone" }, { t: 1.5, row: 2, type: "bucket" }, { t: 2, row: 3, type: "cone" }, { t: 2.5, row: 4, type: "flag" }, { t: 8, row: 0, type: "door" }, { t: 9, row: 2, type: "door" }, { t: 10, row: 4, type: "bucket" }, { t: 14, row: 1, type: "runner" }, { t: 15, row: 3, type: "runner" }, { t: 18, row: 2, type: "giant" }],
      ],
      starRules: { time2: 180, time3: 140, noMower: true },
    },
    {
      id: "conveyor",
      num: 6,
      name: "ညဈေး · Night Market",
      emoji: "🏮",
      theme: "factory",
      blurb: "နေရောင် ပိတ်ထားတယ်။ ဈေးသည်က ပေးချင်တာ ပေးမယ်။",
      mod: "နေရောင် မလို! အခမဲ့အပင်တွေ ခါးပတ်ပေါ် လှိမ့်လာမယ် — ဖမ်းပြီး စိုက်။",
      startSun: 0,
      skySun: false,
      conveyor: true,
      conveyorPool: ["peashooter", "peashooter", "wallnut", "snowpea", "repeater", "cherrybomb", "jalapeno", "potatomine", "starfruit", "tallnut", "peashooter", "wallnut"],
      plants: [], // none via sun
      mowers: true,
      waves: [
        [{ t: 4, row: 0, type: "basic" }, { t: 5, row: 2, type: "basic" }, { t: 6, row: 4, type: "basic" }, { t: 12, row: 1, type: "cone" }, { t: 14, row: 3, type: "basic" }],
        [{ t: 1, row: 0, type: "basic" }, { t: 2, row: 1, type: "cone" }, { t: 3, row: 2, type: "basic" }, { t: 4, row: 3, type: "cone" }, { t: 5, row: 4, type: "basic" }, { t: 10, row: 1, type: "newspaper" }, { t: 12, row: 3, type: "door" }, { t: 15, row: 2, type: "flag" }],
        [{ t: 1, row: 0, type: "runner" }, { t: 2, row: 2, type: "cone" }, { t: 3, row: 4, type: "runner" }, { t: 6, row: 1, type: "bucket" }, { t: 8, row: 3, type: "bucket" }, { t: 12, row: 0, type: "dancer" }, { t: 14, row: 2, type: "door" }, { t: 16, row: 4, type: "dancer" }],
        [{ t: 0.5, row: 0, type: "flag" }, { t: 1, row: 1, type: "cone" }, { t: 1.5, row: 2, type: "bucket" }, { t: 2, row: 3, type: "cone" }, { t: 2.5, row: 4, type: "flag" }, { t: 7, row: 0, type: "dancer" }, { t: 8, row: 2, type: "giant" }, { t: 9, row: 4, type: "dancer" }, { t: 12, row: 1, type: "runner" }, { t: 13, row: 3, type: "runner" }, { t: 16, row: 0, type: "door" }, { t: 17, row: 2, type: "bucket" }, { t: 18, row: 4, type: "door" }],
      ],
      starRules: { time2: 160, time3: 120, noMower: true },
    },
    {
      id: "balloon",
      num: 7,
      name: "တောင်ပျံပွဲ · Balloon Fest",
      emoji: "🎈",
      theme: "day",
      blurb: "အချို့ zombie တွေ လမ်းမလျှောက်တော့ဘူး — ပျံလာမယ်။",
      mod: "ပူဖောင်း zombie က အပင်ပေါ် ပျံကျော်တယ်! ထန်းကြီး + ဗုံးကပဲ တားနိုင်။",
      startSun: 100,
      skySun: true,
      plants: ["sunflower", "twinflower", "peashooter", "tallnut", "repeater", "cherrybomb", "starfruit"],
      mowers: true,
      waves: [
        [{ t: 5, row: 2, type: "basic" }, { t: 10, row: 0, type: "balloon" }, { t: 12, row: 4, type: "basic" }, { t: 16, row: 1, type: "balloon" }],
        [{ t: 1, row: 1, type: "basic" }, { t: 3, row: 3, type: "balloon" }, { t: 6, row: 0, type: "cone" }, { t: 8, row: 2, type: "balloon" }, { t: 10, row: 4, type: "cone" }, { t: 14, row: 1, type: "balloon" }, { t: 16, row: 3, type: "flag" }],
        [{ t: 1, row: 0, type: "balloon" }, { t: 2, row: 1, type: "basic" }, { t: 3, row: 2, type: "balloon" }, { t: 4, row: 3, type: "basic" }, { t: 5, row: 4, type: "balloon" }, { t: 10, row: 1, type: "door" }, { t: 12, row: 3, type: "bucket" }, { t: 14, row: 0, type: "balloon" }, { t: 15, row: 2, type: "dancer" }, { t: 16, row: 4, type: "balloon" }],
        [{ t: 0.5, row: 0, type: "balloon" }, { t: 1, row: 1, type: "cone" }, { t: 1.5, row: 2, type: "balloon" }, { t: 2, row: 3, type: "bucket" }, { t: 2.5, row: 4, type: "balloon" }, { t: 7, row: 0, type: "flag" }, { t: 8, row: 2, type: "giant" }, { t: 9, row: 4, type: "flag" }, { t: 12, row: 1, type: "balloon" }, { t: 13, row: 2, type: "balloon" }, { t: 14, row: 3, type: "balloon" }, { t: 18, row: 0, type: "dancer" }, { t: 19, row: 4, type: "dancer" }],
      ],
      starRules: { time2: 170, time3: 130, noMower: true },
    },
    {
      id: "boss",
      num: 8,
      name: "နတ်ဘုရား · Nat King",
      emoji: "👑",
      theme: "boss",
      blurb: "သူက စက်ရုပ် ယူလာတယ်။ မင်းက ဟင်းသီးဟင်းရွက်။ တရားတယ်။",
      mod: "နတ်ဘုရား Zombie ကို အနိုင်ယူ! ဖြည်းဖြည်းချီ၊ လက်ပါးစေ ခေါ်၊ ထိမှန်မှု ခံနိုင်။",
      startSun: 150,
      skySun: true,
      plants: ["sunflower", "twinflower", "peashooter", "repeater", "snowpea", "tallnut", "cherrybomb", "jalapeno", "starfruit"],
      mowers: true,
      boss: true,
      waves: [
        // warmup
        [{ t: 4, row: 1, type: "basic" }, { t: 6, row: 3, type: "basic" }, { t: 10, row: 0, type: "cone" }, { t: 12, row: 4, type: "cone" }, { t: 16, row: 2, type: "flag" }],
        // pressure
        [{ t: 1, row: 0, type: "basic" }, { t: 2, row: 2, type: "cone" }, { t: 3, row: 4, type: "basic" }, { t: 6, row: 1, type: "door" }, { t: 8, row: 3, type: "newspaper" }, { t: 12, row: 0, type: "balloon" }, { t: 14, row: 4, type: "balloon" }, { t: 16, row: 2, type: "bucket" }],
        // boss arrives mid-wave via special spawn + minions
        [
          { t: 1, row: 2, type: "boss" },
          { t: 2, row: 0, type: "flag" },
          { t: 3, row: 4, type: "flag" },
          { t: 8, row: 1, type: "cone" },
          { t: 10, row: 3, type: "cone" },
          { t: 14, row: 0, type: "dancer" },
          { t: 16, row: 4, type: "dancer" },
          { t: 20, row: 1, type: "bucket" },
          { t: 22, row: 3, type: "bucket" },
          { t: 26, row: 0, type: "runner" },
          { t: 27, row: 2, type: "giant" },
          { t: 28, row: 4, type: "runner" },
          { t: 34, row: 1, type: "door" },
          { t: 36, row: 3, type: "door" },
          { t: 40, row: 0, type: "balloon" },
          { t: 41, row: 2, type: "flag" },
          { t: 42, row: 4, type: "balloon" },
        ],
      ],
      starRules: { time2: 220, time3: 170, noMower: true },
    },
  ];

  // Endless is generated dynamically
  const ENDLESS_ID = "endless";

  // ═══════════════════════════════════════════════════════════
  // SAVE / PROGRESS
  // ═══════════════════════════════════════════════════════════
  function loadSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return { unlocked: 1, stars: {}, endlessBest: 0 };
  }
  function writeSave(s) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
  }
  let save = loadSave();

  // ═══════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════
  const state = {
    mode: "campaign", // campaign | endless
    levelIdx: 0,
    level: null,
    running: false,
    paused: false,
    sun: 50,
    wave: 0,
    waveTime: 0,
    waveSpawnIdx: 0,
    waveActive: false,
    plants: [],
    zombies: [],
    peas: [],
    suns: [],
    mowers: [],
    conveyorItems: [],
    selectedPlant: null,
    freePlant: null, // from conveyor {type}
    shovelMode: false,
    cooldowns: {},
    skySunTimer: 0,
    stormTimer: 0,
    conveyorTimer: 0,
    bossSummonTimer: 0,
    gameTime: 0,
    zombiesSpawned: 0,
    zombiesTotal: 0,
    zombiesKilled: 0,
    mowerUsed: false,
    won: false,
    lost: false,
    nextId: 1,
    endlessWave: 0,
  };

  // ═══════════════════════════════════════════════════════════
  // DOM
  // ═══════════════════════════════════════════════════════════
  const $ = (s) => document.querySelector(s);
  const els = {
    startScreen: $("#start-screen"),
    mapScreen: $("#map-screen"),
    gameScreen: $("#game-screen"),
    lawn: $("#lawn"),
    lawnWrap: $("#lawn-wrap"),
    stage: $("#stage"),
    entities: $("#entities"),
    projectiles: $("#projectiles"),
    suns: $("#suns"),
    fx: $("#fx"),
    fog: $("#fog"),
    sunCount: $("#sun-count"),
    sunBank: $("#sun-bank"),
    seedBar: $("#seed-bar"),
    conveyor: $("#conveyor"),
    conveyorTrack: $("#conveyor-track"),
    waveCount: $("#wave-count"),
    waveTotal: $("#wave-total"),
    progressFill: $("#progress-fill"),
    progressZombie: document.querySelector(".progress-zombie"),
    pauseOverlay: $("#pause-overlay"),
    endOverlay: $("#end-overlay"),
    introOverlay: $("#intro-overlay"),
    endTitle: $("#end-title"),
    endMsg: $("#end-msg"),
    endEmoji: $("#end-emoji"),
    endStars: $("#end-stars"),
    shovel: $("#shovel-slot"),
    levelChip: $("#level-chip"),
    objective: $("#objective"),
    bossBar: $("#boss-bar"),
    bossName: $("#boss-name"),
    bossFill: $("#boss-fill"),
    mapPath: $("#map-path"),
    totalStars: $("#total-stars"),
    saveHint: $("#save-hint"),
    pauseHint: $("#pause-hint"),
    btnStart: $("#btn-start"),
    btnEndless: $("#btn-endless"),
    btnPause: $("#btn-pause"),
    btnMute: $("#btn-mute"),
    btnMuteMenu: $("#btn-mute-menu"),
    btnResume: $("#btn-resume"),
    btnRestart: $("#btn-restart"),
    btnMenu: $("#btn-menu"),
    btnAgain: $("#btn-again"),
    btnNext: $("#btn-next"),
    btnEndMenu: $("#btn-end-menu"),
    btnMapBack: $("#btn-map-back"),
    btnIntroGo: $("#btn-intro-go"),
    btnIntroBack: $("#btn-intro-back"),
    introEmoji: $("#intro-emoji"),
    introLevel: $("#intro-level"),
    introTitle: $("#intro-title"),
    introDesc: $("#intro-desc"),
    introMod: $("#intro-mod"),
    introPlants: $("#intro-plants"),
  };

  // ═══════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════
  function uid() { return state.nextId++; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let layout = { w: 0, h: 0, cell: 0 };

  function cellSize() {
    const lawn = els.lawn.getBoundingClientRect();
    // Prefer measured lawn; fall back to last fit
    const lawnW = lawn.width || layout.w;
    const lawnH = lawn.height || layout.h;
    return {
      w: lawnW / COLS,
      h: lawnH / ROWS,
      lawnW,
      lawnH,
    };
  }
  function colToX(col, frac = 0.5) { return (col + frac) * cellSize().w; }
  function rowToY(row, frac = 0.5) { return (row + frac) * cellSize().h; }
  function xToCol(x) { return clamp(Math.floor(x / cellSize().w), 0, COLS - 1); }

  /** Fit 9×5 lawn into the stage; scale entity coords when size changes. */
  function fitLayout() {
    if (!els.stage || !els.lawnWrap || !els.lawn) return;

    const stage = els.stage.getBoundingClientRect();
    if (stage.width < 40 || stage.height < 40) return;

    const house = document.querySelector(".house, .pagoda-house");
    const fence = document.querySelector(".fence, .bamboo-fence");
    const houseW = house && getComputedStyle(house).display !== "none"
      ? house.getBoundingClientRect().width
      : 0;
    const fenceW = fence && getComputedStyle(fence).display !== "none"
      ? fence.getBoundingClientRect().width
      : 0;

    const availW = Math.max(80, stage.width - houseW - fenceW - 4);
    const availH = Math.max(80, stage.height - 4);

    // Nearly-square cells, fully visible
    let cell = Math.min(availW / COLS, availH / ROWS);

    // Desktop comfort cap / floor
    const shortMobile = window.matchMedia("(max-height: 520px), (max-width: 900px)").matches;
    if (!shortMobile) cell = clamp(cell, 56, 96);
    else cell = Math.max(28, cell);

    const lawnW = cell * COLS;
    const lawnH = cell * ROWS;

    const prevW = layout.w;
    const scale = prevW > 0 ? lawnW / prevW : 1;

    els.lawnWrap.style.width = `${lawnW}px`;
    els.lawnWrap.style.height = `${lawnH}px`;
    document.documentElement.style.setProperty("--col-w", `${cell}px`);
    document.documentElement.style.setProperty("--row-h", `${cell}px`);

    layout = { w: lawnW, h: lawnH, cell };

    if (prevW > 0 && Math.abs(scale - 1) > 0.005) {
      for (const z of state.zombies) z.x *= scale;
      for (const p of state.peas) {
        p.x *= scale;
        p.y *= scale;
      }
      for (const s of state.suns) {
        s.x *= scale;
        s.y *= scale;
        s.targetY *= scale;
        if (!s.collecting && s.el) {
          s.el.style.left = `${s.x}px`;
          s.el.style.top = `${s.y}px`;
        }
      }
    }

    // Sync entity box sizes + positions
    for (const p of state.plants) {
      p.el.style.width = `${cell}px`;
      p.el.style.height = `${cell}px`;
      positionEntity(p.el, colToX(p.col), rowToY(p.row));
    }
    for (const z of state.zombies) {
      const zw = z.isBoss ? cell * 1.3 : z.type === "giant" ? cell * 1.1 : cell * 0.85;
      z.el.style.width = `${zw}px`;
      z.el.style.height = `${cell}px`;
      positionEntity(z.el, z.x, rowToY(z.row));
    }
    for (const pea of state.peas) positionEntity(pea.el, pea.x, pea.y, true);
    for (const m of state.mowers) {
      if (!m.used && m.el) {
        m.el.style.height = `${Math.max(20, cell - 12)}px`;
        positionEntity(m.el, m.x, rowToY(m.row));
      }
    }
  }

  /** Phones in portrait during gameplay → ask to rotate. Menus stay usable. */
  function updateOrientationGate() {
    const overlay = document.getElementById("rotate-overlay");
    if (!overlay) return;

    const portrait = window.matchMedia("(orientation: portrait)").matches;
    const narrow = Math.min(window.innerWidth, window.innerHeight) <= 700;
    const playing =
      els.gameScreen.classList.contains("active") &&
      !els.startScreen.classList.contains("active");

    // Gate only while the game board is showing
    const need = portrait && narrow && playing;
    document.body.classList.toggle("need-landscape", need);
    overlay.hidden = !need;

    if (!need) {
      // After rotating back, reflow the board
      requestAnimationFrame(() => fitLayout());
    }
  }

  function tryLockLandscape() {
    try {
      const o = screen.orientation;
      if (o && o.lock) o.lock("landscape").catch(() => {});
    } catch (_) {}
  }

  function isBlocked(row, col) {
    const b = state.level?.blocked;
    if (!b) return false;
    return b.some(([r, c]) => r === row && c === col);
  }

  function totalStars() {
    return Object.values(save.stars).reduce((s, n) => s + (n || 0), 0);
  }

  // ═══════════════════════════════════════════════════════════
  // AUDIO (see audio.js)
  // ═══════════════════════════════════════════════════════════
  const A = () => window.GardenAudio;
  function ensureAudio() {
    if (!A()) return;
    A().unlock();
  }
  const sfx = {
    plant: () => A()?.sfx.plant(),
    shoot: () => A()?.sfx.shoot(),
    hit: () => A()?.sfx.hit(),
    sun: () => A()?.sfx.sun(),
    explode: () => A()?.sfx.explode(),
    zombie: () => A()?.sfx.zombie(),
    mow: () => A()?.sfx.mow(),
    thunder: () => A()?.sfx.thunder(),
    win: () => A()?.sfx.win(),
    lose: () => A()?.sfx.lose(),
    select: () => A()?.sfx.select(),
    error: () => A()?.sfx.error(),
    grab: () => A()?.sfx.grab(),
    star: () => A()?.sfx.star(),
    wave: () => A()?.sfx.wave(),
    chomp: () => A()?.sfx.chomp(),
    shovel: () => A()?.sfx.shovel(),
    mineArm: () => A()?.sfx.mineArm(),
    balloon: () => A()?.sfx.balloon(),
    boss: () => A()?.sfx.boss(),
    click: () => A()?.sfx.click(),
  };

  function syncMuteButtons() {
    const muted = A()?.isMuted();
    const label = muted ? "🔇" : "🔊";
    const menu = document.getElementById("btn-mute-menu");
    const hud = document.getElementById("btn-mute");
    if (menu) menu.textContent = muted ? "🔇 အသံ Off" : "🔊 အသံ On";
    if (hud) hud.textContent = label;
  }

  function toggleMute() {
    ensureAudio();
    A()?.toggleMute();
    syncMuteButtons();
    sfx.click();
  }

  function playThemeMusic(theme) {
    ensureAudio();
    A()?.setTheme(theme || "day");
    A()?.startMusic(theme || "day");
  }

  // ═══════════════════════════════════════════════════════════
  // SCREENS
  // ═══════════════════════════════════════════════════════════
  function showScreen(name) {
    els.startScreen.classList.toggle("active", name === "start");
    els.mapScreen.classList.toggle("active", name === "map");
    els.gameScreen.classList.toggle("active", name === "game");
    if (name === "start") {
      A()?.stopGroans();
      playThemeMusic("menu");
    } else if (name === "map") {
      A()?.stopGroans();
      playThemeMusic("map");
    }
    updateOrientationGate();
  }

  function refreshSaveHint() {
    const stars = totalStars();
    const unlocked = save.unlocked;
    els.saveHint.textContent = stars
      ? `${stars} ★ ရပြီး · အဆင့် ${Math.min(unlocked, LEVELS.length)} ဖွင့်ပြီး`
      : "ကမ်ပိန်းအသစ် — ရန်ကုန်ခြံ က စလိုက်ပါ";
    els.totalStars.textContent = stars;
  }

  function buildMap() {
    els.mapPath.innerHTML = "";
    LEVELS.forEach((lv, i) => {
      const unlocked = i < save.unlocked;
      const stars = save.stars[lv.id] || 0;
      const node = document.createElement("button");
      node.type = "button";
      node.className = "map-node" + (unlocked ? " unlocked" : " locked") + (stars ? " cleared" : "");
      node.innerHTML = `
        <span class="node-emoji">${unlocked ? lv.emoji : "🔒"}</span>
        <span class="node-num">အဆင့် ${lv.num}</span>
        <span class="node-name">${unlocked ? lv.name : "???"}</span>
        <span class="node-stars">${unlocked ? "★".repeat(stars) + "☆".repeat(3 - stars) : ""}</span>
      `;
      if (unlocked) {
        node.addEventListener("click", () => showIntro(i));
      }
      els.mapPath.appendChild(node);
      if (i < LEVELS.length - 1) {
        const path = document.createElement("div");
        path.className = "map-connector" + (i + 1 < save.unlocked ? " lit" : "");
        els.mapPath.appendChild(path);
      }
    });
    // endless node
    const endlessUnlocked = save.unlocked > LEVELS.length || (save.stars.boss || 0) > 0;
    const conn = document.createElement("div");
    conn.className = "map-connector" + (endlessUnlocked ? " lit" : "");
    els.mapPath.appendChild(conn);

    const en = document.createElement("button");
    en.type = "button";
    en.className = "map-node endless" + (endlessUnlocked ? " unlocked" : " locked");
    en.innerHTML = `
      <span class="node-emoji">${endlessUnlocked ? "♾️" : "🔒"}</span>
      <span class="node-num">အပို</span>
      <span class="node-name">${endlessUnlocked ? "အဆုံးမဲ့ · Endless" : "???"}</span>
      <span class="node-stars">${save.endlessBest ? "အကောင်းဆုံး လှိုင်း " + save.endlessBest : ""}</span>
    `;
    if (endlessUnlocked) en.addEventListener("click", () => startEndless());
    els.mapPath.appendChild(en);

    refreshSaveHint();
  }

  function showIntro(idx) {
    const lv = LEVELS[idx];
    state.levelIdx = idx;
    state.level = lv;
    state.mode = "campaign";
    els.introEmoji.textContent = lv.emoji;
    els.introLevel.textContent = `အဆင့် ${lv.num} / ${LEVELS.length}`;
    els.introTitle.textContent = lv.name;
    els.introDesc.textContent = lv.blurb;
    els.introMod.innerHTML = `<strong>Twist:</strong> ${lv.mod}`;
    els.introPlants.innerHTML = "";
    const plantList = lv.conveyor ? ["📦 Conveyor plants"] : lv.plants;
    plantList.forEach((id) => {
      const span = document.createElement("span");
      span.className = "intro-plant-chip";
      if (id.startsWith("📦")) {
        span.textContent = id;
      } else {
        const p = PLANTS[id];
        span.textContent = `${p.emoji} ${p.name}`;
      }
      els.introPlants.appendChild(span);
    });
    els.introOverlay.classList.remove("hidden");
  }

  // ═══════════════════════════════════════════════════════════
  // UI BUILDERS
  // ═══════════════════════════════════════════════════════════
  function applyTheme(theme) {
    document.body.dataset.theme = theme || "day";
    els.gameScreen.dataset.theme = theme || "day";
  }

  function buildLawn() {
    els.lawn.innerHTML = "";
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        const blocked = isBlocked(r, c);
        cell.className = "cell" + ((r + c) % 2 === 0 ? " lite" : " dark") + (blocked ? " blocked" : "");
        cell.dataset.row = r;
        cell.dataset.col = c;
        if (blocked) {
          cell.title = "Cracked ground — can't plant";
        } else {
          cell.addEventListener("click", () => onCellClick(r, c));
          cell.addEventListener("mouseenter", () => onCellHover(r, c, true));
          cell.addEventListener("mouseleave", () => onCellHover(r, c, false));
        }
        els.lawn.appendChild(cell);
      }
    }
  }

  function buildSeedBar() {
    els.seedBar.innerHTML = "";
    const list = state.level?.plants || [];
    if (state.level?.conveyor) {
      els.seedBar.classList.add("hidden");
      els.conveyor.classList.remove("hidden");
      els.sunBank.classList.add("hidden");
    } else {
      els.seedBar.classList.remove("hidden");
      els.conveyor.classList.add("hidden");
      els.sunBank.classList.remove("hidden");
      for (const id of list) {
        const p = PLANTS[id];
        const pkt = document.createElement("div");
        pkt.className = "seed-packet";
        pkt.dataset.id = id;
        pkt.dataset.emoji = p.emoji;
        pkt.title = `${p.name} — ${p.cost} sun`;
        pkt.innerHTML = `<div class="cd-overlay"></div><span class="cost">${p.cost}</span>`;
        pkt.addEventListener("click", () => selectPlant(id));
        els.seedBar.appendChild(pkt);
      }
    }
  }

  function updateSeedBar() {
    if (state.level?.conveyor) return;
    const list = state.level?.plants || [];
    for (const id of list) {
      const p = PLANTS[id];
      const pkt = els.seedBar.querySelector(`[data-id="${id}"]`);
      if (!pkt) continue;
      const cd = state.cooldowns[id] || 0;
      const canAfford = state.sun >= p.cost;
      pkt.classList.toggle("selected", state.selectedPlant === id);
      pkt.classList.toggle("disabled", !canAfford && cd <= 0);
      pkt.classList.toggle("cooldown", cd > 0);
      const overlay = pkt.querySelector(".cd-overlay");
      if (cd > 0) {
        overlay.style.transform = `scaleY(${cd / p.cooldown})`;
        overlay.style.transition = "none";
      } else {
        overlay.style.transform = "scaleY(0)";
      }
    }
  }

  function updateSunUI() {
    els.sunCount.textContent = Math.floor(state.sun);
  }

  function updateWaveUI() {
    const totalWaves = state.mode === "endless"
      ? "∞"
      : (state.level?.waves?.length || 1);
    const cur = state.mode === "endless" ? state.endlessWave + 1 : Math.min(state.wave + 1, totalWaves);
    els.waveCount.textContent = cur;
    els.waveTotal.textContent = totalWaves;

    let progress = 0;
    if (state.mode === "endless") {
      progress = Math.min(100, (state.endlessWave / 20) * 100);
    } else if (state.zombiesTotal > 0) {
      progress = (state.zombiesKilled / state.zombiesTotal) * 100;
    }
    els.progressFill.style.width = `${clamp(progress, 0, 100)}%`;
    if (els.progressZombie) {
      els.progressZombie.style.right = `${clamp(100 - progress, 0, 96)}%`;
    }

    // Boss bar
    const boss = state.zombies.find((z) => z.isBoss);
    if (boss) {
      els.bossBar.classList.remove("hidden");
      els.bossFill.style.width = `${clamp((boss.hp / boss.maxHp) * 100, 0, 100)}%`;
    } else if (state.level?.boss && state.wave >= (state.level.waves.length - 1)) {
      // keep visible until dead handled
    } else {
      els.bossBar.classList.add("hidden");
    }
  }

  function setObjective(text) {
    els.objective.textContent = text || "";
    els.objective.classList.toggle("hidden", !text);
  }

  function floatText(x, y, text, color) {
    const el = document.createElement("div");
    el.className = "float-text";
    el.textContent = text;
    if (color) el.style.color = color;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    els.fx.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  function banner(text, color) {
    floatText(cellSize().lawnW / 2, cellSize().lawnH / 2, text, color || "#fff");
  }

  // ═══════════════════════════════════════════════════════════
  // SELECTION / PLANTING
  // ═══════════════════════════════════════════════════════════
  function selectPlant(id) {
    if (!state.running || state.paused) return;
    if (state.level?.conveyor) return;
    const p = PLANTS[id];
    if ((state.cooldowns[id] || 0) > 0) return sfx.error();
    if (state.sun < p.cost) return sfx.error();
    if (state.selectedPlant === id) {
      state.selectedPlant = null;
    } else {
      state.selectedPlant = id;
      state.freePlant = null;
      state.shovelMode = false;
      sfx.select();
    }
    syncCursors();
    updateSeedBar();
  }

  function toggleShovel() {
    if (!state.running || state.paused) return;
    state.shovelMode = !state.shovelMode;
    state.selectedPlant = null;
    state.freePlant = null;
    syncCursors();
    updateSeedBar();
    sfx.select();
  }

  function clearSelection() {
    state.selectedPlant = null;
    state.freePlant = null;
    state.shovelMode = false;
    syncCursors();
    updateSeedBar();
    clearHighlights();
    // deselect conveyor items
    els.conveyorTrack.querySelectorAll(".conv-item").forEach((e) => e.classList.remove("selected"));
  }

  function syncCursors() {
    document.body.classList.toggle("planting-cursor", !!(state.selectedPlant || state.freePlant));
    document.body.classList.toggle("shovel-cursor", state.shovelMode);
    els.shovel.classList.toggle("selected", state.shovelMode);
  }

  function clearHighlights() {
    els.lawn.querySelectorAll(".cell").forEach((c) => c.classList.remove("hl-ok", "hl-bad"));
  }

  function onCellHover(row, col, enter) {
    clearHighlights();
    if (!enter || !state.running || state.paused) return;
    const cell = els.lawn.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (!cell || cell.classList.contains("blocked")) return;

    if (state.shovelMode) {
      cell.classList.add(state.plants.some((p) => p.row === row && p.col === col) ? "hl-ok" : "hl-bad");
      return;
    }
    if (state.selectedPlant || state.freePlant) {
      const occ = state.plants.some((p) => p.row === row && p.col === col);
      cell.classList.add(occ ? "hl-bad" : "hl-ok");
    }
  }

  function onCellClick(row, col) {
    if (!state.running || state.paused || isBlocked(row, col)) return;

    if (state.shovelMode) {
      const plant = state.plants.find((p) => p.row === row && p.col === col);
      if (plant) {
        removePlant(plant);
        sfx.shovel();
        floatText(colToX(col), rowToY(row), "⛏", "#fff");
      } else sfx.error();
      return;
    }

    // Conveyor free plant
    if (state.freePlant) {
      if (state.plants.some((p) => p.row === row && p.col === col)) return sfx.error();
      const type = state.freePlant.type;
      const itemId = state.freePlant.itemId;
      placePlant(type, row, col);
      // remove conveyor item
      state.conveyorItems = state.conveyorItems.filter((c) => c.id !== itemId);
      const dom = els.conveyorTrack.querySelector(`[data-cid="${itemId}"]`);
      if (dom) dom.remove();
      state.freePlant = null;
      clearSelection();
      sfx.plant();
      return;
    }

    if (!state.selectedPlant) return;
    const type = state.selectedPlant;
    const def = PLANTS[type];
    if (state.sun < def.cost || (state.cooldowns[type] || 0) > 0) return sfx.error();
    if (state.plants.some((p) => p.row === row && p.col === col)) return sfx.error();

    placePlant(type, row, col);
    state.sun -= def.cost;
    state.cooldowns[type] = def.cooldown;
    updateSunUI();
    clearSelection();
    sfx.plant();
  }

  // ═══════════════════════════════════════════════════════════
  // PLANTS LOGIC
  // ═══════════════════════════════════════════════════════════
  function placePlant(type, row, col) {
    const def = PLANTS[type];
    const el = document.createElement("div");
    el.className = `plant ${type}`;
    if (def.mine) el.classList.add("arming");
    el.innerHTML = `<div class="sprite"></div><div class="hp-bar"><div class="hp-fill" style="width:100%"></div></div>`;
    positionEntity(el, colToX(col), rowToY(row));
    els.entities.appendChild(el);

    const plant = {
      id: uid(), type, row, col,
      hp: def.hp, maxHp: def.hp,
      timer: type.includes("flower") ? def.sunInterval * 0.35 : 0,
      fireCd: 0.25,
      fuse: def.fuse || 0,
      armTimer: def.armTime || 0,
      armed: !def.mine,
      el,
    };
    state.plants.push(plant);
    requestAnimationFrame(() => positionEntity(el, colToX(col), rowToY(row)));
  }

  function removePlant(plant) {
    plant.el.remove();
    state.plants = state.plants.filter((p) => p.id !== plant.id);
  }

  function damagePlant(plant, dmg) {
    plant.hp -= dmg;
    plant.el.classList.add("hurt", "show-hp");
    setTimeout(() => plant.el.classList.remove("hurt"), 280);
    const fill = plant.el.querySelector(".hp-fill");
    if (fill) fill.style.width = `${clamp((plant.hp / plant.maxHp) * 100, 0, 100)}%`;
    if (plant.type === "wallnut" || plant.type === "tallnut") {
      const ratio = plant.hp / plant.maxHp;
      plant.el.classList.toggle("damaged", ratio < 0.6);
      plant.el.classList.toggle("critical", ratio < 0.3);
    }
    if (plant.hp <= 0) removePlant(plant);
  }

  function updatePlants(dt) {
    for (const plant of [...state.plants]) {
      const def = PLANTS[plant.type];

      // Instant explosives
      if (def.instant) {
        plant.fuse -= dt;
        if (plant.fuse <= 0) explodePlant(plant);
        continue;
      }

      // Potato mine arming
      if (def.mine) {
        if (!plant.armed) {
          plant.armTimer -= dt;
          if (plant.armTimer <= 0) {
            plant.armed = true;
            plant.el.classList.remove("arming");
            plant.el.classList.add("armed");
            floatText(colToX(plant.col), rowToY(plant.row) - 20, "ARMED", "#8d6e63");
            sfx.mineArm();
          }
        } else {
          // Detonate on contact
          const { w } = cellSize();
          const hit = state.zombies.find(
            (z) => z.row === plant.row && Math.abs(z.x - colToX(plant.col)) < w * 0.4 && !z.flying
          );
          if (hit) explodePlant(plant);
        }
        continue;
      }

      // Sun producers
      if (def.sunInterval) {
        plant.timer -= dt;
        if (plant.timer <= 0) {
          plant.timer = def.sunInterval;
          spawnSun(colToX(plant.col) + rand(-12, 12), rowToY(plant.row) - 8, true, def.sunAmount || 25);
        }
      }

      // Shooters
      if (def.fireInterval) {
        plant.fireCd -= dt;
        if (plant.fireCd <= 0) {
          if (def.starShot) {
            if (state.zombies.some((z) => Math.abs(z.row - plant.row) <= 1 || Math.abs(z.x - colToX(plant.col)) < cellSize().w * 5)) {
              fireStars(plant, def);
              plant.fireCd = def.fireInterval;
            }
          } else if (def.pierce) {
            const target = findZombieInRow(plant.row, colToX(plant.col), def.range);
            if (target) {
              fireFume(plant, def);
              plant.fireCd = def.fireInterval;
            }
          } else {
            const rangeCols = def.shortRange || 99;
            const target = findZombieInRow(plant.row, colToX(plant.col), rangeCols);
            if (target) {
              // balloons: normal peas miss unless we allow hit in air for star/fume/explode only
              firePea(plant, def);
              plant.fireCd = def.fireInterval;
              if (def.double) {
                const id = plant.id;
                setTimeout(() => {
                  const p = state.plants.find((x) => x.id === id);
                  if (p && state.running) firePea(p, def);
                }, 160);
              }
            }
          }
        }
      }
    }
  }

  function findZombieInRow(row, minX, maxRangeCols = 99) {
    const maxX = minX + maxRangeCols * cellSize().w;
    let best = null, bestX = Infinity;
    for (const z of state.zombies) {
      if (z.row !== row) continue;
      if (z.flying) continue; // normal shots miss balloons
      if (z.x > minX - 10 && z.x < maxX && z.x < bestX) {
        best = z; bestX = z.x;
      }
    }
    return best;
  }

  function firePea(plant, def) {
    const x = colToX(plant.col, 0.75);
    const y = rowToY(plant.row, 0.42);
    spawnProjectile({
      x, y, row: plant.row, speed: 290, damage: def.damage,
      slow: !!def.slow, ice: !!def.slow, hitFlying: false,
    });
    sfx.shoot();
  }

  function fireFume(plant, def) {
    // Instant pierce damage in range
    const minX = colToX(plant.col);
    const maxX = minX + (def.range || 4) * cellSize().w;
    const y = rowToY(plant.row, 0.45);
    // Visual puff
    const puff = document.createElement("div");
    puff.className = "fume-blast";
    puff.style.left = `${minX}px`;
    puff.style.top = `${y - 18}px`;
    puff.style.width = `${maxX - minX}px`;
    els.fx.appendChild(puff);
    setTimeout(() => puff.remove(), 280);

    for (const z of [...state.zombies]) {
      if (z.row === plant.row && z.x >= minX - 10 && z.x <= maxX && !z.flying) {
        damageZombie(z, def.damage);
      }
    }
    sfx.shoot();
  }

  function fireStars(plant, def) {
    const cx = colToX(plant.col);
    const cy = rowToY(plant.row, 0.4);
    // 5 directions
    const dirs = [
      { dx: 1, dy: 0 },
      { dx: 0.7, dy: -0.7 },
      { dx: 0.7, dy: 0.7 },
      { dx: 0, dy: -1 },
      { dx: 0, dy: 1 },
    ];
    for (const d of dirs) {
      spawnProjectile({
        x: cx, y: cy, row: plant.row,
        speed: 240, damage: def.damage,
        vx: d.dx, vy: d.dy, star: true, hitFlying: true,
      });
    }
    sfx.shoot();
  }

  function spawnProjectile(opts) {
    const el = document.createElement("div");
    el.className = "pea" + (opts.ice ? " ice" : "") + (opts.star ? " star" : "");
    if (opts.star) el.textContent = "★";
    positionEntity(el, opts.x, opts.y, true);
    els.projectiles.appendChild(el);
    state.peas.push({
      id: uid(),
      x: opts.x, y: opts.y,
      row: opts.row,
      speed: opts.speed,
      damage: opts.damage,
      slow: opts.slow,
      vx: opts.vx ?? 1,
      vy: opts.vy ?? 0,
      star: !!opts.star,
      hitFlying: !!opts.hitFlying,
      el,
    });
  }

  function explodePlant(plant) {
    const def = PLANTS[plant.type];
    const cx = colToX(plant.col);
    const cy = rowToY(plant.row);
    const { w, h } = cellSize();

    if (def.aoe === "row" || plant.type === "jalapeno") {
      // Row fire
      const fire = document.createElement("div");
      fire.className = "row-fire";
      fire.style.top = `${plant.row * h}px`;
      fire.style.height = `${h}px`;
      els.fx.appendChild(fire);
      setTimeout(() => fire.remove(), 600);
      for (const z of [...state.zombies]) {
        if (z.row === plant.row) damageZombie(z, def.blastDamage);
      }
    } else {
      // 3x3
      const boom = document.createElement("div");
      boom.className = "explosion";
      boom.style.left = `${cx}px`;
      boom.style.top = `${cy}px`;
      els.fx.appendChild(boom);
      setTimeout(() => boom.remove(), 550);
      for (const z of [...state.zombies]) {
        if (Math.abs(z.row - plant.row) <= 1 && Math.abs(z.x - cx) <= w * 1.65) {
          damageZombie(z, def.blastDamage);
        }
      }
    }
    sfx.explode();
    removePlant(plant);
  }

  // ═══════════════════════════════════════════════════════════
  // ZOMBIES
  // ═══════════════════════════════════════════════════════════
  function spawnZombie(row, type = "basic") {
    const def = ZOMBIE_TYPES[type] || ZOMBIE_TYPES.basic;
    const { lawnW } = cellSize();
    const el = document.createElement("div");
    let cls = `zombie ${type}`;
    if (def.flying) cls += " flying";
    if (def.isBoss) cls += " boss";
    el.className = cls;
    el.innerHTML = `<div class="hp-bar"><div class="hp-fill" style="width:100%"></div></div><div class="sprite"></div>`;
    const x = lawnW + (def.isBoss ? 60 : 40);
    positionEntity(el, x, rowToY(row));
    els.entities.appendChild(el);

    const z = {
      id: uid(), type, row, x,
      hp: def.hp, maxHp: def.hp,
      speed: def.speed, baseSpeed: def.speed,
      damage: def.damage, eatInterval: def.eatInterval,
      eatCd: 0, slowTimer: 0, eating: false,
      flying: !!def.flying,
      isBoss: !!def.isBoss,
      enrageAt: def.enrageAt, enraged: false, enrageSpeed: def.enrageSpeed,
      summon: !!def.summon, summoned: false,
      smash: !!def.smash,
      el,
    };
    state.zombies.push(z);
    state.zombiesSpawned++;
    if (def.flying) sfx.balloon();
    else if (!def.isBoss) sfx.zombie();
    else {
      banner("နတ်ဘုရား ရောက်ပြီ!", "#ef5350");
      els.bossBar.classList.remove("hidden");
      els.bossName.textContent = "နတ်ဘုရား ZOMBIE";
      sfx.boss();
      playThemeMusic("boss");
    }
    updateWaveUI();
  }

  function damageZombie(z, dmg) {
    // Boss takes reduced small hits
    let d = dmg;
    if (z.isBoss && dmg < 100) d = Math.floor(dmg * 0.65);

    z.hp -= d;
    z.el.classList.add("hurt");
    setTimeout(() => z.el.classList.remove("hurt"), 100);
    const fill = z.el.querySelector(".hp-fill");
    if (fill) fill.style.width = `${clamp((z.hp / z.maxHp) * 100, 0, 100)}%`;
    if (z.isBoss) updateWaveUI();

    // Newspaper enrage
    if (z.enrageAt && !z.enraged && z.hp / z.maxHp <= z.enrageAt) {
      z.enraged = true;
      z.speed = z.enrageSpeed;
      z.baseSpeed = z.enrageSpeed;
      z.el.classList.add("enraged");
      floatText(z.x, rowToY(z.row) - 20, "ANGRY!", "#ff1744");
    }

    sfx.hit();
    if (z.hp <= 0) killZombie(z);
  }

  function killZombie(z) {
    if (z._dead) return;
    z._dead = true;
    z.el.style.transition = "opacity 0.3s, transform 0.3s";
    z.el.style.opacity = "0";
    z.el.style.transform = z.isBoss
      ? "scale(1.4) rotate(15deg)"
      : "rotate(70deg) translateY(20px)";
    setTimeout(() => z.el.remove(), 320);
    state.zombies = state.zombies.filter((x) => x.id !== z.id);
    state.zombiesKilled++;
    if (z.isBoss) {
      els.bossBar.classList.add("hidden");
      banner("နတ်ဘုရား ပြို!", "#ffd93d");
      // Win after boss + clear remaining shortly handled by wave logic
    }
    updateWaveUI();
  }

  function updateZombies(dt) {
    const { w } = cellSize();

    for (const z of [...state.zombies]) {
      if (z.slowTimer > 0) {
        z.slowTimer -= dt;
        z.speed = z.baseSpeed * 0.45;
        z.el.classList.add("frozen");
        if (z.slowTimer <= 0) {
          z.speed = z.baseSpeed;
          z.el.classList.remove("frozen");
        }
      }

      // Dancer summons backup dancers once
      if (z.summon && !z.summoned && z.x < cellSize().lawnW * 0.75) {
        z.summoned = true;
        const rows = [z.row - 1, z.row + 1].filter((r) => r >= 0 && r < ROWS);
        for (const r of rows) {
          // spawn backup slightly behind
          setTimeout(() => {
            if (state.running && !state.lost) {
              const def = ZOMBIE_TYPES.basic;
              const el = document.createElement("div");
              el.className = "zombie basic backup";
              el.innerHTML = `<div class="hp-bar"><div class="hp-fill" style="width:100%"></div></div><div class="sprite"></div>`;
              const x = z.x + 30;
              positionEntity(el, x, rowToY(r));
              els.entities.appendChild(el);
              state.zombies.push({
                id: uid(), type: "basic", row: r, x,
                hp: def.hp, maxHp: def.hp, speed: def.speed, baseSpeed: def.speed,
                damage: def.damage, eatInterval: def.eatInterval, eatCd: 0,
                slowTimer: 0, eating: false, flying: false, isBoss: false, el,
              });
              state.zombiesTotal++;
              state.zombiesSpawned++;
            }
          }, 200);
        }
        floatText(z.x, rowToY(z.row) - 24, "BACKUP!", "#ce93d8");
      }

      // Boss minion pulse
      if (z.isBoss) {
        state.bossSummonTimer -= dt;
        if (state.bossSummonTimer <= 0) {
          state.bossSummonTimer = 7;
          const r = pick([0, 1, 2, 3, 4].filter((x) => x !== z.row));
          spawnZombie(r, pick(["basic", "cone", "runner", "balloon"]));
          state.zombiesTotal++;
          floatText(z.x, rowToY(z.row) - 30, "SPAWN!", "#ef5350");
        }
      }

      // Collision with plants
      let plant = null;
      if (z.flying) {
        // Only tallnuts (blockLeap) stop flyers
        plant = state.plants.find(
          (p) =>
            p.row === z.row &&
            PLANTS[p.type]?.blockLeap &&
            Math.abs(colToX(p.col) - z.x) < w * 0.45
        );
      } else {
        plant = state.plants.find(
          (p) => p.row === z.row && Math.abs(colToX(p.col) - z.x) < w * 0.45
        );
      }

      // Giants smash plants faster / AOE nibble
      if (plant) {
        z.eating = true;
        z.el.classList.add("eating");
        z.eatCd -= dt;
        if (z.eatCd <= 0) {
          damagePlant(plant, z.damage);
          sfx.chomp();
          if (z.smash) {
            // splash to nearby plant same row
            const other = state.plants.find(
              (p) => p.id !== plant.id && p.row === z.row && Math.abs(colToX(p.col) - z.x) < w * 1.1
            );
            if (other) damagePlant(other, Math.floor(z.damage * 0.5));
          }
          z.eatCd = z.eatInterval;
          if (!state.plants.includes(plant)) {
            z.eating = false;
            z.el.classList.remove("eating");
          }
        }
      } else {
        z.eating = false;
        z.el.classList.remove("eating");
        z.x -= z.speed * dt;
        positionEntity(z.el, z.x, rowToY(z.row));
      }

      // House reached
      if (z.x < w * 0.12) {
        const mower = state.mowers.find((m) => m.row === z.row && !m.used);
        if (mower && state.level?.mowers !== false) {
          activateMower(mower);
        } else if (!state.mowers.some((m) => m.row === z.row && m.active)) {
          if (z.x < -30) {
            loseGame();
            return;
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // MOWERS
  // ═══════════════════════════════════════════════════════════
  function initMowers() {
    state.mowers = [];
    if (state.level && state.level.mowers === false) return;
    for (let r = 0; r < ROWS; r++) {
      const el = document.createElement("div");
      el.className = "mow";
      el.style.top = `${rowToY(r, 0)}px`;
      els.entities.appendChild(el);
      state.mowers.push({ row: r, used: false, active: false, x: -10, el });
    }
  }

  function activateMower(mower) {
    if (mower.used || mower.active) return;
    mower.active = true;
    mower.used = true;
    state.mowerUsed = true;
    mower.x = -10;
    mower.el.classList.add("active");
    sfx.mow();
    const { lawnW } = cellSize();
    const duration = 1.6;
    const speed = (lawnW + 120) / duration;
    let elapsed = 0;
    const tick = (ts) => {
      if (!mower._last) mower._last = ts;
      const dt = Math.min((ts - mower._last) / 1000, 0.05);
      mower._last = ts;
      if (!state.running && !state.lost) { mower.el.remove(); return; }
      elapsed += dt;
      mower.x += speed * dt;
      mower.el.style.left = `${mower.x}px`;
      mower.el.style.transition = "none";
      for (const z of [...state.zombies]) {
        if (z.row === mower.row && z.x < mower.x + 50 && !z.isBoss) killZombie(z);
        // Boss takes chunk from mower
        if (z.row === mower.row && z.isBoss && z.x < mower.x + 50) damageZombie(z, 600);
      }
      if (elapsed >= duration || mower.x > lawnW + 80) {
        for (const z of [...state.zombies]) {
          if (z.row === mower.row && !z.isBoss) killZombie(z);
        }
        mower.el.remove();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  // ═══════════════════════════════════════════════════════════
  // PROJECTILES
  // ═══════════════════════════════════════════════════════════
  function updatePeas(dt) {
    const { lawnW, lawnH } = cellSize();
    for (const pea of [...state.peas]) {
      pea.x += pea.speed * dt * pea.vx;
      pea.y += pea.speed * dt * pea.vy;
      // star shots can change row
      if (pea.star) {
        pea.row = clamp(Math.floor(pea.y / cellSize().h), 0, ROWS - 1);
      }
      positionEntity(pea.el, pea.x, pea.y, true);

      let hit = null;
      for (const z of state.zombies) {
        if (z.flying && !pea.hitFlying) continue;
        const sameRow = pea.star ? Math.abs(z.row - pea.row) <= 0 || Math.abs(rowToY(z.row) - pea.y) < 36 : z.row === pea.row;
        // For stars use distance
        if (pea.star) {
          const zy = rowToY(z.row, 0.4);
          const dist = Math.hypot(z.x - pea.x, zy - pea.y);
          if (dist < 32) { hit = z; break; }
        } else if (sameRow && Math.abs(z.x - pea.x) < 28 && pea.x < z.x + 24) {
          hit = z; break;
        }
      }

      if (hit) {
        damageZombie(hit, pea.damage);
        if (pea.slow) hit.slowTimer = 3.5;
        pea.el.remove();
        state.peas = state.peas.filter((p) => p.id !== pea.id);
        continue;
      }

      if (pea.x > lawnW + 50 || pea.x < -40 || pea.y < -40 || pea.y > lawnH + 40) {
        pea.el.remove();
        state.peas = state.peas.filter((p) => p.id !== pea.id);
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // SUN
  // ═══════════════════════════════════════════════════════════
  function spawnSun(x, y, fromPlant = false, amount = 25) {
    if (state.level && state.level.skySun === false && !fromPlant) return;
    const el = document.createElement("div");
    el.className = "sun";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    if (amount >= 50) el.classList.add("big");
    els.suns.appendChild(el);
    const sun = {
      id: uid(), x, y,
      targetY: fromPlant ? y + rand(18, 36) : rand(rowToY(1), rowToY(4)),
      vy: fromPlant ? 40 : 55,
      life: 11, amount, el, collecting: false,
    };
    el.addEventListener("click", (e) => { e.stopPropagation(); collectSun(sun); });
    state.suns.push(sun);
  }

  function collectSun(sun) {
    if (sun.collecting) return;
    sun.collecting = true;
    sun.el.classList.add("collecting");
    const bank = els.sunBank.getBoundingClientRect();
    const lawn = els.lawn.getBoundingClientRect();
    sun.el.style.left = `${bank.left + bank.width / 2 - lawn.left}px`;
    sun.el.style.top = `${bank.top + bank.height / 2 - lawn.top}px`;
    setTimeout(() => {
      sun.el.remove();
      state.suns = state.suns.filter((s) => s.id !== sun.id);
    }, 450);
    state.sun += sun.amount;
    updateSunUI();
    updateSeedBar();
    sfx.sun();
  }

  function updateSuns(dt) {
    for (const sun of [...state.suns]) {
      if (sun.collecting) continue;
      if (sun.y < sun.targetY) {
        sun.y = Math.min(sun.targetY, sun.y + sun.vy * dt);
        sun.el.style.top = `${sun.y}px`;
      }
      sun.life -= dt;
      if (sun.life <= 0) {
        sun.el.style.transition = "opacity 0.4s";
        sun.el.style.opacity = "0";
        setTimeout(() => sun.el.remove(), 400);
        state.suns = state.suns.filter((s) => s.id !== sun.id);
      } else if (sun.life < 2.5) {
        sun.el.style.opacity = String(0.4 + 0.6 * Math.abs(Math.sin(sun.life * 8)));
      }
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CONVEYOR
  // ═══════════════════════════════════════════════════════════
  function updateConveyor(dt) {
    if (!state.level?.conveyor) return;
    state.conveyorTimer -= dt;
    if (state.conveyorTimer <= 0 && state.conveyorItems.length < 8) {
      state.conveyorTimer = rand(2.2, 3.8);
      addConveyorItem(pick(state.level.conveyorPool));
    }
    // drift items
    for (const item of state.conveyorItems) {
      item.x += 28 * dt;
      if (item.el) item.el.style.transform = `translateX(${item.x}px)`;
      if (item.x > 520) {
        // recycle off screen
        item.el?.remove();
        state.conveyorItems = state.conveyorItems.filter((c) => c.id !== item.id);
        if (state.freePlant?.itemId === item.id) {
          state.freePlant = null;
          syncCursors();
        }
      }
    }
  }

  function addConveyorItem(type) {
    const def = PLANTS[type];
    if (!def) return;
    const el = document.createElement("div");
    el.className = "conv-item";
    el.dataset.id = type;
    el.dataset.emoji = def.emoji;
    el.title = def.name;
    el.innerHTML = `<span>${def.emoji}</span>`;
    const id = uid();
    el.dataset.cid = id;
    el.addEventListener("click", () => {
      if (!state.running || state.paused) return;
      state.freePlant = { type, itemId: id };
      state.selectedPlant = null;
      state.shovelMode = false;
      els.conveyorTrack.querySelectorAll(".conv-item").forEach((e) => e.classList.remove("selected"));
      el.classList.add("selected");
      syncCursors();
      sfx.grab();
    });
    els.conveyorTrack.appendChild(el);
    const item = { id, type, x: -60, el };
    state.conveyorItems.push(item);
  }

  // ═══════════════════════════════════════════════════════════
  // STORM
  // ═══════════════════════════════════════════════════════════
  function updateStorm(dt) {
    if (!state.level?.storm) return;
    state.stormTimer -= dt;
    if (state.stormTimer <= 0) {
      state.stormTimer = rand(6, 11);
      strikeLightning();
    }
  }

  function strikeLightning() {
    const col = (Math.random() * COLS) | 0;
    const { w, h, lawnH } = cellSize();
    const bolt = document.createElement("div");
    bolt.className = "lightning";
    bolt.style.left = `${col * w + w * 0.35}px`;
    bolt.style.height = `${lawnH}px`;
    els.fx.appendChild(bolt);
    els.stage.classList.add("flash");
    setTimeout(() => {
      bolt.remove();
      els.stage.classList.remove("flash");
    }, 280);
    sfx.thunder();

    // Damage plants in column
    for (const p of [...state.plants]) {
      if (p.col === col) damagePlant(p, 90);
    }
    // Damage zombies near column
    const cx = colToX(col);
    for (const z of [...state.zombies]) {
      if (Math.abs(z.x - cx) < w * 0.7) damageZombie(z, z.isBoss ? 200 : 120);
    }
    floatText(cx, 20, "⚡", "#fff59d");
  }

  // ═══════════════════════════════════════════════════════════
  // WAVES
  // ═══════════════════════════════════════════════════════════
  function countLevelZombies(level) {
    if (!level?.waves) return 0;
    return level.waves.reduce((s, w) => s + w.length, 0);
  }

  function startWave(idx) {
    state.wave = idx;
    state.waveTime = 0;
    state.waveSpawnIdx = 0;
    state.waveActive = true;
    updateWaveUI();

    const total = state.mode === "endless" ? "∞" : state.level.waves.length;
    const label = state.mode === "endless"
      ? `လှိုင်း ${state.endlessWave + 1}`
      : idx === state.level.waves.length - 1
        ? "နောက်ဆုံးလှိုင်း!"
        : `လှိုင်း ${idx + 1}`;
    banner(label, idx === (state.level?.waves?.length || 1) - 1 ? "#ef5350" : "#ffd93d");
    sfx.wave();
  }

  function generateEndlessWave(n) {
    const spawns = [];
    const count = Math.min(4 + n * 2, 28);
    const types = ["basic", "basic", "cone"];
    if (n >= 2) types.push("flag", "newspaper");
    if (n >= 3) types.push("runner", "door");
    if (n >= 5) types.push("bucket", "balloon");
    if (n >= 7) types.push("dancer");
    if (n >= 9) types.push("giant");
    if (n >= 12 && n % 5 === 0) types.push("boss");
    for (let i = 0; i < count; i++) {
      spawns.push({
        t: 1 + i * Math.max(0.35, 1.1 - n * 0.04),
        row: (Math.random() * ROWS) | 0,
        type: pick(types),
      });
    }
    return spawns;
  }

  function updateWaves(dt) {
    if (!state.waveActive) return;
    state.waveTime += dt;

    let spawns;
    if (state.mode === "endless") {
      spawns = state._endlessSpawns || [];
    } else {
      spawns = state.level.waves[state.wave] || [];
    }

    while (state.waveSpawnIdx < spawns.length && state.waveTime >= spawns[state.waveSpawnIdx].t) {
      const s = spawns[state.waveSpawnIdx];
      spawnZombie(s.row, s.type);
      state.waveSpawnIdx++;
    }

    // Wave clear?
    if (state.waveSpawnIdx >= spawns.length && state.zombies.length === 0) {
      state.waveActive = false;

      if (state.mode === "endless") {
        state.endlessWave++;
        if (state.endlessWave > save.endlessBest) {
          save.endlessBest = state.endlessWave;
          writeSave(save);
        }
        state.sun += 25 + state.endlessWave * 5;
        updateSunUI();
        // heal cooldowns a bit
        for (const k of Object.keys(state.cooldowns)) {
          state.cooldowns[k] = Math.max(0, state.cooldowns[k] - 5);
        }
        setTimeout(() => {
          if (!state.running || state.lost) return;
          state._endlessSpawns = generateEndlessWave(state.endlessWave);
          state.zombiesTotal += state._endlessSpawns.length;
          startWave(state.endlessWave);
        }, 3000);
        banner(`လှိုင်း ${state.endlessWave} ရှင်းပြီး!`, "#7ed957");
        return;
      }

      // Campaign
      if (state.wave >= state.level.waves.length - 1) {
        // Boss level: must kill boss
        if (state.level.boss && state.zombies.some((z) => z.isBoss)) {
          state.waveActive = true; // keep going
          return;
        }
        winGame();
      } else {
        state.sun += 25;
        updateSunUI();
        banner(`လှိုင်း ${state.wave + 1} ရှင်းပြီး!`, "#7ed957");
        setTimeout(() => {
          if (state.running && !state.lost && !state.won) startWave(state.wave + 1);
        }, 3500);
      }
    }

    // Boss level win if boss dead and no zombies and all spawned
    if (
      state.level?.boss &&
      state.wave >= state.level.waves.length - 1 &&
      state.waveSpawnIdx >= (state.level.waves[state.wave]?.length || 0) &&
      !state.zombies.some((z) => z.isBoss) &&
      state.zombies.length === 0 &&
      !state.won
    ) {
      winGame();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // POSITION
  // ═══════════════════════════════════════════════════════════
  function positionEntity(el, x, y, isPea = false) {
    if (isPea) {
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      return;
    }
    const { w, h } = cellSize();
    if (el.classList.contains("mow") && !el.classList.contains("active")) {
      el.style.left = `-10px`;
      el.style.top = `${y - h / 2 + 4}px`;
      el.style.height = `${Math.max(18, h - 10)}px`;
      return;
    }
    const ew = el.classList.contains("zombie")
      ? (el.classList.contains("boss") ? w * 1.3 : el.classList.contains("giant") ? w * 1.1 : w * 0.85)
      : w;
    const eh = h;
    // Keep CSS box in sync with fluid cell size
    if (el.classList.contains("plant") || el.classList.contains("zombie")) {
      el.style.width = `${ew}px`;
      el.style.height = `${eh}px`;
    }
    el.style.left = `${x - ew / 2}px`;
    el.style.top = `${y - eh / 2}px`;
  }

  // ═══════════════════════════════════════════════════════════
  // GAME FLOW
  // ═══════════════════════════════════════════════════════════
  function startLevel(level, mode = "campaign") {
    ensureAudio();
    hardReset();
    state.level = level;
    state.mode = mode;
    state.running = false;
    state.paused = false;
    state.sun = level.startSun ?? 50;
    state.skySunTimer = level.skySun === false ? 99999 : 4;
    state.stormTimer = level.storm ? 8 : 99999;
    state.conveyorTimer = 1.5;
    state.bossSummonTimer = 5;
    state.zombiesTotal = mode === "endless" ? 0 : countLevelZombies(level);

    showScreen("game");
    els.pauseOverlay.classList.add("hidden");
    els.endOverlay.classList.add("hidden");
    els.introOverlay.classList.add("hidden");
    tryLockLandscape();
    updateOrientationGate();

    applyTheme(level.theme);
    playThemeMusic(level.theme || "day");
    A()?.startGroans();
    els.levelChip.textContent = mode === "endless" ? "∞" : `L${level.num}`;
    setObjective(level.mod);
    els.pauseHint.textContent = level.mod;

    els.fog.classList.toggle("hidden", !level.fog);
    els.bossBar.classList.add("hidden");

    buildLawn();
    buildSeedBar();
    els.entities.innerHTML = "";
    els.projectiles.innerHTML = "";
    els.suns.innerHTML = "";
    els.fx.innerHTML = "";
    els.conveyorTrack.innerHTML = "";
    layout = { w: 0, h: 0, cell: 0 }; // force fresh fit

    requestAnimationFrame(() => {
      fitLayout();
      initMowers();
      // second pass after mowers / fonts settle
      requestAnimationFrame(() => fitLayout());
      state.running = true;
      updateSunUI();
      updateSeedBar();
      updateWaveUI();

      if (mode === "endless") {
        state.endlessWave = 0;
        state._endlessSpawns = generateEndlessWave(0);
        state.zombiesTotal = state._endlessSpawns.length;
        setTimeout(() => { if (state.running) startWave(0); }, 4000);
      } else {
        setTimeout(() => { if (state.running) startWave(0); }, level.conveyor ? 3500 : 5500);
      }

      // early conveyor seed
      if (level.conveyor) {
        for (let i = 0; i < 4; i++) {
          setTimeout(() => addConveyorItem(pick(level.conveyorPool)), 200 + i * 400);
        }
      }

      lastTs = performance.now();
      requestAnimationFrame(loop);
    });
  }

  function startEndless() {
    const level = {
      id: ENDLESS_ID,
      num: 0,
      name: "အဆုံးမဲ့ · Endless",
      emoji: "♾️",
      theme: "night",
      blurb: "ဘယ်လောက် ခံနိုင်မလဲ?",
      mod: "လှိုင်းတွေ မဆုံးဘူး။ တစ်ခုပြီး တစ်ခု ပိုပြင်း။ စံချိန်ချိုး!",
      startSun: 100,
      skySun: true,
      plants: ["sunflower", "twinflower", "peashooter", "wallnut", "tallnut", "snowpea", "repeater", "potatomine", "cherrybomb", "jalapeno", "starfruit"],
      mowers: true,
      waves: [[]],
    };
    els.introOverlay.classList.add("hidden");
    startLevel(level, "endless");
  }

  function hardReset() {
    for (const p of state.plants) p.el?.remove();
    for (const z of state.zombies) z.el?.remove();
    for (const p of state.peas) p.el?.remove();
    for (const s of state.suns) s.el?.remove();
    for (const m of state.mowers) m.el?.remove();
    Object.assign(state, {
      running: false, paused: false, sun: 50,
      wave: 0, waveTime: 0, waveSpawnIdx: 0, waveActive: false,
      plants: [], zombies: [], peas: [], suns: [], mowers: [], conveyorItems: [],
      selectedPlant: null, freePlant: null, shovelMode: false,
      cooldowns: {}, skySunTimer: 5, stormTimer: 999, conveyorTimer: 2,
      bossSummonTimer: 5, gameTime: 0,
      zombiesSpawned: 0, zombiesTotal: 0, zombiesKilled: 0,
      mowerUsed: false, won: false, lost: false, nextId: 1, endlessWave: 0,
      _endlessSpawns: null,
    });
    clearSelection();
    document.body.classList.remove("planting-cursor", "shovel-cursor");
  }

  function calcStars() {
    const rules = state.level?.starRules || {};
    let stars = 1;
    if (state.gameTime <= (rules.time2 || 9999)) stars = 2;
    if (state.gameTime <= (rules.time3 || 0) && (!rules.noMower || !state.mowerUsed)) stars = 3;
    else if (state.gameTime <= (rules.time3 || 0)) stars = Math.max(stars, 2);
    if (!state.mowerUsed && rules.noMower && stars >= 2) {
      // already handled
    } else if (!state.mowerUsed && stars === 1) {
      stars = 2; // survival bonus
    }
    return clamp(stars, 1, 3);
  }

  function winGame() {
    if (state.won || state.lost) return;
    state.won = true;
    state.running = false;
    A()?.stopGroans();
    A()?.stopMusic();

    if (state.mode === "endless") {
      els.endEmoji.textContent = "♾️";
      els.endTitle.textContent = "ခရီးပြီး";
      els.endMsg.textContent = `${state.endlessWave} လှိုင်း ခံခဲ့တယ်! အကောင်းဆုံး: ${save.endlessBest}`;
      els.endStars.innerHTML = "";
      els.btnNext.classList.add("hidden");
      els.endOverlay.classList.remove("hidden");
      sfx.win();
      return;
    }

    const stars = calcStars();
    const id = state.level.id;
    const prev = save.stars[id] || 0;
    if (stars > prev) save.stars[id] = stars;

    // Unlock next
    const nextIdx = state.levelIdx + 1;
    if (nextIdx + 1 > save.unlocked) {
      save.unlocked = Math.min(LEVELS.length + 1, nextIdx + 1);
    }
    // beating last level unlocks endless
    if (state.levelIdx >= LEVELS.length - 1) {
      save.unlocked = LEVELS.length + 1;
    }
    writeSave(save);

    els.endEmoji.textContent = state.level.emoji;
    els.endTitle.textContent = "အောင်ပွဲ · Clear!";
    els.endMsg.textContent = stars === 3
      ? "ပြည့်စုံတဲ့ ခုခံရေး! ★★★ ရပြီ!"
      : stars === 2
        ? "ကောင်းတယ်။ ပိုမြန်ရင် ★★★ ရနိုင်တယ်!"
        : "ခြံကို ကာကွယ်နိုင်ခဲ့တယ်။ ပြန်ကစားပြီး ကြယ်ပိုယူ!";
    els.endStars.innerHTML = [1, 2, 3].map((i) =>
      `<span class="star ${i <= stars ? "on" : ""}">★</span>`
    ).join("");
    // animate stars
    els.endStars.querySelectorAll(".star.on").forEach((el, i) => {
      setTimeout(() => { el.classList.add("pop"); sfx.star(); }, 200 + i * 280);
    });

    const hasNext = state.levelIdx < LEVELS.length - 1;
    els.btnNext.classList.toggle("hidden", !hasNext);
    els.btnNext.textContent = hasNext ? "နောက်အဆင့်" : "မြေပုံ";
    els.endOverlay.classList.remove("hidden");
    sfx.win();
  }

  function loseGame() {
    if (state.won || state.lost) return;
    state.lost = true;
    state.running = false;
    A()?.stopGroans();
    A()?.stopMusic();
    els.endEmoji.textContent = "🧟";
    els.endTitle.textContent = "ဦးနှောက် အစားခံလိုက်ပြီ!";
    if (state.mode === "endless") {
      els.endMsg.textContent = `${state.endlessWave} လှိုင်း ခံခဲ့တယ်။ အကောင်းဆုံး: ${save.endlessBest}`;
      if (state.endlessWave > save.endlessBest) {
        save.endlessBest = state.endlessWave;
        writeSave(save);
      }
    } else {
      els.endMsg.textContent = `${state.level.name} က ဥယျာဉ်မှူးနောက်တစ်ယောက် ယူသွားပြီ။ ဗျူဟာ ပြောင်းကြည့်!`;
    }
    els.endStars.innerHTML = "";
    els.btnNext.classList.add("hidden");
    els.endOverlay.classList.remove("hidden");
    sfx.lose();
  }

  function pauseGame() {
    if (!state.running || state.won || state.lost) return;
    state.paused = true;
    A()?.stopGroans();
    A()?.stopMusic();
    els.pauseOverlay.classList.remove("hidden");
  }
  function resumeGame() {
    state.paused = false;
    els.pauseOverlay.classList.add("hidden");
    playThemeMusic(state.level?.theme || "day");
    A()?.startGroans();
    lastTs = performance.now();
    requestAnimationFrame(loop);
  }

  function goMap() {
    hardReset();
    showScreen("map");
    els.pauseOverlay.classList.add("hidden");
    els.endOverlay.classList.add("hidden");
    els.introOverlay.classList.add("hidden");
    buildMap();
  }

  function goMenu() {
    hardReset();
    showScreen("start");
    els.pauseOverlay.classList.add("hidden");
    els.endOverlay.classList.add("hidden");
    els.introOverlay.classList.add("hidden");
    refreshSaveHint();
  }

  // ═══════════════════════════════════════════════════════════
  // LOOP
  // ═══════════════════════════════════════════════════════════
  let lastTs = 0;
  function loop(ts) {
    if (!state.running || state.paused) return;
    const dt = Math.min((ts - lastTs) / 1000, 0.05);
    lastTs = ts;
    state.gameTime += dt;

    for (const id of Object.keys(state.cooldowns)) {
      if (state.cooldowns[id] > 0) {
        state.cooldowns[id] = Math.max(0, state.cooldowns[id] - dt);
      }
    }

    if (state.level?.skySun !== false && !state.level?.conveyor) {
      state.skySunTimer -= dt;
      if (state.skySunTimer <= 0) {
        state.skySunTimer = rand(7, 11);
        const { lawnW } = cellSize();
        spawnSun(rand(lawnW * 0.15, lawnW * 0.85), -20, false, 25);
      }
    }

    updateWaves(dt);
    updatePlants(dt);
    updateZombies(dt);
    updatePeas(dt);
    updateSuns(dt);
    updateConveyor(dt);
    updateStorm(dt);
    updateSeedBar();

    requestAnimationFrame(loop);
  }

  // ═══════════════════════════════════════════════════════════
  // EVENTS
  // ═══════════════════════════════════════════════════════════
  els.btnStart.addEventListener("click", () => { ensureAudio(); sfx.click(); goMap(); });
  els.btnEndless.addEventListener("click", () => { ensureAudio(); sfx.click(); startEndless(); });
  els.btnMute?.addEventListener("click", toggleMute);
  els.btnMuteMenu?.addEventListener("click", toggleMute);
  els.btnMapBack.addEventListener("click", goMenu);
  els.btnIntroGo.addEventListener("click", () => startLevel(LEVELS[state.levelIdx], "campaign"));
  els.btnIntroBack.addEventListener("click", () => {
    els.introOverlay.classList.add("hidden");
    goMap();
  });
  els.btnPause.addEventListener("click", pauseGame);
  els.btnResume.addEventListener("click", resumeGame);
  els.btnRestart.addEventListener("click", () => {
    if (state.mode === "endless") startEndless();
    else startLevel(LEVELS[state.levelIdx], "campaign");
  });
  els.btnMenu.addEventListener("click", goMap);
  els.btnAgain.addEventListener("click", () => {
    if (state.mode === "endless") startEndless();
    else startLevel(LEVELS[state.levelIdx], "campaign");
  });
  els.btnNext.addEventListener("click", () => {
    if (state.levelIdx < LEVELS.length - 1) {
      showIntro(state.levelIdx + 1);
      els.endOverlay.classList.add("hidden");
    } else goMap();
  });
  els.btnEndMenu.addEventListener("click", goMap);
  els.shovel.addEventListener("click", toggleShovel);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (state.selectedPlant || state.freePlant || state.shovelMode) clearSelection();
      else if (state.running && !state.paused && !state.won && !state.lost) pauseGame();
      else if (state.paused) resumeGame();
    }
    if (state.running && !state.paused && state.level && !state.level.conveyor) {
      const idx = parseInt(e.key, 10) - 1;
      const list = state.level.plants || [];
      if (idx >= 0 && idx < list.length) selectPlant(list[idx]);
      if (e.key === "s" || e.key === "S") toggleShovel();
    }
  });

  let resizeTick = 0;
  function onViewportChange() {
    updateOrientationGate();
    cancelAnimationFrame(resizeTick);
    resizeTick = requestAnimationFrame(() => {
      if (els.gameScreen.classList.contains("active")) fitLayout();
    });
  }
  window.addEventListener("resize", onViewportChange);
  window.addEventListener("orientationchange", () => {
    // iOS fires before dimensions settle
    setTimeout(onViewportChange, 120);
    setTimeout(onViewportChange, 350);
  });
  if (screen.orientation) {
    screen.orientation.addEventListener("change", () => setTimeout(onViewportChange, 80));
  }

  // Prevent pinch-zoom gestures eating taps on iOS Safari
  document.addEventListener("gesturestart", (e) => e.preventDefault());

  // Boot
  refreshSaveHint();
  syncMuteButtons();
  updateOrientationGate();
  // Music starts after first user gesture (browser policy)
  const bootAudio = () => {
    ensureAudio();
    if (els.startScreen.classList.contains("active")) playThemeMusic("menu");
    document.removeEventListener("pointerdown", bootAudio);
  };
  document.addEventListener("pointerdown", bootAudio, { once: true });
})();
