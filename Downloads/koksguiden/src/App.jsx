import React, { useState, useCallback, useEffect } from 'react';

// Komplett data för innertemperaturer baserat på research
const temperatureData = {
  'Nötkött': [
    { name: 'Biff', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Låt köttet vila efter stekning. Temperaturen stiger 2-4°C.' },
    { name: 'Entrecôte', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Salta och peppra runt om. Ugnstemperatur 125-175°C. Låt vila 30 min.' },
    { name: 'Flankstek', image: '🥩', rare: 56, medium: 58, wellDone: 60, tips: 'Skär tunt snett mot fibrerna efter tillagning.' },
    { name: 'Fransyska', image: '🥩', rare: null, medium: 60, wellDone: 70, tips: 'Passar för långkok eller stekning. Kan göras som tjälknöl.' },
    { name: 'Hamburgare', image: '🍔', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt av säkerhetsskäl.' },
    { name: 'Högrev', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Utmärkt för långkok och brässering. Kräver tid för mörhet.' },
    { name: 'Köttfärslimpa', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Använd stektermometer för säker tillagning.' },
    { name: 'Märgpipa', image: '🦴', rare: null, medium: null, wellDone: 80, tips: 'Rostas i ugn tills märgen är mjuk.' },
    { name: 'Nötbog', image: '🥩', rare: null, medium: 70, wellDone: 80, tips: 'Långkok eller brässering rekommenderas.' },
    { name: 'Nötbringa', image: '🥩', rare: null, medium: 85, wellDone: 90, tips: 'Kräver lång tillagning vid låg temperatur.' },
    { name: 'Nötfärs', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt. 70°C rekommenderas.' },
    { name: 'Nötytterfilé', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mör och mager detalj, stek snabbt.' },
    { name: 'Oxfilé', image: '🥩', rare: 53, medium: 58, wellDone: 70, tips: 'Premium styckdel. Stek kort tid på hög värme.' },
    { name: 'Rostas', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Fin smak, passar för stekning eller grillning.' },
    { name: 'Rostbiff', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Ugnstemperatur 125°C för perfekt resultat.' },
    { name: 'Rumpstek', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mör detalj från bakdelen.' },
    { name: 'Ryggbiff', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Klassisk grilldetalj. Stek på hög värme.' },
    { name: 'Ungnötslever', image: '🫀', rare: null, medium: null, wellDone: 70, tips: 'Stek snabbt, blir lätt torr.' },
    { name: 'Ytterlår', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Passar för stekning eller långkok.' },
  ],
  'Kalv': [
    { name: 'Kalventrecôte', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mild smak, passar med delikata såser.' },
    { name: 'Kalvfilé', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mycket mör, stek varsamt.' },
    { name: 'Kalvfransyska', image: '🥩', rare: null, medium: 60, wellDone: 70, tips: 'Passar för brässering.' },
    { name: 'Kalvfärs', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt.' },
    { name: 'Kalvkotlett', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Stek på medelvärme för saftig kotlett.' },
    { name: 'Kalvlever', image: '🫀', rare: null, medium: 58, wellDone: 65, tips: 'Ska vara rosa inuti. Blir seg om den översteks.' },
    { name: 'Kalvnjure', image: '🫘', rare: null, medium: null, wellDone: 70, tips: 'Blötlägg före tillagning för mildare smak.' },
    { name: 'Kalvstek', image: '🥩', rare: 58, medium: 62, wellDone: 70, tips: 'Ugnstemperatur 125°C. Vila minst 15 min.' },
  ],
  'Lamm': [
    { name: 'Lammfilé', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mör detalj med fin smak. Stek snabbt.' },
    { name: 'Lammfärs', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt.' },
    { name: 'Lammkotlett', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Grilla eller stek på hög värme.' },
    { name: 'Lammlever', image: '🫀', rare: null, medium: 58, wellDone: 65, tips: 'Mildare än nötlever. Stek kort tid.' },
    { name: 'Lammsadel', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Elegant styckdel för festmåltider.' },
    { name: 'Lammstek', image: '🥩', rare: 55, medium: 62, wellDone: 70, tips: 'Vila minst 15 min före skärning.' },
    { name: 'Lammlägg', image: '🦵', rare: null, medium: null, wellDone: 85, tips: 'Brässera i 2-3 timmar för mör konsistens.' },
    { name: 'Rack of lamb', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Bryn först, avsluta i ugn.' },
  ],
  'Fläsk': [
    { name: 'Bacon', image: '🥓', rare: null, medium: null, wellDone: 70, tips: 'Stek tills önskad krispighet.' },
    { name: 'Fläskfilé', image: '🥩', rare: null, medium: 63, wellDone: 70, tips: 'Säker vid 63°C. Vila 5 min.' },
    { name: 'Fläskkotlett', image: '🥩', rare: null, medium: 63, wellDone: 70, tips: 'Stek på medelvärme för saftigt resultat.' },
    { name: 'Fläskfärs', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt.' },
    { name: 'Fläskkarré', image: '🥩', rare: null, medium: 63, wellDone: 70, tips: 'Perfekt för ugnsstekning.' },
    { name: 'Julskinka', image: '🍖', rare: null, medium: null, wellDone: 72, tips: 'Koka först, griljera sedan i ugn.' },
    { name: 'Kassler', image: '🥩', rare: null, medium: null, wellDone: 70, tips: 'Redan rökt, värms till 70°C.' },
    { name: 'Pulled pork', image: '🍖', rare: null, medium: null, wellDone: 95, tips: '95°C för perfekt rivbar konsistens. Tar 8-12 timmar.' },
    { name: 'Revbensspjäll', image: '🍖', rare: null, medium: null, wellDone: 90, tips: 'Låg och långsam tillagning för mörhet.' },
    { name: 'Sidfläsk', image: '🥓', rare: null, medium: null, wellDone: 75, tips: 'Stek tills sprött på utsidan.' },
    { name: 'Skinka', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Redan tillagad, värms försiktigt.' },
  ],
  'Fågel': [
    { name: 'Ankbröst', image: '🦆', rare: 54, medium: 58, wellDone: 65, tips: 'Starta i kall panna för krispigt skinn.' },
    { name: 'Gås', image: '🦢', rare: null, medium: null, wellDone: 74, tips: 'Stek länge på låg värme. Stöt regelbundet.' },
    { name: 'Kalkon, bröst', image: '🦃', rare: null, medium: null, wellDone: 70, tips: 'Blir lätt torrt, använd stektermometer.' },
    { name: 'Kalkon, hel', image: '🦃', rare: null, medium: null, wellDone: 74, tips: 'Vila 30 min före skärning.' },
    { name: 'Kalkon, lår', image: '🦃', rare: null, medium: null, wellDone: 80, tips: 'Tål högre temperatur än bröst.' },
    { name: 'Kyckling, bröst', image: '🍗', rare: null, medium: null, wellDone: 70, tips: 'Saftigast vid exakt 70°C.' },
    { name: 'Kyckling, hel', image: '🐔', rare: null, medium: null, wellDone: 74, tips: 'Mät i låret. Vila 10 min.' },
    { name: 'Kyckling, lår', image: '🍗', rare: null, medium: null, wellDone: 80, tips: 'Mer förlåtande än bröst.' },
    { name: 'Kycklingfärs', image: '🍖', rare: null, medium: null, wellDone: 74, tips: 'Alltid genomstekt.' },
  ],
  'Vilt': [
    { name: 'Hjort', image: '🦌', rare: 55, medium: 60, wellDone: 70, tips: 'Magert kött, stek inte för länge.' },
    { name: 'Rådjur', image: '🦌', rare: 55, medium: 60, wellDone: 70, tips: 'Mycket mört, serveras gärna rosa.' },
    { name: 'Vildsvin', image: '🐗', rare: null, medium: 68, wellDone: 75, tips: 'Ska vara genomstekt av säkerhetsskäl.' },
    { name: 'Vildsvinsfärs', image: '🍖', rare: null, medium: null, wellDone: 75, tips: 'Alltid genomstekt.' },
    { name: 'Älg', image: '🦌', rare: 55, medium: 60, wellDone: 70, tips: 'Magert, passar för stekning och grytrecept.' },
    { name: 'Älgfärs', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Blanda gärna med fläskfärs för saftighet.' },
    { name: 'Ren', image: '🦌', rare: 55, medium: 60, wellDone: 70, tips: 'Delikat smak. Serveras rosa.' },
    { name: 'Hare', image: '🐰', rare: 55, medium: 60, wellDone: 70, tips: 'Magert, behöver fetttillskott vid tillagning.' },
  ],
  'Fisk': [
    { name: 'Gravad lax', image: '🐟', rare: null, medium: null, wellDone: null, tips: 'Rå, gravas i salt och socker 24-72 timmar.' },
    { name: 'Hälleflundra', image: '🐟', rare: null, medium: 52, wellDone: 58, tips: 'Fast kött, tål lite högre temp.' },
    { name: 'Kolja', image: '🐟', rare: null, medium: 50, wellDone: 55, tips: 'Mild smak, tillagas försiktigt.' },
    { name: 'Kummel', image: '🐟', rare: null, medium: 50, wellDone: 55, tips: 'Fast, vitt kött.' },
    { name: 'Lax', image: '🐟', rare: 45, medium: 52, wellDone: 60, tips: 'Glasig vid 45°C, genomstekt vid 60°C.' },
    { name: 'Piggvar', image: '🐟', rare: null, medium: 52, wellDone: 58, tips: 'Exklusiv plattfisk med fast kött.' },
    { name: 'Regnbåge', image: '🐟', rare: 45, medium: 52, wellDone: 60, tips: 'Liknande lax i tillagning.' },
    { name: 'Röding', image: '🐟', rare: 45, medium: 52, wellDone: 58, tips: 'Fin smak, tillagas som lax.' },
    { name: 'Sej', image: '🐟', rare: null, medium: 50, wellDone: 55, tips: 'Fast kött, passar för grillning.' },
    { name: 'Torsk', image: '🐟', rare: null, medium: 50, wellDone: 55, tips: 'Klassiker. Ska flagna lätt.' },
    { name: 'Tonfisk', image: '🐟', rare: 40, medium: 50, wellDone: 60, tips: 'Serveras ofta rå eller rosa i mitten.' },
  ],
  'Skaldjur': [
    { name: 'Hummer', image: '🦞', rare: null, medium: null, wellDone: 63, tips: 'Köttet ska vara ogenomskinligt.' },
    { name: 'Krabba', image: '🦀', rare: null, medium: null, wellDone: 63, tips: 'Koka i saltat vatten.' },
    { name: 'Kräftor', image: '🦞', rare: null, medium: null, wellDone: 63, tips: 'Koka i kryddad lag.' },
    { name: 'Musslor', image: '🦪', rare: null, medium: null, wellDone: 65, tips: 'Kassera oöppnade efter kokning.' },
    { name: 'Pilgrimsmusslor', image: '🐚', rare: null, medium: 52, wellDone: 58, tips: 'Snabbstek på hög värme.' },
    { name: 'Räkor', image: '🦐', rare: null, medium: null, wellDone: 63, tips: 'Rosa och fast när de är klara.' },
    { name: 'Bläckfisk', image: '🦑', rare: null, medium: null, wellDone: 60, tips: 'Snabbstek eller långkok - inget däremellan.' },
  ],
};

// Grundrecept data
const basicRecipesData = {
  'Modersåser': [
    {
      id: 'bechamel',
      name: 'Béchamelsås',
      portions: '4 portioner',
      time: '15 min',
      ingredients: [
        '3 msk smör (45g)',
        '3 msk vetemjöl (27g)',
        '5 dl mjölk',
        '1/2 tsk salt',
        'Vitpeppar',
        'Ev. riven muskotnöt'
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
      portions: '4 portioner',
      time: '20 min',
      ingredients: [
        '3 msk smör (45g)',
        '3 msk vetemjöl (27g)',
        '5 dl ljus fond (kyckling, kalv eller fisk)',
        'Salt och vitpeppar'
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
      portions: '6 portioner',
      time: '2-3 timmar',
      ingredients: [
        '2 msk smör (30g)',
        '2 msk vetemjöl (18g)',
        '1 liter mörk kalvfond',
        '1 morot, tärnad',
        '1 lök, tärnad',
        '2 stjälkar selleri, tärnade',
        '2 msk tomatpuré',
        '1 bukett garni (timjan, lagerblad, persilja)'
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
      portions: '4 portioner',
      time: '15 min',
      ingredients: [
        '3 äggulor',
        '200g smör, klarnat',
        '1 msk citronjuice',
        '1 msk vatten',
        'Salt och vitpeppar',
        'Ev. cayennepeppar'
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
      portions: '4 portioner',
      time: '30 min',
      ingredients: [
        '2 msk olivolja',
        '1 lök, finhackad',
        '2 vitlöksklyftor, finhackade',
        '400g krossade tomater',
        '2 msk tomatpuré',
        '1 tsk socker',
        'Salt och peppar',
        'Färsk basilika'
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

// Kategorier för näringssök
const foodCategories = [
  { id: '', label: 'Alla' },
  { id: 'Mejeri', label: 'Mejeri' },
  { id: 'Kött', label: 'Kött' },
  { id: 'Kyckling, fågel', label: 'Fågel' },
  { id: 'Fisk, skaldjur', label: 'Fisk' },
  { id: 'Grönsaker, baljväxter, svamp', label: 'Grönsaker' },
  { id: 'Frukt, bär', label: 'Frukt' },
  { id: 'Bröd', label: 'Bröd' },
  { id: 'Pasta, ris, gryn', label: 'Pasta/Ris' },
  { id: 'Rätter', label: 'Rätter' },
  { id: 'Dryck', label: 'Dryck' },
  { id: 'Smaksättare', label: 'Kryddor' },
];

// Synonymer för sökning
const synonyms = {
  'köttfärs': ['nöt färs', 'gris färs', 'blandfärs', 'färs rå', 'lamm färs'],
  'nötfärs': ['nöt färs'],
  'fläskfärs': ['gris färs'],
  'grisfärs': ['gris färs'],
  'kycklingfärs': ['kyckling färs'],
  'lammfärs': ['lamm färs'],
  'färs': ['färs rå', 'nöt färs', 'gris färs', 'blandfärs', 'lamm färs'],
  'kyckling': ['kyckling', 'höna'],
  'grädde': ['grädde', 'vispgrädde', 'matgrädde'],
  'fil': ['filmjölk'],
  'mjölk': ['mjölk'],
  'smör': ['smör', 'matfett'],
  'ost': ['ost '],
  'ägg': ['ägg ', 'hönsägg'],
  'lök': ['lök '],
  'potatis': ['potatis'],
  'ris': ['ris '],
  'pasta': ['pasta', 'spagetti', 'makaroner'],
  'bröd': ['bröd'],
  'socker': ['socker', 'strösocker'],
  'mjöl': ['mjöl', 'vetemjöl'],
  'salt': ['salt '],
  'peppar': ['peppar'],
  'vitlök': ['vitlök'],
  'tomat': ['tomat'],
  'gurka': ['gurka'],
  'morot': ['morot'],
  'lax': ['lax '],
  'torsk': ['torsk'],
  'fläsk': ['fläsk', 'gris'],
  'bacon': ['bacon'],
  'skinka': ['skinka'],
  'korv': ['korv'],
};

// Livsmedelsdatabas (förkortad för läsbarhet - i verkligheten är denna mycket längre)
const foodDatabase = [
  { code: 'lvsdb-1', product_name: 'Mjölk standard fett 3%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.4, carbohydrates_100g: 4.7, fat_100g: 3.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-2', product_name: 'Mjölk mellan fett 1,5%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 3.5, carbohydrates_100g: 4.9, fat_100g: 1.5, fiber_100g: 0.0 }},
  { code: 'lvsdb-3', product_name: 'Mjölk lätt fett 0,5%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 3.5, carbohydrates_100g: 5.0, fat_100g: 0.5, fiber_100g: 0.0 }},
  { code: 'lvsdb-4', product_name: 'Filmjölk fett 3%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 3.4, carbohydrates_100g: 4.2, fat_100g: 3.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-5', product_name: 'Yoghurt naturell fett 3%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 4.4, carbohydrates_100g: 4.4, fat_100g: 3.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-6', product_name: 'Grädde vispgrädde fett 40%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 380.0, proteins_100g: 2.3, carbohydrates_100g: 2.8, fat_100g: 40.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-7', product_name: 'Gräddfil fett 12%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 3.1, carbohydrates_100g: 3.6, fat_100g: 12.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-8', product_name: 'Crème fraiche fett 34%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 338.0, proteins_100g: 2.4, carbohydrates_100g: 2.8, fat_100g: 34.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-9', product_name: 'Smör fett 80%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 720.0, proteins_100g: 0.6, carbohydrates_100g: 0.6, fat_100g: 80.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-10', product_name: 'Ost hårdost fett 28%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 368.0, proteins_100g: 26.0, carbohydrates_100g: 0.0, fat_100g: 28.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-11', product_name: 'Ägg hönsägg', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 12.5, carbohydrates_100g: 0.7, fat_100g: 11.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-12', product_name: 'Nöt färs rå fett 10%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 19.5, carbohydrates_100g: 0.0, fat_100g: 10.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-13', product_name: 'Nöt färs rå fett 15%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 209.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 15.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-14', product_name: 'Gris färs rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 17.5, carbohydrates_100g: 0.0, fat_100g: 13.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-15', product_name: 'Blandfärs rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 17.0, carbohydrates_100g: 0.0, fat_100g: 14.5, fiber_100g: 0.0 }},
  { code: 'lvsdb-16', product_name: 'Kyckling bröstfilé rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 23.0, carbohydrates_100g: 0.0, fat_100g: 1.5, fiber_100g: 0.0 }},
  { code: 'lvsdb-17', product_name: 'Kyckling hel rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 175.0, proteins_100g: 18.5, carbohydrates_100g: 0.0, fat_100g: 11.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-18', product_name: 'Lax rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 182.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 11.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-19', product_name: 'Torsk rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
  { code: 'lvsdb-20', product_name: 'Räkor kokta', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 0.8, fiber_100g: 0.0 }},
  { code: 'lvsdb-21', product_name: 'Potatis kokt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 1.8, carbohydrates_100g: 17.0, fat_100g: 0.1, fiber_100g: 1.4 }},
  { code: 'lvsdb-22', product_name: 'Morot rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 0.6, carbohydrates_100g: 6.5, fat_100g: 0.2, fiber_100g: 2.8 }},
  { code: 'lvsdb-23', product_name: 'Lök gul rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 1.0, carbohydrates_100g: 6.0, fat_100g: 0.2, fiber_100g: 1.6 }},
  { code: 'lvsdb-24', product_name: 'Tomat rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 20.0, proteins_100g: 0.8, carbohydrates_100g: 3.5, fat_100g: 0.3, fiber_100g: 1.2 }},
  { code: 'lvsdb-25', product_name: 'Gurka rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 12.0, proteins_100g: 0.6, carbohydrates_100g: 1.8, fat_100g: 0.1, fiber_100g: 0.7 }},
  { code: 'lvsdb-26', product_name: 'Sallad isbergssallad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 13.0, proteins_100g: 0.9, carbohydrates_100g: 1.8, fat_100g: 0.1, fiber_100g: 1.2 }},
  { code: 'lvsdb-27', product_name: 'Paprika röd rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 1.0, carbohydrates_100g: 5.4, fat_100g: 0.4, fiber_100g: 1.8 }},
  { code: 'lvsdb-28', product_name: 'Broccoli rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 31.0, proteins_100g: 3.3, carbohydrates_100g: 2.5, fat_100g: 0.4, fiber_100g: 3.0 }},
  { code: 'lvsdb-29', product_name: 'Vitlök rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 6.4, carbohydrates_100g: 24.0, fat_100g: 0.1, fiber_100g: 1.8 }},
  { code: 'lvsdb-30', product_name: 'Äpple rått', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 0.3, carbohydrates_100g: 11.0, fat_100g: 0.1, fiber_100g: 2.0 }},
  { code: 'lvsdb-31', product_name: 'Banan rå', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 1.1, carbohydrates_100g: 20.0, fat_100g: 0.3, fiber_100g: 1.7 }},
  { code: 'lvsdb-32', product_name: 'Apelsin rå', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.9, carbohydrates_100g: 8.5, fat_100g: 0.1, fiber_100g: 1.8 }},
  { code: 'lvsdb-33', product_name: 'Ris vitt kokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 2.7, carbohydrates_100g: 31.0, fat_100g: 0.2, fiber_100g: 0.2 }},
  { code: 'lvsdb-34', product_name: 'Pasta kokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 4.2, carbohydrates_100g: 25.8, fat_100g: 0.5, fiber_100g: 0.7 }},
  { code: 'lvsdb-35', product_name: 'Havregryn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 372.0, proteins_100g: 12.5, carbohydrates_100g: 59.0, fat_100g: 7.0, fiber_100g: 10.0 }},
  { code: 'lvsdb-36', product_name: 'Bröd vitt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 8.5, carbohydrates_100g: 50.0, fat_100g: 3.0, fiber_100g: 2.5 }},
  { code: 'lvsdb-37', product_name: 'Bröd fullkorn', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 8.0, carbohydrates_100g: 40.0, fat_100g: 3.5, fiber_100g: 6.0 }},
  { code: 'lvsdb-38', product_name: 'Vetemjöl', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 10.0, carbohydrates_100g: 72.0, fat_100g: 1.3, fiber_100g: 3.0 }},
  { code: 'lvsdb-39', product_name: 'Socker strösocker', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 400.0, proteins_100g: 0.0, carbohydrates_100g: 100.0, fat_100g: 0.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-40', product_name: 'Olivolja', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-41', product_name: 'Krossade tomater konserv', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 1.2, carbohydrates_100g: 3.8, fat_100g: 0.2, fiber_100g: 1.0 }},
  { code: 'lvsdb-42', product_name: 'Kokosmjölk', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 180.0, proteins_100g: 1.6, carbohydrates_100g: 2.8, fat_100g: 18.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-43', product_name: 'Bacon stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 480.0, proteins_100g: 30.0, carbohydrates_100g: 1.0, fat_100g: 40.0, fiber_100g: 0.0 }},
  { code: 'lvsdb-44', product_name: 'Skinka kokt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 19.0, carbohydrates_100g: 1.0, fat_100g: 5.5, fiber_100g: 0.0 }},
  { code: 'lvsdb-45', product_name: 'Korv falukorv', brands: 'Kött', nutriments: { 'energy-kcal_100g': 240.0, proteins_100g: 11.0, carbohydrates_100g: 5.0, fat_100g: 20.0, fiber_100g: 0.0 }},
];

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
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
  const [savedRecipes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koksguiden-recipes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
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

  // Funktion för att lägga till senaste konvertering
  const addRecentConversion = (conversion) => {
    setRecentConversions(prev => {
      const filtered = prev.filter(c => 
        !(c.ingredient === conversion.ingredient && c.fromUnit === conversion.fromUnit)
      );
      return [conversion, ...filtered].slice(0, 5);
    });
  };

  // Sök livsmedel
  const handleFoodSearch = useCallback((term) => {
    setFoodSearch(term);
    if (term.length < 2) {
      setFoodResults([]);
      return;
    }

    const searchTermLower = term.toLowerCase();
    
    // Hitta synonymer
    let searchTerms = [searchTermLower];
    Object.entries(synonyms).forEach(([key, values]) => {
      if (searchTermLower.includes(key)) {
        searchTerms = [...searchTerms, ...values];
      }
    });

    // Filtrera resultat
    let results = foodDatabase.filter(food => {
      const name = food.product_name.toLowerCase();
      const matchesSearch = searchTerms.some(term => name.includes(term));
      const matchesCategory = !selectedCategory || food.brands === selectedCategory;
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
        <p>Tillaga perfekt kött, fågel och fisk</p>
        <span className="menu-arrow">→</span>
      </div>
      
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('calories')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('calories')}>
        <h2>Kalorier & Näring</h2>
        <p>Sök bland 2500+ livsmedel</p>
        <span className="menu-arrow">→</span>
      </div>
      
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('basics')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('basics')}>
        <h2>Grundrecept</h2>
        <p>Såser, degar och klassiska baser</p>
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
            🥚 Ägg
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
                  ⭐ Spara som favorit
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
                      💡 {eggResult.suggestion}
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

    if (selectedItem) {
      return (
        <div className="detail-view">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setSelectedItem(null)}>
            ← Tillbaka
          </button>
          
          <div className="detail-header">
            <span className="detail-emoji">{selectedItem.image}</span>
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

          {selectedItem.tips && (
            <div className="info-box">
              <h3>💡 Tips</h3>
              <p>{selectedItem.tips}</p>
            </div>
          )}

          {(selectedItem.rare || selectedItem.medium) && (
            <div className="info-box warning">
              <h3>⚠️ Kom ihåg</h3>
              <p>Köttet fortsätter stiga 2-5°C efter att du tagit ut det. Ta ut det lite tidigare!</p>
            </div>
          )}
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
          
          return (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <div className="items-list">
                {filteredItems.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="item-row"
                    onClick={() => setSelectedItem(item)}
                  >
                    <span className="item-emoji">{item.image}</span>
                    <span className="item-name">{item.name}</span>
                    <span className="item-arrow">›</span>
                  </div>
                ))}
              </div>
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
        <p className="api-credit">Data från Livsmedelsverkets livsmedelsdatabas</p>
        
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

        <div className="category-filter">
          {foodCategories.map(cat => (
            <button
              key={cat.id}
              className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (foodSearch) handleFoodSearch(foodSearch);
              }}
            >
              {cat.label}
            </button>
          ))}
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
                    onClick={() => setSelectedFood(food)}
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

  // Grundrecept-vy
  const renderBasics = () => {
    const categories = Object.keys(basicRecipesData);
    
    if (selectedBasicRecipe) {
      return (
        <div className="detail-view">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setSelectedBasicRecipe(null)}>
            ← Tillbaka
          </button>
          <h2>{selectedBasicRecipe.name}</h2>
          <div className="recipe-meta">
            <span className="meta-item">{selectedBasicRecipe.portions}</span>
            <span className="meta-item">{selectedBasicRecipe.time}</span>
          </div>
          
          {selectedBasicRecipe.description && (
            <p className="recipe-description">{selectedBasicRecipe.description}</p>
          )}
          
          <div className="recipe-section">
            <h3>Ingredienser</h3>
            <ul className="ingredient-list">
              {selectedBasicRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>
          
          <div className="recipe-section">
            <h3>Instruktioner</h3>
            <ol className="steps-list">
              {selectedBasicRecipe.steps.map((step, idx) => (
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
                <div 
                  key={recipe.id} 
                  className="item-row"
                  onClick={() => setSelectedBasicRecipe(recipe)}
                >
                  <span className="item-name">{recipe.name}</span>
                  <span className="item-meta">{recipe.time}</span>
                  <span className="item-arrow">›</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Skapa recept-vy (förenklad)
  const renderCreate = () => {
    return (
      <div className="create-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>Skapa recept</h1>
        
        <div className="create-form">
          <div className="form-group">
            <label>Receptnamn</label>
            <input
              type="text"
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
              placeholder="T.ex. Köttbullar"
            />
          </div>
          
          <div className="form-group">
            <label>Portioner</label>
            <input
              type="number"
              value={newRecipe.portions}
              onChange={(e) => setNewRecipe({...newRecipe, portions: e.target.value})}
              min="1"
            />
          </div>

          <p className="coming-soon">
            Fullständig receptskapare med ingredienssökning och kaloriberäkning kommer snart!
          </p>
        </div>

        {savedRecipes.length > 0 && (
          <div className="saved-recipes">
            <h2>Sparade recept ({savedRecipes.length})</h2>
            <div className="recipe-list">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className="saved-recipe-card">
                  <h3>{recipe.name}</h3>
                  <p>{recipe.portions} portioner • {recipe.ingredients?.length || 0} ingredienser</p>
                </div>
              ))}
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
        {activeView === 'create' && renderCreate()}
      </main>

      <footer className="app-footer">
        <span className="footer-credit">Data från Livsmedelsverket (2025)</span>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Source+Sans+3:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .app-container {
          min-height: 100vh;
          background: linear-gradient(180deg, #fefaf6 0%, #fff8f0 100%);
          font-family: 'Source Sans 3', sans-serif;
          color: #2d2a26;
          display: flex;
          flex-direction: column;
        }

        .app-header {
          background: #6b3a55;
          color: white;
          padding: 1.25rem 1rem;
          text-align: center;
        }

        .app-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 1.75rem;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.01em;
        }

        .app-main {
          flex: 1;
          padding: 1.5rem;
          max-width: 600px;
          margin: 0 auto;
          width: 100%;
        }

        .app-footer {
          background: #f5f0f3;
          padding: 1rem;
          text-align: center;
          font-size: 0.8rem;
          color: #7a706f;
        }

        /* Home Grid */
        .home-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .menu-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border: 1px solid rgba(139, 76, 112, 0.08);
          position: relative;
        }

        .menu-card:hover {
          box-shadow: 0 4px 12px rgba(139, 76, 112, 0.12);
          border-color: rgba(139, 76, 112, 0.15);
        }

        .menu-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          color: #6b3a55;
          margin-bottom: 0.25rem;
        }

        .menu-card p {
          font-size: 0.9rem;
          color: #7a706f;
        }

        .menu-arrow {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: #c4b0bc;
          font-size: 1.5rem;
        }

        /* Buttons */
        .back-btn {
          background: none;
          border: none;
          color: #8b4c70;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.5rem 0;
          margin-bottom: 1rem;
          font-family: inherit;
        }

        /* Search Box */
        .search-box {
          position: relative;
          margin-bottom: 1rem;
        }

        .search-box input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e8e0e5;
          border-radius: 12px;
          font-size: 1rem;
          font-family: inherit;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: #e8e0e5;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1rem;
          color: #6b3a55;
        }

        /* Category Section */
        .category-section {
          margin-bottom: 1.5rem;
        }

        .category-title {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e8e0e5;
        }

        .items-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .item-row {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #f5f0f3;
          cursor: pointer;
          transition: background 0.15s;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-row:hover {
          background: #faf5f8;
        }

        .item-emoji {
          font-size: 1.5rem;
          margin-right: 1rem;
        }

        .item-name {
          flex: 1;
          font-weight: 500;
        }

        .item-meta {
          color: #8b4c70;
          font-size: 0.875rem;
          margin-right: 0.5rem;
        }

        .item-arrow {
          color: #c4b0bc;
          font-size: 1.25rem;
        }

        /* Detail View */
        .detail-view h2 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .detail-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-emoji {
          font-size: 3rem;
        }

        /* Temperature Grid */
        .temp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .temp-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .temp-card.rare {
          background: linear-gradient(135deg, #ffe8e8 0%, #fff0f0 100%);
        }

        .temp-card.medium {
          background: linear-gradient(135deg, #fff3e8 0%, #fff8f0 100%);
        }

        .temp-card.welldone {
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
        }

        .temp-label {
          display: block;
          font-size: 0.75rem;
          color: #7a706f;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .temp-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #6b3a55;
        }

        /* Info Box */
        .info-box {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .info-box h3 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .info-box.warning {
          background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
          border: 1px solid #f0e6b8;
        }

        /* Conversion View */
        .conversion-tabs {
          display: flex;
          background: #e8e0e5;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
        }

        .conversion-tabs.four-tabs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
        }

        .conversion-tabs button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          background: transparent;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .conversion-tabs.four-tabs button {
          padding: 0.6rem 0.25rem;
          font-size: 0.85rem;
        }

        .conversion-tabs button.active {
          background: white;
          color: #6b3a55;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
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
          accent-color: #8b4c70;
        }

        .converter-box {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .converter-row {
          margin-bottom: 1rem;
        }

        .value-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e8e0e5;
          border-radius: 12px;
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          font-family: inherit;
          margin-bottom: 1rem;
        }

        .value-input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .unit-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
        }

        .unit-selector button {
          padding: 0.5rem 1rem;
          border: 2px solid #e8e0e5;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-family: inherit;
          transition: all 0.15s;
        }

        .unit-selector button.active {
          background: #8b4c70;
          border-color: #8b4c70;
          color: white;
        }

        .unit-selector button:hover:not(.active) {
          border-color: #8b4c70;
        }

        .converter-arrow {
          text-align: center;
          color: #c4b0bc;
          margin: 1rem 0;
          font-weight: 500;
        }

        .result-box {
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
          border-radius: 12px;
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
          color: #6b3a55;
        }

        .result-equals {
          color: #c4b0bc;
        }

        .result-value.highlight {
          font-size: 1.5rem;
        }

        /* Common Conversions */
        .common-conversions h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
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
        }

        .ingredient-value {
          color: #8b4c70;
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
          color: #8b4c70;
          background: #f5eef2;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }

        /* Recent Conversions */
        .recent-conversions {
          margin-bottom: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
          border-radius: 12px;
        }

        .recent-conversions h4 {
          font-size: 0.875rem;
          color: #8b4c70;
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
          border: 1px solid #e8e0e5;
          border-radius: 20px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .recent-tag:hover {
          border-color: #8b4c70;
          background: #faf5f8;
        }

        /* Ingredient Converter */
        .ingredient-converter {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .selected-ingredient-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .selected-ingredient-header h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin: 0;
        }

        .change-ingredient-btn {
          padding: 0.4rem 0.75rem;
          background: #f5eef2;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          color: #8b4c70;
          cursor: pointer;
        }

        .ingredient-info {
          color: #7a706f;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .direction-selector {
          display: flex;
          background: #e8e0e5;
          border-radius: 10px;
          padding: 3px;
          margin-bottom: 1rem;
        }

        .direction-selector button {
          flex: 1;
          padding: 0.6rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          font-family: inherit;
        }

        .direction-selector button.active {
          background: white;
          color: #6b3a55;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .static-unit {
          display: block;
          text-align: center;
          padding: 0.75rem;
          color: #8b4c70;
          font-weight: 600;
        }

        .large-result {
          padding: 1.5rem;
        }

        .save-recent-btn {
          width: 100%;
          padding: 0.75rem;
          margin-top: 1rem;
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
          border: 1px solid #e8e0e5;
          border-radius: 10px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-recent-btn:hover {
          border-color: #8b4c70;
        }

        /* Ingredient List Grouped */
        .ingredient-list-grouped {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .ingredient-category {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .category-header {
          font-size: 0.8rem;
          color: #8b4c70;
          text-transform: uppercase;
          letter-spacing: 0.05em;
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
          background: #faf5f8;
          border: 1px solid #e8e0e5;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .ingredient-btn:hover {
          border-color: #8b4c70;
          background: #f5eef2;
        }

        .ingredient-btn .ing-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: #2d2a26;
        }

        .ingredient-btn .ing-gpdl {
          font-size: 0.75rem;
          color: #8b4c70;
        }

        /* Egg Converter */
        .egg-converter {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .egg-info-box {
          background: linear-gradient(135deg, #fff9e6 0%, #fffbf0 100%);
          border: 1px solid #f0e6b8;
          border-radius: 12px;
          padding: 1rem;
        }

        .egg-info-box p {
          margin: 0;
          font-size: 0.9rem;
          color: #6b5a00;
        }

        .egg-sizes-reference {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .egg-sizes-reference h4 {
          font-size: 0.875rem;
          color: #6b3a55;
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
          background: #faf5f8;
          border-radius: 10px;
        }

        .egg-size-label {
          font-weight: 700;
          font-size: 1.25rem;
          color: #6b3a55;
        }

        .egg-size-weight {
          font-size: 0.8rem;
          color: #8b4c70;
        }

        .egg-converter-box {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
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
          color: #6b3a55;
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
          border: 2px solid #e8e0e5;
          border-radius: 8px;
          font-size: 1.1rem;
          text-align: center;
          font-family: inherit;
        }

        .egg-count-input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .egg-size-select {
          padding: 0.6rem 0.75rem;
          border: 2px solid #e8e0e5;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          font-family: inherit;
          cursor: pointer;
        }

        .egg-size-select:focus {
          outline: none;
          border-color: #8b4c70;
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
          color: #7a706f;
        }

        .egg-result-detail {
          font-size: 0.875rem;
          color: #7a706f;
        }

        .egg-tip {
          margin-top: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: #fff9e6;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #6b5a00;
        }

        .egg-tips {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .egg-tips h4 {
          font-size: 0.875rem;
          color: #6b3a55;
          margin-bottom: 0.75rem;
        }

        .egg-tips ul {
          margin: 0;
          padding-left: 1.25rem;
        }

        .egg-tips li {
          font-size: 0.9rem;
          color: #5a524f;
          margin-bottom: 0.4rem;
        }

        /* Recipe styles */
        .recipe-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .meta-item {
          background: #f5eef2;
          padding: 0.4rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          color: #8b4c70;
        }

        .recipe-description {
          color: #5a524f;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .recipe-section {
          margin-bottom: 1.5rem;
        }

        .recipe-section h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
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
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin-bottom: 0.5rem;
        }

        .api-credit {
          font-size: 0.8rem;
          color: #7a706f;
          margin-bottom: 1rem;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .category-chip {
          padding: 0.4rem 0.75rem;
          background: white;
          border: 1px solid #e8e0e5;
          border-radius: 20px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.15s;
        }

        .category-chip.active {
          background: #8b4c70;
          border-color: #8b4c70;
          color: white;
        }

        .food-results h3 {
          font-size: 0.9rem;
          color: #7a706f;
          margin-bottom: 0.75rem;
        }

        .food-result-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .food-result-item:hover {
          background: #faf5f8;
        }

        .food-info {
          flex: 1;
        }

        .food-name {
          display: block;
          font-weight: 500;
        }

        .food-brand {
          font-size: 0.8rem;
          color: #7a706f;
        }

        .food-kcal {
          color: #8b4c70;
          font-weight: 600;
        }

        .food-detail h2 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
        }

        .food-category {
          color: #7a706f;
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
          border: 2px solid #e8e0e5;
          border-radius: 8px;
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
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .nutrition-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #6b3a55;
        }

        .nutrition-label {
          font-size: 0.8rem;
          color: #7a706f;
        }

        .add-to-meal-btn {
          width: 100%;
          padding: 1rem;
          background: #8b4c70;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
        }

        .meal-summary {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-top: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .meal-summary h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin-bottom: 0.75rem;
        }

        .meal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f5f0f3;
        }

        .meal-item button {
          background: none;
          border: none;
          color: #c4b0bc;
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
          background: #f5eef2;
          border: none;
          border-radius: 8px;
          color: #8b4c70;
          cursor: pointer;
        }

        /* Create View */
        .create-view h1 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin-bottom: 1rem;
        }

        .create-form {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          margin-bottom: 0.5rem;
          color: #6b3a55;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e8e0e5;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .coming-soon {
          color: #7a706f;
          font-style: italic;
          text-align: center;
          padding: 1rem;
        }

        .saved-recipes {
          margin-top: 2rem;
        }

        .saved-recipes h2 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin-bottom: 1rem;
        }

        .saved-recipe-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .saved-recipe-card h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin-bottom: 0.25rem;
        }

        .saved-recipe-card p {
          font-size: 0.875rem;
          color: #7a706f;
        }

        .search-results-count {
          font-size: 0.875rem;
          color: #7a706f;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}
