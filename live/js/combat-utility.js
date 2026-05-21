

const deathReasons = {
  failedBlock: [
    "death_failed_block_1",
    "death_failed_block_2"
  ],

  noPotions: [
    "death_no_potions_1",
    "death_no_potions_2"
  ],

  panic: [
    "death_panic_1",
    "death_panic_2"
  ],

  exhaustion: [
    "death_exhaustion_1",
    "death_exhaustion_2"
  ],

  overwhelmed: [
    "death_overwhelmed_1",
    "death_overwhelmed_2"
  ]
};

const deathTips = [
  "death_tip_1",
  "death_tip_2",
  "death_tip_3",
  "death_tip_4",
  "death_tip_5"
];

const levelUpFlavors = [
  "levelup_flavor_1",
  "levelup_flavor_2",
  "levelup_flavor_3",
  "levelup_flavor_4",
  "levelup_flavor_5",
  "levelup_flavor_6"
];


function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDeathTip() {
  return randomFrom(deathTips);
}

function getPlayerAttackSpeed() {
  //console.log("atkspd", char.atkSpd);
  const staminaPenalty = getAttackSpeedMultiplier();
 // console.error(`atkspd, staminaPenalty`, char.atkSpd, staminaPenalty);
  return parseFloat(staminaPenalty * gameState.char.atkSpd);
}

// Oblicza cooldown na podstawie szybkości ataku
function calculateCooldown(atkSpeed) {
  let cooldown = 1 / atkSpeed;
  cooldown *= (1 - gameState.char.agi * 0.0015);
  return cooldown; // np. 0.5 -> 2s cooldown
}

function clamp(v, min, max){ 
  return Math.max(min, Math.min(max, v)); 
}

function nowDateMs(){
  return Date.now(); 
}

function setPlayerFlag(key, value) {
  const char = gameState.char;
  char.flags = char.flags || {};
  char.flags[key] = value;
  saveGame();
}
function getPlayerFlag(key) {
  return gameState.char?.flags?.[key];
}

function getPlayerStats(resistKey = null) {
  const char = gameState.char;
  const hpText = document.getElementById("hp-label")?.innerText || "100/100";
  const currentHp = parseFloat(hpText.split("/")[0]);
  const maxHp = parseFloat(hpText.split("/")[1]);
  const rawResist = char?.resist?.[resistKey] ?? 0;
  
  return {
    hp: char.hp,
    maxHp: char.maxHp,
    stamina: char.stamina,
    maxStamina: char.maxStamina,
    staminaRegen: char.staminaRegen,
    energyRegen: char.energyRegen,
    //dmg: parseFloat(document.getElementById("dmg")?.innerText) || 5,
    //def: parseFloat(document.getElementById("def")?.innerText) || 5,
    dmg: char.dmg,
    def: char.def,
    vit: char.vit,
    str: char.str,
    agi: char.agi,
    baseDamage: char.baseDamage,
    atkspd: getPlayerAttackSpeed(),
    crit: char.crit,
    style: char.style,
    critDmg: char.critDmg,
    stackDefense: char.bonus.stackDefense,
    dmgReduction: char.bonus.dmgReduction,
    hpToDmg: char.bonus.hpToDmg,
    elementalDmg: char.elementalDmg,
    typeOfElementalDmg: char.typeOfElementalDmg,
    lifeRegen: char.lifeRegen,
    lifeOnHit: char.lifeOnHit,
    dodge: char.dodge,
    dodgeCostReduce: char.dodgeCostReduce,
    perfectBlockEnergy : char.perfectBlockEnergy,
    critEnergy: char.critEnergy,
    perfectWindowBonus: char.perfectWindowBonus,
    blockPower: char.blockPower,
    tacticalBlock: char.tacticalBlock,
    blockMode: char.blockMode,
    penaltyDmg: char.penaltyDmg,
    penaltyAtkSpd: char.penaltyAtkSpd,
    baseCooldown: char.baseCooldown,
    penaltyCooldown: char.penaltyCooldown,
    regenAllowedAt: char.regenAllowedAt,
    effectiveCrit: getEffectiveCritChance(char.crit),
    resist: getEffectiveResist(rawResist),
    physDmgReduction: char.physDmgReduction,
    level: char.level,
  };
}

function calculatePlayerStats(char) {
  let dmg = char.dmg || 5;
  let def = char.def || 5;

  // equipment
  /*if (char.equipment) {
    for (const item of Object.values(char.equipment)) {
      if (!item) continue;
      dmg += item.dmg || 0;
      def += item.def || 0;
    }
  }*/

  return {
    hp: char.hp ?? char.maxHp,
    maxHp: char.maxHp,
    dmg,
    def,
    crit: char.crit,
    critDmg: char.critDmg,
    atkSpd: getPlayerAttackSpeed(),
    lifeRegen: char.lifeRegen,
    dodge: char.dodge,
    blockPower: char.blockPower,
    level: char.level,
    stackDefense: char.bonus.stackDefense,
    dmgReduction: char.bonus.dmgReduction,
    hpToDmg: char.bonus.hpToDmg
  };
}

function markEnemyForRegen(enemy) {
  enemy.regen = {
    fromHp: enemy.currentHp,
    startTime: getGameTime(),
    stepIndex: enemy.__stepIndex   // 🔑 KLUCZ
  };
}

function getAttackSpeedPenaltyPercent(baseCooldown, newCooldown) {
  if (baseCooldown <= 0) return 0;

  return Math.round(
    ((newCooldown - baseCooldown) / baseCooldown) * 100
  );
}

/*function getBlockAtkSpeedMultiplier(blockPower) {
  const t = Math.min(Math.max(blockPower, 0), 1);
  return lerpAtkSpd(0.7, 0.2, t);
}*/

function getBlockAtkSpeedMultiplier(blockPower) {
  const t = Math.min(Math.max(blockPower, 0), 1);
  return lerpAtkSpd(0.85, 0.7, t);
}


function lerpAtkSpd(a, b, t) {
  return a + (b - a) * t;
}

function lerpPercent(min, max, t) {
  return Math.round(lerp(min, max, t) * 100) + "%";
}

function lerp(min, max, t) {
  t = Math.max(0, Math.min(1, t));
  return min + (max - min) * t;
}

function computeShieldPenalties(blockPower, atkSpeed = 1) {
  //console.error(`blockPower, getBlockAtkSpeedMultiplier, lerp(0.85, 0.7, blockPower)`, blockPower, getBlockAtkSpeedMultiplier(blockPower), lerp(0.85, 0.7, blockPower));

  return {
    attackPenalty: lerp(0.2, 0.35, blockPower), // 20–35%
    atkSpd: atkSpeed * lerp(0.85, 0.7, blockPower)
  };
}

/*function computeShieldPenalties(blockPower, atkSpeed = 1) {
  console.error(`blockPower, getBlockAtkSpeedMultiplier`, blockPower, getBlockAtkSpeedMultiplier(blockPower));
  return {
    attackPenalty: lerp(0.3, 0.65, blockPower),
    atkSpd: atkSpeed * getBlockAtkSpeedMultiplier(blockPower)
  };
}*/

function getStaminaRatio() {
  return gameState.resources.staminaState.current / gameState.resources.staminaState.max;
}

function updateFatigue() {
  const staminaState = gameState.resources.staminaState;
  const pct = staminaState.current / staminaState.max;

  if (pct > 0.7) staminaState.fatigue = "fresh";
  else if (pct > 0.4) staminaState.fatigue = "tired";
  else if (pct > 0.2) staminaState.fatigue = "exhausted";
  else staminaState.fatigue = "critical";
}

function getAttackSpeedMultiplier() {
  switch (gameState.resources.staminaState.fatigue) {
    case "tired": return 0.9;
    case "exhausted": return 0.75;
    case "critical": return 0.6;
    default: return 1;
  }
}

function getStaminaRegenMultiplier() {
  switch (gameState.resources.staminaState.fatigue) {
    case "tired": return 0.85;
    case "exhausted": return 0.6;
    case "critical": return 0.35;
    default: return 1;
  }
}

function getArmorReduction(armor, attackerLevel) {
  const K = 300 + attackerLevel * 60;
  return armor / (armor + K);
}

const RESIST_SOFT_CAP = 75; // maksymalna realna redukcja %
const RESIST_K = 120;      // tempo nasycania (im wyższe, tym wolniej)

function getEffectiveResist(rawResist) {
  return (rawResist / (rawResist + RESIST_K)) * RESIST_SOFT_CAP;
}

const CRIT_SOFT_CAP = 75; // maksymalna realna szansa
const CRIT_K = 60;       // tempo nasycania

function getEffectiveCritChance(rawCrit) {
  return (rawCrit / (rawCrit + CRIT_K)) * CRIT_SOFT_CAP;
}

function rollDamage(baseDmg) {
  const variance = 0.06; // 6%
  const roll = 1 + (Math.random() * 2 - 1) * variance;
  return Math.floor(baseDmg * roll);
}

function rollDefensiveReduction() {
  const min = 0.40;
  const max = 0.60;

  return min + Math.random() * (max - min);
}

function applyDefensivePenaltyDmgReduction(player, damage) {
  const { attackPenalty: penaltyDmg } = computeShieldPenalties(player.blockPower);
  
  return Math.floor(damage * (1 - penaltyDmg ));
}

function getStaminaBlockWindow() {
  const staminaRatio = getStaminaRatio();
    
  return lerp(0.6, 1, staminaRatio);
}

function getStaminaNormalBlockReduction(reduction) {
  const staminaRatio = getStaminaRatio();

  // 0 stamina → 60% skuteczności bloku
  const fatigueMultiplier = lerp(0.6, 1, staminaRatio);

  return reduction * fatigueMultiplier;
}

function getPerfectBlockRefund(baseCost, errorMs) {
  const staminaRatio = getStaminaRatio();
  const window = getStaminaBlockWindow();

  const precision = Math.max(0, 1 - Math.abs(errorMs) / window);

  // nagroda za skill
  const precisionRefund = lerp(0.8, 1.0, precision);

  // zmęczenie osłabia, ale nie zabija
  const staminaPenalty = lerp(0.6, 1, staminaRatio);

  return Math.round(baseCost * precisionRefund * staminaPenalty);
}

/*function getBlockWindows(player) {
  const staminaFactor = getStaminaBlockWindow(); // 0.6 – 1.0
  const bonusFactor = 1 + player.perfectWindowBonus;

  const perfect = 35 * staminaFactor * bonusFactor; // ±35 ms
  const normal  = 110 * staminaFactor;               // ±110 ms
  const miss    = TIMED_DURATION / 2;                // reszta

  return { perfect, normal, miss };
}*/

function msToPercent(ms) {
  return (ms / (PERFECT_CENTER)) * 50;
}

const BASE_TOTAL_WINDOW = 230; // ms (perfect + normal przy full stam)
const PERFECT_RATIO_MIN = 0.13;
const PERFECT_RATIO_MAX = 0.27;

function getBlockWindows(player) {
  const staminaFactor = getStaminaBlockWindow(); // np. 0.6 – 1.0
  const bonusFactor = 1 + player.perfectWindowBonus;

  // 1️⃣ Cały sensowny obszar bloku
  const total = BASE_TOTAL_WINDOW * staminaFactor;

  // 2️⃣ Proporcja perfecta (zależna od blockPower)
  const perfectRatio = lerp(
    PERFECT_RATIO_MIN,
    PERFECT_RATIO_MAX,
    player.blockPower
  );

  //GDYBY FLAT BYŁ ZA MOCNY
  const agiBonus = 1 + player.agi * 0.002; // 200 AGI = +40%
   
  //GDYBY BYŁA POTRZEBA LIMITU
  /*const maxPerfect = total * 0.6; // max 60% okna
  
  const perfect = Math.min(
    total * perfectRatio * bonusFactor * agiBonus,
    maxPerfect
  );*/
  
  // 3️⃣ Okna
  const perfect = total * perfectRatio * bonusFactor * agiBonus;
  const normal  = total - perfect;

  // 4️⃣ Miss = reszta paska
  const miss = (PERFECT_CENTER) - total;

  return {
    perfect,
    normal,
    miss
  };
}

/*function getBlockWindows(player) {
  const perfectWindow = getPerfectWindow(player.blockPower); 
  const staminaWindow = getStaminaBlockWindow();
  const perfectWindowBonus = player.perfectWindowBonus + 1;
  const perfect = perfectWindow * staminaWindow * perfectWindowBonus;
  console.error(`perfectWindow, staminaWindow, window`, perfectWindow, staminaWindow, window);
  
  const normal = 120;  
  const miss = TIMED_DURATION / 2;

  return {
    perfect: perfect,
    normal: normal * staminaWindow,
    miss: miss
  };
}*/

function getPerfectWindowRange(player) {
  const perfectWindow = getPerfectWindow(player.blockPower); 
  const staminaWindow = getStaminaBlockWindow();
  const perfectWindowBonus = player.perfectWindowBonus + 1;
  const perfect = perfectWindow * staminaWindow * perfectWindowBonus;
 // console.error(`perfectWindow, staminaWindow, window`, perfectWindow, staminaWindow, window);
  
  const half = perfect / 2;
  
  return {
    start: PERFECT_CENTER - half,
    end: PERFECT_CENTER + half
  };
}

function getTimedBlockReduction(blockPower) {
  // blockPower 0.25 – 0.75
  return lerp(0.35, 0.75, blockPower);
}

function getPerfectWindow(blockPower) {
  return lerp(30, 60, blockPower); // ms
}

function getTimedBlockCooldown(blockPower) {
  return lerp(1800, 800, blockPower); // ms
}

function getReflectPct(blockPower, bonus) {
  return lerp(0.10, 0.30, blockPower) * (1 + (bonus / 100));
}

function getStunDuration(blockPower, bonus) {
  return lerp(1.0, 2.0, blockPower) * (1 + (bonus / 100));
}

function getCritBonus(blockPower, bonus = 0) {
  return lerp(0.75, 1.5, blockPower) * (1 + (bonus / 100)); // +75% → +150% dmg
}

function tryTriggerBlockReward(damage, player, enemy, isSim = false) {
  const playerBlock = gameState.combat.playerBlock;
  const bonus = gameState.char.bonus.perfectWindowBonus;
 // console.error(`bonus reward`, bonus);
  const rewards = ["reflect", "stun", "crit"];
  //const rewards = ["stun"];
  const reward = rewards[Math.floor(Math.random() * rewards.length)];
  
  switch (reward) {
    case "reflect":
      let reflectDamage = getReflectPct(player.blockPower, bonus);
      dealDamageToEnemy(enemy, Math.floor(damage * reflectDamage));
      showReward(`+${(reflectDamage * 100).toFixed(0)}% ${t("dmg_reflect_reward")}`, 2100);
      break;

    case "stun":
      let stunDuration = getStunDuration(player.blockPower, bonus) * 1000;
      applyEnemyStun(enemy, 0.001, stunDuration, gameState.world.selectedSlotIndex);
      showReward(`${(stunDuration / 1000).toFixed(1)}${t("stun_enemy_reward")}`, 2100);
      break;

    case "crit":
      playerBlock.critBonus = getCritBonus(player.blockPower, bonus);
      showReward(`${t("next_crit_reward")} x${(playerBlock.critBonus + 1).toFixed(1)}`, 2100);
      playerBlock.nextAttackGuaranteedCrit = true;
      break;
  }
    if(isSim) {
      //console.error(`reward`, reward);
      return reward;
  }
}

function rollChance(chance) {
  return Math.random() < chance;
}

function getDefensiveBlockReduction(blockPower) {
  const staminaRatio = getStaminaRatio(); // 0–1

  // 1️⃣ Normalizacja blockPower
  // 30 → 0
  // 60 → 1
  const t = Math.max(0, Math.min(1, (blockPower - 30) / 30));

  // 2️⃣ Agresywna krzywa (szybko rośnie)
  const baseReduction = lerp(0.75, 0.95, t * t);

  // 3️⃣ Stamina MA WPŁYW, ale nie zabija
  const staminaPenalty = lerp(0.85, 1, staminaRatio);

  return Math.min(baseReduction * staminaPenalty, 0.95);
}

function applyDevensiveBlockRegen(deltaTime) {
  const combat = gameState.combat;
  const char = gameState.char;
  
  if (combat.playerBlock.mode === "timed" || !combat.playerBlock.active) return;
  
  /*const regen =
    combat.stats.maxHp *
    (DEFENSIVE_HP_REGEN_PERCENT_PER_SEC / 100) *
    deltaTime;
  
  combat.stats.currentHp = Math.min(combat.stats.currentHp + regen, combat.stats.maxHp);
  
  renderHpBar(combat.stats.currentHp, combat.stats.maxHp);
  */
  
  const regen =
    char.maxHp *
    (DEFENSIVE_HP_REGEN_PERCENT_PER_SEC / 100) *
    deltaTime;
  
  char.hp = Math.min(char.hp + regen, char.maxHp);
  
  renderHpBar(char.hp, char.maxHp);
  
}

let guardStacks = 0;

function consumeGuardStacksOnAttack(damage) {
 // console.error(`consumeGuardStacksOnAttack block active`, gameState.combat.playerBlock.active);

  if (gameState.combat.activeRingMode !== `guard`) return damage;
  
  if (gameState.combat.playerBlock.mode === `timed`) return damage;
  
  if (gameState.combat.playerBlock.active) return damage;
  
  let bonus = 1; // +15% per stack
  
  if(guardStacks == 1) bonus = 1.3;
  if(guardStacks == 2) bonus = 1.75;
  if(guardStacks == 3) bonus = 2.3;
  
  guardStacks = 0;
  
 // console.error(`consumeGuardStacksOnAttack block bonus`, bonus);
  
  consumeGuardStacks(guardStacks);
  
  return Math.floor(damage * bonus);
}

function getPotionEffectMultiplier() {
  return (gameState.combat.playerBlock.mode === "defensive" && gameState.combat.playerBlock.active)
    ? DEFENSIVE_POTION_EFFECT_MULTIPLIER
    : 1;
}

function onPerfectBlock() {
  const player = getPlayerStats();
  
  const energyGain = 2 * (1 + player.perfectBlockEnergy);
  gainEnergy(energyGain);
  showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
}

function onCrit() {
  const player = getPlayerStats();
  
  //console.error(`player.critEnergy`, player.critEnergy);
 
  const energyGain = 1 * (1 + player.critEnergy);
  gainEnergy(energyGain);
  showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
}

function getEnergyCombatMultiplier(cost) {
  const energyState = gameState.resources.energyState;

  if (energyState.current >= cost) return 1;

  const ratio = energyState.current / cost;

  
  return Math.max(0.35, ratio);
}

function applyEnergyDebuff(mult) {
  const combat = gameState.combat;

  combat.stats.energyMultiplier = mult;

  combat.stats.hp *= mult;
  combat.stats.dmg *= mult;
  combat.stats.def *= mult;
  
  renderStats();
  updateGlobalStatsColors();
}

function applyDeathDebuff() {
  const combat = gameState.combat;

  combat.deathDebuff.deathMultiplier = 0.9;
  combat.deathDebuff.deathDebuffFightsLeft = 2;
  
  saveGame();
}

function handleDeathDebuffAfterFight() {
  const combat = gameState.combat;

  if (combat.deathDebuff.deathDebuffFightsLeft > 0) {
    combat.deathDebuff.deathDebuffFightsLeft--;

    if (combat.deathDebuff.deathDebuffFightsLeft <= 0) {
      combat.deathDebuff.deathMultiplier = 1;
    }
  }
  
}

function applyEnergyFatigue() {
  const combat = gameState.combat;

  const f = combat.stats.energyFatigueStack;
  const penalty = Math.min(f * 0.05, 0.25);
  
  combat.stats.hp *= (1 - penalty);
  combat.stats.dmg *= (1 - penalty);
  combat.stats.def *= (1 - penalty);
  
  showOutcome("miss", `${t("tired_outcome")} x${f}`, 3500);
  
  renderStats();
}

function setStatPreview({ hp, dmg, def }) {
  document.getElementById("hp").textContent = Math.floor(hp);
  document.getElementById("dmg").textContent = Math.floor(dmg);
  document.getElementById("def").textContent = Math.floor(def);
}

function restoreBaseStats() {
  const base = getPlayerStats(); // twoja funkcja

  document.getElementById("hp").textContent = formatNumber(base.maxHp);
  document.getElementById("dmg").textContent = formatNumber(base.dmg);
  document.getElementById("def").textContent = formatNumber(base.def);

  updateGlobalStatsColors(); // wraca do default / buff
}

let debuffPreviewTimer = null;

function debuffStatsPreview(type, i) {
  initCombatState();
  const combat = gameState.combat;

  const attackBtn = document.getElementById(`slot-attack-button-${i}`);
  const cost = getEnergyCostForSlot(type);
  const multiplier = getEnergyCombatMultiplier(cost);

  if (multiplier >= 1) return;

  applyEnergyDebuff(multiplier);
  applyEnergyFatigue();
  
  showOutcome("miss", `${t("tired_outcome")}`, 3500);

  // 🛑 wyczyść poprzedni preview jeśli istnieje
  if (debuffPreviewTimer) {
    clearTimeout(debuffPreviewTimer);
  }

  // 👁️ POKAŻ PREVIEW
  setStatPreview({
    hp: combat.stats.hp,
    dmg: combat.stats.dmg,
    def: combat.stats.def
  });

  combat.flags.previewStats = true;
  combat.stats.energyMultiplier = multiplier;

  updateGlobalStatsColors();

  attackBtn.classList.add("hidden");
 
  // ⏳ COFNIJ PO CHWILI
  debuffPreviewTimer = setTimeout(() => {
    combat.flags.previewStats = false;
    restoreBaseStats();
    debuffPreviewTimer = null;
    attackBtn.classList.remove("hidden");
  }, 1500); // 👈 idealne UX: 1–1.5s
}

function applyHpToDmgBonus(threshold, maxBonus) {
  const combat = gameState.combat;
  const ls = combat.criticalLastStand;

  //console.error(`maxBonus before`, maxBonus);
  
  if (ls?.active) {
    threshold = Math.max(threshold, ls.bonusThreshold);
    maxBonus = Math.max(maxBonus, ls.bonusCap);
  }
  
  //console.error(`maxBonus after`, maxBonus);
  
  const hpPct = combat.stats.currentHp / combat.stats.maxHp;
  
  let curve = 1;
  
  if(threshold >= 0.4) curve = 2;
  if(threshold >= 0.5) curve = 3;
  
  if (hpPct >= threshold) return 1;

  const progress =
    (threshold - hpPct) / threshold;

  const bonus = maxBonus * Math.pow(progress, curve);

  showReward(`+${(bonus * 100).toFixed(0)}% ${t("last_stand_reward")}`);
  
  return 1 + bonus;
}

function triggerIronStance(reduction, cooldownMs) {
  const s = gameState.combat.ironStance;
  const now = getGameTime();

  if(!s.reduction) return;
  
  if (now < s.cooldownUntil) return;

  s.reduction = reduction;
  s.primed = true;
}

function applyIronStanceReduction(dmg, cooldownMs) {
  const s = gameState.combat.ironStance;
  if (!s.primed) return dmg;

  s.primed = false;
  s.cooldownUntil = getGameTime() + cooldownMs;

  return dmg * (1 - s.reduction);
}

function addArmorStack(durationMs) {
  const now = getGameTime();
  const s = gameState.combat.armorStacks;

  // jeśli okno nieaktywne lub wygasło → start nowego okna
  if (!s.active || now > s.expiresAt) {
    s.active = true;
    s.stacks = 1;
    s.expiresAt = now + durationMs;
    return;
  }

  // jeśli okno aktywne → tylko stackuj
  s.stacks = Math.min(s.stacks + 1, 5);
}

function getArmorWithStacks(baseArmor, stackBonus) {
  const s = gameState.combat.armorStacks;

  if (!s.active || getGameTime() > s.expiresAt) {
    s.active = false;
    s.stacks = 0;
    return baseArmor;
  }

  return baseArmor * (1 + s.stacks * stackBonus);
}

let actionLockTimeout = null;

function lockActions({ duration, reason, allow = [] }) {
  const actionLock = gameState.combat.actionLock;
  actionLock.locked = true;
  actionLock.reason = reason;
  actionLock.allowedActions = allow;
  
  if (duration !== Infinity) {
    actionLock.until = Date.now() + duration;

    if (actionLockTimeout) clearTimeout(actionLockTimeout);

    actionLockTimeout = setTimeout(unlockCriticalActions, duration);
  } else {
    actionLock.until = Infinity;
  }

  saveGame();
  updateActionLockUI();
}

function restoreActionLock() {
  const actionLock = gameState.combat.actionLock;
  
  if (!actionLock.locked) return;

  if (actionLock.until === Infinity) return;

  const remaining = actionLock.until - Date.now();

  if (remaining <= 0) {
    unlockCriticalActions();
  } else {
    actionLockTimeout = setTimeout(unlockCriticalActions, remaining);
  }
  
}

function unlockCriticalActions() {
  const actionLock = gameState.combat.actionLock;

  actionLock.locked = false;
  actionLock.reason = null;
  actionLock.until = 0;
  actionLock.allowedActions = [];

  if (actionLockTimeout) {
    clearTimeout(actionLockTimeout);
    actionLockTimeout = null;
  }

  saveGame();
  updateActionLockUI();
}

function canPerformAction(actionType) {
  const actionLock = gameState.combat.actionLock;
 // console.error(`enter canPerformAction locked, has allowed, actionType`, actionLock.locked, actionLock.allowedActions.includes(actionType), actionType);

  if (!actionLock.locked) return true;
  return actionLock.allowedActions.includes(actionType);
}

function lockScroll() {
  document.body.classList.add("no-scroll");
}

function unlockScroll() {
  document.body.classList.remove("no-scroll");
}

function updateActionLockUI() {
  const { locked, allowedActions } = gameState.combat.actionLock;
  const dlgContainer = document.getElementById("attack-dialog-box");

  // 🔥 1 operacja zamiast wielu
  dlgContainer.classList.toggle("locked", locked);

  // 🔥 tylko dla wyjątków (mało elementów)
  actionElements.forEach(el => {
    const action = el.dataset.action;

    if (allowedActions.includes(action)) {
      el.classList.add("allowed");
    } else {
      el.classList.remove("allowed");
    }
  });
}

/*function updateActionLockUI() {
  const actionLock = gameState.combat.actionLock;

  actionElements.forEach(el => {
    const action = el.dataset.action;

    if (!actionLock.locked || actionLock.allowedActions.includes(action)) {
      el.classList.remove("locked");
    } else {
      el.classList.add("locked");
    }
  });
}*/

function enterCriticalState() {
  const combat = gameState.combat;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
  combat.flags.isCritical = true;
  
  combat.stats.currentHp = 0;

  stopEnemyAttack(gameState.world.selectedSlotIndex); // przerywa CD, jelly, wszystko

  //console.error(`enter critical state`);
  lockActions({ duration: Infinity, reason: "critical", allow: ["potion", "block"] });
  pauseAllSkillsCooldown();
  pausePlayerAttack();
  
  //showCriticalUI();

  //showOutcome(`miss`, `STAN KRYTYCZNY`);
  
  //triggerCriticalShake();
  startFinisherBar(CRITICAL_FINISHER_TIME, enemy);
  
  startEnemyFinisherWindup(enemy, gameState.world.selectedSlotIndex);
}

function startEnemyFinisherWindup(enemy, slotIndex) {
  const baseCooldown = calculateCooldown(enemy.atkSpd) * 1000;
  
  enemy.attackState = {
    phase: "finisher-windup",
    remaining: CRITICAL_FINISHER_TIME,
   // total: CRITICAL_FINISHER_TIME
  };

 // console.error(`start finisher wind up`);
  
  emitEnemyAttackWindup({
    enemy,
    slotIndex,
    duration: CRITICAL_FINISHER_TIME
  });
  
  enemy.finisherTimeout = setTimeout(() => {
     performEnemyFinisherAttack(enemy, slotIndex);
  }, CRITICAL_FINISHER_TIME);
}

function performEnemyFinisherAttack(enemy, slotIndex) {
  //console.error("FINISHER ATTACK");
  const combat = gameState.combat;
  const player = getPlayerStats();
  
  if (!combat.flags.isCritical) return;

  let dmg = applyBlock(enemy.dmg, player, enemy);
  
  ({ dmg: dmg } = calculateReducedEnemyDamage(dmg, enemy, player));
  
  if (combat.flags.isBlocked && combat.playerBlock.lastResult === `perfect`) { 
    //combatState.isBlocked = false;
    combat.stats.currentHp = 2;
  }

  triggerCriticalShake();
  
  //console.error("combatState.currentHp in perform finsher attack and dmg", combat.stats.currentHp, dmg);
  updatePlayerHp(combat.stats.currentHp - dmg);

  resolveFinalEnemyAttack(enemy, slotIndex);
}

function resolveFinalEnemyAttack() {
  const combat = gameState.combat;
  if (!combat.flags.isCritical) return;
  
  if (combat.stats.currentHp > 0) {
    exitCriticalState();
    return;
  }
  
  handlePlayerDeath();
}

function exitCriticalState() {
  const combat = gameState.combat;
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
  combat.flags.isCritical = false;
  combat.flags.isBlocked = false;

  unlockCriticalActions();

  //console.error(`exit critical state`);
  
  resumeAllSkillsCooldown();
  resumePlayerAttack();
  
  applyEnemyRecoveryAfterFinisher(enemy, gameState.world.selectedSlotIndex);
  
  showOutcome(`wind-up`, `${t("survive_outcome")}`);

  grantCriticalLastStand();
  
  //showRecoverUI();
}

function applyEnemyRecoveryAfterFinisher(enemy, slotIndex) {
  const bar = document.querySelector(".enemy-cooldown-bar");
  const fill = document.getElementById(`enemy-cooldown-fill-${slotIndex}`);

  const RECOVERY_TIME = 1500; // 2 sekundy

  stopEnemyAttack(slotIndex);

  bar.classList.add("recovery");
  fill.classList.add("recovery");

  //updateCooldownBar(0, slotIndex);
  
  setTimeout(() => {
    if (!gameState.combat.flags.isCritical) {
      bar.classList.remove("recovery");
      fill.classList.remove("recovery");

      startEnemyAttackTimeline(enemy, slotIndex);
    }
  }, RECOVERY_TIME);
}

function grantCriticalLastStand() {
  gameState.combat.criticalLastStand = {
    active: true,
    bonusThreshold: 0.6,   // normalnie np. 0.3
    bonusCap: 0.6          // max +60% dmg
  };

  //showOutcome("buff", "OSTATNI ZRYW");
}

function criticalPotionModifier() {
  const staminaRatio = getStaminaRatio();

  // od 100% do 160%
  return 1 + staminaRatio * 0.6;
}

function criticalBlockReduction() {
  const staminaRatio = getStaminaRatio(); // 0–1
  
  return 0.3 + staminaRatio * 0.4; // 30% → 70%
}

function calculateDeathGoldLoss(gold) {

  const pctLoss = Math.floor(gold * 0.15);
  const flatLoss = 50; // minimalna kara

  return Math.min(gold, Math.max(flatLoss, pctLoss));
}

function getPlayerGold() {
  return parseInt(gameState.resources.gold, 10);
}

function setPlayerGold(value) {
  gameState.resources.gold = value;
  saveGame();
}

function handlePlayerDeath() {
  const context = collectDeathContext();
  const combat = gameState.combat;

  let gold = getPlayerGold(); // ⬅️ JEDNO ŹRÓDŁO
  const goldLoss = calculateDeathGoldLoss(gold);
  const goldLeft = Math.max(0, gold - goldLoss);
  
  stopEnemyAttack(gameState.world.selectedSlotIndex);
  
  exitCombat();
  combat.flags.isCritical = false;
  combat.flags.isBlocked = false;
  hideFleeButton();
  //console.warn(`lose combat in combat atack`);
  showOutcome(`miss`, `${t("loose_outcome")}`);
  
  loseCombat();
  //unlockCriticalActions();
  resumeAllSkillsCooldown();
  resumePlayerAttack();
  
  if(gameState.world.mode === `expedition`) {
    showExpeditionRunSummary(true);
    return;
  }
  
  //gameState.world.currentStepIndex = 0;
  //loadStep(gameState.world.currentStepIndex); // ← ładuje stan exploreOptions i inne rzeczy
  //unlockActions();
  //lockActions({ duration: 5000, reason: "death" });
  
  const nextArrow = document.getElementById("arrow-next-icon");
  const nextLevel = document.getElementById("next-level");
  const nextBtn = document.getElementById("next-btn");

  nextArrow.classList.remove(`hidden`);
  nextLevel.classList.add(`hidden`);
  
  nextBtn.onclick = (e) => { 
    e.stopPropagation(); 
    rollOptions();
  };
  
  renderOptions(); // ← renderuje sloty, wrogów, skrzynie itd.
  hideAttackBtn();
  highlightCurrentStep(); // ← aktualizuje pasek postępu
  
  renderStats();
  
  setPlayerGold(goldLeft); // ⬅️ zapis + runtime + localStorage
  applyDeathDebuff(); 
  
  playSound(`death`, 0.4);
 
  showDeathPopupDelayed({ goldLost: goldLoss, context })
}

/*function showDeathPopup() {
  const debuffEl = document.getElementById("death-debuff");
  const debuffValueEl = document.getElementById("death-debuff-value");
  const combat = gameState.combat;

  if (combat.deathDebuff.deathMultiplier < 1) {
    const percent = Math.round((1 - combat.deathDebuff.deathMultiplier) * 100);

    debuffValueEl.textContent = `-${percent}% ${t("death_penalty_text1")} (${combat.deathDebuff.deathDebuffFightsLeft} ${t("death_penalty_text2")})`;
    debuffEl.classList.remove("hidden");
  } else {
    debuffEl.classList.add("hidden");
  }

  document.getElementById("death-popup").classList.remove("hidden");
}*/


function showDeathPopupDelayed({ goldLost, context }) {
  const popup = document.getElementById("death-popup");
  const info = document.getElementById("death-info");
  const goldEl = document.getElementById("gold-loss");
  const tipEl = document.getElementById("death-tip");
  const popupCard = popup.querySelector(".popup-content");
  const debuffEl = document.getElementById("death-debuff");
  const debuffValueEl = document.getElementById("death-debuff-value");
  const combat = gameState.combat;

  setPopupBackground2(popupCard, "common");
  
  const reasonText = pickDeathReason(context);
  const tipText = getRandomDeathTip();

  info.textContent = t(reasonText);
  tipEl.textContent = `${t(tipText)}`;
  goldEl.textContent = goldLost;
  
  if (combat.deathDebuff.deathMultiplier < 1) {
    const percent = Math.round((1 - combat.deathDebuff.deathMultiplier) * 100);

    debuffValueEl.textContent = `${t("death_penalty_text1")} ${percent}% ${t("death_penalty_text2")} ${combat.deathDebuff.deathDebuffFightsLeft} ${t("death_penalty_text3")}.`;
    
    debuffEl.classList.remove("hidden");
  } else {
    debuffEl.classList.add("hidden");
  }
  
  setTimeout(() => {
    popup.classList.remove("hidden");

    // 🔑 wymuszenie reflow
    void popup.offsetHeight;

    popup.classList.add("visible");
  }, 1000);
  
  
  const deathBtn = document.getElementById("death-confirm");
    
  deathBtn.classList.add("locked");
  deathBtn.disabled = true;

  setTimeout(() => {
    deathBtn.classList.remove("locked");
    deathBtn.disabled = false;
  }, 3000);
  
  deathBtn.onclick = () => {
    popup.classList.remove("visible");
    
    gameState.world.currentStepIndex = 0;
    loadStep(gameState.world.currentStepIndex); // ← ładuje stan exploreOptions i inne rzeczy
    showNavigateButtons();
    navigate(`battle`);
    
    setTimeout(() => {
      popup.classList.add("hidden");
      unlockCriticalActions();
    }, 600); // tyle co transition
  };
  
  setGlobalButtonTexture(deathBtn);
}

function collectDeathContext() {
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();
  const combat = gameState.combat;
  const resources = gameState.resources;

  const ctx = {
    wasBlocking: combat.flags.isBlocked,
    blockSuccess: combat.playerBlock.lastResult === `perfect`,
    potionsEmpty: resources.potions.every(p => !p),
    hadPotions: resources.potions.some(p => p),
    lowEnergy: resources.energyState.current <= 2,
    energyDebuffStacks: combat.stats.energyFatigueStack > 1,
    enemyOverwhelmed: isOverwhelmed({
      player,
      enemy,
      context: {
        potionsEmpty: resources.potions.every(p => !p),
        lowEnergy: resources.energyState.current <= 2,
        energyDebuffStacks: combat.stats.energyFatigueStack > 1
      }
    })
  };
  
  /*console.error(`wasBlocking`, ctx.wasBlocking);
  console.error(`blockSuccess`, ctx.blockSuccess);
  console.error(`potionsEmpty`, ctx.potionsEmpty);
  console.error(`hadPotions`, ctx.hadPotions);
  console.error(`lowEnergy`, ctx.lowEnergy);
  console.error(`energyDebuffStacks`, ctx.energyDebuffStacks);
  console.error(`enemyOverwhelmed`, ctx.enemyOverwhelmed);*/

  
  return ctx;
}

function collectDeathReasons(context) {
  const reasons = [];

  if (context.wasBlocking && !context.blockSuccess) {
    reasons.push({ type: "failedBlock", weight: 6 });
  }

  if (context.enemyOverwhelmed) {
    reasons.push({ type: "overwhelmed", weight: 5 });
  }
  
  if (context.lowEnergy) {
    reasons.push({ type: "exhaustion", weight: 4 });
  }

  if (context.potionsEmpty) {
    reasons.push({ type: "noPotions", weight: 3 });
  }

  if (!context.wasBlocking && context.hadPotions) {
    reasons.push({ type: "panic", weight: 2 });
  }

  return reasons;
}

function pickDeathReason(context) {
  const candidates = collectDeathReasons(context);
  
  const top = candidates.sort((a, b) => b.weight - a.weight)[0];
  return randomFrom(deathReasons[top.type]);
}

function calculateOverwhelmedScore({ player, enemy, context }) {
  let score = 0;

  // A. Przewaga wroga
  if (enemy.level >= player.level + 2) score += 2;
  if (enemy.attack >= player.maxHp * 0.6) score += 2;
  if (enemy.type === `elite`) score += 1;
  if (enemy.type === `mini_boss`) score += 2;

  // B. Zły stan gracza
  if (player.currentHp < player.maxHp * 0.4) score += 1;
  if (context.lowEnergy) score += 1;
  if (context.energyDebuffStacks) score += 2;

  // C. Tempo walki
  if (enemy.atkSpd >= 1) score += 1;
  
  // D. Brak opcji ratunku
  if (context.potionsEmpty) score += 1;
  
  return score;
}

const OVERWHELMED_THRESHOLD = 4;

function isOverwhelmed(state) {
  const score = calculateOverwhelmedScore(state);
  return score >= OVERWHELMED_THRESHOLD;
}

function showLevelUpPopup() {
  const popup = document.getElementById("levelup-popup");
  const popupCard = popup.querySelector(".popup-content");
  const flavorEl = popup.querySelector(".levelup-flavor");
  const level = document.getElementById("levelup-lvl");

  setPopupBackground2(popupCard, "set");
  
  //console.error(`enter levelup`);
  
  level.textContent = `${t("enemy_lvl_info")} ` + gameState.char.level;
  flavorEl.textContent = t(getRandomLevelUpFlavor());
     
  setTimeout(() => {
    popup.classList.remove("hidden");
    popup.classList.remove("visible");
    
    playSound(`level-up`, 1.6, 0.8, 0.3);
    
    // 🔑 wymuszenie reflow
    void popup.offsetHeight;

    popup.classList.add("visible");
    //console.error(`showup levelup`);

  }, 1000);
  
  const levelUpBtn = document.getElementById("levelup-confirm");
    
  levelUpBtn.classList.add("locked");
  levelUpBtn.disabled = true;

  setTimeout(() => {
    levelUpBtn.classList.remove("locked");
    levelUpBtn.disabled = false;
  }, 3000);
  
  levelUpBtn.onclick = null;
  levelUpBtn.onclick = () => {
    popup.classList.remove("visible");
    
    setTimeout(() => {
      popup.classList.add("hidden");
    }, 600); 
  };
  
  setGlobalButtonTexture(levelUpBtn);
  //console.error(`end levelup`);

}

function getRandomLevelUpFlavor() {
  return levelUpFlavors[Math.floor(Math.random() * levelUpFlavors.length)];
}

function applyPoiseDamage(enemy, player, value) {
  if (enemy.poiseBroken) return;
  
  if(enemy.poise > 0) {
    enemy.poise -= value;
  } 
  
  if (enemy.poise < 0) {
    enemy.poise = 0;
  }
  
  
  if (enemy.poise <= 0) {// && enemy.attackState.phase === "windup") {
    breakPoise(enemy, player);
  }
}

function breakPoise(enemy, player) {
  const bar = document.querySelector(".poise-bar");
  const strScale = getStrScaling(player);

  enemy.poiseBroken = true;
  enemy.poise = 0;

  const duration = 1200 + (strScale.durationBonus * 2000);
  
  showOutcome(`miss`, `${t("break_outcome")}`);
  
  playSound(`poise_break`, 0.4);
  
  applyEnemyStun(enemy, 0.001, duration, gameState.world.selectedSlotIndex);
  
  bar.classList.add("break-impact");
  setTimeout(() => bar.classList.remove("break-impact"), 250);  
  
  triggerCriticalShake();
  
  //slowMoImpact();
  
  enemy.wasInterruptedRecently = true;
  
  const interruptPower = 800 + (player.str * 3);
  triggerInterrupt(enemy, interruptPower); // przerywa windup
 
  tryInterruptEnemy(enemy, `poise-break`);
  
  setTimeout(() => {
    enemy.poiseBroken = false;
    enemy.poise = enemy.maxPoise * 0.5; // wraca z połową
  }, 2000);
}

function hammerOnHit(enemy, player) {
  gameState.combat.activeRingMode = "poise";
  
  const strScale = getStrScaling(player);

  let poiseDmg = 35 + strScale.effectPower;

  if(enemy.isGuarding) {
    poiseDmg *= 0.6;
  }
  
  applyPoiseDamage(enemy, player, poiseDmg);
  
  // bonus: dociążenie cooldownu
  if (enemy.attackState.phase === "cooldown") {
    enemy.attackState.remaining += 300 + player.str * 1.5;
  }
}

function triggerInterrupt(enemy, penaltyMs = 800) {

  if (!enemy.attackState) return;

  //if (enemy.attackState.phase !== "windup") return;

  const now = performance.now();

  // cofamy do cooldown
  enemy.attackState.phase = "cooldown";

  // dodajemy karę
  enemy.attackState.remaining += penaltyMs;
}

function doubleaxeOnHit(enemy, player) {
  if (!enemy.bleedStacks) enemy.bleedStacks = 0;

  gameState.combat.activeRingMode = "bleed";
  
  enemy.bleedStacks++;
  enemy.lastBleedHit = getGameTime();

  if(gameState.world.inCombat) updateBleedRing(enemy);

  if(!enemy.bleedReady) {
    showReward(`${t("bleed_reward")} ${enemy.bleedStacks}/3`);
  }
  
  // 🔥 jeśli osiągnął max → tylko ustaw stan READY
  if (enemy.bleedStacks >= 3 && !enemy.bleedReady) {
    enemy.bleedReady = true;
    enemy.bleedStacks = 3;
    setBleedReadyUI(true);
    //showBleedTimingUI(player); 
  }
  // 💥 jeśli już był ready → odpal burst
  else if (enemy.bleedReady) {
    //handleBleedAttack(enemy, player);
    //triggerBleedBurst(enemy, player);
  }
}

function triggerBleedBurst(enemy, player, perfect = false) {
  const strScale = getStrScaling(player);

  let baseDmg = 0.15 * (1 + strScale.effectPower / 100); // 🔥 DUŻO większe niż normal bleed
  let duration = 4 + strScale.durationBonus;

  if(perfect && !enemy.isGuarding) {
    baseDmg *= 1.6;
    duration *= 1.3;
  }
    
  applyBleed(enemy, baseDmg, duration);
  
  triggerBleedVFX();

  resetBleed(enemy);
  resetBleedUI();
}

function resetBleed(enemy) {
  //if (gameState.combat.activeRingMode !== `bleed`) return;
  
  enemy.bleedStacks = 0;
  enemy.bleedReady = false;
  gameState.combat.bleedTimingActive = false;
  
  updateBleedRing(enemy);
  setBleedReadyUI(false);
}

function getBleedWindows(player) {
  const BASE_TOTAL = 260; // większe niż block → łatwiejsze
  const PERFECT_RATIO = 0.22; // większe okno

  const agiBonus = 1 + player.agi * 0.0015; // delikatniejszy scaling niż block

  const total = BASE_TOTAL;
  const perfect = total * PERFECT_RATIO * agiBonus;
  const normal = total - perfect;

  return {
    perfect,
    normal
  };
}

function getTimingResult() {
  const bar = document.getElementById("timing-mode");
  const indicator = bar.querySelector(".time-indicator");
  const perfect = bar.querySelector(".perfect-window");
  const normal = bar.querySelector(".normal-window");

  const iRect = indicator.getBoundingClientRect();
  const pRect = perfect.getBoundingClientRect();
  const nRect = normal.getBoundingClientRect();

  const iCenter = iRect.left + iRect.width / 2;

  if (iCenter >= pRect.left && iCenter <= pRect.right) {
    return "perfect";
  }

  if (iCenter >= nRect.left && iCenter <= nRect.right) {
    return "normal";
  }

  return "miss";
}

function handleBleedAttack(enemy, player) {
  const result = getTimingResult();
  const now = performance.now();

  if (result === "perfect") {
    triggerBleedBurst(enemy, player, true);
    playSound(`bleed_boom`, 0.5);
    triggerCriticalShake();
    showOutcome("perfect", `${t("bleed_perfect_outcome")}`);
  } else if (result === "normal") {
    showOutcome("normal", `${t("bleed_outcome")}`);
    triggerBleedBurst(enemy, player, false);
  } else {
    showOutcome("miss", `${t("bleed_miss_outcome")}`);
    enemy.bleedStacks = 1; // kara
    enemy.bleedReady = false;
    updateBleedRing(enemy);
  }

  stopBleedTimingUI();
  
  const atkSpeed = getPlayerAttackSpeed();
  const cooldownDuration = calculateCooldown(atkSpeed);

  startAttackCooldown(cooldownDuration);
  playerAttackCooldown.playerCooldownEnd = now + cooldownDuration * 1000;
  
  gameState.combat.bleedTimingActive = false;
  
  //enemy.bleedReady = false;
}

function greatswordOnHit(enemy, player) {
  // jeśli READY → NIE dodawaj stacków
  if (enemy.armorBreakReady) {
    return;
  }
  
  gameState.combat.activeRingMode = `armor`;
  
  // budowanie stacków
  enemy.exposeStacks = (enemy.exposeStacks || 0) + 1;
  
  enemy.lastArmorBreakHit = getGameTime();
  
  if(gameState.world.inCombat) updateArmorRing(enemy);
  
  if (enemy.exposeStacks >= 3) {
    enemy.exposeStacks = 3;
    enableArmorBreakReady(enemy);
  }

  //console.error(`axe on hit armor break`, enemy.exposeStacks);
}

function enableArmorBreakReady(enemy) {
  enemy.armorBreakReady = true;

  const ring = document.getElementById("guard-ring");
  ring.classList.add("full"); // puls
}

function resolveArmorBreak(enemy) {
  const result = getTimingResult();
  const player = getPlayerStats();
  const now = performance.now();

  const str = player.str;
  const agi = player.agi;
  
  //console.error(`resolve armor break`, enemy.exposeStacks);
  
  if (result === "perfect") {
    let penetration = 0.55 + (str * 0.0015);  
    const duration = 4.3 + (str * 0.015) + (agi * 0.005);

    tryInterruptEnemy(enemy, `perfect-armor`);
    
    if(enemy.isGuarding) {
      penetration *= 0.5;
    }
    
    playSound(`armor_break`, 0.45);
    applyArmorBreak(enemy, penetration, duration);
    triggerBleedVFX();
    triggerCriticalShake();
    resetArmorBreak(enemy);
    showOutcome("perfect", `${t("armor_break_outcome")} -${(penetration * 100).toFixed(0)}%`);
  } else if (result === "normal") {
    const penetration = 0.32 + (str * 0.001);
    const duration = 3.3 + (str * 0.01);
    
    applyArmorBreak(enemy, penetration, duration);
    triggerBleedVFX();
    resetArmorBreak(enemy);
    showOutcome("normal", `${t("armor_scrape_outcome")} -${(penetration * 100).toFixed(0)}%`);
  } else {
    enemy.exposeStacks = 1;
  }
  
   // 🔥 TU ODpalasz cooldown (bo to jest finalny hit)
  const atkSpeed = getPlayerAttackSpeed();
  const cooldownDuration = calculateCooldown(atkSpeed);

  startAttackCooldown(cooldownDuration);
  playerAttackCooldown.playerCooldownEnd = now + cooldownDuration * 1000;
  
  stopArmorBreakTimingUI(enemy); 
  
  gameState.combat.armorBreakTimingActive = false;
  
  enemy.armorBreakReady = false;
  updateArmorRing(enemy);
}

function resetArmorBreak(enemy) {
  if (gameState.combat.activeRingMode !== `armor`) return;
  
  enemy.exposeStacks = 0;
  enemy.armorBreakReady = false;
  gameState.combat.armorBreakTimingActive = false;
  
 // console.error(`reset armor break`, enemy.exposeStacks);
  
  updateArmorRing(enemy);
  setArmorReadyUI(false);
}


function spearOnHit(enemy, player) {
  const slow = 0.08 + player.str * 0.00015;
  const windupBonus = 120 + player.str * 0.5;
  const pushback = 250 + player.str * 1;

 // if (!enemy.spear.stacks) enemy.spear.stacks = 0;
  
  gameState.combat.activeRingMode = `spear`;
  
  applySpearDebuff(enemy, {
    slow,
    windupBonus,
    pushback,
    duration: 3200
  });
}

function applySpearDebuff(enemy, { slow, windupBonus, pushback, duration }) {
  if (!enemy.spear) {
    enemy.spear = {
      stacks: 0,
      slow: 0,
      windupBonus: 0,
      pushback: 0,
      expiresAt: 0
    };
  }

  const player = getPlayerStats();

  const d = enemy.spear;

  d.stacks = Math.min(3, d.stacks + 1);
  d.slow = slow * d.stacks;
  d.windupBonus = windupBonus * d.stacks;
  d.pushback = pushback * d.stacks;
  d.expiresAt = getGameTime() + duration;
  
  if(enemy.isGuarding) {
    d.slow *= 0.5;
    d.windupBonus *= 0.65;
  }
  
  if (enemy.attackState?.phase === "cooldown") {
    enemy.attackState.remaining += d.pushback;
  }
  
  if (enemy.attackState?.phase === "windup") {
    enemy.attackState.remaining += d.windupBonus;
  }
  
  if(gameState.world.inCombat) updateSpearRing(enemy);
  
  if (!enemy.spearReady) {
    showReward(`${d.stacks}x ${t("control_reward")}`);
  }
  
  if (enemy.spear.stacks >= 3 && !enemy.spearReady) {
    enemy.spearReady = true;
    setSpearReadyUI(true);
    startSpearControlUI(player); 
  }
  
  else if (enemy.spearReady) {
    resolveSpearControl(enemy);
  }
}

function getSpearWindows(player) {
  const BASE_TOTAL = 200; // większe niż block → łatwiejsze
  const PERFECT_RATIO = 0.2; // większe okno

  const agiBonus = 1 + player.agi * 0.0015; // delikatniejszy scaling niż block

  const total = BASE_TOTAL;
  const perfect = total * PERFECT_RATIO * agiBonus;
  const normal = total - perfect;

  return {
    perfect,
    normal
  };
}


function resolveSpearControl(enemy) {
  const result = getTimingResult(); // reuse system
  const now = getGameTime();

  if (result === "perfect") {
    extendSpearControl(enemy, 2000);
    tryInterruptEnemy(enemy, `perfect-spear`);
    playSound(`spear_control`, 0.4);
    
    showOutcome("perfect", `${t("control_outcome")}!`);
  } else if (result === "normal") {
    extendSpearControl(enemy, 1000);
    showOutcome("normal", `${t("keep_outcome")}!`);
  } else {
    reduceSpearControl(enemy);
    updateSpearRing(enemy);
    showOutcome("miss", `${t("lost_rythm_outcome")}!`);
  }

  if(enemy.spear.stacks === 0) {
    resetSpear(enemy);
    resetSpearUI();  
    stopSpearControlUI();
  }  
  
  //startAttackCooldown(calculateCooldown(getPlayerAttackSpeed()));
}

function extendSpearControl(enemy, duration) {
  if (!enemy.spear) return;

  enemy.spear.expiresAt += duration;
}

function reduceSpearControl(enemy) {
  if (!enemy.spear) return;

  enemy.spear.stacks = Math.max(0, enemy.spear.stacks - 1);
}

function resetSpear(enemy) {
  if (gameState.combat.activeRingMode !== `spear`) return;
  
  if(enemy.spear?.stacks) {
    enemy.spear.stacks = 0;
  }  
  
  enemy.spearReady = false;

  updateSpearRing(enemy);
  setSpearReadyUI(false);
}


function daggerOnHit(enemy, player) {
  const strScale = getStrScaling(player);

  const doubleHitChance = 0.15 + strScale.procChance;

  if (Math.random() < doubleHitChance) {
    performExtraHit(enemy);
    showReward("DOUBLE");
  }
}

function swordOnHit(enemy) {
  const stats = gameState.combat.stats;
  
  //console.error(`gameState.combat.activeRingMode`, gameState.combat.activeRingMode);
  
  if(gameState.combat.playerBlock.active) return;
  
  if (gameState.combat.activeRingMode === "guard") {
    gameState.combat.activeRingMode = ``;
    return;
  }
  
  if (stats.comboReady) {
    stats.comboReady = false;
    return; 
  }
  
  gameState.combat.activeRingMode = `sword`;
  
  stats.combo = (stats.combo || 0) + 1;
  
  //console.error(`combo`, stats.nextHitMultiplier, stats.combo);
  
  if(gameState.world.inCombat) updateGuardRing("sword", stats.combo);
  
  if (stats.combo >= 2) {
    stats.combo = 0;
    stats.comboReady = true;
    stats.nextHitMultiplier = 1.5;
    
    if(enemy.isGuarding) {
      stats.nextHitMultiplier = 1.2;
    }

  }
}

function maceOnHit(enemy, player) {
  const stats = gameState.combat.stats;
  
  if(gameState.combat.playerBlock.active) return;
  
  if (gameState.combat.activeRingMode === "guard") {
    gameState.combat.activeRingMode = ``;
    return;
  }
  
  if (stats.comboReady) {
    stats.comboReady = false;
    return; 
  }
  
  gameState.combat.activeRingMode = `mace`;
  
  stats.combo = (stats.combo || 0) + 1;

  enemy.attackState.remaining += 150;
  
  if(gameState.world.inCombat) updateGuardRing("mace", stats.combo);
  
  if (stats.combo >= 2) {
    stats.comboReady = true;
  }
}

function axeOnHit(enemy) {
  if(gameState.combat.playerBlock.active) return;
  
  if (gameState.combat.activeRingMode === "guard") {
    gameState.combat.activeRingMode = ``;
    return;
  }
  
  gameState.combat.activeRingMode = `axe`;
  
  if(!enemy.isGuarding) {
    applyBleed(enemy, 0.025, 2.01);
  } 
   
  resetGuardRing();
  triggerRingPulse("axe");
  
  showReward(`${t("bleed_reward")}`);
}

function longswordOnPerfect() {
  gameState.combat.stats.nextHitMultiplier = 1.25;
  setLongswordBuffUI(true);
}

function longswordOnHit(enemy) {
  const stats = gameState.combat.stats;
  
  if(gameState.combat.playerBlock.active) return;
  
  if (gameState.combat.activeRingMode === "guard") {
    gameState.combat.activeRingMode = ``;
    return;
  }
  
  if (stats.comboReady) {
    stats.comboReady = false;
    return; 
  }
  
  gameState.combat.activeRingMode = `sword`;
  
  stats.combo = (stats.combo || 0) + 1;

  if(gameState.world.inCombat) updateGuardRing("sword", stats.combo);
  
  if (stats.combo >= 3) {
    stats.combo = 0;
    //stats.comboReady = true;
    stats.nextHitPenetration = 0.25;
    
    if(enemy.isGuarding) {
      stats.nextHitPenetration = 0.15;
    } 
    
    applyArmorBreak(enemy, stats.nextHitPenetration, 4);
    
    if(enemy.isGuarding) {
      showReward(`${t("break_defense_reward")} -15%`);
    } else {
      showReward(`${t("break_defense_reward")} -25%`);
    }
   
    
    triggerRingFull();
    triggerRingBurst();
    setTimeout(() => {
        resetGuardRing();
    }, 300);
  }
}

function onWeaponHit(enemy, player, weaponType) {
  switch (weaponType) {
    case "short_sword": return swordOnHit(enemy);
    case "mace": return maceOnHit(enemy);
    case "axe": return axeOnHit(enemy);
    case "long_sword": return longswordOnHit(enemy);
    case "hammer": return hammerOnHit(enemy, player);
    case "double_axe": return doubleaxeOnHit(enemy, player);
    case "great_sword": return greatswordOnHit(enemy, player);
    case "spear": return spearOnHit(enemy, player);
    case "dagger": return daggerOnHit(enemy, player);
  }
}

function getStrScaling(player) {
  return {
    dmg: player.str * 3,
    effectPower: player.str * 0.1,     // siła efektów
    procChance: player.str * 0.001,    // 0.1% per STR
    durationBonus: player.str * 0.001   // % czasu efektów
  };
}
