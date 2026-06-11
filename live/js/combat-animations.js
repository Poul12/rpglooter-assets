const HIT_EFFECTS = {
  basic: {
    type: "hit",
    duration: 180,
    scale: [0.5, 0.9],
    opacity: [0, 0.7, 0],
    hitStop: 0
  },

  slash: {
    type: "slash",
    duration: 300,
    scale: [0.6, 1.2],
    opacity: [0, 1, 0],
    hitStop: 20
  },

  double: {
    sequence: [
      { type: "double-attack-left", delay: 0 },
      { type: "double-attack-right", delay: 250 }
    ],
    hitStop: 15
  },

  charge: {
    type: "charge",
    duration: 350,
    scale: [0.7, 1.3],
    stretchX: 1.4,
    stretchY: 0.8,
    opacity: [0, 0.9, 0.2],
    rotate: 0, // możesz dynamicznie zmieniać
    hitStop: 40
  },

  jump: {
    sequence: [
      { type: "impact-jump", delay: 0 },
      { type: "shockwave", delay: 100 }
    ],
    duration: 600,
    scale: [0.5, 1.2],
    linger: true,
    hitStop: 60
  },

  jump_impact: {
    type: "impact-core",
    duration: 1500,
    scale: [1.3, 1.3],
    opacity: [0, 0.7, 0],
    hitStop: 50
  },

  jump_shockwave: {
    type: "impact-jump",
    duration: 500,
    opacity: [0, 0.7, 0.2],
    scale: [0.5, 1.3],
  },
  
  crit: {
    type: "bleed",
    duration: 300,
    scale: [0.6, 1.4],
    opacity: [0, 1, 0],
    hitStop: 50
  }
};


function spawnEffect(configKey, targetEl, options = {}) {
  const config = HIT_EFFECTS[configKey];
  if (!config || !targetEl) return;

  // 🔥 HIT STOP
  if (config.hitStop) hitStop(config.hitStop);

  // 🔁 SEKWENCJA (np. double, jump)
  if (config.sequence) {
    config.sequence.forEach(step => {
      setTimeout(() => {
        spawnSingleEffect(step.type, targetEl, {
          ...config,
          ...options
        });
      }, step.delay);
    });
    return;
  }

  // 🔹 SINGLE
  spawnSingleEffect(config.type, targetEl, {
    ...config,
    ...options
  });
}

function spawnSingleEffect(type, targetEl, config = {}) {
  const effect = document.createElement("img");

  const shieldUrl = assetManager.getResolvedAsset(`img/vfx/${type}.png`);
  
  effect.className = "hit-effect";
  effect.src = shieldUrl;

  // 🎯 dynamiczne style
  const scaleStart = config.scale?.[0] ?? 1;
  const scaleEnd = config.scale?.[1] ?? 1;

  effect.style.setProperty("--scale-start", scaleStart);
  effect.style.setProperty("--scale-end", scaleEnd);

  // opacity
  const opacityStart = config.opacity?.[0] ?? 0;
  const opacityMid = config.opacity?.[1] ?? 1;
  const opacityEnd = config.opacity?.[2] ?? 0;

  effect.style.setProperty("--opacity-start", opacityStart);
  effect.style.setProperty("--opacity-mid", opacityMid);
  effect.style.setProperty("--opacity-end", opacityEnd);
  
  // stretch (charge)
  if (config.stretchX) {
    effect.style.setProperty("--stretch-x", config.stretchX);
    effect.style.setProperty("--stretch-y", config.stretchY || 1);
  }

  // rotacja (np. kierunek)
  if (config.rotate !== undefined) {
    effect.style.setProperty("--rotate", `${config.rotate}deg`);
  }

  // czas trwania
  const duration = config.duration || 300;
  effect.style.animationDuration = `${duration}ms`;

  targetEl.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, duration);
}


let enemyUiTickId = null;

const enemyHpAnimations = {}; // slotIndex -> boolean

function getEnemyRegenHp(enemy, now = getGameTime()) {
  if (!enemy.regen) return enemy.currentHp;
  
  // ⛔ NIE TEN KROK → ZERO REGEN
  if (enemy.regen.stepIndex !== enemy.__stepIndex) {
    return enemy.currentHp;
  }
  
  const elapsed = (now - enemy.regen.startTime) / 1000;
  if (elapsed <= 0) return enemy.currentHp;

  let regenPerSecond = enemy.maxHp * 0.01;
  if (enemy.type === "mini_boss") regenPerSecond *= 0.4;
  if (enemy.type === "boss") regenPerSecond *= 0.1;

  const healed = Math.floor(elapsed * regenPerSecond);
  
  return Math.min(
    enemy.maxHp,
    enemy.regen.fromHp + healed
  );
}

function syncStepEnemies(stepIndex) {
  const step = gameState.world.locationSteps[stepIndex];
  if (!step?.exploreOptions) return;

  step.exploreOptions.forEach(opt => {
    if (opt.enemyData) {
     // console.log("SYNC", opt.enemyData.name, opt.enemyData.__stepIndex, world.currentStepIndex, opt.enemyData);
      syncEnemyHpFromTime(opt.enemyData, stepIndex);
    }
  });
}

function syncEnemyHpFromTime(enemy, stepIndex) {
  if (!enemy?.regen) return;

  // ⛔ nie synchronizuj wroga z innego kroku
  if (enemy.__stepIndex !== stepIndex) return;

  const realHp = getEnemyRegenHp(enemy);
  enemy.currentHp = realHp;

  if (enemy.currentHp >= enemy.maxHp) {
    enemy.regen = null;
  }
}

function onStepChange(newStepIndex) {
  gameState.world.locationSteps.forEach((step, i) => {
    if (!step.exploreOptions) return;

    step.exploreOptions.forEach(opt => {
      if (opt.enemyData) {
        opt.enemyData.regen = null;
      }
    });
  });
}

function startEnemyUiRegenTick() {
  if (enemyUiTickId) return;

  enemyUiTickId = setInterval(() => {
    if (gameState.world.inCombat || !isExploring) return;

    const step = gameState.world.locationSteps[gameState.world.currentStepIndex];
    if (!step?.exploreOptions) return;

    step.exploreOptions.forEach((opt, slotIndex) => {
      const enemy = opt.enemyData;
      
      if (!enemy?.regen) return;
      
      // ⛔ tylko ten krok
      //if (enemy.__stepIndex !== currentStepIndex) return;

      if (enemy.regen.stepIndex !== gameState.world.currentStepIndex) return;
      
      const hpAfter = getEnemyRegenHp(enemy);
      if (hpAfter === enemy.currentHp) return;

      const hpBefore = enemy.currentHp;
         
      enemy.currentHp = hpAfter;

      animateEnemyHpBar(slotIndex, hpBefore, hpAfter, enemy.maxHp);

      if (enemy.currentHp >= enemy.maxHp) {
        enemy.regen = null;
      }
    });
  }, 1000);
}

function stopEnemyUiRegenTick() {
  if (!enemyUiTickId) return;

  clearInterval(enemyUiTickId);
  enemyUiTickId = null;
}

function animateEnemyHpBar(slotIndex, fromHp, toHp, maxHp) {
  // ⛔ jeśli animacja już trwa → NIE restartuj
  if (enemyHpAnimations[slotIndex]) return;

  enemyHpAnimations[slotIndex] = true;

  // 🔒 zabezpieczenie: nigdy nie cofaj HP
  if (toHp <= fromHp) {
    enemyHpAnimations[slotIndex] = false;
    return;
  }

  const duration = 700; // trochę krócej niż tick
  const start = performance.now();

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const current = Math.floor(fromHp + (toHp - fromHp) * t);
    const percent = (current / maxHp) * 100;

    const bar = document.getElementById(`enemy-health-bar-${slotIndex}`);
    if (!bar) {
      enemyHpAnimations[slotIndex] = false;
      return;
    }

    /*bar.innerHTML = `
      <div class="enemy-health-fill" style="width:${percent}%;"></div>
      <div class="enemy-health-text">${current}/${maxHp}</div>
    `;*/

    bar.innerHTML = `
        <div class="enemy-health-fill" style="transform:scaleX(${percent / 100});"></div>
        <div class="enemy-health-text">${current}/${maxHp}</div>
    `;
    
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      enemyHpAnimations[slotIndex] = false;
    }
  }

  requestAnimationFrame(frame);
}

let lastUiTimestamp = null;
let uiRafId = null;

function startUiTick() {
  if (uiRafId !== null) return;
  
  function tick(timestamp) {
    if (lastUiTimestamp === null) {
      lastUiTimestamp = timestamp;
    }
    
    const deltaTime = (timestamp - lastUiTimestamp) / 1000;
    lastUiTimestamp = timestamp;
    
    //updateEnemyCooldownUI(timestamp);
    //updateTimedBlockUI(timestamp);
    /*updateStaminaOrb();
    updateShieldUI(timestamp);
    updateBlockState(timestamp);
    applyDevensiveBlockRegen(deltaTime);
    updatePoise(deltaTime);*/
    //updateGuardUI(guardStacks);
    
    if (shopMenuBtn && isLocationWithTown()) {
      if (gameState.world.currentStepIndex != 0) {
        shopMenuBtn.classList.add('disabled');
      } else {
        shopMenuBtn.classList.remove('disabled');
      }
    }
    
    uiRafId = requestAnimationFrame(tick);
  }
  lastUiTimestamp = null;
  uiRafId = requestAnimationFrame(tick);
}

function stopUiTick() {
  if (uiRafId !== null) {
    cancelAnimationFrame(uiRafId);
    uiRafId = null;
    lastUiTimestamp = null;
  }
}

let wasExhausted = false;

function updateStaminaOrb() {
  const orb = document.querySelector('.stamina-orb');
  const isExhausted = gameState.resources.staminaState.current <= 0;

  if (isExhausted && !wasExhausted) {
    // TYLKO przy wejściu w stan wyczerpania
    showOutcome("miss", `${t("exhausted_outcome")}`);
    playSound("low-stamina", 0.38);
    orb.classList.add('exhausted');
  }

  if (!isExhausted && wasExhausted) {
    // wyjście ze stanu wyczerpania
    orb.classList.remove('exhausted');
  }

  wasExhausted = isExhausted;
}

let perfectBlockTimingActive = false;
let perfectBlockAnimationFrame = null;

function showTimedBlockUI(player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getBlockWindows(player);

  setTimingBarMode("timed");

  miss.style.left = "0%";
  miss.style.width = "100%";

  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;

  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;

  let startTime = getGameTime();
  let barWidth;

  perfectBlockTimingActive = true;

  function animate() {

    if (!perfectBlockTimingActive) return;

    if (gameState.globalTime.isPaused) {
      perfectBlockAnimationFrame = requestAnimationFrame(animate);
      return;
    }

    const elapsed = getGameTime() - startTime;

    const cycle = elapsed / TIMED_DURATION;

    //const progress = Math.abs(Math.sin(cycle * Math.PI));
    //const progress = (elapsed % TIMED_DURATION) / TIMED_DURATION;
    const cycleLength = TIMED_DURATION + 120;
    const cycleTime = elapsed % cycleLength;
    let progress;
    
    if (cycleTime >= TIMED_DURATION) {
      progress = 0;
      gameState.combat.playerBlock.startTime = getGameTime();
    } else {
      progress = cycleTime / TIMED_DURATION;
    }
    
    
    const moveX = progress * barWidth;

    indicator.style.transform =
      `translateX(${moveX}px) skewX(-10deg)`;

    sweep.style.transform =
      `translateX(${moveX}px)`;

    perfectBlockAnimationFrame =
      requestAnimationFrame(animate);
  }

  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth || 1;
    requestAnimationFrame(animate);
  });
}

function stopTimedBlockUI() {

  perfectBlockTimingActive = false;

  if (perfectBlockAnimationFrame) {
    cancelAnimationFrame(perfectBlockAnimationFrame);
    perfectBlockAnimationFrame = null;
  }

  const bar = document.getElementById("timing-mode");

  bar.classList.add("hidden");
}

function resumeTimedBlockUI() {
  if (!perfectBlockTimingActive) return;
  
  const bar = document.getElementById("timing-mode");

  if (bar.classList.contains("hidden")) return;

  const player = getPlayerStats();
  showTimedBlockUI(player);
}


/*function showTimedBlockUI(player) {
  const perfectBar = document.querySelector(".perfect-block-bar");
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");
  
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;
  
  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getBlockWindows(player);

  // MISS = CAŁOŚĆ
  miss.style.left = "0%";
  miss.style.width = "100%";
  
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;

  // PERFECT
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
 
  const startTime = performance.now();

  setTimingBarMode("timed");
  
  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / TIMED_DURATION, 1);

    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      bar.classList.add("hidden");
      gameState.combat.playerBlock.lastResult = null;
    }
  }

  let barWidth;
  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth;
    requestAnimationFrame(animate);
  });
}*/

/*function pauseTimedBlock() {
  if (!playerBlock.active || playerBlock.activePaused) return;

  const now = Date.now();

  if (now < playerBlock.endTime) {
    playerBlock.activeRemaining = playerBlock.endTime - now;
  } else {
    playerBlock.activeRemaining = 0;
  }

  playerBlock.activePaused = true;
  playerBlock.endTime = 0;
}*/

/*function pauseTimedBlock() {
  const playerBlock = combat.playerBlock;
  
  if (!playerBlock.active || playerBlock.activePaused) return;

  const now = performance.now();

  playerBlock.activeRemaining = Math.max(0, playerBlock.endTime - now);

  playerBlock.activePaused = true;

  console.log("timed paused");
}

function resumeTimedBlock() {
  const playerBlock = combat.playerBlock;

  if (!playerBlock.active || !playerBlock.activePaused) return;

  playerBlock.endTime = performance.now() + playerBlock.activeRemaining;

  playerBlock.activePaused = false;
}*/

/*function resumeTimedBlock() {
  if (!playerBlock.active || !playerBlock.activePaused) return;

  if (playerBlock.activeRemaining > 0) {
    playerBlock.endTime = Date.now() + playerBlock.activeRemaining;
  }

  playerBlock.activePaused = false;
}*/

function updateShieldUI() {
  const shieldBtn = document.getElementById("attack-left");
  const cooldownOverlay = shieldBtn?.querySelector(".block-cooldown-overlay");

  if (!shieldBtn || !cooldownOverlay) return;

  const COOLDOWN = 3000;

  const now = getGameTime();
  const cdEnd = gameState.combat.playerBlock.cooldownUntil || 0;
  
  if (now < cdEnd) {
    const remaining = cdEnd - now;
    const progress = remaining / COOLDOWN;

    //console.error(`shield disabled`);
    //shieldBtn.classList.add("cooldown");
    shieldBtn.classList.add("disabled");
    shieldBtn.classList.remove("turtle"); // 🔴 ważne

    cooldownOverlay.style.transform = `scaleY(${progress})`;
  } else {
    //console.error(`shield disabled`);
    shieldBtn.classList.remove("disabled");
    //shieldBtn.classList.remove("cooldown");
    cooldownOverlay.style.transform = `scaleY(0)`;
  }
}


const playerAttackCooldown = {
  cooldownEnd: 0,
  durationMs: 0,
  rafId: null,
  overlay: null
};


function startAttackCooldown(durationInSeconds) {
  const attackButton = document.getElementById("attack-button");
  const attackIcon = document.getElementById("attack-icon");
  const overlay = attackButton.querySelector(".cooldown-overlay");

  if (!attackButton || !attackIcon) return;

  const durationMs = durationInSeconds * 1000;

//  console.error(`durationMs`, durationMs);
  const eq = gameState.char?.equipment || {};
  const weapon = eq["weapon"];

  let weaponSprite = "img/icons/right-hand-placeholder.png";
  if (weapon) {
    weaponSprite = "img/items/" + weapon.sprite;
  }
  
  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);
  //console.error(`weaponSprite, weaponUrl`, weaponSprite, weaponUrl);

  //attackButton.disabled = true;
  attackButton.classList.add("disabled");
  //attackButton.classList.add("cooldown");
  attackIcon.src = `${weaponUrl}`;

  //setSpriteImage(attackIcon, weaponSprite);
  
  /*let overlay = attackButton.querySelector(".cooldown-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "cooldown-overlay";
    attackButton.appendChild(overlay);
  }*/

  //overlay.style.transform = "scaleY(1)";

  playerAttackCooldown.durationMs = durationMs;
  playerAttackCooldown.cooldownEnd = getGameTime() + durationMs;
  playerAttackCooldown.overlay = overlay;

  animateAttackCooldown();
}

function animateAttackCooldown() {
  const now = getGameTime();
  const remaining = playerAttackCooldown.cooldownEnd - now;

  if (remaining <= 0) {
    finishAttackCooldown();
    return;
  }

  const progress = 1 - (remaining / playerAttackCooldown.durationMs);
  playerAttackCooldown.overlay.style.transform = `scaleY(${1 - progress})`;

  playerAttackCooldown.rafId = requestAnimationFrame(animateAttackCooldown);
}


function finishAttackCooldown() {
  const attackButton = document.getElementById("attack-button");
  const attackIcon = document.getElementById("attack-icon");

  const eq = gameState.char?.equipment || {};
  const weapon = eq["weapon"];

  let weaponSprite = "img/icons/right-hand-placeholder.png";
  if (weapon) {
    weaponSprite = "img/items/" + weapon.sprite;
  }

  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);
  
  if (attackButton && attackIcon) {
    //attackButton.disabled = false;
    attackButton.classList.remove("disabled");
    //attackButton.classList.remove("cooldown");
    attackIcon.src = `${weaponUrl}`;
  //  console.error(`weaponSprite`, weaponSprite);
    //setSpriteImage(attackIcon, weaponSprite);
  }

  if (playerAttackCooldown.overlay) {
    playerAttackCooldown.overlay.style.transform = "scaleY(0)";
  }

  cancelAnimationFrame(playerAttackCooldown.rafId);

  playerAttackCooldown.cooldownEnd = 0;
  playerAttackCooldown.durationMs = 0;
  playerAttackCooldown.rafId = null;
}

function restoreAttackCooldownAfterLoad() {
  const now = getGameTime();

  if (playerAttackCooldown.cooldownEnd > now) {
    animateAttackCooldown();
  } else {
    finishAttackCooldown();
  }
}


/*function startAttackCooldown(durationInSeconds) {
  const attackButton = document.getElementById("attack-button");
  const blockButton = document.getElementById("attack-left");
  const attackIcon = document.getElementById("attack-icon");
  const eq = char?.equipment || {};
  const weapon = eq[`Broń`];
   
  let weaponSprite = `icons/right-hand-placeholder.png`;

  if(weapon){
    weaponSprite = `items/` + weapon.sprite;
  }
  
  if (!attackButton || !attackIcon) return;

  //attackIcon.src = `${ASSET_BASE}img/buttons/attack-off.png`;
  attackIcon.src = `${ASSET_BASE}img/${weaponSprite}`;
  attackButton.disabled = true;
  attackButton.classList.add("cooldown");

  let overlay = attackButton.querySelector(".cooldown-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "cooldown-overlay";
    attackButton.appendChild(overlay);
  }

  overlay.style.transform = "scaleY(1)";

  playerAttackCooldown.isOnCooldown = true;
  playerAttackCooldown.wasRunning = false;
  playerAttackCooldown.startTime = performance.now();
  playerAttackCooldown.durationMs = durationInSeconds * 1000;
  playerAttackCooldown.remainingMs = playerAttackCooldown.durationMs;
  playerAttackCooldown.progressAtPause = 0;
  playerAttackCooldown.overlay = overlay;

  function animate(now) {
    const elapsed = now - playerAttackCooldown.startTime;
    const progress = Math.min(elapsed / playerAttackCooldown.durationMs, 1);
    overlay.style.transform = `scaleY(${1 - progress})`;

    if (progress < 1 && playerAttackCooldown.isOnCooldown) {
      playerAttackCooldown.rafId = requestAnimationFrame(animate);
    } else {
      attackButton.disabled = false;
      attackButton.classList.remove("cooldown");
      //attackIcon.src = `${ASSET_BASE}img/buttons/attack-on.png`;
      attackIcon.src = `${ASSET_BASE}img/${weaponSprite}`;
      overlay.style.transform = "scaleY(0)";
      playerAttackCooldown.isOnCooldown = false;
      playerAttackCooldown.rafId = null;
    }
    
    if (combat.playerBlock.cooldownUntil <= now) {
      blockButton.classList.remove(`cooldown`);
    }
  }

  playerAttackCooldown.rafId = requestAnimationFrame(animate);
}*/

function pausePlayerAttack() {
  if (!playerAttackCooldown.isOnCooldown) return;

  cancelAnimationFrame(playerAttackCooldown.rafId);
  const now = performance.now();
  const elapsed = now - playerAttackCooldown.startTime;

  playerAttackCooldown.remainingMs = Math.max(playerAttackCooldown.durationMs - elapsed, 0);
  playerAttackCooldown.progressAtPause = elapsed / playerAttackCooldown.durationMs;
  playerAttackCooldown.isOnCooldown = false;
  playerAttackCooldown.wasRunning = true;
}

function resumePlayerAttack() {
  if (!playerAttackCooldown.wasRunning || playerAttackCooldown.remainingMs <= 0) return;

  playerAttackCooldown.isOnCooldown = true;
  playerAttackCooldown.startTime = performance.now();
  playerAttackCooldown.durationMs = playerAttackCooldown.remainingMs;

  const overlay = playerAttackCooldown.overlay;
  const startProgress = playerAttackCooldown.progressAtPause;
  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
  let weaponSprite = `img/icons/right-hand-placeholder.png`;
  
  if(weapon){
    weaponSprite = `img/items/` + weapon.sprite;
  }
  
  const weaponUrl = assetManager.getResolvedAsset(weaponSprite);
  
  function animate(now) {
    const elapsed = now - playerAttackCooldown.startTime;
    const progress = Math.min(elapsed / playerAttackCooldown.durationMs, 1);
    const totalProgress = startProgress + progress * (1 - startProgress);

    overlay.style.transform = `scaleY(${1 - totalProgress})`;

    if (progress < 1 && playerAttackCooldown.isOnCooldown) {
      playerAttackCooldown.rafId = requestAnimationFrame(animate);
    } else {
      playerAttackCooldown.isOnCooldown = false;
      playerAttackCooldown.wasRunning = false;
      playerAttackCooldown.rafId = null;

      // po zakończeniu cooldownu przywróć stan przycisku
      const attackButton = document.getElementById("attack-button");
      const attackIcon = document.getElementById("attack-icon");
      if (attackButton && attackIcon) {
        attackButton.disabled = false;
        attackButton.classList.remove("cooldown");
        //attackIcon.src = `${ASSET_BASE}img/buttons/attack-on.png`;
        attackIcon.src = `${weaponUrl}`;
        overlay.style.transform = "scaleY(0)";
      }
    }
  }

  playerAttackCooldown.rafId = requestAnimationFrame(animate);
}

function startFinisherBar(durationMs, enemy) {
  gameState.combat.flags.enemyFinisherActive = true;

  //const bar = document.getElementById("finisher-bar");
  //const fill = document.getElementById("finisher-fill");
  const bar = document.querySelector(".enemy-cooldown-bar");
  const fill = document.getElementById(`enemy-cooldown-fill-${gameState.world.selectedSlotIndex}`);

  const baseCooldown = calculateCooldown(enemy.atkSpd) * 1000;

  //bar.classList.remove("hidden", "warning");

  //bar.classList.remove("warning");
  fill.classList.remove(`enemy-cooldown-fill`);
  fill.classList.add(`finisher-fill`);
  
  // reset
  fill.style.transition = "none";
  fill.style.width = "0%";
  void fill.offsetWidth;

  // animacja
  fill.style.transition = `width ${durationMs}ms linear`;
  fill.style.width = "100%";

  // ostrzeżenie przed ciosem (300 ms)
  setTimeout(() => {
    //bar.classList.add("warning");
    showOutcome("miss", `${t("now_outcome")}`, 500);
  }, durationMs - 550);

  // cleanup
  setTimeout(() => {
    //bar.classList.add("hidden");
    gameState.combat.flags.enemyFinisherActive = false;
    fill.classList.remove(`finisher-fill`);
    fill.classList.add(`enemy-cooldown-fill`);
    //bar.classList.remove("warning");
  }, durationMs);
}

function triggerCriticalShake() {
  document.body.classList.remove("critical-shake");
  void document.body.offsetWidth;
  document.body.classList.add("critical-shake");
}

function updateGuardUI(stacks) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "guard") return;
  
  //if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  
  const segments = ring.querySelectorAll(".guard-segment");

  /*if (gameState.combat.playerBlock.mode !== "defensive" || enemy.bleedStacks === 0) {
    //ring.classList.add("hidden");
    //return;
  }*/
  
 // console.error(`update guard UI`, stacks);
  
  ring.classList.remove("hidden");

  segments.forEach(seg => seg.style.opacity = 0);

  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#FFD400";
  }

  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;
 
    segments[0].style.stroke = "#FF7A00";
    segments[1].style.stroke = "#FF7A00";
  }
 
  if (stacks === 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#FF1E1E";
    });
    
    ring.classList.add("full");
  }
}


function consumeGuardStacks(stacks) {
  const ring = document.getElementById("guard-ring");
  
  if(!ring) return;
  
  ring.classList.add("guard-release");

  ring.classList.toggle("full", stacks === 3);
  
  if (stacks === 3) showOutcome("perfect", `${t("counterattack_outcome")}`);
  
  setTimeout(() => {
    ring.classList.remove("guard-release");
    updateGuardUI(0);
    resetGuardRing();
  }, 150);
}

function updatePoise(delta) {
  if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex].enemyData;
  
  if (!enemy) return;
  if (enemy?.poiseBroken) return;
  
  enemy.poise = Math.min(
    enemy.maxPoise,
    enemy.poise + enemy.poiseRegenRate * delta
  );
}

function updatePoiseBar() {
  if(gameState.world.selectedSlotIndex === null) return;
  
  //console.error(`poise bar UI before`, gameState.combat.activeRingMode);
  
  if(gameState.combat.activeRingMode !== `poise`) return;
  
  //console.error(`poise bar UI after`, gameState.combat.activeRingMode);

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();
  
  const bar = document.querySelector(".poise-bar");
  const fill = bar.querySelector(".poise-fill");

  const percent = enemy.poise / enemy.maxPoise;
  fill.style.width = `${percent * 100}%`;
  
  //console.error(`enemy.poise`, enemy.poise);

  updatePoiseTextColor(percent * 100);
  
  const poiseDmg = 35 + getStrScaling(player).effectPower;

  if (enemy.poise <= poiseDmg) {
    bar.classList.add("break-ready");
  } else {
    bar.classList.remove("break-ready");
  }
}

function updatePoiseTextColor(fillPercent) {
  const text = document.querySelector(".poise-text");

  // Zakładamy, że tekst jest na środku (50%)
  if (fillPercent > 50) {
    text.classList.add("on-fill");
    text.classList.remove("on-bar");
  } else {
    text.classList.add("on-bar");
    text.classList.remove("on-fill");
  }
}

function updatePoiseMarker() {
  if(gameState.world.selectedSlotIndex === null) return;
  
  if (gameState.combat.activeRingMode !== "poise") return;
  
  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
  const player = getPlayerStats();
  
  const bar = document.querySelector(".poise-bar");
  const marker = bar.querySelector(".poise-threshold");
  const text = bar.querySelector(".poise-text");

  const poiseDmg = 25 + getStrScaling(player).effectPower;

  const predicted = Math.max(0, enemy.poise - poiseDmg);

  const percent = predicted / enemy.maxPoise;

  text.textContent = `${enemy.poise.toFixed(0)} %`;
  
  marker.style.left = `${percent * 100}%`;
}

function updateBleedRing(enemy) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "bleed") return;
  
  const stacks = enemy.bleedStacks || 0;
  const segments = ring.querySelectorAll(".guard-segment");

  // pokaż ring
  ring.classList.remove("hidden");
  
    // reset segmentów
  segments.forEach(seg => {
    seg.style.opacity = 0;
  });

  // 1 stack
  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#ff8a00"; // pomarańcz bleed
  }

  // 2 stacki
  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;

    segments[0].style.stroke = "#ff3d00";
    segments[1].style.stroke = "#ff3d00";
  }

  // 3 stacki = READY
  if (stacks >= 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#ff1e1e";
    });

    ring.classList.add("full-bleed"); // pulsowanie
  } else {
    ring.classList.remove("full-bleed");
  }
}

function resetBleedUI() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => seg.style.opacity = 0);

 // console.error(`reset bleed UI`);
  
  ring.classList.remove("full-bleed");
}

function setBleedReadyUI(isReady) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.toggle("full-bleed", isReady);
}

function triggerBleedVFX() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.add("burst");

  setTimeout(() => {
    ring.classList.remove("burst");
  }, 300);
}

function setTimingBarMode(mode) {
  const bar = document.getElementById("timing-mode");

  bar.classList.remove("mode-timed", "mode-bleed", "mode-break", "mode-spear");

  if (mode) {
    bar.classList.add(`mode-${mode}`);
   // console.error("bar mode", mode);
  }
}

let bleedTimingActive = false;
let bleedAnimationFrame = null;

const BLEED_TIMED_DURATION = TIMED_DURATION * 2;

function showBleedTimingUI(player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  gameState.combat.bleedTimingActive = true;
  
  // RESET
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getBleedWindows(player);

  setTimingBarMode("bleed");

  // MISS = CAŁOŚĆ
  miss.style.left = "0%";
  miss.style.width = "100%";
   
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;
   
  // PERFECT (zmień klasę na bleed)
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
  
  let startTime = getGameTime();
  let barWidth;

  bleedTimingActive = true;

  function animate() {
    if (!bleedTimingActive || gameState.globalTime.isPaused) return;
    
    const elapsed = getGameTime() - startTime;
    
    const cycle = elapsed / BLEED_TIMED_DURATION;
    const progress = Math.abs(Math.sin(cycle * Math.PI));
    
    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;

    bleedAnimationFrame = requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth || 1;
    requestAnimationFrame(animate);
  });
}

function stopBleedTimingUI() {
  bleedTimingActive = false;

  if (bleedAnimationFrame) {
    cancelAnimationFrame(bleedAnimationFrame);
    bleedAnimationFrame = null;
  }

  const bar = document.getElementById("timing-mode");
  bar.classList.add("hidden");
}

function resumeBleedUI() {
  if (!bleedTimingActive) return;
  
  const bar = document.getElementById("timing-mode");

  if (bar.classList.contains("hidden")) return;

  const player = getPlayerStats();
  showBleedTimingUI(player);
}

function decayBleedStacks(enemy) {
  if (!enemy.lastBleedHit) return;
  
  //console.error(`bleed decay active ring`, gameState.combat.activeRingMode);
  
  if (gameState.combat.activeRingMode !== `bleed`) return;

  //console.error(`bleed decay`);
  
  const now = getGameTime();

  if (now - enemy.lastBleedHit > 3500) {
    enemy.bleedStacks = Math.max(0, enemy.bleedStacks - 1);

    enemy.lastBleedHit = now;
    
    if (enemy.bleedStacks < 3) {
      enemy.bleedReady = false;
      gameState.combat.bleedTimingActive = false;
      setBleedReadyUI(false);
    }

   // console.error(`bleed decay enemy.bleedStacks`, enemy.bleedStacks);
    updateBleedRing(enemy);
    stopBleedTimingUI();
  }
}

const GS_TIMED_DURATION = 800; // wolniej niż bleed

function getArmorBreakWindows(player) {
  const BASE_TOTAL = 220; // mniejsze niż bleed

  const PERFECT_RATIO = 0.14; // węższe okno
  const agiBonus = 1 + player.agi * 0.001; // mniejszy wpływ niż bleed

  const total = BASE_TOTAL;

  const perfect = total * PERFECT_RATIO * agiBonus;
  const normal = total - perfect;

  return {
    perfect,
    normal
  };
}

let armorBreakAnimationFrame = null;
let armorBreakActive = false;

function showArmorBreakTimingUI(enemy, player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  gameState.combat.armorBreakTimingActive = true;
  
  // RESET
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  // 👉 specjalne okna dla GS
  const { perfect: p, normal: n } = getArmorBreakWindows(player);

  // MISS
  miss.style.left = "0%";
  miss.style.width = "100%";
   
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;
 
  // PERFECT
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
  
  const startTime = getGameTime();
  let barWidth;

  armorBreakActive = true;

  setTimingBarMode("break");
  
  function animate() {
    if (!armorBreakActive) return;

    const elapsed = getGameTime() - startTime;
    const progress = Math.min(elapsed / GS_TIMED_DURATION, 1);

    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;

    if (progress < 1) {
      armorBreakAnimationFrame = requestAnimationFrame(animate);
    } else {
      // timeout = miss
      stopArmorBreakTimingUI(enemy);
    }
  }

  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth;
    requestAnimationFrame(animate);
  });
}

function stopArmorBreakTimingUI(enemy) {
  armorBreakActive = false;

  if (armorBreakAnimationFrame) {
    cancelAnimationFrame(armorBreakAnimationFrame);
    armorBreakAnimationFrame = null;
  }

  if (enemy.armorBreakReady) {
    enemy.exposeStacks = 1; 
    
    gameState.combat.armorBreakTimingActive = false;
    enemy.armorBreakReady = false;
    updateArmorRing(enemy);
  }
  
  const bar = document.getElementById("timing-mode");
  bar.classList.add("hidden");

}

function updateArmorRing(enemy) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "armor") return;
  
  const stacks = enemy.exposeStacks || 0;
  const segments = ring.querySelectorAll(".guard-segment");

  // pokaż ring
  ring.classList.remove("hidden");
  
    // reset segmentów
  segments.forEach(seg => {
    seg.style.opacity = 0;
  });

  //console.error(`reset UI armor break`, enemy.exposeStacks);
  
  // 1 stack
  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#ff8a00"; // pomarańcz bleed
  }

  // 2 stacki
  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;

    segments[0].style.stroke = "#ff3d00";
    segments[1].style.stroke = "#ff3d00";
  }

  // 3 stacki = READY
  if (stacks >= 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#ff1e1e";
    });

    ring.classList.add("full"); // pulsowanie
  } else {
    ring.classList.remove("full");
  }
}

function setArmorReadyUI(isReady) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.toggle("full", isReady);
}

function decayArmorBreakStacks(enemy) {
  if (!enemy.lastArmorBreakHit) return;
  if (!enemy.exposeStacks) return;
  if (gameState.combat.activeRingMode !== `armor`) return;
  
  const now = getGameTime();

  if (now - enemy.lastArmorBreakHit > 4000) {
    enemy.exposeStacks = Math.max(0, enemy.exposeStacks - 1);

    // 🔥 reset timera – KLUCZ
    enemy.lastArmorBreakHit = now;

    if (enemy.exposeStacks < 3) {
      enemy.armorBreakReady = false;
      setArmorReadyUI(false);
    }

    //console.error("armor decay:", enemy.exposeStacks);

    updateArmorRing(enemy);

    // jeśli spadło do 0 → sprzątaj
    if (enemy.exposeStacks === 0) {
      stopArmorBreakTimingUI(enemy);
      gameState.combat.armorBreakTimingActive = false;
    }
  }
}

let spearTimingActive = false;
let spearAnimationFrame = null;

const SPEAR_TIMED_DURATION = TIMED_DURATION * 2.3;

function startSpearControlUI(player) {
  const bar = document.getElementById("timing-mode");
  const miss = bar.querySelector(".miss-window");
  const normal = bar.querySelector(".normal-window");
  const perfect = bar.querySelector(".perfect-window");
  const indicator = bar.querySelector(".time-indicator");
  const sweep = bar.querySelector(".glass-sweep");

  // RESET
  indicator.style.transform = `translateX(0px) skewX(-10deg)`;
  sweep.style.transform = `translateX(0px)`;

  bar.classList.remove("hidden");

  const { perfect: p, normal: n } = getSpearWindows(player);

  setTimingBarMode("spear");

  // MISS = CAŁOŚĆ
  miss.style.left = "0%";
  miss.style.width = "100%";
   
  // NORMAL
  const normalWidth = msToPercent(n) * 2;
  normal.style.left = `${50 - normalWidth / 2}%`;
  normal.style.width = `${normalWidth}%`;
   
  // PERFECT 
  const perfectWidth = msToPercent(p) * 2;
  perfect.style.left = `${50 - perfectWidth / 2}%`;
  perfect.style.width = `${perfectWidth}%`;
  
  let startTime = getGameTime();
  let barWidth;

  spearTimingActive = true;

  function animate() {
    if (!spearTimingActive || gameState.globalTime.isPaused) return;

    const elapsed = getGameTime() - startTime;
    
    const cycle = elapsed / SPEAR_TIMED_DURATION;
    //const progress = Math.abs(Math.sin(cycle * Math.PI));
    const progress = Math.pow(Math.abs(Math.sin(cycle * Math.PI)), 0.7);
    
    const moveX = progress * barWidth;

    indicator.style.transform = `translateX(${moveX}px) skewX(-10deg)`;
    sweep.style.transform = `translateX(${moveX}px)`;

    spearAnimationFrame = requestAnimationFrame(animate);
  }
  
  requestAnimationFrame(() => {
    barWidth = bar.offsetWidth || 1;
    requestAnimationFrame(animate);
  });
}

function stopSpearControlUI() {
  spearTimingActive = false;

  if (spearAnimationFrame) {
    cancelAnimationFrame(spearAnimationFrame);
    spearAnimationFrame = null;
  }
  
 // console.error(`stop spear UI`);

  const bar = document.getElementById("timing-mode");
  bar.classList.add("hidden");
}


function resumeSpearUI() {
  if (!spearTimingActive) return;

  //if (spearAnimationFrame) return; // już działa

  const bar = document.getElementById("timing-mode");

  if (bar.classList.contains("hidden")) return;

  const player = getPlayerStats();
  //spearAnimationFrame = requestAnimationFrame(animate);
  //stopSpearControlUI();
  startSpearControlUI(player);
}

function updateSpearRing(enemy) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  if (gameState.combat.activeRingMode !== "spear") return;
  
  const stacks = enemy.spear?.stacks || 0;
  const segments = ring.querySelectorAll(".guard-segment");

  // pokaż ring
  ring.classList.remove("hidden");
  
    // reset segmentów
  segments.forEach(seg => {
    seg.style.opacity = 0;
  });

  // 1 stack
  if (stacks === 1) {
    segments[0].style.opacity = 1;
    segments[0].style.stroke = "#4aa3ff"; 
  }

  // 2 stacki
  if (stacks === 2) {
    segments[0].style.opacity = 1;
    segments[1].style.opacity = 1;

    segments[0].style.stroke = "#00cfff";
    segments[1].style.stroke = "#00cfff";
  }

  // 3 stacki = READY
  if (stacks >= 3 && !ring.classList.contains("burst")) {
    segments.forEach(seg => {
      seg.style.opacity = 1;
      seg.style.stroke = "#e6faff";
    });

    ring.classList.add("full"); // pulsowanie
  } else {
    ring.classList.remove("full");
  }
}

function resetSpearUI() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => seg.style.opacity = 0);

  stopSpearControlUI();
  
 // console.error(`reset spear UI`);
  
  ring.classList.remove("full");
}

function setSpearReadyUI(isReady) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  ring.classList.toggle("full", isReady);
}

/*function updateGuardRing1H(mode, combo) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  // reset
  segments.forEach(seg => seg.classList.remove("filled"));
  ring.classList.remove("hidden", "full");

  const progress = combo % 3;

  if (progress === 0) {
    // 👉 NIE pokazujemy pełnego ringa
    ring.classList.add("hidden");
    return;
  }

  ring.classList.remove("hidden");
  ring.classList.add(`mode-${mode}`);

  for (let i = 0; i < progress; i++) {
    segments[i].classList.add("filled");
  }
}*/


function updateGuardRing(mode, stacks) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  // 🔥 reset segmentów
  segments.forEach(seg => {
    //seg.classList.remove("filled");
    seg.style.opacity = 0;
    seg.style.stroke = ``;
  });

  // 🔥 reset klas ringa
  ring.classList.remove(
    "mode-sword",
    "mode-longsword",
    "mode-axe",
    "mode-mace",
    "lvl-1",
    "lvl-2",
    "lvl-3",
    "full"
  );

  if (!mode || stacks <= 0) {
    ring.classList.add("hidden");
    return;
  }

  ring.classList.remove("hidden");
  ring.classList.add(`mode-${mode}`);

  const lvl = Math.min(3, stacks);
  ring.classList.add(`lvl-${lvl}`);

  // 🔥 TU NAJWAŻNIEJSZE
  for (let i = 0; i < lvl; i++) {
    //segments[i].classList.add("filled");
    segments[i].style.opacity = 1;
  }

  if (lvl === 3) {
    ring.classList.add("full");
  }
}

function resetGuardRing() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => {
    //seg.classList.remove("filled");
    seg.style.opacity = 0;
  });

  ring.classList.add("hidden");

  ring.classList.remove(
    "mode-sword",
    "mode-longsword",
    "mode-axe",
    "mode-mace",
    "mode-spear",
    "lvl-1",
    "lvl-2",
    "lvl-3",
    "full",
    "burst",
    "guard-release"
  );
}

function triggerRingBurst() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;
  
  ring.classList.add("burst");

  setTimeout(() => {
    ring.classList.remove("burst");
  }, 300);
}

function triggerRingFull() {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;
  
  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => {
    seg.style.opacity = 1;
  });
  
  ring.classList.add("full");

  setTimeout(() => {
    ring.classList.remove("full");
  }, 300);
}


function triggerRingPulse(mode) {
  const ring = document.getElementById("guard-ring");
  if (!ring) return;

  const segments = ring.querySelectorAll(".guard-segment");

  segments.forEach(seg => {
    seg.style.opacity = 1;
  });
  
  ring.classList.remove("hidden");

  ring.classList.add(`pulse-${mode}`);

  setTimeout(() => {
    ring.classList.remove(`pulse-${mode}`);
    ring.classList.add("hidden");
  }, 300);
}

function setLongswordBuffUI(active) {
  const attackBtn = document.getElementById("attack-button");

  if (!attackBtn) return;
  
  attackBtn.classList.toggle("ls-buff", active);
}