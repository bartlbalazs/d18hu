# Reconciliation: claim-by-claim record of the source-criticism split

Each reviewed event has one entry. **Rewritten** entries list the claims of the original description, where each one now lives, and whether it got stronger:
- **V**: the visible description.
- **N**: the „Forráskritika és pontosítások” notes (`sourceCriticism`).
- **R**: redundant, because it is still stated unchanged somewhere else; the entry says where.

**Unchanged** entries are listed only for cards over 60 words, each with a reason.

Fixed in every entry, and checked by `scripts/timeline-snapshot.ts`:
- the id (date label and first four words);
- the lane, certainty and title;
- the sources;
- the image, caption and credit.

---

## 1873–1913

### 1908-1909-wagner-ferenc-a-haz

1908–1909 · *Pécsi ítéletek a III/3 későbbi lakójának* · D18 • személy · verified. **Rewritten.**

**Before**

> **Wágner Ferenc**, a ház 1937-ben igazolt **III/3**-as lakója, a későbbi rabtörzskönyvek előéleti rovata szerint 1908-ban magánokirat-hamisításért egy év börtönt, 1909-ben zsarolásért tizennégy nap fogházat kap; mindkét ügy pécsi előtörténetéhez tartozik. Ugyanez a rovat egy 1924-es budapesti sikkasztásért kiszabott kéthónapi fogházat is feljegyez. A személyazonosítást a születési adatok és a családi rovatok egyezése támogatja. A III/3-as cím csak 1937-ből igazolt, ezek az esetek nem a lakásban történtek.

**After: visible**

> **Wágner Ferenc**, a ház 1937-ben igazolt **III/3**-as lakója, a későbbi rabtörzskönyvek előéleti rovata szerint 1908-ban magánokirat-hamisításért egy év börtönt, 1909-ben zsarolásért tizennégy nap fogházat kap; mindkét ügy pécsi előtörténetéhez tartozik. Ugyanez a rovat egy budapesti sikkasztásért kiszabott kéthónapi fogházat is feljegyez. Ezek az ügyek nem a lakásban történtek.

**After: notes**

1. A személyazonosítást a születési adatok és a családi rovatok egyezése támogatja. A III/3-as cím csak 1937-ből igazolt.
2. Az előéleti rovat a budapesti sikkasztást 1924-re teszi. A házaspár 1922-es rabtörzskönyvei egy közös, 1922-es sikkasztási ügyben két, illetve egy hónap fogházat rögzítenek; hogy a két adat ugyanarra az ítéletre vonatkozik-e, a forrásokból nem dönthető el.

| Original claim | Where | Not stronger |
|---|---|---|
| Wágner Ferenc is the house's III/3 resident, documented in 1937 | V | ✓ |
| Per the later registers' previous-record column: 1908, forging a private document, one year börtön | V | ✓ |
| 1909, blackmail, fourteen days fogház; both cases belong to his Pécs past | V | ✓ |
| The same column records a two-month fogház for a Budapest sikkasztás | V (the year moved to N2) | ✓ |
| …dated 1924 | N2, now set against the 1922 joint case recorded on the 1937 card | ✓ |
| Identification is supported by matching birth data and family columns | N1 | ✓ |
| The III/3 address is documented only for 1937 | N1; V keeps the 1937 qualifier | ✓ |
| These cases did not happen in the flat | V; also in the caption | ✓ |

**Caption check**: „Wágner Ferenc 1933-as rabtörzskönyvének előéleti rovata. Egyik ítélet sem a Dembinszky utcai lakáshoz kötődik.” It still reads correctly.

**Findings**

- *Flagged, partly resolved in the notes*: the 1933 previous-record column dates the Budapest sikkasztás 1924, while the 1937 card (from the couple's 1922 registers) dates the joint sikkasztás case 1922 with the same two-month sentence. The visible text no longer states a year, and the notes on both cards record the discrepancy without choosing one.

## 1914–1938

### 1929-apr-29-uhereczky-ferenc-budapesti-muszereszmester

1929. ápr. 29. · *Elektromos sebességváltó, bejelentve* · D18 • személy · Valószínű. **Rewritten** (pilot).

**Before**

> **Uhereczky Ferenc** budapesti műszerészmester szabadalmi bejelentést tesz egy „elektromos úton működő sebességváltó berendezés autókhoz” című találmányra; a *Szabadalmi Közlöny* december 15-én U. 765 alapszámon közli. Ez bejelentési alapszám, nem megadott szabadalom lajstromszáma: a közlemény nem bizonyítja az oltalom megadását, a szerkezet elkészítését, sem azt, hogy az 1929-es kisautóba beépítették. A bejelentő azonossága az autóépítővel és a ház 1924-es lakójával valószínű, de nem igazolt.

**After: visible**

> **Uhereczky Ferenc** budapesti műszerészmester szabadalmi bejelentést tesz egy „elektromos úton működő sebességváltó berendezés autókhoz” című találmányra. Ez bejelentés, nem megadott szabadalom, és nem is elkészült szerkezet. A bejelentő azonossága az autóépítővel és a házhoz 1924-ben kapcsolt Uhereczky Ferenccel valószínű, de nem igazolt.

**After: notes**

1. A *Szabadalmi Közlöny* december 15-én U. 765 alapszámon közli a bejelentést. Ez bejelentési alapszám, nem egy megadott szabadalom lajstromszáma: a közlemény nem bizonyítja sem az oltalom megadását, sem a szerkezet elkészítését.
2. Arra sincs bizonyíték, hogy a sebességváltót beépítették az 1929-es kisautóba. A közlemény utcai címet nem közöl, ezért a bejelentő és a házhoz kapcsolt Uhereczky azonossága következtetés.

| Original claim | Where | Not stronger |
|---|---|---|
| Uhereczky Ferenc, a Budapest műszerészmester, files a patent application for the named invention | V | ✓ |
| The Közlöny publishes it on Dec 15 under U. 765 | N1 | ✓ |
| U. 765 is an application number, not a granted patent's register number | N1; V in short form ("bejelentés, nem megadott szabadalom") | ✓ |
| It doesn't prove protection was granted | N1; V in short form | ✓ |
| It doesn't prove the device was built | N1; V in short form ("nem is elkészült szerkezet") | ✓ |
| It doesn't prove the device was fitted to the 1929 small car | N2 | ✓ |
| Identity with the car builder: likely, not proven | V | ✓ |
| Identity with the "ház 1924-es lakója": likely, not proven | V, reworded to "a házhoz 1924-ben kapcsolt" (see Findings) | ✓ weaker, not stronger |
| (Caption: no street address, so no link to the house) | R, caption unchanged; N2 gives the consequence for identity | ✓ |

**Caption check**: „A Szabadalmi Közlöny 1929. december 15-i száma közli a bejelentést. Utcai címet nem ad, így a házhoz nem köti.” It still reads correctly next to the new text, and now carries the publication date that left the visible text.

**Findings**

- *Fixed*: the original called the 1924 Uhereczky "a ház 1924-es lakója". The 1924 notarial record gives the address in a lakhely/telephely field and doesn't prove residence, so the new text says "a házhoz 1924-ben kapcsolt".

### 1919-kiss-janos-a-dembinszky

1919 · *Kiss János és egy 1919-es büntetőügy* · D18 · verified. **Rewritten.**

**Before**

> **Kiss János**, a Dembinszky utca 18. címén nyilvántartott, 23 éves, Pomázon született evangélikus hajókezelő neve egy vörösőrrel kapcsolatos ügyészségi büntetőügyben szerepel. A levéltári katalógus az ügyet „izgatás” jogcímmel tartja nyilván. A konkrét kijelentés vagy cselekmény és az ügy kimenetele nem ismert; a vörösőri szerepből nem következik, hogy Kiss a Lenin-fiúk valamely különítményéhez tartozott.

**After: visible**

> **Kiss János**, a Dembinszky utca 18. címén nyilvántartott, 23 éves, Pomázon született evangélikus hajókezelő neve egy vörösőrrel kapcsolatos ügyészségi büntetőügyben szerepel. A levéltári katalógus az ügyet „izgatás” jogcímmel tartja nyilván; hogy pontosan mit mondott vagy tett, és mi lett az ügy kimenetele, nem ismert.

**After: notes**

1. Az ügyészségi katalógus jogcíme nem bizonyítja a cselekményt, és nem jelent ítéletet. A vörösőri szerepből nem következik, hogy Kiss a Lenin-fiúk valamely különítményéhez tartozott.

| Original claim | Where | Not stronger |
|---|---|---|
| Kiss János, registered at D18, age 23, born in Pomáz, Lutheran, boatman, named in a prosecution case connected to a Red Guard member | V | ✓ |
| The archive catalogue files the case as „izgatás” | V | ✓ |
| The specific statement or act is unknown | V | ✓ |
| The outcome is unknown | V | ✓ |
| The Red Guard role doesn't imply membership of a Lenin Boys unit | N1 | ✓ |
| (Implicit: the catalogue heading proves neither the act nor a judgment) | N1, stated explicitly as the brief asks | ✓ |

### 1919-nagy-gyorgy-a-nagyszoloson

1919 · *Még egy izgatási ügy: Nagy György* · D18 · verified. **Rewritten.**

**Before**

> **Nagy György**, a Nagyszőlősön született református számtiszt lakcíme a Dembinszky utca 18., **földszint 8.** Egy másik 1919-es ügyészségi büntetőügy katalógusában az ő neve mellett is „izgatás” szerepel. A vád alapjául szolgáló cselekmény és az ügy kimenetele nem ismert; a két házlakó közötti személyes vagy politikai kapcsolatra sincs adat.

**After: visible**

> **Nagy György**, a Nagyszőlősön született református számtiszt lakcíme a Dembinszky utca 18., **földszint 8.** Egy másik 1919-es ügyészségi büntetőügy katalógusában az ő neve mellett is „izgatás” szerepel; a vád alapjául szolgáló cselekmény és az ügy kimenetele nem ismert.

**After: notes**

1. Az ügyészségi katalógus jogcíme nem bizonyítja a cselekményt, és nem jelent ítéletet. A két házlakó, Kiss János és Nagy György közötti személyes vagy politikai kapcsolatra nincs adat.

| Original claim | Where | Not stronger |
|---|---|---|
| Nagy György, born in Nagyszőlős, Reformed, clerk; address D18, ground floor 8 | V | ✓ |
| Another 1919 prosecution case catalogue lists „izgatás” next to his name | V | ✓ |
| The act behind the charge and the outcome are unknown | V | ✓ |
| No evidence of a personal or political link between the two residents | N1 (names added for clarity) | ✓ |

### 1920-1929-takats-eberhard-arpad-es

1920–1929 · *Autós vállalkozók a házban* · D18 · verified. **Rewritten.**

**Before**

> **Takáts Eberhard Árpád** és **Beszedits** (Beszedics) **Gyula** 1920-ban közös telefon-előfizetéssel szerepel a ház címén. Az 1921-es Baross Autóvállalat cégbejegyzési iratai mindkettőjüket garázstulajdonosként, Dembinszky utca 18. címmel sorolják fel; az 1922–1923-as lakásjegyzék Eberhard Árpádot autóvállalat-tulajdonosként, az 1929-es telefonkönyv Takáts Árpádot ugyanitt közli. A két férfi 1922-ben a Heros Rt. igazgatóságában is szerepel. A címadatok nem bizonyítják, hogy maga a garázs is az épületben működött.

**After: visible**

> **Takáts Eberhard Árpád** és **Beszedits** (Beszedics) **Gyula** 1920-ban közös telefon-előfizetéssel szerepel a ház címén, és 1921-ben a Baross Autóvállalat garázstulajdonosaiként is ezt a címet adják meg. A címadatok nem bizonyítják, hogy maga a garázs is az épületben működött.

**After: notes**

1. Az 1921-es Baross Autóvállalat cégbejegyzési iratai mindkettőjüket garázstulajdonosként, Dembinszky utca 18. címmel sorolják fel. Az 1922–1923-as lakásjegyzék Eberhard Árpádot autóvállalat-tulajdonosként, az 1929-es telefonkönyv Takáts Árpádot közli ugyanitt.
2. A két férfi 1922-ben a Heros Rt. igazgatóságában is szerepel.

| Original claim | Where | Not stronger |
|---|---|---|
| 1920: shared phone subscription at the house's address | V | ✓ |
| 1921: the Baross Autóvállalat registration papers list both as garage owners at D18 | V (short form); N1 (full) | ✓ |
| 1922–1923 directory: Eberhard Árpád as car-firm owner at D18 | N1 | ✓ |
| 1929 phone book: Takáts Árpád at D18 | N1 | ✓ |
| 1922: both on the Heros Rt. board | N2 | ✓ |
| The addresses don't prove the garage operated in the building | V | ✓ |

**Caption check**: „Takáts Eberhard Árpád és Beszedics Gyula közös telefonszáma az 1920-as telefonkönyvben.” It still reads correctly next to the new text.

**Findings**

- *Flagged*: the title „Autós vállalkozók a házban” ("car businessmen in the house") says more than the address evidence does. Titles are outside this refactor's scope, so it is unchanged; „Autós vállalkozók a ház címén” is a possible fix.

### 1923-ket-1923-as-fovarosi

1923 · *Kálix Ödön a 18-as címen* · D18 · verified. **Rewritten.**

**Before**

> Két 1923-as fővárosi közgyűlési névsor **Kálix Ödön** pékmester címét Dembinszky utca 18-ként közli: januárban rendes bizottsági tagként, decemberben póttagként szerepel. Kenyérgyárának 1912-es reklámja még a 17-es címet adta meg, és az 1931-es, 1934-es tulajdonosi sorok is a 17-es, nem a 18-as házhoz kötik. A névsorok a címközlést igazolják, de a tényleges lakóhelyet, a 18-as ház tulajdonlását vagy építtetését nem döntik el.

**After: visible**

> Két 1923-as fővárosi közgyűlési névsor **Kálix Ödön** pékmester címét Dembinszky utca 18-ként közli: januárban rendes bizottsági tagként, decemberben póttagként szerepel. A névsorok a címközlést igazolják, de a tényleges lakóhelyet, a 18-as ház tulajdonlását vagy építtetését nem döntik el.

**After: notes**

1. Kenyérgyárának 1912-es reklámja még a 17-es címet adta meg, és az 1931-es, 1934-es tulajdonosi sorok is a 17-es, nem a 18-as házhoz kötik.

| Original claim | Where | Not stronger |
|---|---|---|
| Two 1923 assembly lists give Kálix Ödön, master baker, the D18 address | V | ✓ |
| January: full committee member; December: deputy | V | ✓ |
| His 1912 bakery advertisement gives no. 17 | N1 | ✓ |
| The 1931 and 1934 owner entries link him to no. 17, not no. 18 | N1 | ✓ |
| The lists prove only the stated address, not residence, ownership or building | V | ✓ |

**Caption check**: „A fővárosi közgyűlés 1923. január 10-i jegyzőkönyve Kálix Ödönt a IV. számú bizottság rendes tagjai között sorolja fel.” It still reads correctly next to the new text.

### 1924-egy-kozjegyzoi-alairashitelesitesi-ugyben

1924 · *Mechanikai vállalkozó és cipészmester* · D18 · verified. **Rewritten.**

**Before**

> Egy közjegyzői aláíráshitelesítési ügyben **Uhereczky Ferenc** mechanikai vállalat tulajdonos és **Drescher Lipót** cipészmester ugyanazzal a Dembinszky utca 18. címmel szerepel; Drescher a kereskedelmi és ipari címtárban is a ház címével áll. A katalógus közös „lakhely/telephely” mezőjéből nem dönthető el, hogy lakásról vagy üzleti címről van-e szó, és a nyilatkozat tartalma, a két férfi esetleges társulása sem derül ki. Drescher más forrásból ismert III/5-ös címe nem vetíthető át Uhereczkyre. A név, a műszaki foglalkozás és a VII. kerületi címek sora alapján Uhereczky nagy valószínűséggel az 1898-ban született kerékpárosbajnok, de a személyazonosság még nincs lezárva.

**After: visible**

> Egy közjegyzői aláíráshitelesítési ügyben **Uhereczky Ferenc** mechanikai vállalat tulajdonos és **Drescher Lipót** cipészmester ugyanazzal a Dembinszky utca 18. címmel szerepel. Hogy ez lakást vagy üzleti címet jelöl, a katalógusból nem dönthető el. Uhereczky nagy valószínűséggel az 1898-ban született kerékpárosbajnok, de a személyazonosság még nincs lezárva.

**After: notes**

1. A katalógus közös „lakhely/telephely” mezőt használ, és nem közli a nyilatkozat tartalmát, így a két férfi esetleges társulása sem derül ki. Drescher a kereskedelmi és ipari címtárban is a ház címével áll; más forrásból ismert III/5-ös címe nem vetíthető át Uhereczkyre.
2. Az azonosítást a név, a műszaki foglalkozás és a VII. kerületi címek sora támogatja.

| Original claim | Where | Not stronger |
|---|---|---|
| In a notarial signature-authentication case, Uhereczky (owner of a mechanical firm) and Drescher (master shoemaker) share the D18 address | V | ✓ |
| Drescher also appears at the house's address in the trade directory | N1 | ✓ |
| The shared lakhely/telephely field can't tell residence from business address | V (short); N1 (the field) | ✓ |
| The declaration's content is unknown | N1 | ✓ |
| Any partnership between the two men is unknown | N1 | ✓ |
| Drescher's III/5 address can't be carried over to Uhereczky | N1 | ✓ |
| Name, technical occupation and VII. district addresses support identification with the 1898-born champion | V (conclusion); N2 (basis) | ✓ |
| Identity not closed | V | ✓ |

### 1924-jul-26-a-parizsi-olimpia-tandemversenyeben

1924. júl. 26. · *Tandemben a párizsi olimpián* · D18 • személy · probable. **Rewritten.**

**Before**

> A párizsi olimpia tandemversenyében **Uhereczky Ferenc** és **Grimm János** alkot magyar párost. Július 26-án az előfutamban kikapnak a holland kettőstől, így nem jutnak be a háromcsapatos döntőbe; az eredményjegyzék megosztott negyedik helyet közöl. Az 1898-ban Léván született Uhereczky többszörös magyar bajnok kerékpáros. Az olimpiai adat biztos; hogy ő a ház 1924-es mechanikai vállalkozója, azt a név és a műszaki pálya erősen támogatja, de személyazonosító adat még nem köti össze őket.

**After: visible**

> A párizsi olimpia tandemversenyében **Uhereczky Ferenc** és **Grimm János** alkot magyar párost. Július 26-án az előfutamban kikapnak a holland kettőstől, így nem jutnak be a háromcsapatos döntőbe; az eredményjegyzék megosztott negyedik helyet közöl. Az 1898-ban Léván született Uhereczky többszörös magyar bajnok kerékpáros. Hogy ő a ház címén 1924-ben szereplő mechanikai vállalkozó, valószínű, de nem bizonyított.

**After: notes**

1. Az olimpiai adat biztos. Az azonosítást a név és a műszaki pálya erősen támogatja, de személyazonosító adat még nem köti össze a sportolót a közjegyzői katalógus vállalkozójával.

| Original claim | Where | Not stronger |
|---|---|---|
| Uhereczky and Grimm form the Hungarian tandem pair in Paris | V | ✓ |
| 26 July: lose the heat to the Dutch pair, miss the three-team final | V | ✓ |
| The results list shows a shared fourth place | V | ✓ |
| Uhereczky, born 1898 in Léva, several-time Hungarian champion | V | ✓ |
| The Olympic data is certain | N1 | ✓ |
| Identity with the 1924 D18 contractor: strongly supported by name and technical career | V ("valószínű", matching the Valószínű badge); N1 (basis) | ✓ |
| No identifying data links them yet | N1; V "nem bizonyított" | ✓ |

### 1925-osz-a-magyar-penzugy-a

1925. ősz · *A Strandfürdő Rt. közgyűlési hirdetménye* · D18 · verified. **Rewritten.**

**Before**

> A *Magyar Pénzügy* a Strandfürdő Rt. október 5-re kitűzött alaptőke-emelési közgyűlésénél a Dembinszky utca 18. címet közli. A cég kapcsolata a házzal már 1924-ből dokumentált: az 1924-es szaknévsor a Strandfürdő részvénytársaságot ezzel a címmel közli, egy 1926-os kötelezvény katalógusa pedig a ház címén szereplő **Takáts Eberhard Árpádot** nevezi meg a társaság képviselőjeként. A kerületszám a digitalizált 1925-ös szövegben ellentmondásos. Fürdőt a házban egyik forrás sem igazol, és nem állítható, hogy ez volt a cég bejegyzett székhelye.

**After: visible**

> A *Magyar Pénzügy* a Strandfürdő Rt. október 5-re kitűzött alaptőke-emelési közgyűlésénél a Dembinszky utca 18. címet közli. A cég már 1924-ben ezzel a címmel szerepel, egy 1926-os kötelezvény pedig a ház címén szereplő **Takáts Eberhard Árpádot** nevezi meg a társaság képviselőjeként. Fürdőt a házban egyik forrás sem igazol, és nem állítható, hogy ez volt a cég bejegyzett székhelye.

**After: notes**

1. Az 1924-es nyom a szaknévsor, amely a Strandfürdő részvénytársaságot ezzel a címmel közli; a Takáts-adat egy kötelezvény katalógusrekordjából származik. A kerületszám a digitalizált 1925-ös szövegben ellentmondásos.

| Original claim | Where | Not stronger |
|---|---|---|
| Magyar Pénzügy gives D18 for the Strandfürdő Rt. capital-increase meeting set for 5 October | V | ✓ |
| The firm's link to the house is documented from 1924 | V | ✓ |
| …via the 1924 trade directory | N1 | ✓ |
| A 1926 bond catalogue names Takáts Eberhard Árpád (at the house's address) as the firm's representative | V; N1 (record type) | ✓ |
| The district number is contradictory in the digitised 1925 text | N1 | ✓ |
| No source proves a bath in the house | V | ✓ |
| It can't be claimed this was the registered seat | V | ✓ |

### 1928-dec-1929-febr-az-automobil-motorsport-1928

1928. dec. – 1929. febr. · *Diamant-motorok a bajnoktól* · D18 • személy · probable. **Rewritten.**

**Before**

> Az *Automobil–Motorsport* 1928. december 30-i híre szerint a kerékpárversenyző **Uhereczky Ferenc** megszerzi a német Diamant motorkerékpárok magyarországi vezérképviseletét. A lap 1929. februári száma ismét bajnokként ír róla: a szaklap beszámolója szerint a képviselet első két-három hónapjában 68 motorkerékpárt adott el vidéki csendőr- és rendőrtisztek körében, további nyolcat Budapesten, és alkatrészraktárt is kiépített. Ugyanebben a számban a hirdetés VII., Hernád utca 4., József 305–75 elérhetőséget ad. A sportoló és a kereskedő kapcsolatát tehát korabeli forrás mondja ki, a ház 1924-es Uhereczkyjével való azonosság azonban még nincs lezárva.

**After: visible**

> Az *Automobil–Motorsport* 1928. december 30-i híre szerint a kerékpárversenyző **Uhereczky Ferenc** megszerzi a német Diamant motorkerékpárok magyarországi vezérképviseletét. A szaklap 1929 februárjában arról ír, hogy az első két-három hónapban 68 motorkerékpárt adott el vidéki csendőr- és rendőrtisztek körében, további nyolcat Budapesten, és alkatrészraktárt is kiépített. A ház 1924-es Uhereczkyjével való azonossága még nincs lezárva.

**After: notes**

1. A lap 1929. februári száma ismét bajnokként ír róla, így a sportoló és a kereskedő kapcsolatát korabeli forrás mondja ki. Ugyanebben a számban a hirdetés VII., Hernád utca 4., József 305–75 elérhetőséget ad; ez üzleti cím, nem a Dembinszky utca 18.

| Original claim | Where | Not stronger |
|---|---|---|
| 28 Dec 1928: the cyclist Uhereczky gets the Hungarian general agency for Diamant motorcycles | V | ✓ |
| Feb 1929 issue again calls him champion | N1 | ✓ |
| Per the trade paper: 68 sold in the first 2–3 months to provincial gendarmerie and police officers, 8 in Budapest, parts depot built | V ("a szaklap … arról ír" keeps the viewpoint) | ✓ |
| The advertisement gives Hernád utca 4, József 305–75 | N1 | ✓ |
| A contemporary source links the athlete and the dealer | N1 | ✓ |
| Identity with the 1924 D18 Uhereczky is not closed | V | ✓ |
| (Caption: the Hernád utca address is a business address, not D18) | R, caption unchanged; also N1 | ✓ |

**Caption check**: „A Diamant motorkerékpárok hirdetése Uhereczky Ferenc vezérképviseletével, 1929. február. A Hernád utcai cím üzleti cím, nem a Dembinszky utca 18.” It still reads correctly next to the new text.

### 1929-autotorteneti-feldolgozasok-szerint-uhereczky

1929 · *Egy bajnok kisautója?* · D18 • személy · hypothesis. **Rewritten.**

**Before**

> Autótörténeti feldolgozások szerint **Uhereczky Ferenc** az 1929-es budapesti vásáron kétszemélyes, kéthengeres JAP-motoros kisautót mutat be, két előremeneti fokozattal és hátramenettel; a próbadarabból nem lesz sorozatgyártás. Az eredeti vásári tudósítást eddig nem sikerült megtalálni, és Zsuppán István 1994-es könyve még „Uhereczky Jánosnak” nevezi az építőt; a 2009-es kiadás tartalomjegyzéke már Ferencet ír. Az autóépítő és a ház 1924-es lakója közötti azonosság nyitott, és arra sincs forrás, hogy az autó a Dembinszky utca 18-ban készült volna.

**After: visible**

> Autótörténeti feldolgozások szerint **Uhereczky Ferenc** az 1929-es budapesti vásáron kétszemélyes, kéthengeres JAP-motoros kisautót mutat be, két előremeneti fokozattal és hátramenettel; a próbadarabból nem lesz sorozatgyártás. Nem bizonyított, hogy az építő azonos a házhoz 1924-ben kapcsolt Uhereczkyvel, és arra sincs forrás, hogy az autó a Dembinszky utca 18-ban készült.

**After: notes**

1. Az eredeti vásári tudósítást eddig nem sikerült megtalálni, így az adat későbbi feldolgozásokon alapul. Zsuppán István 1994-es könyve még „Uhereczky Jánosnak” nevezi az építőt; a 2009-es kiadás tartalomjegyzéke már Ferencet ír.

| Original claim | Where | Not stronger |
|---|---|---|
| Per car-history accounts, Uhereczky shows a two-seat, two-cylinder JAP-engined small car at the 1929 Budapest fair, 2 forward gears + reverse | V | ✓ |
| The prototype never went into series production | V | ✓ |
| The original fair report hasn't been found | N1 ("így az adat későbbi feldolgozásokon alapul" restates "feldolgozások szerint" from V) | ✓ |
| Zsuppán 1994 calls the builder „Uhereczky János”, the 2009 edition's contents say Ferenc | N1 | ✓ |
| Identity of the builder with the "ház 1924-es lakója" is open | V, reworded to "a házhoz 1924-ben kapcsolt" (see Findings) | ✓ |
| No source says the car was built at D18 | V | ✓ |

**Findings**

- *Fixed*: "a ház 1924-es lakója" became "a házhoz 1924-ben kapcsolt Uhereczky", because the 1924 record does not prove residence.

### 1930-szept-1-a-magyar-orszagos-tudosito

1930. szept. 1. · *Tüntetés a Hernád utcai saroknál* · Környék · verified. **Rewritten.**

**Before**

> A *Magyar Országos Tudósító* által közölt államtitkári nyilatkozat a szeptember 1-jei tüntetésnél a rendőri beavatkozás helyei között a **Dembinszky és a Hernád utca sarkát** is megnevezi. A másnapi *Nyírvidék* üzletek feltöréséről és katonai segítség érkezéséről ír. A közlések hatósági nézőpontot tükröznek, házszámot és üzletnevet nem adnak, így a 18-as házat érintő kár vagy lakói részvétel nem állítható.

**After: visible**

> A *Magyar Országos Tudósító* által közölt államtitkári nyilatkozat a szeptember 1-jei tüntetésnél a rendőri beavatkozás helyei között a **Dembinszky és a Hernád utca sarkát** is megnevezi. A másnapi *Nyírvidék* üzletek feltöréséről és katonai segítség érkezéséről ír. A 18-as házat érintő kár vagy lakói részvétel ebből nem állítható.

**After: notes**

1. Mindkét közlés hatósági nézőpontot tükröz, és egyik sem ad házszámot vagy üzletnevet.

| Original claim | Where | Not stronger |
|---|---|---|
| A state secretary's statement in MOT names the Dembinszky–Hernád corner among the places police intervened on 1 Sept | V | ✓ |
| Next day's Nyírvidék reports shops broken into and military help arriving | V | ✓ |
| The reports reflect the authorities' viewpoint | N1 | ✓ |
| No house number or shop name is given | N1 | ✓ |
| So damage to no. 18 or residents' participation can't be claimed | V | ✓ |

### 1930-1949-a-magyar-orszagos-tudosito

1930–1949 · *Az Uhereczky-garázs* · D18 • személy · probable. **Rewritten.**

**Before**

> A *Magyar Országos Tudósító* 1930. október 28-i híre szerint a városépítési bizottság földszintes bérgarázs építési engedélyének kiadását javasolja a VII., Nefelejts utca 14. alá, „dr. Katsztriner, Grimm és Uhareczky” nevével. 1932-ben már **Uhereczky-garage** néven hirdetnek innen bérautót, a temetőbe 10 pengőért; a telefonkönyvek 1936-tól 1949-ig Uhereczky Ferenc garázsaként, 1947-ben garázs-, bérautó- és fuvarozóvállalatként közlik. Az 1930-as adat engedélyjavaslat, nem kész épület, és a hír keresztneveket nem ad, így Grimm azonossága az olimpiai tandemtárssal nyitott. A garázs a Nefelejts utcában működött, nem a Dembinszky utca 18-ban; tulajdonosa valószínűleg azonos a ház 1924-es lakójával, de ez nincs lezárva.

**After: visible**

> A *Magyar Országos Tudósító* 1930. október 28-i híre szerint a városépítési bizottság földszintes bérgarázs építési engedélyének kiadását javasolja a VII., Nefelejts utca 14. alá, „dr. Katsztriner, Grimm és Uhareczky” nevével. 1932-ben már **Uhereczky-garage** néven hirdetnek innen bérautót, a temetőbe 10 pengőért; a telefonkönyvek 1936-tól 1949-ig Uhereczky Ferenc garázsaként, 1947-ben garázs-, bérautó- és fuvarozóvállalatként közlik. A garázs a Nefelejts utcában működött, nem a Dembinszky utca 18-ban; tulajdonosa valószínűleg azonos a házhoz 1924-ben kapcsolt Uhereczkyvel, de ez nincs lezárva.

**After: notes**

1. Az 1930-as adat engedélyjavaslat, nem kész épület; a garázs működését az 1932-es hirdetés igazolja.
2. A hír keresztneveket nem ad, így Grimm azonossága az olimpiai tandemtárssal nyitott.

| Original claim | Where | Not stronger |
|---|---|---|
| MOT 28 Oct 1930: the town-planning committee proposes a permit for a ground-floor rental garage at Nefelejts utca 14, under the names „dr. Katsztriner, Grimm és Uhareczky” | V | ✓ |
| 1932: rental cars advertised as Uhereczky-garage, to the cemetery for 10 pengő | V | ✓ |
| Phone books 1936–1949: Uhereczky Ferenc's garage; 1947: garage, car-hire and haulage firm | V | ✓ |
| The 1930 item is a permit proposal, not a finished building | N1 (V says "javasolja") | ✓ |
| (N1 "a garázs működését az 1932-es hirdetés igazolja") | restates the 1932 sentence in V, not a new claim | ✓ |
| The report gives no first names, so Grimm's identity with the Olympic partner is open | N2 | ✓ |
| The garage was in Nefelejts utca, not at D18 | V | ✓ |
| Its owner is probably the same as the "ház 1924-es lakója", not closed | V, reworded to "a házhoz 1924-ben kapcsolt" | ✓ |

**Caption check**: „Bérautó-hirdetés a Nefelejts utcai Uhereczky-garázstól, 1932. január. A garázs nem a Dembinszky utca 18-ban működött.” It still reads correctly next to the new text.

**Findings**

- *Fixed*: "a ház 1924-es lakójával" became "a házhoz 1924-ben kapcsolt Uhereczkyvel".

### 1931-aug-6-szept-3-ozv-schwartz-ignacne-egy

1931. aug. 6. – szept. 3. · *Levél egy rabbiözvegynek* · D18 · verified. **Rewritten.**

**Before**

> Özv. **Schwartz Ignácné**, egy újkécskei rabbi özvegye államsegélyt kér az Országos Izraelita Irodától. Az iktatókönyv elintézési rovata levelezési címként a Dembinszky utca 18-at adja meg; a szeptember 3-i, egymásra hivatkozó bejegyzések a nyugta beküldését és banki továbbítását is rögzítik. Az 1931-es összeg és a lakásszám nem ismert. Az 1932-es és 1934-es, nagy valószínűséggel hozzá tartozó bejegyzések 50 pengős nyugtát említenek, de új címet nem.

**After: visible**

> Özv. **Schwartz Ignácné**, egy újkécskei rabbi özvegye államsegélyt kér az Országos Izraelita Irodától. Az iktatókönyv levelezési címként a Dembinszky utca 18-at adja meg; a szeptember 3-i bejegyzések a nyugta beküldését és banki továbbítását is rögzítik.

**After: notes**

1. A címet az iktatókönyv elintézési rovata közli, a szeptember 3-i bejegyzések egymásra hivatkoznak. Az 1931-es összeg és a lakásszám nem ismert.
2. Az 1932-es és 1934-es, nagy valószínűséggel hozzá tartozó bejegyzések 50 pengős nyugtát említenek, de új címet nem.

| Original claim | Where | Not stronger |
|---|---|---|
| Widow of a rabbi from Újkécske, asks the Országos Izraelita Iroda for state aid | V | ✓ |
| The register gives D18 as the mailing address | V | ✓ |
| …in the settlement column | N1 | ✓ |
| The 3 Sept entries refer to each other and record sending the receipt and forwarding it via a bank | V (content); N1 (cross-reference) | ✓ |
| The 1931 amount and the flat number are unknown | N1 | ✓ |
| 1932 and 1934 entries, very likely hers, mention a 50-pengő receipt but no new address | N2 | ✓ |

**Caption check**: „Az Országos Izraelita Iroda iktatónaplójának bejegyzése a kérvényről és a szeptember 3-i elintézés címzettjéről.” It still reads correctly next to the new text.

### 1931-okt-1-3-foldes-szerena-wagner-ferencnek

1931. okt. 1–3. · *Földes Szeréna három napja* · D18 • személy · verified. **Rewritten.**

**Before**

> **Földes Szeréna**, Wágner Ferencnek, a ház későbbi III/3-as lakójának felesége ellen vezetett 1922-es rabtörzskönyvet 1931-ben újra használják: október 1-jén letartóztatják, 2-án felveszik az intézetbe, 3-án szabadlábra helyezik, mert „ügye elévült”. A lap nem dönti el, melyik eljárásról volt szó, és az elévülés nem felmentő ítélet. Földes Szeréna III/3-as lakhatása nem igazolt.

**After: visible**

> **Földes Szeréna**, Wágner Ferencnek, a ház későbbi III/3-as lakójának felesége ellen vezetett 1922-es rabtörzskönyvet 1931-ben újra használják: október 1-jén letartóztatják, 2-án felveszik az intézetbe, 3-án szabadlábra helyezik, mert „ügye elévült”. Az ő III/3-as lakhatása nem igazolt.

**After: notes**

1. A lap nem dönti el, melyik eljárásról volt szó. Az elévülés nem felmentő ítélet.

| Original claim | Where | Not stronger |
|---|---|---|
| Her 1922 register (she is the wife of Wágner, the later III/3 resident) is reused in 1931 | V | ✓ |
| 1 Oct arrested, 2 Oct admitted, 3 Oct released because the case had lapsed | V | ✓ |
| The record doesn't say which proceeding it was | N1 | ✓ |
| Lapsing is not an acquittal | N1; also in the caption (R) | ✓ |
| Her III/3 residence is not documented | V | ✓ |

**Caption check**: „Földes Szeréna 1922-es rabtörzskönyvének 1931-es bejegyzései. Az elévülés nem felmentő ítélet.” It still reads correctly next to the new text.

### 1932-1938-az-1932-szeptember-21

1932–1938 · *Az I/8 későbbi lakója a vásárokon* · D18 • személy · probable. **Rewritten.**

**Before**

> Az 1932. szeptember 21-i *Zalamegyei Újság* szerint **Róthmüller Mór Lipót** marhakereskedőt a tapolcai vásáron egy beteg tehén 570 pengős eladása miatt nyolc hónap börtönre ítélik; az 1934-es rabtörzskönyv egy szeptember 20-i zalaegerszegi ítéletet rögzít. 1937 szeptemberében a lap tíz hónap börtönről és egy év jogvesztésről ír, a *Nyírvidék* 1938. június 15-én pedig egy miskolci tárcadobó lopás miatti tíz hónapos ítéletről, Róna Jenővel együtt. Róthmüller 1941-ben és 1944-ben a ház **I/8**-as lakásának címével szerepel; a korábbi sajtóhírek szereplőjének azonosítása vele részben következtetés. Az 1937-es ítéletet a fellebbezések miatt nem nevezzük jogerősnek, Róna Jenő pedig nem azonosítható Róna Miksával.

**After: visible**

> Az 1932. szeptember 21-i *Zalamegyei Újság* szerint **Róthmüller Mór Lipót** marhakereskedőt a tapolcai vásáron egy beteg tehén 570 pengős eladása miatt nyolc hónap börtönre ítélik. 1937 szeptemberében a lap tíz hónap börtönről és egy év jogvesztésről ír, nem jogerős ítéletről; a *Nyírvidék* 1938. június 15-én egy miskolci tárcadobó lopás miatti tíz hónapos ítéletről tudósít, Róna Jenővel együtt. Róthmüller 1941-ben és 1944-ben a ház **I/8**-as lakásának címével szerepel; a korábbi sajtóhírek szereplőjének azonosítása vele részben következtetés.

**After: notes**

1. Az 1934-es rabtörzskönyv egy szeptember 20-i zalaegerszegi ítéletet rögzít.
2. Az 1937-es ítéletet a fellebbezések miatt nem nevezzük jogerősnek. Róna Jenő nem azonosítható Róna Miksával, Róthmüller testvérével.

| Original claim | Where | Not stronger |
|---|---|---|
| Zalamegyei Újság 21 Sept 1932: eight months börtön over the 570-pengő sale of a sick cow at the Tapolca fair | V | ✓ |
| The 1934 register records a 20 Sept Zalaegerszeg judgment | N1 | ✓ |
| Sept 1937: ten months börtön and one year loss of rights | V | ✓ |
| The 1937 judgment is not called final, because of appeals | V ("nem jogerős ítéletről"); N2 (reason) | ✓ |
| Nyírvidék 15 June 1938: ten months for a Miskolc pickpocketing theft, together with Róna Jenő | V | ✓ |
| 1941 and 1944: Róthmüller at the house's I/8 address | V | ✓ |
| Identifying the earlier press figure with him is partly inference | V | ✓ |
| Róna Jenő is not identifiable with Róna Miksa | N2 ("Róthmüller testvérével" added from the 1940–1944 card, which names Rothmüller (Róna) Miksa as his brother) | ✓ |

**Caption check**: „A Zalamegyei Ujság 1937. szeptember 11-i tudósítása. A fellebbezések miatt az ítélet nem volt jogerős.” It still reads correctly next to the new text.

### 1932-nov-1934-marc-az-altalanos-kozvetito-bank

1932. nov. – 1934. márc. · *Bankper és halálhír* · D18 • személy · probable. **Rewritten.**

**Before**

> Az Általános Közvetítő Bank ügyében **Takács Eberhard Árpádot** 1932. november 30-án hitelezési csalásért három hónap és három hét fogházra ítélik; az ítélet ekkor nem jogerős. Egy 1933. január 29-i újság az azonos nevű vállalkozó öngyilkosságáról ír, az 1934. március 3-i perhír pedig állítólagos halála miatt különválasztott ügyként említi az eljárását. A ritka név és az üzleti kapcsolatok erősen támogatják, hogy ő a ház címén a húszas években szereplő autós vállalkozó, Takáts Eberhard Árpád. A per idején érvényes lakcíme és a végleges ítélet nincs igazolva.

**After: visible**

> Az Általános Közvetítő Bank ügyében **Takács Eberhard Árpádot** 1932. november 30-án hitelezési csalásért három hónap és három hét fogházra ítélik; az ítélet ekkor nem jogerős. Egy 1933. január 29-i újság az azonos nevű vállalkozó öngyilkosságáról ír. Valószínű, hogy ő a ház címén a húszas években szereplő autós vállalkozó, Takáts Eberhard Árpád.

**After: notes**

1. Az 1934. március 3-i perhír állítólagos halála miatt különválasztott ügyként említi az eljárását; végleges ítélet nincs igazolva.
2. Az azonosítást a ritka név és az üzleti kapcsolatok erősen támogatják. A per idején érvényes lakcíme nem ismert.

| Original claim | Where | Not stronger |
|---|---|---|
| 30 Nov 1932: three months and three weeks fogház for credit fraud in the Általános Közvetítő Bank case | V | ✓ |
| Not final at that time | V | ✓ |
| A 29 Jan 1933 paper reports the suicide of a businessman of the same name | V | ✓ |
| The 3 March 1934 report mentions his proceedings as separated because of his alleged death | N1 | ✓ |
| Rare name and business links strongly support identity with the 1920s D18 car businessman | V ("Valószínű", matching the badge); N2 (basis) | ✓ |
| His address at the time of the trial is not documented | N2 | ✓ |
| The final judgment is not documented | N1 | ✓ |

**Caption check**: „A Magyar Országos Tudósító 1932. november 30-i törvényszéki kiadása. Az ítélet ekkor még nem volt jogerős.” It still reads correctly next to the new text.

### 1933-1938-kozjegyzoi-katalogusok-szerint-a

1933–1938 · *Kik dolgoztak a házban?* · D18 · verified. **Rewritten.**

**Before**

> Közjegyzői katalógusok szerint a harmincas években háztartási alkalmazottak (Vasvári Borbála, Maráz Mária), egy tisztviselő (Hauser Margit), egy háztartásbeli (Koch Stefánia), egy kereskedő (Csillag Artur), egy varrónő (Felderer Rozália), egy bejáró takarítónő és aranyozó segédmunkás (Nagy Lajosné Szabó Rozália), egy építész (Gyulai Lajos) és egy gépész (Wollner Antal) adja meg a ház címét. 1935-ben özv. Führer Jakabné **Juffe Etel** vásári árusként szerepel itt; a Kozma utcai temető 1860–1935 között élt, azonos nevű asszonya valószínűleg ő. Az ügyek többsége házastársi elhagyás tanúsítása vagy meghatalmazás. A katalógusok csak az ügytípust, a foglalkozást és a címet közlik: személyes történeteket, a válások kimenetelét vagy közös munkát nem.

**After: visible**

> Közjegyzői katalógusok szerint a harmincas években háztartási alkalmazottak (Vasvári Borbála, Maráz Mária), egy tisztviselő (Hauser Margit), egy háztartásbeli (Koch Stefánia), egy kereskedő (Csillag Artur), egy varrónő (Felderer Rozália), egy bejáró takarítónő és aranyozó segédmunkás (Nagy Lajosné Szabó Rozália), egy építész (Gyulai Lajos) és egy gépész (Wollner Antal) adja meg a ház címét. 1935-ben özv. Führer Jakabné **Juffe Etel** vásári árusként szerepel itt. Az ügyek többsége házastársi elhagyás tanúsítása vagy meghatalmazás.

**After: notes**

1. A katalógusok csak az ügytípust, a foglalkozást és a címet közlik: személyes történeteket, a válások kimenetelét vagy közös munkát nem.
2. A Kozma utcai temető 1860–1935 között élt, azonos nevű asszonya valószínűleg Juffe Etel.

| Original claim | Where | Not stronger |
|---|---|---|
| The listed people, with occupations, give the house's address in 1930s notarial catalogues | V | ✓ |
| 1935: widow Führer Jakabné Juffe Etel, market vendor, appears here | V | ✓ |
| The Kozma utca cemetery's woman of the same name (1860–1935) is probably her | N2 | ✓ |
| Most cases are certifications of marital desertion or powers of attorney | V | ✓ |
| The catalogues give only case type, occupation and address, not personal stories, divorce outcomes or shared work | N1 | ✓ |

**Findings**

- *Flagged*: the title „Kik dolgoztak a házban?” suggests work in the building, but the catalogues show only that these people gave the address. The title is unchanged.

### 1937-okt-12-31-wagner-ferenc-maganhivatalnok-1937

1937. okt. 12–31. · *A III/3 név szerint ismert lakója* · D18 · verified. **Rewritten.**

**Before**

> **Wágner Ferenc** magánhivatalnok 1937-es rabtörzskönyve utolsó lakhelyeként a Dembinszky utca 18., **III/3**-at adja meg: ő a lakás név szerint igazolt lakója. Október 12-én lopás miatt egy év börtönre ítélik, október 31-én a szegedi kerületi börtönbe szállítják; a lap 1938. szeptember 14-re számítja a szabadulását, de a tényleges elbocsátást és a lakásba való visszatérést nem igazolja. Előzmény, hogy 1922-ben feleségével, **Földes Szerénnel** (Szerénával) közös sikkasztási ügyben két, illetve egy hónap fogházat kaptak; 1937-ben már elváltként tartják nyilván. 1940. október 17-én újabb lopásért jogerősen egy év börtönre ítélik, 25-én Szolnokra szállítják, számított szabadulási napja 1941. október 2. Az 1940-es lakhelyrovat csak Budapestet közli, így a III/3-as címet erre az évre nem erősíti meg.

**After: visible**

> **Wágner Ferenc** magánhivatalnok 1937-es rabtörzskönyve utolsó lakhelyeként a Dembinszky utca 18., **III/3**-at adja meg: ő a lakás név szerint igazolt lakója. Október 12-én lopás miatt egy év börtönre ítélik, október 31-én a szegedi kerületi börtönbe szállítják. 1940-ben újabb lopásért jogerősen egy év börtönt kap. A bejegyzés a III/3-as címet 1937-re igazolja, korábbi vagy későbbi ottlakást önmagában nem.

**After: notes**

1. A lap 1938. szeptember 14-re számítja a szabadulását; ez számított dátum, a tényleges elbocsátást és a lakásba való visszatérést nem igazolja.
2. Előzmény, hogy 1922-ben feleségével, **Földes Szerénnel** (Szerénával) közös sikkasztási ügyben két, illetve egy hónap fogházat kaptak; 1937-ben már elváltként tartják nyilván. Wágner 1933-as törzskönyvének előéleti rovata egy kéthónapos budapesti sikkasztási fogházat 1924-es évszámmal jegyez fel; a két adat eltérése a forrásokból nem oldható fel.
3. Az 1940-es ítélet október 17-i; 25-én Szolnokra szállítják, számított szabadulási napja 1941. október 2. Az 1940-es lakhelyrovat csak Budapestet közli, így a III/3-as címet erre az évre nem erősíti meg.

| Original claim | Where | Not stronger |
|---|---|---|
| The 1937 register gives D18 III/3 as his last residence; he is the flat's resident documented by name | V | ✓ |
| 12 Oct: one year börtön for theft; 31 Oct: moved to Szeged prison | V | ✓ |
| Release calculated for 14 Sept 1938; actual release and return to the flat not documented | N1 | ✓ |
| 1922: joint sikkasztás case with his wife Földes Szerén (Szeréna), two and one months fogház | N2 | ✓ |
| By 1937 recorded as divorced | N2 | ✓ |
| 17 Oct 1940: final one-year börtön for another theft | V (year and finality); N3 (day) | ✓ |
| Moved to Szolnok on the 25th; calculated release 2 Oct 1941 | N3 | ✓ |
| The 1940 residence column says only Budapest, so it doesn't confirm III/3 for that year | N3; V "korábbi vagy későbbi ottlakást önmagában nem" | ✓ |
| (New in N2: the 1933 column's "1924" year for the two-month sikkasztás) | Added from the 1908–1909 card's source (the same 1933 register), so the discrepancy is visible on both cards | ✓ |

**Caption check**: „Wágner Ferenc 1937-es rabtörzskönyvének lakcímrovata. A feleség itt-lakását nem igazolja.” It still reads correctly, and with the 1922 case moved into the notes it now carries the wife's limit on its own.

**Findings**

- *Flagged*: 1922 versus 1924 for the joint sikkasztás; see the 1908–1909 entry.

## 1939–1945

### 1939-az-egyetemi-program-1939

1939 · *Három fiatal kutató a ház címén* · D18 · verified. **Rewritten.**

**Before**

> Az egyetemi program 1939-ben három fiatal kutatót is a Dembinszky utca 18. címmel közöl. **Márkus József** állattenyésztéstani tanársegéd címe az 1938/39-es tanév második félévében a Retek utca 8-ról erre a címre változik; 1935-ben mezőgazda-oklevelet, 1936-ban doktori oklevelet szerzett (az oklevéljegyzék 25-ös és 19-es száma sorszám, nem nap). **Kloczol Irma** felsőkereskedelmi iskolai tanárnő, hitoktatónő és díjtalan állattenyésztéstani gyakornok a *Köztelekben* 54 tej- és savómintán hasonlítja össze a kénsav és centrifuga nélküli Haha-eljárást a Gerber-módszerrel. **Winiczai Géza** díjas gyakornok a ló- és szarvasmarha-vérsavó fehérjeanyagairól írt doktori értekezését a kari ülés április 20-án cum laude minősítéssel fogadja el; ez az elfogadás, nem a doktorrá avatás napja. A címadatok nem adják meg a beköltözés idejét, a kutatómunka pedig az egyetemi intézetekben zajlott.

**After: visible**

> Az egyetemi program 1939-ben három fiatal kutatót is a Dembinszky utca 18. címmel közöl. **Márkus József** állattenyésztéstani tanársegéd címe az 1938/39-es tanév második félévében a Retek utca 8-ról erre a címre változik. **Kloczol Irma** felsőkereskedelmi iskolai tanárnő, hitoktatónő és díjtalan állattenyésztéstani gyakornok a *Köztelekben* 54 tej- és savómintán hasonlítja össze a kénsav és centrifuga nélküli Haha-eljárást a Gerber-módszerrel. **Winiczai Géza** díjas gyakornok a ló- és szarvasmarha-vérsavó fehérjeanyagairól írt doktori értekezését a kari ülés április 20-án cum laude minősítéssel fogadja el. A kutatómunka az egyetemi intézetekben zajlott, nem a házban.

**After: notes**

1. Márkus 1935-ben mezőgazda-oklevelet, 1936-ban doktori oklevelet szerzett; az oklevéljegyzék 25-ös és 19-es száma sorszám, nem nap.
2. Az április 20-i dátum az értekezés elfogadásáé, nem a doktorrá avatásé. A címadatok nem adják meg a beköltözés idejét.

| Original claim | Where | Not stronger |
|---|---|---|
| The 1939 university programme lists three young researchers at D18 | V | ✓ |
| Márkus's address changes from Retek utca 8 to D18 in the 2nd semester of 1938/39 | V | ✓ |
| Márkus: agricultural diploma 1935, doctorate 1936 | N1 | ✓ |
| The diploma list's 25 and 19 are serial numbers, not days | N1 | ✓ |
| Kloczol Irma (teacher, religion teacher, unpaid trainee) compares the Haha method with Gerber on 54 samples in Köztelek | V | ✓ |
| Winiczai Géza's dissertation accepted cum laude by the faculty meeting on 20 April | V | ✓ |
| That is the acceptance, not the conferral | N2 | ✓ |
| The addresses don't give the move-in date | N2 | ✓ |
| The research took place in university institutes | V ("nem a házban" makes the brief's visible limit explicit) | ✓ |

**Caption check**: „Márkus József címe az egyetem 1938/39-es második félévi programjában.” It still reads correctly next to the new text.

### 1942-1950-a-novum-szamolo-es

1942–1950 · *A Novum számológépüzlet* · D18 · verified. **Rewritten.**

**Before**

> A **Novum** számoló- és írógépkereskedés tulajdonosaként 1942–1943-ban **Cs. Szabó János**, 1945 októberétől **Felkai Jenő** szerepel a ház címén, azonos 420–918 telefonszámmal. 1943-ban Friedman Jenő számológép-képviselő és utazó is ezt a címet és számot használja; Felkaival való azonossága nem bizonyított. Az 1943-as és 1947-es keretes hirdetések kifejezetten kereskedést reklámoznak; 1949-ben már József Attila utca 6. alatti lerakat is szerepel, 1950-ben pedig a telefonkönyv a 18-as címet Felkai lakásaként különíti el. 1948-ban egy Felkai Jenő kereskedő a ház címével hitelesítteti aláírását egy hitközségi elöljárói tisztséget elfogadó nyilatkozaton; a Novum tulajdonosával való azonossága valószínű. A tulajdonosváltozás jogcíme és napja ismeretlen.

**After: visible**

> A **Novum** számoló- és írógépkereskedés tulajdonosaként 1942–1943-ban **Cs. Szabó János**, 1945 októberétől **Felkai Jenő** szerepel a ház címén, azonos 420–918 telefonszámmal. Az 1943-as és 1947-es keretes hirdetések kifejezetten kereskedést reklámoznak; 1949-ben már József Attila utca 6. alatti lerakat is szerepel, 1950-ben pedig a telefonkönyv a 18-as címet Felkai lakásaként különíti el. A tulajdonosváltozás jogcíme és napja ismeretlen.

**After: notes**

1. 1943-ban Friedman Jenő számológép-képviselő és utazó is ezt a címet és számot használja; Felkaival való azonossága nem bizonyított.
2. 1948-ban egy Felkai Jenő kereskedő a ház címével hitelesítteti aláírását egy hitközségi elöljárói tisztséget elfogadó nyilatkozaton; a Novum tulajdonosával való azonossága valószínű.

| Original claim | Where | Not stronger |
|---|---|---|
| Novum owners at D18: Cs. Szabó János 1942–1943, Felkai Jenő from Oct 1945, same phone 420–918 | V | ✓ |
| 1943: Friedman Jenő, calculating-machine agent and traveller, uses the same address and number; identity with Felkai not proven | N1 | ✓ |
| 1943 and 1947 display ads advertise a shop | V | ✓ |
| 1949: a depot at József Attila utca 6 | V | ✓ |
| 1950: the phone book lists D18 as Felkai's flat | V | ✓ |
| 1948: a Felkai Jenő, merchant, at D18 authenticates his signature on a declaration accepting a community board office; identity with the Novum owner probable | N2 | ✓ |
| The legal basis and date of the change of owner are unknown | V | ✓ |

**Caption check**: „A Novum hirdetése az 1943-as budapesti telefonkönyvben, Dembinski írásmóddal.” It still reads correctly next to the new text.

### 1944-jun-jul-a-vii-keruletben-bejelentett

1944. jún.–júl. · *Flam Jakab parkettás telephelye a jegyzéken* · D18 · verified. **Rewritten.**

**Before**

> A VII. kerületben bejelentett zsidó ipartelepek júniusi jegyzékének 545. tétele **Flam Jakab** parkettázó telephelyét a Dembinszky utca 18. címmel közli, a megszüntethető ipartelepek között. A gépírásos jegyzékben a név „Flan Jakab” alakban olvasható; a korábban „Plan Jakab” néven idézett adat ugyanerre a tételre vonatkozik. A július 17-i miniszteri levélből nem következik, hogy a jegyzék valamennyi telepét automatikusan bezárták. A lista üzleti telephelyet igazol; a tényleges megszüntetést, a lakóhelyet és a későbbi Szöghy-féle parkettás vállalkozással való folytonosságot nem.

**After: visible**

> A VII. kerületben bejelentett zsidó ipartelepek júniusi jegyzékének 545. tétele **Flam Jakab** parkettázó telephelyét a Dembinszky utca 18. címmel közli, a megszüntethető ipartelepek között. A lista üzleti telephelyet igazol; a tényleges megszüntetést és a lakóhelyet nem.

**After: notes**

1. A gépírásos jegyzékben a név „Flan Jakab” alakban olvasható; a korábban „Plan Jakab” néven idézett adat ugyanerre a tételre vonatkozik.
2. A július 17-i miniszteri levélből nem következik, hogy a jegyzék valamennyi telepét automatikusan bezárták. A későbbi Szöghy-féle parkettás vállalkozással való folytonosság sem igazolt.

| Original claim | Where | Not stronger |
|---|---|---|
| Item 545 of the June list of the VII. district's Jewish workshops gives Flam Jakab's parquet workshop at D18, among those that may be closed | V | ✓ |
| The typescript reads „Flan Jakab”; the earlier „Plan Jakab” refers to the same item | N1 | ✓ |
| The 17 July ministerial letter doesn't mean every listed workshop was closed automatically | N2 | ✓ |
| The list proves a business site, not actual closure or residence | V | ✓ |
| …nor continuity with the later Szöghy parquet business | N2 | ✓ |

**Caption check**: „A VII. kerületi zsidó ipartelepek 1944-es jegyzékének részlete az 545. tétellel. A lista telephelyet igazol, nem tényleges bezárást.” It still reads correctly next to the new text.

## 1946–1968

### 1947-dec-1948-jan-a-magyar-orszagos-tudosito

1947. dec. – 1948. jan. · *Egy autófuvarozó csempészpere* · D18 • személy · hypothesis. **Rewritten.**

**Before**

> A *Magyar Országos Tudósító* 1947 decemberében Paduraru Ottó és társai árucsempészési perében egy **Uhereczky Ferenc** nevű budapesti autófuvarozóról is beszámol: a Budapest–Bécs útvonalon tartott novemberi rajtaütéskor különféle árukat találtak az autókban, ő a tárgyaláson gumikereskedésére és jóhiszeműségére hivatkozott. A december 17-i tudósítás szerint két hónap **fogházat** kap, és az ítéletet jogerősnek mondja. Egy külön valutaügyben 1948. január 22-én a fuvarozó felmentéséről tudósítanak, nem jogerős ítélettel; ez nem érinti a csempészési elmarasztalást. A tudósítások nem közölnek születési adatot vagy lakcímet, így nem bizonyított, hogy az elítélt fuvarozó az olimpikon vagy a ház 1924-es lakója.

**After: visible**

> A *Magyar Országos Tudósító* 1947 decemberében Paduraru Ottó és társai árucsempészési perében egy **Uhereczky Ferenc** nevű budapesti autófuvarozóról is beszámol: a Budapest–Bécs útvonalon tartott novemberi rajtaütéskor különféle árukat találtak az autókban, ő a tárgyaláson gumikereskedésére és jóhiszeműségére hivatkozott. A december 17-i tudósítás szerint két hónap **fogházat** kap; egy külön valutaügyben 1948 januárjában felmentik. Nem bizonyított, hogy az elítélt fuvarozó az olimpikon vagy a házhoz 1924-ben kapcsolt Uhereczky.

**After: notes**

1. A december 17-i tudósítás az ítéletet jogerősnek mondja. A valutaügyi felmentésről január 22-én, nem jogerős ítélettel tudósítanak; ez nem érinti a csempészési elmarasztalást.
2. A tudósítások nem közölnek születési adatot vagy lakcímet, ezért a személyazonosság nyitott.

| Original claim | Where | Not stronger |
|---|---|---|
| MOT Dec 1947: in the Paduraru Ottó and others smuggling trial, a Budapest haulier named Uhereczky Ferenc | V | ✓ |
| A November raid on the Budapest–Vienna route found goods in the cars; he cited his rubber trade and good faith | V | ✓ |
| 17 Dec report: two months fogház | V | ✓ |
| …which it calls final | N1 | ✓ |
| Separate currency case: acquitted, reported 22 Jan 1948, not final | V (acquittal, Jan 1948); N1 (day, not final) | ✓ |
| That doesn't affect the smuggling conviction | N1 | ✓ |
| No birth data or address, so not proven he is the Olympian or the "ház 1924-es lakója" | V (conclusion, reworded "a házhoz 1924-ben kapcsolt"); N2 (reason) | ✓ |

**Caption check**: „A Magyar Országos Tudósító 1947. december 17-i tudósítása a csempészperről. A hír nem köti az elítélt fuvarozót a ház korábbi lakójához.” It still reads correctly next to the new text.

**Findings**

- *Fixed*: "a ház 1924-es lakója" became "a házhoz 1924-ben kapcsolt Uhereczky".

### 1954-a-vii-keruleti-1954

1954 · *A ház az 1954-es névjegyzékben* · D18 · verified. **Rewritten.**

**Before**

> A VII. kerületi 1954-es választói névjegyzék a ház lakói között sorolja fel **Balázs Ferencet** („tisztv.”), **Fürst Mihályt** („fogt.”) és **Reiner Józsefet** („váll. i.”), akiket az 1950-es telefonkönyv is a ház címén közöl. A „fogt.” feltehetően fogtechnikust jelöl, a másik rövidítés feloldása nem igazolt, és a két forrás nem bizonyít folyamatos ittlakást. A listán szerepel **Felkai Andor** vegyész is, Budapest, 1926. december 31. születési adattal; Csapody Tamás bori munkaszolgálatos-névsorában Felkai [Friedman] Andor ugyanezekkel az adatokkal áll, így a személyazonosság erősen valószínű. A bori munkaszolgálat így a lakó korábbi életútjához tartozik; arról, hogy előtte is a házban élt-e, a források nem szólnak.

**After: visible**

> A VII. kerületi 1954-es választói névjegyzék a ház lakói között sorolja fel **Balázs Ferencet** („tisztv.”), **Fürst Mihályt** („fogt.”) és **Reiner Józsefet** („váll. i.”), akiket az 1950-es telefonkönyv is a ház címén közöl. A listán szerepel **Felkai Andor** vegyész is, aki nagy valószínűséggel azonos a bori munkaszolgálatosok névsorában szereplő Felkai [Friedman] Andorral. A bori munkaszolgálat így a lakó korábbi életútjához tartozik; arról, hogy előtte is a házban élt-e, a források nem szólnak.

**After: notes**

1. A „fogt.” feltehetően fogtechnikust jelöl, a másik rövidítés feloldása nem igazolt. A két forrás nem bizonyít folyamatos ittlakást 1950 és 1954 között.
2. A névjegyzék Felkai Andornál Budapest, 1926. december 31. születési adatot közöl; Csapody Tamás bori munkaszolgálatos-névsorában Felkai [Friedman] Andor ugyanezekkel az adatokkal áll.

| Original claim | Where | Not stronger |
|---|---|---|
| The 1954 electoral roll lists Balázs („tisztv.”), Fürst („fogt.”), Reiner („váll. i.”) among residents | V | ✓ |
| The 1950 phone book also gives them at D18 | V | ✓ |
| „fogt.” presumably means dental technician; the other abbreviation's reading is not confirmed | N1 | ✓ |
| The two sources don't prove continuous residence | N1 ("1950 és 1954 között" names the two sources' years) | ✓ |
| Felkai Andor, chemist, on the list, born Budapest 31 Dec 1926 | V (name, occupation); N2 (birth data) | ✓ |
| Csapody's Bor list has Felkai [Friedman] Andor with the same data, so identity is highly probable | V (conclusion, "nagy valószínűséggel"); N2 (basis) | ✓ |
| Bor labour service belongs to his earlier life; sources say nothing of earlier residence in the house | V, wording unchanged (the owner fixed it on 2026-10-11) | ✓ |

**Caption check**: „Az 1954-es VII. kerületi választói névjegyzék Dembinszky utca 18. alatti csoportjának részlete. A címsor a kivágás fölött áll.” It still reads correctly next to the new text.

## Unchanged cards over 60 words

| Event | Era | Reason |
|---|---|---|
| `1895-nov-15-a-spitz-bernat-egyenruhazati` | 1873–1913 | Story card (an advertisement and the family link). Its one limit, „a reklám saját állítása”, is short and must stay visible. |
| `1904-jul-1-jul-10-a-julius-10-i` | 1873–1913 | Long because of the story (the disappearance), not because of evidence. The only limit is the closing sentence; moving story into the notes is not allowed. |
| `1916-1929-1916-aprilis-23-an` | 1914–1938 | The evidence limit is a single closing sentence, needed visibly (business address, not an oil works or residence). |
| `1920-1928-az-1920-majusi-telefonkonyv` | 1914–1938 | Data-rich story (two doctors, consulting hours). Its one limit sentence is concise. |
| `1926-1927-1926-ban-300-millio` | 1914–1938 | Long because of land-register data (loans, currencies, interest), which is story content; the one limit sentence is short. |
| `1928-febr-28-reggel-hetkor-elindul-a` | 1914–1938 | Narrative card (the first day of the bus); the one limit („megállót … nem ismerünk”) is short. |
| `1928-okt-20-eltero-lapfejlec-az-uj-budapest-beszerzesi` | 1914–1938 | FR-011 card (Rintche). At 30 words it is short, and the date discrepancy is stated by the date label and in full by the caption, so a note would only repeat the caption. The date label can't change without changing the id; see Findings in report.md. |
| `1937-okt-nov-markus-jozsef-agrarkutato-aki` | 1914–1938 | Research story. The one limit („Ekkori lakóhelye a házban nem igazolt.”) is short and is also in the caption. |
| `1938-okt-1940-maj-18-markus-jozsef-1938-oktobereben` | 1914–1938 | Research story. The one closing limit is short and needed visibly. |
| `1940-maj-29-1944-a-magyar-orszagos-tudosito` | 1939–1945 | FR-011 card (the Róthmüller brothers). The court stages (first instance, upheld) are story facts, and the one limit (crime in Aba, I/8 a later record) is short and must stay visible. |
| `1941-jul-9-a-debreczen-julius-10` | 1939–1945 | Narrative card (the tram accident); the closing limits are short and needed visibly. |
| `1944-nov-9-16-wilde-ferenc-november-10` | 1939–1945 | Diary story; the closing limit (not deaths, not no. 18) is short and needed visibly. |
| `1945-1954-szoghy-dezso-asztalosmestert-es` | 1939–1945 | Directory chronology is the story; one short closing limit. |
