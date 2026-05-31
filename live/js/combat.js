
// === FLEE CONFIG ===
const FLEE_CFG = {
  BASE_CHANCE: 1,        // bazowa szansa 0.55
  LVL_DIFF_BONUS: 0.05,     // +5% za każdy poziom przewagi gracza
  LVL_DIFF_PENALTY: 0.05,   // -5% za każdy poziom przewagi wroga
  MIN_CHANCE: 0.15,         // dolne ograniczenie
  MAX_CHANCE: 0.90,         // górne ograniczenie
  GOLD_LOSS_ON_SUCCESS: 0.10, // -10% złota gdy ucieczka się uda
  GOLD_LOSS_ON_FAIL: 0.05,    // -5% złota gdy się nie uda
  FATIGUE_SEC: 5,           // “zmęczenie” po udanej ucieczce (blokuje skille)
  REENGAGE_LOCK_SEC: 5,     // wróg „nieaktywny” chwilę po ucieczce
  FAIL_EXTRA_HIT: true,     // przy nieudanej ucieczce wróg od razu atakuje
  PITY_BONUS: 0.08          // +8% za każdy fail
};

const STAMINA_COST = {
  TIMED_BLOCK: 15,
  DEFENSIVE_BLOCK: 8,
  DODGE: 25
};

const CRITICAL_FINISHER_TIME = 2300;

const DEFENSIVE_HP_REGEN_PERCENT_PER_SEC = 1;
const DEFENSIVE_POTION_EFFECT_MULTIPLIER = 1.4;
const DEFENSIVE_GUARD_STACK_INTERVAL = 1.2; // sek
const DEFENSIVE_GUARD_STACK_MAX = 3;

const ACTION_BUTTON_SELECTORS = [
  "#attack-button",
  "#attack-left",
  "button.skill-button",
  //".potion-slot",
  //".potions-grid",
  ".potions-section"
];

// ——— COMBAT ———

let isBlocking = false;
let blockDrainInterval = null;

let isOnCooldown = false;
let enemyContent;

let isExploring = false;


function initCombatState() {
  const stats = gameState.combat.stats;
  const player = calculatePlayerStats(gameState.char);
  
  stats.hp = player.maxHp;
  stats.dmg = player.dmg;
  stats.def = player.def;

 // console.error(`combatState.dmg in init`, stats.dmg);
}

function updatePlayerHp(newHp) {
  const char = gameState.char;

  const clampedHp = Math.max(0, Math.min(newHp, char.maxHp));

  char.hp = clampedHp;
 }

let currentBuff = { dmg: 0, def: 0 };

function updatePlayerDmg(newDmg, isBuff = false) {
   
  if (isBuff) {
    currentBuff.dmg = newDmg; 
  } else {
    gameState.char.dmg = newDmg;
    saveGame();
  }
  
  renderStats();
}

function updatePlayerDef(newDef, isBuff = false) {
    
  if (isBuff) {
    currentBuff.def = newDef; 
  } else {
    gameState.char.def = newDef;
    saveGame(); 
  }
  
  renderStats();
}


function updateEnemyHealthBar(enemy, i) {
  //console.log("start update enemy health bar", i);
  if (i === null) return;
  
  const slot = document.querySelectorAll('.explore-slot')[i];
  //const percent = (currentHp / maxHp) * 100;

  //console.log("before percent update enemy health bar", enemy.currentHp, enemy.maxHp);

  const percent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));
  
  const fill = slot.querySelector('.enemy-health-fill');
  const text = slot.querySelector('.enemy-health-text');
  
  //console.log("after percent and fill update enemy health bar", percent);
  
  /*const dom = enemy.dom;
  if(dom?.healthFill) enemy.dom.healthFill.style.transform = `scaleX(${percent / 100})`;
  if(dom?.healthText) enemy.dom.healthText.textContent = `${formatNumber(enemy.currentHp)}/${formatNumber(enemy.maxHp)}`;
  
  console.log("dom.healthFill, dom.healthText", dom.healthFill, dom.healthText.textContent, percent)*/
  
  //if (fill) fill.style.width = `${percent}%`;
  if (fill) fill.style.transform = `scaleX(${percent / 100})`;
  if (text) text.textContent = `${formatNumber(enemy.currentHp)}/${formatNumber(enemy.maxHp)}`;
}

function enterCombat() {
  const char = gameState.char;

  char.inCombat = true;
  char.lastRegenTs = Date.now();
  char.regenAllowedAt = 0;
  gameState.resources.staminaState.inCombat = true;
}

function startCombat(i) {
  const world = gameState.world;
  const combat = gameState.combat;
  const perfectBar = document.querySelector(".perfect-block-bar");
  const bar = document.getElementById("poise-mode");

  //lockScroll();
  
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];

  if(weapon?.baseName === `hammer`) {
    //perfectBar.classList.add("mode-poise");
    //perfectBar.classList.remove("mode-timing");
    bar.classList.remove("hidden");
    combat.activeRingMode = "poise";
  }else {
    combat.activeRingMode = ``;
  }

  world.inCombat = true;
  world.selectedSlotIndex = i;
  world.exploreOptions[i].isAttacked = true;
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
  //console.log("enemy ", enemy.name);
  setMenuDisabled(true); // zablokuj menu
  
  combat.flags.isCritical = false;
  
  combat.stats.combo = 0;
  
  enterCombat();
  
  initCombatState();
  
  playSound(`open`, 0.4);
   
  const enSlot = document.querySelectorAll('.explore-slot')[i];
  enemy.dom = {
    slot: enSlot,
    healthBar: enSlot.querySelector('.enemy-health-bar'),
    healthFill: enSlot.querySelector('.enemy-health-fill'),
    healthText: enSlot.querySelector('.enemy-health-text'),
    cooldownFill: document.getElementById(`enemy-cooldown-fill-${i}`)
  }
  
  const cost = getEnergyCostForSlot(world.exploreOptions[i].type);
  const multiplier = getEnergyCombatMultiplier(cost);
  
  //console.error(`cost i multiplier in start combat`, cost, multiplier, energyState.current);
  
  if(gameState.resources.energyState.current >= cost) {
    combat.stats.energyFatigueStack = 1;
    //saveState();
  }
  
  spendEnergy(world.exploreOptions[i].type);
  
  if(multiplier < 1) {
    combat.flags.isDebuff = true;
    combat.flags.previewStats = true;
    //combatState.energyMultiplier = multiplier;
    const hpPercent = getHpPercentFromChar();
    //console.error(`hpPercent in start combat `, hpPercent);
    //playSound(`player-exhausted`, 0.38);
    applyEnergyDebuff(multiplier);
    applyEnergyFatigue();
    applyPercentToChar(hpPercent);
    renderStats();
    getDebuffPercentHp();
  }
  
  // 🔒 twarda blokada regeneracji
  if (enemy.regen) {
    enemy.regen = null;
  }
  
  const enemySlot = document.getElementById(`enemy-slot-${i}`);
  enemyContent = document.createElement("div");
  enemyContent.className = "enemy-content";
  enemySlot.appendChild(enemyContent);
  //enemy.enemyContent = enemyContent;
  
  startEnemyAttackTimeline(enemy, i);
  
  if (i < 0 || i >= world.exploreOptions.length) {
   // console.warn(`Nieprawidłowy index: ${i}`);
    return;
  }
  
  const attackBtn = document.getElementById(`slot-attack-button-${i}`);
  attackBtn.classList.add("hidden");
  
  isExploring = false;
  stopEnemyUiRegenTick();
  
  //applyEnemyRegen(enemy);
  renderCombat();
  renderOptions();
  lockOtherActions(i);
  hideNavigateButtons();
  focusOnAttackDialogBox();
  saveGame();
}

function playerHasShieldEquipped() {
  const eq = gameState.char?.equipment || {};
  const shield = eq[`shield`];
  
  if(shield){
    return true;
  }
  
  return false;
}

function renderCombat(renderPotion = false) {
  const dlg = document.getElementById("attack-dialog-box");
  const player = getPlayerStats();
  const eq = gameState.char?.equipment || {};
  const shield = eq[`shield`];
  const weapon = eq[`weapon`];
  
  let shieldSprite = `img/icons/left-hand-placeholder.png`;
  let weaponSprite = `img/icons/right-hand-placeholder.png`;
  
  if(weapon){
    weaponSprite = `img/items/` + weapon.sprite;
  }
  
  if(playerHasShieldEquipped()) {
    shieldSprite = `img/items/` + shield.sprite;
  }
  
  if(weapon?.twoHanded) {
    shieldSprite = `img/items/` + weapon.sprite;
    //shieldIcon.classList.add(`shield-disabled`);
  }
 
  //console.error(`shieldSprite`, shieldSprite);
  //console.error(`weaponSprite`, weaponSprite);
  
  const shieldUrl = assetManager.getResolvedAsset(shieldSprite);
  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);
  
    // 🧱 Layout główny renderowany tylko raz
  if (!dlg.dataset.initialized) {
    dlg.innerHTML = `
      <div id="combat-enemy-section"></div>

      <div id="test-holder">
        <button class="menu-item" onclick="toggleBypass()" id="bypass-btn" title="Test">T
          <!-- <img data-src="img/icons/menu-market-icon.png" alt="Zamknij" class="menu-icon" />-->
        </button>
      </div>
    
      <div id="focus-holder">
        ${renderFocusSkillButton(player.level)}
      </div>
    
      <div class="attack-row">
        <div class="attack-slot">
          <div class="attack-wrapper left" id="left-hand" data-action="block">
    
            <button class="attack-button common" id="attack-left">
              <img class="shield-icon" id="defense-icon" src="${shieldUrl}" alt="Atak Lewa Ręka" />
              <span class="block-cooldown-overlay"></span>
              <div class="lock-overlay"></div>
            </button>

            <div class="skill skill-1">${renderSkillButtons(player.level, 1, 1)}</div>
            <div class="skill skill-2">${renderSkillButtons(player.level, 2, 2)}</div>
            <div class="skill skill-3">${renderSkillButtons(player.level, 3, 3)}</div>
          </div>
        </div>

        <div class="attack-slot">
          <div class="attack-wrapper right" id="right-hand" data-action="attack">
            <div class="guard-ring hidden" id="guard-ring">
             <svg viewBox="0 0 100 100" class="guard-svg">

               <!-- tło -->
               <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="6"
               />

               <!-- segment 1 -->
               <circle
                class="guard-segment seg-1"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke-width="6"
                transform="rotate(-90 50 50)"
               />

               <!-- segment 2 -->
               <circle
                class="guard-segment seg-2"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke-width="6"
                transform="rotate(-90 50 50)"
               />

               <!-- segment 3 -->
               <circle
                class="guard-segment seg-3"
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke-width="6"
                transform="rotate(-90 50 50)"
               />

             </svg>            
            </div>
            <button class="attack-button common" id="attack-button">
              <img class="shield-icon" id="attack-icon" src="${weaponUrl}" alt="Atak Prawa Ręka" />
              <div class="cooldown-overlay"></div>
              <div class="lock-overlay"></div>
            </button>
            <div class="skill skill-4">${renderSkillButtons(player.level, 4, 4)}</div>
            <div class="skill skill-5">${renderSkillButtons(player.level, 5, 5)}</div>
            <div class="skill skill-6">${renderSkillButtons(player.level, 6, 6)}</div>
          </div>
        </div>

        <!-- Miejsce na dynamiczny przycisk -->
        <div class="attack-center" id="attack-center-container" data-action="flee"></div>
      </div>

      <div class="potions-section wide common" data-action="potion">
        <div class="potions-grid">
          ${renderPotions()}
        </div>
      </div>
    `;

    dlg.dataset.initialized = "true";
  }

  applyImageFallback(dlg);
  
  updateGuardUI(guardStacks);
  
  const shieldIcon = document.getElementById("attack-left");
  if(!playerHasShieldEquipped()) {
   // console.error("shield disabled");
    shieldIcon.classList.add(`shield-disabled`);
  } else {
    shieldIcon.classList.add(shield.klasa);
  }    
  
  const weaponIcon = document.getElementById("attack-button");
  if(weapon) {
    weaponIcon.classList.add(weapon.klasa);
  }
  
  // 🧠 Dane przeciwnika
  let enemy = null;
  const opt = gameState.world.selectedSlotIndex !== null ? gameState.world.exploreOptions[gameState.world.selectedSlotIndex] : null;

  if (opt && opt.enemyData) {
    enemy = opt.enemyData;
  } else if (opt && opt.type === "shrine" && !opt.used) {
    const s = opt.shrineData;
    enemy = {
      name: t(s.name),
      level: "-",
      maxHp: s.type === "heal" ? s.bonusAmount : "-",
      currentHp: 0,
      dmg: s.type === "attack" ? s.bonusAmount : "-",
      def: s.type === "defense" ? s.bonusAmount : "-"
    };
  } else if (opt && opt.type === "chest" && !opt.used) {
    enemy = {
      name: t(opt.chestData.name),
      level: "-",
      maxHp: "-",
      currentHp: 0,
      dmg: "-",
      def: "-"
    };
  } else if (opt && opt.type === `npc`) {
    enemy = { name: t(opt.npcData.name), level: "NPC", maxHp: "-", currentHp: 0, dmg: "-", def: "-" };
  } else {
    enemy = { name: `---`, level: "-", maxHp: "-", currentHp: 0, dmg: "-", def: "-" };
  }

  // 🔁 Aktualizacja sekcji wroga
  const enemySection = document.getElementById("combat-enemy-section");
  const hpIconUrl = assetManager.getResolvedAsset("img/icons/menu-hp-icon.png");
  const dmgIconUrl = assetManager.getResolvedAsset("img/icons/menu-dmg-icon.png");
  const defIconUrl = assetManager.getResolvedAsset("img/icons/menu-def-icon.png");
  
  enemySection.innerHTML = `
   <div class="enemy-section">
      <div class="enemy-info"><strong>${t(enemy.name)} (${t("enemy_lvl_info")} ${enemy.level})</strong></div>
      <div class="enemy-stat-group">
        <div class="enemy-stat-block" data-stat="enemy-hpstat">
          <div class="enemy-stat-icon">
            <img src="${hpIconUrl}" alt="HP" class="stat-img" />
          </div>
          <div class="enemy-stat-main">${formatStat(enemy.maxHp)}</div>
        </div>
        <div class="enemy-stat-block" data-stat="enemy-dmgstat">
          <div class="enemy-stat-icon">
            <img src="${dmgIconUrl}" alt="DMG" class="stat-img" />
          </div>
          <div class="enemy-stat-main">${formatStat(enemy.dmg)}</div>
        </div>
        <div class="enemy-stat-block" data-stat="enemy-defstat">
          <div class="enemy-stat-icon">
            <img src="${defIconUrl}" alt="DMG" class="stat-img" />
          </div>
          <div class="enemy-stat-main">${formatStat(enemy.def)}</div>
        </div>
      </div>
  
  
      <!--<div id="focus-holder"></div>-->

  
    <!--  <div id="focus-btn">${renderFocusSkillButton(player.level)}</div>-->
  
  
    </div>
  `;

  
  const focusHolder = document.getElementById("focus-holder");

  if (!focusHolder.dataset.ready) {
    focusHolder.innerHTML = renderFocusSkillButton(player.level);
    focusHolder.dataset.ready = "true";
  }
  
  const potionsSection = document.querySelector(".potions-section");
  potionsSection.innerHTML = `
    <div class="potions-grid">
       ${renderPotions()}
    </div>
  `;
  
  if(renderPotion) return;
  
  // 🧩 Dynamiczny przycisk w sekcji attack-center
  const attackCenter = document.getElementById("attack-center-container");
  attackCenter.innerHTML = ""; // czyścimy stare

  if (gameState.world.selectedSlotIndex !== null) {
    const button = document.createElement("button");
    button.className = "slot-button hidden";
    button.id = `slot-attack-button-${gameState.world.selectedSlotIndex}`;

    if (gameState.world.inCombat) {
      button.classList.remove("hidden");
      button.onclick = () => handleAttack(gameState.world.selectedSlotIndex);
    }

    attackCenter.appendChild(button);
  }

  // 🔄 Pasek życia
  /*if (world.selectedSlotIndex !== null && enemy.maxHp !== "-") {
    updateEnemyHealthBar(enemy, world.selectedSlotIndex);
  }*/
  
  //console.error(`attack-button`,  document.getElementById("attack-button"));
  dlg.classList.remove("hidden");
}


function handleAttack() {
  if (!canPerformAction(`attack`)) return;
  console.time("attack");
  //console.error(`sprawdzam handleAttack`);
  const player = getPlayerStats();
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const now = getGameTime();

  let isDefShield = false;
  
  /*if (enemy.armorBreakReady) {
    showArmorBreakTimingUI(enemy, player);
    enemy.armorBreakReady = false;
    return;
  }*/
  
  if (gameState.combat.armorBreakTimingActive) {
    resolveArmorBreak(enemy);
    
    attack(isDefShield);
    spawnEffect("basic", enemy.dom.slot);
    playHit(`enemy`);

    return;
  }
  
  if (enemy.armorBreakReady) {
    showArmorBreakTimingUI(enemy, player);
    gameState.combat.armorBreakTimingActive = true;
    return;
  }
  
  if (gameState.combat.bleedTimingActive) {
    handleBleedAttack(enemy, player);
    
    attack(isDefShield);
    spawnEffect("basic", enemy.dom.slot);
    playHit(`enemy`);

    return;
  }
  
  if (enemy.bleedReady) {
    enemy.lastBleedHit = getGameTime();
    showBleedTimingUI(player);
    gameState.combat.bleedTimingActive = true;
    return;
  }

  
  if (now < playerAttackCooldown.playerCooldownEnd) {
    //console.log("Atak zablokowany – cooldown trwa");
    return;
  }
  
  //updateFatigue();
  const atkSpeed = getPlayerAttackSpeed();
  let cooldownDuration = calculateCooldown(atkSpeed);

  if (gameState.combat.playerBlock.active && gameState.combat.playerBlock.mode === "defensive") {
    const { atkSpd: penaltyAtkSpeed } = computeShieldPenalties(player.blockPower, atkSpeed);
    //cooldownDuration = penaltyCooldown;
    cooldownDuration = calculateCooldown(penaltyAtkSpeed);
    isDefShield = true;
    //console.error("Atak spowolniony przez Postawę Obronną, befor, after", cooldownDuration, atkSpeed, penaltyAtkSpeed);
    //console.error("getAttackSpeedPenaltyPercent", getAttackSpeedPenaltyPercent(calculateCooldown(atkSpeed), calculateCooldown(penaltyAtkSpeed)));
    //console.error(`Obrazenia zmniejszone o %`, lerp(0.2, 0.35, player.blockPower));
  }
  
  if(gameState.resources.staminaState.current <= 0) {
    cooldownDuration = calculateCooldown(atkSpeed * 0.7);
  }
  
  attack(isDefShield);
  spawnEffect("basic", enemy.dom.slot);
  playHit(`enemy`);
  //console.error(`cooldownDuration in handle attack`, cooldownDuration, atkSpeed);
  
  if (!enemy.armorBreakReady) {
   // console.error(`start atack cooldown`);

    startAttackCooldown(cooldownDuration);
    //return;
  }

  //startAttackCooldown(cooldownDuration);
  
  // zapisz czas końca cooldownu
  playerAttackCooldown.playerCooldownEnd = now + cooldownDuration * 1000;
}


function handleShieldAction() {
 // console.error(`enter handleShieldAction`);
  const combat = gameState.combat;
  const now = getGameTime();
  const playerBlock = combat.playerBlock;

  // 🔴 KLUCZ: blokada na poziomie logiki
  if (playerBlock.cooldownUntil > now) {
    return;
  }
  
  if (!canPerformAction(`block`)) return;
  const blockButton = document.getElementById("attack-left");
  //const blockButton = document.getElementById("attack-left").querySelector(".attack-button");
  combat.flags.isBlocked = false;
  
 // console.error(`enter shield`);
  
  if (combat.playerBlock.active) {
    //console.error(`player.block.mode`, combat.playerBlock.mode);
    // jeśli aktywna postawa obronna → wyłącz
    if (combat.playerBlock.mode === "defensive") {
      deactivateDefensiveStance();
      blockButton.classList.add(`cooldown`);
    }
    return;
  }

  // wybór trybu (np. z UI / ustawień gracza)
  if (combat.playerBlock.mode === "defensive") {
    activateDefensiveStance();
    //blockButton.classList.add(`active`);
    blockButton.classList.add(`turtle`);
   // console.error(`na cooldownie`);
  } else if (combat.playerBlock.mode === "timed") {
    if(!spendStamina(STAMINA_COST.TIMED_BLOCK)) return;
    activateTimedBlock();
    //blockButton.classList.add(`timed`);
  }
}

function endTimedBlock(result, cooldown) {
  const shieldBtn = document.getElementById("attack-left");
  //const shieldBtn = document.getElementById("attack-left").querySelector(".attack-button");
  let playerBlock = gameState.combat.playerBlock;
  
  playerBlock.active = false;
  playerBlock.activePaused = false;
  playerBlock.activeRemaining = 0;
  playerBlock.lastResult = result;
  playerBlock.cooldownUntil = getGameTime() + cooldown;
  
  if(shieldBtn) shieldBtn.classList.remove("timed");

//  console.log(`🛡️ Timed Block zakończony: ${result}`);
}

function updateBlockState() {
  //const shieldBtn = document.getElementById("attack-left");
  let playerBlock = gameState.combat.playerBlock;
  
  if (
    playerBlock.mode === "timed" &&
    playerBlock.active &&
    !playerBlock.activePaused && // 🔥 KLUCZ
    getGameTime() > playerBlock.endTime
  ) {
    showOutcome("miss", `${t("miss_outcome")}`);
    endTimedBlock("miss", 3500);
    
    if(gameState.combat.perfectChainStacks) {
      gameState.combat.perfectChainStacks = 0;
    }
  }
  
}

function restoreCombat() {
 /* const enemy = exploreOptions[selectedSlotIndex].enemyData;
  
  startEnemyAutoAttack(enemy, selectedSlotIndex);*/
  lockOtherActions(gameState.world.selectedSlotIndex);
  renderCombat();
  //renderOptions();
}

function addExp(amount) {
  const character = gameState.char;
  let levelUpPrefix = "";

  // Ustawienia domyślne, jeśli nie istnieją
  if (!character.level) character.level = 1;
  if (!character.experience) character.experience = 0;
  if (!character.expToNextLevel) character.expToNextLevel = 125;
  if (!character.skillPoints) character.skillPoints = 0; // 🔹 nowy atrybut

  character.experience += amount;

  // Level Up – dopóki mamy więcej exp niż potrzeba
  while (character.experience >= character.expToNextLevel) {
    character.experience -= character.expToNextLevel;
    character.level += 1;
    character.expToNextLevel = Math.round(character.expToNextLevel * 1.7); // rosnące wymagania
    character.skillPoints += 1; // 🔹 dodajemy punkt umiejętności
   // console.log("skillPoints addExp", character.skillPoints);
    levelUpPrefix = `Awansowałeś na ${character.level} poziom! (+1 punkt umiejętności)`;
   // console.error("availableAttributePoints addExp", character.availableAttributePoints);
   
    character.availableAttributePoints += 5;
    
    showLevelUpPopup();
    
    updateCharMenuIcon();         
    updateSkillsMenuIcon();
    
    const { maxHp } = calculateTotalStats(character.equipment || {});
    character.hp = maxHp;
    //character.lastRegenTs = Date.now();
    
    renderHpBar(character.hp, maxHp);
  }

  saveGame();
  
  // Aktualizacja UI
  const percent = Math.min(125, Math.round(100 * character.experience / character.expToNextLevel));
  document.getElementById("exp-bar").style.width = percent + "%";
  document.getElementById("exp-label").textContent = `${character.experience} / ${character.expToNextLevel}`;
  
  return levelUpPrefix;
}


let fleeIsSet = false;
let fleeBtn;

function setupFleeButton() {
  const player = getPlayerStats();
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const penaltyPercent = calculateGoldLossOnFlee(player);
  const gold = parseInt(gameState.resources.gold, 10);
  const loss = Math.floor(gold * penaltyPercent);

  // pobieramy już istniejący przycisk z HTML
  fleeBtn = document.getElementById(`slot-attack-button-${gameState.world.selectedSlotIndex}`);
  if (!fleeBtn) return console.warn("Brak przycisku flee w HTML!");

  // ustaw ikonę
  if (!fleeBtn.querySelector("img")) {
    const fleeIconUrl = assetManager.getResolvedAsset("img/buttons/flee-icon.png");

    const fleeIcon = document.createElement("img");
    fleeIcon.className = "flee-icon";
    fleeIcon.src = `${fleeIconUrl}`;
    fleeBtn.appendChild(fleeIcon);
  }
  
    // przypisz zachowanie po kliknięciu
  fleeBtn.onclick = (e) => {
    playSound(`open`, 0.4);

    e.stopPropagation(); 
    showCustomConfirm(
    `${t("flee_cost1")} <span style="color:red;"> ${loss}${t("flee_cost2")}</span>${t("flee_cost3")}<span style="color:#0096FF;">${t("flee_cost4")}</span> \n ${t("flee_cost5")}`,
    () => { 
      attemptFlee();
      resumeAllSkillsCooldown();
      resumeCombat(); 
      gameState.resources.staminaState.disabled = false; 
      saveGame(); 
    },
    () => { 
      resumeEnemyAttack(enemy, gameState.world.selectedSlotIndex);
      resumeAllSkillsCooldown(); 
      resumeCombat();
      resumeBleedUI();
      resumeSpearUI();
      gameState.resources.staminaState.disabled = false;
      saveGame(); 
    }
    );
  };
  
  //resumePlayerAttack(); 
  //resumeDefensiveCooldown();
  
  // na start ukryty
  fleeBtn.classList.add("hidden");
  fleeIsSet = true;
}

function showFleeButton() {
  if (fleeBtn && fleeBtn.classList.contains("hidden")) {
    fleeBtn.classList.remove("hidden");
    //fleeBtn.classList.add("visible");
    //console.log("Flee button shown");
  }
}

function hideFleeButton() {
  if (fleeBtn) {
    //fleeBtn.classList.remove("visible");
    fleeBtn.classList.add("hidden");
    //console.log(`chowam fleeBtn`);
  }
  fleeIsSet = false;
}

function resetSlotActionButton(i) {
  const btn = document.getElementById(`slot-attack-button-${i}`);
  if (!btn) return;

  btn.innerHTML = "";          // 💥 usuwa stare ikony
  btn.onclick = null;          // 💥 resetuje klik
  btn.className = "slot-button";
}

function calculateReducedEnemyDamage(damage, enemy, player, scaling = 0.2) {
    
  const roll = Math.random() * 100;
  const dodgeRoll = Math.random() * 100;
  if(!gameState.combat.playerBlock.lastResult) {
    if(dodgeRoll < player.dodge) {
      const dodgeCostReduce = player.dodgeCostReduce;
      if(spendStamina(STAMINA_COST.DODGE * (1 - dodgeCostReduce))) {
        showOutcome("dodge", `${t("dodge_outcome")}`);
        return {
          isDodge: true,
          dmg: 0
        };
      } else showOutcome("dodge", `${t("miss_failed_attack")}`);
    
    }
  }
  
  // 1️⃣ Armor (physical only)
  //console.log(`enemy dmg i player def`, enemy.dmg, player.def);
  
  let effectiveArmor = getArmorReduction(player.def, enemy.level);
  
  //console.error(`player.effectiveArmor`, effectiveArmor);
  
  effectiveArmor = getArmorWithStacks(effectiveArmor, player.stackDefense?.stack / 100); 

  //console.error(`player.effectiveArmor after stack armor`, effectiveArmor);
 
  const stackArmor = gameState.combat.armorStacks.stacks;
  
  if(gameState.combat.armorStacks.stacks > 0) {
    showReward(`+${(stackArmor * player.stackDefense.stack).toFixed(0)}% ${t("stack_defense_reward")} x${gameState.combat.armorStacks.stacks}`);
  }  
  
  let dmg = damage * (1 - effectiveArmor);
  
//  console.log(`enemy dmg after player def`, dmg);
  
  // 2️⃣ Redukcje procentowe
  const physRed = (player.physDmgReduction || 0) / 100;
  
  //console.log(`player.physDmgReduction`, player.physDmgReduction);
  
  //console.log(`physRed`, physRed);
  
  // 3️⃣ Zastosowanie redukcji
  dmg *= (1 - physRed);

  //console.log(`enemy dmg after all reduction`, dmg);
  
  dmg = applyIronStanceReduction(dmg, player.dmgReduction?.cooldown * 1000);
  
  //console.error(`applyIronStanceReduction`, dmg);
  
  return {
    isDodge: false, 
    dmg: Math.max(1, Math.round(dmg))
  };
}

function calculateReducedPlayerDamage(playerDmg, player, enemy, scaling = 0.2) {
  //console.log(`player dmg i enemy def`, playerDmg, enemy.name, enemy?.def);
  
  let effectiveArmor = getArmorReduction(enemy.def, player.level);
 // console.log(`enemy.effectiveArmor`, effectiveArmor);
  
  if (enemy.armorBreak?.value) {
    effectiveArmor *= (1 - enemy.armorBreak.value);
    //console.error(`enemy.armorBreak`, effectiveArmor);
  }
  
  /*if (gameState.combat.stats.nextHitPenetration) {
    effectiveArmor *= (1 - gameState.combat.stats.nextHitPenetration);
    gameState.combat.stats.nextHitPenetration = 0;
    console.error(`longsword armorBreak`, effectiveArmor);
    showReward("ZŁAMANA OBRONA -25%");
    triggerRingFull();
    triggerRingBurst();
    setTimeout(() => {
        resetGuardRing();
    }, 300);
  }*/
  
  //console.log(`enemy.effectiveArmor`, effectiveArmor);

  let dmg = playerDmg * (1 - effectiveArmor);
  
  //console.error(`player dmg after enemy def`, dmg);
  
  /*const physRed = (enemy.physDmgReduction || 0) / 100;
  const allRed = (enemy.allDmgReduction || 0) / 100;

  const totalReduction =
    1 - (1 - physRed) * (1 - allRed);

  dmg *= (1 - totalReduction);*/

  return Math.max(1, Math.round(dmg));
}


function applyCritDamage(baseDamage, player, noCrit = false) {
  const combat = gameState.combat;
  let rawCritChance = player.crit;
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if(enemy.vulnerable){
    rawCritChance += 20;
  }
  
  const effectiveCritChance = getEffectiveCritChance(rawCritChance);
  const roll = Math.random() * 100;
  let critBonusPercent = player.critDmg;
  
  //console.log(`raw crit chance and damage`, rawCritChance, critBonusPercent);
  //console.log(`effectiveCritChance and damage`, effectiveCritChance, critBonusPercent);
  
  if(!noCrit) {
    //combat.playerBlock.nextAttackGuaranteedCrit = true;
    if (roll <= effectiveCritChance || combat.playerBlock.nextAttackGuaranteedCrit) {
      
      if(combat.playerBlock.nextAttackGuaranteedCrit) {
        critBonusPercent = getCritBonus(player.blockPower) * 100;
      }
      
      let critMultiplier = 1 + critBonusPercent / 100;
      
      if (getStaminaRatio() <= 0) {
        critMultiplier *= 0.6;
      }
      
     // console.log(`critBonusPercent`, critBonusPercent, critMultiplier);

      onCrit();
      
     // console.error(`baseDamage and critMultiplier`, baseDamage, critMultiplier);
      combat.playerBlock.nextAttackGuaranteedCrit = false;
      
      playSound(`crit`, 0.4);
      
      const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

      spawnEffect("crit", enemy.dom.slot);
      
      return {
        damage: Math.floor(baseDamage * critMultiplier),
        isCrit: true,
        critMultiplier
      }; 
    }
  }
  
  return {
    damage: Math.floor(baseDamage),
    isCrit: false,
    effectiveCritChance
  };
}

function startBlock() {
  let staminaState = gameState.resources.staminaState;
  
//  console.error("startBlock staminaState.disabled", staminaState.disabled);

  if (staminaState.disabled) return;

  isBlocking = true;

  lockActions({ duration: Infinity, reason: "block", allow: [`attack`, `potion`, `block`] });
  
  playSound(`turtle-up`, 1.3, 1, 0.4);
  
  skillsOff(); 
  
  blockDrainInterval = setInterval(() => {
    if (!isBlocking) return;
    
    if(staminaState.disabled) return;
    
    staminaState.current -= staminaState.blockDrainPerSecond / 10;

    if (staminaState.current <= 0) {
      staminaState.current = 0;
      deactivateDefensiveStance();
      //stopBlock();
      triggerStaminaBreak();
    }

    staminaState.lastSpendTs = performance.now();
    saveStamina();
  }, 100);
}

function stopBlock() {
  isBlocking = false;

  unlockCriticalActions();
  
  playSound(`turtle-down`, 1.4, 1, 0.4);
  
  skillsOn();
  
  if (blockDrainInterval) {
    clearInterval(blockDrainInterval);
    blockDrainInterval = null;
  }

  gameState.resources.staminaState.lastSpendTs = performance.now();
}

function activateDefensiveStance() {
  const stats = gameState.combat.stats;
  const now = getGameTime();
  const player = getPlayerStats();
  let playerBlock = gameState.combat.playerBlock;
  
  if (playerBlock.cooldownUntil > now) return;
  //if (!playerHasStamina()) return;

  gameState.combat.activeRingMode = `guard`;
  stats.combo = 0;
  stats.comboReady = false;
  stats.nextHitMultiplier = 0;

  resetGuardRing();
  
  startBlock();
  
  playerBlock.active = true;
  playerBlock.mode = "defensive";

  //playerBlock.damageReduction = rollDefensiveReduction();
  
  const timedBlockReduction = getTimedBlockReduction(player.blockPower);
  const finalBlockReduction = getStaminaNormalBlockReduction(timedBlockReduction);
  
  const damageReduction = getDefensiveBlockReduction(player.blockPower);
  
  showOutcome("normal",  `${t("turtle_outcome")}`);
  showReward(`${(damageReduction * 100).toFixed(0)}% ${t("dmg_reduction_reward")}`);

  /*if(!combatState.isCritical) {
    lockActions({ duration: 230, reason: "block", allow: [] });
  }*/
  
 // console.error("Postawa Obronna AKTYWNA");
}

function deactivateDefensiveStance() {
  const blockButton = document.getElementById("attack-left");
  //const blockButton = document.getElementById("attack-left").querySelector(".attack-button");
  let playerBlock = gameState.combat.playerBlock;
  
  stopBlock();
  
  //gameState.combat.activeRingMode = ``;
  
  playerBlock.active = false;
  //playerBlock.mode = null;
  
  const COOLDOWN = 3000;
  playerBlock.cooldownUntil = getGameTime() + COOLDOWN;
  //playerBlock.cooldownRemaining = COOLDOWN;
  //playerBlock.cooldownPaused = false;
  
  //blockButton.classList.remove(`active`);
  blockButton.classList.remove(`turtle`);

  //console.error("Postawa Obronna WYŁĄCZONA");
}

const TIMED_DURATION = 550;
const PERFECT_START = 200;//200
const PERFECT_END = 320;//320
const PERFECT_CENTER = TIMED_DURATION / 2; 

function activateTimedBlock() {
  //if (!canPerformAction()) return;
  let playerBlock = gameState.combat.playerBlock;
  
  const now = getGameTime();
  
  if (playerBlock.cooldownUntil > now) return;
  
  //console.error(`timed block activated`);
  const player = gameState.char;
  const blockButton = document.getElementById("attack-left");

  playerBlock.mode = "timed";
  playerBlock.active = true;
  playerBlock.activePaused = false;

  playerBlock.startTime = now;
  playerBlock.endTime = now + TIMED_DURATION;
  playerBlock.lastResult = null;
  playerBlock.activeRemaining = TIMED_DURATION;
  
  playSound(`timed-block`, 0.4);
  
  //triggerSlowMo(0.35, 300);
  //slowMoAlert();
  //slowMoDecision();
  //slowMoImpact();
  
  blockButton.classList.add(`timed`);
  
  //const { start, end } = getPerfectWindowRange(player);
  //showTimedBlockUI(0, TIMED_DURATION, start, end);
  showTimedBlockUI(player);
  
  if(!gameState.combat.flags.isCritical) {
    lockActions({ duration: 230, reason: "block", allow: [] });
  }
  
 // console.error("Blok Taktyczny AKTYWNY");
}


function resolveTimedBlock(damage, player, enemy) {
  const now = getGameTime();
  const elapsed = now - gameState.combat.playerBlock.startTime;
  //const elapsed = getGameTime() - combat.playerBlock.logicStartTime;
  let playerBlock = gameState.combat.playerBlock;
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].run;

  gameState.combat.flags.isBlocked = true;
  
  //const errorMs = Math.abs(elapsed - PERFECT_CENTER);  
  const offset = Math.abs(elapsed - PERFECT_CENTER);  
  
  const { perfect, normal, miss } = getBlockWindows(player);
  
  const perfectCooldown = getTimedBlockCooldown(player.blockPower);
 // console.error(`player.hp, player`, player.hp, player);

  if (offset <= perfect) {
    const refund = getPerfectBlockRefund(STAMINA_COST.TIMED_BLOCK, offset, player.blockPower) 
    let staminaState = gameState.resources.staminaState;
   // console.error(`refund`, refund);
    
    staminaState.current = Math.min(
        staminaState.max,
        staminaState.current + refund
    );
     
    if(gameState.world.mode === `expedition`) {
      expeditionLevelStats.perfectBlock++;
      expeditionRunStats.perfectBlock++;
    }
    
    const eq = gameState.char?.equipment || {};
    const weapon = eq[`weapon`];
  
    if (weapon?.baseName === `Długi Miecz`){
      longswordOnPerfect();
    }
    
    onPerfectBlock();
    playSound(`perfect`, 0.38);
    tryTriggerBlockReward(damage, player, enemy);
    
    //slowMoImpact();
    //hitStop(60);
    
    tryInterruptEnemy(enemy, `perfect-block`);
    
    gameState.combat.flags.isPerfectDmgBonus = true;
    
    if(gameState.char.bonus.perfectChainBonus) {
      gameState.combat.perfectChainStacks++;
      showReward(`${t("perfect_counterattack_reward")} x${gameState.combat.perfectChainStacks}`);
    }
    
    endTimedBlock("perfect", perfectCooldown);
    showOutcome("perfect", `${t("perfect_outcome")}`);
    //showReward(`100% Redukcji Obrażeń`);
    return 1.0; // 100% redukcji
  }
  
  if (offset <= normal) {
    
    const timedBlockReduction = getTimedBlockReduction(player.blockPower);
    let finalBlockReduction = getStaminaNormalBlockReduction(timedBlockReduction); 
 
    let normalCooldown = 3500;
    
    if(gameState.char.bonus.blockReductionBonus) {
      const bonus = gameState.char.bonus.blockReductionBonus / 100;
      finalBlockReduction *= 1 + bonus;
      normalCooldown = gameState.char.bonus.blockCooldownBonus * 1000;
    }
    
    //console.error(`NORMAL BLOCK COOLDOWN!`, normalCooldown);
    playSound(`normal`, 0.40);
    endTimedBlock("normal", normalCooldown);
    //console.error(`NORMAL BLOCK!`);
    showOutcome("normal", `${t("good_outcome")}`);
       
    if(gameState.combat.perfectChainStacks) {
      gameState.combat.perfectChainStacks--;
      //showReward(`Perfekcyjny Kontratak x${gameState.combat.perfectChainStacks}`);
    }
    
    showReward(`${(finalBlockReduction * 100).toFixed(0)}% ${t("dmg_reduction_reward")}`);
    return finalBlockReduction;
    //return 0.6; // 60% redukcji
  }

  playerBlock.lastResult = "miss";
  playerBlock.cooldownUntil = now + 3500;
  
  endTimedBlock("miss", 3500);
  showOutcome("miss", `${t("miss_outcome")}`);
  
  if(gameState.combat.perfectChainStacks) {
      gameState.combat.perfectChainStacks = 0;
    }
  
  return 0;
}

function applyBlock(incomingDamage, player, enemy) {
  let playerBlock = gameState.combat.playerBlock;
 // console.error(`enter apply block`, playerBlock.active);

  if (!playerBlock.active) return incomingDamage;

  //console.error(`player.block`, player.blockPower);
  const damageReduction = getDefensiveBlockReduction(player.blockPower);
  const reduced = incomingDamage * (1 - damageReduction);

  if (playerBlock.mode === "timed") {
    const damageMultiplierReduced = resolveTimedBlock(incomingDamage, player, enemy);
    
    //console.error(`dmg multiplier in normal block`, damageMultiplierReduced);
    return incomingDamage * (1 - damageMultiplierReduced);
  }

  return Math.floor(reduced);
}

function exitCombat() {
  const char = gameState.char;

  char.inCombat = false;
  char.lastRegenTs = Date.now();
  char.regenAllowedAt = Date.now() + 3000;
  gameState.resources.staminaState.inCombat = false;
}

function dealDamageToEnemy(enemy, damage, isCrit = false, critMultiplier = 2, source = `game`) {
  const world = gameState.world;

  if (!world.inCombat) return;
  
  if(enemy.isGuarding) {
    damage *= 0.55;
  }
  
  enemy.currentHp -= damage;
  enemy.currentHp = Math.max(0, enemy.currentHp);
  
  if(source === `game`) {
    showEnemyDamage({
      damage: damage,
      isCrit: isCrit,
      multiplier: critMultiplier
    });
  }
  
  if(enemy.name === "Strażnik Runicznego Kamienia" && enemy.currentHp <= 2000) {
    exitCombat();
    hideFleeButton();
    winCombat();
    stopEnemyAttack(world.selectedSlotIndex);
  }
  
  if (enemy.currentHp <= 0) {
    //  console.error(`enemy.currentHp <= 0 in useSkill`);
      enemy.currentHp = 0;
      clearBleed(enemy);
      exitCombat();
      hideFleeButton();
      winCombat();
      stopEnemyAttack(world.selectedSlotIndex); // linia czasu wroga – STOP
  } 
  
  //console.error(`deal damage before update enemy hp`, damage);
  updateEnemyHealthBar(enemy, world.selectedSlotIndex);
}

function performAttack(
  attacker,
  defender,
  {
    isDefShield = false,
    isSkillAttack = false,
    baseMultiplier = 1,
    canCrit = true,
    ignoreArmor = false,
    source = "game"
  } = {}
)
{
  
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const expeditionRunStats = gameState.expedition.modes[gameState.world.expeditionMode].run;

  //console.log(`base dmg`, attacker.dmg);
  //console.log(`performAttack defender`, defender.name);

  const rawDmg = 2;
  
  let weaponDamage = attacker.baseDamage.weapon + rawDmg;
  
  weaponDamage *= baseMultiplier ?? 1;
  
  //console.error(`weaponDamage`, weaponDamage);

  const baseDamage = weaponDamage + 
                     attacker.baseDamage.stats +
                     attacker.baseDamage.flat +
                     attacker.baseDamage.implicit;
  
  let totalMultiplier = 1;
  
  if (currentBuff?.dmg) {
    totalMultiplier *= currentBuff.dmg
    //baseDamage *= currentBuff.dmg;
  }
  
  //console.error(`baseDamage`, baseDamage);
  
  //let baseDmg = rollDamage(attacker.dmg);
  let baseDmg = rollDamage(baseDamage);
  //let baseDmg = baseDamage;
  
  //console.log(`base dmg after roll`, baseDmg);
  
  //baseDmg *= baseMultiplier ?? 1;
  //console.log(`base dmg after skill multiplier`, baseDmg, baseMultiplier);
  
  const { damage, isCrit, critMultiplier } =
    applyCritDamage(baseDmg, attacker, isDefShield);
  //console.log(`dmg with crit`, damage, isCrit);
  
  let dmgWithElemental = damage + (attacker.elementalDmg || 0);
  //console.error(`dmg with elemental`, dmgWithElemental);
  
  if(defender.status.stunned) {
    dmgWithElemental *= (1 + defender.status.multiplier);
    defender.status.stunned = false;
    defender.status.multiplier = 0;
    //console.error(`dmg with elemental after stunned`, dmgWithElemental);
  }
  
  if(gameState.combat.stats.nextHitMultiplier && !isSkillAttack) {
    dmgWithElemental *= gameState.combat.stats.nextHitMultiplier;
    gameState.combat.stats.nextHitMultiplier = 0;
    
    if (weapon?.baseName === `Długi Miecz`) {
      setLongswordBuffUI(false);
      showReward(`${t("block_reward")} x1.2`);
    }else { 
      showReward(`${t("combo_reward")} x1.5`);
      triggerRingFull();
      triggerRingBurst();
      setTimeout(() => {
        resetGuardRing();
      }, 300);
    }
  }
  
  if(gameState.combat.activeRingMode === `mace` && gameState.combat.stats.combo === 2 && !isSkillAttack) {
    gameState.combat.stats.combo = 0;
    defender.attackState.remaining += 500;
    
    if(defender.isGuarding) {
      defender.attackState.remaining += 250;
    } else {
      defender.attackState.remaining += 500;
    }
    
    showReward(`${t("pushback_reward")}`);
    
    triggerRingFull();
    triggerRingBurst();
    setTimeout(() => {
        resetGuardRing();
    }, 300);
  }
  
   if(defender.vulnerable){
    dmgWithElemental *= 1.25;
  }
  
  let finalDamage =
    calculateReducedPlayerDamage(dmgWithElemental, attacker, defender);
  //console.log(`finalDamage after reduced by armor`, finalDamage);
  
  //console.error(`hpPct`, combatState.currentHp / combatState.maxHp);
  //console.error(`applyHpToDmgBonus `, attacker.hpToDmg.threshold, attacker.hpToDmg.maxBonus, applyHpToDmgBonus(attacker.hpToDmg.threshold, attacker.hpToDmg.maxBonus));
 
  if (isDefShield) {
    finalDamage = applyDefensivePenaltyDmgReduction(attacker, finalDamage);
  }
  
  //finalDamage *= applyHpToDmgBonus(attacker.hpToDmg?.threshold, attacker.hpToDmg?.maxBonus);
  
  const hpBonus = applyHpToDmgBonus(attacker.hpToDmg?.threshold, attacker.hpToDmg?.maxBonus);
  if (hpBonus) totalMultiplier *= hpBonus;
  
  //console.error(`perfom attack finalDamage penalty`, finalDamage);
  
  if(gameState.char.bonus.perfectDmgBonus && gameState.combat.flags.isPerfectDmgBonus) {
    const bonus = gameState.char.bonus.perfectDmgBonus / 100;
    //finalDamage *= 1 + bonus;
    totalMultiplier *= 1 + bonus;
    gameState.combat.flags.isPerfectDmgBonus = false;
    showReward(`+${(bonus * 100).toFixed(0)}% ${t("perfect_riposte_reward")}`);
  }
  
  if(gameState.combat.perfectChainStacks) {
    const bonus = gameState.char.bonus.perfectChainBonus / 100;
    //finalDamage *= 1 + (bonus * gameState.combat.perfectChainStacks);
    totalMultiplier *= 1 + (bonus * gameState.combat.perfectChainStacks);

    //console.error(`finalDamage after chain stack`, finalDamage, gameState.combat.perfectChainStacks);
    gameState.combat.perfectChainStacks = 0;
  }
  
  finalDamage *= totalMultiplier;
  
  //console.error(`finalDamage after totalMultiplier `, finalDamage);
  
  // console.error(`finalDamage before guard attack`, finalDamage);
    
  if(source === `game`) {
    finalDamage = consumeGuardStacksOnAttack(finalDamage);
  }
  
  expeditionLevelStats.damageDealt += finalDamage;
  expeditionRunStats.damage += finalDamage;
 
  //console.error(`finalDamage after guard attack`, finalDamage);
  
 // console.error(`isCrit`, isCrit);
  //console.error(`perfom attack finalDamage 2`, finalDamage);

  dealDamageToEnemy(defender, finalDamage, isCrit, critMultiplier, source);

  gameState.combat.criticalLastStand = null;
  
  // life on hit
  if (attacker.lifeOnHit) {
    attacker.hp = Math.min(
      attacker.maxHp,
      attacker.hp + Math.round(attacker.lifeOnHit)
    );
    
    updatePlayerHp(attacker.hp);
  }

  if(source === `sim`) {
    console.error(`perfom attack finalDamage 3`, finalDamage);

    console.error(`perfom attack return`, source);
    return {
      damage: finalDamage,
      isCrit
    };
  }
  
}

function attack(isDefShield = false) {
  const world = gameState.world;

  const player = getPlayerStats();
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;

  performAttack(
    player,
    enemy,
    {
      isDefShield: isDefShield,
      source: "game"
    }
  );
  
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
  //if (weapon?.baseName === `Młot`) hammerOnHit(enemy, player); 
  //if (weapon?.baseName === `Topór`) axeOnHit(enemy, player); 
  if (enemy.currentHp > 0) {
    onWeaponHit(enemy, player, weapon?.baseName);
  }
  
  if(!guardStacks && !gameState.combat.playerBlock.active && gameState.combat.activeRingMode !== `poise`) {
    //gameState.combat.activeRingMode = ``;
  }
  
  playEnemyHitAnimation(enemy, world.selectedSlotIndex);
    
  // pokaż flee po pierwszym ataku
  if (!fleeIsSet) setupFleeButton();
  showFleeButton();
  
  //renderStats();

  //const currentPlayerHp = getPlayerStats().hp;
  const currentPlayerHp = gameState.char.hp;
  
  if (currentPlayerHp <= 0 && !gameState.combat.flags.isCritical) {
    enterCriticalState();
  }  
  
  lockActions({ duration: 300, reason: "attack", allow: [`block`] });
  console.timeEnd("attack");
}

function showReward(text, duration = 1600) {
  const container = document.getElementById("combat-rewards");

  // limit: max 2 rewardy
  if (container.children.length >= 3) {
    container.removeChild(container.firstChild);
  }

  const reward = document.createElement("div");
  reward.className = "combat-reward";
  reward.textContent = text;

  container.appendChild(reward);

  // auto cleanup
  setTimeout(() => {
    reward.remove();
  }, duration);
}

function showOutcome(type, text, duration = 1700) {
  const el = document.getElementById("combat-outcome");

  //onBlockOutcome(type);
  el.className = `combat-msg outcome ${type}`;
  el.querySelector(".main").textContent = text;

  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, duration);
}

function showEnemyOutcome(type, text, duration = 1700) {
  const el = document.getElementById("enemy-combat-outcome");

  //onBlockOutcome(type);
  el.className = `combat-msg enemy-feedback outcome ${type}`;
  el.querySelector(".main").textContent = text;

  el.classList.add("show");

  setTimeout(() => {
    el.classList.remove("show");
  }, duration);
}


function showEnemyDamage({ damage, isCrit, multiplier, isBleed = false }) {
  const container = document.getElementById(`enemy-damage-float-container-${gameState.world.selectedSlotIndex}`);

  const el = document.createElement("div");
  el.classList.add("damage-float");

  if(isBleed) {
    el.classList.add("crit");
  }
  
  if (isCrit) {
    showOutcome("miss", `${t("crit_outcome")}`);
    showReward(`${damage} x${multiplier.toFixed(1)}`, 2300);
 
    el.classList.add("crit");
    el.textContent = `-${damage.toFixed(0)} x${multiplier.toFixed(1)}`;
  } else {
    el.textContent = `-${damage.toFixed(0)}`;
  }

  if(container) container.appendChild(el);

  // animacja + cleanup
  setTimeout(() => el.remove(), 1500);
}

/*function turnOffShieldMode() {
  const blockButton = document.getElementById("attack-left");
  //const blockButton = document.getElementById("attack-left").querySelector(".attack-button");
  let playerBlock = gameState.combat.playerBlock;
  
  if (playerBlock.active) {
    if (playerBlock.mode === "defensive") {
      deactivateDefensiveStance();
      //blockButton.classList.remove(`active`);
      blockButton.classList.remove(`turtle`);
      blockButton.classList.add(`cooldown`);
    }
    //return;
  }

}*/

function turnOffShieldMode() {
  const blockButton = document.getElementById("attack-left");
  const playerBlock = gameState.combat.playerBlock;

  // stan logiczny
  playerBlock.active = false;
  playerBlock.cooldownUntil = 0;

  // UI
  blockButton.classList.remove("turtle");
  blockButton.classList.remove("cooldown");
  blockButton.classList.remove("disabled");

  const overlay = blockButton.querySelector(".block-cooldown-overlay");
  if (overlay) {
    overlay.style.transform = `scaleY(0)`;
  }
  
  if (blockDrainInterval) {
    clearInterval(blockDrainInterval);
    blockDrainInterval = null;
  }
}

function getDebuffPercentHp() {
  const combat = gameState.combat;

  const debuffedMaxHp = combat.stats.maxHp;
  const currentHp = combat.stats.currentHp;
  combat.stats.hpPercent = debuffedMaxHp > 0 ? currentHp / debuffedMaxHp : 1;
  
  //console.error(`combatState.hpPercent in get percent`, combat.stats.hpPercent);
}

function getHpPercentFromChar() {
  const char = gameState.char;

  return char.maxHp > 0
    ? char.hp / char.maxHp
    : 1;
}

function applyPercentToChar(percent) {
  const char = gameState.char;

  char.hp = Math.round(char.maxHp * percent);
  
  if (char.hp > char.maxHp) {
    char.hp = char.maxHp;
  }

}

function setDebuffPercentHp() {
  const char = gameState.char;

  char.hp = Math.round(char.maxHp * gameState.combat.stats.hpPercent);
  
  if (char.hp > char.maxHp) {
    char.hp = char.maxHp;
  }
  
  renderStats();
}

function finishCombatWithDebuff() {
  const charBefore = gameState.char;

  const hpPercent = charBefore.maxHp > 0
    ? charBefore.hp / charBefore.maxHp
    : 1;

  // 2️⃣ Wyłącz debuff
  gameState.combat.flags.isDebuff = false;
  
  // 3️⃣ Przelicz staty bez debuffa (maxHp wróci do normalnego)
  renderStats();

  // 4️⃣ Pobierz nowy stan po przeliczeniu
  let charAfter = gameState.char;

  // 5️⃣ Skaluj HP procentowo
  charAfter.hp = Math.round(charAfter.maxHp * hpPercent);

  if (charAfter.hp > charAfter.maxHp) {
    charAfter.hp = charAfter.maxHp;
  }

  if (charAfter.hp < 0) {
    charAfter.hp = 0;
  }

 }

function winCombat() {
  //const expGained = 10 + Math.floor(Math.random() * 10);
  //let combatState = gameState.combat;
  const combat = gameState.combat;
  const world = gameState.world;
  const expeditionRunStats = gameState.expedition.modes[world.expeditionMode].run;
  const expeditionLevelStats = gameState.expedition.modes[world.expeditionMode].level;
  const quests = Object.values(QUEST_DATA);
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
  const expGained = getExpForEnemy(enemy);
  const prefix = addExp(expGained);
  const message = 
     (prefix ? prefix + "\n" : "") +  // jeśli coś zwróciło, to dodajemy + nowa linia
     `Pokonałeś ${enemy.name} (Poziom ${enemy.level})!\n Zdobywasz ${expGained} EXP.`;
  
  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  showOutcome("perfect", `${t("won_outcome")}`);
  showReward(`${expGained} EXP`, 2000);
  
  world.exploreOptions[world.selectedSlotIndex].used = true;
  world.inCombat = false;
  
  if(world.mode === `expedition`) {
    expeditionRunStats.kills++;
    expeditionLevelStats.kills++;
    
    if(world.expeditionMode === `endless`) {
      expeditionRunStats.impulses += 3;
      showReward(`+${3} Impulsy`, 2000);
    }
  }
    
  if(enemy.type === "elite" && world.mode === `story`) {
    //console.log(`quest enemy deafeted`, enemy.type);
    const questData = QUEST_DATA[enemy.questId];
    if(!questData.requiredItem) {
      const quest = world.battleState.quests?.[enemy.questId];
      quest.enemyPassed = true;
      quest.objective = questData.objectiveAfterEvent;
      quest.questNotifications = true;
      notifyQuestUpdate(enemy.questId);
    }
  }
  
  const matchingQuest = quests.find(quest => 
      quest?.objectiveTarget === enemy.name
    );
      
  if(matchingQuest && world.mode === `story`) {
    const quest = world.battleState.quests?.[matchingQuest.id];
    
    if (quest.targetCount >= matchingQuest.targetCount) {
      //return; 
      //console.log(`nothing is counting`);
    }else {
      quest.targetCount++;
      quest.objective = `${matchingQuest.objective} (${quest.targetCount}/${matchingQuest.targetCount})`;
      //console.error(`targetCount`, quest.targetCount);
      //console.error(`matchingQuest.state1`, quest.state);
      quest.questNotifications = true;
      notifyQuestUpdate(matchingQuest.id);
      updateQuestShortInfo();
    }
      
    if(quest.targetCount == matchingQuest.targetCount && quest.state === `active`) {
     // console.log(`objective after event in target counter`);
      //console.error(`matchingQuest.state2`, quest.state);
      quest.objective = matchingQuest.objectiveAfterEvent;
      quest.questNotifications = true;
      
      notifyQuestUpdate(matchingQuest.id);
    }
    
  }
  
  if(enemy.type === `mini_boss`) {
    const nextBtn = document.getElementById("next-btn");
    nextBtn.classList.remove(`hidden`);
    //nextBtn.classList.add(`hidden`);
    world.bossDefeatedState.isBossDefeated = true;
    
    //showEndStoryPopup();
    
    nextBtn.onclick = (e) => { 
        e.stopPropagation(); 
        showEndStoryPopup();
        /*showCustomConfirm(
          `${t("next_location")}`,
          () => { goToNextLevel(); },
          () => { }
        );*/
      };
    
  }
  
  //console.log("currentStepIndex winCombat", currentStepIndex);
  setMenuDisabled(false);
  
  turnOffShieldMode();
  
  handleDeathDebuffAfterFight();
  
  clearBleed(enemy);
  
  guardStacks = 0;
  updateGuardUI(0);
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);
  
  resetSpear(enemy);
  resetSpearUI();  
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy);
  
  stopBleedTimingUI();
  
  gameState.combat.bleedTimingActive = false;
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  if(combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
   
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  world.locationSteps[world.currentStepIndex].exploreOptions = world.exploreOptions; // ZAPISZ STAN KROKU
  unlockActions();
  showNavigateButtons();
  if (world.bossDefeatedState.isBossDefeated) {
    hideGoBackButton();
  }
  
  unlockScroll();
  
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex !== 0) {
    //navigate(`battle`);
   // console.warn(`after battle store button`);
    document.getElementById(`store-button`).classList.add('disabled');
    //saveGame();
    //return;
  }
  
  //enemy.isDead = true;
  enemy.beforeDeath = true;
  
  renderOptions();
  addLootToStep(enemy, world.currentStepIndex, message);
  renderLoots(world.selectedSlotIndex);

  world.selectedSlotIndex = null;
  
  renderStats();
  //setDebuffPercentHp();
  saveGame();
  
}

function loseCombat() {
  const world = gameState.world;
  const combat = gameState.combat;

  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
    
  const newHp = 1;
  updatePlayerHp(newHp);
    
  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  world.inCombat = false;
  
  //registerEnemyForRegen(enemy);
  markEnemyForRegen(enemy);
  
  clearBleed(enemy);
  
  isExploring = true;
  startEnemyUiRegenTick();
  
  syncStepEnemies(world.currentStepIndex);

  turnOffShieldMode(); 
  
  guardStacks = 0;
  updateGuardUI(0);
  
  handleDeathDebuffAfterFight();
  
  if(combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
  
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);

  resetSpear(enemy);
  resetSpearUI();
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy);
  
  stopBleedTimingUI();
  
  gameState.combat.bleedTimingActive = false;
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  setMenuDisabled(false);
  world.exploreOptions[world.selectedSlotIndex].isAttacked = false;
  
  world.selectedSlotIndex = null;
  
  unlockActions();
  showNavigateButtons();
  //renderOptions();
  
  renderLoots(world.selectedSlotIndex);
  
  //setDebuffPercentHp();
  
  unlockScroll();
  
  saveGame();
  
}

function calculateGoldLossOnFlee(player) {
  const hpPercent = player.hp / player.maxHp;
  //console.log("maxHp", player.maxHp);
  
 // console.log("hpPercent", hpPercent);
  
  // kara liniowo od 20% (przy pełnym HP) do 5% (przy 1% HP)
  const maxPenalty = 0.20; // 20%
  const minPenalty = 0.05; // 5%

  let penalty = minPenalty + (maxPenalty - minPenalty) * hpPercent;
  
  //penalty -= player.agi * 0.0005; // mniejszy koszt ucieczki
  
  penalty *= (1 - player.agi * 0.001);
  
  return penalty;
}

function calculateFleeChance(player, enemy){
  // Jeśli masz atrybuty szybkości – podepnij tu; na razie użyjemy różnicy poziomów
  const lvlDiff = (player.level || 1) - (enemy.level || 1);

  let chance = FLEE_CFG.BASE_CHANCE;
  if (lvlDiff > 0) chance += lvlDiff * FLEE_CFG.LVL_DIFF_BONUS;
  if (lvlDiff < 0) chance += Math.abs(lvlDiff) * (-FLEE_CFG.LVL_DIFF_PENALTY);

   // 🔥 PITY SYSTEM
  chance += gameState.combat.fleeFailStreak * FLEE_CFG.PITY_BONUS;
  
  chance += player.agi * 0.002; // 0.2% za punkt
  
  return clamp(chance, FLEE_CFG.MIN_CHANCE, FLEE_CFG.MAX_CHANCE);
}

async function attemptFlee() {
  const world = gameState.world;
  const combat = gameState.combat;

  if (!world.inCombat || world.selectedSlotIndex === null) return;

  const player = getPlayerStats();
  const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;

  // Szansa
  const chance = calculateFleeChance(player, enemy);
  const roll = Math.random();

  if (roll <= chance) {
    combat.fleeFailStreak = 0;
    await onFleeSuccess(player, enemy, world.selectedSlotIndex);
  } else {
    combat.fleeFailStreak++;
    await onFleeFail(player, enemy, world.selectedSlotIndex);
  }
}

async function onFleeSuccess(player, enemy, slotIndex, msg = false){
  // Koszt: złoto
  const world = gameState.world;
  const combat = gameState.combat;
  const penaltyPercent = calculateGoldLossOnFlee(player);
  //console.log("penaultyGold", penaltyPercent);
  let gold = parseInt(gameState.resources.gold, 10);
  const loss = Math.floor(gold * penaltyPercent);
  gold = Math.max(0, gold - loss);
  
  gameState.resources.gold = gold;
  
  // Zmęczenie – blok skilli na X sekund
  const until = nowDateMs() + FLEE_CFG.FATIGUE_SEC * 1000;
  setPlayerFlag("fleeFatigueUntil", until);

  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  updateSkillButtonsFatigueState();
  
  // Zatrzymaj “czas” wroga i pasek (twardy stop)
  stopEnemyAttack(slotIndex);

  // Wróg chwilę „poza walką” (opcjonalna blokada re-engage)
  enemy.reengageLockedUntil = nowDateMs() + FLEE_CFG.REENGAGE_LOCK_SEC * 1000;

  //registerEnemyForRegen(enemy);
  markEnemyForRegen(enemy);
  
  isExploring = true;
  startEnemyUiRegenTick();
  
  clearBleed(enemy);
  
  stopBleedTimingUI();
  
  guardStacks = 0;
  updateGuardUI(0);
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);

  resetSpear(enemy);
  resetSpearUI();  
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy);
  
  gameState.combat.bleedTimingActive = false;
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  syncStepEnemies(world.currentStepIndex);
  
  spendEnergy(`flee`);
  
  turnOffShieldMode();
  
  if(combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
  
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  hideFleeButton(); 
  
  exitCombat();
  
  // Zamknij sekwencję walki
  world.inCombat = false;
  world.exploreOptions[slotIndex].isAttacked = false;
  world.selectedSlotIndex = null;

  // UI
  //showInfoAlert(`Udało Ci się uciec! -${loss} złota. Skille zablokowane na ${FLEE_CFG.FATIGUE_SEC}s.`);
  
  let fleeMsg = "succes_flee_info1";
   
  if(msg) fleeMsg = "succes_flee_info_app_kill";
  
  showInfoAlert(
  `${t(fleeMsg)}<span style="color:red"> ${loss}${t("succes_flee_info2")}</span>${t("succes_flee_info3")}<span style="color:#0096FF">${t("succes_flee_info4")}</span> 
   ${t("succes_flee_info5")}<span style="color:orange">${FLEE_CFG.FATIGUE_SEC}s</span>.`,
  3000, true);

  //lockActions({ duration: 600, reason: "flee", allow: [] });
  
  setMenuDisabled(false);
  unlockActions();
  showNavigateButtons();
  renderLoots(world.selectedSlotIndex);
  renderOptions();
  unlockScroll();
  
  if ((gameState.world.mode ===`sandbox` || gameState.world.mode ===`adventure`) && world.currentStepIndex !== 0) {
    //navigate(`battle`);
    //console.warn(`after battle store button`);
    document.getElementById(`store-button`).classList.add('disabled');
    //saveGame();
    //return;
  }
  
  renderStats();
  
  //setDebuffPercentHp();
  saveGame();
}


async function onFleeFail(player, enemy, slotIndex){

  resumeEnemyAttack(enemy, slotIndex); 
  
  if (!enemy.status.isStunned && !enemy.status.isSlowed) {

    // 🧠 AGI – szansa na unik kontrataku
    const avoidChance = player.agi * 0.002;
    if (Math.random() < avoidChance) {
      showInfoAlert(`${t("fail_flee_info")}`);
      return;
    }

    // ❤️ HP scaling
    const hpFactor = player.hp / player.maxHp;

    // ⚡ AGI redukcja
    const agiReduction = player.agi * 0.001;

    let dmgMultiplier = 0.3 + (hpFactor * 0.4); // 30–70%
    dmgMultiplier *= (1 - agiReduction);

    dmgMultiplier = Math.max(0.2, dmgMultiplier);

    //console.error(`dmgMultiplier kontratak`, dmgMultiplier);
    
    performEnemyAttack(enemy, slotIndex, { multiplier: dmgMultiplier });
  }
  
  showInfoAlert(
    `<span style="color:white">${t("fail_flee_counterattack_info")}</span>`
  );
    
  saveGame();
}

function flee(i) {
  const world = gameState.world;
  const combat = gameState.combat;

  const enemy = world.exploreOptions[i].enemyData;
  
  const bar = document.getElementById("poise-mode");
  bar.classList.add("hidden");
  
  world.inCombat = false;
  world.selectedSlotIndex = null;
  world.exploreOptions[i].isAttacked = false;
  setMenuDisabled(false);
  //document.getElementById("slot-name").classList.add("hidden");
  
  markEnemyForRegen(enemy);
  
  isExploring = true;
  startEnemyUiRegenTick();
  
  clearBleed(enemy);
  
  enemy.poise = 100;
  
  resetArmorBreak(enemy);
  
  resetSpear(enemy);
  resetSpearUI();  
  stopSpearControlUI();
  //delete enemy.spear;
  
  resetBleed(enemy);
  
  gameState.combat.bleedTimingActive = false;
  
  stopBleedTimingUI();
  
  combat.stats.combo = 0;
  combat.stats.nextHitMultiplier = 0;
  combat.stats.nextHitPenetration = 0;
  
  gameState.combat.activeRingMode = ``;
  
  resetGuardRing();
  
  resetEnemyAI(enemy);
  
  guardStacks = 0;
  updateGuardUI(0);
  
  syncStepEnemies(world.currentStepIndex);
  
  turnOffShieldMode();
  
  if(combat.flags.isDebuff && combat.stats.energyFatigueStack < 5) combat.stats.energyFatigueStack++;
  
  //combatState.isDebuff = false;
  finishCombatWithDebuff();
  combat.flags.previewStats = false;
  
  spendEnergy(`flee`);
  
  saveSkillCooldowns(combat.skills.skillCooldowns);
  //console.log("przerywam stun z idx", i);
  stopEnemyAttack(i);
 // hideEnemyDialog();
  //hideEnemySlotSmooth();
  unlockScroll();
  focusOnSlots();
  unlockActions();
  showNavigateButtons();
  renderOptions();
  renderStats();
  //setDebuffPercentHp();
  saveGame();
}

