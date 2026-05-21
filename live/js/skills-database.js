const COST_SCALE = 0.10;

const SKILLS_DATABASE = {
   "focus": { 
      name: "focus_skill_name",
      unlocked: false,
      level: 0,
      maxLevel: 5,
      requiredLevel: 4,
      parent: null,
      children: [],
      description: "focus_skill_desc",
      baseCooldown: 12,
      staminaCost: 30,
      effects: [
         {
           type: "slowmo",
           baseValue: 35,
           scalingPerLevel: -4,
           target: "enemy"
         },
         {
          type: "slowmo-duration",
          baseValue: 2,
          scalingPerLevel: 0.2,
          target: "enemy"
        }
      ],
      icon: "img/icons/focus-skill-icon.png"
    },
  
  
    "slash": { 
      name: "power_attack_skill_name",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 1,
      parent: null,
      children: ["double-attack", "extra-life", "extra-defense", "extra-damage"],
      description: "power_attack_skill_desc",
      baseCooldown: 5,
      staminaCost: 25,
      effects: [
         {
           type: "damage",
           baseValue: 150,
           scalingPerLevel: 10, // 10% więcej obrażeń na poziom
           target: "enemy"
         },
         {
          type: "bonus-vs-status",
          baseValue: 30,
          scalingPerLevel: 0,
          target: "enemy"
        }
      ],
      icon: "img/icons/powerful-attack-skill-icon.png"
    },
    "double-attack": { 
      name: "double_attack_skill_name",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 4,
      parent: "slash",
      children: ["charge", "jump", "warrior-shout"],
      description: "double_attack_skill_desc",
      baseCooldown: 5,
      staminaCost: 20,
      effects: [
         {
           type: "damage",
           baseValue: 65,
           scalingPerLevel: 7,
           target: "enemy"
         },
         {
           type: "bleed",
           baseValue: 7,
           scalingPerLevel: 0.7,
           target: "enemy"
         },
         {
           type: "bleed-duration",
           baseValue: 4.5,
           scalingPerLevel: 0.2,
           target: "enemy"
         }
      ],
      icon: "img/icons/double-attack-skill-icon.png"
    },
    "charge": { 
      name: "charge_skill_name",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 6,
      parent: "double-attack",
      children: [],
      description: "charge_skill_desc",
      baseCooldown: 8,
      staminaCost: 30,
      effects: [
         {
           type: "stun",
           baseValue: 2,
           scalingPerLevel: 0.1,
           target: "enemy"
         },
         {
           type: "damage",
           baseValue: 70,
           scalingPerLevel: 6,
           target: "enemy"
         },
        {
           type: "bonus-damage",
           baseValue: 25,
           scalingPerLevel: 0,
           target: "enemy"
         }
      ],
      icon: "img/icons/charge-skill-icon.png"
    },
    "jump": {
      name: "jump_skill_name",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 6,
      parent: "double-attack",
      children: [],
      description: "jump_skill_desc",  
      baseCooldown: 10,
      staminaCost: 35,
      effects: [
         {
           type: "damage",
           baseValue: 140,
           scalingPerLevel: 5, 
           target: "enemy"
         },
         {
           type: "armor-break",
           baseValue: 20,
           scalingPerLevel: 1.5, 
           target: "enemy"
        },
        {
           type: "slow",
           baseValue: 25,
           scalingPerLevel: 1.2, 
           target: "enemy"
         },
        {
           type: "slow-duration",
           baseValue: 3.6,
           scalingPerLevel: 0.2,
           target: "enemy"
         }
      ],
      icon: "img/icons/jump-skill-icon.png"
    },
    "warrior-shout": { 
      name: "shout_skill_name",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "double-attack",
      children: [],
      description: "shout_skill_desc", 
      baseCooldown: 12,
      staminaCost: 30,
      effects: [
         {
           type: "damage-buff",
           baseValue: 20,
           scalingPerLevel: 3,
           target: "enemy"
         },
         {
           type: "shout-duration",
           baseValue: 6,
           scalingPerLevel: 0.2,
           target: "enemy"
         }
      ],
      icon: "img/icons/warrior-shout-skill-icon.png" 
    },
    "extra-life": { 
      name: "extra_life_skill_name",
      style: "timed",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 3,
      parent: "slash",
      children: ["perfect-block-dmg", "block-recovery"],
      description: "extra_life_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "life-bonus",
           baseValue: 30,
           scalingPerLevel: 15,
           target: "character"
         }
      ],
      icon: "img/icons/longevity-skill-icon.png"
    },
    "extra-defense": { 
      name: "extra_defense_skill_name",
      style: "turtle",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 3,
      parent: "slash",
      children: ["hp-regen", "max-defense"],
      description: "extra_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "def-bonus",
           baseValue: 12,
           scalingPerLevel: 8,
           target: "character"
         }
      ],
      icon: "img/icons/steadfastness-skill-icon.png"
    },
    "max-defense": { 
      name: "max_defense_skill_name",
      style: "turtle",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-defense",
      children: ["iron-defense"],
      description: "max_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "max-def-bonus",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         }
      ],
      icon: "img/icons/max-def-skill-icon2.png"
    },
    "iron-defense": { 
      name: "iron_defense_skill_name",
      style: "turtle",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "max-defense",
      children: [],
      description: "iron_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "dmg-reduction",
           baseValue: 18,
           scalingPerLevel: 2,
           target: "character"
         },
         {
           type: "cooldown",
           baseValue: 7.5,
           scalingPerLevel: -0.3,
           target: "character"
         }
      ],
      icon: "img/icons/dmg-reduction-skill-icon2.png"
    },
    "stack-defense": { 
      name: "stack_defense_skill_name",
      style: "turtle",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-stamina",
      children: [],
      description: "stack_defense_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "stack-def",
           baseValue: 6,
           scalingPerLevel: 0.2,
           target: "character"
         },
         {
           type: "stack-duration",
           baseValue: 6,
           scalingPerLevel: 0.2,
           target: "character"
         }
      ],
      icon: "img/icons/armor-stack-skill-icon.png"
    },

    "extra-damage": { 
      name: "extra_damage_skill_name",
      style: "poise",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 3,
      parent: "slash",
      children: ["extra-crit", "atkspd-bonus"],
      description: "extra_damage_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "dmg-bonus",
           baseValue: 8,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/superhuman-strength-skill-icon.png"
    },
    "extra-energy": { 
      name: "Głębokie Oddechy",
      style: "universal",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "extra-life",
      children: ["energy-regen"],
      description: "Zwiększa maksymalną energię o {energy-bonus}. Twój oddech staje się głębszy i bardziej kontrolowany.",
      baseCooldown: 0,
      effects: [
         {
           type: "energy-bonus",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         }
      ],
      icon: "img/icons/deep-breaths-skill-icon.png"
    },
    "extra-stamina": { 
      name: "extra_stamina_skill_name",
      style: "turtle",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 12,
      parent: "hp-regen",
      children: ["stack-defense"],
      description: "extra_stamina_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "stamina-bonus",
           baseValue: 15,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/stamina-bonus-skill-icon.png"
    },
    "stamina-regen": { 
      name: "Nieustępliwość",
      style: "timed",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-stamina",
      children: [],
      description: "Zwiększa regeneracje staminę o {stamina-regen}. Zmęczenie ustępuje miejsca determinacji.",
      baseCooldown: 0,
      effects: [
         {
           type: "stamina-regen",
           baseValue: 2,
           scalingPerLevel: 0.5,
           target: "character"
         }
      ],
      icon: "img/icons/stamina-regen-skill-icon.png"
    },
    "hp-regen": { 
      name: "hp_regen_skill_name",
      style: "turtle",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "extra-defense",
      children: ["extra-stamina"],
      description: "hp_regen_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "hp-regen-bonus",
           baseValue: 3,
           scalingPerLevel: 0.8,
           target: "character"
         }
      ],
      icon: "img/icons/fortitude-skill-icon.png"
    },
    "hp-to-dmg": { 
      name: "hp_to_dmg_skill_name",
      style: "poise",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 18,
      parent: "crit-damage-bonus",
      children: [],
      description: "hp_to_dmg_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "threshold",
           baseValue: 30,
           scalingPerLevel: 1.5,
           target: "character"
         },
         {
           type: "max-bonus",
           baseValue: 20,
           scalingPerLevel: 3,
           target: "character"
         }
      ],
      icon: "img/icons/hp-to-dmg-skill-icon.png"
    },
   "max-hp": { 
      name: "Wzmocniona Budowa",
      style: "universal",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "hp-regen",
      children: [],
      description: "Zwiększa maksimum życia o {max-hp-bonus}. Twoje ciało staje się twardsze i odporniejsze.",
      baseCooldown: 0,
      effects: [
         {
           type: "max-hp-bonus",
           baseValue: 3,
           scalingPerLevel: 1,
           target: "character"
         }
      ],
      icon: "img/icons/max-hp-skill-icon.png"
    },
    "max-dmg": { 
      name: "Skupiona Siła",
      style: "poise",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-crit",
      children: [],
      description: "Zwiększa maksimum obrażeń o {max-dmg-bonus}. Każdy cios niesie ze sobą większą siłę.",
      baseCooldown: 0,
      effects: [
         {
           type: "max-dmg-bonus",
           baseValue: 3,
           scalingPerLevel: 1,
           target: "character"
         }
      ],
      icon: "img/icons/max-dmg-skill-icon.png"
    },
    "extra-crit": { 
      name: "extra_crit_skill_name",
      style: "poise",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 7,
      parent: "extra-damage",
      children: ["crit-damage-bonus"],
      description: "extra_crit_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "crit-bonus",
           baseValue: 2,
           scalingPerLevel: 0.5,
           target: "character"
         }
      ],
      icon: "img/icons/crit-skill-icon.png"
    },
    "energy-regen": { 
      name: "Płynny Przepływ",
      style: "universal",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "extra-energy",
      children: [],
      description: "Zwiększa regeneracje energii o {energy-regen}. Energia krąży w Tobie bez zakłóceń.",
      baseCooldown: 0,
      effects: [
         {
           type: "energy-regen",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         }
      ],
      icon: "img/icons/energy-regen-skill-icon.png"
    },
    "atkspd-bonus": { 
      name: "atkspd_bonus_skill_name",
      style: "poise",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-damage",
      children: [ "hp-to-dmg"],
      description: "atkspd_bonus_skill_desc", 
      baseCooldown: 0,
      effects: [
         {
           type: "atkspd-bonus",
           baseValue: 2,
           scalingPerLevel: 0.5,
           target: "character"
         }
      ],
      icon: "img/icons/atkspd-skill-icon.png"
    },
    "crit-damage-bonus": { 
      name: "crit_damage_bonus_skill_name",
      style: "poise",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 12,
      parent: "extra-crit",
      children: ["hp-to-dmg"],
      description: "crit_damage_bonus_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "crit-damage-bonus",
           baseValue: 10,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/crit-damage-skill-icon2.png"
    },
    
    "perfect-block-dmg": { 
      name: "perfect_block_dmg_skill_name",
      style: "timed",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-life",
      children: ["perfect-chain"],
      description: "perfect_block_dmg_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "perfect-dmg",
           baseValue: 20,
           scalingPerLevel: 5,
           target: "character"
         }
      ],
      icon: "img/icons/perfect-block-skill-icon.png"
    },
  
    "perfect-window": { 
      name: "perfect_window_skill_name",
      style: "timed",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "block-recovery",
      children: [],
      description: "perfect_window_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "perfect-window",
           baseValue: 15,
           scalingPerLevel: 4,
           target: "character"
         }
      ],
      icon: "img/icons/perfect-window-skill-icon.png"
    },
  
    "perfect-chain": { 
      name: "perfect_chain_skill_name",
      style: "timed",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 16,
      parent: "perfect-block-dmg",
      children: [],
      description: "perfect_chain_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "chain-dmg",
           baseValue: 5,
           scalingPerLevel: 1,
           target: "character"
         }
      ],
      icon: "img/icons/perfect-chain-skill-icon.png"
    },
  
    "block-recovery": { 
      name: "block_recovery_skill_name",     
      style: "timed",
      unlocked: false,
      level: 0,
      maxLevel: 10,
      requiredLevel: 10,
      parent: "extra-life",
      children: ["perfect-window"],
      description: "block_recovery_skill_desc",
      baseCooldown: 0,
      effects: [
         {
           type: "block-reduction",
           baseValue: 5,
           scalingPerLevel: 2,
           target: "character"
         },
        {
           type: "block-cooldown",
           baseValue: 3.5,
           scalingPerLevel: -0.1,
           target: "character"
        }
      ],
      icon: "img/icons/block-recovery-skill-icon.png"
    },

  
};


const skillTest = {
    "skill-root-2.3": { unlocked: false, children: [] },
    "skill-root-2.4": { unlocked: false, children: ["skill-root-3.1"] },
    "skill-root-2.5": { unlocked: false, children: ["skill-root-3.2", "skill-root-3.3"] },
    "skill-root-2.6": { unlocked: false, children: ["skill-root-3.4"] },
    "skill-root-2.7": { unlocked: false, children: ["skill-root-3.5", "skill-root-3.6"] },
    "skill-root-2.8": { unlocked: false, children: [] },
    "skill-root-3.1": { unlocked: false, children: [] },
    "skill-root-3.2": { unlocked: false, children: [] },
    "skill-root-3.3": { unlocked: false, children: [] },
    "skill-root-3.4": { unlocked: false, children: [] },
    "skill-root-3.5": { unlocked: false, children: [] },
    "skill-root-3.6": { unlocked: false, children: [] },
    "skill-top-3.1": { unlocked: false, children: [] },
    "skill-top-3.2": { unlocked: false, children: ["skill-top-4.1"] },
    "skill-top-3.3": { unlocked: false, children: ["skill-top-4.2"] },
    "skill-top-3.4": { unlocked: false, children: ["skill-top-4.3", "skill-top-4.4"] },
    "skill-top-3.5": { unlocked: false, children: ["skill-top-4.5"] },
    "skill-top-3.6": { unlocked: false, children: [] },
    "skill-top-4.1": { unlocked: false, children: [] },
    "skill-top-4.2": { unlocked: false, children: ["skill-top-5.1"] },
    "skill-top-4.3": { unlocked: false, children: ["skill-top-5.2"] },
    "skill-top-4.4": { unlocked: false, children: ["skill-top-5.3"] },
    "skill-top-4.5": { unlocked: false, children: [] },
    "skill-top-4.6": { unlocked: false, children: [] },
    "skill-top-5.1": { unlocked: false, children: [] },
    "skill-top-5.2": { unlocked: false, children: [] },
    "skill-top-5.3": { unlocked: false, children: [] }
   };
