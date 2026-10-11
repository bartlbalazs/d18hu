import approvalSignature1899Image from '../../assets/pages/epulet/01-jovahagyas-markus-1899.jpg';
import elevationClause1899Image from '../../assets/pages/epulet/02-homlokzat-zaradek-1899.png';
import section1899Image from '../../assets/pages/epulet/03-metszet-1899.png';
import elevation1899Image from '../../assets/pages/epulet/04-homlokzat-1899.png';
import mellingerStampImage from '../../assets/pages/epulet/05a-mellinger-belyegzo.jpg';
import sharedToiletsImage from '../../assets/pages/epulet/05b-closettek.jpg';
import occupancyPermit1901Image from '../../assets/pages/epulet/06-hasznalhatasi-engedely-1901.png';
import balconyPlan1901Image from '../../assets/pages/epulet/07-erkely-1901.png';
import restorationTitle1948Image from '../../assets/pages/epulet/08-helyreallitas-1948.jpg';
import approval1956Image from '../../assets/pages/epulet/09-zaradek-1956.jpg';
import galleryDescription1969Image from '../../assets/pages/epulet/10-fuggofolyoso-leiras-1969.png';
import galleryPlan1969Image from '../../assets/pages/epulet/11-fuggofolyoso-alaprajz-1969.png';
import type { StoryFigure } from '../images/story-figures.ts';

const credit = 'Fotó: a szerző';

export const epuletFigures = {
  approvalSignature1899: {
    id: 'kep-1',
    image: approvalSignature1899Image,
    alt: 'Megsárgult iratlap kézírásos jóváhagyó szöveggel, alatta egy hivatali aláírás fekete körbélyegzővel, majd Márkus Géza nagy betűs aláírása; legalul lila tervtári bélyegző.',
    caption: 'Az 1899-es tervanyag jóváhagyási záradéka. Márkus Géza nagyobb betűs aláírása a szöveg és a fekete körbélyegző alatt látható.',
    credit,
    kind: 'document',
    size: 'medium',
  },
  elevationClause1899: {
    id: 'kep-2',
    image: elevationClause1899Image,
    alt: 'Kinyitott tervanyag: balra kézírásos jóváhagyó szöveg aláírással, fekete és lila körbélyegzővel, jobbra két illetékbélyeg és a lila „HOMLOKZAT” felirat.',
    caption: 'A homlokzati terv jóváhagyási záradéka: balra az 1899. május 18-i keltezésű kézírásos szöveg és a hatósági körbélyegző, jobbra a „HOMLOKZAT” felirat látható.',
    credit,
    kind: 'document',
    size: 'medium',
  },
  section1899: {
    id: 'kep-3',
    image: section1899Image,
    alt: 'Színezett épületmetszet: pince, földszint, három emelet és a magastető faszerkezete, jobbra az utcai homlokzat egy szelete; alul léptékvonal és Horváth Pál kézírásos aláírása.',
    caption: 'Az 1899-es építkezés metszete: alul a pince, fölötte a földszint és a három emelet, legfelül a tető faszerkezete látszik. Horváth Pál építőmester aláírása a rajz alatti léptékvonal alatt olvasható.',
    credit,
    kind: 'document',
    size: 'medium',
  },
  elevation1899: {
    id: 'kep-4',
    image: elevation1899Image,
    alt: 'Négyszintes bérház homlokzati tervrajza középen háromszögű, díszes oromzattal, gazdagon keretezett ablakokkal és középső kapuval; alul léptékvonal és kézírásos aláírás.',
    caption: 'Az 1899-es homlokzati terv. Középen háromszögű oromzat, az első emeleti ablakok fölött kagylódíszek; alul Horváth Pál építőmester aláírása.',
    credit,
    kind: 'document',
    size: 'wide',
  },
  mellingerStamp: {
    id: 'kep-5a',
    image: mellingerStampImage,
    alt: 'Alaprajz alsó széle méretvonalakkal: balra lila keretes bélyegző „Mellinger Arthur építész, Budapest” felirattal, jobbra nagy kézírásos aláírás, alatta „1901 ápr. 16. Felelős építőmester” kézírással.',
    caption: 'A tervlap alsó részletén a „Mellinger Arthur építész, Budapest” bélyegző és a mellette szereplő aláírás látható.',
    credit,
    kind: 'document',
    size: 'column',
  },
  sharedToilets: {
    id: 'kep-5b',
    image: sharedToiletsImage,
    alt: 'Színezett alaprajzrészlet: ívelt udvari folyosó, jobbra csigalépcső és fölötte „Closettek” felirattal jelölt kis helyiségek.',
    caption: 'Az udvari alaprajz részletén a melléklépcső, a mellette „Closettek” felirattal jelölt illemhelyek és a hozzájuk vezető folyosó látható.',
    credit,
    kind: 'document',
    size: 'column',
  },
  occupancyPermit1901: {
    id: 'kep-6',
    image: occupancyPermit1901Image,
    alt: 'A VII. kerületi elöljáróság nyomtatott űrlapja „Használhatási engedély” címmel: kézzel kitöltött rovatok Spitz János Ferenc nevével, középen kézírásos kikötés, alul keltezés, pecsét és az elöljáró aláírása.',
    caption: 'A ház 1901. április 20-i használhatási engedélye. A nyomtatott űrlap alsó felében, a díjbejegyzés fölötti kézírás tiltja a pincehelyiségek műhelyként vagy lakásként való használatát.',
    credit,
    kind: 'document',
    size: 'medium',
  },
  balconyPlan1901: {
    id: 'kep-7',
    image: balconyPlan1901Image,
    alt: 'Erkélyterv két illetékbélyeggel: balra az első emeleti ablakok homlokzati nézete kovácsoltvas korlátos erkéllyel, jobbra metszet és helyszínrajz, lent alaprajz „Mátrai féle szab. vasbeton” felirattal.',
    caption: 'A Spitz házaspár számára tervezett nyitott erkély, 1901. július 2. Balra a homlokzati nézet, jobbra a metszet látható; a bal alsó alaprajz alatt olvasható a Mátrai-féle vasbeton megjelölése.',
    credit,
    kind: 'document',
    size: 'column',
  },
  restorationTitle1948: {
    id: 'kep-8',
    image: restorationTitle1948Image,
    alt: 'Tervlap címmezője „Lakás helyreállítási munkálatok terve” felirattal, a tervező, az építtető és a háztulajdonos nevével.',
    caption: 'Az I. emelet 1. számú lakásához készült helyreállítási terv címmezője. A felirat Rajna Ernőt tervezőként, Jacobi Dénesnét építtetőként, dr. Miletits Györgynét háztulajdonosként nevezi meg.',
    credit,
    kind: 'document',
    size: 'column',
  },
  approval1956: {
    id: 'kep-9',
    image: approval1956Image,
    alt: 'Lila bélyegzős jóváhagyási záradék: „Jóváhagyta, Budapest, 1956. évi aug. hó 22. nap”, alatta aláírás és két kerek bélyegző a VII. kerületi tanács építési és közlekedési osztályától.',
    caption: 'Az 1956-os átalakítási tervanyag jóváhagyási záradéka, augusztus 22-i dátummal.',
    credit,
    kind: 'document',
    size: 'narrow',
  },
  galleryDescription1969: {
    id: 'kep-10',
    image: galleryDescription1969Image,
    alt: 'Gépelt lap „Műszaki leírás” címmel a Dembinszky utca 18. függőfolyosó-cseréjéről, alul „Budapest, 1969. március hó” keltezéssel és Kecse Nagy Sándor építésztervező nevével.',
    caption: 'A függőfolyosócsere műszaki leírása, 1969. március. A gépelt szöveg a salakbeton lemezek vasbetonra cserélését, a korlát javítását és visszahelyezését írja elő. A keltezés fölötti utolsó bekezdés a közlekedést biztosító pallóterítésről és átjáróhidakról szól; alul Kecse Nagy Sándor építésztervező neve olvasható.',
    credit,
    kind: 'document',
    size: 'medium',
  },
  galleryPlan1969: {
    id: 'kep-11',
    image: galleryPlan1969Image,
    alt: 'Halvány tervmásolat az udvart körülvevő függőfolyosókról, ferde sarokszakaszokkal; jobbra „Dembinszky utca” felirat, alul kézírással: „I.–II.–III. emeleten teljes függőfolyosó csere!”',
    caption: 'A függőfolyosócsere alaprajzi részlete. A rajz alatti kézírás mindhárom emeleten teljes cserét jelöl; a két alsó udvari saroknál a folyosó ferde fordulatai is felismerhetők.',
    credit,
    kind: 'document',
    size: 'column',
  },
} satisfies Record<string, StoryFigure>;
