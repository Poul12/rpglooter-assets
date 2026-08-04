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
  
  let durationBonus = 0;
  if(gameState.char.combatAffixes[`stun_after_break`]) {
    durationBonus = gameState.char.combatAffixes[`stun_after_break`].value;
     
    //console.error(`stun durationBonus after poise break`, durationBonus);
  }
  
  const duration = 1200 + (strScale.durationBonus * 2000) + (durationBonus * 1000);
  
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
  
  if(gameState.char.combatAffixes[`dmg_after_break`]) {
     gameState.combat.poiseBonus.dmgBonus.nextHit = true;
     const gainedDmg = gameState.char.combatAffixes[`dmg_after_break`].value;
     let activeBonus = gameState.combat.activeBonus;
     //activeBonus.dmg += gainedDmg;
     //console.log(`activeBonus.dmg`, activeBonus.dmg, gainedDmg);
     //activeBonus.dmg = (activeBonus.dmg || 0) + gainedDmg;
         
     //showBuff(`dmg`, activeBonus.dmg);
     gameState.combat.activeBonus.dmgSources.afterBreak = gainedDmg;
     recalculateDamageBonus();
    
    //showPercentBuff("dmg", activeBonus.dmg);
  }

  if(gameState.char.combatAffixes[`atkspd_after_break`] && !gameState.combat.poiseBonus.atkSpdBonus.isActive) { 
    gameState.combat.poiseBonus.atkSpdBonus.expiresAt = getGameTime() + 4000;
    gameState.combat.poiseBonus.atkSpdBonus.isActive = true;
    const atkSpdBonus = gameState.char.combatAffixes[`atkspd_after_break`].value;
    gameState.combat.activeBonus.atkSpd += atkSpdBonus;
    
    updateStatusPlayerUI(enemy);
  }

  if(gameState.char.combatAffixes[`energy_after_break`]) {
    const energyGained = gameState.char.combatAffixes[`energy_after_break`].value;
    gainEnergy(energyGained);
    //showReward(`+${(energyGained).toFixed(1)} ${t("to_energy_reward")}`, 2300);
    showEnergyGain(energyGained);
  }

  if(gameState.char.combatAffixes[`stamina_after_break`]) {
    const staminaGained = gameState.char.combatAffixes[`stamina_after_break`].value;
    gainStamina(staminaGained);
    //showReward(`+${(staminaGained).toFixed(1)} ${t("stamina_on_kill_reward")}`, 2300);
    showStaminaPopup(staminaGained);
  }

  if(gameState.char.combatAffixes[`crit_after_break`]) {
    gameState.combat.poiseBonus.critBonus.expiresAt = getGameTime() + 4000;
    gameState.combat.poiseBonus.critBonus.isActive = true;
    
    const critBonus = gameState.char.combatAffixes[`crit_after_break`].value;
    gameState.combat.activeBonus.critSources.afterBreak = critBonus;
    recalculateCritBonus();
  }
  
  if(gameState.char.combatAffixes[`dmg_taken_after_break`]) {
    gameState.combat.poiseBonus.dmgTakenBonus.expiresAt = getGameTime() + 3000;
    gameState.combat.poiseBonus.dmgTakenBonus.isActive = true;
 }

  
  
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
    let pushbackBonus = 0;
    if(gameState.char.combatAffixes[`pushback`]) {
      pushbackBonus = gameState.char.combatAffixes[`pushback`].value;
    }
    //console.log(`hammer enemy.attackState.remaining total before`, enemy.attackState.remaining);
    enemy.attackState.remaining += (300 + player.str * 1.5) * (1 + (pushbackBonus / 100));
    //console.log(`hammer enemy.attackState.remaining total after`, enemy.attackState.remaining);
  }
}

function triggerInterrupt(enemy, penaltyMs = 800) {

  if (!enemy.attackState) return;

  //if (enemy.attackState.phase !== "windup") return;

  const now = performance.now();

  // cofamy do cooldown
  enemy.attackState.phase = "cooldown";

  // dodajemy karę
  let pushbackBonus = 0;
  if(gameState.char.combatAffixes[`pushback`]) {
      pushbackBonus = gameState.char.combatAffixes[`pushback`].value;
  }

  enemy.attackState.remaining += penaltyMs * (1 + (pushbackBonus / 100));
  //console.log(`break poise pushbackBonus penaltyMs`, penaltyMs * (1 + (pushbackBonus / 100)));

}

function doubleaxeOnHit(enemy, player) {
  if (!enemy.bleedStacks) enemy.bleedStacks = 0;
  
  if (enemy.bleedReady || enemy.hitAfterResolve) {
    enemy.hitAfterResolve = false;
    return;
  }
  
  gameState.combat.activeRingMode = "bleed";
  
  enemy.bleedStacks++;
  enemy.lastBleedHit = getGameTime();

  if(gameState.world.inCombat) updateBleedRing(enemy);

  /*if(!enemy.bleedReady) {
    showReward(`${t("bleed_reward")} ${enemy.bleedStacks}/3`);
  }*/
  
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
  
  //console.log(`bleedDurationBonus`, bleedDurationBonus);
  
  let baseDmg = 0.15 * (1 + strScale.effectPower / 100); // 🔥 DUŻO większe niż normal bleed
  let duration = 4 + strScale.durationBonus;

  //console.log(`duration`, duration);
  
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
  enemy.hitAfterResolve = true;
  //enemy.bleedReady = false;
}

function greatswordOnHit(enemy, player) {
  // jeśli READY → NIE dodawaj stacków
  //console.error(`enter enemy.armorBreakReady`, enemy.exposeStacks, enemy.armorBreakReady);
  
  if (enemy.armorBreakReady || enemy.hitAfterResolve) {
    enemy.hitAfterResolve = false;
    return;
  }
  
  //console.error(`enemy.armorBreakReady`, enemy.exposeStacks, enemy.armorBreakReady);
  
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
  
  let powerBonus = 1;
  if(gameState.char.combatAffixes[`armor_break_effect`]) {
    powerBonus = 1 + (gameState.char.combatAffixes[`armor_break_effect`].value / 100);
  }
  
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
    showOutcome("perfect", `${t("armor_break_outcome")} <br> -${((penetration * powerBonus) * 100).toFixed(0)}%`);
  } else if (result === "normal") {
    const penetration = 0.32 + (str * 0.001);
    const duration = 3.3 + (str * 0.01);
    
    applyArmorBreak(enemy, penetration, duration);
    triggerBleedVFX();
    resetArmorBreak(enemy);
    showOutcome("normal", `${t("armor_scrape_outcome")} -${((penetration * powerBonus) * 100).toFixed(0)}%`);
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
  enemy.hitAfterResolve = true;
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
  const slow = 0.07 + player.str * 0.00015;
  const windupBonus = 120 + player.str * 0.5;
  const pushback = 300 + player.str * 1;

 // if (!enemy.spear.stacks) enemy.spear.stacks = 0;
  
  gameState.combat.activeRingMode = `spear`;
  
  applySpearDebuff(enemy, {
    slow,
    windupBonus,
    pushback,
    duration: 3200
  });
}

function updateSpearDebuff() {
  
}

function applySpearDebuff(enemy, { slow, windupBonus, pushback, duration }) {
  if (!enemy.spear) {
    enemy.spear = {
      stacks: 0,
      slow: 0,
      windupBonus: 0,
      pushback: 0,
      expiresAt: 0,
      stackControl: 0,
    };
  }

  const player = getPlayerStats();

  const d = enemy.spear;

  let pushbackBonus = 0;
  if(gameState.char.combatAffixes[`pushback`]) {
      pushbackBonus = gameState.char.combatAffixes[`pushback`].value;
  }
  
  let slowBonus = 0;
  
  if(gameState.char.combatAffixes[`slow_enemy_per_control_stack`] && gameState.combat.controlBonus.slowBonus.isActive) {
     slowBonus = gameState.combat.controlBonus.slowBonus.accumulate;
  }
  
  //console.error(`slowBonus, stackControl`, slowBonus, d.stackControl, d.stacks);
  
  d.stacks = Math.min(3, d.stacks + 1);
  d.slow = slow * (1 + (1 * d.stackControl)) * (1 + (slowBonus / 100));
  d.windupBonus = windupBonus * (1 + (pushbackBonus / 100)) * (1 + (0.12 * d.stackControl));
  d.pushback = pushback * (1 + (pushbackBonus / 100)) * (1 + (0.20 * d.stackControl));
  d.expiresAt = getGameTime() + duration;
  
  //console.error(`spear slow, slowBonus`, d.slow, slowBonus);
  /*console.error(`spear windupBonus`, d.windupBonus);
  console.error(`spear pushback`, d.pushback);*/
  
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
  
  /*if (!enemy.spearReady) {
    showReward(`${d.stacks}x ${t("control_reward")}`);
  }*/
  
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
    extendSpearControl(enemy, 2000, true);
    tryInterruptEnemy(enemy, `perfect-spear`);
    playSound(`spear_control`, 0.4);
    
    updateStatusEnemyUI(enemy);
    
    if(gameState.char.combatAffixes[`energy_per_stack_control`]) {
      const energyGain = gameState.char.combatAffixes[`energy_per_stack_control`].value;
      gainEnergy(energyGain);
      //showReward(`+${(energyGain).toFixed(1)} ${t("to_energy_reward")}`, 2300);
      showEnergyGain(energyGain);
    }
    
    if(gameState.char.combatAffixes[`stamina_per_stack_control`]) {
      const staminaGain = gameState.char.combatAffixes[`stamina_per_stack_control`].value;
      gainStamina(staminaGain);
      //showReward(`+${(staminaGain).toFixed(1)} ${t("stamina_on_kill_reward")}`, 2300);
      showStaminaPopup(staminaGain);
    }

    if(gameState.char.combatAffixes[`dmg_per_control_stack`]) {
      const dmgGain = gameState.char.combatAffixes[`dmg_per_control_stack`].value;
      //gameState.combat.activeBonus.dmg += dmgGain;
      gameState.combat.controlBonus.dmgBonus.accumulate = dmgGain * enemy.spear.stackControl;
      gameState.combat.controlBonus.dmgBonus.isActive = true;
      //showReward(`+${(gameState.combat.controlBonus.dmgBonus.accumulate).toFixed(1)}% ${t("dmg_per_control")}`, 2300);
      //showBuff(`dmg`, gameState.combat.activeBonus.dmg);
      
      gameState.combat.activeBonus.dmgSources.controlStacks = gameState.combat.controlBonus.dmgBonus.accumulate;
      recalculateDamageBonus();
      
      //showPercentBuff("dmg", gameState.combat.activeBonus.dmg);
    }
    
    if(gameState.char.combatAffixes[`slow_enemy_per_control_stack`]) {
      const slowGain = gameState.char.combatAffixes[`slow_enemy_per_control_stack`].value;
      gameState.combat.controlBonus.slowBonus.accumulate = slowGain * enemy.spear.stackControl;
      gameState.combat.controlBonus.slowBonus.isActive = true;
      //showReward(`-${(gameState.combat.controlBonus.slowBonus.accumulate).toFixed(1)}% ${t("slow_per_control")}`, 2300);
    }

    if(gameState.char.combatAffixes[`crit_per_control_stack`]) {
      const critGain = gameState.char.combatAffixes[`crit_per_control_stack`].value;
      gameState.combat.controlBonus.critBonus.accumulate = critGain * enemy.spear.stackControl;
      gameState.combat.controlBonus.critBonus.isActive = true;
      //showReward(`+${(gameState.combat.controlBonus.critBonus.accumulate).toFixed(1)}% ${t("crit_per_control")}`, 2300);
      
      gameState.combat.activeBonus.critSources.controlStacks = gameState.combat.controlBonus.critBonus.accumulate;
      recalculateCritBonus();
    }
    
    if(gameState.char.combatAffixes[`armor_break_after_3control_stack`] && enemy.spear.stackControl >= 3) {
      const value = gameState.char.combatAffixes[`armor_break_after_3control_stack`].value;
      const armorBreakBonus = value / 100;
      applyArmorBreak(enemy, armorBreakBonus, 4);

      let powerBonus = 1;
      if(gameState.char.combatAffixes[`armor_break_effect`]) {
        powerBonus = 1 + (gameState.char.combatAffixes[`armor_break_effect`].value / 100);
      }
      
      //showReward(`-${(value * powerBonus).toFixed(1)}% ${t("break_defense_reward")}`, 2300);
    }

    //const enemySlot = document.getElementById(`enemy-slot-${gameState.world.selectedSlotIndex}`);
    //slowAnimation(enemySlot, enemy, 2000);
    
    //showOutcome("perfect", `${enemy.spear.slow}x ${t("control_outcome")}!`);
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

function extendSpearControl(enemy, duration, perfect = false) {
  if (!enemy.spear) return;

  enemy.spear.expiresAt += duration;
  if(perfect) {
    enemy.spear.stackControl = Math.min(5, (enemy.spear.stackControl || 0) + 1);
    //else if() enemy.spear.stackControl = 0;
  
    const segmentsContainer = document.getElementById("combat-control-meter");
    const segments = document.querySelectorAll("#combat-control-meter .segment");

    segmentsContainer.classList.remove(`hidden`);
  
    requestAnimationFrame(() => {
      segmentsContainer.classList.add(`show`);
    });
  
    segments.forEach((segment, index)=>{
      segment.classList.toggle("active", index < enemy.spear.stackControl);
    });
  }
  
}

function reduceSpearControl(enemy) {
  if (!enemy.spear) return;

  enemy.spear.stacks = Math.max(0, enemy.spear.stacks - 1);
  enemy.spear.stackControl = 0;
  
  const segmentsContainer = document.getElementById("combat-control-meter");
  segmentsContainer.classList.add(`hidden`);
    
  requestAnimationFrame(() => {
    segmentsContainer.classList.remove(`show`);
  });
 
  
   if(gameState.char.combatAffixes[`dmg_per_control_stack`] && gameState.combat.controlBonus.dmgBonus.isActive) {
      //decreaseBonusDmgBuff(gameState.combat.controlBonus.dmgBonus.accumulate);
      gameState.combat.controlBonus.dmgBonus.accumulate = 0;
      gameState.combat.controlBonus.dmgBonus.isActive = false;
     
      gameState.combat.activeBonus.dmgSources.controlStacks = 0;
      recalculateDamageBonus();
     
      clearAllDiffs(`dmg`);
   }
  
   if(gameState.char.combatAffixes[`slow_enemy_per_control_stack`] && gameState.combat.controlBonus.slowBonus.isActive) {
     gameState.combat.controlBonus.slowBonus.accumulate = 0;
     gameState.combat.controlBonus.slowBonus.isActive = false;
   }

  if(gameState.char.combatAffixes[`crit_per_control_stack`] && gameState.combat.controlBonus.critBonus.isActive) {
     gameState.combat.controlBonus.critBonus.accumulate = 0;
     gameState.combat.controlBonus.critBonus.isActive = false;
    
     gameState.combat.activeBonus.critSources.controlStacks = 0;
     recalculateCritBonus();
   }

    
}

function resetSpear(enemy) {
  if (gameState.combat.activeRingMode !== `spear`) return;
  
  if(enemy.spear?.stacks) {
    enemy.spear.stacks = 0;
  }  
  
  if(enemy.spear?.stackControl) {
    enemy.spear.stackControl = 0;
    
    const segmentsContainer = document.getElementById("combat-control-meter");
    segmentsContainer.classList.add(`hidden`);
    
    requestAnimationFrame(() => {
      segmentsContainer.classList.remove(`show`);
    });
    
  }
  
  if(gameState.char.combatAffixes[`dmg_per_control_stack`] && gameState.combat.controlBonus.dmgBonus.isActive) {
    gameState.combat.controlBonus.dmgBonus.accumulate = 0;
    gameState.combat.controlBonus.dmgBonus.isActive = false;
    gameState.combat.activeBonus.dmgSources.controlStacks = 0;
    recalculateDamageBonus();
  }

  if(gameState.char.combatAffixes[`slow_enemy_per_control_stack`] && gameState.combat.controlBonus.slowBonus.isActive) {
    gameState.combat.controlBonus.slowBonus.accumulate = 0;
    gameState.combat.controlBonus.slowBonus.isActive = false;
  }
  
  if(gameState.char.combatAffixes[`crit_per_control_stack`] && gameState.combat.controlBonus.critBonus.isActive) {
     gameState.combat.controlBonus.critBonus.accumulate = 0;
     gameState.combat.controlBonus.critBonus.isActive = false;
    
     gameState.combat.activeBonus.critSources.controlStacks = 0;
     recalculateCritBonus();
   }

  updateStatusEnemyUI(enemy);
  
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
  
  enemy.lastComboHit = getGameTime();

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

  enemy.lastComboHit = getGameTime();
  
  let pushbackBonus = 0;
  if(gameState.char.combatAffixes[`pushback`]) {
    pushbackBonus = gameState.char.combatAffixes[`pushback`].value;
  }
  
  enemy.attackState.remaining += 150 * (1 + (pushbackBonus / 100));
  
  if(gameState.world.inCombat) updateGuardRing("mace", stats.combo);
  
  if (stats.combo >= 2) {
    stats.comboReady = true;
  }
}

function axeOnHit(enemy) {
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
  
  gameState.combat.activeRingMode = `axe`;
  
  stats.combo = (stats.combo || 0) + 1;
  
  enemy.lastComboHit = getGameTime();
  
  if(gameState.world.inCombat) updateGuardRing("axe", stats.combo);
   
  if (stats.combo >= 2) {
    stats.comboReady = true;
  }
  
  /*resetGuardRing();
  triggerRingPulse("axe");*/
  
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

  enemy.lastComboHit = getGameTime();
  
  if(gameState.world.inCombat) updateGuardRing("sword", stats.combo);
  
  if (stats.combo >= 3) {
    stats.combo = 0;
    //stats.comboReady = true;
    stats.nextHitPenetration = 0.25;
    
    if(enemy.isGuarding) {
      stats.nextHitPenetration = 0.15;
    } 
    
    let powerBonus = 1;
    if(gameState.char.combatAffixes[`armor_break_effect`]) {
      powerBonus = 1 + (gameState.char.combatAffixes[`armor_break_effect`].value / 100);
    }
    
    applyArmorBreak(enemy, stats.nextHitPenetration, 4);
    
    /*if(enemy.isGuarding) {
      showReward(`${t("break_defense_reward")} -${((stats.nextHitPenetration * powerBonus) * 100).toFixed(0)}%`);
    } else {
      showReward(`${t("break_defense_reward")} -${((stats.nextHitPenetration * powerBonus) * 100).toFixed(0)}%`);
    }*/
   
    
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

function getArmorWithBonus(baseArmor, defBonus) {
  if (!gameState.world.inCombat) return;

  const blockBonus = gameState.combat.perfectBlockBonus;    
  
  if (getGameTime() > blockBonus.defBonus.expiresAt) {
     //console.log(`blockBonus.defBonus.expiresAt getArmor`, blockBonus.defBonus.expiresAt);
     blockBonus.defBonus.isActive = false;
     blockBonus.defBonus.expiresAt = 0;
     return baseArmor;
  }

  return baseArmor * (1 + (defBonus / 100));
}

function getArmorWithBonusWhileBlock(baseArmor, defBonus) {
  if (!gameState.world.inCombat) return;

  const blockingBonus = gameState.combat.blockingBonus;    
  
  if(blockingBonus.defBonus.isActive) {
    return baseArmor * (1 + (defBonus / 100));
  }
  
  return baseArmor;
}

function updateCombatBuff() {
  //if (!gameState.world.inCombat) return;

  const blockBonus = gameState.combat.perfectBlockBonus;    
  
  if(gameState.combat.blockingBonus.defBonus.isActive) {
    return;
  }
  
  if(!blockBonus.defBonus.isActive) {
    return;
  }
  
  if (getGameTime() > blockBonus.defBonus.expiresAt) {
   // console.log(`blockBonus.defBonus.expiresAt update`, blockBonus.defBonus.expiresAt);
    blockBonus.defBonus.isActive = false;
    blockBonus.defBonus.expiresAt = 0;
    const value = gameState.char.combatAffixes["perfect_block_gain_def"].value;
    //decreaseBonusDefBuff(value);
  
    gameState.combat.activeBonus.defSources.perfectBlock = 0;
    recalculateDefenseBonus();

    clearAllDiffs(`def`);
  }

}

function getCritWithBonus(rawCrit, critBonus) {
  if (!gameState.world.inCombat) return;

  const dodgeBonus = gameState.combat.dodgeBonus;    
  
  if (getGameTime() > dodgeBonus.critBonus.expiresAt) {
     dodgeBonus.critBonus.isActive = false;
     dodgeBonus.critBonus.expiresAt = 0;
     
     return rawCrit;
  }

  return rawCrit + critBonus;
}

function updateCritBonusStatus() {
  
  if (!gameState.world.inCombat) return;

  const poiseBonus = gameState.combat.poiseBonus;    
  
  if (getGameTime() > poiseBonus.critBonus.expiresAt) {
    gameState.combat.activeBonus.critSources.afterBreak = 0;
    recalculateCritBonus();
  }

  
  
  const dodgeBonus = gameState.combat.dodgeBonus;    
  
  if (getGameTime() > dodgeBonus.critBonus.expiresAt) {
     gameState.combat.activeBonus.critSources.dodge = 0;
     recalculateCritBonus();
  }
  
  
  
  
}


function getCritWithBonusAfterBreak(rawCrit, critBonus) {
  if (!gameState.world.inCombat) return;

  const poiseBonus = gameState.combat.poiseBonus;    
  
  if (getGameTime() > poiseBonus.critBonus.expiresAt) {
     poiseBonus.critBonus.isActive = false;
     poiseBonus.critBonus.expiresAt = 0;
     
     return rawCrit;
  }

  return rawCrit + critBonus;
}


function getDodgeWithBonus(baseDodge, bonusDodge) {
  if (!gameState.world.inCombat) return;

  const critBonus = gameState.combat.critBonus;
  
  if(getGameTime() > critBonus.dodgeBonus.expiresAt) {
    critBonus.dodgeBonus.isActive = true;
    critBonus.dodgeBonus.expiresAt = 0;
    return baseDodge;
  }
  
  return baseDodge + bonusDodge;
}

function getReducedStaminaCost(baseCost, reducedCost) {
  if (!gameState.world.inCombat) return;

  const dodgeBonus = gameState.combat.dodgeBonus;
  
  if(getGameTime() > dodgeBonus.staminaBonus.expiresAt) {
    dodgeBonus.staminaBonus.isActive = true;
    dodgeBonus.staminaBonus.expiresAt = 0;
    return baseCost;
  }
  
  return baseCost * reducedCost;
}


function getReducedDamageAfterBreak(baseDmg, reducedDmg) {
  if (!gameState.world.inCombat) return;

  const poiseBonus = gameState.combat.poiseBonus;
  
  if(getGameTime() > poiseBonus.dmgTakenBonus.expiresAt) {
    poiseBonus.dmgTakenBonus.isActive = true;
    poiseBonus.dmgTakenBonus.expiresAt = 0;
    return baseDmg;
  }
  
  return baseDmg * reducedDmg;
}


function getAttackSpeedWithBonus(atkSpd) {
  //if (!gameState.world.inCombat) return;

  const poiseBonus = gameState.combat.poiseBonus;
  const dodgeBonus = gameState.combat.dodgeBonus;
  const perfectBlockBonus = gameState.combat.perfectBlockBonus;

  if(gameState.char.combatAffixes[`atkspd_after_break`] && poiseBonus.atkSpdBonus.isActive) {
    if(getGameTime() > poiseBonus.atkSpdBonus.expiresAt) {
      poiseBonus.atkSpdBonus.isActive = false;
      poiseBonus.atkSpdBonus.expiresAt = 0;
      const value = gameState.char.combatAffixes["atkspd_after_break"].value;

      decreaseBonusAtkSpdBuff(value);
    }
  } else if(gameState.char.combatAffixes[`atkspd_after_dodge`] && dodgeBonus.atkSpdBonus.isActive) {
    if(getGameTime() > dodgeBonus.atkSpdBonus.expiresAt) {
      dodgeBonus.atkSpdBonus.isActive = false;
      dodgeBonus.atkSpdBonus.expiresAt = 0;
      const value = gameState.char.combatAffixes["atkspd_after_dodge"].value;

      decreaseBonusAtkSpdBuff(value);
    }
  } else if(gameState.char.combatAffixes[`perfect_block_atkspd`] && perfectBlockBonus.atkSpdBonus.isActive) {
    if(getGameTime() > perfectBlockBonus.atkSpdBonus.expiresAt) {
      perfectBlockBonus.atkSpdBonus.isActive = false;
      perfectBlockBonus.atkSpdBonus.expiresAt = 0;
      const value = gameState.char.combatAffixes["perfect_block_atkspd"].value;

      decreaseBonusAtkSpdBuff(value);
    }
  }
  
  return atkSpd * (1 + (gameState.combat.activeBonus.atkSpd / 100));
}

function getLoH() {
  let lohValue = gameState.char.lifeOnHit;
  
  if(gameState.combat.lowHpBonus.doubleLoHActive) {
       lohValue *= 2;
    }
  
  if (gameState.combat.blockingBonus.lohBonus.isActive && gameState.char.combatAffixes[`loh_while_blocking`]) {
      const value = gameState.char.combatAffixes[`loh_while_blocking`].value;
      lohValue *= (1 + (value / 100));
      //console.error(`lohValue while blocking`, lohValue);
    }
  
  return lohValue;
}



