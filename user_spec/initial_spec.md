# Dembinszky utca 18. – történeti idővonal webes megjelenésének specifikációja

**Állapot:** fejlesztői átadás, 2026. szeptember 28.  
**Cél:** a `D18_timeline_1873-1968(2).md` kutatási idővonalából olvasható, vizuálisan erős, statikus weboldal készítése. Ez a dokumentum a jelenleg meghozott termék-, tartalom- és dizájndöntéseket írja le. A timeline tartalmának mindenkori aktuális változata az eseményekre nézve elsőbbséget élvez e specifikációval szemben.

## 1. A megépítendő oldal

Egy **függőleges, görgethető, narratív idővonal** készül a Dembinszky utca 18. történetéről, Budapest és a világ kiválasztott háttéreseményeivel. Az első kiadásban a teljes, sűrű idővonal látszik; a későbbi szűrés lehetőségét az adatszerkezet készítse elő, de a felületen nem kell kezdetben szűrőket vagy keresőt megjeleníteni. A jelenlegi kutatási dokumentumban 108 esemény szerepel 1873 és 1968 között. A 1968-as zárás tudatos: ne nyújtsuk tovább a kronológiát pusztán azért, hogy a jelenig érjen.

A felület elemei ebben a sorrendben:

1. Normál dokumentumfolyamban lévő fejléc: a ház neve / kezdőlap, a négy korszakhoz vezető navigáció, **Írások** és **Impresszum** link. A fejléc **együtt görgetődik az oldallal**; ne legyen `position: sticky` vagy `fixed`, és ne takarja ki az idővonalat.
2. Nyitó rész: cím, rövid alcím, a ház **mai** homlokzatfotója, az 1873–1968-as ív egyértelmű jelzése.
3. Négy **teljes képernyőmagasságú korszaknyitó**, amelyek között a hosszú, függőleges idővonal folytatódik.
4. Minden korszaknyitót a hozzá tartozó események követnek, eredeti időrendben. A négy fejezet:
   - **1873–1913:** A város és a ház megszületése.
   - **1914–1938:** Háború, forradalmak és két világháború közötti hétköznapok.
   - **1939–1945:** Világháború, üldözés és Budapest ostroma.
   - **1946–1968:** Újjáépítés, államszocializmus, forradalom és fényképek.
5. Korszakugrásra alkalmas navigáció, amely mobilon is mind a négy fejezetet elérhetővé teszi. A horgonylinkeknek működniük kell billentyűzettel és JavaScript nélkül is.
6. Rövid, jól látható jelmagyarázat az eseménytípusokról és a bizonyossági jelölésekről.

Az **Írások** menüpont munkaneve egyelőre ez. A `/irasok/` oldal a ténylegesen publikált cikkek indexe legyen; a timeline `Cikkötlet` mezőjéből ne gyártsunk automatikusan nem létező cikkoldalt. Az **Impresszum** `/impresszum/` link legyen elérhető a fejlécből, lehetőleg a láblécből is. A jogi/szerzői és kapcsolati adatokat publikálás előtt a valódi adatokkal kell feltölteni: kitalált név vagy e-mail ne kerüljön oda. Az URL-eket a projekt útvonalrendszeréhez lehet igazítani, de ne legyenek halott menüpontok.

**Fontos:** a korábban bemutatott látványterv 17 válogatott eseményt mutatott; az éles implementáció a forrásfájl **mind a 108 sorát** dolgozza fel. A látványtervben megjelenő példaesemények megfogalmazása nem helyettesíti a forrásdokumentum szövegét.

## 2. Vizuális irány

A stílus a ház szecessziós, ornamentális homlokzatából és 19–20. századi budapesti nyomtatványokból induljon ki. A hatás legyen egy visszafogott, gondosan szedett **helytörténeti kiadványé**, amelynek része egy mai, jól használható webes felület. Kerüljük a neon színeket, az alkalmazásszerű, lekerekített kártyaözönt, a túlzott antikpapír-textúrát, az animált parallaxot, illetve a hamis történelmi díszleteket.

A homlokzati fotó **kortárs** fénykép. A vizuális nyitásban és a korai építéstörténet mellett is használható, de mindig úgy feliratozva, hogy ne tűnjön 1901 körüli felvételnek. Az 1944–45-ös rész hangulata legyen különösen visszafogott; ne használjon üldöztetéshez kötődő szimbólumot dekorációként.

### Színrendszer

A következő színek a feltöltött homlokzatfotóból kiinduló, **tompított webes tervezési színek**, nem eredeti festékszínek rekonstrukciói. CSS-változókként érdemes definiálni őket:

| Szerep | Javasolt token | Szín |
|---|---|---|
| Fő papírháttér | `--d18-paper` | `#F5F1E8` |
| Váltakozó, meleg korszakfelület | `--d18-paper-alt` | `#EEE6D9` |
| Második meleg felület | `--d18-paper-deep` | `#E7DDCC` |
| Vonal, visszafogott keret | `--d18-rule` | `#D2C3B1` |
| Homokkő hangsúly | `--d18-sand` | `#A88968` |
| Házhoz kapcsolódó hangsúly / ablakkeret | `--d18-walnut` | `#594535` |
| Fő szöveg | `--d18-ink` | `#292521` |
| Másodlagos szöveg | `--d18-muted` | `#675D53` |
| Magyarország típus visszafogott jelölése | `--d18-slate` | `#5B6260` |

A nyitók korszakonként kicsit változzanak: első `#EEE6D9`, második például `#E5DBC9`, harmadik tompa sötétbarna `#443B33` világos szöveggel, negyedik hűvösebb kőszín `#D7D4C9`. Ezek kiinduló értékek: a szöveg és a jelölések kontrasztját a tényleges megvalósításban ellenőrizni kell. A nagy korszakfelületeken **árnyalat, tipográfia és hiteles kép** válassza el a fejezeteket; az eseménykártyák szerkezete legyen következetes.

### Tipográfia

- Nagy címek, évszámok, eseménycímek: **Cormorant Garamond** (vagy hasonló, magyar ékezeteket teljesen támogató talpas betű).
- Hosszabb eseményleírás, navigáció, dátumhoz tartozó kiegészítő szöveg: **Source Sans 3**. A dátumokhoz a talpas címfont is használható, ahogy a látványtervben.
- Hosszú szöveghez kényelmes olvasási szélesség és sorköz; a kisbetűs metaadat se váljon 12 px alatti, nehezen olvasható díszítőelemmé. A betűtípusok lehetőleg helyben szolgálódjanak ki a stabil működés és a gyors betöltés miatt.
- A címsoroknál finom, nyomdai vonalak és visszafogott nagybetűs fejezetfeliratok használhatók. Díszítő iniciálé, látványos papírfolt vagy túlzott sepia-effekt nem szükséges.

## 3. Oldalelrendezés és reszponzivitás

### Nyitó rész

Asztali méretben két fő oszlop: balra a „Dembinszky utca 18.” cím, bevezető és korszak; jobbra a homlokzatfotó függőleges kivágása, jól olvasható képaláírással. Kisebb képernyőn egyetlen oszlop; a cím és a fotó ne legyen annyira magas, hogy a korszakokhoz csak sok görgetés után lehessen eljutni. A fotó megengedett vizuális deszaturációja finom, az eredeti kép külön megnyitható.

### Fejléc és belső navigáció

A fejléc a lap elején jelenjen meg, a normál oldalgörgetéssel eltűnik a képernyőről. Asztalon szerepeljen benne a ház neve vagy D18-jel, a fejezetnavigáció, az **Írások** és az **Impresszum**. A fejlécbe helyezett korszaklinkek mellett a korszaknyitók alján is lehet „Tovább az eseményekhez” link, hogy a hosszú oldalon a haladás kézenfekvő legyen. Mobilon a menü lehet összecsukható, de billentyűzettel elérhető és JavaScript nélkül is működő megoldás (például natív `<details>`). Egyik link se tűnjön el pusztán CSS miatt.

### Korszaknyitók

Mind a négy fejezet előtt teljes szélességű, **legalább egy képernyőmagasságú** korszaknyitó álljon. CSS-ben `min-height: 100svh` alkalmas kiindulás; a tartalom szükség esetén növelhesse a magasságot. Szerepeljen rajta fejezetszám, évhatár, cím, rövid (egy–két mondatos) bevezető, egy könnyű továbblépési hivatkozás. A nyitóban megjelenhet nagy, halvány évszám és homlokzatrészlet, de a szöveg előtt ezek mindig háttérben maradjanak. A harmadik korszak sötét felületű, tiszta tipográfiájú, különösebb drámai effekt nélkül.

### Eseménysorok

A timeline egy **függőleges tengely** mentén halad. Asztalon három tervezési oszlop: dátum kb. 145 px, ikonos tengely kb. 38 px, rugalmas tartalmi oszlop, közöttük kb. 17 px rés. Az olvasósáv kb. 1060 px maximális szélességű. A házhoz kötődő sorok kaphatnak enyhe, homokszínű háttérhangsúlyt; Magyarország és Világ sorai vizuálisan halkabbak. Ne gyengítsük el a fontos háttéreseményeket annyira, hogy a történeti kapcsolat elvesszen.

A soroknak három megjelenési változata legyen:

1. **Kompakt szöveges esemény:** dátum, típusikon, típusfelirat, cím, rövid szöveg, opcionális bizonyosság és külső forrás.
2. **Képes esemény:** ugyanaz, plusz a szöveg után nagy, reszponzív kép, saját képaláírás és a kép forrása. A kép az adott sor új `Kép URL` mezőjéből érkezik, ha az nem `—`.
3. **Dokumentumkiemelés:** a releváns eseménynél visszafogott, nyomtatványt idéző idézet- vagy kivonatblokk. Csak valóban ellenőrzött szövegrészlet kerüljön ide; ne generáljunk megtévesztő „eredeti újságoldalt”.

Mobilon a dátum a tartalom fölé kerül, az időtengely baloldalt fut tovább, minden sor egy oszlopra rendeződik. A négy korszakra ugrás legyen mobilon is használható (például kompakt, natív `<select>` vagy törés nélkül hozzáférhető navigáció); a látványtervben mobilon elrejtett navigációs linkeket a kész oldalon **nem** szabad egyszerűen eltüntetni.

## 4. Ikonrendszer és a kétféle jelentés

**Az esemény típusa és az állítás bizonyossága két külön dimenzió.** Mindkettő megjelenhet ugyanabban a sorban, eltérő helyen és méretben.

### Eseménytípus: nagyobb ikon az időtengely csomópontjában

| A forrásfájl `Sáv` értéke | Publikus főkategória | Ikonötlet (Lucide) | Megjegyzés |
|---|---|---|---|
| `D18` | A ház | `house` | A legerősebb vizuális hangsúly. |
| `D18 • személy` | A ház | `house` | Ugyanaz a főkategória, mellette külön „Személy” alcímke; az esemény történhetett máshol. |
| `Környék` | Környék | `map-pin` | A szöveg pontosítsa, ha az esemény **nem** a 18-asban vagy előtte zajlott. |
| `Magyarország` | Magyarország | `flag` | **Egyszínű zászlókontúr, nem országtérkép**: a határok a tárgyalt korszakban változtak. Ne használjunk korhoz kötött állami címert. |
| `Világ` | Világ | `globe-2` vagy az adott Lucide-verzió megfelelő földgömbje | Nem a magyar események ikonjának másik színe. |

Így öt különböző forráscímkéből **négy vizuális főkategória** lesz. Az ikon mellett olvasható kategórianév is legyen; a jelentést ne csak a szín vagy a piktogram hordozza. A magyar zászló jelképe monokróm, az oldal palettájába illő rajzolat, nem élénk piros–fehér–zöld folt.

### Bizonyosság: kisebb ikon és kiírt szó a metaadatsorban

| A forrásfájl `Bizonyosság` értéke | Látható jelölés | Ikonötlet |
|---|---|---|
| `Igazolt` | „Igazolt” | `circle-check` |
| `Valószínű` | „Valószínű” | `circle-dot` |
| `Feltételezés` | „Feltételezés” | `circle-help` |
| `—` | **Nincs jelölés** | Nincs ikon és nincs üres helykitöltő. |

A jelenlegi dokumentumban 17 igazolt, 29 valószínű és 1 feltételezéses sor van; 61 sorban a mező `—`. A `Környék` események között is vannak bizonyossági értékek, tehát ne alkalmazzunk olyan megjelenítési szabályt, hogy kizárólag `D18` sávnál látható a jelölés. A bizonyosság nem egy 0–100-as pontszám, hanem a forrás szerinti három kvalitatív állapot.

**A „bizonyosság” tárgya mindig az adott állítás.** Egy visszaemlékezésnél az „igazolt” jelentheti a forrás létezését és annak tartalmát, miközben egyes részletek, például a pontos nap, bizonytalanok maradnak. Például Dénes Mari pincei razziáról szóló történeténél a január 15. **vagy** 17. megjelölés maradjon látható. Az ikonhoz tartozó rövid jelmagyarázat ezt egyértelműen mondja el; tooltip lehet pluszban, de az alapmagyarázat ne csak hoverrel legyen elérhető.

## 5. Tartalommodell és adatfeldolgozás

A forrásdokumentum egy Markdown-táblázat négy korszak alatt. Az aktuális, hétoszlopos tábla mezői: `Dátum`, `Sáv`, `Esemény és jelentőség`, `Bizonyosság`, `Külső forrás`, **`Kép URL`**, `Cikkötlet`. A `## Amit egyelőre nem viszünk fel házeseményként` rész **nem** publikus timeline-fejezet és nem eseménytábla. A Markdown forrását ne tegyük a weboldal belső PDF-jeire mutató linkké. A kitöltött `Kép URL` **publikus, közvetlen képfájl URL-je**; a többi eseménynél `—`. Ez külön mező, nem a `Külső forrás` hivatkozásából kitalált kép.

Az építés során célszerű a táblázatot típusos Astro content collectionbe vagy előállított JSON-fájlba átalakítani. GFM-táblázatot értő parser használata jobb, mint a nyers sorok naiv `|` szerinti szétszedése. Minden rekord őrizze meg a nyers szöveget is, amíg az átalakítás helyessége nem ellenőrzött. Ajánlott mezők:

```ts
type EraId = '1873-1913' | '1914-1938' | '1939-1945' | '1946-1968';
type SourceLane = 'D18' | 'D18 • személy' | 'Környék' | 'Magyarország' | 'Világ';
type Category = 'house' | 'area' | 'hungary' | 'world';
type Confidence = 'verified' | 'probable' | 'hypothesis' | null;

type TimelineEvent = {
  id: string;                 // stabil slug / azonosító, anchorhoz
  era: EraId;
  sourceIndex: number;        // eredeti sorszám: azonos vagy bizonytalan dátumok sorrendjéhez
  dateLabel: string;          // pontosan megőrzött megjelenítési dátum
  sortStart?: string;         // csak ha az adatból megállapítható; ne találj ki napot
  sortEnd?: string;           // időtartamhoz, ha van
  sourceLane: SourceLane;
  category: Category;
  personSubtype: boolean;    // D18 • személy esetén true
  title: string;             // a hosszabb forrásszövegből szerkesztett, hű cím
  description: string;       // állítások és fenntartások megőrzésével
  confidence: Confidence;
  sources: { label: string; url: string }[];
  imageUrl?: string;         // a build során helyben kiszolgált URL; eredetije a Markdown Kép URL oszlopában
  originalImageUrl?: string; // változatlan publikus asset-URL az auditálható forrásadatból
  articleIdea?: string;      // szerkesztési metaadat, nem automatikusan publikus
  media?: {
    src: string;
    alt: string;
    caption: string;
    sourceUrl?: string;
    attribution?: string;
    width?: number;
    height?: number;
    depictsHouse: boolean;  // megkülönbözteti a házat a környezeti illusztrációtól
  }[];
};
```

A Markdownban szereplő `Kép URL` csak valódi, nyilvánosan letölthető képfájl címe lehet, nem Fortepan/Hungaricana gyűjteményi adatlap és nem belső kutatási PDF. A `—` értékből `undefined` legyen; ne kerüljön törött képdoboz a felületre. A `media` objektum a szerkesztéskor hozzáadható képaláírást, alt szöveget, kreditet és képméretet hordozza. Az egyetlen URL a jelenlegi tartalmi követelmény; a modell engedhet később több képet, de az első verzióban egy eseményhez legfeljebb egy elsődleges kép tartozik.

**Build előtti képfeldolgozás:** a preprocessor a kitöltött publikus URL-eket beolvassa és letölti a projekt saját assetkönyvtárába. A forrás-Markdown URL-jei változatlanok maradnak; a generált eseményadat `originalImageUrl` mezője őrzi az eredeti címet, míg az `imageUrl` és a `media.src` a helyben kiszolgált kép útvonala lesz. A letöltést determinisztikus, ütközésmentes fájlnévvel végezze (például Fortepan-azonosítóval és az eredeti URL rövid hashével), ugyanazon URL-t csak egyszer töltse le, és az azonos tartalom újbóli buildje ne készítsen fölösleges másolatot. Ellenőrizze a sikeres HTTP választ, a tényleges képfájl-tartalmat és a képméretet; hibás URL vagy HTML-hibalap esetén a build adjon egyértelmű hibát az esemény azonosítójával és a forrás-URL-lel, ne jelenítsen meg törött képet vagy hallgatólagosan távoli hotlinket. A sikeres letöltésekből készülhet kis előnézet és nagy felbontású helyi változat; mindkettő saját tárhelyről töltődjön. Az archív forrásoldal és a képkredit publikus linkként továbbra is megmarad a képaláírásban. A képekre vonatkozó licenc- és attribúciós adatot külön szerkesztői metaadat hordozza, nem a fájlnév.

A képaláíráshoz és kredithez szükséges adat nincs benne az URL-ben: ezeket a kép felvételekor külön szerkesztői metaadatban, az esemény `id`-jához kötve kell megadni. A fejlesztés ne találja ki a képen látható személyt vagy eseményt a fájlnévből. A kód kezelje a kitöltött URL-t, a nyilvános megjelenítéshez pedig legyen valódi alt, felirat és szükséges jogosultság/kredit; a hiányokat szerkesztői feladatként jelezze.

**Dátumkezelés:** a „1901 körül”, „1945. jan. 15. vagy 17.”, „1944. dec. 24. – 1945. febr. 13.” és „1945 után, pontos év nélkül” feliratok szemantikája maradjon látható. Nem szabad mindegyiket kitalált, napra pontos ISO-dátumként megjeleníteni. Ha a dátum csak megközelítő vagy több lehetséges napja van, a megjelenített felirat legyen az igazság forrása, az eredeti `sourceIndex` pedig stabil rendezési támpont. Az események sorrendjét a mostani kutatási fájl határozza meg. Ne helyezzünk el kronológiai skálán valós idejű hosszúságnak látszó közöket: az oldal narratív sorrendű, nem arányos időtengely.

**Forráslinkek:** csak nyilvánosan felhasználható, kulturált külső forráslink kerüljön a publikált oldalra. A kutatási blokk-PDF-ek belső munkafájlok: nevüket, elérési útjukat és hivatkozásukat **ne** közöljük a weboldalon. A táblázat `—` értékéből ne legyen üres „Forrás” gomb. Ha a külső link nyilvánosan hozzáférhető eredeti archív dokumentumra mutat, megjeleníthető; a link szövege nevezze meg a forrást. A forrásban nem igazolt részletet ne emeljünk át tényállításként a felületre.

**Tartalmi megkötések a jelenlegi kutatás alapján:**

- A Hübner–Kalix attribúciós vonalat ne hozzuk vissza publikus timeline-eseményként. A Mellinger-vonal valószínűként szerepel; az eredeti tervlap hiánya miatt ne címkézzük igazoltnak.
- A Spitz és Mellinger családok közötti rokoni kapcsolat munkahipotézis; a pontos rokonsági fok nincs bizonyítva. Ha előkerül a felületen, ezzel a korláttal jelenjen meg.
- A csillagos házzá kijelölés dokumentált. A feltételezett „védett ház / Miletits / 300 fő” állítás ne jelenjen meg házeseményként.
- A környéken történt bombakár nem bizonyítja a 18-as ház bombatalálatát; a Dembinszky utca más házáról készült fénykép nem a 18-as fényképe.
- A 1963-as Fortepan-képnél a ház azonosítható, de a felvétel napját és „május elsejei” jellegét nem szabad megalapozatlanul pontosítani.

## 6. Képek, dokumentumok, képaláírások

Az ötödik kutatási blokk vizuális dossziéja segít a képek kiválasztásában, de **nem** publikus forráslink. Különítsük el a következőket: (a) a házat mutató korabeli kép; (b) mai homlokzati kép; (c) környékfotó, amely nem bizonyítottan mutatja a házat; (d) címtár, hirdetés, hivatalos lista vagy visszaemlékezés dokumentuma. Minden képhez tartozzon felirat arról, **mit mutat** és, ha releváns, **mit támaszt alá**. A gyűjtemény, alkotó és felhasználási feltételek alapján adjunk forrásmegjelölést.

### Kép megjelenése és nagyítása – pontos UX

- A `Kép URL` mezőt **a kutatási Markdown-táblázatban külön, látható oszlopként** tartsuk meg, és a feldolgozott eseményadatban `imageUrl`-ként. A publikus oldalon az esemény szövegének részeként jelenjen meg a kép, nem egy mindentől elszakított képgalériában. A `—` esetén nincs képhely vagy nagyításvezérlő.
- Fotónál reszponzív, jellemzően a tartalmi oszlop szélességét kitöltő előnézet; dokumentumoldalnál az egész lap legyen felismerhető (`object-fit: contain`), ne vágjuk le a bizonyítékul szolgáló dátumot, nevet vagy házszámot egy esztétikus kivágás kedvéért. A képaláírás **az előnézet alatt mindig látható**. A képhez tartozó külső gyűjteményi forrás külön szöveges link marad.
- Kattintás vagy billentyűzetes aktiválás egy nagy, képernyőhöz illesztett, nagyítható nézetet nyit (javasolt PhotoSwipe). Legyen egyértelmű bezárás, Escape, mobilon érintéses nagyítás és dokumentumoknál az olvashatósághoz elég zoom. Egyetlen kép esetén ne jelenítsünk meg értelmetlen „előző/következő” navigációt. A háttérhez való visszatérés ugyanarra az eseményre vigyen.
- A működő HTML-alap egy helyben kiszolgált nagy képre mutató `<a href="LOCAL_FULL_IMAGE_URL">` legyen, benne a helyi előnézeti `<img>`: JavaScript vagy lightbox nélkül a nagy kép közvetlenül megnyitható. A PhotoSwipe által igényelt képméreteket (`data-pswp-width`, `data-pswp-height`) képfeldolgozáskor állapítsuk meg vagy tároljuk a médiametaadatban; ne találjunk ki méretet. A távoli URL-ek elérhetőségét a kiadás előtt a képfeldolgozó build ellenőrzi. [PhotoSwipe: Getting Started](https://photoswipe.com/getting-started/)
- Az `<img>` kapjon érdemi `alt` szöveget és ismert szélességet/magasságot; az összefüggő történeti magyarázat `<figure><figcaption>` alatt jelenjen meg. A képaláírás ne csak a lightboxban legyen elérhető; a PhotoSwipe sem ad hozzá automatikusan képaláírást. A képernyő első fotója tölthető azonnal, a lentebbi képek `loading="lazy"`-vel; lehetőleg saját, optimalizált előnézetet szolgáljunk ki, és csak megnyitáskor kérjük le a nagy felbontást. [PhotoSwipe: Caption](https://photoswipe.com/caption/), [MDN: figcaption](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/figcaption)
- A kép-URL és a forrásoldal külön mező. Ha egy archívum tiltja a közvetlen képlink használatát, válasszunk az ottani feltételeknek megfelelő saját kiszolgálást vagy forráslinket; gyűjteményi landing page-et nem szabad képfájlként beírni a `Kép URL` oszlopba.

Kiemelt, felkutatandó / beilleszthető képi helyek a mai timeline alapján:

- A feltöltött homlokzatfotó a nyitóban és a korai házeseménynél, „mai állapot” felirattal.
- Fortepan #82508: Rottenbiller–Dembinszky környéki nézet, **nem** bizonyítottan a 18-as.
- 1903-as Mautner-hirdetés és 1904-es Budapesti Napló-cikk: eredeti, jogszerűen használható képkivágat, ha rendelkezésre áll; addig szöveges forráslink vagy hiteles, pontosan megjelölt átirat.
- 1929-es Drescher-hirdetés: a III/5-ös történethez.
- Az 1944-es csillagosház-jegyzék releváns részlete; a 1945. januári „Ki tud róla?” közlés, ha megfelelő kép érhető el.
- Fortepan #148696: 1963-as fénykép, amelyen a ház balra azonosítható; a forrás-Markdownban a tényleges képfájl URL-je már szerepel.

**Már kitöltött publikus képek:** Fortepan #82508 (1900 körül), #157067 (1931), #18543 (1958), #148696 (1963) és #97493 (1968). Az 1900, 1931, 1958 és 1968 környéki képek **nem** a 18-as ház igazoló fotói. A #82508 különleges forrásmegjelölése: Fortepan / Budapest Főváros Levéltára, Klösz György, HU.BFL.XV.19.d.1.07.184. A többi kép pontos adományozóját és ajánlott kreditjét az archív fotó adatlapján ellenőrizzük a publikációhoz; a Fortepan az adományozó nevének feltüntetését kéri. [Fortepan felhasználási és kreditútmutató](https://fortepan.hu/en/about-us/)

A nagy felbontású, nagyon széles szkennelt lapokhoz külön eredeti kép-/forráslink is kellhet. Képet hiányzó forrás esetén ne helyettesítsünk generált „korabeli fotóval”.

## 7. Technológiai döntés és implementáció

**Ajánlott stack:** Astro statikus build + saját komponensek és CSS + kis mennyiségű natív JavaScript az esetleges későbbi szűréshez és a képnézőhöz. Szerveroldali futtatás, adatbázis és React nem szükséges az első verzióhoz. Az oldal sima statikus tárhelyre kimenetként telepíthető; konkrét hostingot és az idővonal végső útvonalát ezen a ponton még nem rögzítettünk. A ház oldala lehet a `dembinszky18.hu` webhely része. Az Írások és Impresszum tervezett útvonala feljebb szerepel.

**Kiinduló HTML/CSS minták:** [CodeFronts Editorial History Timeline](https://codefronts.com/layouts/css-timelines/editorial-spine/) a sűrű, nyomtatványszerű, függőleges eseménysorhoz; a nagy korszaknyitók és a képes kártyák egyedi kiegészítések. A korábban nézett [CodyHouse Vertical Timeline](https://codyhouse.co/gem/vertical-timeline/) csak alternatív kiindulópont. A [PhotoSwipe](https://photoswipe.com/) a nagyítható képekhez megfelelő. A [Vitrine](https://astro.build/themes/details/vitrine/) inkább vizuális referencia a katalógusszerű képbemutatáshoz, nem kötelező függőség. A felhasznált minták és képek licenceit az implementáció előtt külön ellenőrizni kell; a végső CSS-t nyugodtan lehet önállóan megírni.

Ajánlott Astro-komponensek: `SiteHeader`, `Hero`, `EraOpener`, `Timeline`, `TimelineEvent`, `EventTypeIcon`, `ConfidenceMark`, `EvidenceFigure`, `SourceLinks`, `Legend`; továbbá `/irasok/` cikkindex és `/impresszum/` oldal. Az `EraOpener` és `TimelineEvent` adatokból épüljön; ne kézzel duplikált esemény-HTML-ből. A megjelenítés a tartalomtól különálló legyen, hogy a későbbi, több kategóriára és korszakra szűrő felület a tartalom átírása nélkül hozzáadható maradjon.

## 8. Akadálymentesség és minőség

- Szemantikus `main`, `nav`, `section`, listák és dátumok; minden korszaknak stabil `id` és egyértelmű címsorhierarchia.
- Valódi, látható linkek és fókuszjelölés; billentyűzettel végigjárható navigáció és képnéző.
- A fejléc ne tapadjon a képernyő tetejére; a mobil menü, az Írások és az Impresszum billentyűzettel is elérhető legyen.
- Az eseménytípus **és** a bizonyosság ikonja mellett olvasható szöveg; dekoratív SVG `aria-hidden`, ikon nélküli állapotban sem veszhet el lényeges információ.
- A képekhez nem redundáns, tárgyszerű `alt`; hosszabb értelmezés a látható képaláírásban. Történeti illusztráció soha ne tűnjön a ház bizonyító erejű fotójának, ha nem az.
- Ellenőrizzük a szöveg/szín kontrasztot, a 320–360 px széles mobilnézetet, a nagyított betűt, a hosszú magyar dátumokat és a „vagy” típusú bizonytalan feliratokat.
- Kevés és visszafogott mozgás; `prefers-reduced-motion` esetén se maradjon el tartalom. A statikus HTML tartalma JavaScript nélkül is olvasható legyen.
- A ház fő SEO-címe és leírása a tartalmat írja le; a külső linkek új ablak esetén `rel="noopener noreferrer"` attribútumot kapjanak.

## 9. Átadási / elfogadási feltételek

A megvalósítás akkor tekinthető késznek az első verzióhoz, ha:

1. A timeline-dokumentum **mind a 108 eseménye** a megfelelő korszakban és forrássorrendben megjelenik; az öt forrásbeli `Sáv` érték négy publikus főkategóriába rendeződik, a `D18 • személy` alcímke megmarad. A `Kép URL` a Markdown-táblában önálló oszlop és az adatmodellbe hibátlanul átkerül.
2. Pontosan négy teljes képernyős, jól olvasható korszaknyitó választja el a részeket; a navigáció mindegyikre működik asztalon és mobilon.
3. Az esemény típusának ikonja **a tengelyen**, a bizonyosság ikonja **a metaadat mellett** jelenik meg; `—` esetén nincs bizonyossági jel. A „Magyarország” ikon zászlókontúr, **nem országtérkép**.
4. A dátumfeliratok bizonytalansága, az eredeti állítások fenntartásai és a külső forráslinkek nem vesznek el az átalakításkor; a belső kutatási PDF-ek nem kerülnek a publikus oldalra.
5. Van legalább egy szépen szerkesztett, feliratozott képes esemény és egy dokumentumkiemelés; a hiányzó történeti képeket nem helyettesíti megtévesztő tartalom.
6. A kezdőképernyő és a négy korszak a ház fotójához illő, meleg, tompított palettát használ; az 1939–45-ös rész vizuálisan méltóságteljes, nem hatásvadász.
7. A statikus build lefut; asztali és mobil nézetben nincs levágott szöveg, eltűnő navigáció vagy ikonok nélkül értelmezhetetlen információ.
8. A kitöltött `Kép URL`-hez tartozó előnézet az eseménynél látszik; aktiválva nagyítható; a felirat a nagyítótól függetlenül olvasható; `—` értékű sorban nincs üres képdoboz. A nagy kép JavaScript nélkül is megnyitható.
9. A fejléc együtt görgetődik az oldallal. Az **Írások** és az **Impresszum** menüpont működő, elkülönült célra vezet; az Impresszum a láblécből is elérhető.
10. A preprocessor a kitöltött URL-ekből a projektbe másolt, érvényes képfájlokat készít; a végső HTML kép- és nagyítási hivatkozásai helyi assetre mutatnak, a publikus archív adatlap és a kötelező kredit megmarad.

## 10. Jelenleg még nyitott, ne találjuk ki helyettük

- A végső URL/route és a hosting.
- A homlokzati fotó és minden történeti kép publikálási joga, pontos kreditje és teljes felbontású képfájlja.
- A további cikkek elkészülte és a `Cikkötlet` mezők végleges hivatkozásai. Cikklink csak létező oldalra mutasson. Az **Írások** menünév később pontosítható.
- Az impresszum végleges szerzői/üzemeltetői és kapcsolati adatai; a route létrehozható, de kitalált adatokkal nem publikálható.
- A későbbi szűrő felület pontos kezelése; az első kiadás teljes, szűrés nélküli idővonallal indul.
- Az eredeti tervlap és más kutatási hiányok; a felület a jelenlegi bizonyosságot közölje, ne pótolja fikcióval.
