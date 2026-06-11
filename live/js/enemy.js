
const enemyAttackTimeline = {
      duration: 1500,
      elapsed: 0,
      speed: 1,
      isPaused: false,
      isRunning: false,
      lastFrameTime: null,
      rafId: null,
      phase: "windup"
    };

function nowMs() {
  return performance.now();
}

// ===================== PAUSE / RESUME =====================

function pauseEnemyAttack(enemy, slotIndex) {
  const timeline = enemyAttackTimeline;
  timeline.isPaused = true;
      
  pauseAnimation(enemy);
      
  // zapamiętaj pozostały czas efektów
  if (enemy.status.slowEnd) {
    //enemy.status.slowRemaining = enemy.status.slowEnd - Date.now();
    enemy.status.slowRemaining = enemy.status.slowEnd - nowMs();
  }
  if (enemy.status.stunEnd) {
    enemy.status.stunRemaining = enemy.status.stunEnd - nowMs();
    //enemy.status.stunRemaining = enemy.status.stunEnd - Date.now();
  }
}

function resumeEnemyAttack(enemy, slotIndex) {
  const timeline = enemyAttackTimeline;
  timeline.isPaused = false;

  resumeAnimation(enemy);
      
  // przywróć timery statusów
  if (enemy.status.slowRemaining != null) {
    //enemy.status.slowEnd = Date.now() + enemy.status.slowRemaining;
    enemy.status.slowEnd = nowMs() + enemy.status.slowRemaining;
    enemy.status.slowRemaining = null;
  }

  if (enemy.status.stunRemaining != null) {
    enemy.status.stunEnd = nowMs() + enemy.status.stunRemaining;
    //enemy.status.stunEnd = Date.now() + enemy.status.stunRemaining;
    enemy.status.stunRemaining = null;
  }
}

function emitEnemyAttackWindup({ enemy, slotIndex, duration }) {
  window.dispatchEvent(
    new CustomEvent("enemy-attack-windup", {
      detail: {
        enemy,
        slotIndex,
        duration,
        startTime: performance.now()
      }
    })
  );
}

function startEnemyAttackTimeline(enemy, slotIndex) {
  const baseCooldown = calculateCooldown(enemy.atkSpd) * 1000;

  enemy.attackState = {
    phase: "cooldown",
    remaining: baseCooldown,
    baseCooldown,
    windupDuration: 600,
    slotIndex,
  };

  enemy.intent = null;
  enemy.intentReadyAt = 0;
      
  enemyAttackTimeline.isRunning = true;
  enemyAttackTimeline.isPaused = false;

  updateCooldownBar(enemy, 0, slotIndex);
}


function updateEnemyAttack(delta) {
  const timeline = enemyAttackTimeline;

  if (!timeline.isRunning || timeline.isPaused) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if (!enemy?.attackState) return;

  const state = enemy.attackState;

  state.windupDuration = enemy.windupDuration || 600;
      
  // === STATUS CHECK ===
  const now = performance.now();
      
  /*if (!enemy.intent) {
    rollEnemyIntent(enemy);
    return;
  }*/
      
  if (enemy.spear && getGameTime() > enemy.spear.expiresAt) {
    resetSpear(enemy);
    resetSpearUI();
    stopSpearControlUI();
    delete enemy.spear;
  }
      
  decayBleedStacks(enemy);
      
  decayArmorBreakStacks(enemy);
      
  if (enemy.status.slowEnd && now >= enemy.status.slowEnd) {
    clearEnemySlow(enemy, state.slotIndex);
  }

  if (enemy.status.stunEnd && now >= enemy.status.stunEnd) {
    clearEnemyStun(enemy, state.slotIndex);
  }

  // === STUN ===
  if (enemy.status.stun) {
    delta = 0;
  }

  // === SLOW ===
  let timeScale = 1;
  if (enemy.status.slow) {
    timeScale *= enemy.status.slow / 100 || 0.5;
  }

  if (enemy.spear) {
    timeScale *= (1 - enemy.spear.slow);
  }
      
  delta *= timeScale;

  state.remaining -= delta;

  // ======================
  // COOLDOWN PHASE
  // ======================
  if (state.phase === "cooldown") {
   
    enemy.canBeInterrupted = false;
    
    const progress = 1 - state.remaining / state.baseCooldown;
    updateCooldownBar(enemy, progress * 100, state.slotIndex);
        
    if (state.remaining <= 0) {
          
      rollEnemyIntent(enemy);

      state.phase = "windup";
      state.remaining = enemy.windupDuration;
          
      let windup = enemy.windupDuration;

      if (enemy.spear) {
        windup += enemy.spear.windupBonus;
      }
          
      /*if(enemy.intent === `heavy`) {
        //triggerSlowMo(0.35, 300);
        slowMoAlert();
      }*/
          
      //state.remaining = windup;
          
      updateCooldownBar(enemy, 100, state.slotIndex);

      state.result = executeEnemyIntent(enemy);
      const player = gameState.char;

      if(gameState.combat.playerBlock.mode === "timed" && !perfectBlockTimingActive) {
        if (intentDealsAttack(enemy.intent) && state.result.type === "action") {
           //console.error(`enemy action attack`);
           setTimeout(() => {
             activateTimedBlock();
           }, 200);
        }
      }             
          
      emitEnemyAttackWindup({
        enemy,
        slotIndex: state.slotIndex,
        duration: state.windupDuration
      });
    }
  }

  // ======================
  // WINDUP PHASE
  // ======================
  else if (state.phase === "windup") {
        
    //console.error(`state.remaining windup`, state.remaining);  
                 
    if (state.remaining <= 0 ) {
          
      //let dmgMultiplier = 1;
          
      //const result = executeEnemyIntent(enemy);
          
      /*if (enemy.intent) {
        dmgMultiplier = executeEnemyIntent(enemy);
      }*/
          
      if (intentDealsAttack(enemy.intent) && state.result.type === "action" && !gameState.combat.flags.isBlocked) {
        //console.error(`dmgMultiplier`, state.result.dmgMultiplier);
        
        performIntentAttack(enemy, state.slotIndex, {multiplier: state.result.dmgMultiplier});
        
        stopTimedBlockUI();
      } 
          
      gameState.combat.flags.isBlocked = false;
          
      //performEnemyAttack(enemy, state.slotIndex, { multiplier: dmgMultiplier });
          
      //enemy.canBeInterrupted = false;
          
      state.phase = "cooldown";
      state.remaining = state.baseCooldown;
          
      if(state.result.type === "utility"){
        state.phase = "action";
        state.remaining = state.result.duration;
      }
          
      //console.error(`state.phase windup, result.type`, state.phase, result.type);    
    
      updateCooldownBar(enemy, 0, state.slotIndex);
      //startAnimation(enemy, state.baseCooldown, state.slotIndex);
    }
  }
      
  // ======================
  // ACTION PHASE
  // ======================
  else if (state.phase === "action") {
    //console.error(`state.phase action`, state.phase, state.remaining);    
    if(state.remaining <= 0) {
          
      if(enemy.intent === "guard") {
         enemy.isGuarding = false;
         enemy.guardCounter = true;
      }
          
      if(enemy.intent === "charge"){
          enemy.isCharged = true;
          //enemy.isCharging = false;
      }
          
      //console.error(`state.phase remainig`);    
      enemy.intent = null;
  
      state.phase = "cooldown";
      state.remaining = getEnemyNextCooldown(enemy, state);
          
      updateCooldownBar(enemy, 0, state.slotIndex);

    }
  }
}

function getEnemyNextCooldown(enemy, state) {
  let cd = state.baseCooldown;

  if (enemy.isCharging) {
    cd *= 0.65;
    enemy.isCharging = false;
  }

  return cd;
}

function performIntentAttack(enemy, slotIndex, options = {}) {

  let finalMultiplier = options.multiplier || 1;

  // bonus po charge
  if (enemy.isCharged) {
    finalMultiplier *= 2;
    enemy.isCharged = false;
    
    showEnemyOutcome("miss", `${t("ram_outcome")}`, 1200);
  }

  if(enemy.guardCounter){
   finalMultiplier *= 1.2;
   enemy.guardCounter = false;
  }
      
  performEnemyAttack(enemy, slotIndex, {
    multiplier: finalMultiplier
  });
}

function updateBleed(delta) {
  if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;

  if(!enemy?.bleed?.duration) return; 
      
  if (!enemy || !enemy.bleed || enemy.currentHp <= 0 || !gameState.world.inCombat) return;

  const bleed = enemy.bleed;

  bleed.timer += delta;

  let totalBleedDamage = 0;

  if (bleed.timer >= bleed.tickRate) {
    bleed.timer -= bleed.tickRate;

    totalBleedDamage = bleed.stacks * bleed.damage;

    bleed.duration -= bleed.tickRate;
  }

   //console.error(`totalBleedDamage`, totalBleedDamage);   
      
  if (totalBleedDamage > 0) {
    dealBleedDamage(enemy, totalBleedDamage, gameState.world.selectedSlotIndex);
  }

  // 🔥 CLEANUP
  if (bleed.duration <= 0) {
    clearBleed(enemy);
  }
}

function clearBleed(enemy) {
  enemy.bleed = null;
  updateStatusEnemyUI(enemy);
 // console.log("BLEED CLEARED");
}

function dealBleedDamage(enemy, damage, index) {
  const prevHp = enemy.currentHp;

  //enemy.currentHp -= Math.floor(damage);
  enemy.currentHp -= Math.ceil(damage);
      
 // console.log("BLEED damage", damage);
  
  if (enemy.currentHp <= 0) {
    clearBleed(enemy);
    enemy.currentHp = 0;
    exitCombat();
    hideFleeButton();
    winCombat();
    stopEnemyAttack(gameState.world.selectedSlotIndex); // linia czasu wroga – STOP
  }
      
  updateStatusEnemyUI(enemy);
      
  // 🔥 natychmiastowy update (bez animacji)
  updateEnemyHealthBar(enemy, index);

  // 🔥 floating damage (opcjonalnie)
    showEnemyDamage({
      damage: Math.ceil(damage),
      isBleed: true
    });
}

function updateStatusEnemyUI(enemy) {
  const container = document.getElementById(`enemy-status-container-${gameState.world.selectedSlotIndex}`);
      
  if(!container) return;  
      
  const activeStatuses = new Set();

  if (enemy.bleed && enemy.bleed.duration > 0) {
    activeStatuses.add("bleed");
  
    let el = container.querySelector(".enemy-status.bleed");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status bleed";

      const bleedIconUrl = assetManager.getResolvedAsset("img/icons/bleed-icon.png");

      const icon = document.createElement("img");
      icon.src = `${bleedIconUrl}`;

      const stacks = document.createElement("span");
      stacks.className = "stacks";

      el.appendChild(icon);
      el.appendChild(stacks);
      container.appendChild(el);
    }

    el.querySelector(".stacks").textContent = `x${enemy.bleed.stacks}`;
  }
      
  if (enemy.armorBreak && enemy.armorBreak.duration > 0) {
    activeStatuses.add("armor-break");
        
    let el = container.querySelector(".enemy-status.armor-break");

    if (!el) {
      el = document.createElement("div");
      el.className = "enemy-status armor-break";

      const armorBreakIconUrl = assetManager.getResolvedAsset("img/icons/armor-break-icon.png");

      const icon = document.createElement("img");
      icon.src = `${armorBreakIconUrl}`;

      el.appendChild(icon);
      container.appendChild(el);
    }
  }
       
  [...container.children].forEach(child => {
    const type = [...child.classList].find(c => c !== "enemy-status");

    if (!activeStatuses.has(type)) {
      child.remove();
    }
  });
      
}

function updateArmorBreak(delta) {
  if (gameState.world.selectedSlotIndex === null) return;

  const enemy = gameState.world.exploreOptions[gameState.world.selectedSlotIndex]?.enemyData;
      
  if (!enemy?.armorBreak) return;

  enemy.armorBreak.duration -= delta;

  if (enemy.armorBreak.duration <= 0) {
    enemy.armorBreak.value = 0;
    updateStatusEnemyUI(enemy); 
  }
}

/*function spawnHitEffect(type, targetEl) {
  const effect = document.createElement("img");

  effect.className = "hit-effect";
  effect.src = `${ASSET_BASE}img/vfx/${type}.png`;

  targetEl.appendChild(effect);

  setTimeout(() => {
    effect.remove();
  }, 300);
}*/

function updateCooldownBar(enemy, percent, slotIndex) {
  if (gameState.combat.flags.enemyFinisherActive) return;
      
  const fill = document.getElementById(`enemy-cooldown-fill-${slotIndex}`);
  //const fill = enemy.dom.cooldownFill;
  if (!fill) return;

  //fill.style.transition = "none";
  //fill.style.width = `${percent}%`;
  fill.style.transform = `scaleX(${percent / 100})`;
      
  //const enemy = world.exploreOptions[slotIndex]?.enemyData;
  //fill.classList.toggle("stun", !!enemy?.status?.stun);
  //fill.classList.toggle("slow", !!enemy?.status?.slow);
      
  if (enemy?.status?.stun) {
    fill.classList.add('stun');
    fill.classList.remove('slow');
  } else if (enemy?.status?.slow) {
    fill.classList.add('slow');
    fill.classList.remove('stun');
  } else {
    fill.classList.remove('slow', 'stun');
  }
}

function weightedPick(weights) {
  const entries = Object.entries(weights).filter(([_, v]) => v > 0);

  const total = entries.reduce((sum, [_, value]) => sum + value, 0);

  if (total <= 0) return "attack";

  let roll = Math.random() * total;

  for (const [key, value] of entries) {
    roll -= value;
    if (roll <= 0) return key;
  }

  return "attack";
}


function rollEnemyIntent(enemy) {
  const now = performance.now();

  // ---------------------------------
  // BAZOWE WAGI
  // ---------------------------------
  let weights = {
    attack: 50,
    heavy: 20,
    guard: 15,
    charge: 15
  };

  // ---------------------------------
  // INFO O GRACZU
  // ---------------------------------
  const style = gameState.combat.activeRingMode || "none";

  const lowHp = enemy.hp < enemy.maxHp * 0.30;

  // ---------------------------------
  // LOW HP = agresja
  // ---------------------------------
  if (lowHp) {
    weights.heavy += 20;
    weights.attack += 10;
    weights.guard -= 10;
  }

  // ---------------------------------
  // JEŚLI MA BUFA Z CHARGE
  // po charge ma uderzyć, nie ładować znów
  // ---------------------------------
  if (enemy.isCharged) {
    weights.attack += 30;
    weights.heavy += 20;
    weights.guard -= 10;
    weights.charge = 0;
  }

  // ---------------------------------
  // REAKCJA NA STYLE GRACZA
  // ---------------------------------

  // SPEAR = control / slow / pushback
  if (style === "spear") {
    weights.charge += 20;
    weights.heavy += 10;
    weights.guard -= 10;
  }

  // AXE = bleed pressure
  else if (style === "bleed" || style === "axe") {
    weights.guard += 20;
    weights.heavy += 10;
  }

  // SWORD = armor break
  else if (style === "armor" || style === "sword") {
    weights.guard -= 15;
    weights.attack += 10;
    weights.heavy += 10;
  }

  // HAMMER = poise interrupt
  else if (style === "poise" || style === "mace") {
    weights.heavy -= 20;
    weights.charge -= 10;
    weights.attack += 20;
    weights.guard += 10;
  }

  // ---------------------------------
  // REAKCJA NA STATUSY WROGA
  // ---------------------------------

  // mocny bleed = desperacja
  if ((enemy.bleedStacks || 0) >= 3) {
    weights.heavy += 20;
    weights.attack += 10;
  }

  // armor break = guard bez sensu
  if ((enemy.exposeStacks || 0) >= 3) {
    weights.guard = 0;
    weights.attack += 15;
  }

  // niedawno przerwany cast
  if (enemy.wasInterruptedRecently) {
    weights.heavy -= 20;
    weights.charge -= 15;
    weights.attack += 25;
  }

  // stun / freeze etc.
  if (enemy.status?.stun) {
    weights.guard += 20;
    weights.attack -= 10;
  }

  if (enemy.isCharged) {
    weights.charge = 0;
  }
      
  // ---------------------------------
  // BEZPIECZNIK
  // ---------------------------------
  Object.keys(weights).forEach(key => {
    weights[key] = Math.max(0, weights[key]);
  });

  // ---------------------------------
  // LOSOWANIE INTENCJI
  // ---------------------------------
  enemy.intent = weightedPick(weights);

  // ---------------------------------
  // CZASY
  // ---------------------------------
  switch (enemy.intent) {
    case "attack":
      enemy.windupDuration = 800;
      break;

    case "heavy":
      enemy.windupDuration = 1500;
      break;

    case "guard":
      enemy.windupDuration = 350;
      break;

    case "charge":
      enemy.windupDuration = 300;
      break;

    default:
      enemy.intent = "attack";
      enemy.windupDuration = 600;
      break;
  }

  // ---------------------------------
  // STANY TECHNICZNE
  // ---------------------------------
  enemy.intentReadyAt = now + enemy.windupDuration;
  enemy.windupStart = now;

  enemy.canBeInterrupted =
    enemy.intent === "heavy" ||
    enemy.intent === "charge";

  // reset flag po czasie
  enemy.wasInterruptedRecently = false;

  // ---------------------------------
  // DEBUG
  // ---------------------------------
  // console.log("Enemy intent:", enemy.intent, weights);
}

function executeEnemyIntent(enemy) {
  //let dmgMultiplier = 1;

  switch (enemy.intent) {

    case "attack":
      showEnemyOutcome("dodge", `${t("attack_outcome")}`, 1000);
      //dmgMultiplier = 1;
      return { type:"action", dmgMultiplier: 1 };

    case "heavy":
      showEnemyOutcome("miss", `${t("heavy_outcome")}`, 1000);
      dmgMultiplier = 1.6;
        
      return { type:"action", dmgMultiplier: 1.6 };

    case "guard":
      //showEnemyOutcome("dodge", `${t("guard_outcome")}`);

      enemy.isGuarding = true;
      /*setTimeout(() => {
        enemy.isGuarding = false;
      }, 1300);*/

      return { type:"utility", duration:1300 };

    case "charge":
      //slowMoAlert();
      showEnemyOutcome("perfect", `${t("charge_outcome")}`, 1000);
      showReward(`${t("next_strengthened_reward")}`);
 
      enemy.isCharging = true;

      return { type:"utility", duration:1000 };
  }

  return { type:"action", dmgMultiplier: 1 };
}


function tryInterruptEnemy(enemy, source) {
  if (!enemy.canBeInterrupted) return false;

 // console.error(`tryInterruptEnemy`);
      
  enemy.intent = null;
  enemy.canBeInterrupted = false;

  if (enemy.attackState) {
    enemy.attackState.phase = "cooldown";
    enemy.attackState.remaining =
      enemy.attackState.baseCooldown * 0.6;
  }

  let duration = 1000;     
      
  switch(source) {
        
      case "perfect-block":
        duration = 1600;  
        break;        
        
      case "perfect-armor":
        duration = 2400;  
        break;        

      case "perfect-spear":
        duration = 2300;  
        break;        

      case "poise-break":
        duration = 2500;  
        break;  
        
      case "stun":
        duration = 0;  
        break;        
        
  }
      
  applyVulnerable(enemy, duration);
      
  showEnemyOutcome("perfect", `${t("interrupt_outcome")}`);

  return true;
}

function cancelEnemyIntent(enemy) {
  enemy.intent = null;
  enemy.canBeInterrupted = false;
}

function intentDealsAttack(intent){
 return intent === "attack" || intent === "heavy";
}

function applyVulnerable(enemy, duration) {
  enemy.vulnerable = true;
  setTimeout(() => enemy.vulnerable = false, duration);
}

/*function showEnemyIntentUI(enemy) {
  const el = document.getElementById("enemy-intent");

  if (!el) return;

  const map = {
    attack: "⚔️",
    heavy: "💥",
    guard: "🛡️",
    charge: "⏳"
  };

  el.textContent = map[enemy.intent] || "?";
}*/

function resetEnemyAI(enemy) {
  enemy.intent = null;
  enemy.canBeInterrupted = false;
  enemy.vulnerable = false;
  enemy.isCharged = false; 
  enemy.isCharging = false;
  enemy.isGuarding = false;      
}

function performEnemyAttack(enemy, slotIndex, options = {}) {  
  //console.error(`enter perform attack`, options.multiplier);
  const expeditionLevelStats = gameState.expedition.modes[gameState.world.expeditionMode].level;
  const playerBlock = gameState.combat.playerBlock;
 // const slotName = document.getElementById("slot-name");
  const player = getPlayerStats();
  
  if (!gameState.world.inCombat || enemy.currentHp <= 0 || player.hp <= 0) {
    if(!gameState.combat.flags.isCritical) {
      stopEnemyAttack(slotIndex); // bezpieczne zakończenie
      return;
    }   
  }
      
  const multiplier = options.multiplier ?? 1;
      
  //console.warn(`combat.flags.isCritical`, gameState.combat.flags.isCritical);
      
  let dmg = applyBlock(enemy.dmg, player, enemy);
  dmg *= multiplier;
      
  //console.error(`multiplier after`, multiplier);
      
  const damageBlocked = enemy.dmg - dmg;    
  expeditionLevelStats.damageBlocked += Math.floor(damageBlocked);
    
 // console.error(`enemy dmg after block`, dmg);
  if (dmg > 0) {
    const dmgReduction = player.dmgReduction.reduction / 100;
    const reductionCooldown = player.dmgReduction.cooldown * 1000;
    //console.error(`dmgReduction, reductionDuration`, dmgReduction, reductionCooldown);

    triggerIronStance(dmgReduction, reductionCooldown); // 15% przez 2.5s
        
    if(gameState.combat.ironStance.primed) {
      showReward(`-${(gameState.combat.ironStance.reduction * 100).toFixed(0)}% ${t("iron_defense_reward")}`);
    }
        
    const stackDuration = player.stackDefense.duration * 1000;
    if(player.stackDefense.stack > 0) {    
      addArmorStack(stackDuration);
    }
        
    ({ dmg: dmg } = calculateReducedEnemyDamage(dmg, enemy, player));
        
    if(dmg <= 0) {
      playSound(`dodge`, 1, randomRange(0.95, 1.05), 0.45);
      return; 
    }
        
    //console.error(`playerBlock.lastResult in enemy attack`, playerBlock.lastResult);
    if(playerBlock.lastResult === `miss` || playerBlock.lastResult === null) {
       playHit(`player`); 
    }
        
    if (playerBlock.mode === "defensive" && playerBlock.active) {
      if(guardStacks < DEFENSIVE_GUARD_STACK_MAX) {
         guardStacks++;
         updateGuardUI(guardStacks);
      }
       if(guardStacks === 1) showReward(`${t("stack1_reward")}`);
       else if(guardStacks === 2) showReward(`${t("stack2_reward")}`);
       else showReward(`${t("stack3_reward")}`);
    }    
        
       // Napór Presja Przewaga
   // Iskra Impuls Przeciążenie
        
    playerBlock.lastResult = null;
        
    updatePlayerHp(player.hp - dmg);
        
    if(gameState.world.mode === `expedition`) {
      expeditionLevelStats.damageTaken += dmg;
    }
        
    //updatePlayerHp(player.hp - dmg);
    //console.error(`enemy dmg couldn't be zero`, dmg);

   
   // slotName.style.color = "white"
   // slotName.innerHTML = ' enemyDamage: ' + dmg;
  } 
      
  if (gameState.char.hp <= 0 && !gameState.combat.flags.isCritical) {
    enterCriticalState();
  }
      
}

function stopEnemyAttack(slotIndex) {
  const fill = document.getElementById(`enemy-cooldown-fill-${slotIndex}`);
  const enemy = gameState.world.exploreOptions[slotIndex]?.enemyData;
  //const fill = enemy.dom.cooldownFill;

  /*console.warn("STOP ENEMY ATTACK CALLED", {
    stun: enemy?.status?.stun,
    paused: enemyAttackTimeline?.isPaused,
    running: enemyAttackTimeline?.isRunning
  });*/
      
  if (enemyAttackTimeline) {
    enemyAttackTimeline.isRunning = false;
    //cancelAnimationFrame(enemyAttackTimeline.rafId);
  }

  // Zatrzymaj animację jelly
  if (enemy?.animations?.jelly && typeof enemy.animations.jelly.cancel === "function") {
    enemy.animations.jelly.cancel();
    delete enemy.animations.jelly;
  }
      
  combatStarted = false;

  // Reset cooldown bara
  const percent = (enemyAttackTimeline.elapsed / enemyAttackTimeline.duration) * 100;
  //updateCooldownBar(percent, 0, slotIndex);
  updateCooldownBar(enemy, percent, slotIndex);

  //if(fill) void fill.offsetWidth;
  //updateCooldownBar(0, 500, slotIndex);
  updateCooldownBar(enemy, 0, slotIndex);
 
 // Reset wyglądu paska (usuń klasy i ustaw do domyłu)
  if (fill) {
    enemy.status.slow = 0;
    enemy.status.stun = 0;
    fill.classList.remove('slow', 'stun');
    /*fill.style.transition = 'none';
    fill.style.width = '100%';
    // wymuś reflow, potem ustaw transition z powrotem jeśli chcesz
    void fill.offsetWidth;
    // opcjonalnie przywróć domyślny transition (lub pozostaw, zależnie co używasz)
    fill.style.transition = '';*/
        
    fill.style.transition = "none";
    fill.style.transform = "scaleX(1)";
    requestAnimationFrame(() => {
      fill.style.transition = "";
    });
        
  }
      
  //console.log("==> Stop enemy attack + jelly");
}

function setEnemyAttackSpeed(enemy, multiplier, slotIndex) {
  const timeline = enemyAttackTimeline;

  enemy.status.currentSpeedMultiplier = multiplier;
  timeline.speed = multiplier;

  // 🔒 JEŚLI JESTEŚMY W WIND-UPIE → NIE DOTYKAMY COOLDOWNU
  if (enemy.attackState?.phase === "windup") {
    changeSpeedAnimation(enemy, multiplier);
    return;
  }

  // === COOLDOWN ===
  const cooldown = calculateCooldown(enemy.atkSpd) * 1000;
  const progress = timeline.elapsed / timeline.duration;

  timeline.duration = cooldown / timeline.speed;
  timeline.elapsed = progress * timeline.duration;

  changeSpeedAnimation(enemy, multiplier);

  if (!timeline.isPaused) {
    resumeAnimation(enemy);
    //resumeEnemyCooldownBar(slotIndex);
  }
}

function startAnimation(enemy, durationMs, slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

  // Jeśli była stara animacja, zatrzymaj ją
  if (enemy.animations?.jelly) {
    enemy.animations.jelly.cancel();
  }

  const jelly = enemySlot.animate([
    { transform: "scale(1)", offset: 0 },
    { transform: "scale(1.1, 0.9)", offset: 0.15 },
    { transform: "scale(0.9, 1.1)", offset: 0.3 },
    { transform: "scale(1.05, 0.95)", offset: 0.45 },
    { transform: "scale(0.97, 1.03)", offset: 0.6 },
    { transform: "scale(1.02, 0.98)", offset: 0.75 },
    { transform: "scale(1)", offset: 1 }
  ], {
    duration: durationMs,
    iterations: 1, // tylko jeden cykl na cooldown
    easing: "linear"
  });

  enemy.animations = enemy.animations || {};
  enemy.animations.jelly = jelly;

  // opcjonalnie: po zakończeniu usuń referencję
  jelly.onfinish = () => {
    delete enemy.animations.jelly;
    enemySlot.style.transform = "scale(1)";
  };
}

function pauseAnimation(enemy) {
  if (enemy.animations?.jelly) {
    enemy.animations.jelly.pause();
  }
}

function resumeAnimation(enemy) {
  if (enemy.animations?.jelly) {
    enemy.animations.jelly.play();
  }
}

function deathAnimation(enemySlot) {
   //const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
   enemySlot.classList.add(`enemy-death`);
}


function changeSpeedAnimation(enemy, multiplier) {
  //console.log("multiplier change speed", multiplier);
  enemy.animations?.jelly?.updatePlaybackRate(multiplier);
}

function playEnemyHitAnimation(enemy, slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

  const hitAnimation = enemySlot?.animate([
    { transform: "translateX(0px)", filter: "brightness(1)", offset: 0 },
    { transform: "translateX(-6px)", filter: "brightness(1.5)", offset: 0.2 },
    { transform: "translateX(6px)", filter: "brightness(1.5)", offset: 0.4 },
    { transform: "translateX(-4px)", filter: "brightness(1.2)", offset: 0.6 },
    { transform: "translateX(4px)", filter: "brightness(1.1)", offset: 0.8 },
    { transform: "translateX(0px)", filter: "brightness(1)", offset: 1 }
  ], {
    duration: 250,
    iterations: 1,
    easing: "ease-out"
  });

  const bleedAnimation = enemySlot?.animate([
    { boxShadow: "0 0 0px rgba(255,0,0,0)", offset: 0 },
    { boxShadow: "0 0 15px rgba(255,0,0,0.8)", offset: 0.3 },
    { boxShadow: "0 0 10px rgba(255,0,0,0.4)", offset: 0.6 },
    { boxShadow: "0 0 0px rgba(255,0,0,0)", offset: 1 }
  ], {
    duration: 250,
    iterations: 1,
    easing: "ease-out"
  });
      
  // Zapisz lub nie – to krótka animacja, więc zwykle nie trzeba
  enemy.animations = enemy.animations || {};
  enemy.animations.hit = hitAnimation;
  enemy.animations.bleed = bleedAnimation;
}


function resetAnimation(slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  enemySlot.style.animation = "none";
  void enemySlot.offsetWidth; // Force reflow
  enemySlot.style.animationName = "jelly-wobble";
  enemySlot.style.animationDuration = "2000ms";
  enemySlot.style.animationIterationCount = "infinite";
  enemySlot.style.animationTimingFunction = "linear";
  enemySlot.style.animationPlayState = "running";
}


/*function getRandomEnemyLevel(playerLevel) {
  const min = Math.max(1, playerLevel);
  const max = playerLevel + 2;

  const weights = [];
  for (let lvl = min; lvl <= max; lvl++) {
    // Im bliżej gracza lub niżej, tym większa waga
    const weight = 1 / Math.abs(lvl - playerLevel + 0.5); 
    weights.push({ level: lvl, weight });
  }

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const rand = Math.random() * totalWeight;

  let acc = 0;
  for (const { level, weight } of weights) {
    acc += weight;
    if (rand <= acc) return level;
  }

  return playerLevel; // fallback
}*/

function getRandomEnemyLevel(playerLevel) {

  if (playerLevel === 1) return 1;

  const min = playerLevel;
  const max = playerLevel === 2
    ? playerLevel + 1
    : playerLevel + 2;

  const weights = [];

  for (let lvl = min; lvl <= max; lvl++) {
    const weight = 1 / Math.abs(lvl - playerLevel + 0.5);
    weights.push({ level: lvl, weight });
  }

  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const rand = Math.random() * totalWeight;

  let acc = 0;
  for (const { level, weight } of weights) {
    acc += weight;
    if (rand <= acc) return level;
  }

  if (gameState.world?.mode === "expedition") {
    const runLevel = gameState.world.expeditionLevel || 1;
    if (runLevel > 5) {
      const bonus = Math.floor(runLevel / 5);
      playerLevel += bonus;
    }
  }
      
  return playerLevel;
}

function applyExpeditionScaling(enemy, mode) {
  if (mode !== "expedition") return;

  const run = gameState.world.expeditionLevel;

  const hpBonus = run * 0.03;
  const dmgBonus = run * 0.02;
  const defBonus = run * 0.025;

  enemy.hp *= (1 + hpBonus);
  enemy.dmg *= (1 + dmgBonus);
  enemy.def *= (1 + defBonus);
      
  return enemy;  
}

function getRandomEnemyKey(locationName) {
  //console.log("🌍 getRandomEnemyKey() dla lokacji:", locationName);

  const pool = enemyPools[locationName];
  if (!pool || pool.length === 0) {
   // console.warn("⚠️ Brak puli wrogów dla lokacji:", locationName);
    return "wolf"; // fallback
  }

  const filtered = pool.filter(k => k !== "mini_boss" && k !== "boss");
  const randomKey = filtered[Math.floor(Math.random() * filtered.length)];

  //console.log("🎯 Wylosowany wróg:", randomKey);
  return randomKey;
}

/*function getRandomEnemyKey(regionId) {
  console.log("regionId", regionId);
  const pool = enemyPools[regionId] || [];
  const filtered = pool.filter(k => k !== "miniBoss" && k !== "boss");
  if (filtered.length === 0) return null;
  return filtered[Math.floor(Math.random() * filtered.length)];
}*/


function scaleEnemyStats(template, level, forcedType, isStoryEnemy) {
  let multiplier = !isStoryEnemy ? 1 + 0.75 * (level - 1) : 1;
  //console.error("enemy with feather", template.name, level, multiplier, isStoryEnemy);

  if (gameState.world.mode === "expedition" && forcedType === `mini_boss`) {
    const level = gameState.world.expeditionLevel;
    multiplier = 1 + level * 0.2;
  }
      
  return {
    key: forcedType, // jawnie przekazany typ
    name: `${template.name}`,
    level,
    type: template.type,
    maxHp: Math.round(template.maxHp * multiplier),
    currentHp: Math.round(template.maxHp * multiplier),
    dmg: Math.round(template.dmg * multiplier),
    def: Math.round(template.def * multiplier),
    atkSpd: template.atkSpd,
    baseExp: template.baseExp,  
    sprite: template.sprite,
    isDead: false, 
    beforeDeath: false,
    lastSeen: null,
    intent: null,
    intentReadyAt: 0,
    windupStart: 0,
    windupDuration: 600,
    canBeInterrupted: false,
    vulnerable: false,
    isGuarding: false,   
    isCharging: false,
    isCharged: false,   
    guardCounter: false,
    wasInterruptedRecently: false,
    state: "normal",
    poise: 100,  
    maxPoise: 100,
    poiseRegenRate: 5,
    poiseBroken: false,
    hpAtLeave: 0,
    lastCombatTimestamp: 0,
    exposeStacks: 0,
    armorBreakReady: false,
    lastArmorBreakHit: null,
    hitAfterResolve: false,
    bleedStacks: 0,
    lastBleedHit: null,
    bleedReady: false,
    bleed: { 
      stacks: 0,
      damage: 0,
      duration: 0,
      tickRate: 1,
      timer: 0
    },
    spearReady: false,
    spear: {
      stacks: 0,
      slow: 0,
      windupBonus: 0,
      pushback: 0,
      expiresAt: 0
    },
    armorBreak: {
      value: 0,
      duration: 0
    },
    regen: {
      fromHp: 0,
      startTime: 0
    },
    __stepIndex: 0,
    __slotIndex: 0,
    hpAtLastCombat: null,
    enemyContent: "",
    dom: {
       slot: null,
       healthBar: null,
       healthFill: null,
       healthText: null,
       cooldownFill: null
    },  
    isStoryEnemy: isStoryEnemy,
    questId: template.questId,
    _slowTimeout: 0,
    slowUntil: 0,
    animations: {},
    finisherTimeout: null,
    attackState: {
      phase: "cooldown", // "cooldown" | "windup"
      remaining: 0,       // ms pozostałe w aktualnej fazie
      result: null
    },
    status: {
      stunned: false,
      stunDuration: 0,
      slow: 0,
      slowDuration: 0,
      stunRemaining: 0,
      stunEnd: null,
      stunStart: null,
      slowRemaining: 0,
      slowEnd: null,
      isStunned: false,
      pausedElapsed: 0,
      pausedPercent: 0,
      pausedRemaining: 0,
      multiplier: 0,
      remaining: 0,
      end: 0
    }
  };
}

/*function generateEnemy(playerLevel, isStoryEnemy) {
  const saved = localStorage.getItem("battleState");
  if (!saved) return null;

  const st = JSON.parse(saved);
  const locations = Object.keys(enemyPools);
  const locationName = locations[st.currentLevel - 1] || locations[0]; // 🟡 konwersja numeru poziomu → nazwa lokacji

   console.log(`location name generate enemy`, locationName);   
  const randomKey = getRandomEnemyKey(locationName);
  const baseTemplate = enemyBase[randomKey];
  if (!baseTemplate) {
    console.error("❌ Brak szablonu wroga:", randomKey);
    return null;
  }

  const enemyLevel = getRandomEnemyLevel(playerLevel);
  return scaleEnemyStats(baseTemplate, enemyLevel, randomKey, isStoryEnemy);
}*/

function generateEnemy(playerLevel, isStoryEnemy = false, forcedEnemyId = null) {
  //console.error(`generateEnemy`);  
 
  const locations = Object.keys(enemyPools);
 // console.log("current level from battleState in generateEnemy:", world.currentLevel);
 // console.log("currentLocation in generateEnemy:", world.currentLocation);
  const locationName = locations[gameState.world.currentLevel - 1] || locations[0];

  const randomKey = forcedEnemyId || getRandomEnemyKey(gameState.world.currentLocation);

  const baseTemplate = enemyBase[randomKey];
  if (!baseTemplate) {
    console.error("❌ Brak szablonu wroga:", randomKey);
    return null;
  }
  
  //console.error("generate enemy with feather", baseTemplate.name, isStoryEnemy);

  const enemyLevel = getRandomEnemyLevel(playerLevel);
  return scaleEnemyStats(baseTemplate, enemyLevel, randomKey, isStoryEnemy);
}

function generateStoryEnemy(questId, playerLevel) {
  //console.error(`generateStoryEnemy`);  
 
  const template = STORY_EVENT_ENEMIES[questId];
  if (!template) {
    console.error("❌ Brak wroga fabularnego dla questa:", questId);
    return null;
  }

  // Wymuś unikalny typ klucza — aby nie korzystać z puli normalnych wrogów
  const forcedKey = template.id || questId;

  // Skaluje staty tak samo jak każdy inny wróg
  const storyEnemy = scaleEnemyStats(
    template,
    template.level,
    forcedKey,
    true // isStoryEnemy
  );

  // Można dodać nagrody, jeśli quest przewiduje
  if (template.reward) {
    storyEnemy.reward = template.reward;
  }

  return storyEnemy;
}

function generateEliteEnemy(playerLevel) {
  const location = gameState.world.currentLocation;

  const pool = ELITE_ENEMY_POOLS[location];

  if (!pool || pool.length === 0) {
    console.warn("⚠ brak elite pool dla lokacji:", location);
    return generateEnemy(playerLevel);
  }

  const key = pool[Math.floor(Math.random() * pool.length)];

  const template = enemyBase[key];

  if (!template) {
    console.error("❌ Brak template elite:", key);
    return null;
  }

  const enemyLevel = getRandomEnemyLevel(playerLevel);

  return scaleEnemyStats(template, enemyLevel, key, false);
}

/*function generateEnemy(playerLevel) {
  const saved = localStorage.getItem("battleState");
    console.log("not saved in generateEnemy");  
  if (saved) {
    const st = JSON.parse(saved);
        
    console.log("regionId in generateEnemy", st.selectedRegionId);
    const randomKey = getRandomEnemyKey(st.selectedRegionId);
    console.log("randomKey", randomKey);
    if (!randomKey) return null;
    const baseTemplate = enemyBase[randomKey];
    const enemyLevel = getRandomEnemyLevel(playerLevel);
        
    console.log("GENERATED ENEMY:", randomKey, baseTemplate, baseTemplate.maxHp);
    return scaleEnemyStats(baseTemplate, enemyLevel, randomKey);
  }   
}*/

function generateMiniboss(playerLevel, miniBossId) {
 // console.error(`miniBossId in generateMiniboss`, miniBossId);  
  const baseTemplate = enemyBase[miniBossId];
  const enemyLevel = playerLevel + 1;
  return scaleEnemyStats(baseTemplate, enemyLevel, "mini_boss", false);
}

function generateBoss(playerLevel) {
  const baseTemplate = enemyBase.boss;
  const enemyLevel = playerLevel + 2;
  return scaleEnemyStats(baseTemplate, enemyLevel, "boss", false);
}
