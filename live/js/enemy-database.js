/*const enemyPools = {
  west: ["wolf", "boar"],
  south: ["rogue", "thief"],
};*/

const ELITE_ENEMY_POOLS = {
  "elmaris_port": ["elite_boar", "elite_thief"],
  "thalorn_village": ["elite_wolf", "elite_bandit"],
  "reapers_road": ["elite_archer"],
  "lirwen_fort": ["elite_raider"],
  "green_pass": ["elite_savage"],
  "whispering_trees": ["elite_spider"]
};


// 📍 ZESTAWY WROGÓW DLA LOKACJI
const enemyPools = {
  "elmaris_port": ["boar", "thief", "fox", "pirate"],
  "thalorn_village": ["wolf", "sailor", "wolf", "bandit", "bossman"],
  "reapers_road": ["lynx", "dear", "archer", "rogue"],
  "lirwen_fort": ["mad_dog", "bandit_crossbow", "raider", "poacher"],
  "green_pass": ["crocodile", "savage", "savage_boneshield", "warthog"],
  "whispering_trees": ["spider", "black_spider", "lumberjack", "mutated_deer", "black_wolf", "mutated_fox"]
};


// 📘 BAZA WROGÓW (uniwersalna)
const enemyBase = {
  // --- Zwierzęta i stworzenia naturalne ---
  wolf: {
    name: "enemy_wolf",
    maxHp: 95,
    dmg: 12,
    def: 82,
    atkSpd: 0.46,
    type: "normal",
    baseExp: 25,
    sprite: "grey-wolf.png"
  },
  elite_wolf: {
    name: "enemy_elite_wolf",
    maxHp: 205,
    dmg: 27,
    def: 170,
    atkSpd: 0.55,
    type: "elite",
    baseExp: 34,
    sprite: "grey-wolf.png"
  },
  boar: {
    name: "enemy_boar",
    maxHp: 80, 
    dmg: 7, 
    def: 55, 
    atkSpd: 0.38,
    type: "normal",
    baseExp: 23,
    sprite: "boar.png"
  },
  elite_boar: {
    name: "enemy_elite_boar",
    maxHp: 210, 
    dmg: 20, 
    def: 140, 
    atkSpd: 0.35,
    type: "elite",
    baseExp: 36,
    sprite: "boar.png"
  },
  fox: {
    name: "enemy_fox",
    maxHp: 52,
    dmg: 4,
    def: 30,
    atkSpd: 0.50,
    type: "normal",
    baseExp: 18,
    sprite: "fox.png"
  },
  dear: {
    name: "enemy_deer",
    maxHp: 143,
    dmg: 14,
    def: 145,
    atkSpd: 0.34,
    baseExp: 30,
    type: "normal",
    sprite: "dear.png"
  },
  lynx: {
    name: "enemy_lynx",
    maxHp: 90,
    dmg: 12,
    def: 85,
    atkSpd: 0.58,
    baseExp: 22,
    type: "normal",
    sprite: "lynx.png"
  },
  mad_dog: {
    name: "enemy_mad_dog",
    maxHp: 130,
    dmg: 12,
    def: 122,
    atkSpd: 0.56,
    type: "normal",
    baseExp: 20,
    sprite: "mad-dog3.png"
  },
  crocodile: {
    name: "enemy_crocodile",
    maxHp: 175,
    dmg: 17,
    def: 160,
    atkSpd: 0.4,
    type: "normal",
    baseExp: 30,
    sprite: "crocodile.png"
  },
  warthog: {
    name: "enemy_warthog",
    maxHp: 140,
    dmg: 14,
    def: 135,
    atkSpd: 0.45,
    type: "normal",
    baseExp: 25,
    sprite: "warthog.png"
  },
  spider: {
    name: "enemy_spider",
    maxHp: 140,
    dmg: 18,
    def: 105,
    atkSpd: 0.62,
    type: "normal",
    baseExp: 26,
    sprite: "spider2.png"
  },
  elite_spider: {
    name: "enemy_elite_spider",
    maxHp: 390,
    dmg: 42,
    def: 310,
    atkSpd: 0.56,
    type: "elite",
    baseExp: 51,
    sprite: "spider2.png"
  },
  black_spider: {
    name: "enemy_black_spider",
    maxHp: 140,
    dmg: 18,
    def: 105,
    atkSpd: 0.62,
    type: "normal",
    baseExp: 26,
    sprite: "spider.png"
  },
  black_wolf: {
    name: "enemy_black_wolf",
    maxHp: 194,
    dmg: 19,
    def: 145,
    atkSpd: 0.57,
    type: "normal",
    baseExp: 31,
    sprite: "black-wolf.png"
  },
  mutated_deer: {
    name: "enemy_mutated_deer",
    maxHp: 192,
    dmg: 18,
    def: 185,
    atkSpd: 0.42,
    type: "normal",
    baseExp: 36,
    sprite: "mutated-deer.png"
  },
  mutated_fox: {
    name: "enemy_mutated_fox",
    maxHp: 133,
    dmg: 14,
    def: 170,
    atkSpd: 0.7,
    type: "normal",
    baseExp: 27,
    sprite: "mutated-fox.png"
  },


  
  // --- Ludzie i bandyci ---
  lumberjack: {
    name: "enemy_lumberjack",
    maxHp: 184,
    dmg: 16,
    def: 172,
    atkSpd: 0.6,
    type: "normal",
    baseExp: 32,
    sprite: "lumberjack.png"
  },

  savage: {
    name: "enemy_savage",
    maxHp: 147,
    dmg: 13,
    def: 130,
    atkSpd: 0.62,
    type: "normal",
    baseExp: 26,
    sprite: "savage.png"
  },
  elite_savage: {
    name: "enemy_elite_savage",
    maxHp: 257,
    dmg: 25,
    def: 243,
    atkSpd: 0.68,
    type: "elite",
    baseExp: 53,
    sprite: "savage.png"
  },
  savage_boneshield: {
    name: "enemy_savage_boneshield",
    maxHp: 182,
    dmg: 16,
    def: 168,
    atkSpd: 0.47,
    type: "normal",
    baseExp: 28,
    sprite: "savage-boneshield.png"
  },
  bandit: {
    name: "enemy_bandit",
    maxHp: 124,
    dmg: 11,
    def: 123,
    atkSpd: 0.5,
    type: "normal",
    baseExp: 28,
    sprite: "bandit.png"
  },
  elite_bandit: {
    name: "enemy_elite_bandit",
    maxHp: 240,
    dmg: 28,
    def: 235,
    atkSpd: 0.45,
    type: "elite",
    baseExp: 39,
    sprite: "bandit.png"
  },
  bandit_crossbow: {
    name: "enemy_bandit_crossbow",
    maxHp: 121,
    dmg: 14,
    def: 120,
    atkSpd: 0.65,
    type: "normal",
    baseExp: 21,
    sprite: "bandit-crossbow.png"
  },
  raider: {
    name: "enemy_raider",
    maxHp: 152,
    dmg: 14,
    def: 144,
    atkSpd: 0.5,
    type: "normal",
    baseExp: 28,
    sprite: "raider.png"
  },
  elite_raider: {
    name: "enemy_elite_raider",
    maxHp: 680,
    dmg: 49,
    def: 630,
    atkSpd: 0.45,
    type: "elite",
    baseExp: 55,
    sprite: "raider.png"
  },
  poacher: {
    name: "enemy_poacher",
    maxHp: 175,
    dmg: 15,
    def: 146,
    atkSpd: 0.42,
    type: "normal",
    baseExp: 29,
    sprite: "poacher.png"
  },
  archer: {
    name: "enemy_archer",
    maxHp: 128,
    dmg: 14,
    def: 90,
    atkSpd: 0.55,
    type: "normal",
    baseExp: 24,
    sprite: "archer.png"
  },
  elite_archer: {
    name: "enemy_elite_archer",
    maxHp: 280,
    dmg: 30,
    def: 230,
    atkSpd: 0.65,
    type: "elite",
    baseExp: 43,
    sprite: "archer.png"
  },
  rogue: {
    name: "enemy_rogue",
    maxHp: 144,
    dmg: 13,
    def: 150,
    atkSpd: 0.65,
    type: "normal",
    baseExp: 26,
    sprite: "rogue.png"
  },
  thief: {
    name: "enemy_thief",
    maxHp: 96,
    dmg: 8,
    def: 55,
    atkSpd: 0.47,
    type: "normal",
    baseExp: 23,
    sprite: "thief.png"
  },
  elite_thief: {
    name: "enemy_elite_thief",
    maxHp: 230,
    dmg: 21,
    def: 134,
    atkSpd: 0.5,
    type: "elite",
    baseExp: 38,
    sprite: "thief.png"
  },
  sailor: {
    name: "enemy_sailor",
    maxHp: 130,
    dmg: 12,
    def: 116,
    atkSpd: 0.53,
    type: "normal",
    baseExp: 29,
    sprite: "sailor.png"
  },
  pirate: {
    name: "enemy_pirate",
    maxHp: 124,
    dmg: 10,
    def: 72,
    atkSpd: 0.4,
    type: "normal",
    baseExp: 26,
    sprite: "pirate.png"
  },
  bossman: {
    name: "enemy_bossman",
    maxHp: 133,
    dmg: 14,
    def: 138,
    atkSpd: 0.36,
    type: "normal",
    baseExp: 32,
    sprite: "bossman.png"
  },


  // --- MiniBoss i Boss ---
  alpha_wolf_miniboss: {
    name: "enemy_alpha_wolf_miniboss",
    maxHp: 455,
    dmg: 21,
    def: 405,
    atkSpd: 0.38,
    type: "mini_boss",
    baseExp: 50,
    sprite: "alpha-wolf.png"
  },
  queen_spider_miniboss: {
    name: "enemy_queen_spider_miniboss",
    maxHp: 2500,
    dmg: 100,
    def: 3200,
    atkSpd: 0.4,
    type: "mini_boss",
    baseExp: 500,
    sprite: "queen-spider.png"
  },

  boss: {
    name: "enemy_boss",
    maxHp: 400,
    dmg: 90,
    def: 80,
    atkSpd: 0.25,
    type: "boss",
    baseExp: 2000,
    sprite: "cave-giant-boss.png"
  }
};

