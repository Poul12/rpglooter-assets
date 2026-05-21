/* =========================================
   localization-items.js
   ITEMY / RARITY / TYPY
========================================= */

const AFFIX_TRANSLATIONS = {

  armor_percent: {
    pl: "% Pancerz",
    en: "% Armor"
  },

  damage_percent: {
    pl: "% Obrażenia",
    en: "% Damage"
  },

  armor: {
    pl: "Pancerz",
    en: "Armor"
  },

  damage: {
    pl: "Obrażenia",
    en: "Damage"
  },

  
  flat_life: {
    pl: "Życie",
    en: "Life"
  },

  elemental_damage: {
    pl: "Obrażenia od {element}",
    en: "{element} Damage"
  },

  strength: {
    pl: "Siła",
    en: "Strength"
  },

  dexterity: {
    pl: "Zręczność",
    en: "Dexterity"
  },

  vitality: {
    pl: "Witalność",
    en: "Vitality"
  },

  stamina_percent: {
    pl: "% Stamina",
    en: "% Stamina"
  },

  energy_flat: {
    pl: "Energia",
    en: "Energy"
  },

  attack_speed_percent: {
    pl: "% Szybkość Ataku",
    en: "% Attack Speed"
  },

  attack_speed: {
    pl: "Szybkość Ataku",
    en: "Attack Speed"
  },
  
  life_on_hit: {
    pl: "Życie za Trafienie",
    en: "Life on Hit"
  },

  life_percent: {
    pl: "% Życie",
    en: "% Life"
  },
  
  life_regen_flat: {
    pl: "Regeneracja życia / sek.",
    en: "Life Regeneration / sec"
  },

  stamina_regen_flat: {
    pl: "Regeneracja staminy",
    en: "Stamina Regeneration"
  },

  stamina_regen_percent: {
    pl: "% Regeneracji staminy",
    en: "% Stamina Regeneration"
  },

  energy_regen_percent: {
    pl: "% Regeneracji energii",
    en: "% Energy Regeneration"
  },

  crit_chance: {
    pl: "% Szansa na krytyk",
    en: "% Critical Chance"
  },

  crit_damage: {
    pl: "% Obrażenia krytyczne",
    en: "% Critical Damage"
  },

  block_chance: {
    pl: "% Szansa na blok",
    en: "% Block Chance"
  },

  block: {
    pl: "Blok",
    en: "Block"
  },
  
  phys_damage_reduction: {
    pl: "% Redukcji obrażeń fizycznych",
    en: "% Physical Damage Reduction"
  },

  dodge_chance: {
    pl: "% Unik",
    en: "% Dodge Chance"
  },

  dodge_cost_reduction: {
    pl: "% Koszt uniku",
    en: "% Dodge Cost"
  },

  move_cost_reduction: {
    pl: "% Koszt ruchu",
    en: "% Movement Cost"
  },

  move_speed_percent: {
    pl: "% Szybkość Ruchu",
    en: "% Movement Speed"
  },
  
  slow_reduction_percent: {
    pl: "% Redukcja Spowolnień",
    en: "% Slow Reduction"
  },
  
  perfect_block_window: {
    pl: "% Okno perfekcyjnego bloku",
    en: "% Perfect Block Window"
  },

  energy_on_perfect_block: {
    pl: "% Energii za idealny blok",
    en: "% Energy for perfect block"
  },

  energy_on_crit: {
    pl: "% Energii za krytyczny atak",
    en: "% Energy for critic attack"
  },
  
  magic_find: {
    pl: "% Znajdowanie magicznych przedmiotów",
    en: "% Magic Find"
  },

  gold_bonus: {
    pl: "% Premii do złota",
    en: "% Gold Bonus"
  },

  elemental_resist: {
    pl: "Odporność na {element}",
    en: "{element} Resistance"
  },

  all_resist: {
    pl: "Odporność na wszystkie żywioły",
    en: "All Elemental Resistances"
  },

  res_fire: {
    pl: "Odporność na Ogień",
    en: "Fire Resistance"
  },

  res_cold: {
    pl: "Odporność na Zimno",
    en: "Cold Resistance"
  },

  res_poison: {
    pl: "Odporność na Truciznę",
    en: "Poison Resistance"
  },

  res_arcane: {
    pl: "Odporność na Magię",
    en: "Arcane Resistance"
  },
  
  stamina_flat: {
    pl: "Stamina",
    en: "Stamina"
  },
  
  heal_percent: {
    pl: "% Leczenie",
    en: "% Heal"
  },
  
  energy_meal_cooldown: {
    pl: "Sytość",
    en: "Satiety"
  },
  
  
  
};


const ELEMENT_TRANSLATIONS = {
  fire: { pl: "Ogień", en: "Fire" },
  cold: { pl: "Zimno", en: "Cold" },
  poison: { pl: "Trucizna", en: "Poison" },
  arcane: { pl: "Magia", en: "Arcane" }
};



function tAffix(id) {
  return AFFIX_TRANSLATIONS[id]?.[currentLang] || id;
}

const LEGACY_AFFIX_MAP = {
  "% Pancerz": "armor_percent",
  "% Obrażenia": "damage_percent",
  " Życie": "flat_life",
  " Obrażenia od Żywiołów": "elemental_damage",
  " Siła": "strength",
  " Zręczność": "dexterity",
  " Witalność": "vitality",
  " Stamina": "stamina_percent",
  " Energia": "energy_flat",
  "% Krytyczny Atak": "crit_chance",
  "% Obrażenia Krytyczne": "crit_damage",
  "% Szansa na Blok": "block_chance",
  "% Unik": "dodge_chance",
  "% Znajdowanie Magicznych Przedmiotów": "magic_find",
  "% Premii do Złota": "gold_bonus",
  " Odporność na Żywioł": "elemental_resist"
};

function migrateAffix(stat) {
  if (stat.id) return stat;

  const id = LEGACY_AFFIX_MAP[stat.nazwa];

  return {
    id: id || "unknown",
    value: stat.wartosc
  };
}

function getAffixId(stat) {
  return stat.id || LEGACY_AFFIX_MAP[stat.nazwa] || stat.nazwa;
}

function getAffixName(id) {
  return AFFIX_TRANSLATIONS[currentLang][id] || id;
}

const LEGENDARY_NAME_MAP = {
  
// =====================
// SHORT SWORD
// =====================

  legend_short_sword_stormblade: {
    pl: "Miecz Burzy",
    en: "Stormblade"
  },

  legend_short_sword_blade_will: {
    pl: "Wola Ostrza",
    en: "Blade's Will"
  },

  legend_short_sword_death_silence: {
    pl: "Cisza Śmierci",
    en: "Silence of Death"
  },

// =====================
// LONG SWORD
// =====================

  legend_long_sword_tracker: {
    pl: "Tropiciel",
    en: "Tracker"
  },

  legend_long_sword_shadow_tongue: {
    pl: "Język Cieni",
    en: "Tongue of Shadows"
  },

  legend_long_sword_light_piercer: {
    pl: "Przeszywacz Światła",
    en: "Lightpiercer"
  },

// =====================
// AXE
// =====================

  legend_axe_hunger_reaper: {
    pl: "Siepacz Głodu",
    en: "Hunger Reaper"
  },

  legend_axe_blood_whisper: {
    pl: "Szept Krwi",
    en: "Blood Whisper"
  },

  legend_axe_viking_wrath: {
    pl: "Gniew Wikinga",
    en: "Viking's Wrath"
  },

// =====================
// HAMMER
// =====================

  legend_hammer_titanbane: {
    pl: "Zguba Tytanów",
    en: "Titanbane"
  },

  legend_hammer_final_judgement: {
    pl: "Młot Ostateczny",
    en: "Final Hammer"
  },

  legend_hammer_stone_fury: {
    pl: "Furia Kamienia",
    en: "Stone Fury"
  },

// =====================
// MACE
// =====================

  legend_mace_betrayal_bone: {
    pl: "Kość Zdrady",
    en: "Bone of Betrayal"
  },

  legend_mace_undead_slayer: {
    pl: "Pogromca Umarłych",
    en: "Undead Slayer"
  },

  legend_mace_fist_of_vengeance: {
    pl: "Pięść Zemsty",
    en: "Fist of Vengeance"
  },

// =====================
// ROUND SHIELD
// =====================

  legend_round_shield_bastion_eye: {
    pl: "Oko Bastionu",
    en: "Eye of the Bastion"
  },

  legend_round_shield_oath_circle: {
    pl: "Krąg Przysięgi",
    en: "Circle of Oath"
  },

  legend_round_shield_loyal_guard: {
    pl: "Tarcza Wierności",
    en: "Shield of Loyalty"
  },

// =====================
// BUCKLER
// =====================

  legend_buckler_night_guard: {
    pl: "Strażnik Nocy",
    en: "Night Guard"
  },

  legend_buckler_hand_of_justice: {
    pl: "Dłoń Sprawiedliwości",
    en: "Hand of Justice"
  },

  legend_buckler_spark_of_hope: {
    pl: "Iskra Nadziei",
    en: "Spark of Hope"
  },

// =====================
// KALKAN
// =====================

  legend_kalkan_giant_rib: {
    pl: "Żebro Giganta",
    en: "Giant's Rib"
  },

  legend_kalkan_mirror_of_pain: {
    pl: "Lustro Cierpienia",
     en: "Mirror of Pain"
  },

  legend_kalkan_armor_of_fear: {
    pl: "Pancerz Strachu",
    en: "Armor of Fear"
  },  

// =====================
// TRIANGLE SHIELD
// =====================

  legend_triangle_shield_wall_of_undead: {
    pl: "Mur Nieumarłych",
    en: "Wall of the Undead"
  },

  legend_triangle_shield_bastion_heart: {
    pl: "Serce Bastionu",
    en: "Heart of the Bastion"
  },

  legend_triangle_shield_last_protection: {
    pl: "Ochrona Ostatnich",
    en: "Last Protection"
  },

// =====================
// LEATHER
// =====================

  legend_leather_shadow_skin: {
    pl: "Skóra Cienia",
    en: "Shadow Skin"
  },  

  legend_leather_wolf_breath: {
    pl: "Oddech Wilka",
    en: "Wolf's Breath"
  },
  
  legend_leather_bloody_trail: {
    pl: "Krwawy Trop",
    en: "Bloody Trail"
  },

// =====================
// CHAINMAIL
// =====================

  legend_chainmail_dark_claw: {
    pl: "Pazur Mroku",
    en: "Claw of Darkness"
  },

  legend_chainmail_spider_weave: {
    pl: "Pajęczy Splot",
    en: "Spider Weave"
  },
 
  legend_chainmail_thorn_steel: {
    pl: "Stal Cierni",
    en: "Thornsteel"
  },

// =====================
// PLATE
// =====================

  legend_plate_earth_core: {
    pl: "Opoka Ziemi",
    en: "Earth Core"
  },

  legend_plate_echo_of_war: {
   pl: "Echo Wojny",
    en: "Echo of War"
  },

  legend_plate_kings_armor: {
    pl: "Zbroja Królów",
    en: "Armor of Kings"
  }, 

// =====================
// CHESTPLATE
// =====================

  legend_chestplate_carved_dawn: {
    pl: "Rzeźbiony Świt",
    en: "Carved Dawn"
  },

  legend_chestplate_last_bastion: {
    pl: "Ostatni Bastion",
    en: "Last Bastion"
  },

  legend_chestplate_mark_of_power: {
    pl: "Znak Władzy",
    en: "Mark of Power"
  },

// =====================
// HELMET
// =====================

  legend_helmet_void_crown: {
    pl: "Korona Pustki",
    en: "Void Crown"
  },

  legend_helmet_whispers: {
    pl: "Hełm Szeptów",
    en: "Helm of Whispers"
  },

  legend_helmet_ancestral_vision: {
    pl: "Widzenie Przodków",
    en: "Ancestral Vision"
  },

// =====================
// SHOULDER
// =====================

  legend_shoulder_arm_of_wrath: {
    pl: "Ramie Gniewu",
    en: "Arm of Wrath"
  },

  legend_shoulder_guard: {
    pl: "Strażnik Ramienia",
    en: "Shoulder Guard"
  },

  legend_shoulder_narok: {
    pl: "Narok",
    en: "Narok"
  },  

// =====================
// BRACERS
// =====================

  legend_bracers_war_scars: {
    pl: "Skaleczenia Wojny",
    en: "Scars of War"
  },

  legend_bracers_earth_bind: {
    pl: "Oplot Ziemi",
    en: "Earth Bind"
  }, 

  legend_bracers_will_lock: {
    pl: "Zamknięcie Woli",
    en: "Will Lock"
  },

// =====================
// GLOVES
// =====================

  legend_gloves_grip_of_power: {
    pl: "Chwyt Mocy",
    en: "Grip of Power"
  }, 

  legend_gloves_mist_hand: {
    pl: "Dłoń Mgły",
    en: "Mist Hand"
  },

  legend_gloves_bone_claw: {
    pl: "Kościana Łapa",
    en: "Bone Claw"
  },

// =====================
// BELT
// =====================

  legend_belt_protection_ring: {
    pl: "Krąg Ochrony",
    en: "Ring of Protection"
  },

  legend_belt_flamebound: {
    pl: "Pas Rozpłomieniony",
    en: "Flamebound Belt"
  },

  legend_belt_fate_weave: {
    pl: "Splot Opatrzności",
    en: "Fate Weave"
  },

// =====================
// PANTS
// =====================

  legend_pants_call_leggings: {
    pl: "Nogawice Zewu",
    en: "Leggings of the Call"
  },

  legend_pants_shadow_step: {
    pl: "Krok Cienia",
    en: "Shadow Step"
  },

  legend_pants_wolf_stride: {
    pl: "Wilczy Marsz",
    en: "Wolf Stride"
  },
  
// =====================
// BOOTS
// =====================

  legend_boots_wind_steps: {
    pl: "Stopy Wichru",
    en: "Steps of the Wind"
  },

  legend_boots_dance_of_wrath: {
    pl: "Taniec Gniewu",
    en: "Dance of Wrath"
  },

  legend_boots_void_step: {
    pl: "Krok Pustki",
    en: "Void Step"
  },

// =====================
// GENERIC
// =====================

  legend_armor_oath: {
    pl: "Zbroja Przysięgi",
    en: "Armor of Oath"
  },

  legend_armor_iron_soul: {
    pl: "Żelazna Dusza",
    en: "Iron Soul"
  },

  legend_armor_glory: {
   pl: "Pancerz Chwały",
   en: "Armor of Glory"
  },

  legend_shield_last_guard: {
    pl: "Tarcza Ostatniego",
    en: "Last Guard"
  },

  legend_shield_gatekeeper: {
    pl: "Wrota Opiekuna",
    en: "Gatekeeper"
  },

  legend_shield_exile_watch: {
    pl: "Straż Wygnańca",
    en: "Exile's Watch"
  },

  legend_weapon_horror_blade: {
    pl: "Ostrze Okropieństwa",
    en: "Blade of Horror"
  }, 

  legend_weapon_war_wrath: {
    pl: "Gniew Wojny",
    en: "Wrath of War"
  },

  legend_weapon_blood_legacy: {
    pl: "Dziedzictwo Krwi",
   ben: "Blood Legacy"
  },
  
  legend_relic_world: {
    pl: "Relikt Świata",
    en: "Relic of the World"
  },

  legend_artifact_power: {
    pl: "Artefakt Mocy",
    en: "Artifact of Power"
  },

  legend_gift_of_gods: {
    pl: "Dar Bogów",
    en: "Gift of the Gods"
  }
  
};


Object.assign(LANG.en, {
  rarity_common: "Common",
  rarity_rare: "Rare",
  rarity_unique: "Unique",
  rarity_epic: "Epic",
  rarity_legendary: "Legendary",

  type_weapon: "Weapon",
  type_helmet: "Helmet",
  type_armor: "Armor",
  type_boots: "Boots",

  required_level: "Required Level",
  two_handed: "Two Handed",
  
  item_implicit_title: "IMPLICIT",
  bonuses_title: "AFFIXES",
  weapon_style_title: "COMBAT STYLE", 
  exclusive_title: "EXCLUSIVE",

  
  style_sword_name: "RHYTHM",
  style_sword_desc: "Build momentum and unleash increasingly powerful strikes",
  style_sword_mech: "Every 3rd hit: +50% damage",

  style_axe_name: "BLEED",
  style_axe_desc: "You inflict wounds that deepen over time",
  style_axe_mech: "Applies a bleeding effect",

  style_longsword_name: "PRECISION",
  style_longsword_desc: "Perfect timing rewards your strikes",
  style_longsword_mech: "Perfect Block empowers your next attack<br>Every 3rd hit: partially ignores armor",

  style_mace_name: "CONTROL",
  style_mace_desc: "Disrupt the enemy’s tempo",
  style_mace_mech: "Every 3rd hit: delays enemy attacks",

  style_doubleaxe_name: "BLOOD FRENZY",
  style_doubleaxe_desc: "Tear into your enemy, deepening wounds",
  style_doubleaxe_mech: "Successive hits amplify bleeding<br>Perfect timing unleashes a powerful strike",

  style_hammer_name: "BREAKTHROUGH",
  style_hammer_desc: "Shatter the enemy’s balance",
  style_hammer_mech: "Hits weaken balance and can interrupt attacks",

  style_spear_name: "TIME CONTROL",
  style_spear_desc: "Keep the enemy under constant pressure",
  style_spear_mech: "Successive hits amplify slow<br>Well-timed hits extend the effect",

  style_greatsword_name: "PIERCE",
  style_greatsword_desc: "Break through defenses and expose weaknesses",
  style_greatsword_mech: "Well-timed strikes pierce defenses",
  

  affix_titan_skin_name: "Titan Skin",
  affix_titan_skin_desc: "When your Health drops below 40%, Armor is increased by 30%.",

  affix_survival_instinct_name: "Survival Instinct",
  affix_survival_instinct_desc: "When your Health drops below 40%, Elemental Resistances increase by 25%.",

  affix_untouched_form_name: "Untouched Form",
  affix_untouched_form_desc: "While at full Health, you take 15% reduced damage.",

  affix_retribution_shield_name: "Retribution Shield",
  affix_retribution_shield_desc: "On a successful block: 30% chance to reflect damage to the attacker.",

  affix_iron_response_name: "Iron Response",
  affix_iron_response_desc: "On a successful block: 20% chance the next hit deals 30% reduced damage.",

  affix_flurry_name: "Flurry",
  affix_flurry_desc: "On hit: +10% Attack Speed for 3 seconds (stacks up to 3 times).",

  affix_relentless_precision_name: "Relentless Precision",
  affix_relentless_precision_desc: "Critical hits ignore 20% of the target's Armor.",

  affix_accelerated_mind_name: "Accelerated Mind",
  affix_accelerated_mind_desc: "Skill cooldowns are reduced by 15%.",

  affix_echo_strike_name: "Echo Strike",
  affix_echo_strike_desc: "10% chance for your attack to strike again for 50% damage.",

  affix_touch_of_greed_name: "Touch of Greed",
  affix_touch_of_greed_desc: "Enemies have a 25% chance to drop additional gold.",

  affix_relic_hunter_name: "Relic Hunter",
  affix_relic_hunter_desc: "+15% Magic Find.",

  affix_unyielding_name: "Unyielding",
  affix_unyielding_desc: "When you would take lethal damage, you instead survive with 1 HP (60s cooldown).",

  affix_last_breath_name: "Last Breath",
  affix_last_breath_desc: "Penalties from low Energy are reduced by 50%.",

  
  short_sword: "Short Sword",
  long_sword: "Longsword",
  great_sword: "Greatsword",
  double_axe: "Double Axe",
  spear: "Spear",
  axe: "Axe",
  hammer: "Hammer",
  mace: "Mace",

  round_shield: "Round Shield",
  buckler: "Buckler",
  kalkan: "Kalkan",
  triangle_shield: "Triangular Shield",

  leather_armor: "Leather Armor",
  chainmail: "Chainmail",
  plate_armor: "Plate Armor",
  chestplate: "Chestplate",

  helmet: "Helmet",
  shoulder: "Shoulder",
  bracers: "Bracers",
  gloves: "Gloves",
  belt: "Belt",
  pants: "Pants",
  boots: "Boots",
  
  
  map: "Map",
  north_map_final: "North Map (Final)",
  north_map: "North Map",
  totem: "Totem",
  river_totem: "Totem of River",
  map_fragment: "Fragment of Map",
  chronicles: "Chronicles",
  old_chronicles: "Chronicles of Elders",
  key: "Key",
  library_key: "Libraries Key",
  feather: "Feather",
  elwen_feather: "Captain Elwen's Feather",
  stone: "Stone",
  runic_stone: "Runic Stone",

  
  heal_potion: "Heal Potion",
  bread: "Bread",
  meal: "Meal",
  
  prefix_agile: "Agile",
  prefix_mighty: "Mighty",
  prefix_enchanted: "Enchanted",
  prefix_forgotten: "Forgotten",
  prefix_empowered: "Empowered",
  prefix_bloody: "Bloody",
  prefix_eternal: "Eternal",
  prefix_dark: "Dark",
  prefix_shining: "Shining",
  prefix_runic: "Runic",
  prefix_ominous: "Ominous",
  prefix_heroic: "Heroic",
  prefix_black: "Black",
  prefix_draconic: "Draconic",
  prefix_blessed: "Blessed",

  // SUFFIXES
  suffix_wrath: "of Wrath",
  suffix_fire: "of Fire",
  suffix_master: "of the Master",
  suffix_last_light: "of the Last Light",
  suffix_wind: "of the Wind",
  suffix_shadow: "of Shadow",
  suffix_blood: "of Blood",
  suffix_darkness: "of Darkness",
  suffix_void: "of the Void",
  suffix_wolf: "of the Wolf",
  suffix_storm: "of Storms",
  suffix_vengeance: "of Vengeance",
  suffix_immortality: "of Immortality",
  suffix_ancestors: "of the Ancestors",
  suffix_apocalypse: "of the End"
  
  
  
});

Object.assign(LANG.pl, {
  rarity_common: "Pospolity",
  rarity_rare: "Rzadki",
  rarity_unique: "Unikatowy",
  rarity_epic: "Epicki",
  rarity_legendary: "Legendarny",

  type_weapon: "Broń",
  type_helmet: "Hełm",
  type_armor: "Zbroja",
  type_boots: "Buty",

  required_level: "Wymagany Poziom",
  two_handed: "Broń Dwuręczna",
  
  item_implicit_title: "CECHA PRZEDMIOTU",
  bonuses_title: "BONUSY",
  weapon_style_title: "STYL WALKI",
  exclusive_title: "EKSKLUZYWNE",

  
  style_sword_name: "RYTM",
  style_sword_desc: "Buduj tempo walki i wyprowadzaj coraz silniejsze uderzenia",
  style_sword_mech: "Co 3 uderzenie: +50% obrażeń",

  style_axe_name: "KRWAWIENIE",
  style_axe_desc: "Zadajesz rany, które się pogłębiają",
  style_axe_mech: "Nakłada efekt krwawienia",

  style_longsword_name: "PRECYZJA",
  style_longsword_desc: "Nagradzany jesteś za idealne wyczucie momentu",
  style_longsword_mech: "Idealny blok wzmacnia następny atak<br>Co 3 uderzenie: częściowo ignoruje pancerz",

  style_mace_name: "KONTROLA",
  style_mace_desc: "Zakłócasz tempo przeciwnika",
  style_mace_mech: "Co 3 uderzenie: opóźnia ataki wroga",

  style_doubleaxe_name: "EKSTAZA KRWI",
  style_doubleaxe_desc: "Rozcinasz przeciwnika, pogłębiając rany",
  style_doubleaxe_mech: "Kolejne trafienia wzmacniają krwawienie<br>Idealne trafienie wyzwala potężne cięcie",

  style_hammer_name: "PRZEŁAMANIE",
  style_hammer_desc: "Wytrącasz przeciwnika z równowagi",
  style_hammer_mech: "Trafienia osłabiają równowagę wroga i mogą przerwać jego atak",

  style_spear_name: "KONTROLA CZASU",
  style_spear_desc: "Utrzymujesz przeciwnika pod ciągłą presją",
  style_spear_mech: "Kolejne trafienia wzmacniają spowolnienie<br>Trafienia w odpowiednim momencie wydłużają efekt",

  style_greatsword_name: "PRZEBICIE",
  style_greatsword_desc: "Rozbijasz obronę przeciwnika",
  style_greatsword_mech: "Uderzenie w odpowiednim momencie przebija obronę",


  affix_titan_skin_name: "Skóra Tytana",
  affix_titan_skin_desc: "Gdy twoje Życie spadnie poniżej 40%, Pancerz zwiększa się o 30%.",

  affix_survival_instinct_name: "Instynkt Przetrwania",
  affix_survival_instinct_desc: "Gdy twoje Życie spadnie poniżej 40%, Odporności na Żywioły zwiększają się o 25%.",

  affix_untouched_form_name: "Nienaruszona Forma",
  affix_untouched_form_desc: "Gdy masz pełne Życie, otrzymujesz o 15% mniej obrażeń.",

  affix_retribution_shield_name: "Tarcza Odwetu",
  affix_retribution_shield_desc: "Po udanym bloku: 30% szansy na odbicie obrażeń do atakującego.",

  affix_iron_response_name: "Żelazna Odpowiedź",
  affix_iron_response_desc: "Po udanym bloku: 20% szansy, że następny otrzymany cios zada o 30% mniej obrażeń.",

  affix_flurry_name: "Szał Uderzeń",
  affix_flurry_desc: "Po trafieniu przeciwnika: +10% Szybkości Ataku na 3 sekundy (maks. 3 ładunki).",

  affix_relentless_precision_name: "Bezlitosna Precyzja",
  affix_relentless_precision_desc: "Krytyczne trafienia ignorują 20% Pancerza celu.",

  affix_accelerated_mind_name: "Przyspieszone Myśli",
  affix_accelerated_mind_desc: "Czas odnowienia umiejętności skrócony o 15%.",

  affix_echo_strike_name: "Echo Ciosu",
  affix_echo_strike_desc: "10% szansy, że atak uderzy drugi raz z 50% obrażeń.",

  affix_touch_of_greed_name: "Dotyk Chciwości",
  affix_touch_of_greed_desc: "Zabici przeciwnicy mają 25% szansy upuścić dodatkowe złoto.",

  affix_relic_hunter_name: "Łowca Reliktów",
  affix_relic_hunter_desc: "+15% do znajdowania Magicznych Przedmiotów.",

  affix_unyielding_name: "Nieugięty",
  affix_unyielding_desc: "Gdy otrzymasz śmiertelny cios, zamiast tego zostajesz z 1 HP (60s odnowienia).",

  affix_last_breath_name: "Hart Ostatniego Tchu",
  affix_last_breath_desc: "Osłabienie przy niskiej energii jest zmniejszone o 50%.",

  
  short_sword: "Krótki Miecz",
  long_sword: "Długi Miecz",
  great_sword: "Wielki Miecz",
  double_axe: "Podwójny Topór",
  spear: "Włócznia",
  axe: "Topór",
  hammer: "Młot",
  mace: "Buława",

  round_shield: "Okrągła Tarcza",
  buckler: "Puklerz",
  kalkan: "Kałkan",
  triangle_shield: "Trójkątna Tarcza",

  leather_armor: "Zbroja Skórzana",
  chainmail: "Kolczuga",
  plate_armor: "Zbroja Płytowa",
  chestplate: "Napierśnik",

  helmet: "Hełm",
  shoulder: "Naramiennik",
  bracers: "Karwasze",
  gloves: "Rękawice",
  belt: "Pas",
  pants: "Spodnie",
  boots: "Buty",
  
  map: "Mapa",
  north_map_final: "Mapa Północy (Finałowa)",
  north_map: "Mapa Północy",
  totem: "Totem",
  river_totem: "Totem Rzeki",
  map_fragment: "Fragment Mapy",
  chronicles: "Zapiski",
  old_chronicles: "Zapiski Starszych",
  key: "Klucz",
  library_key: "Klucz do Biblioteki",
  feather: "Pióro",
  elwen_feather: "Pióro Kapitana Elwena",
  stone: "Kamień",
  runic_stone: "Runiczny Kamień",

  
  heal_potion: "Mikstura Leczenia",
  bread: "Chleb",
  meal: "Posiłek",
    
  
  prefix_agile: "Zwinny",
  prefix_mighty: "Potężny",
  prefix_enchanted: "Zaklęty",
  prefix_forgotten: "Zapomniany",
  prefix_empowered: "Wzmocniony",
  prefix_bloody: "Krwawy",
  prefix_eternal: "Wieczny",
  prefix_dark: "Mroczny",
  prefix_shining: "Błyszczący",
  prefix_runic: "Runiczny",
  prefix_ominous: "Złowrogi",
  prefix_heroic: "Heroiczny",
  prefix_black: "Czarny",
  prefix_draconic: "Smoczy",
  prefix_blessed: "Błogosławiony",
  
  suffix_wrath: "Gniewu",
  suffix_fire: "Ognia",
  suffix_master: "Mistrza",
  suffix_last_light: "Ostatniego światła",
  suffix_wind: "Wichru",
  suffix_shadow: "Cienia",
  suffix_blood: "Krwi",
  suffix_darkness: "Mroku",
  suffix_void: "Pustki",
  suffix_wolf: "Wilka",
  suffix_storm: "Burzy",
  suffix_vengeance: "Zemsty",
  suffix_immortality: "Nieśmiertelności",
  suffix_ancestors: "Przodków",
  suffix_apocalypse: "Końca Świata",
  
  
  
});