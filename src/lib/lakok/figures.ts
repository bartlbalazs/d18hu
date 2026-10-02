import type { ImageMetadata } from 'astro';
import armandolaConcertImage from '../../assets/pages/lakok/18-armandola-hangverseny-1902.png';
import almasiPortraitImage from '../../assets/pages/lakok/16-almasi-iza-portre-1900.png';
import almasiCakeWalkImage from '../../assets/pages/lakok/17-iza-cake-walk-1903.png';
import mautnerPerfectorImage from '../../assets/pages/lakok/04-mautner-perfector-1899.png';
import szelloStartImage from '../../assets/pages/lakok/19-szello-cikkkezdet-1900.png';
import szelloEndImage from '../../assets/pages/lakok/20-szello-cikkvege-1900.png';
import grasellySocietyImage from '../../assets/pages/lakok/21-graselly-lajosmizse-1911.png';
import petrovits1902Image from '../../assets/pages/lakok/07-petrovits-1902.png';
import petrovits1922Image from '../../assets/pages/lakok/08-petrovits-1922.png';
import takacsCarFirmImage from '../../assets/pages/lakok/09-takacs-auto-1922.png';
import yellowStarListImage from '../../assets/pages/lakok/12-csillagos-hazak-1944.png';
import machinists1954Image from '../../assets/pages/lakok/13-gepeszek-1954.jpg';
import projectionist1954Image from '../../assets/pages/lakok/14-mozigepesz-1954.jpg';
import timeStudyGradingImage from '../../assets/pages/lakok/15-idoelemzes-1949.png';

export type LakokFigure = {
  image: ImageMetadata;
  alt: string;
  caption: string;
  credit: string;
  source: { label: 'eredeti forrás'; url: string };
  kind: 'photo' | 'document';
  size: 'narrow' | 'medium' | 'wide' | 'column';
  /** Shown above the caption, e.g. to tell apart the two pages of a split article. */
  label?: string;
};

export const lakokFigures = {
  armandolaConcert: {
    image: armandolaConcertImage,
    alt: 'Hosszúkás újságkivágás a Magyar Zeneiskola hangversenyeiről; a szövegben Armandola Aranka és Fusz Ferenc neve.',
    caption: 'A Magyar Zeneiskola hangversenyeiről szóló beszámoló Armandola Arankát zongoristaként és tanárként említi, 1902. június 6. A kritika a korabeli zenei élet egy szokatlan hangszeréről, a vonós-zongoráról is tudósít.',
    credit: 'Budapesti Napló, 1902. június 6., 153. sz., 8. o. · OSZK / EPA · kivágás',
    source: { label: 'eredeti forrás', url: 'https://www.epa.hu/04300/04337/01225/pdf/EPA04337_budapesti_naplo_1902_153.pdf#page=8' },
    kind: 'document',
    size: 'narrow',
  },
  almasiPortrait: {
    image: almasiPortraitImage,
    alt: 'Fiatal színésznő félprofilos arcképe, mellette hosszúkás szecessziós növényi dísz.',
    caption: 'Almási Iza arcképe a Művészvilág 1900-as számában. A folyóirat név szerint mutatja be a színésznőt; a Dembinszky utcai Almássy Izával való azonossága továbbra is valószínű.',
    credit: 'Művészvilág, 1900. szeptember 2., II. évf., IV. negyed, 10. sz., PDF 15. lap · OSZK / EPA · kivágás',
    source: { label: 'eredeti forrás', url: 'https://epa.oszk.hu/05900/05921/00060/pdf/EPA05921_muveszvilag_1900_2_4_10.pdf#page=15' },
    kind: 'photo',
    size: 'medium',
  },
  almasiCakeWalk: {
    image: almasiCakeWalkImage,
    alt: 'Színházi újsághír a Bob herceg és Mici hercegnő bemutatójáról, szereposztással és cake-walk-beharangozóval.',
    caption: 'A Városligeti Nyári Színház bemutatójának beharangozója, 1903. június 24. A szereposztás Miciként nevezi meg Almási Izát, a zárómondat pedig Féld Olgával közös új cake-walkját ígéri.',
    credit: 'Budapesti Napló, 1903. június 24., 171. sz., 10. o. · OSZK / EPA · kivágás',
    source: { label: 'eredeti forrás', url: 'https://www.epa.hu/04300/04337/01600/pdf/EPA04337_budapesti_naplo_1903_171.pdf#page=10' },
    kind: 'document',
    size: 'wide',
  },
  mautnerPerfector: {
    image: mautnerPerfectorImage,
    alt: 'Díszkeretes Perfector-gázkészülék-hirdetés, alján Mautner Adolf és Társai nevével és Arany János utcai címével.',
    caption: 'A Mautner Adolf és Társai Perfector-hirdetése, 1899. A világítást, fűtést és gépi hajtást ígérő reklámon még a cég Arany János utca 3. alatti címe szerepel.',
    credit: 'Somogyi Ujság, 1899. február 7., 6. szám, 6. o. · Takáts Gyula Könyvtár, Somogyi Elektronikus Könyvtár · kivágás',
    source: { label: 'eredeti forrás', url: 'https://tgyk.hu/sek/0159/Somogyi_Ujsag_06_1899_02_07.pdf#page=6' },
    kind: 'document',
    size: 'medium',
  },
  szelloStart: {
    image: szelloStartImage,
    alt: 'Az aesthetikai érzelem s a népiskola cím és a pedagógiai írás első bekezdése.',
    caption: 'Szellő Sándor: Az aesthetikai érzelem s a népiskola. A cikk kezdete, 1900: a tanító a szépség és az érzelmek nevelésének helyét keresi az iskolában.',
    credit: 'Népnevelők Lapja, 1900. június 16., 24. sz., 377. o. · OSZK / EPA · kivágás',
    source: { label: 'eredeti forrás', url: 'https://epa.oszk.hu/06000/06054/01686/pdf/EPA06054_nepnevelok_lapja_1900_024.pdf#page=11' },
    kind: 'document',
    size: 'column',
    label: 'Cikkkezdet, 377. oldal',
  },
  szelloEnd: {
    image: szelloEndImage,
    alt: 'A rajz és kézimunka oktatásáról szóló bekezdés, alatta Szellő Sándor nyomtatott neve.',
    caption: 'A cikk záróbekezdése a rajz és a kézimunka nevelő szerepéről, alatta Szellő Sándor nyomtatott szerzői neve. A cikk közbülső részei nincsenek a két kivágáson.',
    credit: 'Népnevelők Lapja, 1900. június 16., 24. sz., 379. o. · OSZK / EPA · kivágás',
    source: { label: 'eredeti forrás', url: 'https://epa.oszk.hu/06000/06054/01686/pdf/EPA06054_nepnevelok_lapja_1900_024.pdf#page=13' },
    kind: 'document',
    size: 'column',
    label: 'Zárórész, 379. oldal',
  },
  grasellySociety: {
    image: grasellySocietyImage,
    alt: 'Gazdasági egyesület alakulásáról szóló rövidhír, benne Graselly Miklós igazgató és Kiss Elemér neve.',
    caption: 'Új gazdasági egyesület Lajosmizsén: a Kecskeméti Lapok 1911-ben Graselly Miklós földművesiskolai igazgató közreműködéséről tudósított. A későbbi budapesti lakóval való azonossága valószínű.',
    credit: 'Kecskeméti Lapok, 1911. március 12., 60. sz., 4. o. · OSZK / EPA · kivágás',
    source: { label: 'eredeti forrás', url: 'https://epa.oszk.hu/04500/04582/03860/pdf/EPA04582_kecskemeti_lapok_1911_060.pdf#page=4' },
    kind: 'document',
    size: 'medium',
  },
  petrovits1902: {
    image: petrovits1902Image,
    alt: 'Petrovits Robert MÁV-művezető korai címtári sora.',
    caption: '1902–1903: Robert (Petrovits), MÁV-művezető, Dembinszky utca 18.',
    credit: 'Budapesti Czim- és Lakásjegyzék, 1902–1903, 1451. o. · FSZEK / Hungaricana · kivágás',
    source: { label: 'eredeti forrás', url: 'https://library.hungaricana.hu/hu/view/BPLAKCIMJEGYZEK_14_1902-1903/?pg=1522' },
    kind: 'document',
    size: 'wide',
  },
  petrovits1922: {
    image: petrovits1922Image,
    alt: 'Petrovits Róbert MÁV-művezető 1922–1923-as címtári sora.',
    caption: '1922–1923: Róbert, MÁV-művezető, ugyanazon a címen. A két adat közötti folyamatos itt lakás nem igazolható.',
    credit: 'Budapesti Czim- és Lakásjegyzék, 1922–1923, 1011. o. · FSZEK / Hungaricana · kivágás',
    source: { label: 'eredeti forrás', url: 'https://library.hungaricana.hu/hu/view/BPLAKCIMJEGYZEK_28_1922-1923/?pg=2162' },
    kind: 'document',
    size: 'wide',
  },
  takacsCarFirm: {
    image: takacsCarFirmImage,
    alt: 'Eberhard Árpád autóvállalat-tulajdonos címe és Józs. 51–47 telefonszáma a Takács névcsoportban.',
    caption: 'Takács Eberhard Árpád autóvállalat-tulajdonos bejegyzése, 1922–1923. A cím mellett a Józs. 51–47 telefonszám is szerepel.',
    credit: 'Budapesti Czim- és Lakásjegyzék, 1922–1923, 1358. o. · FSZEK / Hungaricana · kivágás',
    source: { label: 'eredeti forrás', url: 'https://library.hungaricana.hu/hu/view/BPLAKCIMJEGYZEK_28_1922-1923/?pg=2509' },
    kind: 'document',
    size: 'wide',
  },
  yellowStarList: {
    image: yellowStarListImage,
    alt: '1944-es hatósági címjegyzék; a VII. kerület csillagos házai között a Dembinszky utca 18. is szerepel.',
    caption: 'A csillagos házakat kijelölő 1944. június 16-i közlemény mellékletének 3. oldala. A Dembinszky utca 18. a VII. kerület felsorolásában, a bal alsó hasáb alján olvasható.',
    credit: 'Fővárosi Közlöny, 1944. június 16., 30. szám, melléklet, 3. o. · OSA Archívum / Csillagos Házak',
    source: { label: 'eredeti forrás', url: 'https://www.csillagoshazak.hu/sites/csillagoshazak.hu/files/pdfs/rendelet1.pdf#page=3' },
    kind: 'document',
    size: 'medium',
  },
  machinists1954: {
    image: machinists1954Image,
    alt: 'Munkások gépészeti berendezés mellett, láncos emelővel egy többszintes munkatérben.',
    caption: 'Gépészek munka közben Budapesten, 1954-ben. Korabeli szakmai környezetkép; a felvétel nem a Dembinszky utca 18. lakóit vagy az ő munkahelyüket ábrázolja.',
    credit: 'Fotó: Fortepan / Bauer Sándor, 1954, képszám: 127523 · CC BY-SA 4.0 a MaNDA tételoldala szerint · méretezve',
    source: { label: 'eredeti forrás', url: 'https://mandadb.hu/tetel/671509/Gepeszek_munka_kozben' },
    kind: 'photo',
    size: 'narrow',
  },
  projectionist1954: {
    image: projectionist1954Image,
    alt: 'Mozigépész filmvetítő mellett, a vetítőfülke ablakán át figyeli a vetítést.',
    caption: 'Mozigépész a vetítőfülkében, 1954. Kotnyek Antal felvétele a szakma korabeli környezetét mutatja; nem Ballák Magdát ábrázolja, és az ő munkahelyét sem azonosítja.',
    credit: 'Fotó: Fortepan / Kotnyek Antal, 1954, képszám: 96313 · CC BY-SA 3.0 · méretezve',
    source: { label: 'eredeti forrás', url: 'https://fortepan.hu/hu/photos/?id=96313' },
    kind: 'photo',
    size: 'wide',
  },
  timeStudyGrading: {
    image: timeStudyGradingImage,
    alt: 'Időelemzési és normaosztály cím alatt az időelemzők munkaköri besorolása és gyakorlati éveik szerinti fokozatai.',
    caption: '„Időelemzési és normaosztály”: munkaköri és besorolási részlet az O. M. B. Közlöny 1949. március 3-i számából. A dokumentum a szakma hátterét mutatja, Horváth Jánost nem nevezi meg.',
    credit: 'O. M. B. Közlöny, 1949. március 3., 9. szám, 186. o. · SZTE Miscellanea Repozitórium · CC BY-SA 4.0 · kivágás',
    source: { label: 'eredeti forrás', url: 'https://misc.bibl.u-szeged.hu/56182/' },
    kind: 'document',
    size: 'column',
  },
} satisfies Record<string, LakokFigure>;

/** Largest display width of each size class in CSS px; must match the lakok-figure--* rules in story.css. */
const displayWidths: Record<LakokFigure['size'], number> = { narrow: 400, medium: 480, wide: 620, column: 704 };

/** EvidenceFigure props for a Lakók figure: never wider than the source, never cropped. */
export function figureProps(figure: LakokFigure) {
  const { size, ...props } = figure;
  const displayWidth = displayWidths[size];
  const sourceWidth = figure.image.width;
  const candidateWidths = [360, displayWidth, 2 * displayWidth].map((width) => Math.min(sourceWidth, width));
  const widths = [...new Set(candidateWidths)].sort((a, b) => a - b);
  // On a phone a strip is only about 50px tall, so the zoom button would hide its text.
  const isStrip = figure.image.width / figure.image.height > 3.5;
  const classes = [size === 'column' ? undefined : `lakok-figure--${size}`, isStrip ? 'lakok-figure--strip' : undefined];
  return {
    ...props,
    widths,
    sizes: `(min-width: ${displayWidth + 80}px) ${displayWidth}px, 100vw`,
    class: classes.filter(Boolean).join(' ') || undefined,
  };
}
