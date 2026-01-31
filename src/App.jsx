import React, { useState, useCallback, useEffect } from 'react';

// ========================================
// SOUS VIDE DATA (baserat på Modernist Cuisine)
// ========================================
// Tjockleksbaserade tider (minuter) för sous vide (från Modernist Cuisine)
// Tid för att nå kärntemperatur från kylskåpstemperatur (~5°C)
const sousVideThickness = {
  // Tjocklek i cm → minuter för att nå kärntemperatur
  heating: {
    1.0: 25,
    1.5: 35,
    2.0: 50,
    2.5: 60,
    3.0: 90,
    3.5: 120,
    4.0: 150,
    4.5: 180,
    5.0: 210,
    5.5: 250,
    6.0: 280,
    7.0: 360,
    8.0: 450,
  },
  // Extra tid för pastörisering vid olika temperaturer (minuter)
  // Baserat på FDA/USDA riktlinjer och Modernist Cuisine
  pasteurization: {
    54: 120,  // 2 timmar extra vid 54°C
    55: 90,
    56: 60,
    57: 45,
    58: 30,
    60: 15,
    63: 5,
    65: 1,
    68: 0,    // Omedelbar pastörisering vid 68°C+
  },
  // Texturförbättringstid för tuffa styckningsdelar (timmar)
  tenderizing: {
    'Flankstek': 8,
    'Högrev': 24,
    'Nötbringa': 48,
    'Revbensspjäll': 12,
    'Fläskbog (Pulled)': 18,
    'Fläsklägg': 8,
    'Lammlägg': 12,
    'Lammbog': 18,
    'Anklår (Confit)': 8,
    'Bläckfisk': 4,
  }
};

const sousVideData = {
  'Nötkött': [
    { name: 'Oxfilé', rare: { temp: 54, time: '1-2h' }, medium: { temp: 58, time: '1-2h' }, wellDone: { temp: 65, time: '1-2h' }, maxTime: '4h', tips: 'Perfekt för sous vide. Bryn snabbt efteråt för Maillard-reaktion.', afterCare: 'Bryn snabbt (30-60 sek per sida) på mycket hög värme för Maillard-reaktion och krispig yta.' },
    { name: 'Entrecôte', rare: { temp: 54, time: '1-2h' }, medium: { temp: 58, time: '1-2h' }, wellDone: { temp: 65, time: '2-3h' }, maxTime: '4h', tips: 'Fettet behöver lite längre tid för att mjukna.', afterCare: 'Bryn snabbt (30-60 sek per sida) på mycket hög värme. Fettet blir extra gott vid hög värme.' },
    { name: 'Flankstek', rare: { temp: 54, time: '8-12h' }, medium: { temp: 58, time: '8-12h' }, wellDone: null, maxTime: '24h', tips: 'Lång tid bryter ner bindväv. Skär tunt mot fibrerna.', afterCare: 'Bryn snabbt på hög värme. Skär tunt mot fibrerna före servering.' },
    { name: 'Högrev', rare: null, medium: { temp: 62, time: '24-48h' }, wellDone: { temp: 68, time: '24-36h' }, maxTime: '72h', tips: 'Tough cut - kräver lång tid. Perfekt för pulled beef.', afterCare: 'Shreddas för pulled beef eller bryn snabbt för servering som stek.' },
    { name: 'Rostbiff', rare: { temp: 54, time: '3-6h' }, medium: { temp: 58, time: '3-6h' }, wellDone: { temp: 65, time: '4-8h' }, maxTime: '12h', tips: 'Jämn temperatur genom hela steken.', afterCare: 'Bryn snabbt på alla sidor för fin yta. Vila 5 min innan skivning.' },
    { name: 'Nötbringa', rare: null, medium: null, wellDone: { temp: 68, time: '48-72h' }, maxTime: '72h', tips: 'Blir silkeslen efter 48+ timmar. Toppas med BBQ-glaze.', afterCare: 'Pensla med BBQ-glaze och gratinierera i ugn eller på grill.' },
  ],
  'Fläsk': [
    { name: 'Fläskfilé', rare: null, medium: { temp: 60, time: '1-2h' }, wellDone: { temp: 65, time: '1-2h' }, maxTime: '4h', tips: 'Säker vid 60°C. Saftigare än traditionellt.', afterCare: 'Bryn snabbt på hög värme för fin yta och färg.' },
    { name: 'Fläskkotlett', rare: null, medium: { temp: 60, time: '1-2h' }, wellDone: { temp: 65, time: '1-2h' }, maxTime: '4h', tips: 'Med ben tar lite längre tid.', afterCare: 'Bryn snabbt på hög värme, särskilt fettkanten.' },
    { name: 'Fläskkarré', rare: null, medium: { temp: 60, time: '2-4h' }, wellDone: { temp: 65, time: '2-4h' }, maxTime: '6h', tips: 'Perfekt jämnhet genom hela stycket.', afterCare: 'Bryn snabbt eller gratinierera i ugn för fin yta.' },
    { name: 'Revbensspjäll', rare: null, medium: null, wellDone: { temp: 68, time: '12-24h' }, maxTime: '36h', tips: 'Fall-off-the-bone mörhet. Grilla/rök efteråt för bark.', afterCare: 'Pensla med glaze och grilla/bränna på hög värme för karamelliserad bark.' },
    { name: 'Fläskbog (Pulled)', rare: null, medium: null, wellDone: { temp: 68, time: '18-24h' }, maxTime: '36h', tips: 'Shreddas enkelt efter sous vide. Krydda väl innan.', afterCare: 'Shreddas med två gafflar. Blanda med BBQ-sås och värm eventuellt i ugn.' },
    { name: 'Fläsklägg', rare: null, medium: null, wellDone: { temp: 77, time: '8-12h' }, maxTime: '24h', tips: 'Kollagen bryts ner perfekt.', afterCare: 'Servera direkt med sky eller gratinierera för krispigt skinn.' },
  ],
  'Kyckling & Fågel': [
    { name: 'Kycklingbröst', rare: null, medium: { temp: 63, time: '1-2h' }, wellDone: { temp: 68, time: '1-2h' }, maxTime: '4h', tips: 'Saftigaste kycklingbröstet du smakat. 63°C är säkert efter 1h.', afterCare: 'Bryn snabbt skinnsidan ner för krispigt skinn. Eller servera direkt om skinlös.' },
    { name: 'Kycklinglår', rare: null, medium: null, wellDone: { temp: 74, time: '2-4h' }, maxTime: '8h', tips: 'Högre temp pga bindväv. Ger otrolig mörhet.', afterCare: 'Bryn skinnsidan för krispighet eller gratinierera i ugn.' },
    { name: 'Ankbröst', rare: { temp: 54, time: '2-3h' }, medium: { temp: 58, time: '2-3h' }, wellDone: { temp: 65, time: '2-3h' }, maxTime: '6h', tips: 'Rosa anka är säkert. Bryn skinnet efteråt.', afterCare: 'Bryn skinnsidan i kall panna som värms långsamt för maximalt krispigt skinn.' },
    { name: 'Anklår (Confit)', rare: null, medium: null, wellDone: { temp: 68, time: '8-12h' }, maxTime: '24h', tips: 'Ersätter traditionell confit. Lägg till ankfett i påsen.', afterCare: 'Bryn i ankfett eller gratinierera i ugn tills skinnet är krispigt.' },
    { name: 'Kalkonbröst', rare: null, medium: { temp: 63, time: '2-4h' }, wellDone: { temp: 68, time: '2-4h' }, maxTime: '6h', tips: 'Aldrig torr kalkon igen!', afterCare: 'Bryn snabbt för färg eller servera direkt skivat.' },
  ],
  'Lamm': [
    { name: 'Lammrack', rare: { temp: 54, time: '1-2h' }, medium: { temp: 58, time: '1-2h' }, wellDone: { temp: 65, time: '2h' }, maxTime: '4h', tips: 'Bryn med timjan och vitlök efteråt.', afterCare: 'Bryn snabbt i smör med timjan, vitlök och rosmarin.' },
    { name: 'Lammfilé', rare: { temp: 54, time: '45min-1h' }, medium: { temp: 58, time: '1h' }, wellDone: { temp: 65, time: '1-2h' }, maxTime: '3h', tips: 'Kort tid pga liten diameter.', afterCare: 'Bryn snabbt runt om för jämn, fin yta.' },
    { name: 'Lammstek', rare: { temp: 54, time: '4-8h' }, medium: { temp: 58, time: '4-8h' }, wellDone: { temp: 65, time: '6-10h' }, maxTime: '12h', tips: 'Perfekt för stora stycken.', afterCare: 'Bryn på alla sidor. Vila 10-15 min före skivning.' },
    { name: 'Lammlägg', rare: null, medium: null, wellDone: { temp: 68, time: '12-24h' }, maxTime: '36h', tips: 'Faller från benet. Traditionell brässering på modern tid.', afterCare: 'Servera direkt med sky eller bryn försiktigt för lite yta.' },
    { name: 'Lammbog', rare: null, medium: null, wellDone: { temp: 68, time: '18-24h' }, maxTime: '36h', tips: 'Pull-apart mörhet.', afterCare: 'Shreddas eller servera hel med reducerad sky.' },
  ],
  'Fisk': [
    { name: 'Lax', rare: { temp: 45, time: '30-45min' }, medium: { temp: 52, time: '30-45min' }, wellDone: { temp: 60, time: '30-45min' }, maxTime: '1h', tips: '45°C = glasig, 52°C = medium. Otroligt resultat!', afterCare: 'Servera direkt. Om önskat: bryn skinnsidan snabbt eller flambera med gasbrännare.' },
    { name: 'Torsk', rare: null, medium: { temp: 50, time: '20-30min' }, wellDone: { temp: 55, time: '20-30min' }, maxTime: '45min', tips: 'Flakig och saftig. Servera direkt.', afterCare: 'Servera direkt – torsk behöver ingen efterbehandling. Toppa med brynt smör.' },
    { name: 'Hälleflundra', rare: null, medium: { temp: 50, time: '30-45min' }, wellDone: { temp: 55, time: '30-45min' }, maxTime: '1h', tips: 'Fast vitt kött. Premium resultat.', afterCare: 'Servera direkt med sås. Behöver ingen bryning.' },
    { name: 'Tonfisk', rare: { temp: 40, time: '20-30min' }, medium: { temp: 50, time: '20-30min' }, wellDone: { temp: 60, time: '30min' }, maxTime: '45min', tips: 'Sashimi-kvalitet vid 40°C.', afterCare: 'Servera direkt eller bryn blixtnabbt (5 sek) på ytan för tataki-stil.' },
    { name: 'Sej/Kolja', rare: null, medium: { temp: 50, time: '20-30min' }, wellDone: { temp: 55, time: '20-30min' }, maxTime: '45min', tips: 'Vardagsfisk blir restaurangklass.', afterCare: 'Servera direkt med sås eller brynt smör. Ingen extra tillagning behövs.' },
  ],
  'Skaldjur': [
    { name: 'Räkor (stora)', rare: null, medium: null, wellDone: { temp: 60, time: '15-20min' }, maxTime: '30min', tips: 'Rosa och snärtiga. Översteks lätt!', afterCare: 'Servera direkt – räkor är klara som de är. Kan kylas för räkcocktail.' },
    { name: 'Hummer', rare: null, medium: { temp: 60, time: '30-45min' }, wellDone: { temp: 63, time: '30-45min' }, maxTime: '1h', tips: 'Smörmjukt hummerkött. Fantastiskt!', afterCare: 'Servera direkt med smält smör. Kan gratineras kort om önskat.' },
    { name: 'Pilgrimsmusslor', rare: null, medium: { temp: 52, time: '20-30min' }, wellDone: { temp: 58, time: '25-35min' }, maxTime: '45min', tips: 'Bryn snabbt efteråt för yta.', afterCare: 'Bryn snabbt (15-20 sek per sida) på hög värme för karamelliserad yta.' },
    { name: 'Bläckfisk', rare: null, medium: null, wellDone: { temp: 77, time: '4-6h' }, maxTime: '8h', tips: 'Mjuk som smör efter lång tid. Revolutionerande!', afterCare: 'Kan serveras direkt eller grillas snabbt för smoky smak. Skär i skivor.' },
  ],
  'Ägg': [
    { name: 'Onsen-ägg (63°C ägg)', rare: null, medium: { temp: 63, time: '45-60min' }, wellDone: null, maxTime: '2h', tips: 'Krämig gula, just-set vita. Ikoniskt!', afterCare: 'Knäck försiktigt i skål. Servera på toast, ramen, sallad eller rice bowl.' },
    { name: 'Pocherat ägg-textur', rare: null, medium: { temp: 65, time: '45min' }, wellDone: null, maxTime: '1.5h', tips: 'Fastare vita, fortfarande flytande gula.', afterCare: 'Knäck försiktigt ur skalet. Perfekt för Eggs Benedict eller sallader.' },
    { name: 'Hårdkokt textur', rare: null, medium: null, wellDone: { temp: 75, time: '1h' }, maxTime: '2h', tips: 'Perfekt hårdkokt utan grön ring.', afterCare: 'Kyl i isbad för enklare skalning. Perfekt för ägghalvor eller äggröra.' },
  ],
};

// Sous vide säkerhetsinformation (baserat på Modernist Cuisine)
const sousVideSafety = {
  title: 'Livsmedelssäkerhet vid Sous Vide',
  zones: [
    { range: '4-54°C', name: 'Farozonen', description: 'Bakterier växer snabbt. Max 2 timmar totalt.' },
    { range: '54-60°C', name: 'Pastöriseringszon', description: 'Bakterier dör över tid. Säkert efter 1-4h beroende på tjocklek.' },
    { range: '60°C+', name: 'Säker zon', description: 'Bakterier dör snabbt. Traditionellt "säker" temperatur.' },
  ],
  rules: [
    'Mat ska från kylskåp till vattenbad på under 1 timme',
    'Kyl snabbt i isbad om du inte serverar direkt',
    'Sous vide-mat innehåller sovande sporer - ät inom 2h eller kyl till <4°C',
    'Frys inte sous vide-mat som redan legat i kylskåp',
    'Återvärm till samma temperatur, inte högre',
  ],
  sporeWarning: 'Clostridium-sporer överlever sous vide. Kyl alltid snabbt efter tillagning om maten inte äts direkt.'
};

// ========================================
// HÄLSOMÅL-KOPPLINGAR (baserat på How Not to Die, Blue Zones)
// ========================================
const healthGoals = {
  'Hjärthälsa': {
    description: 'Mat som stödjer ett friskt hjärta och blodkärl',
    goodIngredients: ['Lax', 'Makrill', 'Sardiner', 'Valnötter', 'Linfrö', 'Havregryn', 'Bönor', 'Olivolja', 'Avokado', 'Blåbär', 'Spenat', 'Grönkål'],
    avoidIngredients: ['Bacon', 'Korv', 'Processat kött', 'Smör i stora mängder', 'Friterat'],
    nutrients: { prioritize: ['omega-3', 'fiber', 'kalium'], limit: ['mättat fett', 'natrium'] },
    science: 'Omega-3 fettsyror minskar inflammation och triglycerider. Fiber sänker LDL-kolesterol.'
  },
  'Energi & Fokus': {
    description: 'Mat för stabil energi och mental skärpa',
    goodIngredients: ['Ägg', 'Havregryn', 'Blåbär', 'Nötter', 'Fullkornsbröd', 'Bananer', 'Quinoa', 'Lax', 'Mörk choklad', 'Grönt te'],
    avoidIngredients: ['Sockerdrycker', 'Vitt bröd', 'Godis', 'Energidrycker'],
    nutrients: { prioritize: ['protein', 'komplexa kolhydrater', 'B-vitaminer'], limit: ['socker', 'raffinerade kolhydrater'] },
    science: 'Stabilt blodsocker = stabil energi. Protein och fiber bromsar glukosupptaget.'
  },
  'Bättre sömn': {
    description: 'Mat som främjar avslappning och sömnkvalitet',
    goodIngredients: ['Körsbär', 'Valnötter', 'Mandel', 'Kalkon', 'Kyckling', 'Banan', 'Honung', 'Kamomillte', 'Varm mjölk', 'Havregryn'],
    avoidIngredients: ['Kaffe', 'Te (svart/grönt)', 'Choklad', 'Alkohol', 'Kryddstark mat', 'Energidrycker'],
    nutrients: { prioritize: ['tryptofan', 'magnesium', 'melatonin'], limit: ['koffein'] },
    science: 'Tryptofan omvandlas till serotonin och sedan melatonin. Körsbär innehåller naturligt melatonin.'
  },
  'Muskelbyggande': {
    description: 'Mat för muskelåterhämtning och tillväxt',
    goodIngredients: ['Kycklingbröst', 'Ägg', 'Kvarg', 'Cottage cheese', 'Lax', 'Nötfärs (mager)', 'Linser', 'Quinoa', 'Tofu', 'Grekisk yoghurt'],
    avoidIngredients: [],
    nutrients: { prioritize: ['protein', 'leucin', 'omega-3'], limit: [] },
    science: 'Protein bygger muskler. 1.6-2.2g protein per kg kroppsvikt för optimal tillväxt.'
  },
  'Immunförsvar': {
    description: 'Mat som stärker kroppens försvar',
    goodIngredients: ['Citrusfrukter', 'Paprika', 'Broccoli', 'Vitlök', 'Ingefära', 'Spenat', 'Mandel', 'Gurkmeja', 'Yoghurt', 'Grön te', 'Honung'],
    avoidIngredients: ['Socker i överskott', 'Alkohol', 'Processat kött'],
    nutrients: { prioritize: ['C-vitamin', 'D-vitamin', 'zink', 'probiotika'], limit: ['socker'] },
    science: 'C-vitamin stödjer vita blodkroppar. Probiotika stärker tarmfloran där 70% av immunförsvaret sitter.'
  },
  'Viktkontroll': {
    description: 'Mat som mättar länge utan för många kalorier',
    goodIngredients: ['Ägg', 'Kvarg', 'Kyckling', 'Fisk', 'Bönor', 'Linser', 'Grönsaker', 'Bär', 'Havregryn', 'Popcorn'],
    avoidIngredients: ['Sockerdrycker', 'Chips', 'Godis', 'Friterat', 'Vitt bröd'],
    nutrients: { prioritize: ['protein', 'fiber'], limit: ['socker', 'raffinerade kolhydrater'] },
    science: 'Protein och fiber ökar mättnadskänslan. Högre termisk effekt vid proteinmetabolism.'
  },
  'Tarmhälsa': {
    description: 'Mat för en frisk tarmflora',
    goodIngredients: ['Yoghurt', 'Kefir', 'Surkål', 'Kimchi', 'Miso', 'Kombucha', 'Bönor', 'Linser', 'Fullkorn', 'Bananer', 'Lök', 'Vitlök', 'Havregryn'],
    avoidIngredients: ['Artificiella sötningsmedel', 'Processat kött', 'Friterat'],
    nutrients: { prioritize: ['fiber', 'probiotika', 'prebiotika'], limit: [] },
    science: 'Probiotika tillför goda bakterier. Prebiotika (fiber) matar dem. Mångfald i kosten = mångfald i tarmen.'
  },
  'Ledhälsa': {
    description: 'Mat som stödjer leder och minskar inflammation',
    goodIngredients: ['Lax', 'Makrill', 'Sardiner', 'Valnötter', 'Olivolja', 'Körsbär', 'Broccoli', 'Spenat', 'Gurkmeja', 'Ingefära'],
    avoidIngredients: ['Socker', 'Vitt mjöl', 'Friterat', 'Processat kött'],
    nutrients: { prioritize: ['omega-3', 'vitamin D', 'kollagen'], limit: ['omega-6 i överskott', 'socker'] },
    science: 'Omega-3 är antiinflammatoriskt. Gurkmeja (curcumin) har dokumenterad effekt på ledsmärta.'
  }
};

// Vila-tider för kött (baserat på The Food Lab)
const restingTimes = {
  'Biff (tunn, 2cm)': { time: '5 min', tempRise: '2-3°C' },
  'Biff (tjock, 4cm)': { time: '8-10 min', tempRise: '3-5°C' },
  'Fläskfilé': { time: '5-8 min', tempRise: '2-3°C' },
  'Fläskkotlett': { time: '5 min', tempRise: '2-3°C' },
  'Kycklingbröst': { time: '5 min', tempRise: '2-3°C' },
  'Hel kyckling': { time: '10-15 min', tempRise: '3-5°C' },
  'Lammstek': { time: '15-20 min', tempRise: '4-6°C' },
  'Lammrack': { time: '8-10 min', tempRise: '3-4°C' },
  'Rostbiff': { time: '20-30 min', tempRise: '5-8°C' },
  'Oxfilé (hel)': { time: '15-20 min', tempRise: '4-6°C' },
  'Fläskkarré': { time: '10-15 min', tempRise: '3-5°C' },
  'Revbensspjäll': { time: '10 min', tempRise: '2-3°C' },
};

// Vetenskaplig förklaring per kategori (baserat på The Food Lab)
const categoryScience = {
  'Nötkött': {
    title: 'Varför nötkött kan ätas rosa',
    explanation: 'Nötkött är säkert att äta rosa eftersom eventuella bakterier (som E. coli och Salmonella) endast finns på köttets yta och dödas vid stekning. Innertemperaturen avgör konsistensen – vid 55°C är proteinerna fortfarande mjuka och saftiga, medan de vid 70°C har kontraherat och pressat ut mycket av vätskan.',
    tip: 'Använd alltid stektermometer för perfekt resultat.'
  },
  'Kalv': {
    title: 'Kalvkött – mildare och mörare',
    explanation: 'Kalvkött har mindre bindväv och en mildare smak än nötkött. Det tål lite lägre temperaturer och blir snabbt torrt om det översteks. Kalvlever ska vara rosa inuti för bäst smak och textur.',
    tip: 'Stek kalvkött varsamt – det är mer förlåtande än nötkött.'
  },
  'Lamm': {
    title: 'Lamm – smaken av fett',
    explanation: 'Lammets karakteristiska smak kommer från fettet, särskilt fettlösliga föreningar som bildas när djuret betar. Rosa lamm (55-60°C) har mer smak och bättre textur. Fettet börjar smälta vid ca 54°C.',
    tip: 'Skär bort synligt fett om du vill ha mildare smak.'
  },
  'Fläsk': {
    title: 'Fläsk – säkert vid lägre temp',
    explanation: 'Modern fläskproduktion har i princip eliminerat risken för trikiner. 63°C ger saftigt, rosa fläskkött – den gamla regeln om 77°C är föråldrad. Kollagen i sega detaljer (bog, lägg) kräver dock långsam tillagning vid 85°C+ för att brytas ner.',
    tip: 'Fläskfilé är saftigast vid exakt 63°C innertemperatur.'
  },
  'Fågel': {
    title: 'Fågel kräver genomstekning',
    explanation: 'Till skillnad från nötkött kan Salmonella finnas inuti fågelkött, inte bara på ytan. Därför måste fågel vara genomstekt (70-74°C). Undantag: lever kan serveras rosa (55-65°C) då den har annan struktur. Lår tål högre temp (80°C) eftersom de har mer bindväv.',
    tip: 'Mät alltid i lårets tjockaste del, inte i bröstet.'
  },
  'Vilt': {
    title: 'Vilt – magert kräver omsorg',
    explanation: 'Viltkött är betydligt magrare än tamdjur och har därför mindre marginal för fel. Det torkar snabbt ut vid överstekt. De flesta viltsorter är säkra att äta rosa. Undantag: vildsvin ska alltid vara genomstekt pga risk för parasiter.',
    tip: 'Tillsätt fett (bacon, smör) vid tillagning av magert vilt.'
  },
  'Fisk': {
    title: 'Fisk – proteiner som skiljer sig',
    explanation: 'Fiskproteiner koagulerar vid lägre temperatur än köttproteiner. Lax är glasig vid 45°C, medium vid 52°C och genomstekt vid 60°C. Vitfisk (torsk, sej) ska precis "flagna" – det sker vid ca 50-55°C.',
    tip: 'Fisk fortsätter tillagas efter den tagits av värmen – ta av den lite tidigt.'
  },
  'Skaldjur': {
    title: 'Skaldjur – snabb tillagning',
    explanation: 'Skaldjur blir snabbt sega och gummiaktiga vid överstekt. Räkor är klara så fort de blir rosa och fasta (63°C). Musslor ska kasseras om de inte öppnar sig. Pilgrimsmusslor och bläckfisk kräver antingen mycket kort eller mycket lång tillagning.',
    tip: 'Snabbstek eller långkok – inget däremellan för bläckfisk.'
  }
};

// Komplett data för innertemperaturer baserat på research
const temperatureData = {
  'Nötkött': [
    { name: 'Biff', rare: 55, medium: 60, wellDone: 70, restTime: '5-8 min', saltning: 'Minst 40 min före', tips: 'Låt köttet vila efter stekning. Temperaturen stiger 2-4°C.' },
    { name: 'Entrecôte', rare: 55, medium: 60, wellDone: 70, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Ugnstemperatur 125-175°C. Låt vila 30 min.' },
    { name: 'Flankstek', rare: 56, medium: 58, wellDone: 60, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Skär tunt snett mot fibrerna efter tillagning.' },
    { name: 'Fransyska', rare: null, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: '1-2 dagar före', tips: 'Passar för långkok eller stekning. Kan göras som tjälknöl.' },
    { name: 'Högrev', rare: 55, medium: 60, wellDone: 70, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Utmärkt för långkok och brässering. Kräver tid för mörhet.' },
    { name: 'Innanlår', rare: 55, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Mager styckdel, perfekt för stekning eller sous vide.' },
    { name: 'Märgben', rare: null, medium: null, wellDone: 80, restTime: '-', saltning: 'Vid tillagning', tips: 'Rostas i ugn tills märgen är mjuk.' },
    { name: 'Nötbog', rare: null, medium: 70, wellDone: 80, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Långkok eller brässering rekommenderas.' },
    { name: 'Nötbringa', rare: null, medium: 85, wellDone: 90, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Kräver lång tillagning vid låg temperatur.' },
    { name: 'Nötytterfilé', rare: 55, medium: 60, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mör och mager detalj, stek snabbt.' },
    { name: 'Oxfilé', rare: 53, medium: 58, wellDone: 70, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Premium styckdel. Stek kort tid på hög värme.' },
    { name: 'Oxsvans', rare: null, medium: null, wellDone: 85, restTime: '10 min', saltning: '1-2 dagar före', tips: 'Brässeras i 3-4 timmar för perfekt mörhet.' },
    { name: 'Oxtunga', rare: null, medium: null, wellDone: 85, restTime: '10 min', saltning: '1-2 dagar före', tips: 'Koka länge tills mör. Skala efter kokning.' },
    { name: 'Rostbiff', rare: 55, medium: 60, wellDone: 70, restTime: '20-30 min', saltning: '1-2 dagar före', tips: 'Ugnstemperatur 125°C för perfekt resultat.' },
    { name: 'Ryggbiff', rare: 55, medium: 60, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Klassisk grilldetalj. Stek på hög värme.' },
    { name: 'Tjockt kött', rare: 55, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Mör styckdel, passar för stekning.' },
    { name: 'Ytterlår', rare: 55, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Passar för stekning eller långkok.' },
  ],
  'Kalv': [
    { name: 'Kalventrecôte', rare: 55, medium: 60, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mild smak, passar med delikata såser.' },
    { name: 'Kalvfilé', rare: 55, medium: 60, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mycket mör, stek varsamt.' },
    { name: 'Kalvfransyska', rare: null, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: '1-2 dagar före', tips: 'Passar för brässering.' },
    { name: 'Kalvkotlett', rare: 55, medium: 60, wellDone: 70, restTime: '5 min', saltning: 'Minst 1 timme före', tips: 'Stek på medelvärme för saftig kotlett.' },
    { name: 'Kalvlever', rare: null, medium: 58, wellDone: 65, restTime: '2-3 min', saltning: 'Vid tillagning', tips: 'Ska vara rosa inuti. Blir seg om den översteks.' },
    { name: 'Kalvnjure', rare: null, medium: null, wellDone: 70, restTime: '3 min', saltning: 'Vid tillagning', tips: 'Blötlägg före tillagning för mildare smak.' },
    { name: 'Kalvbräss', rare: null, medium: null, wellDone: 72, restTime: '3-5 min', saltning: 'Vid tillagning', tips: 'Delikatess. Blanchera först, stek sedan i smör.' },
  ],
  'Lamm': [
    { name: 'Lammfilé', rare: 55, medium: 60, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mör detalj med fin smak. Stek snabbt.' },
    { name: 'Lammkotlett', rare: 55, medium: 60, wellDone: 70, restTime: '5 min', saltning: 'Minst 1 timme före', tips: 'Grilla eller stek på hög värme.' },
    { name: 'Lammlever', rare: null, medium: 58, wellDone: 65, restTime: '2-3 min', saltning: 'Vid tillagning', tips: 'Mildare än nötlever. Stek kort tid.' },
    { name: 'Lammsadel', rare: 55, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Elegant styckdel för festmåltider.' },
    { name: 'Lammstek', rare: 55, medium: 62, wellDone: 70, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Vila minst 15 min före skärning.' },
    { name: 'Lammbog', rare: null, medium: null, wellDone: 80, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Perfekt för långkok och brässering.' },
    { name: 'Lammlägg', rare: null, medium: null, wellDone: 85, restTime: '10 min', saltning: '1-2 dagar före', tips: 'Brässera i 2-3 timmar för mör konsistens.' },
    { name: 'Lammrack', rare: 55, medium: 60, wellDone: 70, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Bryn först, avsluta i ugn.' },
    { name: 'Lammhjärta', rare: null, medium: 60, wellDone: 68, restTime: '3 min', saltning: 'Vid tillagning', tips: 'Stek snabbt på hög värme.' },
    { name: 'Lammnjure', rare: null, medium: null, wellDone: 70, restTime: '3 min', saltning: 'Vid tillagning', tips: 'Blötlägg före tillagning.' },
  ],
  'Fläsk': [
    { name: 'Bacon', rare: null, medium: null, wellDone: 70, restTime: '-', saltning: 'Redan saltat', tips: 'Stek tills önskad krispighet.' },
    { name: 'Fläskfilé', rare: null, medium: 63, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Säker vid 63°C. Vila 5 min.' },
    { name: 'Fläskkotlett', rare: null, medium: 63, wellDone: 70, restTime: '5 min', saltning: 'Minst 1 timme före', tips: 'Stek på medelvärme för saftigt resultat.' },
    { name: 'Fläskkarré', rare: null, medium: 63, wellDone: 70, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Perfekt för ugnsstekning.' },
    { name: 'Fläskbog', rare: null, medium: null, wellDone: 85, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Perfekt för pulled pork. Långsam tillagning.' },
    { name: 'Fläsklägg', rare: null, medium: null, wellDone: 80, restTime: '10 min', saltning: '1-2 dagar före', tips: 'Kokas eller brässeras.' },
    { name: 'Pancetta', rare: null, medium: null, wellDone: 70, restTime: '-', saltning: 'Redan saltat', tips: 'Italienskt bacon. Steks krispigt.' },
    { name: 'Guanciale', rare: null, medium: null, wellDone: 70, restTime: '-', saltning: 'Redan saltat', tips: 'Grisskinn. Bas för carbonara och amatriciana.' },
    { name: 'Revbensspjäll', rare: null, medium: null, wellDone: 90, restTime: '10 min', saltning: 'Dagen före', tips: 'Låg och långsam tillagning för mörhet.' },
    { name: 'Sidfläsk', rare: null, medium: null, wellDone: 75, restTime: '-', saltning: 'Minst 1 timme före', tips: 'Stek tills sprött på utsidan.' },
    { name: 'Skinkstek', rare: null, medium: 65, wellDone: 72, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Ugnstemperatur 125°C. Vila minst 15 min.' },
    { name: 'Fläskkind', rare: null, medium: null, wellDone: 85, restTime: '10 min', saltning: '1-2 dagar före', tips: 'Brässeras i flera timmar för silkeslen konsistens.' },
  ],
  'Fågel': [
    { name: 'Ankbröst', rare: 54, medium: 58, wellDone: 65, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Starta i kall panna för krispigt skinn.' },
    { name: 'Ankbröst med skinn', rare: 54, medium: 58, wellDone: 65, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Rista skinnet. Börja i kall panna.' },
    { name: 'Anklår', rare: null, medium: null, wellDone: 80, restTime: '10 min', saltning: '1-2 dagar före', tips: 'Konfiteras eller brässeras för bäst resultat.' },
    { name: 'Anklever', rare: null, medium: 55, wellDone: 62, restTime: '2-3 min', saltning: 'Vid tillagning', tips: 'Stek snabbt på hög värme. Ska vara rosa.' },
    { name: 'Gåsbröst', rare: 54, medium: 58, wellDone: 65, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Behandlas som anka. Låt vila.' },
    { name: 'Kalkonbröst', rare: null, medium: null, wellDone: 70, restTime: '10-15 min', saltning: '2-3 dagar före', tips: 'Blir lätt torrt, använd stektermometer.' },
    { name: 'Kalkonfilé', rare: null, medium: null, wellDone: 70, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mager detalj. Undvik överstek.' },
    { name: 'Kalkonlårfilé', rare: null, medium: null, wellDone: 80, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Tål högre temperatur än bröst.' },
    { name: 'Kycklingbröst', rare: null, medium: null, wellDone: 70, restTime: '5 min', saltning: 'Minst 1 timme före', tips: 'Saftigast vid exakt 70°C.' },
    { name: 'Kycklingbröst med skinn', rare: null, medium: null, wellDone: 70, restTime: '5 min', saltning: 'Dagen före', tips: 'Börja med skinnsidan ner för krispigt skinn.' },
    { name: 'Kycklinglever', rare: null, medium: 55, wellDone: 65, restTime: '2-3 min', saltning: 'Vid tillagning', tips: 'Ska vara rosa inuti. Bas för parfait.' },
    { name: 'Kycklinglår', rare: null, medium: null, wellDone: 80, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mer förlåtande än bröst.' },
    { name: 'Kycklingklubba', rare: null, medium: null, wellDone: 80, restTime: '5 min', saltning: 'Dagen före', tips: 'Tål högre temperatur. Saftig vid 80°C.' },
    { name: 'Kycklingvingar', rare: null, medium: null, wellDone: 80, restTime: '-', saltning: 'Minst 1 timme före', tips: 'Grillas eller friteras.' },
    { name: 'Hel kyckling', rare: null, medium: null, wellDone: 74, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Mät i låret. Vila 10 min.' },
    { name: 'Majskyckling', rare: null, medium: null, wellDone: 74, restTime: '10 min', saltning: 'Dagen före', tips: 'Som vanlig kyckling men saftigare.' },
  ],
  'Vilt': [
    { name: 'Älgfilé', rare: 55, medium: 60, wellDone: 70, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Mycket mager. Serveras rosa. Vila väl.' },
    { name: 'Älgstek', rare: 55, medium: 60, wellDone: 70, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Magert, passar för stekning och sous vide.' },
    { name: 'Rådjursfilé', rare: 55, medium: 58, wellDone: 65, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Mycket mört, serveras gärna rosa.' },
    { name: 'Rådjurssadel', rare: 55, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: 'Dagen före', tips: 'Elegant styckdel. Vila 10 min.' },
    { name: 'Hjortfilé', rare: 55, medium: 60, wellDone: 70, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Magert kött, stek inte för länge.' },
    { name: 'Hjortfärs', rare: null, medium: null, wellDone: 70, restTime: '-', saltning: 'Vid tillagning', tips: 'Blanda med fläskfett för saftighet.' },
    { name: 'Vildsvinsstek', rare: null, medium: 68, wellDone: 75, restTime: '15-20 min', saltning: '1-2 dagar före', tips: 'Ska vara genomstekt av säkerhetsskäl.' },
    { name: 'Renfilé', rare: 55, medium: 58, wellDone: 65, restTime: '5-8 min', saltning: 'Dagen före', tips: 'Delikat smak. Serveras rosa.' },
    { name: 'Renstek', rare: 55, medium: 60, wellDone: 70, restTime: '10-15 min', saltning: '1-2 dagar före', tips: 'Vila minst 10 min före skärning.' },
    { name: 'Hare', rare: 55, medium: 60, wellDone: 70, restTime: '8-10 min', saltning: 'Dagen före', tips: 'Magert, behöver fetttillskott vid tillagning.' },
    { name: 'Fasanbröst', rare: 54, medium: 58, wellDone: 65, restTime: '5 min', saltning: 'Dagen före', tips: 'Mager fågel. Undvik överstekt.' },
    { name: 'Rapphöna', rare: 54, medium: 58, wellDone: 65, restTime: '5 min', saltning: 'Dagen före', tips: 'Liten viltfågel. Stek snabbt.' },
    { name: 'Vaktel', rare: null, medium: 60, wellDone: 68, restTime: '3-5 min', saltning: 'Minst 1 timme före', tips: 'Liten fågel. Grillas eller steks hel.' },
    { name: 'Duva', rare: 54, medium: 58, wellDone: 65, restTime: '5 min', saltning: 'Dagen före', tips: 'Serveras rosa. Rik smak.' },
  ],
  'Fisk': [
    { name: 'Laxfilé', rare: 45, medium: 52, wellDone: 60, restTime: '2-3 min', saltning: '15 min före', tips: 'Glasig vid 45°C, genomstekt vid 60°C.' },
    { name: 'Öring', rare: 45, medium: 52, wellDone: 58, restTime: '2-3 min', saltning: '15 min före', tips: 'Liknande lax. Fin smak.' },
    { name: 'Röding', rare: 45, medium: 52, wellDone: 58, restTime: '2-3 min', saltning: '15 min före', tips: 'Fin smak, tillagas som lax.' },
    { name: 'Sik', rare: 45, medium: 50, wellDone: 55, restTime: '2 min', saltning: '15 min före', tips: 'Klassisk svensk fisk. Mild smak.' },
    { name: 'Abborre', rare: null, medium: 48, wellDone: 54, restTime: '2 min', saltning: '15 min före', tips: 'Fast, vitt kött. Tillagas försiktigt.' },
    { name: 'Gädda', rare: null, medium: 50, wellDone: 55, restTime: '2-3 min', saltning: '15 min före', tips: 'Fast kött med många ben.' },
    { name: 'Torsk', rare: null, medium: 50, wellDone: 55, restTime: '2-3 min', saltning: '15 min före', tips: 'Klassiker. Ska flagna lätt.' },
    { name: 'Kolja', rare: null, medium: 50, wellDone: 55, restTime: '2 min', saltning: '15 min före', tips: 'Mild smak, tillagas försiktigt.' },
    { name: 'Sej', rare: null, medium: 50, wellDone: 55, restTime: '2-3 min', saltning: '15 min före', tips: 'Fast kött, passar för grillning.' },
    { name: 'Kummel', rare: null, medium: 50, wellDone: 55, restTime: '2-3 min', saltning: '15 min före', tips: 'Fast, vitt kött.' },
    { name: 'Hälleflundra', rare: null, medium: 52, wellDone: 58, restTime: '3 min', saltning: '15 min före', tips: 'Fast kött, tål lite högre temp.' },
    { name: 'Piggvar', rare: null, medium: 52, wellDone: 58, restTime: '3 min', saltning: '15 min före', tips: 'Exklusiv plattfisk med fast kött.' },
    { name: 'Tonfisk', rare: 40, medium: 50, wellDone: 60, restTime: '2-3 min', saltning: '30 min före', tips: 'Serveras ofta rå eller rosa i mitten.' },
  ],
  'Skaldjur': [
    { name: 'Hummer', rare: null, medium: null, wellDone: 63, restTime: '2-3 min', saltning: 'Vid tillagning', tips: 'Köttet ska vara ogenomskinligt.' },
    { name: 'Krabba', rare: null, medium: null, wellDone: 63, restTime: '-', saltning: 'I kokvattnet', tips: 'Koka i saltat vatten.' },
    { name: 'Kräftor', rare: null, medium: null, wellDone: 63, restTime: '-', saltning: 'I kokvattnet', tips: 'Koka i kryddad lag.' },
    { name: 'Musslor', rare: null, medium: null, wellDone: 65, restTime: '-', saltning: 'Vid tillagning', tips: 'Kassera oöppnade efter kokning.' },
    { name: 'Pilgrimsmusslor', rare: null, medium: 52, wellDone: 58, restTime: '1-2 min', saltning: 'Vid tillagning', tips: 'Snabbstek på hög värme.' },
    { name: 'Räkor', rare: null, medium: null, wellDone: 63, restTime: '-', saltning: 'I kokvattnet', tips: 'Rosa och fast när de är klara.' },
    { name: 'Bläckfisk', rare: null, medium: null, wellDone: 60, restTime: '2 min', saltning: 'Vid tillagning', tips: 'Snabbstek eller långkok - inget däremellan.' },
  ],
  'Grönsaker': [
    { name: 'Sparris, grön (tunn)', blanchering: true, time: '1-2 min', tips: 'Böj sparrisen - den knäcks där träigheten börjar' },
    { name: 'Sparris, grön (tjock)', blanchering: true, time: '2-3 min', tips: 'Skala nedre delen för jämnare tillagning' },
    { name: 'Haricots verts', blanchering: true, time: '2-3 min', tips: 'Ska vara krispiga men inte råa' },
    { name: 'Sockerärter', blanchering: true, time: '1-2 min', tips: 'Behåll knaprigheten' },
    { name: 'Ärter (färska)', blanchering: true, time: '2-3 min', tips: 'Smaka! Färska ärter varierar mycket' },
    { name: 'Broccoli (buketter)', blanchering: true, time: '2-3 min', tips: 'Skär i jämna bitar för jämn tillagning' },
    { name: 'Broccolini', blanchering: true, time: '2-3 min', tips: 'Stjälkarna tar lite längre än topparna' },
    { name: 'Grönkål (blad)', blanchering: true, time: '3-4 min', tips: 'Ta bort grova stjälkar först' },
    { name: 'Spenat', blanchering: true, time: '30 sek', tips: 'Extremt kort tid! Direkt i isbad' },
    { name: 'Mangold', blanchering: true, time: '2-3 min', tips: 'Stjälkar och blad kan blancheras separat' },
    { name: 'Salladsböna', blanchering: true, time: '3-4 min', tips: 'Klassisk svensk grönsak' },
    { name: 'Bondbönor (skalade)', blanchering: true, time: '1-2 min', tips: 'Skala av det yttre vita skinnet efteråt' },
  ],
};

// Äggguide-data (baserat på The Food Lab)
const eggGuideData = {
  boiling: {
    title: 'Koktider för ägg',
    description: 'Tiden räknas från att ägget läggs i kokande vatten. För ägg direkt från kylen, lägg till 1 minut.',
    times: [
      { name: 'Löskokt', time: '6 min', description: 'Rinnande gula, fast vita', temp: '62°C i gulan' },
      { name: 'Smörgåsägg', time: '7 min', description: 'Krämig gula, perfekt på macka', temp: '65°C i gulan' },
      { name: 'Mjukkokt', time: '8 min', description: 'Något fast men krämig gula', temp: '68°C i gulan' },
      { name: 'Medium', time: '9 min', description: 'Nästan fast gula, lite krämig mitt', temp: '70°C i gulan' },
      { name: 'Hårdkokt', time: '11 min', description: 'Helt fast gula utan grön ring', temp: '77°C i gulan' },
      { name: 'Överkokt', time: '14+ min', description: 'Grön ring runt gulan (undvik!)', temp: '90°C+' },
    ],
    tips: [
      'Lägg äggen i isvatten direkt efter kokning för att stoppa tillagningen',
      'Äldre ägg (7-10 dagar) är lättare att skala',
      'Starta med kokande vatten för jämnare resultat',
      'Den gröna ringen beror på järn + svavel vid för hög temp'
    ]
  },
  poaching: {
    title: 'Pocherade ägg',
    description: 'Perfekta pocherade ägg kräver rätt temperatur och teknik.',
    steps: [
      'Använd färska ägg (vita håller ihop bättre)',
      'Vatten 80-85°C (sjudande, INTE kokande)',
      'Tillsätt 1 msk vit vinäger per liter vatten',
      'Virvla vattnet, släpp ägget mitt i virveln',
      'Koka 3-4 minuter för rinnande gula'
    ],
    tips: [
      'Knäck ägget i en liten skål först',
      'Sila av tunna vita i ett finmaskigt såll',
      'Pocherade ägg kan förberedas och förvaras i kallt vatten'
    ]
  },
  scrambled: {
    title: 'Äggröra - två stilar',
    styles: [
      {
        name: 'Fluffig amerikansk stil',
        method: 'Hög värme, rör sällan, stora bitar',
        tips: ['Rör bara när äggen börjar stelna', 'Ta av värmen medan de fortfarande är lite lösa']
      },
      {
        name: 'Krämig fransk stil',
        method: 'Låg värme, rör konstant, små bitar',
        tips: ['Använd smör och/eller grädde', 'Rör konstant i 10-15 minuter', 'Ska vara som krämig gröt']
      }
    ]
  },
  frying: {
    title: 'Stekt ägg',
    description: 'Perfekta stekta ägg med krispiga kanter och rinnande gula.',
    steps: [
      'Hetta upp smör eller olja på medel-hög värme',
      'Knäck ägget direkt i pannan',
      'Sänk värmen till medel-låg',
      'Stek i 3-4 minuter för rinnande gula'
    ],
    tips: [
      'För extra krispiga kanter: högre värme och mer fett',
      'Täck pannan med lock för snabbare tillagning av ovansidan',
      'Söt äggen med en skvätt vatten under locket för ångeffekt'
    ]
  },
  science: {
    title: 'Vetenskapen bakom ägg',
    facts: [
      { label: 'Vitan börjar stelna', value: '62°C' },
      { label: 'Vitan helt fast', value: '80°C' },
      { label: 'Gulan börjar stelna', value: '65°C' },
      { label: 'Gulan helt fast', value: '70°C' },
      { label: 'Grön ring bildas', value: '90°C+' },
    ],
    explanation: 'Äggvita och äggula stelnar vid olika temperaturer. Konsten är att hitta balansen där vitan är fast men gulan fortfarande krämig. Den gröna ringen på hårdkokta ägg beror på att järn i gulan reagerar med svavel i vitan vid för hög temperatur.'
  }
};

// Blancheringsguide (baserat på The French Laundry)
const blancheringData = {
  intro: {
    title: 'Big-Pot Blanching',
    description: 'Tekniken för perfekt gröna grönsaker från The French Laundry.',
    principle: 'Ju snabbare en grönsak kokas, desto grönare blir den. Värme frigör gas mellan skal och pigment, men snart börjar enzymer och syror döda den gröna färgen. Målet är att fullständigt koka grönsaken innan du förlorar färgen.'
  },
  keys: [
    {
      title: 'Mycket vatten',
      description: 'Använd en stor mängd vatten i förhållande till grönsakerna. Vattnet ska inte tappa koket när du lägger i kalla grönsaker.'
    },
    {
      title: 'Mycket salt',
      description: '"Vattnet ska smaka som havet" - ca 1 dl salt per liter vatten. Saltet förhindrar att färg läcker ut och kryddar grönsaken jämnt.'
    },
    {
      title: 'Isbad direkt',
      description: 'Stoppa tillagningen genom att sänka ner grönsakerna i isvatten. Låt dem kylas helt, sen torka av.'
    }
  ],
  vegetables: [
    { name: 'Sparris, grön (tunn)', time: '1-2 min', tips: 'Böj sparrisen - den knäcks där träigheten börjar' },
    { name: 'Sparris, grön (tjock)', time: '2-3 min', tips: 'Skala nedre delen för jämnare tillagning' },
    { name: 'Haricots verts', time: '2-3 min', tips: 'Ska vara krispiga men inte råa' },
    { name: 'Sockerärter', time: '1-2 min', tips: 'Behåll knaprigheten' },
    { name: 'Ärter (färska)', time: '2-3 min', tips: 'Smaka! Färska ärter varierar mycket' },
    { name: 'Broccoli (buketter)', time: '2-3 min', tips: 'Skär i jämna bitar för jämn tillagning' },
    { name: 'Broccolini', time: '2-3 min', tips: 'Stjälkarna tar lite längre än topparna' },
    { name: 'Grönkål (blad)', time: '3-4 min', tips: 'Ta bort grova stjälkar först' },
    { name: 'Spenat', time: '30 sek', tips: 'Extremt kort tid! Direkt i isbad' },
    { name: 'Mangold', time: '2-3 min', tips: 'Stjälkar och blad kan blancheras separat' },
    { name: 'Salladsböna', time: '3-4 min', tips: 'Klassisk svensk grönsak' },
    { name: 'Bondbönor (skalade)', time: '1-2 min', tips: 'Skala av det yttre vita skinnet efteråt' },
  ],
  science: {
    title: 'Vetenskapen',
    facts: [
      { label: 'Enzymer förstörs vid', value: '100°C' },
      { label: 'Gas frigörs vid', value: '60-80°C' },
      { label: 'Klorofyll börjar brytas ner', value: 'pH < 6' },
    ],
    explanation: 'Råa gröna grönsaker ser matta ut eftersom ett lager gas bildas mellan skalet och pigmentet. Värme frigör denna gas och pigmentet strömmar till ytan - grönsaken blir lysande grön. Men detta sker snabbt, och snart frigörs syror och enzymer som dödar den gröna färgen. Därför är hastighet nyckeln.'
  }
};

// Brässeringsguide (baserat på The French Laundry)
const brasseringData = {
  intro: {
    title: 'Konsten att brässera',
    description: 'Att göra sega styckdelar till något extraordinärt.',
    principle: 'Jag älskar rätter som är saftiga och har karaktär, komplexitet och djup tack vare en lång tillagningsprocess. Det är tekniken som är tillfredsställande. En oxfilé är en oxfilé - det är liten skillnad mellan rått och tillagat. Men brässerade högrev eller bog blir något helt annat efter tillagningen. De transcenderar sig själva.'
  },
  steps: [
    {
      title: '1. Marinera',
      description: 'Häll 1 flaska vin (rödvin till nöt/lamm, vitt till fläsk) i en kastrull och koka tills alkoholen dunstat av. Lägg till grovt skurna aromater: morot, lök, selleri, vitlök, timjan, lagerblad. Låt svalna helt och häll över köttet. Marinera i kylskåp 12-24 timmar.',
      tips: 'Marinaden ska täcka köttet. Vänd det halvvägs.'
    },
    {
      title: '2. Separera & klarna',
      description: 'Sila marinaden från köttet och grönsakerna. Koka upp marinaden - proteiner koagulerar och bildar en "flotte" som klarnar vätskan. Skumma bort.',
      tips: 'Renast möjliga smak kommer från klarnad vätska.'
    },
    {
      title: '3. Bryn grönsakerna',
      description: 'Fräs de aromatiska grönsakerna tills de fått färg - detta utvecklar karamelliserade sockerarter.',
      tips: 'Bryn ordentligt men bränn inte.'
    },
    {
      title: '4. Mjöla & bryn köttet',
      description: 'Pudra köttet med mjöl och bryn på alla sidor. Denna arom av brynande kött har ett djup som inget annat.',
      tips: 'Torka köttet först. Bryn i omgångar om du har mycket.'
    },
    {
      title: '5. Brässera',
      description: 'Lägg ihop kött, brynta grönsaker och klarnad marinad. Tillsätt fond så vätskan täcker halvvägs. In i ugn på 150°C i 4-6 timmar.',
      tips: 'Vänd köttet halvvägs genom tillagningen.'
    },
    {
      title: '6. Vila & reducera',
      description: 'Lyft försiktigt upp köttet (det faller nästan isär). Sila vätskan, skumma bort fett, och reducera till sås.',
      tips: 'Sila flera gånger för renast sås.'
    }
  ],
  cuts: [
    { name: 'Högrev', time: '4-5 timmar', temp: '150°C', tips: 'Klassiker för brässering. Rik på gelatin.' },
    { name: 'Nötbringa', time: '5-6 timmar', temp: '150°C', tips: 'Behöver lång tid. Fantastiskt resultat.' },
    { name: 'Oxsvans', time: '3-4 timmar', temp: '150°C', tips: 'Extremt gelatinrik. Självbastande.' },
    { name: 'Bog (nöt/lamm)', time: '3-4 timmar', temp: '150°C', tips: 'Passar både hel och i bitar.' },
    { name: 'Fläskbog', time: '4-5 timmar', temp: '130°C', tips: 'Lägre temp för pulled pork.' },
    { name: 'Lammlägg', time: '2-3 timmar', temp: '150°C', tips: 'Fantastisk med rotfrukter.' },
    { name: 'Fläskkind', time: '4-5 timmar', temp: '140°C', tips: 'Blir silkeslen och saftig.' },
  ],
  science: {
    title: 'Vetenskapen',
    facts: [
      { label: 'Kollagen bryts ner vid', value: '70-80°C' },
      { label: 'Ideell brässeringstemperatur', value: '85-95°C (i vätskan)' },
      { label: 'Kollagen → gelatin tar', value: '2-6 timmar' },
    ],
    explanation: 'Sega styckdelar innehåller mycket bindväv (kollagen). Vid långsam uppvärmning i fuktig miljö omvandlas kollagenet till gelatin - det är detta som gör brässerad mat så saftig och mör. Fett smälter och genomsyrar köttet. Processen kan inte påskyndas - den kräver tid.'
  }
};

// Grundrecept data
const basicRecipesData = {
  'Modersåser': [
    {
      id: 'bechamel',
      name: 'Béchamelsås',
      basePortions: 4,
      portionUnit: 'portioner',
      time: '15 min',
      structuredIngredients: [
        { name: 'Smör', amount: 45, unit: 'g', foodDbName: 'Smör osaltat' },
        { name: 'Vetemjöl', amount: 27, unit: 'g', foodDbName: 'Vetemjöl' },
        { name: 'Mjölk', amount: 500, unit: 'ml', foodDbName: 'Helmjölk' },
        { name: 'Salt', amount: 2.5, unit: 'g', foodDbName: null },
        { name: 'Vitpeppar', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Muskotnöt', amount: null, unit: null, foodDbName: null, note: 'ev. riven', optional: true },
      ],
      steps: [
        'Smält smöret i en kastrull på medelvärme.',
        'Tillsätt mjölet och rör till en slät redning. Låt fräsa 1-2 minuter utan att ta färg.',
        'Tillsätt mjölken lite i taget under ständig omrörning för att undvika klumpar.',
        'Koka upp och låt sjuda på låg värme i 5-10 minuter tills såsen tjocknat.',
        'Smaka av med salt, peppar och eventuellt muskotnöt.'
      ],
      description: 'Klassisk vit sås. Bas för ostsås, stuvningar och gratänger.'
    },
    {
      id: 'veloute',
      name: 'Veloutésås',
      basePortions: 4,
      portionUnit: 'portioner',
      time: '20 min',
      structuredIngredients: [
        { name: 'Smör', amount: 45, unit: 'g', foodDbName: 'Smör osaltat' },
        { name: 'Vetemjöl', amount: 27, unit: 'g', foodDbName: 'Vetemjöl' },
        { name: 'Ljus fond', amount: 500, unit: 'ml', foodDbName: 'Kycklingbuljong', note: 'kyckling, kalv eller fisk' },
        { name: 'Salt', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Vitpeppar', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
      ],
      steps: [
        'Smält smöret i en kastrull på medelvärme.',
        'Tillsätt mjölet och rör till en ljus redning. Låt fräsa 1-2 minuter.',
        'Tillsätt fonden lite i taget under omrörning.',
        'Koka upp och låt sjuda 10-15 minuter. Sila vid behov.',
        'Smaka av med salt och peppar.'
      ],
      description: 'Sammetssås baserad på ljus fond. Bas för vin- och svampsåser.'
    },
    {
      id: 'espagnole',
      name: 'Espagnole / Demi-glace',
      basePortions: 6,
      portionUnit: 'portioner',
      time: '2-3 timmar',
      structuredIngredients: [
        { name: 'Smör', amount: 30, unit: 'g', foodDbName: 'Smör osaltat' },
        { name: 'Vetemjöl', amount: 18, unit: 'g', foodDbName: 'Vetemjöl' },
        { name: 'Mörk kalvfond', amount: 1000, unit: 'ml', foodDbName: 'Kalvfond' },
        { name: 'Morot', amount: 100, unit: 'g', foodDbName: 'Morot rå', note: 'tärnad' },
        { name: 'Lök', amount: 100, unit: 'g', foodDbName: 'Gul lök', note: 'tärnad' },
        { name: 'Selleri', amount: 80, unit: 'g', foodDbName: 'Blekselleri', note: '2 stjälkar, tärnade' },
        { name: 'Tomatpuré', amount: 30, unit: 'g', foodDbName: 'Tomatpuré' },
        { name: 'Bukett garni', amount: null, unit: null, foodDbName: null, note: 'timjan, lagerblad, persilja' },
      ],
      steps: [
        'Smält smöret och fräs grönsakerna tills de fått färg.',
        'Tillsätt mjölet och rör tills det blir en mörk redning (roux brun).',
        'Tillsätt tomatpuré och hälften av fonden. Rör om och koka upp.',
        'Lägg i bukett garni och låt sjuda i 1 timme.',
        'Tillsätt resterande fond och sjud ytterligare 1 timme.',
        'Sila såsen och reducera till önskad konsistens.',
        'För demi-glace: reducera till hälften.'
      ],
      description: 'Rik, mörk sås. Bas för rödvinssås, pepparsås och jägarsås.'
    },
    {
      id: 'hollandaise',
      name: 'Hollandaisesås',
      basePortions: 4,
      portionUnit: 'portioner',
      time: '15 min',
      structuredIngredients: [
        { name: 'Äggulor', amount: 3, unit: 'st', foodDbName: 'Äggula' },
        { name: 'Smör', amount: 200, unit: 'g', foodDbName: 'Smör osaltat', note: 'klarnat' },
        { name: 'Citronjuice', amount: 15, unit: 'ml', foodDbName: 'Citronjuice' },
        { name: 'Vatten', amount: 15, unit: 'ml', foodDbName: null },
        { name: 'Salt', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Vitpeppar', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Cayennepeppar', amount: null, unit: null, foodDbName: null, note: 'ev.', optional: true },
      ],
      steps: [
        'Klarna smöret genom att smälta det och skumma av det vita.',
        'Vispa äggulor och vatten i en skål över vattenbad (ej kokande).',
        'Vispa tills smeten är luftig och tjocknar (ca 3-4 min).',
        'Ta av från värmen och droppa i det klarnade smöret under ständig vispning.',
        'Smaka av med citronjuice, salt och peppar.',
        'Servera direkt eller håll varm i vattenbad.'
      ],
      description: 'Smörsås med äggula. Bas för bearnaise och choron.'
    },
    {
      id: 'tomato',
      name: 'Tomatsås',
      basePortions: 4,
      portionUnit: 'portioner',
      time: '30 min',
      structuredIngredients: [
        { name: 'Olivolja', amount: 30, unit: 'ml', foodDbName: 'Olivolja' },
        { name: 'Lök', amount: 100, unit: 'g', foodDbName: 'Gul lök', note: 'finhackad' },
        { name: 'Vitlök', amount: 10, unit: 'g', foodDbName: 'Vitlök', note: '2 klyftor, finhackade' },
        { name: 'Krossade tomater', amount: 400, unit: 'g', foodDbName: 'Tomater krossade konserv' },
        { name: 'Tomatpuré', amount: 30, unit: 'g', foodDbName: 'Tomatpuré' },
        { name: 'Socker', amount: 4, unit: 'g', foodDbName: 'Strösocker' },
        { name: 'Salt', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Svartpeppar', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Färsk basilika', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
      ],
      steps: [
        'Hetta upp oljan i en kastrull.',
        'Fräs löken mjuk utan att den tar färg, ca 5 minuter.',
        'Tillsätt vitlöken och fräs ytterligare 1 minut.',
        'Tillsätt krossade tomater, tomatpuré och socker.',
        'Låt sjuda på låg värme i 20-25 minuter tills såsen tjocknat.',
        'Smaka av med salt och peppar.',
        'Rör ner färsk basilika precis innan servering.'
      ],
      description: 'Klassisk tomatsås. Bas för pasta, pizza, arrabiata och puttanesca.'
    },
  ],
  'Buljonger & Fonder': [
    {
      id: 'stockphilosophy',
      name: 'Buljongens filosofi',
      basePortions: null,
      portionUnit: null,
      time: null,
      isPhilosophy: true,
      structuredIngredients: [],
      steps: [],
      description: 'Du kan inte göra en bra sås om du börjar med en dålig buljong. Alltför många tar buljonger för givet.',
      philosophy: {
        principles: [
          'Buljongen är inte en soptunna - använd kvalitetsingredienser',
          'Koka aldrig - våldsam kokning emulgerar fett och föroreningar',
          'Skumma kontinuerligt - ta bort blod, fett och partiklar',
          'Sötma är nyckeln: morot, lök, tomat. Selleri kan ge bitterhet.',
          'Rätt mängd vatten till ben - för mycket späder ut smaken',
          'Gradvis temperaturökning - alltid starta med kallt vatten'
        ],
        quote: '"Ideologin bakom en buljong är viktig. Idén är att genom långsam, varsam värme extrahera smak och gelatin från benen och köttet, samtidigt som du kontinuerligt tar bort föroreningar."',
        source: 'Thomas Keller, The French Laundry'
      }
    },
    {
      id: 'quickchickenstock',
      name: 'Snabb kycklingbuljong',
      basePortions: 1,
      portionUnit: 'liter',
      time: '45 min',
      structuredIngredients: [
        { name: 'Kycklingvingar', amount: 500, unit: 'g', foodDbName: 'Kycklingvingar', note: 'hackade i små bitar' },
        { name: 'Vatten', amount: 1200, unit: 'ml', foodDbName: null, note: 'kallt' },
        { name: 'Morot', amount: 80, unit: 'g', foodDbName: 'Morot rå', note: 'grovt skuren' },
        { name: 'Lök', amount: 80, unit: 'g', foodDbName: 'Gul lök', note: 'halverad' },
        { name: 'Vitlök', amount: 8, unit: 'g', foodDbName: 'Vitlök', note: '2 klyftor' },
        { name: 'Persilja', amount: null, unit: null, foodDbName: null, note: 'några kvistar' },
      ],
      steps: [
        'Hacka kycklingvingarna i små bitar (2-3 cm) för maximal yta.',
        'Lägg vingarna i en kastrull med KALLT vatten.',
        'Värm långsamt upp till nästan kokpunkt.',
        'Skumma bort allt som flyter upp - detta är avgörande för klarhet.',
        'Tillsätt grönsaker (söta ingredienser - undvik selleri som kan ge bitterhet).',
        'Låt SJUDA i 45 minuter - ALDRIG koka!',
        'Sila genom finmaskigt såll. Tryck inte på resterna.',
        'Använd direkt eller kyl snabbt.'
      ],
      description: 'French Laundry-metoden: Vi kokar vingarna bara 45 min för en lätt, ren smak som inte dominerar. Hemligheten är att aldrig koka - bara sjuda - och att skumma noggrant.'
    },
    {
      id: 'vegetablestock',
      name: 'Grönsaksbuljong',
      basePortions: 1.5,
      portionUnit: 'liter',
      time: '45 min',
      structuredIngredients: [
        { name: 'Morötter', amount: 200, unit: 'g', foodDbName: 'Morot rå', note: 'mixade eller finhackade' },
        { name: 'Lök', amount: 200, unit: 'g', foodDbName: 'Gul lök', note: 'mixad eller finhackad' },
        { name: 'Purjolök', amount: 100, unit: 'g', foodDbName: 'Purjolök', note: 'skuren' },
        { name: 'Fänkål', amount: 80, unit: 'g', foodDbName: 'Fänkål', note: 'valfritt, ger sötma', optional: true },
        { name: 'Champinjoner', amount: 100, unit: 'g', foodDbName: 'Champinjoner' },
        { name: 'Vitlök', amount: 15, unit: 'g', foodDbName: 'Vitlök', note: '4 klyftor' },
        { name: 'Tomat', amount: 150, unit: 'g', foodDbName: 'Tomat', note: '2 st' },
        { name: 'Persilja', amount: null, unit: null, foodDbName: null, note: 'kvistar' },
        { name: 'Vatten', amount: 2000, unit: 'ml', foodDbName: null },
      ],
      steps: [
        'MIXA eller finhacka grönsakerna - större yta = snabbare extraktion.',
        'Lägg alla ingredienser i en stor gryta med KALLT vatten.',
        'Värm långsamt och låt SJUDA (aldrig koka) i MAX 45 min.',
        'VIKTIGT: Efter 45 min börjar grönsakerna absorbera vätska istället för att ge ifrån sig smak.',
        'Sila snabbt - tryck INTE på resterna.',
        'Kyl snabbt för bästa färg och fräschör.'
      ],
      description: 'French Laundry-metoden: Mixa grönsakerna för snabb extraktion. Koka MAX 45 min - efter det börjar de suga upp buljong och minska utbytet. Undvik selleri (bitterhet), kål, broccoli och betor (dominerar).'
    },
    {
      id: 'beefstock',
      name: 'Mörk kalvfond (French Laundry)',
      basePortions: 2,
      portionUnit: 'liter',
      time: '8-10 timmar',
      structuredIngredients: [
        { name: 'Kalvben', amount: 2000, unit: 'g', foodDbName: 'Märgben', note: 'hackade av slaktaren' },
        { name: 'Kalvfötter', amount: 500, unit: 'g', foodDbName: null, note: 'för extra gelatin', optional: true },
        { name: 'Morötter', amount: 250, unit: 'g', foodDbName: 'Morot rå', note: 'söta, grovt skurna' },
        { name: 'Lökar', amount: 250, unit: 'g', foodDbName: 'Gul lök', note: '2 st, halverade' },
        { name: 'Tomat', amount: 200, unit: 'g', foodDbName: 'Tomat', note: '2 st, halverade' },
        { name: 'Vitlök', amount: 16, unit: 'g', foodDbName: 'Vitlök', note: '4 klyftor' },
        { name: 'Vatten', amount: 5000, unit: 'ml', foodDbName: null, note: 'kallt' },
        { name: 'Bukett garni', amount: null, unit: null, foodDbName: null, note: 'timjan, lagerblad, persilja' },
      ],
      steps: [
        'TVÄTTA benen under rinnande vatten.',
        'BLANCHERA: Lägg benen i kallt vatten, koka upp. Häll av och skölj benen - detta tar bort blod och föroreningar.',
        'Lägg de rena benen i en stor gryta med KALLT vatten.',
        'Värm LÅNGSAMT - det ska ta 1-2 timmar att nå nästan kokpunkt.',
        'SKUMMA kontinuerligt - ta bort allt som flyter upp.',
        'Tillsätt grönsaker (söta: morot, lök, tomat, vitlök - INGEN selleri).',
        'Låt SJUDA i 6-8 timmar. Placera grytan halvvägs av lågorna för naturlig konvektion.',
        'Sila genom finmaskigt såll. PRESSA INTE - det gör fonden grumlig.',
        'REDUCERA långsamt med grytan halvt av lågorna. Skumma under reduceringen.',
        'REMOUILLAGE (valfritt): Gör en andra, svagare fond på samma ben med nytt vatten.'
      ],
      description: 'Thomas Kellers metod från The French Laundry. Tre nyckelprinciper: 1) Blanchera benen först, 2) Aldrig koka - bara sjuda, 3) Skumma kontinuerligt. Kalvfötter ger extra gelatin. Undvik selleri - det ger bitterhet. Resultatet är en kristallklar, gelatinös fond.'
    },
  ],
  'Marinader': [
    {
      id: 'basicmarinade',
      name: 'Klassisk örtolja',
      basePortions: 500,
      portionUnit: 'g kött',
      time: '5 min + 2-24 tim',
      structuredIngredients: [
        { name: 'Olivolja', amount: 100, unit: 'ml', foodDbName: 'Olivolja' },
        { name: 'Vitlök', amount: 12, unit: 'g', foodDbName: 'Vitlök', note: '3 klyftor, pressade' },
        { name: 'Rosmarin', amount: 10, unit: 'g', foodDbName: 'Rosmarin färsk', note: 'färsk, hackad' },
        { name: 'Timjan', amount: 5, unit: 'g', foodDbName: 'Timjan färsk', note: 'färsk' },
        { name: 'Svartpeppar', amount: 2, unit: 'g', foodDbName: 'Svartpeppar', note: 'krossad' },
        { name: 'Salt', amount: 3, unit: 'g', foodDbName: null },
        { name: 'Citronzest', amount: null, unit: null, foodDbName: null, note: 'från 1 citron' },
      ],
      steps: [
        'Blanda alla ingredienser i en skål.',
        'Lägg köttet i en plastpåse eller skål.',
        'Häll över marinaden och massera in.',
        'Låt marinera i kylskåp: Fågel 2-4 tim, Lamm/Nöt 4-24 tim.',
        'Ta ut 30 min före tillagning. Torka av överflödig marinad.'
      ],
      description: 'Bra för lamm, kyckling och nötkött. OBS: Marinaden tränger bara in 1-2 mm - smaken sitter mest på ytan.'
    },
    {
      id: 'asiansimple',
      name: 'Asiatisk marinad',
      basePortions: 500,
      portionUnit: 'g kött',
      time: '5 min + 1-4 tim',
      structuredIngredients: [
        { name: 'Sojasås', amount: 45, unit: 'ml', foodDbName: 'Sojasås', note: 'japansk' },
        { name: 'Sesamolja', amount: 30, unit: 'ml', foodDbName: 'Sesamolja' },
        { name: 'Risvinäger', amount: 15, unit: 'ml', foodDbName: 'Risvinäger' },
        { name: 'Honung', amount: 20, unit: 'g', foodDbName: 'Honung' },
        { name: 'Vitlök', amount: 8, unit: 'g', foodDbName: 'Vitlök', note: '2 klyftor, rivna' },
        { name: 'Ingefära', amount: 10, unit: 'g', foodDbName: 'Ingefära färsk', note: 'färsk, riven' },
        { name: 'Chiliflakes', amount: 2, unit: 'g', foodDbName: 'Chiliflingor', note: 'valfritt', optional: true },
      ],
      steps: [
        'Vispa ihop soja, sesamolja, vinäger och honung.',
        'Rör ner vitlök, ingefära och chili.',
        'Marinera kött i 1-4 timmar (ej längre pga sojan).',
        'Torka av innan stekning för bättre brunning.'
      ],
      description: 'Passar utmärkt till fläsk, kyckling och biff. Kan också användas som glaze.'
    },
    {
      id: 'yogurtmarinade',
      name: 'Yoghurtmarinad (Tandoori-stil)',
      basePortions: 1000,
      portionUnit: 'g kyckling',
      time: '10 min + 4-24 tim',
      structuredIngredients: [
        { name: 'Turkisk yoghurt', amount: 300, unit: 'g', foodDbName: 'Turkisk yoghurt' },
        { name: 'Citronjuice', amount: 30, unit: 'ml', foodDbName: 'Citronjuice' },
        { name: 'Vitlök', amount: 12, unit: 'g', foodDbName: 'Vitlök', note: '3 klyftor, pressade' },
        { name: 'Ingefära', amount: 15, unit: 'g', foodDbName: 'Ingefära färsk', note: 'riven' },
        { name: 'Paprikapulver', amount: 4, unit: 'g', foodDbName: 'Paprikapulver' },
        { name: 'Spiskummin', amount: 2, unit: 'g', foodDbName: 'Spiskummin' },
        { name: 'Garam masala', amount: 2, unit: 'g', foodDbName: 'Garam masala' },
        { name: 'Cayennepeppar', amount: 1, unit: 'g', foodDbName: 'Cayennepeppar' },
        { name: 'Gurkmeja', amount: 1, unit: 'g', foodDbName: 'Gurkmeja' },
        { name: 'Salt', amount: 5, unit: 'g', foodDbName: null },
      ],
      steps: [
        'Blanda yoghurt med citronjuice.',
        'Rör ner vitlök, ingefära och alla kryddor.',
        'Gör snitt i kycklingen för bättre penetration.',
        'Marinera i 4-24 timmar (yoghurtens enzymer mörnar).',
        'Skaka av överflödig marinad före grillning.',
        'Grilla på hög värme för karaktäristisk yta.'
      ],
      description: 'Yoghurtens mjölksyra mörnar köttet. Perfekt för grillad kyckling.'
    },
  ],
  'Smör': [
    {
      id: 'beurremonte',
      name: 'Beurre Monté',
      basePortions: 500,
      portionUnit: 'g',
      time: '10 min',
      structuredIngredients: [
        { name: 'Vatten', amount: 30, unit: 'ml', foodDbName: null },
        { name: 'Smör', amount: 500, unit: 'g', foodDbName: 'Smör osaltat', note: 'kallt, i bitar' },
      ],
      steps: [
        'Koka upp vattnet i en kastrull.',
        'Sänk värmen till låg.',
        'Vispa i smöret, bit för bit, under ständig omrörning.',
        'Fortsätt tills allt smör är emulgerat.',
        'Håll varmt (80-88°C) men koka ALDRIG - då bryts emulsionen.',
        'Använd direkt eller förvara varmt i upp till 2 timmar.'
      ],
      description: 'The French Laundrys "arbetssmör". Emulgerat smör som håller sig flytande utan att separera. Pochera fisk och skaldjur i det (80-88°C), basta kött i ugnen, eller vila kött i det för att förhindra att safterna rinner ut. Rester kan klaras och användas som vanligt smör.',
      uses: [
        { title: 'Pochera hummer/fisk', desc: 'Håll 80-88°C, lägg i köttet 5-6 min' },
        { title: 'Basta kött', desc: 'Slev över kött i ugnen för jämn tillagning' },
        { title: 'Vila kött', desc: 'Lägg stekt kött i beurre monté - stoppar carryover och behåller saft' },
        { title: 'Snabbsåser', desc: 'Bas för alla à la minute-såser med smörsmak' }
      ]
    },
    {
      id: 'herbutter',
      name: 'Örtsmör',
      basePortions: 200,
      portionUnit: 'g',
      time: '10 min',
      structuredIngredients: [
        { name: 'Smör', amount: 200, unit: 'g', foodDbName: 'Smör osaltat', note: 'rumstempererat' },
        { name: 'Persilja', amount: 15, unit: 'g', foodDbName: 'Persilja färsk', note: 'färsk, finhackad' },
        { name: 'Gräslök', amount: 10, unit: 'g', foodDbName: 'Gräslök', note: 'färsk, klippt' },
        { name: 'Vitlök', amount: 4, unit: 'g', foodDbName: 'Vitlök', note: '1 klyfta, pressad' },
        { name: 'Citronzest', amount: 3, unit: 'g', foodDbName: null, note: '1 tsk' },
        { name: 'Salt', amount: 3, unit: 'g', foodDbName: null },
        { name: 'Svartpeppar', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
      ],
      steps: [
        'Låt smöret bli rumstempererat (mjukt men inte smält).',
        'Hacka örterna fint.',
        'Arbeta in alla ingredienser i smöret med gaffel eller maskin.',
        'Smaka av med salt och peppar.',
        'Rulla smöret i plastfolie till en cylinder.',
        'Frys i minst 1 timme. Skiva vid servering.'
      ],
      description: 'Klassiker till biff, fisk och nygrillade grönsaker. Håller 2 veckor i kyl, 3 månader i frys.'
    },
    {
      id: 'cafedeparis',
      name: 'Café de Paris-smör',
      basePortions: 250,
      portionUnit: 'g',
      time: '15 min',
      structuredIngredients: [
        { name: 'Smör', amount: 200, unit: 'g', foodDbName: 'Smör osaltat' },
        { name: 'Dijonsenap', amount: 15, unit: 'g', foodDbName: 'Senap dijon' },
        { name: 'Worcestershiresås', amount: 15, unit: 'ml', foodDbName: null },
        { name: 'Konjak', amount: 15, unit: 'ml', foodDbName: null },
        { name: 'Schalottenlök', amount: 30, unit: 'g', foodDbName: 'Schalottenlök', note: 'finhackad' },
        { name: 'Sardeller', amount: 10, unit: 'g', foodDbName: 'Ansjovis', note: '2 st, finhackade' },
        { name: 'Kapris', amount: 15, unit: 'g', foodDbName: 'Kapris', note: 'hackade' },
        { name: 'Persilja', amount: 8, unit: 'g', foodDbName: 'Persilja färsk', note: 'färsk' },
        { name: 'Paprikapulver', amount: 2, unit: 'g', foodDbName: 'Paprikapulver' },
        { name: 'Curry', amount: 1, unit: 'g', foodDbName: 'Curry' },
        { name: 'Salt', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
        { name: 'Peppar', amount: null, unit: null, foodDbName: null, note: 'efter smak' },
      ],
      steps: [
        'Finhacka schalottenlök, sardeller och kapris.',
        'Arbeta ihop mjukt smör med alla ingredienser.',
        'Smaka av och justera kryddningen.',
        'Rulla i plastfolie till cylinder.',
        'Kyl i minst 2 timmar så smakerna gifter sig.'
      ],
      description: 'Den klassiska stekhussmörens smör. Perfekt till entrecôte och ryggbiff.'
    },
    {
      id: 'bluecheesebutter',
      name: 'Blåmögelsmör',
      basePortions: 280,
      portionUnit: 'g',
      time: '10 min',
      structuredIngredients: [
        { name: 'Smör', amount: 200, unit: 'g', foodDbName: 'Smör osaltat' },
        { name: 'Blåmögelost', amount: 80, unit: 'g', foodDbName: 'Gorgonzola', note: 'Roquefort eller Gorgonzola' },
        { name: 'Konjak', amount: 15, unit: 'ml', foodDbName: null, note: 'eller portvin' },
        { name: 'Valnötter', amount: 20, unit: 'g', foodDbName: 'Valnötter', note: 'hackade', optional: true },
        { name: 'Svartpeppar', amount: null, unit: null, foodDbName: null, note: 'nymalen' },
      ],
      steps: [
        'Låt smör och ost bli rumstempererade.',
        'Mosa osten med en gaffel.',
        'Arbeta ihop smör och ost tills jämnt blandat.',
        'Tillsätt konjak och valnötter.',
        'Krydda med nymalen svartpeppar.',
        'Rulla och kyl som örtsmöret.'
      ],
      description: 'Kraftfullt smör som passar perfekt till grillad biff. Smälter underbart på varmt kött.'
    },
    {
      id: 'chimichurri',
      name: 'Chimichurri',
      basePortions: 200,
      portionUnit: 'ml',
      time: '15 min',
      structuredIngredients: [
        { name: 'Persilja', amount: 30, unit: 'g', foodDbName: 'Persilja färsk', note: '1 stort knippe' },
        { name: 'Vitlök', amount: 16, unit: 'g', foodDbName: 'Vitlök', note: '4 klyftor' },
        { name: 'Oregano', amount: 8, unit: 'g', foodDbName: 'Oregano färsk', note: 'färsk, eller 4g torkad' },
        { name: 'Olivolja', amount: 100, unit: 'ml', foodDbName: 'Olivolja' },
        { name: 'Rödvinsvinäger', amount: 45, unit: 'ml', foodDbName: 'Rödvinsvinäger' },
        { name: 'Chiliflingor', amount: 1, unit: 'g', foodDbName: 'Chiliflingor' },
        { name: 'Salt', amount: 3, unit: 'g', foodDbName: null },
      ],
      steps: [
        'Finhacka persilja, vitlök och oregano (för hand, ej mixer!).',
        'Blanda med olivolja och vinäger.',
        'Krydda med chili och salt.',
        'Låt stå minst 30 min så smakerna utvecklas.',
        'Servera rumstempererad.'
      ],
      description: 'Argentinsk klassiker till grillat kött. Ska vara hackad, inte mixad, för rätt textur.'
    },
  ],
};

// FÖRBÄTTRAD Måttomvandlingsdata
const conversionData = {
  weight: {
    kg: 1000,
    hg: 100,
    g: 1,
    lb: 453.592,
    oz: 28.3495,
  },
  volume: {
    l: 1000,
    dl: 100,
    cl: 10,
    ml: 1,
    msk: 15,
    tsk: 5,
    krm: 1,
    // Amerikanska mått
    cup: 236.588,
    tbsp: 14.787,
    tsp: 4.929,
    'fl oz': 29.574,
    pint: 473.176,
    quart: 946.353,
  },
  // UTÖKAD ingredienslista med kategorier
  weightToVolume: {
    // === MJÖL ===
    'Vetemjöl': { gPerDl: 60, category: 'Mjöl' },
    'Grahamsmjöl': { gPerDl: 65, category: 'Mjöl' },
    'Rågmjöl': { gPerDl: 70, category: 'Mjöl' },
    'Potatismjöl': { gPerDl: 80, category: 'Mjöl' },
    'Maizena': { gPerDl: 80, category: 'Mjöl' },
    'Dinkelmjöl': { gPerDl: 60, category: 'Mjöl' },
    'Bovetemjöl': { gPerDl: 75, category: 'Mjöl' },
    'Mannagryn': { gPerDl: 90, category: 'Mjöl' },
    'Durumvete (semolina)': { gPerDl: 85, category: 'Mjöl' },
    'Mandelmjöl': { gPerDl: 50, category: 'Mjöl' },
    'Kokosmjöl': { gPerDl: 45, category: 'Mjöl' },
    // === SOCKER ===
    'Strösocker': { gPerDl: 90, category: 'Socker' },
    'Florsocker': { gPerDl: 50, category: 'Socker' },
    'Farinsocker': { gPerDl: 85, category: 'Socker' },
    'Muscovadosocker': { gPerDl: 100, category: 'Socker' },
    'Pärlsocker': { gPerDl: 100, category: 'Socker' },
    'Kokossocker': { gPerDl: 85, category: 'Socker' },
    // === FLYTANDE ===
    'Vatten': { gPerDl: 100, category: 'Flytande' },
    'Mjölk': { gPerDl: 103, category: 'Flytande' },
    'Grädde': { gPerDl: 100, category: 'Flytande' },
    'Vispgrädde': { gPerDl: 100, category: 'Flytande' },
    'Crème fraiche': { gPerDl: 105, category: 'Flytande' },
    'Kvarg': { gPerDl: 110, category: 'Flytande' },
    'Filmjölk': { gPerDl: 103, category: 'Flytande' },
    'Yoghurt': { gPerDl: 105, category: 'Flytande' },
    'Olja': { gPerDl: 90, category: 'Flytande' },
    'Olivolja': { gPerDl: 92, category: 'Flytande' },
    'Äggvita (ca 3 st)': { gPerDl: 100, category: 'Flytande' },
    'Äggula (ca 5 st)': { gPerDl: 105, category: 'Flytande' },
    // === FETT ===
    'Smör': { gPerDl: 95, category: 'Fett' },
    'Margarin': { gPerDl: 95, category: 'Fett' },
    'Kokosolja': { gPerDl: 90, category: 'Fett' },
    'Ister': { gPerDl: 85, category: 'Fett' },
    // === SÖTT & SIRAP ===
    'Honung': { gPerDl: 140, category: 'Sött' },
    'Ljus sirap': { gPerDl: 140, category: 'Sött' },
    'Mörk sirap': { gPerDl: 145, category: 'Sött' },
    'Lönnsirap': { gPerDl: 130, category: 'Sött' },
    'Agavesirap': { gPerDl: 135, category: 'Sött' },
    // === TORRVAROR ===
    'Ris': { gPerDl: 90, category: 'Torrvaror' },
    'Havregryn': { gPerDl: 40, category: 'Torrvaror' },
    'Müsli': { gPerDl: 45, category: 'Torrvaror' },
    'Couscous': { gPerDl: 90, category: 'Torrvaror' },
    'Bulgur': { gPerDl: 85, category: 'Torrvaror' },
    'Quinoa': { gPerDl: 85, category: 'Torrvaror' },
    'Röda linser': { gPerDl: 95, category: 'Torrvaror' },
    'Gröna linser': { gPerDl: 90, category: 'Torrvaror' },
    'Panko': { gPerDl: 25, category: 'Torrvaror' },
    'Ströbröd': { gPerDl: 55, category: 'Torrvaror' },
    // === BAKNING ===
    'Kakao': { gPerDl: 40, category: 'Bakning' },
    'Bakpulver': { gPerDl: 80, category: 'Bakning' },
    'Bikarbonat': { gPerDl: 95, category: 'Bakning' },
    'Vaniljsocker': { gPerDl: 75, category: 'Bakning' },
    'Torrjäst': { gPerDl: 60, category: 'Bakning' },
    'Chokladbitar': { gPerDl: 90, category: 'Bakning' },
    // === NÖTTER & FRÖN ===
    'Hackade valnötter': { gPerDl: 50, category: 'Nötter & frön' },
    'Hackade hasselnötter': { gPerDl: 55, category: 'Nötter & frön' },
    'Hackade mandlar': { gPerDl: 55, category: 'Nötter & frön' },
    'Solrosfrön': { gPerDl: 60, category: 'Nötter & frön' },
    'Pumpafrön': { gPerDl: 55, category: 'Nötter & frön' },
    'Chiafrön': { gPerDl: 75, category: 'Nötter & frön' },
    'Linfrön': { gPerDl: 70, category: 'Nötter & frön' },
    'Sesamfrön': { gPerDl: 65, category: 'Nötter & frön' },
    'Kokosflingor': { gPerDl: 35, category: 'Nötter & frön' },
    'Kokos, riven': { gPerDl: 40, category: 'Nötter & frön' },
    // === KRYDDOR & SALT ===
    'Salt, fint': { gPerDl: 130, category: 'Kryddor' },
    'Salt, grovt': { gPerDl: 100, category: 'Kryddor' },
    'Peppar, mald': { gPerDl: 50, category: 'Kryddor' },
    'Kanel': { gPerDl: 50, category: 'Kryddor' },
    'Kardemumma, mald': { gPerDl: 45, category: 'Kryddor' },
    'Ingefära, mald': { gPerDl: 45, category: 'Kryddor' },
  },
  // MSK/TSK snabbreferens
  spoonReference: {
    'Smör': { msk: 14, tsk: 5 },
    'Salt, fint': { msk: 18, tsk: 6 },
    'Salt, grovt': { msk: 15, tsk: 5 },
    'Strösocker': { msk: 13, tsk: 4 },
    'Honung': { msk: 21, tsk: 7 },
    'Sirap': { msk: 21, tsk: 7 },
    'Olja': { msk: 13, tsk: 4 },
    'Mjölk': { msk: 15, tsk: 5 },
    'Vetemjöl': { msk: 9, tsk: 3 },
    'Kakao': { msk: 6, tsk: 2 },
    'Bakpulver': { msk: 12, tsk: 4 },
    'Vaniljsocker': { msk: 11, tsk: 4 },
    'Kanel': { msk: 8, tsk: 3 },
  },
  // Äggstorlekar
  eggSizes: {
    'S': { totalWeight: 53, yolkWeight: 15, whiteWeight: 30 },
    'M': { totalWeight: 63, yolkWeight: 18, whiteWeight: 35 },
    'L': { totalWeight: 73, yolkWeight: 20, whiteWeight: 42 },
    'XL': { totalWeight: 83, yolkWeight: 22, whiteWeight: 50 },
  },
};

// Kategorier för näringssök - kuraterad databas med 974 råvaror
const foodCategories = [
  { id: '', label: 'Alla' },
  { id: 'Kött - Nöt', label: 'Nötkött' },
  { id: 'Kött - Fläsk', label: 'Fläskkött' },
  { id: 'Kött - Lamm', label: 'Lammkött' },
  { id: 'Kött - Vilt', label: 'Vilt' },
  { id: 'Fågel', label: 'Fågel' },
  { id: 'Fisk', label: 'Fisk' },
  { id: 'Skaldjur', label: 'Skaldjur' },
  { id: 'Mejeri', label: 'Mejeri' },
  { id: 'Mejeri - Ost', label: 'Ost' },
  { id: 'Mejeri - Smör', label: 'Smör' },
  { id: 'Ägg', label: 'Ägg' },
  { id: 'Grönsaker', label: 'Grönsaker' },
  { id: 'Rotfrukter', label: 'Rotfrukter' },
  { id: 'Svamp', label: 'Svamp' },
  { id: 'Frukt', label: 'Frukt' },
  { id: 'Bär', label: 'Bär' },
  { id: 'Torkad frukt', label: 'Torkad frukt' },
  { id: 'Kryddor', label: 'Kryddor' },
  { id: 'Såser', label: 'Såser' },
  { id: 'Oljor & fetter', label: 'Oljor & fetter' },
  { id: 'Pasta & nudlar', label: 'Pasta & nudlar' },
  { id: 'Ris', label: 'Ris' },
  { id: 'Spannmål & mjöl', label: 'Spannmål & mjöl' },
  { id: 'Baljväxter', label: 'Baljväxter' },
  { id: 'Nötter & frön', label: 'Nötter & frön' },
  { id: 'Bakvaror', label: 'Bakvaror' },
  { id: 'Sötning', label: 'Sötning' },
  { id: 'Buljong & fond', label: 'Buljong & fond' },
  { id: 'Konserver', label: 'Konserver' },
  { id: 'Torkade produkter', label: 'Torkade produkter' },
];

// Synonymer för sökning - uppdaterad för kuraterad databas
const synonyms = {
  // Kött & färs
  'köttfärs': ['nötfärs', 'fläskfärs', 'blandfärs', 'lammfärs', 'kycklingfärs'],
  'färs': ['nötfärs', 'fläskfärs', 'blandfärs', 'lammfärs', 'kycklingfärs', 'kalkonfärs'],
  'biff': ['ryggbiff', 'entrecôte', 'oxfilé', 'flanksteak'],
  'stek': ['rostbiff', 'lammstek', 'älgstek', 'skinkstek'],
  // Fågel
  'kyckling': ['kycklingbröst', 'kycklinglår', 'kycklingvingar'],
  'höns': ['kyckling'],
  'anka': ['ankbröst', 'anklår'],
  // Fisk
  'lax': ['laxfilé', 'gravad lax', 'rökt lax'],
  'torsk': ['torskfilé', 'torskrygg'],
  'fisk': ['lax', 'torsk', 'kolja', 'sej', 'abborre', 'gädda'],
  // Skaldjur
  'räkor': ['tigerräkor', 'jätteräkor', 'nordhavsräkor'],
  'skaldjur': ['räkor', 'krabba', 'hummer', 'musslor'],
  // Mejeri
  'grädde': ['vispgrädde', 'matlagningsgrädde', 'crème fraiche'],
  'fil': ['filmjölk', 'gräddfil', 'a-fil'],
  'mjölk': ['helmjölk', 'mellanmjölk', 'lättmjölk'],
  'ost': ['parmesan', 'mozzarella', 'cheddar', 'fetaost', 'västerbottensost'],
  'smör': ['smör osaltat', 'klarat smör', 'bregott'],
  // Grönsaker
  'lök': ['gul lök', 'röd lök', 'schalottenlök', 'purjolök'],
  'tomat': ['körsbärstomat', 'plommontomat', 'soltorkade tomater'],
  'paprika': ['röd paprika', 'gul paprika', 'grön paprika'],
  'kål': ['vitkål', 'rödkål', 'blomkål', 'broccoli', 'grönkål'],
  'sallad': ['romansallad', 'ruccola', 'spenat'],
  // Rotfrukter
  'potatis': ['mandelpotatis', 'färskpotatis', 'sötpotatis'],
  'morot': ['bebimorötter'],
  // Kryddor
  'peppar': ['svartpeppar', 'vitpeppar', 'cayennepeppar', 'sichuanpeppar'],
  'chili': ['chiliflingor', 'jalapeño', 'habanero', 'sriracha'],
  'curry': ['currypasta', 'garam masala'],
  // Pasta & ris
  'pasta': ['torkad pasta', 'färsk pasta'],
  'spaghetti': ['torkad pasta'],
  'penne': ['torkad pasta'],
  'tagliatelle': ['torkad pasta', 'färsk pasta'],
  'fusilli': ['torkad pasta'],
  'rigatoni': ['torkad pasta'],
  'linguine': ['torkad pasta'],
  'farfalle': ['torkad pasta'],
  'bucatini': ['torkad pasta'],
  'nudlar': ['risnudlar', 'udonnudlar', 'sobanudar', 'ramennudlar'],
  'ris': ['jasminris', 'basmatiris', 'arboriris', 'sushiris', 'fullkornsris'],
  'råris': ['fullkornsris'],
  // Baljväxter
  'linser': ['röda linser', 'gröna linser', 'belugalinser'],
  'bönor': ['vita bönor', 'svarta bönor', 'kidneybönor', 'kikärtor'],
  // Nötter
  'nötter': ['mandlar', 'valnötter', 'hasselnötter', 'cashewnötter'],
  // Övrigt
  'olja': ['olivolja', 'rapsolja', 'sesamolja'],
  'socker': ['strösocker', 'florsocker', 'farinsocker'],
  'mjöl': ['vetemjöl', 'grahamsmjöl', 'mandelmjöl'],
};

// Volymenheter för receptskaparen
const volumeUnits = {
  'g': { label: 'gram', mlPer: null },
  'dl': { label: 'dl', mlPer: 100 },
  'msk': { label: 'msk', mlPer: 15 },
  'tsk': { label: 'tsk', mlPer: 5 },
  'krm': { label: 'krm', mlPer: 1 },
  'st': { label: 'st', mlPer: null },
};

// Kuraterad livsmedelsdatabas för professionella kök (974 produkter)
// Genererad från curated_foods.json
const foodDatabase = [
  { code: 'cf-0001', product_name: 'Nötfärs 10%', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 176, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0002', product_name: 'Nötfärs 15%', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 212, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 15, fiber_100g: 0 }},
  { code: 'cf-0003', product_name: 'Nötfärs 20%', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 20, fiber_100g: 0 }},
  { code: 'cf-0004', product_name: 'Oxfilé', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0005', product_name: 'Entrecôte', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 19, fiber_100g: 0 }},
  { code: 'cf-0006', product_name: 'Ryggbiff', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 168, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0007', product_name: 'Rostbiff', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 140, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0008', product_name: 'Högrev', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0009', product_name: 'Bog', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 165, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0010', product_name: 'Bringa', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 20, fiber_100g: 0 }},
  { code: 'cf-0011', product_name: 'Fransyska', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 145, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0012', product_name: 'Innanlår', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 135, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0013', product_name: 'Ytterlår', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 145, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0014', product_name: 'Oxsvans', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 262, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 21, fiber_100g: 0 }},
  { code: 'cf-0015', product_name: 'Oxtunga', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 224, proteins_100g: 16, carbohydrates_100g: 0, fat_100g: 18, fiber_100g: 0 }},
  { code: 'cf-0016', product_name: 'Kalvfilé', category: 'Kött - Nöt', brands: 'Kalvkött', nutriments: { 'energy-kcal_100g': 110, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0017', product_name: 'Kalvkotlett', category: 'Kött - Nöt', brands: 'Kalvkött', nutriments: { 'energy-kcal_100g': 150, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0018', product_name: 'Kalvlever', category: 'Kött - Nöt', brands: 'Kalvkött', nutriments: { 'energy-kcal_100g': 140, proteins_100g: 20, carbohydrates_100g: 3, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0019', product_name: 'Kalvnjure', category: 'Kött - Nöt', brands: 'Kalvkött', nutriments: { 'energy-kcal_100g': 99, proteins_100g: 17, carbohydrates_100g: 1, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0020', product_name: 'Kalvbräss', category: 'Kött - Nöt', brands: 'Kalvkött', nutriments: { 'energy-kcal_100g': 109, proteins_100g: 12, carbohydrates_100g: 0, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0021', product_name: 'Märgben', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 786, proteins_100g: 7, carbohydrates_100g: 0, fat_100g: 84, fiber_100g: 0 }},
  { code: 'cf-0022', product_name: 'Tjockt kött', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 155, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0023', product_name: 'Flanksteak', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 192, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0024', product_name: 'Flat iron', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0025', product_name: 'Bavette', category: 'Kött - Nöt', brands: 'Nötkött', nutriments: { 'energy-kcal_100g': 175, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0026', product_name: 'Fläskfilé', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 105, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0027', product_name: 'Fläskkotlett', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0028', product_name: 'Fläskkarré', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 165, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0029', product_name: 'Sidfläsk', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 518, proteins_100g: 9, carbohydrates_100g: 0, fat_100g: 53, fiber_100g: 0 }},
  { code: 'cf-0030', product_name: 'Fläskbog', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 170, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0031', product_name: 'Fläsklägg', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 215, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 16, fiber_100g: 0 }},
  { code: 'cf-0032', product_name: 'Revbensspjäll', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 277, proteins_100g: 16, carbohydrates_100g: 0, fat_100g: 23, fiber_100g: 0 }},
  { code: 'cf-0033', product_name: 'Fläskfärs', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 263, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 21, fiber_100g: 0 }},
  { code: 'cf-0034', product_name: 'Blandfärs', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 230, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 17, fiber_100g: 0 }},
  { code: 'cf-0035', product_name: 'Bacon', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 417, proteins_100g: 15, carbohydrates_100g: 1, fat_100g: 40, fiber_100g: 0 }},
  { code: 'cf-0036', product_name: 'Pancetta', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 458, proteins_100g: 15, carbohydrates_100g: 0, fat_100g: 45, fiber_100g: 0 }},
  { code: 'cf-0037', product_name: 'Guanciale', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 655, proteins_100g: 8, carbohydrates_100g: 0, fat_100g: 69, fiber_100g: 0 }},
  { code: 'cf-0038', product_name: 'Späck (ister)', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 898, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0039', product_name: 'Fläskkind', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 14, carbohydrates_100g: 0, fat_100g: 32, fiber_100g: 0 }},
  { code: 'cf-0040', product_name: 'Trotter (grisfötter)', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 212, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0041', product_name: 'Skinkstek', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 145, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0042', product_name: 'Kassler', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 21, carbohydrates_100g: 1, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0043', product_name: 'Lammfilé', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 155, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0044', product_name: 'Lammkotlett', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 225, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 17, fiber_100g: 0 }},
  { code: 'cf-0045', product_name: 'Lammstek', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 200, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0046', product_name: 'Lammsadel', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 175, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0047', product_name: 'Lammbog', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 210, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 15, fiber_100g: 0 }},
  { code: 'cf-0048', product_name: 'Lammlägg', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 195, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0049', product_name: 'Lammrack', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 240, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 18, fiber_100g: 0 }},
  { code: 'cf-0050', product_name: 'Lammfärs', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 23, fiber_100g: 0 }},
  { code: 'cf-0051', product_name: 'Lammhjärta', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 122, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0052', product_name: 'Lammlever', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 139, proteins_100g: 21, carbohydrates_100g: 2, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0053', product_name: 'Lammnjure', category: 'Kött - Lamm', brands: 'Lammkött', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 16, carbohydrates_100g: 1, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0054', product_name: 'Älgfilé', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 102, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0055', product_name: 'Älgfärs', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0056', product_name: 'Älgstek', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 110, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0057', product_name: 'Rådjursfilé', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 104, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0058', product_name: 'Rådjurssadel', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0059', product_name: 'Hjortfilé', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 23, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0060', product_name: 'Hjortfärs', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 150, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0061', product_name: 'Vildsvinsfärs', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 160, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0062', product_name: 'Vildsvinsstek', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 145, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0063', product_name: 'Renfilé', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 109, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0064', product_name: 'Renstek', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0065', product_name: 'Renfärs', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 140, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0066', product_name: 'Hare', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 114, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0067', product_name: 'Fasanbröst', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 133, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0068', product_name: 'Rapphöna', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 114, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0069', product_name: 'Vaktel', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 134, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0070', product_name: 'Duva', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 187, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0071', product_name: 'Kycklingbröst', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 23, carbohydrates_100g: 0, fat_100g: 2.5, fiber_100g: 0 }},
  { code: 'cf-0072', product_name: 'Kycklingbröst med skinn', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 172, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0073', product_name: 'Kycklinglever', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 119, proteins_100g: 17, carbohydrates_100g: 1, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0074', product_name: 'Kycklinglår', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 177, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0075', product_name: 'Kycklingklubba', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 172, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0076', product_name: 'Kycklingvingar', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 203, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0077', product_name: 'Hel kyckling', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 190, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0078', product_name: 'Kycklingfärs', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 143, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0079', product_name: 'Majskyckling', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 190, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0080', product_name: 'Kalkonbröst', category: 'Fågel', brands: 'Kalkon', nutriments: { 'energy-kcal_100g': 104, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0081', product_name: 'Kalkonfilé', category: 'Fågel', brands: 'Kalkon', nutriments: { 'energy-kcal_100g': 107, proteins_100g: 23, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0082', product_name: 'Kalkonlårfilé', category: 'Fågel', brands: 'Kalkon', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0083', product_name: 'Kalkonfärs', category: 'Fågel', brands: 'Kalkon', nutriments: { 'energy-kcal_100g': 148, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0084', product_name: 'Ankbröst', category: 'Fågel', brands: 'Anka', nutriments: { 'energy-kcal_100g': 201, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0085', product_name: 'Ankbröst med skinn', category: 'Fågel', brands: 'Anka', nutriments: { 'energy-kcal_100g': 337, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 30, fiber_100g: 0 }},
  { code: 'cf-0086', product_name: 'Anklever', category: 'Fågel', brands: 'Anka', nutriments: { 'energy-kcal_100g': 136, proteins_100g: 16, carbohydrates_100g: 4, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0087', product_name: 'Anklår', category: 'Fågel', brands: 'Anka', nutriments: { 'energy-kcal_100g': 217, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 16, fiber_100g: 0 }},
  { code: 'cf-0088', product_name: 'Ankfett', category: 'Fågel', brands: 'Anka', nutriments: { 'energy-kcal_100g': 882, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 98, fiber_100g: 0 }},
  { code: 'cf-0089', product_name: 'Gåsbröst', category: 'Fågel', brands: 'Gås', nutriments: { 'energy-kcal_100g': 161, proteins_100g: 23, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0090', product_name: 'Gåslever (foie gras)', category: 'Fågel', brands: 'Gås', nutriments: { 'energy-kcal_100g': 462, proteins_100g: 11, carbohydrates_100g: 4, fat_100g: 44, fiber_100g: 0 }},
  { code: 'cf-0091', product_name: 'Lax färsk', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 208, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0092', product_name: 'Laxfilé', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 208, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0093', product_name: 'Gravad lax', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 200, proteins_100g: 19, carbohydrates_100g: 2, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0094', product_name: 'Rökt lax', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 183, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0095', product_name: 'Laxrom', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 29, carbohydrates_100g: 3, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0096', product_name: 'Öring', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 148, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0097', product_name: 'Röding', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 138, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0098', product_name: 'Sik', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 106, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0099', product_name: 'Sikrom', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 240, proteins_100g: 28, carbohydrates_100g: 3, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0100', product_name: 'Abborre', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 91, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0101', product_name: 'Gädda', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 88, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0102', product_name: 'Gös', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 93, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0103', product_name: 'Lake', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 90, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0104', product_name: 'Kräftor', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0105', product_name: 'Torsk färsk', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 0.7, fiber_100g: 0 }},
  { code: 'cf-0106', product_name: 'Torskfilé', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 0.7, fiber_100g: 0 }},
  { code: 'cf-0107', product_name: 'Torskrygg', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 0.7, fiber_100g: 0 }},
  { code: 'cf-0108', product_name: 'Torsktunga', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 85, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0109', product_name: 'Torskrom', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 25, carbohydrates_100g: 1, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0110', product_name: 'Lutfisk', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 48, proteins_100g: 11, carbohydrates_100g: 0, fat_100g: 0.3, fiber_100g: 0 }},
  { code: 'cf-0111', product_name: 'Kolja', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 87, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 0.8, fiber_100g: 0 }},
  { code: 'cf-0112', product_name: 'Sejfilé', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 92, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0113', product_name: 'Kummel', category: 'Fisk', brands: 'Torskfisk', nutriments: { 'energy-kcal_100g': 90, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0114', product_name: 'Sill färsk', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0115', product_name: 'Sillfilé', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0116', product_name: 'Strömming', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 140, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0117', product_name: 'Sardiner färska', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 208, proteins_100g: 25, carbohydrates_100g: 0, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0118', product_name: 'Ansjovis (färsk)', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 131, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0119', product_name: 'Makrill färsk', category: 'Fisk', brands: 'Makrillfisk', nutriments: { 'energy-kcal_100g': 205, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0120', product_name: 'Makrillfilé', category: 'Fisk', brands: 'Makrillfisk', nutriments: { 'energy-kcal_100g': 205, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0121', product_name: 'Tonfisk färsk', category: 'Fisk', brands: 'Tonfisk', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 28, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0122', product_name: 'Tonfiskbuk (toro)', category: 'Fisk', brands: 'Tonfisk', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 25, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0123', product_name: 'Svärdfisk', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 121, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0124', product_name: 'Havskatt', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 96, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0125', product_name: 'Havsabborre', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0126', product_name: 'Brax', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 105, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0127', product_name: 'Piggvar', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 95, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0128', product_name: 'Tunga (fisk)', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 86, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0129', product_name: 'Rödspätta', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 91, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0130', product_name: 'Hälleflundra', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 140, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0131', product_name: 'Skrubbskädda', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 15, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0132', product_name: 'Ål färsk', category: 'Fisk', brands: 'Ål', nutriments: { 'energy-kcal_100g': 236, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 18, fiber_100g: 0 }},
  { code: 'cf-0133', product_name: 'Rökt ål', category: 'Fisk', brands: 'Ål', nutriments: { 'energy-kcal_100g': 330, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 28, fiber_100g: 0 }},
  { code: 'cf-0134', product_name: 'Havskräfta', category: 'Fisk', brands: 'Skaldjur', nutriments: { 'energy-kcal_100g': 90, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0135', product_name: 'Hummer', category: 'Fisk', brands: 'Skaldjur', nutriments: { 'energy-kcal_100g': 89, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0136', product_name: 'Räkor färska', category: 'Skaldjur', brands: 'Räkor', nutriments: { 'energy-kcal_100g': 99, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0137', product_name: 'Räkor skalade', category: 'Skaldjur', brands: 'Räkor', nutriments: { 'energy-kcal_100g': 99, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0138', product_name: 'Jätteräkor (scampi)', category: 'Skaldjur', brands: 'Räkor', nutriments: { 'energy-kcal_100g': 106, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0139', product_name: 'Tigerräkor', category: 'Skaldjur', brands: 'Räkor', nutriments: { 'energy-kcal_100g': 106, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0140', product_name: 'Nordhavsräkor', category: 'Skaldjur', brands: 'Räkor', nutriments: { 'energy-kcal_100g': 99, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0141', product_name: 'Krabba', category: 'Skaldjur', brands: 'Krabba', nutriments: { 'energy-kcal_100g': 87, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0142', product_name: 'Krabbkött', category: 'Skaldjur', brands: 'Krabba', nutriments: { 'energy-kcal_100g': 87, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0143', product_name: 'Taskekräfta', category: 'Skaldjur', brands: 'Krabba', nutriments: { 'energy-kcal_100g': 85, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0144', product_name: 'Blåmusslor', category: 'Skaldjur', brands: 'Musslor', nutriments: { 'energy-kcal_100g': 86, proteins_100g: 12, carbohydrates_100g: 4, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0145', product_name: 'Grönläppad mussla', category: 'Skaldjur', brands: 'Musslor', nutriments: { 'energy-kcal_100g': 85, proteins_100g: 11, carbohydrates_100g: 4, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0146', product_name: 'Hjärtmusslor', category: 'Skaldjur', brands: 'Musslor', nutriments: { 'energy-kcal_100g': 79, proteins_100g: 14, carbohydrates_100g: 4, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0147', product_name: 'Ostron', category: 'Skaldjur', brands: 'Ostron', nutriments: { 'energy-kcal_100g': 81, proteins_100g: 9, carbohydrates_100g: 5, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0148', product_name: 'Pilgrimsmusslor', category: 'Skaldjur', brands: 'Musslor', nutriments: { 'energy-kcal_100g': 88, proteins_100g: 17, carbohydrates_100g: 2, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0149', product_name: 'Bläckfisk', category: 'Skaldjur', brands: 'Bläckfisk', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 16, carbohydrates_100g: 2, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0150', product_name: 'Calamari (bläckfiskringar)', category: 'Skaldjur', brands: 'Bläckfisk', nutriments: { 'energy-kcal_100g': 92, proteins_100g: 16, carbohydrates_100g: 3, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0151', product_name: 'Sepia (stor bläckfisk)', category: 'Skaldjur', brands: 'Bläckfisk', nutriments: { 'energy-kcal_100g': 79, proteins_100g: 16, carbohydrates_100g: 1, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0152', product_name: 'Bläckfiskbläck', category: 'Skaldjur', brands: 'Bläckfisk', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 5, carbohydrates_100g: 2, fat_100g: 0.5, fiber_100g: 0 }},
  { code: 'cf-0153', product_name: 'Venusmusslor', category: 'Skaldjur', brands: 'Musslor', nutriments: { 'energy-kcal_100g': 74, proteins_100g: 13, carbohydrates_100g: 3, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0154', product_name: 'Helmjölk 3%', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 61, proteins_100g: 3.3, carbohydrates_100g: 4.6, fat_100g: 3.3, fiber_100g: 0 }},
  { code: 'cf-0155', product_name: 'Mellanmjölk 1,5%', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 46, proteins_100g: 3.4, carbohydrates_100g: 4.8, fat_100g: 1.5, fiber_100g: 0 }},
  { code: 'cf-0156', product_name: 'Lättmjölk 0,5%', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 38, proteins_100g: 3.5, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 0 }},
  { code: 'cf-0157', product_name: 'Minimjölk 0,1%', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 3.5, carbohydrates_100g: 5, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0158', product_name: 'Vispgrädde 40%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 370, proteins_100g: 2, carbohydrates_100g: 3, fat_100g: 40, fiber_100g: 0 }},
  { code: 'cf-0159', product_name: 'Matlagningsgrädde 15%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 162, proteins_100g: 3, carbohydrates_100g: 4, fat_100g: 15, fiber_100g: 0 }},
  { code: 'cf-0160', product_name: 'Kaffegraädde 12%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 134, proteins_100g: 3, carbohydrates_100g: 4, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0161', product_name: 'Crème fraiche 34%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 2.5, carbohydrates_100g: 3, fat_100g: 34, fiber_100g: 0 }},
  { code: 'cf-0162', product_name: 'Crème fraiche lätt 15%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 162, proteins_100g: 3, carbohydrates_100g: 4, fat_100g: 15, fiber_100g: 0 }},
  { code: 'cf-0163', product_name: 'Gräddfil 12%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 128, proteins_100g: 3.5, carbohydrates_100g: 4, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0164', product_name: 'Smetana 20%', category: 'Mejeri', brands: 'Grädde', nutriments: { 'energy-kcal_100g': 210, proteins_100g: 2.5, carbohydrates_100g: 3, fat_100g: 20, fiber_100g: 0 }},
  { code: 'cf-0165', product_name: 'Filmjölk 3%', category: 'Mejeri', brands: 'Fil', nutriments: { 'energy-kcal_100g': 58, proteins_100g: 3.5, carbohydrates_100g: 4, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0166', product_name: 'Kärnmjölk', category: 'Mejeri', brands: 'Fil', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 3.3, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 0 }},
  { code: 'cf-0167', product_name: 'A-fil', category: 'Mejeri', brands: 'Fil', nutriments: { 'energy-kcal_100g': 61, proteins_100g: 4, carbohydrates_100g: 4, fat_100g: 3.5, fiber_100g: 0 }},
  { code: 'cf-0168', product_name: 'Långfil', category: 'Mejeri', brands: 'Fil', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 3.5, carbohydrates_100g: 4.5, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0169', product_name: 'Kvarg naturell', category: 'Mejeri', brands: 'Kvarg', nutriments: { 'energy-kcal_100g': 66, proteins_100g: 12, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 0 }},
  { code: 'cf-0170', product_name: 'Grekisk yoghurt 10%', category: 'Mejeri', brands: 'Yoghurt', nutriments: { 'energy-kcal_100g': 133, proteins_100g: 5, carbohydrates_100g: 4, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0171', product_name: 'Turkisk yoghurt 10%', category: 'Mejeri', brands: 'Yoghurt', nutriments: { 'energy-kcal_100g': 127, proteins_100g: 4, carbohydrates_100g: 4, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0172', product_name: 'Naturell yoghurt 3%', category: 'Mejeri', brands: 'Yoghurt', nutriments: { 'energy-kcal_100g': 63, proteins_100g: 4, carbohydrates_100g: 5, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0173', product_name: 'Laktosfri mjölk 3%', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 61, proteins_100g: 3.3, carbohydrates_100g: 4.6, fat_100g: 3.3, fiber_100g: 0 }},
  { code: 'cf-0174', product_name: 'Kondenserad mjölk osötad', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 134, proteins_100g: 7, carbohydrates_100g: 10, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0175', product_name: 'Kondenserad mjölk sötad', category: 'Mejeri', brands: 'Mjölk', nutriments: { 'energy-kcal_100g': 321, proteins_100g: 8, carbohydrates_100g: 54, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0176', product_name: 'Smör 80%', category: 'Mejeri - Smör', brands: 'Smör', nutriments: { 'energy-kcal_100g': 720, proteins_100g: 0.6, carbohydrates_100g: 0.5, fat_100g: 80, fiber_100g: 0 }},
  { code: 'cf-0177', product_name: 'Smör osaltat 82%', category: 'Mejeri - Smör', brands: 'Smör', nutriments: { 'energy-kcal_100g': 738, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 82, fiber_100g: 0 }},
  { code: 'cf-0178', product_name: 'Bregott', category: 'Mejeri - Smör', brands: 'Smör', nutriments: { 'energy-kcal_100g': 540, proteins_100g: 0.4, carbohydrates_100g: 0.4, fat_100g: 60, fiber_100g: 0 }},
  { code: 'cf-0179', product_name: 'Klarat smör (ghee)', category: 'Mejeri - Smör', brands: 'Smör', nutriments: { 'energy-kcal_100g': 900, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0180', product_name: 'Nöismör (noisette)', category: 'Mejeri - Smör', brands: 'Smör', nutriments: { 'energy-kcal_100g': 720, proteins_100g: 0.6, carbohydrates_100g: 0.5, fat_100g: 80, fiber_100g: 0 }},
  { code: 'cf-0181', product_name: 'Västerbottensost', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 390, proteins_100g: 28, carbohydrates_100g: 0, fat_100g: 31, fiber_100g: 0 }},
  { code: 'cf-0182', product_name: 'Prästost', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 26, carbohydrates_100g: 0, fat_100g: 27, fiber_100g: 0 }},
  { code: 'cf-0183', product_name: 'Herrgårdsost', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 26, carbohydrates_100g: 0, fat_100g: 27, fiber_100g: 0 }},
  { code: 'cf-0184', product_name: 'Grevé', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 27, carbohydrates_100g: 0, fat_100g: 26, fiber_100g: 0 }},
  { code: 'cf-0185', product_name: 'Parmesan (Parmigiano-Reggiano)', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 431, proteins_100g: 38, carbohydrates_100g: 4, fat_100g: 29, fiber_100g: 0 }},
  { code: 'cf-0186', product_name: 'Pecorino Romano', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 387, proteins_100g: 32, carbohydrates_100g: 4, fat_100g: 27, fiber_100g: 0 }},
  { code: 'cf-0187', product_name: 'Grana Padano', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 392, proteins_100g: 33, carbohydrates_100g: 0, fat_100g: 28, fiber_100g: 0 }},
  { code: 'cf-0188', product_name: 'Gruyère', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 413, proteins_100g: 30, carbohydrates_100g: 0, fat_100g: 32, fiber_100g: 0 }},
  { code: 'cf-0189', product_name: 'Emmentaler', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 380, proteins_100g: 29, carbohydrates_100g: 0, fat_100g: 30, fiber_100g: 0 }},
  { code: 'cf-0190', product_name: 'Manchego', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 376, proteins_100g: 25, carbohydrates_100g: 1, fat_100g: 30, fiber_100g: 0 }},
  { code: 'cf-0191', product_name: 'Cheddar lagrad', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 403, proteins_100g: 25, carbohydrates_100g: 1, fat_100g: 33, fiber_100g: 0 }},
  { code: 'cf-0192', product_name: 'Mozzarella', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 22, carbohydrates_100g: 2, fat_100g: 21, fiber_100g: 0 }},
  { code: 'cf-0193', product_name: 'Mozzarella di Bufala', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 288, proteins_100g: 18, carbohydrates_100g: 2, fat_100g: 23, fiber_100g: 0 }},
  { code: 'cf-0194', product_name: 'Burrata', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 233, proteins_100g: 15, carbohydrates_100g: 3, fat_100g: 18, fiber_100g: 0 }},
  { code: 'cf-0195', product_name: 'Ricotta', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 174, proteins_100g: 11, carbohydrates_100g: 3, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0196', product_name: 'Mascarpone', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 429, proteins_100g: 4, carbohydrates_100g: 4, fat_100g: 44, fiber_100g: 0 }},
  { code: 'cf-0197', product_name: 'Fetaost', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 264, proteins_100g: 14, carbohydrates_100g: 4, fat_100g: 21, fiber_100g: 0 }},
  { code: 'cf-0198', product_name: 'Halloumi', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 321, proteins_100g: 22, carbohydrates_100g: 3, fat_100g: 25, fiber_100g: 0 }},
  { code: 'cf-0199', product_name: 'Chèvre (getost)', category: 'Mejeri - Ost', brands: 'Getost', nutriments: { 'energy-kcal_100g': 364, proteins_100g: 22, carbohydrates_100g: 1, fat_100g: 30, fiber_100g: 0 }},
  { code: 'cf-0200', product_name: 'Brie', category: 'Mejeri - Ost', brands: 'Mjukost', nutriments: { 'energy-kcal_100g': 334, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 28, fiber_100g: 0 }},
  { code: 'cf-0201', product_name: 'Camembert', category: 'Mejeri - Ost', brands: 'Mjukost', nutriments: { 'energy-kcal_100g': 299, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 24, fiber_100g: 0 }},
  { code: 'cf-0202', product_name: 'Gorgonzola', category: 'Mejeri - Ost', brands: 'Mögelost', nutriments: { 'energy-kcal_100g': 353, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 29, fiber_100g: 0 }},
  { code: 'cf-0203', product_name: 'Roquefort', category: 'Mejeri - Ost', brands: 'Mögelost', nutriments: { 'energy-kcal_100g': 369, proteins_100g: 22, carbohydrates_100g: 2, fat_100g: 31, fiber_100g: 0 }},
  { code: 'cf-0204', product_name: 'Stilton', category: 'Mejeri - Ost', brands: 'Mögelost', nutriments: { 'energy-kcal_100g': 410, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 35, fiber_100g: 0 }},
  { code: 'cf-0205', product_name: 'Taleggio', category: 'Mejeri - Ost', brands: 'Mjukost', nutriments: { 'energy-kcal_100g': 315, proteins_100g: 19, carbohydrates_100g: 1, fat_100g: 26, fiber_100g: 0 }},
  { code: 'cf-0206', product_name: 'Fontina', category: 'Mejeri - Ost', brands: 'Mjukost', nutriments: { 'energy-kcal_100g': 389, proteins_100g: 26, carbohydrates_100g: 1, fat_100g: 31, fiber_100g: 0 }},
  { code: 'cf-0207', product_name: 'Comté', category: 'Mejeri - Ost', brands: 'Hårdost', nutriments: { 'energy-kcal_100g': 413, proteins_100g: 27, carbohydrates_100g: 0, fat_100g: 34, fiber_100g: 0 }},
  { code: 'cf-0208', product_name: 'Lagrad getost', category: 'Mejeri - Ost', brands: 'Getost', nutriments: { 'energy-kcal_100g': 375, proteins_100g: 25, carbohydrates_100g: 1, fat_100g: 30, fiber_100g: 0 }},
  { code: 'cf-0209', product_name: 'Philadelphiaost', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 6, carbohydrates_100g: 4, fat_100g: 24, fiber_100g: 0 }},
  { code: 'cf-0210', product_name: 'Kesella naturell', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 12, carbohydrates_100g: 3, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0211', product_name: 'Cottage cheese', category: 'Mejeri - Ost', brands: 'Färskost', nutriments: { 'energy-kcal_100g': 98, proteins_100g: 11, carbohydrates_100g: 3, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0212', product_name: 'Ägg (hela)', category: 'Ägg', brands: 'Ägg', nutriments: { 'energy-kcal_100g': 143, proteins_100g: 13, carbohydrates_100g: 1, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0213', product_name: 'Äggula', category: 'Ägg', brands: 'Ägg', nutriments: { 'energy-kcal_100g': 322, proteins_100g: 16, carbohydrates_100g: 1, fat_100g: 27, fiber_100g: 0 }},
  { code: 'cf-0214', product_name: 'Äggvita', category: 'Ägg', brands: 'Ägg', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 11, carbohydrates_100g: 1, fat_100g: 0.2, fiber_100g: 0 }},
  { code: 'cf-0215', product_name: 'Vaktelägg', category: 'Ägg', brands: 'Ägg', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 13, carbohydrates_100g: 0.5, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0216', product_name: 'Ankaägg', category: 'Ägg', brands: 'Ägg', nutriments: { 'energy-kcal_100g': 185, proteins_100g: 13, carbohydrates_100g: 1, fat_100g: 14, fiber_100g: 0 }},
  { code: 'cf-0217', product_name: 'Gåsägg', category: 'Ägg', brands: 'Ägg', nutriments: { 'energy-kcal_100g': 185, proteins_100g: 14, carbohydrates_100g: 1, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0218', product_name: 'Gul lök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1.1, carbohydrates_100g: 9, fat_100g: 0.1, fiber_100g: 1.7 }},
  { code: 'cf-0219', product_name: 'Röd lök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1.1, carbohydrates_100g: 9, fat_100g: 0.1, fiber_100g: 1.7 }},
  { code: 'cf-0220', product_name: 'Schalottenlök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 72, proteins_100g: 2.5, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 3.2 }},
  { code: 'cf-0221', product_name: 'Purjolök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 61, proteins_100g: 1.5, carbohydrates_100g: 14, fat_100g: 0.3, fiber_100g: 1.8 }},
  { code: 'cf-0222', product_name: 'Salladslök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 1.8, carbohydrates_100g: 7, fat_100g: 0.2, fiber_100g: 2.6 }},
  { code: 'cf-0223', product_name: 'Gräslök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 3.3, carbohydrates_100g: 4, fat_100g: 0.7, fiber_100g: 2.5 }},
  { code: 'cf-0224', product_name: 'Vitlök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 149, proteins_100g: 6.4, carbohydrates_100g: 33, fat_100g: 0.5, fiber_100g: 2.1 }},
  { code: 'cf-0225', product_name: 'Svart vitlök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 143, proteins_100g: 6, carbohydrates_100g: 32, fat_100g: 0.5, fiber_100g: 2 }},
  { code: 'cf-0226', product_name: 'Ramslök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0227', product_name: 'Perlök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 1.8, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0228', product_name: 'Tomat', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0229', product_name: 'Körsbärstomat', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 1 }},
  { code: 'cf-0230', product_name: 'Plommontomat', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0231', product_name: 'Soltorkade tomater', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 258, proteins_100g: 14, carbohydrates_100g: 43, fat_100g: 3, fiber_100g: 12.3 }},
  { code: 'cf-0232', product_name: 'Röd paprika', category: 'Grönsaker', brands: 'Paprika', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.3, fiber_100g: 2.1 }},
  { code: 'cf-0233', product_name: 'Gul paprika', category: 'Grönsaker', brands: 'Paprika', nutriments: { 'energy-kcal_100g': 27, proteins_100g: 1, carbohydrates_100g: 5, fat_100g: 0.2, fiber_100g: 1.7 }},
  { code: 'cf-0234', product_name: 'Grön paprika', category: 'Grönsaker', brands: 'Paprika', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 0.9, carbohydrates_100g: 4.6, fat_100g: 0.2, fiber_100g: 1.7 }},
  { code: 'cf-0235', product_name: 'Orange paprika', category: 'Grönsaker', brands: 'Paprika', nutriments: { 'energy-kcal_100g': 28, proteins_100g: 1, carbohydrates_100g: 5.5, fat_100g: 0.2, fiber_100g: 1.8 }},
  { code: 'cf-0236', product_name: 'Spetspaprika', category: 'Grönsaker', brands: 'Paprika', nutriments: { 'energy-kcal_100g': 26, proteins_100g: 1, carbohydrates_100g: 5, fat_100g: 0.2, fiber_100g: 1.8 }},
  { code: 'cf-0237', product_name: 'Chili röd färsk', category: 'Grönsaker', brands: 'Chili', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1.9, carbohydrates_100g: 9, fat_100g: 0.4, fiber_100g: 1.5 }},
  { code: 'cf-0238', product_name: 'Chili grön färsk', category: 'Grönsaker', brands: 'Chili', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1.9, carbohydrates_100g: 9, fat_100g: 0.4, fiber_100g: 1.5 }},
  { code: 'cf-0239', product_name: 'Habanero', category: 'Grönsaker', brands: 'Chili', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 2, carbohydrates_100g: 9, fat_100g: 0.4, fiber_100g: 1.5 }},
  { code: 'cf-0240', product_name: 'Jalapeño färsk', category: 'Grönsaker', brands: 'Chili', nutriments: { 'energy-kcal_100g': 29, proteins_100g: 0.9, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 2.8 }},
  { code: 'cf-0241', product_name: 'Chipotle torkad', category: 'Grönsaker', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0242', product_name: 'Sallad (isbergssallad)', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 14, proteins_100g: 0.9, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 1.2 }},
  { code: 'cf-0243', product_name: 'Romansallad', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 1.2, carbohydrates_100g: 3.3, fat_100g: 0.3, fiber_100g: 2.1 }},
  { code: 'cf-0244', product_name: 'Ruccola', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 2.6, carbohydrates_100g: 3.7, fat_100g: 0.7, fiber_100g: 1.6 }},
  { code: 'cf-0245', product_name: 'Spenat färsk', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 2.9, carbohydrates_100g: 3.6, fat_100g: 0.4, fiber_100g: 2.2 }},
  { code: 'cf-0246', product_name: 'Mangold', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 19, proteins_100g: 1.8, carbohydrates_100g: 3.7, fat_100g: 0.2, fiber_100g: 1.6 }},
  { code: 'cf-0247', product_name: 'Grönkål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 49, proteins_100g: 4.3, carbohydrates_100g: 9, fat_100g: 0.9, fiber_100g: 3.6 }},
  { code: 'cf-0248', product_name: 'Svartkål (cavolo nero)', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 3.3, carbohydrates_100g: 6, fat_100g: 0.6, fiber_100g: 2.5 }},
  { code: 'cf-0249', product_name: 'Pak choi', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 13, proteins_100g: 1.5, carbohydrates_100g: 2.2, fat_100g: 0.2, fiber_100g: 1 }},
  { code: 'cf-0250', product_name: 'Koriander färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 2.1, carbohydrates_100g: 3.7, fat_100g: 0.5, fiber_100g: 2.8 }},
  { code: 'cf-0251', product_name: 'Persilja färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 36, proteins_100g: 3, carbohydrates_100g: 6.3, fat_100g: 0.8, fiber_100g: 3.3 }},
  { code: 'cf-0252', product_name: 'Dill färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 3.5, carbohydrates_100g: 7, fat_100g: 1.1, fiber_100g: 2.1 }},
  { code: 'cf-0253', product_name: 'Basilika färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 3.2, carbohydrates_100g: 2.7, fat_100g: 0.6, fiber_100g: 1.6 }},
  { code: 'cf-0254', product_name: 'Mynta färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 44, proteins_100g: 3.3, carbohydrates_100g: 8.4, fat_100g: 0.7, fiber_100g: 6.8 }},
  { code: 'cf-0255', product_name: 'Oregano färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 265, proteins_100g: 9, carbohydrates_100g: 69, fat_100g: 4, fiber_100g: 43 }},
  { code: 'cf-0256', product_name: 'Rosmarin färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 131, proteins_100g: 3.3, carbohydrates_100g: 21, fat_100g: 5.9, fiber_100g: 14 }},
  { code: 'cf-0257', product_name: 'Timjan färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 101, proteins_100g: 5.6, carbohydrates_100g: 24, fat_100g: 1.7, fiber_100g: 14 }},
  { code: 'cf-0258', product_name: 'Salvia färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 315, proteins_100g: 11, carbohydrates_100g: 61, fat_100g: 13, fiber_100g: 40 }},
  { code: 'cf-0259', product_name: 'Estragon färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 295, proteins_100g: 23, carbohydrates_100g: 50, fat_100g: 7, fiber_100g: 7 }},
  { code: 'cf-0260', product_name: 'Citronmeliss färsk', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 26, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 2 }},
  { code: 'cf-0261', product_name: 'Vitkål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 1.3, carbohydrates_100g: 6, fat_100g: 0.1, fiber_100g: 2.5 }},
  { code: 'cf-0262', product_name: 'Rödkål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1.4, carbohydrates_100g: 7, fat_100g: 0.2, fiber_100g: 2.1 }},
  { code: 'cf-0263', product_name: 'Blomkål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 1.9, carbohydrates_100g: 5, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0264', product_name: 'Broccoli', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 2.8, carbohydrates_100g: 7, fat_100g: 0.4, fiber_100g: 2.6 }},
  { code: 'cf-0265', product_name: 'Brysselkål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 3.4, carbohydrates_100g: 9, fat_100g: 0.3, fiber_100g: 3.8 }},
  { code: 'cf-0266', product_name: 'Spetskål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 24, proteins_100g: 1.4, carbohydrates_100g: 5.4, fat_100g: 0.1, fiber_100g: 2.3 }},
  { code: 'cf-0267', product_name: 'Savoykål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 27, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 0.1, fiber_100g: 3.1 }},
  { code: 'cf-0268', product_name: 'Broccolini', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 3, carbohydrates_100g: 7, fat_100g: 0.5, fiber_100g: 3 }},
  { code: 'cf-0269', product_name: 'Romanesco', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 0.3, fiber_100g: 2.5 }},
  { code: 'cf-0270', product_name: 'Kinakål', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 16, proteins_100g: 1.2, carbohydrates_100g: 3.2, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0271', product_name: 'Kålrabbi', category: 'Grönsaker', brands: 'Kål', nutriments: { 'energy-kcal_100g': 27, proteins_100g: 1.7, carbohydrates_100g: 6, fat_100g: 0.1, fiber_100g: 3.6 }},
  { code: 'cf-0272', product_name: 'Gurka', category: 'Grönsaker', brands: 'Gurka', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 0.7, carbohydrates_100g: 3.6, fat_100g: 0.1, fiber_100g: 0.5 }},
  { code: 'cf-0273', product_name: 'Minigurka', category: 'Grönsaker', brands: 'Gurka', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 0.7, carbohydrates_100g: 3.6, fat_100g: 0.1, fiber_100g: 0.5 }},
  { code: 'cf-0274', product_name: 'Zucchini grön', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 1.2, carbohydrates_100g: 3.1, fat_100g: 0.3, fiber_100g: 1 }},
  { code: 'cf-0275', product_name: 'Zucchini gul', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 1.2, carbohydrates_100g: 3.1, fat_100g: 0.3, fiber_100g: 1 }},
  { code: 'cf-0276', product_name: 'Aubergine', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 3 }},
  { code: 'cf-0277', product_name: 'Butternutpumpa', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 45, proteins_100g: 1, carbohydrates_100g: 12, fat_100g: 0.1, fiber_100g: 2 }},
  { code: 'cf-0278', product_name: 'Hokkaido pumpa', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 26, proteins_100g: 1, carbohydrates_100g: 6.5, fat_100g: 0.1, fiber_100g: 1.5 }},
  { code: 'cf-0279', product_name: 'Muskatpumpa', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 26, proteins_100g: 1, carbohydrates_100g: 6.5, fat_100g: 0.1, fiber_100g: 0.5 }},
  { code: 'cf-0280', product_name: 'Spagettisquash', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 0.6, carbohydrates_100g: 7, fat_100g: 0.6, fiber_100g: 1.5 }},
  { code: 'cf-0281', product_name: 'Patisson (ufo-squash)', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 1 }},
  { code: 'cf-0282', product_name: 'Potatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 77, proteins_100g: 2, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 2.2 }},
  { code: 'cf-0283', product_name: 'Kokt potatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 87, proteins_100g: 1.9, carbohydrates_100g: 20, fat_100g: 0.1, fiber_100g: 1.8 }},
  { code: 'cf-0284', product_name: 'Mandelpotatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 2, carbohydrates_100g: 16, fat_100g: 0.1, fiber_100g: 2 }},
  { code: 'cf-0285', product_name: 'Färskpotatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 2, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 2 }},
  { code: 'cf-0286', product_name: 'Sötpotatis', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 86, proteins_100g: 1.6, carbohydrates_100g: 20, fat_100g: 0.1, fiber_100g: 3 }},
  { code: 'cf-0287', product_name: 'Morot', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 41, proteins_100g: 0.9, carbohydrates_100g: 10, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'cf-0288', product_name: 'Palsternacka', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 75, proteins_100g: 1.2, carbohydrates_100g: 18, fat_100g: 0.3, fiber_100g: 4.9 }},
  { code: 'cf-0289', product_name: 'Persiljerot', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 55, proteins_100g: 2.3, carbohydrates_100g: 12, fat_100g: 0.6, fiber_100g: 4 }},
  { code: 'cf-0290', product_name: 'Rotselleri', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 42, proteins_100g: 1.5, carbohydrates_100g: 9, fat_100g: 0.3, fiber_100g: 1.8 }},
  { code: 'cf-0291', product_name: 'Kålrot (rotabagga)', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 38, proteins_100g: 1.1, carbohydrates_100g: 9, fat_100g: 0.2, fiber_100g: 2.3 }},
  { code: 'cf-0292', product_name: 'Rova', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 28, proteins_100g: 0.9, carbohydrates_100g: 6, fat_100g: 0.1, fiber_100g: 1.8 }},
  { code: 'cf-0293', product_name: 'Rödbeta', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 1.6, carbohydrates_100g: 10, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'cf-0294', product_name: 'Polkabetor', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 1.6, carbohydrates_100g: 10, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'cf-0295', product_name: 'Rädisa', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 16, proteins_100g: 0.7, carbohydrates_100g: 3.4, fat_100g: 0.1, fiber_100g: 1.6 }},
  { code: 'cf-0296', product_name: 'Svart rättika', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 0.1, fiber_100g: 1.5 }},
  { code: 'cf-0297', product_name: 'Jordärtskocka', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 73, proteins_100g: 2, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 1.6 }},
  { code: 'cf-0298', product_name: 'Ingefära färsk', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 1.8, carbohydrates_100g: 18, fat_100g: 0.8, fiber_100g: 2 }},
  { code: 'cf-0299', product_name: 'Gurkmeja färsk', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 354, proteins_100g: 8, carbohydrates_100g: 65, fat_100g: 10, fiber_100g: 21 }},
  { code: 'cf-0300', product_name: 'Pepparrot', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 48, proteins_100g: 1.2, carbohydrates_100g: 11, fat_100g: 0.7, fiber_100g: 3.3 }},
  { code: 'cf-0301', product_name: 'Lotusrot', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 74, proteins_100g: 2.6, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 4.9 }},
  { code: 'cf-0302', product_name: 'Sparris grön', category: 'Grönsaker', brands: 'Sparris', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 2.2, carbohydrates_100g: 3.9, fat_100g: 0.1, fiber_100g: 2.1 }},
  { code: 'cf-0303', product_name: 'Sparris vit', category: 'Grönsaker', brands: 'Sparris', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 2.2, carbohydrates_100g: 3.9, fat_100g: 0.1, fiber_100g: 2.1 }},
  { code: 'cf-0304', product_name: 'Böngroddar (mungböna)', category: 'Grönsaker', brands: 'Groddar', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 3.2, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 1.8 }},
  { code: 'cf-0305', product_name: 'Alfalfagroddar', category: 'Grönsaker', brands: 'Groddar', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 4, carbohydrates_100g: 2, fat_100g: 0.7, fiber_100g: 1.9 }},
  { code: 'cf-0306', product_name: 'Kronärtskocka', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 3.3, carbohydrates_100g: 11, fat_100g: 0.2, fiber_100g: 5.4 }},
  { code: 'cf-0307', product_name: 'Fänkål', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1.2, carbohydrates_100g: 7, fat_100g: 0.2, fiber_100g: 3.1 }},
  { code: 'cf-0308', product_name: 'Blekselleri', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 16, proteins_100g: 0.7, carbohydrates_100g: 3, fat_100g: 0.2, fiber_100g: 1.6 }},
  { code: 'cf-0309', product_name: 'Ärtskott', category: 'Grönsaker', brands: 'Groddar', nutriments: { 'energy-kcal_100g': 42, proteins_100g: 4, carbohydrates_100g: 8, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0310', product_name: 'Sockertår (sockerärtor)', category: 'Grönsaker', brands: 'Ärtor', nutriments: { 'energy-kcal_100g': 42, proteins_100g: 3, carbohydrates_100g: 7.5, fat_100g: 0.2, fiber_100g: 2.6 }},
  { code: 'cf-0311', product_name: 'Haricots verts (gröna bönor)', category: 'Grönsaker', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1.8, carbohydrates_100g: 7, fat_100g: 0.1, fiber_100g: 3.4 }},
  { code: 'cf-0312', product_name: 'Vaxbönor', category: 'Grönsaker', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 2, carbohydrates_100g: 8, fat_100g: 0.1, fiber_100g: 3 }},
  { code: 'cf-0313', product_name: 'Majs (färsk kolv)', category: 'Grönsaker', brands: 'Majs', nutriments: { 'energy-kcal_100g': 86, proteins_100g: 3.3, carbohydrates_100g: 19, fat_100g: 1.4, fiber_100g: 2.7 }},
  { code: 'cf-0314', product_name: 'Majskorn', category: 'Grönsaker', brands: 'Majs', nutriments: { 'energy-kcal_100g': 86, proteins_100g: 3.3, carbohydrates_100g: 19, fat_100g: 1.4, fiber_100g: 2.7 }},
  { code: 'cf-0315', product_name: 'Okra', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 33, proteins_100g: 1.9, carbohydrates_100g: 7, fat_100g: 0.2, fiber_100g: 3.2 }},
  { code: 'cf-0316', product_name: 'Bambuskott', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 27, proteins_100g: 2.6, carbohydrates_100g: 5, fat_100g: 0.3, fiber_100g: 2.2 }},
  { code: 'cf-0317', product_name: 'Vattkastanj', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 1.4, carbohydrates_100g: 24, fat_100g: 0.1, fiber_100g: 3 }},
  { code: 'cf-0318', product_name: 'Daikon (japansk rättika)', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.6, carbohydrates_100g: 4, fat_100g: 0.1, fiber_100g: 1.6 }},
  { code: 'cf-0319', product_name: 'Champinjoner vita', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 22, proteins_100g: 3.1, carbohydrates_100g: 3.3, fat_100g: 0.3, fiber_100g: 1 }},
  { code: 'cf-0320', product_name: 'Champinjoner bruna', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 22, proteins_100g: 2.5, carbohydrates_100g: 4, fat_100g: 0.3, fiber_100g: 1 }},
  { code: 'cf-0321', product_name: 'Portobello', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 22, proteins_100g: 2.1, carbohydrates_100g: 4, fat_100g: 0.4, fiber_100g: 1.3 }},
  { code: 'cf-0322', product_name: 'Shiitake färsk', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 2.2, carbohydrates_100g: 7, fat_100g: 0.5, fiber_100g: 2.5 }},
  { code: 'cf-0323', product_name: 'Shiitake torkad', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 296, proteins_100g: 9.6, carbohydrates_100g: 75, fat_100g: 1, fiber_100g: 11.5 }},
  { code: 'cf-0324', product_name: 'Ostronskivling', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 33, proteins_100g: 3.3, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 2.3 }},
  { code: 'cf-0325', product_name: 'Kungsmussling (king oyster)', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 3.5, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 2 }},
  { code: 'cf-0326', product_name: 'Kantarell', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 38, proteins_100g: 1.5, carbohydrates_100g: 7, fat_100g: 0.5, fiber_100g: 3.8 }},
  { code: 'cf-0327', product_name: 'Trattkantarell', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 0.3, fiber_100g: 3 }},
  { code: 'cf-0328', product_name: 'Karl-Johan (stensopp)', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 3.7, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 2.5 }},
  { code: 'cf-0329', product_name: 'Murklor', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 3.1, carbohydrates_100g: 5, fat_100g: 0.6, fiber_100g: 2.8 }},
  { code: 'cf-0330', product_name: 'Tryffel svart', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 92, proteins_100g: 6, carbohydrates_100g: 13, fat_100g: 0.5, fiber_100g: 9 }},
  { code: 'cf-0331', product_name: 'Tryffel vit', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 6, carbohydrates_100g: 15, fat_100g: 0.5, fiber_100g: 8 }},
  { code: 'cf-0332', product_name: 'Enoki', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 37, proteins_100g: 2.7, carbohydrates_100g: 7, fat_100g: 0.3, fiber_100g: 2.7 }},
  { code: 'cf-0333', product_name: 'Majssvamp (huitlacoche)', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 24, proteins_100g: 2.5, carbohydrates_100g: 4, fat_100g: 0.3, fiber_100g: 1 }},
  { code: 'cf-0334', product_name: 'Torkad svamp (blandning)', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 9, carbohydrates_100g: 65, fat_100g: 2, fiber_100g: 10 }},
  { code: 'cf-0335', product_name: 'Citron', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 29, proteins_100g: 1.1, carbohydrates_100g: 9, fat_100g: 0.3, fiber_100g: 2.8 }},
  { code: 'cf-0336', product_name: 'Lime', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 0.7, carbohydrates_100g: 11, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'cf-0337', product_name: 'Apelsin', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 0.9, carbohydrates_100g: 12, fat_100g: 0.1, fiber_100g: 2.4 }},
  { code: 'cf-0338', product_name: 'Blodapelsin', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 1, carbohydrates_100g: 12, fat_100g: 0.2, fiber_100g: 2.5 }},
  { code: 'cf-0339', product_name: 'Mandarin', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 53, proteins_100g: 0.8, carbohydrates_100g: 13, fat_100g: 0.3, fiber_100g: 1.8 }},
  { code: 'cf-0340', product_name: 'Clementin', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 0.8, carbohydrates_100g: 12, fat_100g: 0.2, fiber_100g: 1.7 }},
  { code: 'cf-0341', product_name: 'Grapefrukt', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 42, proteins_100g: 0.8, carbohydrates_100g: 11, fat_100g: 0.1, fiber_100g: 1.6 }},
  { code: 'cf-0342', product_name: 'Pomelo', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 38, proteins_100g: 0.8, carbohydrates_100g: 10, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0343', product_name: 'Yuzu', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 0.8, carbohydrates_100g: 7, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0344', product_name: 'Bergamott', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 36, proteins_100g: 0.6, carbohydrates_100g: 9, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0345', product_name: 'Citronskal', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 1.5, carbohydrates_100g: 16, fat_100g: 0.3, fiber_100g: 10.6 }},
  { code: 'cf-0346', product_name: 'Apelsinskal', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 1.5, carbohydrates_100g: 25, fat_100g: 0.2, fiber_100g: 10.6 }},
  { code: 'cf-0347', product_name: 'Kaffir lime blad', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 2, carbohydrates_100g: 8, fat_100g: 0.5, fiber_100g: 4 }},
  { code: 'cf-0348', product_name: 'Aprikos', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 48, proteins_100g: 1.4, carbohydrates_100g: 11, fat_100g: 0.4, fiber_100g: 2 }},
  { code: 'cf-0349', product_name: 'Persika', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 39, proteins_100g: 0.9, carbohydrates_100g: 10, fat_100g: 0.3, fiber_100g: 1.5 }},
  { code: 'cf-0350', product_name: 'Nektarin', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 44, proteins_100g: 1.1, carbohydrates_100g: 11, fat_100g: 0.3, fiber_100g: 1.7 }},
  { code: 'cf-0351', product_name: 'Plommon', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 46, proteins_100g: 0.7, carbohydrates_100g: 11, fat_100g: 0.3, fiber_100g: 1.4 }},
  { code: 'cf-0352', product_name: 'Körsbär', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 63, proteins_100g: 1.1, carbohydrates_100g: 16, fat_100g: 0.2, fiber_100g: 2.1 }},
  { code: 'cf-0353', product_name: 'Mango', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 60, proteins_100g: 0.8, carbohydrates_100g: 15, fat_100g: 0.4, fiber_100g: 1.6 }},
  { code: 'cf-0354', product_name: 'Äpple', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 0.3, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 2.4 }},
  { code: 'cf-0355', product_name: 'Päron', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.4, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 3.1 }},
  { code: 'cf-0356', product_name: 'Kvitten', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.4, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 1.9 }},
  { code: 'cf-0357', product_name: 'Jordgubbar', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 0.7, carbohydrates_100g: 8, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0358', product_name: 'Hallon', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 1.2, carbohydrates_100g: 12, fat_100g: 0.7, fiber_100g: 6.5 }},
  { code: 'cf-0359', product_name: 'Blåbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.7, carbohydrates_100g: 14, fat_100g: 0.3, fiber_100g: 2.4 }},
  { code: 'cf-0360', product_name: 'Björnbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 1.4, carbohydrates_100g: 10, fat_100g: 0.5, fiber_100g: 5.3 }},
  { code: 'cf-0361', product_name: 'Svarta vinbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 63, proteins_100g: 1.4, carbohydrates_100g: 15, fat_100g: 0.4, fiber_100g: 4 }},
  { code: 'cf-0362', product_name: 'Röda vinbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 56, proteins_100g: 1.4, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 4.3 }},
  { code: 'cf-0363', product_name: 'Krusbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 44, proteins_100g: 0.9, carbohydrates_100g: 10, fat_100g: 0.6, fiber_100g: 4.3 }},
  { code: 'cf-0364', product_name: 'Tranbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 46, proteins_100g: 0.4, carbohydrates_100g: 12, fat_100g: 0.1, fiber_100g: 4.6 }},
  { code: 'cf-0365', product_name: 'Lingon', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 41, proteins_100g: 0.4, carbohydrates_100g: 9, fat_100g: 0.5, fiber_100g: 2.5 }},
  { code: 'cf-0366', product_name: 'Hjortron', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 51, proteins_100g: 1.7, carbohydrates_100g: 9, fat_100g: 0.8, fiber_100g: 5.3 }},
  { code: 'cf-0367', product_name: 'Havtorn', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 1.2, carbohydrates_100g: 10, fat_100g: 5, fiber_100g: 4.5 }},
  { code: 'cf-0368', product_name: 'Aronia', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 1.4, carbohydrates_100g: 10, fat_100g: 0.5, fiber_100g: 5.3 }},
  { code: 'cf-0369', product_name: 'Physalis', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 53, proteins_100g: 1.9, carbohydrates_100g: 11, fat_100g: 0.7, fiber_100g: 2 }},
  { code: 'cf-0370', product_name: 'Banan', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 89, proteins_100g: 1.1, carbohydrates_100g: 23, fat_100g: 0.3, fiber_100g: 2.6 }},
  { code: 'cf-0371', product_name: 'Ananas', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 0.5, carbohydrates_100g: 13, fat_100g: 0.1, fiber_100g: 1.4 }},
  { code: 'cf-0372', product_name: 'Papaya', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 0.5, carbohydrates_100g: 11, fat_100g: 0.3, fiber_100g: 1.7 }},
  { code: 'cf-0373', product_name: 'Passionsfrukt', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 2.2, carbohydrates_100g: 23, fat_100g: 0.7, fiber_100g: 10.4 }},
  { code: 'cf-0374', product_name: 'Granatäpple', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 83, proteins_100g: 1.7, carbohydrates_100g: 19, fat_100g: 1.2, fiber_100g: 4 }},
  { code: 'cf-0375', product_name: 'Kiwi', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 61, proteins_100g: 1.1, carbohydrates_100g: 15, fat_100g: 0.5, fiber_100g: 3 }},
  { code: 'cf-0376', product_name: 'Fikon färska', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 74, proteins_100g: 0.8, carbohydrates_100g: 19, fat_100g: 0.3, fiber_100g: 2.9 }},
  { code: 'cf-0377', product_name: 'Dadlar färska', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 2.4, carbohydrates_100g: 75, fat_100g: 0.4, fiber_100g: 8 }},
  { code: 'cf-0378', product_name: 'Kokos färsk', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 354, proteins_100g: 3.3, carbohydrates_100g: 15, fat_100g: 33, fiber_100g: 9 }},
  { code: 'cf-0379', product_name: 'Lychee', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 66, proteins_100g: 0.8, carbohydrates_100g: 17, fat_100g: 0.4, fiber_100g: 1.3 }},
  { code: 'cf-0380', product_name: 'Rambutan', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 68, proteins_100g: 0.7, carbohydrates_100g: 18, fat_100g: 0.2, fiber_100g: 0.9 }},
  { code: 'cf-0381', product_name: 'Dragonfrukt (pitaya)', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 1.2, carbohydrates_100g: 11, fat_100g: 0.4, fiber_100g: 3 }},
  { code: 'cf-0382', product_name: 'Tamarind', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 239, proteins_100g: 2.8, carbohydrates_100g: 63, fat_100g: 0.6, fiber_100g: 5.1 }},
  { code: 'cf-0383', product_name: 'Vattenmelon', category: 'Frukt', brands: 'Melon', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 0.6, carbohydrates_100g: 8, fat_100g: 0.2, fiber_100g: 0.4 }},
  { code: 'cf-0384', product_name: 'Honungsmelon', category: 'Frukt', brands: 'Melon', nutriments: { 'energy-kcal_100g': 36, proteins_100g: 0.5, carbohydrates_100g: 9, fat_100g: 0.1, fiber_100g: 0.8 }},
  { code: 'cf-0385', product_name: 'Cantaloupmelon', category: 'Frukt', brands: 'Melon', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 0.8, carbohydrates_100g: 8, fat_100g: 0.2, fiber_100g: 0.9 }},
  { code: 'cf-0386', product_name: 'Galiamellon', category: 'Frukt', brands: 'Melon', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 0.8, carbohydrates_100g: 8, fat_100g: 0.2, fiber_100g: 0.8 }},
  { code: 'cf-0387', product_name: 'Vindruvor gröna', category: 'Frukt', brands: 'Druvor', nutriments: { 'energy-kcal_100g': 67, proteins_100g: 0.6, carbohydrates_100g: 17, fat_100g: 0.4, fiber_100g: 0.9 }},
  { code: 'cf-0388', product_name: 'Vindruvor röda', category: 'Frukt', brands: 'Druvor', nutriments: { 'energy-kcal_100g': 69, proteins_100g: 0.7, carbohydrates_100g: 18, fat_100g: 0.2, fiber_100g: 0.9 }},
  { code: 'cf-0389', product_name: 'Vindruvor blå', category: 'Frukt', brands: 'Druvor', nutriments: { 'energy-kcal_100g': 67, proteins_100g: 0.6, carbohydrates_100g: 17, fat_100g: 0.3, fiber_100g: 0.9 }},
  { code: 'cf-0390', product_name: 'Russin', category: 'Frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 299, proteins_100g: 3.1, carbohydrates_100g: 79, fat_100g: 0.5, fiber_100g: 3.7 }},
  { code: 'cf-0391', product_name: 'Torkade aprikoser', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 241, proteins_100g: 3.4, carbohydrates_100g: 63, fat_100g: 0.5, fiber_100g: 7.3 }},
  { code: 'cf-0392', product_name: 'Torkade fikon', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 249, proteins_100g: 3.3, carbohydrates_100g: 64, fat_100g: 0.9, fiber_100g: 9.8 }},
  { code: 'cf-0393', product_name: 'Torkade dadlar', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 2.4, carbohydrates_100g: 75, fat_100g: 0.4, fiber_100g: 8 }},
  { code: 'cf-0394', product_name: 'Torkade tranbär', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 308, proteins_100g: 0.1, carbohydrates_100g: 82, fat_100g: 1.4, fiber_100g: 5.7 }},
  { code: 'cf-0395', product_name: 'Torkade plommon (katrinplommon)', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 240, proteins_100g: 2.2, carbohydrates_100g: 64, fat_100g: 0.4, fiber_100g: 7.1 }},
  { code: 'cf-0396', product_name: 'Gojibär torkade', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 349, proteins_100g: 14, carbohydrates_100g: 77, fat_100g: 0.4, fiber_100g: 13 }},
  { code: 'cf-0397', product_name: 'Korintter', category: 'Torkad frukt', brands: 'Torkad frukt', nutriments: { 'energy-kcal_100g': 283, proteins_100g: 2.5, carbohydrates_100g: 74, fat_100g: 0.3, fiber_100g: 4 }},
  { code: 'cf-0398', product_name: 'Svartpeppar malen', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 251, proteins_100g: 10, carbohydrates_100g: 64, fat_100g: 3, fiber_100g: 25 }},
  { code: 'cf-0399', product_name: 'Svartpeppar hel', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 251, proteins_100g: 10, carbohydrates_100g: 64, fat_100g: 3, fiber_100g: 25 }},
  { code: 'cf-0400', product_name: 'Vitpeppar', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 296, proteins_100g: 10, carbohydrates_100g: 69, fat_100g: 2, fiber_100g: 26 }},
  { code: 'cf-0401', product_name: 'Grönpeppar', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 251, proteins_100g: 10, carbohydrates_100g: 64, fat_100g: 3, fiber_100g: 25 }},
  { code: 'cf-0402', product_name: 'Sichuanpeppar', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 375, proteins_100g: 10, carbohydrates_100g: 70, fat_100g: 6, fiber_100g: 17 }},
  { code: 'cf-0403', product_name: 'Rosa peppar', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 330, proteins_100g: 6, carbohydrates_100g: 70, fat_100g: 5, fiber_100g: 20 }},
  { code: 'cf-0404', product_name: 'Långpeppar', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 380, proteins_100g: 11, carbohydrates_100g: 65, fat_100g: 10, fiber_100g: 20 }},
  { code: 'cf-0405', product_name: 'Kanel malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 247, proteins_100g: 4, carbohydrates_100g: 81, fat_100g: 1, fiber_100g: 53 }},
  { code: 'cf-0406', product_name: 'Kanelstång', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 247, proteins_100g: 4, carbohydrates_100g: 81, fat_100g: 1, fiber_100g: 53 }},
  { code: 'cf-0407', product_name: 'Kardemumma malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 311, proteins_100g: 11, carbohydrates_100g: 68, fat_100g: 7, fiber_100g: 28 }},
  { code: 'cf-0408', product_name: 'Kardemumma hel', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 311, proteins_100g: 11, carbohydrates_100g: 68, fat_100g: 7, fiber_100g: 28 }},
  { code: 'cf-0409', product_name: 'Kryddnejlika malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 274, proteins_100g: 6, carbohydrates_100g: 66, fat_100g: 13, fiber_100g: 34 }},
  { code: 'cf-0410', product_name: 'Kryddnejlika hel', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 274, proteins_100g: 6, carbohydrates_100g: 66, fat_100g: 13, fiber_100g: 34 }},
  { code: 'cf-0411', product_name: 'Muskot malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 525, proteins_100g: 6, carbohydrates_100g: 49, fat_100g: 36, fiber_100g: 21 }},
  { code: 'cf-0412', product_name: 'Muskot hel', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 525, proteins_100g: 6, carbohydrates_100g: 49, fat_100g: 36, fiber_100g: 21 }},
  { code: 'cf-0413', product_name: 'Muskotsblomma', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 475, proteins_100g: 6, carbohydrates_100g: 50, fat_100g: 32, fiber_100g: 20 }},
  { code: 'cf-0414', product_name: 'Kummin', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 375, proteins_100g: 18, carbohydrates_100g: 44, fat_100g: 22, fiber_100g: 11 }},
  { code: 'cf-0415', product_name: 'Korianderfrö', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 298, proteins_100g: 12, carbohydrates_100g: 55, fat_100g: 18, fiber_100g: 42 }},
  { code: 'cf-0416', product_name: 'Fänkålsfrö', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 345, proteins_100g: 16, carbohydrates_100g: 52, fat_100g: 15, fiber_100g: 40 }},
  { code: 'cf-0417', product_name: 'Anis', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 337, proteins_100g: 18, carbohydrates_100g: 50, fat_100g: 16, fiber_100g: 15 }},
  { code: 'cf-0418', product_name: 'Stjärnanis', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 337, proteins_100g: 18, carbohydrates_100g: 50, fat_100g: 16, fiber_100g: 15 }},
  { code: 'cf-0419', product_name: 'Ingefära malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 9, carbohydrates_100g: 72, fat_100g: 5, fiber_100g: 14 }},
  { code: 'cf-0420', product_name: 'Gurkmeja malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 354, proteins_100g: 8, carbohydrates_100g: 65, fat_100g: 10, fiber_100g: 21 }},
  { code: 'cf-0421', product_name: 'Paprikapulver', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 14, carbohydrates_100g: 54, fat_100g: 13, fiber_100g: 35 }},
  { code: 'cf-0422', product_name: 'Paprikapulver rökt', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 14, carbohydrates_100g: 54, fat_100g: 13, fiber_100g: 35 }},
  { code: 'cf-0423', product_name: 'Cayennepeppar', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 318, proteins_100g: 12, carbohydrates_100g: 57, fat_100g: 17, fiber_100g: 27 }},
  { code: 'cf-0424', product_name: 'Chilipulver', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 14, carbohydrates_100g: 50, fat_100g: 14, fiber_100g: 35 }},
  { code: 'cf-0425', product_name: 'Chiliflingor', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 314, proteins_100g: 12, carbohydrates_100g: 50, fat_100g: 17, fiber_100g: 28 }},
  { code: 'cf-0426', product_name: 'Saffran', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 310, proteins_100g: 11, carbohydrates_100g: 65, fat_100g: 6, fiber_100g: 4 }},
  { code: 'cf-0427', product_name: 'Oregano torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 265, proteins_100g: 9, carbohydrates_100g: 69, fat_100g: 4, fiber_100g: 43 }},
  { code: 'cf-0428', product_name: 'Timjan torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 276, proteins_100g: 9, carbohydrates_100g: 64, fat_100g: 7, fiber_100g: 37 }},
  { code: 'cf-0429', product_name: 'Rosmarin torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 331, proteins_100g: 5, carbohydrates_100g: 64, fat_100g: 15, fiber_100g: 43 }},
  { code: 'cf-0430', product_name: 'Basilika torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 233, proteins_100g: 14, carbohydrates_100g: 48, fat_100g: 4, fiber_100g: 38 }},
  { code: 'cf-0431', product_name: 'Salvia torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 315, proteins_100g: 11, carbohydrates_100g: 61, fat_100g: 13, fiber_100g: 40 }},
  { code: 'cf-0432', product_name: 'Lagerblad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 313, proteins_100g: 8, carbohydrates_100g: 75, fat_100g: 8, fiber_100g: 26 }},
  { code: 'cf-0433', product_name: 'Dill torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 253, proteins_100g: 20, carbohydrates_100g: 42, fat_100g: 4, fiber_100g: 14 }},
  { code: 'cf-0434', product_name: 'Persilja torkad', category: 'Kryddor', brands: 'Örter', nutriments: { 'energy-kcal_100g': 292, proteins_100g: 27, carbohydrates_100g: 50, fat_100g: 5, fiber_100g: 27 }},
  { code: 'cf-0435', product_name: 'Senapsfrö gula', category: 'Kryddor', brands: 'Senap', nutriments: { 'energy-kcal_100g': 508, proteins_100g: 26, carbohydrates_100g: 28, fat_100g: 36, fiber_100g: 12 }},
  { code: 'cf-0436', product_name: 'Senapsfrö svarta', category: 'Kryddor', brands: 'Senap', nutriments: { 'energy-kcal_100g': 508, proteins_100g: 26, carbohydrates_100g: 28, fat_100g: 36, fiber_100g: 12 }},
  { code: 'cf-0437', product_name: 'Senapspulver', category: 'Kryddor', brands: 'Senap', nutriments: { 'energy-kcal_100g': 508, proteins_100g: 26, carbohydrates_100g: 28, fat_100g: 36, fiber_100g: 12 }},
  { code: 'cf-0438', product_name: 'Dillfrö', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 305, proteins_100g: 16, carbohydrates_100g: 55, fat_100g: 15, fiber_100g: 21 }},
  { code: 'cf-0439', product_name: 'Sellerisalt', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0440', product_name: 'Vitlökspulver', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 331, proteins_100g: 17, carbohydrates_100g: 73, fat_100g: 1, fiber_100g: 9 }},
  { code: 'cf-0441', product_name: 'Lökpulver', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 341, proteins_100g: 10, carbohydrates_100g: 79, fat_100g: 1, fiber_100g: 15 }},
  { code: 'cf-0442', product_name: 'Sumak', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 2, carbohydrates_100g: 20, fat_100g: 2, fiber_100g: 10 }},
  { code: 'cf-0443', product_name: 'Zaatar', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 200, proteins_100g: 6, carbohydrates_100g: 30, fat_100g: 8, fiber_100g: 8 }},
  { code: 'cf-0444', product_name: 'Berbere', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 10, carbohydrates_100g: 52, fat_100g: 12, fiber_100g: 20 }},
  { code: 'cf-0445', product_name: 'Ras el hanout', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 8, carbohydrates_100g: 50, fat_100g: 10, fiber_100g: 15 }},
  { code: 'cf-0446', product_name: 'Garam masala', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 379, proteins_100g: 13, carbohydrates_100g: 60, fat_100g: 15, fiber_100g: 22 }},
  { code: 'cf-0447', product_name: 'Curry malen', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 325, proteins_100g: 14, carbohydrates_100g: 58, fat_100g: 14, fiber_100g: 33 }},
  { code: 'cf-0448', product_name: 'Currypasta röd', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 88, proteins_100g: 2, carbohydrates_100g: 9, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0449', product_name: 'Currypasta grön', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 2, carbohydrates_100g: 10, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0450', product_name: 'Currypasta gul', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 2, carbohydrates_100g: 10, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0451', product_name: 'Massaman currypasta', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 3, carbohydrates_100g: 12, fat_100g: 8, fiber_100g: 3 }},
  { code: 'cf-0452', product_name: 'Allkrydda malen', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 263, proteins_100g: 6, carbohydrates_100g: 72, fat_100g: 9, fiber_100g: 22 }},
  { code: 'cf-0453', product_name: 'Krossad spiskummin', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 375, proteins_100g: 18, carbohydrates_100g: 44, fat_100g: 22, fiber_100g: 11 }},
  { code: 'cf-0454', product_name: 'Citronpeppar', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 8, carbohydrates_100g: 55, fat_100g: 10, fiber_100g: 15 }},
  { code: 'cf-0455', product_name: 'Vaniljpulver', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 288, proteins_100g: 0, carbohydrates_100g: 13, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0456', product_name: 'Vaniljstång', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 288, proteins_100g: 0, carbohydrates_100g: 13, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0457', product_name: 'Sojasås mörk', category: 'Såser', brands: 'Soja', nutriments: { 'energy-kcal_100g': 53, proteins_100g: 6, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0458', product_name: 'Sojasås ljus', category: 'Såser', brands: 'Soja', nutriments: { 'energy-kcal_100g': 53, proteins_100g: 6, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0459', product_name: 'Tamari', category: 'Såser', brands: 'Soja', nutriments: { 'energy-kcal_100g': 60, proteins_100g: 10, carbohydrates_100g: 6, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0460', product_name: 'Miso vit', category: 'Såser', brands: 'Miso', nutriments: { 'energy-kcal_100g': 199, proteins_100g: 12, carbohydrates_100g: 26, fat_100g: 6, fiber_100g: 5 }},
  { code: 'cf-0461', product_name: 'Miso röd', category: 'Såser', brands: 'Miso', nutriments: { 'energy-kcal_100g': 199, proteins_100g: 12, carbohydrates_100g: 26, fat_100g: 6, fiber_100g: 5 }},
  { code: 'cf-0462', product_name: 'Miso mörk (hatcho)', category: 'Såser', brands: 'Miso', nutriments: { 'energy-kcal_100g': 207, proteins_100g: 18, carbohydrates_100g: 15, fat_100g: 9, fiber_100g: 8 }},
  { code: 'cf-0463', product_name: 'Fisksås', category: 'Såser', brands: 'Asiatisk sås', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 5, carbohydrates_100g: 4, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0464', product_name: 'Ostronsås', category: 'Såser', brands: 'Asiatisk sås', nutriments: { 'energy-kcal_100g': 51, proteins_100g: 1, carbohydrates_100g: 11, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0465', product_name: 'Hoisinsås', category: 'Såser', brands: 'Asiatisk sås', nutriments: { 'energy-kcal_100g': 220, proteins_100g: 3, carbohydrates_100g: 44, fat_100g: 4, fiber_100g: 2 }},
  { code: 'cf-0466', product_name: 'Sriracha', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 93, proteins_100g: 2, carbohydrates_100g: 19, fat_100g: 1, fiber_100g: 1 }},
  { code: 'cf-0467', product_name: 'Gochujang', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 170, proteins_100g: 4, carbohydrates_100g: 35, fat_100g: 1, fiber_100g: 3 }},
  { code: 'cf-0468', product_name: 'Sambal oelek', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1, carbohydrates_100g: 7, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0469', product_name: 'Harissa', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 2, carbohydrates_100g: 8, fat_100g: 4, fiber_100g: 3 }},
  { code: 'cf-0470', product_name: 'Chipotle i adobo', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1, carbohydrates_100g: 7, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0471', product_name: 'Tabasco', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 12, proteins_100g: 1, carbohydrates_100g: 1, fat_100g: 0, fiber_100g: 1 }},
  { code: 'cf-0472', product_name: 'Worcestershiresås', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 78, proteins_100g: 0, carbohydrates_100g: 19, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0473', product_name: 'Balsamvinäger', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 88, proteins_100g: 0, carbohydrates_100g: 17, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0474', product_name: 'Vinäger vit', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 21, proteins_100g: 0, carbohydrates_100g: 0.5, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0475', product_name: 'Äppelcidervinäger', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 21, proteins_100g: 0, carbohydrates_100g: 1, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0476', product_name: 'Rödvinsvinäger', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 19, proteins_100g: 0, carbohydrates_100g: 0.3, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0477', product_name: 'Vitvinsvinäger', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 19, proteins_100g: 0, carbohydrates_100g: 0.3, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0478', product_name: 'Risvinäger', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0, carbohydrates_100g: 0.2, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0479', product_name: 'Sherryvingäger', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 0, carbohydrates_100g: 1, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0480', product_name: 'Tahini', category: 'Såser', brands: 'Nötpasta', nutriments: { 'energy-kcal_100g': 595, proteins_100g: 17, carbohydrates_100g: 21, fat_100g: 54, fiber_100g: 9 }},
  { code: 'cf-0481', product_name: 'Senap dijon', category: 'Såser', brands: 'Senap', nutriments: { 'energy-kcal_100g': 66, proteins_100g: 4, carbohydrates_100g: 5, fat_100g: 4, fiber_100g: 3 }},
  { code: 'cf-0482', product_name: 'Senap grov', category: 'Såser', brands: 'Senap', nutriments: { 'energy-kcal_100g': 83, proteins_100g: 5, carbohydrates_100g: 6, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0483', product_name: 'Senap söt (skånsk)', category: 'Såser', brands: 'Senap', nutriments: { 'energy-kcal_100g': 150, proteins_100g: 4, carbohydrates_100g: 20, fat_100g: 6, fiber_100g: 2 }},
  { code: 'cf-0484', product_name: 'Majonnäs', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 680, proteins_100g: 1, carbohydrates_100g: 1, fat_100g: 75, fiber_100g: 0 }},
  { code: 'cf-0485', product_name: 'Ketchup', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 112, proteins_100g: 1, carbohydrates_100g: 26, fat_100g: 0.2, fiber_100g: 0.3 }},
  { code: 'cf-0486', product_name: 'Tomatpuré', category: 'Såser', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 4, carbohydrates_100g: 19, fat_100g: 0.5, fiber_100g: 4 }},
  { code: 'cf-0487', product_name: 'Krossade tomater', category: 'Såser', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 1.5, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 1.5 }},
  { code: 'cf-0488', product_name: 'Passerade tomater', category: 'Såser', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 24, proteins_100g: 1, carbohydrates_100g: 5, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0489', product_name: 'Tomatpasta', category: 'Såser', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 4, carbohydrates_100g: 19, fat_100g: 0.5, fiber_100g: 4 }},
  { code: 'cf-0490', product_name: 'Soltorkade tomater i olja', category: 'Såser', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 213, proteins_100g: 5, carbohydrates_100g: 24, fat_100g: 12, fiber_100g: 6 }},
  { code: 'cf-0491', product_name: 'Kapris', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 0.9, fiber_100g: 3 }},
  { code: 'cf-0492', product_name: 'Cornichoner', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 14, proteins_100g: 0.5, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0493', product_name: 'Oliver gröna', category: 'Såser', brands: 'Oliver', nutriments: { 'energy-kcal_100g': 145, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 15, fiber_100g: 3 }},
  { code: 'cf-0494', product_name: 'Oliver svarta (kalamata)', category: 'Såser', brands: 'Oliver', nutriments: { 'energy-kcal_100g': 115, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 11, fiber_100g: 3 }},
  { code: 'cf-0495', product_name: 'Ättiksgurka', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 11, proteins_100g: 0.3, carbohydrates_100g: 2.3, fat_100g: 0.1, fiber_100g: 0.5 }},
  { code: 'cf-0496', product_name: 'Inlagd rödlök', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 38, proteins_100g: 1, carbohydrates_100g: 9, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0497', product_name: 'Kimchi', category: 'Såser', brands: 'Fermenterat', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 1, carbohydrates_100g: 2, fat_100g: 0.5, fiber_100g: 1.5 }},
  { code: 'cf-0498', product_name: 'Surkål', category: 'Såser', brands: 'Fermenterat', nutriments: { 'energy-kcal_100g': 19, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 0.1, fiber_100g: 3 }},
  { code: 'cf-0499', product_name: 'Mirin', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 241, proteins_100g: 0, carbohydrates_100g: 51, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0500', product_name: 'Sake för matlagning', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 134, proteins_100g: 0.5, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0501', product_name: 'Dashi (pulver)', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 220, proteins_100g: 40, carbohydrates_100g: 5, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0502', product_name: 'Kokuomami (umamipasta)', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 6, carbohydrates_100g: 8, fat_100g: 3, fiber_100g: 1 }},
  { code: 'cf-0503', product_name: 'Ponzu', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 55, proteins_100g: 3, carbohydrates_100g: 8, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0504', product_name: 'Olivolja extra virgin', category: 'Oljor & fetter', brands: 'Olivolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0505', product_name: 'Olivolja för stekning', category: 'Oljor & fetter', brands: 'Olivolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0506', product_name: 'Rapsolja', category: 'Oljor & fetter', brands: 'Matolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0507', product_name: 'Solrosolja', category: 'Oljor & fetter', brands: 'Matolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0508', product_name: 'Majsolja', category: 'Oljor & fetter', brands: 'Matolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0509', product_name: 'Jordnötsolja', category: 'Oljor & fetter', brands: 'Matolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0510', product_name: 'Sesamolja mörk', category: 'Oljor & fetter', brands: 'Sesamolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0511', product_name: 'Sesamolja ljus', category: 'Oljor & fetter', brands: 'Sesamolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0512', product_name: 'Valnötsolja', category: 'Oljor & fetter', brands: 'Nötolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0513', product_name: 'Hasselnötsolja', category: 'Oljor & fetter', brands: 'Nötolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0514', product_name: 'Avokadoolja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0515', product_name: 'Tryffelolja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0516', product_name: 'Kokosolja', category: 'Oljor & fetter', brands: 'Kokosolja', nutriments: { 'energy-kcal_100g': 892, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 99, fiber_100g: 0 }},
  { code: 'cf-0517', product_name: 'Kokosfett', category: 'Oljor & fetter', brands: 'Kokosolja', nutriments: { 'energy-kcal_100g': 892, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 99, fiber_100g: 0 }},
  { code: 'cf-0518', product_name: 'Druvkärnolja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0519', product_name: 'Linfrödsolja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0520', product_name: 'Chiliolja', category: 'Oljor & fetter', brands: 'Smaksatt olja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0521', product_name: 'Vitlöksolja', category: 'Oljor & fetter', brands: 'Smaksatt olja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0522', product_name: 'Citronolja', category: 'Oljor & fetter', brands: 'Smaksatt olja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0523', product_name: 'Gåsfett', category: 'Oljor & fetter', brands: 'Animaliskt fett', nutriments: { 'energy-kcal_100g': 900, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0524', product_name: 'Talg (nötfett)', category: 'Oljor & fetter', brands: 'Animaliskt fett', nutriments: { 'energy-kcal_100g': 902, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0525', product_name: 'Ister', category: 'Oljor & fetter', brands: 'Animaliskt fett', nutriments: { 'energy-kcal_100g': 902, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0526', product_name: 'Torkad pasta', category: 'Pasta & nudlar', brands: 'Pasta', nutriments: { 'energy-kcal_100g': 371, proteins_100g: 13, carbohydrates_100g: 75, fat_100g: 2, fiber_100g: 3 }},
  { code: 'cf-0540', product_name: 'Färsk pasta', category: 'Pasta & nudlar', brands: 'Pasta', nutriments: { 'energy-kcal_100g': 270, proteins_100g: 10, carbohydrates_100g: 50, fat_100g: 3, fiber_100g: 2 }},
  { code: 'cf-0541', product_name: 'Äggpasta torr', category: 'Pasta & nudlar', brands: 'Pasta', nutriments: { 'energy-kcal_100g': 380, proteins_100g: 14, carbohydrates_100g: 72, fat_100g: 4, fiber_100g: 3 }},
  { code: 'cf-0542', product_name: 'Helkornspasta torr', category: 'Pasta & nudlar', brands: 'Pasta', nutriments: { 'energy-kcal_100g': 348, proteins_100g: 14, carbohydrates_100g: 66, fat_100g: 3, fiber_100g: 8 }},
  { code: 'cf-0535', product_name: 'Lasagneplattor', category: 'Pasta & nudlar', brands: 'Pasta', nutriments: { 'energy-kcal_100g': 371, proteins_100g: 13, carbohydrates_100g: 75, fat_100g: 2, fiber_100g: 3 }},
  { code: 'cf-0538', product_name: 'Gnocchi', category: 'Pasta & nudlar', brands: 'Pasta', nutriments: { 'energy-kcal_100g': 163, proteins_100g: 4, carbohydrates_100g: 35, fat_100g: 0.5, fiber_100g: 2 }},
  { code: 'cf-0543', product_name: 'Risnudlar', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 360, proteins_100g: 3, carbohydrates_100g: 83, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0544', product_name: 'Glasnudlar', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 334, proteins_100g: 0, carbohydrates_100g: 83, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0545', product_name: 'Udonnudlar', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 338, proteins_100g: 7, carbohydrates_100g: 73, fat_100g: 0.5, fiber_100g: 2 }},
  { code: 'cf-0546', product_name: 'Sobanudar', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 336, proteins_100g: 14, carbohydrates_100g: 74, fat_100g: 1, fiber_100g: 5 }},
  { code: 'cf-0547', product_name: 'Ramennudlar', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 436, proteins_100g: 10, carbohydrates_100g: 62, fat_100g: 17, fiber_100g: 2 }},
  { code: 'cf-0548', product_name: 'Vermicelli', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 360, proteins_100g: 3, carbohydrates_100g: 83, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0549', product_name: 'Chow mein-nudlar', category: 'Pasta & nudlar', brands: 'Nudlar', nutriments: { 'energy-kcal_100g': 430, proteins_100g: 10, carbohydrates_100g: 60, fat_100g: 16, fiber_100g: 2 }},
  { code: 'cf-0550', product_name: 'Jasminris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 365, proteins_100g: 7, carbohydrates_100g: 80, fat_100g: 1, fiber_100g: 1 }},
  { code: 'cf-0551', product_name: 'Basmatiris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 354, proteins_100g: 9, carbohydrates_100g: 77, fat_100g: 1, fiber_100g: 1 }},
  { code: 'cf-0552', product_name: 'Långkornigt ris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 365, proteins_100g: 7, carbohydrates_100g: 80, fat_100g: 1, fiber_100g: 1 }},
  { code: 'cf-0553', product_name: 'Rundkornigt ris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 358, proteins_100g: 7, carbohydrates_100g: 79, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0554', product_name: 'Sushiris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 358, proteins_100g: 7, carbohydrates_100g: 79, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0555', product_name: 'Arboriris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 356, proteins_100g: 7, carbohydrates_100g: 79, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0556', product_name: 'Carnaroli (risottoris)', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 358, proteins_100g: 7, carbohydrates_100g: 79, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0557', product_name: 'Vialone Nano', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 356, proteins_100g: 7, carbohydrates_100g: 79, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0558', product_name: 'Fullkornsris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 362, proteins_100g: 8, carbohydrates_100g: 76, fat_100g: 3, fiber_100g: 4 }},
  { code: 'cf-0559', product_name: 'Röd ris (Camargue)', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 352, proteins_100g: 8, carbohydrates_100g: 72, fat_100g: 3, fiber_100g: 4 }},
  { code: 'cf-0560', product_name: 'Vild ris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 357, proteins_100g: 15, carbohydrates_100g: 75, fat_100g: 1, fiber_100g: 6 }},
  { code: 'cf-0561', product_name: 'Svart ris (Venere)', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 356, proteins_100g: 9, carbohydrates_100g: 75, fat_100g: 3, fiber_100g: 3 }},
  { code: 'cf-0562', product_name: 'Parboiled ris', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 366, proteins_100g: 7, carbohydrates_100g: 81, fat_100g: 1, fiber_100g: 1 }},
  { code: 'cf-0563', product_name: 'Risflingor', category: 'Ris', brands: 'Ris', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 7, carbohydrates_100g: 80, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0564', product_name: 'Vetemjöl (all-purpose)', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 364, proteins_100g: 10, carbohydrates_100g: 76, fat_100g: 1, fiber_100g: 3 }},
  { code: 'cf-0565', product_name: 'Vetemjöl starkt (manitoba)', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 357, proteins_100g: 13, carbohydrates_100g: 73, fat_100g: 2, fiber_100g: 3 }},
  { code: 'cf-0566', product_name: 'Vetemjöl svagt', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 361, proteins_100g: 9, carbohydrates_100g: 77, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0567', product_name: 'Grahamsmjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 13, carbohydrates_100g: 65, fat_100g: 2, fiber_100g: 11 }},
  { code: 'cf-0568', product_name: 'Fullkornsmjöl vete', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 13, carbohydrates_100g: 65, fat_100g: 2, fiber_100g: 11 }},
  { code: 'cf-0569', product_name: 'Rågsikt', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 9, carbohydrates_100g: 70, fat_100g: 2, fiber_100g: 8 }},
  { code: 'cf-0570', product_name: 'Rågmjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 325, proteins_100g: 10, carbohydrates_100g: 68, fat_100g: 2, fiber_100g: 15 }},
  { code: 'cf-0571', product_name: 'Maizena (majsstärkelse)', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 381, proteins_100g: 0, carbohydrates_100g: 91, fat_100g: 0.1, fiber_100g: 0.5 }},
  { code: 'cf-0572', product_name: 'Potatismjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 357, proteins_100g: 0, carbohydrates_100g: 88, fat_100g: 0, fiber_100g: 0.5 }},
  { code: 'cf-0573', product_name: 'Mandelmjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 571, proteins_100g: 21, carbohydrates_100g: 22, fat_100g: 49, fiber_100g: 11 }},
  { code: 'cf-0574', product_name: 'Kokosmjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 443, proteins_100g: 19, carbohydrates_100g: 59, fat_100g: 15, fiber_100g: 38 }},
  { code: 'cf-0575', product_name: 'Kikärtsmjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 387, proteins_100g: 22, carbohydrates_100g: 58, fat_100g: 7, fiber_100g: 11 }},
  { code: 'cf-0576', product_name: 'Bovete (mald)', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 343, proteins_100g: 13, carbohydrates_100g: 72, fat_100g: 3, fiber_100g: 10 }},
  { code: 'cf-0577', product_name: 'Dinkel mjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 338, proteins_100g: 15, carbohydrates_100g: 68, fat_100g: 2, fiber_100g: 11 }},
  { code: 'cf-0578', product_name: 'Havremjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 385, proteins_100g: 13, carbohydrates_100g: 66, fat_100g: 7, fiber_100g: 10 }},
  { code: 'cf-0579', product_name: 'Semolina (durumvete)', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 360, proteins_100g: 13, carbohydrates_100g: 73, fat_100g: 1, fiber_100g: 4 }},
  { code: 'cf-0580', product_name: 'Tipo 00-mjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 11, carbohydrates_100g: 73, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0581', product_name: 'Havregryn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 379, proteins_100g: 13, carbohydrates_100g: 68, fat_100g: 7, fiber_100g: 10 }},
  { code: 'cf-0582', product_name: 'Korngryn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 354, proteins_100g: 10, carbohydrates_100g: 74, fat_100g: 2, fiber_100g: 17 }},
  { code: 'cf-0583', product_name: 'Pärlgryn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 352, proteins_100g: 10, carbohydrates_100g: 73, fat_100g: 1, fiber_100g: 16 }},
  { code: 'cf-0584', product_name: 'Bulgur', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 342, proteins_100g: 12, carbohydrates_100g: 76, fat_100g: 1, fiber_100g: 18 }},
  { code: 'cf-0585', product_name: 'Couscous', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 376, proteins_100g: 13, carbohydrates_100g: 77, fat_100g: 1, fiber_100g: 5 }},
  { code: 'cf-0586', product_name: 'Quinoa', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 368, proteins_100g: 14, carbohydrates_100g: 64, fat_100g: 6, fiber_100g: 7 }},
  { code: 'cf-0587', product_name: 'Amarant', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 371, proteins_100g: 14, carbohydrates_100g: 66, fat_100g: 7, fiber_100g: 7 }},
  { code: 'cf-0588', product_name: 'Hirs', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 378, proteins_100g: 11, carbohydrates_100g: 73, fat_100g: 4, fiber_100g: 8 }},
  { code: 'cf-0589', product_name: 'Polenta (majsgryn)', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 362, proteins_100g: 8, carbohydrates_100g: 79, fat_100g: 1, fiber_100g: 5 }},
  { code: 'cf-0590', product_name: 'Bovete korn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 343, proteins_100g: 13, carbohydrates_100g: 72, fat_100g: 3, fiber_100g: 10 }},
  { code: 'cf-0591', product_name: 'Farro', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 14, carbohydrates_100g: 72, fat_100g: 2, fiber_100g: 10 }},
  { code: 'cf-0592', product_name: 'Freekeh', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 331, proteins_100g: 13, carbohydrates_100g: 66, fat_100g: 3, fiber_100g: 8 }},
  { code: 'cf-0593', product_name: 'Vetekorn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 327, proteins_100g: 13, carbohydrates_100g: 71, fat_100g: 2, fiber_100g: 12 }},
  { code: 'cf-0594', product_name: 'Rågkorn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 338, proteins_100g: 10, carbohydrates_100g: 76, fat_100g: 2, fiber_100g: 15 }},
  { code: 'cf-0595', product_name: 'Ströbröd', category: 'Spannmål & mjöl', brands: 'Brödkryddor', nutriments: { 'energy-kcal_100g': 395, proteins_100g: 13, carbohydrates_100g: 72, fat_100g: 5, fiber_100g: 4 }},
  { code: 'cf-0596', product_name: 'Panko ströbröd', category: 'Spannmål & mjöl', brands: 'Brödkryddor', nutriments: { 'energy-kcal_100g': 371, proteins_100g: 10, carbohydrates_100g: 76, fat_100g: 2, fiber_100g: 3 }},
  { code: 'cf-0597', product_name: 'Röda linser', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 358, proteins_100g: 24, carbohydrates_100g: 63, fat_100g: 1, fiber_100g: 11 }},
  { code: 'cf-0598', product_name: 'Gröna linser', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 353, proteins_100g: 25, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 31 }},
  { code: 'cf-0599', product_name: 'Bruna linser', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 353, proteins_100g: 25, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 31 }},
  { code: 'cf-0600', product_name: 'Svarta belugalinser', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 352, proteins_100g: 26, carbohydrates_100g: 58, fat_100g: 2, fiber_100g: 11 }},
  { code: 'cf-0601', product_name: 'Puylinser', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 353, proteins_100g: 25, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 11 }},
  { code: 'cf-0602', product_name: 'Kikärtor torkade', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 378, proteins_100g: 20, carbohydrates_100g: 61, fat_100g: 6, fiber_100g: 17 }},
  { code: 'cf-0603', product_name: 'Kikärtor burk', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 119, proteins_100g: 7, carbohydrates_100g: 20, fat_100g: 2, fiber_100g: 5 }},
  { code: 'cf-0604', product_name: 'Vita bönor torkade', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 333, proteins_100g: 21, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0605', product_name: 'Vita bönor burk', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 91, proteins_100g: 6, carbohydrates_100g: 16, fat_100g: 0.5, fiber_100g: 5 }},
  { code: 'cf-0606', product_name: 'Svarta bönor torkade', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 341, proteins_100g: 21, carbohydrates_100g: 62, fat_100g: 1, fiber_100g: 16 }},
  { code: 'cf-0607', product_name: 'Svarta bönor burk', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 91, proteins_100g: 6, carbohydrates_100g: 16, fat_100g: 0.5, fiber_100g: 5 }},
  { code: 'cf-0608', product_name: 'Kidneybönor torkade', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 333, proteins_100g: 24, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0609', product_name: 'Kidneybönor burk', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 105, proteins_100g: 7, carbohydrates_100g: 18, fat_100g: 0.5, fiber_100g: 6 }},
  { code: 'cf-0610', product_name: 'Borlottibönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 23, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 24 }},
  { code: 'cf-0611', product_name: 'Cannellinibönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 333, proteins_100g: 21, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0612', product_name: 'Pintobönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 347, proteins_100g: 21, carbohydrates_100g: 63, fat_100g: 1, fiber_100g: 16 }},
  { code: 'cf-0613', product_name: 'Adzukibönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 329, proteins_100g: 20, carbohydrates_100g: 63, fat_100g: 0.5, fiber_100g: 13 }},
  { code: 'cf-0614', product_name: 'Munggbönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 347, proteins_100g: 24, carbohydrates_100g: 63, fat_100g: 1, fiber_100g: 16 }},
  { code: 'cf-0615', product_name: 'Edamamebönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 122, proteins_100g: 11, carbohydrates_100g: 9, fat_100g: 5, fiber_100g: 5 }},
  { code: 'cf-0616', product_name: 'Stora vita bönor (gigantbönor)', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 333, proteins_100g: 21, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0617', product_name: 'Sojabönor torkade', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 446, proteins_100g: 36, carbohydrates_100g: 30, fat_100g: 20, fiber_100g: 9 }},
  { code: 'cf-0618', product_name: 'Gröna ärtor torkade', category: 'Baljväxter', brands: 'Ärtor', nutriments: { 'energy-kcal_100g': 341, proteins_100g: 24, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0619', product_name: 'Gula ärtor torkade', category: 'Baljväxter', brands: 'Ärtor', nutriments: { 'energy-kcal_100g': 341, proteins_100g: 24, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0620', product_name: 'Frysta ärtor', category: 'Baljväxter', brands: 'Ärtor', nutriments: { 'energy-kcal_100g': 81, proteins_100g: 5, carbohydrates_100g: 14, fat_100g: 0.4, fiber_100g: 5 }},
  { code: 'cf-0621', product_name: 'Mandlar', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 579, proteins_100g: 21, carbohydrates_100g: 22, fat_100g: 50, fiber_100g: 12 }},
  { code: 'cf-0622', product_name: 'Mandlar skalade', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 579, proteins_100g: 21, carbohydrates_100g: 22, fat_100g: 50, fiber_100g: 12 }},
  { code: 'cf-0623', product_name: 'Mandlar rostade', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 598, proteins_100g: 21, carbohydrates_100g: 21, fat_100g: 53, fiber_100g: 11 }},
  { code: 'cf-0624', product_name: 'Mandelspån', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 579, proteins_100g: 21, carbohydrates_100g: 22, fat_100g: 50, fiber_100g: 12 }},
  { code: 'cf-0625', product_name: 'Valnötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 654, proteins_100g: 15, carbohydrates_100g: 14, fat_100g: 65, fiber_100g: 7 }},
  { code: 'cf-0626', product_name: 'Hasselnötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 628, proteins_100g: 15, carbohydrates_100g: 17, fat_100g: 61, fiber_100g: 10 }},
  { code: 'cf-0627', product_name: 'Cashewnötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 553, proteins_100g: 18, carbohydrates_100g: 30, fat_100g: 44, fiber_100g: 3 }},
  { code: 'cf-0628', product_name: 'Pistaschnötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 560, proteins_100g: 20, carbohydrates_100g: 28, fat_100g: 45, fiber_100g: 10 }},
  { code: 'cf-0629', product_name: 'Pinjenötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 673, proteins_100g: 14, carbohydrates_100g: 13, fat_100g: 68, fiber_100g: 4 }},
  { code: 'cf-0630', product_name: 'Macadamianötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 718, proteins_100g: 8, carbohydrates_100g: 14, fat_100g: 76, fiber_100g: 9 }},
  { code: 'cf-0631', product_name: 'Jordnötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 567, proteins_100g: 26, carbohydrates_100g: 16, fat_100g: 49, fiber_100g: 9 }},
  { code: 'cf-0632', product_name: 'Jordnötssmör', category: 'Nötter & frön', brands: 'Nötsmör', nutriments: { 'energy-kcal_100g': 588, proteins_100g: 25, carbohydrates_100g: 20, fat_100g: 50, fiber_100g: 6 }},
  { code: 'cf-0633', product_name: 'Mandelsmör', category: 'Nötter & frön', brands: 'Nötsmör', nutriments: { 'energy-kcal_100g': 614, proteins_100g: 21, carbohydrates_100g: 19, fat_100g: 56, fiber_100g: 10 }},
  { code: 'cf-0634', product_name: 'Pekannötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 691, proteins_100g: 9, carbohydrates_100g: 14, fat_100g: 72, fiber_100g: 10 }},
  { code: 'cf-0635', product_name: 'Paranötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 659, proteins_100g: 14, carbohydrates_100g: 12, fat_100g: 66, fiber_100g: 8 }},
  { code: 'cf-0636', product_name: 'Kokosflingor', category: 'Nötter & frön', brands: 'Kokos', nutriments: { 'energy-kcal_100g': 660, proteins_100g: 7, carbohydrates_100g: 24, fat_100g: 62, fiber_100g: 16 }},
  { code: 'cf-0637', product_name: 'Riven kokos', category: 'Nötter & frön', brands: 'Kokos', nutriments: { 'energy-kcal_100g': 354, proteins_100g: 3, carbohydrates_100g: 15, fat_100g: 33, fiber_100g: 9 }},
  { code: 'cf-0638', product_name: 'Kokosmjölk', category: 'Nötter & frön', brands: 'Kokos', nutriments: { 'energy-kcal_100g': 197, proteins_100g: 2, carbohydrates_100g: 3, fat_100g: 21, fiber_100g: 0 }},
  { code: 'cf-0639', product_name: 'Kokosgrädde', category: 'Nötter & frön', brands: 'Kokos', nutriments: { 'energy-kcal_100g': 330, proteins_100g: 3, carbohydrates_100g: 6, fat_100g: 35, fiber_100g: 0 }},
  { code: 'cf-0640', product_name: 'Solrosfrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 584, proteins_100g: 21, carbohydrates_100g: 20, fat_100g: 51, fiber_100g: 9 }},
  { code: 'cf-0641', product_name: 'Pumpafrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 559, proteins_100g: 30, carbohydrates_100g: 11, fat_100g: 49, fiber_100g: 6 }},
  { code: 'cf-0642', product_name: 'Sesamfrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 573, proteins_100g: 18, carbohydrates_100g: 23, fat_100g: 50, fiber_100g: 12 }},
  { code: 'cf-0643', product_name: 'Sesamfrön svarta', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 573, proteins_100g: 18, carbohydrates_100g: 23, fat_100g: 50, fiber_100g: 12 }},
  { code: 'cf-0644', product_name: 'Linfrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 534, proteins_100g: 18, carbohydrates_100g: 29, fat_100g: 42, fiber_100g: 27 }},
  { code: 'cf-0645', product_name: 'Chiafrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 486, proteins_100g: 17, carbohydrates_100g: 42, fat_100g: 31, fiber_100g: 34 }},
  { code: 'cf-0646', product_name: 'Hampfrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 553, proteins_100g: 32, carbohydrates_100g: 9, fat_100g: 49, fiber_100g: 4 }},
  { code: 'cf-0647', product_name: 'Vallmofrön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 525, proteins_100g: 18, carbohydrates_100g: 28, fat_100g: 42, fiber_100g: 20 }},
  { code: 'cf-0648', product_name: 'Nigella (svartkummin)', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 345, proteins_100g: 16, carbohydrates_100g: 52, fat_100g: 15, fiber_100g: 40 }},
  { code: 'cf-0649', product_name: 'Kycklingbuljong', category: 'Buljong & fond', brands: 'Buljong', nutriments: { 'energy-kcal_100g': 7, proteins_100g: 0.5, carbohydrates_100g: 1, fat_100g: 0.2, fiber_100g: 0 }},
  { code: 'cf-0650', product_name: 'Grönsaksbuljong', category: 'Buljong & fond', brands: 'Buljong', nutriments: { 'energy-kcal_100g': 6, proteins_100g: 0.3, carbohydrates_100g: 1, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0651', product_name: 'Nötköttbuljong', category: 'Buljong & fond', brands: 'Buljong', nutriments: { 'energy-kcal_100g': 8, proteins_100g: 0.6, carbohydrates_100g: 1, fat_100g: 0.3, fiber_100g: 0 }},
  { code: 'cf-0652', product_name: 'Fiskbuljong', category: 'Buljong & fond', brands: 'Buljong', nutriments: { 'energy-kcal_100g': 6, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0653', product_name: 'Kyckling fond', category: 'Buljong & fond', brands: 'Fond', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 2, carbohydrates_100g: 0.5, fat_100g: 0.5, fiber_100g: 0 }},
  { code: 'cf-0654', product_name: 'Kalvfond', category: 'Buljong & fond', brands: 'Fond', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 3, carbohydrates_100g: 0.5, fat_100g: 0.5, fiber_100g: 0 }},
  { code: 'cf-0655', product_name: 'Fiskfond', category: 'Buljong & fond', brands: 'Fond', nutriments: { 'energy-kcal_100g': 12, proteins_100g: 2, carbohydrates_100g: 0.3, fat_100g: 0.3, fiber_100g: 0 }},
  { code: 'cf-0656', product_name: 'Sky (demi-glace)', category: 'Buljong & fond', brands: 'Fond', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 5, carbohydrates_100g: 3, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0657', product_name: 'Glace de viande', category: 'Buljong & fond', brands: 'Fond', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 15, carbohydrates_100g: 5, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0658', product_name: 'Strösocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 0, carbohydrates_100g: 100, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0659', product_name: 'Florsocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 389, proteins_100g: 0, carbohydrates_100g: 100, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0660', product_name: 'Råsocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 399, proteins_100g: 0, carbohydrates_100g: 99, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0661', product_name: 'Farinsocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 380, proteins_100g: 0, carbohydrates_100g: 98, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0662', product_name: 'Muscovadosocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 362, proteins_100g: 0, carbohydrates_100g: 93, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0663', product_name: 'Pärlsocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 0, carbohydrates_100g: 100, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0664', product_name: 'Vaniljsocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 396, proteins_100g: 0, carbohydrates_100g: 99, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0665', product_name: 'Honung', category: 'Sötning', brands: 'Honung', nutriments: { 'energy-kcal_100g': 304, proteins_100g: 0.3, carbohydrates_100g: 82, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0666', product_name: 'Lönnsirap', category: 'Sötning', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 260, proteins_100g: 0, carbohydrates_100g: 67, fat_100g: 0.1, fiber_100g: 0 }},
  { code: 'cf-0667', product_name: 'Ljus sirap', category: 'Sötning', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 319, proteins_100g: 0, carbohydrates_100g: 80, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0668', product_name: 'Mörk sirap', category: 'Sötning', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 290, proteins_100g: 0, carbohydrates_100g: 75, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0669', product_name: 'Agavesirap', category: 'Sötning', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 310, proteins_100g: 0, carbohydrates_100g: 76, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0670', product_name: 'Glukossirap', category: 'Sötning', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 316, proteins_100g: 0, carbohydrates_100g: 79, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0671', product_name: 'Kokossocker', category: 'Sötning', brands: 'Socker', nutriments: { 'energy-kcal_100g': 375, proteins_100g: 0, carbohydrates_100g: 100, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0672', product_name: 'Bakpulver', category: 'Bakvaror', brands: 'Jäsmedel', nutriments: { 'energy-kcal_100g': 53, proteins_100g: 0, carbohydrates_100g: 28, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0673', product_name: 'Bikarbonat', category: 'Bakvaror', brands: 'Jäsmedel', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0674', product_name: 'Torrjäst', category: 'Bakvaror', brands: 'Jäsmedel', nutriments: { 'energy-kcal_100g': 325, proteins_100g: 40, carbohydrates_100g: 41, fat_100g: 7, fiber_100g: 27 }},
  { code: 'cf-0675', product_name: 'Färsk jäst', category: 'Bakvaror', brands: 'Jäsmedel', nutriments: { 'energy-kcal_100g': 105, proteins_100g: 9, carbohydrates_100g: 18, fat_100g: 1, fiber_100g: 7 }},
  { code: 'cf-0676', product_name: 'Gelatinpulver', category: 'Bakvaror', brands: 'Geleringsmedel', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 86, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0677', product_name: 'Gelatinblad', category: 'Bakvaror', brands: 'Geleringsmedel', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 86, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0678', product_name: 'Agar-agar', category: 'Bakvaror', brands: 'Geleringsmedel', nutriments: { 'energy-kcal_100g': 306, proteins_100g: 0, carbohydrates_100g: 81, fat_100g: 0, fiber_100g: 8 }},
  { code: 'cf-0679', product_name: 'Pektin', category: 'Bakvaror', brands: 'Geleringsmedel', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 0, carbohydrates_100g: 90, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0680', product_name: 'Tartarsyra (vinsyra)', category: 'Bakvaror', brands: 'Jäsmedel', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0681', product_name: 'Kakao (osötat)', category: 'Bakvaror', brands: 'Choklad', nutriments: { 'energy-kcal_100g': 228, proteins_100g: 20, carbohydrates_100g: 58, fat_100g: 14, fiber_100g: 33 }},
  { code: 'cf-0682', product_name: 'Choklad mörk 70%', category: 'Bakvaror', brands: 'Choklad', nutriments: { 'energy-kcal_100g': 598, proteins_100g: 8, carbohydrates_100g: 46, fat_100g: 43, fiber_100g: 11 }},
  { code: 'cf-0683', product_name: 'Choklad mjölk', category: 'Bakvaror', brands: 'Choklad', nutriments: { 'energy-kcal_100g': 535, proteins_100g: 8, carbohydrates_100g: 59, fat_100g: 30, fiber_100g: 3 }},
  { code: 'cf-0684', product_name: 'Choklad vit', category: 'Bakvaror', brands: 'Choklad', nutriments: { 'energy-kcal_100g': 539, proteins_100g: 6, carbohydrates_100g: 59, fat_100g: 32, fiber_100g: 0 }},
  { code: 'cf-0685', product_name: 'Kakaonibs', category: 'Bakvaror', brands: 'Choklad', nutriments: { 'energy-kcal_100g': 567, proteins_100g: 12, carbohydrates_100g: 25, fat_100g: 46, fiber_100g: 35 }},
  { code: 'cf-0686', product_name: 'Kakaomassa', category: 'Bakvaror', brands: 'Choklad', nutriments: { 'energy-kcal_100g': 600, proteins_100g: 13, carbohydrates_100g: 29, fat_100g: 54, fiber_100g: 11 }},
  { code: 'cf-0687', product_name: 'Ansjovisfilé (konserv)', category: 'Konserver', brands: 'Fiskkonserv', nutriments: { 'energy-kcal_100g': 210, proteins_100g: 29, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0688', product_name: 'Sardiner i olja', category: 'Konserver', brands: 'Fiskkonserv', nutriments: { 'energy-kcal_100g': 208, proteins_100g: 25, carbohydrates_100g: 0, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0689', product_name: 'Tonfisk i vatten', category: 'Konserver', brands: 'Fiskkonserv', nutriments: { 'energy-kcal_100g': 116, proteins_100g: 26, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0690', product_name: 'Tonfisk i olja', category: 'Konserver', brands: 'Fiskkonserv', nutriments: { 'energy-kcal_100g': 198, proteins_100g: 25, carbohydrates_100g: 0, fat_100g: 11, fiber_100g: 0 }},
  { code: 'cf-0691', product_name: 'Makrillfilé i tomatsås', category: 'Konserver', brands: 'Fiskkonserv', nutriments: { 'energy-kcal_100g': 155, proteins_100g: 14, carbohydrates_100g: 4, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0692', product_name: 'Kokosmjölk (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 197, proteins_100g: 2, carbohydrates_100g: 3, fat_100g: 21, fiber_100g: 0 }},
  { code: 'cf-0693', product_name: 'Bambuskott (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 27, proteins_100g: 2.6, carbohydrates_100g: 5, fat_100g: 0.3, fiber_100g: 2.2 }},
  { code: 'cf-0694', product_name: 'Vattkastanjer (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 97, proteins_100g: 1.4, carbohydrates_100g: 24, fat_100g: 0.1, fiber_100g: 3 }},
  { code: 'cf-0695', product_name: 'Palmhjärtan (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 28, proteins_100g: 3, carbohydrates_100g: 3, fat_100g: 0.6, fiber_100g: 2 }},
  { code: 'cf-0696', product_name: 'Kronärtskockshjärtan (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 0.2, fiber_100g: 3 }},
  { code: 'cf-0697', product_name: 'Jalapeños (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 3 }},
  { code: 'cf-0698', product_name: 'Chipotle i adobo (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1, carbohydrates_100g: 7, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0699', product_name: 'Röd peppar rostad (burk)', category: 'Konserver', brands: 'Växtkonserv', nutriments: { 'energy-kcal_100g': 29, proteins_100g: 1, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 2 }},
  { code: 'cf-0700', product_name: 'Torkade tomater', category: 'Torkade produkter', brands: 'Torkad', nutriments: { 'energy-kcal_100g': 258, proteins_100g: 14, carbohydrates_100g: 43, fat_100g: 3, fiber_100g: 12 }},
  { code: 'cf-0701', product_name: 'Torkad oregano', category: 'Torkade produkter', brands: 'Torkad', nutriments: { 'energy-kcal_100g': 265, proteins_100g: 9, carbohydrates_100g: 69, fat_100g: 4, fiber_100g: 43 }},
  { code: 'cf-0702', product_name: 'Kombu (sjögräs)', category: 'Torkade produkter', brands: 'Sjögräs', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 8, carbohydrates_100g: 9, fat_100g: 1, fiber_100g: 27 }},
  { code: 'cf-0703', product_name: 'Wakame', category: 'Torkade produkter', brands: 'Sjögräs', nutriments: { 'energy-kcal_100g': 45, proteins_100g: 3, carbohydrates_100g: 9, fat_100g: 0.6, fiber_100g: 0.5 }},
  { code: 'cf-0704', product_name: 'Nori', category: 'Torkade produkter', brands: 'Sjögräs', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 6, carbohydrates_100g: 5, fat_100g: 0.3, fiber_100g: 5 }},
  { code: 'cf-0705', product_name: 'Dulse', category: 'Torkade produkter', brands: 'Sjögräs', nutriments: { 'energy-kcal_100g': 247, proteins_100g: 17, carbohydrates_100g: 44, fat_100g: 2, fiber_100g: 7 }},
  { code: 'cf-0706', product_name: 'Bonito flingor (katsuobushi)', category: 'Torkade produkter', brands: 'Torkad fisk', nutriments: { 'energy-kcal_100g': 338, proteins_100g: 77, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0707', product_name: 'Torkad räka', category: 'Torkade produkter', brands: 'Torkad', nutriments: { 'energy-kcal_100g': 255, proteins_100g: 55, carbohydrates_100g: 5, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0708', product_name: 'XO-sås (torkade skaldjur)', category: 'Torkade produkter', brands: 'Specialsås', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 15, carbohydrates_100g: 10, fat_100g: 35, fiber_100g: 0 }},
  { code: 'cf-0709', product_name: 'Kotlettrad (fläsk)', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 185, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 12, fiber_100g: 0 }},
  { code: 'cf-0710', product_name: 'Nackfläsk', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 290, proteins_100g: 15, carbohydrates_100g: 0, fat_100g: 25, fiber_100g: 0 }},
  { code: 'cf-0711', product_name: 'Späckskiva', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 12, carbohydrates_100g: 0, fat_100g: 34, fiber_100g: 0 }},
  { code: 'cf-0712', product_name: 'Fläsksvål', category: 'Kött - Fläsk', brands: 'Fläskkött', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 28, carbohydrates_100g: 0, fat_100g: 25, fiber_100g: 0 }},
  { code: 'cf-0713', product_name: 'Kyckling hjärta', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 153, proteins_100g: 16, carbohydrates_100g: 0.1, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0714', product_name: 'Kycklingskrot', category: 'Fågel', brands: 'Kyckling', nutriments: { 'energy-kcal_100g': 190, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0715', product_name: 'Kapun', category: 'Fågel', brands: 'Fågel', nutriments: { 'energy-kcal_100g': 229, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 17, fiber_100g: 0 }},
  { code: 'cf-0716', product_name: 'Pärlhöna', category: 'Fågel', brands: 'Fågel', nutriments: { 'energy-kcal_100g': 158, proteins_100g: 24, carbohydrates_100g: 0, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0717', product_name: 'Hjortstek', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 135, proteins_100g: 22, carbohydrates_100g: 0, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0718', product_name: 'Älgbog', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 115, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0719', product_name: 'Vildsvinskotlett', category: 'Kött - Vilt', brands: 'Vilt', nutriments: { 'energy-kcal_100g': 160, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0720', product_name: 'Stenbitsrom', category: 'Fisk', brands: 'Rom', nutriments: { 'energy-kcal_100g': 73, proteins_100g: 13, carbohydrates_100g: 1, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0721', product_name: 'Forellrom', category: 'Fisk', brands: 'Rom', nutriments: { 'energy-kcal_100g': 240, proteins_100g: 28, carbohydrates_100g: 3, fat_100g: 13, fiber_100g: 0 }},
  { code: 'cf-0722', product_name: 'Kaviar (löjrom-stil)', category: 'Fisk', brands: 'Rom', nutriments: { 'energy-kcal_100g': 264, proteins_100g: 25, carbohydrates_100g: 4, fat_100g: 16, fiber_100g: 0 }},
  { code: 'cf-0723', product_name: 'Regnbågslax', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 141, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 6, fiber_100g: 0 }},
  { code: 'cf-0724', product_name: 'Rökt makrill', category: 'Fisk', brands: 'Makrillfisk', nutriments: { 'energy-kcal_100g': 305, proteins_100g: 19, carbohydrates_100g: 0, fat_100g: 25, fiber_100g: 0 }},
  { code: 'cf-0725', product_name: 'Brockling', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 145, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 8, fiber_100g: 0 }},
  { code: 'cf-0726', product_name: 'Flundra', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 15, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0727', product_name: 'Marulk', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 76, proteins_100g: 15, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0728', product_name: 'Sandskädda', category: 'Fisk', brands: 'Plattfisk', nutriments: { 'energy-kcal_100g': 84, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 2, fiber_100g: 0 }},
  { code: 'cf-0729', product_name: 'Stör', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 105, proteins_100g: 16, carbohydrates_100g: 0, fat_100g: 4, fiber_100g: 0 }},
  { code: 'cf-0730', product_name: 'Sardeller', category: 'Fisk', brands: 'Sillfisk', nutriments: { 'energy-kcal_100g': 210, proteins_100g: 29, carbohydrates_100g: 0, fat_100g: 10, fiber_100g: 0 }},
  { code: 'cf-0731', product_name: 'Havsöring', category: 'Fisk', brands: 'Laxfisk', nutriments: { 'energy-kcal_100g': 168, proteins_100g: 21, carbohydrates_100g: 0, fat_100g: 9, fiber_100g: 0 }},
  { code: 'cf-0732', product_name: 'Skärsnultra', category: 'Fisk', brands: 'Övrig havsfisk', nutriments: { 'energy-kcal_100g': 85, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0733', product_name: 'Mört', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0734', product_name: 'Löja', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 95, proteins_100g: 17, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0735', product_name: 'Id', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0736', product_name: 'Siklöja', category: 'Fisk', brands: 'Sötvattensfisk', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 18, carbohydrates_100g: 0, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0737', product_name: 'Sniglar', category: 'Skaldjur', brands: 'Skaldjur', nutriments: { 'energy-kcal_100g': 90, proteins_100g: 16, carbohydrates_100g: 2, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0738', product_name: 'Sjöborrar (uni)', category: 'Skaldjur', brands: 'Skaldjur', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 13, carbohydrates_100g: 3, fat_100g: 5, fiber_100g: 0 }},
  { code: 'cf-0739', product_name: 'Havskräftstjärtar', category: 'Skaldjur', brands: 'Räkor', nutriments: { 'energy-kcal_100g': 90, proteins_100g: 20, carbohydrates_100g: 0, fat_100g: 1, fiber_100g: 0 }},
  { code: 'cf-0740', product_name: 'Räkrom', category: 'Skaldjur', brands: 'Rom', nutriments: { 'energy-kcal_100g': 95, proteins_100g: 15, carbohydrates_100g: 2, fat_100g: 3, fiber_100g: 0 }},
  { code: 'cf-0741', product_name: 'Bebimorötter', category: 'Grönsaker', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 0.6, carbohydrates_100g: 8, fat_100g: 0.1, fiber_100g: 2.9 }},
  { code: 'cf-0742', product_name: 'Morötter (olika färger)', category: 'Grönsaker', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 41, proteins_100g: 0.9, carbohydrates_100g: 10, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'cf-0743', product_name: 'Pastinacka', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 75, proteins_100g: 1.2, carbohydrates_100g: 18, fat_100g: 0.3, fiber_100g: 4.9 }},
  { code: 'cf-0744', product_name: 'Färsk lök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 40, proteins_100g: 1.1, carbohydrates_100g: 9, fat_100g: 0.1, fiber_100g: 1.7 }},
  { code: 'cf-0745', product_name: 'Röd schalottenlök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 72, proteins_100g: 2.5, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 3.2 }},
  { code: 'cf-0746', product_name: 'Svarträttika', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 0.1, fiber_100g: 1.5 }},
  { code: 'cf-0747', product_name: 'Majrovor', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 28, proteins_100g: 0.9, carbohydrates_100g: 6, fat_100g: 0.1, fiber_100g: 1.8 }},
  { code: 'cf-0748', product_name: 'Gullbetor', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 1.6, carbohydrates_100g: 10, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'cf-0749', product_name: 'Knipplök', category: 'Grönsaker', brands: 'Lök', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 1.8, carbohydrates_100g: 7, fat_100g: 0.2, fiber_100g: 2.6 }},
  { code: 'cf-0750', product_name: 'Bondbönor', category: 'Grönsaker', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 88, proteins_100g: 8, carbohydrates_100g: 12, fat_100g: 0.5, fiber_100g: 5 }},
  { code: 'cf-0751', product_name: 'Sparris vildfångad', category: 'Grönsaker', brands: 'Sparris', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 2.2, carbohydrates_100g: 3.9, fat_100g: 0.1, fiber_100g: 2.1 }},
  { code: 'cf-0752', product_name: 'Skärbönor', category: 'Grönsaker', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1.8, carbohydrates_100g: 7, fat_100g: 0.1, fiber_100g: 3.4 }},
  { code: 'cf-0753', product_name: 'Brytbönor', category: 'Grönsaker', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1.8, carbohydrates_100g: 7, fat_100g: 0.1, fiber_100g: 3.4 }},
  { code: 'cf-0754', product_name: 'Tomater gula', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0755', product_name: 'Tomater orange', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0756', product_name: 'Tomater gröna', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 1.2, carbohydrates_100g: 5, fat_100g: 0.2, fiber_100g: 1.1 }},
  { code: 'cf-0757', product_name: 'San Marzano tomater', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0758', product_name: 'Beefsteak tomater', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 1.2 }},
  { code: 'cf-0759', product_name: 'Cocktailtomat', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 1 }},
  { code: 'cf-0760', product_name: 'Kvisttomater', category: 'Grönsaker', brands: 'Tomat', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0.9, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 1 }},
  { code: 'cf-0761', product_name: 'Miniaubergine', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 3 }},
  { code: 'cf-0762', product_name: 'Zebra aubergine', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 3 }},
  { code: 'cf-0763', product_name: 'Thailändsk aubergine', category: 'Grönsaker', brands: 'Squash', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 3 }},
  { code: 'cf-0764', product_name: 'Kronärtskockshjärtan', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 47, proteins_100g: 3.3, carbohydrates_100g: 11, fat_100g: 0.2, fiber_100g: 5.4 }},
  { code: 'cf-0765', product_name: 'Cardoner (kardon)', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 0.7, carbohydrates_100g: 4, fat_100g: 0.1, fiber_100g: 1.5 }},
  { code: 'cf-0766', product_name: 'Agretti (munkskögg)', category: 'Grönsaker', brands: 'Grönsak', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 1.8, carbohydrates_100g: 2, fat_100g: 0.2, fiber_100g: 1.5 }},
  { code: 'cf-0767', product_name: 'Nypotatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 2, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 2 }},
  { code: 'cf-0768', product_name: 'Blå potatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 77, proteins_100g: 2, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 2.2 }},
  { code: 'cf-0769', product_name: 'Rosa potatis', category: 'Rotfrukter', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 77, proteins_100g: 2, carbohydrates_100g: 17, fat_100g: 0.1, fiber_100g: 2.2 }},
  { code: 'cf-0770', product_name: 'Knipprädisa', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 16, proteins_100g: 0.7, carbohydrates_100g: 3.4, fat_100g: 0.1, fiber_100g: 1.6 }},
  { code: 'cf-0771', product_name: 'Vattenrättika', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 14, proteins_100g: 0.6, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 0.6 }},
  { code: 'cf-0772', product_name: 'Batavia sallad', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 14, proteins_100g: 0.9, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 1.2 }},
  { code: 'cf-0773', product_name: 'Ekbladssallad', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 1, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0774', product_name: 'Lollo rosso', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 1, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0775', product_name: 'Lollo bionda', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 15, proteins_100g: 1, carbohydrates_100g: 3, fat_100g: 0.1, fiber_100g: 1 }},
  { code: 'cf-0776', product_name: 'Frisée sallad', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 1.2, carbohydrates_100g: 3.4, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0777', product_name: 'Radicchio', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 1.4, carbohydrates_100g: 4.5, fat_100g: 0.3, fiber_100g: 0.9 }},
  { code: 'cf-0778', product_name: 'Endive', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 17, proteins_100g: 1.3, carbohydrates_100g: 3.4, fat_100g: 0.2, fiber_100g: 3.1 }},
  { code: 'cf-0779', product_name: 'Mizuna', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 21, proteins_100g: 2, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0780', product_name: 'Tatsoi', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 13, proteins_100g: 1.5, carbohydrates_100g: 2, fat_100g: 0.2, fiber_100g: 1 }},
  { code: 'cf-0781', product_name: 'Komatsuna', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 21, proteins_100g: 2, carbohydrates_100g: 3.7, fat_100g: 0.2, fiber_100g: 1.6 }},
  { code: 'cf-0782', product_name: 'Perilla (shiso)', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 37, proteins_100g: 3, carbohydrates_100g: 7, fat_100g: 1, fiber_100g: 3 }},
  { code: 'cf-0783', product_name: 'Citrongräs', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 99, proteins_100g: 1.8, carbohydrates_100g: 25, fat_100g: 0.5, fiber_100g: 0 }},
  { code: 'cf-0784', product_name: 'Galangal', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 71, proteins_100g: 1, carbohydrates_100g: 15, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0785', product_name: 'Fingerrot (krachai)', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 74, proteins_100g: 1.2, carbohydrates_100g: 16, fat_100g: 0.6, fiber_100g: 2 }},
  { code: 'cf-0786', product_name: 'Mexikansk koriander (culantro)', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 2.1, carbohydrates_100g: 3.7, fat_100g: 0.5, fiber_100g: 2.8 }},
  { code: 'cf-0787', product_name: 'Vietnamesisk koriander', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 2.1, carbohydrates_100g: 3.7, fat_100g: 0.5, fiber_100g: 2.8 }},
  { code: 'cf-0788', product_name: 'Thaibasilika', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 3.2, carbohydrates_100g: 2.7, fat_100g: 0.6, fiber_100g: 1.6 }},
  { code: 'cf-0789', product_name: 'Helig basilika (heliga)', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 3.2, carbohydrates_100g: 2.7, fat_100g: 0.6, fiber_100g: 1.6 }},
  { code: 'cf-0790', product_name: 'Citronbasilika', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 23, proteins_100g: 3.2, carbohydrates_100g: 2.7, fat_100g: 0.6, fiber_100g: 1.6 }},
  { code: 'cf-0791', product_name: 'Libbsticka (maggiört)', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 3, carbohydrates_100g: 4, fat_100g: 0.5, fiber_100g: 2 }},
  { code: 'cf-0792', product_name: 'Körvel', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 237, proteins_100g: 23, carbohydrates_100g: 49, fat_100g: 4, fiber_100g: 11 }},
  { code: 'cf-0793', product_name: 'Isop', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 21, proteins_100g: 2, carbohydrates_100g: 4, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0794', product_name: 'Drakblod (dragon)', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 295, proteins_100g: 23, carbohydrates_100g: 50, fat_100g: 7, fiber_100g: 7 }},
  { code: 'cf-0795', product_name: 'Bladpersilja', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 36, proteins_100g: 3, carbohydrates_100g: 6.3, fat_100g: 0.8, fiber_100g: 3.3 }},
  { code: 'cf-0796', product_name: 'Rotpersilja', category: 'Rotfrukter', brands: 'Rotfrukt', nutriments: { 'energy-kcal_100g': 55, proteins_100g: 2.3, carbohydrates_100g: 12, fat_100g: 0.6, fiber_100g: 4 }},
  { code: 'cf-0797', product_name: 'Spenatsyra (bladsyra)', category: 'Grönsaker', brands: 'Sallad', nutriments: { 'energy-kcal_100g': 22, proteins_100g: 2, carbohydrates_100g: 3.2, fat_100g: 0.7, fiber_100g: 2.9 }},
  { code: 'cf-0798', product_name: 'Nässlor', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 42, proteins_100g: 2.7, carbohydrates_100g: 7, fat_100g: 0.1, fiber_100g: 6.9 }},
  { code: 'cf-0799', product_name: 'Kirskål', category: 'Grönsaker', brands: 'Örter', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 3, carbohydrates_100g: 6, fat_100g: 0.5, fiber_100g: 3 }},
  { code: 'cf-0800', product_name: 'Blek taggsvamp', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 2.5, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 3 }},
  { code: 'cf-0801', product_name: 'Fårticka', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 0.3, fiber_100g: 3 }},
  { code: 'cf-0802', product_name: 'Taggsvamp', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 2.5, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 3 }},
  { code: 'cf-0803', product_name: 'Fjällskivling', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 33, proteins_100g: 3, carbohydrates_100g: 5, fat_100g: 0.4, fiber_100g: 2 }},
  { code: 'cf-0804', product_name: 'Brokig taggsvamp', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 2.5, carbohydrates_100g: 6, fat_100g: 0.4, fiber_100g: 3 }},
  { code: 'cf-0805', product_name: 'Champignon portobello caps', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 22, proteins_100g: 2.1, carbohydrates_100g: 4, fat_100g: 0.4, fiber_100g: 1.3 }},
  { code: 'cf-0806', product_name: 'Shimejii', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 35, proteins_100g: 2.5, carbohydrates_100g: 7, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0807', product_name: 'Nameko', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0808', product_name: 'Maitake', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 3 }},
  { code: 'cf-0809', product_name: 'Matsutake', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 27, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 2.5 }},
  { code: 'cf-0810', product_name: 'Björksopp', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 3, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 2.5 }},
  { code: 'cf-0811', product_name: 'Aspsopp', category: 'Svamp', brands: 'Svamp', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 3.7, carbohydrates_100g: 5, fat_100g: 0.5, fiber_100g: 2.5 }},
  { code: 'cf-0812', product_name: 'Äpple Granny Smith', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 0.3, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 2.4 }},
  { code: 'cf-0813', product_name: 'Äpple Gala', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.3, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 2 }},
  { code: 'cf-0814', product_name: 'Äpple Pink Lady', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 0.3, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 2.4 }},
  { code: 'cf-0815', product_name: 'Äpple Ingrid Marie', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 0.3, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 2.4 }},
  { code: 'cf-0816', product_name: 'Päron Conference', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.4, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 3.1 }},
  { code: 'cf-0817', product_name: 'Päron Comice', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.4, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 3.1 }},
  { code: 'cf-0818', product_name: 'Päron Williams', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.4, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 3.1 }},
  { code: 'cf-0819', product_name: 'Mirabellplommon', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 55, proteins_100g: 0.7, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 1.5 }},
  { code: 'cf-0820', product_name: 'Renklod', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 46, proteins_100g: 0.7, carbohydrates_100g: 11, fat_100g: 0.3, fiber_100g: 1.4 }},
  { code: 'cf-0821', product_name: 'Sviskon färska', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 46, proteins_100g: 0.7, carbohydrates_100g: 11, fat_100g: 0.3, fiber_100g: 1.4 }},
  { code: 'cf-0822', product_name: 'Bigarråer (söta körsbär)', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 63, proteins_100g: 1.1, carbohydrates_100g: 16, fat_100g: 0.2, fiber_100g: 2.1 }},
  { code: 'cf-0823', product_name: 'Morell', category: 'Frukt', brands: 'Stenfrukt', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 1, carbohydrates_100g: 12, fat_100g: 0.3, fiber_100g: 1.6 }},
  { code: 'cf-0824', product_name: 'Gulmelon', category: 'Frukt', brands: 'Melon', nutriments: { 'energy-kcal_100g': 36, proteins_100g: 0.5, carbohydrates_100g: 9, fat_100g: 0.1, fiber_100g: 0.8 }},
  { code: 'cf-0825', product_name: 'Charentaismelon', category: 'Frukt', brands: 'Melon', nutriments: { 'energy-kcal_100g': 34, proteins_100g: 0.8, carbohydrates_100g: 8, fat_100g: 0.2, fiber_100g: 0.9 }},
  { code: 'cf-0826', product_name: 'Persimonn', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 0.6, carbohydrates_100g: 19, fat_100g: 0.2, fiber_100g: 3.6 }},
  { code: 'cf-0827', product_name: 'Kumquat', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 71, proteins_100g: 1.9, carbohydrates_100g: 16, fat_100g: 0.9, fiber_100g: 6.5 }},
  { code: 'cf-0828', product_name: 'Fingerlime', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 0.9, carbohydrates_100g: 7, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0829', product_name: 'Calamansi', category: 'Frukt', brands: 'Citrus', nutriments: { 'energy-kcal_100g': 37, proteins_100g: 0.6, carbohydrates_100g: 9, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0830', product_name: 'Jackfrukt', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 95, proteins_100g: 1.7, carbohydrates_100g: 23, fat_100g: 0.6, fiber_100g: 1.5 }},
  { code: 'cf-0831', product_name: 'Durian', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 147, proteins_100g: 1.5, carbohydrates_100g: 27, fat_100g: 5, fiber_100g: 3.8 }},
  { code: 'cf-0832', product_name: 'Mangostan', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 73, proteins_100g: 0.4, carbohydrates_100g: 18, fat_100g: 0.6, fiber_100g: 1.8 }},
  { code: 'cf-0833', product_name: 'Cherimoya', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 75, proteins_100g: 1.6, carbohydrates_100g: 18, fat_100g: 0.7, fiber_100g: 3 }},
  { code: 'cf-0834', product_name: 'Guava', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 68, proteins_100g: 2.6, carbohydrates_100g: 14, fat_100g: 1, fiber_100g: 5.4 }},
  { code: 'cf-0835', product_name: 'Karambola (stjärnfrukt)', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 31, proteins_100g: 1, carbohydrates_100g: 7, fat_100g: 0.3, fiber_100g: 2.8 }},
  { code: 'cf-0836', product_name: 'Longan', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 60, proteins_100g: 1.3, carbohydrates_100g: 15, fat_100g: 0.1, fiber_100g: 1.1 }},
  { code: 'cf-0837', product_name: 'Salak (ormfrukt)', category: 'Frukt', brands: 'Tropisk frukt', nutriments: { 'energy-kcal_100g': 82, proteins_100g: 0.8, carbohydrates_100g: 22, fat_100g: 0.4, fiber_100g: 1 }},
  { code: 'cf-0838', product_name: 'Smultron', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 32, proteins_100g: 0.7, carbohydrates_100g: 8, fat_100g: 0.3, fiber_100g: 2 }},
  { code: 'cf-0839', product_name: 'Åkerbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 1.2, carbohydrates_100g: 12, fat_100g: 0.7, fiber_100g: 6.5 }},
  { code: 'cf-0840', product_name: 'Mullbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 1.4, carbohydrates_100g: 10, fat_100g: 0.4, fiber_100g: 1.7 }},
  { code: 'cf-0841', product_name: 'Blåbär vilda', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.7, carbohydrates_100g: 14, fat_100g: 0.3, fiber_100g: 2.4 }},
  { code: 'cf-0842', product_name: 'Odon', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 57, proteins_100g: 0.7, carbohydrates_100g: 14, fat_100g: 0.3, fiber_100g: 2.4 }},
  { code: 'cf-0843', product_name: 'Svarta mullbär', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 43, proteins_100g: 1.4, carbohydrates_100g: 10, fat_100g: 0.4, fiber_100g: 1.7 }},
  { code: 'cf-0844', product_name: 'Acai', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 1.5, carbohydrates_100g: 4, fat_100g: 5, fiber_100g: 2 }},
  { code: 'cf-0845', product_name: 'Elderflower (fläderblom)', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 1, carbohydrates_100g: 18, fat_100g: 0.5, fiber_100g: 5 }},
  { code: 'cf-0846', product_name: 'Fläderblom', category: 'Bär', brands: 'Bär', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 1, carbohydrates_100g: 18, fat_100g: 0.5, fiber_100g: 5 }},
  { code: 'cf-0847', product_name: 'Jonagold (äpple)', category: 'Frukt', brands: 'Kärnfrukt', nutriments: { 'energy-kcal_100g': 52, proteins_100g: 0.3, carbohydrates_100g: 14, fat_100g: 0.2, fiber_100g: 2.4 }},
  { code: 'cf-0848', product_name: 'Aleppo peppar', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 292, proteins_100g: 13, carbohydrates_100g: 50, fat_100g: 15, fiber_100g: 25 }},
  { code: 'cf-0849', product_name: 'Urfa biber', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0850', product_name: 'Piment d\'Espelette', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0851', product_name: 'Guajillo chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0852', product_name: 'Ancho chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0853', product_name: 'Pasilla chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0854', product_name: 'Mulato chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0855', product_name: 'New Mexico chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 282, proteins_100g: 11, carbohydrates_100g: 50, fat_100g: 6, fiber_100g: 29 }},
  { code: 'cf-0856', product_name: 'Cascabel chili', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 314, proteins_100g: 12, carbohydrates_100g: 50, fat_100g: 17, fiber_100g: 28 }},
  { code: 'cf-0857', product_name: 'Arbol chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 318, proteins_100g: 12, carbohydrates_100g: 57, fat_100g: 17, fiber_100g: 27 }},
  { code: 'cf-0858', product_name: 'Birdseye chili torkad', category: 'Kryddor', brands: 'Chili', nutriments: { 'energy-kcal_100g': 318, proteins_100g: 12, carbohydrates_100g: 57, fat_100g: 17, fiber_100g: 27 }},
  { code: 'cf-0859', product_name: 'Grains of paradise', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 10, carbohydrates_100g: 65, fat_100g: 8, fiber_100g: 12 }},
  { code: 'cf-0860', product_name: 'Cubebpeppar', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 10, carbohydrates_100g: 65, fat_100g: 8, fiber_100g: 12 }},
  { code: 'cf-0861', product_name: 'Voatspiperifery', category: 'Kryddor', brands: 'Peppar', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 10, carbohydrates_100g: 65, fat_100g: 8, fiber_100g: 12 }},
  { code: 'cf-0862', product_name: 'Svart salt (kala namak)', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0863', product_name: 'Flingsalt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0864', product_name: 'Havssalt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0865', product_name: 'Himalayasalt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0866', product_name: 'Rökt salt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0867', product_name: 'Sellersalt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0868', product_name: 'Vitlökssalt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0869', product_name: 'Tryffelssalt', category: 'Kryddor', brands: 'Salt', nutriments: { 'energy-kcal_100g': 0, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0870', product_name: 'Shichimi togarashi', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 10, carbohydrates_100g: 52, fat_100g: 12, fiber_100g: 20 }},
  { code: 'cf-0871', product_name: 'Furikake', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 20, carbohydrates_100g: 55, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0872', product_name: 'Togarashi', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 10, carbohydrates_100g: 52, fat_100g: 12, fiber_100g: 20 }},
  { code: 'cf-0873', product_name: 'Dukkah', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 500, proteins_100g: 15, carbohydrates_100g: 20, fat_100g: 40, fiber_100g: 8 }},
  { code: 'cf-0874', product_name: 'Quatre épices', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 350, proteins_100g: 8, carbohydrates_100g: 60, fat_100g: 10, fiber_100g: 15 }},
  { code: 'cf-0875', product_name: 'Chinese five spice', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 8, carbohydrates_100g: 58, fat_100g: 12, fiber_100g: 15 }},
  { code: 'cf-0876', product_name: 'Herbes de Provence', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 270, proteins_100g: 9, carbohydrates_100g: 60, fat_100g: 5, fiber_100g: 30 }},
  { code: 'cf-0877', product_name: 'Bouquet garni (torkad)', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 265, proteins_100g: 9, carbohydrates_100g: 69, fat_100g: 4, fiber_100g: 43 }},
  { code: 'cf-0878', product_name: 'Tandoori masala', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 325, proteins_100g: 14, carbohydrates_100g: 58, fat_100g: 14, fiber_100g: 33 }},
  { code: 'cf-0879', product_name: 'Chaat masala', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 4, carbohydrates_100g: 15, fat_100g: 3, fiber_100g: 5 }},
  { code: 'cf-0880', product_name: 'Panch phoron', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 375, proteins_100g: 18, carbohydrates_100g: 44, fat_100g: 22, fiber_100g: 11 }},
  { code: 'cf-0881', product_name: 'Baharat', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 10, carbohydrates_100g: 52, fat_100g: 12, fiber_100g: 20 }},
  { code: 'cf-0882', product_name: 'Advieh', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 10, carbohydrates_100g: 52, fat_100g: 12, fiber_100g: 20 }},
  { code: 'cf-0883', product_name: 'Jerk seasoning', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 8, carbohydrates_100g: 55, fat_100g: 10, fiber_100g: 15 }},
  { code: 'cf-0884', product_name: 'Old Bay seasoning', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 200, proteins_100g: 5, carbohydrates_100g: 35, fat_100g: 5, fiber_100g: 10 }},
  { code: 'cf-0885', product_name: 'Cajun seasoning', category: 'Kryddor', brands: 'Kryddmix', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 10, carbohydrates_100g: 52, fat_100g: 12, fiber_100g: 20 }},
  { code: 'cf-0886', product_name: 'Achiote pasta', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 7, carbohydrates_100g: 45, fat_100g: 22, fiber_100g: 10 }},
  { code: 'cf-0887', product_name: 'Recado rojo', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 7, carbohydrates_100g: 45, fat_100g: 22, fiber_100g: 10 }},
  { code: 'cf-0888', product_name: 'Annattopulver', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 360, proteins_100g: 13, carbohydrates_100g: 52, fat_100g: 15, fiber_100g: 12 }},
  { code: 'cf-0889', product_name: 'Asafoetida (hing)', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 297, proteins_100g: 4, carbohydrates_100g: 68, fat_100g: 1, fiber_100g: 4 }},
  { code: 'cf-0890', product_name: 'Fenugreek blad torkad', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 323, proteins_100g: 23, carbohydrates_100g: 58, fat_100g: 6, fiber_100g: 25 }},
  { code: 'cf-0891', product_name: 'Fenugreek frö', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 323, proteins_100g: 23, carbohydrates_100g: 58, fat_100g: 6, fiber_100g: 25 }},
  { code: 'cf-0892', product_name: 'Amchur (mango pulver)', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 300, proteins_100g: 2, carbohydrates_100g: 75, fat_100g: 1, fiber_100g: 15 }},
  { code: 'cf-0893', product_name: 'Dried lime (limoo amani)', category: 'Kryddor', brands: 'Krydda', nutriments: { 'energy-kcal_100g': 240, proteins_100g: 5, carbohydrates_100g: 55, fat_100g: 2, fiber_100g: 20 }},
  { code: 'cf-0894', product_name: 'Tamarindpasta', category: 'Kryddor', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 239, proteins_100g: 2.8, carbohydrates_100g: 63, fat_100g: 0.6, fiber_100g: 5.1 }},
  { code: 'cf-0895', product_name: 'Chimichurri', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 2, carbohydrates_100g: 3, fat_100g: 18, fiber_100g: 1 }},
  { code: 'cf-0896', product_name: 'Pesto genovese', category: 'Såser', brands: 'Pesto', nutriments: { 'energy-kcal_100g': 387, proteins_100g: 5, carbohydrates_100g: 6, fat_100g: 39, fiber_100g: 2 }},
  { code: 'cf-0897', product_name: 'Pesto rosso', category: 'Såser', brands: 'Pesto', nutriments: { 'energy-kcal_100g': 310, proteins_100g: 4, carbohydrates_100g: 8, fat_100g: 29, fiber_100g: 2 }},
  { code: 'cf-0898', product_name: 'Romesco sås', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 4, carbohydrates_100g: 10, fat_100g: 22, fiber_100g: 3 }},
  { code: 'cf-0899', product_name: 'Muhammara', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 340, proteins_100g: 6, carbohydrates_100g: 18, fat_100g: 28, fiber_100g: 4 }},
  { code: 'cf-0900', product_name: 'Zhug (grön sås)', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 70, proteins_100g: 2, carbohydrates_100g: 8, fat_100g: 4, fiber_100g: 3 }},
  { code: 'cf-0901', product_name: 'Salsa verde', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 150, proteins_100g: 2, carbohydrates_100g: 5, fat_100g: 14, fiber_100g: 1 }},
  { code: 'cf-0902', product_name: 'Salsa roja', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 30, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.5, fiber_100g: 1 }},
  { code: 'cf-0903', product_name: 'Chermoula', category: 'Såser', brands: 'Sås', nutriments: { 'energy-kcal_100g': 150, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 13, fiber_100g: 2 }},
  { code: 'cf-0904', product_name: 'Nuoc cham', category: 'Såser', brands: 'Asiatisk sås', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 2, carbohydrates_100g: 10, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0905', product_name: 'Nam prik pao', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 250, proteins_100g: 3, carbohydrates_100g: 25, fat_100g: 15, fiber_100g: 3 }},
  { code: 'cf-0906', product_name: 'Doubanjiang', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 5, carbohydrates_100g: 15, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0907', product_name: 'Lao gan ma (chili crisp)', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 600, proteins_100g: 5, carbohydrates_100g: 10, fat_100g: 60, fiber_100g: 3 }},
  { code: 'cf-0908', product_name: 'XO-sås', category: 'Såser', brands: 'Specialsås', nutriments: { 'energy-kcal_100g': 400, proteins_100g: 15, carbohydrates_100g: 10, fat_100g: 35, fiber_100g: 0 }},
  { code: 'cf-0909', product_name: 'Teriyakisås', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 89, proteins_100g: 6, carbohydrates_100g: 16, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0910', product_name: 'Yakitori tare', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 4, carbohydrates_100g: 20, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0911', product_name: 'Tonkatsu sås', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 125, proteins_100g: 1, carbohydrates_100g: 30, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0912', product_name: 'Eel sauce (unagi)', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 150, proteins_100g: 3, carbohydrates_100g: 35, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0913', product_name: 'Goma dare (sesamdressing)', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 300, proteins_100g: 6, carbohydrates_100g: 15, fat_100g: 25, fiber_100g: 2 }},
  { code: 'cf-0914', product_name: 'Wafu dressing', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 2, carbohydrates_100g: 8, fat_100g: 7, fiber_100g: 0 }},
  { code: 'cf-0915', product_name: 'Yuzukosho', category: 'Såser', brands: 'Japansk', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 1, carbohydrates_100g: 8, fat_100g: 1.5, fiber_100g: 3 }},
  { code: 'cf-0916', product_name: 'Toban djan', category: 'Såser', brands: 'Kinesisk', nutriments: { 'energy-kcal_100g': 130, proteins_100g: 5, carbohydrates_100g: 15, fat_100g: 5, fiber_100g: 3 }},
  { code: 'cf-0917', product_name: 'Shaoxing vin', category: 'Såser', brands: 'Kinesisk', nutriments: { 'energy-kcal_100g': 89, proteins_100g: 0.5, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0918', product_name: 'Svart vinäger (Chinkiang)', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 18, proteins_100g: 0, carbohydrates_100g: 2, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0919', product_name: 'Svart bohnen sås', category: 'Såser', brands: 'Kinesisk', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 10, carbohydrates_100g: 20, fat_100g: 6, fiber_100g: 5 }},
  { code: 'cf-0920', product_name: 'Plum sauce', category: 'Såser', brands: 'Kinesisk', nutriments: { 'energy-kcal_100g': 184, proteins_100g: 0.5, carbohydrates_100g: 45, fat_100g: 0, fiber_100g: 1 }},
  { code: 'cf-0921', product_name: 'Sambal badjak', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 1, carbohydrates_100g: 10, fat_100g: 4, fiber_100g: 2 }},
  { code: 'cf-0922', product_name: 'Sambal manis', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 100, proteins_100g: 1, carbohydrates_100g: 20, fat_100g: 2, fiber_100g: 1 }},
  { code: 'cf-0923', product_name: 'Rendang pasta', category: 'Såser', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 180, proteins_100g: 3, carbohydrates_100g: 10, fat_100g: 14, fiber_100g: 3 }},
  { code: 'cf-0924', product_name: 'Laksa pasta', category: 'Såser', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 120, proteins_100g: 2, carbohydrates_100g: 8, fat_100g: 9, fiber_100g: 2 }},
  { code: 'cf-0925', product_name: 'Tom yum pasta', category: 'Såser', brands: 'Kryddpasta', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 2, carbohydrates_100g: 6, fat_100g: 5, fiber_100g: 2 }},
  { code: 'cf-0926', product_name: 'Satay sås', category: 'Såser', brands: 'Asiatisk sås', nutriments: { 'energy-kcal_100g': 300, proteins_100g: 10, carbohydrates_100g: 15, fat_100g: 22, fiber_100g: 3 }},
  { code: 'cf-0927', product_name: 'Garum (fiskessens)', category: 'Såser', brands: 'Fermenterat', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 8, carbohydrates_100g: 3, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0928', product_name: 'Colatura di alici', category: 'Såser', brands: 'Fermenterat', nutriments: { 'energy-kcal_100g': 50, proteins_100g: 8, carbohydrates_100g: 3, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0929', product_name: 'Balsam glaze', category: 'Såser', brands: 'Vinäger', nutriments: { 'energy-kcal_100g': 220, proteins_100g: 0.5, carbohydrates_100g: 55, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0930', product_name: 'Granatäpplesirap', category: 'Såser', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 315, proteins_100g: 0, carbohydrates_100g: 78, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0931', product_name: 'Pomegranate molasses', category: 'Såser', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 315, proteins_100g: 0, carbohydrates_100g: 78, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0932', product_name: 'Dattelsirap (silan)', category: 'Såser', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 280, proteins_100g: 1, carbohydrates_100g: 70, fat_100g: 0, fiber_100g: 2 }},
  { code: 'cf-0933', product_name: 'Björksirap', category: 'Såser', brands: 'Sirap', nutriments: { 'energy-kcal_100g': 269, proteins_100g: 0, carbohydrates_100g: 68, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0934', product_name: 'Rose harissa', category: 'Såser', brands: 'Chilisås', nutriments: { 'energy-kcal_100g': 80, proteins_100g: 2, carbohydrates_100g: 10, fat_100g: 4, fiber_100g: 3 }},
  { code: 'cf-0935', product_name: 'Preserved lemon', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 28, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0936', product_name: 'Konserverad citron', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 28, proteins_100g: 1, carbohydrates_100g: 6, fat_100g: 0.2, fiber_100g: 2 }},
  { code: 'cf-0937', product_name: 'Pickled ginger (gari)', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 0.2, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0.5 }},
  { code: 'cf-0938', product_name: 'Inlagd ingefära', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 0.2, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0.5 }},
  { code: 'cf-0939', product_name: 'Beni shoga (röd ingefära)', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 0.3, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 0.5 }},
  { code: 'cf-0940', product_name: 'Tsukemono (japanska pickles)', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 20, proteins_100g: 1, carbohydrates_100g: 4, fat_100g: 0, fiber_100g: 1 }},
  { code: 'cf-0941', product_name: 'Umeboshi (plommonpickles)', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 33, proteins_100g: 1, carbohydrates_100g: 7, fat_100g: 0.1, fiber_100g: 2 }},
  { code: 'cf-0942', product_name: 'Takuan (daikon pickles)', category: 'Såser', brands: 'Pickles', nutriments: { 'energy-kcal_100g': 25, proteins_100g: 0.5, carbohydrates_100g: 5, fat_100g: 0, fiber_100g: 1 }},
  { code: 'cf-0943', product_name: 'MCT-olja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 860, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0944', product_name: 'Pumpafröölja', category: 'Oljor & fetter', brands: 'Nötolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0945', product_name: 'Arganolja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0946', product_name: 'Macadamianötolja', category: 'Oljor & fetter', brands: 'Nötolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0947', product_name: 'Perillaolja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0948', product_name: 'Hampfröölja', category: 'Oljor & fetter', brands: 'Specialolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0949', product_name: 'Risbranolja', category: 'Oljor & fetter', brands: 'Matolja', nutriments: { 'energy-kcal_100g': 884, proteins_100g: 0, carbohydrates_100g: 0, fat_100g: 100, fiber_100g: 0 }},
  { code: 'cf-0950', product_name: 'Kastanjemjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 371, proteins_100g: 6, carbohydrates_100g: 78, fat_100g: 4, fiber_100g: 11 }},
  { code: 'cf-0951', product_name: 'Tapiokastärkelse', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 360, proteins_100g: 0, carbohydrates_100g: 89, fat_100g: 0, fiber_100g: 0 }},
  { code: 'cf-0952', product_name: 'Arrowroot', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 357, proteins_100g: 0, carbohydrates_100g: 88, fat_100g: 0, fiber_100g: 0.5 }},
  { code: 'cf-0953', product_name: 'Teff mjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 366, proteins_100g: 13, carbohydrates_100g: 73, fat_100g: 2, fiber_100g: 8 }},
  { code: 'cf-0954', product_name: 'Sorghum mjöl', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 359, proteins_100g: 11, carbohydrates_100g: 76, fat_100g: 3, fiber_100g: 6 }},
  { code: 'cf-0955', product_name: 'Rismel', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 366, proteins_100g: 6, carbohydrates_100g: 80, fat_100g: 1, fiber_100g: 2 }},
  { code: 'cf-0956', product_name: 'Glutenfritt mjöl (mix)', category: 'Spannmål & mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 355, proteins_100g: 5, carbohydrates_100g: 79, fat_100g: 1, fiber_100g: 3 }},
  { code: 'cf-0957', product_name: 'Emmer korn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 335, proteins_100g: 14, carbohydrates_100g: 68, fat_100g: 2, fiber_100g: 10 }},
  { code: 'cf-0958', product_name: 'Einkorn korn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 338, proteins_100g: 15, carbohydrates_100g: 67, fat_100g: 3, fiber_100g: 11 }},
  { code: 'cf-0959', product_name: 'Kamut korn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 337, proteins_100g: 15, carbohydrates_100g: 68, fat_100g: 2, fiber_100g: 11 }},
  { code: 'cf-0960', product_name: 'Sorghum korn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 339, proteins_100g: 11, carbohydrates_100g: 75, fat_100g: 3, fiber_100g: 6 }},
  { code: 'cf-0961', product_name: 'Teff korn', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 367, proteins_100g: 13, carbohydrates_100g: 73, fat_100g: 2, fiber_100g: 8 }},
  { code: 'cf-0962', product_name: 'Kaniwa', category: 'Spannmål & mjöl', brands: 'Spannmål', nutriments: { 'energy-kcal_100g': 343, proteins_100g: 15, carbohydrates_100g: 63, fat_100g: 6, fiber_100g: 5 }},
  { code: 'cf-0963', product_name: 'Tigernötter', category: 'Nötter & frön', brands: 'Nötter', nutriments: { 'energy-kcal_100g': 450, proteins_100g: 5, carbohydrates_100g: 44, fat_100g: 24, fiber_100g: 33 }},
  { code: 'cf-0964', product_name: 'Sacha inchi frön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 560, proteins_100g: 27, carbohydrates_100g: 5, fat_100g: 47, fiber_100g: 5 }},
  { code: 'cf-0965', product_name: 'Vattenmelon frön', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 557, proteins_100g: 28, carbohydrates_100g: 15, fat_100g: 47, fiber_100g: 0.5 }},
  { code: 'cf-0966', product_name: 'Kakaobönor', category: 'Nötter & frön', brands: 'Frön', nutriments: { 'energy-kcal_100g': 567, proteins_100g: 12, carbohydrates_100g: 25, fat_100g: 46, fiber_100g: 35 }},
  { code: 'cf-0967', product_name: 'Gröna split-ärtor', category: 'Baljväxter', brands: 'Ärtor', nutriments: { 'energy-kcal_100g': 341, proteins_100g: 24, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0968', product_name: 'Gula split-ärtor', category: 'Baljväxter', brands: 'Ärtor', nutriments: { 'energy-kcal_100g': 341, proteins_100g: 24, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 25 }},
  { code: 'cf-0969', product_name: 'Chana dal', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 360, proteins_100g: 20, carbohydrates_100g: 62, fat_100g: 5, fiber_100g: 15 }},
  { code: 'cf-0970', product_name: 'Urad dal', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 347, proteins_100g: 25, carbohydrates_100g: 60, fat_100g: 1, fiber_100g: 18 }},
  { code: 'cf-0971', product_name: 'Moong dal', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 347, proteins_100g: 24, carbohydrates_100g: 63, fat_100g: 1, fiber_100g: 16 }},
  { code: 'cf-0972', product_name: 'Toor dal', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 343, proteins_100g: 22, carbohydrates_100g: 63, fat_100g: 1, fiber_100g: 15 }},
  { code: 'cf-0973', product_name: 'Masoor dal', category: 'Baljväxter', brands: 'Linser', nutriments: { 'energy-kcal_100g': 358, proteins_100g: 24, carbohydrates_100g: 63, fat_100g: 1, fiber_100g: 11 }},
  { code: 'cf-0974', product_name: 'Lupinbönor', category: 'Baljväxter', brands: 'Bönor', nutriments: { 'energy-kcal_100g': 371, proteins_100g: 36, carbohydrates_100g: 40, fat_100g: 10, fiber_100g: 19 }},
];

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeEggSection, setActiveEggSection] = useState('boiling');
  const [showBlanchering, setShowBlanchering] = useState(false);
  const [showBrassering, setShowBrassering] = useState(false);
  const [recipeScale, setRecipeScale] = useState(1);
  const [showRecipeNutrition, setShowRecipeNutrition] = useState(false);
  const [selectedRecipeIngredient, setSelectedRecipeIngredient] = useState(null);
  
  // Måttomvandling state (förbättrad)
  const [conversionMode, setConversionMode] = useState('weight');
  const [conversionType, setConversionType] = useState('weight');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('g');
  const [fromValue, setFromValue] = useState('1');
  const [showForeign, setShowForeign] = useState(false);
  
  // Nya state för förbättrad omvandling
  const [ingredientSearchConv, setIngredientSearchConv] = useState('');
  const [selectedIngredientConv, setSelectedIngredientConv] = useState(null);
  const [ingredientAmountConv, setIngredientAmountConv] = useState('1');
  const [ingredientFromUnitConv, setIngredientFromUnitConv] = useState('dl');
  const [conversionDirection, setConversionDirection] = useState('toWeight');
  const [eggFromSize, setEggFromSize] = useState('M');
  const [eggToSize, setEggToSize] = useState('L');
  const [eggCount, setEggCount] = useState('3');
  const [recentConversions, setRecentConversions] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koksguiden-recent-conversions');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Kaloriräknare state
  const [foodSearch, setFoodSearch] = useState('');
  const [foodResults, setFoodResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [mealList, setMealList] = useState([]);
  const [portionSize, setPortionSize] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // State för grundrecept
  const [selectedBasicRecipe, setSelectedBasicRecipe] = useState(null);
  
  // State för receptskapare
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    portions: '4',
    ingredients: [],
    steps: []
  });
  const [savedRecipes, setSavedRecipes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koksguiden-recipes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  
  // State för ingredienssökning
  const [ingredientSearch, setIngredientSearch] = useState('');
  const [ingredientResults, setIngredientResults] = useState([]);
  const [selectedIngredientFood, setSelectedIngredientFood] = useState(null);
  const [ingredientAmount, setIngredientAmount] = useState(100);
  const [ingredientUnit, setIngredientUnit] = useState('g');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [scaledPortions, setScaledPortions] = useState({});
  const [searchHistory, setSearchHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koksguiden-search-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koksguiden-favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Sous Vide state
  const [showSousVide, setShowSousVide] = useState(false);
  const [selectedSousVideItem, setSelectedSousVideItem] = useState(null);
  const [sousVideCategory, setSousVideCategory] = useState('Nötkött');
  const [sousVideDoneness, setSousVideDoneness] = useState('medium');
  const [sousVideThicknessValue, setSousVideThicknessValue] = useState(3); // cm

  // Beräkna sous vide-tid baserat på tjocklek
  const calculateSousVideTime = (item, doneness, thickness) => {
    if (!item || !doneness) return null;
    const setting = item[doneness];
    if (!setting) return null;

    const temp = setting.temp;

    // Hitta närmaste tjocklek i tabellen
    const thicknesses = Object.keys(sousVideThickness.heating).map(Number).sort((a, b) => a - b);
    let heatingTime = 0;

    if (thickness <= thicknesses[0]) {
      heatingTime = sousVideThickness.heating[thicknesses[0]];
    } else if (thickness >= thicknesses[thicknesses.length - 1]) {
      heatingTime = sousVideThickness.heating[thicknesses[thicknesses.length - 1]];
    } else {
      // Interpolera mellan värden
      for (let i = 0; i < thicknesses.length - 1; i++) {
        if (thickness >= thicknesses[i] && thickness <= thicknesses[i + 1]) {
          const t1 = thicknesses[i];
          const t2 = thicknesses[i + 1];
          const time1 = sousVideThickness.heating[t1];
          const time2 = sousVideThickness.heating[t2];
          const ratio = (thickness - t1) / (t2 - t1);
          heatingTime = Math.round(time1 + ratio * (time2 - time1));
          break;
        }
      }
    }

    // Lägg till pastöriseringstid
    const pastTemps = Object.keys(sousVideThickness.pasteurization).map(Number).sort((a, b) => a - b);
    let pastTime = 0;
    for (let i = pastTemps.length - 1; i >= 0; i--) {
      if (temp <= pastTemps[i]) {
        pastTime = sousVideThickness.pasteurization[pastTemps[i]];
      }
    }

    // Kolla om det är en tuff styckningsdel som behöver extra tid
    const tenderTime = sousVideThickness.tenderizing[item.name] || 0;

    const totalMinutes = heatingTime + pastTime;
    const totalWithTender = Math.max(totalMinutes, tenderTime * 60);

    // Formatera till timmar och minuter
    const hours = Math.floor(totalWithTender / 60);
    const mins = totalWithTender % 60;

    if (hours === 0) {
      return `${mins} min`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}min`;
    }
  };

  // Category filter state (collapsed by default)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  // Percentage-based scaling state
  const [usePercentScaling, setUsePercentScaling] = useState(false);
  const [mainIngredientId, setMainIngredientId] = useState(null);

  // Spara recept till localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-recipes', JSON.stringify(savedRecipes));
    }
  }, [savedRecipes]);

  // Spara senaste konverteringar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-recent-conversions', JSON.stringify(recentConversions));
    }
  }, [recentConversions]);

  // Spara sökhistorik
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-search-history', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  // Spara favoriter
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  // Funktion för att lägga till senaste konvertering
  const addRecentConversion = (conversion) => {
    setRecentConversions(prev => {
      const filtered = prev.filter(c => 
        !(c.ingredient === conversion.ingredient && c.fromUnit === conversion.fromUnit)
      );
      return [conversion, ...filtered].slice(0, 5);
    });
  };

  // Lägg till i sökhistorik
  const addToSearchHistory = (term) => {
    if (term.length < 2) return;
    setSearchHistory(prev => {
      const filtered = prev.filter(t => t.toLowerCase() !== term.toLowerCase());
      return [term, ...filtered].slice(0, 10);
    });
  };

  // Hantera favoriter
  const toggleFavorite = (food) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.code === food.code);
      if (exists) {
        return prev.filter(f => f.code !== food.code);
      }
      return [...prev, food];
    });
  };

  const isFavorite = (code) => favorites.some(f => f.code === code);

  // Hitta näringsinformation för en temperaturitem
  const findNutritionForItem = (itemName, category) => {
    // Skapa en mapping mellan temperatur-namn och foodDatabase-namn
    const nameMapping = {
      // Nötkött
      'Biff': 'Ryggbiff',
      'Entrecôte': 'Entrecôte',
      'Flankstek': 'Flanksteak',
      'Fransyska': 'Fransyska',
      'Högrev': 'Högrev',
      'Innanlår': 'Innanlår',
      'Märgben': 'Märgben',
      'Nötbog': 'Bog',
      'Nötbringa': 'Bringa',
      'Nötytterfilé': 'Rostbiff',
      'Oxfilé': 'Oxfilé',
      'Oxsvans': 'Oxsvans',
      'Oxtunga': 'Oxtunga',
      'Rostbiff': 'Rostbiff',
      'Ryggbiff': 'Ryggbiff',
      'Tjockt kött': 'Tjockt kött',
      'Ytterlår': 'Ytterlår',
      // Kalv
      'Kalventrecôte': 'Kalvkotlett',
      'Kalvfilé': 'Kalvfilé',
      'Kalvfransyska': 'Kalvkotlett',
      'Kalvkotlett': 'Kalvkotlett',
      'Kalvlever': 'Kalvlever',
      'Kalvnjure': 'Kalvnjure',
      'Kalvbräss': 'Kalvbräss',
      // Lamm
      'Lammfilé': 'Lammfilé',
      'Lammkotlett': 'Lammkotlett',
      'Lammlever': 'Lammlever',
      'Lammsadel': 'Lammsadel',
      'Lammstek': 'Lammstek',
      'Lammbog': 'Lammbog',
      'Lammlägg': 'Lammlägg',
      'Lammrack': 'Lammrack',
      'Lammhjärta': 'Lammhjärta',
      'Lammnjure': 'Lammnjure',
      // Fläsk
      'Bacon': 'Bacon',
      'Fläskfilé': 'Fläskfilé',
      'Fläskkotlett': 'Fläskkotlett',
      'Fläskkarré': 'Fläskkarré',
      'Fläskbog': 'Fläskbog',
      'Fläsklägg': 'Fläsklägg',
      'Pancetta': 'Pancetta',
      'Guanciale': 'Guanciale',
      'Revbensspjäll': 'Revbensspjäll',
      'Sidfläsk': 'Sidfläsk',
      'Skinkstek': 'Skinkstek',
      'Fläskkind': 'Fläskkind',
      // Fågel
      'Ankbröst': 'Ankbröst',
      'Ankbröst med skinn': 'Ankbröst med skinn',
      'Anklår': 'Anklår',
      'Anklever': 'Anklever',
      'Gåsbröst': 'Gåsbröst',
      'Kalkonbröst': 'Kalkonbröst',
      'Kalkonfilé': 'Kalkonfilé',
      'Kalkonlårfilé': 'Kalkonlårfilé',
      'Kycklingbröst': 'Kycklingbröst',
      'Kycklingbröst med skinn': 'Kycklingbröst med skinn',
      'Kycklinglever': 'Kycklinglever',
      'Kycklinglår': 'Kycklinglår',
      'Kycklingklubba': 'Kycklingklubba',
      'Kycklingvingar': 'Kycklingvingar',
      'Hel kyckling': 'Hel kyckling',
      'Majskyckling': 'Majskyckling',
      // Vilt
      'Älgfilé': 'Älgfilé',
      'Älgstek': 'Älgstek',
      'Rådjursfilé': 'Rådjursfilé',
      'Rådjurssadel': 'Rådjurssadel',
      'Hjortfilé': 'Hjortfilé',
      'Hjortfärs': 'Hjortfärs',
      'Vildsvinsstek': 'Vildsvinsstek',
      'Renfilé': 'Renfilé',
      'Renstek': 'Renstek',
      'Hare': 'Hare',
      'Fasanbröst': 'Fasanbröst',
      'Rapphöna': 'Rapphöna',
      'Vaktel': 'Vaktel',
      'Duva': 'Duva',
      // Fisk
      'Laxfilé': 'Laxfilé',
      'Öring': 'Öring',
      'Röding': 'Röding',
      'Sik': 'Sik',
      'Abborre': 'Abborre',
      'Gädda': 'Gädda',
      'Torsk': 'Torskfilé',
      'Kolja': 'Kolja',
      'Sej': 'Sej',
      'Kummel': 'Kummel',
      'Hälleflundra': 'Hälleflundra',
      'Piggvar': 'Piggvar',
      'Tonfisk': 'Tonfisk',
      // Skaldjur
      'Hummer': 'Hummer',
      'Krabba': 'Krabba',
      'Kräftor': 'Kräftor',
      'Musslor': 'Musslor',
      'Pilgrimsmusslor': 'Pilgrimsmusslor',
      'Räkor': 'Tigerräkor',
      'Bläckfisk': 'Bläckfisk',
    };

    const searchName = nameMapping[itemName] || itemName;

    // Sök i foodDatabase
    const match = foodDatabase.find(food => {
      const foodName = food.product_name.toLowerCase();
      const search = searchName.toLowerCase();
      return foodName === search || foodName.includes(search) || search.includes(foodName);
    });

    return match;
  };

  // Portionsskalning
  const getScaledPortions = (recipeId, originalPortions) => {
    return scaledPortions[recipeId] || parseInt(originalPortions) || 4;
  };

  const scaleIngredient = (amount, originalPortions, newPortions) => {
    const scale = newPortions / (parseInt(originalPortions) || 4);
    const scaled = amount * scale;
    if (scaled < 10) return Math.round(scaled * 10) / 10;
    return Math.round(scaled);
  };

  // Sök livsmedel
  const handleFoodSearch = useCallback((term) => {
    setFoodSearch(term);
    if (term.length < 2) {
      setFoodResults([]);
      return;
    }

    setIsSearching(true);
    const searchTermLower = term.toLowerCase();
    
    // Hitta synonymer (exakt matchning för att undvika att "mjölk" matchar "mjöl")
    let searchTerms = [searchTermLower];
    Object.entries(synonyms).forEach(([key, values]) => {
      if (searchTermLower === key) {
        searchTerms = [...searchTerms, ...values];
      }
    });

    // Filtrera resultat
    let results = foodDatabase.filter(food => {
      const name = food.product_name.toLowerCase();
      const matchesSearch = searchTerms.some(term => name.includes(term));
      const matchesCategory = !selectedCategory || food.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sortera resultat
    results.sort((a, b) => {
      const aName = a.product_name.toLowerCase();
      const bName = b.product_name.toLowerCase();
      const aStartsWith = searchTerms.some(t => aName.startsWith(t));
      const bStartsWith = searchTerms.some(t => bName.startsWith(t));
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      return a.product_name.length - b.product_name.length;
    });

    setFoodResults(results.slice(0, 50));
    setIsSearching(false);
  }, [selectedCategory]);

  // Beräkna omvandling
  const calculateConversion = () => {
    const value = parseFloat(fromValue) || 0;
    const fromBase = conversionData[conversionType][fromUnit];
    const toBase = conversionData[conversionType][toUnit];
    
    if (!fromBase || !toBase) return '0';
    
    const result = (value * fromBase) / toBase;
    
    if (result >= 1000) return result.toFixed(0);
    if (result >= 100) return result.toFixed(1);
    if (result >= 10) return result.toFixed(2);
    return result.toFixed(3);
  };

  // Viktenheter
  const getWeightUnits = () => {
    const base = ['kg', 'hg', 'g'];
    return showForeign ? [...base, 'lb', 'oz'] : base;
  };

  // Volymenheter
  const getVolumeUnits = () => {
    const base = ['l', 'dl', 'cl', 'ml', 'msk', 'tsk', 'krm'];
    return showForeign ? [...base, 'cup', 'tbsp', 'tsp', 'fl oz', 'pint', 'quart'] : base;
  };

  // Gram per dl för ingredienser
  const getGramsPerDl = (foodName) => {
    const name = foodName.toLowerCase();
    if (name.includes('mjöl') || name.includes('flour')) return 60;
    if (name.includes('socker') || name.includes('sugar')) return 90;
    if (name.includes('smör') || name.includes('margarin')) return 95;
    if (name.includes('olja') || name.includes('oil')) return 90;
    if (name.includes('mjölk') || name.includes('grädde') || name.includes('fil')) return 100;
    if (name.includes('ris')) return 90;
    if (name.includes('havre')) return 40;
    if (name.includes('honung') || name.includes('sirap')) return 140;
    if (name.includes('kakao')) return 40;
    if (name.includes('salt')) return 130;
    return 100;
  };

  // Konvertera till gram
  const convertToGrams = (amount, unit, foodName) => {
    if (unit === 'g') return amount;
    if (unit === 'kg') return amount * 1000;
    if (unit === 'st') return amount * 50;

    const mlPer = volumeUnits[unit]?.mlPer || 100;
    const totalMl = amount * mlPer;
    const gramsPerDl = getGramsPerDl(foodName);
    return Math.round(totalMl * gramsPerDl / 100);
  };

  // Beräkna totaler för måltid
  const getTotals = () => {
    return mealList.reduce((acc, item) => {
      const factor = item.portion / 100;
      return {
        kcal: acc.kcal + (item.food.nutriments['energy-kcal_100g'] || 0) * factor,
        protein: acc.protein + (item.food.nutriments.proteins_100g || 0) * factor,
        carbs: acc.carbs + (item.food.nutriments.carbohydrates_100g || 0) * factor,
        fat: acc.fat + (item.food.nutriments.fat_100g || 0) * factor,
        fiber: acc.fiber + (item.food.nutriments.fiber_100g || 0) * factor,
      };
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  // === RENDER FUNCTIONS ===

  const renderHome = () => (
    <div className="home-grid">
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('conversion')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('conversion')}>
        <h2>Måttomvandling</h2>
        <p>Vikt, volym, ingredienser & ägg</p>
        <span className="menu-arrow">→</span>
      </div>
      
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('temperatures')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('temperatures')}>
        <h2>Temperaturer</h2>
        <p>Rätt temperatur för alla råvaror</p>
        <span className="menu-arrow">→</span>
      </div>
      
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('calories')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('calories')}>
        <h2>Kalorier & Näring</h2>
        <p>Sök bland livsmedel</p>
        <span className="menu-arrow">→</span>
      </div>
      
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('eggguide')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('eggguide')}>
        <h2>Äggguiden</h2>
        <p>Koktider, tekniker och vetenskap</p>
        <span className="menu-arrow">→</span>
      </div>

      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('basics')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('basics')}>
        <h2>Grundrecept</h2>
        <p>Såser, buljonger, marinader och smör</p>
        <span className="menu-arrow">→</span>
      </div>

      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('create')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('create')}>
        <h2>Skapa recept</h2>
        <p>Bygg och spara egna recept</p>
        <span className="menu-arrow">→</span>
      </div>
    </div>
  );

  // === FÖRBÄTTRAD MÅTTOMVANDLING ===
  const renderConversion = () => {
    const volumeUnitsList = showForeign 
      ? ['l', 'dl', 'cl', 'ml', 'msk', 'tsk', 'krm', 'cup', 'tbsp', 'tsp', 'fl oz', 'pint', 'quart']
      : ['l', 'dl', 'cl', 'ml', 'msk', 'tsk', 'krm'];

    const weightUnitsList = showForeign
      ? ['kg', 'hg', 'g', 'lb', 'oz']
      : ['kg', 'hg', 'g'];

    // Filtrera ingredienser
    const filteredIngredients = Object.entries(conversionData.weightToVolume)
      .filter(([name]) => name.toLowerCase().includes(ingredientSearchConv.toLowerCase()))
      .sort((a, b) => a[0].localeCompare(b[0], 'sv'));

    // Gruppera per kategori
    const ingredientsByCategory = {};
    filteredIngredients.forEach(([name, data]) => {
      const cat = data.category || 'Övrigt';
      if (!ingredientsByCategory[cat]) ingredientsByCategory[cat] = [];
      ingredientsByCategory[cat].push([name, data]);
    });

    // Beräkna ingrediensomvandling
    const calculateIngredientConversion = () => {
      if (!selectedIngredientConv) return null;
      
      const data = conversionData.weightToVolume[selectedIngredientConv];
      if (!data) return null;
      
      const amount = parseFloat(ingredientAmountConv) || 0;
      const gPerDl = data.gPerDl;
      const mlPer = conversionData.volume[ingredientFromUnitConv] || 100;
      
      if (conversionDirection === 'toWeight') {
        const totalMl = amount * mlPer;
        const grams = Math.round((totalMl * gPerDl) / 100);
        return {
          from: `${amount} ${ingredientFromUnitConv}`,
          to: grams >= 1000 ? `${(grams/1000).toFixed(2)} kg` : `${grams} g`,
          grams: grams
        };
      } else {
        const ml = (amount * 100) / gPerDl;
        if (ml >= 1000) return { from: `${amount} g`, to: `${(ml/1000).toFixed(2)} l`, ml };
        if (ml >= 100) return { from: `${amount} g`, to: `${(ml/100).toFixed(1)} dl`, ml };
        return { from: `${amount} g`, to: `${Math.round(ml)} ml`, ml };
      }
    };

    // Beräkna äggomvandling
    const calculateEggConversion = () => {
      const count = parseInt(eggCount) || 0;
      const fromEgg = conversionData.eggSizes[eggFromSize];
      const toEgg = conversionData.eggSizes[eggToSize];
      
      const totalWeight = count * fromEgg.totalWeight;
      const newCount = totalWeight / toEgg.totalWeight;
      
      return {
        fromTotal: totalWeight,
        toCount: newCount,
        rounded: Math.round(newCount * 10) / 10,
        suggestion: newCount < 1 ? 'Använd mindre ägg eller minska antalet' : 
                    newCount % 1 > 0.3 && newCount % 1 < 0.7 ? `Tips: ${Math.round(newCount)} st blir ${Math.round(newCount * toEgg.totalWeight)}g` : null
      };
    };

    const ingredientResult = calculateIngredientConversion();
    const eggResult = calculateEggConversion();

    return (
      <div className="conversion-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>Måttomvandling</h1>
        
        {/* FLIKAR */}
        <div className="conversion-tabs four-tabs">
          <button 
            className={conversionMode === 'weight' ? 'active' : ''}
            onClick={() => { setConversionMode('weight'); setConversionType('weight'); setFromUnit('kg'); setToUnit('g'); }}
          >
            Vikt
          </button>
          <button 
            className={conversionMode === 'volume' ? 'active' : ''}
            onClick={() => { setConversionMode('volume'); setConversionType('volume'); setFromUnit('dl'); setToUnit('ml'); }}
          >
            Volym
          </button>
          <button 
            className={conversionMode === 'ingredient' ? 'active' : ''}
            onClick={() => setConversionMode('ingredient')}
          >
            Ingrediens
          </button>
          <button 
            className={conversionMode === 'egg' ? 'active' : ''}
            onClick={() => setConversionMode('egg')}
          >
            Ägg
          </button>
        </div>

        {/* VIKT-OMVANDLING */}
        {conversionMode === 'weight' && (
          <>
            <label className="foreign-toggle">
              <input type="checkbox" checked={showForeign} onChange={(e) => setShowForeign(e.target.checked)} />
              <span>Visa utländska enheter (lb, oz)</span>
            </label>

            <div className="converter-box">
              <div className="converter-row">
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="value-input"
                  placeholder="Ange värde"
                />
                <div className="unit-selector">
                  {weightUnitsList.map(unit => (
                    <button key={unit} className={fromUnit === unit ? 'active' : ''} onClick={() => setFromUnit(unit)}>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <div className="converter-arrow">↓ till ↓</div>
              <div className="converter-row">
                <div className="unit-selector">
                  {weightUnitsList.map(unit => (
                    <button key={unit} className={toUnit === unit ? 'active' : ''} onClick={() => setToUnit(unit)}>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <div className="result-box">
                <span className="result-value">{fromValue} {fromUnit}</span>
                <span className="result-equals">=</span>
                <span className="result-value">{calculateConversion()} {toUnit}</span>
              </div>
            </div>
          </>
        )}

        {/* VOLYM-OMVANDLING */}
        {conversionMode === 'volume' && (
          <>
            <label className="foreign-toggle">
              <input type="checkbox" checked={showForeign} onChange={(e) => setShowForeign(e.target.checked)} />
              <span>Visa amerikanska mått (cup, tbsp, etc.)</span>
            </label>

            <div className="converter-box">
              <div className="converter-row">
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  className="value-input"
                  placeholder="Ange värde"
                />
                <div className="unit-selector">
                  {volumeUnitsList.map(unit => (
                    <button key={unit} className={fromUnit === unit ? 'active' : ''} onClick={() => setFromUnit(unit)}>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <div className="converter-arrow">↓ till ↓</div>
              <div className="converter-row">
                <div className="unit-selector">
                  {volumeUnitsList.map(unit => (
                    <button key={unit} className={toUnit === unit ? 'active' : ''} onClick={() => setToUnit(unit)}>
                      {unit}
                    </button>
                  ))}
                </div>
              </div>
              <div className="result-box">
                <span className="result-value">{fromValue} {fromUnit}</span>
                <span className="result-equals">=</span>
                <span className="result-value">{calculateConversion()} {toUnit}</span>
              </div>
            </div>

            {/* MSK/TSK SNABBREFERENS */}
            <div className="common-conversions">
              <h3>Msk & tsk i gram</h3>
              <div className="conversion-list spoon-list">
                {Object.entries(conversionData.spoonReference).map(([ingredient, data]) => (
                  <div key={ingredient} className="conversion-item spoon-item">
                    <span className="ingredient-name">{ingredient}</span>
                    <span className="spoon-values">
                      <span className="spoon-value">1 msk = {data.msk}g</span>
                      <span className="spoon-value">1 tsk = {data.tsk}g</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* INGREDIENS-OMVANDLING */}
        {conversionMode === 'ingredient' && (
          <>
            {recentConversions.length > 0 && !selectedIngredientConv && (
              <div className="recent-conversions">
                <h4>Senast använda</h4>
                <div className="recent-tags">
                  {recentConversions.map((conv, idx) => (
                    <button 
                      key={idx}
                      className="recent-tag"
                      onClick={() => {
                        setSelectedIngredientConv(conv.ingredient);
                        setIngredientFromUnitConv(conv.fromUnit);
                      }}
                    >
                      {conv.ingredient}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="search-box ingredient-search">
              <input
                type="text"
                placeholder="Sök ingrediens (t.ex. mjöl, socker)..."
                value={ingredientSearchConv}
                onChange={(e) => setIngredientSearchConv(e.target.value)}
              />
              {ingredientSearchConv && (
                <button className="clear-search" onClick={() => setIngredientSearchConv('')}>×</button>
              )}
            </div>

            {selectedIngredientConv ? (
              <div className="ingredient-converter">
                <div className="selected-ingredient-header">
                  <h3>{selectedIngredientConv}</h3>
                  <button className="change-ingredient-btn" onClick={() => setSelectedIngredientConv(null)}>
                    Byt ingrediens
                  </button>
                </div>
                
                <p className="ingredient-info">
                  {conversionData.weightToVolume[selectedIngredientConv].gPerDl} g per dl
                </p>

                <div className="direction-selector">
                  <button 
                    className={conversionDirection === 'toWeight' ? 'active' : ''}
                    onClick={() => setConversionDirection('toWeight')}
                  >
                    Volym → Vikt
                  </button>
                  <button 
                    className={conversionDirection === 'toVolume' ? 'active' : ''}
                    onClick={() => setConversionDirection('toVolume')}
                  >
                    Vikt → Volym
                  </button>
                </div>

                <div className="converter-box">
                  <div className="converter-row">
                    <input
                      type="number"
                      value={ingredientAmountConv}
                      onChange={(e) => setIngredientAmountConv(e.target.value)}
                      className="value-input"
                      placeholder="Mängd"
                    />
                    
                    {conversionDirection === 'toWeight' ? (
                      <div className="unit-selector">
                        {['dl', 'msk', 'tsk', 'krm', 'ml'].map(unit => (
                          <button
                            key={unit}
                            className={ingredientFromUnitConv === unit ? 'active' : ''}
                            onClick={() => setIngredientFromUnitConv(unit)}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="static-unit">gram</span>
                    )}
                  </div>

                  {ingredientResult && (
                    <div className="result-box large-result">
                      <span className="result-value">{ingredientResult.from}</span>
                      <span className="result-equals">=</span>
                      <span className="result-value highlight">{ingredientResult.to}</span>
                    </div>
                  )}
                </div>

                <button 
                  className="save-recent-btn"
                  onClick={() => addRecentConversion({
                    ingredient: selectedIngredientConv,
                    fromUnit: ingredientFromUnitConv
                  })}
                >
                  Spara som favorit
                </button>
              </div>
            ) : (
              <div className="ingredient-list-grouped">
                {Object.entries(ingredientsByCategory).map(([category, items]) => (
                  <div key={category} className="ingredient-category">
                    <h4 className="category-header">{category}</h4>
                    <div className="ingredient-buttons">
                      {items.map(([name, data]) => (
                        <button
                          key={name}
                          className="ingredient-btn"
                          onClick={() => setSelectedIngredientConv(name)}
                        >
                          <span className="ing-name">{name}</span>
                          <span className="ing-gpdl">{data.gPerDl} g/dl</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ÄGG-OMVANDLING */}
        {conversionMode === 'egg' && (
          <div className="egg-converter">
            <div className="egg-info-box">
              <p>Recept anger ofta ägg i storlek M. Här kan du räkna om om du har en annan storlek.</p>
            </div>

            <div className="egg-sizes-reference">
              <h4>Äggstorlekar</h4>
              <div className="egg-size-cards">
                {Object.entries(conversionData.eggSizes).map(([size, data]) => (
                  <div key={size} className="egg-size-card">
                    <span className="egg-size-label">{size}</span>
                    <span className="egg-size-weight">{data.totalWeight}g</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="converter-box egg-converter-box">
              <div className="egg-input-row">
                <label>Receptet säger:</label>
                <div className="egg-input-group">
                  <input
                    type="number"
                    value={eggCount}
                    onChange={(e) => setEggCount(e.target.value)}
                    className="egg-count-input"
                    min="1"
                  />
                  <span>st</span>
                  <select 
                    value={eggFromSize}
                    onChange={(e) => setEggFromSize(e.target.value)}
                    className="egg-size-select"
                  >
                    {Object.keys(conversionData.eggSizes).map(size => (
                      <option key={size} value={size}>{size} ({conversionData.eggSizes[size].totalWeight}g)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="converter-arrow">↓</div>

              <div className="egg-input-row">
                <label>Jag har storlek:</label>
                <select 
                  value={eggToSize}
                  onChange={(e) => setEggToSize(e.target.value)}
                  className="egg-size-select"
                >
                  {Object.keys(conversionData.eggSizes).map(size => (
                    <option key={size} value={size}>{size} ({conversionData.eggSizes[size].totalWeight}g)</option>
                  ))}
                </select>
              </div>

              {eggResult && (
                <div className="result-box egg-result">
                  <div className="egg-result-main">
                    <span className="result-label">Använd</span>
                    <span className="result-value highlight">
                      {eggResult.rounded} st {eggToSize}-ägg
                    </span>
                  </div>
                  <div className="egg-result-detail">
                    <span>({eggResult.fromTotal}g totalt)</span>
                  </div>
                  {eggResult.suggestion && (
                    <div className="egg-tip">
                      {eggResult.suggestion}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="egg-tips">
              <h4>Tips för äggersättning</h4>
              <ul>
                <li>Skillnaden mellan M och L är ofta försumbar i de flesta recept</li>
                <li>Vid exakt bakning (t.ex. macarons) väg äggen istället</li>
                <li>1 ägg M ≈ 3 msk uppvispat ägg</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Temperatur-vy
  const renderListView = (data, title) => {
    const categories = Object.keys(data);

    const filterItems = (items) => {
      if (!searchTerm) return items;
      return items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    const totalFiltered = categories.reduce((acc, cat) => acc + filterItems(data[cat]).length, 0);

    // Blancheringsguide detaljvy
    if (showBlanchering) {
      return (
        <div className="detail-view blanchering-view">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setShowBlanchering(false)}>
            ← Tillbaka
          </button>

          <h1>Blancheringsguiden</h1>
          <p className="subtitle">{blancheringData.intro.title}</p>

          <div className="info-box">
            <p>{blancheringData.intro.principle}</p>
          </div>

          <div className="blanchering-keys">
            <h3>De tre nycklarna</h3>
            {blancheringData.keys.map((key, idx) => (
              <div key={idx} className="blanchering-key-card">
                <h4>{idx + 1}. {key.title}</h4>
                <p>{key.description}</p>
              </div>
            ))}
          </div>

          <div className="blanchering-times">
            <h3>Blancheringstider</h3>
            <p className="times-note">Tiderna gäller i kraftigt kokande, saltat vatten. Smaka alltid!</p>
            <div className="items-list">
              {blancheringData.vegetables.map((veg, idx) => (
                <div key={idx} className="blanchering-item">
                  <div className="blanchering-item-main">
                    <span className="item-name">{veg.name}</span>
                    <span className="blanchering-time">{veg.time}</span>
                  </div>
                  <p className="blanchering-tips">{veg.tips}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="info-box">
            <h3>{blancheringData.science.title}</h3>
            <div className="science-facts">
              {blancheringData.science.facts.map((fact, idx) => (
                <div key={idx} className="science-fact-card">
                  <span className="fact-label">{fact.label}</span>
                  <span className="fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
            <p className="science-explanation">{blancheringData.science.explanation}</p>
          </div>
        </div>
      );
    }

    // Brässeringsguide detaljvy
    if (showBrassering) {
      return (
        <div className="detail-view brassering-view">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setShowBrassering(false)}>
            ← Tillbaka
          </button>

          <h1>Brässeringsguiden</h1>
          <p className="subtitle">{brasseringData.intro.title}</p>

          <div className="info-box quote-box">
            <p className="quote">"{brasseringData.intro.principle}"</p>
            <p className="quote-author">— Thomas Keller, The French Laundry</p>
          </div>

          <div className="brassering-steps">
            <h3>Processen steg för steg</h3>
            {brasseringData.steps.map((step, idx) => (
              <div key={idx} className="brassering-step-card">
                <h4>{step.title}</h4>
                <p>{step.description}</p>
                <p className="step-tip"><strong>Tips:</strong> {step.tips}</p>
              </div>
            ))}
          </div>

          <div className="brassering-cuts">
            <h3>Styckdelar & tider</h3>
            <div className="items-list">
              {brasseringData.cuts.map((cut, idx) => (
                <div key={idx} className="brassering-cut-item">
                  <div className="cut-main">
                    <span className="item-name">{cut.name}</span>
                    <div className="cut-details">
                      <span className="cut-time">{cut.time}</span>
                      <span className="cut-temp">{cut.temp}</span>
                    </div>
                  </div>
                  <p className="cut-tips">{cut.tips}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="info-box">
            <h3>{brasseringData.science.title}</h3>
            <div className="science-facts">
              {brasseringData.science.facts.map((fact, idx) => (
                <div key={idx} className="science-fact-card">
                  <span className="fact-label">{fact.label}</span>
                  <span className="fact-value">{fact.value}</span>
                </div>
              ))}
            </div>
            <p className="science-explanation">{brasseringData.science.explanation}</p>
          </div>
        </div>
      );
    }

    if (selectedItem) {
      const nutritionData = findNutritionForItem(selectedItem.name, selectedItem.category);
      const shouldBraise = selectedItem.tips && selectedItem.tips.toLowerCase().includes('brässer');

      // Specialhantering för grönsaker (blanchering)
      if (selectedItem.blanchering) {
        return (
          <div className="detail-view">
            <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setSelectedItem(null)}>
              ← Tillbaka
            </button>

            <div className="detail-header">
              <h2>{selectedItem.name}</h2>
            </div>

            <div className="blanchering-time-display">
              <div className="time-card">
                <span className="time-label">Blancheringstid</span>
                <span className="time-value">{selectedItem.time}</span>
              </div>
            </div>

            <div className="info-box blanchering-method">
              <h3>Metod</h3>
              <ol>
                <li>Koka upp rikligt med vatten - "som havet" salt</li>
                <li>Lägg i grönsaken, håll fullt kok</li>
                <li>Koka i angiven tid</li>
                <li>Flytta direkt till isbad</li>
              </ol>
            </div>

            {selectedItem.tips && (
              <div className="info-box">
                <h3>Tips</h3>
                <p>{selectedItem.tips}</p>
              </div>
            )}

            <button
              className="guide-link-btn"
              onClick={() => setShowBlanchering(true)}
            >
              Läs hela blancheringsguiden →
            </button>
          </div>
        );
      }

      return (
        <div className="detail-view">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setSelectedItem(null)}>
            ← Tillbaka
          </button>

          <div className="detail-header">
            <h2>{selectedItem.name}</h2>
          </div>

          <div className="temp-grid">
            {selectedItem.rare && (
              <div className="temp-card rare">
                <span className="temp-label">Rare</span>
                <span className="temp-value">{selectedItem.rare}°C</span>
              </div>
            )}
            {selectedItem.medium && (
              <div className="temp-card medium">
                <span className="temp-label">Medium</span>
                <span className="temp-value">{selectedItem.medium}°C</span>
              </div>
            )}
            {selectedItem.wellDone && (
              <div className="temp-card welldone">
                <span className="temp-label">Genomstekt</span>
                <span className="temp-value">{selectedItem.wellDone}°C</span>
              </div>
            )}
          </div>

          {selectedItem.restTime && selectedItem.restTime !== '-' && (
            <div className="info-box rest-time-box">
              <h3>Vila-tid</h3>
              <p className="rest-time-value">{selectedItem.restTime}</p>
              <p className="rest-time-note">Temperaturen stiger 2-5°C under vila. Ta ut köttet när det är 3-5°C under måltemperatur.</p>
            </div>
          )}

          {selectedItem.saltning && (
            <div className="info-box saltning-box">
              <h3>Salta</h3>
              <p className="saltning-value">{selectedItem.saltning}</p>
              <p className="saltning-note">Salt behöver tid för att tränga in och möra köttet. Ju tidigare desto bättre smak och textur.</p>
            </div>
          )}

          {selectedItem.tips && (
            <div className="info-box">
              <h3>Tips</h3>
              <p>{selectedItem.tips}</p>
            </div>
          )}

          {shouldBraise && (
            <button
              className="guide-link-btn brassering-link"
              onClick={() => setShowBrassering(true)}
            >
              Läs brässeringsguiden →
            </button>
          )}

          {(selectedItem.rare || selectedItem.medium) && !shouldBraise && (
            <div className="info-box warning">
              <h3>Kom ihåg</h3>
              <p>Köttet fortsätter stiga 2-5°C efter att du tagit ut det. Ta ut det lite tidigare!</p>
            </div>
          )}

          {nutritionData && (
            <div className="info-box nutrition-info">
              <h3>Näringsvärden per 100g</h3>
              <div className="nutrition-grid">
                <div className="nutrition-card">
                  <span className="nutrition-value">{Math.round(nutritionData.nutriments['energy-kcal_100g'] || 0)}</span>
                  <span className="nutrition-label">kcal</span>
                </div>
                <div className="nutrition-card">
                  <span className="nutrition-value">{(nutritionData.nutriments.proteins_100g || 0).toFixed(1)}</span>
                  <span className="nutrition-label">protein (g)</span>
                </div>
                <div className="nutrition-card">
                  <span className="nutrition-value">{(nutritionData.nutriments.carbohydrates_100g || 0).toFixed(1)}</span>
                  <span className="nutrition-label">kolhydrater (g)</span>
                </div>
                <div className="nutrition-card">
                  <span className="nutrition-value">{(nutritionData.nutriments.fat_100g || 0).toFixed(1)}</span>
                  <span className="nutrition-label">fett (g)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Sous Vide detaljvy
    if (showSousVide && selectedSousVideItem) {
      const item = selectedSousVideItem;
      const doneness = sousVideDoneness;
      const setting = item[doneness];

      return (
        <div className="detail-view sousvide-detail">
          <button className="back-btn" onClick={() => setSelectedSousVideItem(null)}>
            ← Tillbaka
          </button>

          <div className="detail-header">
            <h2>{item.name}</h2>
            <span className="sousvide-badge">Sous Vide</span>
          </div>

          {/* Doneness selector */}
          <div className="doneness-selector">
            {item.rare && (
              <button
                className={`doneness-btn ${doneness === 'rare' ? 'active rare' : ''}`}
                onClick={() => setSousVideDoneness('rare')}
              >
                Rare
              </button>
            )}
            {item.medium && (
              <button
                className={`doneness-btn ${doneness === 'medium' ? 'active medium' : ''}`}
                onClick={() => setSousVideDoneness('medium')}
              >
                Medium
              </button>
            )}
            {item.wellDone && (
              <button
                className={`doneness-btn ${doneness === 'wellDone' ? 'active welldone' : ''}`}
                onClick={() => setSousVideDoneness('wellDone')}
              >
                Genomstekt
              </button>
            )}
          </div>

          {/* Thickness selector - dölj för ägg och skaldjur */}
          {sousVideCategory !== 'Ägg' && sousVideCategory !== 'Skaldjur' && (
            <div className="thickness-selector">
              <label className="thickness-label">Tjocklek: <strong>{sousVideThicknessValue} cm</strong></label>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={sousVideThicknessValue}
                onChange={(e) => setSousVideThicknessValue(parseFloat(e.target.value))}
                className="thickness-slider"
              />
              <div className="thickness-marks">
                <span>1 cm</span>
                <span>4 cm</span>
                <span>8 cm</span>
              </div>
            </div>
          )}

          {setting ? (
            <>
              {/* Använd samma temp-grid som vanliga temperaturguiden */}
              <div className="temp-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                <div className={`temp-card ${doneness === 'rare' ? 'rare' : doneness === 'medium' ? 'medium' : 'welldone'}`}>
                  <span className="temp-label">Temperatur</span>
                  <span className="temp-value">{setting.temp}°C</span>
                </div>
                <div className={`temp-card ${doneness === 'rare' ? 'rare' : doneness === 'medium' ? 'medium' : 'welldone'}`}>
                  <span className="temp-label">{(sousVideCategory === 'Ägg' || sousVideCategory === 'Skaldjur') ? 'Tid' : 'Beräknad tid'}</span>
                  <span className="temp-value">
                    {(sousVideCategory === 'Ägg' || sousVideCategory === 'Skaldjur')
                      ? setting.time
                      : calculateSousVideTime(item, doneness, sousVideThicknessValue)}
                  </span>
                </div>
              </div>

              {sousVideCategory !== 'Ägg' && sousVideCategory !== 'Skaldjur' && (
                <p className="thickness-note">
                  Tid beräknad för {sousVideThicknessValue} cm tjocklek från kylskåpstemperatur.
                  Inkluderar uppvärmningstid + pastöriseringsmarginal.
                </p>
              )}

              <div className="info-box">
                <h3>Max tid i vattenbad</h3>
                <p>{item.maxTime}</p>
                <p className="rest-time-note">Efter denna tid kan texturen försämras.</p>
              </div>

              <div className="info-box">
                <h3>Tips</h3>
                <p>{item.tips}</p>
              </div>

              <div className="info-box warning">
                <h3>Efter sous vide</h3>
                <p>{item.afterCare}</p>
              </div>
            </>
          ) : (
            <div className="info-box warning">
              <p>Denna stekgrad rekommenderas inte för {item.name} med sous vide.</p>
            </div>
          )}
        </div>
      );
    }

    // Sous Vide listvy
    if (showSousVide && title === 'Temperaturer') {
      const svCategories = Object.keys(sousVideData);

      return (
        <div className="list-view sousvide-view">
          <button className="back-btn" onClick={() => {
            setActiveView('home');
            setShowSousVide(false);
            setSearchTerm('');
          }}>
            ← Tillbaka
          </button>
          <h1>Temperaturer</h1>

          {/* Toggle mellan traditionell och sous vide */}
          <div className="temp-mode-tabs">
            <button
              className={`mode-tab ${!showSousVide ? 'active' : ''}`}
              onClick={() => setShowSousVide(false)}
            >
              Traditionell
            </button>
            <button
              className={`mode-tab ${showSousVide ? 'active' : ''}`}
              onClick={() => setShowSousVide(true)}
            >
              Sous Vide
            </button>
          </div>

          {/* Säkerhetsinformation */}
          <details className="sousvide-safety">
            <summary className="safety-summary">
              {sousVideSafety.title}
            </summary>
            <div className="safety-content">
              <div className="safety-zones">
                {sousVideSafety.zones.map((zone, idx) => (
                  <div key={idx} className={`safety-zone zone-${idx}`}>
                    <span className="zone-range">{zone.range}</span>
                    <span className="zone-name">{zone.name}</span>
                    <span className="zone-desc">{zone.description}</span>
                  </div>
                ))}
              </div>
              <div className="safety-rules">
                <h4>Viktiga regler:</h4>
                <ul>
                  {sousVideSafety.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
            </div>
          </details>

          <div className="search-box">
            <input
              type="text"
              placeholder="Sök..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm('')}>×</button>
            )}
          </div>

          {svCategories.map(category => {
            const items = sousVideData[category].filter(item =>
              !searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (items.length === 0) return null;

            return (
              <div key={category} className="category-section">
                <h3 className="category-title">{category}</h3>
                <div className="items-list">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="item-row sousvide-item"
                      onClick={() => {
                        setSelectedSousVideItem(item);
                        setSousVideDoneness(item.medium ? 'medium' : item.wellDone ? 'wellDone' : 'rare');
                      }}
                    >
                      <span className="item-name">{item.name}</span>
                      <span className="sousvide-quick-info">
                        {item.medium ? `${item.medium.temp}°C` : item.wellDone ? `${item.wellDone.temp}°C` : `${item.rare.temp}°C`}
                      </span>
                      <span className="item-arrow">›</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="list-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => {
          setActiveView('home');
          setSearchTerm('');
        }}>
          ← Tillbaka
        </button>
        <h1>{title}</h1>

        {/* Toggle mellan traditionell och sous vide - endast för Temperaturer */}
        {title === 'Temperaturer' && (
          <div className="temp-mode-tabs">
            <button
              className={`mode-tab ${!showSousVide ? 'active' : ''}`}
              onClick={() => setShowSousVide(false)}
            >
              Traditionell
            </button>
            <button
              className={`mode-tab ${showSousVide ? 'active' : ''}`}
              onClick={() => setShowSousVide(true)}
            >
              Sous Vide
            </button>
          </div>
        )}

        <div className="search-box">
          <input
            type="text"
            aria-label="Sök"
            placeholder="Sök..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" aria-label="Rensa sökning" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>

        {searchTerm && (
          <div className="search-results-count">
            {totalFiltered} träffar
          </div>
        )}

        {categories.map(category => {
          const filteredItems = filterItems(data[category]);
          if (filteredItems.length === 0) return null;
          const science = categoryScience[category];

          return (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              {science && (
                <details className="category-science">
                  <summary className="science-summary">
                    {science.title}
                  </summary>
                  <div className="science-content">
                    <p>{science.explanation}</p>
                    <p className="science-tip"><strong>Tips:</strong> {science.tip}</p>
                  </div>
                </details>
              )}
              <div className="items-list">
                {filteredItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="item-row"
                    onClick={() => setSelectedItem({...item, category})}
                  >
                    <span className="item-name">{item.name}</span>
                    <span className="item-arrow">›</span>
                  </div>
                ))}
              </div>
              {/* Blancheringsguide efter Grönsaker-kategorin */}
              {category === 'Grönsaker' && title === 'Temperaturer' && !searchTerm && (
                <div
                  className="technique-card blanchering-card category-guide"
                  onClick={() => setShowBlanchering(true)}
                >
                  <div className="technique-content">
                    <h3>Blancheringsguiden</h3>
                    <p>Big-pot blanching - tekniken för perfekt gröna grönsaker</p>
                  </div>
                  <span className="menu-arrow">→</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Kalorier-vy
  const renderCalories = () => {
    const totals = getTotals();
    
    return (
      <div className="calories-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>Kalorier & Näring</h1>
        <p className="api-credit">Kuraterad databas med 974 svenska råvaror</p>
        
        <div className="search-box">
          <input
            type="text"
            aria-label="Sök livsmedel" 
            placeholder="Sök livsmedel (t.ex. 'mjölk', 'bröd', 'pasta')..."
            value={foodSearch}
            onChange={(e) => handleFoodSearch(e.target.value)}
          />
          {(foodSearch || selectedCategory) && (
            <button className="clear-search" aria-label="Rensa sökning" onClick={() => {
              setFoodSearch('');
              setSelectedCategory('');
              setFoodResults([]);
            }}>×</button>
          )}
        </div>

        <div className="category-filter-wrapper">
          <button
            className="category-filter-toggle"
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
          >
            <span>{selectedCategory ? `Kategori: ${foodCategories.find(c => c.id === selectedCategory)?.label || selectedCategory}` : 'Filtrera på kategori'}</span>
            <span style={{marginLeft: 'auto'}}>{showCategoryFilter ? '▲' : '▼'}</span>
          </button>

          {showCategoryFilter && (
            <div className="category-filter">
              {foodCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowCategoryFilter(false);
                    if (foodSearch) handleFoodSearch(foodSearch);
                  }}
                >
                  {cat.label}
                </button>
              ))}
              {selectedCategory && (
                <button
                  className="category-chip clear"
                  onClick={() => {
                    setSelectedCategory('');
                    setShowCategoryFilter(false);
                  }}
                >
                  Rensa filter
                </button>
              )}
            </div>
          )}
        </div>

        {selectedFood ? (
          <div className="food-detail">
            <button className="back-btn" onClick={() => setSelectedFood(null)}>
              ← Tillbaka till resultat
            </button>
            <h2>{selectedFood.product_name}</h2>
            <p className="food-category">{selectedFood.brands}</p>
            
            <div className="portion-selector">
              <label>Portionsstorlek:</label>
              <input
                type="number"
                value={portionSize}
                onChange={(e) => setPortionSize(parseInt(e.target.value) || 100)}
                min="1"
              />
              <span>gram</span>
            </div>

            <div className="nutrition-grid">
              <div className="nutrition-card">
                <span className="nutrition-value">{Math.round((selectedFood.nutriments['energy-kcal_100g'] || 0) * portionSize / 100)}</span>
                <span className="nutrition-label">kcal</span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-value">{((selectedFood.nutriments.proteins_100g || 0) * portionSize / 100).toFixed(1)}</span>
                <span className="nutrition-label">protein (g)</span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-value">{((selectedFood.nutriments.carbohydrates_100g || 0) * portionSize / 100).toFixed(1)}</span>
                <span className="nutrition-label">kolhydrater (g)</span>
              </div>
              <div className="nutrition-card">
                <span className="nutrition-value">{((selectedFood.nutriments.fat_100g || 0) * portionSize / 100).toFixed(1)}</span>
                <span className="nutrition-label">fett (g)</span>
              </div>
            </div>

            {/* Hälsomål-matchning för detta livsmedel */}
            {(() => {
              const foodName = selectedFood.product_name.toLowerCase();
              const matchingGoals = Object.entries(healthGoals).filter(([_, goal]) =>
                goal.goodIngredients.some(ing => foodName.includes(ing.toLowerCase()))
              );
              const avoidGoals = Object.entries(healthGoals).filter(([_, goal]) =>
                goal.avoidIngredients.some(ing => foodName.includes(ing.toLowerCase()))
              );

              if (matchingGoals.length > 0 || avoidGoals.length > 0) {
                return (
                  <div className="food-health-goals">
                    {matchingGoals.length > 0 && (
                      <div className="health-match-section good">
                        <h4>Bra för:</h4>
                        <div className="health-match-tags">
                          {matchingGoals.map(([goalName]) => (
                            <span key={goalName} className="health-match-tag good">
                              {goalName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {avoidGoals.length > 0 && (
                      <div className="health-match-section avoid">
                        <h4>Begränsa vid:</h4>
                        <div className="health-match-tags">
                          {avoidGoals.map(([goalName]) => (
                            <span key={goalName} className="health-match-tag avoid">
                              {goalName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}

            <button
              className="add-to-meal-btn"
              onClick={() => {
                setMealList([...mealList, { food: selectedFood, portion: portionSize }]);
                setSelectedFood(null);
              }}
            >
              + Lägg till i måltid
            </button>
          </div>
        ) : (
          <>
            {foodResults.length > 0 && (
              <div className="food-results">
                <h3>{foodResults.length} resultat</h3>
                {foodResults.map(food => (
                  <div 
                    key={food.code} 
                    className="food-result-item"
                    onClick={() => {
                      setSelectedFood(food);
                      addToSearchHistory(foodSearch);
                    }}
                  >
                    <div className="food-info">
                      <span className="food-name">{food.product_name}</span>
                      <span className="food-brand">{food.brands}</span>
                    </div>
                    <div className="food-kcal">
                      {Math.round(food.nutriments['energy-kcal_100g'] || 0)} kcal
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mealList.length > 0 && (
              <div className="meal-summary">
                <h3>Min måltid</h3>
                {mealList.map((item, idx) => (
                  <div key={idx} className="meal-item">
                    <span>{item.food.product_name}</span>
                    <span>{item.portion}g</span>
                    <button onClick={() => setMealList(mealList.filter((_, i) => i !== idx))}>×</button>
                  </div>
                ))}
                <div className="meal-totals">
                  <div><strong>Totalt:</strong></div>
                  <div>{Math.round(totals.kcal)} kcal</div>
                  <div>P: {totals.protein.toFixed(1)}g</div>
                  <div>K: {totals.carbs.toFixed(1)}g</div>
                  <div>F: {totals.fat.toFixed(1)}g</div>
                </div>
                <button className="clear-meal-btn" onClick={() => setMealList([])}>
                  Rensa måltid
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // Äggguide-vy
  const renderEggGuide = () => {
    return (
      <div className="egg-guide-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>Äggguiden</h1>

        {/* Navigation tabs */}
        <div className="egg-guide-tabs">
          <button
            className={activeEggSection === 'boiling' ? 'active' : ''}
            onClick={() => setActiveEggSection('boiling')}
          >
            Koka
          </button>
          <button
            className={activeEggSection === 'poaching' ? 'active' : ''}
            onClick={() => setActiveEggSection('poaching')}
          >
            Pochera
          </button>
          <button
            className={activeEggSection === 'scrambled' ? 'active' : ''}
            onClick={() => setActiveEggSection('scrambled')}
          >
            Äggröra
          </button>
          <button
            className={activeEggSection === 'frying' ? 'active' : ''}
            onClick={() => setActiveEggSection('frying')}
          >
            Steka
          </button>
          <button
            className={activeEggSection === 'science' ? 'active' : ''}
            onClick={() => setActiveEggSection('science')}
          >
            Vetenskap
          </button>
        </div>

        {/* Kokning */}
        {activeEggSection === 'boiling' && (
          <div className="egg-section">
            <h2>{eggGuideData.boiling.title}</h2>
            <p className="section-description">{eggGuideData.boiling.description}</p>

            <div className="egg-time-cards">
              {eggGuideData.boiling.times.map((item, idx) => (
                <div key={idx} className={`egg-time-card ${item.name === 'Överkokt' ? 'warning' : ''}`}>
                  <div className="egg-time-header">
                    <span className="egg-time-name">{item.name}</span>
                    <span className="egg-time-value">{item.time}</span>
                  </div>
                  <p className="egg-time-desc">{item.description}</p>
                  <span className="egg-time-temp">{item.temp}</span>
                </div>
              ))}
            </div>

            <div className="egg-tips-section">
              <h3>Tips</h3>
              <ul>
                {eggGuideData.boiling.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Pochering */}
        {activeEggSection === 'poaching' && (
          <div className="egg-section">
            <h2>{eggGuideData.poaching.title}</h2>
            <p className="section-description">{eggGuideData.poaching.description}</p>

            <div className="steps-list-guide">
              <h3>Steg för steg</h3>
              <ol>
                {eggGuideData.poaching.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="egg-tips-section">
              <h3>Tips</h3>
              <ul>
                {eggGuideData.poaching.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Äggröra */}
        {activeEggSection === 'scrambled' && (
          <div className="egg-section">
            <h2>{eggGuideData.scrambled.title}</h2>

            <div className="scrambled-styles">
              {eggGuideData.scrambled.styles.map((style, idx) => (
                <div key={idx} className="scrambled-style-card">
                  <h3>{style.name}</h3>
                  <p className="style-method">{style.method}</p>
                  <ul>
                    {style.tips.map((tip, tipIdx) => (
                      <li key={tipIdx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stekning */}
        {activeEggSection === 'frying' && (
          <div className="egg-section">
            <h2>{eggGuideData.frying.title}</h2>
            <p className="section-description">{eggGuideData.frying.description}</p>

            <div className="steps-list-guide">
              <h3>Steg för steg</h3>
              <ol>
                {eggGuideData.frying.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            <div className="egg-tips-section">
              <h3>Tips</h3>
              <ul>
                {eggGuideData.frying.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Vetenskap */}
        {activeEggSection === 'science' && (
          <div className="egg-section">
            <h2>{eggGuideData.science.title}</h2>

            <div className="science-facts">
              {eggGuideData.science.facts.map((fact, idx) => (
                <div key={idx} className="science-fact-card">
                  <span className="fact-label">{fact.label}</span>
                  <span className="fact-value">{fact.value}</span>
                </div>
              ))}
            </div>

            <div className="science-explanation">
              <p>{eggGuideData.science.explanation}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Grundrecept-vy
  const renderBasics = () => {
    const categories = Object.keys(basicRecipesData);

    // Hitta näringsvärden för en ingrediens i databasen
    const findNutritionForIngredient = (foodDbName) => {
      if (!foodDbName) return null;
      const searchName = foodDbName.toLowerCase();
      return foodDatabase.find(food => {
        const productName = food.product_name.toLowerCase();
        return productName.includes(searchName) || searchName.includes(productName);
      });
    };

    // Formatera mängd med enhet
    const formatAmount = (amount, unit, scale) => {
      if (!amount) return null;
      const scaled = amount * scale;

      // Avrundning baserat på mängd
      let rounded;
      if (scaled >= 100) {
        rounded = Math.round(scaled / 5) * 5; // Avrunda till närmaste 5
      } else if (scaled >= 10) {
        rounded = Math.round(scaled);
      } else {
        rounded = Math.round(scaled * 10) / 10;
      }

      // Konvertera till läsbart format
      if (unit === 'g' && rounded >= 1000) {
        return `${(rounded / 1000).toFixed(1)} kg`;
      }
      if (unit === 'ml' && rounded >= 1000) {
        return `${(rounded / 1000).toFixed(1)} l`;
      }
      if (unit === 'ml' && rounded >= 100) {
        return `${Math.round(rounded / 100)} dl`;
      }

      return `${rounded} ${unit}`;
    };

    // Hitta omvandling för ingrediens
    const getConversionInfo = (name, amount, unit) => {
      const convIngredient = Object.keys(conversionData.weightToVolume).find(
        ing => name.toLowerCase().includes(ing.toLowerCase()) ||
               ing.toLowerCase().includes(name.toLowerCase())
      );
      if (!convIngredient) return null;
      const gPerDl = conversionData.weightToVolume[convIngredient].gPerDl;
      if (unit === 'g' && amount) {
        const dl = amount / gPerDl;
        if (dl >= 1) return `≈ ${dl.toFixed(1)} dl`;
        const msk = (amount / gPerDl) * (100 / 15);
        if (msk >= 1) return `≈ ${Math.round(msk)} msk`;
        const tsk = (amount / gPerDl) * (100 / 5);
        return `≈ ${Math.round(tsk)} tsk`;
      }
      return null;
    };

    // Beräkna totalt näringsvärde för receptet
    const calculateRecipeNutrition = (recipe, scale) => {
      if (!recipe.structuredIngredients) return null;

      return recipe.structuredIngredients.reduce((totals, ing) => {
        if (!ing.amount || !ing.foodDbName) return totals;
        const nutrition = findNutritionForIngredient(ing.foodDbName);
        if (!nutrition) return totals;

        const grams = ing.unit === 'g' ? ing.amount * scale :
                      ing.unit === 'ml' ? ing.amount * scale : // approximation
                      ing.unit === 'st' ? ing.amount * 20 * scale : // ägg ~20g gula
                      0;
        const factor = grams / 100;

        return {
          kcal: totals.kcal + (nutrition.nutriments['energy-kcal_100g'] || 0) * factor,
          protein: totals.protein + (nutrition.nutriments.proteins_100g || 0) * factor,
          carbs: totals.carbs + (nutrition.nutriments.carbohydrates_100g || 0) * factor,
          fat: totals.fat + (nutrition.nutriments.fat_100g || 0) * factor,
        };
      }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    };

    if (selectedBasicRecipe) {
      const recipe = selectedBasicRecipe;

      // Special rendering for philosophy entries
      if (recipe.isPhilosophy) {
        return (
          <div className="detail-view philosophy-detail">
            <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setSelectedBasicRecipe(null)}>
              ← Tillbaka
            </button>
            <h2>{recipe.name}</h2>

            <div className="info-box quote-box">
              <p className="quote">{recipe.philosophy.quote}</p>
              <p className="quote-author">— {recipe.philosophy.source}</p>
            </div>

            <div className="philosophy-principles">
              <h3>Grundprinciperna</h3>
              <ul>
                {recipe.philosophy.principles.map((principle, idx) => (
                  <li key={idx}>{principle}</li>
                ))}
              </ul>
            </div>
          </div>
        );
      }

      const hasStructuredIngredients = recipe.structuredIngredients && recipe.structuredIngredients.length > 0;
      const scaledPortions = hasStructuredIngredients ? recipe.basePortions * recipeScale : null;
      const nutrition = hasStructuredIngredients ? calculateRecipeNutrition(recipe, recipeScale) : null;

      return (
        <div className="detail-view recipe-detail">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => {
            setSelectedBasicRecipe(null);
            setRecipeScale(1);
            setShowRecipeNutrition(false);
            setSelectedRecipeIngredient(null);
          }}>
            ← Tillbaka
          </button>
          <h2>{recipe.name}</h2>

          {/* Portionsskalare */}
          {hasStructuredIngredients && (
            <div className="recipe-scaler">
              <span className="scaler-label">
                {recipe.portionUnit === 'portioner' ? 'Portioner:' : 'Ger:'}
              </span>
              <div className="scaler-controls">
                <button
                  className="scaler-btn"
                  onClick={() => setRecipeScale(Math.max(0.25, recipeScale - 0.25))}
                  disabled={recipeScale <= 0.25}
                >
                  −
                </button>
                <span className="scaler-value">
                  {scaledPortions % 1 === 0 ? scaledPortions : scaledPortions.toFixed(1)} {recipe.portionUnit}
                </span>
                <button
                  className="scaler-btn"
                  onClick={() => setRecipeScale(recipeScale + 0.25)}
                >
                  +
                </button>
              </div>
              <div className="scaler-presets">
                {[0.5, 1, 2, 4].map(preset => (
                  <button
                    key={preset}
                    className={`preset-btn ${recipeScale === preset ? 'active' : ''}`}
                    onClick={() => setRecipeScale(preset)}
                  >
                    {preset === 1 ? 'Original' : `×${preset}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="recipe-meta">
            <span className="meta-item">{recipe.time}</span>
          </div>

          {recipe.description && (
            <p className="recipe-description">{recipe.description}</p>
          )}

          {/* Ingredienser */}
          <div className="recipe-section">
            <h3>Ingredienser</h3>
            {hasStructuredIngredients ? (
              <ul className="structured-ingredient-list">
                {recipe.structuredIngredients.map((ing, idx) => {
                  const scaledAmount = ing.amount ? ing.amount * recipeScale : null;
                  const formattedAmount = formatAmount(ing.amount, ing.unit, recipeScale);
                  const conversion = scaledAmount ? getConversionInfo(ing.name, scaledAmount, ing.unit) : null;
                  const nutritionInfo = findNutritionForIngredient(ing.foodDbName);

                  return (
                    <li
                      key={idx}
                      className={`structured-ingredient ${ing.optional ? 'optional' : ''} ${nutritionInfo ? 'has-nutrition' : ''}`}
                      onClick={() => nutritionInfo && setSelectedRecipeIngredient(
                        selectedRecipeIngredient?.name === ing.name ? null : { ...ing, nutrition: nutritionInfo, scaledAmount }
                      )}
                    >
                      <div className="ingredient-main">
                        <span className="ingredient-amount">{formattedAmount || ''}</span>
                        <span className="ingredient-name">
                          {ing.name}
                          {ing.note && <span className="ingredient-note">, {ing.note}</span>}
                          {ing.optional && <span className="optional-tag">(valfritt)</span>}
                        </span>
                        {conversion && <span className="ingredient-conversion">{conversion}</span>}
                      </div>
                      {selectedRecipeIngredient?.name === ing.name && nutritionInfo && (
                        <div className="ingredient-nutrition-popup">
                          <div className="popup-header">{ing.name} - {formatAmount(ing.amount, ing.unit, recipeScale)}</div>
                          <div className="popup-nutrition">
                            <span>{Math.round((nutritionInfo.nutriments['energy-kcal_100g'] || 0) * (scaledAmount || 0) / 100)} kcal</span>
                            <span>P: {((nutritionInfo.nutriments.proteins_100g || 0) * (scaledAmount || 0) / 100).toFixed(1)}g</span>
                            <span>K: {((nutritionInfo.nutriments.carbohydrates_100g || 0) * (scaledAmount || 0) / 100).toFixed(1)}g</span>
                            <span>F: {((nutritionInfo.nutriments.fat_100g || 0) * (scaledAmount || 0) / 100).toFixed(1)}g</span>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="ingredient-list">
                {recipe.ingredients && recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>{ing}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Näringsvärden för hela receptet */}
          {nutrition && (
            <div className="recipe-section">
              <button
                className="nutrition-toggle"
                onClick={() => setShowRecipeNutrition(!showRecipeNutrition)}
              >
                {showRecipeNutrition ? '▼' : '▶'} Näringsvärden (uppskattat)
              </button>
              {showRecipeNutrition && (
                <div className="recipe-nutrition">
                  <div className="nutrition-row">
                    <span className="nutrition-label">Totalt ({scaledPortions} {recipe.portionUnit})</span>
                    <span>{Math.round(nutrition.kcal)} kcal</span>
                    <span>P: {nutrition.protein.toFixed(0)}g</span>
                    <span>K: {nutrition.carbs.toFixed(0)}g</span>
                    <span>F: {nutrition.fat.toFixed(0)}g</span>
                  </div>
                  {recipe.portionUnit === 'portioner' && scaledPortions > 1 && (
                    <div className="nutrition-row per-portion">
                      <span className="nutrition-label">Per portion</span>
                      <span>{Math.round(nutrition.kcal / scaledPortions)} kcal</span>
                      <span>P: {(nutrition.protein / scaledPortions).toFixed(0)}g</span>
                      <span>K: {(nutrition.carbs / scaledPortions).toFixed(0)}g</span>
                      <span>F: {(nutrition.fat / scaledPortions).toFixed(0)}g</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Instruktioner */}
          <div className="recipe-section">
            <h3>Instruktioner</h3>
            <ol className="steps-list">
              {recipe.steps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      );
    }

    return (
      <div className="list-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>Grundrecept</h1>

        {categories.map(category => (
          <div key={category} className="category-section">
            <h3 className="category-title">{category}</h3>
            <div className="items-list">
              {basicRecipesData[category].map(recipe => (
                recipe.isPhilosophy ? (
                  <div
                    key={recipe.id}
                    className="philosophy-card"
                    onClick={() => setSelectedBasicRecipe(recipe)}
                  >
                    <div className="philosophy-header">
                      <span className="philosophy-name">{recipe.name}</span>
                    </div>
                    <p className="philosophy-desc">{recipe.description}</p>
                  </div>
                ) : (
                  <div
                    key={recipe.id}
                    className="item-row"
                    onClick={() => {
                      setSelectedBasicRecipe(recipe);
                      setRecipeScale(1);
                    }}
                  >
                    <span className="item-name">{recipe.name}</span>
                    <span className="item-meta">{recipe.time}</span>
                    <span className="item-arrow">›</span>
                  </div>
                )
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Skapa recept-vy (förenklad)
  const renderCreate = () => {
    // Sök ingredienser i databasen
    const searchIngredients = (term) => {
      if (term.length < 2) {
        setIngredientResults([]);
        return;
      }
      const results = foodDatabase.filter(food =>
        food.product_name.toLowerCase().includes(term.toLowerCase())
      ).slice(0, 10);
      setIngredientResults(results);
    };

    // Lägg till ingrediens i receptet
    const addIngredientToRecipe = (food) => {
      const newIng = {
        id: Date.now(),
        food: food,
        amount: ingredientAmount,
        unit: ingredientUnit
      };
      setNewRecipe({
        ...newRecipe,
        ingredients: [...newRecipe.ingredients, newIng]
      });
      setIngredientSearch('');
      setIngredientResults([]);
      setSelectedIngredientFood(null);
      setIngredientAmount(100);
    };

    // Ta bort ingrediens
    const removeIngredient = (id) => {
      setNewRecipe({
        ...newRecipe,
        ingredients: newRecipe.ingredients.filter(ing => ing.id !== id)
      });
    };

    // Lägg till steg
    const addStep = () => {
      if (newStep.trim()) {
        setNewRecipe({
          ...newRecipe,
          steps: [...newRecipe.steps, newStep.trim()]
        });
        setNewStep('');
      }
    };

    // Ta bort steg
    const removeStep = (index) => {
      setNewRecipe({
        ...newRecipe,
        steps: newRecipe.steps.filter((_, i) => i !== index)
      });
    };

    // Beräkna näringsvärden för hela receptet
    const calculateRecipeNutrition = () => {
      return newRecipe.ingredients.reduce((totals, ing) => {
        const grams = convertToGrams(ing.amount, ing.unit, ing.food.product_name);
        const factor = grams / 100;
        return {
          kcal: totals.kcal + (ing.food.nutriments['energy-kcal_100g'] || 0) * factor,
          protein: totals.protein + (ing.food.nutriments.proteins_100g || 0) * factor,
          carbs: totals.carbs + (ing.food.nutriments.carbohydrates_100g || 0) * factor,
          fat: totals.fat + (ing.food.nutriments.fat_100g || 0) * factor
        };
      }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
    };

    // Spara recept
    const saveRecipe = () => {
      if (!newRecipe.name.trim()) {
        alert('Ange ett receptnamn');
        return;
      }
      if (newRecipe.ingredients.length === 0) {
        alert('Lägg till minst en ingrediens');
        return;
      }

      const recipe = {
        id: editingRecipeId || Date.now(),
        ...newRecipe,
        nutrition: calculateRecipeNutrition(),
        createdAt: editingRecipeId ? savedRecipes.find(r => r.id === editingRecipeId)?.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingRecipeId) {
        setSavedRecipes(savedRecipes.map(r => r.id === editingRecipeId ? recipe : r));
        setEditingRecipeId(null);
      } else {
        setSavedRecipes([recipe, ...savedRecipes]);
      }

      // Återställ formuläret
      setNewRecipe({ name: '', portions: '4', ingredients: [], steps: [] });
    };

    // Redigera recept
    const editRecipe = (recipe) => {
      setNewRecipe({
        name: recipe.name,
        portions: recipe.portions,
        ingredients: recipe.ingredients || [],
        steps: recipe.steps || []
      });
      setEditingRecipeId(recipe.id);
    };

    // Ta bort recept
    const deleteRecipe = (id) => {
      if (window.confirm('Vill du verkligen ta bort detta recept?')) {
        setSavedRecipes(savedRecipes.filter(r => r.id !== id));
        if (editingRecipeId === id) {
          setEditingRecipeId(null);
          setNewRecipe({ name: '', portions: '4', ingredients: [], steps: [] });
        }
      }
    };

    const nutrition = calculateRecipeNutrition();
    const perPortion = {
      kcal: Math.round(nutrition.kcal / (parseInt(newRecipe.portions) || 1)),
      protein: (nutrition.protein / (parseInt(newRecipe.portions) || 1)).toFixed(1),
      carbs: (nutrition.carbs / (parseInt(newRecipe.portions) || 1)).toFixed(1),
      fat: (nutrition.fat / (parseInt(newRecipe.portions) || 1)).toFixed(1)
    };

    return (
      <div className="create-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>{editingRecipeId ? 'Redigera recept' : 'Skapa recept'}</h1>

        <div className="create-form">
          <div className="form-row">
            <div className="form-group flex-2">
              <label>Receptnamn</label>
              <input
                type="text"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                placeholder="T.ex. Köttbullar"
              />
            </div>
            <div className="form-group flex-1">
              <label>Portioner</label>
              <input
                type="number"
                value={newRecipe.portions}
                onChange={(e) => setNewRecipe({...newRecipe, portions: e.target.value})}
                min="1"
              />
            </div>
          </div>

          {/* Ingredienssökning */}
          <div className="form-group">
            <label>Lägg till ingrediens</label>
            <div className="ingredient-search-row">
              <input
                type="text"
                value={ingredientSearch}
                onChange={(e) => {
                  setIngredientSearch(e.target.value);
                  searchIngredients(e.target.value);
                }}
                placeholder="Sök ingrediens..."
                className="ingredient-search-input"
              />
              {ingredientResults.length > 0 && (
                <div className="ingredient-search-results">
                  {ingredientResults.map(food => (
                    <div
                      key={food.code}
                      className="ingredient-result-item"
                      onClick={() => {
                        setSelectedIngredientFood(food);
                        setIngredientResults([]);
                        setIngredientSearch(food.product_name);
                      }}
                    >
                      <span className="ingredient-name">{food.product_name}</span>
                      <span className="ingredient-kcal">{food.nutriments['energy-kcal_100g']} kcal/100g</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedIngredientFood && (
              <div className="ingredient-amount-section">
                <div className="ingredient-amount-row">
                  <input
                    type="number"
                    value={ingredientAmount}
                    onChange={(e) => setIngredientAmount(parseInt(e.target.value) || 0)}
                    min="1"
                    className="amount-input"
                  />
                  <select
                    value={ingredientUnit}
                    onChange={(e) => setIngredientUnit(e.target.value)}
                    className="unit-select"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="dl">dl</option>
                    <option value="msk">msk</option>
                    <option value="tsk">tsk</option>
                    <option value="krm">krm</option>
                    <option value="st">st</option>
                  </select>
                  <button
                    className="add-ingredient-btn"
                    onClick={() => addIngredientToRecipe(selectedIngredientFood)}
                  >
                    + Lägg till
                  </button>
                </div>
                {ingredientUnit !== 'g' && ingredientUnit !== 'st' && ingredientUnit !== 'kg' && (
                  <div className="measure-hint">
                    ≈ {convertToGrams(ingredientAmount, ingredientUnit, selectedIngredientFood.product_name)}g • {Math.round((selectedIngredientFood.nutriments['energy-kcal_100g'] || 0) * convertToGrams(ingredientAmount, ingredientUnit, selectedIngredientFood.product_name) / 100)} kcal
                  </div>
                )}
                {ingredientUnit === 'kg' && (
                  <div className="measure-hint">
                    = {ingredientAmount * 1000}g • {Math.round((selectedIngredientFood.nutriments['energy-kcal_100g'] || 0) * ingredientAmount * 10)} kcal
                  </div>
                )}
                {ingredientUnit === 'g' && (
                  <div className="measure-hint">
                    {Math.round((selectedIngredientFood.nutriments['energy-kcal_100g'] || 0) * ingredientAmount / 100)} kcal
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lista över tillagda ingredienser */}
          {newRecipe.ingredients.length > 0 && (
            <div className="recipe-ingredients-list">
              <div className="ingredients-header">
                <label>Ingredienser ({newRecipe.ingredients.length})</label>

                {/* Toggle för procentuell skalning */}
                <div className="scaling-toggle">
                  <label>
                    <input
                      type="checkbox"
                      checked={usePercentScaling}
                      onChange={(e) => {
                        setUsePercentScaling(e.target.checked);
                        if (e.target.checked && !mainIngredientId && newRecipe.ingredients.length > 0) {
                          // Sätt första ingrediensen som huvudingrediens om ingen är vald
                          setMainIngredientId(newRecipe.ingredients[0].id);
                        }
                      }}
                    />
                    <span>%-skalning</span>
                  </label>
                </div>
              </div>

              {usePercentScaling && (
                <p className="scaling-hint">
                  💡 Klicka "100%" för att välja huvudingrediens. Alla andra ingredienser visas som procent av denna.
                </p>
              )}

              {newRecipe.ingredients.map(ing => {
                // Beräkna procent baserat på huvudingrediens (i gram)
                const mainIng = newRecipe.ingredients.find(i => i.id === mainIngredientId);
                const mainGrams = mainIng ? convertToGrams(mainIng.amount, mainIng.unit, mainIng.food.product_name) : 0;
                const thisGrams = convertToGrams(ing.amount, ing.unit, ing.food.product_name);
                const percent = mainGrams > 0 ? Math.round((thisGrams / mainGrams) * 100) : 0;
                const isMain = ing.id === mainIngredientId;

                return (
                  <div key={ing.id} className={`recipe-ingredient-item ${isMain ? 'is-main' : ''}`}>
                    <span className="ing-amount">{ing.amount} {ing.unit}</span>
                    <span className="ing-name">
                      {ing.food.product_name}
                      {usePercentScaling && isMain && <span className="main-ingredient-badge">100%</span>}
                    </span>

                    {usePercentScaling && (
                      <>
                        {!isMain && <span className="percent-display">{percent}%</span>}
                        {!isMain && (
                          <button
                            className="set-main-btn"
                            onClick={() => setMainIngredientId(ing.id)}
                            title="Sätt som huvudingrediens (100%)"
                          >
                            100%
                          </button>
                        )}
                      </>
                    )}

                    <button
                      className="remove-btn"
                      onClick={() => {
                        removeIngredient(ing.id);
                        if (ing.id === mainIngredientId) {
                          // Om vi tar bort huvudingrediensen, välj nästa
                          const remaining = newRecipe.ingredients.filter(i => i.id !== ing.id);
                          setMainIngredientId(remaining.length > 0 ? remaining[0].id : null);
                        }
                      }}
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tillagningssteg */}
          <div className="form-group">
            <label>Tillagningssteg</label>
            <div className="step-input-row">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Beskriv ett steg..."
                onKeyDown={(e) => e.key === 'Enter' && addStep()}
              />
              <button className="add-step-btn" onClick={addStep}>+</button>
            </div>

            {newRecipe.steps.length > 0 && (
              <ol className="steps-list">
                {newRecipe.steps.map((step, index) => (
                  <li key={index}>
                    <span>{step}</span>
                    <button className="remove-btn" onClick={() => removeStep(index)}>×</button>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Näringsvärden */}
          {newRecipe.ingredients.length > 0 && (
            <div className="recipe-nutrition-summary">
              <label>Näringsvärden per portion</label>
              <div className="nutrition-mini-grid">
                <div><strong>{perPortion.kcal}</strong> kcal</div>
                <div><strong>{perPortion.protein}</strong>g protein</div>
                <div><strong>{perPortion.carbs}</strong>g kolhydrater</div>
                <div><strong>{perPortion.fat}</strong>g fett</div>
              </div>
            </div>
          )}

          {/* Knappar */}
          <div className="form-actions">
            <button className="save-recipe-btn" onClick={saveRecipe}>
              {editingRecipeId ? '💾 Uppdatera recept' : '💾 Spara recept'}
            </button>
            {editingRecipeId && (
              <button
                className="cancel-edit-btn"
                onClick={() => {
                  setEditingRecipeId(null);
                  setNewRecipe({ name: '', portions: '4', ingredients: [], steps: [] });
                }}
              >
                Avbryt
              </button>
            )}
          </div>
        </div>

        {/* Sparade recept */}
        {savedRecipes.length > 0 && (
          <div className="saved-recipes">
            <h2>Sparade recept ({savedRecipes.length})</h2>
            <div className="recipe-list">
              {savedRecipes.map(recipe => {
                const currentPortions = getScaledPortions(recipe.id, recipe.portions);
                const scale = currentPortions / (parseInt(recipe.portions) || 1);
                const scaledNutrition = {
                  kcal: Math.round((recipe.nutrition?.kcal || 0) * scale / currentPortions),
                  protein: ((recipe.nutrition?.protein || 0) * scale / currentPortions).toFixed(1),
                  carbs: ((recipe.nutrition?.carbs || 0) * scale / currentPortions).toFixed(1),
                  fat: ((recipe.nutrition?.fat || 0) * scale / currentPortions).toFixed(1)
                };

                // Exportera recept som text
                const exportRecipeAsText = () => {
                  const text = `${recipe.name}\n${'='.repeat(recipe.name.length)}\n\n` +
                    `Portioner: ${currentPortions}\n\n` +
                    `INGREDIENSER:\n` +
                    recipe.ingredients?.map(ing => {
                      const scaledAmount = scaleIngredient(ing.amount, recipe.portions, currentPortions);
                      return `• ${scaledAmount} ${ing.unit} ${ing.food.product_name}`;
                    }).join('\n') + '\n\n' +
                    (recipe.steps?.length > 0 ?
                      `TILLAGNING:\n` + recipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n') + '\n\n' : '') +
                    `Näring per portion: ${scaledNutrition.kcal} kcal, ${scaledNutrition.protein}g protein, ` +
                    `${scaledNutrition.carbs}g kolhydrater, ${scaledNutrition.fat}g fett\n\n` +
                    `— Skapat med Köksguiden`;

                  navigator.clipboard.writeText(text).then(() => {
                    alert('Receptet kopierat till urklipp!');
                  });
                };

                return (
                  <div key={recipe.id} className={`saved-recipe-card ${expandedRecipeId === recipe.id ? 'expanded' : ''}`}>
                    <div
                      className="recipe-header"
                      onClick={() => setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id)}
                    >
                      <div>
                        <h3>{recipe.name}</h3>
                        <p>{currentPortions} port. • {recipe.ingredients?.length || 0} ingr. • {scaledNutrition.kcal} kcal/port.</p>
                      </div>
                      <span className="expand-arrow">{expandedRecipeId === recipe.id ? '▼' : '▶'}</span>
                    </div>

                    {expandedRecipeId === recipe.id && (
                      <div className="recipe-details">
                        {/* Portionsskalning */}
                        <div className="portion-scaler">
                          <label>Portioner:</label>
                          <div className="scaler-controls">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (currentPortions > 1) {
                                  setScaledPortions({...scaledPortions, [recipe.id]: currentPortions - 1});
                                }
                              }}
                            >−</button>
                            <span className="portion-count">{currentPortions}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setScaledPortions({...scaledPortions, [recipe.id]: currentPortions + 1});
                              }}
                            >+</button>
                            {currentPortions !== parseInt(recipe.portions) && (
                              <button
                                className="reset-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newScaled = {...scaledPortions};
                                  delete newScaled[recipe.id];
                                  setScaledPortions(newScaled);
                                }}
                              >↺ Original ({recipe.portions})</button>
                            )}
                          </div>
                        </div>

                        <div className="recipe-ingredients">
                          <strong>Ingredienser:</strong>
                          <ul>
                            {recipe.ingredients?.map(ing => {
                              const scaledAmount = scaleIngredient(ing.amount, recipe.portions, currentPortions);
                              const gramsEquiv = convertToGrams(scaledAmount, ing.unit, ing.food.product_name);
                              return (
                                <li key={ing.id}>
                                  <span className="scaled-amount">{scaledAmount} {ing.unit}</span> {ing.food.product_name}
                                  {ing.unit !== 'g' && ing.unit !== 'st' && (
                                    <span className="gram-equiv"> (≈{gramsEquiv}g)</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        {recipe.steps?.length > 0 && (
                          <div className="recipe-steps">
                            <strong>Tillagning:</strong>
                            <ol>
                              {recipe.steps.map((step, i) => (
                                <li key={i}>{step}</li>
                              ))}
                            </ol>
                          </div>
                        )}

                        {/* Näringsvärden skalade */}
                        <div className="recipe-nutrition-scaled">
                          <strong>Näring per portion:</strong>
                          <div className="nutrition-mini-grid">
                            <div><strong>{scaledNutrition.kcal}</strong> kcal</div>
                            <div><strong>{scaledNutrition.protein}</strong>g protein</div>
                            <div><strong>{scaledNutrition.carbs}</strong>g kolh.</div>
                            <div><strong>{scaledNutrition.fat}</strong>g fett</div>
                          </div>
                        </div>

                        <div className="recipe-actions">
                          <button onClick={() => editRecipe(recipe)}>✏️ Redigera</button>
                          <button onClick={exportRecipeAsText}>📋 Kopiera</button>
                          <button onClick={() => deleteRecipe(recipe.id)}>🗑️ Ta bort</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 onClick={() => {
          setActiveView('home');
          setSelectedItem(null);
          setSearchTerm('');
        }}>
          Köksguiden
        </h1>
      </header>

      <main className="app-main">
        {activeView === 'home' && renderHome()}
        {activeView === 'temperatures' && renderListView(temperatureData, 'Temperaturer')}
        {activeView === 'conversion' && renderConversion()}
        {activeView === 'calories' && renderCalories()}
        {activeView === 'basics' && renderBasics()}
        {activeView === 'eggguide' && renderEggGuide()}
        {activeView === 'create' && renderCreate()}
      </main>

      <footer className="app-footer">
        <span className="footer-credit">Köksguiden © 2025</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: #FEFBF7;
          font-family: 'DM Sans', sans-serif;
          color: #2D2A26;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          background: #5C4A3D;
          color: #FFFFFF;
          padding: 1.5rem 1rem;
          text-align: center;
        }

        .app-header h1 {
          font-size: 1.75rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .app-main {
          flex: 1;
          padding: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .app-footer {
          background: #5C4A3D;
          padding: 1rem;
          text-align: center;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
        }

        /* Home Grid */
        .home-grid {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .menu-card {
          background: #FFF5EE;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 4px solid #E87D48;
          position: relative;
        }

        .menu-card:hover {
          background: #FACBB0;
        }

        .menu-card h2 {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #2D2A26;
          margin-bottom: 0.25rem;
        }

        .menu-card p {
          font-size: 0.85rem;
          color: #5C4A3D;
        }

        .menu-arrow {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #D35F2D;
          font-size: 1.5rem;
        }

        /* Buttons */
        .back-btn {
          background: none;
          border: none;
          color: #D35F2D;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem 0;
          margin-bottom: 1rem;
          font-family: inherit;
          letter-spacing: 0.05em;
        }

        /* Search Box */
        .search-box {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #E8E0D8;
          font-size: 1rem;
          font-family: inherit;
          background: #FFFFFF;
        }

        .search-box input:focus {
          outline: none;
          border-color: #D35F2D;
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: #E8E0D8;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          color: #5C4A3D;
        }

        /* Category Section */
        .category-section {
          margin-bottom: 1.5rem;
        }

        .category-title {
          background: #FFF5EE;
          padding: 0.75rem 1rem;
          font-size: 0.7rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2D2A26;
          font-weight: 600;
          border-left: 4px solid #E87D48;
          margin-bottom: 0;
        }

        .items-list {
          background: white;
          overflow: hidden;
          border: 1px solid #E8E0D8;
          border-top: none;
        }

        .item-row {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #F5EFE8;
          cursor: pointer;
          transition: background 0.15s;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-row:hover {
          background: #FFF5EE;
        }

        .item-name {
          flex: 1;
          font-weight: 500;
          color: #2D2A26;
        }

        .item-meta {
          color: #D35F2D;
          font-size: 0.875rem;
          margin-right: 0.5rem;
        }

        .item-arrow {
          color: #D35F2D;
          font-size: 1.25rem;
        }

        /* Detail View */
        .detail-view h2 {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #2D2A26;
          margin-bottom: 1rem;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Temperature Grid */
        .temp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .temp-card {
          background: white;
          padding: 1rem;
          text-align: center;
        }

        .temp-card.rare {
          background: #FFF5EE;
        }

        .temp-card.medium {
          background: #F5A576;
        }

        .temp-card.welldone {
          background: #5C4A3D;
        }

        .temp-label {
          display: block;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.25rem;
        }

        .temp-card.rare .temp-label,
        .temp-card.rare .temp-value {
          color: #2D2A26;
        }

        .temp-card.medium .temp-label {
          color: rgba(255,255,255,0.8);
        }

        .temp-card.medium .temp-value {
          color: #FFFFFF;
        }

        .temp-card.welldone .temp-label {
          color: rgba(255,255,255,0.7);
        }

        .temp-card.welldone .temp-value {
          color: #FFFFFF;
        }

        .temp-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* Info Box */
        .info-box {
          background: #FFFFFF;
          padding: 1rem;
          margin-bottom: 1rem;
          border: 1px solid #E8E0D8;
        }

        .info-box h3 {
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
          color: #5C4A3D;
        }

        .info-box.warning {
          background: #FFF5EE;
          border: 1px solid #FACBB0;
        }

        .info-box.nutrition-info {
          background: #FEFBF7;
          border: 1px solid #F5A576;
        }

        .info-box.nutrition-info .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .info-box.nutrition-info .nutrition-card {
          background: #FFFFFF;
          padding: 0.75rem 0.5rem;
          text-align: center;
          border-radius: 4px;
          border: 1px solid #E8E0D8;
        }

        .info-box.nutrition-info .nutrition-value {
          display: block;
          font-size: 1.2rem;
          font-weight: 600;
          color: #5C4A3D;
        }

        .info-box.nutrition-info .nutrition-label {
          display: block;
          font-size: 0.65rem;
          color: #666;
          margin-top: 0.25rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 400px) {
          .info-box.nutrition-info .nutrition-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        /* Conversion View */
        .conversion-tabs {
          display: flex;
          background: #E8E0D8;
          padding: 2px;
          margin-bottom: 1rem;
        }

        .conversion-tabs.four-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px;
        }

        .conversion-tabs button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          background: transparent;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #5C4A3D;
        }

        .conversion-tabs.four-tabs button {
          padding: 0.6rem 0.25rem;
          font-size: 0.75rem;
        }

        .conversion-tabs button.active {
          background: #FFF5EE;
          color: #D35F2D;
        }

        .foreign-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          cursor: pointer;
        }

        .foreign-toggle input {
          width: 20px;
          height: 20px;
          accent-color: #D35F2D;
        }

        .converter-box {
          background: white;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 1px solid #E8E0D8;
        }

        .converter-row {
          margin-bottom: 1rem;
        }

        .value-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #E8E0D8;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          font-family: inherit;
          margin-bottom: 1rem;
          background: #FEFBF7;
          color: #2D2A26;
        }

        .value-input:focus {
          outline: none;
          border-color: #D35F2D;
        }

        .unit-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .unit-selector button {
          padding: 0.5rem 1rem;
          border: 2px solid #E8E0D8;
          background: white;
          cursor: pointer;
          font-weight: 500;
          font-family: inherit;
          transition: all 0.15s;
        }

        .unit-selector button.active {
          background: #D35F2D;
          border-color: #D35F2D;
          color: white;
        }

        .unit-selector button:hover:not(.active) {
          border-color: #D35F2D;
        }

        .converter-arrow {
          text-align: center;
          color: #8B7B6B;
          margin: 1rem 0;
          font-weight: 500;
          letter-spacing: 0.1em;
        }

        .result-box {
          background: #FFF5EE;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .result-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2D2A26;
        }

        .result-equals {
          color: #D35F2D;
        }

        .result-value.highlight {
          font-size: 1.5rem;
          color: #D35F2D;
        }

        /* Common Conversions */
        .common-conversions h3 {
          font-family: 'Playfair Display', serif;
          color: #5C4A3D;
          margin-bottom: 1rem;
        }

        .conversion-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          max-height: 400px;
          overflow-y: auto;
        }

        .conversion-item {
          display: flex;
          justify-content: space-between;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #f5f0f3;
        }

        .conversion-item:last-child {
          border-bottom: none;
        }

        .ingredient-name {
          font-weight: 500;
          color: #2D2A26;
        }

        .ingredient-value {
          color: #D35F2D;
          font-weight: 600;
        }

        /* Spoon Reference */
        .spoon-list .spoon-item {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.25rem;
        }

        .spoon-values {
          display: flex;
          gap: 1rem;
        }

        .spoon-value {
          font-size: 0.85rem;
          color: #D35F2D;
          background: #FFF5EE;
          padding: 0.2rem 0.5rem;
        }

        /* Recent Conversions */
        .recent-conversions {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #FFF5EE;
        }

        .recent-conversions h4 {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.5rem;
        }

        .recent-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .recent-tag {
          padding: 0.4rem 0.75rem;
          background: white;
          border: 1px solid #E8E0D8;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .recent-tag:hover {
          border-color: #D35F2D;
          background: #FEFBF7;
        }

        /* Ingredient Converter */
        .ingredient-converter {
          background: white;
          padding: 1.5rem;
          border: 1px solid #E8E0D8;
        }

        .selected-ingredient-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .selected-ingredient-header h3 {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #2D2A26;
          margin: 0;
        }

        .change-ingredient-btn {
          padding: 0.4rem 0.75rem;
          background: #FFF5EE;
          border: none;
          font-size: 0.8rem;
          color: #D35F2D;
          cursor: pointer;
        }

        .ingredient-info {
          color: #5C4A3D;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .direction-selector {
          display: flex;
          background: #E8E0D8;
          padding: 3px;
          margin-bottom: 1rem;
        }

        .direction-selector button {
          flex: 1;
          padding: 0.6rem;
          border: none;
          background: transparent;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .direction-selector button.active {
          background: #FFF5EE;
          color: #D35F2D;
          font-weight: 600;
        }

        .static-unit {
          display: block;
          text-align: center;
          padding: 0.75rem;
          color: #D35F2D;
          font-weight: 600;
        }

        .large-result {
          padding: 1.5rem;
        }

        .save-recent-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: #FFF5EE;
          border: 1px solid #E8E0D8;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.05em;
        }

        .save-recent-btn:hover {
          border-color: #D35F2D;
        }

        /* Ingredient List Grouped */
        .ingredient-list-grouped {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ingredient-category {
          background: white;
          padding: 1rem;
          border: 1px solid #E8E0D8;
        }

        .category-header {
          font-size: 0.7rem;
          color: #5C4A3D;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .ingredient-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .ingredient-btn {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 0.6rem 0.9rem;
          background: #FEFBF7;
          border: 1px solid #E8E0D8;
          cursor: pointer;
          transition: all 0.15s;
        }

        .ingredient-btn:hover {
          border-color: #D35F2D;
          background: #FFF5EE;
        }

        .ingredient-btn .ing-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: #2D2A26;
        }

        .ingredient-btn .ing-gpdl {
          font-size: 0.75rem;
          color: #D35F2D;
        }

        /* Egg Converter */
        .egg-converter {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .egg-info-box {
          background: #FFF5EE;
          border: 1px solid #FACBB0;
          padding: 1rem;
        }

        .egg-info-box p {
          margin: 0;
          font-size: 0.9rem;
          color: #5C4A3D;
        }

        .egg-sizes-reference {
          background: white;
          padding: 1rem;
          border: 1px solid #E8E0D8;
        }

        .egg-sizes-reference h4 {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .egg-size-cards {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
        }

        .egg-size-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem 0.5rem;
          background: #FFF5EE;
        }

        .egg-size-label {
          font-weight: 700;
          font-size: 1.25rem;
          color: #2D2A26;
        }

        .egg-size-weight {
          font-size: 0.8rem;
          color: #D35F2D;
        }

        .egg-converter-box {
          background: white;
          padding: 1.5rem;
          border: 1px solid #E8E0D8;
        }

        .egg-input-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .egg-input-row label {
          font-weight: 500;
          color: #2D2A26;
          min-width: 100px;
        }

        .egg-input-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .egg-count-input {
          width: 60px;
          padding: 0.6rem;
          border: 2px solid #E8E0D8;
          font-size: 1.1rem;
          text-align: center;
          font-family: inherit;
        }

        .egg-count-input:focus {
          outline: none;
          border-color: #D35F2D;
        }

        .egg-size-select {
          padding: 0.6rem 0.75rem;
          border: 2px solid #E8E0D8;
          font-size: 1rem;
          background: white;
          font-family: inherit;
          cursor: pointer;
        }

        .egg-size-select:focus {
          outline: none;
          border-color: #D35F2D;
        }

        .egg-result {
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .egg-result-main {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .result-label {
          color: #5C4A3D;
        }

        .egg-result-detail {
          font-size: 0.875rem;
          color: #5C4A3D;
        }

        .egg-tip {
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #FFF5EE;
          font-size: 0.85rem;
          color: #5C4A3D;
        }

        .egg-tips {
          background: white;
          padding: 1rem;
          border: 1px solid #E8E0D8;
        }

        .egg-tips h4 {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .egg-tips ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .egg-tips li {
          font-size: 0.9rem;
          color: #5C4A3D;
          margin-bottom: 0.4rem;
        }

        /* Recipe styles */
        .recipe-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          background: #FFF5EE;
          padding: 0.4rem 0.75rem;
          font-size: 0.875rem;
          color: #D35F2D;
        }

        .recipe-description {
          color: #5C4A3D;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .recipe-section {
          margin-bottom: 1.5rem;
        }

        .recipe-section h3 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .ingredient-list, .steps-list {
          padding-left: 1.25rem;
        }

        .ingredient-list li, .steps-list li {
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        /* Calories View */
        .calories-view h1 {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #2D2A26;
          margin-bottom: 0.5rem;
        }

        .api-credit {
          font-size: 0.8rem;
          color: #5C4A3D;
          margin-bottom: 1rem;
        }

        .category-filter-wrapper {
          margin-bottom: 1rem;
        }

        .category-filter-toggle {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 0.75rem 1rem;
          background: #FFF5EE;
          border: 1px solid #F5A576;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #5C4A3D;
        }

        .category-filter-toggle:hover {
          background: #FEF0E5;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #F5EFE8;
          border-radius: 0 0 8px 8px;
          margin-top: -1px;
          border: 1px solid #F5A576;
          border-top: none;
        }

        .category-chip {
          padding: 0.4rem 0.75rem;
          background: white;
          border: 1px solid #E8E0D8;
          border-radius: 16px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .category-chip:hover {
          border-color: #E87D48;
        }

        .category-chip.active {
          background: #D35F2D;
          border-color: #D35F2D;
          color: white;
        }

        .category-chip.clear {
          background: transparent;
          border-style: dashed;
          color: #999;
        }

        .category-chip.clear:hover {
          border-color: #D35F2D;
          color: #D35F2D;
        }

        .food-results h3 {
          font-size: 0.9rem;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .food-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          margin-bottom: 0.5rem;
          cursor: pointer;
          border: 1px solid #E8E0D8;
        }

        .food-result-item:hover {
          background: #FFF5EE;
        }

        .food-info {
          flex: 1;
        }

        .food-name {
          display: block;
          font-weight: 500;
          color: #2D2A26;
        }

        .food-brand {
          font-size: 0.8rem;
          color: #5C4A3D;
        }

        .food-kcal {
          color: #D35F2D;
          font-weight: 600;
        }

        .food-detail h2 {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #2D2A26;
        }

        .food-category {
          color: #5C4A3D;
          margin-bottom: 1rem;
        }

        .portion-selector {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .portion-selector input {
          width: 80px;
          padding: 0.5rem;
          border: 2px solid #E8E0D8;
          text-align: center;
          font-size: 1rem;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .nutrition-card {
          background: white;
          padding: 1rem;
          text-align: center;
          border: 1px solid #E8E0D8;
        }

        .nutrition-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #D35F2D;
        }

        .nutrition-label {
          font-size: 0.8rem;
          color: #5C4A3D;
        }

        .add-to-meal-btn {
          width: 100%;
          padding: 1rem;
          background: #D35F2D;
          color: white;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .meal-summary {
          background: white;
          padding: 1rem;
          margin-top: 1.5rem;
          border: 1px solid #E8E0D8;
        }

        .meal-summary h3 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .meal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #F5EFE8;
        }

        .meal-item button {
          background: none;
          border: none;
          color: #D35F2D;
          cursor: pointer;
          font-size: 1.25rem;
        }

        .meal-totals {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem 1rem;
          padding-top: 0.75rem;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }

        .clear-meal-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: #FFF5EE;
          border: none;
          color: #D35F2D;
          cursor: pointer;
        }

        /* Create View */
        .create-view h1 {
          font-size: 1.25rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #2D2A26;
          margin-bottom: 1rem;
        }

        .create-form {
          background: white;
          padding: 1.5rem;
          border: 1px solid #E8E0D8;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-row .flex-2 { flex: 2; }
        .form-row .flex-1 { flex: 1; }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #5C4A3D;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .form-group input, .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #E8E0D8;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input:focus, .form-group select:focus {
          outline: none;
          border-color: #D35F2D;
        }

        .ingredient-search-row {
          position: relative;
        }

        .ingredient-search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #D35F2D;
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 250px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .ingredient-result-item {
          padding: 0.75rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #E8E0D8;
        }

        .ingredient-result-item:hover {
          background: #FFF5EE;
        }

        .ingredient-name { font-weight: 500; }
        .ingredient-kcal { font-size: 0.85rem; color: #5C4A3D; }

        .ingredient-amount-row {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .amount-input {
          width: 80px !important;
          flex: none !important;
        }

        .unit-select {
          width: 80px !important;
          flex: none !important;
        }

        .add-ingredient-btn {
          flex: 1;
          background: #D35F2D;
          color: white;
          border: none;
          padding: 0.75rem;
          cursor: pointer;
          font-weight: 600;
        }

        .recipe-ingredients-list {
          background: #F5EFE8;
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }

        .recipe-ingredient-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #E8E0D8;
        }

        .recipe-ingredient-item:last-child {
          border-bottom: none;
        }

        .ing-amount {
          min-width: 80px;
          font-weight: 600;
          color: #D35F2D;
        }

        .ing-name {
          flex: 1;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #D35F2D;
          font-size: 1.25rem;
          cursor: pointer;
          padding: 0 0.5rem;
        }

        .step-input-row {
          display: flex;
          gap: 0.5rem;
        }

        .step-input-row input {
          flex: 1;
        }

        .add-step-btn {
          width: 44px;
          background: #D35F2D;
          color: white;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .steps-list {
          margin-top: 0.75rem;
          padding-left: 1.25rem;
        }

        .steps-list li {
          padding: 0.5rem 0;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .steps-list li span {
          flex: 1;
        }

        .recipe-nutrition-summary {
          background: #FFF5EE;
          padding: 1rem;
          margin: 1rem 0;
          border-left: 4px solid #D35F2D;
        }

        .nutrition-mini-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-top: 0.5rem;
          text-align: center;
          font-size: 0.9rem;
        }

        .nutrition-mini-grid strong {
          color: #D35F2D;
        }

        .form-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .save-recipe-btn {
          flex: 1;
          padding: 1rem;
          background: #5C4A3D;
          color: white;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .cancel-edit-btn {
          padding: 1rem;
          background: #E8E0D8;
          color: #5C4A3D;
          border: none;
          cursor: pointer;
        }

        .saved-recipes {
          margin-top: 2rem;
        }

        .saved-recipes h2 {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 1rem;
        }

        .saved-recipe-card {
          background: white;
          margin-bottom: 0.75rem;
          border: 1px solid #E8E0D8;
        }

        .recipe-header {
          padding: 1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .recipe-header:hover {
          background: #FFF5EE;
        }

        .saved-recipe-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2D2A26;
          margin-bottom: 0.25rem;
        }

        .saved-recipe-card p {
          font-size: 0.85rem;
          color: #5C4A3D;
        }

        .expand-arrow {
          color: #D35F2D;
        }

        .recipe-details {
          padding: 0 1rem 1rem;
          border-top: 1px solid #E8E0D8;
        }

        .recipe-ingredients ul, .recipe-steps ol {
          margin: 0.5rem 0 1rem 1.25rem;
        }

        .recipe-ingredients li, .recipe-steps li {
          padding: 0.25rem 0;
          font-size: 0.9rem;
        }

        .recipe-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .recipe-actions button {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #E8E0D8;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .recipe-actions button:hover {
          background: #FFF5EE;
        }

        /* Portionsskalning */
        .portion-scaler {
          background: #F5EFE8;
          padding: 0.75rem 1rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          border-radius: 4px;
        }

        .portion-scaler label {
          font-weight: 600;
          font-size: 0.85rem;
        }

        .scaler-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .scaler-controls button {
          width: 32px;
          height: 32px;
          border: 1px solid #D35F2D;
          background: white;
          color: #D35F2D;
          font-size: 1.25rem;
          cursor: pointer;
          border-radius: 4px;
        }

        .scaler-controls button:hover {
          background: #FFF5EE;
        }

        .portion-count {
          font-size: 1.25rem;
          font-weight: 700;
          min-width: 2rem;
          text-align: center;
          color: #D35F2D;
        }

        .reset-btn {
          width: auto !important;
          padding: 0 0.75rem !important;
          font-size: 0.8rem !important;
          margin-left: 0.5rem;
        }

        .scaled-amount {
          font-weight: 600;
          color: #D35F2D;
        }

        .gram-equiv {
          font-size: 0.8rem;
          color: #8B7355;
          margin-left: 0.25rem;
        }

        .recipe-nutrition-scaled {
          background: #FFF5EE;
          padding: 0.75rem 1rem;
          margin: 1rem 0;
          border-left: 3px solid #D35F2D;
        }

        .recipe-nutrition-scaled strong:first-child {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }

        .ingredient-amount-section {
          margin-top: 0.5rem;
        }

        .measure-hint {
          font-size: 0.85rem;
          color: #5C4A3D;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #F5EFE8;
          border-radius: 4px;
        }

        .search-results-count {
          font-size: 0.875rem;
          color: #5C4A3D;
          margin-bottom: 1rem;
        }

        /* === VILA-TID BOX === */
        .rest-time-box {
          background: linear-gradient(135deg, #FFF5EE, #FFEEE5);
          border-left: 4px solid #E87D48;
        }

        .rest-time-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D35F2D;
          margin: 0.5rem 0;
        }

        .rest-time-note {
          font-size: 0.85rem;
          color: #5C4A3D;
          margin-top: 0.5rem;
        }

        /* === SALTNING BOX === */
        .saltning-box {
          background: linear-gradient(135deg, #FFF5EE, #FFEEE5);
          border-left: 4px solid #E87D48;
        }

        .saltning-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D35F2D;
          margin: 0.5rem 0;
        }

        .saltning-note {
          font-size: 0.85rem;
          color: #5C4A3D;
          margin-top: 0.5rem;
        }

        /* === CATEGORY SCIENCE === */
        .category-science {
          margin: 0.5rem 0 1rem;
          background: #F5EFE8;
          border-radius: 6px;
          overflow: hidden;
        }

        .science-summary {
          padding: 0.75rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 500;
          color: #5C4A3D;
          list-style: none;
        }

        .science-summary::-webkit-details-marker {
          display: none;
        }

        .science-summary::after {
          content: '+';
          margin-left: auto;
          font-size: 1.2rem;
          color: #D35F2D;
        }

        details[open] .science-summary::after {
          content: '−';
        }

        .science-icon {
          font-size: 1.1rem;
        }

        .science-content {
          padding: 0 1rem 1rem;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #2D2A26;
        }

        .science-content p {
          margin-bottom: 0.75rem;
        }

        .science-tip {
          background: white;
          padding: 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        /* === ÄGGGUIDE === */
        .egg-guide-view {
          padding-bottom: 2rem;
        }

        .egg-guide-view .subtitle {
          font-size: 0.85rem;
          color: #8B7355;
          margin-bottom: 1.5rem;
        }

        .egg-guide-tabs {
          display: flex;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .egg-guide-tabs button {
          flex: 1;
          min-width: 60px;
          padding: 0.75rem 0.5rem;
          background: #E8E0D8;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 500;
          color: #5C4A3D;
          transition: all 0.2s;
        }

        .egg-guide-tabs button:first-child {
          border-radius: 6px 0 0 6px;
        }

        .egg-guide-tabs button:last-child {
          border-radius: 0 6px 6px 0;
        }

        .egg-guide-tabs button.active {
          background: #D35F2D;
          color: white;
        }

        .egg-section h2 {
          font-size: 1.25rem;
          color: #2D2A26;
          margin-bottom: 0.5rem;
        }

        .section-description {
          color: #5C4A3D;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .egg-time-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .egg-time-card {
          background: white;
          border: 1px solid #E8E0D8;
          border-left: 4px solid #E87D48;
          padding: 1rem;
          border-radius: 0 6px 6px 0;
        }

        .egg-time-card.warning {
          border-left-color: #DC3545;
          background: #FFF5F5;
        }

        .egg-time-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .egg-time-name {
          font-weight: 600;
          color: #2D2A26;
        }

        .egg-time-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #D35F2D;
        }

        .egg-time-card.warning .egg-time-value {
          color: #DC3545;
        }

        .egg-time-desc {
          font-size: 0.9rem;
          color: #5C4A3D;
          margin-bottom: 0.25rem;
        }

        .egg-time-temp {
          font-size: 0.8rem;
          color: #8B7355;
        }

        .egg-tips-section {
          background: #F5EFE8;
          padding: 1rem;
          border-radius: 6px;
        }

        .egg-tips-section h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .egg-tips-section ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .egg-tips-section li {
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        .steps-list-guide {
          margin-bottom: 1.5rem;
        }

        .steps-list-guide h3 {
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .steps-list-guide ol {
          margin: 0;
          padding-left: 1.5rem;
        }

        .steps-list-guide li {
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
          line-height: 1.5;
          padding-left: 0.5rem;
        }

        .scrambled-styles {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .scrambled-style-card {
          background: white;
          border: 1px solid #E8E0D8;
          padding: 1rem;
          border-radius: 6px;
        }

        .scrambled-style-card h3 {
          font-size: 1rem;
          color: #2D2A26;
          margin-bottom: 0.5rem;
        }

        .style-method {
          color: #D35F2D;
          font-weight: 500;
          margin-bottom: 0.75rem;
          font-size: 0.95rem;
        }

        .scrambled-style-card ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .scrambled-style-card li {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .science-facts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .science-fact-card {
          background: white;
          border: 1px solid #E8E0D8;
          padding: 0.75rem;
          text-align: center;
          border-radius: 6px;
        }

        .fact-label {
          display: block;
          font-size: 0.8rem;
          color: #5C4A3D;
          margin-bottom: 0.25rem;
        }

        .fact-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: #D35F2D;
        }

        .science-explanation {
          background: #F5EFE8;
          padding: 1rem;
          border-radius: 6px;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Technique Card (Blanchering etc.) */
        .technique-card {
          background: #FFF5EE;
          padding: 1rem 1.25rem;
          margin-bottom: 1.5rem;
          border-left: 4px solid #E87D48;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .technique-card:hover {
          background: #FFEEE5;
        }

        .technique-icon {
          font-size: 2rem;
        }

        .technique-content {
          flex: 1;
        }

        .technique-content h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2D2A26;
          margin: 0 0 0.25rem 0;
        }

        .technique-content p {
          font-size: 0.85rem;
          color: #5C4A3D;
          margin: 0;
        }

        /* Blancheringsguide */
        .blanchering-view .subtitle {
          font-size: 0.9rem;
          color: #5C4A3D;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .blanchering-keys {
          margin-bottom: 1.5rem;
        }

        .blanchering-keys h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .blanchering-key-card {
          background: #FFF5EE;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border-left: 3px solid #E87D48;
        }

        .blanchering-key-card h4 {
          font-size: 0.95rem;
          color: #2D2A26;
          margin: 0 0 0.5rem 0;
        }

        .blanchering-key-card p {
          font-size: 0.9rem;
          color: #5C4A3D;
          margin: 0;
          line-height: 1.4;
        }

        .blanchering-times {
          margin-bottom: 1.5rem;
        }

        .blanchering-times h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5C4A3D;
          margin-bottom: 0.5rem;
        }

        .times-note {
          font-size: 0.85rem;
          color: #8B7355;
          margin-bottom: 0.75rem;
        }

        .blanchering-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #E8E0D8;
        }

        .blanchering-item:last-child {
          border-bottom: none;
        }

        .blanchering-item-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .blanchering-item .item-name {
          font-weight: 500;
          color: #2D2A26;
        }

        .blanchering-time {
          font-weight: 600;
          color: #E87D48;
          background: #FFF5EE;
          padding: 0.25rem 0.5rem;
          font-size: 0.9rem;
        }

        .blanchering-tips {
          font-size: 0.8rem;
          color: #5C4A3D;
          margin: 0.25rem 0 0 0;
          font-style: italic;
        }

        /* Technique Guides Container */
        .technique-guides {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        /* Brässeringsguide */
        .brassering-card {
          background: #FFF5EE;
          border-left-color: #D35F2D;
        }

        .brassering-card:hover {
          background: #FACBB0;
        }

        .brassering-card .technique-content p {
          color: #8B5A2B;
        }

        .brassering-view .subtitle {
          font-size: 0.9rem;
          color: #5C4A3D;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .quote-box {
          background: #FFF5EE;
          border-left: 3px solid #D35F2D;
        }

        .quote-box .quote {
          font-style: italic;
          color: #5C4A3D;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .quote-box .quote-author {
          font-size: 0.85rem;
          color: #8B7355;
          text-align: right;
          margin: 0;
        }

        .brassering-steps {
          margin-bottom: 1.5rem;
        }

        .brassering-steps h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .brassering-step-card {
          background: white;
          padding: 1rem;
          margin-bottom: 0.5rem;
          border: 1px solid #E8E0D8;
          border-left: 3px solid #D35F2D;
        }

        .brassering-step-card h4 {
          font-size: 0.95rem;
          color: #D35F2D;
          margin: 0 0 0.5rem 0;
        }

        .brassering-step-card p {
          font-size: 0.9rem;
          color: #2D2A26;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
        }

        .brassering-step-card .step-tip {
          font-size: 0.85rem;
          color: #5C4A3D;
          margin: 0;
        }

        .brassering-cuts {
          margin-bottom: 1.5rem;
        }

        .brassering-cuts h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        .brassering-cut-item {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #F5EFE8;
        }

        .brassering-cut-item:last-child {
          border-bottom: none;
        }

        .cut-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cut-details {
          display: flex;
          gap: 0.75rem;
        }

        .cut-time {
          font-weight: 600;
          color: #D35F2D;
          background: #FFF5EE;
          padding: 0.2rem 0.5rem;
          font-size: 0.85rem;
        }

        .cut-temp {
          font-weight: 500;
          color: #5C4A3D;
          font-size: 0.85rem;
        }

        .cut-tips {
          font-size: 0.8rem;
          color: #8B7355;
          margin: 0.25rem 0 0 0;
          font-style: italic;
        }

        /* Guide Link Button (in detail views) */
        .guide-link-btn {
          display: block;
          width: 100%;
          padding: 1rem;
          margin-top: 1rem;
          background: #FFF5EE;
          border: none;
          border-left: 3px solid #E87D48;
          color: #D35F2D;
          font-size: 0.95rem;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s;
        }

        .guide-link-btn:hover {
          background: #FFEEE5;
        }

        .guide-link-btn.brassering-link {
          background: #FFF5EE;
          border-left-color: #D35F2D;
          color: #8B5A2B;
        }

        .guide-link-btn.brassering-link:hover {
          background: #FACBB0;
        }

        /* Vegetable Detail View */
        .blanchering-time-display {
          display: flex;
          justify-content: center;
          margin: 1rem 0 1.5rem 0;
        }

        .time-card {
          background: #FFF5EE;
          padding: 1.5rem 2rem;
          text-align: center;
          border-left: 4px solid #E87D48;
        }

        .time-label {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5C4A3D;
          margin-bottom: 0.5rem;
        }

        .time-value {
          display: block;
          font-size: 1.75rem;
          font-weight: 600;
          color: #D35F2D;
        }

        .blanchering-method {
          background: #FEFBF7;
          border: 1px solid #FFEEE5;
        }

        .blanchering-method ol {
          margin: 0;
          padding-left: 1.25rem;
        }

        .blanchering-method li {
          font-size: 0.9rem;
          color: #2D2A26;
          margin-bottom: 0.5rem;
          line-height: 1.4;
        }

        /* Category Guide Card */
        .category-guide {
          margin-top: 1rem;
          border-radius: 4px;
        }

        /* Philosophy Cards */
        .philosophy-card {
          background: #F5F0E8;
          padding: 1rem;
          cursor: pointer;
          border-left: 3px solid #8B7355;
          transition: all 0.2s;
        }

        .philosophy-card:hover {
          background: #EDE5D8;
        }

        .philosophy-header {
          margin-bottom: 0.5rem;
        }

        .philosophy-name {
          font-weight: 600;
          color: #5C4A3D;
          font-size: 0.95rem;
        }

        .philosophy-desc {
          font-size: 0.85rem;
          color: #8B7355;
          font-style: italic;
          margin: 0;
          line-height: 1.4;
        }

        .philosophy-detail .quote-box {
          margin-bottom: 1.5rem;
        }

        .philosophy-principles {
          background: white;
          padding: 1rem;
          border: 1px solid #E8E0D8;
        }

        .philosophy-principles h3 {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #5C4A3D;
          margin: 0 0 0.75rem 0;
        }

        .philosophy-principles ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .philosophy-principles li {
          font-size: 0.9rem;
          color: #2D2A26;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        /* Recipe Scaler Styles */
        .recipe-scaler {
          background: #FFF5EE;
          padding: 1rem;
          margin-bottom: 1.5rem;
          border: 1px solid #FACBB0;
        }

        .scaler-label {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .scaler-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .scaler-btn {
          width: 40px;
          height: 40px;
          border: 2px solid #D35F2D;
          background: white;
          color: #D35F2D;
          font-size: 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scaler-btn:hover {
          background: #D35F2D;
          color: white;
        }

        .scaler-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .scaler-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #D35F2D;
          min-width: 80px;
          text-align: center;
        }

        .scaler-presets {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .preset-btn {
          padding: 0.4rem 0.75rem;
          border: 1px solid #E8E0D8;
          background: white;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }

        .preset-btn:hover {
          border-color: #D35F2D;
        }

        .preset-btn.active {
          background: #D35F2D;
          border-color: #D35F2D;
          color: white;
        }

        /* Structured Ingredient List */
        .structured-ingredient-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .structured-ingredient {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          padding: 0.6rem 0;
          border-bottom: 1px solid #F5EFE8;
          cursor: pointer;
          transition: background 0.15s;
          -webkit-tap-highlight-color: transparent;
          color: #2D2A26;
        }

        .structured-ingredient * {
          -webkit-tap-highlight-color: transparent;
        }

        .structured-ingredient:last-child {
          border-bottom: none;
        }

        .structured-ingredient:hover {
          background: #FFF5EE;
          margin: 0 -0.5rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
        }

        .ingredient-main {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          flex: 1;
          min-width: 200px;
        }

        .ingredient-amount {
          font-weight: 600;
          color: #D35F2D;
          min-width: 70px;
        }

        .structured-ingredient .ingredient-name {
          font-weight: 500;
          color: #2D2A26;
        }

        .ingredient-note {
          font-size: 0.85rem;
          color: #8B7355;
          font-style: italic;
        }

        .ingredient-extras {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.25rem;
          width: 100%;
        }

        .ingredient-conversion {
          font-size: 0.8rem;
          color: #5C4A3D;
          background: #F5EFE8;
          padding: 0.2rem 0.5rem;
        }

        .optional-tag {
          font-size: 0.75rem;
          color: #8B7355;
          background: #F5EFE8;
          padding: 0.15rem 0.4rem;
        }

        /* Ingredient Nutrition Popup */
        .ingredient-nutrition-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 1.5rem;
          border: 2px solid #D35F2D;
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          z-index: 1000;
          max-width: 320px;
          width: 90%;
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          z-index: 999;
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .popup-header h4 {
          font-size: 1rem;
          color: #2D2A26;
          margin: 0;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .popup-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #8B7355;
          padding: 0;
          line-height: 1;
        }

        .popup-amount {
          font-size: 0.9rem;
          color: #D35F2D;
          margin-bottom: 1rem;
        }

        .popup-nutrition {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .popup-nutrition-item {
          background: #FFF5EE;
          padding: 0.6rem;
          text-align: center;
        }

        .popup-nutrition-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #D35F2D;
        }

        .popup-nutrition-label {
          display: block;
          font-size: 0.7rem;
          color: #5C4A3D;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .popup-no-data {
          color: #8B7355;
          font-size: 0.9rem;
          text-align: center;
          padding: 1rem 0;
        }

        /* Recipe Nutrition Toggle & Display */
        .nutrition-toggle {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: #FEFBF7;
          border: 1px solid #F5A576;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
          color: #5C4A3D;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .nutrition-toggle:hover {
          background: #FFF5EE;
        }

        .recipe-nutrition {
          background: #FEFBF7;
          border: 1px solid #F5A576;
          border-top: none;
          padding: 1rem;
        }

        .nutrition-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #E8E0D8;
        }

        .nutrition-row:last-child {
          border-bottom: none;
        }

        .nutrition-row .label {
          color: #5C4A3D;
        }

        .nutrition-row .value {
          font-weight: 600;
          color: #5C4A3D;
        }

        .per-portion {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 2px solid #F5A576;
        }

        .per-portion h4 {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #5C4A3D;
          margin-bottom: 0.75rem;
        }

        /* Recipe Category Section in Basics */
        .recipe-category-section {
          margin-bottom: 2rem;
        }

        .recipe-category-header {
          background: #FFF5EE;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #2D2A26;
          font-weight: 600;
          border-left: 4px solid #E87D48;
          margin-bottom: 0.5rem;
        }

        .recipe-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .recipe-item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 1px solid #E8E0D8;
          cursor: pointer;
          transition: all 0.15s;
        }

        .recipe-item-card:hover {
          border-color: #D35F2D;
          background: #FEFBF7;
        }

        .recipe-item-info h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #2D2A26;
          margin: 0 0 0.25rem 0;
        }

        .recipe-item-info p {
          font-size: 0.85rem;
          color: #5C4A3D;
          margin: 0;
        }

        .recipe-item-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .recipe-time-tag {
          background: #FFF5EE;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          color: #D35F2D;
        }

        /* ========================================
           SOUS VIDE STYLES
           ======================================== */
        .temp-mode-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          background: #F5F5F5;
          padding: 0.25rem;
          border-radius: 8px;
        }

        .mode-tab {
          flex: 1;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          border-radius: 6px;
          transition: all 0.2s;
          color: #666;
        }

        .mode-tab.active {
          background: white;
          color: #2D2A26;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .mode-tab:hover:not(.active) {
          background: rgba(255,255,255,0.5);
        }

        .sousvide-badge {
          background: #E87D48;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .doneness-selector {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .doneness-btn {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #E0E0E0;
          background: white;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .doneness-btn:hover {
          border-color: #999;
        }

        .doneness-btn.active {
          color: white;
          border-color: transparent;
        }

        .doneness-btn.active.rare {
          background: #FFF5EE;
          color: #2D2A26;
          border-color: #E87D48;
        }

        .doneness-btn.active.medium {
          background: #F5A576;
          color: white;
          border-color: #F5A576;
        }

        .doneness-btn.active.welldone {
          background: #5C4A3D;
          color: white;
          border-color: #5C4A3D;
        }

        .thickness-selector {
          background: #FFF5EE;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .thickness-label {
          display: block;
          font-size: 0.9rem;
          color: #5C4A3D;
          margin-bottom: 0.5rem;
        }

        .thickness-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #E8E0D8;
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .thickness-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #E87D48;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .thickness-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #E87D48;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .thickness-marks {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #8B7355;
          margin-top: 0.25rem;
        }

        .thickness-note {
          font-size: 0.8rem;
          color: #5C4A3D;
          text-align: center;
          margin: 0.5rem 0 1rem;
          font-style: italic;
        }

        .sousvide-quick-info {
          background: #FFF5EE;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #D35F2D;
          font-weight: 600;
        }

        .sousvide-safety {
          background: #FFF8E7;
          border: 1px solid #FFE0B2;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .safety-summary {
          padding: 0.75rem 1rem;
          cursor: pointer;
          font-weight: 500;
          color: #E65100;
        }

        .safety-content {
          padding: 0 1rem 1rem;
        }

        .safety-zones {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .safety-zone {
          display: grid;
          grid-template-columns: 80px 120px 1fr;
          gap: 0.5rem;
          padding: 0.5rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .zone-0 { background: #FFEBEE; }
        .zone-1 { background: #FFF3E0; }
        .zone-2 { background: #E8F5E9; }

        .zone-range { font-weight: 600; }
        .zone-name { font-weight: 500; }
        .zone-desc { color: #666; }

        .safety-rules ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .safety-rules li {
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }

        /* ========================================
           HEALTH GOALS STYLES
           ======================================== */
        .health-goals-section {
          margin-bottom: 1rem;
        }

        .health-goals-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #FFF5EE;
          border: 1px solid #F5A576;
          border-radius: 8px;
          cursor: pointer;
          margin-bottom: 0.5rem;
        }

        .health-goals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .health-goal-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid #E0E0E0;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s;
        }

        .health-goal-chip:hover {
          border-color: #E87D48;
        }

        .health-goal-chip.selected {
          background: #E87D48;
          color: white;
          border-color: #E87D48;
        }

        .health-goal-icon {
          font-size: 1.1rem;
        }

        .health-goal-detail {
          background: #FFF5EE;
          border: 1px solid #F5A576;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .health-goal-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .health-goal-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }

        .health-goal-description {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
        }

        .health-good-ingredients, .health-avoid-ingredients {
          margin-bottom: 0.75rem;
        }

        .health-good-ingredients h4 {
          color: #D35F2D;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        .health-avoid-ingredients h4 {
          color: #5C4A3D;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
        }

        .ingredient-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .ingredient-tag {
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .ingredient-tag.good {
          background: #FFF5EE;
          color: #D35F2D;
        }

        .ingredient-tag.avoid {
          background: #F5F0EB;
          color: #5C4A3D;
        }

        .health-science {
          background: white;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #555;
          border-left: 3px solid #E87D48;
        }

        .food-health-match {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #FFF5EE;
          border-radius: 6px;
          font-size: 0.85rem;
          color: #D35F2D;
        }

        /* ========================================
           PERCENTAGE SCALING STYLES
           ======================================== */
        .scaling-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #F5F5F5;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .scaling-toggle label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .scaling-toggle input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .main-ingredient-badge {
          background: #E87D48;
          color: white;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }

        .percent-display {
          color: #666;
          font-size: 0.8rem;
          margin-left: auto;
          padding-right: 0.5rem;
        }

        .set-main-btn {
          padding: 0.25rem 0.5rem;
          background: #E87D48;
          border: none;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .set-main-btn:hover {
          opacity: 1;
        }

        /* Food Health Goals Match */
        .food-health-goals {
          margin: 1rem 0;
          padding: 1rem;
          background: #F9F9F9;
          border-radius: 8px;
        }

        .health-match-section {
          margin-bottom: 0.75rem;
        }

        .health-match-section:last-child {
          margin-bottom: 0;
        }

        .health-match-section h4 {
          font-size: 0.85rem;
          margin: 0 0 0.5rem 0;
        }

        .health-match-section.good h4 {
          color: #D35F2D;
        }

        .health-match-section.avoid h4 {
          color: #5C4A3D;
        }

        .health-match-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .health-match-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.35rem 0.65rem;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .health-match-tag.good {
          background: #FFF5EE;
          color: #D35F2D;
        }

        .health-match-tag.avoid {
          background: #F5F0EB;
          color: #5C4A3D;
        }

        /* Ingredients header with scaling toggle */
        .ingredients-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .scaling-hint {
          font-size: 0.8rem;
          color: #666;
          background: #FFF8E1;
          padding: 0.5rem;
          border-radius: 6px;
          margin-bottom: 0.5rem;
        }

        .recipe-ingredient-item.is-main {
          background: #FFFDE7;
          border-left: 3px solid #E87D48;
        }
      `}</style>
    </div>
  );
}
