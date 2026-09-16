const GUIDE_SECTIONS = [

 /*{
  id: "combat",
  title: "Walka",
  icon: "",
  content: `
    <p>
      Walka to pojedynek jeden na jeden z przeciwnikiem. Każdy wróg posiada
      własną charakterystykę oraz unikalną umiejętność, która wyróżnia go
      na tle pozostałych przeciwników.
    </p>

    <p>
      Walka odbywa się w czasie rzeczywistym i nie jest podzielona na tury.
      Celem jest pokonanie przeciwnika, zanim sam zostaniesz pokonany.
    </p>

    <h3>Fazy walki</h3>

    <p>
      Przeciwnik działa w dwóch fazach. Po wykonaniu akcji rozpoczyna
      <strong>Czas Odnowienia</strong>, czyli przerwę przed
      rozpoczęciem kolejnej akcji. Następnie przechodzi do
      <strong>Zamachu</strong>, podczas którego przygotowuje
      konkretną akcję do wykonania.
    </p>

    <p>
      To właśnie podczas zamachu możesz rozpoznać zamiar przeciwnika
      i odpowiednio zareagować.
    </p>

    <h3>Akcje gracza</h3>

    <p>
      Gracz może wykonywać działania niezależnie od fazy przeciwnika.
      Atak bronią w prawej ręce oraz obrona tarczą w lewej ręce posiadają
      własny czas odnowienia.
    </p>

    <h3>Akcje przeciwnika</h3>

    <p>
      Przeciwnik może wykonać jedną z pięciu podstawowych akcji:
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">⚔ ATAK</div>
      <div class="guide-tip-text">
        Standardowy zamach zadający podstawowe obrażenia.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">⚔ CIĘŻKI ATAK</div>
      <div class="guide-tip-text">
        Wolniejszy zamach, który zadaje zwiększone obrażenia.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">🛡 GARDA</div>
      <div class="guide-tip-text">
        Wróg nie atakuje, lecz staje się bardziej odporny na obrażenia
        zadawane przez gracza.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">⚡ SZARŻA</div>
      <div class="guide-tip-text">
        Wróg przygotowuje wzmocniony kolejny atak. Po szarży jego następny
        atak jest szybszy i zadaje zwiększone obrażenia.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">✦ UMIEJĘTNOŚĆ</div>
      <div class="guide-tip-text">
        Specjalna akcja zależna od przeciwnika. Czas zamachu oraz efekt
        umiejętności zależą od rodzaju używanej umiejętności.
      </div>
    </div>
  
    <h3>Pauza / Ucieczka</h3>

    <p>
      Podczas walki możesz skorzystać ze specjalnego przycisku, który zatrzymuje
      akcję i pozwala zdecydować, czy chcesz opuścić starcie.
    </p>

    <p>
     Odejście z walki kosztuje <strong>złoto i energię</strong>, a jego powodzenie
     nie jest gwarantowane. W przypadku niepowodzenia przeciwnik natychmiast
     reaguje <strong>kontratakiem</strong>.
    </p> 
  
    <h3>Stan Krytyczny</h3>

    <p>
      Gdy zdrowie bohatera spadnie do <strong>0</strong>, walka nie kończy się
      natychmiast. Rozpoczyna się <strong>Stan Krytyczny</strong> — ostatnia
      szansa na uniknięcie śmierci.
    </p>

    <p>
      Przeciwnik rozpoczyna <strong>dobicie</strong>, a bohater otrzymuje
      ostatnią możliwość wykonania swojej głównej mechaniki dyscypliny.
      Aby przetrwać, musisz wykonać ją perfekcyjnie w odpowiednim momencie.
    </p>

    <p>
      Sposób przetrwania zależy od używanej dyscypliny. Obrońca i Perfekcjonista
      muszą wykonać <strong>Idealny Blok</strong>, odpierając śmiertelny cios
      za pomocą tarczy. Berserker, Strażnik i inne dyscypliny wykorzystują
      własne mechaniki oraz ich <strong>idealne okno</strong>.
    </p>

    <p>
      W Stanie Krytycznym wyzwanie jest większe niż podczas zwykłej walki.
      Wskaźniki związane z mechaniką dyscypliny poruszają się szybciej,
      pozostawiając mniej czasu na reakcję.
    </p>

    <p>
      W odpowiednim momencie możesz również wykorzystać
      <strong>miksturę</strong>, jeśli posiadasz ją w ekwipunku.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">OSTATNIA DESKA RATUNKU</div>
      <div class="guide-tip-text">
        Gdy zdrowie spadnie do 0, masz ostatnią szansę na przetrwanie.
        Wykonaj perfekcyjnie główną mechanikę swojej dyscypliny albo
        użyj mikstury. Jeśli zawiedziesz, nastąpi śmierć.
      </div>
    </div>

    <h3>Śmierć</h3>

    <p>
      Jeśli nie uda Ci się przetrwać Stanu Krytycznego, bohater umiera
      i zostaje przeniesiony do miasta lub na pierwszy krok lokacji,
      zależnie od miejsca rozpoczęcia podróży.
    </p>

    <p>
      Śmierć ma również swoją cenę. Tracisz część posiadanego
      <strong>złota</strong>, a przez kolejne <strong>2 walki</strong>
      otrzymujesz <strong>-10% do statystyk</strong>.
    </p>
  `
  },*/

  {
  id: "combat",
  title: "guide_combat_title",
  icon: "",
  content: () =>  `
    <p>
      ${t("guide_combat_intro_1")}
    </p>

    <p>
      ${t("guide_combat_intro_2")}
    </p>

    <h3>${t("guide_combat_phases_title")}</h3>

    <p>
      ${t("guide_combat_phases_1")}
    </p>

    <p>
      ${t("guide_combat_phases_2")}
    </p>

    <h3>${t("guide_combat_player_actions_title")}</h3>

    <p>
      ${t("guide_combat_player_actions")}
    </p>

    <h3>${t("guide_combat_enemy_actions_title")}</h3>

    <p>
      ${t("guide_combat_enemy_actions_intro")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_attack_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_attack_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_heavy_attack_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_heavy_attack_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_guard_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_guard_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_charge_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_charge_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_combat_skill_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_combat_skill_desc")}
      </div>
    </div>
  
    <h3>${t("guide_combat_pause_escape_title")}</h3>

    <p>
      ${t("guide_combat_pause_escape_1")}
    </p>

    <p>
      ${t("guide_combat_pause_escape_2")}
    </p> 
  
    <h3>${t("guide_combat_critical_state_title")}</h3>

    <p>
      ${t("guide_combat_critical_state_1")}
    </p>

    <p>
      ${t("guide_combat_critical_state_2")}
    </p>

    <p>
      ${t("guide_combat_critical_state_3")}
    </p>

    <p>
      ${t("guide_combat_critical_state_4")}
    </p>

    <p>
      ${t("guide_combat_critical_state_5")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_combat_last_chance_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_combat_last_chance_desc")}
      </div>
    </div>

    <h3>${t("guide_combat_death_title")}</h3>

    <p>
      ${t("guide_combat_death_1")}
    </p>

    <p>
      ${t("guide_combat_death_2")}
    </p>
  `
  },

/*  {
  id: "timing",
  title: "Precyzja",
  icon: "",
  content: `
    <p>
      Każda dyscyplina walki opiera się na stylu przypisanym do danej broni
      i posiada własną, unikalną mechanikę walki.
    </p>

    <p>
      Wiele broni wykorzystuje specjalne mini-gry wymagające odpowiedniego
      wyczucia czasu. Trafienie w odpowiednim momencie pozwala osiągnąć
      <strong>Idealne Trafienie</strong> i uzyskać dodatkową korzyść podczas walki.
    </p>

    <h3>Precyzja</h3>

    <p>
      Im lepiej wyczujesz moment wykonania akcji, tym większą przewagę możesz
      uzyskać. Perfekcyjne wykonanie może wzmacniać działanie mechaniki,
      zwiększać jej efekty lub odblokowywać dodatkowe możliwości.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">◈ Idealne Trafienie</div>
      <div class="guide-tip-text">
        Perfekcyjne wykonanie akcji pozwala w pełni wykorzystać potencjał
        mechaniki danej broni.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">◈ Normalne Trafienie</div>
      <div class="guide-tip-text">
        Za Normalne trafienie gracz otrzymuje mniejsze wzmocnienie, lub utrzumuje działanie mechaniki.
      </div>
    </div>

   <div class="guide-tip">
      <div class="guide-tip-title">◈ Chybienie</div>
      <div class="guide-tip-text">
        Chybienie nie daje żadnych korzyści, czasem zrywa ciąglość mechaniki i wiąże się z konksekwencją
        charakterystyczną dla każdej dyscypliny.
      </div>
    </div>

   
    <h3>Unikalne mechaniki</h3>

    <p>
      Każda broń może wykorzystywać Precyzję w inny sposób. Szczegółowe zasady
      działania poszczególnych mechanik znajdziesz w opisach odpowiednich
      dyscyplin walki.
    </p>
  `
  },*/

  {
  id: "timing",
  title: "guide_timing_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_timing_intro_1")}
    </p>

    <p>
      ${t("guide_timing_intro_2")}
    </p>

    <h3>${t("guide_timing_precision_title")}</h3>

    <p>
      ${t("guide_timing_precision")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_timing_perfect_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_timing_perfect_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_timing_normal_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_timing_normal_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("guide_timing_miss_title")}</div>
      <div class="guide-tip-text">
        ${t("guide_timing_miss_desc")}
      </div>
    </div>

    <h3>${t("guide_timing_unique_title")}</h3>

    <p>
      ${t("guide_timing_unique_desc")}
    </p>
  `
  },

/*  {
    id: "defense",
    title: "Blok",
    icon: "",
    content: `
      <p>
        W grze dostępne są dwa rodzaje bloku: <strong>Postawa Obronna</strong>
        oraz <strong>Blok Taktyczny</strong>. Obie techniki pozwalają ograniczyć
        obrażenia, ale wymagają zupełnie innego sposobu gry.
      </p>

      <h3>Postawa Obronna</h3>

      <p>
        Postawa Obronna pozwala utrzymywać tarczę w gotowości przez cały czas.
        Aktywna postawa zużywa <strong>staminę</strong>, ale zmniejsza obrażenia
        otrzymywane od przeciwnika.
      </p>

      <p>
        Skuteczność ochrony zależy od <strong>siły bloku tarczy</strong>.
        Im wyższa wartość bloku, tym większą część obrażeń możesz zredukować.
      </p>

      <p>
        Podczas aktywnej Postawy Obronnej możesz korzystać ze specjalnych
        umiejętności przeznaczonych do walki z tarczą. Zwykłe ataki bronią
        mogą być jednak osłabione podczas blokowania.
      </p>
   
      <div class="guide-tip">
        <div class="guide-tip-title">🛡 POSTAWA OBRONNA</div>
        <div class="guide-tip-text">
          Ciągła ochrona kosztem staminy. Pozwala przetrwać ataki przeciwnika
          i korzystać ze specjalnych umiejętności tarczy.
        </div>
      </div>

      <h3>Blok Taktyczny</h3>
    
      <p>
        Blok Taktyczny wymaga <strong>precyzyjnego wyczucia czasu</strong>.
        Zamiast utrzymywać tarczę, musisz zablokować atak przeciwnika
        w odpowiednim momencie.
      </p>

      <p>
        Idealnie wykonany blok, czyli <strong>Idealny Blok</strong>, całkowicie
        neguje obrażenia ataku.
      </p>

      <p>
        Idealny Blok może również zapewnić dodatkową nagrodę zależną od używanej
        mechaniki. Może ona między innymi osłabić przeciwnika, zagwarantować
        potężne trafienie, ogłuszyć go lub odbić część obrażeń.
      </p>

      <div class="guide-tip">
        <div class="guide-tip-title">◈ IDEALNY BLOK</div>
        <div class="guide-tip-text">
          Zablokuj atak w idealnym momencie, aby całkowicie uniknąć obrażeń
          i uzyskać dodatkową przewagę nad przeciwnikiem.
        </div>
      </div>
   `  
  },*/

  {
  id: "defense",
  title: "guide_defense_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_defense_intro")}
    </p>

    <h3>${t("guide_defense_defensive_stance_title")}</h3>

    <p>
      ${t("guide_defense_defensive_stance_1")}
    </p>

    <p>
      ${t("guide_defense_defensive_stance_2")}
    </p>

    <p>
      ${t("guide_defense_defensive_stance_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_defense_defensive_stance_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_defense_defensive_stance_tip")}
      </div>
    </div>

    <h3>${t("guide_defense_tactical_block_title")}</h3>

    <p>
      ${t("guide_defense_tactical_block_1")}
    </p>

    <p>
      ${t("guide_defense_tactical_block_2")}
    </p>

    <p>
      ${t("guide_defense_tactical_block_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_defense_perfect_block_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_defense_perfect_block_tip")}
      </div>
    </div>
  `
  },

/*  {
  id: "skills",
  title: "Umiejętności",
  icon: "",
  content: `
    <p>
      Umiejętności dzielą się na dwa rodzaje drzewek:
      <strong>aktywne</strong> oraz <strong>pasywne</strong>.
      Oba rozwijają postać w inny sposób i korzystają z różnych
      rodzajów punktów.
    </p>

    <h3>Umiejętności aktywne</h3>

    <p>
      Aktywne umiejętności są bezpośrednio związane ze
      <strong>stylem używanej broni</strong>. Zmiana broni w prawej ręce
      automatycznie zmienia dostępne drzewko aktywnych umiejętności.
    </p>

    <p>
      Do odblokowywania i rozwijania tych umiejętności potrzebne są
      <strong>punkty mistrzostwa</strong>. Zdobywasz je podczas walki,
      korzystając z mechanik charakterystycznych dla danej dyscypliny
      i stylu broni.
    </p>

    <p>
      Każdą umiejętność można rozwijać w jednej z trzech specjalizacji:
      <strong>Wytrzymałość</strong>, <strong>Precyzja</strong> lub
      <strong>Brutalność</strong>. Pozwala to łączyć różne techniki
      i dostosowywać sposób działania umiejętności do własnego stylu gry.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">✦ AKTYWNE DRZEWKO</div>
      <div class="guide-tip-text">
        Zmiana broni zmienia dostępne umiejętności aktywne.
        Rozwijaj je poprzez zdobywanie punktów mistrzostwa podczas walki.
      </div>
    </div>

    <p>
      Niektóre umiejętności wymagają wejścia w określony
      <strong>stan dyscypliny</strong>, aby można było ich użyć.
      Część z nich korzysta również z innych zasobów niż stamina.
    </p>

    <h3>Umiejętności pasywne</h3>

    <p>
      Umiejętności pasywne są wspólne dla wszystkich dyscyplin.
      Ich działanie jest stałe i nie zależy od aktualnie używanej broni.
    </p>

    <p>
      Pasywne drzewko również dzieli się na trzy specjalizacje:
      <strong>Wytrzymałość</strong>, <strong>Precyzja</strong> i
      <strong>Brutalność</strong>.
    </p>

    <p>
      Do jego rozwijania potrzebujesz <strong>punktów umiejętności</strong>,
      zdobywanych poprzez normalny rozwój postaci — między innymi za
      pokonywanie przeciwników i wykonywanie zadań.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">WYTRZYMAŁOŚĆ</div>
      <div class="guide-tip-text">
        Wzmacnia obronę i zwiększa przeżywalność podczas walki.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">PRECYZJA</div>
      <div class="guide-tip-text">
        Udoskonala mechaniki związane z idealnym wyczuciem momentu
        i precyzyjnym wykonywaniem akcji.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">BRUTALNOŚĆ</div>
      <div class="guide-tip-text">
        Zwiększa siłę ofensywną, obrażenia i możliwości zadawania
        trafień krytycznych.
      </div>
    </div>

    <h3>Skupienie</h3>

    <p>
      W drzewku umiejętności można odblokować specjalną zdolność
      <strong>Skupienie</strong>. Po jej aktywowaniu czas podczas walki
      zostaje znacznie spowolniony.
    </p>

    <p>
      Skupienie działa podobnie do efektu <strong>bullet time</strong>
      znanego z gier i filmów. Pozwala na chwilę zwolnić tempo walki,
      dokładniej obserwować sytuację i podjąć właściwą decyzję.
    </p>

    <p>
      Jest szczególnie przydatne w momentach dużej dynamiki, gdy szybka
      reakcja jest trudna. Może również zostać wykorzystane do
      <strong>ugaszenia efektu Spalania</strong> na graczu.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">◈ SKUPIENIE</div>
      <div class="guide-tip-text">
        Spowalnia czas podczas walki, dając chwilę na reakcję
        i podjęcie decyzji. Może również ugasić Spalanie.
      </div>
    </div>
  `
  },*/
  
  {
  id: "skills",
  title: "guide_skills_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_skills_intro")}
    </p>

    <h3>${t("guide_skills_active_title")}</h3>

    <p>
      ${t("guide_skills_active_1")}
    </p>

    <p>
      ${t("guide_skills_active_2")}
    </p>

    <p>
      ${t("guide_skills_active_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ✦ ${t("guide_skills_active_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_active_tip")}
      </div>
    </div>

    <p>
      ${t("guide_skills_active_4")}
    </p>

    <h3>${t("guide_skills_passive_title")}</h3>

    <p>
      ${t("guide_skills_passive_1")}
    </p>

    <p>
      ${t("guide_skills_passive_2")}
    </p>

    <p>
      ${t("guide_skills_passive_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_skills_endurance_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_endurance_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_skills_precision_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_precision_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("guide_skills_brutality_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_brutality_desc")}
      </div>
    </div>

    <h3>${t("guide_skills_focus_title")}</h3>

    <p>
      ${t("guide_skills_focus_1")}
    </p>

    <p>
      ${t("guide_skills_focus_2")}
    </p>

    <p>
      ${t("guide_skills_focus_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ◈ ${t("guide_skills_focus_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("guide_skills_focus_tip")}
      </div>
    </div>
  `
  },

 /* {
  id: "statuses",
  title: "Statusy",
  icon: "",
  content: `
    <p>
      Statusy to efekty, które mogą wzmacniać lub osłabiać gracza
      albo przeciwnika. Ich ikony są widoczne podczas walki i informują
      o aktualnie działających efektach oraz ich czasie trwania.
    </p>

    <h3>Efekty negatywne</h3>

    <div class="guide-status">
      <img data-src="img/icons/mark-icon.png">
      <div>
        <strong>Upiorne Znamię</strong>
        <span>Osłabia gracza, zwiększając otrzymywane obrażenia i wydłużając czas jego ataków.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/bleed-icon.png">
      <div>
        <strong>Krwawienie</strong>
        <span>Powoduje obrażenia w czasie. Efekt może nakładać się na kolejne poziomy.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/burn-icon.png">
      <div>
        <strong>Spalanie</strong>
        <span>Powoduje obrażenia w czasie. Nie nakłada się, ale jego działanie może zostać wzmocnione. Efekt można ugasić lub skrócić jego czas trwania.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/poison-icon.png">
      <div>
        <strong>Trucizna</strong>
        <span>Powoduje obrażenia w czasie. Kolejne poziomy zwiększają obrażenia zadawane przy każdym ticku.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/skill-slow-icon.png">
      <div>
        <strong>Spowolnienie</strong>
        <span>Spowalnia działanie postaci, wydłużając czas odnowienia jej umiejętności i ataków.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/skill-stun-icon.png">
      <div>
        <strong>Ogłuszenie</strong>
        <span>Ogłusza cel, uniemożliwiając mu działanie przez określony czas.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/exhausted-bonus-icon3.png">
      <div>
        <strong>Wyczerpanie</strong>
        <span>Stan wyczerpania spowodowany wyczerpaniem staminy. Ogranicza możliwości dalszego działania.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/vulnerable-bonus-icon2.png">
      <div>
        <strong>Wrażliwość</strong>
        <span>Cel staje się na krótki czas bardziej podatny na trafienia krytyczne.</span>
      </div>
    </div>

    <h3>Efekty bojowe</h3>

    <div class="guide-status">
      <img data-src="img/icons/guard-windup-icon.png">
      <div>
        <strong>Garda</strong>
        <span>Stan wroga związany z mechaniką obrony. Podczas Gardy wróg jest bardziej wytrzymały na ataki gracza.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/charge-windup-icon.png">
      <div>
        <strong>Szarża</strong>
        <span>Wzmocnienie przygotowane do kolejnego ataku.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/spear-control-icon.png">
      <div>
        <strong>Kontrola</strong>
        <span>Poziom kontroli nad przeciwnikiem wynikający z mechaniki dyscypliny włóczni.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/armor-break-icon.png">
      <div>
        <strong>Przebicie Pancerza</strong>
        <span>Osłabia ochronę przeciwnika, zwiększając skuteczność zadawanych mu obrażeń.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/weak-point-bonus-icon.png">
      <div>
        <strong>Słaby Punkt</strong>
        <span>Wskazuje podatny punkt przeciwnika, który może zostać wykorzystany do zwiększenia skuteczności ataku.</span>
      </div>
    </div>

    <h3>Wzmocnienia</h3>
   
    <div class="guide-status">
      <img data-src="img/icons/crit-bonus-icon.png">
      <div>
        <strong>Bonus do Ataku Krytycznego</strong>
        <span>Czasowe zwiększenie szansy na zadanie trafienia krytycznego.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/atkspd-bonus-icon2.png">
      <div>
        <strong>Bonus do Szybkośco Ataku</strong>
        <span>Czasowe zwiększenie szybkości wykonywania ataków.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/dmg-bonus-icon.png">
      <div>
        <strong>Bonus do Obrażeń</strong>
        <span>Czasowe zwiększenie zadawanych obrażeń.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/dmg-reduction-icon.png">
      <div>
        <strong>Bonus do Redukcji Obrażeń</strong>
        <span>Czasowe zmniejszenie otrzymywanych obrażeń.</span>
      </div>
    </div>

    <h3>Mechaniki dyscyplin</h3>

    <p>
      Niektóre ikony reprezentują efekty ściśle związane z konkretnymi
      umiejętnościami lub mechanikami dyscyplin. Ich szczegółowe działanie
      opisane jest bezpośrednio przy odpowiedniej umiejętności.
    </p>

    <div class="guide-status">
      <img data-src="img/icons/bleed-skill-icon.png">
      <div>
        <strong>Krwawy Żniwiarz</strong>
        <span>Specjalny efekt związany z mechaniką Krwawy Żniwiarz. Szczegóły działania znajdziesz w opisie odpowiedniej umiejętności.</span>
      </div>
    </div>
   
    <div class="guide-status">
      <img data-src="img/icons/discipline-bonus-icon.png">
      <div>
        <strong>Dyscyplina Włóczni</strong>
        <span>Status związany z umiejętnością Dyscyplina Włóczni.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/absolute-bonus-icon.png">
      <div>
        <strong>Absolutna Kontrola</strong>
        <span>Status związany z umiejętnością Absolutna Kontrola.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/parry-master-bonus-icon.png">
      <div>
        <strong>Mistrz Parowania</strong>
        <span>Status związany z umiejętnością Mistrz Parowania.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/bastion-bonus-icon.png">
      <div>
        <strong>Ostatni Bastion</strong>
        <span>Status związany z umiejętnością Ostatni Bastion.</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/precision-bonus-icon.png">
      <div>
        <strong>Precyzja</strong>
        <span>Status związany z mechaniką Precyzja. Szczegóły działania znajdziesz w opisie odpowiedniej dyscypliny.</span>
      </div>
    </div>
  `
  },*/

  {
  id: "statuses",
  title: "guide_statuses_title",
  icon: "",

  content: () => `
    <p>
      ${t("guide_statuses_intro")}
    </p>

    <h3>${t("guide_statuses_negative_title")}</h3>

    <div class="guide-status">
      <img data-src="img/icons/mark-icon.png">
      <div>
        <strong>${t("status_mark_title")}</strong>
        <span>${t("status_mark_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/bleed-icon.png">
      <div>
        <strong>${t("status_bleed_title")}</strong>
        <span>${t("status_bleed_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/burn-icon.png">
      <div>
        <strong>${t("status_burn_title")}</strong>
        <span>${t("status_burn_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/poison-icon.png">
      <div>
        <strong>${t("status_poison_title")}</strong>
        <span>${t("status_poison_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/skill-slow-icon.png">
      <div>
        <strong>${t("status_slow_title")}</strong>
        <span>${t("status_slow_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/skill-stun-icon.png">
      <div>
        <strong>${t("status_stun_title")}</strong>
        <span>${t("status_stun_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/exhausted-bonus-icon3.png">
      <div>
        <strong>${t("status_exhausted_title")}</strong>
        <span>${t("status_exhausted_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/vulnerable-bonus-icon2.png">
      <div>
        <strong>${t("status_vulnerable_title")}</strong>
        <span>${t("status_vulnerable_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_statuses_combat_title")}</h3>

    <div class="guide-status">
      <img data-src="img/icons/guard-windup-icon.png">
      <div>
        <strong>${t("status_guard_title")}</strong>
        <span>${t("status_guard_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/charge-windup-icon.png">
      <div>
        <strong>${t("status_charge_title")}</strong>
        <span>${t("status_charge_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/spear-control-icon.png">
      <div>
        <strong>${t("status_control_title")}</strong>
        <span>${t("status_control_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/armor-break-icon.png">
      <div>
        <strong>${t("status_armor_break_title")}</strong>
        <span>${t("status_armor_break_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/weak-point-bonus-icon.png">
      <div>
        <strong>${t("status_weak_point_title")}</strong>
        <span>${t("status_weak_point_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_statuses_buffs_title")}</h3>

    <div class="guide-status">
      <img data-src="img/icons/crit-bonus-icon.png">
      <div>
        <strong>${t("status_crit_title")}</strong>
        <span>${t("status_crit_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/atkspd-bonus-icon2.png">
      <div>
        <strong>${t("status_attack_speed_title")}</strong>
        <span>${t("status_attack_speed_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/dmg-bonus-icon.png">
      <div>
        <strong>${t("status_damage_bonus_title")}</strong>
        <span>${t("status_damage_bonus_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/dmg-reduction-icon.png">
      <div>
        <strong>${t("status_damage_reduction_title")}</strong>
        <span>${t("status_damage_reduction_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_statuses_discipline_title")}</h3>

    <p>
      ${t("guide_statuses_discipline_intro")}
    </p>

    <div class="guide-status">
      <img data-src="img/icons/bleed-skill-icon.png">
      <div>
        <strong>${t("status_blood_reaver_title")}</strong>
        <span>${t("status_blood_reaver_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/discipline-bonus-icon.png">
      <div>
        <strong>${t("status_spear_discipline_title")}</strong>
        <span>${t("status_spear_discipline_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/absolute-bonus-icon.png">
      <div>
        <strong>${t("status_absolute_control_title")}</strong>
        <span>${t("status_absolute_control_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/parry-master-bonus-icon.png">
      <div>
        <strong>${t("status_parry_master_title")}</strong>
        <span>${t("status_parry_master_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/bastion-bonus-icon.png">
      <div>
        <strong>${t("status_last_bastion_title")}</strong>
        <span>${t("status_last_bastion_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/icons/precision-bonus-icon.png">
      <div>
        <strong>${t("status_precision_title")}</strong>
        <span>${t("status_precision_desc")}</span>
      </div>
    </div>
  `
  },

/*  {
  id: "items",
  title: "Przedmioty",
  icon: "",
  content: `
    <p>
      Przedmioty pozwalają rozwijać postać i dostosowywać ją do własnego
      stylu gry. Wyposażenie różni się jakością, statystykami, bonusami
      oraz specjalnymi właściwościami.
    </p>

    <h3>Rzadkość</h3>

    <p>
      Każdy przedmiot posiada określony poziom rzadkości. Wyższa jakość
      może oznaczać lepsze właściwości oraz dostęp do potężniejszych
      bonusów.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #7f7970;">ZWYKŁE</div>
      <div class="guide-tip-text">
        Podstawowe przedmioty bez dodatkowych właściwości.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #106faf;">MAGICZNE</div>
      <div class="guide-tip-text">
        Przedmioty posiadające dodatkowe bonusy wzmacniające wybrane statystyki.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #c89212;">UNIKALNE</div>
      <div class="guide-tip-text">
        Wyjątkowe przedmioty o określonych właściwościach i charakterze.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #7b1e61;">EPICKIE</div>
      <div class="guide-tip-text">
        Potężne przedmioty oferujące większe możliwości rozwoju i specjalizacji.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #dc6201;">LEGENDARNE</div>
      <div class="guide-tip-text">
        Najrzadsze przedmioty posiadające ekskluzywne bonusy mogące całkowicie
        zmienić sposób prowadzenia walki.
      </div>
    </div>

    <h3>Bonusy</h3>

    <p>
      Bonusy to dodatkowe właściwości przedmiotów, które zwiększają wybrane
      statystyki lub zapewniają określone wzmocnienia. Ich wartości i rodzaj
      zależą między innymi od rodzaju przedmiotu oraz jego rzadkości.
    </p>

    <p>
      Oprócz standardowych bonusów przedmioty mogą posiadać
      <strong>Bojowe Bonusy</strong>. Są one bezpośrednio związane
      z mechanikami walki i pozwalają wzmacniać określone sposoby
      prowadzenia starcia.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">BOJOWE BONUSY</div>
      <div class="guide-tip-text">
        Wzmacniają konkretne mechaniki bojowe, takie jak Krwawienie,
        Kontrola czy Idealny Blok. Szczegółowe informacje znajdziesz
        w Kodeksie.
      </div>
    </div>

    <h3>Sloty wyposażenia</h3>

    <p>
      Każdy element wyposażenia posiada własną charakterystykę i może
      oferować affixy odpowiadające jego roli. Dobieraj poszczególne
      części ekwipunku tak, aby uzupełniały wybrany styl gry.
    </p>

  
    <div class="guide-status">
      <img data-src="img/items/short-sword.png">
      <div>
        <strong>BROŃ</strong>
        <span>
          Główne źródło obrażeń i ofensywnych bonusów. Określa również
          Styl Broni.
        </span>
      </div>
    </div>
   
    <div class="guide-status">
      <img data-src="img/items/triangle-shield.png">
      <div>
        <strong>TARCZA</strong>
        <span>
          Wzmacnia ochronę, blok i przeżywalność.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/plate-armor.png">
      <div>
        <strong>ZBROJA</strong>
        <span>
          Zapewnia podstawową ochronę i zwiększa odporność postaci.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/long-sword.png">
      <div>
        <strong>NARAMIENNIKI</strong>
        <span>
          Łączą właściwości defensywne ze wzmacnianiem siły.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/helmet.png">
      <div>
        <strong>HEŁM</strong>
        <span>
          Wspiera zasoby postaci, ich regenerację oraz przeżywalność.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/bracers.png">
      <div>
        <strong>KARWASZE</strong>
        <span>
          Wpływają na zwiększenie skuteczności bloku, wzmacniają obronę.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/gloves.png">
      <div>
        <strong>RĘKAWICE</strong>
        <span>
          Wspierają szybkość ataku, ofensywę oraz odzyskiwanie zdrowia
          i zasobów.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/belt.png">
      <div>
        <strong>PAS</strong>
        <span>
          Wspiera zasoby, regenerację oraz dodatkowe bonusy użytkowe.
        </span>
      </div>
    </div>
   
    <div class="guide-status">
      <img data-src="img/items/pants.png">
      <div>
        <strong>SPODNIE</strong>
        <span>
          Wzmacniają przeżywalność i maksymalną staminę.
        </span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/boots.png">
      <div>
        <strong>BUTY</strong>
        <span>
          Odpowiadają przede wszystkim za mobilność, uniki i ich koszt.
        </span>
      </div>
    </div>
   
    <h3>Style broni</h3>

    <p>
      Każdy rodzaj broni posiada własny <strong>Styl</strong>, który
      definiuje jego charakter oraz podstawową mechanikę walki.
      Styl broni nie jest tym samym co Dyscyplina — określa przede wszystkim
      sposób działania samej broni.
    </p>

    <div class="guide-tip">
      <img data-src="img/items/short-sword.png">
      <div class="guide-tip-title">MIECZ — RYTM</div>
      <div class="guide-tip-text">
        Buduj tempo walki i wyprowadzaj coraz silniejsze uderzenia.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/axe.png">
      <div class="guide-tip-title">TOPÓR — KRWAWIENIE</div>
      <div class="guide-tip-text">
        Zadawaj rany, które pogłębiają się wraz z kolejnymi trafieniami.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/long-sword.png">
      <div class="guide-tip-title">DŁUGI MIECZ — PRECYZJA</div>
      <div class="guide-tip-text">
        Nagradzaj idealne wyczucie momentu i wykorzystuj je do wzmacniania ataków.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/mace.png">
      <div class="guide-tip-title">BUŁAWA — KONTROLA</div>
      <div class="guide-tip-text">
        Zakłócaj tempo przeciwnika i opóźniaj jego działania.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/double-axe.png">
      <div class="guide-tip-title">PODWÓJNY TOPÓR — EKSTAZA KRWI</div>
      <div class="guide-tip-text">
        Pogłębiaj krwawienie kolejnymi trafieniami i wykorzystuj idealne
        uderzenia do zadawania potężnych cięć.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/hammer.png">
      <div class="guide-tip-title">MŁOT — PRZEŁAMANIE</div>
      <div class="guide-tip-text">
        Wytrącaj przeciwnika z równowagi i przerywaj jego ataki.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/spear.png">
      <div class="guide-tip-title">WŁÓCZNIA — KONTROLA CZASU</div>
      <div class="guide-tip-text">
        Utrzymuj przeciwnika pod presją, wzmacniając spowolnienie kolejnymi
        trafieniami.
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/great-sword.png">
      <div class="guide-tip-title">WIELKI MIECZ — PRZEBICIE</div>
      <div class="guide-tip-text">
        Rozbijaj obronę przeciwnika i wykorzystuj odpowiedni moment,
        aby przebić jego ochronę.
      </div>
    </div>

    <h3>Legendarne przedmioty</h3>

    <p>
      Legendarne przedmioty posiadają ekskluzywne właściwości, które mogą
      znacząco zmienić sposób rozgrywki. Ich bonusy nie są jedynie
      wzmocnieniem statystyk — mogą otworzyć nowe możliwości budowania
      postaci i zmienić sposób wykorzystania jej mechanik.
    </p>

    <h3>Kodeks</h3>

    <p>
      Szczegółowe informacje o Bojowych Bonusach oraz mechanikach, które
      wzmacniają, znajdziesz w <strong>Kodeksie</strong>.
    </p>
  `
  },*/

  {
  id: "items",
  title: "guide_items_title",
  icon: "",
  content: () => `
    <p>${t("guide_items_intro")}</p>

    <h3>${t("guide_items_rarity_title")}</h3>

    <p>${t("guide_items_rarity_intro")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #7f7970;">
        ${t("item_rarity_common_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_common_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #106faf;">
        ${t("item_rarity_magic_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_magic_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #c89212;">
        ${t("item_rarity_unique_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_unique_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #7b1e61;">
        ${t("item_rarity_epic_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_epic_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title" style="color: #dc6201;">
        ${t("item_rarity_legendary_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_rarity_legendary_desc")}
      </div>
    </div>

    <h3>${t("guide_items_affixes_title")}</h3>

    <p>${t("guide_items_affixes_intro")}</p>

    <p>${t("guide_items_combat_affixes_intro")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("item_combat_affixes_title")}
      </div>
      <div class="guide-tip-text">
        ${t("item_combat_affixes_desc")}
      </div>
    </div>

    <h3>${t("guide_items_slots_title")}</h3>

    <p>${t("guide_items_slots_intro")}</p>

    <div class="guide-status">
      <img data-src="img/items/short-sword.png">
      <div>
        <strong>${t("item_slot_weapon_title")}</strong>
        <span>${t("item_slot_weapon_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/triangle-shield.png">
      <div>
        <strong>${t("item_slot_shield_title")}</strong>
        <span>${t("item_slot_shield_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/plate-armor.png">
      <div>
        <strong>${t("item_slot_armor_title")}</strong>
        <span>${t("item_slot_armor_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/long-sword.png">
      <div>
        <strong>${t("item_slot_shoulders_title")}</strong>
        <span>${t("item_slot_shoulders_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/helmet.png">
      <div>
        <strong>${t("item_slot_helmet_title")}</strong>
        <span>${t("item_slot_helmet_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/bracers.png">
      <div>
        <strong>${t("item_slot_bracers_title")}</strong>
        <span>${t("item_slot_bracers_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/gloves.png">
      <div>
        <strong>${t("item_slot_gloves_title")}</strong>
        <span>${t("item_slot_gloves_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/belt.png">
      <div>
        <strong>${t("item_slot_belt_title")}</strong>
        <span>${t("item_slot_belt_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/pants.png">
      <div>
        <strong>${t("item_slot_pants_title")}</strong>
        <span>${t("item_slot_pants_desc")}</span>
      </div>
    </div>

    <div class="guide-status">
      <img data-src="img/items/boots.png">
      <div>
        <strong>${t("item_slot_boots_title")}</strong>
        <span>${t("item_slot_boots_desc")}</span>
      </div>
    </div>

    <h3>${t("guide_items_weapon_styles_title")}</h3>

    <p>${t("guide_items_weapon_styles_intro")}</p>

    <div class="guide-tip">
      <img data-src="img/items/short-sword.png">
      <div class="guide-tip-title">
        ${t("weapon_style_sword_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_sword_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/axe.png">
      <div class="guide-tip-title">
        ${t("weapon_style_axe_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_axe_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/long-sword.png">
      <div class="guide-tip-title">
        ${t("weapon_style_longsword_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_longsword_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/mace.png">
      <div class="guide-tip-title">
        ${t("weapon_style_mace_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_mace_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <img data-src="img/items/double-axe.png">
      <div class="guide-tip-title">
        ${t("weapon_style_double_axe_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_double_axe_desc")}
      </div>
    </div>
    
    <div class="guide-tip">
      <img data-src="img/items/spear.png">
      <div class="guide-tip-title">
        ${t("weapon_style_spear_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_spear_desc")}
      </div>
    </div>
    
    <div class="guide-tip">
      <img data-src="img/items/hammern.png">
      <div class="guide-tip-title">
        ${t("weapon_style_hammer_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_hammer_desc")}
      </div>
    </div>
    
    <div class="guide-tip">
      <img data-src="img/items/great-swordn.png">
      <div class="guide-tip-title">
        ${t("weapon_style_greatsword_title")}
      </div>
      <div class="guide-tip-text">
        ${t("weapon_style_greatsword_desc")}
      </div>
    </div>

    <h3>${t("guide_items_legendary_title")}</h3>

    <p>${t("guide_items_legendary_intro")}</p>

    <h3>${t("guide_items_codex_title")}</h3>

    <p>${t("guide_items_codex_intro")}</p>
  `
  },

 /* {
  id: "disciplines",
  title: "Dyscypliny",
  icon: "",
  content: `
    <p>
      Dyscypliny to unikalne sposoby prowadzenia walki, które określają
      charakter postaci i jej główną mechanikę bojową. Rodzaj dyscypliny
      zależy od tego, jakiego uzbrojenia używasz w obu rękach.
    </p>

    <p>
      Każda dyscyplina posiada własne mechaniki, zasoby i umiejętności,
      dzięki którym wymaga innego podejścia do starcia. Wybierz tę,
      która najlepiej odpowiada Twojemu sposobowi walki.
    </p>

    <h3>Obrońca</h3>

    <p>
      Dzierżąc broń jednoręczną i tarczę możesz przyjąć dyscyplinę
      <strong>Obrońcy</strong>. To wojownik, który zamienia tarczę
      w niemal nieprzeniknioną twierdzę i czerpie siłę z odpierania
      ataków przeciwnika.
    </p>

    <p>
      Kiedy wróg atakuje, Obrońca gromadzi <strong>ładunki obronne</strong>.
      Mogą one zostać wykorzystane jako zasób do potężnych umiejętności
      tarczy lub zachowane na moment, w którym Obrońca zdecyduje się
      przerwać obronę i wyprowadzić niszczycielski kontratak.
    </p>

    <p>
      Styl Obrońcy opiera się na cierpliwości i wytrzymałości. Zamiast
      ryzykować bezpośrednią wymianę ciosów, pozwala przeciwnikowi
      wyczerpać swoje możliwości, aby następnie wykorzystać zgromadzoną
      siłę przeciwko niemu.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">OBROŃCA</div>
      <div class="guide-tip-text">
        Przetrwaj napór przeciwnika, gromadź siłę i zamień jego ataki
        w okazję do potężnego kontrataku.
      </div>
    </div>

    <h3>Perfekcjonista</h3>

    <p>
      Dzierżąc broń jednoręczną i tarczę możesz również obrać drogę
      <strong>Perfekcjonisty</strong>. W przeciwieństwie do Obrońcy
      nie polega on na długotrwałym utrzymywaniu tarczy. Jego siłą jest
      idealne wyczucie chwili.
    </p>

    <p>
      Perfekcjonista odpowiada na ataki przeciwnika za pomocą
      <strong>Idealnego Bloku</strong>, całkowicie negując jego cios
      i wykorzystując moment konsternacji do wykonania kontrataku.
    </p>

    <p>
      Jego niezwykłe skupienie pozwala dostrzegać słabe punkty przeciwnika
      i wykorzystywać je w odpowiednim momencie. Im lepiej opanujesz
      rytm starcia, tym większą przewagę możesz uzyskać dzięki precyzyjnym
      reakcjom i kolejnym idealnym zagraniom.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">PERFEKCJONISTA</div>
      <div class="guide-tip-text">
        Odpieraj ataki w idealnym momencie, wykorzystuj słabe punkty
        przeciwnika i zamieniaj jego błędy w śmiertelne kontrataki.
      </div>
    </div>

    <h3>Berserker</h3>

    <p>
      <strong>Berserker</strong> to wojownik, który wykorzystuje swój
      <strong>Szał</strong>, aby przejąć inicjatywę i szybko niszczyć
      przeciwników. Jego styl opiera się na agresji, szybkości oraz
      zadawaniu głębokich ran.
    </p>

    <p>
      Każdy skuteczny atak pozwala Berserkerowi podtrzymywać presję
      i coraz bardziej pogłębiać obrażenia zadawane przeciwnikowi.
      Im dłużej utrzymuje się w walce i nie pozwala wrogowi odzyskać
      przewagi, tym bardziej niebezpieczny staje się jego Szał.
    </p>

    <p>
      Perfekcyjne wykonywanie akcji pozwala zwiększać Szał jeszcze szybciej,
      wzmacniając jego brutalność i umożliwiając prowadzenie coraz bardziej
      bezwzględnej ofensywy. Berserker nagradza odważną i nieprzerwaną
      presję — chwila zawahania może jednak pozbawić go wypracowanej przewagi.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">BERSERKER</div>
      <div class="guide-tip-text">
        Buduj Szał, utrzymuj presję i pogłębiaj rany przeciwnika,
        zanim zdąży odzyskać kontrolę nad starciem.
      </div>
    </div>

    <h3>Strażnik</h3>

    <p>
      <strong>Strażnik</strong> to mistrz kontroli pola walki, który
      wykorzystuje długą włócznię, aby utrzymywać przeciwnika na dystans
      i narzucać mu własne tempo.
    </p>

    <p>
      Odpowiednie uderzenia mogą <strong>odpychać</strong> i
      <strong>spowalniać</strong> wroga, pozwalając Strażnikowi
      kontrolować jego pozycję oraz ograniczać możliwości wykonania
      kolejnego ataku.
    </p>

    <p>
      Wraz z uzyskiwaniem przewagi nad przeciwnikiem Strażnik gromadzi
      <strong>ładunki Kontroli</strong>. Pozwalają one korzystać
      z potężniejszych możliwości jego dyscypliny i jeszcze mocniej
      ograniczać działania przeciwnika.
    </p>

    <p>
      Strażnik nie musi pokonać wroga jednym potężnym ciosem. Jego siłą
      jest stopniowe odbieranie przeciwnikowi możliwości działania,
      aż ten pozostanie bezpiecznie uwięziony w narzuconym przez Strażnika
      rytmie walki.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">STRAŻNIK</div>
      <div class="guide-tip-text">
        Utrzymuj dystans, kontroluj tempo przeciwnika i stopniowo odbieraj
        mu możliwość skutecznego działania.
      </div>
    </div>
  `
  },*/

 {
  id: "disciplines",
  title: "guide_disciplines_title",
  icon: "",
  content: () => `
    <p>${t("guide_disciplines_intro_1")}</p>

    <p>${t("guide_disciplines_intro_2")}</p>

    <h3>${t("discipline_bulwark_title")}</h3>

    <p>${t("discipline_bulwark_desc_1")}</p>

    <p>${t("discipline_bulwark_desc_2")}</p>

    <p>${t("discipline_bulwark_desc_3")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_bulwark_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_bulwark_tip_desc")}
      </div>
    </div>

    <h3>${t("discipline_duelist_title")}</h3>

    <p>${t("discipline_duelist_desc_1")}</p>

    <p>${t("discipline_duelist_desc_2")}</p>

    <p>${t("discipline_duelist_desc_3")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_duelist_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_duelist_tip_desc")}
      </div>
    </div>

    <h3>${t("discipline_berserker_title")}</h3>

    <p>${t("discipline_berserker_desc_1")}</p>

    <p>${t("discipline_berserker_desc_2")}</p>

    <p>${t("discipline_berserker_desc_3")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_berserker_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_berserker_tip_desc")}
      </div>
    </div>

    <h3>${t("discipline_sentinel_title")}</h3>

    <p>${t("discipline_sentinel_desc_1")}</p>

    <p>${t("discipline_sentinel_desc_2")}</p>

    <p>${t("discipline_sentinel_desc_3")}</p>

    <p>${t("discipline_sentinel_desc_4")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("discipline_sentinel_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("discipline_sentinel_tip_desc")}
      </div>
    </div>
  `
  },

 /* {
  id: "progression",
  title: "Rozwój",
  icon: "",
  content: `
    <p>
      Rozwój postaci nie opiera się na jednym rodzaju doświadczenia.
      Możesz rozwijać swojego bohatera poprzez zdobywanie poziomów, zwiększaniu atrybutów,
      rozwijanie umiejętności, doskonalenie poszczególnych dyscyplin
      oraz ulepszanie wyposażenia.
    </p>

    <p>
      Każdy z tych elementów rozwija postać w inny sposób. Poziom i atrybuty
      wzmacniają bohatera, umiejętności pozwalają kształtować jego możliwości,
      mistrzostwo nagradza opanowanie konkretnej dyscypliny, a wyposażenie
      pozwala dodatkowo specjalizować wybrany sposób gry.
    </p>
   
    <h3>Poziom postaci</h3>

    <p>
      Pokonywanie przeciwników i wykonywanie zadań pozwala zdobywać
      <strong>doświadczenie</strong> i zwiększać poziom postaci.
      Poziom określa ogólny etap rozwoju bohatera i pozwala korzystać
      z coraz potężniejszych możliwości.
    </p>

    <h3>Atrybuty</h3>

    <p>
      Atrybuty określają podstawowe możliwości postaci i wpływają na sposób,
      w jaki radzi sobie ona podczas walki. Każdy z trzech atrybutów wzmacnia
      inne aspekty rozgrywki.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">SIŁA</div>
      <div class="guide-tip-text">
        Zwiększa obrażenia fizyczne. Wpływa na skuteczność ataków wręcz
        oraz zwiększa moc i skuteczność broni dwuręcznych.
        <br><br>
        <strong>+1 Siły = +3 obrażeń fizycznych</strong>
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">ZRĘCZNOŚĆ</div>
      <div class="guide-tip-text">
        Zwiększa zdolność unikania ciosów oraz poprawia pancerz.
        Wpływa również na szybkość przygotowania ataku, skuteczność
        Bloku Taktycznego oraz szansę na udaną ucieczkę z walki.
        <br><br>
        <strong>Każde +10 Zręczności = +1% szansy na unik</strong><br>
        <strong>+1 Zręczności = +4 pancerza</strong>
      </div>
     </div>

     <div class="guide-tip">
       <div class="guide-tip-title">WITALNOŚĆ</div>
       <div class="guide-tip-text">
         Zwiększa maksymalne życie oraz skuteczność regeneracji.
         Wzmacnia również regenerację Staminy, dzięki czemu szczególnie dobrze
         sprawdza się w konfiguracjach nastawionych na długie walki.
       <br><br>
       <strong>+1 Witalności = +5 maksymalnego życia</strong><br>
       <strong>Każde +10 Witalności = +1 regeneracji życia/sek.</strong>
      </div>
    </div>
   
   <h3>Punkty umiejętności</h3>

    <p>
      Podczas rozwoju postaci zdobywasz również <strong>punkty umiejętności</strong>.
      Służą one do odblokowywania i rozwijania umiejętności w drzewku
      pasywnym.
    </p>

    <p>
      Umiejętności pasywne są wspólne dla wszystkich dyscyplin, dlatego
      ich rozwój pozwala wzmacniać fundamenty postaci niezależnie od
      używanej broni.
    </p>

    <h3>Mistrzostwo</h3>

    <p>
      Każda dyscyplina posiada własny poziom <strong>mistrzostwa</strong>.
      W przeciwieństwie do zwykłego doświadczenia nie zdobywasz go
      za samo pokonywanie przeciwników.
    </p>

    <p>
      Mistrzostwo rozwijasz poprzez <strong>aktywne korzystanie z mechanik
      danej dyscypliny</strong>. Im lepiej wykorzystujesz jej charakterystyczne
      możliwości podczas walki, tym szybciej opanowujesz jej styl.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">MISTRZOSTWO</div>
      <div class="guide-tip-text">
        Nie wystarczy walczyć. Aby opanować dyscyplinę, musisz nauczyć się
        wykorzystywać jej mechaniki w praktyce.
      </div>
    </div>

    <h3>Wyposażenie</h3>

    <p>
      Kolejnym elementem rozwoju jest wyposażenie. Broń, zbroja i pozostałe
      przedmioty pozwalają zmieniać statystyki postaci, wzmacniać wybrane
      mechaniki i tworzyć własne konfiguracje.
    </p>

    <p>
      Połączenie umiejętności, mistrzostwa oraz odpowiednio dobranego
      wyposażenia pozwala tworzyć różne sposoby prowadzenia tej samej
      dyscypliny.
    </p>
  `
  },*/

  {
  id: "progression",
  title: "guide_progression_title",
  icon: "",
  content: () => `
    <p>${t("guide_progression_intro_1")}</p>

    <p>${t("guide_progression_intro_2")}</p>

    <h3>${t("progression_character_level_title")}</h3>

    <p>${t("progression_character_level_desc")}</p>

    <h3>${t("progression_attributes_title")}</h3>

    <p>${t("progression_attributes_intro")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("attribute_strength_title")}
      </div>
      <div class="guide-tip-text">
        ${t("attribute_strength_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("attribute_dexterity_title")}
      </div>
      <div class="guide-tip-text">
        ${t("attribute_dexterity_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("attribute_vitality_title")}
      </div>
      <div class="guide-tip-text">
        ${t("attribute_vitality_desc")}
      </div>
    </div>

    <h3>${t("progression_skill_points_title")}</h3>

    <p>${t("progression_skill_points_desc_1")}</p>

    <p>${t("progression_skill_points_desc_2")}</p>

    <h3>${t("progression_mastery_title")}</h3>

    <p>${t("progression_mastery_desc_1")}</p>

    <p>${t("progression_mastery_desc_2")}</p>

    <div class="guide-tip">
      <div class="guide-tip-title">
        ${t("progression_mastery_tip_title")}
      </div>
      <div class="guide-tip-text">
        ${t("progression_mastery_tip_desc")}
      </div>
    </div>

    <h3>${t("progression_equipment_title")}</h3>

    <p>${t("progression_equipment_desc_1")}</p>

    <p>${t("progression_equipment_desc_2")}</p>
  `
  },

 /* {
  id: "exploration",
  title: "Eksploracja",
  icon: "",
  content: `
    <p>
      Eksploracja świata polega na stopniowym przemieszczaniu się przez
      kolejne <strong>kroki</strong>. Każda lokacja składa się z
      <strong>10 kroków</strong>, a każdy z nich zawiera cztery losowo
      generowane <strong>pola</strong>.
    </p>

    <p>
      Każde pole może skrywać inne zdarzenie. To, co znajdziesz na swojej
      drodze, zależy od lokacji oraz wybranego trybu eksploracji.
    </p>

    <h3>Pola eksploracji</h3>

    <p>
      Podczas podróży możesz natrafić między innymi na:
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">WRÓG</div>
      <div class="guide-tip-text">
        Rozpoczęcie pola z przeciwnikiem prowadzi do walki.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">KAPLICZKA</div>
      <div class="guide-tip-text">
        Specjalne miejsce, które może zapewnić pomoc podczas eksploracji
        w postaci wzmocnienia lub leczenia 
        i umożliwić późniejsze rozpalenie ogniska.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">SKRZYNIA</div>
      <div class="guide-tip-text">
        Otwórz skrzynię, aby zdobyć znajdujące się w niej skarby.
        Otwarcie skrzyni może również umożliwić rozpalenie ogniska.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">POSTAĆ FABULARNA</div>
      <div class="guide-tip-text">
        W trybie fabularnym możesz spotkać postacie związane z historią
        świata i wykonywanymi zadaniami.
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">WYDARZENIE FABULARNE</div>
      <div class="guide-tip-text">
        Specjalne wydarzenie związane z historią, które może pojawić się
        podczas eksploracji trybu fabularnego.
      </div>
    </div>

    <h3>Energia</h3>

    <p>
      Eksploracja wymaga <strong>Energii</strong>. Jej koszt ponosi się
      zarówno za uruchamianie pól, jak i za odblokowywanie kolejnych kroków.
    </p>

    <p>
      Energia jest więc zasobem, którym musisz zarządzać podczas podróży.
      Podejmowanie kolejnych działań przybliża Cię do celu, ale jednocześnie
      ogranicza możliwość dalszej eksploracji.
    </p>

    <h3>Ognisko</h3>

    <p>
      Po użyciu <strong>kapliczki</strong> lub otwarciu
      <strong>skrzyni</strong> możesz otrzymać możliwość rozpalenia
      <strong>ogniska</strong>.
    </p>

    <p>
      Ognisko pozwala odzyskać część Energii i kontynuować podróż.
      Odpowiednie wykorzystywanie znalezionych miejsc odpoczynku może
      zdecydować o tym, jak daleko uda Ci się dotrzeć.
    </p>

    <h3>Zmęczenie</h3>

    <p>
      Energia wpływa również na gotowość bohatera do walki. Jeżeli jej
      poziom spadnie poniżej wymaganego progu, postać wchodzi w stan
      <strong>Zmęczenia</strong>.
    </p>

    <p>
      Walka rozpoczęta w stanie Zmęczenia jest trudniejsza, ponieważ
      bohater otrzymuje <strong>osłabienie statystyk</strong>.
      Każde kolejne rozpoczęcie walki w tym stanie pogłębia osłabienie.
    </p>

    <p>
      Osłabienie może narastać maksymalnie do <strong>5 poziomów</strong>.
      Dlatego dalsza eksploracja przy bardzo niskim poziomie Energii
      staje się ryzykowna.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">ZMĘCZENIE</div>
      <div class="guide-tip-text">
        Niska Energia może doprowadzić do Zmęczenia. Kolejne walki
        w tym stanie coraz bardziej osłabiają bohatera — maksymalnie
        do 5 poziomów.
      </div>
    </div>

    <h3>Tryb fabularny</h3>

    <p>
      <strong>Tryb fabularny</strong> pozwala odkrywać świat, poznawać
      jego mieszkańców i wykonywać misje. Poszczególne lokacje mogą
      zawierać miasta i wioski, a wydarzenia podczas eksploracji mogą
      prowadzić do kolejnych elementów historii.
    </p>

    <p>
      Niektóre lokacje rozpoczynają się od <strong>miasta lub wioski</strong>.
      Takie miejsce jest poświęcone przede wszystkim postaciom niezależnym
      i nie działa jak zwykły krok eksploracji. Podczas przebywania
      w osadzie Energia regeneruje się szybciej.
    </p>

    <p>
      Postęp w trybie fabularnym może również odblokowywać kolejne
      możliwości eksploracji oraz inne tryby gry.
    </p>

    <h3>Tryb przygodowy</h3>

    <p>
      <strong>Tryb przygodowy</strong> pozwala ponownie eksplorować
      poziomy znane z trybu fabularnego, ale bez związanych z nimi misji
      i wydarzeń fabularnych.
    </p>

    <p>
      W przeciwieństwie do trybu fabularnego eksploracja nie ma końca.
      Po przejściu dostępnych poziomów kolejne lokacje zaczynają się
      ponownie pojawiać, tworząc <strong>zapętloną podróż</strong>.
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">TRYB PRZYGODOWY</div>
      <div class="guide-tip-text">
        Eksploruj znane lokacje bez ograniczenia fabułą. Poziomy
        zapętlają się, pozwalając kontynuować podróż tak długo,
        jak długo jesteś w stanie przetrwać.
      </div>
    </div>

    <h3>Planowanie podróży</h3>

    <p>
      Eksploracja nie polega wyłącznie na podążaniu przed siebie.
      Musisz zarządzać Energią, wybierać moment podejmowania ryzyka
      i decydować, kiedy warto kontynuować podróż, a kiedy lepiej
      wykorzystać dostępne możliwości regeneracji.
    </p>

    <p>
      Im dalej się zapuszczasz, tym większe znaczenie ma odpowiednie
      gospodarowanie zasobami. Nie każda napotkana przeszkoda musi być
      równie cenna, a niewłaściwa decyzja może doprowadzić do walki
      w stanie Zmęczenia.
    </p>
  `
  }, */

  {
  id: "exploration",
  title: "guide_exploration_title",
  icon: "",
  content: () => `
    <p>
      ${t("guide_exploration_intro_1")}
    </p>

    <p>
      ${t("guide_exploration_intro_2")}
    </p>

    <h3>${t("guide_exploration_fields_title")}</h3>

    <p>
      ${t("guide_exploration_fields_intro")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_enemy_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_enemy_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_shrine_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_shrine_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_chest_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_chest_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_story_character_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_story_character_desc")}
      </div>
    </div>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_field_story_event_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_field_story_event_desc")}
      </div>
    </div>

    <h3>${t("guide_exploration_energy_title")}</h3>

    <p>
      ${t("guide_exploration_energy_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_energy_desc_2")}
    </p>

    <h3>${t("guide_exploration_campfire_title")}</h3>

    <p>
      ${t("guide_exploration_campfire_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_campfire_desc_2")}
    </p>

    <h3>${t("guide_exploration_fatigue_title")}</h3>

    <p>
      ${t("guide_exploration_fatigue_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_fatigue_desc_2")}
    </p>

    <p>
      ${t("guide_exploration_fatigue_desc_3")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_fatigue_tip_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_fatigue_tip_desc")}
      </div>
    </div>

    <h3>${t("guide_exploration_story_mode_title")}</h3>

    <p>
      ${t("guide_exploration_story_mode_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_story_mode_desc_2")}
    </p>

    <p>
      ${t("guide_exploration_story_mode_desc_3")}
    </p>

    <h3>${t("guide_exploration_adventure_mode_title")}</h3>

    <p>
      ${t("guide_exploration_adventure_mode_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_adventure_mode_desc_2")}
    </p>

    <div class="guide-tip">
      <div class="guide-tip-title">${t("exploration_adventure_mode_tip_title")}</div>
      <div class="guide-tip-text">
        ${t("exploration_adventure_mode_tip_desc")}
      </div>
    </div>

    <h3>${t("guide_exploration_planning_title")}</h3>

    <p>
      ${t("guide_exploration_planning_desc_1")}
    </p>

    <p>
      ${t("guide_exploration_planning_desc_2")}
    </p>
  `
  },


];


function renderGuide() {
  const popup = document.getElementById("guide-popup");
  const popupContent = popup.querySelector(".popup-content");
  const content = document.getElementById("guide-popup-content");

  if (!popup) return;

  setPopupBackground2(popupContent, `turtle`);

  const closeUrl = assetManager.getResolvedAsset(`img/buttons/close-btn.png`);

  content.innerHTML = `

    <div class="guide">

      <div class="guide-header">
        <div class="guide-tabs">
          ${GUIDE_SECTIONS.map(section => `
            <button
              class="guide-tab"
              data-guide="${section.id}">
              <span class="guide-tab-icon">${section.icon}</span>
              <span>${t(section.title)}</span>
            </button>
          `).join("")}
        </div>
      </div>


      <div class="guide-scroll">

        <div
          class="guide-content"
          id="guide-content">
        </div>

      </div>

    </div> 
  `;


  // =========================
  // BUTTONS
  // =========================

  content
    .querySelectorAll("[data-guide]")
    .forEach(button => {

      button.addEventListener("click", () => {

        playSound("menu", 1, 1, 0.65);

        const sectionId =
          button.dataset.guide;

        renderGuideSection(sectionId);
      });

    });

 // applyImageFallback(content);
 
   
  // pierwsza sekcja
  renderGuideSection(GUIDE_SECTIONS[0].id);
  
  playSound("open", 0.4);
   
  popup.classList.remove("hidden");
 
}

 

 function closeGuidePopup() {
   document.getElementById("guide-popup").classList.add("hidden");
 }


function renderGuideSection(sectionId) {
  const section =
    GUIDE_SECTIONS.find(
      section => section.id === sectionId
    );

  if (!section) return;

  const content =
    document.getElementById("guide-content");

  if (!content) return;


  // aktywny przycisk
  document
    .querySelectorAll("[data-guide]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.guide === sectionId
      );

    });

  
    
  
  const sectionContent =
    typeof section.content === "function"
      ? section.content()
      : section.content;

  content.innerHTML = `
    <div class="guide-title">
      <span class="guide-title-icon">
        ${section.icon}
      </span>
  
      <span>
        ${t(section.title)}
      </span>
    </div>

    <div class="guide-body">
      ${sectionContent}
    </div>
  `;
  
  
 /* content.innerHTML = `

    <div class="guide-title">

      <span class="guide-title-icon">
        ${section.icon}
      </span>

      <span>
        ${section.title}
      </span>

    </div>

    <div class="guide-body">
      ${section.content}
    </div>

  `;*/
  
  initializeCharacterImages();
 
  applyImageFallback(content);
 
  // zawsze zaczynamy od początku
  const scroll =
    document.querySelector(".guide-scroll");

  if (scroll) {
    scroll.scrollTop = 0;
  }
}



