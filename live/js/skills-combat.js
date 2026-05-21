//const combat = gameState.combat;

/*function restoreSkillCooldowns() {
  const now = Date.now();
  for (const skillId in combat.skills.skillCooldowns) {
    console.error(`enter for in restore skills cooldown`);
    const remaining = (combat.skills.skillCooldowns[skillId] - now) / 1000;
    console.error(`remaining in restore skills cooldown`, remaining);
    if (remaining > 0) {
      startSkillCooldown(skillId, remaining, true);
    }
  }
}*/


function restoreSkillCooldowns() {
  const now = getGameTime(); // używaj tego samego czasu co przy zapisie!
  const skillCooldowns = gameState.combat.skills.skillCooldowns;

  if (!skillCooldowns) return;
 // console.error(`enter for in restore skills cooldown`);
   
  for (const skillId in skillCooldowns) {
    const endTime = skillCooldowns[skillId];
    const remainingMs = endTime - now;
    //console.error(`remainingMs in restore skills cooldown`, remainingMs);

    if (remainingMs > 0) {
      startSkillCooldown(skillId, remainingMs / 1000);
    } else {
      // cooldown minął — czyścimy
      delete skillCooldowns[skillId];
    }
  }
}

function loadSkillCooldowns() {
  const skillCooldowns = gameState.combat.skills.skillCooldowns;
  
  if(!skillCooldowns) return {};
  
  // Usuwanie przestarzałych cooldownów
  const now = getGameTime();
  Object.keys(skillCooldowns).forEach(key => {
    if (skillCooldowns[key] <= now) delete skillCooldowns[key];
  });

  return skillCooldowns;
}

function updateSkillButtonsFatigueState() {
  const fatigueUntil = getPlayerFlag("fleeFatigueUntil") || 0;
  const now = nowDateMs();
  const isFatigued = now < fatigueUntil;

  document.querySelectorAll("button.skill-button").forEach(btn => {
    if (isFatigued) {
      btn.classList.add("disabled-skill");
    } else {
      btn.classList.remove("disabled-skill");
    }
  });
}

function skillsOff() {
  document.querySelectorAll("button.skill-button").forEach(btn => {
      btn.classList.add("disabled-skill");
  });
}

function skillsOn() {
  document.querySelectorAll("button.skill-button").forEach(btn => {
      btn.classList.remove("disabled-skill");
  });
}

function handleSkillClick(button) {
 // console.error(`handleSkillClick enter`);
  const world = gameState.world;

  if (!canPerformAction(`skill`)) return;
  //console.error(`handleSkillClick enter`);
  
  const skillCooldowns = gameState.combat.skills.skillCooldowns;

  // na samym wejściu do handleSkillClick:
  const fatigueUntil = getPlayerFlag("fleeFatigueUntil") || 0;
  if (nowDateMs() < fatigueUntil) {
    updateSkillButtonsFatigueState();
    const secs = Math.ceil((fatigueUntil - nowDateMs())/1000);
    //showInfoAlert(`Jesteś zmęczony po ucieczce. Skille dostępne za ${secs}s.`);
    return;
  }
  
  //const button = e.target.closest("button.skill-button");
  if (!button) return;
  
  const skillId = button.dataset.skill;
  if (!skillId || !SKILLS_DATABASE[skillId]) return;

  const skill = SKILLS_DATABASE[skillId];
  const effectiveCost = skill.staminaCost + Math.max(0, gameState.resources.staminaState.max - 100)  * COST_SCALE;
  
  //console.error(`skill effectiveCost`, effectiveCost);
  if(!spendStamina(effectiveCost)) return;
  //console.log("Skill after spend stamina.");
 
  const now = getGameTime();
  const cooldown = (SKILLS_DATABASE[skillId].baseCooldown || 5) * 1000; // ms

  if (skillCooldowns[skillId] && now < skillCooldowns[skillId]) {
    //console.log("Skill jeszcze na cooldownie.");
    return;
  }

  skillCooldowns[skillId] = now + cooldown;
  //saveSkillCooldowns(skillCooldowns); // zapisz cooldowny
  startSkillCooldown(skillId, cooldown / 1000);
  saveGame();
  
  if (world.selectedSlotIndex !== null && world.inCombat) {
    // tryb walki – mamy cel
   // console.log("using skill on enemy");
    const enemy = world.exploreOptions[world.selectedSlotIndex].enemyData;
    const player = getPlayerStats();
    
    useSkill(skillId, player, enemy);
  } else {
    // poza walką – ale jeśli skill może działać samodzielnie, odpal go
   // console.log("using skill outside combat");
    const player = getPlayerStats();
    useSkill(skillId, player, null);
  } 
  
 // console.log("start skill cooldown");
}

function renderSkillButtons(playerLevel, start = 1, end = 6) {
  let output = "";

  for (let i = start; i <= end; i++) {
    const skillId = gameState.combat.skills.assignedSkills[i];
    const skills = gameState.combat.skills.playerSkills;
    const skill = SKILLS_DATABASE[skillId];

    if (!skill) {
      output += `
        <div class="skill-wrapper">
          <button class="skill-button empty" disabled title="Nie przypisano skilla">
            <div class="skill-icon base">⛔</div>
          </button>
        </div>
      `;
      continue;
    }

    const hasRequiredLevel = playerLevel >= skill.requiredLevel;
    const parentUnlocked = !skill.parent || (skills[skill.parent] && skills[skill.parent].unlocked);
    const isUnlocked = hasRequiredLevel && parentUnlocked;
    //console.error(`parentUnlocked, isUnlocked, skill.parent, skills[skill.parent]`, parentUnlocked, isUnlocked, skill.parent, skills[skill.parent]);
    const titleText = `${skill.name} (poziom ${skill.level})`;

    /*const cooldownOverlayHTML = `
     <div class="icon-wrapper" style="--icon: url('${ASSET_BASE}${skill.icon}')">
       <img src="${ASSET_BASE}${skill.icon}" alt="${skill.name}" class="skill-icon-img" />
       <div class="layer top" id="top-${skillId}"></div>
       <div class="layer fill" id="cd-fill-${skillId}"></div>
     </div>
    `;*/
    
    const skillIconUrl = assetManager.getResolvedAsset(skill.icon);
    
    const cooldownOverlayHTML = `
      <div class="icon-wrapper">
        <div class="skill-icon top" id="top-${skillId}">
           <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
        </div>
        <div class="skill-icon base">
           <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
        </div>
        <div class="skill-icon fill" id="cd-fill-${skillId}">
          <div class="fill-mask">
            <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
          </div>
        </div>
      </div>
    `;

    output += `
      <div class="skill-wrapper">
        <button 
          id="skill-${skillId}" data-action="skill"
          class="skill-button ${isUnlocked ? "" : "locked"}"
          ${isUnlocked ? `data-skill="${skillId}"` : "disabled"}
          title="${titleText}"
        >
          ${isUnlocked ? cooldownOverlayHTML : "🔒"}
        </button>
      </div>
    `;
  }

  return output;
}

function renderFocusSkillButton(playerLevel) {
  const skills = gameState.combat.skills.playerSkills;
  const skillId = "focus";
  const skill = SKILLS_DATABASE[skillId];

  if (!skill) return "";

  const playerSkill = skills[skillId];
  const skillLevel = playerSkill?.level || 0;
  const unlocked = playerSkill?.unlocked || false;

  const hasRequiredLevel = playerLevel >= skill.requiredLevel;
  const isUnlocked = hasRequiredLevel && unlocked;

  const titleText = `${skill.name} (poziom ${skillLevel})`;

  const skillIconUrl = assetManager.getResolvedAsset(skill.icon);
  
  const cooldownOverlayHTML = `
    <div class="icon-wrapper">
      <div class="skill-icon top" id="top-${skillId}">
        <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
      </div>

      <div class="skill-icon base">
        <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
      </div>

      <div class="skill-icon fill" id="cd-fill-${skillId}">
        <div class="fill-mask">
          <img src="${skillIconUrl}" alt="${skill.name}" class="skill-icon-img" />
        </div>
      </div>
    </div>
  `;

  return `
    <div class="skill-wrapper focus-wrapper">
      <button
        id="skill-${skillId}"
        data-action="skill"
        class="skill-button focus-btn ${isUnlocked ? "" : "locked"}"
        ${isUnlocked ? `data-skill="${skillId}"` : "disabled"}
        title="${titleText}"
      >
        ${isUnlocked ? cooldownOverlayHTML : "🔒"}
      </button>
    </div>
  `;
}

// Globalny obiekt stanu cooldownów
const skillCooldownState = {};

function startSkillCooldown(skillId, durationInSeconds) {
 // console.error(`Start cooldown for ${skillId} (${durationInSeconds}s)`);

  const fill = document.getElementById(`cd-fill-${skillId}`);
  const top = document.getElementById(`top-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);
 // console.error(`Start cooldown after elements: fill, top, button`,fill, top, button);

  if (!fill || !top || !button) return;
  
  //console.error(fill.innerHTML);
    
  // Jeśli istnieje stary cooldown — zatrzymaj go
  if (skillCooldownState[skillId]?.rafId) {
    cancelAnimationFrame(skillCooldownState[skillId].rafId);
  }
 // console.error(`Start cooldown after old cooldown`);


  button.disabled = true;
  top.style.display = 'none';
  //fill.style.clipPath = `inset(0 100% 0 0)`;
  //fill.style.transform = `scaleX(1)`;
  
  const mask = fill.querySelector(".fill-mask");
  if (!mask) {
    console.error("BRAK fill-mask!", fill);
    return;
  }

  //mask.style.transform = "scaleX(1)";
  mask.style.width = `100%`;
    
  let cooldownCounter = button.querySelector(".cooldown-counter");
  if (!cooldownCounter) {
    cooldownCounter = document.createElement("span");
    cooldownCounter.className = "cooldown-counter";
    Object.assign(cooldownCounter.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
      pointerEvents: "none",
      zIndex: "10"
    });
    button.appendChild(cooldownCounter);
  }

  const durationMs = durationInSeconds * 1000;

  skillCooldownState[skillId] = {
    durationMs,
    remainingMs: durationMs,
    lastFrameTime: getGameTime(),
    isPaused: false,
    rafId: null
  };

 // console.error(`Start cooldown animation`);

  animateSkillCooldown(skillId, fill, top, button, cooldownCounter);
}

function animateSkillCooldown(skillId, fill, top, button, counter) {
  const state = skillCooldownState[skillId];
  if (!state) return;

  function step() {
    if (state.isPaused) return;
    
    const now = getGameTime();
    const delta = now - state.lastFrameTime; // czas od ostatniej klatki
    state.lastFrameTime = now; // aktualizujemy punkt odniesienia

    state.remainingMs = Math.max(state.remainingMs - delta, 0);
    const progress = 1 - state.remainingMs / state.durationMs;
    //fill.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;
    //fill.style.transform = `scaleX(${progress})`;
    const mask = fill.querySelector(".fill-mask");
    if (!mask) {
      console.error("BRAK fill-mask!", fill);
      return;
    }

    //mask.style.transform = `scaleX(${progress})`;
    mask.style.width = `${progress * 100}%`;
    
    const value = Math.ceil(state.remainingMs / 1000);
    counter.innerText = value;
    counter.style.color = value <= 2 ? "#ff5555" : "#fff";

    if (state.remainingMs > 0) {
      state.rafId = requestAnimationFrame(step);
    } else {
      finishSkillCooldown(skillId, fill, top, button, counter);
    }
  }

  state.rafId = requestAnimationFrame(step);
}

function finishSkillCooldown(skillId, fill, top, button, counter) {
  //fill.style.clipPath = `inset(0 0% 0 0)`;
  //fill.style.transform = `scaleX(0)`;
  const mask = fill.querySelector(".fill-mask");
  if (!mask) {
    console.error("BRAK fill-mask!", fill);
    return;
  }
  //mask.style.transform = "scaleX(0)";
  mask.style.width = `0%`;
  
  top.style.display = 'flex';
  button.disabled = false;
  if (counter) counter.remove();
  cancelAnimationFrame(skillCooldownState[skillId]?.rafId);
  delete skillCooldownState[skillId];
}

function pauseAllSkillsCooldown() {
 // console.log("⏸️ Pauzuję wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || state.isPaused) continue;
    cancelAnimationFrame(state.rafId);
    state.isPaused = true;
  }
}

function resumeAllSkillsCooldown() {
 // console.log("▶️ Wznawiam wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || !state.isPaused) continue;

    const fill = document.getElementById(`cd-fill-${id}`);
    const top = document.getElementById(`top-${id}`);
    const button = document.getElementById(`skill-${id}`);
    const counter = button?.querySelector(".cooldown-counter");
    if (!fill || !top || !button || !counter) continue;

    state.isPaused = false;
    state.lastFrameTime = getGameTime(); // ważne! reset punktu odniesienia
    animateSkillCooldown(id, fill, top, button, counter);
  }
}

// globalny obiekt stanu cooldownów
/*const skillCooldownState = {}; // klucze: skillId (string/number)

// ------------------------
// START / RESTORE COOLDOWN
// ------------------------
function startSkillCooldown(skillId, durationInSeconds, isRestore = false) {
  console.log(`Start cooldown for ${skillId} (${durationInSeconds}s)${isRestore ? ' [restore]' : ''}`);

  const fill = document.getElementById(`cd-fill-${skillId}`);
  const top = document.getElementById(`top-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);
  if (!fill || !top || !button) return;

  // zatrzymaj poprzedni cooldown jeśli był
  if (skillCooldownState[skillId]?.rafId) {
    cancelAnimationFrame(skillCooldownState[skillId].rafId);
  }

  button.disabled = true;
  top.style.display = 'none';
  fill.style.clipPath = `inset(0 100% 0 0)`;

  let cooldownCounter = button.querySelector(".cooldown-counter");
  if (!cooldownCounter) {
    cooldownCounter = document.createElement("span");
    cooldownCounter.className = "cooldown-counter";
    Object.assign(cooldownCounter.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#fff",
      textShadow: "1px 1px 3px rgba(0,0,0,0.7)",
      pointerEvents: "none",
      zIndex: "10"
    });
    button.appendChild(cooldownCounter);
  }

  const durationMs = durationInSeconds * 1000;
  const now = Date.now();

  // jeżeli przywracamy cooldown, zachowaj zapisany koniec
  const targetEnd = isRestore && skillCooldowns[skillId]
    ? skillCooldowns[skillId]
    : now + durationMs;

  // zapisz stan
  skillCooldowns[skillId] = targetEnd;
  saveSkillCooldowns(skillCooldowns);

  const state = {
    durationMs,
    startTime: performance.now(),
    targetEnd,
    remainingMs: targetEnd - now,
    isPaused: false,
    wasPaused: false,
    rafId: null
  };
  skillCooldownState[skillId] = state;

  function animate(time) {
    if (!skillCooldownState[skillId] || skillCooldownState[skillId].isPaused) return;

    const currentTime = Date.now();
    const remaining = Math.max(state.targetEnd - currentTime, 0);
    state.remainingMs = remaining;

    const progress = 1 - remaining / state.durationMs;
    fill.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;

    const value = Math.ceil(remaining / 1000);
    cooldownCounter.innerText = value;
    cooldownCounter.style.color = value <= 2 ? "#ff5555" : "#fff";

    if (remaining > 0) {
      state.rafId = requestAnimationFrame(animate);
    } else {
      fill.style.clipPath = `inset(0 0% 0 0)`;
      top.style.display = 'flex';
      button.disabled = false;
      cooldownCounter.remove();
      delete skillCooldownState[skillId];
      delete skillCooldowns[skillId];
      saveSkillCooldowns(skillCooldowns);
    }
  }

  state.rafId = requestAnimationFrame(animate);
}*/

/*function pauseAllSkillsCooldown() {
  console.log("⏸️ Pauzuję wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || state.isPaused) continue;

    const elapsed = performance.now() - state.startTime;
    state.remainingMs = Math.max(state.durationMs - elapsed, 0);
    state.isPaused = true;
    state.wasPaused = true; // ⬅️ nowa flaga, tylko jeśli faktycznie zatrzymano
    if (state.rafId) cancelAnimationFrame(state.rafId);
    state.rafId = null;
  }
}

function resumeAllSkillsCooldown() {
  console.log("▶️ Wznawiam wszystkie cooldowny");
  for (const id in skillCooldownState) {
    const state = skillCooldownState[id];
    if (!state || !state.isPaused || !state.wasPaused) continue; // ⬅️ tylko faktycznie zatrzymane

    const fill = document.getElementById(`cd-fill-${id}`);
    const top = document.getElementById(`top-${id}`);
    const button = document.getElementById(`skill-${id}`);
    if (!fill || !button) continue;

    const startTime = performance.now();
    const remaining = state.remainingMs;
    const total = state.durationMs;

    state.isPaused = false;
    state.wasPaused = false; // reset flagi

    function animate(time) {
      if (!skillCooldownState[id] || skillCooldownState[id].isPaused) return;
      const elapsed = time - startTime;
      const newRemaining = Math.max(remaining - elapsed, 0);
      state.remainingMs = newRemaining;

      const progress = 1 - newRemaining / total;
      fill.style.clipPath = `inset(0 ${100 - progress * 100}% 0 0)`;

      const counter = button.querySelector(".cooldown-counter");
      if (counter) counter.innerText = Math.ceil(newRemaining / 1000);

      if (newRemaining > 0) {
        state.rafId = requestAnimationFrame(animate);
      } else {
        if (top) top.style.display = 'flex';
        if (counter) counter.remove();
        button.disabled = false;
        delete skillCooldownState[id];
        delete skillCooldowns[id];
        saveSkillCooldowns(skillCooldowns);
      }
    }

    state.rafId = requestAnimationFrame(animate);
  }
}*/

//BASE VERSION WORKING
/*function startSkillCooldown(skillId, durationInSeconds) {
  console.log("start skill cooldown begining");
   
  const fill = document.getElementById(`cd-fill-${skillId}`);
  const top = document.getElementById(`top-${skillId}`);
  const button = document.getElementById(`skill-${skillId}`);
  if (!fill || !top || !button) return;

  button.disabled = true;
  top.style.display = 'none';
  fill.style.clipPath = `inset(0 100% 0 0)`;

  // === 🔥 DODAJ LICZNIK NA ŚRODKU ===
  let cooldownCounter = button.querySelector(".cooldown-counter");
  if (!cooldownCounter) {
    cooldownCounter = document.createElement("span");
    cooldownCounter.className = "cooldown-counter";
    cooldownCounter.style.position = "absolute";
    cooldownCounter.style.top = "50%";
    cooldownCounter.style.left = "50%";
    cooldownCounter.style.transform = "translate(-50%, -50%)";
    cooldownCounter.style.fontSize = "14px";
    cooldownCounter.style.fontWeight = "bold";
    cooldownCounter.style.color = "#fff";
    cooldownCounter.style.textShadow = "1px 1px 3px rgba(0,0,0,0.7)";
    button.appendChild(cooldownCounter);
  }

  const start = performance.now();

  function animate(time) {
    const elapsed = (time - start) / 1000;
    const remaining = Math.max(durationInSeconds - elapsed, 0);
    const progress = Math.min(elapsed / durationInSeconds, 1);
    const percent = progress * 100;

    fill.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
    cooldownCounter.innerText = Math.ceil(remaining); // ⏱ aktualizuj licznik

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Cooldown zakończony
      fill.style.clipPath = `inset(0 0% 0 0)`;
      top.style.display = 'flex';
      button.disabled = false;
      cooldownCounter.remove(); // usuń licznik
    }
  }

  requestAnimationFrame(animate);
}*/

function calculateEffectValue(effect, player, enemy) {
  switch (effect.type) {
    case "damage":
      // np. 150% obrażeń = 1.5 * atak gracza
      //console.error("calculate effect damage", effect.value);
      return effect.value / 100;// * player.dmg);
    case "bleed":
      // np. 150% obrażeń = 1.5 * atak gracza
      return effect.value / 100;// * player.dmg);
    case "armor-break":
      // np. 150% obrażeń = 1.5 * atak gracza
      return effect.value / 100;// * player.dmg);
      /*case "heal":
      // np. 120% leczenia = 1.2 * siła leczenia gracza
      return Math.floor((effect.value / 100) * player.magic || player.attack);*/
    case "stun":
      // Stun w sekundach — bez przeliczeń
      return effect.value;
     case "slow":
      // Slow w procentach — bez przeliczeń
      return effect.value;
    case "slowmo":
      // Slow w procentach — bez przeliczeń
      return effect.value / 100;
    case "lifeSteal":
      // np. 30% kradzieży życia — zostawiamy, przeliczymy potem
      return effect.value;
    case "damage-buff":
     // console.log("damage-buff: %", effect.value);
      //console.log("player dmg ", player.dmg);
      return 1 + (effect.value / 100);
    case "armor-duration":
      return effect.value;
    case "slow-duration":
      return effect.value;
    case "slowmo-duration":
      return effect.value;
    case "shout-duration":
      return effect.value;
    case "bleed-duration":
      return effect.value;

    default:
      return 0;
  }
}

function getSkillEffectsAtLevel(skillId) {
  const skill = SKILLS_DATABASE[skillId];
  const state = gameState.combat.skills.playerSkills[skillId];
  const { effects, level } = skill;
     
  return effects.map(effect => {
    //console.error("effect value + scaling level", effect.baseValue + (effect.scalingPerLevel || 0) * (state.level - 1));
    //console.error("effect baseValue, effect.scalingPerLevel, level", effect.baseValue, effect.scalingPerLevel, state.level);

    return {
      ...effect,
      value: effect.baseValue + (effect.scalingPerLevel || 0) * (state.level - 1)
    };
  });
}

function groupEffectsByType(effects) {
  const grouped = {};
  effects.forEach(effect => {
    if (!grouped[effect.type]) grouped[effect.type] = [];
    grouped[effect.type].push(effect);
  });
  return grouped;
}

function getEffectValue(effects, type, player, enemy) {
  const found = effects.find(e => e.type === type);
  return found ? calculateEffectValue(found, player, enemy) : null;
}

/*function restoreBuffsAfterReload() {
  const expiresAt = parseInt(localStorage.getItem("dmgBuffExpiresAt"), 10);
  const buffValue = parseFloat(localStorage.getItem("dmgBuffValue"));

  if (expiresAt && expiresAt > Date.now() && buffValue) {
    const remaining = expiresAt - Date.now();

    isDmgBuffed = true;
    currentBuff.dmg = buffValue;
    updatePlayerDmg(buffValue, true);

    setTimeout(() => {
      removeDmgBuff();
    }, remaining);
  } else {
    // jeśli buff już minął – wyczyść dane, żeby nie było śmieci
    localStorage.removeItem("dmgBuffExpiresAt");
    localStorage.removeItem("dmgBuffValue");
  }
}

function removeDmgBuff() {
  isDmgBuffed = false;
  currentBuff.dmg = 0;
  localStorage.removeItem("dmgBuffExpiresAt");
  localStorage.removeItem("dmgBuffValue");
  renderStats();
}*/

//let isDmgBuffed = false;

function addTemporaryBuff({ stat, value, durationSec, source = "unknown" }) {
  const durationMs = durationSec * 1000;
  const expiresAt = getGameTime() + durationMs;

  // jeśli buff na ten stat już istnieje – nadpisz
  removeBuff(stat);

  gameState.combat.activeBuffs[stat] = {
    value,
    expiresAt,
    source,
    timeoutId: setTimeout(() => removeBuff(stat), durationMs)
  };

  applyBuff(stat, value);

  saveBuffsToStorage();
}

function applyBuff(stat, value) {
  switch (stat) {
    case "dmg":
      //currentBuff.dmg = value;
     // console.error(`buff value dmg`, value);
      updatePlayerDmg(value, true);
      break;

    case "def":
      //currentBuff.def = value;
      updatePlayerDef(value, true);
      break;

    // 🔮 przyszłość
    // case "atkSpeed":
    // case "critChance":
  }

  renderStats();
}

function removeBuff(stat) {
  const buff = gameState.combat.activeBuffs[stat];
  if (!buff) return;

  clearTimeout(buff.timeoutId);
  
  // cofnięcie efektu
  switch (stat) {
    case "dmg":
      currentBuff.dmg = 0;
      break;
    case "def":
      currentBuff.def = 0;
      break;
  }

  delete gameState.combat.activeBuffs[stat];
  saveBuffsToStorage();
  renderStats();
}

function saveBuffsToStorage() {
  const serialized = {};
  const combat = gameState.combat;

  for (const stat in combat.activeBuffs) {
    serialized[stat] = {
      value: combat.activeBuffs[stat].value,
      expiresAt: combat.activeBuffs[stat].expiresAt,
      source: combat.activeBuffs[stat].source
    };
  }

  saveGame();
}

function restoreBuffsAfterReload() {
  const buffs = gameState.combat.activeBuffs;
  if (!buffs) return;

  const now = Date.now();

  for (const stat in buffs) {
    const { value, expiresAt, source } = buffs[stat];

    if (expiresAt <= now) continue;

    const remainingMs = expiresAt - now;

    gameState.combat.activeBuffs[stat] = {
      value,
      expiresAt,
      source,
      timeoutId: setTimeout(() => removeBuff(stat), remainingMs)
    };

    applyBuff(stat, value);
  }
}

function useSkill(skillId, player, enemy) {
  const effects = getSkillEffectsAtLevel(skillId);
  //console.log("Skill effects: ", effects, skillId);
  const isSkillAttack = true;
  
  const getEffectByType = (effects, type) => effects.find(e => e.type === type);
  
  effects.forEach(effect => {
    const actualValue = calculateEffectValue(effect, player, enemy);

    switch (effect.type) {
      case "damage":
        if (!gameState.world.inCombat) return;
       // console.error("use skill damage", actualValue);
      
        let dmgVsStatus = 0;
      
        switch(skillId) {
          case `slash`:
            playSkill(`heavyAttack`); 
            if(enemy.status.slow || enemy.status.stun) {
              dmgVsStatus = gameState.char.bonus.dmgVsStatus / 100;
              //console.error(`dmgVsStatus, stun`, dmgVsStatus, enemy.status.stun);
            }  
            //console.error(`playSkill(heavyAttack)`, skillId);
            break;
          
          case `double-attack`:
            playSkill(`doubleStrike`); 
            //console.error(`playSkill(doubleStrike)`, skillId);
            break;
          
          case `jump`:
            playSkill(`jumpAttack`); 
            //console.error(`playSkill(jump)`, skillId);
            break;
       
          case `charge`:
            playSkill(`charge`);
            //console.error(`playSkill(charge)`, skillId);
            break;
        }
 
        if(skillId !== "slash" && skillId !== "jump") {
          playEnemyHitAnimation(enemy, gameState.world.selectedSlotIndex);
        }
      
        if (skillId === "slash" || skillId === "jump") {
          
          setTimeout(() => {
           // console.error(`enter timeout double attack`); 
            if (enemy.currentHp > 0 && gameState.world.inCombat) {
              performAttack(
                player,
                enemy,
                {
                  isSkillAttack,
                  baseMultiplier: actualValue + dmgVsStatus
                }
              );
              //console.error(`slash dmg`, actualValue); 
       
              playEnemyHitAnimation(enemy, gameState.world.selectedSlotIndex);
    
              if(skillId === "slash") {
                spawnEffect("slash", enemy.dom.slot);
              }
              
              if(skillId === "jump") {
                //spawnEffect("jump", enemy.dom.slot);
                spawnEffect("jump_impact", enemy.dom.slot);
                spawnEffect("jump_shockwave", enemy.dom.slot);
              }
              
              //console.error(`timeout in if double attack`, enemy.currentHp);
            }
          }, 450);
          
          break;
        }

      
        performAttack(
          player,
          enemy,
          {
            isSkillAttack,
            baseMultiplier: actualValue
          }
        );
      
        if(skillId === "double-attack") {
          spawnEffect("double", enemy.dom.slot);
        }
      
        if(skillId === "charge") {
          spawnEffect("charge", enemy.dom.slot);
          enemy.status.stunned = true;
          enemy.status.multiplier = 0.25;
        }
      
        if (skillId === "double-attack") {
          
          // drugi cios po 250ms
          setTimeout(() => {
           // console.error(`enter timeout double attack`); 
            if (enemy.currentHp > 0 && gameState.world.inCombat) {
              performAttack(
                player,
                enemy,
                {
                  isSkillAttack,
                  baseMultiplier: actualValue
                }
              );
      
              
              //spawnHitEffect("double-attack-right", enemy.dom.slot);

              //dealDamageToEnemy(enemy, actualValue);
              //console.error(`timeout in if double attack`, enemy.currentHp);
            }
          }, 250);
          
        }
      
             
        //dealDamageToEnemy(enemy, actualValue);
        //enemy.currentHp -= actualValue;
        //console.error(`timeout after timeout double attack`, enemy.currentHp);
      
        break;
      
      case "bleed":
        const durationTime = getEffectByType(effects, "bleed-duration");
        const bleedDuration = durationTime
          ? calculateEffectValue(durationTime, player, enemy)
          : 5;
   
        let bleedDamage = actualValue * (1 + player.str * 0.003);
          
        applyBleed(enemy, bleedDamage, bleedDuration);
 
        break;
 
      case "armor-break":
        const durationArmorTime = getEffectByType(effects, "slow-duration");
        const armorDuration = durationArmorTime
          ? calculateEffectValue(durationArmorTime, player, enemy)
          : 5;
   
        setTimeout(() => {
          
          let armorBreakPenetration = actualValue * (1 + player.str * 0.002);
           
          applyArmorBreak(enemy, armorBreakPenetration, armorDuration)
          showReward(`${t("break_defense_reward")} -${(armorBreakPenetration * 100).toFixed(0)}`);
  
          }, 450);
      
        break;
      
      case "heal":
        player.hp += actualValue;
        break;
      
      case "damage-buff": 
        const durationEffect = getEffectByType(effects, "shout-duration");
        const buffDuration = durationEffect
          ? calculateEffectValue(durationEffect, player, enemy)
          : 5;
      
        playSkill(`warCry`); 
      
        addTemporaryBuff({
          stat: "dmg",
          value: actualValue,
          durationSec: buffDuration,
          source: "skill"
        });
      
        /*const durationMs = buffDuration * 1000;
        isDmgBuffed = true;

        // Zapisz wartość buffa (np. +20% dmg)
        currentBuff.dmg = actualValue;
        updatePlayerDmg(actualValue, true);

        // Zapisz dane w localStorage, aby przetrwały reload strony
        const expiresAt = Date.now() + durationMs;
        localStorage.setItem("dmgBuffExpiresAt", expiresAt);
        localStorage.setItem("dmgBuffValue", actualValue);

        setTimeout(() => {
          removeDmgBuff();
        }, durationMs);*/

        break;
      
      case "slowmo":
        const slowmoDurationEffect = getEffectByType(effects, "slowmo-duration");
        const slowmoDuration = slowmoDurationEffect
          ? calculateEffectValue(slowmoDurationEffect, player, enemy)
          : 5;
       
        const finalSlowmoDuration = slowmoDuration * actualValue * 1000;
      
       // console.error(`finalSlowmoDuration`, finalSlowmoDuration);
        playSkill(`focus`);
        slowMoSkill(actualValue, finalSlowmoDuration);
        break;
      
      case "stun":
        // STUN działa jak pauza wideo:
         //applyEnemyStun(enemy, actualValue, selectedSlotIndex);
        const duration = actualValue * 1000;
            
        applyEnemyStun(enemy, 0.001, duration, gameState.world.selectedSlotIndex);
        break;
      
      case "slow":
        if (!enemy?.status.slow || enemy?.status.slow < actualValue) {
          const durationEffect = getEffectByType(effects, "slow-duration");
          const slowDuration = durationEffect
            ? calculateEffectValue(durationEffect, player, enemy)
            : 5;
          
          setTimeout(() => {
            //console.log("slow duration", slowDuration);
            enemy.status.slow = actualValue;
            enemy.status.slowDuration = slowDuration;

            const multiplier = enemy.status.slow / 100;
            const durationMs = slowDuration * 1000;
            
            applyEnemySlow(enemy, multiplier, durationMs, gameState.world.selectedSlotIndex);
          }, 450);
          
          //console.log("slow multiplier", multiplier);
          //applyEnemySlow(enemy, multiplier, durationMs, gameState.world.selectedSlotIndex);
          //applyEnemySkillEffect(enemy, 0.001, durationMs, selectedSlotIndex);
        }
        break;

      /*case "lifeSteal":
        const stolen = Math.floor(player.lastDamageDealt * (actualValue / 100));
        player.hp += stolen;
        break;*/
      
      /*case "haste":
        enemy.status.haste = actualValue; // np. 30%
        const hasteMultiplier = 1 - (actualValue / 100);
        setEnemyAttackSpeed(1 / hasteMultiplier);
        setTimeout(() => setEnemyAttackSpeed(1), (effect.duration || 5) * 1000);
        break;*/
    }

    //console.log(effect.type, "zadano:", actualValue);
  });
    
  if (gameState.world.inCombat) {
    if (!fleeIsSet) setupFleeButton();
    showFleeButton();
  
    /*if (enemy.currentHp <= 0) {
      console.error(`enemy.currentHp <= 0 in useSkill`);
      enemy.currentHp = 0;
      exitCombat();
      hideFleeButton();
      winCombat();
      stopEnemyAttack(selectedSlotIndex); // linia czasu wroga – STOP
    } else {
      //updateEnemyHealthBar(enemy.currentHp, enemy.maxHp, selectedSlotIndex);
    }*/

    updateEnemyHealthBar(enemy, gameState.world.selectedSlotIndex);
  }
  
  lockActions({ duration: 450, reason: "skill", allow: [] });

  //saveGame();
  //console.log("skill used");
}

function applyBleed(enemy, damage, duration) {
  if (!enemy.bleed) {
    enemy.bleed = {
      stacks: 0,
      damage: 0,
      tickRate: 1,
      timer: 0,
      duration: 0
    };
  }

  const eq = gameState.char?.equipment || {};
  const weapon = eq[`weapon`];
  
 // if (weapon?.baseName !== `axe`){
    // zwiększamy stacki
    enemy.bleed.stacks += 1;

    // opcjonalny cap (ważne dla balansu!)
    enemy.bleed.stacks = Math.min(enemy.bleed.stacks, 3);
 // }
  
  // odświeżamy duration
  enemy.bleed.duration = Math.max(enemy.bleed.duration, duration);
  
  const bleedDamage = gameState.char.baseDamage.weapon * damage;
  enemy.bleed.damage = bleedDamage * enemy.bleed.stacks;

  //console.log(`enemy.bleed.duration, damage`, enemy.bleed.duration, enemy.bleed.damage);

 // console.log(`BLEED → stacks: ${enemy.bleed.stacks}`);
}

function applyArmorBreak(enemy, value, duration) {
  enemy.armorBreak = {
    value,
    duration
  };
  
  //enemy.dom.healthBar.classList.add("armor-break");
  updateStatusEnemyUI(enemy); 
}

function applyEnemyStun(enemy, multiplier, durationMs, slotIndex) {
  //const now = Date.now();
  const now = performance.now();

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  //console.log("durationMs STUN", durationMs);
  let isAnotherStun = false;
  
  // ✅ STACKUJ STUN (to jest Twój główny bug)
  if (enemy?.status.stunEnd && enemy?.status.stunEnd > now) {
    enemy.status.stunEnd += durationMs;
    isAnotherStun = true;
  } else {
    enemy.status.stunEnd = now + durationMs;
  }
  
  tryInterruptEnemy(enemy, `stun`);
  
  //enemy.status.stunRemaining = durationMs;
  enemy.status.stunRemaining = enemy.status.stunEnd - now;
  //enemy.status.stunEnd = Date.now() + durationMs;

  if(!isAnotherStun) {
    // 🔑 Zapamiętaj prędkość przed stunem (np. 0.5 jeśli był slow)
    enemy.status.speedBeforeStun = enemy.status.currentSpeedMultiplier ?? 1;
    enemy.status.stun = multiplier * 100;

    // 🔑 Symulacja pauzy – ustaw prędkość praktycznie na 0
    setEnemyAttackSpeed(enemy, multiplier, slotIndex);
  } 
  stunAnimation(enemySlot, enemy, durationMs);
}

function stunAnimation(enemySlot, enemy, stunMs) {
  if (enemy.animations?.stun && typeof enemy.animations.stun.cancel === "function") {
    enemy.animations.stun.cancel();
  }

  const stunAnim = enemySlot?.animate(
    [
      { filter: "brightness(1)", offset: 0 },
      { filter: "brightness(1.5) hue-rotate(240deg)", offset: 0.5 },
      { filter: "brightness(1)", offset: 1 }
    ],
    { duration: stunMs, iterations: 1, easing: "ease-in-out" }
  );

  enemy.animations = enemy.animations || {};
  enemy.animations.stun = stunAnim;
}

/*function clearEnemyStun(enemy, slotIndex) {
  enemy.status.stun = 0;
  enemy.status.stunRemaining = 0;
  enemy.status.stunEnd = null;

  resumeEnemyAttack(enemy, slotIndex);

  if (enemy.animations?.stun?.cancel) {
    enemy.animations.stun.cancel();
    enemy.animations.stun = null;
  }

  updateCooldownBar(
    (enemyAttackTimeline.elapsed / enemyAttackTimeline.duration) * 100,
    0,
    slotIndex
  );
}*/

/*function clearEnemyStun(enemy, slotIndex) {
  enemy.status.stun = 0;
  enemy.status.stunRemaining = 0;
  enemy.status.stunEnd = null;

  // 🔑 Przywróć prędkość sprzed stun (np. slow)
  const restoredSpeed = enemy.status.speedBeforeStun ?? 1;
  enemy.status.speedBeforeStun = null;

  setEnemyAttackSpeed(enemy, restoredSpeed, slotIndex);

  if (enemy.animations?.stun?.cancel) {
    enemy.animations.stun.cancel();
    enemy.animations.stun = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}*/

function clearEnemyStun(enemy, slotIndex) {
  enemy.status.stun = 0;
  enemy.status.stunRemaining = 0;
  enemy.status.stunEnd = null;
  
  enemy.status.stunned = false;
  enemy.status.multiplier = 0;
  
  const restoredSpeed = enemy.status.speedBeforeStun ?? 1;
  enemy.status.speedBeforeStun = null;

  if (enemy.attackState?.phase !== "windup") {
    setEnemyAttackSpeed(enemy, restoredSpeed, slotIndex);
  } else {
    enemy.status.currentSpeedMultiplier = restoredSpeed;
    changeSpeedAnimation(enemy, restoredSpeed);
  }

  if (enemy.animations?.stun?.cancel) {
    enemy.animations.stun.cancel();
    enemy.animations.stun = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}


function applyEnemySlow(enemy, multiplier, durationMs, slotIndex) {
  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);

  enemy.status.slow = multiplier * 100;
  enemy.status.slowRemaining = durationMs;
  //enemy.status.slowEnd = Date.now() + durationMs;
  enemy.status.slowEnd = performance.now() + durationMs;
  
  // Jeśli jest stun, tylko zapamiętaj speed, nie zmieniaj jeszcze timeline
  if (enemy.status.stun) {
    enemy.status.speedBeforeStun = multiplier;
  } else {
    setEnemyAttackSpeed(enemy, multiplier, slotIndex);
  }

  slowAnimation(enemySlot, enemy, durationMs);
}

function slowAnimation(enemySlot, enemy, slowMs) {
  if (enemy.animations?.slow) enemy.animations.slow.cancel();

  const slowAnim = enemySlot?.animate([
    { filter: "hue-rotate(0deg)", transform: "translateX(0px)", offset: 0 },
    { filter: "hue-rotate(200deg)", transform: "translateX(-2px)", offset: 0.3 },
    { filter: "hue-rotate(200deg)", transform: "translateX(2px)", offset: 0.6 },
    { filter: "hue-rotate(0deg)", transform: "translateX(0px)", offset: 1 }
  ], {
    duration: slowMs,
    iterations: Infinity,
    easing: "ease-in-out"
  });

  enemy.animations = enemy.animations || {};
  enemy.animations.slow = slowAnim;
}


/*function clearEnemySlow(enemy, slotIndex) {
  enemy.status.slow = 0;
  enemy.status.slowRemaining = 0;
  enemy.status.slowEnd = null;

  // Przywróć normalną prędkość TYLKO jeśli nie ma stun
  if (!enemy.status.stun) {
    setEnemyAttackSpeed(enemy, 1, slotIndex);
  }

  if (enemy.animations?.slow?.cancel) {
    enemy.animations.slow.cancel();
    enemy.animations.slow = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}*/

function clearEnemySlow(enemy, slotIndex) {
  enemy.status.slow = 0;
  enemy.status.slowRemaining = 0;
  enemy.status.slowEnd = null;
  
  if (!enemy.status.stun) {
    if (enemy.attackState?.phase !== "windup") {
      setEnemyAttackSpeed(enemy, 1, slotIndex);
    } else {
      enemy.status.currentSpeedMultiplier = 1;
      changeSpeedAnimation(enemy, 1);
    }
  }

  if (enemy.animations?.slow?.cancel) {
    enemy.animations.slow.cancel();
    enemy.animations.slow = null;
  }

  const enemySlot = document.getElementById(`enemy-slot-${slotIndex}`);
  if (enemySlot) {
    enemySlot.style.filter = "";
    enemySlot.style.transform = "";
  }
}