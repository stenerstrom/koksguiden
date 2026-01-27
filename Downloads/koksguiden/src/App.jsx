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
    { name: 'Kalvhögrev', image: '🥩', rare: 58, medium: 63, wellDone: 70, tips: 'Fin för långkok.' },
    { name: 'Kalvinnanlår', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mager och mör detalj.' },
    { name: 'Kalvkotlett', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Med ben för extra smak.' },
    { name: 'Kalvrostbiff', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Låt vila innan skivning.' },
    { name: 'Kalvstek', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Kan ersättas med nötstek, lammstek eller fläskstek.' },
    { name: 'Kalvytterfilé', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Mager detalj, undvik att torka ut.' },
    { name: 'Kalvytterlår', image: '🥩', rare: 55, medium: 60, wellDone: 70, tips: 'Passar för stekning.' },
  ],
  'Lamm': [
    { name: 'Kotlettrad', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Klassisk festrätt.' },
    { name: 'Lammbog', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Perfekt för långkok och brässering.' },
    { name: 'Lammentrecôte', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Grilla eller stek snabbt.' },
    { name: 'Lammfilé', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Mycket mör, korttidsstekning.' },
    { name: 'Lammfärs', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Passar till kebab och köttfärssåser.' },
    { name: 'Lammkotlett', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Rosa lamm är saftigast.' },
    { name: 'Lammlever', image: '🫀', rare: null, medium: null, wellDone: 70, tips: 'Stek snabbt på hög värme.' },
    { name: 'Lammracks', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Elegant festrätt. Trimma fettet.' },
    { name: 'Lammrostbiff', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Låt vila före skivning.' },
    { name: 'Lammstek', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Smaksätt med vitlök och rosmarin.' },
    { name: 'Lammytterfilé', image: '🍖', rare: 58, medium: 64, wellDone: 70, tips: 'Mager och mör.' },
    { name: 'Lammlägg', image: '🍖', rare: null, medium: null, wellDone: 85, tips: 'Bryn och brässera långsamt.' },
  ],
  'Fläsk': [
    { name: 'Benfri fläskkotlett', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Undvik att torka ut.' },
    { name: 'Benfri fläskkotlettrad', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Fin för ugnsstekning.' },
    { name: 'Flintastek', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Klassisk söndagsstek.' },
    { name: 'Fläskbog', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Utmärkt för pulled pork.' },
    { name: 'Fläskfilé', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Mager detalj, var försiktig så den inte torkar.' },
    { name: 'Fläskfärs', image: '🍖', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt.' },
    { name: 'Fläskkarré', image: '🥐“', rare: null, medium: null, wellDone: 80, tips: 'Högre temp för att smälta fettet.' },
    { name: 'Fläskkotlett', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Med ben ger mer smak.' },
    { name: 'Fläskkotlettrad', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Perfekt för grillen.' },
    { name: 'Fläskytterfilé', image: '🥐“', rare: null, medium: null, wellDone: 70, tips: 'Mager och prisvärd.' },
    { name: 'Grillspjut', image: '🥐“', rare: null, medium: null, wellDone: 70, tips: 'Marinera för extra smak.' },
    { name: 'Julskinka', image: '🍖', rare: null, medium: null, wellDone: 72, tips: 'Klassisk julmat.' },
    { name: 'Picnicbog', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Passar för långkok.' },
    { name: 'Revbensspjäll', image: '🍖', rare: null, medium: null, wellDone: 85, tips: 'Långkok vid 125°C i 3-4 timmar.' },
    { name: 'Sidfläsk', image: '🥐“', rare: null, medium: null, wellDone: 80, tips: 'Stek eller grill tills krispigt.' },
    { name: 'Skinka', image: '🥐“', rare: null, medium: null, wellDone: 70, tips: 'Vila efter tillagning.' },
    { name: 'Skinkfransyska', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Mör detalj.' },
    { name: 'Skinkinnanlår', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Passar för stekning.' },
    { name: 'Skinkrostbiff', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Fin för kall skivning.' },
    { name: 'Skinkstek', image: '🥐“', rare: null, medium: null, wellDone: 70, tips: 'Klassisk söndagsmiddag.' },
    { name: 'Skinkytterlår', image: '🥐“', rare: null, medium: 65, wellDone: 70, tips: 'Mager och mör.' },
  ],
  'Vilt': [
    { name: 'Hjortfilé', image: '🦌', rare: 52, medium: 57, wellDone: 65, tips: 'Serveras ofta rosa. Undvik att steka för länge.' },
    { name: 'Hjortstek', image: '🦌', rare: 55, medium: 62, wellDone: 68, tips: 'Smaksätt med enbär och timjan.' },
    { name: 'Renstek', image: '🦌', rare: 58, medium: 64, wellDone: 70, tips: 'Traditionell nordisk delikatess.' },
    { name: 'Rådjurssadel', image: '🦌', rare: null, medium: 60, wellDone: 65, tips: 'Mycket mör och fin smak.' },
    { name: 'Rådjursstek', image: '🦌', rare: null, medium: 65, wellDone: 70, tips: 'Låt vila minst 15 minuter.' },
    { name: 'Tjälknöl', image: '🦌', rare: 50, medium: 60, wellDone: 70, tips: 'Tillagas i ugn direkt från frysen vid 50-75°C.' },
    { name: 'Vildsvin', image: '🍗', rare: null, medium: null, wellDone: 72, tips: 'Alltid genomstekt. Kontrollera för trikiner.' },
    { name: 'Vildsvinsstek', image: '🍗', rare: null, medium: null, wellDone: 72, tips: 'Smakrik men kräver genomstekning.' },
    { name: 'Älgbiff', image: '🫎', rare: 58, medium: 64, wellDone: 70, tips: 'Magert kött, undvik att torka ut.' },
    { name: 'Älgentrecôte', image: '🫎', rare: 58, medium: 64, wellDone: 70, tips: 'Grilla eller stek på hög värme.' },
    { name: 'Älgfilé', image: '🫎', rare: 58, medium: 64, wellDone: 70, tips: 'Premium viltdetalj.' },
    { name: 'Älgkalvbiff', image: '🫎', rare: null, medium: 60, wellDone: 70, tips: 'Mörare än vuxen älg.' },
    { name: 'Älgkalventrecôte', image: '🫎', rare: 60, medium: 65, wellDone: 70, tips: 'Fin smak, stek varsamt.' },
    { name: 'Älgkalvfilé', image: '🫎', rare: null, medium: 60, wellDone: 65, tips: 'Delikat och mör.' },
    { name: 'Älgstek/Fransyska', image: '🫎', rare: 60, medium: 70, wellDone: 75, tips: 'Passar för långkok.' },
  ],
  'Kyckling': [
    { name: 'Hel kyckling', image: '🐔', rare: null, medium: null, wellDone: 75, tips: 'Mät i tjockaste delen av låret, intill benet.' },
    { name: 'Kycklingfilé/bröst', image: '🍗', rare: null, medium: null, wellDone: 72, tips: 'Vila 5 min efter tillagning.' },
    { name: 'Kycklingfärs', image: '🍗', rare: null, medium: null, wellDone: 70, tips: 'Alltid genomstekt.' },
    { name: 'Kycklingklubba', image: '🍗', rare: null, medium: null, wellDone: 75, tips: 'Mät intill benet.' },
    { name: 'Kycklinglår', image: '🍗', rare: null, medium: null, wellDone: 75, tips: 'Tål högre temp, blir saftigare.' },
    { name: 'Kycklinglårfilé', image: '🍗', rare: null, medium: null, wellDone: 75, tips: 'Saftigare än bröst.' },
    { name: 'Kycklingspett', image: '🍗', rare: null, medium: null, wellDone: 72, tips: 'Marinera för mer smak.' },
    { name: 'Kycklingvingar', image: '🍗', rare: null, medium: null, wellDone: 75, tips: 'Grilla eller fritera.' },
  ],
  'Kalkon': [
    { name: 'Hel kalkon', image: '🦃', rare: null, medium: null, wellDone: 72, tips: 'Mät intill benet på låret.' },
    { name: 'Kalkonbröst', image: '🦃', rare: null, medium: null, wellDone: 72, tips: 'Täck med folie för saftigare resultat.' },
    { name: 'Kalkonfilé', image: '🦃', rare: null, medium: null, wellDone: 72, tips: 'Mager detalj, undvik att torka ut.' },
    { name: 'Kalkonfärs', image: '🦃', rare: null, medium: null, wellDone: 70, tips: 'Genomstekt alltid.' },
  ],
  'Anka': [
    { name: 'Hel anka', image: '🦆', rare: 55, medium: 62, wellDone: 70, tips: 'Stek skinnet krispigt först.' },
    { name: 'Ankben', image: '🦆', rare: null, medium: 62, wellDone: 70, tips: 'Confiteras eller brässeras.' },
    { name: 'Ankbröst', image: '🦆', rare: 55, medium: 62, wellDone: 70, tips: 'Snitta skinnet, stek skinnsidan först.' },
    { name: 'Anklår', image: '🦆', rare: null, medium: 62, wellDone: 70, tips: 'Passar för långkok.' },
  ],
  'Övrig fågel': [
    { name: 'Duva', image: '🦆', rare: null, medium: null, wellDone: 74, tips: 'Smakrik viltfågel.' },
    { name: 'Fasan', image: '🦆', rare: null, medium: null, wellDone: 74, tips: 'Täck med späck för saftigare resultat.' },
    { name: 'Gås', image: '🪿', rare: null, medium: 67, wellDone: 70, tips: 'Stek långsamt för sprött skinn.' },
    { name: 'Pärlhöna', image: '🦆', rare: null, medium: null, wellDone: 74, tips: 'Tillagas som kyckling.' },
    { name: 'Vaktel', image: '🦆', rare: null, medium: null, wellDone: 74, tips: 'Liten fågel, kort tillagningstid.' },
    { name: 'Struts', image: '🦅¤', rare: 52, medium: 58, wellDone: 63, tips: 'Påminner om nötkött. Serveras rosa.' },
  ],
  'Fisk': [
    { name: 'Lax', image: '🐟', rare: null, medium: 50, wellDone: 55, tips: 'Glasig i mitten vid 50°C.' },
    { name: 'Laxfilé', image: '🐟', rare: null, medium: 50, wellDone: 55, tips: 'Stek skinnsidan först.' },
    { name: 'Torsk', image: '🐟', rare: null, medium: 53, wellDone: 57, tips: 'Flagar lätt när den är klar.' },
    { name: 'Torskrygg', image: '🐟', rare: null, medium: 53, wellDone: 57, tips: 'Premium fiskdetalj.' },
    { name: 'Tonfisk', image: '🐟', rare: 32, medium: 50, wellDone: 55, tips: 'Serveras ofta rå eller rare.' },
    { name: 'Hälleflundra', image: '🐟', rare: null, medium: 53, wellDone: 57, tips: 'Fast och smakrik fisk.' },
    { name: 'Kolja', image: '🐟', rare: null, medium: 53, wellDone: 57, tips: 'Mild smak, passar till sås.' },
    { name: 'Sej', image: '🐟', rare: null, medium: 53, wellDone: 57, tips: 'Prisvärd vitfisk.' },
    { name: 'Rödspätta', image: '🐟', rare: null, medium: 53, wellDone: 57, tips: 'Stek i smör.' },
    { name: 'Gös', image: '🐟', rare: null, medium: 50, wellDone: 60, tips: 'Svensk sötvattensfisk.' },
    { name: 'Makrill', image: '🐟', rare: null, medium: 50, wellDone: 60, tips: 'Fet fisk, grilla eller rök.' },
    { name: 'Röding', image: '🐟', rare: null, medium: 50, wellDone: 58, tips: 'Fin nordisk fisk.' },
    { name: 'Hel fisk', image: '🐟', rare: null, medium: 54, wellDone: 58, tips: 'Mät längs ryggbenet.' },
  ],
};

// Data för ugnsinställningar
const ovenData = {
  'Mjuka kakor': [
    { name: 'Långpannekakor', image: '🍫', overUnder: '180-190', convection: '160-170', time: '20-35', position: 'nedre' },
    { name: 'Muffins, små', image: '🧁', overUnder: '200-225', convection: '175-200', time: '12-18', position: 'mitten' },
    { name: 'Muffins, stora', image: '🧁', overUnder: '175-200', convection: '160-175', time: '20-30', position: 'mitten' },
    { name: 'Sockerkaka', image: '🍰', overUnder: '175', convection: '160', time: '45-55', position: 'nedre' },
    { name: 'Kladdkaka', image: '🍫', overUnder: '175', convection: '160', time: '15-20', position: 'mitten' },
    { name: 'Chokladkaka', image: '🍫', overUnder: '175', convection: '160', time: '25-35', position: 'mitten' },
    { name: 'Morotskaka', image: '🥕', overUnder: '175', convection: '160', time: '40-50', position: 'nedre' },
    { name: 'Bananabread', image: '🍌', overUnder: '175', convection: '160', time: '50-60', position: 'nedre' },
  ],
  'Tårtor': [
    { name: 'Mandel/nötbotten', image: '🥧', overUnder: '175', convection: '160', time: '25-35', position: 'nedre' },
    { name: 'Mördegsbotten', image: '🥧', overUnder: '200', convection: '175', time: '12-18', position: 'nedre' },
    { name: 'Rulltårta', image: '🍰', overUnder: '250', convection: '225', time: '5-6', position: 'mitten' },
    { name: 'Sockerkaksbotten', image: '🎂', overUnder: '175', convection: '160', time: '30-40', position: 'nedre' },
    { name: 'Cheesecake', image: '🍰', overUnder: '150', convection: '140', time: '45-60', position: 'mitten' },
    { name: 'Chokladfondant', image: '🍫', overUnder: '200', convection: '180', time: '10-12', position: 'mitten' },
  ],
  'Småkakor': [
    { name: 'Maränger', image: '🥮', overUnder: '100-125', convection: '100', time: '60-90', position: 'mitten' },
    { name: 'Mördegskakor', image: '🍪', overUnder: '175-200', convection: '160-175', time: '8-12', position: 'mitten' },
    { name: 'Pepparkakor', image: '🍪', overUnder: '175-200', convection: '160-175', time: '6-10', position: 'mitten' },
    { name: 'Havrekakor', image: '🍪', overUnder: '175', convection: '160', time: '10-15', position: 'mitten' },
    { name: 'Kolakakor', image: '🍪', overUnder: '175', convection: '160', time: '12-15', position: 'mitten' },
    { name: 'Chokladkakor', image: '🍪', overUnder: '175', convection: '160', time: '10-12', position: 'mitten' },
    { name: 'Drömmar', image: '🍪', overUnder: '150', convection: '140', time: '15-20', position: 'mitten' },
  ],
  'Matbröd': [
    { name: 'Formfranska', image: '🍞', overUnder: '200-225', convection: '175-200', time: '30-40', position: 'nedre' },
    { name: 'Foccacia', image: '🍫“', overUnder: '225-250', convection: '200-225', time: '15-25', position: 'mitten' },
    { name: 'Baguette', image: '🥖', overUnder: '225-250', convection: '200-225', time: '20-25', position: 'mitten' },
    { name: 'Pizzadeg', image: '🍕', overUnder: '250-275', convection: '225-250', time: '8-12', position: 'nedre' },
    { name: 'Vetebröd', image: '🍞', overUnder: '200-225', convection: '175-200', time: '12-18', position: 'mitten' },
    { name: 'Rågbröd', image: '🍞', overUnder: '175-200', convection: '160-175', time: '45-60', position: 'nedre' },
    { name: 'Surdegsbröd', image: '🍞', overUnder: '225-250', convection: '200-225', time: '35-45', position: 'nedre' },
  ],
  'Bullar & fikabröd': [
    { name: 'Kanelbullar', image: '🥮', overUnder: '225-250', convection: '200-225', time: '8-12', position: 'mitten' },
    { name: 'Kardemummabullar', image: '🥮', overUnder: '225-250', convection: '200-225', time: '8-12', position: 'mitten' },
    { name: 'Semla', image: '🥮', overUnder: '225', convection: '200', time: '10-15', position: 'mitten' },
    { name: 'Wienerbröd', image: '🥐', overUnder: '200-225', convection: '175-200', time: '15-20', position: 'mitten' },
    { name: 'Croissant', image: '🥐', overUnder: '200-225', convection: '175-200', time: '15-20', position: 'mitten' },
  ],
};

// Data för ingrediensersättningar
const substitutionData = {
  'Nötkött': [
    { name: 'Entrecôte', substitutes: ['Ryggbiff', 'Oxfilé', 'Ribeye', 'Rostbiff'] },
    { name: 'Högrev', substitutes: ['Bringa', 'Bog', 'Fransyska', 'Tjockstek'] },
    { name: 'Kalvstek', substitutes: ['Nötstek', 'Fransyska', 'Älgstek', 'Lammstek', 'Fläskstek'] },
    { name: 'Nötfärs', substitutes: ['Blandfärs', 'Lammfärs', 'Kycklingfärs', 'Vegofärs'] },
    { name: 'Oxfilé', substitutes: ['Ryggbiff', 'Entrecôte', 'Kalvfilé', 'Innanlår'] },
    { name: 'Rostbiff', substitutes: ['Ryggbiff', 'Entrecôte', 'Ytterlår'] },
    { name: 'Fransyska', substitutes: ['Högrev', 'Bog', 'Ytterlår', 'Bringa'] },
  ],
  'Fläsk': [
    { name: 'Fläskfilé', substitutes: ['Fläskytterfilé', 'Kycklingbröst', 'Kalkonfilé'] },
    { name: 'Fläskkotlett', substitutes: ['Revbensspjäll', 'Karré', 'Lammkotlett'] },
    { name: 'Bacon', substitutes: ['Pancetta', 'Rökt sidfläsk', 'Vegobacon'] },
    { name: 'Sidfläsk', substitutes: ['Fläskbog', 'Karré', 'Revben'] },
    { name: 'Skinka', substitutes: ['Kalkonbröst', 'Rökt fläskfilé'] },
  ],
  'Kyckling': [
    { name: 'Kycklingbröst', substitutes: ['Kalkonbröst', 'Kycklinglår', 'Fläskfilé'] },
    { name: 'Kycklinglår', substitutes: ['Ankben', 'Kalkonlår', 'Kycklingklubba'] },
    { name: 'Hel kyckling', substitutes: ['Kalkon', 'Anka', 'Pärlhöna'] },
    { name: 'Kycklingfärs', substitutes: ['Kalkonfärs', 'Fläskfärs', 'Vegofärs'] },
  ],
  'Fisk': [
    { name: 'Lax', substitutes: ['Öring', 'Röding', 'Forellax'] },
    { name: 'Torsk', substitutes: ['Kolja', 'Sej', 'Kummel', 'Gös'] },
    { name: 'Tonfisk', substitutes: ['Svärdfisk', 'Makrill', 'Bonito'] },
    { name: 'Räkor', substitutes: ['Kräftor', 'Krabba', 'Hummer'] },
  ],
  'Mejeriprodukter': [
    { name: 'Smör', substitutes: ['Margarin', 'Kokosolja', 'Olivolja', 'Veganskt smör'] },
    { name: 'Grädde', substitutes: ['Havregräde', 'Kokosgrädde', 'Cashewgrädde', 'Créme fraiche'] },
    { name: 'Mjölk', substitutes: ['Havremjölk', 'Mandelmjölk', 'Sojamjölk', 'Kokosmjölk'] },
    { name: 'Ost', substitutes: ['Vegansk ost', 'Nutritional yeast', 'Cashewost'] },
    { name: 'Ägg', substitutes: ['Aquafaba (3 msk = 1 ägg)', 'Chiaägg', 'Linfrö + vatten', 'Banan (½ st)', 'Äppelmos (3 msk)'] },
    { name: 'Filmjölk', substitutes: ['Yoghurt', 'Kefir', 'Havrefil'] },
    { name: 'Créme fraiche', substitutes: ['Gräddfil', 'Turkisk yoghurt', 'Kvarg'] },
  ],
  'Mjöl & stärkelse': [
    { name: 'Vetemjöl', substitutes: ['Glutenfri mjölmix', 'Mandelmel', 'Havremjöl', 'Rismjöl', 'Dinkelmjöl'] },
    { name: 'Potatismjöl', substitutes: ['Majsstärkelse', 'Arrowrot', 'Tapiokastärkelse'] },
    { name: 'Ströbröd', substitutes: ['Havreflingor (mixade)', 'Mandelmjöl', 'Glutenfritt ströbröd', 'Pankosmuler'] },
    { name: 'Bakpulver', substitutes: ['Bikarbonat + syra (citron/vinäger)', '1 tsk = ½ tsk bikarbonat + ½ tsk citron'] },
  ],
  'Sötningsmedel': [
    { name: 'Socker', substitutes: ['Honung', 'Lönnsirap', 'Kokossocker', 'Stevia', 'Dadlar (mixade)'] },
    { name: 'Sirap', substitutes: ['Honung', 'Lönnsirap', 'Agavesirap', 'Rissirap'] },
    { name: 'Florsocker', substitutes: ['Mixa strösocker', 'Potatismjöl + socker'] },
    { name: 'Farinsocker', substitutes: ['Muscovadosocker', 'Socker + sirap', 'Kokossocker'] },
  ],
};

// Grundrecept-data
const basicRecipesData = {
  'De fem grundsåserna': [
    { 
      name: 'Bechamelsås', 
      portions: '5 dl',
      time: '15 min',
      ingredients: ['3 msk smör', '3 msk vetemjöl', '5 dl mjölk', 'Salt', 'Vitpeppar', 'Riven muskotnöt'],
      steps: [
        'Smält smöret i en kastrull på medelvärme.',
        'Tillsätt mjölet och rör om. Låt fräsa 1-2 minuter utan att det tar färg.',
        'Tillsätt mjölken lite i taget under ständig omrörning så det inte klumpar sig.',
        'Låt såsen sjuda 3-5 minuter tills den tjocknat.',
        'Smaka av med salt, vitpeppar och riven muskotnöt.'
      ],
      description: 'Vit sås gjord på mjölk. Bas för ostsås, lasagne, gratänger och croque monsieur.'
    },
    { 
      name: 'Velouté', 
      portions: '5 dl',
      time: '20 min',
      ingredients: ['3 msk smör', '3 msk vetemjöl', '5 dl ljus buljong (kyckling, kalv eller fisk)', 'Salt', 'Vitpeppar'],
      steps: [
        'Smält smöret i en kastrull på medelvärme.',
        'Tillsätt mjölet och rör om. Låt fräsa 1-2 minuter utan att det tar färg.',
        'Tillsätt buljongen lite i taget under ständig omrörning.',
        'Låt såsen sjuda 15-20 minuter på låg värme. Skumma vid behov.',
        'Smaka av med salt och vitpeppar. Sila för en silkeslen konsistens.'
      ],
      description: 'Ljus sås gjord på buljong. Bas för svampsås, vin blanc-sås och supreme.'
    },
    { 
      name: 'Espagnole', 
      portions: '5 dl',
      time: '45 min',
      ingredients: ['3 msk smör', '3 msk vetemjöl', '6 dl mörk köttbuljong', '2 msk tomatpuré', '1 liten morot', '1 liten lök', '1 stjälk selleri', '1 lagerblad', '2 kvistar timjan'],
      steps: [
        'Tärna grönsakerna fint och fräs dem i smöret tills de mjuknat.',
        'Tillsätt mjölet och rör om. Låt brynas till gyllenbrun färg.',
        'Rör ner tomatpurén.',
        'Tillsätt buljongen och örterna. Rör om väl.',
        'Låt sjuda på låg värme i 30-45 minuter. Skumma av fett och orenheter.',
        'Sila såsen och smaka av med salt och peppar.'
      ],
      description: 'Mörk, kraftig sås. Bas för demi-glace, bordelaise och andra klassiska köttsåser.'
    },
    { 
      name: 'Hollandaisesås', 
      portions: '2 dl',
      time: '15 min',
      ingredients: ['3 äggulor', '200 g smör', '1 msk citronjuice', '1 msk vatten', 'Salt', 'Vitpeppar', 'Cayennepeppar'],
      steps: [
        'Smält smöret och låt det svalna något så det är varmt men inte hett.',
        'Vispa äggulor och vatten i en skål över vattenbad (vattnet ska inte koka).',
        'Fortsätt vispa tills smeten är ljus, luftig och tjocknat.',
        'Ta skålen från värmen. Tillsätt det smälta smöret i en tunn stråle under konstant vispning.',
        'Smaka av med citronjuice, salt, vitpeppar och en nypa cayenne.',
        'Servera genast. Håll varm över vattenbad vid behov.'
      ],
      description: 'Emulgerad smörsås. Bas för bearnaise, mousseline och choron.'
    },
    { 
      name: 'Tomatsås', 
      portions: '5 dl',
      time: '30 min',
      ingredients: ['2 msk olivolja', '1 lök, hackad', '2 vitlöksklyftor, hackade', '400 g krossade tomater', '1 msk tomatpuré', '1 tsk socker', 'Salt', 'Peppar', 'Färsk basilika'],
      steps: [
        'Fräs löken i olivoljan på medelvärme tills den mjuknat, ca 5 minuter.',
        'Tillsätt vitlöken och fräs ytterligare 1 minut.',
        'Tillsätt krossade tomater, tomatpuré och socker.',
        'Låt sjuda på låg värme i 20-25 minuter tills såsen tjocknat.',
        'Smaka av med salt och peppar.',
        'Rör ner färsk basilika precis innan servering.'
      ],
      description: 'Klassisk tomatsås. Bas för pasta, pizza, arrabiata och puttanesca.'
    },
  ],
}

// Måttomvandlingsdata
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
    cup: 236.588,
  },
  weightToVolume: {
    'Vetemjöl': { gPerDl: 60 },
    'Grahamsmjöl': { gPerDl: 65 },
    'Rågmjöl': { gPerDl: 70 },
    'Potatismjöl': { gPerDl: 80 },
    'Maizena': { gPerDl: 80 },
    'Socker': { gPerDl: 90 },
    'Florsocker': { gPerDl: 50 },
    'Farinsocker': { gPerDl: 85 },
    'Kakao': { gPerDl: 40 },
    'Havregryn': { gPerDl: 40 },
    'Ris': { gPerDl: 90 },
    'Smör': { gPerDl: 95 },
    'Margarin': { gPerDl: 95 },
    'Honung': { gPerDl: 140 },
    'Sirap': { gPerDl: 140 },
    'Mjölk': { gPerDl: 103 },
    'Grädde': { gPerDl: 100 },
    'Vatten': { gPerDl: 100 },
    'Olja': { gPerDl: 90 },
    'Salt, fint': { gPerDl: 130 },
    'Salt, grovt': { gPerDl: 100 },
    'Mandelmjöl': { gPerDl: 50 },
    'Kokosflingor': { gPerDl: 35 },
  },
};

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Måttomvandling state
  const [conversionType, setConversionType] = useState('weight');
  const [fromUnit, setFromUnit] = useState('kg');
  const [toUnit, setToUnit] = useState('g');
  const [fromValue, setFromValue] = useState('1');
  const [showForeign, setShowForeign] = useState(false);

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
    // Ladda sparade recept från localStorage vid start
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('koksguiden-recipes');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [newIngredient, setNewIngredient] = useState('');
  const [newStep, setNewStep] = useState('');
  
  // Spara recept till localStorage när de ändras
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-recipes', JSON.stringify(savedRecipes));
    }
  }, [savedRecipes]);
  
  // State för ingredienssökning med kalorier
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

  // Spara sökhistorik till localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-search-history', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);

  // Spara favoriter till localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('koksguiden-favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

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

  // Portionsskalning
  const getScaledPortions = (recipeId, originalPortions) => {
    return scaledPortions[recipeId] || parseInt(originalPortions) || 4;
  };

  const scaleIngredient = (amount, originalPortions, newPortions) => {
    const scale = newPortions / (parseInt(originalPortions) || 4);
    const scaled = amount * scale;
    // Avrunda snyggt
    if (scaled < 10) return Math.round(scaled * 10) / 10;
    return Math.round(scaled);
  };

  // Kategorier för filtrering (förkortade för bättre UX)
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
    { id: 'Godis', label: 'Godis' },
    { id: 'Snacks', label: 'Snacks' },
    { id: 'Nötter, frön', label: 'Nötter' },
  ];

  // Debounce search
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Livsmedelsverkets livsmedelsdatabas (2575 livsmedel, version 2025-10-29)
  const localFoodDatabase = [
    { code: 'lvsdb-0', product_name: 'Nöt talg', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 656.0, proteins_100g: 7.0, carbohydrates_100g: 0.0, fat_100g: 71.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1', product_name: 'Gris späck', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 763.0, proteins_100g: 2.8, carbohydrates_100g: 0.0, fat_100g: 85.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2', product_name: 'Gris ister', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-3', product_name: 'Kokosfett', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-4', product_name: 'Matfettsblandning havssaltat fett 80% berikad typ Bregott', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 712.0, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-5', product_name: 'Matfettsblandning fett 60% berikad typ Bregott mellan', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 534.0, proteins_100g: 0.4, carbohydrates_100g: 0.5, fat_100g: 60.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-6', product_name: 'Flytande margarin fett 82% berikad typ Milda culinesse', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 725.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 82.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-7', product_name: 'Hushållsmargarin fett 80% berikad typ Melba', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 710.0, proteins_100g: 0.1, carbohydrates_100g: 0.4, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-8', product_name: 'Hushållsmargarin fett 80% berikad typ Milda', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 712.0, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-9', product_name: 'Lättmargarin fett 38% berikad typ Becel', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 348.0, proteins_100g: 0.0, carbohydrates_100g: 3.0, fat_100g: 38.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-10', product_name: 'Lättmargarin fett 40% berikad typ Lätt & lagom', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 381.0, proteins_100g: 0.5, carbohydrates_100g: 6.2, fat_100g: 40.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-11', product_name: 'Majonnäs fett 90% hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 782.0, proteins_100g: 1.5, carbohydrates_100g: 0.4, fat_100g: 87.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-12', product_name: 'Sesamsås m. grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 2.3, carbohydrates_100g: 3.9, fat_100g: 37.8, fiber_100g: 0.6 }},
    { code: 'lvsdb-13', product_name: 'Gravlaxsås hovmästarsås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 438.0, proteins_100g: 2.1, carbohydrates_100g: 13.3, fat_100g: 42.4, fiber_100g: 0.4 }},
    { code: 'lvsdb-14', product_name: 'Gravlaxsås kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 555.0, proteins_100g: 1.6, carbohydrates_100g: 13.1, fat_100g: 56.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-15', product_name: 'Remouladsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 707.0, proteins_100g: 1.5, carbohydrates_100g: 1.1, fat_100g: 78.7, fiber_100g: 0.3 }},
    { code: 'lvsdb-16', product_name: 'Dressing vinägrett fett 45%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 406.0, proteins_100g: 0.7, carbohydrates_100g: 2.9, fat_100g: 44.2, fiber_100g: 0.2 }},
    { code: 'lvsdb-17', product_name: 'Smör fett 80%', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 729.0, proteins_100g: 0.4, carbohydrates_100g: 0.5, fat_100g: 82.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-18', product_name: 'Smör extrasaltat fett 80%', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 728.0, proteins_100g: 0.6, carbohydrates_100g: 0.5, fat_100g: 81.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-19', product_name: 'Smör osaltat fett 80%', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 728.0, proteins_100g: 0.6, carbohydrates_100g: 0.5, fat_100g: 81.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-20', product_name: 'Druvkärnolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-21', product_name: 'Majsolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-22', product_name: 'Olivolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-23', product_name: 'Tistelolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-24', product_name: 'Sesamolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-25', product_name: 'Sojaolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-26', product_name: 'Solrosolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-27', product_name: 'Vetegroddsolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-28', product_name: 'Dressing konserv. fett ca 25%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 262.0, proteins_100g: 0.5, carbohydrates_100g: 9.7, fat_100g: 25.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-29', product_name: 'Dressing till sallad m. majonnäs fett ca 25% kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 303.0, proteins_100g: 0.5, carbohydrates_100g: 19.7, fat_100g: 25.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-30', product_name: 'Dressing fett 0%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 1.6, carbohydrates_100g: 13.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-31', product_name: 'Majonnäs fett 80%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 666.0, proteins_100g: 1.3, carbohydrates_100g: 5.0, fat_100g: 72.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-32', product_name: 'Gurkmajonnäs gurksallad gatukök', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 333.0, proteins_100g: 0.8, carbohydrates_100g: 10.9, fat_100g: 32.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-33', product_name: 'Räkmajonnäs räksallad gatukök', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 457.0, proteins_100g: 5.2, carbohydrates_100g: 2.9, fat_100g: 48.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-34', product_name: 'Majonnäs lätt fett 30%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 323.0, proteins_100g: 1.5, carbohydrates_100g: 10.7, fat_100g: 30.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-35', product_name: 'Mimosasallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 0.8, carbohydrates_100g: 9.1, fat_100g: 11.7, fiber_100g: 1.4 }},
    { code: 'lvsdb-36', product_name: 'Rödbetssallad m. gräddfil hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 1.1, carbohydrates_100g: 9.9, fat_100g: 1.9, fiber_100g: 1.5 }},
    { code: 'lvsdb-37', product_name: 'Sallad m. skaldjur majonnäsdressing', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 5.8, carbohydrates_100g: 2.4, fat_100g: 8.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-38', product_name: 'Bearnaisesås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 510.0, proteins_100g: 2.6, carbohydrates_100g: 1.2, fat_100g: 55.9, fiber_100g: 0.1 }},
    { code: 'lvsdb-39', product_name: 'Hollandaisesås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 500.0, proteins_100g: 3.0, carbohydrates_100g: 0.7, fat_100g: 54.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-40', product_name: 'Rhode Islandsås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 356.0, proteins_100g: 1.8, carbohydrates_100g: 6.3, fat_100g: 36.5, fiber_100g: 0.4 }},
    { code: 'lvsdb-41', product_name: 'Dressing vinägrett fett 65%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 586.0, proteins_100g: 0.6, carbohydrates_100g: 2.2, fat_100g: 65.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-42', product_name: 'Bearnaisesås tillagad frysvara el. pulver', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 224.0, proteins_100g: 2.6, carbohydrates_100g: 6.7, fat_100g: 21.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-43', product_name: 'Hollandaisesås tillagad frysvara el. pulver', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 232.0, proteins_100g: 2.6, carbohydrates_100g: 6.6, fat_100g: 22.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-44', product_name: 'Mesost fett ca 30%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 460.0, proteins_100g: 11.0, carbohydrates_100g: 39.0, fat_100g: 29.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-45', product_name: 'Messmör fett 5% berikad', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 260.0, proteins_100g: 7.0, carbohydrates_100g: 46.0, fat_100g: 5.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-46', product_name: 'Messmör fett 2% berikad', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 7.0, carbohydrates_100g: 49.0, fat_100g: 2.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-47', product_name: 'Färskost cottage cheese naturell fett 4%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 13.4, carbohydrates_100g: 1.9, fat_100g: 4.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-48', product_name: 'Färskost cottage cheese m. frukt fett 3%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 10.3, carbohydrates_100g: 9.1, fat_100g: 2.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-49', product_name: 'Färskost cottage cheese m. grönsaker fett 3,5-5%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 94.0, proteins_100g: 12.2, carbohydrates_100g: 0.9, fat_100g: 4.2, fiber_100g: 1.7 }},
    { code: 'lvsdb-50', product_name: 'Färskost m. filmjölk fett ca 8%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 8.0, carbohydrates_100g: 2.9, fat_100g: 8.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-51', product_name: 'Färskost m. filmjölk gräddfil fett ca 14% hemlagad', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 178.0, proteins_100g: 9.7, carbohydrates_100g: 3.1, fat_100g: 14.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-52', product_name: 'Kvarg färskost fett 1%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 12.7, carbohydrates_100g: 3.6, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-53', product_name: 'Kvarg färskost fett 10%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 152.0, proteins_100g: 12.7, carbohydrates_100g: 2.9, fat_100g: 10.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-54', product_name: 'Ost hårdost fett 10%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 32.4, carbohydrates_100g: 1.5, fat_100g: 10.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-55', product_name: 'Ost hårdost fett 23%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 325.0, proteins_100g: 29.2, carbohydrates_100g: 0.8, fat_100g: 23.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-56', product_name: 'Ost hårdost fett 26%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 337.0, proteins_100g: 24.9, carbohydrates_100g: 1.4, fat_100g: 26.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-57', product_name: 'Ost hårdost fett 38%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 420.0, proteins_100g: 19.2, carbohydrates_100g: 1.0, fat_100g: 38.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-58', product_name: 'Vitmögelost camembert fett ca 22%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 19.3, carbohydrates_100g: 1.9, fat_100g: 21.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-59', product_name: 'Ädelost blågrön mögelost fett 30%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 336.0, proteins_100g: 21.2, carbohydrates_100g: 0.2, fat_100g: 28.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-60', product_name: 'Mjukost smältost fett 8%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 16.0, carbohydrates_100g: 1.7, fat_100g: 7.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-61', product_name: 'Mjukost smältost fett 10%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 16.0, carbohydrates_100g: 0.0, fat_100g: 10.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-62', product_name: 'Mjukost smältost fett ca 20%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 246.0, proteins_100g: 15.4, carbohydrates_100g: 0.0, fat_100g: 20.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-63', product_name: 'Mjukost smältost fett ca 16%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 194.0, proteins_100g: 15.4, carbohydrates_100g: 2.0, fat_100g: 14.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-64', product_name: 'Mjukost smältost fett 4%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 14.3, carbohydrates_100g: 5.7, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-65', product_name: 'Vitmögelost brie fett ca 38%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 374.0, proteins_100g: 15.6, carbohydrates_100g: 1.9, fat_100g: 34.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-66', product_name: 'Ädelost grönmögelost fett 17%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 315.0, proteins_100g: 31.4, carbohydrates_100g: 0.9, fat_100g: 20.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-67', product_name: 'Salladsost fett 22%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 16.7, carbohydrates_100g: 2.1, fat_100g: 22.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-68', product_name: 'Ost hårdost fett 17%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 287.0, proteins_100g: 30.4, carbohydrates_100g: 1.7, fat_100g: 17.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-69', product_name: 'Ost hårdost fett 28%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 358.0, proteins_100g: 26.2, carbohydrates_100g: 3.0, fat_100g: 27.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-70', product_name: 'Ost hårdost fett 31%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 392.0, proteins_100g: 25.2, carbohydrates_100g: 3.3, fat_100g: 31.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-71', product_name: 'Vitmögelost brie fett 30%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 348.0, proteins_100g: 17.0, carbohydrates_100g: 2.8, fat_100g: 30.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-72', product_name: 'Ost halloumi rå fett 22%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 22.3, carbohydrates_100g: 1.9, fat_100g: 21.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-73', product_name: 'Färskost fett 33%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 343.0, proteins_100g: 10.2, carbohydrates_100g: 2.4, fat_100g: 33.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-74', product_name: 'Ädelost blågrön mögelost fett över 40%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 432.0, proteins_100g: 13.4, carbohydrates_100g: 1.2, fat_100g: 42.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-75', product_name: 'Ost hårdost parmesan fett 30% typ Parmiggiano Reggiano', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 428.0, proteins_100g: 31.1, carbohydrates_100g: 4.2, fat_100g: 32.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-76', product_name: 'Färskost m. vitlök fett 35%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 340.0, proteins_100g: 4.0, carbohydrates_100g: 3.5, fat_100g: 35.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-77', product_name: 'Vitmögelost camembert fett 11%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 185.0, proteins_100g: 21.4, carbohydrates_100g: 0.2, fat_100g: 11.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-78', product_name: 'Färskost cream cheese fett 27%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 276.0, proteins_100g: 6.1, carbohydrates_100g: 2.4, fat_100g: 27.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-79', product_name: 'Färskost cream cheese lätt fett 15%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 187.0, proteins_100g: 7.8, carbohydrates_100g: 3.4, fat_100g: 16.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-80', product_name: 'Färskost cream cheese extra light fett 5%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 12.2, carbohydrates_100g: 4.7, fat_100g: 5.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-81', product_name: 'Vitmögelost camembert friterad', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 320.0, proteins_100g: 16.3, carbohydrates_100g: 16.1, fat_100g: 21.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-82', product_name: 'Vitmögelost getost chèvre fett 25%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 345.0, proteins_100g: 20.6, carbohydrates_100g: 1.4, fat_100g: 29.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-83', product_name: 'Bröstmjölk humanmjölk', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.3, carbohydrates_100g: 8.7, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-84', product_name: 'Filmjölk fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 3.3, carbohydrates_100g: 4.6, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-85', product_name: 'Kondenserad mjölk konserv. fett ca 8%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 6.8, carbohydrates_100g: 10.0, fat_100g: 7.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-86', product_name: 'Kondenserad mjölk konserv. konc. m. socker fett ca 9%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 334.0, proteins_100g: 8.9, carbohydrates_100g: 55.4, fat_100g: 8.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-87', product_name: 'Mjölkpulver fett 1%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 365.0, proteins_100g: 36.2, carbohydrates_100g: 52.0, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-88', product_name: 'Filmjölk långfil fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.4, carbohydrates_100g: 4.8, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-89', product_name: 'Lättfil fett 0,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 3.5, carbohydrates_100g: 5.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-90', product_name: 'Milkshake choklad jordgubb', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 2.0, carbohydrates_100g: 10.9, fat_100g: 3.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-91', product_name: 'Mjölk fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.6, carbohydrates_100g: 4.6, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-92', product_name: 'Yoghurt naturell fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 3.4, carbohydrates_100g: 4.5, fat_100g: 2.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-93', product_name: 'Fruktyoghurt lätt fett 0,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 76.0, proteins_100g: 3.0, carbohydrates_100g: 14.3, fat_100g: 0.5, fiber_100g: 0.5 }},
    { code: 'lvsdb-94', product_name: 'Mjölk fett 4,2% typ lantmjölk', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 3.5, carbohydrates_100g: 4.7, fat_100g: 4.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-95', product_name: 'Filmjölk A-fil fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.4, carbohydrates_100g: 4.8, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-96', product_name: 'Mellanfil fett 1,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 3.5, carbohydrates_100g: 5.0, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-97', product_name: 'Mjölkdryck jordgubb fett 1,5% berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 3.3, carbohydrates_100g: 5.2, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-98', product_name: 'Yoghurt naturell lätt fett 0,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 3.6, carbohydrates_100g: 5.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-99', product_name: 'Fruktyoghurt fett 2%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 3.0, carbohydrates_100g: 11.5, fat_100g: 1.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-100', product_name: 'Fruktyoghurt delikatessyoghurt fett 7%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 2.5, carbohydrates_100g: 14.0, fat_100g: 7.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-101', product_name: 'Kefir fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.4, carbohydrates_100g: 4.8, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-102', product_name: 'Yoghurt mild vanilj lätt fett 0,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 4.0, carbohydrates_100g: 9.4, fat_100g: 0.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-103', product_name: 'Yoghurt mild vanilj fett 2%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 3.2, carbohydrates_100g: 9.9, fat_100g: 1.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-104', product_name: 'Mellanmjölk fett 1,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 3.6, carbohydrates_100g: 4.7, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-105', product_name: 'Lättmjölk fett 0,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 3.6, carbohydrates_100g: 4.8, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-106', product_name: 'Vassle flytande', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 0.8, carbohydrates_100g: 5.1, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-107', product_name: 'Filbunke m. grädde', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 3.6, carbohydrates_100g: 4.7, fat_100g: 4.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-108', product_name: 'Varm choklad m. mjölk fett 3%', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 3.8, carbohydrates_100g: 8.3, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-109', product_name: 'Varm choklad m. mjölk fett 1,5%', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 3.8, carbohydrates_100g: 8.4, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-110', product_name: 'Varm choklad m. mjölk fett 0,5%', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 3.8, carbohydrates_100g: 8.5, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-111', product_name: 'Smoothie m. yoghurt bär banan juice', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 2.6, carbohydrates_100g: 8.4, fat_100g: 1.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-112', product_name: 'Hårt bröd fullkorn råg fibrer 15,5% typ Husman', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 10.0, carbohydrates_100g: 64.4, fat_100g: 2.5, fiber_100g: 15.5 }},
    { code: 'lvsdb-113', product_name: 'Hårt bröd fullkorn råg fibrer ca 18% typ Ryvita mörkt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 349.0, proteins_100g: 14.6, carbohydrates_100g: 57.6, fat_100g: 2.5, fiber_100g: 17.6 }},
    { code: 'lvsdb-114', product_name: 'Hårt bröd fullkorn vete m. vallmofrö fibrer 5,5%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 398.0, proteins_100g: 11.1, carbohydrates_100g: 68.9, fat_100g: 7.1, fiber_100g: 5.5 }},
    { code: 'lvsdb-115', product_name: 'Hårt bröd fullkorn råg fibrer 14,5% typ Vika', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 345.0, proteins_100g: 9.6, carbohydrates_100g: 63.3, fat_100g: 2.4, fiber_100g: 14.5 }},
    { code: 'lvsdb-116', product_name: 'Hårt bröd fullkorn råg fibrer 16% typ Finn crisp', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 348.0, proteins_100g: 11.1, carbohydrates_100g: 62.8, fat_100g: 2.0, fiber_100g: 16.0 }},
    { code: 'lvsdb-117', product_name: 'Hårt bröd fullkorn råg fibrer ca 15% typ flatbröd', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 362.0, proteins_100g: 9.5, carbohydrates_100g: 68.0, fat_100g: 2.0, fiber_100g: 15.4 }},
    { code: 'lvsdb-118', product_name: 'Hårt bröd glutenfritt fibrer ca 7%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 346.0, proteins_100g: 6.3, carbohydrates_100g: 71.1, fat_100g: 2.0, fiber_100g: 7.0 }},
    { code: 'lvsdb-119', product_name: 'Hårt bröd fullkorn råg fibrer ca 13%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 9.3, carbohydrates_100g: 65.7, fat_100g: 2.6, fiber_100g: 13.2 }},
    { code: 'lvsdb-120', product_name: 'Hårt bröd fullkorn råg kli fibrer ca 15%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 349.0, proteins_100g: 9.5, carbohydrates_100g: 63.9, fat_100g: 2.5, fiber_100g: 15.1 }},
    { code: 'lvsdb-121', product_name: 'Hårt bröd fullkorn råg fibrer ca 14% typ rutknäcke', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 356.0, proteins_100g: 10.0, carbohydrates_100g: 65.3, fat_100g: 2.6, fiber_100g: 14.2 }},
    { code: 'lvsdb-122', product_name: 'Hårt bröd fullkorn råg fibrer 15,5% typ brungräddat', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 10.0, carbohydrates_100g: 63.5, fat_100g: 2.4, fiber_100g: 15.5 }},
    { code: 'lvsdb-123', product_name: 'Hårt bröd fullkorn råg fibrer ca 16% typ sport', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 341.0, proteins_100g: 10.0, carbohydrates_100g: 62.1, fat_100g: 1.9, fiber_100g: 16.3 }},
    { code: 'lvsdb-124', product_name: 'Hårt bröd fullkorn råg m. sesamfrö vetekli vetegroddar fibrer 24%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 355.0, proteins_100g: 13.0, carbohydrates_100g: 45.3, fat_100g: 8.2, fiber_100g: 24.0 }},
    { code: 'lvsdb-125', product_name: 'Hårt bröd fullkorn råg fibrer 15,5% typ delikatess', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 351.0, proteins_100g: 10.0, carbohydrates_100g: 64.7, fat_100g: 2.0, fiber_100g: 15.5 }},
    { code: 'lvsdb-126', product_name: 'Hårt bröd fullkorn havre vete råg m. mjölk fibrer 8%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 379.0, proteins_100g: 13.0, carbohydrates_100g: 61.7, fat_100g: 6.8, fiber_100g: 8.0 }},
    { code: 'lvsdb-127', product_name: 'Hårt bröd vete m. vallmofrö fibrer 6% typ frukost', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 406.0, proteins_100g: 11.0, carbohydrates_100g: 67.7, fat_100g: 8.5, fiber_100g: 6.0 }},
    { code: 'lvsdb-128', product_name: 'Hårt bröd vete m. socker kanel fibrer ca 7%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 398.0, proteins_100g: 10.0, carbohydrates_100g: 67.7, fat_100g: 7.8, fiber_100g: 6.7 }},
    { code: 'lvsdb-129', product_name: 'Hårt bröd glutenfritt fibrer ca 3%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 385.0, proteins_100g: 10.0, carbohydrates_100g: 69.1, fat_100g: 6.5, fiber_100g: 3.0 }},
    { code: 'lvsdb-130', product_name: 'Hårt bröd fullkorn vete havre kli m. socker örtkryddor fibrer 10,5%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 390.0, proteins_100g: 12.0, carbohydrates_100g: 60.9, fat_100g: 8.4, fiber_100g: 10.5 }},
    { code: 'lvsdb-131', product_name: 'Bröd fullkorn korn fibrer 3%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 6.4, carbohydrates_100g: 40.1, fat_100g: 5.0, fiber_100g: 3.1 }},
    { code: 'lvsdb-132', product_name: 'Bröd vitt fullkorn graham typ scones', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 285.0, proteins_100g: 6.3, carbohydrates_100g: 38.1, fat_100g: 10.8, fiber_100g: 4.6 }},
    { code: 'lvsdb-133', product_name: 'Bröd fullkorn råg fibrer ca 10% typ pumpernickel', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 5.4, carbohydrates_100g: 40.8, fat_100g: 1.6, fiber_100g: 9.9 }},
    { code: 'lvsdb-134', product_name: 'Ströbröd malt hårt bröd fullkorn vete råg socker fibrer ca 5%', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 402.0, proteins_100g: 10.3, carbohydrates_100g: 65.6, fat_100g: 8.6, fiber_100g: 9.1 }},
    { code: 'lvsdb-135', product_name: 'Hårt bröd fullkorn råg fibrer ca 14% typ normalgräddat', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 349.0, proteins_100g: 9.1, carbohydrates_100g: 66.0, fat_100g: 2.0, fiber_100g: 13.9 }},
    { code: 'lvsdb-136', product_name: 'Hårt bröd fullkorn råg vete majs m. surdeg fibrer 15% typ spisbröd', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 335.0, proteins_100g: 8.3, carbohydrates_100g: 63.4, fat_100g: 1.8, fiber_100g: 14.9 }},
    { code: 'lvsdb-137', product_name: 'Bröd vitt vete vatten fibrer ca 3,5% typ pitabröd', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 8.6, carbohydrates_100g: 53.6, fat_100g: 1.6, fiber_100g: 3.4 }},
    { code: 'lvsdb-138', product_name: 'Korvbröd', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 285.0, proteins_100g: 8.1, carbohydrates_100g: 51.2, fat_100g: 4.1, fiber_100g: 4.2 }},
    { code: 'lvsdb-139', product_name: 'Hårt bröd fullkorn råg fibrer ca 14% typ brungräddat', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 9.1, carbohydrates_100g: 65.5, fat_100g: 2.6, fiber_100g: 14.4 }},
    { code: 'lvsdb-140', product_name: 'Bröd vitt osötat fibrer ca 2,5% typ italienskt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 256.0, proteins_100g: 8.6, carbohydrates_100g: 50.2, fat_100g: 1.4, fiber_100g: 2.4 }},
    { code: 'lvsdb-141', product_name: 'Bröd vitt vete fibrer ca 2,5% typ baguette', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 8.5, carbohydrates_100g: 53.2, fat_100g: 1.7, fiber_100g: 2.6 }},
    { code: 'lvsdb-142', product_name: 'Bröd vitt fullkorn surdeg fibrer 4,4% bakad i butik typ grov baguette', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 260.0, proteins_100g: 7.6, carbohydrates_100g: 51.7, fat_100g: 1.2, fiber_100g: 4.4 }},
    { code: 'lvsdb-143', product_name: 'Bröd vitt fibrer 3,5%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 284.0, proteins_100g: 8.0, carbohydrates_100g: 46.0, fat_100g: 6.4, fiber_100g: 4.3 }},
    { code: 'lvsdb-144', product_name: 'Bröd vitt mjölk fibrer ca 3% typ Hönökaka', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 293.0, proteins_100g: 7.4, carbohydrates_100g: 56.7, fat_100g: 3.1, fiber_100g: 3.0 }},
    { code: 'lvsdb-145', product_name: 'Bröd vitt vete typ scones', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 287.0, proteins_100g: 6.5, carbohydrates_100g: 38.1, fat_100g: 11.1, fiber_100g: 3.7 }},
    { code: 'lvsdb-146', product_name: 'Bröd vitt vete ojäst fibrer 3% typ chapati', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 257.0, proteins_100g: 5.6, carbohydrates_100g: 44.3, fat_100g: 5.3, fiber_100g: 3.9 }},
    { code: 'lvsdb-147', product_name: 'Bröd fullkorn rågsikt fibrer ca 7% typ kavring', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 5.5, carbohydrates_100g: 47.3, fat_100g: 4.7, fiber_100g: 7.0 }},
    { code: 'lvsdb-148', product_name: 'Bröd osötat rågsikt fibrer ca 3,5%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 261.0, proteins_100g: 8.4, carbohydrates_100g: 47.3, fat_100g: 3.2, fiber_100g: 3.4 }},
    { code: 'lvsdb-149', product_name: 'Bröd rågsikt fibrer ca 4%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 266.0, proteins_100g: 7.1, carbohydrates_100g: 51.4, fat_100g: 2.3, fiber_100g: 3.8 }},
    { code: 'lvsdb-150', product_name: 'Bröd fullkorn graham m. mjölk fibrer ca 5%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 279.0, proteins_100g: 8.9, carbohydrates_100g: 46.1, fat_100g: 5.2, fiber_100g: 4.9 }},
    { code: 'lvsdb-151', product_name: 'Bröd fullkorn råg typ rallarhalvor', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 246.0, proteins_100g: 5.9, carbohydrates_100g: 46.1, fat_100g: 2.1, fiber_100g: 8.5 }},
    { code: 'lvsdb-152', product_name: 'Bröd fullkorn råg osötat fibrer ca 5%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 7.1, carbohydrates_100g: 46.1, fat_100g: 1.6, fiber_100g: 5.0 }},
    { code: 'lvsdb-153', product_name: 'Hårt bröd tunnbröd fullkorn vete råg korn havre', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 10.1, carbohydrates_100g: 68.9, fat_100g: 2.5, fiber_100g: 5.1 }},
    { code: 'lvsdb-154', product_name: 'Bröd vitt mjukt m. mjölk fibrer ca 4% typ tunnbröd', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 8.0, carbohydrates_100g: 52.4, fat_100g: 3.1, fiber_100g: 3.8 }},
    { code: 'lvsdb-155', product_name: 'Bröd fullkorn råg m. potatis fibrer ca 5% ', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 258.0, proteins_100g: 5.7, carbohydrates_100g: 52.4, fat_100g: 1.4, fiber_100g: 5.0 }},
    { code: 'lvsdb-156', product_name: 'Bröd vitt vatten fibrer ca 3% typ ostfralla', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 11.5, carbohydrates_100g: 47.2, fat_100g: 3.4, fiber_100g: 3.1 }},
    { code: 'lvsdb-157', product_name: 'Riskaka fullkorn solrosfrön majs fett 4% ', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 394.0, proteins_100g: 7.9, carbohydrates_100g: 77.4, fat_100g: 4.4, fiber_100g: 4.8 }},
    { code: 'lvsdb-158', product_name: 'Riskaka fullkorn smaksatt fett 18% ', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 461.0, proteins_100g: 7.0, carbohydrates_100g: 65.8, fat_100g: 18.1, fiber_100g: 2.9 }},
    { code: 'lvsdb-159', product_name: 'Bröd vitt glutenfritt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 1.8, carbohydrates_100g: 47.3, fat_100g: 3.6, fiber_100g: 3.2 }},
    { code: 'lvsdb-160', product_name: 'Bröd mörkt glutenfritt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 269.0, proteins_100g: 2.6, carbohydrates_100g: 46.2, fat_100g: 6.8, fiber_100g: 5.5 }},
    { code: 'lvsdb-161', product_name: 'Bröd vitt typ croissant fransk giffel', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 363.0, proteins_100g: 5.1, carbohydrates_100g: 36.4, fat_100g: 21.6, fiber_100g: 1.5 }},
    { code: 'lvsdb-162', product_name: 'Potatis höst rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.8, carbohydrates_100g: 16.8, fat_100g: 0.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-163', product_name: 'Potatis höst kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 1.9, carbohydrates_100g: 17.8, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-164', product_name: 'Potatis m. skal bakad u. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 1.7, carbohydrates_100g: 19.4, fat_100g: 0.1, fiber_100g: 2.5 }},
    { code: 'lvsdb-165', product_name: 'Potatis m. skal bakad u. salt i aluminiumfolie ', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 89.0, proteins_100g: 1.5, carbohydrates_100g: 18.1, fat_100g: 0.6, fiber_100g: 2.0 }},
    { code: 'lvsdb-166', product_name: 'Potatis tärnad frysvara', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.7, carbohydrates_100g: 17.3, fat_100g: 0.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-167', product_name: 'Färskpotatis kokt u. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.4, carbohydrates_100g: 14.8, fat_100g: 0.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-168', product_name: 'Potatis konserv. u. lag', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 1.3, carbohydrates_100g: 12.2, fat_100g: 0.1, fiber_100g: 2.5 }},
    { code: 'lvsdb-169', product_name: 'Klyftpotatis u. skal ugnsstekt m. rapsolja', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 2.2, carbohydrates_100g: 23.1, fat_100g: 1.6, fiber_100g: 1.8 }},
    { code: 'lvsdb-170', product_name: 'Potatis råstekt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 2.2, carbohydrates_100g: 20.7, fat_100g: 4.7, fiber_100g: 2.7 }},
    { code: 'lvsdb-171', product_name: 'Potatis kokt stekt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 2.3, carbohydrates_100g: 21.8, fat_100g: 4.7, fiber_100g: 2.6 }},
    { code: 'lvsdb-172', product_name: 'Pommes frites friterad potatis värmd i ugn fett ca 7% frysvara', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 3.2, carbohydrates_100g: 32.0, fat_100g: 7.6, fiber_100g: 3.2 }},
    { code: 'lvsdb-173', product_name: 'Pommes frites friterad potatis fett ca 11% frysvara', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 243.0, proteins_100g: 3.0, carbohydrates_100g: 30.6, fat_100g: 11.4, fiber_100g: 3.0 }},
    { code: 'lvsdb-174', product_name: 'Pommes frites friterad potatis fett ca 17% tillagad på restaurang', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 3.7, carbohydrates_100g: 43.4, fat_100g: 17.5, fiber_100g: 3.2 }},
    { code: 'lvsdb-175', product_name: 'Kroppkakor el. potatispalt m. fläsk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 169.0, proteins_100g: 5.7, carbohydrates_100g: 22.8, fat_100g: 5.7, fiber_100g: 1.5 }},
    { code: 'lvsdb-176', product_name: 'Sjömansbiff hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 90.0, proteins_100g: 6.8, carbohydrates_100g: 9.2, fat_100g: 2.6, fiber_100g: 0.9 }},
    { code: 'lvsdb-177', product_name: 'Lapskojs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 4.9, carbohydrates_100g: 12.5, fat_100g: 4.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-178', product_name: 'Pitepalt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 180.0, proteins_100g: 4.8, carbohydrates_100g: 25.1, fat_100g: 6.0, fiber_100g: 2.6 }},
    { code: 'lvsdb-179', product_name: 'Bakad potatis m. kycklingcurryröra sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 3.3, carbohydrates_100g: 7.1, fat_100g: 12.2, fiber_100g: 3.0 }},
    { code: 'lvsdb-180', product_name: 'Pytt i panna tillagad frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 4.5, carbohydrates_100g: 23.3, fat_100g: 8.8, fiber_100g: 2.9 }},
    { code: 'lvsdb-181', product_name: 'Sjömansbiff frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 6.7, carbohydrates_100g: 8.6, fat_100g: 2.3, fiber_100g: 0.9 }},
    { code: 'lvsdb-182', product_name: 'Janssons frestelse', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 161.0, proteins_100g: 3.6, carbohydrates_100g: 14.2, fat_100g: 9.6, fiber_100g: 1.7 }},
    { code: 'lvsdb-183', product_name: 'Laxpudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 8.2, carbohydrates_100g: 9.5, fat_100g: 4.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-184', product_name: 'Sillpudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 7.6, carbohydrates_100g: 9.1, fat_100g: 6.2, fiber_100g: 1.1 }},
    { code: 'lvsdb-185', product_name: 'Bakad potatis m. skagenröra sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 159.0, proteins_100g: 3.1, carbohydrates_100g: 11.2, fat_100g: 10.8, fiber_100g: 2.7 }},
    { code: 'lvsdb-186', product_name: 'Potatissallad m. gräddfil majonnäs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 1.9, carbohydrates_100g: 14.1, fat_100g: 9.7, fiber_100g: 1.7 }},
    { code: 'lvsdb-187', product_name: 'Potatissoppa m. purjolök', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 1.0, carbohydrates_100g: 6.6, fat_100g: 1.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-188', product_name: 'Pytt i panna m. rotfrukt svamp veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 1.8, carbohydrates_100g: 10.0, fat_100g: 3.1, fiber_100g: 3.2 }},
    { code: 'lvsdb-189', product_name: 'Potatissallad m. vinägrettsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 1.8, carbohydrates_100g: 14.5, fat_100g: 4.8, fiber_100g: 2.0 }},
    { code: 'lvsdb-190', product_name: 'Potatispalt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 4.8, carbohydrates_100g: 23.8, fat_100g: 1.7, fiber_100g: 5.0 }},
    { code: 'lvsdb-191', product_name: 'Potatis råstuvad hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 2.2, carbohydrates_100g: 14.0, fat_100g: 1.2, fiber_100g: 0.8 }},
    { code: 'lvsdb-192', product_name: 'Potatisgratäng m. mjölk kaffegrädde ost hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 5.7, carbohydrates_100g: 15.0, fat_100g: 5.9, fiber_100g: 1.4 }},
    { code: 'lvsdb-193', product_name: 'Raggmunk potatisplätt potatispannkaka hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 149.0, proteins_100g: 4.2, carbohydrates_100g: 20.0, fat_100g: 5.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-194', product_name: 'Potatis stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 2.8, carbohydrates_100g: 14.4, fat_100g: 2.5, fiber_100g: 1.4 }},
    { code: 'lvsdb-195', product_name: 'Potatisbullar stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 4.0, carbohydrates_100g: 22.1, fat_100g: 6.3, fiber_100g: 2.7 }},
    { code: 'lvsdb-196', product_name: 'Potatismos hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 87.0, proteins_100g: 2.3, carbohydrates_100g: 14.1, fat_100g: 2.0, fiber_100g: 1.4 }},
    { code: 'lvsdb-197', product_name: 'Potatisgratäng m. mjölk ost hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 5.0, carbohydrates_100g: 13.5, fat_100g: 3.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-198', product_name: 'Potatisgratäng m. vispgrädde ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 4.5, carbohydrates_100g: 12.9, fat_100g: 15.9, fiber_100g: 1.7 }},
    { code: 'lvsdb-199', product_name: 'Potatismos m. lättmjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 2.3, carbohydrates_100g: 14.1, fat_100g: 1.9, fiber_100g: 1.4 }},
    { code: 'lvsdb-200', product_name: 'Potatisgratäng m. lättmjölk ost mager hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 5.4, carbohydrates_100g: 13.5, fat_100g: 1.9, fiber_100g: 1.7 }},
    { code: 'lvsdb-201', product_name: 'Bakad potatis m. färskoströra paprika veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 4.0, carbohydrates_100g: 15.8, fat_100g: 0.9, fiber_100g: 2.4 }},
    { code: 'lvsdb-202', product_name: 'Schweizisk potatiskaka rösti värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 2.4, carbohydrates_100g: 23.4, fat_100g: 11.4, fiber_100g: 4.2 }},
    { code: 'lvsdb-203', product_name: 'Potatiskrokett värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 177.0, proteins_100g: 2.8, carbohydrates_100g: 23.9, fat_100g: 7.0, fiber_100g: 3.6 }},
    { code: 'lvsdb-204', product_name: 'Potatisgratäng m. grädde ost värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 158.0, proteins_100g: 4.6, carbohydrates_100g: 13.2, fat_100g: 9.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-205', product_name: 'Grönsaksblandning m. morot palsternacka purjolök rotselleri frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 1.2, carbohydrates_100g: 5.3, fat_100g: 0.5, fiber_100g: 2.5 }},
    { code: 'lvsdb-206', product_name: 'Jordärtskocka', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 67.0, proteins_100g: 1.9, carbohydrates_100g: 12.8, fat_100g: 0.4, fiber_100g: 1.9 }},
    { code: 'lvsdb-207', product_name: 'Kålrot', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 1.4, carbohydrates_100g: 6.1, fat_100g: 0.1, fiber_100g: 3.0 }},
    { code: 'lvsdb-208', product_name: 'Morot', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 0.7, carbohydrates_100g: 6.6, fat_100g: 0.2, fiber_100g: 2.4 }},
    { code: 'lvsdb-209', product_name: 'Palsternacka', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.7, carbohydrates_100g: 12.6, fat_100g: 0.6, fiber_100g: 3.8 }},
    { code: 'lvsdb-210', product_name: 'Pepparrot', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 3.1, carbohydrates_100g: 9.5, fat_100g: 0.3, fiber_100g: 8.2 }},
    { code: 'lvsdb-211', product_name: 'Rotselleri', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 1.0, carbohydrates_100g: 4.4, fat_100g: 0.5, fiber_100g: 3.1 }},
    { code: 'lvsdb-212', product_name: 'Rädisa', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 11.0, proteins_100g: 0.7, carbohydrates_100g: 0.7, fat_100g: 0.4, fiber_100g: 1.1 }},
    { code: 'lvsdb-213', product_name: 'Rödbeta', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.2, carbohydrates_100g: 9.8, fat_100g: 0.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-214', product_name: 'Rättika', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 1.0, carbohydrates_100g: 2.5, fat_100g: 0.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-215', product_name: 'Rotpersilja', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 2.3, carbohydrates_100g: 10.7, fat_100g: 0.6, fiber_100g: 1.6 }},
    { code: 'lvsdb-216', product_name: 'Majrova', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 1.1, carbohydrates_100g: 6.0, fat_100g: 0.3, fiber_100g: 1.9 }},
    { code: 'lvsdb-217', product_name: 'Svartrot', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 1.4, carbohydrates_100g: 14.2, fat_100g: 0.4, fiber_100g: 4.0 }},
    { code: 'lvsdb-218', product_name: 'Morot konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 23.0, proteins_100g: 0.6, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-219', product_name: 'Morot konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 23.0, proteins_100g: 0.6, carbohydrates_100g: 4.0, fat_100g: 0.2, fiber_100g: 1.5 }},
    { code: 'lvsdb-220', product_name: 'Morotsjuice', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 0.7, carbohydrates_100g: 6.3, fat_100g: 0.4, fiber_100g: 1.0 }},
    { code: 'lvsdb-221', product_name: 'Rotmos hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 1.0, carbohydrates_100g: 8.2, fat_100g: 1.3, fiber_100g: 2.1 }},
    { code: 'lvsdb-222', product_name: 'Jordärtskockssoppa veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 76.0, proteins_100g: 1.0, carbohydrates_100g: 4.7, fat_100g: 5.5, fiber_100g: 0.7 }},
    { code: 'lvsdb-223', product_name: 'Morot kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 0.7, carbohydrates_100g: 6.6, fat_100g: 0.2, fiber_100g: 2.4 }},
    { code: 'lvsdb-224', product_name: 'Morot stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 1.9, carbohydrates_100g: 7.1, fat_100g: 4.9, fiber_100g: 1.6 }},
    { code: 'lvsdb-225', product_name: 'Morotssoppa veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 0.7, carbohydrates_100g: 4.1, fat_100g: 1.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-226', product_name: 'Ärtsoppa m. morot veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 4.3, carbohydrates_100g: 10.8, fat_100g: 0.3, fiber_100g: 2.4 }},
    { code: 'lvsdb-227', product_name: 'Jordärtskocka kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 67.0, proteins_100g: 1.9, carbohydrates_100g: 12.7, fat_100g: 0.4, fiber_100g: 1.9 }},
    { code: 'lvsdb-228', product_name: 'Rotfrukter stekta glacerade m. honung', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 94.0, proteins_100g: 1.3, carbohydrates_100g: 10.4, fat_100g: 4.7, fiber_100g: 2.8 }},
    { code: 'lvsdb-229', product_name: 'Grönsaksbiff rotfruktsbiff stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 6.1, carbohydrates_100g: 5.1, fat_100g: 7.5, fiber_100g: 2.0 }},
    { code: 'lvsdb-230', product_name: 'Rödbeta kokt u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.2, carbohydrates_100g: 9.8, fat_100g: 0.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-231', product_name: 'Borsjtj rödbetssoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.7, carbohydrates_100g: 4.0, fat_100g: 1.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-232', product_name: 'Rödbeta inlagd u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 1.3, carbohydrates_100g: 12.0, fat_100g: 0.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-233', product_name: 'Avokado', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 197.0, proteins_100g: 1.9, carbohydrates_100g: 1.7, fat_100g: 19.6, fiber_100g: 4.8 }},
    { code: 'lvsdb-234', product_name: 'Stjälkselleri', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 1.0, carbohydrates_100g: 2.3, fat_100g: 0.2, fiber_100g: 2.1 }},
    { code: 'lvsdb-235', product_name: 'Blomkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 1.9, carbohydrates_100g: 2.6, fat_100g: 0.2, fiber_100g: 2.3 }},
    { code: 'lvsdb-236', product_name: 'Blomkål frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 2.0, carbohydrates_100g: 2.3, fat_100g: 0.3, fiber_100g: 1.9 }},
    { code: 'lvsdb-237', product_name: 'Bondbönor färska kokta u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 9.0, carbohydrates_100g: 9.7, fat_100g: 1.0, fiber_100g: 9.0 }},
    { code: 'lvsdb-238', product_name: 'Broccoli', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 4.3, carbohydrates_100g: 2.3, fat_100g: 0.6, fiber_100g: 4.0 }},
    { code: 'lvsdb-239', product_name: 'Broccoli frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 2.4, carbohydrates_100g: 1.8, fat_100g: 0.3, fiber_100g: 2.3 }},
    { code: 'lvsdb-240', product_name: 'Brysselkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 44.0, proteins_100g: 3.4, carbohydrates_100g: 4.7, fat_100g: 0.3, fiber_100g: 4.2 }},
    { code: 'lvsdb-241', product_name: 'Brysselkål frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 41.0, proteins_100g: 3.8, carbohydrates_100g: 3.4, fat_100g: 0.4, fiber_100g: 4.5 }},
    { code: 'lvsdb-242', product_name: 'Mungbönsgroddar', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 3.0, carbohydrates_100g: 3.2, fat_100g: 0.4, fiber_100g: 3.0 }},
    { code: 'lvsdb-243', product_name: 'Sojabönsgroddar', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 13.1, carbohydrates_100g: 7.0, fat_100g: 6.7, fiber_100g: 2.6 }},
    { code: 'lvsdb-244', product_name: 'Gröna bönor', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 27.0, proteins_100g: 2.1, carbohydrates_100g: 2.1, fat_100g: 0.4, fiber_100g: 3.4 }},
    { code: 'lvsdb-245', product_name: 'Gröna bönor frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 2.2, carbohydrates_100g: 4.5, fat_100g: 0.2, fiber_100g: 2.9 }},
    { code: 'lvsdb-246', product_name: 'Champinjon', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 27.0, proteins_100g: 2.4, carbohydrates_100g: 2.7, fat_100g: 0.2, fiber_100g: 2.4 }},
    { code: 'lvsdb-247', product_name: 'Friséesallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 1.8, carbohydrates_100g: 1.0, fat_100g: 0.2, fiber_100g: 2.0 }},
    { code: 'lvsdb-248', product_name: 'Endivesallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 14.0, proteins_100g: 1.0, carbohydrates_100g: 1.1, fat_100g: 0.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-249', product_name: 'Fänkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 2.8, carbohydrates_100g: 1.8, fat_100g: 0.4, fiber_100g: 3.3 }},
    { code: 'lvsdb-250', product_name: 'Grönkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 3.4, carbohydrates_100g: 3.2, fat_100g: 0.7, fiber_100g: 3.7 }},
    { code: 'lvsdb-251', product_name: 'Grönkål frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 2.7, carbohydrates_100g: 2.3, fat_100g: 0.5, fiber_100g: 2.6 }},
    { code: 'lvsdb-252', product_name: 'Gurka', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 13.0, proteins_100g: 0.8, carbohydrates_100g: 2.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-253', product_name: 'Isbergssallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 14.0, proteins_100g: 0.8, carbohydrates_100g: 2.5, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-254', product_name: 'Kronärtskocka', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 2.7, carbohydrates_100g: 7.3, fat_100g: 0.2, fiber_100g: 5.0 }},
    { code: 'lvsdb-255', product_name: 'Kålrabbi', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 1.7, carbohydrates_100g: 4.4, fat_100g: 0.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-256', product_name: 'Lök gul', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 1.2, carbohydrates_100g: 7.3, fat_100g: 0.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-257', product_name: 'Majskolv', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 3.9, carbohydrates_100g: 22.1, fat_100g: 1.6, fiber_100g: 2.9 }},
    { code: 'lvsdb-258', product_name: 'Majskolv frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 3.3, carbohydrates_100g: 21.5, fat_100g: 0.8, fiber_100g: 1.8 }},
    { code: 'lvsdb-259', product_name: 'Majskorn frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 99.0, proteins_100g: 3.0, carbohydrates_100g: 15.6, fat_100g: 1.5, fiber_100g: 5.2 }},
    { code: 'lvsdb-260', product_name: 'Mangold', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 21.0, proteins_100g: 1.8, carbohydrates_100g: 2.6, fat_100g: 0.2, fiber_100g: 0.8 }},
    { code: 'lvsdb-261', product_name: 'Nässlor förvällda', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 4.1, carbohydrates_100g: 0.6, fat_100g: 0.7, fiber_100g: 2.7 }},
    { code: 'lvsdb-262', product_name: 'Paprika grön', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 0.5, carbohydrates_100g: 3.0, fat_100g: 0.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-263', product_name: 'Paprika röd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 22.0, proteins_100g: 0.5, carbohydrates_100g: 4.1, fat_100g: 0.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-264', product_name: 'Persilja blad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 5.6, carbohydrates_100g: 9.4, fat_100g: 1.1, fiber_100g: 3.9 }},
    { code: 'lvsdb-265', product_name: 'Pumpa', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 26.0, proteins_100g: 1.0, carbohydrates_100g: 4.4, fat_100g: 0.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-266', product_name: 'Purjolök', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 1.6, carbohydrates_100g: 4.1, fat_100g: 0.2, fiber_100g: 2.7 }},
    { code: 'lvsdb-267', product_name: 'Rödkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 31.0, proteins_100g: 1.1, carbohydrates_100g: 4.7, fat_100g: 0.3, fiber_100g: 2.6 }},
    { code: 'lvsdb-268', product_name: 'Savojkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 2.0, carbohydrates_100g: 3.6, fat_100g: 0.1, fiber_100g: 2.5 }},
    { code: 'lvsdb-269', product_name: 'Salladskål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 21.0, proteins_100g: 1.3, carbohydrates_100g: 2.7, fat_100g: 0.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-270', product_name: 'Sockerärtor', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 3.4, carbohydrates_100g: 4.3, fat_100g: 0.2, fiber_100g: 2.2 }},
    { code: 'lvsdb-271', product_name: 'Spenat frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 20.0, proteins_100g: 2.2, carbohydrates_100g: 0.5, fat_100g: 0.6, fiber_100g: 2.0 }},
    { code: 'lvsdb-272', product_name: 'Squash', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 14.0, proteins_100g: 0.0, carbohydrates_100g: 2.5, fat_100g: 0.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-273', product_name: 'Tomat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 0.8, carbohydrates_100g: 2.6, fat_100g: 0.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-274', product_name: 'Tomat torkad m. olja', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 190.0, proteins_100g: 5.0, carbohydrates_100g: 8.7, fat_100g: 12.5, fiber_100g: 12.7 }},
    { code: 'lvsdb-275', product_name: 'Trädgårdskrasse', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 2.6, carbohydrates_100g: 4.3, fat_100g: 0.7, fiber_100g: 1.6 }},
    { code: 'lvsdb-276', product_name: 'Vattenkrasse', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 1.9, carbohydrates_100g: 0.5, fat_100g: 0.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-277', product_name: 'Vaxbönor', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 1.8, carbohydrates_100g: 4.7, fat_100g: 0.1, fiber_100g: 2.7 }},
    { code: 'lvsdb-278', product_name: 'Vaxbönor frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 1.8, carbohydrates_100g: 3.8, fat_100g: 0.1, fiber_100g: 2.7 }},
    { code: 'lvsdb-279', product_name: 'Vitkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 1.1, carbohydrates_100g: 4.7, fat_100g: 0.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-280', product_name: 'Vitlök', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 6.8, carbohydrates_100g: 21.9, fat_100g: 0.2, fiber_100g: 5.3 }},
    { code: 'lvsdb-281', product_name: 'Aubergine', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 1.1, carbohydrates_100g: 2.2, fat_100g: 0.1, fiber_100g: 2.4 }},
    { code: 'lvsdb-282', product_name: 'Gröna ärtor frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 5.2, carbohydrates_100g: 8.9, fat_100g: 0.4, fiber_100g: 4.4 }},
    { code: 'lvsdb-283', product_name: 'Alfalfagroddar', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 4.0, carbohydrates_100g: 0.9, fat_100g: 0.7, fiber_100g: 3.0 }},
    { code: 'lvsdb-284', product_name: 'Dill färsk', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 3.7, carbohydrates_100g: 7.4, fat_100g: 0.8, fiber_100g: 2.8 }},
    { code: 'lvsdb-285', product_name: 'Gräslök', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 2.8, carbohydrates_100g: 1.7, fat_100g: 0.6, fiber_100g: 2.1 }},
    { code: 'lvsdb-286', product_name: 'Basilika färsk', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 2.5, carbohydrates_100g: 0.4, fat_100g: 0.6, fiber_100g: 3.9 }},
    { code: 'lvsdb-287', product_name: 'Chilipeppar färsk', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 2.4, carbohydrates_100g: 5.9, fat_100g: 0.7, fiber_100g: 4.8 }},
    { code: 'lvsdb-288', product_name: 'Paprika gul', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 0.5, carbohydrates_100g: 4.3, fat_100g: 0.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-289', product_name: 'Paprika grön röd frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 26.0, proteins_100g: 1.0, carbohydrates_100g: 3.0, fat_100g: 0.4, fiber_100g: 3.0 }},
    { code: 'lvsdb-290', product_name: 'Champinjon skivad frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 2.0, carbohydrates_100g: 0.8, fat_100g: 0.4, fiber_100g: 2.0 }},
    { code: 'lvsdb-291', product_name: 'Linsgroddar', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 9.0, carbohydrates_100g: 19.1, fat_100g: 0.6, fiber_100g: 3.0 }},
    { code: 'lvsdb-292', product_name: 'Lök gul frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 1.5, carbohydrates_100g: 4.1, fat_100g: 0.0, fiber_100g: 3.0 }},
    { code: 'lvsdb-293', product_name: 'Grönsaksblandning m. ärtor bönor majs morot typ amerikansk frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 3.3, carbohydrates_100g: 11.1, fat_100g: 0.5, fiber_100g: 2.5 }},
    { code: 'lvsdb-294', product_name: 'Grönsaksblandning m. ärtor bönor morot blomkål typ sommargrönsaker frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 2.4, carbohydrates_100g: 4.5, fat_100g: 0.5, fiber_100g: 3.0 }},
    { code: 'lvsdb-295', product_name: 'Grönsaksblandning m. ärtor morot frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.7, carbohydrates_100g: 9.0, fat_100g: 0.5, fiber_100g: 2.2 }},
    { code: 'lvsdb-296', product_name: 'Grönsaksblandning m. ärtor majs paprika frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 66.0, proteins_100g: 4.2, carbohydrates_100g: 8.7, fat_100g: 0.5, fiber_100g: 5.0 }},
    { code: 'lvsdb-297', product_name: 'Sallad m. grönsallat gurka tomat u. dressing', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 0.9, carbohydrates_100g: 2.4, fat_100g: 0.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-298', product_name: 'Paprika grön gul röd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 22.0, proteins_100g: 0.5, carbohydrates_100g: 4.0, fat_100g: 0.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-299', product_name: 'Bambuskott konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 2.7, carbohydrates_100g: 1.7, fat_100g: 0.2, fiber_100g: 2.3 }},
    { code: 'lvsdb-300', product_name: 'Gröna bönor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 21.0, proteins_100g: 1.2, carbohydrates_100g: 3.0, fat_100g: 0.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-301', product_name: 'Champinjon konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 1.9, carbohydrates_100g: 0.9, fat_100g: 0.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-302', product_name: 'Majskorn konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 2.1, carbohydrates_100g: 12.9, fat_100g: 1.5, fiber_100g: 2.9 }},
    { code: 'lvsdb-303', product_name: 'Oliver gröna m. paprikafyllning avrunna', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 0.6, carbohydrates_100g: 1.1, fat_100g: 13.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-304', product_name: 'Oliver svarta m. olja avrunna', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 0.8, carbohydrates_100g: 1.8, fat_100g: 14.1, fiber_100g: 3.5 }},
    { code: 'lvsdb-305', product_name: 'Grönsaksblandning el. pickels sockrad inlagd u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 1.5, carbohydrates_100g: 26.1, fat_100g: 0.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-306', product_name: 'Sparris vit konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 0.9, carbohydrates_100g: 0.5, fat_100g: 0.7, fiber_100g: 1.9 }},
    { code: 'lvsdb-307', product_name: 'Sparrissoppa tillagad redd konserv. veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 0.9, carbohydrates_100g: 3.7, fat_100g: 1.7, fiber_100g: 0.5 }},
    { code: 'lvsdb-308', product_name: 'Surkål konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 0.9, carbohydrates_100g: 2.0, fat_100g: 0.2, fiber_100g: 1.7 }},
    { code: 'lvsdb-309', product_name: 'Tomat hel konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 1.1, carbohydrates_100g: 4.4, fat_100g: 0.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-310', product_name: 'Tomatjuice konserv. drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 0.8, carbohydrates_100g: 2.7, fat_100g: 0.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-311', product_name: 'Tomatpuré konc. konserv.', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 4.4, carbohydrates_100g: 13.5, fat_100g: 0.2, fiber_100g: 4.7 }},
    { code: 'lvsdb-312', product_name: 'Vaxbönor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 1.4, carbohydrates_100g: 2.5, fat_100g: 0.3, fiber_100g: 2.7 }},
    { code: 'lvsdb-313', product_name: 'Gröna ärtor konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 3.5, carbohydrates_100g: 10.5, fat_100g: 0.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-314', product_name: 'Gröna ärtor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 4.4, carbohydrates_100g: 7.3, fat_100g: 0.4, fiber_100g: 4.9 }},
    { code: 'lvsdb-315', product_name: 'Mungbönsgroddar konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 1.4, carbohydrates_100g: 0.8, fat_100g: 0.1, fiber_100g: 3.0 }},
    { code: 'lvsdb-316', product_name: 'Sojabönsgroddar konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 1.6, carbohydrates_100g: 0.6, fat_100g: 0.2, fiber_100g: 3.0 }},
    { code: 'lvsdb-317', product_name: 'Paprikasallad inlagd u. lag', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 31.0, proteins_100g: 1.0, carbohydrates_100g: 4.3, fat_100g: 0.4, fiber_100g: 3.0 }},
    { code: 'lvsdb-318', product_name: 'Ajvar relish', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 1.2, carbohydrates_100g: 6.9, fat_100g: 3.5, fiber_100g: 3.2 }},
    { code: 'lvsdb-319', product_name: 'Svamp konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 23.0, proteins_100g: 2.5, carbohydrates_100g: 0.9, fat_100g: 0.5, fiber_100g: 2.3 }},
    { code: 'lvsdb-320', product_name: 'Kantarell konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 1.4, carbohydrates_100g: 4.8, fat_100g: 0.7, fiber_100g: 2.3 }},
    { code: 'lvsdb-321', product_name: 'Syltlök inlagd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 0.9, carbohydrates_100g: 18.7, fat_100g: 0.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-322', product_name: 'Tomater gröna syltade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 1.2, carbohydrates_100g: 18.6, fat_100g: 0.2, fiber_100g: 2.0 }},
    { code: 'lvsdb-323', product_name: 'Tomat krossad konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 22.0, proteins_100g: 0.8, carbohydrates_100g: 3.7, fat_100g: 0.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-324', product_name: 'Fefferoni konserv. inlagd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 0.7, carbohydrates_100g: 1.7, fat_100g: 0.1, fiber_100g: 4.5 }},
    { code: 'lvsdb-325', product_name: 'Wokgrönsaker Asiatiska wokade m. rapsolja', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 1.4, carbohydrates_100g: 5.7, fat_100g: 1.3, fiber_100g: 4.3 }},
    { code: 'lvsdb-326', product_name: 'Wokgrönsaker Classic wokade m. rapsolja', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 1.8, carbohydrates_100g: 4.9, fat_100g: 1.6, fiber_100g: 3.1 }},
    { code: 'lvsdb-327', product_name: 'Grönsaksblandning ärtor morot konserv. m. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 41.0, proteins_100g: 2.2, carbohydrates_100g: 6.1, fat_100g: 0.3, fiber_100g: 2.5 }},
    { code: 'lvsdb-328', product_name: 'Grönsaksjuice konserv. el. pastöriserad drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 0.6, carbohydrates_100g: 3.7, fat_100g: 0.1, fiber_100g: 0.4 }},
    { code: 'lvsdb-329', product_name: 'Champinjon konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 2.4, carbohydrates_100g: 0.3, fat_100g: 0.3, fiber_100g: 2.5 }},
    { code: 'lvsdb-330', product_name: 'Pumpasallad m. paprika inlagd sockrad u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 0.9, carbohydrates_100g: 13.5, fat_100g: 0.2, fiber_100g: 2.0 }},
    { code: 'lvsdb-331', product_name: 'Grönsakssoppa klar veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 23.0, proteins_100g: 0.9, carbohydrates_100g: 3.9, fat_100g: 0.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-332', product_name: 'Spenatsoppa veg. hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 1.9, carbohydrates_100g: 2.2, fat_100g: 2.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-333', product_name: 'Vitkål stuvad hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 2.3, carbohydrates_100g: 6.8, fat_100g: 3.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-334', product_name: 'Blomkål gratinerad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 92.0, proteins_100g: 5.1, carbohydrates_100g: 6.2, fat_100g: 4.9, fiber_100g: 1.6 }},
    { code: 'lvsdb-335', product_name: 'Blomkål kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 1.9, carbohydrates_100g: 2.6, fat_100g: 0.2, fiber_100g: 2.3 }},
    { code: 'lvsdb-336', product_name: 'Blomkål stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 2.9, carbohydrates_100g: 5.4, fat_100g: 2.7, fiber_100g: 1.5 }},
    { code: 'lvsdb-337', product_name: 'Gröna bönor stuvade', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 2.4, carbohydrates_100g: 5.8, fat_100g: 2.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-338', product_name: 'Grönkålssoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 1.2, carbohydrates_100g: 2.1, fat_100g: 1.9, fiber_100g: 0.9 }},
    { code: 'lvsdb-339', product_name: 'Grönsakssoppa redd ängamat veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 2.0, carbohydrates_100g: 2.9, fat_100g: 3.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-340', product_name: 'Grönsaksbiff stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 4.7, carbohydrates_100g: 10.3, fat_100g: 5.4, fiber_100g: 4.0 }},
    { code: 'lvsdb-341', product_name: 'Grönsallat m. vinägrettsås', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 1.0, carbohydrates_100g: 2.5, fat_100g: 12.9, fiber_100g: 0.8 }},
    { code: 'lvsdb-342', product_name: 'Sallad m. grönsallat gurka tomat vinägrettsås', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 0.8, carbohydrates_100g: 2.5, fat_100g: 11.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-343', product_name: 'Grönsallat m. gräddfilsås', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 1.6, carbohydrates_100g: 4.1, fat_100g: 17.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-344', product_name: 'Sallad m. grönsallat gurka tomat gräddfilsås', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 158.0, proteins_100g: 1.5, carbohydrates_100g: 3.9, fat_100g: 15.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-345', product_name: 'Sallad m. grönsallat gurka tomat paprika u. dressing', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 0.8, carbohydrates_100g: 2.6, fat_100g: 0.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-346', product_name: 'Gurka inlagd m. lag hemlagad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 42.0, proteins_100g: 0.7, carbohydrates_100g: 9.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-347', product_name: 'Lök stekt m. olja el. flytande margarin salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 53.0, proteins_100g: 1.4, carbohydrates_100g: 8.2, fat_100g: 1.2, fiber_100g: 2.1 }},
    { code: 'lvsdb-348', product_name: 'Löksås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 1.1, carbohydrates_100g: 10.7, fat_100g: 7.4, fiber_100g: 0.7 }},
    { code: 'lvsdb-349', product_name: 'Lök gul kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 1.2, carbohydrates_100g: 7.3, fat_100g: 0.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-350', product_name: 'Nässelsoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 1.3, carbohydrates_100g: 1.7, fat_100g: 2.7, fiber_100g: 0.7 }},
    { code: 'lvsdb-351', product_name: 'Paprika förvälld', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 0.6, carbohydrates_100g: 5.0, fat_100g: 0.2, fiber_100g: 1.7 }},
    { code: 'lvsdb-352', product_name: 'Purjolök kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 1.6, carbohydrates_100g: 4.1, fat_100g: 0.1, fiber_100g: 2.7 }},
    { code: 'lvsdb-353', product_name: 'Rödkål tillagad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 0.8, carbohydrates_100g: 8.3, fat_100g: 2.2, fiber_100g: 2.4 }},
    { code: 'lvsdb-354', product_name: 'Sparris stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 2.9, carbohydrates_100g: 5.0, fat_100g: 2.7, fiber_100g: 1.7 }},
    { code: 'lvsdb-355', product_name: 'Spenat fräst m. olja el. flytande margarin salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 2.8, carbohydrates_100g: 0.6, fat_100g: 1.0, fiber_100g: 2.5 }},
    { code: 'lvsdb-356', product_name: 'Spenat stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 2.5, carbohydrates_100g: 2.2, fat_100g: 3.6, fiber_100g: 1.7 }},
    { code: 'lvsdb-357', product_name: 'Champinjon stekt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 45.0, proteins_100g: 3.0, carbohydrates_100g: 3.4, fat_100g: 1.5, fiber_100g: 3.0 }},
    { code: 'lvsdb-358', product_name: 'Champinjon stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 3.4, carbohydrates_100g: 5.8, fat_100g: 14.3, fiber_100g: 1.1 }},
    { code: 'lvsdb-359', product_name: 'Champinjonsås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 2.1, carbohydrates_100g: 4.7, fat_100g: 11.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-360', product_name: 'Tomatsallad m. vinägrett', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 0.8, carbohydrates_100g: 2.7, fat_100g: 4.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-361', product_name: 'Tomatsås italiensk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 1.1, carbohydrates_100g: 4.9, fat_100g: 7.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-362', product_name: 'Tomatsalsa kall', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 1.2, carbohydrates_100g: 3.8, fat_100g: 0.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-363', product_name: 'Vitkålssoppa tillagad veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 0.8, carbohydrates_100g: 2.6, fat_100g: 1.8, fiber_100g: 1.2 }},
    { code: 'lvsdb-364', product_name: 'Vitkål kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 1.1, carbohydrates_100g: 4.7, fat_100g: 0.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-365', product_name: 'Brunkål', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 1.3, carbohydrates_100g: 7.0, fat_100g: 1.0, fiber_100g: 2.4 }},
    { code: 'lvsdb-366', product_name: 'Vitkålssallad pizzasallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 0.9, carbohydrates_100g: 4.1, fat_100g: 7.2, fiber_100g: 2.0 }},
    { code: 'lvsdb-367', product_name: 'Vitkålssallad m. lingonsylt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 0.9, carbohydrates_100g: 12.8, fat_100g: 0.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-368', product_name: 'Aubergine kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 1.4, carbohydrates_100g: 2.8, fat_100g: 0.1, fiber_100g: 3.0 }},
    { code: 'lvsdb-369', product_name: 'Aubergine stekt m. olja el. flytande margarin salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 74.0, proteins_100g: 1.3, carbohydrates_100g: 2.6, fat_100g: 6.0, fiber_100g: 2.8 }},
    { code: 'lvsdb-370', product_name: 'Ärtor morot kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 2.9, carbohydrates_100g: 7.7, fat_100g: 0.3, fiber_100g: 3.4 }},
    { code: 'lvsdb-371', product_name: 'Ärtor morot stuvade', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 67.0, proteins_100g: 2.9, carbohydrates_100g: 7.8, fat_100g: 2.2, fiber_100g: 2.2 }},
    { code: 'lvsdb-372', product_name: 'Ärtpurésoppa gröna ärtor tillagad veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 1.4, carbohydrates_100g: 3.1, fat_100g: 2.9, fiber_100g: 1.2 }},
    { code: 'lvsdb-373', product_name: 'Gryta kikärtsgryta grönsaksgryta veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 2.4, carbohydrates_100g: 6.6, fat_100g: 1.9, fiber_100g: 3.8 }},
    { code: 'lvsdb-374', product_name: 'Gratäng m. grönsaker rotfrukter veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 3.7, carbohydrates_100g: 8.8, fat_100g: 4.4, fiber_100g: 1.9 }},
    { code: 'lvsdb-375', product_name: 'Grönsakssoppa m. pasta tillagad pulver', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.9, carbohydrates_100g: 4.2, fat_100g: 0.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-376', product_name: 'Löksoppa fransk tillagad pulver m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 0.4, carbohydrates_100g: 5.2, fat_100g: 0.2, fiber_100g: 0.2 }},
    { code: 'lvsdb-377', product_name: 'Grönsakssoppa tillagad klar konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 0.6, carbohydrates_100g: 2.3, fat_100g: 0.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-378', product_name: 'Grönsakssoppa tillagad redd pulver m. vatten mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 1.7, carbohydrates_100g: 5.1, fat_100g: 2.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-379', product_name: 'Grönsakssoppa tillagad redd pulver', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 45.0, proteins_100g: 0.5, carbohydrates_100g: 5.3, fat_100g: 2.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-380', product_name: 'Gurka inlagd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 0.7, carbohydrates_100g: 11.4, fat_100g: 0.7, fiber_100g: 1.8 }},
    { code: 'lvsdb-381', product_name: 'Bostongurka', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 1.0, carbohydrates_100g: 16.6, fat_100g: 0.4, fiber_100g: 1.8 }},
    { code: 'lvsdb-382', product_name: 'Gurka fermenterad u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 9.0, proteins_100g: 1.0, carbohydrates_100g: 1.0, fat_100g: 0.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-383', product_name: 'Saltgurka u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 0.9, carbohydrates_100g: 1.4, fat_100g: 0.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-384', product_name: 'Ättiksgurka u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.9, carbohydrates_100g: 8.2, fat_100g: 0.3, fiber_100g: 1.8 }},
    { code: 'lvsdb-385', product_name: 'Kronärtskocka kokt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 2.8, carbohydrates_100g: 9.4, fat_100g: 0.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-386', product_name: 'Champinjonsoppa tillagad pulver m. vatten mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 1.6, carbohydrates_100g: 6.5, fat_100g: 2.6, fiber_100g: 0.2 }},
    { code: 'lvsdb-387', product_name: 'Champinjonsoppa tillagad redd m. mjölk konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 2.2, carbohydrates_100g: 5.5, fat_100g: 3.7, fiber_100g: 0.2 }},
    { code: 'lvsdb-388', product_name: 'Majskolv kokt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 3.3, carbohydrates_100g: 17.3, fat_100g: 1.0, fiber_100g: 3.7 }},
    { code: 'lvsdb-389', product_name: 'Blomkålssoppa tillagad pulver m. vatten mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.6, carbohydrates_100g: 5.9, fat_100g: 2.2, fiber_100g: 0.3 }},
    { code: 'lvsdb-390', product_name: 'Tomatsoppa tillagad pulver m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 1.0, carbohydrates_100g: 4.6, fat_100g: 0.8, fiber_100g: 1.4 }},
    { code: 'lvsdb-391', product_name: 'Tomatsoppa tillagad konserv. m. vatten mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 45.0, proteins_100g: 1.2, carbohydrates_100g: 6.3, fat_100g: 1.4, fiber_100g: 1.1 }},
    { code: 'lvsdb-392', product_name: 'Sparrissoppa tillagad pulver m. vatten mjölk veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 1.4, carbohydrates_100g: 5.9, fat_100g: 2.3, fiber_100g: 0.2 }},
    { code: 'lvsdb-393', product_name: 'Rödkål konserv.', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 1.5, carbohydrates_100g: 15.0, fat_100g: 0.2, fiber_100g: 1.5 }},
    { code: 'lvsdb-394', product_name: 'Champinjonsås tillagad pulver m. mjölk smör', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 3.6, carbohydrates_100g: 7.6, fat_100g: 7.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-395', product_name: 'Grönsaker blandade fermenterade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 1.2, carbohydrates_100g: 1.1, fat_100g: 0.1, fiber_100g: 2.5 }},
    { code: 'lvsdb-396', product_name: 'Grönsaksjuice fermenterad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 22.0, proteins_100g: 1.5, carbohydrates_100g: 3.5, fat_100g: 0.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-397', product_name: 'Kåldolmar råa u. sås frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 5.0, carbohydrates_100g: 5.2, fat_100g: 5.0, fiber_100g: 1.4 }},
    { code: 'lvsdb-398', product_name: 'Vitkålssoppa m. fläskkorv hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 2.2, carbohydrates_100g: 1.6, fat_100g: 3.4, fiber_100g: 0.7 }},
    { code: 'lvsdb-399', product_name: 'Minestronesoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 2.0, carbohydrates_100g: 5.3, fat_100g: 2.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-400', product_name: 'Vitkålssoppa m. frikadeller', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.1, carbohydrates_100g: 2.8, fat_100g: 3.9, fiber_100g: 1.0 }},
    { code: 'lvsdb-401', product_name: 'Gryta får i kål', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 6.6, carbohydrates_100g: 2.1, fat_100g: 1.8, fiber_100g: 1.2 }},
    { code: 'lvsdb-402', product_name: 'Kåldolmar stekta hemlagade', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 5.2, carbohydrates_100g: 8.0, fat_100g: 5.7, fiber_100g: 1.4 }},
    { code: 'lvsdb-403', product_name: 'Kålpudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 7.3, carbohydrates_100g: 9.6, fat_100g: 5.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-404', product_name: 'Sallad Caesarsallad el. kycklingsallad m. dressing', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 301.0, proteins_100g: 12.0, carbohydrates_100g: 9.6, fat_100g: 23.9, fiber_100g: 1.3 }},
    { code: 'lvsdb-405', product_name: 'Moussaka ugnsstekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 6.8, carbohydrates_100g: 4.7, fat_100g: 7.7, fiber_100g: 1.4 }},
    { code: 'lvsdb-406', product_name: 'Wokgrönsaker m. nudlar kyckling', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 5.6, carbohydrates_100g: 8.6, fat_100g: 4.6, fiber_100g: 1.2 }},
    { code: 'lvsdb-407', product_name: 'Kycklingsallad m. ananas paprika vitlöksdressing', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 4.4, carbohydrates_100g: 2.4, fat_100g: 5.2, fiber_100g: 0.8 }},
    { code: 'lvsdb-408', product_name: 'Granatäpple', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 0.7, carbohydrates_100g: 7.0, fat_100g: 0.6, fiber_100g: 10.0 }},
    { code: 'lvsdb-409', product_name: 'Grapefrukt', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.9, carbohydrates_100g: 8.3, fat_100g: 0.5, fiber_100g: 0.9 }},
    { code: 'lvsdb-410', product_name: 'Guava', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 33.0, proteins_100g: 0.6, carbohydrates_100g: 4.8, fat_100g: 0.1, fiber_100g: 5.1 }},
    { code: 'lvsdb-411', product_name: 'Hallon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 1.2, carbohydrates_100g: 4.1, fat_100g: 0.6, fiber_100g: 3.7 }},
    { code: 'lvsdb-412', product_name: 'Hallon m. socker frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 0.7, carbohydrates_100g: 17.6, fat_100g: 0.2, fiber_100g: 3.3 }},
    { code: 'lvsdb-413', product_name: 'Hjortron', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 1.5, carbohydrates_100g: 5.1, fat_100g: 1.1, fiber_100g: 6.3 }},
    { code: 'lvsdb-414', product_name: 'Jordgubbar', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 41.0, proteins_100g: 0.5, carbohydrates_100g: 8.3, fat_100g: 0.2, fiber_100g: 1.9 }},
    { code: 'lvsdb-415', product_name: 'Jordgubbar hela m. socker frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 0.5, carbohydrates_100g: 19.7, fat_100g: 0.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-416', product_name: 'Gratäng broccoligratäng veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 6.2, carbohydrates_100g: 3.4, fat_100g: 6.5, fiber_100g: 1.7 }},
    { code: 'lvsdb-417', product_name: 'Sallad grekisk m. salladsost oliver', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 87.0, proteins_100g: 2.7, carbohydrates_100g: 3.2, fat_100g: 6.8, fiber_100g: 1.2 }},
    { code: 'lvsdb-418', product_name: 'Grönsakssufflé', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 7.2, carbohydrates_100g: 6.6, fat_100g: 6.7, fiber_100g: 1.5 }},
    { code: 'lvsdb-419', product_name: 'Gratäng grönsaksgratäng veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 4.1, carbohydrates_100g: 5.8, fat_100g: 5.0, fiber_100g: 1.7 }},
    { code: 'lvsdb-420', product_name: 'Grekisk sallad m. fetaost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 2.9, carbohydrates_100g: 2.0, fat_100g: 6.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-421', product_name: 'Grönsaksbuljong pasta el. pulver storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 14.9, carbohydrates_100g: 24.6, fat_100g: 8.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-422', product_name: 'Agar torkad', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 165.0, proteins_100g: 0.2, carbohydrates_100g: 2.6, fat_100g: 0.3, fiber_100g: 79.0 }},
    { code: 'lvsdb-423', product_name: 'Mykoprotein färs bitar filé kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 99.0, proteins_100g: 15.7, carbohydrates_100g: 2.2, fat_100g: 1.8, fiber_100g: 5.5 }},
    { code: 'lvsdb-424', product_name: 'Gratäng broccoligratäng m. skinka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 9.3, carbohydrates_100g: 3.6, fat_100g: 4.5, fiber_100g: 1.5 }},
    { code: 'lvsdb-425', product_name: 'Wokgrönsaker m. nudlar veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.7, carbohydrates_100g: 8.1, fat_100g: 4.1, fiber_100g: 2.5 }},
    { code: 'lvsdb-426', product_name: 'Pastej veg.', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 7.6, carbohydrates_100g: 9.1, fat_100g: 20.0, fiber_100g: 2.4 }},
    { code: 'lvsdb-427', product_name: 'Grönsaksbuljong ätf.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 5.0, proteins_100g: 0.4, carbohydrates_100g: 0.4, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-428', product_name: 'Honungsmelon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 33.0, proteins_100g: 0.5, carbohydrates_100g: 7.0, fat_100g: 0.1, fiber_100g: 0.7 }},
    { code: 'lvsdb-429', product_name: 'Nätmelon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 0.9, carbohydrates_100g: 7.1, fat_100g: 0.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-430', product_name: 'Rabarber tillagad u. socker', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 12.0, proteins_100g: 0.4, carbohydrates_100g: 0.4, fat_100g: 0.2, fiber_100g: 3.8 }},
    { code: 'lvsdb-431', product_name: 'Vattenmelon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 0.6, carbohydrates_100g: 7.5, fat_100g: 0.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-432', product_name: 'Ananas', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 0.5, carbohydrates_100g: 11.5, fat_100g: 0.1, fiber_100g: 1.2 }},
    { code: 'lvsdb-433', product_name: 'Apelsin', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 0.8, carbohydrates_100g: 10.4, fat_100g: 0.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-434', product_name: 'Aprikos', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.4, carbohydrates_100g: 9.3, fat_100g: 0.4, fiber_100g: 2.1 }},
    { code: 'lvsdb-435', product_name: 'Banan', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 1.1, carbohydrates_100g: 21.3, fat_100g: 0.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-436', product_name: 'Björnbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 1.1, carbohydrates_100g: 7.5, fat_100g: 0.2, fiber_100g: 3.4 }},
    { code: 'lvsdb-437', product_name: 'Blåbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 53.0, proteins_100g: 0.7, carbohydrates_100g: 9.1, fat_100g: 0.8, fiber_100g: 3.1 }},
    { code: 'lvsdb-438', product_name: 'Blåbär frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.5, carbohydrates_100g: 7.6, fat_100g: 0.5, fiber_100g: 3.1 }},
    { code: 'lvsdb-439', product_name: 'Blåbär m. socker frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 0.4, carbohydrates_100g: 18.3, fat_100g: 0.1, fiber_100g: 3.1 }},
    { code: 'lvsdb-440', product_name: 'Cherimoya', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 1.2, carbohydrates_100g: 17.7, fat_100g: 0.3, fiber_100g: 2.2 }},
    { code: 'lvsdb-441', product_name: 'Citron', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 0.9, carbohydrates_100g: 7.6, fat_100g: 0.7, fiber_100g: 4.9 }},
    { code: 'lvsdb-442', product_name: 'Småcitrus clementin mandarin tangerin satsumas', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 0.8, carbohydrates_100g: 11.4, fat_100g: 0.2, fiber_100g: 1.5 }},
    { code: 'lvsdb-443', product_name: 'Fikon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 87.0, proteins_100g: 2.0, carbohydrates_100g: 16.3, fat_100g: 0.4, fiber_100g: 4.6 }},
    { code: 'lvsdb-444', product_name: 'Fläderbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 67.0, proteins_100g: 0.7, carbohydrates_100g: 11.4, fat_100g: 0.5, fiber_100g: 6.8 }},
    { code: 'lvsdb-445', product_name: 'Jordgubbar skivade m. socker frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 0.5, carbohydrates_100g: 23.8, fat_100g: 0.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-446', product_name: 'Kaktusfikon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 0.7, carbohydrates_100g: 6.7, fat_100g: 0.5, fiber_100g: 2.5 }},
    { code: 'lvsdb-447', product_name: 'Kiwi grön', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 55.0, proteins_100g: 0.8, carbohydrates_100g: 9.6, fat_100g: 0.9, fiber_100g: 2.7 }},
    { code: 'lvsdb-448', product_name: 'Krusbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 0.8, carbohydrates_100g: 5.7, fat_100g: 0.6, fiber_100g: 3.4 }},
    { code: 'lvsdb-449', product_name: 'Physalis', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 1.8, carbohydrates_100g: 8.9, fat_100g: 0.6, fiber_100g: 4.2 }},
    { code: 'lvsdb-450', product_name: 'Kumquat', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 0.5, carbohydrates_100g: 12.9, fat_100g: 0.7, fiber_100g: 4.6 }},
    { code: 'lvsdb-451', product_name: 'Kvitten', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 0.4, carbohydrates_100g: 13.1, fat_100g: 0.1, fiber_100g: 4.0 }},
    { code: 'lvsdb-452', product_name: 'Surkörsbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 0.9, carbohydrates_100g: 13.3, fat_100g: 0.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-453', product_name: 'Sötkörsbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 1.1, carbohydrates_100g: 14.7, fat_100g: 0.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-454', product_name: 'Lime', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 0.7, carbohydrates_100g: 10.3, fat_100g: 0.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-455', product_name: 'Lingon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 0.5, carbohydrates_100g: 10.7, fat_100g: 0.7, fiber_100g: 2.6 }},
    { code: 'lvsdb-456', product_name: 'Mango', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 0.7, carbohydrates_100g: 11.3, fat_100g: 0.6, fiber_100g: 1.1 }},
    { code: 'lvsdb-457', product_name: 'Banan kokbanan', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 1.3, carbohydrates_100g: 30.4, fat_100g: 0.4, fiber_100g: 1.7 }},
    { code: 'lvsdb-458', product_name: 'Nektarin', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 53.0, proteins_100g: 0.9, carbohydrates_100g: 10.9, fat_100g: 0.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-459', product_name: 'Papaya', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.8, carbohydrates_100g: 8.9, fat_100g: 0.6, fiber_100g: 1.8 }},
    { code: 'lvsdb-460', product_name: 'Paradisäpple', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 0.4, carbohydrates_100g: 17.9, fat_100g: 0.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-461', product_name: 'Passionsfrukt', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 87.0, proteins_100g: 2.2, carbohydrates_100g: 12.9, fat_100g: 0.7, fiber_100g: 10.4 }},
    { code: 'lvsdb-462', product_name: 'Persika nektarin', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.7, carbohydrates_100g: 8.6, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-463', product_name: 'Sharon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 65.0, proteins_100g: 0.4, carbohydrates_100g: 14.3, fat_100g: 0.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-464', product_name: 'Plommon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 0.5, carbohydrates_100g: 10.2, fat_100g: 0.0, fiber_100g: 1.8 }},
    { code: 'lvsdb-465', product_name: 'Päron', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 0.3, carbohydrates_100g: 11.5, fat_100g: 0.1, fiber_100g: 2.7 }},
    { code: 'lvsdb-466', product_name: 'Tranbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 0.4, carbohydrates_100g: 8.9, fat_100g: 0.2, fiber_100g: 3.3 }},
    { code: 'lvsdb-467', product_name: 'Vinbär röda', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 1.2, carbohydrates_100g: 8.7, fat_100g: 0.2, fiber_100g: 3.4 }},
    { code: 'lvsdb-468', product_name: 'Vinbär svarta', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.4, carbohydrates_100g: 10.2, fat_100g: 1.1, fiber_100g: 5.8 }},
    { code: 'lvsdb-469', product_name: 'Vindruvor', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 0.6, carbohydrates_100g: 15.6, fat_100g: 0.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-470', product_name: 'Äpple m. skal', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.0, carbohydrates_100g: 10.6, fat_100g: 0.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-471', product_name: 'Äpple u. skal ', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 0.0, carbohydrates_100g: 13.4, fat_100g: 0.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-472', product_name: 'Hallon frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 1.0, carbohydrates_100g: 5.4, fat_100g: 0.5, fiber_100g: 3.7 }},
    { code: 'lvsdb-473', product_name: 'Björnbär frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 1.0, carbohydrates_100g: 8.8, fat_100g: 0.5, fiber_100g: 7.2 }},
    { code: 'lvsdb-474', product_name: 'Björnbär m. socker frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 1.0, carbohydrates_100g: 12.0, fat_100g: 0.5, fiber_100g: 6.0 }},
    { code: 'lvsdb-475', product_name: 'Jordgubbar frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 33.0, proteins_100g: 0.5, carbohydrates_100g: 6.4, fat_100g: 0.3, fiber_100g: 1.4 }},
    { code: 'lvsdb-476', product_name: 'Hallon blåbär frysvara', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 44.0, proteins_100g: 1.0, carbohydrates_100g: 6.6, fat_100g: 0.7, fiber_100g: 3.4 }},
    { code: 'lvsdb-477', product_name: 'Apelsinskal', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 1.5, carbohydrates_100g: 21.8, fat_100g: 0.2, fiber_100g: 3.7 }},
    { code: 'lvsdb-478', product_name: 'Aprikos torkad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 190.0, proteins_100g: 2.2, carbohydrates_100g: 41.0, fat_100g: 0.5, fiber_100g: 5.3 }},
    { code: 'lvsdb-479', product_name: 'Banan torkad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 374.0, proteins_100g: 3.9, carbohydrates_100g: 80.8, fat_100g: 1.8, fiber_100g: 7.5 }},
    { code: 'lvsdb-480', product_name: 'Blåbär torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 303.0, proteins_100g: 1.7, carbohydrates_100g: 63.8, fat_100g: 2.4, fiber_100g: 8.4 }},
    { code: 'lvsdb-481', product_name: 'Citronskal', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 1.5, carbohydrates_100g: 11.9, fat_100g: 0.3, fiber_100g: 3.7 }},
    { code: 'lvsdb-482', product_name: 'Dadlar torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 321.0, proteins_100g: 2.4, carbohydrates_100g: 71.9, fat_100g: 0.6, fiber_100g: 7.5 }},
    { code: 'lvsdb-483', product_name: 'Fikon torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 269.0, proteins_100g: 3.1, carbohydrates_100g: 55.9, fat_100g: 1.2, fiber_100g: 10.0 }},
    { code: 'lvsdb-484', product_name: 'Katrinplommon torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 219.0, proteins_100g: 2.3, carbohydrates_100g: 48.6, fat_100g: 0.3, fiber_100g: 5.2 }},
    { code: 'lvsdb-485', product_name: 'Nypon torkat u. frön', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 328.0, proteins_100g: 3.7, carbohydrates_100g: 68.4, fat_100g: 1.4, fiber_100g: 12.0 }},
    { code: 'lvsdb-486', product_name: 'Nyponsoppapulver berikad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 0.7, carbohydrates_100g: 91.1, fat_100g: 0.2, fiber_100g: 5.0 }},
    { code: 'lvsdb-487', product_name: 'Persika torkad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 3.6, carbohydrates_100g: 52.9, fat_100g: 0.8, fiber_100g: 8.2 }},
    { code: 'lvsdb-488', product_name: 'Päron torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 282.0, proteins_100g: 1.9, carbohydrates_100g: 63.4, fat_100g: 0.6, fiber_100g: 6.0 }},
    { code: 'lvsdb-489', product_name: 'Russin', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 285.0, proteins_100g: 1.9, carbohydrates_100g: 64.4, fat_100g: 0.5, fiber_100g: 6.1 }},
    { code: 'lvsdb-490', product_name: 'Äpple torkat', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 257.0, proteins_100g: 0.9, carbohydrates_100g: 57.2, fat_100g: 0.3, fiber_100g: 9.5 }},
    { code: 'lvsdb-491', product_name: 'Frukt torkad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 266.0, proteins_100g: 3.3, carbohydrates_100g: 56.8, fat_100g: 0.5, fiber_100g: 9.0 }},
    { code: 'lvsdb-492', product_name: 'Papaya torkad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 263.0, proteins_100g: 3.4, carbohydrates_100g: 57.6, fat_100g: 0.6, fiber_100g: 5.0 }},
    { code: 'lvsdb-493', product_name: 'Ananas konserv. m. juice', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 62.0, proteins_100g: 0.4, carbohydrates_100g: 14.2, fat_100g: 0.1, fiber_100g: 1.0 }},
    { code: 'lvsdb-494', product_name: 'Ananas konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 0.4, carbohydrates_100g: 20.2, fat_100g: 0.1, fiber_100g: 1.0 }},
    { code: 'lvsdb-495', product_name: 'Aprikos konserv. m. juice', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 0.6, carbohydrates_100g: 11.4, fat_100g: 0.0, fiber_100g: 1.6 }},
    { code: 'lvsdb-496', product_name: 'Aprikos konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 0.5, carbohydrates_100g: 27.7, fat_100g: 0.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-497', product_name: 'Körsbär surkörsbär konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 94.0, proteins_100g: 0.7, carbohydrates_100g: 21.5, fat_100g: 0.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-498', product_name: 'Persika konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 0.4, carbohydrates_100g: 19.5, fat_100g: 0.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-499', product_name: 'Plommon konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 94.0, proteins_100g: 0.4, carbohydrates_100g: 21.8, fat_100g: 0.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-500', product_name: 'Päron konserv. m. lättsockrad lag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 0.2, carbohydrates_100g: 13.8, fat_100g: 0.0, fiber_100g: 1.9 }},
    { code: 'lvsdb-501', product_name: 'Päron konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 0.2, carbohydrates_100g: 17.6, fat_100g: 0.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-502', product_name: 'Äpple konserv.', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 0.2, carbohydrates_100g: 14.9, fat_100g: 0.5, fiber_100g: 1.8 }},
    { code: 'lvsdb-503', product_name: 'Grapefrukt konserv. m. lättsockrad lag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 0.6, carbohydrates_100g: 14.6, fat_100g: 0.1, fiber_100g: 0.4 }},
    { code: 'lvsdb-504', product_name: 'Fruktcocktail konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 0.4, carbohydrates_100g: 18.9, fat_100g: 0.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-505', product_name: 'Mandarin konserv. m. lättsockrad lag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 65.0, proteins_100g: 0.4, carbohydrates_100g: 14.6, fat_100g: 0.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-506', product_name: 'Mango konserv. m. sockerlag', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 99.0, proteins_100g: 0.3, carbohydrates_100g: 23.3, fat_100g: 0.1, fiber_100g: 1.0 }},
    { code: 'lvsdb-507', product_name: 'Apelsinsallad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 1.6, carbohydrates_100g: 14.1, fat_100g: 4.5, fiber_100g: 1.7 }},
    { code: 'lvsdb-508', product_name: 'Frukt bär konserv. osötad el. sötningsm.', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 0.4, carbohydrates_100g: 7.6, fat_100g: 0.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-509', product_name: 'Fruktsallad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 0.6, carbohydrates_100g: 11.8, fat_100g: 0.3, fiber_100g: 1.9 }},
    { code: 'lvsdb-510', product_name: 'Apelsinjuice färskpressad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.7, carbohydrates_100g: 10.6, fat_100g: 0.2, fiber_100g: 0.1 }},
    { code: 'lvsdb-511', product_name: 'Apelsinjuice konc. frysvara', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 165.0, proteins_100g: 2.4, carbohydrates_100g: 37.5, fat_100g: 0.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-512', product_name: 'Apelsinjuice drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 0.7, carbohydrates_100g: 8.6, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-513', product_name: 'Citronjuice färskpressad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 0.6, carbohydrates_100g: 6.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-514', product_name: 'Citronjuice konc. konserv.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 0.4, carbohydrates_100g: 6.8, fat_100g: 0.3, fiber_100g: 0.1 }},
    { code: 'lvsdb-515', product_name: 'Småcitrusjuice färskpressad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 44.0, proteins_100g: 0.5, carbohydrates_100g: 9.9, fat_100g: 0.2, fiber_100g: 0.1 }},
    { code: 'lvsdb-516', product_name: 'Grapefruktjuice färskpressad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 45.0, proteins_100g: 0.6, carbohydrates_100g: 10.2, fat_100g: 0.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-517', product_name: 'Limejuice färskpressad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 0.4, carbohydrates_100g: 9.1, fat_100g: 0.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-518', product_name: 'Risgrynsgröt lättmjölk fett ca 1%', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 3.2, carbohydrates_100g: 13.3, fat_100g: 1.3, fiber_100g: 0.1 }},
    { code: 'lvsdb-519', product_name: 'Risgrynsgröt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 3.2, carbohydrates_100g: 13.3, fat_100g: 2.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-520', product_name: 'Limejuice konc. konserv.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 0.2, carbohydrates_100g: 6.2, fat_100g: 0.2, fiber_100g: 0.1 }},
    { code: 'lvsdb-521', product_name: 'Druvjuice konserv. drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 0.6, carbohydrates_100g: 14.6, fat_100g: 0.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-522', product_name: 'Äppeljuice drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 0.2, carbohydrates_100g: 9.7, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-523', product_name: 'Ananasjuice konserv. drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 55.0, proteins_100g: 0.3, carbohydrates_100g: 12.8, fat_100g: 0.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-524', product_name: 'Apelsinjuice pastöriserad drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.6, carbohydrates_100g: 9.8, fat_100g: 0.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-525', product_name: 'Juice', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 0.6, carbohydrates_100g: 8.9, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-526', product_name: 'Aprikosnektar pastöriserad drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 0.3, carbohydrates_100g: 13.1, fat_100g: 0.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-527', product_name: 'Persikonektar pastöriserad drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 55.0, proteins_100g: 0.3, carbohydrates_100g: 13.0, fat_100g: 0.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-528', product_name: 'Katrinplommondryck konserv. drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 0.6, carbohydrates_100g: 15.5, fat_100g: 0.0, fiber_100g: 2.2 }},
    { code: 'lvsdb-529', product_name: 'Havredryck choklad fett 1,5%  berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.2, carbohydrates_100g: 12.3, fat_100g: 1.6, fiber_100g: 1.1 }},
    { code: 'lvsdb-530', product_name: 'Bovetegröt m. russin', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 2.0, carbohydrates_100g: 22.2, fat_100g: 0.6, fiber_100g: 1.4 }},
    { code: 'lvsdb-531', product_name: 'Grahamsgröt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 2.4, carbohydrates_100g: 13.6, fat_100g: 0.4, fiber_100g: 3.1 }},
    { code: 'lvsdb-532', product_name: 'Havregrynsgröt fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 66.0, proteins_100g: 1.7, carbohydrates_100g: 11.3, fat_100g: 1.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-533', product_name: 'Molinogröt grahamsmjöl m. torkad frukt linfrö', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 89.0, proteins_100g: 2.4, carbohydrates_100g: 12.4, fat_100g: 2.5, fiber_100g: 3.9 }},
    { code: 'lvsdb-534', product_name: 'Frukostflingor ris puffat rostat osötat', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 383.0, proteins_100g: 6.0, carbohydrates_100g: 86.0, fat_100g: 0.9, fiber_100g: 0.8 }},
    { code: 'lvsdb-535', product_name: 'Rågkross ångprep. fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 326.0, proteins_100g: 9.0, carbohydrates_100g: 57.2, fat_100g: 2.5, fiber_100g: 18.1 }},
    { code: 'lvsdb-536', product_name: 'Kornmjölsgröt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 1.7, carbohydrates_100g: 11.9, fat_100g: 0.6, fiber_100g: 1.4 }},
    { code: 'lvsdb-537', product_name: 'Mannagrynsgröt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 4.3, carbohydrates_100g: 11.0, fat_100g: 1.8, fiber_100g: 0.3 }},
    { code: 'lvsdb-538', product_name: 'Kruskagröt fullkorn m. havregryn vetekli russin', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 66.0, proteins_100g: 1.5, carbohydrates_100g: 11.7, fat_100g: 0.8, fiber_100g: 2.8 }},
    { code: 'lvsdb-539', product_name: 'Rågmjölsgröt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 1.9, carbohydrates_100g: 13.6, fat_100g: 0.4, fiber_100g: 4.3 }},
    { code: 'lvsdb-540', product_name: 'Stuvning vit', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 4.4, carbohydrates_100g: 8.2, fat_100g: 5.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-541', product_name: 'Välling fullkorn berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 3.6, carbohydrates_100g: 9.2, fat_100g: 1.9, fiber_100g: 0.9 }},
    { code: 'lvsdb-542', product_name: 'Havrevälling hemlagad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 2.9, carbohydrates_100g: 12.7, fat_100g: 1.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-543', product_name: 'Mannagrynsvälling hemlagad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 3.8, carbohydrates_100g: 9.1, fat_100g: 1.7, fiber_100g: 0.1 }},
    { code: 'lvsdb-544', product_name: 'Välling berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 3.3, carbohydrates_100g: 8.6, fat_100g: 1.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-545', product_name: 'Havredryck fett 1,5% berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 1.0, carbohydrates_100g: 7.1, fat_100g: 1.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-546', product_name: 'Havregryn fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 375.0, proteins_100g: 9.5, carbohydrates_100g: 64.1, fat_100g: 7.0, fiber_100g: 7.5 }},
    { code: 'lvsdb-547', product_name: 'Fiberhavregryn fullkorn havre m. vetekli', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 371.0, proteins_100g: 10.0, carbohydrates_100g: 60.5, fat_100g: 7.3, fiber_100g: 10.5 }},
    { code: 'lvsdb-548', product_name: 'Havrekli', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 356.0, proteins_100g: 15.1, carbohydrates_100g: 48.4, fat_100g: 7.4, fiber_100g: 17.5 }},
    { code: 'lvsdb-549', product_name: 'Korngryn ångprep. fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 351.0, proteins_100g: 9.2, carbohydrates_100g: 65.4, fat_100g: 3.1, fiber_100g: 10.7 }},
    { code: 'lvsdb-550', product_name: 'Frukostflingor majs osötad berikad typ cornflakes', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 380.0, proteins_100g: 8.0, carbohydrates_100g: 82.5, fat_100g: 0.9, fiber_100g: 2.5 }},
    { code: 'lvsdb-551', product_name: 'Vetekross ångprep. fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 328.0, proteins_100g: 10.2, carbohydrates_100g: 61.0, fat_100g: 2.0, fiber_100g: 11.3 }},
    { code: 'lvsdb-552', product_name: 'Vetegroddar', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 349.0, proteins_100g: 27.5, carbohydrates_100g: 31.4, fat_100g: 9.4, fiber_100g: 14.0 }},
    { code: 'lvsdb-553', product_name: 'Vetekli', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 277.0, proteins_100g: 14.9, carbohydrates_100g: 25.5, fat_100g: 4.6, fiber_100g: 37.5 }},
    { code: 'lvsdb-554', product_name: 'Frukostflingor vete fullkorn typ Weetabix', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 366.0, proteins_100g: 11.3, carbohydrates_100g: 68.4, fat_100g: 2.5, fiber_100g: 10.5 }},
    { code: 'lvsdb-555', product_name: 'Kruskakli grovt vetekli', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 269.0, proteins_100g: 12.7, carbohydrates_100g: 24.9, fat_100g: 5.0, fiber_100g: 37.5 }},
    { code: 'lvsdb-556', product_name: 'Frukostflingor flingblandning fullkorn typ basmüsli', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 367.0, proteins_100g: 9.3, carbohydrates_100g: 67.6, fat_100g: 4.1, fiber_100g: 9.6 }},
    { code: 'lvsdb-557', product_name: 'Frukostflingor ris puffat m. socker berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 385.0, proteins_100g: 5.4, carbohydrates_100g: 86.3, fat_100g: 1.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-558', product_name: 'Frukostflingor vetekli rostat m. kornmalt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 367.0, proteins_100g: 10.3, carbohydrates_100g: 65.5, fat_100g: 3.6, fiber_100g: 14.0 }},
    { code: 'lvsdb-559', product_name: 'Frukostflingor ris puffat rostat m. socker kakao', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 393.0, proteins_100g: 4.6, carbohydrates_100g: 85.2, fat_100g: 2.6, fiber_100g: 2.4 }},
    { code: 'lvsdb-560', product_name: 'Frukostflingor müsli fullkorn m. frukt bär', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 370.0, proteins_100g: 8.2, carbohydrates_100g: 64.8, fat_100g: 6.6, fiber_100g: 7.7 }},
    { code: 'lvsdb-561', product_name: 'Frukostflingor müsli flingblandning fullkorn m. frukt nötter socker el. honung', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 369.0, proteins_100g: 8.0, carbohydrates_100g: 70.6, fat_100g: 3.8, fiber_100g: 8.2 }},
    { code: 'lvsdb-562', product_name: 'Frukostflingor vetekli fullkorn berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 364.0, proteins_100g: 9.9, carbohydrates_100g: 66.8, fat_100g: 2.8, fiber_100g: 14.7 }},
    { code: 'lvsdb-563', product_name: 'Frukostflingor fullkorn typ Specialflingor', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 9.0, carbohydrates_100g: 78.9, fat_100g: 2.2, fiber_100g: 3.7 }},
    { code: 'lvsdb-564', product_name: 'Frukostflingor vete puffat m. honung berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 388.0, proteins_100g: 8.3, carbohydrates_100g: 76.9, fat_100g: 3.0, fiber_100g: 7.9 }},
    { code: 'lvsdb-565', product_name: 'Frukostflingor majs m. socker', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 382.0, proteins_100g: 4.3, carbohydrates_100g: 86.4, fat_100g: 0.9, fiber_100g: 3.1 }},
    { code: 'lvsdb-566', product_name: 'Frukostflingor fullkorn m. socker berikad typ ringar', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 379.0, proteins_100g: 7.7, carbohydrates_100g: 75.5, fat_100g: 3.2, fiber_100g: 6.8 }},
    { code: 'lvsdb-567', product_name: 'Fattiga riddare', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 273.0, proteins_100g: 7.2, carbohydrates_100g: 30.8, fat_100g: 13.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-568', product_name: 'Pannkaka tunn m. lättmjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 159.0, proteins_100g: 6.7, carbohydrates_100g: 18.0, fat_100g: 6.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-569', product_name: 'Ugnspannkaka lättmjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 152.0, proteins_100g: 6.1, carbohydrates_100g: 15.2, fat_100g: 7.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-570', product_name: 'Ugnspannkaka mellanmjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 159.0, proteins_100g: 6.1, carbohydrates_100g: 15.2, fat_100g: 8.0, fiber_100g: 0.9 }},
    { code: 'lvsdb-571', product_name: 'Våffla m. ägg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 248.0, proteins_100g: 5.2, carbohydrates_100g: 20.2, fat_100g: 16.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-572', product_name: 'Våffla u. ägg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 322.0, proteins_100g: 3.3, carbohydrates_100g: 21.4, fat_100g: 24.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-573', product_name: 'Fläskpannkaka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 7.6, carbohydrates_100g: 14.5, fat_100g: 12.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-574', product_name: 'Räkcrêpe m. mellanmjölk vispgrädde fyllning 44% hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 149.0, proteins_100g: 8.0, carbohydrates_100g: 11.3, fat_100g: 7.8, fiber_100g: 0.5 }},
    { code: 'lvsdb-575', product_name: 'Räkcrêpe värmd fyllning 37% frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 175.0, proteins_100g: 6.5, carbohydrates_100g: 18.9, fat_100g: 8.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-576', product_name: 'Champinjoncrêpe m. mellanmjölk vispgrädde veg. hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 6.5, carbohydrates_100g: 12.4, fat_100g: 9.9, fiber_100g: 0.8 }},
    { code: 'lvsdb-577', product_name: 'Baguette m. salami brieost soltorkad tomat sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 240.0, proteins_100g: 9.3, carbohydrates_100g: 19.7, fat_100g: 13.4, fiber_100g: 1.9 }},
    { code: 'lvsdb-578', product_name: 'Ciabatta m. mozzarella soltorkad tomat sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 7.9, carbohydrates_100g: 25.1, fat_100g: 5.9, fiber_100g: 2.5 }},
    { code: 'lvsdb-579', product_name: 'Bagel m. rökt lax färskost sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 212.0, proteins_100g: 9.0, carbohydrates_100g: 26.8, fat_100g: 7.0, fiber_100g: 2.4 }},
    { code: 'lvsdb-580', product_name: 'Champinjoncrêpe värmd veg. frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 163.0, proteins_100g: 5.4, carbohydrates_100g: 19.0, fat_100g: 6.8, fiber_100g: 2.0 }},
    { code: 'lvsdb-581', product_name: 'Crêpefyllning m. spenat färskost fetaost skinka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 10.3, carbohydrates_100g: 1.7, fat_100g: 9.1, fiber_100g: 0.6 }},
    { code: 'lvsdb-582', product_name: 'Crêpes pannkaka tunn fylld', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 163.0, proteins_100g: 10.4, carbohydrates_100g: 3.5, fat_100g: 11.8, fiber_100g: 0.7 }},
    { code: 'lvsdb-583', product_name: 'Vårrulle värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 217.0, proteins_100g: 6.9, carbohydrates_100g: 22.4, fat_100g: 10.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-584', product_name: 'Vårrulle värmd tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 316.0, proteins_100g: 6.6, carbohydrates_100g: 18.7, fat_100g: 23.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-585', product_name: 'Deg matpaj gräddad', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 445.0, proteins_100g: 4.6, carbohydrates_100g: 38.0, fat_100g: 30.3, fiber_100g: 1.9 }},
    { code: 'lvsdb-586', product_name: 'Pirog u. fyllning gräddad', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 436.0, proteins_100g: 5.9, carbohydrates_100g: 35.5, fat_100g: 29.9, fiber_100g: 1.7 }},
    { code: 'lvsdb-587', product_name: 'Deg smulpaj gräddad', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 481.0, proteins_100g: 4.7, carbohydrates_100g: 52.2, fat_100g: 27.8, fiber_100g: 2.2 }},
    { code: 'lvsdb-588', product_name: 'Paj m. köttfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 236.0, proteins_100g: 11.2, carbohydrates_100g: 12.3, fat_100g: 15.6, fiber_100g: 1.3 }},
    { code: 'lvsdb-589', product_name: 'Paj m. kyckling bacon', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 225.0, proteins_100g: 9.3, carbohydrates_100g: 11.9, fat_100g: 15.3, fiber_100g: 1.4 }},
    { code: 'lvsdb-590', product_name: 'Pirog m. köttfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 243.0, proteins_100g: 9.6, carbohydrates_100g: 19.9, fat_100g: 13.1, fiber_100g: 3.7 }},
    { code: 'lvsdb-591', product_name: 'Pizza m. skinka champinjoner lök sardeller hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 209.0, proteins_100g: 9.4, carbohydrates_100g: 22.2, fat_100g: 8.7, fiber_100g: 2.2 }},
    { code: 'lvsdb-592', product_name: 'Paj m. köttfärs värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 344.0, proteins_100g: 9.9, carbohydrates_100g: 26.1, fat_100g: 22.1, fiber_100g: 1.2 }},
    { code: 'lvsdb-593', product_name: 'Pirog m. kött värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 295.0, proteins_100g: 8.8, carbohydrates_100g: 33.5, fat_100g: 13.6, fiber_100g: 1.3 }},
    { code: 'lvsdb-594', product_name: 'Pizza Capricciosa m. rökt skinka värmd kylvara el. frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 248.0, proteins_100g: 11.5, carbohydrates_100g: 27.0, fat_100g: 10.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-595', product_name: 'Pizza Capricciosa m. rökt skinka champinjon restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 267.0, proteins_100g: 11.0, carbohydrates_100g: 25.0, fat_100g: 13.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-596', product_name: 'Pizza Pepperoni m. rökt korv värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 235.0, proteins_100g: 9.1, carbohydrates_100g: 30.5, fat_100g: 7.8, fiber_100g: 2.9 }},
    { code: 'lvsdb-597', product_name: 'Pizza pan pizza m. rökt griskött värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 13.1, carbohydrates_100g: 26.5, fat_100g: 13.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-598', product_name: 'Pizza pan pizza m. rökt griskött restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 11.4, carbohydrates_100g: 26.3, fat_100g: 9.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-599', product_name: 'Paj m. ost skinka värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 296.0, proteins_100g: 11.5, carbohydrates_100g: 20.5, fat_100g: 18.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-600', product_name: 'Paj m. lax spenat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 178.0, proteins_100g: 8.3, carbohydrates_100g: 13.5, fat_100g: 9.9, fiber_100g: 1.2 }},
    { code: 'lvsdb-601', product_name: 'Pizza m. räkor musslor hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 237.0, proteins_100g: 10.7, carbohydrates_100g: 22.6, fat_100g: 11.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-602', product_name: 'Vol-au-vent m. räkstuvning', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 6.3, carbohydrates_100g: 24.0, fat_100g: 14.0, fiber_100g: 0.8 }},
    { code: 'lvsdb-603', product_name: 'Paj m. skaldjur värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 306.0, proteins_100g: 10.4, carbohydrates_100g: 22.0, fat_100g: 19.6, fiber_100g: 0.6 }},
    { code: 'lvsdb-604', product_name: 'Pizza Marinara m. skaldjur restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 258.0, proteins_100g: 12.9, carbohydrates_100g: 22.2, fat_100g: 12.7, fiber_100g: 1.4 }},
    { code: 'lvsdb-605', product_name: 'Pizza veg. hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 6.4, carbohydrates_100g: 19.1, fat_100g: 8.0, fiber_100g: 2.2 }},
    { code: 'lvsdb-606', product_name: 'Pizza Margherita m. ost tomatsås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 246.0, proteins_100g: 9.0, carbohydrates_100g: 27.6, fat_100g: 10.5, fiber_100g: 2.4 }},
    { code: 'lvsdb-607', product_name: 'Kycklingburgare m. bröd tillbehör', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 228.0, proteins_100g: 10.7, carbohydrates_100g: 22.8, fat_100g: 10.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-608', product_name: 'Fiskburgare m. bröd tillbehör', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 12.4, carbohydrates_100g: 27.3, fat_100g: 13.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-609', product_name: 'Baguette m. rostbiff potatissallad sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 197.0, proteins_100g: 6.6, carbohydrates_100g: 28.4, fat_100g: 5.6, fiber_100g: 2.5 }},
    { code: 'lvsdb-610', product_name: 'Baguette grov m. skaldjur tonfisk smögenröra sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 5.7, carbohydrates_100g: 26.2, fat_100g: 6.1, fiber_100g: 2.9 }},
    { code: 'lvsdb-611', product_name: 'Baguette grov m. ost skinka sallad lättmajonnäs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 7.7, carbohydrates_100g: 25.9, fat_100g: 4.6, fiber_100g: 3.5 }},
    { code: 'lvsdb-612', product_name: 'Bagel m. salami färskost sallad oliv', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 5.9, carbohydrates_100g: 17.2, fat_100g: 7.5, fiber_100g: 2.9 }},
    { code: 'lvsdb-613', product_name: 'Sandwich m. räkor ägg sallad majonnäs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 295.0, proteins_100g: 7.3, carbohydrates_100g: 21.6, fat_100g: 19.7, fiber_100g: 1.6 }},
    { code: 'lvsdb-614', product_name: 'Sandwich m. rökt kalkon färskost soltorkad tomat sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 180.0, proteins_100g: 10.3, carbohydrates_100g: 21.2, fat_100g: 5.3, fiber_100g: 2.5 }},
    { code: 'lvsdb-615', product_name: 'Sandwich m. salami färskost sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 9.1, carbohydrates_100g: 16.2, fat_100g: 6.4, fiber_100g: 2.7 }},
    { code: 'lvsdb-616', product_name: 'Tunnbrödsrulle m. pastrami potatis sallad majonnäs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 159.0, proteins_100g: 5.4, carbohydrates_100g: 15.6, fat_100g: 7.8, fiber_100g: 2.1 }},
    { code: 'lvsdb-617', product_name: 'Wrap vetetortilla m. ris köttfärs majs ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 7.9, carbohydrates_100g: 19.3, fat_100g: 3.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-618', product_name: 'Wrap vetetortilla fajitas m. kyckling gräddfil sallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 5.7, carbohydrates_100g: 11.1, fat_100g: 7.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-619', product_name: 'Wrap vetetortilla enchilada m. köttfärs majschips ost sallad paprika tomat tomatsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 6.7, carbohydrates_100g: 11.7, fat_100g: 10.2, fiber_100g: 2.7 }},
    { code: 'lvsdb-620', product_name: 'Falafel m. pitabröd sallad sesamsås pepperoni', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 5.2, carbohydrates_100g: 17.3, fat_100g: 5.7, fiber_100g: 4.2 }},
    { code: 'lvsdb-621', product_name: 'Paj m. ost skinka mellanmjölk matlagningsgrädde hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 286.0, proteins_100g: 11.4, carbohydrates_100g: 15.0, fat_100g: 19.8, fiber_100g: 2.1 }},
    { code: 'lvsdb-622', product_name: 'Wrap vetetortilla m. fetaost oliver sallad vitlöksdressing', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 175.0, proteins_100g: 5.1, carbohydrates_100g: 20.1, fat_100g: 7.5, fiber_100g: 2.9 }},
    { code: 'lvsdb-623', product_name: 'Matmuffins grov fullkorn m. getost fårost broccoli spenat soltorkade tomater', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 9.5, carbohydrates_100g: 26.0, fat_100g: 16.0, fiber_100g: 3.4 }},
    { code: 'lvsdb-624', product_name: 'Pizzapålägg m. tomatsås skinka champinjoner hårdost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 153.0, proteins_100g: 10.8, carbohydrates_100g: 5.3, fat_100g: 9.5, fiber_100g: 1.6 }},
    { code: 'lvsdb-625', product_name: 'Paj m. ost skinka mellanmjölk hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 235.0, proteins_100g: 10.0, carbohydrates_100g: 13.3, fat_100g: 15.6, fiber_100g: 1.1 }},
    { code: 'lvsdb-626', product_name: 'Smörgåstårta el. landgång', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 237.0, proteins_100g: 8.7, carbohydrates_100g: 15.1, fat_100g: 15.5, fiber_100g: 1.8 }},
    { code: 'lvsdb-627', product_name: 'Råris kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 2.5, carbohydrates_100g: 21.3, fat_100g: 0.9, fiber_100g: 1.3 }},
    { code: 'lvsdb-628', product_name: 'Rismjöl vitt', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 358.0, proteins_100g: 5.8, carbohydrates_100g: 80.2, fat_100g: 0.5, fiber_100g: 2.1 }},
    { code: 'lvsdb-629', product_name: 'Risdiet flingor', brands: 'Måltidsersättning, sportpreparat', nutriments: { 'energy-kcal_100g': 371.0, proteins_100g: 7.0, carbohydrates_100g: 80.9, fat_100g: 1.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-630', product_name: 'Ris kinesiskt asiatiskt kokt u. salt tillagad på restaurang', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 2.7, carbohydrates_100g: 30.1, fat_100g: 1.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-631', product_name: 'Ris vildris okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 360.0, proteins_100g: 14.7, carbohydrates_100g: 68.7, fat_100g: 1.1, fiber_100g: 6.2 }},
    { code: 'lvsdb-632', product_name: 'Ris vildris kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 4.0, carbohydrates_100g: 19.5, fat_100g: 0.3, fiber_100g: 1.8 }},
    { code: 'lvsdb-633', product_name: 'Nudlar glasnudlar okokta', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 0.2, carbohydrates_100g: 85.6, fat_100g: 0.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-634', product_name: 'Vinbladsdolma m. ris konserv. veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 2.5, carbohydrates_100g: 11.5, fat_100g: 11.3, fiber_100g: 2.5 }},
    { code: 'lvsdb-635', product_name: 'Bovete hela el. krossade korn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 9.6, carbohydrates_100g: 70.0, fat_100g: 2.5, fiber_100g: 3.7 }},
    { code: 'lvsdb-636', product_name: 'Durra el. andra sorghumarter mjöl fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 351.0, proteins_100g: 10.3, carbohydrates_100g: 61.4, fat_100g: 4.7, fiber_100g: 9.7 }},
    { code: 'lvsdb-637', product_name: 'Hirs hela el. krossade korn fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 10.5, carbohydrates_100g: 68.4, fat_100g: 2.9, fiber_100g: 3.2 }},
    { code: 'lvsdb-638', product_name: 'Mannagryn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 351.0, proteins_100g: 10.1, carbohydrates_100g: 72.1, fat_100g: 1.3, fiber_100g: 2.8 }},
    { code: 'lvsdb-639', product_name: 'Bulgur', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 12.3, carbohydrates_100g: 68.2, fat_100g: 1.3, fiber_100g: 7.7 }},
    { code: 'lvsdb-640', product_name: 'Bulgur kokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 4.3, carbohydrates_100g: 23.1, fat_100g: 1.2, fiber_100g: 4.0 }},
    { code: 'lvsdb-641', product_name: 'Couscous', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 12.8, carbohydrates_100g: 72.4, fat_100g: 0.6, fiber_100g: 5.0 }},
    { code: 'lvsdb-642', product_name: 'Couscous tillagad', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 3.8, carbohydrates_100g: 21.8, fat_100g: 0.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-643', product_name: 'Korngryn ångprep. fullkorn kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 1.8, carbohydrates_100g: 13.6, fat_100g: 0.4, fiber_100g: 7.6 }},
    { code: 'lvsdb-644', product_name: 'Hirs kokt m. salt fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 2.9, carbohydrates_100g: 18.9, fat_100g: 0.8, fiber_100g: 0.9 }},
    { code: 'lvsdb-645', product_name: 'Majsgryn polenta kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.7, carbohydrates_100g: 13.4, fat_100g: 0.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-646', product_name: 'Apelsinris', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 2.0, carbohydrates_100g: 12.8, fat_100g: 3.7, fiber_100g: 0.6 }},
    { code: 'lvsdb-647', product_name: 'Ris à la Malta m. grädde fett 40%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 2.9, carbohydrates_100g: 15.6, fat_100g: 6.3, fiber_100g: 0.1 }},
    { code: 'lvsdb-648', product_name: 'Risgrynskaka risgrynspudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 4.1, carbohydrates_100g: 14.5, fat_100g: 7.5, fiber_100g: 0.1 }},
    { code: 'lvsdb-649', product_name: 'Rismål fett 6%', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 2.8, carbohydrates_100g: 20.8, fat_100g: 6.4, fiber_100g: 1.0 }},
    { code: 'lvsdb-650', product_name: 'Rismål lätt fett 1,5%', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 2.1, carbohydrates_100g: 19.9, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-651', product_name: 'Paella', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 11.0, carbohydrates_100g: 11.9, fat_100g: 6.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-652', product_name: 'Nudelsoppa m. risnudlar curry sesamolja', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 0.7, carbohydrates_100g: 10.3, fat_100g: 0.7, fiber_100g: 0.5 }},
    { code: 'lvsdb-653', product_name: 'Pasta okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 358.0, proteins_100g: 11.9, carbohydrates_100g: 71.5, fat_100g: 1.3, fiber_100g: 4.0 }},
    { code: 'lvsdb-654', product_name: 'Pasta kokt u. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 4.2, carbohydrates_100g: 25.8, fat_100g: 0.5, fiber_100g: 0.7 }},
    { code: 'lvsdb-655', product_name: 'Pasta fullkorn okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 345.0, proteins_100g: 11.0, carbohydrates_100g: 66.6, fat_100g: 1.5, fiber_100g: 8.8 }},
    { code: 'lvsdb-656', product_name: 'Pasta färsk m. ägg kokt u. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 5.3, carbohydrates_100g: 22.8, fat_100g: 1.6, fiber_100g: 1.7 }},
    { code: 'lvsdb-657', product_name: 'Stuvade makaroner', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 6.7, carbohydrates_100g: 22.1, fat_100g: 3.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-658', product_name: 'Pastagratäng makaronipudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 7.9, carbohydrates_100g: 13.4, fat_100g: 4.6, fiber_100g: 1.0 }},
    { code: 'lvsdb-659', product_name: 'Spagetti m. köttfärssås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 6.7, carbohydrates_100g: 17.0, fat_100g: 3.3, fiber_100g: 1.6 }},
    { code: 'lvsdb-660', product_name: 'Ravioli m. sås värmd frysvara el. konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 3.8, carbohydrates_100g: 14.7, fat_100g: 3.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-661', product_name: 'Tortellini m. kött kokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 157.0, proteins_100g: 5.6, carbohydrates_100g: 22.2, fat_100g: 4.3, fiber_100g: 3.0 }},
    { code: 'lvsdb-662', product_name: 'Lasagne m. spenat chèvre veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 6.7, carbohydrates_100g: 12.1, fat_100g: 7.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-663', product_name: 'Pastagratäng makaronipudding veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 6.4, carbohydrates_100g: 15.0, fat_100g: 3.9, fiber_100g: 1.1 }},
    { code: 'lvsdb-664', product_name: 'Lasagne värmd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 6.6, carbohydrates_100g: 14.4, fat_100g: 5.9, fiber_100g: 1.1 }},
    { code: 'lvsdb-665', product_name: 'Nudlar äggnudlar okokta', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 377.0, proteins_100g: 14.0, carbohydrates_100g: 68.2, fat_100g: 4.2, fiber_100g: 2.9 }},
    { code: 'lvsdb-666', product_name: 'Tortellini m. ostfyllning kokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 7.2, carbohydrates_100g: 25.7, fat_100g: 5.3, fiber_100g: 2.6 }},
    { code: 'lvsdb-667', product_name: 'Nudelsoppa olika smaker kryddad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.9, carbohydrates_100g: 9.4, fat_100g: 3.4, fiber_100g: 2.5 }},
    { code: 'lvsdb-668', product_name: 'Bondbönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 318.0, proteins_100g: 25.0, carbohydrates_100g: 41.9, fat_100g: 1.7, fiber_100g: 16.4 }},
    { code: 'lvsdb-669', product_name: 'Bruna bönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 317.0, proteins_100g: 22.0, carbohydrates_100g: 45.1, fat_100g: 1.5, fiber_100g: 16.4 }},
    { code: 'lvsdb-670', product_name: 'Kidney bönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 326.0, proteins_100g: 19.9, carbohydrates_100g: 48.6, fat_100g: 1.8, fiber_100g: 16.6 }},
    { code: 'lvsdb-671', product_name: 'Röda bönor torkade kokta u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 7.8, carbohydrates_100g: 14.5, fat_100g: 0.5, fiber_100g: 6.9 }},
    { code: 'lvsdb-672', product_name: 'Vita bönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 319.0, proteins_100g: 22.0, carbohydrates_100g: 45.7, fat_100g: 1.6, fiber_100g: 15.8 }},
    { code: 'lvsdb-673', product_name: 'Vita bönor torkade kokta u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 7.8, carbohydrates_100g: 14.2, fat_100g: 0.6, fiber_100g: 7.0 }},
    { code: 'lvsdb-674', product_name: 'Kikärtor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 331.0, proteins_100g: 18.8, carbohydrates_100g: 39.6, fat_100g: 5.1, fiber_100g: 25.2 }},
    { code: 'lvsdb-675', product_name: 'Mungbönor torkade kokta u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 8.6, carbohydrates_100g: 14.5, fat_100g: 0.7, fiber_100g: 6.1 }},
    { code: 'lvsdb-676', product_name: 'Linser torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 339.0, proteins_100g: 24.4, carbohydrates_100g: 52.5, fat_100g: 0.8, fiber_100g: 10.4 }},
    { code: 'lvsdb-677', product_name: 'Mungbönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 322.0, proteins_100g: 22.5, carbohydrates_100g: 46.1, fat_100g: 1.1, fiber_100g: 17.0 }},
    { code: 'lvsdb-678', product_name: 'Sojabönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 410.0, proteins_100g: 37.8, carbohydrates_100g: 10.2, fat_100g: 19.4, fiber_100g: 22.6 }},
    { code: 'lvsdb-679', product_name: 'Sojabönor torkade kokta u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 11.0, carbohydrates_100g: 5.8, fat_100g: 5.7, fiber_100g: 5.0 }},
    { code: 'lvsdb-680', product_name: 'Vignabönor svartögda bönor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 336.0, proteins_100g: 23.0, carbohydrates_100g: 52.1, fat_100g: 1.5, fiber_100g: 9.4 }},
    { code: 'lvsdb-681', product_name: 'Vignabönor svartögda bönor torkade kokta u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 5.1, carbohydrates_100g: 9.1, fat_100g: 0.3, fiber_100g: 4.7 }},
    { code: 'lvsdb-682', product_name: 'Gröna el. gula ärtor torkade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 317.0, proteins_100g: 21.5, carbohydrates_100g: 49.2, fat_100g: 1.0, fiber_100g: 10.7 }},
    { code: 'lvsdb-683', product_name: 'Ärtsoppa m. fläsk hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 6.4, carbohydrates_100g: 8.9, fat_100g: 2.1, fiber_100g: 2.3 }},
    { code: 'lvsdb-684', product_name: 'Gryta chili con carne', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 7.5, carbohydrates_100g: 7.8, fat_100g: 3.9, fiber_100g: 3.3 }},
    { code: 'lvsdb-685', product_name: 'Ärtsoppa fläsk tillagad konserv. m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 6.1, carbohydrates_100g: 7.1, fat_100g: 2.3, fiber_100g: 5.5 }},
    { code: 'lvsdb-686', product_name: 'Vita bönor m. tomatsås konserv.', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 5.1, carbohydrates_100g: 15.0, fat_100g: 0.5, fiber_100g: 4.9 }},
    { code: 'lvsdb-687', product_name: 'Bönsoppa vita bönor m. tomat veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 2.5, carbohydrates_100g: 4.9, fat_100g: 1.7, fiber_100g: 3.3 }},
    { code: 'lvsdb-688', product_name: 'Linssoppa veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 4.9, carbohydrates_100g: 14.1, fat_100g: 0.3, fiber_100g: 2.5 }},
    { code: 'lvsdb-689', product_name: 'Ärtsoppa veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 5.1, carbohydrates_100g: 12.0, fat_100g: 0.3, fiber_100g: 2.7 }},
    { code: 'lvsdb-690', product_name: 'Tofu fast', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 6.6, carbohydrates_100g: 1.2, fat_100g: 4.2, fiber_100g: 0.4 }},
    { code: 'lvsdb-691', product_name: 'Sojamjöl fett ca 20%', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 446.0, proteins_100g: 37.0, carbohydrates_100g: 16.0, fat_100g: 23.5, fiber_100g: 11.9 }},
    { code: 'lvsdb-692', product_name: 'Sojadryck', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 3.1, carbohydrates_100g: 1.9, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-693', product_name: 'Miso sojabönspasta fermenterad', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 208.0, proteins_100g: 9.7, carbohydrates_100g: 15.5, fat_100g: 10.5, fiber_100g: 6.5 }},
    { code: 'lvsdb-694', product_name: 'Sojasås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 7.5, carbohydrates_100g: 6.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-695', product_name: 'Sojasås söt', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 4.3, carbohydrates_100g: 38.5, fat_100g: 2.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-696', product_name: 'Korv veg. sojakorv konserv. fett 15%', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 199.0, proteins_100g: 12.0, carbohydrates_100g: 3.5, fat_100g: 15.0, fiber_100g: 2.0 }},
    { code: 'lvsdb-697', product_name: 'Glass sojaglass mjölkfri fett 11%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 2.2, carbohydrates_100g: 27.0, fat_100g: 11.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-698', product_name: 'Sojabönsbiff stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 180.0, proteins_100g: 7.2, carbohydrates_100g: 15.6, fat_100g: 9.2, fiber_100g: 3.3 }},
    { code: 'lvsdb-699', product_name: 'Korv veg. soja- och veteprotein tillagad typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 16.3, carbohydrates_100g: 9.3, fat_100g: 1.7, fiber_100g: 4.8 }},
    { code: 'lvsdb-700', product_name: 'Falafel kikärtsbiff friterad hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 158.0, proteins_100g: 6.8, carbohydrates_100g: 11.6, fat_100g: 7.2, fiber_100g: 10.2 }},
    { code: 'lvsdb-701', product_name: 'Lamm bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 20.1, carbohydrates_100g: 0.0, fat_100g: 5.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-702', product_name: 'Lamm kotlett rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 17.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-703', product_name: 'Lamm lägg rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 24.5, carbohydrates_100g: 0.0, fat_100g: 4.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-704', product_name: 'Lamm rygg el. hals rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 177.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 11.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-705', product_name: 'Lamm stek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 20.9, carbohydrates_100g: 0.0, fat_100g: 2.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-706', product_name: 'Lamm färs rå fett 20%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 17.4, carbohydrates_100g: 0.0, fat_100g: 19.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-707', product_name: 'Lamm tunnbringa rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 17.8, carbohydrates_100g: 0.0, fat_100g: 12.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-708', product_name: 'Lamm kotlett rå fett bortskuret', brands: 'Kött', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 2.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-709', product_name: 'Hare kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 21.5, carbohydrates_100g: 0.0, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-710', product_name: 'Hjort dovhjort bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 22.5, carbohydrates_100g: 0.0, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-711', product_name: 'Hjort dovhjort stek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 22.0, carbohydrates_100g: 0.0, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-712', product_name: 'Hjort ryggbiff rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 22.6, carbohydrates_100g: 0.0, fat_100g: 1.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-713', product_name: 'Häst kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 10.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-714', product_name: 'Kalv bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 19.9, carbohydrates_100g: 0.0, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-715', product_name: 'Kalv bringa rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 18.1, carbohydrates_100g: 0.0, fat_100g: 12.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-716', product_name: 'Kalv filé rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 2.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-717', product_name: 'Kalv fransyska rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 19.9, carbohydrates_100g: 0.0, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-718', product_name: 'Kalv innanlår rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 2.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-719', product_name: 'Kalv kotlett rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 122.0, proteins_100g: 20.5, carbohydrates_100g: 0.0, fat_100g: 4.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-720', product_name: 'Kalv lägg rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 1.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-721', product_name: 'Kalv ytterlår rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 21.2, carbohydrates_100g: 0.0, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-722', product_name: 'Kalv tunnbringa rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 173.0, proteins_100g: 18.7, carbohydrates_100g: 0.0, fat_100g: 11.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-723', product_name: 'Kalv högrev rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 19.2, carbohydrates_100g: 0.0, fat_100g: 6.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-724', product_name: 'Kanin kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 22.0, carbohydrates_100g: 0.0, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-725', product_name: 'Nöt clubstek biff rå m. ben', brands: 'Kött', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 19.7, carbohydrates_100g: 0.0, fat_100g: 9.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-726', product_name: 'Nöt ryggbiff rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 21.8, carbohydrates_100g: 0.0, fat_100g: 3.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-727', product_name: 'Nöt oxbringa rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 205.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 15.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-728', product_name: 'Nöt oxbringa rimmad rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 205.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 15.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-729', product_name: 'Nöt oxfilé rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 21.7, carbohydrates_100g: 0.0, fat_100g: 4.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-730', product_name: 'Nöt fransyska rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 20.8, carbohydrates_100g: 0.0, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-731', product_name: 'Nöt färs rå fett 10%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 182.0, proteins_100g: 20.1, carbohydrates_100g: 0.0, fat_100g: 11.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-732', product_name: 'Nöt högrev rå fett bortskuret', brands: 'Kött', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 20.6, carbohydrates_100g: 0.0, fat_100g: 6.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-733', product_name: 'Nöt innanlår rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 23.8, carbohydrates_100g: 0.0, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-734', product_name: 'Nöt lägg rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 20.5, carbohydrates_100g: 0.0, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-735', product_name: 'Nöt bog el. märgpipa rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 3.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-736', product_name: 'Nöt rostbiff rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 22.7, carbohydrates_100g: 0.0, fat_100g: 3.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-737', product_name: 'Nöt rulle rimmad rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 21.5, carbohydrates_100g: 0.0, fat_100g: 1.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-738', product_name: 'Nöt ytterlår rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 21.3, carbohydrates_100g: 0.0, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-739', product_name: 'Nöt entrecôte rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 21.7, carbohydrates_100g: 0.0, fat_100g: 6.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-740', product_name: 'Nöt grytbitar rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 20.6, carbohydrates_100g: 0.0, fat_100g: 6.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-741', product_name: 'Nöt kött hackebiff rå frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 159.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 8.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-742', product_name: 'Nöt färs rå fett 15%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 211.0, proteins_100g: 19.4, carbohydrates_100g: 0.0, fat_100g: 15.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-743', product_name: 'Ren stek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 22.6, carbohydrates_100g: 0.0, fat_100g: 1.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-744', product_name: 'Ren bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 23.3, carbohydrates_100g: 0.0, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-745', product_name: 'Ren skav rå frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 20.3, carbohydrates_100g: 0.0, fat_100g: 4.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-746', product_name: 'Rådjur kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 24.0, carbohydrates_100g: 0.0, fat_100g: 1.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-747', product_name: 'Gris bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 18.5, carbohydrates_100g: 0.0, fat_100g: 7.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-748', product_name: 'Gris fläskfilé rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 20.6, carbohydrates_100g: 0.0, fat_100g: 2.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-749', product_name: 'Gris fläskkotlett rå fettkant 5 mm', brands: 'Kött', nutriments: { 'energy-kcal_100g': 185.0, proteins_100g: 19.4, carbohydrates_100g: 0.0, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-750', product_name: 'Gris revbensspjäll rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 17.7, carbohydrates_100g: 0.0, fat_100g: 13.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-751', product_name: 'Gris fötter rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 207.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 12.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-752', product_name: 'Gris skinka julskinka rimmad rå fett ca 3%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 20.1, carbohydrates_100g: 0.0, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-753', product_name: 'Gris fläskben rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 17.7, carbohydrates_100g: 0.0, fat_100g: 13.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-754', product_name: 'Gris picnicbog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 19.5, carbohydrates_100g: 0.0, fat_100g: 4.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-755', product_name: 'Gris grytbitar rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 19.3, carbohydrates_100g: 0.0, fat_100g: 9.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-756', product_name: 'Gris fläskkarré rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 17.8, carbohydrates_100g: 0.0, fat_100g: 11.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-757', product_name: 'Gris färs rå fett 20%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 242.0, proteins_100g: 16.0, carbohydrates_100g: 0.0, fat_100g: 20.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-758', product_name: 'Gris bogbladsstek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 18.5, carbohydrates_100g: 0.0, fat_100g: 7.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-759', product_name: 'Gris fläskkotlett rå fett bortskuret', brands: 'Kött', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 21.6, carbohydrates_100g: 0.0, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-760', product_name: 'Gris fläskkotlett rå fettkant 2 mm', brands: 'Kött', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 6.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-761', product_name: 'Gris lägg putsad rå u. svål', brands: 'Kött', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 19.7, carbohydrates_100g: 0.0, fat_100g: 5.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-762', product_name: 'Gris sidfläsk bit rå m. svål', brands: 'Kött', nutriments: { 'energy-kcal_100g': 268.0, proteins_100g: 17.2, carbohydrates_100g: 0.0, fat_100g: 22.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-763', product_name: 'Gris stekfläsk sida skiva rå m. svål', brands: 'Kött', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 17.1, carbohydrates_100g: 0.0, fat_100g: 20.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-764', product_name: 'Gris flintastek rå m. svål', brands: 'Kött', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 18.8, carbohydrates_100g: 0.0, fat_100g: 13.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-765', product_name: 'Gris skinka innanlår rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 20.8, carbohydrates_100g: 0.0, fat_100g: 1.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-766', product_name: 'Gris skinka fransyska rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 2.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-767', product_name: 'Gris skinka ytterlår rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 19.7, carbohydrates_100g: 0.0, fat_100g: 4.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-768', product_name: 'Gris sidfläsk el. stekfläsk skivor rimmat rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 11.6, carbohydrates_100g: 0.0, fat_100g: 34.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-769', product_name: 'Gris färs rå fett 8%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 8.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-770', product_name: 'Älg skav rå frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 4.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-771', product_name: 'Nöt oxsvans rå fett bortskuret', brands: 'Kött', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 10.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-772', product_name: 'Gris svål rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 277.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 20.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-773', product_name: 'Häst hamburgerkött rökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-774', product_name: 'Nöt saltkött rimmat kokt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 22.5, carbohydrates_100g: 0.0, fat_100g: 2.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-775', product_name: 'Nöt kött rökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-776', product_name: 'Ren stek varmrökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 23.1, carbohydrates_100g: 0.1, fat_100g: 3.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-777', product_name: 'Ren kött torkat', brands: 'Kött', nutriments: { 'energy-kcal_100g': 330.0, proteins_100g: 40.0, carbohydrates_100g: 3.0, fat_100g: 17.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-778', product_name: 'Gris bacon rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 344.0, proteins_100g: 13.4, carbohydrates_100g: 0.0, fat_100g: 32.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-779', product_name: 'Gris bacon stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 412.0, proteins_100g: 17.0, carbohydrates_100g: 0.0, fat_100g: 38.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-780', product_name: 'Gris bog konserv. gelé 6-8%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 16.6, carbohydrates_100g: 0.2, fat_100g: 5.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-781', product_name: 'Gris kassler kotlettrad rökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 20.7, carbohydrates_100g: 0.5, fat_100g: 2.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-782', product_name: 'Gris skinka lufttorkad italiensk', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 31.9, carbohydrates_100g: 1.5, fat_100g: 12.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-783', product_name: 'Gris skinka rökt fett 6%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 6.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-784', product_name: 'Gris skinka skivad rökt fett 1-3%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 99.0, proteins_100g: 18.4, carbohydrates_100g: 1.3, fat_100g: 2.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-785', product_name: 'Gris sidfläsk rökt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 394.0, proteins_100g: 15.4, carbohydrates_100g: 0.0, fat_100g: 37.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-786', product_name: 'Nöt kött konserv.', brands: 'Kött', nutriments: { 'energy-kcal_100g': 218.0, proteins_100g: 27.0, carbohydrates_100g: 0.4, fat_100g: 12.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-787', product_name: 'Nöt flankstek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 22.0, carbohydrates_100g: 0.0, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-788', product_name: 'Nöt ryggbiff stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 25.5, carbohydrates_100g: 0.0, fat_100g: 4.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-789', product_name: 'Nöt entrecôte stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 165.0, proteins_100g: 25.2, carbohydrates_100g: 0.0, fat_100g: 7.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-790', product_name: 'Gris bog stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 163.0, proteins_100g: 22.0, carbohydrates_100g: 0.0, fat_100g: 8.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-791', product_name: 'Gris kött kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 22.7, carbohydrates_100g: 0.0, fat_100g: 9.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-792', product_name: 'Gris fläskben kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 225.0, proteins_100g: 20.6, carbohydrates_100g: 0.0, fat_100g: 15.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-793', product_name: 'Gris fläskfilé skiva stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 24.6, carbohydrates_100g: 0.0, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-794', product_name: 'Gris fläskkarré skiva stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 202.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 13.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-795', product_name: 'Gris fläskkotlett stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 217.0, proteins_100g: 22.7, carbohydrates_100g: 0.0, fat_100g: 14.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-796', product_name: 'Gris lägg kokt m. salt u. svål', brands: 'Kött', nutriments: { 'energy-kcal_100g': 149.0, proteins_100g: 23.3, carbohydrates_100g: 0.0, fat_100g: 6.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-797', product_name: 'Gris kött grillat', brands: 'Kött', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 22.7, carbohydrates_100g: 0.0, fat_100g: 9.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-798', product_name: 'Rullsylta', brands: 'Kött', nutriments: { 'energy-kcal_100g': 246.0, proteins_100g: 19.2, carbohydrates_100g: 0.0, fat_100g: 19.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-799', product_name: 'Gris fötter kokta m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 27.0, carbohydrates_100g: 0.0, fat_100g: 14.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-800', product_name: 'Hare stek stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 26.4, carbohydrates_100g: 0.0, fat_100g: 3.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-801', product_name: 'Kalv filé stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 3.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-802', product_name: 'Kalv kotlett stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 24.0, carbohydrates_100g: 0.0, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-803', product_name: 'Kalv kött kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 24.1, carbohydrates_100g: 0.0, fat_100g: 9.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-804', product_name: 'Kalv stek stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 24.6, carbohydrates_100g: 0.0, fat_100g: 2.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-805', product_name: 'Lamm kotlett stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 231.0, proteins_100g: 22.1, carbohydrates_100g: 0.0, fat_100g: 16.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-806', product_name: 'Lamm stek stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 24.0, carbohydrates_100g: 0.0, fat_100g: 2.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-807', product_name: 'Nöt högrev kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 26.1, carbohydrates_100g: 0.0, fat_100g: 8.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-808', product_name: 'Nöt stek el. grytstek kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 149.0, proteins_100g: 26.7, carbohydrates_100g: 0.0, fat_100g: 4.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-809', product_name: 'Nöt oxbringa rimmad kokt u. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 21.6, carbohydrates_100g: 0.0, fat_100g: 18.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-810', product_name: 'Oxrullad nöt stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 24.4, carbohydrates_100g: 0.9, fat_100g: 3.8, fiber_100g: 0.1 }},
    { code: 'lvsdb-811', product_name: 'Nöt rostbiff ugnsstekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 26.4, carbohydrates_100g: 0.0, fat_100g: 3.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-812', product_name: 'Gris revbensspjäll ugnsstekt grillat', brands: 'Kött', nutriments: { 'energy-kcal_100g': 294.0, proteins_100g: 16.9, carbohydrates_100g: 2.2, fat_100g: 24.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-813', product_name: 'Rådjur kött ugnsstekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 29.4, carbohydrates_100g: 0.0, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-814', product_name: 'Ren kött kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 133.0, proteins_100g: 28.2, carbohydrates_100g: 0.0, fat_100g: 2.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-815', product_name: 'Ren kött ugnsstekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 27.7, carbohydrates_100g: 0.0, fat_100g: 2.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-816', product_name: 'Älg stek ugnsstekt el. grillad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 27.0, carbohydrates_100g: 1.8, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-817', product_name: 'Gris fläskkarré tillagad u. sky', brands: 'Kött', nutriments: { 'energy-kcal_100g': 224.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 17.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-818', product_name: 'Gris skinkstek stekt u. sky frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 26.5, carbohydrates_100g: 0.0, fat_100g: 6.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-819', product_name: 'Nöt stek stekt u. sky frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 25.5, carbohydrates_100g: 0.0, fat_100g: 3.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-820', product_name: 'Nöt rostbiff tillagad ugnsrostad u. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 24.0, carbohydrates_100g: 0.0, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-821', product_name: 'Gris revbensspjäll tillagad u. sky', brands: 'Kött', nutriments: { 'energy-kcal_100g': 283.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 23.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-822', product_name: 'Gryta dillkött nöt m. sås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 8.2, carbohydrates_100g: 4.9, fat_100g: 6.8, fiber_100g: 0.6 }},
    { code: 'lvsdb-823', product_name: 'Biff stroganoff nöt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 13.1, carbohydrates_100g: 1.9, fat_100g: 9.9, fiber_100g: 0.5 }},
    { code: 'lvsdb-824', product_name: 'Rimmat sidfläsk el. stekfläsk stekt m. löksås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 199.0, proteins_100g: 6.5, carbohydrates_100g: 7.0, fat_100g: 16.2, fiber_100g: 0.4 }},
    { code: 'lvsdb-825', product_name: 'Rimmat sidfläsk panerat stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 373.0, proteins_100g: 14.1, carbohydrates_100g: 7.8, fat_100g: 32.0, fiber_100g: 0.9 }},
    { code: 'lvsdb-826', product_name: 'Fläskkotlett panerad stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 267.0, proteins_100g: 19.2, carbohydrates_100g: 6.7, fat_100g: 18.1, fiber_100g: 0.7 }},
    { code: 'lvsdb-827', product_name: 'Schnitzel gris stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 212.0, proteins_100g: 19.6, carbohydrates_100g: 9.7, fat_100g: 10.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-828', product_name: 'Gryta gulasch nöt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 8.3, carbohydrates_100g: 3.6, fat_100g: 2.8, fiber_100g: 0.9 }},
    { code: 'lvsdb-829', product_name: 'Gryta osso buco kalvläggsgryta ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 7.9, carbohydrates_100g: 4.0, fat_100g: 3.6, fiber_100g: 0.9 }},
    { code: 'lvsdb-830', product_name: 'Köttsoppa nöt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 4.5, carbohydrates_100g: 2.3, fat_100g: 1.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-831', product_name: 'Gryta lamm m. lök tomat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 8.4, carbohydrates_100g: 3.7, fat_100g: 4.9, fiber_100g: 0.8 }},
    { code: 'lvsdb-832', product_name: 'Pepparrotskött nöt m. lök morot sås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 13.7, carbohydrates_100g: 2.0, fat_100g: 7.8, fiber_100g: 0.5 }},
    { code: 'lvsdb-833', product_name: 'Renskav brynt m. matfett salt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 213.0, proteins_100g: 22.3, carbohydrates_100g: 0.0, fat_100g: 13.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-834', product_name: 'Gryta renskavsgryta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 8.2, carbohydrates_100g: 8.7, fat_100g: 7.6, fiber_100g: 0.8 }},
    { code: 'lvsdb-835', product_name: 'Skinksås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 8.4, carbohydrates_100g: 6.3, fat_100g: 6.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-836', product_name: 'Gryta kalops nöt hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 7.2, carbohydrates_100g: 3.0, fat_100g: 3.8, fiber_100g: 0.8 }},
    { code: 'lvsdb-837', product_name: 'Biff stroganoff nöt frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 11.9, carbohydrates_100g: 4.8, fat_100g: 4.4, fiber_100g: 0.4 }},
    { code: 'lvsdb-838', product_name: 'Gryta dillkött nöt m. sås frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 11.0, carbohydrates_100g: 2.7, fat_100g: 5.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-839', product_name: 'Kinesisk rätt gris friterat m. grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 185.0, proteins_100g: 6.8, carbohydrates_100g: 18.0, fat_100g: 9.4, fiber_100g: 0.5 }},
    { code: 'lvsdb-840', product_name: 'Gryta chop suey fläskfilé tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 7.2, carbohydrates_100g: 3.1, fat_100g: 5.7, fiber_100g: 1.6 }},
    { code: 'lvsdb-841', product_name: 'Nasi Goreng gris tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 176.0, proteins_100g: 7.9, carbohydrates_100g: 18.8, fat_100g: 7.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-842', product_name: 'Frikassé kalv frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 14.8, carbohydrates_100g: 2.5, fat_100g: 6.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-843', product_name: 'Gryta kalops nöt frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 14.2, carbohydrates_100g: 2.8, fat_100g: 6.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-844', product_name: 'Köttsoppa nöt tillagad konserv. m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 1.5, carbohydrates_100g: 1.0, fat_100g: 0.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-845', product_name: 'Kycklingburgare rå fett ca 7% frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 168.0, proteins_100g: 15.0, carbohydrates_100g: 11.0, fat_100g: 7.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-846', product_name: 'Köttbullar kyckling stekta fett 12% frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 224.0, proteins_100g: 16.0, carbohydrates_100g: 13.0, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-847', product_name: 'Hamburgare nöt rå frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 14.7, carbohydrates_100g: 2.0, fat_100g: 17.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-848', product_name: 'Köttbullar frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 217.0, proteins_100g: 12.3, carbohydrates_100g: 6.5, fat_100g: 15.6, fiber_100g: 1.5 }},
    { code: 'lvsdb-849', product_name: 'Pannbiff rå frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 204.0, proteins_100g: 13.2, carbohydrates_100g: 5.6, fat_100g: 14.4, fiber_100g: 0.3 }},
    { code: 'lvsdb-850', product_name: 'Burgare veg. soja- och veteprotein tillagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 16.3, carbohydrates_100g: 6.7, fat_100g: 7.7, fiber_100g: 5.3 }},
    { code: 'lvsdb-851', product_name: 'Biff à la Lindström stekt hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 12.3, carbohydrates_100g: 6.1, fat_100g: 8.1, fiber_100g: 0.7 }},
    { code: 'lvsdb-852', product_name: 'Köttbullar blandfärs stekta hemlagade', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 177.0, proteins_100g: 15.8, carbohydrates_100g: 5.8, fat_100g: 10.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-853', product_name: 'Köttfärslimpa ugnsstekt hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 14.0, carbohydrates_100g: 4.0, fat_100g: 7.7, fiber_100g: 0.3 }},
    { code: 'lvsdb-854', product_name: 'Köttfärssås i gjutjärn hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 8.3, carbohydrates_100g: 4.7, fat_100g: 5.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-855', product_name: 'Pannbiff gris stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 14.8, carbohydrates_100g: 4.3, fat_100g: 12.7, fiber_100g: 0.5 }},
    { code: 'lvsdb-856', product_name: 'Hamburgare nöt stekt fett 10%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 225.0, proteins_100g: 25.0, carbohydrates_100g: 0.0, fat_100g: 14.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-857', product_name: 'Hamburgare nöt stekt fett 15%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 251.0, proteins_100g: 23.8, carbohydrates_100g: 0.0, fat_100g: 17.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-858', product_name: 'Järpar blandfärs stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 204.0, proteins_100g: 13.1, carbohydrates_100g: 5.1, fat_100g: 14.6, fiber_100g: 0.7 }},
    { code: 'lvsdb-859', product_name: 'Frikadeller kalv', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 153.0, proteins_100g: 17.6, carbohydrates_100g: 4.5, fat_100g: 7.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-860', product_name: 'Wallenbergare kalv stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 16.7, carbohydrates_100g: 6.9, fat_100g: 16.7, fiber_100g: 0.8 }},
    { code: 'lvsdb-861', product_name: 'Köttfärssås nöt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 9.2, carbohydrates_100g: 4.7, fat_100g: 6.5, fiber_100g: 1.1 }},
    { code: 'lvsdb-862', product_name: 'Köttfärssoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 4.4, carbohydrates_100g: 2.3, fat_100g: 2.2, fiber_100g: 1.1 }},
    { code: 'lvsdb-863', product_name: 'Köttbullar nöt stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 16.6, carbohydrates_100g: 4.1, fat_100g: 9.7, fiber_100g: 0.5 }},
    { code: 'lvsdb-864', product_name: 'Köttbullar gris stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 183.0, proteins_100g: 14.3, carbohydrates_100g: 4.1, fat_100g: 12.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-865', product_name: 'Köttfärssås gris', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 7.6, carbohydrates_100g: 4.7, fat_100g: 9.5, fiber_100g: 1.1 }},
    { code: 'lvsdb-866', product_name: 'Nöt färs stekt tacokryddad hemlagad kryddning', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 22.2, carbohydrates_100g: 0.9, fat_100g: 16.9, fiber_100g: 0.4 }},
    { code: 'lvsdb-867', product_name: 'Pannbiff lamm stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 215.0, proteins_100g: 15.0, carbohydrates_100g: 4.2, fat_100g: 15.4, fiber_100g: 0.5 }},
    { code: 'lvsdb-868', product_name: 'Köttfärslimpa gris ugnsstekt hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 183.0, proteins_100g: 14.2, carbohydrates_100g: 4.2, fat_100g: 12.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-869', product_name: 'Köttfärslimpa blandfärs ugnsstekt hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 15.0, carbohydrates_100g: 4.2, fat_100g: 12.6, fiber_100g: 0.5 }},
    { code: 'lvsdb-870', product_name: 'Pannbiff nöt stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 178.0, proteins_100g: 17.3, carbohydrates_100g: 4.3, fat_100g: 10.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-871', product_name: 'Pannbiff blandfärs stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 15.7, carbohydrates_100g: 4.3, fat_100g: 13.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-872', product_name: 'Parisersmörgås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 11.4, carbohydrates_100g: 12.7, fat_100g: 9.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-873', product_name: 'Pannbiff älg stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 17.9, carbohydrates_100g: 4.0, fat_100g: 2.6, fiber_100g: 0.5 }},
    { code: 'lvsdb-874', product_name: 'Köttfärssås älg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 9.9, carbohydrates_100g: 4.6, fat_100g: 2.4, fiber_100g: 1.1 }},
    { code: 'lvsdb-875', product_name: 'Taco tacoskal m. köttfärs grönsaker ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 7.9, carbohydrates_100g: 6.6, fat_100g: 9.8, fiber_100g: 0.8 }},
    { code: 'lvsdb-876', product_name: 'Biff à la Lindström stekt frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 192.0, proteins_100g: 12.8, carbohydrates_100g: 5.8, fat_100g: 12.7, fiber_100g: 2.4 }},
    { code: 'lvsdb-877', product_name: 'Gryta biff m. bambuskott tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 8.2, carbohydrates_100g: 2.4, fat_100g: 5.8, fiber_100g: 1.2 }},
    { code: 'lvsdb-878', product_name: 'Hamburgare nöt stekt frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 260.0, proteins_100g: 14.0, carbohydrates_100g: 5.4, fat_100g: 20.3, fiber_100g: 0.8 }},
    { code: 'lvsdb-879', product_name: 'Kålpudding m. vitkål köttfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 6.6, carbohydrates_100g: 5.7, fat_100g: 5.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-880', product_name: 'Köttfärssås frysvara el. konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 6.1, carbohydrates_100g: 5.7, fat_100g: 5.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-881', product_name: 'Kåldolmar stekta u. sås frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 99.0, proteins_100g: 6.0, carbohydrates_100g: 4.6, fat_100g: 5.9, fiber_100g: 1.9 }},
    { code: 'lvsdb-882', product_name: 'Kåldolmar stekta värmda m. sås frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 4.8, carbohydrates_100g: 6.4, fat_100g: 5.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-883', product_name: 'Köttbullar stekta m. sås frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 8.0, carbohydrates_100g: 5.9, fat_100g: 10.0, fiber_100g: 0.1 }},
    { code: 'lvsdb-884', product_name: 'Pannbiff stekt frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 213.0, proteins_100g: 14.0, carbohydrates_100g: 7.6, fat_100g: 14.1, fiber_100g: 0.3 }},
    { code: 'lvsdb-885', product_name: 'Anka bröst rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 19.9, carbohydrates_100g: 0.0, fat_100g: 4.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-886', product_name: 'Anka rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 396.0, proteins_100g: 11.5, carbohydrates_100g: 0.0, fat_100g: 39.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-887', product_name: 'Duva rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 17.5, carbohydrates_100g: 0.0, fat_100g: 7.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-888', product_name: 'Duva rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 287.0, proteins_100g: 18.5, carbohydrates_100g: 0.0, fat_100g: 24.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-889', product_name: 'Fasan rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 127.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 3.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-890', product_name: 'Fasan rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 22.5, carbohydrates_100g: 0.0, fat_100g: 9.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-891', product_name: 'Gås rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 23.0, carbohydrates_100g: 0.0, fat_100g: 7.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-892', product_name: 'Gås rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 362.0, proteins_100g: 15.9, carbohydrates_100g: 0.0, fat_100g: 33.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-893', product_name: 'Höna rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 6.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-894', product_name: 'Höna rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 262.0, proteins_100g: 18.7, carbohydrates_100g: 0.0, fat_100g: 21.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-895', product_name: 'Kalkon filé rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 24.1, carbohydrates_100g: 0.0, fat_100g: 0.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-896', product_name: 'Kalkon rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 21.0, carbohydrates_100g: 0.0, fat_100g: 4.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-897', product_name: 'Kyckling kött rå u. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 21.5, carbohydrates_100g: 0.0, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-898', product_name: 'Kyckling kött rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 11.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-899', product_name: 'Kyckling bröstfilé rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 21.5, carbohydrates_100g: 0.0, fat_100g: 6.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-900', product_name: 'Kyckling lår rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 18.9, carbohydrates_100g: 0.0, fat_100g: 13.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-901', product_name: 'Kyckling vinge rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 19.2, carbohydrates_100g: 0.0, fat_100g: 12.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-902', product_name: 'Ripa rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 2.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-903', product_name: 'Kyckling bröstfilé färsk stekt u. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 23.0, carbohydrates_100g: 0.0, fat_100g: 2.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-904', product_name: 'Kyckling ben rå m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 19.3, carbohydrates_100g: 0.0, fat_100g: 13.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-905', product_name: 'Kyckling bröstfilé strimlad wokad u. skinn m. rapsolja', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 29.4, carbohydrates_100g: 0.0, fat_100g: 5.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-906', product_name: 'Kyckling bröstfilé rå u. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 23.1, carbohydrates_100g: 0.0, fat_100g: 1.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-907', product_name: 'Kyckling lår rå u. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 19.6, carbohydrates_100g: 0.0, fat_100g: 3.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-908', product_name: 'Kyckling delar marinerade m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 175.0, proteins_100g: 17.0, carbohydrates_100g: 0.0, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-909', product_name: 'Struts filé rå', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 23.0, carbohydrates_100g: 0.0, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-910', product_name: 'Struts filé stekt', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 30.0, carbohydrates_100g: 0.6, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-911', product_name: 'Kalkon kokt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 22.0, carbohydrates_100g: 0.0, fat_100g: 5.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-912', product_name: 'Duva m. skinn stekt m. salt', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 344.0, proteins_100g: 22.2, carbohydrates_100g: 0.0, fat_100g: 28.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-913', product_name: 'Kyckling kokt m. salt', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 32.0, carbohydrates_100g: 0.0, fat_100g: 4.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-914', product_name: 'Kyckling grillad m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 22.6, carbohydrates_100g: 0.0, fat_100g: 13.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-915', product_name: 'Fasan stekt m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 28.9, carbohydrates_100g: 0.0, fat_100g: 8.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-916', product_name: 'Gås stekt m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 324.0, proteins_100g: 25.9, carbohydrates_100g: 0.0, fat_100g: 24.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-917', product_name: 'Höna kokt m. salt', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 206.0, proteins_100g: 30.7, carbohydrates_100g: 0.0, fat_100g: 9.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-918', product_name: 'Kalkon stekt m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 161.0, proteins_100g: 26.8, carbohydrates_100g: 0.0, fat_100g: 5.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-919', product_name: 'Kyckling bröstfilé m. skinn stekt m. salt', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 187.0, proteins_100g: 27.1, carbohydrates_100g: 0.0, fat_100g: 8.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-920', product_name: 'Ripa stekt', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 30.0, carbohydrates_100g: 0.0, fat_100g: 2.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-921', product_name: 'Kyckling kött kokt stekt grillat', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 23.3, carbohydrates_100g: 0.0, fat_100g: 5.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-922', product_name: 'Kalkon rökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 133.0, proteins_100g: 24.0, carbohydrates_100g: 0.0, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-923', product_name: 'Kyckling marinerad grillad m. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 19.7, carbohydrates_100g: 0.0, fat_100g: 9.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-924', product_name: 'Kyckling friterad m. frityrsmet', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 310.0, proteins_100g: 22.5, carbohydrates_100g: 5.8, fat_100g: 21.9, fiber_100g: 0.7 }},
    { code: 'lvsdb-925', product_name: 'Ostsufflé', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 10.9, carbohydrates_100g: 6.7, fat_100g: 11.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-926', product_name: 'Bondomelett', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 122.0, proteins_100g: 6.7, carbohydrates_100g: 8.8, fat_100g: 6.5, fiber_100g: 1.2 }},
    { code: 'lvsdb-927', product_name: 'Braxen rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 16.7, carbohydrates_100g: 0.0, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-928', product_name: 'Regnbågslax rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 160.0, proteins_100g: 18.6, carbohydrates_100g: 0.0, fat_100g: 9.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-929', product_name: 'Sej rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 19.1, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-930', product_name: 'Hälleflundra vild rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 15.5, carbohydrates_100g: 0.0, fat_100g: 8.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-931', product_name: 'Kycklingsoppa thailändsk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 7.8, carbohydrates_100g: 1.5, fat_100g: 3.5, fiber_100g: 0.6 }},
    { code: 'lvsdb-932', product_name: 'Kyckling nugget friterad tillagad på restaurang', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 16.8, carbohydrates_100g: 14.2, fat_100g: 10.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-933', product_name: 'Kycklingsoppa tillagad redd pulver m. vatten mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.9, carbohydrates_100g: 5.1, fat_100g: 2.4, fiber_100g: 1.0 }},
    { code: 'lvsdb-934', product_name: 'Kycklingsoppa tillagad redd pulver m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 0.6, carbohydrates_100g: 5.8, fat_100g: 1.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-935', product_name: 'Kalvbuljong pasta el. pulver storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 18.8, carbohydrates_100g: 18.5, fat_100g: 8.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-936', product_name: 'Kalvbuljong pasta el. pulver lågsalt storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 25.0, carbohydrates_100g: 35.0, fat_100g: 5.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-937', product_name: 'Köttbuljong pasta el. pulver storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 201.0, proteins_100g: 15.2, carbohydrates_100g: 23.4, fat_100g: 5.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-938', product_name: 'Köttbuljong pasta el. pulver lågsalt storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 10.0, carbohydrates_100g: 39.0, fat_100g: 4.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-939', product_name: 'Skinkbuljong pasta el. pulver storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 19.5, carbohydrates_100g: 13.5, fat_100g: 13.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-940', product_name: 'Hönsbuljong pasta el. pulver lågsalt storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 320.0, proteins_100g: 14.0, carbohydrates_100g: 32.0, fat_100g: 15.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-941', product_name: 'Hönsbuljong pasta el. pulver storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 14.7, carbohydrates_100g: 16.2, fat_100g: 12.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-942', product_name: 'Köttbuljong pulver tärning', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 20.0, carbohydrates_100g: 5.0, fat_100g: 3.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-943', product_name: 'Köttbuljong konserv. ätf.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 7.0, proteins_100g: 1.2, carbohydrates_100g: 0.0, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-944', product_name: 'Gelatinblad el. gelatinpulver', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 86.0, carbohydrates_100g: 0.0, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-945', product_name: 'Köttbuljong tärning ätf.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 4.0, proteins_100g: 0.3, carbohydrates_100g: 0.5, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-946', product_name: 'Köttbuljong ätf.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 8.0, proteins_100g: 0.4, carbohydrates_100g: 1.2, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-947', product_name: 'Hönsbuljong ätf.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 5.0, proteins_100g: 0.3, carbohydrates_100g: 0.2, fat_100g: 0.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-948', product_name: 'Ägg rått', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 12.2, carbohydrates_100g: 0.4, fat_100g: 9.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-949', product_name: 'Äggula rå', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 319.0, proteins_100g: 15.6, carbohydrates_100g: 0.6, fat_100g: 28.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-950', product_name: 'Äggvita rå', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 45.0, proteins_100g: 10.8, carbohydrates_100g: 0.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-951', product_name: 'Fransk omelett m. grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 237.0, proteins_100g: 10.5, carbohydrates_100g: 1.2, fat_100g: 21.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-952', product_name: 'Fransk omelett m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 173.0, proteins_100g: 10.1, carbohydrates_100g: 0.3, fat_100g: 14.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-953', product_name: 'Sufflé gräddad u. fyllning veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 11.2, carbohydrates_100g: 5.9, fat_100g: 11.4, fiber_100g: 0.2 }},
    { code: 'lvsdb-954', product_name: 'Äggakaka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 6.9, carbohydrates_100g: 9.9, fat_100g: 6.4, fiber_100g: 0.3 }},
    { code: 'lvsdb-955', product_name: 'Ägg stekt', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 188.0, proteins_100g: 13.3, carbohydrates_100g: 0.5, fat_100g: 15.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-956', product_name: 'Skinklåda m. mjölk ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 7.3, carbohydrates_100g: 7.2, fat_100g: 3.6, fiber_100g: 1.2 }},
    { code: 'lvsdb-957', product_name: 'Torsksufflé', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 20.2, carbohydrates_100g: 4.5, fat_100g: 3.2, fiber_100g: 0.1 }},
    { code: 'lvsdb-958', product_name: 'Kolja rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 19.4, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-959', product_name: 'Kummel rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 16.5, carbohydrates_100g: 0.0, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-960', product_name: 'Siklöja rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 6.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-961', product_name: 'Sill rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 16.7, carbohydrates_100g: 0.0, fat_100g: 9.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-962', product_name: 'Flundra rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 94.0, proteins_100g: 18.3, carbohydrates_100g: 0.0, fat_100g: 2.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-963', product_name: 'Strömming rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-964', product_name: 'Röding rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 19.9, carbohydrates_100g: 0.0, fat_100g: 7.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-965', product_name: 'Torsk rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 18.2, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-966', product_name: 'Vitling rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 18.3, carbohydrates_100g: 0.0, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-967', product_name: 'Ål rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 369.0, proteins_100g: 17.3, carbohydrates_100g: 2.8, fat_100g: 32.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-968', product_name: 'Öring odlad rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 10.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-969', product_name: 'Pinklax rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 21.4, carbohydrates_100g: 0.0, fat_100g: 2.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-970', product_name: 'Piggvar rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 16.7, carbohydrates_100g: 0.0, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-971', product_name: 'Sik urtagen varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 21.8, carbohydrates_100g: 0.0, fat_100g: 5.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-972', product_name: 'Abborre rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-973', product_name: 'Lax odlad Norge fjordlax rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 210.0, proteins_100g: 20.2, carbohydrates_100g: 0.7, fat_100g: 14.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-974', product_name: 'Öring Sverige rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 22.0, carbohydrates_100g: 0.0, fat_100g: 2.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-975', product_name: 'Lake rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 16.5, carbohydrates_100g: 0.0, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-976', product_name: 'Rödspätta rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 12.4, carbohydrates_100g: 0.0, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-977', product_name: 'Sik rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 90.0, proteins_100g: 20.9, carbohydrates_100g: 0.0, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-978', product_name: 'Makrill rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 290.0, proteins_100g: 17.0, carbohydrates_100g: 0.0, fat_100g: 25.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-979', product_name: 'Regnbågslax odlad rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 18.1, carbohydrates_100g: 0.4, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-980', product_name: 'Gädda rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 20.2, carbohydrates_100g: 0.0, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-981', product_name: 'Gös rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 20.2, carbohydrates_100g: 0.0, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-982', product_name: 'Ansjovis skarpsill konserv. ', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 215.0, proteins_100g: 12.5, carbohydrates_100g: 11.8, fat_100g: 13.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-983', product_name: 'Böckling varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 199.0, proteins_100g: 21.2, carbohydrates_100g: 0.0, fat_100g: 12.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-984', product_name: 'Fisk torkad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 333.0, proteins_100g: 79.0, carbohydrates_100g: 0.0, fat_100g: 1.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-985', product_name: 'Lax kallrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 173.0, proteins_100g: 20.0, carbohydrates_100g: 1.3, fat_100g: 9.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-986', product_name: 'Sardeller konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 19.2, carbohydrates_100g: 0.3, fat_100g: 10.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-987', product_name: 'Sardiner i olja konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 284.0, proteins_100g: 24.0, carbohydrates_100g: 0.0, fat_100g: 21.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-988', product_name: 'Sardiner i tomatsås konserv.', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 217.0, proteins_100g: 20.5, carbohydrates_100g: 0.6, fat_100g: 14.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-989', product_name: 'Saltsill rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 19.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-990', product_name: 'Saltströmming rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 7.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-991', product_name: 'Tonfisk i olja konserv. avrunnen', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 24.9, carbohydrates_100g: 0.0, fat_100g: 9.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-992', product_name: 'Ål varmrökt rundrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 347.0, proteins_100g: 19.1, carbohydrates_100g: 0.0, fat_100g: 30.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-993', product_name: 'Tonfisk i vatten konserv. avrunnen', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 24.1, carbohydrates_100g: 0.0, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-994', product_name: 'Makrill urtagen varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 296.0, proteins_100g: 19.4, carbohydrates_100g: 0.0, fat_100g: 24.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-995', product_name: 'Lutfisk rå frysvara', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 6.3, carbohydrates_100g: 0.0, fat_100g: 0.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-996', product_name: 'Sill matjessill konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 210.0, proteins_100g: 9.5, carbohydrates_100g: 17.1, fat_100g: 11.5, fiber_100g: 0.4 }},
    { code: 'lvsdb-997', product_name: 'Marulk rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 65.0, proteins_100g: 15.8, carbohydrates_100g: 0.0, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-998', product_name: 'Makrill filé i olja konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 324.0, proteins_100g: 18.9, carbohydrates_100g: 0.0, fat_100g: 28.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-999', product_name: 'Saltsill urvattnad konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 208.0, proteins_100g: 16.5, carbohydrates_100g: 0.0, fat_100g: 16.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1000', product_name: 'Lax gravad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 18.8, carbohydrates_100g: 3.1, fat_100g: 8.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1001', product_name: 'Lax rimmad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 18.8, carbohydrates_100g: 0.0, fat_100g: 8.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1002', product_name: 'Böckling dubbelfilé varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 261.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 20.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1003', product_name: 'Lax varmrökt urtagen', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 220.0, proteins_100g: 21.9, carbohydrates_100g: 0.1, fat_100g: 14.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1004', product_name: 'Makrill filé varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 327.0, proteins_100g: 20.1, carbohydrates_100g: 0.0, fat_100g: 27.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1005', product_name: 'Regnbågslax kallrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 190.0, proteins_100g: 20.4, carbohydrates_100g: 0.0, fat_100g: 12.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1006', product_name: 'Regnbågslax urtagen varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 157.0, proteins_100g: 21.9, carbohydrates_100g: 0.0, fat_100g: 7.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1007', product_name: 'Röding urtagen varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 163.0, proteins_100g: 21.4, carbohydrates_100g: 0.0, fat_100g: 8.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1008', product_name: 'Ål varmrökt flatrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 428.0, proteins_100g: 17.8, carbohydrates_100g: 0.0, fat_100g: 40.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1009', product_name: 'Fiskpinnar stekta', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 223.0, proteins_100g: 11.7, carbohydrates_100g: 16.8, fat_100g: 12.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1010', product_name: 'Makrill filé i tomatsås konserv.', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 11.7, carbohydrates_100g: 3.9, fat_100g: 13.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1011', product_name: 'Surströmming', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 11.8, carbohydrates_100g: 0.0, fat_100g: 3.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1012', product_name: 'Lutfisk kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 5.9, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1013', product_name: 'Saltsill panerad stekt hemlagad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 289.0, proteins_100g: 14.1, carbohydrates_100g: 4.0, fat_100g: 24.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-1014', product_name: 'Strömmingsflundra panerad stekt hemlagad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 15.2, carbohydrates_100g: 4.1, fat_100g: 19.2, fiber_100g: 0.3 }},
    { code: 'lvsdb-1015', product_name: 'Torsk filé panerad stekt hemlagad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 17.6, carbohydrates_100g: 4.5, fat_100g: 6.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-1016', product_name: 'Ål inkokt hemlagad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 382.0, proteins_100g: 15.8, carbohydrates_100g: 0.0, fat_100g: 36.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1017', product_name: 'Ål ugnsstekt hemlagad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 437.0, proteins_100g: 16.1, carbohydrates_100g: 3.2, fat_100g: 40.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1018', product_name: 'Abborre kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 32.3, carbohydrates_100g: 0.0, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1019', product_name: 'Abborre filé panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 195.0, proteins_100g: 22.3, carbohydrates_100g: 6.3, fat_100g: 8.8, fiber_100g: 0.5 }},
    { code: 'lvsdb-1020', product_name: 'Fisk friterad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 212.0, proteins_100g: 15.4, carbohydrates_100g: 12.0, fat_100g: 11.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-1021', product_name: 'Regnbågslax inkokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 22.2, carbohydrates_100g: 0.0, fat_100g: 11.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1022', product_name: 'Regnbågslax panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 19.1, carbohydrates_100g: 5.7, fat_100g: 14.6, fiber_100g: 0.5 }},
    { code: 'lvsdb-1023', product_name: 'Gädda kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 32.9, carbohydrates_100g: 0.0, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1024', product_name: 'Gädda panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 22.6, carbohydrates_100g: 6.3, fat_100g: 8.4, fiber_100g: 0.5 }},
    { code: 'lvsdb-1025', product_name: 'Hälleflundra kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 168.0, proteins_100g: 18.8, carbohydrates_100g: 0.0, fat_100g: 10.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1026', product_name: 'Hälleflundra panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 16.3, carbohydrates_100g: 5.7, fat_100g: 13.9, fiber_100g: 0.5 }},
    { code: 'lvsdb-1027', product_name: 'Kolja kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 31.9, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1028', product_name: 'Kolja panerad stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 21.9, carbohydrates_100g: 6.3, fat_100g: 8.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-1029', product_name: 'Lax stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 24.1, carbohydrates_100g: 0.8, fat_100g: 13.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1030', product_name: 'Lax kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 246.0, proteins_100g: 23.7, carbohydrates_100g: 0.8, fat_100g: 16.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1031', product_name: 'Makrill kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 332.0, proteins_100g: 19.4, carbohydrates_100g: 0.0, fat_100g: 28.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1032', product_name: 'Makrill panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 324.0, proteins_100g: 17.5, carbohydrates_100g: 5.7, fat_100g: 25.9, fiber_100g: 0.5 }},
    { code: 'lvsdb-1033', product_name: 'Makrill stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 295.0, proteins_100g: 20.4, carbohydrates_100g: 0.0, fat_100g: 24.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1034', product_name: 'Piggvar kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 27.6, carbohydrates_100g: 0.0, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1035', product_name: 'Rödspätta filé kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 21.5, carbohydrates_100g: 0.0, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1036', product_name: 'Rödspätta filé panerad stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 169.0, proteins_100g: 15.1, carbohydrates_100g: 6.5, fat_100g: 9.1, fiber_100g: 0.6 }},
    { code: 'lvsdb-1037', product_name: 'Rödspätta filé stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 0.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1038', product_name: 'Sik kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 33.7, carbohydrates_100g: 0.0, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1039', product_name: 'Sik panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 23.3, carbohydrates_100g: 6.3, fat_100g: 8.8, fiber_100g: 0.5 }},
    { code: 'lvsdb-1040', product_name: 'Saltsill kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 246.0, proteins_100g: 19.5, carbohydrates_100g: 0.0, fat_100g: 19.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1041', product_name: 'Sill panerad stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 219.0, proteins_100g: 17.4, carbohydrates_100g: 6.0, fat_100g: 13.7, fiber_100g: 1.0 }},
    { code: 'lvsdb-1042', product_name: 'Strömming kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 131.0, proteins_100g: 21.8, carbohydrates_100g: 0.0, fat_100g: 4.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1043', product_name: 'Ättikströmming', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 220.0, proteins_100g: 12.2, carbohydrates_100g: 8.4, fat_100g: 15.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-1044', product_name: 'Kräftströmming', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 16.5, carbohydrates_100g: 1.0, fat_100g: 3.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-1045', product_name: 'Strömming filé stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 122.0, proteins_100g: 21.6, carbohydrates_100g: 0.0, fat_100g: 3.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1046', product_name: 'Tonfisk stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 29.2, carbohydrates_100g: 0.7, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1047', product_name: 'Torsk filé kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 30.3, carbohydrates_100g: 0.0, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1048', product_name: 'Torsk panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 20.8, carbohydrates_100g: 6.3, fat_100g: 8.8, fiber_100g: 0.6 }},
    { code: 'lvsdb-1049', product_name: 'Torsk stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 25.2, carbohydrates_100g: 0.0, fat_100g: 0.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1050', product_name: 'Vitling kokt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 30.2, carbohydrates_100g: 0.0, fat_100g: 1.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1051', product_name: 'Vitling filé panerad stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 190.0, proteins_100g: 20.8, carbohydrates_100g: 6.3, fat_100g: 8.9, fiber_100g: 0.6 }},
    { code: 'lvsdb-1052', product_name: 'Fisk varmrökt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 21.7, carbohydrates_100g: 0.1, fat_100g: 15.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1053', product_name: 'Fiskbullar konserv. u. buljong', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 6.9, carbohydrates_100g: 5.8, fat_100g: 2.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1054', product_name: 'Fiskbullar m. hummersås konserv. tillagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 4.8, carbohydrates_100g: 7.4, fat_100g: 4.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1055', product_name: 'Laxpastej lättrökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 355.0, proteins_100g: 12.0, carbohydrates_100g: 10.0, fat_100g: 30.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1056', product_name: 'Böcklingpastej', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 364.0, proteins_100g: 13.0, carbohydrates_100g: 9.0, fat_100g: 31.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1057', product_name: 'Fiskpudding m. ris hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 11.4, carbohydrates_100g: 4.5, fat_100g: 5.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-1058', product_name: 'Fiskgratäng u. potatismos hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 11.4, carbohydrates_100g: 4.5, fat_100g: 5.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-1059', product_name: 'Böcklinglåda m. äggstanning', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 158.0, proteins_100g: 15.4, carbohydrates_100g: 2.1, fat_100g: 9.8, fiber_100g: 0.2 }},
    { code: 'lvsdb-1060', product_name: 'Fiskbullar panerade stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 5.7, carbohydrates_100g: 11.5, fat_100g: 10.5, fiber_100g: 0.5 }},
    { code: 'lvsdb-1061', product_name: 'Fisksoppa bouillabaisse', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 8.5, carbohydrates_100g: 1.5, fat_100g: 3.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-1062', product_name: 'Fiskpaté m. räkor', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 205.0, proteins_100g: 15.6, carbohydrates_100g: 3.4, fat_100g: 14.5, fiber_100g: 0.1 }},
    { code: 'lvsdb-1063', product_name: 'Fiskfärs kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 15.5, carbohydrates_100g: 8.5, fat_100g: 2.0, fiber_100g: 0.2 }},
    { code: 'lvsdb-1064', product_name: 'Fiskgratäng m. dillsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 153.0, proteins_100g: 10.2, carbohydrates_100g: 5.3, fat_100g: 10.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-1065', product_name: 'Fiskgratäng m. räkor u. potatismos', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 11.3, carbohydrates_100g: 4.6, fat_100g: 8.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-1066', product_name: 'Laxmousse', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 232.0, proteins_100g: 11.3, carbohydrates_100g: 2.5, fat_100g: 19.8, fiber_100g: 0.3 }},
    { code: 'lvsdb-1067', product_name: 'Sillbullar', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 9.0, carbohydrates_100g: 13.7, fat_100g: 11.0, fiber_100g: 1.8 }},
    { code: 'lvsdb-1068', product_name: 'Sillsallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 94.0, proteins_100g: 4.3, carbohydrates_100g: 10.3, fat_100g: 3.5, fiber_100g: 1.4 }},
    { code: 'lvsdb-1069', product_name: 'Sushi nigiri m. lax', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 9.8, carbohydrates_100g: 22.3, fat_100g: 5.9, fiber_100g: 1.0 }},
    { code: 'lvsdb-1070', product_name: 'Sushi nigiri m. hälleflundra', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 157.0, proteins_100g: 7.3, carbohydrates_100g: 23.6, fat_100g: 3.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-1071', product_name: 'Sushi nigiri m. tonfisk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 8.1, carbohydrates_100g: 26.6, fat_100g: 0.4, fiber_100g: 1.1 }},
    { code: 'lvsdb-1072', product_name: 'Sushi rulle m. crabfish gurka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 4.4, carbohydrates_100g: 30.2, fat_100g: 0.4, fiber_100g: 0.9 }},
    { code: 'lvsdb-1073', product_name: 'Sallad m. tonfisk potatis bönor tomat sallad u. dressing', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 8.7, carbohydrates_100g: 5.9, fat_100g: 4.0, fiber_100g: 1.3 }},
    { code: 'lvsdb-1074', product_name: 'Fisk m. mandel ströbröd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 177.0, proteins_100g: 14.0, carbohydrates_100g: 5.3, fat_100g: 11.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1075', product_name: 'Fiskgratäng m. potatismos dillsås tillagad frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 7.9, carbohydrates_100g: 12.6, fat_100g: 4.5, fiber_100g: 1.3 }},
    { code: 'lvsdb-1076', product_name: 'Laxpaté', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 13.1, carbohydrates_100g: 0.9, fat_100g: 18.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-1077', product_name: 'Fiskgratäng m. potatismos räksås tillagad frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 7.6, carbohydrates_100g: 10.4, fat_100g: 4.0, fiber_100g: 1.3 }},
    { code: 'lvsdb-1078', product_name: 'Fiskrom torsk sill rå', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 24.5, carbohydrates_100g: 0.0, fat_100g: 2.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1079', product_name: 'Påläggskaviar orökt', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 187.0, proteins_100g: 15.3, carbohydrates_100g: 23.6, fat_100g: 3.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1080', product_name: 'Påläggskaviar original', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 414.0, proteins_100g: 8.8, carbohydrates_100g: 15.2, fat_100g: 35.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1081', product_name: 'Påläggskaviar lätt', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 9.0, carbohydrates_100g: 23.0, fat_100g: 15.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1082', product_name: 'Stenbitsrom', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 10.6, carbohydrates_100g: 2.5, fat_100g: 3.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1083', product_name: 'Löjrom saltad', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 24.5, carbohydrates_100g: 1.5, fat_100g: 2.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1084', product_name: 'Bläckfisk rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 15.4, carbohydrates_100g: 1.4, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1085', product_name: 'Blåmussla kokt m. vin avrunnen', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 18.5, carbohydrates_100g: 2.3, fat_100g: 3.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1086', product_name: 'Ostron', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 55.0, proteins_100g: 9.3, carbohydrates_100g: 0.0, fat_100g: 2.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1087', product_name: 'Snigel vinbergssnäcka', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 87.0, proteins_100g: 16.1, carbohydrates_100g: 2.2, fat_100g: 1.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1088', product_name: 'Groda lår rått frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 16.4, carbohydrates_100g: 0.0, fat_100g: 0.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1089', product_name: 'Mussla konserv. m. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 7.9, carbohydrates_100g: 3.1, fat_100g: 0.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1090', product_name: 'Mussla konserv. u. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 16.9, carbohydrates_100g: 4.7, fat_100g: 2.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1091', product_name: 'Ostron konserv. m. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 9.5, carbohydrates_100g: 0.0, fat_100g: 2.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1092', product_name: 'Krabba Blå krabba kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 1.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1093', product_name: 'Hummer kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 19.0, carbohydrates_100g: 0.0, fat_100g: 0.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1094', product_name: 'Kräfta kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 15.6, carbohydrates_100g: 0.2, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1095', product_name: 'Räka kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1096', product_name: 'Hummer kokt el. konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 90.0, proteins_100g: 18.7, carbohydrates_100g: 0.1, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1097', product_name: 'Krabba kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 19.7, carbohydrates_100g: 2.2, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1098', product_name: 'Krabba konserv.', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 17.4, carbohydrates_100g: 1.3, fat_100g: 2.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1099', product_name: 'Räka konserv. m. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 16.2, carbohydrates_100g: 1.0, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1100', product_name: 'Räka konserv. u. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 73.0, proteins_100g: 16.2, carbohydrates_100g: 1.2, fat_100g: 0.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1101', product_name: 'Havskräfta kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 17.2, carbohydrates_100g: 0.0, fat_100g: 0.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1102', product_name: 'Räka friterad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 287.0, proteins_100g: 10.6, carbohydrates_100g: 27.8, fat_100g: 14.8, fiber_100g: 0.2 }},
    { code: 'lvsdb-1103', product_name: 'Räka friterad tillagad på restaurang', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 387.0, proteins_100g: 6.9, carbohydrates_100g: 24.7, fat_100g: 29.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-1104', product_name: 'Bläckfisk friterad panerad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 18.6, carbohydrates_100g: 15.2, fat_100g: 17.4, fiber_100g: 0.2 }},
    { code: 'lvsdb-1105', product_name: 'Bläckfisk friterad panerad tillagad på restaurang', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 11.2, carbohydrates_100g: 19.1, fat_100g: 17.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1106', product_name: 'Sallad m. räkor sparris tomat champinjoner ägg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 6.2, carbohydrates_100g: 1.4, fat_100g: 4.3, fiber_100g: 0.9 }},
    { code: 'lvsdb-1107', product_name: 'Räka stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 6.8, carbohydrates_100g: 4.2, fat_100g: 9.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-1108', product_name: 'Räksoppa ätf.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 4.8, carbohydrates_100g: 2.7, fat_100g: 5.6, fiber_100g: 0.4 }},
    { code: 'lvsdb-1109', product_name: 'Västkustsallad m. musslor räkor champinjon dressing hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 6.2, carbohydrates_100g: 2.6, fat_100g: 7.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-1110', product_name: 'Västkustsallad m. musslor räkor champinjon hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 7.2, carbohydrates_100g: 2.3, fat_100g: 0.9, fiber_100g: 1.2 }},
    { code: 'lvsdb-1111', product_name: 'Medelhavssallad m. tonfisk skaldjur majonnäsdressing sallad tomat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 7.4, carbohydrates_100g: 2.5, fat_100g: 9.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-1112', product_name: 'Skaldjurspaté', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 11.7, carbohydrates_100g: 2.3, fat_100g: 10.2, fiber_100g: 2.1 }},
    { code: 'lvsdb-1113', product_name: 'Räksoppa tillagad pulver m. vatten mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 2.1, carbohydrates_100g: 5.8, fat_100g: 2.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-1114', product_name: 'Fiskbuljong pasta el. pulver storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 25.0, carbohydrates_100g: 17.5, fat_100g: 4.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1115', product_name: 'Fiskbuljong pasta el. pulver lågsalt storhushåll', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 267.0, proteins_100g: 35.0, carbohydrates_100g: 23.0, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1116', product_name: 'Fisk och skaldjurssås tillagad pulver m. mjölk vatten smör typ Smögen', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 2.7, carbohydrates_100g: 8.2, fat_100g: 7.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1117', product_name: 'Fiskbuljong ätf.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 4.0, proteins_100g: 0.3, carbohydrates_100g: 0.3, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1118', product_name: 'Gris blod rått', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 73.0, proteins_100g: 16.6, carbohydrates_100g: 0.4, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1119', product_name: 'Nöt blod rått', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 16.4, carbohydrates_100g: 0.0, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1120', product_name: 'Hårt bröd blodbröd fullkorn', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 366.0, proteins_100g: 17.7, carbohydrates_100g: 65.5, fat_100g: 1.9, fiber_100g: 6.0 }},
    { code: 'lvsdb-1121', product_name: 'Blodpudding blodkorv fett 19%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 301.0, proteins_100g: 10.6, carbohydrates_100g: 21.0, fat_100g: 19.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-1122', product_name: 'Blodpalt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 8.6, carbohydrates_100g: 21.9, fat_100g: 4.2, fiber_100g: 4.7 }},
    { code: 'lvsdb-1123', product_name: 'Blodpudding blodkorv fett 14%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 254.0, proteins_100g: 11.0, carbohydrates_100g: 20.0, fat_100g: 14.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-1124', product_name: 'Blodbröd paltbröd frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 286.0, proteins_100g: 14.4, carbohydrates_100g: 47.8, fat_100g: 2.8, fiber_100g: 4.7 }},
    { code: 'lvsdb-1125', product_name: 'Blodpudding blodkorv fett 10%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 202.0, proteins_100g: 12.0, carbohydrates_100g: 17.3, fat_100g: 9.0, fiber_100g: 2.0 }},
    { code: 'lvsdb-1126', product_name: 'Blodpudding blodkorv stekt fett 13%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 261.0, proteins_100g: 11.3, carbohydrates_100g: 20.5, fat_100g: 14.4, fiber_100g: 2.4 }},
    { code: 'lvsdb-1127', product_name: 'Blodpudding blodkorv stekt fett 8%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 208.0, proteins_100g: 12.4, carbohydrates_100g: 17.8, fat_100g: 9.3, fiber_100g: 2.1 }},
    { code: 'lvsdb-1128', product_name: 'Blodbröd paltbröd kokt m. salt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 5.6, carbohydrates_100g: 18.6, fat_100g: 1.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-1129', product_name: 'Lamm bräss rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 131.0, proteins_100g: 15.3, carbohydrates_100g: 0.0, fat_100g: 7.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1130', product_name: 'Lamm hjärta rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 17.1, carbohydrates_100g: 0.0, fat_100g: 5.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1131', product_name: 'Lamm lever rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 149.0, proteins_100g: 22.0, carbohydrates_100g: 3.2, fat_100g: 5.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1132', product_name: 'Lamm njure rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 16.2, carbohydrates_100g: 0.0, fat_100g: 3.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1133', product_name: 'Lamm tunga rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 15.3, carbohydrates_100g: 0.0, fat_100g: 14.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1134', product_name: 'Kalv bräss rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 16.9, carbohydrates_100g: 0.0, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1135', product_name: 'Kalv lever rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 19.4, carbohydrates_100g: 2.8, fat_100g: 3.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1136', product_name: 'Kalv njure rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 15.3, carbohydrates_100g: 0.7, fat_100g: 5.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1137', product_name: 'Kalv tunga rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 152.0, proteins_100g: 16.2, carbohydrates_100g: 0.0, fat_100g: 9.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1138', product_name: 'Nöt kalv hjärta', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 16.6, carbohydrates_100g: 0.0, fat_100g: 8.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1139', product_name: 'Nöt lever rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 127.0, proteins_100g: 20.0, carbohydrates_100g: 4.4, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1140', product_name: 'Nöt njure rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 15.8, carbohydrates_100g: 0.9, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1141', product_name: 'Nöt oxtunga rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 176.0, proteins_100g: 16.2, carbohydrates_100g: 0.0, fat_100g: 12.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1142', product_name: 'Gris hjärta rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 16.5, carbohydrates_100g: 0.0, fat_100g: 5.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1143', product_name: 'Gris lever rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 22.0, carbohydrates_100g: 3.0, fat_100g: 3.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1144', product_name: 'Gris njure rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 16.7, carbohydrates_100g: 0.3, fat_100g: 3.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1145', product_name: 'Gris tunga rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 16.5, carbohydrates_100g: 0.4, fat_100g: 11.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1146', product_name: 'Kyckling hjärta rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 15.6, carbohydrates_100g: 0.3, fat_100g: 9.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1147', product_name: 'Kyckling lever rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 19.4, carbohydrates_100g: 0.7, fat_100g: 3.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1148', product_name: 'Kyckling mage rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 18.2, carbohydrates_100g: 0.0, fat_100g: 4.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1149', product_name: 'Ren lever rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 22.0, carbohydrates_100g: 1.8, fat_100g: 3.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1150', product_name: 'Nöt oxtunga rimmad rå', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 220.0, proteins_100g: 15.7, carbohydrates_100g: 0.4, fat_100g: 17.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1151', product_name: 'Kyckling lever stekt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 149.0, proteins_100g: 25.2, carbohydrates_100g: 0.9, fat_100g: 4.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1152', product_name: 'Nöt lever panerad stekt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 212.0, proteins_100g: 22.9, carbohydrates_100g: 11.5, fat_100g: 8.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-1153', product_name: 'Nöt lever stekt m. salt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 178.0, proteins_100g: 24.8, carbohydrates_100g: 5.5, fat_100g: 6.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1154', product_name: 'Nöt oxtunga rimmad kokt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 19.5, carbohydrates_100g: 0.0, fat_100g: 24.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1155', product_name: 'Lever stuvad hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 11.4, carbohydrates_100g: 6.6, fat_100g: 7.5, fiber_100g: 0.3 }},
    { code: 'lvsdb-1156', product_name: 'Gryta m. kalvhjärta grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 6.8, carbohydrates_100g: 3.5, fat_100g: 4.7, fiber_100g: 1.4 }},
    { code: 'lvsdb-1157', product_name: 'Korvkaka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 6.9, carbohydrates_100g: 15.1, fat_100g: 3.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-1158', product_name: 'Leversauté kyckling', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 10.6, carbohydrates_100g: 3.5, fat_100g: 9.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-1159', product_name: 'Gryta levergryta nöt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 12.0, carbohydrates_100g: 6.7, fat_100g: 8.3, fiber_100g: 0.5 }},
    { code: 'lvsdb-1160', product_name: 'Njursauté', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 127.0, proteins_100g: 9.1, carbohydrates_100g: 3.3, fat_100g: 8.4, fiber_100g: 0.7 }},
    { code: 'lvsdb-1161', product_name: 'Leverbiff mald lever stekt frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 223.0, proteins_100g: 15.2, carbohydrates_100g: 8.1, fat_100g: 14.4, fiber_100g: 0.7 }},
    { code: 'lvsdb-1162', product_name: 'Gryta levergryta m. grönsaker frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 8.1, carbohydrates_100g: 7.0, fat_100g: 4.4, fiber_100g: 1.3 }},
    { code: 'lvsdb-1163', product_name: 'Gåsleverpastej konserv. rökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 454.0, proteins_100g: 11.4, carbohydrates_100g: 4.6, fat_100g: 44.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1164', product_name: 'Leverpalt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 225.0, proteins_100g: 9.9, carbohydrates_100g: 22.8, fat_100g: 9.9, fiber_100g: 2.3 }},
    { code: 'lvsdb-1165', product_name: 'Njurpalt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 153.0, proteins_100g: 8.3, carbohydrates_100g: 24.6, fat_100g: 1.7, fiber_100g: 2.3 }},
    { code: 'lvsdb-1166', product_name: 'Leverbiff mald lever rå frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 211.0, proteins_100g: 13.0, carbohydrates_100g: 7.0, fat_100g: 14.5, fiber_100g: 0.6 }},
    { code: 'lvsdb-1167', product_name: 'Leverpastej bredbar fett ca 24%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 9.5, carbohydrates_100g: 9.0, fat_100g: 24.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1168', product_name: 'Leverpastej skivbar fett ca 22% ', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 278.0, proteins_100g: 11.9, carbohydrates_100g: 9.5, fat_100g: 21.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1169', product_name: 'Leverpastej skivbar fett 14%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 212.0, proteins_100g: 12.0, carbohydrates_100g: 9.8, fat_100g: 14.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1170', product_name: 'Leverpastej bredbar fett ca 10%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 183.0, proteins_100g: 12.0, carbohydrates_100g: 13.5, fat_100g: 9.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1171', product_name: 'Leverpastej bredbar fett 3-3,5%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 10.6, carbohydrates_100g: 12.9, fat_100g: 3.6, fiber_100g: 2.7 }},
    { code: 'lvsdb-1172', product_name: 'Leverbiff mald lever stekt hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 12.8, carbohydrates_100g: 8.9, fat_100g: 6.4, fiber_100g: 0.7 }},
    { code: 'lvsdb-1173', product_name: 'Paté älgfärs kycklinglever', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 14.0, carbohydrates_100g: 3.6, fat_100g: 11.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-1174', product_name: 'Lantpaté', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 402.0, proteins_100g: 12.1, carbohydrates_100g: 4.7, fat_100g: 37.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-1175', product_name: 'Grönpepparpaté', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 299.0, proteins_100g: 15.2, carbohydrates_100g: 1.1, fat_100g: 26.0, fiber_100g: 1.2 }},
    { code: 'lvsdb-1176', product_name: 'Korv kycklingkorv mager', brands: 'Korv', nutriments: { 'energy-kcal_100g': 155.0, proteins_100g: 11.5, carbohydrates_100g: 6.5, fat_100g: 9.1, fiber_100g: 1.0 }},
    { code: 'lvsdb-1177', product_name: 'Korv kycklingkorv halal', brands: 'Korv', nutriments: { 'energy-kcal_100g': 203.0, proteins_100g: 12.2, carbohydrates_100g: 3.5, fat_100g: 15.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-1178', product_name: 'Korv falukorv fett 19% kött 58%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 254.0, proteins_100g: 12.7, carbohydrates_100g: 7.9, fat_100g: 19.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1179', product_name: 'Korv falukorv kött 58%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 240.0, proteins_100g: 9.1, carbohydrates_100g: 5.1, fat_100g: 20.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1180', product_name: 'Korv fläskkorv kokt kött 48%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 234.0, proteins_100g: 9.1, carbohydrates_100g: 3.8, fat_100g: 20.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1181', product_name: 'Korv frukostkorv fett 23% kött 52%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 257.0, proteins_100g: 9.9, carbohydrates_100g: 3.2, fat_100g: 23.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1182', product_name: 'Påläggskorv medvurst fett 23%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 256.0, proteins_100g: 9.9, carbohydrates_100g: 4.1, fat_100g: 22.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1183', product_name: 'Påläggskorv medvurst rökt fett 35%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 386.0, proteins_100g: 14.2, carbohydrates_100g: 5.4, fat_100g: 34.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1184', product_name: 'Påläggskorv salami rökt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 430.0, proteins_100g: 16.1, carbohydrates_100g: 0.2, fat_100g: 41.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1185', product_name: 'Korv varmkorv kött 51-54%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 12.1, carbohydrates_100g: 8.5, fat_100g: 21.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1186', product_name: 'Korv varmkorv kokt kött ca 53%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 273.0, proteins_100g: 9.9, carbohydrates_100g: 7.8, fat_100g: 22.6, fiber_100g: 0.8 }},
    { code: 'lvsdb-1187', product_name: 'Korv wienerkorv kött 73%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 259.0, proteins_100g: 9.8, carbohydrates_100g: 3.9, fat_100g: 23.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1188', product_name: 'Korv grillkorv kött 32-35%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 215.0, proteins_100g: 11.0, carbohydrates_100g: 9.2, fat_100g: 15.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1189', product_name: 'Korv isterband fermenterad kött 59%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 278.0, proteins_100g: 11.0, carbohydrates_100g: 4.6, fat_100g: 24.0, fiber_100g: 1.0 }},
    { code: 'lvsdb-1190', product_name: 'Korv middagskorv fett ca 15%  kött 52%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 9.5, carbohydrates_100g: 5.7, fat_100g: 14.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1191', product_name: 'Korv wienerkorv mager kött 73%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 10.0, carbohydrates_100g: 5.7, fat_100g: 15.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1192', product_name: 'Korv chorizo stekt kött 73%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 286.0, proteins_100g: 14.3, carbohydrates_100g: 4.1, fat_100g: 23.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1193', product_name: 'Korv kabanoss stekt kött 80%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 372.0, proteins_100g: 18.4, carbohydrates_100g: 1.2, fat_100g: 33.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1194', product_name: 'Korv prinskorv kött 61%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 268.0, proteins_100g: 10.0, carbohydrates_100g: 3.8, fat_100g: 24.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1195', product_name: 'Korv salsiccia rå kött 73%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 21.8, carbohydrates_100g: 4.7, fat_100g: 18.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1196', product_name: 'Korv salsiccia stekt u. fett kött 73%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 299.0, proteins_100g: 21.8, carbohydrates_100g: 7.7, fat_100g: 20.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1197', product_name: 'Korv värmlandskorv rå kött 45%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 231.0, proteins_100g: 6.1, carbohydrates_100g: 8.9, fat_100g: 19.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-1198', product_name: 'Korv värmlandskorv kokt kött 45%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 223.0, proteins_100g: 6.5, carbohydrates_100g: 8.5, fat_100g: 18.2, fiber_100g: 0.5 }},
    { code: 'lvsdb-1199', product_name: 'Gris bacon stekt mager', brands: 'Kött', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 26.6, carbohydrates_100g: 1.4, fat_100g: 3.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1200', product_name: 'Gris bacon rå mager', brands: 'Kött', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 19.4, carbohydrates_100g: 1.0, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1201', product_name: 'Korv frukostkorv kokt fett 23% kött 52%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 10.5, carbohydrates_100g: 3.4, fat_100g: 24.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1202', product_name: 'Korv falukorv stekt fett 19% kött 58%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 268.0, proteins_100g: 13.4, carbohydrates_100g: 8.3, fat_100g: 20.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1203', product_name: 'Korv falukorv skivad kokt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 254.0, proteins_100g: 9.6, carbohydrates_100g: 5.4, fat_100g: 21.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1204', product_name: 'Korv frukostkorv stekt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 10.5, carbohydrates_100g: 3.4, fat_100g: 24.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1205', product_name: 'Korv isterband fermenterad stekt kött 59%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 293.0, proteins_100g: 11.6, carbohydrates_100g: 4.8, fat_100g: 25.3, fiber_100g: 1.1 }},
    { code: 'lvsdb-1206', product_name: 'Korv varmkorv kokt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 273.0, proteins_100g: 9.9, carbohydrates_100g: 7.8, fat_100g: 22.6, fiber_100g: 0.8 }},
    { code: 'lvsdb-1207', product_name: 'Korv varmkorv stekt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 288.0, proteins_100g: 12.7, carbohydrates_100g: 8.9, fat_100g: 22.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1208', product_name: 'Korv wienerkorv stekt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 10.4, carbohydrates_100g: 4.1, fat_100g: 24.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1209', product_name: 'Korv falukorv ugnsstekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 205.0, proteins_100g: 9.0, carbohydrates_100g: 6.3, fat_100g: 15.9, fiber_100g: 0.6 }},
    { code: 'lvsdb-1210', product_name: 'Korv wienerkorv kokt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 10.4, carbohydrates_100g: 4.1, fat_100g: 24.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1211', product_name: 'Pölsa stekt värmd', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 235.0, proteins_100g: 17.5, carbohydrates_100g: 9.0, fat_100g: 14.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-1212', product_name: 'Pölsa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 188.0, proteins_100g: 14.0, carbohydrates_100g: 7.2, fat_100g: 11.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-1213', product_name: 'Korv stroganoff hemlagad i gjutjärnsstekpanna', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 242.0, proteins_100g: 7.2, carbohydrates_100g: 7.5, fat_100g: 20.5, fiber_100g: 0.6 }},
    { code: 'lvsdb-1214', product_name: 'Gryta korvgryta m. chorizo rotfrukter', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 5.2, carbohydrates_100g: 5.2, fat_100g: 8.7, fiber_100g: 1.2 }},
    { code: 'lvsdb-1215', product_name: 'Tunnbrödrulle m. korv potatismos räk- gurksallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 4.5, carbohydrates_100g: 16.3, fat_100g: 11.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-1216', product_name: 'Kalvsylta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 12.0, carbohydrates_100g: 0.1, fat_100g: 5.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1217', product_name: 'Pressylta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 305.0, proteins_100g: 17.5, carbohydrates_100g: 0.0, fat_100g: 26.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1218', product_name: 'Hushållssylta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 11.9, carbohydrates_100g: 0.3, fat_100g: 10.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1219', product_name: 'Cashewnötter rostade u. salt', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 597.0, proteins_100g: 18.0, carbohydrates_100g: 19.1, fat_100g: 48.7, fiber_100g: 8.3 }},
    { code: 'lvsdb-1220', product_name: 'Hasselnötter', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 658.0, proteins_100g: 13.2, carbohydrates_100g: 0.5, fat_100g: 64.6, fiber_100g: 16.1 }},
    { code: 'lvsdb-1221', product_name: 'Jordnötssmör', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 615.0, proteins_100g: 22.6, carbohydrates_100g: 14.3, fat_100g: 51.0, fiber_100g: 7.6 }},
    { code: 'lvsdb-1222', product_name: 'Jordnötter torkade', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 586.0, proteins_100g: 25.7, carbohydrates_100g: 8.2, fat_100g: 49.0, fiber_100g: 8.1 }},
    { code: 'lvsdb-1223', product_name: 'Jordnötter rostade', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 605.0, proteins_100g: 22.4, carbohydrates_100g: 9.3, fat_100g: 51.3, fiber_100g: 11.6 }},
    { code: 'lvsdb-1224', product_name: 'Jordnötter rostade saltade', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 605.0, proteins_100g: 22.4, carbohydrates_100g: 9.3, fat_100g: 51.3, fiber_100g: 11.6 }},
    { code: 'lvsdb-1225', product_name: 'Kastanjer', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 201.0, proteins_100g: 2.4, carbohydrates_100g: 39.0, fat_100g: 2.2, fiber_100g: 6.8 }},
    { code: 'lvsdb-1226', product_name: 'Kokosflingor', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 690.0, proteins_100g: 6.2, carbohydrates_100g: 13.1, fat_100g: 67.2, fiber_100g: 9.2 }},
    { code: 'lvsdb-1227', product_name: 'Kokosnöt', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 3.4, carbohydrates_100g: 6.1, fat_100g: 33.5, fiber_100g: 9.0 }},
    { code: 'lvsdb-1228', product_name: 'Kokosmjölk fett ca 6%', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 0.6, carbohydrates_100g: 3.0, fat_100g: 7.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-1229', product_name: 'Linfrö hela', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 522.0, proteins_100g: 18.7, carbohydrates_100g: 0.0, fat_100g: 43.8, fiber_100g: 30.4 }},
    { code: 'lvsdb-1230', product_name: 'Paranötter', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 683.0, proteins_100g: 14.2, carbohydrates_100g: 0.0, fat_100g: 67.8, fiber_100g: 13.7 }},
    { code: 'lvsdb-1231', product_name: 'Pekannötter', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 714.0, proteins_100g: 8.5, carbohydrates_100g: 1.5, fat_100g: 73.3, fiber_100g: 13.3 }},
    { code: 'lvsdb-1232', product_name: 'Pistaschnötter u. salt', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 555.0, proteins_100g: 23.4, carbohydrates_100g: 15.8, fat_100g: 42.5, fiber_100g: 10.6 }},
    { code: 'lvsdb-1233', product_name: 'Pumpafrö', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 573.0, proteins_100g: 29.8, carbohydrates_100g: 2.4, fat_100g: 48.0, fiber_100g: 9.2 }},
    { code: 'lvsdb-1234', product_name: 'Sesamfrö m. skal', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 606.0, proteins_100g: 19.9, carbohydrates_100g: 4.4, fat_100g: 54.8, fiber_100g: 12.0 }},
    { code: 'lvsdb-1235', product_name: 'Sesamfrö u. skal', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 644.0, proteins_100g: 20.9, carbohydrates_100g: 2.7, fat_100g: 59.7, fiber_100g: 10.4 }},
    { code: 'lvsdb-1236', product_name: 'Solrosfrö', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 618.0, proteins_100g: 20.6, carbohydrates_100g: 3.9, fat_100g: 56.1, fiber_100g: 11.5 }},
    { code: 'lvsdb-1237', product_name: 'Sötmandel', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 592.0, proteins_100g: 20.7, carbohydrates_100g: 0.5, fat_100g: 53.2, fiber_100g: 18.7 }},
    { code: 'lvsdb-1238', product_name: 'Valnötter', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 680.0, proteins_100g: 13.8, carbohydrates_100g: 8.3, fat_100g: 64.8, fiber_100g: 9.0 }},
    { code: 'lvsdb-1239', product_name: 'Kastanjer rostade', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 3.2, carbohydrates_100g: 45.0, fat_100g: 2.2, fiber_100g: 7.9 }},
    { code: 'lvsdb-1240', product_name: 'Kikärtor snacks torkade m. salt', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 376.0, proteins_100g: 23.3, carbohydrates_100g: 47.8, fat_100g: 6.6, fiber_100g: 15.5 }},
    { code: 'lvsdb-1241', product_name: 'Jordnötsbågar jordnötsringar', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 488.0, proteins_100g: 11.4, carbohydrates_100g: 51.4, fat_100g: 25.0, fiber_100g: 6.3 }},
    { code: 'lvsdb-1242', product_name: 'Chips majs tortilla ', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 461.0, proteins_100g: 7.1, carbohydrates_100g: 63.6, fat_100g: 17.9, fiber_100g: 7.9 }},
    { code: 'lvsdb-1243', product_name: 'Ostbågar', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 550.0, proteins_100g: 8.5, carbohydrates_100g: 48.2, fat_100g: 35.5, fiber_100g: 2.8 }},
    { code: 'lvsdb-1244', product_name: 'Chips potatis m. havssalt', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 523.0, proteins_100g: 5.2, carbohydrates_100g: 52.4, fat_100g: 31.5, fiber_100g: 5.5 }},
    { code: 'lvsdb-1245', product_name: 'Salta pinnar', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 391.0, proteins_100g: 11.5, carbohydrates_100g: 69.6, fat_100g: 5.6, fiber_100g: 6.1 }},
    { code: 'lvsdb-1246', product_name: 'Popcorn mikropopcorn poppade fett ca 22%', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 440.0, proteins_100g: 9.6, carbohydrates_100g: 55.9, fat_100g: 16.9, fiber_100g: 12.5 }},
    { code: 'lvsdb-1247', product_name: 'Chips potatis smaksatta fett ca 33%', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 526.0, proteins_100g: 5.9, carbohydrates_100g: 50.0, fat_100g: 32.6, fiber_100g: 5.8 }},
    { code: 'lvsdb-1248', product_name: 'Chips potatis light fett 25%', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 495.0, proteins_100g: 4.1, carbohydrates_100g: 63.0, fat_100g: 24.3, fiber_100g: 3.8 }},
    { code: 'lvsdb-1249', product_name: 'Japanmix blandade snacks m. inbakade nötter riscracker', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 403.0, proteins_100g: 9.4, carbohydrates_100g: 75.5, fat_100g: 5.6, fiber_100g: 4.4 }},
    { code: 'lvsdb-1250', product_name: 'Kokosmjölk fett ca 24%', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 2.3, carbohydrates_100g: 3.5, fat_100g: 24.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-1251', product_name: 'Vatten kokosvatten', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 0.0, carbohydrates_100g: 4.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1252', product_name: 'Sesamdryck vattenextrakt av frön m. skal', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.8, carbohydrates_100g: 0.6, fat_100g: 6.4, fiber_100g: 0.6 }},
    { code: 'lvsdb-1253', product_name: 'Sesamdryck vattenextrakt av frön u. skal', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 2.2, carbohydrates_100g: 1.4, fat_100g: 6.4, fiber_100g: 0.6 }},
    { code: 'lvsdb-1254', product_name: 'Sött vetebröd kanelbulle hembakad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 321.0, proteins_100g: 5.8, carbohydrates_100g: 45.5, fat_100g: 12.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-1255', product_name: 'Skorpor råg', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 379.0, proteins_100g: 9.0, carbohydrates_100g: 51.9, fat_100g: 10.8, fiber_100g: 19.0 }},
    { code: 'lvsdb-1256', product_name: 'Skorpor vete osötade', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 476.0, proteins_100g: 9.9, carbohydrates_100g: 66.2, fat_100g: 18.2, fiber_100g: 3.0 }},
    { code: 'lvsdb-1257', product_name: 'Sött vetebröd', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 356.0, proteins_100g: 8.2, carbohydrates_100g: 54.4, fat_100g: 10.9, fiber_100g: 2.8 }},
    { code: 'lvsdb-1258', product_name: 'Sött vetebröd slätt', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 329.0, proteins_100g: 8.7, carbohydrates_100g: 50.3, fat_100g: 9.5, fiber_100g: 2.8 }},
    { code: 'lvsdb-1259', product_name: 'Sött vetebröd sötat m. fruktsocker', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 289.0, proteins_100g: 7.2, carbohydrates_100g: 45.6, fat_100g: 8.0, fiber_100g: 2.1 }},
    { code: 'lvsdb-1260', product_name: 'Vetebröd osötat', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 286.0, proteins_100g: 7.6, carbohydrates_100g: 44.6, fat_100g: 7.8, fiber_100g: 2.8 }},
    { code: 'lvsdb-1261', product_name: 'Sött vetebröd m. fyllning bulle längd', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 6.5, carbohydrates_100g: 56.1, fat_100g: 10.3, fiber_100g: 2.5 }},
    { code: 'lvsdb-1262', product_name: 'Skorpor vete', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 419.0, proteins_100g: 10.3, carbohydrates_100g: 70.7, fat_100g: 9.2, fiber_100g: 4.2 }},
    { code: 'lvsdb-1263', product_name: 'Skorpor fullkorn osötade', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 387.0, proteins_100g: 12.9, carbohydrates_100g: 64.1, fat_100g: 6.2, fiber_100g: 10.0 }},
    { code: 'lvsdb-1264', product_name: 'Mandelkubb', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 397.0, proteins_100g: 6.1, carbohydrates_100g: 61.3, fat_100g: 13.6, fiber_100g: 1.7 }},
    { code: 'lvsdb-1265', product_name: 'Munk u. fyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 425.0, proteins_100g: 5.0, carbohydrates_100g: 42.7, fat_100g: 25.8, fiber_100g: 1.3 }},
    { code: 'lvsdb-1266', product_name: 'Munk fylld m. äppelmos vaniljkräm', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 313.0, proteins_100g: 5.9, carbohydrates_100g: 41.4, fat_100g: 13.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-1267', product_name: 'Wienerbröd m. vaniljkräm sylt florsocker', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 456.0, proteins_100g: 6.4, carbohydrates_100g: 45.4, fat_100g: 27.3, fiber_100g: 2.2 }},
    { code: 'lvsdb-1268', product_name: 'Sött vetebröd bakpulver', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 315.0, proteins_100g: 5.5, carbohydrates_100g: 45.5, fat_100g: 11.8, fiber_100g: 1.6 }},
    { code: 'lvsdb-1269', product_name: 'Sött vetebröd saffransbröd hembakad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 290.0, proteins_100g: 5.9, carbohydrates_100g: 46.3, fat_100g: 8.4, fiber_100g: 2.0 }},
    { code: 'lvsdb-1270', product_name: 'Kex cream crackers', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 484.0, proteins_100g: 7.8, carbohydrates_100g: 60.3, fat_100g: 22.5, fiber_100g: 4.3 }},
    { code: 'lvsdb-1271', product_name: 'Kex rån m. cremefyllning smaksatt', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 538.0, proteins_100g: 4.0, carbohydrates_100g: 62.3, fat_100g: 29.9, fiber_100g: 1.7 }},
    { code: 'lvsdb-1272', product_name: 'Kex havrekex fullkorn', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 470.0, proteins_100g: 8.8, carbohydrates_100g: 59.1, fat_100g: 20.6, fiber_100g: 6.0 }},
    { code: 'lvsdb-1273', product_name: 'Kex Mariekex', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 449.0, proteins_100g: 6.6, carbohydrates_100g: 74.7, fat_100g: 12.8, fiber_100g: 3.1 }},
    { code: 'lvsdb-1274', product_name: 'Kex mördegskex', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 480.0, proteins_100g: 5.4, carbohydrates_100g: 71.8, fat_100g: 18.4, fiber_100g: 1.8 }},
    { code: 'lvsdb-1275', product_name: 'Kex m. syltfyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 474.0, proteins_100g: 4.0, carbohydrates_100g: 70.9, fat_100g: 18.9, fiber_100g: 1.4 }},
    { code: 'lvsdb-1276', product_name: 'Kex m. nougatfyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 490.0, proteins_100g: 5.6, carbohydrates_100g: 62.6, fat_100g: 23.2, fiber_100g: 4.0 }},
    { code: 'lvsdb-1277', product_name: 'Maräng m. choklad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 389.0, proteins_100g: 3.2, carbohydrates_100g: 91.0, fat_100g: 0.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1278', product_name: 'Småkakor olika sorter', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 492.0, proteins_100g: 4.7, carbohydrates_100g: 68.8, fat_100g: 21.4, fiber_100g: 2.1 }},
    { code: 'lvsdb-1279', product_name: 'Jitterbugg m. mördeg maräng', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 515.0, proteins_100g: 6.7, carbohydrates_100g: 52.8, fat_100g: 30.5, fiber_100g: 1.8 }},
    { code: 'lvsdb-1280', product_name: 'Cookie amerikansk m. choklad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 486.0, proteins_100g: 5.2, carbohydrates_100g: 63.3, fat_100g: 22.9, fiber_100g: 2.5 }},
    { code: 'lvsdb-1281', product_name: 'Kex smörgåskex', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 462.0, proteins_100g: 7.0, carbohydrates_100g: 63.1, fat_100g: 18.1, fiber_100g: 9.0 }},
    { code: 'lvsdb-1282', product_name: 'Pepparkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 453.0, proteins_100g: 4.9, carbohydrates_100g: 72.1, fat_100g: 15.4, fiber_100g: 2.2 }},
    { code: 'lvsdb-1283', product_name: 'Spettekaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 427.0, proteins_100g: 11.8, carbohydrates_100g: 71.4, fat_100g: 9.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-1284', product_name: 'Maräng', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 395.0, proteins_100g: 1.9, carbohydrates_100g: 95.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1285', product_name: 'Kex m. fyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 489.0, proteins_100g: 5.4, carbohydrates_100g: 60.7, fat_100g: 24.5, fiber_100g: 1.8 }},
    { code: 'lvsdb-1286', product_name: 'Kex ostkex', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 492.0, proteins_100g: 10.1, carbohydrates_100g: 54.1, fat_100g: 25.3, fiber_100g: 4.1 }},
    { code: 'lvsdb-1287', product_name: 'Kex salta', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 509.0, proteins_100g: 8.7, carbohydrates_100g: 55.3, fat_100g: 27.0, fiber_100g: 5.1 }},
    { code: 'lvsdb-1288', product_name: 'Kex salta m. mjölk', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 512.0, proteins_100g: 7.7, carbohydrates_100g: 57.6, fat_100g: 27.2, fiber_100g: 3.0 }},
    { code: 'lvsdb-1289', product_name: 'Kex u. socker', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 444.0, proteins_100g: 6.0, carbohydrates_100g: 76.1, fat_100g: 12.0, fiber_100g: 2.0 }},
    { code: 'lvsdb-1290', product_name: 'Pepparkaka u. socker', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 504.0, proteins_100g: 8.0, carbohydrates_100g: 63.2, fat_100g: 24.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-1291', product_name: 'Kex smörgåsrån', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 400.0, proteins_100g: 8.8, carbohydrates_100g: 75.8, fat_100g: 4.9, fiber_100g: 6.7 }},
    { code: 'lvsdb-1292', product_name: 'Glasstrut våffla ofylld', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 416.0, proteins_100g: 6.3, carbohydrates_100g: 80.8, fat_100g: 6.4, fiber_100g: 2.6 }},
    { code: 'lvsdb-1293', product_name: 'Småkakor u. socker', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 546.0, proteins_100g: 7.0, carbohydrates_100g: 54.6, fat_100g: 33.0, fiber_100g: 2.0 }},
    { code: 'lvsdb-1294', product_name: 'Mandelbiskvi', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 399.0, proteins_100g: 10.0, carbohydrates_100g: 35.2, fat_100g: 22.6, fiber_100g: 8.0 }},
    { code: 'lvsdb-1295', product_name: 'Deg mördeg gräddad', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 503.0, proteins_100g: 4.7, carbohydrates_100g: 44.1, fat_100g: 34.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-1296', product_name: 'Deg smördeg gräddad', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 429.0, proteins_100g: 5.6, carbohydrates_100g: 53.8, fat_100g: 20.8, fiber_100g: 1.8 }},
    { code: 'lvsdb-1297', product_name: 'Deg smördeg frysvara', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 395.0, proteins_100g: 5.0, carbohydrates_100g: 31.8, fat_100g: 27.5, fiber_100g: 1.4 }},
    { code: 'lvsdb-1298', product_name: 'Deg filodeg kylvara el. frysvara', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 289.0, proteins_100g: 8.0, carbohydrates_100g: 57.9, fat_100g: 1.9, fiber_100g: 2.4 }},
    { code: 'lvsdb-1299', product_name: 'Gräddtårta', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 294.0, proteins_100g: 3.0, carbohydrates_100g: 27.7, fat_100g: 19.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-1300', product_name: 'Toscabit m. mazarinmassa mandel choklad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 487.0, proteins_100g: 6.6, carbohydrates_100g: 42.6, fat_100g: 31.4, fiber_100g: 4.8 }},
    { code: 'lvsdb-1301', product_name: 'Bärtårta m. grädde vaniljkräm sylt gele', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 3.2, carbohydrates_100g: 31.4, fat_100g: 11.0, fiber_100g: 3.3 }},
    { code: 'lvsdb-1302', product_name: 'Prinsesstårta m. grädde vaniljkräm hallonsylt marsipan', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 295.0, proteins_100g: 4.3, carbohydrates_100g: 37.3, fat_100g: 13.8, fiber_100g: 2.1 }},
    { code: 'lvsdb-1303', product_name: 'Chokladtårta Sachertårta', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 443.0, proteins_100g: 5.6, carbohydrates_100g: 46.8, fat_100g: 25.3, fiber_100g: 3.0 }},
    { code: 'lvsdb-1304', product_name: 'Napoleonbakelse m. grädde vaniljkräm hallonsylt glasyr', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 349.0, proteins_100g: 3.2, carbohydrates_100g: 37.2, fat_100g: 20.6, fiber_100g: 1.2 }},
    { code: 'lvsdb-1305', product_name: 'Frukttårta m. hallonsylt vaniljkräm mandelmassa frukt gele', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 5.1, carbohydrates_100g: 37.4, fat_100g: 7.5, fiber_100g: 5.7 }},
    { code: 'lvsdb-1306', product_name: 'Chokladbiskvi m. mandelbotten smörkräm choklad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 494.0, proteins_100g: 5.6, carbohydrates_100g: 50.9, fat_100g: 28.6, fiber_100g: 5.7 }},
    { code: 'lvsdb-1307', product_name: 'Mazariner m. mördegsbotten mazarinfyllning glasyr', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 436.0, proteins_100g: 6.7, carbohydrates_100g: 55.0, fat_100g: 20.6, fiber_100g: 2.1 }},
    { code: 'lvsdb-1308', product_name: 'Mjuk kaka drömtårta chokladrulltårta', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 390.0, proteins_100g: 6.1, carbohydrates_100g: 53.2, fat_100g: 16.5, fiber_100g: 1.8 }},
    { code: 'lvsdb-1309', product_name: 'Mjuk kaka rulltårta m. sylt', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 380.0, proteins_100g: 3.0, carbohydrates_100g: 57.4, fat_100g: 14.9, fiber_100g: 1.4 }},
    { code: 'lvsdb-1310', product_name: 'Punschrulle', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 453.0, proteins_100g: 5.0, carbohydrates_100g: 61.2, fat_100g: 20.2, fiber_100g: 3.3 }},
    { code: 'lvsdb-1311', product_name: 'Chokladboll', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 508.0, proteins_100g: 4.9, carbohydrates_100g: 49.1, fat_100g: 31.5, fiber_100g: 5.2 }},
    { code: 'lvsdb-1312', product_name: 'Gräddtårta m. jordgubb banan hemlagad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 209.0, proteins_100g: 3.0, carbohydrates_100g: 22.0, fat_100g: 11.7, fiber_100g: 2.2 }},
    { code: 'lvsdb-1313', product_name: 'Potatisbakelse m. vaniljkräm smörkräm marsipan', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 405.0, proteins_100g: 4.8, carbohydrates_100g: 56.8, fat_100g: 16.8, fiber_100g: 2.9 }},
    { code: 'lvsdb-1314', product_name: 'Äppelkaka m. ströbröd', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 219.0, proteins_100g: 1.3, carbohydrates_100g: 27.6, fat_100g: 10.8, fiber_100g: 3.0 }},
    { code: 'lvsdb-1315', product_name: 'Mjuk kaka drömtårta chokladrulltårta hemlagad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 355.0, proteins_100g: 5.3, carbohydrates_100g: 43.0, fat_100g: 17.6, fiber_100g: 1.6 }},
    { code: 'lvsdb-1316', product_name: 'Semla vetebulle fylld m. mandelmassa vispad grädde', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 333.0, proteins_100g: 5.4, carbohydrates_100g: 39.7, fat_100g: 16.3, fiber_100g: 2.9 }},
    { code: 'lvsdb-1317', product_name: 'Mjuk kaka chokladruta m. chokladglasyr riven kokos', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 420.0, proteins_100g: 4.2, carbohydrates_100g: 47.7, fat_100g: 23.2, fiber_100g: 2.5 }},
    { code: 'lvsdb-1318', product_name: 'Mjuk kaka ambrosiakaka sockerkaka m. glasyr', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 377.0, proteins_100g: 3.5, carbohydrates_100g: 53.8, fat_100g: 16.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-1319', product_name: 'Arraksboll', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 445.0, proteins_100g: 3.2, carbohydrates_100g: 58.0, fat_100g: 21.8, fiber_100g: 1.6 }},
    { code: 'lvsdb-1320', product_name: 'Petit-choux u. fyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 201.0, proteins_100g: 5.9, carbohydrates_100g: 17.9, fat_100g: 11.7, fiber_100g: 0.9 }},
    { code: 'lvsdb-1321', product_name: 'Semla vetebulle fylld m. mandelmassa vispad grädde hemlagad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 294.0, proteins_100g: 6.1, carbohydrates_100g: 36.8, fat_100g: 13.0, fiber_100g: 2.1 }},
    { code: 'lvsdb-1322', product_name: 'Mjuk kaka fransk äppelkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 233.0, proteins_100g: 3.0, carbohydrates_100g: 19.5, fat_100g: 15.2, fiber_100g: 3.5 }},
    { code: 'lvsdb-1323', product_name: 'Mjuk kaka toscakaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 401.0, proteins_100g: 6.8, carbohydrates_100g: 43.5, fat_100g: 21.4, fiber_100g: 3.5 }},
    { code: 'lvsdb-1324', product_name: 'Mjuk kaka chokladkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 339.0, proteins_100g: 5.3, carbohydrates_100g: 39.7, fat_100g: 17.2, fiber_100g: 2.4 }},
    { code: 'lvsdb-1325', product_name: 'Muffins amerikansk', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 431.0, proteins_100g: 5.8, carbohydrates_100g: 46.8, fat_100g: 24.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-1326', product_name: 'Mjuk kaka sockerkaka pepparkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 374.0, proteins_100g: 3.9, carbohydrates_100g: 56.0, fat_100g: 14.1, fiber_100g: 3.2 }},
    { code: 'lvsdb-1327', product_name: 'Mjuk kaka tårtbotten', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 301.0, proteins_100g: 5.9, carbohydrates_100g: 58.7, fat_100g: 4.2, fiber_100g: 0.4 }},
    { code: 'lvsdb-1328', product_name: 'Mjuk kaka sockerkaka fin', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 397.0, proteins_100g: 4.3, carbohydrates_100g: 48.3, fat_100g: 20.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-1329', product_name: 'Mjuk kaka pepparkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 334.0, proteins_100g: 4.6, carbohydrates_100g: 45.3, fat_100g: 14.7, fiber_100g: 0.9 }},
    { code: 'lvsdb-1330', product_name: 'Mjuk kaka nötkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 441.0, proteins_100g: 9.5, carbohydrates_100g: 29.4, fat_100g: 30.6, fiber_100g: 6.8 }},
    { code: 'lvsdb-1331', product_name: 'Mjuk kaka sockerkaka fin mager', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 4.3, carbohydrates_100g: 49.0, fat_100g: 8.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-1332', product_name: 'Mjuk kaka sockerkaka saftig', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 319.0, proteins_100g: 5.2, carbohydrates_100g: 52.9, fat_100g: 9.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-1333', product_name: 'Kex digestive fullkorn 23%', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 476.0, proteins_100g: 6.4, carbohydrates_100g: 66.1, fat_100g: 19.8, fiber_100g: 3.4 }},
    { code: 'lvsdb-1334', product_name: 'Mjuk kaka fruktkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 387.0, proteins_100g: 5.0, carbohydrates_100g: 42.9, fat_100g: 21.1, fiber_100g: 2.8 }},
    { code: 'lvsdb-1335', product_name: 'Glass gräddglass fett 12%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 3.2, carbohydrates_100g: 25.1, fat_100g: 9.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1336', product_name: 'Glass vaniljsmak fett ca 8%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 177.0, proteins_100g: 2.5, carbohydrates_100g: 27.0, fat_100g: 6.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1337', product_name: 'Glass fett ca 10%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 3.3, carbohydrates_100g: 23.1, fat_100g: 9.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1338', product_name: 'Glass glasstrut fett ca 15%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 271.0, proteins_100g: 4.0, carbohydrates_100g: 29.2, fat_100g: 15.3, fiber_100g: 0.3 }},
    { code: 'lvsdb-1339', product_name: 'Glass lättglass m. sötningsm. fett ca 6%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 4.3, carbohydrates_100g: 17.5, fat_100g: 5.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1340', product_name: 'Glass glasstrut våffla m. vaniljglass daimbitar chokladöverdrag', brands: 'Glass', nutriments: { 'energy-kcal_100g': 345.0, proteins_100g: 3.7, carbohydrates_100g: 35.1, fat_100g: 20.8, fiber_100g: 1.6 }},
    { code: 'lvsdb-1341', product_name: 'Glass vaniljglass m. chokladkex', brands: 'Glass', nutriments: { 'energy-kcal_100g': 266.0, proteins_100g: 4.7, carbohydrates_100g: 37.4, fat_100g: 10.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-1342', product_name: 'Glass gräddglass fett 15%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 3.7, carbohydrates_100g: 19.6, fat_100g: 14.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1343', product_name: 'Glass fett 12%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 200.0, proteins_100g: 3.8, carbohydrates_100g: 19.3, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1344', product_name: 'Glass lättglass fett ca 5%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 4.3, carbohydrates_100g: 26.6, fat_100g: 4.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1345', product_name: 'Glass glasspinne fett ca 25%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 348.0, proteins_100g: 4.6, carbohydrates_100g: 26.0, fat_100g: 25.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1346', product_name: 'Glass glasspinne m. kakaoöverdrag fett 20%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 307.0, proteins_100g: 3.8, carbohydrates_100g: 28.0, fat_100g: 20.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1347', product_name: 'Glass glasspinne el. split m. isöverdrag fett ca 6%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 1.7, carbohydrates_100g: 22.3, fat_100g: 6.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1348', product_name: 'Glass glasstrut fett ca 10%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 244.0, proteins_100g: 3.6, carbohydrates_100g: 34.0, fat_100g: 10.3, fiber_100g: 0.3 }},
    { code: 'lvsdb-1349', product_name: 'Glass mjukglass bägare', brands: 'Glass', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 3.1, carbohydrates_100g: 19.7, fat_100g: 7.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1350', product_name: 'Glass glasstårta fett 17%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 261.0, proteins_100g: 4.4, carbohydrates_100g: 22.2, fat_100g: 17.0, fiber_100g: 1.4 }},
    { code: 'lvsdb-1351', product_name: 'Glass m. maräng fett 10%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 234.0, proteins_100g: 4.0, carbohydrates_100g: 25.8, fat_100g: 12.8, fiber_100g: 0.1 }},
    { code: 'lvsdb-1352', product_name: 'Glass havreglass m. vanilji fett 13%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 218.0, proteins_100g: 0.5, carbohydrates_100g: 25.3, fat_100g: 12.6, fiber_100g: 0.8 }},
    { code: 'lvsdb-1353', product_name: 'Glass parfait m. bär', brands: 'Glass', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 2.4, carbohydrates_100g: 9.2, fat_100g: 21.4, fiber_100g: 1.2 }},
    { code: 'lvsdb-1354', product_name: 'Matlagningsbas m. havre fett 13%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 0.7, carbohydrates_100g: 6.7, fat_100g: 12.8, fiber_100g: 0.8 }},
    { code: 'lvsdb-1355', product_name: 'Gräddfil fett 12%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 2.5, carbohydrates_100g: 4.0, fat_100g: 11.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1356', product_name: 'Kaffegrädde fett 12%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 3.1, carbohydrates_100g: 4.4, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1357', product_name: 'Vispgrädde fett 40%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 374.0, proteins_100g: 2.1, carbohydrates_100g: 3.0, fat_100g: 40.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1358', product_name: 'Mellangrädde fett 27%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 264.0, proteins_100g: 2.6, carbohydrates_100g: 3.6, fat_100g: 27.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1359', product_name: 'Matlagningsgrädde fett 15%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 3.0, carbohydrates_100g: 4.2, fat_100g: 15.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1360', product_name: 'Crème fraiche fett 34%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 323.0, proteins_100g: 2.3, carbohydrates_100g: 3.3, fat_100g: 34.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1361', product_name: 'Gräddersättning pulver fett 35%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 556.0, proteins_100g: 4.8, carbohydrates_100g: 54.9, fat_100g: 35.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1362', product_name: 'Gräddfilssås m. kryddgrönt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 2.6, carbohydrates_100g: 4.2, fat_100g: 10.2, fiber_100g: 0.3 }},
    { code: 'lvsdb-1363', product_name: 'Gräddfilssås fett 9%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 2.6, carbohydrates_100g: 6.6, fat_100g: 5.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1364', product_name: 'Gräddfilssås m. crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 2.4, carbohydrates_100g: 6.2, fat_100g: 11.6, fiber_100g: 0.7 }},
    { code: 'lvsdb-1365', product_name: 'Rabarberkräm', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 0.2, carbohydrates_100g: 12.7, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-1366', product_name: 'Rabarbersoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 0.2, carbohydrates_100g: 11.7, fat_100g: 0.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-1367', product_name: 'Apelsinsoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 0.4, carbohydrates_100g: 10.6, fat_100g: 0.1, fiber_100g: 0.3 }},
    { code: 'lvsdb-1368', product_name: 'Blåbärssoppa hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 0.2, carbohydrates_100g: 10.4, fat_100g: 0.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-1369', product_name: 'Svartvinbärskräm', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 0.5, carbohydrates_100g: 14.7, fat_100g: 0.4, fiber_100g: 1.9 }},
    { code: 'lvsdb-1370', product_name: 'Äppelkompott', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 65.0, proteins_100g: 0.0, carbohydrates_100g: 15.0, fat_100g: 0.0, fiber_100g: 1.9 }},
    { code: 'lvsdb-1371', product_name: 'Äppelkräm', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 0.0, carbohydrates_100g: 13.9, fat_100g: 0.0, fiber_100g: 1.7 }},
    { code: 'lvsdb-1372', product_name: 'Äppelsoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 0.0, carbohydrates_100g: 11.2, fat_100g: 0.0, fiber_100g: 1.4 }},
    { code: 'lvsdb-1373', product_name: 'Kräm m. bär el. frukt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 0.2, carbohydrates_100g: 14.4, fat_100g: 0.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-1374', product_name: 'Pajfyllning bär m. socker', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 0.8, carbohydrates_100g: 23.5, fat_100g: 0.4, fiber_100g: 2.6 }},
    { code: 'lvsdb-1375', product_name: 'Saftkräm', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 0.0, carbohydrates_100g: 28.4, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1376', product_name: 'Saftsoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 0.0, carbohydrates_100g: 21.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1377', product_name: 'Saftsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 0.0, carbohydrates_100g: 28.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1378', product_name: 'Fruktdryck blåbär berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.8, carbohydrates_100g: 10.6, fat_100g: 0.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-1379', product_name: 'Fruktsoppa pastöriserad ätf. blandad torkad frukt berikad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 0.2, carbohydrates_100g: 12.9, fat_100g: 0.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-1380', product_name: 'Nyponsoppa ätf. pastöriserad el. pulver berikad ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 0.2, carbohydrates_100g: 12.1, fat_100g: 0.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-1381', product_name: 'Nyponsoppa ätf. pulver osötad berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 20.0, proteins_100g: 0.2, carbohydrates_100g: 4.3, fat_100g: 0.1, fiber_100g: 0.3 }},
    { code: 'lvsdb-1382', product_name: 'Mjuk kaka m. katrinplommon', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 5.4, carbohydrates_100g: 24.2, fat_100g: 5.2, fiber_100g: 2.9 }},
    { code: 'lvsdb-1383', product_name: 'Kalvdans m. mjölkpulver ägg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 9.0, carbohydrates_100g: 12.9, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1384', product_name: 'Ostkaka m. cottage cheese', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 168.0, proteins_100g: 10.1, carbohydrates_100g: 10.5, fat_100g: 9.3, fiber_100g: 1.2 }},
    { code: 'lvsdb-1385', product_name: 'Marängsviss hovdessert', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 4.5, carbohydrates_100g: 37.4, fat_100g: 20.0, fiber_100g: 3.9 }},
    { code: 'lvsdb-1386', product_name: 'Brylépudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 4.9, carbohydrates_100g: 19.6, fat_100g: 3.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1387', product_name: 'Vaniljsås m. mellanmjölk matlagningsgrädde vispgrädde hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 192.0, proteins_100g: 3.8, carbohydrates_100g: 11.8, fat_100g: 14.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1388', product_name: 'Chokladpudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 4.8, carbohydrates_100g: 19.0, fat_100g: 3.0, fiber_100g: 1.2 }},
    { code: 'lvsdb-1389', product_name: 'Chokladpudding m. vispad grädde fett 40%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 4.3, carbohydrates_100g: 16.1, fat_100g: 9.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-1390', product_name: 'Chokladmousse', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 297.0, proteins_100g: 5.8, carbohydrates_100g: 28.7, fat_100g: 17.8, fiber_100g: 0.1 }},
    { code: 'lvsdb-1391', product_name: 'Fromage apelsin el. citron hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 276.0, proteins_100g: 5.3, carbohydrates_100g: 18.2, fat_100g: 20.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1392', product_name: 'Glassås choklad hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 4.5, carbohydrates_100g: 44.8, fat_100g: 4.1, fiber_100g: 6.5 }},
    { code: 'lvsdb-1393', product_name: 'Glassås kolasås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 288.0, proteins_100g: 2.3, carbohydrates_100g: 28.6, fat_100g: 18.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1394', product_name: 'Vaniljpudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 3.7, carbohydrates_100g: 15.9, fat_100g: 8.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1395', product_name: 'Vaniljsås m. grädde mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 302.0, proteins_100g: 3.4, carbohydrates_100g: 10.5, fat_100g: 27.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1396', product_name: 'Ostkaka lätt osötad fett 3%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 12.0, carbohydrates_100g: 8.6, fat_100g: 3.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-1397', product_name: 'Fromage citron', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 173.0, proteins_100g: 2.4, carbohydrates_100g: 16.2, fat_100g: 11.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1398', product_name: 'Vaniljsås m. havre fett 11%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 0.6, carbohydrates_100g: 16.1, fat_100g: 9.6, fiber_100g: 0.9 }},
    { code: 'lvsdb-1399', product_name: 'Vaniljsås tillagad pulver m. mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 3.1, carbohydrates_100g: 16.1, fat_100g: 3.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1400', product_name: 'Glassås choklad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 3.1, carbohydrates_100g: 69.5, fat_100g: 5.5, fiber_100g: 3.9 }},
    { code: 'lvsdb-1401', product_name: 'Glassås frukt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 316.0, proteins_100g: 0.1, carbohydrates_100g: 77.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1402', product_name: 'Rabarberpaj', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 2.6, carbohydrates_100g: 34.6, fat_100g: 13.3, fiber_100g: 2.9 }},
    { code: 'lvsdb-1403', product_name: 'Äppelpaj m. lock', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 286.0, proteins_100g: 3.0, carbohydrates_100g: 32.3, fat_100g: 15.7, fiber_100g: 2.2 }},
    { code: 'lvsdb-1404', product_name: 'Cheesecake m. digestivebotten bär fryst', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 262.0, proteins_100g: 4.1, carbohydrates_100g: 17.0, fat_100g: 19.7, fiber_100g: 1.2 }},
    { code: 'lvsdb-1405', product_name: 'Cheesecake m. digestivebotten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 291.0, proteins_100g: 5.4, carbohydrates_100g: 19.9, fat_100g: 21.2, fiber_100g: 0.4 }},
    { code: 'lvsdb-1406', product_name: 'Mannagrynskaka mannagrynspudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 4.9, carbohydrates_100g: 15.2, fat_100g: 2.4, fiber_100g: 0.5 }},
    { code: 'lvsdb-1407', product_name: 'Äppelsmulpaj', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 241.0, proteins_100g: 1.8, carbohydrates_100g: 32.5, fat_100g: 10.9, fiber_100g: 2.5 }},
    { code: 'lvsdb-1408', product_name: 'Katrinplommonsufflé', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 62.0, proteins_100g: 1.9, carbohydrates_100g: 12.4, fat_100g: 0.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-1409', product_name: 'Äppelpaj friterad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 303.0, proteins_100g: 2.6, carbohydrates_100g: 35.1, fat_100g: 16.6, fiber_100g: 1.7 }},
    { code: 'lvsdb-1410', product_name: 'Banan friterad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 176.0, proteins_100g: 2.2, carbohydrates_100g: 27.3, fat_100g: 6.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-1411', product_name: 'Äpple ugnsstekt m. olja el. flytande margarin socker mandelmassa valnötter', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 320.0, proteins_100g: 3.1, carbohydrates_100g: 23.3, fat_100g: 23.2, fiber_100g: 3.8 }},
    { code: 'lvsdb-1412', product_name: 'Banan friterad m. glass tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 253.0, proteins_100g: 2.4, carbohydrates_100g: 30.3, fat_100g: 13.2, fiber_100g: 1.7 }},
    { code: 'lvsdb-1413', product_name: 'Apelsinmarmelad', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 233.0, proteins_100g: 0.2, carbohydrates_100g: 56.9, fat_100g: 0.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1414', product_name: 'Gelé röda vinbär', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 0.2, carbohydrates_100g: 68.4, fat_100g: 0.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1415', product_name: 'Gelé svarta vinbär', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 265.0, proteins_100g: 0.2, carbohydrates_100g: 64.7, fat_100g: 0.0, fiber_100g: 0.8 }},
    { code: 'lvsdb-1416', product_name: 'Apelsinmarmelad lättsockrad lag', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 185.0, proteins_100g: 0.5, carbohydrates_100g: 44.5, fat_100g: 0.1, fiber_100g: 0.7 }},
    { code: 'lvsdb-1417', product_name: 'Marmelad olika smaker', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 0.3, carbohydrates_100g: 57.7, fat_100g: 0.1, fiber_100g: 0.7 }},
    { code: 'lvsdb-1418', product_name: 'Lingonsylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 0.2, carbohydrates_100g: 35.3, fat_100g: 0.2, fiber_100g: 1.0 }},
    { code: 'lvsdb-1419', product_name: 'Lingonsylt sötningsm.', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.4, carbohydrates_100g: 8.8, fat_100g: 0.4, fiber_100g: 1.2 }},
    { code: 'lvsdb-1420', product_name: 'Jordgubbssylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 0.2, carbohydrates_100g: 41.1, fat_100g: 0.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-1421', product_name: 'Björnbärssylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 0.2, carbohydrates_100g: 41.2, fat_100g: 0.1, fiber_100g: 2.4 }},
    { code: 'lvsdb-1422', product_name: 'Blåbärssylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 0.2, carbohydrates_100g: 34.9, fat_100g: 0.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-1423', product_name: 'Hallonsylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 0.4, carbohydrates_100g: 43.6, fat_100g: 0.2, fiber_100g: 1.7 }},
    { code: 'lvsdb-1424', product_name: 'Hjortronsylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 181.0, proteins_100g: 0.5, carbohydrates_100g: 42.0, fat_100g: 0.3, fiber_100g: 3.0 }},
    { code: 'lvsdb-1425', product_name: 'Krusbärssylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 163.0, proteins_100g: 0.3, carbohydrates_100g: 38.5, fat_100g: 0.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-1426', product_name: 'Körsbärssylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 181.0, proteins_100g: 0.7, carbohydrates_100g: 42.6, fat_100g: 0.3, fiber_100g: 1.2 }},
    { code: 'lvsdb-1427', product_name: 'Äppelmos', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 233.0, proteins_100g: 0.2, carbohydrates_100g: 56.9, fat_100g: 0.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1428', product_name: 'Äppelmos lättsockrad', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 0.2, carbohydrates_100g: 30.9, fat_100g: 0.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1429', product_name: 'Äppelmos osötad el. sötningsm.', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.2, carbohydrates_100g: 11.3, fat_100g: 0.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-1430', product_name: 'Cumberlandsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 0.6, carbohydrates_100g: 48.0, fat_100g: 0.3, fiber_100g: 0.7 }},
    { code: 'lvsdb-1431', product_name: 'Apelsinsaft konc. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 194.0, proteins_100g: 0.3, carbohydrates_100g: 47.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1432', product_name: 'Apelsinsaft drickf. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.0, carbohydrates_100g: 7.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1433', product_name: 'Saft lättsockrad konc.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 213.0, proteins_100g: 0.0, carbohydrates_100g: 52.4, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1434', product_name: 'Måltidsdryck drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 0.0, carbohydrates_100g: 8.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1435', product_name: 'Saft konc.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 213.0, proteins_100g: 0.0, carbohydrates_100g: 52.4, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1436', product_name: 'Saft drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 0.0, carbohydrates_100g: 8.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1437', product_name: 'Svartvinbärssaft konc. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 0.4, carbohydrates_100g: 42.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1438', product_name: 'Saft sötningsm. konc.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 0.5, carbohydrates_100g: 22.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1439', product_name: 'Fruktdryck u. kolsyra', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.0, carbohydrates_100g: 11.9, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1440', product_name: 'Läsk', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 0.0, carbohydrates_100g: 8.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1441', product_name: 'Läsk cola', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.0, carbohydrates_100g: 10.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1442', product_name: 'Läsk light', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 1.0, proteins_100g: 0.0, carbohydrates_100g: 0.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1443', product_name: 'Läsk cola light', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1444', product_name: 'Sportdryck drickf.', brands: 'Måltidsersättning, sportpreparat', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 0.0, carbohydrates_100g: 7.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1445', product_name: 'Saft sötningsm. drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 9.0, proteins_100g: 0.0, carbohydrates_100g: 2.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1446', product_name: 'Hallonsaft drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 0.0, carbohydrates_100g: 9.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1447', product_name: 'Svartvinbärssaft drickf. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 0.0, carbohydrates_100g: 8.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1448', product_name: 'Lingondricka drickf. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 0.0, carbohydrates_100g: 7.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1449', product_name: 'Äppeldricka drickf. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 0.0, carbohydrates_100g: 7.9, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1450', product_name: 'Saft sötningsm. drickf. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 0.0, carbohydrates_100g: 4.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1451', product_name: 'Glass isglass', brands: 'Glass', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 0.1, carbohydrates_100g: 23.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1452', product_name: 'Glass sorbet', brands: 'Glass', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 0.8, carbohydrates_100g: 30.5, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1453', product_name: 'Glass isglass saftis', brands: 'Glass', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 0.0, carbohydrates_100g: 20.5, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1454', product_name: 'Chokladdryck m. vatten', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 3.1, carbohydrates_100g: 7.6, fat_100g: 0.3, fiber_100g: 0.4 }},
    { code: 'lvsdb-1455', product_name: 'Chokladdryck drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 3.5, carbohydrates_100g: 9.8, fat_100g: 1.5, fiber_100g: 0.5 }},
    { code: 'lvsdb-1456', product_name: 'Mjölkchoklad m. hackade hasselnötter', brands: 'Godis', nutriments: { 'energy-kcal_100g': 545.0, proteins_100g: 8.7, carbohydrates_100g: 55.6, fat_100g: 31.8, fiber_100g: 1.7 }},
    { code: 'lvsdb-1457', product_name: 'Mjölkchoklad fylld m. mandelkrokant', brands: 'Godis', nutriments: { 'energy-kcal_100g': 539.0, proteins_100g: 4.1, carbohydrates_100g: 60.1, fat_100g: 31.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-1458', product_name: 'Mjölkchoklad m. mjuk kolafyllning', brands: 'Godis', nutriments: { 'energy-kcal_100g': 484.0, proteins_100g: 4.5, carbohydrates_100g: 62.6, fat_100g: 23.4, fiber_100g: 2.3 }},
    { code: 'lvsdb-1459', product_name: 'Kex m. mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 521.0, proteins_100g: 6.1, carbohydrates_100g: 58.7, fat_100g: 28.6, fiber_100g: 2.7 }},
    { code: 'lvsdb-1460', product_name: 'Kex m. kola mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 494.0, proteins_100g: 5.0, carbohydrates_100g: 64.1, fat_100g: 23.6, fiber_100g: 2.5 }},
    { code: 'lvsdb-1461', product_name: 'Mjuk nougat m. kolasås jordnötter mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 507.0, proteins_100g: 7.6, carbohydrates_100g: 54.4, fat_100g: 28.2, fiber_100g: 2.8 }},
    { code: 'lvsdb-1462', product_name: 'Mjuk chokladmaräng m. kola mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 442.0, proteins_100g: 4.2, carbohydrates_100g: 70.7, fat_100g: 15.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-1463', product_name: 'Choklad chokladpraliner', brands: 'Godis', nutriments: { 'energy-kcal_100g': 547.0, proteins_100g: 7.4, carbohydrates_100g: 53.7, fat_100g: 33.7, fiber_100g: 0.6 }},
    { code: 'lvsdb-1464', product_name: 'Chokladpralin', brands: 'Godis', nutriments: { 'energy-kcal_100g': 540.0, proteins_100g: 6.6, carbohydrates_100g: 53.3, fat_100g: 33.5, fiber_100g: 0.4 }},
    { code: 'lvsdb-1465', product_name: 'Mjuk kokos m. mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 478.0, proteins_100g: 3.6, carbohydrates_100g: 56.1, fat_100g: 25.7, fiber_100g: 4.2 }},
    { code: 'lvsdb-1466', product_name: 'Nötkräm chokladkräm', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 542.0, proteins_100g: 5.5, carbohydrates_100g: 55.4, fat_100g: 32.5, fiber_100g: 4.0 }},
    { code: 'lvsdb-1467', product_name: 'Mjölkchoklad m. sötningsm.', brands: 'Godis', nutriments: { 'energy-kcal_100g': 577.0, proteins_100g: 10.0, carbohydrates_100g: 46.9, fat_100g: 39.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-1468', product_name: 'Gelégodis', brands: 'Godis', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 4.7, carbohydrates_100g: 81.3, fat_100g: 0.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-1469', product_name: 'Karameller', brands: 'Godis', nutriments: { 'energy-kcal_100g': 395.0, proteins_100g: 0.0, carbohydrates_100g: 97.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1470', product_name: 'Kola', brands: 'Godis', nutriments: { 'energy-kcal_100g': 456.0, proteins_100g: 4.1, carbohydrates_100g: 68.9, fat_100g: 18.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1471', product_name: 'Marmeladkonfekt', brands: 'Godis', nutriments: { 'energy-kcal_100g': 336.0, proteins_100g: 0.0, carbohydrates_100g: 82.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1472', product_name: 'Skumgodis', brands: 'Godis', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 4.7, carbohydrates_100g: 81.3, fat_100g: 0.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-1473', product_name: 'Polkagris', brands: 'Godis', nutriments: { 'energy-kcal_100g': 399.0, proteins_100g: 0.0, carbohydrates_100g: 98.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1474', product_name: 'Tuggummi', brands: 'Godis', nutriments: { 'energy-kcal_100g': 378.0, proteins_100g: 0.4, carbohydrates_100g: 92.7, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1475', product_name: 'Klubba chokladkola karamell', brands: 'Godis', nutriments: { 'energy-kcal_100g': 436.0, proteins_100g: 2.5, carbohydrates_100g: 80.6, fat_100g: 11.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1476', product_name: 'Chokladkola mörk m. chokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 470.0, proteins_100g: 4.3, carbohydrates_100g: 71.7, fat_100g: 18.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1477', product_name: 'Kex rån m. chokladfyllning', brands: 'Godis', nutriments: { 'energy-kcal_100g': 500.0, proteins_100g: 9.7, carbohydrates_100g: 58.5, fat_100g: 24.6, fiber_100g: 2.8 }},
    { code: 'lvsdb-1478', product_name: 'Fruktkola', brands: 'Godis', nutriments: { 'energy-kcal_100g': 394.0, proteins_100g: 0.7, carbohydrates_100g: 96.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1479', product_name: 'Skumboll m. chokladöverdrag kokos', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 412.0, proteins_100g: 5.0, carbohydrates_100g: 52.6, fat_100g: 20.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-1480', product_name: 'Skumboll m. chokladöverdrag', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 396.0, proteins_100g: 5.0, carbohydrates_100g: 59.6, fat_100g: 15.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-1481', product_name: 'Bar energibar m. choklad nötter', brands: 'Godis', nutriments: { 'energy-kcal_100g': 419.0, proteins_100g: 7.1, carbohydrates_100g: 69.6, fat_100g: 11.2, fiber_100g: 4.5 }},
    { code: 'lvsdb-1482', product_name: 'Karameller sockerfria', brands: 'Godis', nutriments: { 'energy-kcal_100g': 169.0, proteins_100g: 6.1, carbohydrates_100g: 5.6, fat_100g: 0.5, fiber_100g: 61.0 }},
    { code: 'lvsdb-1483', product_name: 'Tuggummi sockerfritt', brands: 'Godis', nutriments: { 'energy-kcal_100g': 153.0, proteins_100g: 0.6, carbohydrates_100g: 86.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1484', product_name: 'Kakaopulver fett 20-22%', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 394.0, proteins_100g: 23.5, carbohydrates_100g: 10.6, fat_100g: 21.5, fiber_100g: 34.0 }},
    { code: 'lvsdb-1485', product_name: 'Chokladdryckspulver m. socker fett 2,5%', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 402.0, proteins_100g: 5.1, carbohydrates_100g: 87.7, fat_100g: 2.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1486', product_name: 'Chokladboll hemlagad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 450.0, proteins_100g: 3.5, carbohydrates_100g: 52.4, fat_100g: 24.5, fiber_100g: 3.5 }},
    { code: 'lvsdb-1487', product_name: 'Måltidsersättning pulver chokladsmak berikad', brands: 'Måltidsersättning, sportpreparat', nutriments: { 'energy-kcal_100g': 376.0, proteins_100g: 35.0, carbohydrates_100g: 32.6, fat_100g: 9.0, fiber_100g: 11.6 }},
    { code: 'lvsdb-1488', product_name: 'Socker', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 405.0, proteins_100g: 0.0, carbohydrates_100g: 99.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1489', product_name: 'Brun farin', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 388.0, proteins_100g: 0.0, carbohydrates_100g: 95.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1490', product_name: 'Ljus sirap', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 323.0, proteins_100g: 0.0, carbohydrates_100g: 79.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1491', product_name: 'Honung', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 332.0, proteins_100g: 0.3, carbohydrates_100g: 81.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1492', product_name: 'Druvsocker', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 370.0, proteins_100g: 0.0, carbohydrates_100g: 91.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1493', product_name: 'Fruktsocker', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 373.0, proteins_100g: 0.0, carbohydrates_100g: 91.7, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1494', product_name: 'Sorbitol m. sackarin', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 235.0, proteins_100g: 0.0, carbohydrates_100g: 98.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1495', product_name: 'Svagdricka vol. % 2,3', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 0.2, carbohydrates_100g: 3.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1496', product_name: 'Öl lättöl vol. % 2,3', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 0.2, carbohydrates_100g: 3.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1497', product_name: 'Öl pilsner folköl vol. % 3,5', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 40.0, proteins_100g: 0.4, carbohydrates_100g: 4.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1498', product_name: 'Cider vol. % 1', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 0.0, carbohydrates_100g: 10.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1499', product_name: 'Vin vitt vol. % 1', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 0.0, carbohydrates_100g: 2.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1500', product_name: 'Vin rött el. rosé vol. % 1', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 0.0, carbohydrates_100g: 2.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1501', product_name: 'Öl starköl el. exportöl vol. % 5,4', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 42.0, proteins_100g: 0.0, carbohydrates_100g: 3.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1502', product_name: 'Vin rött vol. % 14', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 0.0, carbohydrates_100g: 1.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1503', product_name: 'Vin vitt vol. % 12', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 0.0, carbohydrates_100g: 1.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1504', product_name: 'Vin vitt el. rhenvin vol. % 10', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 0.1, carbohydrates_100g: 3.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1505', product_name: 'Glögg vin vol. % 10', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 0.0, carbohydrates_100g: 17.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1506', product_name: 'Starkvin vol. % 18 typ Madeira', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 0.0, carbohydrates_100g: 7.9, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1507', product_name: 'Starkvin vitt rött vol. % 20 typ Portvin', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 0.0, carbohydrates_100g: 9.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1508', product_name: 'Starkvin halvtorr vol. % 17 typ Sherry', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 0.0, carbohydrates_100g: 3.4, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1509', product_name: 'Glögg starkvin vol. % 16', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 0.0, carbohydrates_100g: 22.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1510', product_name: 'Brännvin renat el. vodka vol. % 40', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1511', product_name: 'Likör söt vol. % 24', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 266.0, proteins_100g: 0.0, carbohydrates_100g: 33.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1512', product_name: 'Likör Kaptenlöjtnant vol. % 38', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 321.0, proteins_100g: 0.0, carbohydrates_100g: 27.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1513', product_name: 'Konjak el. brandy vol. % 40', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 225.0, proteins_100g: 0.0, carbohydrates_100g: 0.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1514', product_name: 'Punsch vol. % 26', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 244.0, proteins_100g: 0.0, carbohydrates_100g: 26.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1515', product_name: 'Rom vol. % 40', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 223.0, proteins_100g: 0.0, carbohydrates_100g: 0.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1516', product_name: 'Brännvin kryddat vol. % 40 ', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 0.0, carbohydrates_100g: 1.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1517', product_name: 'Gin vol. % 40', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1518', product_name: 'Whisky vol. % 40', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1519', product_name: 'Likör mindre söt vol. % 24', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 232.0, proteins_100g: 0.0, carbohydrates_100g: 24.7, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1520', product_name: 'Kaffedrink Irish coffee m.whiskey vispad grädde', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 0.1, carbohydrates_100g: 4.2, fat_100g: 2.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1521', product_name: 'Bovetemjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 13.5, carbohydrates_100g: 65.1, fat_100g: 3.6, fiber_100g: 5.5 }},
    { code: 'lvsdb-1522', product_name: 'Havremust pulver', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 14.0, carbohydrates_100g: 54.4, fat_100g: 7.2, fiber_100g: 10.0 }},
    { code: 'lvsdb-1523', product_name: 'Kornmjöl fullkorn', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 341.0, proteins_100g: 9.2, carbohydrates_100g: 64.7, fat_100g: 3.0, fiber_100g: 7.6 }},
    { code: 'lvsdb-1524', product_name: 'Majsmjöl gult u. groddar', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 6.0, carbohydrates_100g: 71.5, fat_100g: 3.4, fiber_100g: 4.7 }},
    { code: 'lvsdb-1525', product_name: 'Rågmjöl fullkorn', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 325.0, proteins_100g: 8.1, carbohydrates_100g: 59.3, fat_100g: 1.7, fiber_100g: 18.8 }},
    { code: 'lvsdb-1526', product_name: 'Vetemjöl fullkorn grahamsmjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 336.0, proteins_100g: 10.7, carbohydrates_100g: 61.0, fat_100g: 2.0, fiber_100g: 13.8 }},
    { code: 'lvsdb-1527', product_name: 'Vetediet berikad', brands: 'Måltidsersättning, sportpreparat', nutriments: { 'energy-kcal_100g': 388.0, proteins_100g: 19.0, carbohydrates_100g: 53.5, fat_100g: 8.5, fiber_100g: 9.5 }},
    { code: 'lvsdb-1528', product_name: 'Vetemjöl bagerivetemjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 348.0, proteins_100g: 10.6, carbohydrates_100g: 70.2, fat_100g: 1.6, fiber_100g: 3.1 }},
    { code: 'lvsdb-1529', product_name: 'Vetemjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 8.5, carbohydrates_100g: 72.4, fat_100g: 1.9, fiber_100g: 3.6 }},
    { code: 'lvsdb-1530', product_name: 'Majsstärkelse', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 362.0, proteins_100g: 0.0, carbohydrates_100g: 87.5, fat_100g: 0.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1531', product_name: 'Potatismjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 346.0, proteins_100g: 0.0, carbohydrates_100g: 84.3, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1532', product_name: 'Samarinpulver', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1533', product_name: 'Samarin drickf.', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1534', product_name: 'Vatten sodavatten', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1535', product_name: 'Vatten vichyvatten', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1536', product_name: 'Vatten mineralvatten', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1537', product_name: 'Vatten kranvatten', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1538', product_name: 'Snabbkaffe pulver', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 305.0, proteins_100g: 22.5, carbohydrates_100g: 38.6, fat_100g: 0.9, fiber_100g: 25.5 }},
    { code: 'lvsdb-1539', product_name: 'Snabbkaffe drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 2.0, proteins_100g: 0.1, carbohydrates_100g: 0.4, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1540', product_name: 'Kaffe bryggt', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 2.0, proteins_100g: 0.0, carbohydrates_100g: 0.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1541', product_name: 'Kaffe espresso bryggt drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 9.0, proteins_100g: 0.1, carbohydrates_100g: 1.7, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1542', product_name: 'Snabbkaffe koffeinfritt drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 2.0, proteins_100g: 0.2, carbohydrates_100g: 0.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1543', product_name: 'Tepulver', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 309.0, proteins_100g: 11.7, carbohydrates_100g: 61.8, fat_100g: 0.4, fiber_100g: 3.7 }},
    { code: 'lvsdb-1544', product_name: 'Te bryggt', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1545', product_name: 'Örtte drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 1.0, proteins_100g: 0.0, carbohydrates_100g: 0.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1546', product_name: 'Nyponte drickf. m. svarta vinbär', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 3.0, proteins_100g: 0.0, carbohydrates_100g: 0.7, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1547', product_name: 'Ättiksprit ättiksyra 12%', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 0.0, carbohydrates_100g: 12.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1548', product_name: 'Vinäger ättiksyra 7%', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.4, carbohydrates_100g: 7.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1549', product_name: 'Äppelcidervinäger ättiksyra 7%', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.4, carbohydrates_100g: 7.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1550', product_name: 'Chilisås tomat', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.5, carbohydrates_100g: 16.7, fat_100g: 0.5, fiber_100g: 1.2 }},
    { code: 'lvsdb-1551', product_name: 'Ketchup', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 1.0, carbohydrates_100g: 18.5, fat_100g: 0.5, fiber_100g: 3.9 }},
    { code: 'lvsdb-1552', product_name: 'Engelsk brown sauce HP-sås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 1.1, carbohydrates_100g: 25.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1553', product_name: 'Grillsås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 1.5, carbohydrates_100g: 8.0, fat_100g: 6.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1554', product_name: 'Senap svensk', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 173.0, proteins_100g: 4.5, carbohydrates_100g: 23.1, fat_100g: 6.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1555', product_name: 'Senap fransk', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 6.0, carbohydrates_100g: 5.3, fat_100g: 5.0, fiber_100g: 1.7 }},
    { code: 'lvsdb-1556', product_name: 'Sötsur sås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 0.2, carbohydrates_100g: 23.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1557', product_name: 'Salt m. jod', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1558', product_name: 'Salt mineralsalt', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1559', product_name: 'Salt havssalt u. jod', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1560', product_name: 'Salt örtsalt', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 0.9, carbohydrates_100g: 2.7, fat_100g: 0.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-1561', product_name: 'Jäst färsk', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 12.1, carbohydrates_100g: 14.1, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1562', product_name: 'Jäst torkad', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 360.0, proteins_100g: 37.0, carbohydrates_100g: 48.1, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1563', product_name: 'Bakpulver', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 0.1, carbohydrates_100g: 42.4, fat_100g: 0.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-1564', product_name: 'Béchamelsås m. lättmjölk grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 4.3, carbohydrates_100g: 8.2, fat_100g: 6.4, fiber_100g: 0.2 }},
    { code: 'lvsdb-1565', product_name: 'Ljus sås m. mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 4.8, carbohydrates_100g: 9.3, fat_100g: 5.8, fiber_100g: 0.2 }},
    { code: 'lvsdb-1566', product_name: 'Ljus sås m. buljong grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 1.3, carbohydrates_100g: 4.9, fat_100g: 8.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-1567', product_name: 'Béchamelsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 122.0, proteins_100g: 4.3, carbohydrates_100g: 8.1, fat_100g: 8.0, fiber_100g: 0.1 }},
    { code: 'lvsdb-1568', product_name: 'Gratängsås u. ost hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 3.9, carbohydrates_100g: 6.5, fat_100g: 8.8, fiber_100g: 0.2 }},
    { code: 'lvsdb-1569', product_name: 'Ljus sås m. grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 1.3, carbohydrates_100g: 4.9, fat_100g: 9.0, fiber_100g: 0.2 }},
    { code: 'lvsdb-1570', product_name: 'Ostsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 7.3, carbohydrates_100g: 7.3, fat_100g: 10.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-1571', product_name: 'Ostsås m. ädelost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 6.9, carbohydrates_100g: 6.6, fat_100g: 12.3, fiber_100g: 0.1 }},
    { code: 'lvsdb-1572', product_name: 'Ostsås till moussaka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 131.0, proteins_100g: 8.8, carbohydrates_100g: 7.4, fat_100g: 7.4, fiber_100g: 0.2 }},
    { code: 'lvsdb-1573', product_name: 'Brunsås m. mjölk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 4.5, carbohydrates_100g: 11.8, fat_100g: 8.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-1574', product_name: 'Sky', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 29.0, proteins_100g: 1.2, carbohydrates_100g: 0.0, fat_100g: 2.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1575', product_name: 'Brunsås m. buljong grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 1.3, carbohydrates_100g: 7.3, fat_100g: 8.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-1576', product_name: 'Brunsås m. buljong', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 1.1, carbohydrates_100g: 7.5, fat_100g: 6.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-1577', product_name: 'Currysås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 99.0, proteins_100g: 1.4, carbohydrates_100g: 4.6, fat_100g: 8.4, fiber_100g: 0.2 }},
    { code: 'lvsdb-1578', product_name: 'Brunsås m. kaffegrädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 1.3, carbohydrates_100g: 7.4, fat_100g: 7.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-1579', product_name: 'Korintsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 0.8, carbohydrates_100g: 9.6, fat_100g: 3.0, fiber_100g: 0.6 }},
    { code: 'lvsdb-1580', product_name: 'Brunsås tillagad pulver m. mjölk vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 2.2, carbohydrates_100g: 7.1, fat_100g: 2.0, fiber_100g: 0.1 }},
    { code: 'lvsdb-1581', product_name: 'Gräddsås tillagad pulver m. mjölk vatten smör', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 2.7, carbohydrates_100g: 7.6, fat_100g: 8.4, fiber_100g: 0.1 }},
    { code: 'lvsdb-1582', product_name: 'Tomatsås kryddstark', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 1.1, carbohydrates_100g: 5.8, fat_100g: 2.6, fiber_100g: 1.5 }},
    { code: 'lvsdb-1583', product_name: 'Dillsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 1.4, carbohydrates_100g: 7.5, fat_100g: 7.8, fiber_100g: 0.4 }},
    { code: 'lvsdb-1584', product_name: 'Äggsås m. persilja', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 3.5, carbohydrates_100g: 4.1, fat_100g: 8.9, fiber_100g: 0.2 }},
    { code: 'lvsdb-1585', product_name: 'Pesto hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 545.0, proteins_100g: 10.6, carbohydrates_100g: 1.9, fat_100g: 55.0, fiber_100g: 4.1 }},
    { code: 'lvsdb-1586', product_name: 'Pesto m. basilika pinjenötter cashewnötter', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 581.0, proteins_100g: 4.2, carbohydrates_100g: 12.6, fat_100g: 57.1, fiber_100g: 4.1 }},
    { code: 'lvsdb-1587', product_name: 'Dippmix pulver olika smaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 307.0, proteins_100g: 11.4, carbohydrates_100g: 59.3, fat_100g: 1.1, fiber_100g: 5.4 }},
    { code: 'lvsdb-1588', product_name: 'Sweet chilisås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 207.0, proteins_100g: 0.8, carbohydrates_100g: 43.4, fat_100g: 2.9, fiber_100g: 1.3 }},
    { code: 'lvsdb-1589', product_name: 'Pastasås m. tomat örtkryddor', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 1.9, carbohydrates_100g: 13.1, fat_100g: 4.4, fiber_100g: 3.0 }},
    { code: 'lvsdb-1590', product_name: 'Pastasås m. basilika', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.6, carbohydrates_100g: 5.3, fat_100g: 2.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-1591', product_name: 'Sötsur sås m. grönsaker konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 0.4, carbohydrates_100g: 20.1, fat_100g: 2.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-1592', product_name: 'Orientalisk sås m. grönsaker konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 90.0, proteins_100g: 1.1, carbohydrates_100g: 10.1, fat_100g: 4.8, fiber_100g: 1.4 }},
    { code: 'lvsdb-1593', product_name: 'Teriyakisås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 3.2, carbohydrates_100g: 22.2, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1594', product_name: 'Frukostflingor müsli fullkorn m. frukt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 374.0, proteins_100g: 8.2, carbohydrates_100g: 69.9, fat_100g: 4.5, fiber_100g: 8.8 }},
    { code: 'lvsdb-1595', product_name: 'Frukostflingor müsli fullkorn m. bär', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 366.0, proteins_100g: 8.6, carbohydrates_100g: 68.9, fat_100g: 3.5, fiber_100g: 10.3 }},
    { code: 'lvsdb-1596', product_name: 'Frukostflingor müsli fullkorn m. socker frukt nötter', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 455.0, proteins_100g: 9.9, carbohydrates_100g: 61.2, fat_100g: 17.1, fiber_100g: 8.0 }},
    { code: 'lvsdb-1597', product_name: 'Frukostflingor crunchy fullkorn m. socker russin kokos', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 450.0, proteins_100g: 7.0, carbohydrates_100g: 65.5, fat_100g: 16.3, fiber_100g: 5.8 }},
    { code: 'lvsdb-1598', product_name: 'Frukostflingor crunchy naturell m. socker', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 461.0, proteins_100g: 7.4, carbohydrates_100g: 64.8, fat_100g: 17.7, fiber_100g: 5.7 }},
    { code: 'lvsdb-1599', product_name: 'Frukostflingor müsli fullkorn m. socker frukt kokos', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 412.0, proteins_100g: 6.5, carbohydrates_100g: 67.6, fat_100g: 10.9, fiber_100g: 7.6 }},
    { code: 'lvsdb-1600', product_name: 'Frukostflingor müsli fullkorn m. socker frukt bär', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 466.0, proteins_100g: 7.4, carbohydrates_100g: 64.4, fat_100g: 18.4, fiber_100g: 5.9 }},
    { code: 'lvsdb-1601', product_name: 'Frukostflingor müsli flingblandning fullkorn m. frukt nötter  ', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 378.0, proteins_100g: 9.4, carbohydrates_100g: 66.1, fat_100g: 6.1, fiber_100g: 9.3 }},
    { code: 'lvsdb-1602', product_name: 'Frukostflingor müsli fullkorn m. frukt banan', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 381.0, proteins_100g: 8.2, carbohydrates_100g: 65.2, fat_100g: 7.0, fiber_100g: 10.7 }},
    { code: 'lvsdb-1603', product_name: 'Surimi fisk', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 0.8, carbohydrates_100g: 23.5, fat_100g: 0.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1604', product_name: 'Matlagningsbas fett 15%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 155.0, proteins_100g: 2.0, carbohydrates_100g: 3.0, fat_100g: 15.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1605', product_name: 'Matlagningsbas fett 7%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 89.0, proteins_100g: 1.1, carbohydrates_100g: 5.4, fat_100g: 7.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1606', product_name: 'Vispgrädde ersättningsprod. mjölk olja fett 20%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 206.0, proteins_100g: 2.8, carbohydrates_100g: 5.0, fat_100g: 19.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1607', product_name: 'Kaffegrädde ersättningsprod. mjölk olja fett 10%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 3.0, carbohydrates_100g: 4.4, fat_100g: 9.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1608', product_name: 'Vaniljvisp fett 12%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 202.0, proteins_100g: 4.4, carbohydrates_100g: 19.1, fat_100g: 12.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1609', product_name: 'Crème fraiche smaksatt fett 13%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 2.9, carbohydrates_100g: 6.7, fat_100g: 13.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1610', product_name: 'Crème fraiche smaksatt fett 28%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 275.0, proteins_100g: 2.0, carbohydrates_100g: 4.4, fat_100g: 28.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1611', product_name: 'Mini fraiche fett 5%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 3.8, carbohydrates_100g: 5.7, fat_100g: 5.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1612', product_name: 'Filmjölk naturell fett 4,2%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 3.5, carbohydrates_100g: 4.2, fat_100g: 4.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1613', product_name: 'Vit choklad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 547.0, proteins_100g: 5.1, carbohydrates_100g: 61.6, fat_100g: 31.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1614', product_name: 'Mörk choklad kakao ≥ 70%', brands: 'Godis', nutriments: { 'energy-kcal_100g': 572.0, proteins_100g: 9.7, carbohydrates_100g: 50.7, fat_100g: 37.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1615', product_name: 'Mörk choklad kakao < 70%', brands: 'Godis', nutriments: { 'energy-kcal_100g': 536.0, proteins_100g: 6.3, carbohydrates_100g: 63.1, fat_100g: 28.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1616', product_name: 'Bakchoklad mörk', brands: 'Godis', nutriments: { 'energy-kcal_100g': 556.0, proteins_100g: 5.6, carbohydrates_100g: 59.8, fat_100g: 32.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1617', product_name: 'Mjölkchoklad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 535.0, proteins_100g: 5.2, carbohydrates_100g: 58.1, fat_100g: 30.8, fiber_100g: 3.0 }},
    { code: 'lvsdb-1618', product_name: 'Kebabkött frysvara', brands: 'Kött', nutriments: { 'energy-kcal_100g': 248.0, proteins_100g: 14.3, carbohydrates_100g: 6.2, fat_100g: 18.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1619', product_name: 'Ris avorio okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 358.0, proteins_100g: 6.7, carbohydrates_100g: 78.1, fat_100g: 1.3, fiber_100g: 1.2 }},
    { code: 'lvsdb-1620', product_name: 'Lök rostad ', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 607.0, proteins_100g: 6.4, carbohydrates_100g: 35.0, fat_100g: 48.5, fiber_100g: 4.9 }},
    { code: 'lvsdb-1621', product_name: 'Glass glasspinne m. frukt  mjölk fett 5,5%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 166.0, proteins_100g: 3.3, carbohydrates_100g: 25.5, fat_100g: 5.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1622', product_name: 'Glass glasspinne fett 10%', brands: 'Glass', nutriments: { 'energy-kcal_100g': 199.0, proteins_100g: 4.1, carbohydrates_100g: 22.6, fat_100g: 10.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1623', product_name: 'Bar m. fiber havre vete naturell', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 446.0, proteins_100g: 6.9, carbohydrates_100g: 49.9, fat_100g: 20.8, fiber_100g: 16.5 }},
    { code: 'lvsdb-1624', product_name: 'Knäckemacka vete olika fyllningar', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 487.0, proteins_100g: 11.7, carbohydrates_100g: 52.1, fat_100g: 25.0, fiber_100g: 3.6 }},
    { code: 'lvsdb-1625', product_name: 'Knäckemacka fullkorn råg olika fyllningar', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 471.0, proteins_100g: 12.6, carbohydrates_100g: 45.9, fat_100g: 24.5, fiber_100g: 9.1 }},
    { code: 'lvsdb-1626', product_name: 'Falafel kikärtskroketter frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 231.0, proteins_100g: 8.1, carbohydrates_100g: 21.2, fat_100g: 11.3, fiber_100g: 6.1 }},
    { code: 'lvsdb-1627', product_name: 'Pytt i panna m. sojaprotein veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 127.0, proteins_100g: 5.6, carbohydrates_100g: 16.3, fat_100g: 3.6, fiber_100g: 3.1 }},
    { code: 'lvsdb-1628', product_name: 'Korv veg. soja- och veteprotein kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 15.3, carbohydrates_100g: 8.7, fat_100g: 1.6, fiber_100g: 4.5 }},
    { code: 'lvsdb-1629', product_name: 'Soja- och veteprotein bullar kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 16.7, carbohydrates_100g: 9.0, fat_100g: 7.3, fiber_100g: 5.2 }},
    { code: 'lvsdb-1630', product_name: 'Sojaprotein färs kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 15.2, carbohydrates_100g: 4.8, fat_100g: 8.6, fiber_100g: 5.3 }},
    { code: 'lvsdb-1631', product_name: 'Veteprotein grytbitar', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 232.0, proteins_100g: 27.4, carbohydrates_100g: 9.9, fat_100g: 9.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1632', product_name: 'Matlagningsbas m. soja fett 17%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 188.0, proteins_100g: 2.9, carbohydrates_100g: 5.2, fat_100g: 17.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1633', product_name: 'Bar müslibar fullkorn m. röd frukt berikad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 393.0, proteins_100g: 8.4, carbohydrates_100g: 77.9, fat_100g: 4.4, fiber_100g: 2.1 }},
    { code: 'lvsdb-1634', product_name: 'Bar müslibar m. choklad berikad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 398.0, proteins_100g: 8.1, carbohydrates_100g: 73.2, fat_100g: 6.5, fiber_100g: 5.8 }},
    { code: 'lvsdb-1635', product_name: 'Jordnötssås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 281.0, proteins_100g: 6.3, carbohydrates_100g: 8.5, fat_100g: 24.2, fiber_100g: 3.5 }},
    { code: 'lvsdb-1636', product_name: 'Coleslaw hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 0.9, carbohydrates_100g: 6.9, fat_100g: 5.9, fiber_100g: 2.0 }},
    { code: 'lvsdb-1637', product_name: 'Löksås m. grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 1.5, carbohydrates_100g: 11.1, fat_100g: 11.1, fiber_100g: 0.7 }},
    { code: 'lvsdb-1638', product_name: 'Nudlar äggnudlar kokta m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 4.8, carbohydrates_100g: 23.5, fat_100g: 1.4, fiber_100g: 1.0 }},
    { code: 'lvsdb-1639', product_name: 'Nässlor stuvade', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 62.0, proteins_100g: 4.1, carbohydrates_100g: 2.3, fat_100g: 3.7, fiber_100g: 2.2 }},
    { code: 'lvsdb-1640', product_name: 'Kantarell stuvad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 169.0, proteins_100g: 3.5, carbohydrates_100g: 6.0, fat_100g: 14.3, fiber_100g: 2.2 }},
    { code: 'lvsdb-1641', product_name: 'Gryta ratatouille veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 1.0, carbohydrates_100g: 5.8, fat_100g: 2.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-1642', product_name: 'Potatisgratäng m. matlagningsgrädde ost hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 4.8, carbohydrates_100g: 13.4, fat_100g: 7.4, fiber_100g: 1.7 }},
    { code: 'lvsdb-1643', product_name: 'Sjömansbiff', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 6.8, carbohydrates_100g: 10.4, fat_100g: 2.8, fiber_100g: 1.3 }},
    { code: 'lvsdb-1644', product_name: 'Gryta kreolsk gryta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 175.0, proteins_100g: 10.7, carbohydrates_100g: 4.8, fat_100g: 12.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-1645', product_name: 'Flygande Jakob kyckling m. bacon jordnötter banan', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 13.9, carbohydrates_100g: 6.3, fat_100g: 8.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-1646', product_name: 'Korv prinskorv stekt kött 61%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 283.0, proteins_100g: 10.6, carbohydrates_100g: 4.0, fat_100g: 25.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1647', product_name: 'Skinkröra kall', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 7.6, carbohydrates_100g: 2.7, fat_100g: 11.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-1648', product_name: 'Hamburgare blandfärs stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 260.0, proteins_100g: 22.3, carbohydrates_100g: 0.0, fat_100g: 19.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1649', product_name: 'Köttfärssås blandfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 6.0, carbohydrates_100g: 4.6, fat_100g: 5.9, fiber_100g: 1.1 }},
    { code: 'lvsdb-1650', product_name: 'Nöt färs fett 10% stekt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 25.0, carbohydrates_100g: 0.2, fat_100g: 13.9, fiber_100g: 0.1 }},
    { code: 'lvsdb-1651', product_name: 'Nöt el. gris kött stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 23.5, carbohydrates_100g: 0.0, fat_100g: 8.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1652', product_name: 'Carbonara pastasås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 290.0, proteins_100g: 17.2, carbohydrates_100g: 1.7, fat_100g: 24.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1653', product_name: 'Skagenröra hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 161.0, proteins_100g: 12.6, carbohydrates_100g: 1.9, fat_100g: 11.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-1654', product_name: 'Fisksoppa m. rotfrukter', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 73.0, proteins_100g: 6.3, carbohydrates_100g: 3.9, fat_100g: 3.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-1655', product_name: 'Tonfiskröra hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 182.0, proteins_100g: 13.3, carbohydrates_100g: 3.0, fat_100g: 13.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-1656', product_name: 'Havregrynsgröt fullkorn fiberhavregryn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.8, carbohydrates_100g: 11.2, fat_100g: 1.3, fiber_100g: 1.9 }},
    { code: 'lvsdb-1657', product_name: 'Havregrynsgröt kokt m. mjölk', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 89.0, proteins_100g: 4.1, carbohydrates_100g: 12.2, fat_100g: 2.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-1658', product_name: 'Nudlar glasnudlar kokta m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 0.1, carbohydrates_100g: 32.9, fat_100g: 0.0, fiber_100g: 0.2 }},
    { code: 'lvsdb-1659', product_name: 'Gröt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 2.0, carbohydrates_100g: 11.4, fat_100g: 1.4, fiber_100g: 1.3 }},
    { code: 'lvsdb-1660', product_name: 'Morotskaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 386.0, proteins_100g: 4.0, carbohydrates_100g: 43.2, fat_100g: 21.7, fiber_100g: 1.0 }},
    { code: 'lvsdb-1661', product_name: 'Pannkaka tunn m. sojadryck havredryck', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 4.8, carbohydrates_100g: 17.6, fat_100g: 6.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-1662', product_name: 'Paj m. broccoli skinka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 206.0, proteins_100g: 7.8, carbohydrates_100g: 12.4, fat_100g: 13.7, fiber_100g: 1.3 }},
    { code: 'lvsdb-1663', product_name: 'Pizza m. kebabkött hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 168.0, proteins_100g: 6.2, carbohydrates_100g: 18.4, fat_100g: 7.3, fiber_100g: 1.7 }},
    { code: 'lvsdb-1664', product_name: 'Pizza Hawaii m. skinka ananas restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 300.0, proteins_100g: 16.1, carbohydrates_100g: 20.7, fat_100g: 16.3, fiber_100g: 3.3 }},
    { code: 'lvsdb-1665', product_name: 'Ostsås m. skinka hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 10.3, carbohydrates_100g: 5.9, fat_100g: 8.6, fiber_100g: 0.1 }},
    { code: 'lvsdb-1666', product_name: 'Tzatziki', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 2.4, carbohydrates_100g: 4.2, fat_100g: 5.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1667', product_name: 'Ris à la malta m. lättmjölk mellangrädde fett 27%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 3.0, carbohydrates_100g: 16.2, fat_100g: 4.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-1668', product_name: 'Rödkålssallad m. äpple', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 0.5, carbohydrates_100g: 18.3, fat_100g: 0.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-1669', product_name: 'Champinjon stekt u. fett', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 3.1, carbohydrates_100g: 3.5, fat_100g: 0.3, fiber_100g: 3.1 }},
    { code: 'lvsdb-1670', product_name: 'Palsternacka kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.7, carbohydrates_100g: 12.5, fat_100g: 0.6, fiber_100g: 3.7 }},
    { code: 'lvsdb-1671', product_name: 'Gratängsås m. ost hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 5.9, carbohydrates_100g: 6.5, fat_100g: 9.9, fiber_100g: 0.2 }},
    { code: 'lvsdb-1672', product_name: 'Fänkål kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 2.8, carbohydrates_100g: 1.8, fat_100g: 0.4, fiber_100g: 3.3 }},
    { code: 'lvsdb-1673', product_name: 'Kroppkakor el. potatispalt m. fläsk hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 4.6, carbohydrates_100g: 19.7, fat_100g: 6.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-1674', product_name: 'Currysås m. lätt crème fraiche hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 1.1, carbohydrates_100g: 5.5, fat_100g: 6.3, fiber_100g: 0.7 }},
    { code: 'lvsdb-1675', product_name: 'Korv stroganoff mager korv fett 15% grädde fett 15%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 7.2, carbohydrates_100g: 6.3, fat_100g: 14.7, fiber_100g: 0.5 }},
    { code: 'lvsdb-1676', product_name: 'Ostkaka fett 7%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 10.4, carbohydrates_100g: 16.6, fat_100g: 7.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1677', product_name: 'Rapsolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1678', product_name: 'Matfettsblandning fett 75% berikad typ Bregott', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 667.0, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 75.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1679', product_name: 'Lättmargarin fett 40% berikad typ Lätta', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 368.0, proteins_100g: 0.5, carbohydrates_100g: 3.0, fat_100g: 40.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1680', product_name: 'Äggröra', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 11.7, carbohydrates_100g: 1.0, fat_100g: 16.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1681', product_name: 'Ägg kokt', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 12.2, carbohydrates_100g: 0.4, fat_100g: 9.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1682', product_name: 'Aloe vera juice naturell', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 3.0, proteins_100g: 0.0, carbohydrates_100g: 0.5, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1683', product_name: 'Aloe vera juice m. grönt te', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.0, carbohydrates_100g: 6.5, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1684', product_name: 'Aloe vera-dryck m. tranbär äpple', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 0.0, carbohydrates_100g: 9.1, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1685', product_name: 'Aloe vera-dryck naturell', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 0.0, carbohydrates_100g: 4.4, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1686', product_name: 'Toscaglasyr', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 522.0, proteins_100g: 9.3, carbohydrates_100g: 29.6, fat_100g: 39.6, fiber_100g: 7.2 }},
    { code: 'lvsdb-1687', product_name: 'Pasta makaroner spagetti okokt glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 362.0, proteins_100g: 7.3, carbohydrates_100g: 77.6, fat_100g: 1.3, fiber_100g: 2.8 }},
    { code: 'lvsdb-1688', product_name: 'Pasta fusilli lasagneplattor okokt glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 7.4, carbohydrates_100g: 76.9, fat_100g: 1.4, fiber_100g: 3.1 }},
    { code: 'lvsdb-1689', product_name: 'Pepparkaka glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 460.0, proteins_100g: 1.5, carbohydrates_100g: 75.6, fat_100g: 16.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-1690', product_name: 'Kex digestive fullkorn glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 462.0, proteins_100g: 1.9, carbohydrates_100g: 75.3, fat_100g: 16.1, fiber_100g: 3.2 }},
    { code: 'lvsdb-1691', product_name: 'Hårt bröd glutenfritt fibrer ca 7,5% berikad typ grovknäcke', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 372.0, proteins_100g: 2.9, carbohydrates_100g: 79.9, fat_100g: 2.3, fiber_100g: 8.1 }},
    { code: 'lvsdb-1692', product_name: 'Pasta tagliatelle m. ägg okokt glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 2.6, carbohydrates_100g: 82.1, fat_100g: 4.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1693', product_name: 'Pasta okokt majs 100% glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 366.0, proteins_100g: 6.9, carbohydrates_100g: 77.7, fat_100g: 1.8, fiber_100g: 2.9 }},
    { code: 'lvsdb-1694', product_name: 'Bearnaisesås fett 8%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 2.3, carbohydrates_100g: 7.7, fat_100g: 8.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1695', product_name: 'Klassisk gräddsås fett 6%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 2.0, carbohydrates_100g: 7.1, fat_100g: 5.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1696', product_name: 'Ostsås fett 8%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 4.7, carbohydrates_100g: 7.9, fat_100g: 7.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1697', product_name: 'Bearnaisesås fett ca 40%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 342.0, proteins_100g: 1.0, carbohydrates_100g: 5.9, fat_100g: 35.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1698', product_name: 'Rödvinssås fett 1,5%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 65.0, proteins_100g: 1.2, carbohydrates_100g: 12.1, fat_100g: 1.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1699', product_name: 'Kebabsås vit fett 30%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 300.0, proteins_100g: 1.7, carbohydrates_100g: 5.0, fat_100g: 30.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1700', product_name: 'Svampsås fett 8,5%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 2.7, carbohydrates_100g: 7.6, fat_100g: 8.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1701', product_name: 'Korv varmkorv mager fett 7%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 12.0, carbohydrates_100g: 7.6, fat_100g: 9.9, fiber_100g: 1.5 }},
    { code: 'lvsdb-1702', product_name: 'Korv chorizo mager fett 9%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 160.0, proteins_100g: 14.4, carbohydrates_100g: 4.8, fat_100g: 9.0, fiber_100g: 1.2 }},
    { code: 'lvsdb-1703', product_name: 'Korv middagskorv fett ca 9% kött ca 55 %', brands: 'Korv', nutriments: { 'energy-kcal_100g': 131.0, proteins_100g: 10.1, carbohydrates_100g: 6.0, fat_100g: 7.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-1704', product_name: 'Påläggskorv salami mager', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 24.4, carbohydrates_100g: 1.1, fat_100g: 8.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1705', product_name: 'Mintplattor m. mörkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 448.0, proteins_100g: 3.7, carbohydrates_100g: 69.0, fat_100g: 16.3, fiber_100g: 4.7 }},
    { code: 'lvsdb-1706', product_name: 'Ost mozzarella fett 18%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 15.6, carbohydrates_100g: 0.8, fat_100g: 16.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1707', product_name: 'Ingefära färsk', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 2.2, carbohydrates_100g: 9.0, fat_100g: 0.8, fiber_100g: 5.4 }},
    { code: 'lvsdb-1708', product_name: 'Kebabkött restaurang', brands: 'Kött', nutriments: { 'energy-kcal_100g': 302.0, proteins_100g: 18.7, carbohydrates_100g: 4.9, fat_100g: 22.9, fiber_100g: 1.9 }},
    { code: 'lvsdb-1709', product_name: 'Fruktdryck nypon blåbär berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.8, carbohydrates_100g: 10.6, fat_100g: 0.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-1710', product_name: 'Energidryck berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 0.0, carbohydrates_100g: 9.6, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1711', product_name: 'Öl alkoholfri', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 0.4, carbohydrates_100g: 3.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1712', product_name: 'Kanel', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 255.0, proteins_100g: 3.6, carbohydrates_100g: 26.5, fat_100g: 3.5, fiber_100g: 53.1 }},
    { code: 'lvsdb-1713', product_name: 'Flytande margarin mjölkfri fett 80% berikad typ Carlshamn', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 707.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1714', product_name: 'Bordsmargarin mjölkfri fett 70% berikad typ Carlshamn', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 619.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 70.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1715', product_name: 'Hushållsmargarin mjölkfri fett 80% berikad typ Carlshamn', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 707.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1716', product_name: 'Småkaka mördeg typ somalisk icun', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 472.0, proteins_100g: 4.3, carbohydrates_100g: 57.0, fat_100g: 24.9, fiber_100g: 1.8 }},
    { code: 'lvsdb-1717', product_name: 'Lamm rygg el. hals kokt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 217.0, proteins_100g: 21.6, carbohydrates_100g: 0.0, fat_100g: 14.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1718', product_name: 'Tilapia rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 87.0, proteins_100g: 17.9, carbohydrates_100g: 0.0, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1719', product_name: 'Lättmargarin fett 28% berikad typ Mini Lätta', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 2.0, carbohydrates_100g: 4.0, fat_100g: 28.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1720', product_name: 'Flytande margarin fett 79% berikad typ Becel', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 727.0, proteins_100g: 0.0, carbohydrates_100g: 0.5, fat_100g: 82.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1721', product_name: 'Ris basmati okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 359.0, proteins_100g: 9.2, carbohydrates_100g: 76.7, fat_100g: 1.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-1722', product_name: 'Ris jasmin okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 7.5, carbohydrates_100g: 78.2, fat_100g: 0.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1723', product_name: 'Ris råris långkornigt okokt fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 365.0, proteins_100g: 9.4, carbohydrates_100g: 71.9, fat_100g: 3.0, fiber_100g: 4.2 }},
    { code: 'lvsdb-1724', product_name: 'Ris grötris snabb okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 364.0, proteins_100g: 6.4, carbohydrates_100g: 81.3, fat_100g: 0.6, fiber_100g: 1.2 }},
    { code: 'lvsdb-1725', product_name: 'Ris långkornigt okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 7.8, carbohydrates_100g: 76.9, fat_100g: 0.7, fiber_100g: 1.0 }},
    { code: 'lvsdb-1726', product_name: 'Ris långkornigt parboiled okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 362.0, proteins_100g: 7.7, carbohydrates_100g: 78.0, fat_100g: 1.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-1727', product_name: 'Ris snabbris okokt salt 1%', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 7.9, carbohydrates_100g: 79.7, fat_100g: 0.2, fiber_100g: 1.5 }},
    { code: 'lvsdb-1728', product_name: 'Ris snabbris okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 365.0, proteins_100g: 8.5, carbohydrates_100g: 78.5, fat_100g: 0.7, fiber_100g: 2.6 }},
    { code: 'lvsdb-1729', product_name: 'Ris grötris rundkornigt okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 361.0, proteins_100g: 6.4, carbohydrates_100g: 80.2, fat_100g: 0.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-1730', product_name: 'Bordsmargarin fett 70% berikad typ Becel Gold', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 623.0, proteins_100g: 0.4, carbohydrates_100g: 0.5, fat_100g: 70.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1731', product_name: 'Blandfärs rå nöt 70% gris 30%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 201.0, proteins_100g: 18.8, carbohydrates_100g: 0.0, fat_100g: 14.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1732', product_name: 'Blandfärs rå nöt 50% gris 50% ', brands: 'Kött', nutriments: { 'energy-kcal_100g': 213.0, proteins_100g: 18.0, carbohydrates_100g: 0.0, fat_100g: 15.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1733', product_name: 'Kebab m. bröd sallad sås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 7.8, carbohydrates_100g: 18.8, fat_100g: 12.0, fiber_100g: 1.2 }},
    { code: 'lvsdb-1734', product_name: 'Kebabtallrik m. pommes frites', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 254.0, proteins_100g: 6.4, carbohydrates_100g: 19.2, fat_100g: 16.6, fiber_100g: 1.5 }},
    { code: 'lvsdb-1735', product_name: 'Korv m. mos ketchup senap bostongurka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 3.1, carbohydrates_100g: 12.4, fat_100g: 4.2, fiber_100g: 1.5 }},
    { code: 'lvsdb-1736', product_name: 'Korv m. bröd ketchup senap', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 259.0, proteins_100g: 8.5, carbohydrates_100g: 22.4, fat_100g: 14.7, fiber_100g: 2.0 }},
    { code: 'lvsdb-1737', product_name: 'Hamburgare dubbel m. bröd ost inlagd gurka tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 260.0, proteins_100g: 16.8, carbohydrates_100g: 16.3, fat_100g: 13.9, fiber_100g: 1.4 }},
    { code: 'lvsdb-1738', product_name: 'Hamburgare 90 g m. bröd tillbehör tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 11.9, carbohydrates_100g: 17.5, fat_100g: 14.4, fiber_100g: 1.5 }},
    { code: 'lvsdb-1739', product_name: 'Hamburgare m. bröd ost tillagad på restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 259.0, proteins_100g: 14.2, carbohydrates_100g: 22.9, fat_100g: 11.8, fiber_100g: 1.9 }},
    { code: 'lvsdb-1740', product_name: 'Ris basmati kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 3.1, carbohydrates_100g: 25.9, fat_100g: 0.3, fiber_100g: 0.2 }},
    { code: 'lvsdb-1741', product_name: 'Ris jasmin kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 2.4, carbohydrates_100g: 25.0, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1742', product_name: 'Ris långkornigt kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 2.5, carbohydrates_100g: 24.6, fat_100g: 0.2, fiber_100g: 0.3 }},
    { code: 'lvsdb-1743', product_name: 'Ris långkornigt parboiled kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 2.8, carbohydrates_100g: 27.9, fat_100g: 0.4, fiber_100g: 0.5 }},
    { code: 'lvsdb-1744', product_name: 'Ris råris långkornigt kokt m. salt fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 3.6, carbohydrates_100g: 27.3, fat_100g: 1.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-1745', product_name: 'Ris snabbris kokt salt 1%', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 2.3, carbohydrates_100g: 22.8, fat_100g: 0.1, fiber_100g: 0.4 }},
    { code: 'lvsdb-1746', product_name: 'Ris snabbris kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 2.6, carbohydrates_100g: 24.0, fat_100g: 0.2, fiber_100g: 0.8 }},
    { code: 'lvsdb-1747', product_name: 'Pasta tagliatelle m. ägg kokt m. salt glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 159.0, proteins_100g: 1.1, carbohydrates_100g: 34.0, fat_100g: 1.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1748', product_name: 'Pasta makaroner spagetti kokt m. salt glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 153.0, proteins_100g: 3.1, carbohydrates_100g: 32.8, fat_100g: 0.5, fiber_100g: 1.2 }},
    { code: 'lvsdb-1749', product_name: 'Pasta kokt m. salt majs 100% glutenfri', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 155.0, proteins_100g: 2.9, carbohydrates_100g: 33.0, fat_100g: 0.8, fiber_100g: 1.2 }},
    { code: 'lvsdb-1750', product_name: 'Lasagne blandfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 6.6, carbohydrates_100g: 11.5, fat_100g: 6.1, fiber_100g: 1.0 }},
    { code: 'lvsdb-1751', product_name: 'Gröna ärtor kokta m. salt frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 5.2, carbohydrates_100g: 8.9, fat_100g: 0.4, fiber_100g: 4.4 }},
    { code: 'lvsdb-1752', product_name: 'Gryta kalops älg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 69.0, proteins_100g: 8.2, carbohydrates_100g: 3.6, fat_100g: 2.2, fiber_100g: 0.7 }},
    { code: 'lvsdb-1753', product_name: 'Älg högrev rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 22.5, carbohydrates_100g: 0.2, fat_100g: 2.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1754', product_name: 'Älg ryggbiff rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 23.6, carbohydrates_100g: 0.0, fat_100g: 1.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1755', product_name: 'Tacoskal', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 481.0, proteins_100g: 5.5, carbohydrates_100g: 59.9, fat_100g: 23.5, fiber_100g: 4.0 }},
    { code: 'lvsdb-1756', product_name: 'Romansallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 1.9, carbohydrates_100g: 0.9, fat_100g: 0.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-1757', product_name: 'Ruccolasallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 21.0, proteins_100g: 3.6, carbohydrates_100g: 0.0, fat_100g: 0.4, fiber_100g: 1.7 }},
    { code: 'lvsdb-1758', product_name: 'Okra kokt u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 1.8, carbohydrates_100g: 2.5, fat_100g: 0.2, fiber_100g: 3.1 }},
    { code: 'lvsdb-1759', product_name: 'Litchi', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 55.0, proteins_100g: 1.0, carbohydrates_100g: 11.4, fat_100g: 0.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-1760', product_name: 'Carambole stjärnfrukt', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 30.0, proteins_100g: 0.8, carbohydrates_100g: 4.5, fat_100g: 0.4, fiber_100g: 2.8 }},
    { code: 'lvsdb-1761', product_name: 'Blomkål stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 2.5, carbohydrates_100g: 3.4, fat_100g: 4.8, fiber_100g: 3.0 }},
    { code: 'lvsdb-1762', product_name: 'Broccoli stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 5.5, carbohydrates_100g: 3.0, fat_100g: 5.2, fiber_100g: 5.1 }},
    { code: 'lvsdb-1763', product_name: 'Morot stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 0.9, carbohydrates_100g: 8.3, fat_100g: 6.9, fiber_100g: 3.0 }},
    { code: 'lvsdb-1764', product_name: 'Palsternacka stekt el. wokad ', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 2.2, carbohydrates_100g: 15.9, fat_100g: 4.1, fiber_100g: 4.7 }},
    { code: 'lvsdb-1765', product_name: 'Paprika stekt el. wokad ', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 0.7, carbohydrates_100g: 5.1, fat_100g: 5.8, fiber_100g: 1.7 }},
    { code: 'lvsdb-1766', product_name: 'Purjolök stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 2.1, carbohydrates_100g: 5.3, fat_100g: 4.7, fiber_100g: 3.5 }},
    { code: 'lvsdb-1767', product_name: 'Rotselleri stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.3, carbohydrates_100g: 5.7, fat_100g: 5.1, fiber_100g: 4.0 }},
    { code: 'lvsdb-1768', product_name: 'Rödbeta stekt el. wokad ', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 1.5, carbohydrates_100g: 12.6, fat_100g: 3.5, fiber_100g: 3.4 }},
    { code: 'lvsdb-1769', product_name: 'Kål stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 73.0, proteins_100g: 2.2, carbohydrates_100g: 5.7, fat_100g: 3.8, fiber_100g: 3.8 }},
    { code: 'lvsdb-1770', product_name: 'Blandfärs stekt tacokryddad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 215.0, proteins_100g: 17.6, carbohydrates_100g: 2.6, fat_100g: 14.9, fiber_100g: 0.6 }},
    { code: 'lvsdb-1771', product_name: 'Sojaprotein färs stekt tacokryddad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 212.0, proteins_100g: 17.9, carbohydrates_100g: 11.7, fat_100g: 9.0, fiber_100g: 6.5 }},
    { code: 'lvsdb-1772', product_name: 'Potatisgratäng kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 2.0, carbohydrates_100g: 10.5, fat_100g: 6.8, fiber_100g: 1.9 }},
    { code: 'lvsdb-1773', product_name: 'Ugnsrostade grönsaker rotfrukter', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 1.1, carbohydrates_100g: 6.7, fat_100g: 2.7, fiber_100g: 2.8 }},
    { code: 'lvsdb-1774', product_name: 'Lasagne m. mykoprotein', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 7.3, carbohydrates_100g: 12.2, fat_100g: 4.8, fiber_100g: 1.8 }},
    { code: 'lvsdb-1775', product_name: 'Kyckling färs stekt tacokryddad', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 20.6, carbohydrates_100g: 2.7, fat_100g: 5.6, fiber_100g: 0.6 }},
    { code: 'lvsdb-1776', product_name: 'Béchamelsås m. mjölk fett 3% grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 4.3, carbohydrates_100g: 8.0, fat_100g: 9.6, fiber_100g: 0.2 }},
    { code: 'lvsdb-1777', product_name: 'Sushi veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 158.0, proteins_100g: 2.6, carbohydrates_100g: 30.9, fat_100g: 2.2, fiber_100g: 1.4 }},
    { code: 'lvsdb-1778', product_name: 'Pannkaka tunn hemlagad', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 5.5, carbohydrates_100g: 13.7, fat_100g: 6.3, fiber_100g: 0.5 }},
    { code: 'lvsdb-1779', product_name: 'Grönsaksblandning m. ärtor bönor morot blomkål typ sommargrönsaker frysvara kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 2.4, carbohydrates_100g: 4.5, fat_100g: 0.5, fiber_100g: 3.0 }},
    { code: 'lvsdb-1780', product_name: 'Grönsaksblandning ärter morot frysvara kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.7, carbohydrates_100g: 9.0, fat_100g: 0.5, fiber_100g: 2.2 }},
    { code: 'lvsdb-1781', product_name: 'Rismål m. sylt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 2.9, carbohydrates_100g: 21.6, fat_100g: 3.3, fiber_100g: 0.3 }},
    { code: 'lvsdb-1782', product_name: 'Rismål m. sylt u. socker m. sötningsm.', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 3.2, carbohydrates_100g: 13.1, fat_100g: 3.2, fiber_100g: 0.4 }},
    { code: 'lvsdb-1783', product_name: 'Nöt innanlår stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 27.8, carbohydrates_100g: 0.0, fat_100g: 1.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1784', product_name: 'Älgbiff stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 27.6, carbohydrates_100g: 0.0, fat_100g: 1.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1785', product_name: 'Kycklinggryta m. grädde/crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 8.8, carbohydrates_100g: 3.0, fat_100g: 7.9, fiber_100g: 0.9 }},
    { code: 'lvsdb-1786', product_name: 'Salt u. jod', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1787', product_name: 'Tiramisu', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 232.0, proteins_100g: 6.0, carbohydrates_100g: 21.0, fat_100g: 12.6, fiber_100g: 0.2 }},
    { code: 'lvsdb-1788', product_name: 'Blåbärspaj', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 320.0, proteins_100g: 2.9, carbohydrates_100g: 36.1, fat_100g: 17.7, fiber_100g: 2.2 }},
    { code: 'lvsdb-1789', product_name: 'Ost halloumi stekt eller grillad', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 308.0, proteins_100g: 23.6, carbohydrates_100g: 2.0, fat_100g: 23.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1790', product_name: 'Köttgryta m. grädde/crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 13.4, carbohydrates_100g: 2.8, fat_100g: 7.6, fiber_100g: 0.6 }},
    { code: 'lvsdb-1791', product_name: 'Vilt färs stekt tacokryddad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 21.0, carbohydrates_100g: 2.5, fat_100g: 3.8, fiber_100g: 0.6 }},
    { code: 'lvsdb-1792', product_name: 'Lamm färs stekt tacokryddad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 251.0, proteins_100g: 16.1, carbohydrates_100g: 2.6, fat_100g: 19.6, fiber_100g: 0.6 }},
    { code: 'lvsdb-1793', product_name: 'Köttfärs stekt tacokryddad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 210.0, proteins_100g: 17.4, carbohydrates_100g: 2.6, fat_100g: 14.4, fiber_100g: 0.6 }},
    { code: 'lvsdb-1794', product_name: 'Vit fisk panerad och stekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 17.5, carbohydrates_100g: 7.6, fat_100g: 10.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-1795', product_name: 'Gryta fisk skaldjur m. grädde/crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 11.7, carbohydrates_100g: 2.2, fat_100g: 5.3, fiber_100g: 0.7 }},
    { code: 'lvsdb-1796', product_name: 'Fiskgratäng m. grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 8.4, carbohydrates_100g: 3.1, fat_100g: 4.5, fiber_100g: 1.0 }},
    { code: 'lvsdb-1797', product_name: 'Godisklubba ', brands: 'Godis', nutriments: { 'energy-kcal_100g': 395.0, proteins_100g: 3.0, carbohydrates_100g: 94.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1798', product_name: 'Gräddsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 253.0, proteins_100g: 2.2, carbohydrates_100g: 8.3, fat_100g: 23.8, fiber_100g: 0.2 }},
    { code: 'lvsdb-1799', product_name: 'Skaldjurssås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 6.4, carbohydrates_100g: 4.2, fat_100g: 7.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-1800', product_name: 'Dressing hamburgerdressing', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 542.0, proteins_100g: 1.3, carbohydrates_100g: 10.1, fat_100g: 56.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-1801', product_name: 'Gulaschsoppa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 62.0, proteins_100g: 4.5, carbohydrates_100g: 5.1, fat_100g: 2.3, fiber_100g: 1.1 }},
    { code: 'lvsdb-1802', product_name: 'Fisksoppa skaldjurssoppa u. vin', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 5.7, carbohydrates_100g: 2.8, fat_100g: 1.6, fiber_100g: 0.8 }},
    { code: 'lvsdb-1803', product_name: 'Pannacotta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 241.0, proteins_100g: 3.0, carbohydrates_100g: 11.8, fat_100g: 20.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1804', product_name: 'Paj m. ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 271.0, proteins_100g: 11.0, carbohydrates_100g: 15.6, fat_100g: 18.3, fiber_100g: 0.7 }},
    { code: 'lvsdb-1805', product_name: 'Paj m. grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 211.0, proteins_100g: 6.4, carbohydrates_100g: 11.5, fat_100g: 15.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-1806', product_name: 'Sill inlagd m. gräddfilssås', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 290.0, proteins_100g: 5.3, carbohydrates_100g: 15.6, fat_100g: 23.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1807', product_name: 'Sill inlagd m. senapssås', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 5.2, carbohydrates_100g: 14.5, fat_100g: 18.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1808', product_name: 'Hummus kikärtsröra', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 306.0, proteins_100g: 5.8, carbohydrates_100g: 8.3, fat_100g: 26.5, fiber_100g: 7.4 }},
    { code: 'lvsdb-1809', product_name: 'Muffins hembakad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 347.0, proteins_100g: 3.9, carbohydrates_100g: 44.0, fat_100g: 17.0, fiber_100g: 0.9 }},
    { code: 'lvsdb-1810', product_name: 'Chokladmuffins hembakad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 416.0, proteins_100g: 4.8, carbohydrates_100g: 58.5, fat_100g: 17.5, fiber_100g: 2.3 }},
    { code: 'lvsdb-1811', product_name: 'Sesamkakor sesamkex', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 532.0, proteins_100g: 12.5, carbohydrates_100g: 38.1, fat_100g: 35.6, fiber_100g: 6.2 }},
    { code: 'lvsdb-1812', product_name: 'Brända mandlar', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 507.0, proteins_100g: 11.3, carbohydrates_100g: 45.4, fat_100g: 29.1, fiber_100g: 10.2 }},
    { code: 'lvsdb-1813', product_name: 'Chilinötter', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 516.0, proteins_100g: 16.6, carbohydrates_100g: 36.5, fat_100g: 32.3, fiber_100g: 7.4 }},
    { code: 'lvsdb-1814', product_name: 'Pinjefrö', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 697.0, proteins_100g: 14.8, carbohydrates_100g: 8.9, fat_100g: 66.8, fiber_100g: 5.5 }},
    { code: 'lvsdb-1815', product_name: 'Bulgur kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 4.5, carbohydrates_100g: 24.7, fat_100g: 0.5, fiber_100g: 2.8 }},
    { code: 'lvsdb-1816', product_name: 'Nötter blandade rostade m. salt', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 609.0, proteins_100g: 19.7, carbohydrates_100g: 9.3, fat_100g: 53.0, fiber_100g: 11.5 }},
    { code: 'lvsdb-1817', product_name: 'Nötter blandade naturella', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 629.0, proteins_100g: 16.6, carbohydrates_100g: 7.7, fat_100g: 57.2, fiber_100g: 12.8 }},
    { code: 'lvsdb-1818', product_name: 'Korv ren rå', brands: 'Korv', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 17.2, carbohydrates_100g: 4.0, fat_100g: 18.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1819', product_name: 'Lingonsylt lättsockrad', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 0.3, carbohydrates_100g: 26.0, fat_100g: 0.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-1820', product_name: 'Korv lamm rå', brands: 'Korv', nutriments: { 'energy-kcal_100g': 255.0, proteins_100g: 15.9, carbohydrates_100g: 4.8, fat_100g: 19.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1821', product_name: 'Kvarg naturell fett 0,2%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 10.0, carbohydrates_100g: 5.2, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1822', product_name: 'Brödkrutonger ', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 415.0, proteins_100g: 11.9, carbohydrates_100g: 73.5, fat_100g: 6.6, fiber_100g: 5.1 }},
    { code: 'lvsdb-1823', product_name: 'Nötter blandade m. frukt bär', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 504.0, proteins_100g: 14.5, carbohydrates_100g: 31.1, fat_100g: 34.0, fiber_100g: 9.2 }},
    { code: 'lvsdb-1824', product_name: 'Nötter blandade kanderade', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 564.0, proteins_100g: 16.2, carbohydrates_100g: 27.7, fat_100g: 41.5, fiber_100g: 9.6 }},
    { code: 'lvsdb-1825', product_name: 'Baklava ', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 410.0, proteins_100g: 5.5, carbohydrates_100g: 47.4, fat_100g: 21.2, fiber_100g: 4.2 }},
    { code: 'lvsdb-1826', product_name: 'Jordgubbssylt lättsockrad ', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 0.2, carbohydrates_100g: 28.3, fat_100g: 0.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-1827', product_name: 'Nöt oxfilé stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 25.4, carbohydrates_100g: 0.0, fat_100g: 4.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1828', product_name: 'Älg färs rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 22.6, carbohydrates_100g: 0.0, fat_100g: 1.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1829', product_name: 'Älg ytterlår', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 22.1, carbohydrates_100g: 1.5, fat_100g: 1.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1830', product_name: 'Chips potatis naturell', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 506.0, proteins_100g: 5.6, carbohydrates_100g: 55.6, fat_100g: 27.9, fiber_100g: 5.8 }},
    { code: 'lvsdb-1831', product_name: 'Linfröolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1832', product_name: 'Frukostflingor havre fullkorn typ Havrefras', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 385.0, proteins_100g: 12.0, carbohydrates_100g: 61.8, fat_100g: 6.9, fiber_100g: 12.6 }},
    { code: 'lvsdb-1833', product_name: 'Barnmat klämmis m. yoghurt banan jordgubb konserv.', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 1.7, carbohydrates_100g: 14.4, fat_100g: 1.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-1834', product_name: 'Sill inlagd olika smaker', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 9.8, carbohydrates_100g: 20.0, fat_100g: 14.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1835', product_name: 'Quinoa röd kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 4.4, carbohydrates_100g: 21.7, fat_100g: 2.4, fiber_100g: 6.7 }},
    { code: 'lvsdb-1836', product_name: 'Bananchips ', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 506.0, proteins_100g: 1.9, carbohydrates_100g: 59.1, fat_100g: 28.1, fiber_100g: 5.0 }},
    { code: 'lvsdb-1837', product_name: 'Bulgur kokt u. salt fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 4.1, carbohydrates_100g: 20.7, fat_100g: 0.6, fiber_100g: 3.8 }},
    { code: 'lvsdb-1838', product_name: 'Äppelkaka hembakad typ Fyriskaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 297.0, proteins_100g: 3.0, carbohydrates_100g: 38.0, fat_100g: 14.5, fiber_100g: 1.2 }},
    { code: 'lvsdb-1839', product_name: 'Kladdkaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 413.0, proteins_100g: 4.7, carbohydrates_100g: 58.7, fat_100g: 17.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-1840', product_name: 'Kyckling bröstfilé kokt u. skinn', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 34.6, carbohydrates_100g: 0.0, fat_100g: 1.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1841', product_name: 'Tahini', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 625.0, proteins_100g: 20.4, carbohydrates_100g: 3.6, fat_100g: 57.2, fiber_100g: 11.2 }},
    { code: 'lvsdb-1842', product_name: 'Järpar fläskfärs stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 200.0, proteins_100g: 12.4, carbohydrates_100g: 5.3, fat_100g: 14.3, fiber_100g: 0.7 }},
    { code: 'lvsdb-1843', product_name: 'Gris färs stekt tacokryddad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 15.9, carbohydrates_100g: 2.6, fat_100g: 16.3, fiber_100g: 0.6 }},
    { code: 'lvsdb-1844', product_name: 'Nöt färs stekt tacokryddad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 200.0, proteins_100g: 18.8, carbohydrates_100g: 2.6, fat_100g: 12.7, fiber_100g: 0.6 }},
    { code: 'lvsdb-1845', product_name: 'Blandfärs stekt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 241.0, proteins_100g: 23.3, carbohydrates_100g: 0.0, fat_100g: 16.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1846', product_name: 'Gris färs stekt m. salt fett 15%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 250.0, proteins_100g: 21.1, carbohydrates_100g: 0.0, fat_100g: 18.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1847', product_name: 'Lamm färs stekt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 286.0, proteins_100g: 21.1, carbohydrates_100g: 0.0, fat_100g: 22.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1848', product_name: 'Älg färs stekt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 27.6, carbohydrates_100g: 0.0, fat_100g: 1.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1849', product_name: 'Gris hamburgare färsspett hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 247.0, proteins_100g: 20.9, carbohydrates_100g: 0.0, fat_100g: 18.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1850', product_name: 'Mykoprotein färs stekt tacokryddad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 155.0, proteins_100g: 17.9, carbohydrates_100g: 5.7, fat_100g: 5.2, fiber_100g: 6.9 }},
    { code: 'lvsdb-1851', product_name: 'Sojadryck berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 2.6, carbohydrates_100g: 3.2, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1852', product_name: 'Lasagne m. sojafärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 7.1, carbohydrates_100g: 12.6, fat_100g: 5.9, fiber_100g: 1.7 }},
    { code: 'lvsdb-1853', product_name: 'Soygurt smaksatt eko. berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 3.4, carbohydrates_100g: 10.7, fat_100g: 2.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-1854', product_name: 'Saftglögg', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 27.0, proteins_100g: 0.1, carbohydrates_100g: 6.6, fat_100g: 0.0, fiber_100g: 0.2 }},
    { code: 'lvsdb-1855', product_name: 'Couscous kokt m. salt fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 4.7, carbohydrates_100g: 27.0, fat_100g: 0.9, fiber_100g: 3.9 }},
    { code: 'lvsdb-1856', product_name: 'Pasta kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 4.6, carbohydrates_100g: 27.5, fat_100g: 0.6, fiber_100g: 2.0 }},
    { code: 'lvsdb-1857', product_name: 'Vita bönor torkade kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 8.8, carbohydrates_100g: 11.0, fat_100g: 0.9, fiber_100g: 12.5 }},
    { code: 'lvsdb-1858', product_name: 'Stora vita bönor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 6.9, carbohydrates_100g: 14.6, fat_100g: 0.8, fiber_100g: 6.8 }},
    { code: 'lvsdb-1859', product_name: 'Kikärtor torkade kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 133.0, proteins_100g: 8.1, carbohydrates_100g: 12.6, fat_100g: 2.9, fiber_100g: 12.3 }},
    { code: 'lvsdb-1860', product_name: 'Sötpotatis rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.6, carbohydrates_100g: 12.9, fat_100g: 0.4, fiber_100g: 4.4 }},
    { code: 'lvsdb-1861', product_name: 'Sötpotatis ugnsstekt m. olja salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 2.0, carbohydrates_100g: 16.2, fat_100g: 3.8, fiber_100g: 5.5 }},
    { code: 'lvsdb-1862', product_name: 'Sötpotatis kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 2.1, carbohydrates_100g: 16.9, fat_100g: 0.5, fiber_100g: 5.8 }},
    { code: 'lvsdb-1863', product_name: 'Dinkelmjöl fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 11.9, carbohydrates_100g: 63.5, fat_100g: 3.3, fiber_100g: 9.1 }},
    { code: 'lvsdb-1864', product_name: 'Bröd rågsikt fibrer ca 7%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 233.0, proteins_100g: 6.8, carbohydrates_100g: 41.8, fat_100g: 2.8, fiber_100g: 5.4 }},
    { code: 'lvsdb-1865', product_name: 'Bröd vitt fibrer ca 5% typ formfranska', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 8.6, carbohydrates_100g: 44.0, fat_100g: 3.0, fiber_100g: 4.8 }},
    { code: 'lvsdb-1866', product_name: 'Hårt bröd fullkorn råg fibrer ca 19% typ Rågi', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 338.0, proteins_100g: 8.8, carbohydrates_100g: 61.8, fat_100g: 1.7, fiber_100g: 19.0 }},
    { code: 'lvsdb-1867', product_name: 'Bröd fullkorn vete råg fibrer ca 6%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 256.0, proteins_100g: 7.4, carbohydrates_100g: 42.6, fat_100g: 4.0, fiber_100g: 8.8 }},
    { code: 'lvsdb-1868', product_name: 'Bröd vitt fibrer ca 5% typ limpa', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 261.0, proteins_100g: 7.5, carbohydrates_100g: 47.7, fat_100g: 2.8, fiber_100g: 6.3 }},
    { code: 'lvsdb-1869', product_name: 'Bröd fullkorn råg fibrer ca 7%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 9.3, carbohydrates_100g: 38.3, fat_100g: 2.3, fiber_100g: 6.5 }},
    { code: 'lvsdb-1870', product_name: 'Korvbröd grovt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 264.0, proteins_100g: 9.3, carbohydrates_100g: 42.4, fat_100g: 4.9, fiber_100g: 5.6 }},
    { code: 'lvsdb-1871', product_name: 'Lax odlad Norge fjordlax rå över disk', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 203.0, proteins_100g: 20.0, carbohydrates_100g: 0.7, fat_100g: 13.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1872', product_name: 'Kikärtor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 7.5, carbohydrates_100g: 15.7, fat_100g: 2.5, fiber_100g: 6.2 }},
    { code: 'lvsdb-1873', product_name: 'Kidneybönor röda bönor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 8.8, carbohydrates_100g: 13.4, fat_100g: 0.7, fiber_100g: 7.2 }},
    { code: 'lvsdb-1874', product_name: 'Svarta bönor konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 8.1, carbohydrates_100g: 13.8, fat_100g: 1.0, fiber_100g: 6.8 }},
    { code: 'lvsdb-1875', product_name: 'Hamburgerbröd', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 290.0, proteins_100g: 8.0, carbohydrates_100g: 47.0, fat_100g: 6.8, fiber_100g: 3.5 }},
    { code: 'lvsdb-1876', product_name: 'Bröd vitt mjölk fibrer ca 4% typ tekaka', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 285.0, proteins_100g: 8.1, carbohydrates_100g: 51.2, fat_100g: 4.1, fiber_100g: 4.2 }},
    { code: 'lvsdb-1877', product_name: 'Bruna bönor rullpack kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 4.4, carbohydrates_100g: 15.0, fat_100g: 0.5, fiber_100g: 6.4 }},
    { code: 'lvsdb-1878', product_name: 'Gröna linser torkade kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 127.0, proteins_100g: 9.4, carbohydrates_100g: 15.9, fat_100g: 0.7, fiber_100g: 9.6 }},
    { code: 'lvsdb-1879', product_name: 'Röda linser torkade kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 10.6, carbohydrates_100g: 14.6, fat_100g: 0.6, fiber_100g: 9.1 }},
    { code: 'lvsdb-1880', product_name: 'Röda linser konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 89.0, proteins_100g: 6.9, carbohydrates_100g: 11.9, fat_100g: 0.5, fiber_100g: 4.1 }},
    { code: 'lvsdb-1881', product_name: 'Gröna linser konserv. u. lag', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 92.0, proteins_100g: 6.2, carbohydrates_100g: 13.1, fat_100g: 0.6, fiber_100g: 4.4 }},
    { code: 'lvsdb-1882', product_name: 'Hamburgerbröd grovt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 263.0, proteins_100g: 7.5, carbohydrates_100g: 43.0, fat_100g: 5.0, fiber_100g: 7.3 }},
    { code: 'lvsdb-1883', product_name: 'Pasta kokt m. salt fullkorn>50%', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 161.0, proteins_100g: 5.8, carbohydrates_100g: 29.9, fat_100g: 1.0, fiber_100g: 3.7 }},
    { code: 'lvsdb-1884', product_name: 'Ägg rått eko.', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 12.4, carbohydrates_100g: 0.4, fat_100g: 10.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1885', product_name: 'Äggula rå eko.', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 327.0, proteins_100g: 16.2, carbohydrates_100g: 0.6, fat_100g: 29.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1886', product_name: 'Dinkel speltvete kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 4.6, carbohydrates_100g: 24.4, fat_100g: 1.3, fiber_100g: 3.5 }},
    { code: 'lvsdb-1887', product_name: 'Muffins m. frukt bär', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 4.0, carbohydrates_100g: 45.0, fat_100g: 17.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-1888', product_name: 'Kycklingröra hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 10.3, carbohydrates_100g: 3.6, fat_100g: 3.0, fiber_100g: 0.9 }},
    { code: 'lvsdb-1889', product_name: 'Smoothie m. frukt bär u. mjölk', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 51.0, proteins_100g: 0.7, carbohydrates_100g: 11.0, fat_100g: 0.2, fiber_100g: 0.8 }},
    { code: 'lvsdb-1890', product_name: 'Råkostsallad m. morot äpple paprika purjolök', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 38.0, proteins_100g: 0.7, carbohydrates_100g: 7.4, fat_100g: 0.2, fiber_100g: 2.0 }},
    { code: 'lvsdb-1891', product_name: 'Grönsaker rotfrukter stekta wokade', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.4, carbohydrates_100g: 6.8, fat_100g: 4.8, fiber_100g: 2.7 }},
    { code: 'lvsdb-1892', product_name: 'Rödbetssallad kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 256.0, proteins_100g: 1.3, carbohydrates_100g: 11.7, fat_100g: 22.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-1893', product_name: 'Potatissallad kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 236.0, proteins_100g: 1.6, carbohydrates_100g: 12.4, fat_100g: 20.0, fiber_100g: 1.3 }},
    { code: 'lvsdb-1894', product_name: 'Skagenröra m. majonnäs kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 405.0, proteins_100g: 5.4, carbohydrates_100g: 6.8, fat_100g: 40.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-1895', product_name: 'Kålrot stekt el. wokad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 1.8, carbohydrates_100g: 8.0, fat_100g: 3.5, fiber_100g: 3.9 }},
    { code: 'lvsdb-1896', product_name: 'Mördegskaka', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 503.0, proteins_100g: 4.6, carbohydrates_100g: 46.9, fat_100g: 32.8, fiber_100g: 1.9 }},
    { code: 'lvsdb-1897', product_name: 'Huvudsallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 0.9, carbohydrates_100g: 1.2, fat_100g: 0.6, fiber_100g: 1.2 }},
    { code: 'lvsdb-1898', product_name: 'Majskrokar', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 410.0, proteins_100g: 8.9, carbohydrates_100g: 84.2, fat_100g: 3.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1899', product_name: 'Wasabi pasta', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 280.0, proteins_100g: 2.2, carbohydrates_100g: 40.0, fat_100g: 10.9, fiber_100g: 6.1 }},
    { code: 'lvsdb-1900', product_name: 'Frukt torkad m. socker', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 338.0, proteins_100g: 0.0, carbohydrates_100g: 81.3, fat_100g: 0.0, fiber_100g: 4.2 }},
    { code: 'lvsdb-1901', product_name: 'Korvgryta m. grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 125.0, proteins_100g: 4.4, carbohydrates_100g: 5.6, fat_100g: 9.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-1902', product_name: 'Vattenkastanj rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 0.9, carbohydrates_100g: 21.5, fat_100g: 0.4, fiber_100g: 3.0 }},
    { code: 'lvsdb-1903', product_name: 'Tranbär torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 309.0, proteins_100g: 0.0, carbohydrates_100g: 72.1, fat_100g: 0.6, fiber_100g: 5.6 }},
    { code: 'lvsdb-1904', product_name: 'Mâche-sallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 2.6, carbohydrates_100g: 0.8, fat_100g: 0.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-1905', product_name: 'Hampafröolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 883.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 99.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1906', product_name: 'Hushållsmargarin mjölkfri fett 80% berikad typ Milda', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 707.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1907', product_name: 'Lättmargarin fett 40% berikad typ Coop', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 358.0, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 40.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1908', product_name: 'Bordsmargarin fett 60% berikad typ Ica Basic', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 535.0, proteins_100g: 0.5, carbohydrates_100g: 0.5, fat_100g: 60.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1909', product_name: 'Hushållsmargarin fett 80% berikad typ ICA', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 710.0, proteins_100g: 0.2, carbohydrates_100g: 0.3, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1910', product_name: 'Nudlar kokta m. kryddor', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 2.4, carbohydrates_100g: 11.8, fat_100g: 4.3, fiber_100g: 3.1 }},
    { code: 'lvsdb-1911', product_name: 'Grislever stekt m. salt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 27.1, carbohydrates_100g: 3.7, fat_100g: 6.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1912', product_name: 'Lammlever stekt m. salt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 203.0, proteins_100g: 26.9, carbohydrates_100g: 3.9, fat_100g: 8.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1913', product_name: 'Renlever stekt m. salt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 181.0, proteins_100g: 27.2, carbohydrates_100g: 2.2, fat_100g: 6.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1914', product_name: 'Potatis Hasselbackspotatis bakad', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 2.5, carbohydrates_100g: 22.0, fat_100g: 6.6, fiber_100g: 2.9 }},
    { code: 'lvsdb-1915', product_name: 'Palmolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1916', product_name: 'Ägg stekt eko.', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 193.0, proteins_100g: 13.5, carbohydrates_100g: 0.5, fat_100g: 15.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1917', product_name: 'Ägg kokt eko.', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 141.0, proteins_100g: 12.4, carbohydrates_100g: 0.4, fat_100g: 10.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1918', product_name: 'Crème fraichesås m. örtkryddor', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 160.0, proteins_100g: 3.0, carbohydrates_100g: 4.3, fat_100g: 14.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-1919', product_name: 'Majskolv stekt grillad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 3.9, carbohydrates_100g: 20.3, fat_100g: 1.2, fiber_100g: 4.3 }},
    { code: 'lvsdb-1920', product_name: 'Nudelwok m. kött grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 7.8, carbohydrates_100g: 10.4, fat_100g: 3.4, fiber_100g: 1.6 }},
    { code: 'lvsdb-1921', product_name: 'Färs stekt m. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 22.5, carbohydrates_100g: 0.1, fat_100g: 15.2, fiber_100g: 0.1 }},
    { code: 'lvsdb-1922', product_name: 'Lax panerad stekt m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 255.0, proteins_100g: 18.8, carbohydrates_100g: 5.7, fat_100g: 17.5, fiber_100g: 0.4 }},
    { code: 'lvsdb-1923', product_name: 'Pangasiusmal rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 13.1, carbohydrates_100g: 0.0, fat_100g: 1.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1924', product_name: 'Kokosbaserad bit berikad som alternativ till ost', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 265.0, proteins_100g: 0.0, carbohydrates_100g: 18.1, fat_100g: 21.0, fiber_100g: 2.8 }},
    { code: 'lvsdb-1925', product_name: 'Potatis Solist rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 1.0, carbohydrates_100g: 13.6, fat_100g: 0.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-1926', product_name: 'Potatis Swift rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 53.0, proteins_100g: 1.1, carbohydrates_100g: 11.0, fat_100g: 0.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-1927', product_name: 'Potatis Solist kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 1.4, carbohydrates_100g: 16.4, fat_100g: 0.1, fiber_100g: 1.9 }},
    { code: 'lvsdb-1928', product_name: 'Potatis Swift kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 62.0, proteins_100g: 1.5, carbohydrates_100g: 12.5, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-1929', product_name: 'Potatis Asterix rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 74.0, proteins_100g: 1.8, carbohydrates_100g: 14.7, fat_100g: 0.1, fiber_100g: 3.1 }},
    { code: 'lvsdb-1930', product_name: 'Nudlar risnudlar okokta', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 360.0, proteins_100g: 3.4, carbohydrates_100g: 83.2, fat_100g: 0.6, fiber_100g: 1.6 }},
    { code: 'lvsdb-1931', product_name: 'Nudlar risnudlar kokta', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 0.9, carbohydrates_100g: 24.9, fat_100g: 0.2, fiber_100g: 1.0 }},
    { code: 'lvsdb-1932', product_name: 'Havtorn', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 65.0, proteins_100g: 1.5, carbohydrates_100g: 5.7, fat_100g: 3.2, fiber_100g: 3.6 }},
    { code: 'lvsdb-1933', product_name: 'Potatis rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 1.7, carbohydrates_100g: 16.4, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-1934', product_name: 'Potatis kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 1.8, carbohydrates_100g: 17.5, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-1935', product_name: 'Grönkålssallad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 1.9, carbohydrates_100g: 11.4, fat_100g: 7.9, fiber_100g: 2.5 }},
    { code: 'lvsdb-1936', product_name: 'Kålrotslåda', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 1.9, carbohydrates_100g: 9.0, fat_100g: 6.2, fiber_100g: 3.1 }},
    { code: 'lvsdb-1937', product_name: 'Potatis färsk kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.4, carbohydrates_100g: 14.8, fat_100g: 0.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-1938', product_name: 'Potatis färsk rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 1.1, carbohydrates_100g: 12.5, fat_100g: 0.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-1939', product_name: 'Potatis Inova rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 66.0, proteins_100g: 1.9, carbohydrates_100g: 13.1, fat_100g: 0.1, fiber_100g: 1.8 }},
    { code: 'lvsdb-1940', product_name: 'Potatis King Edward rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 1.8, carbohydrates_100g: 17.7, fat_100g: 0.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-1941', product_name: 'Potatis mandelpotatis rå', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 89.0, proteins_100g: 2.2, carbohydrates_100g: 18.1, fat_100g: 0.1, fiber_100g: 2.7 }},
    { code: 'lvsdb-1942', product_name: 'Potatis kokt m. salt tillagad i storhushåll', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 76.0, proteins_100g: 1.7, carbohydrates_100g: 15.8, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-1943', product_name: 'Potatis Asterix kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 1.9, carbohydrates_100g: 16.7, fat_100g: 0.1, fiber_100g: 2.3 }},
    { code: 'lvsdb-1944', product_name: 'Potatis Inova kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 74.0, proteins_100g: 1.8, carbohydrates_100g: 15.2, fat_100g: 0.1, fiber_100g: 2.2 }},
    { code: 'lvsdb-1945', product_name: 'Potatis King Edward kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 1.8, carbohydrates_100g: 17.8, fat_100g: 0.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-1946', product_name: 'Potatis mandelpotatis kokt m. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 2.4, carbohydrates_100g: 21.1, fat_100g: 0.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-1947', product_name: 'Gratäng broccoligratäng m. cottage cheese tomat veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 92.0, proteins_100g: 9.2, carbohydrates_100g: 2.4, fat_100g: 4.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-1948', product_name: 'Gris färs rå fett 15%', brands: 'Kött', nutriments: { 'energy-kcal_100g': 202.0, proteins_100g: 16.8, carbohydrates_100g: 0.0, fat_100g: 15.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1949', product_name: 'Hoki rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 16.6, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1950', product_name: 'Aronia slånaronia', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.7, carbohydrates_100g: 8.3, fat_100g: 0.1, fiber_100g: 5.6 }},
    { code: 'lvsdb-1951', product_name: 'Vinbär vita', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 1.4, carbohydrates_100g: 9.5, fat_100g: 0.2, fiber_100g: 4.3 }},
    { code: 'lvsdb-1952', product_name: 'Ris rundkornigt kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 2.3, carbohydrates_100g: 28.6, fat_100g: 0.3, fiber_100g: 0.4 }},
    { code: 'lvsdb-1953', product_name: 'Pilgrimsmussla', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 9.5, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1954', product_name: 'Laxbullar tillagade m. sås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 5.2, carbohydrates_100g: 7.2, fat_100g: 7.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1955', product_name: 'Fiskpinnar ugnsstekta', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 207.0, proteins_100g: 12.3, carbohydrates_100g: 19.0, fat_100g: 9.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1956', product_name: 'Skarpsill', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 152.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 9.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1957', product_name: 'Sill inlagd u. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 235.0, proteins_100g: 9.8, carbohydrates_100g: 21.9, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1958', product_name: 'Sill höstsill inlagd u. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 247.0, proteins_100g: 11.7, carbohydrates_100g: 23.1, fat_100g: 12.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1959', product_name: 'Sill inlagd senapssill u. sås', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 251.0, proteins_100g: 7.8, carbohydrates_100g: 15.2, fat_100g: 17.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1960', product_name: 'Kapkummel rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 73.0, proteins_100g: 16.6, carbohydrates_100g: 0.0, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1961', product_name: 'Guldsparid rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 177.0, proteins_100g: 18.9, carbohydrates_100g: 0.0, fat_100g: 11.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1962', product_name: 'Havsabborre rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 19.5, carbohydrates_100g: 0.0, fat_100g: 6.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1963', product_name: 'Alaska pollock rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 76.0, proteins_100g: 17.6, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1964', product_name: 'Guldsparid grillad m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 20.4, carbohydrates_100g: 0.0, fat_100g: 12.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1965', product_name: 'Havsabborre grillad m. salt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 21.2, carbohydrates_100g: 0.0, fat_100g: 6.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1966', product_name: 'Olivolja extra jungfruolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1967', product_name: 'Rapsolja kallpressad', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1968', product_name: 'Flytande matfettsblandning fett 80% berikad typ Arla smör- och rapsolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 711.0, proteins_100g: 0.5, carbohydrates_100g: 0.3, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1969', product_name: 'Matfettsblandning fett 43% berikad typ Bregott mindre', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 403.0, proteins_100g: 0.5, carbohydrates_100g: 5.0, fat_100g: 43.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1970', product_name: 'Pastasås m. tonfisk curry', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 7.9, carbohydrates_100g: 3.6, fat_100g: 3.6, fiber_100g: 1.1 }},
    { code: 'lvsdb-1971', product_name: 'Tomat körsbärstomat röd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 0.8, carbohydrates_100g: 4.4, fat_100g: 0.1, fiber_100g: 1.5 }},
    { code: 'lvsdb-1972', product_name: 'Tomat torkad m. olja avrunnen', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 9.4, carbohydrates_100g: 23.3, fat_100g: 1.5, fiber_100g: 11.0 }},
    { code: 'lvsdb-1973', product_name: 'Broccoli kokt u. salt frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 26.0, proteins_100g: 2.4, carbohydrates_100g: 2.0, fat_100g: 0.3, fiber_100g: 2.7 }},
    { code: 'lvsdb-1974', product_name: 'Spenat färsk', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 3.3, carbohydrates_100g: 0.8, fat_100g: 0.4, fiber_100g: 2.1 }},
    { code: 'lvsdb-1975', product_name: 'Mangold röd småbladig färsk', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 16.0, proteins_100g: 2.1, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 1.5 }},
    { code: 'lvsdb-1976', product_name: 'Kruksallat', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 13.0, proteins_100g: 1.9, carbohydrates_100g: 0.0, fat_100g: 0.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-1977', product_name: 'Lök röd', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 1.2, carbohydrates_100g: 9.0, fat_100g: 0.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-1978', product_name: 'Kantarell gul rå', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 1.7, carbohydrates_100g: 2.0, fat_100g: 0.3, fiber_100g: 3.2 }},
    { code: 'lvsdb-1979', product_name: 'Hjort kronhjort kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 22.3, carbohydrates_100g: 0.0, fat_100g: 2.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1980', product_name: 'Hjort dovhjort färs rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 21.8, carbohydrates_100g: 0.0, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1981', product_name: 'Ren kött kallrökt rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 132.0, proteins_100g: 26.2, carbohydrates_100g: 0.5, fat_100g: 2.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1982', product_name: 'Hjort skav rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 17.9, carbohydrates_100g: 0.0, fat_100g: 6.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1983', product_name: 'Korv hjort rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 17.0, carbohydrates_100g: 1.4, fat_100g: 17.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1984', product_name: 'Vildsvin bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 22.6, carbohydrates_100g: 0.0, fat_100g: 1.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1985', product_name: 'Vildsvin filé rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 23.3, carbohydrates_100g: 0.0, fat_100g: 1.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-1986', product_name: 'Rådjur stek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 23.6, carbohydrates_100g: 0.0, fat_100g: 1.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-1987', product_name: 'Vildsvin stek rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 23.0, carbohydrates_100g: 0.0, fat_100g: 1.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-1988', product_name: 'Korv kycklingkorv', brands: 'Korv', nutriments: { 'energy-kcal_100g': 197.0, proteins_100g: 9.4, carbohydrates_100g: 9.6, fat_100g: 13.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-1989', product_name: 'Vildsvin kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 23.0, carbohydrates_100g: 0.0, fat_100g: 1.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-1990', product_name: 'Rådjur bog rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 24.3, carbohydrates_100g: 0.0, fat_100g: 1.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1991', product_name: 'Ren kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 23.1, carbohydrates_100g: 0.0, fat_100g: 1.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-1992', product_name: 'Nöt kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 22.2, carbohydrates_100g: 0.0, fat_100g: 4.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-1993', product_name: 'Lamm kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 19.9, carbohydrates_100g: 0.0, fat_100g: 9.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-1994', product_name: 'Lamm grytbitar rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 20.1, carbohydrates_100g: 0.0, fat_100g: 5.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-1995', product_name: 'Bordsmargarin fett 80% berikad typ Flora original', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 708.0, proteins_100g: 0.2, carbohydrates_100g: 0.0, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1996', product_name: 'Flytande matfettsblandning fett 80% berikad typ Ica raps- och smörolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 710.0, proteins_100g: 0.2, carbohydrates_100g: 0.3, fat_100g: 80.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1997', product_name: 'Potatis höst kokt u. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 85.0, proteins_100g: 1.9, carbohydrates_100g: 17.8, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-1998', product_name: 'Julmust påskmust', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 0.0, carbohydrates_100g: 8.3, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-1999', product_name: 'Slush drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 41.0, proteins_100g: 0.0, carbohydrates_100g: 10.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2000', product_name: 'Mandeldryck berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 26.0, proteins_100g: 0.0, carbohydrates_100g: 3.5, fat_100g: 1.3, fiber_100g: 0.2 }},
    { code: 'lvsdb-2001', product_name: 'Alkoläsk kolsyrad dryck vol. % 4-5', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 52.0, proteins_100g: 0.0, carbohydrates_100g: 5.9, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2002', product_name: 'Potatis kokt u. salt', brands: 'Potatis', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 1.8, carbohydrates_100g: 17.5, fat_100g: 0.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-2003', product_name: 'Lasagne m. svarta bönor veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 4.3, carbohydrates_100g: 7.1, fat_100g: 9.6, fiber_100g: 1.7 }},
    { code: 'lvsdb-2004', product_name: 'Tranbärsdryck drickf. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 0.2, carbohydrates_100g: 9.4, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2005', product_name: 'Barngröt ätf. flerkorn m. frukt berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 3.8, carbohydrates_100g: 12.2, fat_100g: 4.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-2006', product_name: 'Barngröt ätf. m. fullkorn frukt bär berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 3.8, carbohydrates_100g: 12.4, fat_100g: 4.1, fiber_100g: 1.4 }},
    { code: 'lvsdb-2007', product_name: 'Barngröt ätf. m. frukt berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 3.5, carbohydrates_100g: 13.1, fat_100g: 4.0, fiber_100g: 1.3 }},
    { code: 'lvsdb-2008', product_name: 'Barngröt ätf. ris mjölkfri berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 3.2, carbohydrates_100g: 14.6, fat_100g: 2.2, fiber_100g: 0.7 }},
    { code: 'lvsdb-2009', product_name: 'Barngröt ätf. m. fullkorn frukt müsli berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 66.0, proteins_100g: 2.5, carbohydrates_100g: 10.0, fat_100g: 1.5, fiber_100g: 0.6 }},
    { code: 'lvsdb-2010', product_name: 'Barngröt ätf. m. yoghurt frukt berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 90.0, proteins_100g: 3.5, carbohydrates_100g: 13.4, fat_100g: 2.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-2011', product_name: 'Barngröt ätf. havre m. frukt berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 3.2, carbohydrates_100g: 11.3, fat_100g: 1.9, fiber_100g: 0.9 }},
    { code: 'lvsdb-2012', product_name: 'Barngröt ätf. havre naturell berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 4.2, carbohydrates_100g: 13.3, fat_100g: 2.6, fiber_100g: 1.2 }},
    { code: 'lvsdb-2013', product_name: 'Barngröt ätf. havre m. frukt bär berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 3.8, carbohydrates_100g: 13.3, fat_100g: 2.2, fiber_100g: 1.1 }},
    { code: 'lvsdb-2014', product_name: 'Pepparsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 224.0, proteins_100g: 1.9, carbohydrates_100g: 6.6, fat_100g: 21.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-2015', product_name: 'Saffransris', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 2.3, carbohydrates_100g: 21.9, fat_100g: 2.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2016', product_name: 'Ljus sås till fiskgratäng', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 3.7, carbohydrates_100g: 7.4, fat_100g: 17.2, fiber_100g: 0.3 }},
    { code: 'lvsdb-2017', product_name: 'Gris kött rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 155.0, proteins_100g: 19.2, carbohydrates_100g: 0.0, fat_100g: 8.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2018', product_name: 'Gratäng zucchinigratäng m. kalvfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 6.1, carbohydrates_100g: 3.1, fat_100g: 8.8, fiber_100g: 1.4 }},
    { code: 'lvsdb-2019', product_name: 'Toast m. ost skinka', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 282.0, proteins_100g: 15.2, carbohydrates_100g: 22.8, fat_100g: 14.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-2020', product_name: 'Naturgodis olika sorter', brands: 'Godis', nutriments: { 'energy-kcal_100g': 518.0, proteins_100g: 6.6, carbohydrates_100g: 56.8, fat_100g: 28.8, fiber_100g: 2.9 }},
    { code: 'lvsdb-2021', product_name: 'Pastagratäng m. kyckling', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 7.6, carbohydrates_100g: 8.6, fat_100g: 11.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-2022', product_name: 'Tomatsås till pizza hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 1.4, carbohydrates_100g: 7.7, fat_100g: 6.8, fiber_100g: 1.8 }},
    { code: 'lvsdb-2023', product_name: 'Minimjölk fett < 0,1% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 35.0, proteins_100g: 3.6, carbohydrates_100g: 4.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2024', product_name: 'Örtagårdssås m. gräddfil', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 283.0, proteins_100g: 2.5, carbohydrates_100g: 5.0, fat_100g: 28.4, fiber_100g: 0.6 }},
    { code: 'lvsdb-2025', product_name: 'Köttfärssås Bolognese m. nötfärs bacon', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 7.5, carbohydrates_100g: 3.0, fat_100g: 7.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-2026', product_name: 'Aioli', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 762.0, proteins_100g: 1.6, carbohydrates_100g: 1.1, fat_100g: 84.8, fiber_100g: 0.3 }},
    { code: 'lvsdb-2027', product_name: 'Guacamole', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 139.0, proteins_100g: 1.6, carbohydrates_100g: 2.4, fat_100g: 13.1, fiber_100g: 3.7 }},
    { code: 'lvsdb-2028', product_name: 'Pasta carbonara m. pasta fläsk grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 189.0, proteins_100g: 8.7, carbohydrates_100g: 19.3, fat_100g: 8.3, fiber_100g: 1.4 }},
    { code: 'lvsdb-2029', product_name: 'Brownie', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 464.0, proteins_100g: 6.4, carbohydrates_100g: 44.0, fat_100g: 28.4, fiber_100g: 4.6 }},
    { code: 'lvsdb-2030', product_name: 'Fisk m. apelsin chili ugnsstekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 197.0, proteins_100g: 17.0, carbohydrates_100g: 3.4, fat_100g: 12.8, fiber_100g: 0.1 }},
    { code: 'lvsdb-2031', product_name: 'Pulled pork gris m. marinad tillagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 172.0, proteins_100g: 18.5, carbohydrates_100g: 5.3, fat_100g: 8.3, fiber_100g: 0.8 }},
    { code: 'lvsdb-2032', product_name: 'Tropisk juice drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 44.0, proteins_100g: 0.2, carbohydrates_100g: 10.5, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2033', product_name: 'Sojabönor färska förvällda u. skal', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 10.9, carbohydrates_100g: 4.9, fat_100g: 6.4, fiber_100g: 5.1 }},
    { code: 'lvsdb-2034', product_name: 'Sparris grön kokt m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 22.0, proteins_100g: 1.9, carbohydrates_100g: 1.8, fat_100g: 0.2, fiber_100g: 2.5 }},
    { code: 'lvsdb-2035', product_name: 'Kålrot kokt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 34.0, proteins_100g: 1.3, carbohydrates_100g: 5.0, fat_100g: 0.1, fiber_100g: 3.9 }},
    { code: 'lvsdb-2036', product_name: 'Brysselkål kokt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 41.0, proteins_100g: 2.6, carbohydrates_100g: 5.5, fat_100g: 0.0, fiber_100g: 4.3 }},
    { code: 'lvsdb-2037', product_name: 'Rotselleri kokt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 25.0, proteins_100g: 1.0, carbohydrates_100g: 2.7, fat_100g: 0.5, fiber_100g: 2.9 }},
    { code: 'lvsdb-2038', product_name: 'Gula ärtor kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 128.0, proteins_100g: 8.4, carbohydrates_100g: 16.4, fat_100g: 0.6, fiber_100g: 11.2 }},
    { code: 'lvsdb-2039', product_name: 'Bruna bönor torkade kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 8.8, carbohydrates_100g: 16.8, fat_100g: 0.9, fiber_100g: 13.2 }},
    { code: 'lvsdb-2040', product_name: 'Gråärtor kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 10.2, carbohydrates_100g: 16.6, fat_100g: 0.5, fiber_100g: 8.6 }},
    { code: 'lvsdb-2041', product_name: 'Åkerbönor torkade kokta m. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 10.2, carbohydrates_100g: 18.4, fat_100g: 0.5, fiber_100g: 7.1 }},
    { code: 'lvsdb-2042', product_name: 'Äpple Aroma rött', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 0.0, carbohydrates_100g: 10.2, fat_100g: 0.0, fiber_100g: 2.2 }},
    { code: 'lvsdb-2043', product_name: 'Äpple Ingrid Marie rött', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 0.0, carbohydrates_100g: 11.0, fat_100g: 0.0, fiber_100g: 2.2 }},
    { code: 'lvsdb-2044', product_name: 'Äpple Frida', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 0.0, carbohydrates_100g: 12.6, fat_100g: 0.0, fiber_100g: 2.2 }},
    { code: 'lvsdb-2045', product_name: 'Äpple Golden delicious Granny Smith grönt', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 43.0, proteins_100g: 0.0, carbohydrates_100g: 9.4, fat_100g: 0.0, fiber_100g: 2.5 }},
    { code: 'lvsdb-2046', product_name: 'Kyckling pulled chicken tillagad m. marinad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 133.0, proteins_100g: 19.6, carbohydrates_100g: 0.9, fat_100g: 5.4, fiber_100g: 0.9 }},
    { code: 'lvsdb-2047', product_name: 'Tacosås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 1.9, carbohydrates_100g: 5.1, fat_100g: 0.0, fiber_100g: 1.6 }},
    { code: 'lvsdb-2048', product_name: 'Hälleflundra odlad Atlanten rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 102.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 2.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-2049', product_name: 'Korngryn kokt u. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 2.1, carbohydrates_100g: 15.2, fat_100g: 0.7, fiber_100g: 2.5 }},
    { code: 'lvsdb-2050', product_name: 'Julmust light', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 0.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2051', product_name: 'Havregurt naturell fett 2,2% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 76.0, proteins_100g: 1.5, carbohydrates_100g: 11.7, fat_100g: 2.4, fiber_100g: 0.9 }},
    { code: 'lvsdb-2052', product_name: 'Fraiche m. havre veg. fett 15% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 185.0, proteins_100g: 0.8, carbohydrates_100g: 10.1, fat_100g: 15.7, fiber_100g: 1.0 }},
    { code: 'lvsdb-2053', product_name: 'Havrebaserat bredbart pålägg naturell', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 231.0, proteins_100g: 2.9, carbohydrates_100g: 10.9, fat_100g: 19.6, fiber_100g: 0.9 }},
    { code: 'lvsdb-2054', product_name: 'Havredryck m. apelsin mango', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 55.0, proteins_100g: 0.7, carbohydrates_100g: 11.3, fat_100g: 0.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-2055', product_name: 'Korv grillkorv grillad kött 32-35%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 229.0, proteins_100g: 7.6, carbohydrates_100g: 12.8, fat_100g: 16.3, fiber_100g: 1.1 }},
    { code: 'lvsdb-2056', product_name: 'Korv falukorv tillagad kött 58%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 267.0, proteins_100g: 8.7, carbohydrates_100g: 5.4, fat_100g: 23.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2057', product_name: 'Korv bratwurst tillagad kryddig kött 73-75%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 267.0, proteins_100g: 11.5, carbohydrates_100g: 4.5, fat_100g: 22.7, fiber_100g: 0.8 }},
    { code: 'lvsdb-2058', product_name: 'Blodpudding blodkorv tillagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 218.0, proteins_100g: 8.6, carbohydrates_100g: 23.0, fat_100g: 9.4, fiber_100g: 3.2 }},
    { code: 'lvsdb-2059', product_name: 'Gris sidfläsk el. stekfläsk rimmat stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 385.0, proteins_100g: 11.4, carbohydrates_100g: 0.1, fat_100g: 38.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2060', product_name: 'Korv kabanoss tillagad kryddig kött 90%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 16.0, carbohydrates_100g: 1.4, fat_100g: 24.8, fiber_100g: 0.8 }},
    { code: 'lvsdb-2061', product_name: 'Kryddblandning taco', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 284.0, proteins_100g: 5.6, carbohydrates_100g: 50.9, fat_100g: 3.6, fiber_100g: 12.2 }},
    { code: 'lvsdb-2062', product_name: 'Bröd vitt vetetortilla', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 306.0, proteins_100g: 8.4, carbohydrates_100g: 55.5, fat_100g: 4.8, fiber_100g: 1.8 }},
    { code: 'lvsdb-2063', product_name: 'Gris färs tillagad u. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 241.0, proteins_100g: 16.0, carbohydrates_100g: 0.0, fat_100g: 19.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2064', product_name: 'Te fermenterat m. socker', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 17.0, proteins_100g: 0.0, carbohydrates_100g: 2.2, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2065', product_name: 'Gris skinka innanlår tillagad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 20.5, carbohydrates_100g: 0.0, fat_100g: 3.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2066', product_name: 'Gris skinkstek tillagad u. salt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2067', product_name: 'Gris ytterfilé tillagad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 17.0, carbohydrates_100g: 0.0, fat_100g: 5.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2068', product_name: 'Gris fläskkotlett tillagad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 133.0, proteins_100g: 19.6, carbohydrates_100g: 0.0, fat_100g: 6.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2069', product_name: 'Gris fläskfilé tillagad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 20.0, carbohydrates_100g: 0.0, fat_100g: 4.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2070', product_name: 'Nöt kalv lever tillagad', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 20.0, carbohydrates_100g: 9.3, fat_100g: 3.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-2071', product_name: 'Kyckling lever ugnsstekt', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 16.0, carbohydrates_100g: 4.5, fat_100g: 4.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-2072', product_name: 'Gris lever tillagad', brands: 'Lever, njure, tunga etc.', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 22.0, carbohydrates_100g: 6.0, fat_100g: 3.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2073', product_name: 'Kalkon rökt tunna skivor', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 18.3, carbohydrates_100g: 1.1, fat_100g: 2.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2074', product_name: 'Korv veg. soja- och veteprotein tillagad typ middagskorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 14.0, carbohydrates_100g: 14.1, fat_100g: 15.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-2075', product_name: 'Gratäng m. korv rotfrukt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 191.0, proteins_100g: 5.5, carbohydrates_100g: 9.1, fat_100g: 14.6, fiber_100g: 1.4 }},
    { code: 'lvsdb-2076', product_name: 'Pastasås m. lax crème fraiche grädde dill', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 266.0, proteins_100g: 12.0, carbohydrates_100g: 2.6, fat_100g: 23.3, fiber_100g: 0.2 }},
    { code: 'lvsdb-2077', product_name: 'Cashewnötter rostade m. salt', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 597.0, proteins_100g: 18.0, carbohydrates_100g: 19.1, fat_100g: 48.7, fiber_100g: 8.3 }},
    { code: 'lvsdb-2078', product_name: 'Gris kassler tillagad', brands: 'Kött', nutriments: { 'energy-kcal_100g': 148.0, proteins_100g: 18.6, carbohydrates_100g: 0.0, fat_100g: 8.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2079', product_name: 'Kyckling bröstfilé tillagad u. skinn frysvara', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 19.7, carbohydrates_100g: 0.0, fat_100g: 2.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2080', product_name: 'Drickyoghurt smaksatt fett ca 1%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 2.8, carbohydrates_100g: 10.1, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2081', product_name: 'Ost hårdost eko. fett 28%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 25.2, carbohydrates_100g: 2.7, fat_100g: 27.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2082', product_name: 'Vaniljsås ätf.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 3.0, carbohydrates_100g: 15.3, fat_100g: 3.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2083', product_name: 'Yoghurt naturell eko. fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 3.2, carbohydrates_100g: 4.7, fat_100g: 2.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2084', product_name: 'Pannkaka tunn helfabrikat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 6.5, carbohydrates_100g: 25.9, fat_100g: 5.8, fiber_100g: 1.3 }},
    { code: 'lvsdb-2085', product_name: 'Hårt bröd fullkorn råg fiber ca 20% typ sport ', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 8.6, carbohydrates_100g: 64.0, fat_100g: 3.3, fiber_100g: 14.4 }},
    { code: 'lvsdb-2086', product_name: 'Bröd vitt grovt m. nyckelhål typ formfranska', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 260.0, proteins_100g: 8.6, carbohydrates_100g: 43.8, fat_100g: 4.2, fiber_100g: 5.4 }},
    { code: 'lvsdb-2087', product_name: 'Bröd vitt typ levain', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 249.0, proteins_100g: 7.5, carbohydrates_100g: 49.5, fat_100g: 1.4, fiber_100g: 2.5 }},
    { code: 'lvsdb-2088', product_name: 'Frukostflingor müsli vete havre råg korn fullkorn m. frukt nötter fröer', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 445.0, proteins_100g: 15.2, carbohydrates_100g: 47.2, fat_100g: 20.1, fiber_100g: 7.0 }},
    { code: 'lvsdb-2089', product_name: 'Mandelmjöl', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 610.0, proteins_100g: 22.4, carbohydrates_100g: 7.4, fat_100g: 53.1, fiber_100g: 9.8 }},
    { code: 'lvsdb-2090', product_name: 'Filmjölk eko. fett 3% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 3.3, carbohydrates_100g: 4.5, fat_100g: 2.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2091', product_name: 'Kvarg drickf. olika smaker', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 42.0, proteins_100g: 5.4, carbohydrates_100g: 4.6, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2092', product_name: 'Kvarg smaksatt sötningsm.', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 10.0, carbohydrates_100g: 5.2, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2093', product_name: 'Kvarg smaksatt m. socker', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 10.0, carbohydrates_100g: 5.2, fat_100g: 0.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2094', product_name: 'Drickyoghurt smaksatt fett ca 1% socker ca 8%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 2.8, carbohydrates_100g: 10.1, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2095', product_name: 'Drickyoghurt smaksatt fett ca 1% socker ca 11%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 2.8, carbohydrates_100g: 10.1, fat_100g: 0.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2096', product_name: 'Frukostflingor fullkorn berikad typ Specialflingor', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 9.2, carbohydrates_100g: 78.7, fat_100g: 2.2, fiber_100g: 3.7 }},
    { code: 'lvsdb-2097', product_name: 'Yoghurt naturell fett 10%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 3.6, carbohydrates_100g: 5.2, fat_100g: 8.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2098', product_name: 'Pizza m. köttfärs frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 218.0, proteins_100g: 10.3, carbohydrates_100g: 27.7, fat_100g: 6.6, fiber_100g: 2.5 }},
    { code: 'lvsdb-2099', product_name: 'Pizza m. köttstek frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 215.0, proteins_100g: 11.9, carbohydrates_100g: 28.2, fat_100g: 5.3, fiber_100g: 2.8 }},
    { code: 'lvsdb-2100', product_name: 'Pizza m. tomat mozzarella veg. frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 269.0, proteins_100g: 11.0, carbohydrates_100g: 26.8, fat_100g: 12.5, fiber_100g: 2.7 }},
    { code: 'lvsdb-2101', product_name: 'Noni fruktpuré', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 36.0, proteins_100g: 0.6, carbohydrates_100g: 7.2, fat_100g: 0.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-2102', product_name: 'Fisk Bordelaise', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 116.0, proteins_100g: 14.8, carbohydrates_100g: 5.2, fat_100g: 3.9, fiber_100g: 0.2 }},
    { code: 'lvsdb-2103', product_name: 'Ostkräm', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 613.0, proteins_100g: 7.9, carbohydrates_100g: 1.3, fat_100g: 65.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2104', product_name: 'Äppeljuice konc.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 3.8, carbohydrates_100g: 36.3, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2105', product_name: 'Matvete kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 178.0, proteins_100g: 4.5, carbohydrates_100g: 33.5, fat_100g: 0.7, fiber_100g: 9.3 }},
    { code: 'lvsdb-2106', product_name: 'Mathavre kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 199.0, proteins_100g: 5.8, carbohydrates_100g: 33.1, fat_100g: 3.0, fiber_100g: 7.8 }},
    { code: 'lvsdb-2107', product_name: 'Psylliumfröskal', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 199.0, proteins_100g: 1.2, carbohydrates_100g: 10.0, fat_100g: 0.5, fiber_100g: 78.1 }},
    { code: 'lvsdb-2108', product_name: 'Chiafrö', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 448.0, proteins_100g: 19.4, carbohydrates_100g: 0.0, fat_100g: 33.9, fiber_100g: 36.3 }},
    { code: 'lvsdb-2109', product_name: 'Hampafrö m. skal', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 443.0, proteins_100g: 20.9, carbohydrates_100g: 0.0, fat_100g: 32.9, fiber_100g: 35.0 }},
    { code: 'lvsdb-2110', product_name: 'Hampafrö u. skal', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 609.0, proteins_100g: 28.0, carbohydrates_100g: 2.6, fat_100g: 53.6, fiber_100g: 5.4 }},
    { code: 'lvsdb-2111', product_name: 'Vallmofrö', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 534.0, proteins_100g: 17.9, carbohydrates_100g: 4.8, fat_100g: 45.9, fiber_100g: 19.0 }},
    { code: 'lvsdb-2112', product_name: 'Senap sötstark', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 271.0, proteins_100g: 3.7, carbohydrates_100g: 48.9, fat_100g: 6.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-2113', product_name: 'Kokosolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 881.0, proteins_100g: 0.0, carbohydrates_100g: 0.7, fat_100g: 99.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2114', product_name: 'Majonnäs m. sojabönolja fett 80%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 677.0, proteins_100g: 1.3, carbohydrates_100g: 2.7, fat_100g: 74.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2115', product_name: 'Majonnäs m. solrosolja fett 80%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 656.0, proteins_100g: 1.3, carbohydrates_100g: 7.1, fat_100g: 70.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2116', product_name: 'Kräfta kräftstjärtar konserv. u. lag', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 15.6, carbohydrates_100g: 0.8, fat_100g: 0.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-2117', product_name: 'Sikrom Nordamerikansk', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 185.0, proteins_100g: 20.0, carbohydrates_100g: 5.7, fat_100g: 9.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2118', product_name: 'Påläggskaviar m. färskost', brands: 'Ägg, rom, kaviar', nutriments: { 'energy-kcal_100g': 288.0, proteins_100g: 5.9, carbohydrates_100g: 13.8, fat_100g: 23.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-2119', product_name: 'Tångkaviar röd', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 10.0, proteins_100g: 0.3, carbohydrates_100g: 0.4, fat_100g: 0.2, fiber_100g: 2.9 }},
    { code: 'lvsdb-2120', product_name: 'Tångkaviar påläggskaviar', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 299.0, proteins_100g: 0.7, carbohydrates_100g: 16.4, fat_100g: 25.8, fiber_100g: 0.7 }},
    { code: 'lvsdb-2121', product_name: 'Lax vildfångad Sverige rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 188.0, proteins_100g: 22.5, carbohydrates_100g: 1.1, fat_100g: 10.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-2122', product_name: 'Lax odlad Norge fjordlax rå frysvara', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 217.0, proteins_100g: 19.4, carbohydrates_100g: 1.2, fat_100g: 15.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2123', product_name: 'Lax odlad Norge fjordlax rå förpackad', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 210.0, proteins_100g: 21.2, carbohydrates_100g: 0.3, fat_100g: 13.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2124', product_name: 'Välling för barn pulver fullkorn osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 425.0, proteins_100g: 14.9, carbohydrates_100g: 59.1, fat_100g: 13.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-2125', product_name: 'Välling för barn pulver havre osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 460.0, proteins_100g: 14.5, carbohydrates_100g: 59.6, fat_100g: 18.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2126', product_name: 'Välling för barn pulver majs osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 463.0, proteins_100g: 13.8, carbohydrates_100g: 59.4, fat_100g: 18.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2127', product_name: 'Välling för barn pulver havre mjölkfri osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 415.0, proteins_100g: 10.8, carbohydrates_100g: 65.6, fat_100g: 11.2, fiber_100g: 2.8 }},
    { code: 'lvsdb-2128', product_name: 'Barngröt pulver havre m. banan äpple mjölkfri osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 423.0, proteins_100g: 13.2, carbohydrates_100g: 66.4, fat_100g: 10.6, fiber_100g: 3.2 }},
    { code: 'lvsdb-2129', product_name: 'Barngröt pulver naturell fullkorn osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 449.0, proteins_100g: 15.9, carbohydrates_100g: 58.7, fat_100g: 16.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-2130', product_name: 'Barnmat pasta couscous m. kyckling konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 78.0, proteins_100g: 4.2, carbohydrates_100g: 8.0, fat_100g: 2.8, fiber_100g: 2.2 }},
    { code: 'lvsdb-2131', product_name: 'Barnmat spagetti m. köttfärssås konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 3.6, carbohydrates_100g: 6.8, fat_100g: 2.7, fiber_100g: 2.2 }},
    { code: 'lvsdb-2132', product_name: 'Barnmat potatis m. nötköttsgryta konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 3.0, carbohydrates_100g: 8.4, fat_100g: 3.3, fiber_100g: 1.6 }},
    { code: 'lvsdb-2133', product_name: 'Barnmat pastagratäng m. fläskkött konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 6.5, carbohydrates_100g: 7.6, fat_100g: 2.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-2134', product_name: 'Barnmat fiskgryta konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 3.4, carbohydrates_100g: 8.4, fat_100g: 3.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-2135', product_name: 'Barnmat lasagne pastagratäng veg. m. grönsaker konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 3.4, carbohydrates_100g: 9.7, fat_100g: 3.2, fiber_100g: 2.2 }},
    { code: 'lvsdb-2136', product_name: 'Barnmat frukt bär m. yoghurt konserv.', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 1.8, carbohydrates_100g: 13.9, fat_100g: 1.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-2137', product_name: 'Barnmat frukt bär m. yoghurt konserv. berikad', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 1.8, carbohydrates_100g: 13.9, fat_100g: 1.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-2138', product_name: 'Fruktstång fruktgodis', brands: 'Godis', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 2.1, carbohydrates_100g: 75.8, fat_100g: 6.9, fiber_100g: 3.4 }},
    { code: 'lvsdb-2139', product_name: 'Fruktstång fruktgodis berikad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 2.1, carbohydrates_100g: 75.8, fat_100g: 6.9, fiber_100g: 3.4 }},
    { code: 'lvsdb-2140', product_name: 'Barnmat klämmis m. gröt päron mango havre hirs konserv.', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 1.4, carbohydrates_100g: 15.3, fat_100g: 0.5, fiber_100g: 2.7 }},
    { code: 'lvsdb-2141', product_name: 'Välling för barn drickf. fullkorn osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 2.1, carbohydrates_100g: 8.1, fat_100g: 1.9, fiber_100g: 0.2 }},
    { code: 'lvsdb-2142', product_name: 'Välling för barn drickf. mild havre osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 2.0, carbohydrates_100g: 8.2, fat_100g: 2.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-2143', product_name: 'Välling för barn drickf. majs osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 2.1, carbohydrates_100g: 9.0, fat_100g: 2.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2144', product_name: 'Välling för barn drickf. havre mjölkfri osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 57.0, proteins_100g: 1.5, carbohydrates_100g: 9.0, fat_100g: 1.5, fiber_100g: 0.4 }},
    { code: 'lvsdb-2145', product_name: 'Barngröt ätf. havre m. banan äpple mjölkfri osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 3.0, carbohydrates_100g: 15.3, fat_100g: 2.4, fiber_100g: 0.7 }},
    { code: 'lvsdb-2146', product_name: 'Barngröt ätf. naturell fullkorn osötad berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 3.7, carbohydrates_100g: 13.5, fat_100g: 3.7, fiber_100g: 0.5 }},
    { code: 'lvsdb-2147', product_name: 'Sojaprotein bitar kylvara el. frysvara typ Tzay®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 161.0, proteins_100g: 16.4, carbohydrates_100g: 9.3, fat_100g: 5.4, fiber_100g: 4.3 }},
    { code: 'lvsdb-2148', product_name: 'Sojaprotein bitar frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 18.6, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 5.9 }},
    { code: 'lvsdb-2149', product_name: 'Havreprotein pulled havre strimlor kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 203.0, proteins_100g: 30.4, carbohydrates_100g: 9.0, fat_100g: 4.0, fiber_100g: 3.8 }},
    { code: 'lvsdb-2150', product_name: 'Sojaprotein färs kylvara el. frysvara berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 15.2, carbohydrates_100g: 4.8, fat_100g: 8.6, fiber_100g: 5.3 }},
    { code: 'lvsdb-2151', product_name: 'Soja- och veteprotein färs frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 18.6, carbohydrates_100g: 11.9, fat_100g: 3.0, fiber_100g: 5.8 }},
    { code: 'lvsdb-2152', product_name: 'Sojaprotein bullar kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 13.6, carbohydrates_100g: 5.5, fat_100g: 10.4, fiber_100g: 4.7 }},
    { code: 'lvsdb-2153', product_name: 'Mykoprotein bullar frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 123.0, proteins_100g: 13.3, carbohydrates_100g: 8.3, fat_100g: 3.3, fiber_100g: 3.3 }},
    { code: 'lvsdb-2154', product_name: 'Mykoprotein nugget kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 194.0, proteins_100g: 11.3, carbohydrates_100g: 17.0, fat_100g: 8.0, fiber_100g: 4.6 }},
    { code: 'lvsdb-2155', product_name: 'Sojaprotein nugget kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 214.0, proteins_100g: 11.3, carbohydrates_100g: 15.8, fat_100g: 10.6, fiber_100g: 5.0 }},
    { code: 'lvsdb-2156', product_name: 'Soja- och veteprotein nugget kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 237.0, proteins_100g: 18.6, carbohydrates_100g: 13.5, fat_100g: 11.4, fiber_100g: 3.3 }},
    { code: 'lvsdb-2157', product_name: 'Soja- och veteprotein nugget kylvara el. frysvara berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 237.0, proteins_100g: 18.6, carbohydrates_100g: 13.5, fat_100g: 11.4, fiber_100g: 3.3 }},
    { code: 'lvsdb-2158', product_name: 'Soja- och veteprotein bitar som alternativ till bacon kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 211.0, proteins_100g: 18.4, carbohydrates_100g: 6.3, fat_100g: 11.8, fiber_100g: 3.2 }},
    { code: 'lvsdb-2159', product_name: 'Soja- och veteprotein schnitzel kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 12.9, carbohydrates_100g: 16.3, fat_100g: 12.8, fiber_100g: 3.9 }},
    { code: 'lvsdb-2160', product_name: 'Soja- och veteprotein schnitzel kylvara el. frysvara berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 12.9, carbohydrates_100g: 16.3, fat_100g: 12.8, fiber_100g: 3.9 }},
    { code: 'lvsdb-2161', product_name: 'Mykoprotein schnitzel kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 243.0, proteins_100g: 12.4, carbohydrates_100g: 18.4, fat_100g: 12.8, fiber_100g: 2.6 }},
    { code: 'lvsdb-2162', product_name: 'Mykoprotein färs bitar filé stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 105.0, proteins_100g: 16.7, carbohydrates_100g: 2.3, fat_100g: 1.9, fiber_100g: 5.8 }},
    { code: 'lvsdb-2163', product_name: 'Falafel kikärtskroketter stekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 257.0, proteins_100g: 9.0, carbohydrates_100g: 23.6, fat_100g: 12.6, fiber_100g: 6.8 }},
    { code: 'lvsdb-2164', product_name: 'Falafel kikärtskroketter ugnsstekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 285.0, proteins_100g: 10.0, carbohydrates_100g: 26.1, fat_100g: 13.9, fiber_100g: 7.5 }},
    { code: 'lvsdb-2165', product_name: 'Soja- och veteprotein bullar stekta', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 204.0, proteins_100g: 19.0, carbohydrates_100g: 10.3, fat_100g: 8.3, fiber_100g: 5.9 }},
    { code: 'lvsdb-2166', product_name: 'Soja- och veteprotein bullar ugnsstekta', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 20.1, carbohydrates_100g: 10.8, fat_100g: 8.8, fiber_100g: 6.3 }},
    { code: 'lvsdb-2167', product_name: 'Sojaprotein färs stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 22.9, carbohydrates_100g: 7.2, fat_100g: 13.0, fiber_100g: 8.0 }},
    { code: 'lvsdb-2168', product_name: 'Sojaprotein bitar stekta typ Tzay®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 169.0, proteins_100g: 17.2, carbohydrates_100g: 9.8, fat_100g: 5.7, fiber_100g: 4.5 }},
    { code: 'lvsdb-2169', product_name: 'Sojaprotein bitar stekta typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 6.3 }},
    { code: 'lvsdb-2170', product_name: 'Havreprotein pulled havre strimlor stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 277.0, proteins_100g: 41.5, carbohydrates_100g: 12.3, fat_100g: 5.5, fiber_100g: 5.2 }},
    { code: 'lvsdb-2171', product_name: 'Sojaprotein färs stekt berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 22.9, carbohydrates_100g: 7.2, fat_100g: 13.0, fiber_100g: 8.0 }},
    { code: 'lvsdb-2172', product_name: 'Soja- och veteprotein färs stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 234.0, proteins_100g: 26.8, carbohydrates_100g: 17.2, fat_100g: 4.3, fiber_100g: 8.4 }},
    { code: 'lvsdb-2173', product_name: 'Ärtprotein färs stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 38.0, carbohydrates_100g: 8.1, fat_100g: 8.9, fiber_100g: 3.5 }},
    { code: 'lvsdb-2174', product_name: 'Sojaprotein bullar stekta', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 206.0, proteins_100g: 15.7, carbohydrates_100g: 6.3, fat_100g: 12.0, fiber_100g: 5.4 }},
    { code: 'lvsdb-2175', product_name: 'Sojaprotein bullar ugnsstekta', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 219.0, proteins_100g: 16.7, carbohydrates_100g: 6.7, fat_100g: 12.7, fiber_100g: 5.8 }},
    { code: 'lvsdb-2176', product_name: 'Mykoprotein bullar stekta', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 15.6, carbohydrates_100g: 9.7, fat_100g: 3.9, fiber_100g: 3.9 }},
    { code: 'lvsdb-2177', product_name: 'Mykoprotein nugget stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 229.0, proteins_100g: 10.9, carbohydrates_100g: 16.4, fat_100g: 12.5, fiber_100g: 4.4 }},
    { code: 'lvsdb-2178', product_name: 'Mykoprotein nugget ugnsstekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 11.4, carbohydrates_100g: 17.2, fat_100g: 8.1, fiber_100g: 4.7 }},
    { code: 'lvsdb-2179', product_name: 'Sojaprotein nugget stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 248.0, proteins_100g: 10.9, carbohydrates_100g: 15.2, fat_100g: 15.0, fiber_100g: 4.8 }},
    { code: 'lvsdb-2180', product_name: 'Sojaprotein nugget ugnsstekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 11.4, carbohydrates_100g: 16.0, fat_100g: 10.7, fiber_100g: 5.1 }},
    { code: 'lvsdb-2181', product_name: 'Soja- och veteprotein nugget stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 17.9, carbohydrates_100g: 13.0, fat_100g: 15.8, fiber_100g: 3.2 }},
    { code: 'lvsdb-2182', product_name: 'Soja- och veteprotein nugget ugnsstekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 18.8, carbohydrates_100g: 13.6, fat_100g: 11.5, fiber_100g: 3.3 }},
    { code: 'lvsdb-2183', product_name: 'Soja- och veteprotein nugget stekt berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 17.9, carbohydrates_100g: 13.0, fat_100g: 15.8, fiber_100g: 3.2 }},
    { code: 'lvsdb-2184', product_name: 'Soja- och veteprotein nugget ugnsstekt berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 239.0, proteins_100g: 18.8, carbohydrates_100g: 13.6, fat_100g: 11.5, fiber_100g: 3.3 }},
    { code: 'lvsdb-2185', product_name: 'Soja- och veteprotein baconimitation stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 238.0, proteins_100g: 20.7, carbohydrates_100g: 7.1, fat_100g: 13.3, fiber_100g: 3.6 }},
    { code: 'lvsdb-2186', product_name: 'Soja- och veteprotein schnitzel stekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 12.4, carbohydrates_100g: 15.7, fat_100g: 17.1, fiber_100g: 3.8 }},
    { code: 'lvsdb-2187', product_name: 'Soja- och veteprotein schnitzel ugnsstekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 241.0, proteins_100g: 13.0, carbohydrates_100g: 16.5, fat_100g: 12.9, fiber_100g: 3.9 }},
    { code: 'lvsdb-2188', product_name: 'Soja- och veteprotein schnitzel stekt berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 272.0, proteins_100g: 12.4, carbohydrates_100g: 15.7, fat_100g: 17.1, fiber_100g: 3.8 }},
    { code: 'lvsdb-2189', product_name: 'Soja- och veteprotein schnitzel ugnsstekt berikad', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 266.0, proteins_100g: 14.4, carbohydrates_100g: 18.2, fat_100g: 14.3, fiber_100g: 4.3 }},
    { code: 'lvsdb-2190', product_name: 'Mykoprotein schnitzel ugnsstekt', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 276.0, proteins_100g: 11.9, carbohydrates_100g: 17.7, fat_100g: 17.1, fiber_100g: 2.5 }},
    { code: 'lvsdb-2191', product_name: 'Äggstanning', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 88.0, proteins_100g: 7.3, carbohydrates_100g: 3.3, fat_100g: 5.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2192', product_name: 'Jams kokt u. salt', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 1.6, carbohydrates_100g: 27.4, fat_100g: 0.2, fiber_100g: 2.3 }},
    { code: 'lvsdb-2193', product_name: 'Vindruvor gröna', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 67.0, proteins_100g: 0.7, carbohydrates_100g: 14.7, fat_100g: 0.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-2194', product_name: 'Vindruvor röda', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 0.6, carbohydrates_100g: 16.4, fat_100g: 0.1, fiber_100g: 1.3 }},
    { code: 'lvsdb-2195', product_name: 'Dressing hamburgerdressing lätt fett 28 %', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 273.0, proteins_100g: 0.9, carbohydrates_100g: 7.0, fat_100g: 27.2, fiber_100g: 0.2 }},
    { code: 'lvsdb-2196', product_name: 'Majonnäs äggfri', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 484.0, proteins_100g: 0.2, carbohydrates_100g: 0.6, fat_100g: 54.3, fiber_100g: 0.1 }},
    { code: 'lvsdb-2197', product_name: 'Sås mango curry m. majonnäs kylvara', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 540.0, proteins_100g: 1.0, carbohydrates_100g: 13.5, fat_100g: 54.4, fiber_100g: 0.1 }},
    { code: 'lvsdb-2198', product_name: 'Ostsås m. kalkon', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 10.1, carbohydrates_100g: 6.0, fat_100g: 8.8, fiber_100g: 0.1 }},
    { code: 'lvsdb-2199', product_name: 'Lasagne m. zucchini aubergine nötfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 9.1, carbohydrates_100g: 2.8, fat_100g: 6.7, fiber_100g: 1.6 }},
    { code: 'lvsdb-2200', product_name: 'Karlssons frestelse m. nötfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 144.0, proteins_100g: 7.6, carbohydrates_100g: 11.5, fat_100g: 7.2, fiber_100g: 1.5 }},
    { code: 'lvsdb-2201', product_name: 'Lasagne nötfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 7.9, carbohydrates_100g: 11.5, fat_100g: 6.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-2202', product_name: 'Skinkfrestelse m. grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 5.9, carbohydrates_100g: 10.6, fat_100g: 11.7, fiber_100g: 1.3 }},
    { code: 'lvsdb-2203', product_name: 'Lök stekt m. flytande matfett', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 1.4, carbohydrates_100g: 8.3, fat_100g: 1.2, fiber_100g: 2.1 }},
    { code: 'lvsdb-2204', product_name: 'Tzatziki m. morot', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 1.9, carbohydrates_100g: 6.0, fat_100g: 5.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-2205', product_name: 'Mango currysås hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 130.0, proteins_100g: 1.1, carbohydrates_100g: 8.5, fat_100g: 10.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-2206', product_name: 'Kycklingpanna m. citron örter crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 156.0, proteins_100g: 18.1, carbohydrates_100g: 4.2, fat_100g: 7.4, fiber_100g: 0.1 }},
    { code: 'lvsdb-2207', product_name: 'Cowboysoppa m. potatis köttfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 6.7, carbohydrates_100g: 6.7, fat_100g: 6.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-2208', product_name: 'Fransk bondsoppa m. fläsk rotfrukter', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 2.1, carbohydrates_100g: 5.9, fat_100g: 2.2, fiber_100g: 1.8 }},
    { code: 'lvsdb-2209', product_name: 'Kycklingpanna m. lime honung crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 183.0, proteins_100g: 13.0, carbohydrates_100g: 3.3, fat_100g: 13.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2210', product_name: 'Hedvigsoppa m. vitkål nötfärs morot', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 5.3, carbohydrates_100g: 2.8, fat_100g: 2.7, fiber_100g: 1.2 }},
    { code: 'lvsdb-2211', product_name: 'Nikkaluoktasoppa m. vitkål nötfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 63.0, proteins_100g: 5.4, carbohydrates_100g: 1.6, fat_100g: 3.8, fiber_100g: 0.4 }},
    { code: 'lvsdb-2212', product_name: 'Mexicanasoppa m. kyckling majs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 42.0, proteins_100g: 2.4, carbohydrates_100g: 6.4, fat_100g: 0.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-2213', product_name: 'Kycklingpanna m. oliv basilika citron grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 155.0, proteins_100g: 12.1, carbohydrates_100g: 1.9, fat_100g: 11.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2214', product_name: 'Färsruta m. fetaost ugnsstekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 20.4, carbohydrates_100g: 1.5, fat_100g: 15.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2215', product_name: 'Fisk cornflakesfisk panerad ugnsstekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 160.0, proteins_100g: 17.7, carbohydrates_100g: 6.7, fat_100g: 6.8, fiber_100g: 0.5 }},
    { code: 'lvsdb-2216', product_name: 'Gryta fiskgryta m. torsk kokosmjölk curry', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 180.0, proteins_100g: 10.8, carbohydrates_100g: 3.7, fat_100g: 13.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-2217', product_name: 'Rödbetshummus', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 4.5, carbohydrates_100g: 9.7, fat_100g: 11.8, fiber_100g: 6.4 }},
    { code: 'lvsdb-2218', product_name: 'Ajvaryoghurt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 3.1, carbohydrates_100g: 5.4, fat_100g: 7.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-2219', product_name: 'Karl-Alfredsås m. yoghurt spenat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 195.0, proteins_100g: 2.7, carbohydrates_100g: 4.3, fat_100g: 18.8, fiber_100g: 0.3 }},
    { code: 'lvsdb-2220', product_name: 'Chili- och mangosås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 1.3, carbohydrates_100g: 9.0, fat_100g: 7.7, fiber_100g: 0.9 }},
    { code: 'lvsdb-2221', product_name: 'Fisk mager m. fänkål tomat crème fraiche ångkokt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 11.4, carbohydrates_100g: 1.2, fat_100g: 7.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-2222', product_name: 'Bondomelett m. bönor', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 113.0, proteins_100g: 6.5, carbohydrates_100g: 8.8, fat_100g: 5.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-2223', product_name: 'Grönsaksbiff Caribbean stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 201.0, proteins_100g: 3.9, carbohydrates_100g: 26.0, fat_100g: 8.2, fiber_100g: 3.9 }},
    { code: 'lvsdb-2224', product_name: 'Gräddsås m. persilja', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 150.0, proteins_100g: 1.8, carbohydrates_100g: 4.4, fat_100g: 14.1, fiber_100g: 0.2 }},
    { code: 'lvsdb-2225', product_name: 'Köttfärs- och grönsaksbiff stekt', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 14.6, carbohydrates_100g: 8.4, fat_100g: 6.9, fiber_100g: 3.8 }},
    { code: 'lvsdb-2226', product_name: 'Grönsaksbiff broccolibiff stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 271.0, proteins_100g: 7.3, carbohydrates_100g: 24.1, fat_100g: 15.9, fiber_100g: 2.0 }},
    { code: 'lvsdb-2227', product_name: 'Gryta kycklinggryta m. bönor kakao ', brands: 'Kyckling, fågel', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 11.0, carbohydrates_100g: 4.1, fat_100g: 3.3, fiber_100g: 2.1 }},
    { code: 'lvsdb-2228', product_name: 'Fisk Björkeby m. ströbröd smör persilja ugnsstekt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 258.0, proteins_100g: 17.8, carbohydrates_100g: 11.5, fat_100g: 15.3, fiber_100g: 1.7 }},
    { code: 'lvsdb-2229', product_name: 'Fisk m. soltorkad tomat persilja vitlök', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 17.8, carbohydrates_100g: 11.0, fat_100g: 12.3, fiber_100g: 2.3 }},
    { code: 'lvsdb-2230', product_name: 'Gratäng djungelgratäng m. kyckling banan mango chutney crème fraiche', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 218.0, proteins_100g: 11.1, carbohydrates_100g: 7.3, fat_100g: 16.1, fiber_100g: 0.5 }},
    { code: 'lvsdb-2231', product_name: 'Mango chutney', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 0.6, carbohydrates_100g: 25.7, fat_100g: 0.3, fiber_100g: 1.2 }},
    { code: 'lvsdb-2232', product_name: 'Gratäng m. kassler ananas ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 18.2, carbohydrates_100g: 3.9, fat_100g: 4.3, fiber_100g: 0.3 }},
    { code: 'lvsdb-2233', product_name: 'Gryta fiskgryta brasiliansk fiskgryta m. kokosmjölk krossad tomat paprika', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 8.6, carbohydrates_100g: 4.1, fat_100g: 9.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-2234', product_name: 'Gryta mormors kycklinggryta m. svamp', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 11.2, carbohydrates_100g: 2.9, fat_100g: 6.8, fiber_100g: 0.4 }},
    { code: 'lvsdb-2235', product_name: 'Gryta köttgryta m. fransk senap pepparrot gräddfil', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 12.1, carbohydrates_100g: 2.9, fat_100g: 5.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-2236', product_name: 'Gryta fisk m. crème fraiche curry apelsin', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 13.8, carbohydrates_100g: 3.5, fat_100g: 5.4, fiber_100g: 0.6 }},
    { code: 'lvsdb-2237', product_name: 'Korv falukorv ugnsstekt m. ajvar', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 220.0, proteins_100g: 8.1, carbohydrates_100g: 5.4, fat_100g: 18.6, fiber_100g: 0.4 }},
    { code: 'lvsdb-2238', product_name: 'Gryta kyckling tikka masala', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 20.2, carbohydrates_100g: 2.4, fat_100g: 3.3, fiber_100g: 0.1 }},
    { code: 'lvsdb-2239', product_name: 'Senapskräm', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 268.0, proteins_100g: 2.6, carbohydrates_100g: 13.8, fat_100g: 22.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-2240', product_name: 'Köttfärslåda', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 124.0, proteins_100g: 8.8, carbohydrates_100g: 7.6, fat_100g: 6.3, fiber_100g: 1.0 }},
    { code: 'lvsdb-2241', product_name: 'Gryta mykoprotein m. lätt crème fraiche bambuskott haricot verts paprika veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 5.0, carbohydrates_100g: 4.6, fat_100g: 4.4, fiber_100g: 1.4 }},
    { code: 'lvsdb-2242', product_name: 'Gryta mykoprotein tikka masala veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 103.0, proteins_100g: 12.4, carbohydrates_100g: 3.7, fat_100g: 3.3, fiber_100g: 4.1 }},
    { code: 'lvsdb-2243', product_name: 'Gryta mykoprotein m. fransk senap pepparrot gräddfil veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 92.0, proteins_100g: 8.2, carbohydrates_100g: 3.2, fat_100g: 4.0, fiber_100g: 3.4 }},
    { code: 'lvsdb-2244', product_name: 'Grönsaksburgare stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 228.0, proteins_100g: 3.7, carbohydrates_100g: 24.4, fat_100g: 12.1, fiber_100g: 3.6 }},
    { code: 'lvsdb-2245', product_name: 'Grönsaksbiff rödbetsbiff stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 4.5, carbohydrates_100g: 11.1, fat_100g: 4.6, fiber_100g: 2.0 }},
    { code: 'lvsdb-2246', product_name: 'Grönsaksbiff morotsbiff stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 3.7, carbohydrates_100g: 11.2, fat_100g: 4.8, fiber_100g: 2.7 }},
    { code: 'lvsdb-2247', product_name: 'Grönsaksbiff zucchinibiff m. ost stekt veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 208.0, proteins_100g: 7.9, carbohydrates_100g: 15.0, fat_100g: 12.6, fiber_100g: 2.3 }},
    { code: 'lvsdb-2248', product_name: 'Grönsaksbiff ärt- och kålrotsbiff stekt veg. kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 171.0, proteins_100g: 6.5, carbohydrates_100g: 17.6, fat_100g: 6.5, fiber_100g: 8.4 }},
    { code: 'lvsdb-2249', product_name: 'Grönsaksbiff kikärtsbiff stekt veg. hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 210.0, proteins_100g: 8.8, carbohydrates_100g: 17.1, fat_100g: 9.6, fiber_100g: 10.6 }},
    { code: 'lvsdb-2250', product_name: 'Gryta chili sin carne m. zucchini paprika veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 74.0, proteins_100g: 3.6, carbohydrates_100g: 9.2, fat_100g: 1.7, fiber_100g: 3.8 }},
    { code: 'lvsdb-2251', product_name: 'Gryta chili sin carne m. mykoprotein veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 6.9, carbohydrates_100g: 8.6, fat_100g: 2.2, fiber_100g: 4.7 }},
    { code: 'lvsdb-2252', product_name: 'Gryta chili con soja veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 6.8, carbohydrates_100g: 9.0, fat_100g: 3.5, fiber_100g: 4.6 }},
    { code: 'lvsdb-2253', product_name: 'Mykoproteinfärssås veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 90.0, proteins_100g: 8.1, carbohydrates_100g: 6.0, fat_100g: 3.0, fiber_100g: 3.5 }},
    { code: 'lvsdb-2254', product_name: 'Gryta böngryta provencale m. potatis rotselleri vitt vin crème fraiche veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 3.6, carbohydrates_100g: 10.1, fat_100g: 4.0, fiber_100g: 3.2 }},
    { code: 'lvsdb-2255', product_name: 'Gryta halloumigryta m. linser veg.', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 147.0, proteins_100g: 7.7, carbohydrates_100g: 7.9, fat_100g: 8.8, fiber_100g: 2.9 }},
    { code: 'lvsdb-2256', product_name: 'Halloumi stroganoff veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 255.0, proteins_100g: 15.8, carbohydrates_100g: 3.9, fat_100g: 19.6, fiber_100g: 0.5 }},
    { code: 'lvsdb-2257', product_name: 'Gryta halloumigryta m. aubergine veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 7.5, carbohydrates_100g: 4.1, fat_100g: 7.7, fiber_100g: 1.3 }},
    { code: 'lvsdb-2258', product_name: 'Gryta mykoprotein m. grönsaker veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 58.0, proteins_100g: 4.7, carbohydrates_100g: 3.9, fat_100g: 2.0, fiber_100g: 2.6 }},
    { code: 'lvsdb-2259', product_name: 'Gryta kalops m. mykoprotein veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 41.0, proteins_100g: 2.6, carbohydrates_100g: 3.8, fat_100g: 1.5, fiber_100g: 1.5 }},
    { code: 'lvsdb-2260', product_name: 'Gryta indonesisk kycklinggryta m. mango chutney', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 179.0, proteins_100g: 11.2, carbohydrates_100g: 6.0, fat_100g: 12.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-2261', product_name: 'Gryta mykoprotein indonesisk gryta m. mango chutney veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 145.0, proteins_100g: 8.3, carbohydrates_100g: 7.2, fat_100g: 8.6, fiber_100g: 3.2 }},
    { code: 'lvsdb-2262', product_name: 'Gryta mykoprotein m. persika veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 7.2, carbohydrates_100g: 6.2, fat_100g: 9.4, fiber_100g: 3.1 }},
    { code: 'lvsdb-2263', product_name: 'Bön stroganoff veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 6.0, carbohydrates_100g: 11.1, fat_100g: 5.7, fiber_100g: 4.7 }},
    { code: 'lvsdb-2264', product_name: 'Gryta m. gröna linser rotfrukter kokosmjölk veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 2.4, carbohydrates_100g: 6.2, fat_100g: 4.5, fiber_100g: 2.9 }},
    { code: 'lvsdb-2265', product_name: 'Gryta gulasch m. bönor veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 2.5, carbohydrates_100g: 7.2, fat_100g: 1.8, fiber_100g: 2.3 }},
    { code: 'lvsdb-2266', product_name: 'Grönsaker ugnsstekta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 24.0, proteins_100g: 0.7, carbohydrates_100g: 3.7, fat_100g: 0.2, fiber_100g: 2.6 }},
    { code: 'lvsdb-2267', product_name: 'Majssås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 98.0, proteins_100g: 2.1, carbohydrates_100g: 5.7, fat_100g: 7.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-2268', product_name: 'Gryta kikärtsgryta m. aprikos blandade grönsaker veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 62.0, proteins_100g: 1.8, carbohydrates_100g: 7.3, fat_100g: 2.5, fiber_100g: 2.1 }},
    { code: 'lvsdb-2269', product_name: 'Svamp stroganoff veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 92.0, proteins_100g: 3.1, carbohydrates_100g: 4.9, fat_100g: 6.2, fiber_100g: 2.2 }},
    { code: 'lvsdb-2270', product_name: 'Broccolisås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 137.0, proteins_100g: 4.0, carbohydrates_100g: 2.4, fat_100g: 12.4, fiber_100g: 1.0 }},
    { code: 'lvsdb-2271', product_name: 'Gryta indisk lammgryta', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 9.4, carbohydrates_100g: 3.5, fat_100g: 6.8, fiber_100g: 0.6 }},
    { code: 'lvsdb-2272', product_name: 'Sojafärssås veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 7.7, carbohydrates_100g: 7.0, fat_100g: 5.8, fiber_100g: 3.4 }},
    { code: 'lvsdb-2273', product_name: 'Sojafärssås m. linser veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 112.0, proteins_100g: 7.5, carbohydrates_100g: 7.8, fat_100g: 4.9, fiber_100g: 3.5 }},
    { code: 'lvsdb-2274', product_name: 'Tikka masala m. potatis grönsaker veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 2.8, carbohydrates_100g: 8.9, fat_100g: 6.2, fiber_100g: 2.2 }},
    { code: 'lvsdb-2275', product_name: 'Medelhavssås m. grädde soltorkad tomat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 281.0, proteins_100g: 3.8, carbohydrates_100g: 6.7, fat_100g: 26.6, fiber_100g: 1.5 }},
    { code: 'lvsdb-2276', product_name: 'Sås m. grädde soltorkad tomat basilika vitlök', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 198.0, proteins_100g: 4.4, carbohydrates_100g: 8.3, fat_100g: 16.1, fiber_100g: 1.7 }},
    { code: 'lvsdb-2277', product_name: 'Gryta currygryta m. grönsaker veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 1.8, carbohydrates_100g: 5.2, fat_100g: 8.2, fiber_100g: 1.6 }},
    { code: 'lvsdb-2278', product_name: 'Pasta carbonara m. pasta sojabönor veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 5.2, carbohydrates_100g: 13.2, fat_100g: 8.3, fiber_100g: 1.9 }},
    { code: 'lvsdb-2279', product_name: 'Lasagne m. linser veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 4.6, carbohydrates_100g: 7.2, fat_100g: 9.5, fiber_100g: 1.9 }},
    { code: 'lvsdb-2280', product_name: 'Lasagne m. grönsaker veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 4.6, carbohydrates_100g: 17.8, fat_100g: 4.0, fiber_100g: 1.7 }},
    { code: 'lvsdb-2281', product_name: 'Grönsaksbas grönsakspasta', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 1.0, carbohydrates_100g: 6.8, fat_100g: 5.4, fiber_100g: 2.4 }},
    { code: 'lvsdb-2282', product_name: 'Tomatsås m. grädde', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 134.0, proteins_100g: 1.4, carbohydrates_100g: 4.3, fat_100g: 12.4, fiber_100g: 1.1 }},
    { code: 'lvsdb-2283', product_name: 'Morotssås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.5, carbohydrates_100g: 5.3, fat_100g: 4.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-2284', product_name: 'Ajvar- och spenatsås', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 131.0, proteins_100g: 7.0, carbohydrates_100g: 7.2, fat_100g: 7.8, fiber_100g: 2.2 }},
    { code: 'lvsdb-2285', product_name: 'Paprika grillad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 0.7, carbohydrates_100g: 5.8, fat_100g: 0.3, fiber_100g: 1.6 }},
    { code: 'lvsdb-2286', product_name: 'Lasagne m. cottage cheese veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 101.0, proteins_100g: 6.1, carbohydrates_100g: 8.6, fat_100g: 4.5, fiber_100g: 1.4 }},
    { code: 'lvsdb-2287', product_name: 'Paj m. fetaost sötpotatis veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 247.0, proteins_100g: 7.8, carbohydrates_100g: 9.8, fat_100g: 19.4, fiber_100g: 2.1 }},
    { code: 'lvsdb-2288', product_name: 'Grynblandning havre råg vete korn kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 133.0, proteins_100g: 3.6, carbohydrates_100g: 23.4, fat_100g: 1.2, fiber_100g: 7.2 }},
    { code: 'lvsdb-2289', product_name: 'Soppa m. kokosmjölk blomkål potatis spenat veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 225.0, proteins_100g: 2.9, carbohydrates_100g: 5.8, fat_100g: 21.0, fiber_100g: 1.9 }},
    { code: 'lvsdb-2290', product_name: 'Sötpotatissoppa m. linser chili kokosmjölk veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 108.0, proteins_100g: 2.4, carbohydrates_100g: 7.3, fat_100g: 7.2, fiber_100g: 2.8 }},
    { code: 'lvsdb-2291', product_name: 'Rysk kålsoppa veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.9, carbohydrates_100g: 3.7, fat_100g: 2.9, fiber_100g: 1.5 }},
    { code: 'lvsdb-2292', product_name: 'Vegestronesoppa veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 1.3, carbohydrates_100g: 5.5, fat_100g: 1.0, fiber_100g: 1.5 }},
    { code: 'lvsdb-2293', product_name: 'Gratäng m. mykoprotein ananas veg. ', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 115.0, proteins_100g: 12.4, carbohydrates_100g: 6.6, fat_100g: 3.4, fiber_100g: 4.0 }},
    { code: 'lvsdb-2294', product_name: 'Pumpasoppa veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 32.0, proteins_100g: 0.7, carbohydrates_100g: 4.4, fat_100g: 1.1, fiber_100g: 1.0 }},
    { code: 'lvsdb-2295', product_name: 'Gryta chiligryta m. bönor linser sojakorv veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 107.0, proteins_100g: 6.0, carbohydrates_100g: 10.9, fat_100g: 3.2, fiber_100g: 5.3 }},
    { code: 'lvsdb-2296', product_name: 'Lasagne m. skinka', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 8.0, carbohydrates_100g: 11.7, fat_100g: 4.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-2297', product_name: 'Pastasås m. kyckling paprika', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 164.0, proteins_100g: 11.5, carbohydrates_100g: 1.6, fat_100g: 12.5, fiber_100g: 0.3 }},
    { code: 'lvsdb-2298', product_name: 'Pastagratäng Rossini m. kycklingfärs ananas paprika squash tomat purjolök', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 169.0, proteins_100g: 8.1, carbohydrates_100g: 9.6, fat_100g: 10.8, fiber_100g: 1.1 }},
    { code: 'lvsdb-2299', product_name: 'Köttfärssås Vivaldi nöt m. squash majs paprika rödlök ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 109.0, proteins_100g: 8.1, carbohydrates_100g: 5.3, fat_100g: 5.9, fiber_100g: 1.4 }},
    { code: 'lvsdb-2300', product_name: 'Chiapudding', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 111.0, proteins_100g: 3.2, carbohydrates_100g: 11.0, fat_100g: 5.0, fiber_100g: 4.9 }},
    { code: 'lvsdb-2301', product_name: 'Korv stroganoff hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 253.0, proteins_100g: 6.3, carbohydrates_100g: 5.7, fat_100g: 23.0, fiber_100g: 0.5 }},
    { code: 'lvsdb-2302', product_name: 'Lasagne hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 7.4, carbohydrates_100g: 12.1, fat_100g: 5.0, fiber_100g: 0.9 }},
    { code: 'lvsdb-2303', product_name: 'Pizza Funghi m. champinjoner restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 14.9, carbohydrates_100g: 20.4, fat_100g: 16.1, fiber_100g: 3.6 }},
    { code: 'lvsdb-2304', product_name: 'Havremjöl fullkorn', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 11.3, carbohydrates_100g: 59.2, fat_100g: 4.4, fiber_100g: 14.2 }},
    { code: 'lvsdb-2305', product_name: 'Vitlökssås m. örter hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 407.0, proteins_100g: 2.0, carbohydrates_100g: 4.2, fat_100g: 43.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2306', product_name: 'Öring Sverige höst rå ', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 175.0, proteins_100g: 21.2, carbohydrates_100g: 1.7, fat_100g: 9.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2307', product_name: 'Taco tortilla m. köttfärs grönsaker ost', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 8.1, carbohydrates_100g: 11.0, fat_100g: 8.1, fiber_100g: 0.8 }},
    { code: 'lvsdb-2308', product_name: 'Kornflingor ångprep. fullkorn', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 351.0, proteins_100g: 9.2, carbohydrates_100g: 65.4, fat_100g: 3.1, fiber_100g: 10.7 }},
    { code: 'lvsdb-2309', product_name: 'Rågflingor ångprep. fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 323.0, proteins_100g: 9.2, carbohydrates_100g: 61.1, fat_100g: 1.5, fiber_100g: 12.7 }},
    { code: 'lvsdb-2310', product_name: 'Veteflingor ångprep. fullkorn', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 328.0, proteins_100g: 10.2, carbohydrates_100g: 61.0, fat_100g: 2.0, fiber_100g: 11.3 }},
    { code: 'lvsdb-2311', product_name: 'Dinkelmjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 355.0, proteins_100g: 12.0, carbohydrates_100g: 69.3, fat_100g: 1.7, fiber_100g: 5.1 }},
    { code: 'lvsdb-2312', product_name: 'Grönsaksbiff jordnötsbiff tillagad veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 237.0, proteins_100g: 7.8, carbohydrates_100g: 17.4, fat_100g: 14.1, fiber_100g: 5.0 }},
    { code: 'lvsdb-2313', product_name: 'Vitlökssås fetthalt ca 10%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 135.0, proteins_100g: 1.8, carbohydrates_100g: 5.5, fat_100g: 11.9, fiber_100g: 0.1 }},
    { code: 'lvsdb-2314', product_name: 'Vetemjöl durum', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 12.2, carbohydrates_100g: 67.9, fat_100g: 1.6, fiber_100g: 6.3 }},
    { code: 'lvsdb-2315', product_name: 'Modersmjölksersättning', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 66.0, proteins_100g: 1.3, carbohydrates_100g: 7.1, fat_100g: 3.5, fiber_100g: 0.2 }},
    { code: 'lvsdb-2316', product_name: 'Tillskottsnäring för småbarn', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 68.0, proteins_100g: 1.4, carbohydrates_100g: 8.5, fat_100g: 3.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2317', product_name: 'Mjölblandning vete korn råg havre', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 346.0, proteins_100g: 8.7, carbohydrates_100g: 68.4, fat_100g: 2.2, fiber_100g: 7.1 }},
    { code: 'lvsdb-2318', product_name: 'Mjölblandning rågsikt', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 356.0, proteins_100g: 8.6, carbohydrates_100g: 71.8, fat_100g: 1.4, fiber_100g: 8.8 }},
    { code: 'lvsdb-2319', product_name: 'Varm choklad m. veg. dryck fett ca 1,5%', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 1.5, carbohydrates_100g: 9.6, fat_100g: 1.6, fiber_100g: 0.6 }},
    { code: 'lvsdb-2320', product_name: 'Pizza Vesuvio m. skinka restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 297.0, proteins_100g: 17.0, carbohydrates_100g: 19.9, fat_100g: 16.0, fiber_100g: 3.2 }},
    { code: 'lvsdb-2321', product_name: 'Pizza Capricciosa m. skinka champinjoner restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 295.0, proteins_100g: 16.0, carbohydrates_100g: 20.2, fat_100g: 16.0, fiber_100g: 3.4 }},
    { code: 'lvsdb-2322', product_name: 'Pizza m. kött restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 298.0, proteins_100g: 15.4, carbohydrates_100g: 19.3, fat_100g: 17.1, fiber_100g: 3.3 }},
    { code: 'lvsdb-2323', product_name: 'Pizza Bussola m. skinka räkor restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 297.0, proteins_100g: 17.0, carbohydrates_100g: 19.9, fat_100g: 16.0, fiber_100g: 3.2 }},
    { code: 'lvsdb-2324', product_name: 'Pizza m. köttfärs restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 293.0, proteins_100g: 15.4, carbohydrates_100g: 19.8, fat_100g: 16.2, fiber_100g: 3.4 }},
    { code: 'lvsdb-2325', product_name: 'Pizza m. ost restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 328.0, proteins_100g: 16.5, carbohydrates_100g: 19.8, fat_100g: 19.7, fiber_100g: 3.2 }},
    { code: 'lvsdb-2326', product_name: 'Rapsolja berikad', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2327', product_name: 'Muskotnöt malen', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 484.0, proteins_100g: 5.3, carbohydrates_100g: 28.6, fat_100g: 36.5, fiber_100g: 12.0 }},
    { code: 'lvsdb-2328', product_name: 'Fisksås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 9.1, carbohydrates_100g: 2.6, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2329', product_name: 'Durra el. andra sorghumarter mjöl', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 353.0, proteins_100g: 9.5, carbohydrates_100g: 69.7, fat_100g: 2.6, fiber_100g: 4.4 }},
    { code: 'lvsdb-2330', product_name: 'Amarant mjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 352.0, proteins_100g: 15.0, carbohydrates_100g: 55.2, fat_100g: 6.0, fiber_100g: 7.4 }},
    { code: 'lvsdb-2331', product_name: 'Kiwi gul', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 0.6, carbohydrates_100g: 15.9, fat_100g: 0.3, fiber_100g: 1.1 }},
    { code: 'lvsdb-2332', product_name: 'Sojasås shoyu', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 7.7, carbohydrates_100g: 10.1, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2333', product_name: 'Pizzadeg tillagad hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 240.0, proteins_100g: 5.4, carbohydrates_100g: 41.3, fat_100g: 5.0, fiber_100g: 3.0 }},
    { code: 'lvsdb-2334', product_name: 'Insalata Caprese', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 5.8, carbohydrates_100g: 1.8, fat_100g: 12.8, fiber_100g: 0.8 }},
    { code: 'lvsdb-2335', product_name: 'Waldorfsallad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 2.1, carbohydrates_100g: 5.8, fat_100g: 9.1, fiber_100g: 2.6 }},
    { code: 'lvsdb-2336', product_name: 'Jordnötter m. chokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 514.0, proteins_100g: 8.1, carbohydrates_100g: 57.9, fat_100g: 26.9, fiber_100g: 4.3 }},
    { code: 'lvsdb-2337', product_name: 'Chokladkex m. vaniljfyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 465.0, proteins_100g: 4.6, carbohydrates_100g: 65.3, fat_100g: 19.8, fiber_100g: 3.1 }},
    { code: 'lvsdb-2338', product_name: 'Risotto m. kyckling spenat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 114.0, proteins_100g: 5.6, carbohydrates_100g: 12.4, fat_100g: 4.2, fiber_100g: 0.6 }},
    { code: 'lvsdb-2339', product_name: 'Pannkaka tunn u. mjölk ägg', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 154.0, proteins_100g: 3.9, carbohydrates_100g: 20.3, fat_100g: 6.0, fiber_100g: 1.3 }},
    { code: 'lvsdb-2340', product_name: 'Bröd rågsikt fibrer ca 4% typ rågkaka', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 264.0, proteins_100g: 7.3, carbohydrates_100g: 48.9, fat_100g: 2.7, fiber_100g: 6.5 }},
    { code: 'lvsdb-2341', product_name: 'Sött vetebröd kanelbulle gräddad kylvara frysvara el. butiksbakad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 345.0, proteins_100g: 6.7, carbohydrates_100g: 51.7, fat_100g: 11.3, fiber_100g: 4.1 }},
    { code: 'lvsdb-2342', product_name: 'Bröd fröbröd fullkorn vete råg', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 8.7, carbohydrates_100g: 41.0, fat_100g: 5.9, fiber_100g: 8.2 }},
    { code: 'lvsdb-2343', product_name: 'Pizza m. tomatsås ost restaurang', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 328.0, proteins_100g: 16.5, carbohydrates_100g: 22.9, fat_100g: 18.2, fiber_100g: 3.7 }},
    { code: 'lvsdb-2344', product_name: 'Pizzadeg tillagad kylvara', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 335.0, proteins_100g: 9.5, carbohydrates_100g: 60.8, fat_100g: 4.7, fiber_100g: 3.8 }},
    { code: 'lvsdb-2345', product_name: 'Pommes frites smaksatta tillagad frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 207.0, proteins_100g: 3.2, carbohydrates_100g: 26.1, fat_100g: 9.0, fiber_100g: 4.9 }},
    { code: 'lvsdb-2346', product_name: 'Frukostflingor vete puffat m. choklad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 382.0, proteins_100g: 8.4, carbohydrates_100g: 73.1, fat_100g: 3.4, fiber_100g: 10.5 }},
    { code: 'lvsdb-2347', product_name: 'Frukostflingor granola m. frukt nötter', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 436.0, proteins_100g: 11.4, carbohydrates_100g: 46.0, fat_100g: 19.5, fiber_100g: 16.2 }},
    { code: 'lvsdb-2348', product_name: 'Frukostflingor granola m. kakao hallon', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 408.0, proteins_100g: 8.8, carbohydrates_100g: 47.8, fat_100g: 15.8, fiber_100g: 20.3 }},
    { code: 'lvsdb-2349', product_name: 'Majskaka smaksatt ost', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 446.0, proteins_100g: 6.8, carbohydrates_100g: 70.5, fat_100g: 14.3, fiber_100g: 2.8 }},
    { code: 'lvsdb-2350', product_name: 'Linskaka smaksatt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 418.0, proteins_100g: 15.9, carbohydrates_100g: 58.7, fat_100g: 11.6, fiber_100g: 6.6 }},
    { code: 'lvsdb-2351', product_name: 'Kex bokstavskex fullkorn', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 410.0, proteins_100g: 7.5, carbohydrates_100g: 62.3, fat_100g: 11.2, fiber_100g: 14.2 }},
    { code: 'lvsdb-2352', product_name: 'Pepparkaksdeg kylvara', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 383.0, proteins_100g: 4.6, carbohydrates_100g: 58.8, fat_100g: 13.4, fiber_100g: 3.7 }},
    { code: 'lvsdb-2353', product_name: 'Bröd vitt croissant gräddad kylvara frysvara el. butiksbakad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 339.0, proteins_100g: 7.4, carbohydrates_100g: 34.5, fat_100g: 18.4, fiber_100g: 3.4 }},
    { code: 'lvsdb-2354', product_name: 'Pommes frites smaksatta frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 168.0, proteins_100g: 2.6, carbohydrates_100g: 21.1, fat_100g: 7.3, fiber_100g: 4.0 }},
    { code: 'lvsdb-2355', product_name: 'Frukostflingor majs typ cornflakes', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 376.0, proteins_100g: 7.0, carbohydrates_100g: 80.0, fat_100g: 1.2, fiber_100g: 6.1 }},
    { code: 'lvsdb-2356', product_name: 'Ris sushiris kokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 173.0, proteins_100g: 2.8, carbohydrates_100g: 38.3, fat_100g: 0.4, fiber_100g: 1.2 }},
    { code: 'lvsdb-2357', product_name: 'Nudlar äggnudlar kokta u. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 4.2, carbohydrates_100g: 22.8, fat_100g: 0.8, fiber_100g: 2.3 }},
    { code: 'lvsdb-2358', product_name: 'Havregurt hallon berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 82.0, proteins_100g: 0.9, carbohydrates_100g: 15.3, fat_100g: 1.7, fiber_100g: 0.8 }},
    { code: 'lvsdb-2359', product_name: 'Havregurt blåbär hallon berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 83.0, proteins_100g: 0.8, carbohydrates_100g: 15.2, fat_100g: 1.8, fiber_100g: 0.9 }},
    { code: 'lvsdb-2360', product_name: 'Havregurt jordgubb berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 76.0, proteins_100g: 0.9, carbohydrates_100g: 13.3, fat_100g: 1.8, fiber_100g: 1.0 }},
    { code: 'lvsdb-2361', product_name: 'Havregurt vanilj berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 84.0, proteins_100g: 0.9, carbohydrates_100g: 15.0, fat_100g: 2.0, fiber_100g: 0.9 }},
    { code: 'lvsdb-2362', product_name: 'Havredryck fett 1,5% eko. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 48.0, proteins_100g: 0.9, carbohydrates_100g: 7.2, fat_100g: 1.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-2363', product_name: 'Havredryck fett 0,5 % eko. berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 0.9, carbohydrates_100g: 7.3, fat_100g: 0.5, fiber_100g: 0.8 }},
    { code: 'lvsdb-2364', product_name: 'Havregurt naturell fett 11 % berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 152.0, proteins_100g: 2.8, carbohydrates_100g: 11.3, fat_100g: 10.5, fiber_100g: 0.9 }},
    { code: 'lvsdb-2365', product_name: 'Glass havreglass chokladfudge', brands: 'Glass', nutriments: { 'energy-kcal_100g': 235.0, proteins_100g: 1.0, carbohydrates_100g: 35.5, fat_100g: 9.5, fiber_100g: 1.4 }},
    { code: 'lvsdb-2366', product_name: 'Glass havreglass karamell hasselnöt', brands: 'Glass', nutriments: { 'energy-kcal_100g': 245.0, proteins_100g: 1.4, carbohydrates_100g: 28.2, fat_100g: 13.9, fiber_100g: 1.1 }},
    { code: 'lvsdb-2367', product_name: 'Glass havreglass karamell vanilj', brands: 'Glass', nutriments: { 'energy-kcal_100g': 210.0, proteins_100g: 0.5, carbohydrates_100g: 29.9, fat_100g: 9.6, fiber_100g: 0.7 }},
    { code: 'lvsdb-2368', product_name: 'Havrebaserat bredbart pålägg tomat basilika', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 215.0, proteins_100g: 2.9, carbohydrates_100g: 11.2, fat_100g: 17.6, fiber_100g: 0.9 }},
    { code: 'lvsdb-2369', product_name: 'Havrebaserat bredbart pålägg vitlök gurka', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 207.0, proteins_100g: 2.7, carbohydrates_100g: 10.7, fat_100g: 17.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-2370', product_name: 'Havredryck choklad fett 2,5 % berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 71.0, proteins_100g: 1.3, carbohydrates_100g: 10.5, fat_100g: 2.4, fiber_100g: 1.2 }},
    { code: 'lvsdb-2371', product_name: 'Havregurt smaksatt berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 81.0, proteins_100g: 0.9, carbohydrates_100g: 14.7, fat_100g: 1.8, fiber_100g: 0.9 }},
    { code: 'lvsdb-2372', product_name: 'Havredryck fett 3,0% berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 1.0, carbohydrates_100g: 6.6, fat_100g: 3.0, fiber_100g: 0.8 }},
    { code: 'lvsdb-2373', product_name: 'Glass havreglass smaksatt', brands: 'Glass', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 1.0, carbohydrates_100g: 31.2, fat_100g: 11.0, fiber_100g: 1.1 }},
    { code: 'lvsdb-2374', product_name: 'Havrebaserat bredbart pålägg smaksatt', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 211.0, proteins_100g: 2.8, carbohydrates_100g: 11.0, fat_100g: 17.4, fiber_100g: 0.9 }},
    { code: 'lvsdb-2375', product_name: 'Kex bokstavskex fullkorn berikad', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 410.0, proteins_100g: 7.5, carbohydrates_100g: 62.3, fat_100g: 11.2, fiber_100g: 14.2 }},
    { code: 'lvsdb-2376', product_name: 'Vitlökssås fetthalt ≥ 40%', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 509.0, proteins_100g: 1.8, carbohydrates_100g: 5.7, fat_100g: 54.1, fiber_100g: 0.1 }},
    { code: 'lvsdb-2377', product_name: 'Sött vetebröd saffransbröd', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 317.0, proteins_100g: 7.5, carbohydrates_100g: 51.5, fat_100g: 8.0, fiber_100g: 3.5 }},
    { code: 'lvsdb-2378', product_name: 'Pommes frites klyftpotatis frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 158.0, proteins_100g: 2.4, carbohydrates_100g: 22.3, fat_100g: 5.6, fiber_100g: 3.9 }},
    { code: 'lvsdb-2379', product_name: 'Sojaprotein kebab frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 136.0, proteins_100g: 17.4, carbohydrates_100g: 4.6, fat_100g: 3.8, fiber_100g: 7.1 }},
    { code: 'lvsdb-2380', product_name: 'Sojaprotein pulled sojaprotein frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 117.0, proteins_100g: 12.1, carbohydrates_100g: 13.4, fat_100g: 0.5, fiber_100g: 4.8 }},
    { code: 'lvsdb-2381', product_name: 'Sojaprotein bitar m. timjan vitlök frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 127.0, proteins_100g: 17.7, carbohydrates_100g: 4.2, fat_100g: 3.0, fiber_100g: 5.8 }},
    { code: 'lvsdb-2382', product_name: 'Rismål u. sylt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 118.0, proteins_100g: 3.6, carbohydrates_100g: 16.7, fat_100g: 4.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2383', product_name: 'Rismål u. sylt u. socker m. sötningsm.', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 100.0, proteins_100g: 3.9, carbohydrates_100g: 12.1, fat_100g: 4.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2384', product_name: 'Chips linser smaksatta fett 17%', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 455.0, proteins_100g: 13.0, carbohydrates_100g: 53.6, fat_100g: 19.1, fiber_100g: 8.1 }},
    { code: 'lvsdb-2385', product_name: 'Linsbågar fett 28%', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 511.0, proteins_100g: 15.8, carbohydrates_100g: 40.3, fat_100g: 30.8, fiber_100g: 5.6 }},
    { code: 'lvsdb-2386', product_name: 'Frukostflingor ris glutenfri berikad typ Specialflingor', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 384.0, proteins_100g: 5.9, carbohydrates_100g: 86.5, fat_100g: 0.7, fiber_100g: 1.2 }},
    { code: 'lvsdb-2387', product_name: 'Frukostflingor granola glutenfri', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 432.0, proteins_100g: 9.1, carbohydrates_100g: 44.5, fat_100g: 20.3, fiber_100g: 18.0 }},
    { code: 'lvsdb-2388', product_name: 'Frukostflingor majs glutenfri berikad', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 369.0, proteins_100g: 7.4, carbohydrates_100g: 81.3, fat_100g: 0.2, fiber_100g: 3.4 }},
    { code: 'lvsdb-2389', product_name: 'Mjölblandning ljus glutenfri', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 336.0, proteins_100g: 2.8, carbohydrates_100g: 75.0, fat_100g: 0.0, fiber_100g: 10.3 }},
    { code: 'lvsdb-2390', product_name: 'Bovetemjöl grovt', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 360.0, proteins_100g: 17.7, carbohydrates_100g: 60.2, fat_100g: 3.7, fiber_100g: 5.5 }},
    { code: 'lvsdb-2391', product_name: 'Teffmjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 344.0, proteins_100g: 10.3, carbohydrates_100g: 65.3, fat_100g: 2.3, fiber_100g: 8.2 }},
    { code: 'lvsdb-2392', product_name: 'Våffelmix glutenfri', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 390.0, proteins_100g: 5.4, carbohydrates_100g: 87.7, fat_100g: 1.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2393', product_name: 'Våffla glutenfri', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 216.0, proteins_100g: 1.9, carbohydrates_100g: 29.8, fat_100g: 9.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2394', product_name: 'Majsgryn polenta', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 345.0, proteins_100g: 8.6, carbohydrates_100g: 68.3, fat_100g: 2.1, fiber_100g: 7.2 }},
    { code: 'lvsdb-2395', product_name: 'Bröd surdegsbröd glutenfritt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 192.0, proteins_100g: 3.4, carbohydrates_100g: 35.1, fat_100g: 2.5, fiber_100g: 7.4 }},
    { code: 'lvsdb-2396', product_name: 'Bröd vitt tortilla glutenfritt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 252.0, proteins_100g: 6.4, carbohydrates_100g: 41.1, fat_100g: 4.3, fiber_100g: 11.2 }},
    { code: 'lvsdb-2397', product_name: 'Hårt bröd m. chiafrö glutenfritt fibrer ca 10%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 363.0, proteins_100g: 4.4, carbohydrates_100g: 75.0, fat_100g: 2.3, fiber_100g: 10.2 }},
    { code: 'lvsdb-2398', product_name: 'Hårt bröd m. sesamfrö glutenfritt fibrer ca 9%', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 407.0, proteins_100g: 6.1, carbohydrates_100g: 65.2, fat_100g: 11.2, fiber_100g: 9.6 }},
    { code: 'lvsdb-2399', product_name: 'Bröd vitt osötat glutenfritt fibrer ca 7% typ ciabatta', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 295.0, proteins_100g: 6.0, carbohydrates_100g: 47.8, fat_100g: 7.2, fiber_100g: 6.8 }},
    { code: 'lvsdb-2400', product_name: 'Sockerbetsfiber', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 203.0, proteins_100g: 8.3, carbohydrates_100g: 0.0, fat_100g: 2.3, fiber_100g: 77.9 }},
    { code: 'lvsdb-2401', product_name: 'Kex salta glutenfritt', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 446.0, proteins_100g: 2.6, carbohydrates_100g: 78.0, fat_100g: 13.0, fiber_100g: 1.9 }},
    { code: 'lvsdb-2402', product_name: 'Chokladkaka chocolate chip cookie glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 507.0, proteins_100g: 2.8, carbohydrates_100g: 63.3, fat_100g: 26.4, fiber_100g: 2.4 }},
    { code: 'lvsdb-2403', product_name: 'Korv veg. sojaprotein kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 176.0, proteins_100g: 12.0, carbohydrates_100g: 3.4, fat_100g: 11.6, fiber_100g: 5.7 }},
    { code: 'lvsdb-2404', product_name: 'Korv veg. solrosprotein kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 5.3, carbohydrates_100g: 6.7, fat_100g: 10.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-2405', product_name: 'Korv veg. solros- och ärtprotein kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 174.0, proteins_100g: 4.7, carbohydrates_100g: 8.2, fat_100g: 12.6, fiber_100g: 5.2 }},
    { code: 'lvsdb-2406', product_name: 'Korv veg. grönsaker kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 160.0, proteins_100g: 7.1, carbohydrates_100g: 14.7, fat_100g: 7.4, fiber_100g: 3.4 }},
    { code: 'lvsdb-2407', product_name: 'Korv veg. sojaprotein tillagad kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 186.0, proteins_100g: 12.7, carbohydrates_100g: 3.6, fat_100g: 12.2, fiber_100g: 6.0 }},
    { code: 'lvsdb-2408', product_name: 'Korv veg. solrosprotein tillagad kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 151.0, proteins_100g: 5.6, carbohydrates_100g: 7.1, fat_100g: 11.2, fiber_100g: 0.0 }},
    { code: 'lvsdb-2409', product_name: 'Korv veg. solros- och ärtprotein tillagad kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 184.0, proteins_100g: 5.0, carbohydrates_100g: 8.7, fat_100g: 13.3, fiber_100g: 5.5 }},
    { code: 'lvsdb-2410', product_name: 'Korv veg. tillagad kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 162.0, proteins_100g: 9.9, carbohydrates_100g: 7.2, fat_100g: 9.6, fiber_100g: 4.1 }},
    { code: 'lvsdb-2411', product_name: 'Korv veg. grönsaker tillagad kylvara el. frysvara typ grillkorv', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 7.5, carbohydrates_100g: 15.6, fat_100g: 7.9, fiber_100g: 3.6 }},
    { code: 'lvsdb-2412', product_name: 'Burgare veg. potatis linser bönor majs kylvara el. frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 7.8, carbohydrates_100g: 24.0, fat_100g: 9.9, fiber_100g: 7.1 }},
    { code: 'lvsdb-2413', product_name: 'Burgare veg. potatis linser bönor majs stekt kylvara el. frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 270.0, proteins_100g: 9.1, carbohydrates_100g: 28.1, fat_100g: 11.6, fiber_100g: 8.3 }},
    { code: 'lvsdb-2414', product_name: 'Ärtprotein färs kylvara el. frysvara', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 190.0, proteins_100g: 26.6, carbohydrates_100g: 5.6, fat_100g: 6.2, fiber_100g: 2.4 }},
    { code: 'lvsdb-2415', product_name: 'Sojadryck osötad berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 33.0, proteins_100g: 3.4, carbohydrates_100g: 1.7, fat_100g: 1.3, fiber_100g: 0.6 }},
    { code: 'lvsdb-2416', product_name: 'Mandeldryck osötad berikad', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 15.0, proteins_100g: 0.0, carbohydrates_100g: 1.0, fat_100g: 1.2, fiber_100g: 0.3 }},
    { code: 'lvsdb-2417', product_name: 'Kokosnötdryck ', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 0.0, carbohydrates_100g: 4.4, fat_100g: 0.0, fiber_100g: 0.1 }},
    { code: 'lvsdb-2418', product_name: 'Mörk choklad kakao 70%', brands: 'Godis', nutriments: { 'energy-kcal_100g': 581.0, proteins_100g: 8.4, carbohydrates_100g: 34.0, fat_100g: 43.9, fiber_100g: 10.8 }},
    { code: 'lvsdb-2419', product_name: 'Mörk choklad kakao 85%', brands: 'Godis', nutriments: { 'energy-kcal_100g': 592.0, proteins_100g: 11.1, carbohydrates_100g: 22.3, fat_100g: 48.6, fiber_100g: 13.9 }},
    { code: 'lvsdb-2420', product_name: 'Pommes frites klyftpotatis tillagad frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 196.0, proteins_100g: 3.0, carbohydrates_100g: 27.7, fat_100g: 7.0, fiber_100g: 4.8 }},
    { code: 'lvsdb-2421', product_name: 'Sojaprotein kebab stekt frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 6.3 }},
    { code: 'lvsdb-2422', product_name: 'Sojaprotein pulled sojaprotein stekt frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 6.3 }},
    { code: 'lvsdb-2423', product_name: 'Sojaprotein bitar m. timjan vitlök stekta frysvara typ Oumph®', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 97.0, proteins_100g: 19.8, carbohydrates_100g: 0.0, fat_100g: 0.5, fiber_100g: 6.3 }},
    { code: 'lvsdb-2424', product_name: 'Pommes frites klyftpotatis friterad frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 244.0, proteins_100g: 2.8, carbohydrates_100g: 25.8, fat_100g: 13.4, fiber_100g: 4.5 }},
    { code: 'lvsdb-2425', product_name: 'Bulgur kokt m. tomat buljong olja', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 129.0, proteins_100g: 3.1, carbohydrates_100g: 15.6, fat_100g: 5.4, fiber_100g: 3.1 }},
    { code: 'lvsdb-2426', product_name: 'Munk friterad m. socker typ somalisk bur saliid', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 324.0, proteins_100g: 6.3, carbohydrates_100g: 42.7, fat_100g: 13.7, fiber_100g: 1.8 }},
    { code: 'lvsdb-2427', product_name: 'Majsdessert m. socker typ somalisk xalwo', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 326.0, proteins_100g: 0.0, carbohydrates_100g: 39.4, fat_100g: 18.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2428', product_name: 'Sött vetebröd dadelkrans m. fyllning', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 301.0, proteins_100g: 5.5, carbohydrates_100g: 53.0, fat_100g: 6.3, fiber_100g: 3.8 }},
    { code: 'lvsdb-2429', product_name: 'Mannagrynspudding m. socker typ syrisk mamonia', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 1.2, carbohydrates_100g: 15.6, fat_100g: 0.7, fiber_100g: 0.2 }},
    { code: 'lvsdb-2430', product_name: 'Gryta auberginegryta veg. typ tapsi', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 42.0, proteins_100g: 1.2, carbohydrates_100g: 5.3, fat_100g: 1.3, fiber_100g: 2.1 }},
    { code: 'lvsdb-2431', product_name: 'Mannagrynskaka fylld m. dadlar nötter typ mamoul', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 226.0, proteins_100g: 3.5, carbohydrates_100g: 28.6, fat_100g: 10.5, fiber_100g: 1.4 }},
    { code: 'lvsdb-2432', product_name: 'Sesamkaka m. socker olja typ somalisk sisin ', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 547.0, proteins_100g: 11.8, carbohydrates_100g: 43.5, fat_100g: 35.2, fiber_100g: 5.8 }},
    { code: 'lvsdb-2433', product_name: 'Gryta m. kött kyckling typ tapsi', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 223.0, proteins_100g: 21.3, carbohydrates_100g: 0.8, fat_100g: 15.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2434', product_name: 'Fatteh veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 143.0, proteins_100g: 5.2, carbohydrates_100g: 12.8, fat_100g: 7.1, fiber_100g: 4.0 }},
    { code: 'lvsdb-2435', product_name: 'Fatteh m. kyckling', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 7.6, carbohydrates_100g: 10.3, fat_100g: 4.6, fiber_100g: 2.9 }},
    { code: 'lvsdb-2436', product_name: 'Börek m. spenat fetaost veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 206.0, proteins_100g: 7.6, carbohydrates_100g: 15.8, fat_100g: 12.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-2437', product_name: 'Börek m. köttfärs', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 9.7, carbohydrates_100g: 22.2, fat_100g: 10.1, fiber_100g: 1.6 }},
    { code: 'lvsdb-2438', product_name: 'Pizza orientalisk', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 208.0, proteins_100g: 9.2, carbohydrates_100g: 26.6, fat_100g: 6.7, fiber_100g: 1.8 }},
    { code: 'lvsdb-2439', product_name: 'Pirog m. kött ugnsstekt typ sambusa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 230.0, proteins_100g: 7.8, carbohydrates_100g: 25.1, fat_100g: 10.5, fiber_100g: 2.1 }},
    { code: 'lvsdb-2440', product_name: 'Pirog m. spenat ugnsstekt veg. typ sambusa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 197.0, proteins_100g: 4.1, carbohydrates_100g: 23.2, fat_100g: 9.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-2441', product_name: 'Pirog m. ost ugnsstekt typ sambusa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 281.0, proteins_100g: 10.2, carbohydrates_100g: 27.8, fat_100g: 14.0, fiber_100g: 1.3 }},
    { code: 'lvsdb-2442', product_name: 'Pirog m. grönsaker friterad veg. typ sambusa', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 228.0, proteins_100g: 4.3, carbohydrates_100g: 26.7, fat_100g: 11.0, fiber_100g: 2.8 }},
    { code: 'lvsdb-2443', product_name: 'Dolma veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 93.0, proteins_100g: 2.5, carbohydrates_100g: 12.5, fat_100g: 3.1, fiber_100g: 2.1 }},
    { code: 'lvsdb-2444', product_name: 'Grön chilisås typ basbaas cagaar', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 1.4, carbohydrates_100g: 8.2, fat_100g: 0.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-2445', product_name: 'Yoghurtdryck typ ayran', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 1.7, carbohydrates_100g: 2.3, fat_100g: 1.4, fiber_100g: 0.0 }},
    { code: 'lvsdb-2446', product_name: 'Bröd vitt mjukt typ chapati', brands: 'Bröd', nutriments: { 'energy-kcal_100g': 258.0, proteins_100g: 4.3, carbohydrates_100g: 41.8, fat_100g: 7.6, fiber_100g: 1.8 }},
    { code: 'lvsdb-2447', product_name: 'Gryta köttgryta typ suqaar', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 92.0, proteins_100g: 7.3, carbohydrates_100g: 3.0, fat_100g: 5.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-2448', product_name: 'Kebab m. lamm hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 209.0, proteins_100g: 16.8, carbohydrates_100g: 1.8, fat_100g: 14.9, fiber_100g: 0.7 }},
    { code: 'lvsdb-2449', product_name: 'Mannagrynskaka m. sirap yoghurt typ basbousa', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 325.0, proteins_100g: 4.0, carbohydrates_100g: 44.1, fat_100g: 14.4, fiber_100g: 1.2 }},
    { code: 'lvsdb-2450', product_name: 'Biryani ris m. kyckling lammkött grönsaker', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 167.0, proteins_100g: 7.8, carbohydrates_100g: 20.1, fat_100g: 5.7, fiber_100g: 2.1 }},
    { code: 'lvsdb-2451', product_name: 'Biryani ris m. grönsaker veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 168.0, proteins_100g: 4.4, carbohydrates_100g: 23.5, fat_100g: 5.6, fiber_100g: 2.5 }},
    { code: 'lvsdb-2452', product_name: 'Yoghurtsås m. tahini citron', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 110.0, proteins_100g: 4.2, carbohydrates_100g: 5.0, fat_100g: 8.1, fiber_100g: 0.9 }},
    { code: 'lvsdb-2453', product_name: 'Potatisgratäng kylvara tillagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 120.0, proteins_100g: 2.1, carbohydrates_100g: 10.9, fat_100g: 7.1, fiber_100g: 2.0 }},
    { code: 'lvsdb-2454', product_name: 'Kakaobönor', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 576.0, proteins_100g: 12.6, carbohydrates_100g: 0.0, fat_100g: 51.9, fiber_100g: 34.7 }},
    { code: 'lvsdb-2455', product_name: 'Choklad ljus vegansk', brands: 'Godis', nutriments: { 'energy-kcal_100g': 557.0, proteins_100g: 3.3, carbohydrates_100g: 53.4, fat_100g: 35.8, fiber_100g: 5.0 }},
    { code: 'lvsdb-2456', product_name: 'Gelégodis u. gelatin', brands: 'Godis', nutriments: { 'energy-kcal_100g': 327.0, proteins_100g: 0.6, carbohydrates_100g: 79.2, fat_100g: 0.0, fiber_100g: 1.4 }},
    { code: 'lvsdb-2457', product_name: 'Mango torkad', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 296.0, proteins_100g: 2.6, carbohydrates_100g: 64.0, fat_100g: 0.9, fiber_100g: 9.2 }},
    { code: 'lvsdb-2458', product_name: 'Gojibär torkade', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 279.0, proteins_100g: 11.2, carbohydrates_100g: 47.2, fat_100g: 2.4, fiber_100g: 10.8 }},
    { code: 'lvsdb-2459', product_name: 'Glykossirap', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 324.0, proteins_100g: 0.0, carbohydrates_100g: 79.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2460', product_name: 'Näringsjäst', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 332.0, proteins_100g: 46.6, carbohydrates_100g: 12.6, fat_100g: 5.2, fiber_100g: 23.4 }},
    { code: 'lvsdb-2461', product_name: 'Havreris kokt m. salt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 170.0, proteins_100g: 5.6, carbohydrates_100g: 28.5, fat_100g: 2.7, fiber_100g: 4.1 }},
    { code: 'lvsdb-2462', product_name: 'Lakritsgodis', brands: 'Godis', nutriments: { 'energy-kcal_100g': 350.0, proteins_100g: 5.1, carbohydrates_100g: 80.1, fat_100g: 0.2, fiber_100g: 1.1 }},
    { code: 'lvsdb-2463', product_name: 'Hirs kokt m. salt', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 96.0, proteins_100g: 2.7, carbohydrates_100g: 19.0, fat_100g: 0.6, fiber_100g: 1.1 }},
    { code: 'lvsdb-2464', product_name: 'Kokosbaserad bit riven fett ca 20% som alternativ till ost', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 274.0, proteins_100g: 0.0, carbohydrates_100g: 18.0, fat_100g: 22.0, fiber_100g: 3.4 }},
    { code: 'lvsdb-2465', product_name: 'Kokosbaserad bit fett ca 20% som alternativ till ost', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 282.0, proteins_100g: 0.0, carbohydrates_100g: 20.4, fat_100g: 22.0, fiber_100g: 2.3 }},
    { code: 'lvsdb-2466', product_name: 'Korv kryddkorv kött ca 75%', brands: 'Korv', nutriments: { 'energy-kcal_100g': 244.0, proteins_100g: 11.8, carbohydrates_100g: 3.4, fat_100g: 20.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-2467', product_name: 'Dippsås m. gräddfil dippmix', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 142.0, proteins_100g: 3.2, carbohydrates_100g: 8.2, fat_100g: 10.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-2468', product_name: 'Snabbkaffe koffeinfritt pulver', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 304.0, proteins_100g: 22.5, carbohydrates_100g: 38.1, fat_100g: 1.0, fiber_100g: 25.5 }},
    { code: 'lvsdb-2469', product_name: 'Mullbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 1.2, carbohydrates_100g: 10.5, fat_100g: 0.4, fiber_100g: 2.2 }},
    { code: 'lvsdb-2470', product_name: 'Te fermenterat m. fruktjuice', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 12.0, proteins_100g: 0.0, carbohydrates_100g: 1.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2471', product_name: 'Te fermenterat m. sötningsm.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 8.0, proteins_100g: 0.0, carbohydrates_100g: 2.0, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2472', product_name: 'Färskost ricotta fett ca 10%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 146.0, proteins_100g: 10.2, carbohydrates_100g: 2.0, fat_100g: 10.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2473', product_name: 'Wasabirot', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 104.0, proteins_100g: 4.8, carbohydrates_100g: 15.8, fat_100g: 0.6, fiber_100g: 7.8 }},
    { code: 'lvsdb-2474', product_name: 'Macadamianötter', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 740.0, proteins_100g: 7.9, carbohydrates_100g: 5.2, fat_100g: 75.8, fiber_100g: 8.6 }},
    { code: 'lvsdb-2475', product_name: 'Quinoa okokt', brands: 'Pasta, ris, gryn', nutriments: { 'energy-kcal_100g': 356.0, proteins_100g: 14.4, carbohydrates_100g: 56.8, fat_100g: 6.1, fiber_100g: 7.0 }},
    { code: 'lvsdb-2476', product_name: 'Quinoamjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 343.0, proteins_100g: 14.4, carbohydrates_100g: 52.5, fat_100g: 5.6, fiber_100g: 11.4 }},
    { code: 'lvsdb-2477', product_name: 'Tempeh', brands: 'Quorn, sojaprotein, vegetariska produkter', nutriments: { 'energy-kcal_100g': 207.0, proteins_100g: 18.6, carbohydrates_100g: 8.2, fat_100g: 10.8, fiber_100g: 1.3 }},
    { code: 'lvsdb-2478', product_name: 'Arrowrotmjöl', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 1.0, carbohydrates_100g: 85.2, fat_100g: 0.2, fiber_100g: 0.9 }},
    { code: 'lvsdb-2479', product_name: 'Vinblad konserv.', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 61.0, proteins_100g: 4.3, carbohydrates_100g: 1.8, fat_100g: 2.0, fiber_100g: 9.9 }},
    { code: 'lvsdb-2480', product_name: 'Hampamjöl avfettat', brands: 'Mjöl', nutriments: { 'energy-kcal_100g': 298.0, proteins_100g: 22.3, carbohydrates_100g: 3.8, fat_100g: 11.1, fiber_100g: 49.4 }},
    { code: 'lvsdb-2481', product_name: 'Kakaosmör', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2482', product_name: 'Röd pepparsås', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 12.9, carbohydrates_100g: 0.0, fat_100g: 0.8, fiber_100g: 0.6 }},
    { code: 'lvsdb-2483', product_name: 'Shiitakesvamp', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 18.0, proteins_100g: 1.8, carbohydrates_100g: 0.5, fat_100g: 0.3, fiber_100g: 3.3 }},
    { code: 'lvsdb-2484', product_name: 'Ostronskivling', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 26.0, proteins_100g: 2.0, carbohydrates_100g: 2.6, fat_100g: 0.4, fiber_100g: 2.4 }},
    { code: 'lvsdb-2485', product_name: 'Blåbär amerikanska', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 54.0, proteins_100g: 0.3, carbohydrates_100g: 10.6, fat_100g: 0.4, fiber_100g: 3.3 }},
    { code: 'lvsdb-2486', product_name: 'Odon', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 42.0, proteins_100g: 0.4, carbohydrates_100g: 7.2, fat_100g: 0.7, fiber_100g: 2.4 }},
    { code: 'lvsdb-2487', product_name: 'Rönnbär', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 1.1, carbohydrates_100g: 12.9, fat_100g: 1.2, fiber_100g: 6.5 }},
    { code: 'lvsdb-2488', product_name: 'Aronia svart', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 53.0, proteins_100g: 0.4, carbohydrates_100g: 8.9, fat_100g: 0.6, fiber_100g: 5.2 }},
    { code: 'lvsdb-2489', product_name: 'Aronia torkad pulver', brands: 'Frukt, bär', nutriments: { 'energy-kcal_100g': 277.0, proteins_100g: 5.1, carbohydrates_100g: 34.7, fat_100g: 2.4, fiber_100g: 49.1 }},
    { code: 'lvsdb-2490', product_name: 'Rågkli', brands: 'Flingor, frukostflingor, müsli, gröt, välling', nutriments: { 'energy-kcal_100g': 278.0, proteins_100g: 14.0, carbohydrates_100g: 26.7, fat_100g: 4.3, fiber_100g: 39.0 }},
    { code: 'lvsdb-2491', product_name: 'Ärtskott', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 23.0, proteins_100g: 3.3, carbohydrates_100g: 0.6, fat_100g: 0.4, fiber_100g: 1.6 }},
    { code: 'lvsdb-2492', product_name: 'Kakaopulver fett 10-15%', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 368.0, proteins_100g: 21.2, carbohydrates_100g: 24.8, fat_100g: 14.4, fiber_100g: 27.9 }},
    { code: 'lvsdb-2493', product_name: 'Korv kryddkorv kött ca 75% stekt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 258.0, proteins_100g: 12.5, carbohydrates_100g: 3.6, fat_100g: 21.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2494', product_name: 'Köttbullar stekta frysvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 264.0, proteins_100g: 15.2, carbohydrates_100g: 8.0, fat_100g: 18.8, fiber_100g: 1.8 }},
    { code: 'lvsdb-2495', product_name: 'Korv falukorv fett ca 22 % kött 58% stekt', brands: 'Korv', nutriments: { 'energy-kcal_100g': 254.0, proteins_100g: 9.6, carbohydrates_100g: 5.4, fat_100g: 21.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2496', product_name: 'Frityrolja', brands: 'Fett, olja', nutriments: { 'energy-kcal_100g': 884.0, proteins_100g: 0.0, carbohydrates_100g: 0.0, fat_100g: 100.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2497', product_name: 'Fruktyoghurt fett 2% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 75.0, proteins_100g: 3.0, carbohydrates_100g: 11.5, fat_100g: 1.7, fiber_100g: 0.4 }},
    { code: 'lvsdb-2498', product_name: 'Fruktyoghurt fett 2,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 79.0, proteins_100g: 2.9, carbohydrates_100g: 11.8, fat_100g: 2.0, fiber_100g: 0.4 }},
    { code: 'lvsdb-2499', product_name: 'Mjuk kaka tårtbotten glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 311.0, proteins_100g: 4.0, carbohydrates_100g: 65.3, fat_100g: 3.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2500', product_name: 'Soygurt smaksatt osötad berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 53.0, proteins_100g: 3.2, carbohydrates_100g: 4.5, fat_100g: 2.2, fiber_100g: 1.3 }},
    { code: 'lvsdb-2501', product_name: 'Soygurt naturell eko. berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 4.0, carbohydrates_100g: 4.6, fat_100g: 2.6, fiber_100g: 1.1 }},
    { code: 'lvsdb-2502', product_name: 'Crème fraiche fett 32%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 312.0, proteins_100g: 2.0, carbohydrates_100g: 1.6, fat_100g: 33.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-2503', product_name: 'Crème fraiche laktosfri fett 32-34%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 312.0, proteins_100g: 2.0, carbohydrates_100g: 1.6, fat_100g: 33.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-2504', product_name: 'Crème fraiche lätt fett 13%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 2.9, carbohydrates_100g: 5.2, fat_100g: 11.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2505', product_name: 'Crème fraiche lätt laktosfri fett 13%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 2.9, carbohydrates_100g: 5.2, fat_100g: 11.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2506', product_name: 'Ädelost blågrön mögelost fett ca 35%', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 372.0, proteins_100g: 16.7, carbohydrates_100g: 0.9, fat_100g: 34.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2507', product_name: 'Ost hårdost parmesan fett 29% typ Grana Padano', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 382.0, proteins_100g: 31.8, carbohydrates_100g: 3.8, fat_100g: 26.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2508', product_name: 'Soygurt smaksatt berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 80.0, proteins_100g: 4.0, carbohydrates_100g: 9.6, fat_100g: 2.5, fiber_100g: 1.1 }},
    { code: 'lvsdb-2509', product_name: 'Soygurt naturell berikad Ca vitD B12 folsyra riboflavin', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 3.6, carbohydrates_100g: 4.3, fat_100g: 2.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-2510', product_name: 'Soygurt naturell berikad Ca vitD B12', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 56.0, proteins_100g: 3.6, carbohydrates_100g: 4.3, fat_100g: 2.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-2511', product_name: 'Yoghurt smaksatt m. sötningsm. fett 0% typ grekisk yoghurt', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 59.0, proteins_100g: 9.1, carbohydrates_100g: 5.1, fat_100g: 0.1, fiber_100g: 0.0 }},
    { code: 'lvsdb-2512', product_name: 'Yoghurt mild honung fett 2% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 70.0, proteins_100g: 3.2, carbohydrates_100g: 9.9, fat_100g: 1.9, fiber_100g: 0.0 }},
    { code: 'lvsdb-2513', product_name: 'Yoghurt mild vanilj fett 2,7% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 77.0, proteins_100g: 2.9, carbohydrates_100g: 10.4, fat_100g: 2.6, fiber_100g: 0.3 }},
    { code: 'lvsdb-2514', product_name: 'Yoghurt naturell lätt laktosfri fett ca 0,4% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 39.0, proteins_100g: 3.6, carbohydrates_100g: 5.0, fat_100g: 0.5, fiber_100g: 0.0 }},
    { code: 'lvsdb-2515', product_name: 'Gris skinka bog konserv.', brands: 'Kött', nutriments: { 'energy-kcal_100g': 140.0, proteins_100g: 17.0, carbohydrates_100g: 0.0, fat_100g: 8.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2516', product_name: 'Fruktyoghurt lätt m. socker fett 0,1%', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 2.9, carbohydrates_100g: 8.8, fat_100g: 0.1, fiber_100g: 0.6 }},
    { code: 'lvsdb-2517', product_name: 'Fruktyoghurt lätt m. sötningsm. fett 0,1% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 50.0, proteins_100g: 2.9, carbohydrates_100g: 8.8, fat_100g: 0.1, fiber_100g: 0.6 }},
    { code: 'lvsdb-2518', product_name: 'Fruktyoghurt lättsötad fett 1,5% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 60.0, proteins_100g: 3.4, carbohydrates_100g: 9.2, fat_100g: 0.8, fiber_100g: 0.3 }},
    { code: 'lvsdb-2519', product_name: 'Nöt färs m. morot blomkål rå', brands: 'Kött', nutriments: { 'energy-kcal_100g': 106.0, proteins_100g: 10.7, carbohydrates_100g: 2.3, fat_100g: 5.8, fiber_100g: 1.2 }},
    { code: 'lvsdb-2520', product_name: 'Tonfisk gulfenad rå', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 95.0, proteins_100g: 21.7, carbohydrates_100g: 0.5, fat_100g: 0.6, fiber_100g: 0.0 }},
    { code: 'lvsdb-2521', product_name: 'Rödbetssallad m. creme fraiche kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 209.0, proteins_100g: 1.3, carbohydrates_100g: 13.6, fat_100g: 16.6, fiber_100g: 1.0 }},
    { code: 'lvsdb-2522', product_name: 'Rödbetssallad u. ägg kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 222.0, proteins_100g: 0.8, carbohydrates_100g: 10.5, fat_100g: 19.7, fiber_100g: 1.0 }},
    { code: 'lvsdb-2523', product_name: 'Schnitzel kalv stekt', brands: 'Kött', nutriments: { 'energy-kcal_100g': 211.0, proteins_100g: 19.9, carbohydrates_100g: 9.6, fat_100g: 10.1, fiber_100g: 1.1 }},
    { code: 'lvsdb-2524', product_name: 'Kanelbulle glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 340.0, proteins_100g: 2.6, carbohydrates_100g: 47.5, fat_100g: 15.2, fiber_100g: 1.2 }},
    { code: 'lvsdb-2525', product_name: 'Muffins glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 333.0, proteins_100g: 5.5, carbohydrates_100g: 43.6, fat_100g: 14.7, fiber_100g: 1.5 }},
    { code: 'lvsdb-2526', product_name: 'Kladdkaka glutenfri', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 395.0, proteins_100g: 6.1, carbohydrates_100g: 45.0, fat_100g: 20.4, fiber_100g: 3.4 }},
    { code: 'lvsdb-2527', product_name: 'Småkakor glutenfria hembakade', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 425.0, proteins_100g: 2.7, carbohydrates_100g: 57.8, fat_100g: 19.9, fiber_100g: 1.5 }},
    { code: 'lvsdb-2528', product_name: 'Krabba vitt kött kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 86.0, proteins_100g: 20.5, carbohydrates_100g: 0.0, fat_100g: 0.3, fiber_100g: 0.0 }},
    { code: 'lvsdb-2529', product_name: 'Krabba brunt kött kokt', brands: 'Fisk, skaldjur', nutriments: { 'energy-kcal_100g': 163.0, proteins_100g: 18.8, carbohydrates_100g: 4.4, fat_100g: 7.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2530', product_name: 'Kex m. kola rispuffar mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 499.0, proteins_100g: 5.2, carbohydrates_100g: 60.7, fat_100g: 25.8, fiber_100g: 1.9 }},
    { code: 'lvsdb-2531', product_name: 'Maltkulor m. mjölkchokladöverdrag', brands: 'Godis', nutriments: { 'energy-kcal_100g': 498.0, proteins_100g: 7.6, carbohydrates_100g: 63.5, fat_100g: 23.3, fiber_100g: 1.7 }},
    { code: 'lvsdb-2532', product_name: 'Nöt färs m. ärtprotein', brands: 'Kött', nutriments: { 'energy-kcal_100g': 190.0, proteins_100g: 21.9, carbohydrates_100g: 1.7, fat_100g: 10.5, fiber_100g: 0.7 }},
    { code: 'lvsdb-2533', product_name: 'Savoiardikex', brands: 'Bullar, kakor, tårtor', nutriments: { 'energy-kcal_100g': 323.0, proteins_100g: 6.5, carbohydrates_100g: 65.2, fat_100g: 3.3, fiber_100g: 1.3 }},
    { code: 'lvsdb-2534', product_name: 'Fruktdryck m. kolsyra', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 22.0, proteins_100g: 0.5, carbohydrates_100g: 4.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2535', product_name: 'Mörk choklad kakao <70% m. nötter frukt', brands: 'Godis', nutriments: { 'energy-kcal_100g': 536.0, proteins_100g: 6.9, carbohydrates_100g: 59.0, fat_100g: 30.2, fiber_100g: 1.1 }},
    { code: 'lvsdb-2536', product_name: 'Mandelmassa', brands: 'Nötter, frön', nutriments: { 'energy-kcal_100g': 435.0, proteins_100g: 9.7, carbohydrates_100g: 38.9, fat_100g: 25.0, fiber_100g: 8.8 }},
    { code: 'lvsdb-2537', product_name: 'Naturgodis nötter m. vit choklad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 565.0, proteins_100g: 9.4, carbohydrates_100g: 44.5, fat_100g: 38.2, fiber_100g: 4.0 }},
    { code: 'lvsdb-2538', product_name: 'Broccoli kokt m. salt frysvara', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 26.0, proteins_100g: 2.4, carbohydrates_100g: 2.0, fat_100g: 0.3, fiber_100g: 2.7 }},
    { code: 'lvsdb-2539', product_name: 'Naturgodis frukt m. vit choklad ', brands: 'Godis', nutriments: { 'energy-kcal_100g': 493.0, proteins_100g: 5.0, carbohydrates_100g: 65.4, fat_100g: 23.3, fiber_100g: 0.6 }},
    { code: 'lvsdb-2540', product_name: 'Naturgodis lakrits m. vit choklad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 481.0, proteins_100g: 5.2, carbohydrates_100g: 67.3, fat_100g: 21.0, fiber_100g: 0.3 }},
    { code: 'lvsdb-2541', product_name: 'Naturgodis frukt m. mjölkchoklad', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 519.0, proteins_100g: 4.6, carbohydrates_100g: 61.0, fat_100g: 27.9, fiber_100g: 3.0 }},
    { code: 'lvsdb-2542', product_name: 'Naturgodis lakrits m. mjölkchoklad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 482.0, proteins_100g: 5.0, carbohydrates_100g: 64.0, fat_100g: 22.4, fiber_100g: 2.3 }},
    { code: 'lvsdb-2543', product_name: 'Naturgodis nötter m. mjölkchoklad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 562.0, proteins_100g: 10.1, carbohydrates_100g: 39.7, fat_100g: 39.2, fiber_100g: 6.8 }},
    { code: 'lvsdb-2544', product_name: 'Pyttipanna hemlagad', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 138.0, proteins_100g: 5.9, carbohydrates_100g: 15.1, fat_100g: 5.5, fiber_100g: 2.0 }},
    { code: 'lvsdb-2545', product_name: 'Räkchips friterade', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 508.0, proteins_100g: 3.1, carbohydrates_100g: 63.6, fat_100g: 26.6, fiber_100g: 1.0 }},
    { code: 'lvsdb-2546', product_name: 'Potatissallad u. ägg kylvara', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 221.0, proteins_100g: 1.4, carbohydrates_100g: 11.6, fat_100g: 18.8, fiber_100g: 1.3 }},
    { code: 'lvsdb-2547', product_name: 'Sellerikål pak choi', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 19.0, proteins_100g: 1.4, carbohydrates_100g: 1.8, fat_100g: 0.2, fiber_100g: 1.9 }},
    { code: 'lvsdb-2548', product_name: 'Koriander blad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 37.0, proteins_100g: 3.5, carbohydrates_100g: 1.9, fat_100g: 0.7, fiber_100g: 4.7 }},
    { code: 'lvsdb-2549', product_name: 'Grönmynta blad', brands: 'Grönsaker, baljväxter, svamp', nutriments: { 'energy-kcal_100g': 46.0, proteins_100g: 4.7, carbohydrates_100g: 2.4, fat_100g: 0.6, fiber_100g: 5.9 }},
    { code: 'lvsdb-2550', product_name: 'Kardemumma torkad', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 292.0, proteins_100g: 6.7, carbohydrates_100g: 48.0, fat_100g: 2.8, fiber_100g: 23.5 }},
    { code: 'lvsdb-2551', product_name: 'Kryddnejlika torkad malen', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 240.0, proteins_100g: 5.9, carbohydrates_100g: 18.7, fat_100g: 8.4, fiber_100g: 34.5 }},
    { code: 'lvsdb-2552', product_name: 'Koriander frö torkad', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 336.0, proteins_100g: 10.7, carbohydrates_100g: 13.0, fat_100g: 17.5, fiber_100g: 44.8 }},
    { code: 'lvsdb-2553', product_name: 'Gurkmeja torkad', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 316.0, proteins_100g: 7.7, carbohydrates_100g: 49.2, fat_100g: 5.0, fiber_100g: 21.4 }},
    { code: 'lvsdb-2554', product_name: 'Spiskummin frö torkad', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 354.0, proteins_100g: 13.9, carbohydrates_100g: 22.6, fat_100g: 16.6, fiber_100g: 30.4 }},
    { code: 'lvsdb-2555', product_name: 'Paneer', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 258.0, proteins_100g: 18.9, carbohydrates_100g: 12.4, fat_100g: 14.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2556', product_name: 'Linssoppa m. coucous veg.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 2.2, carbohydrates_100g: 6.1, fat_100g: 1.3, fiber_100g: 2.0 }},
    { code: 'lvsdb-2557', product_name: 'Pannkaka tunn m. vatten', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 119.0, proteins_100g: 3.7, carbohydrates_100g: 14.3, fat_100g: 5.0, fiber_100g: 0.7 }},
    { code: 'lvsdb-2558', product_name: 'Mörk choklad kakao 70% m. frukt nötter', brands: 'Godis', nutriments: { 'energy-kcal_100g': 571.0, proteins_100g: 8.2, carbohydrates_100g: 34.3, fat_100g: 42.7, fiber_100g: 10.7 }},
    { code: 'lvsdb-2559', product_name: 'Knäck', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 463.0, proteins_100g: 2.5, carbohydrates_100g: 62.5, fat_100g: 22.3, fiber_100g: 1.4 }},
    { code: 'lvsdb-2560', product_name: 'Potatismos pulver', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 344.0, proteins_100g: 9.1, carbohydrates_100g: 68.0, fat_100g: 1.5, fiber_100g: 8.3 }},
    { code: 'lvsdb-2561', product_name: 'Potatismos pulver tillagat', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 64.0, proteins_100g: 1.7, carbohydrates_100g: 12.7, fat_100g: 0.3, fiber_100g: 1.5 }},
    { code: 'lvsdb-2562', product_name: 'Mörk choklad m. sötningsm.', brands: 'Godis', nutriments: { 'energy-kcal_100g': 581.0, proteins_100g: 8.4, carbohydrates_100g: 34.0, fat_100g: 43.9, fiber_100g: 10.8 }},
    { code: 'lvsdb-2563', product_name: 'Kola hemlagad', brands: 'Godis', nutriments: { 'energy-kcal_100g': 470.0, proteins_100g: 1.1, carbohydrates_100g: 65.4, fat_100g: 22.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2564', product_name: 'Tomatsås till pizza konserv.', brands: 'Rätter', nutriments: { 'energy-kcal_100g': 49.0, proteins_100g: 1.5, carbohydrates_100g: 6.0, fat_100g: 1.5, fiber_100g: 2.1 }},
    { code: 'lvsdb-2565', product_name: 'Drottningsylt lättsockrad', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 126.0, proteins_100g: 0.5, carbohydrates_100g: 28.9, fat_100g: 0.4, fiber_100g: 1.8 }},
    { code: 'lvsdb-2566', product_name: 'Drottningsylt', brands: 'Sylt, marmelad, gelé, chutney', nutriments: { 'energy-kcal_100g': 182.0, proteins_100g: 0.5, carbohydrates_100g: 42.6, fat_100g: 0.4, fiber_100g: 1.7 }},
    { code: 'lvsdb-2567', product_name: 'Hallonsylt lättsockrad', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 121.0, proteins_100g: 0.4, carbohydrates_100g: 29.0, fat_100g: 0.0, fiber_100g: 1.0 }},
    { code: 'lvsdb-2568', product_name: 'Ketchup lättsötad', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 72.0, proteins_100g: 2.5, carbohydrates_100g: 13.7, fat_100g: 0.2, fiber_100g: 2.7 }},
    { code: 'lvsdb-2569', product_name: 'Ketchup m. sötningsm.', brands: 'Smaksättare', nutriments: { 'energy-kcal_100g': 47.0, proteins_100g: 2.0, carbohydrates_100g: 8.3, fat_100g: 0.2, fiber_100g: 2.2 }},
    { code: 'lvsdb-2570', product_name: 'Karameller gräddkarameller', brands: 'Övrigt', nutriments: { 'energy-kcal_100g': 432.0, proteins_100g: 1.3, carbohydrates_100g: 77.0, fat_100g: 12.8, fiber_100g: 0.0 }},
    { code: 'lvsdb-2571', product_name: 'Saft lättsockrad drickf.', brands: 'Dryck', nutriments: { 'energy-kcal_100g': 28.0, proteins_100g: 0.0, carbohydrates_100g: 6.8, fat_100g: 0.0, fiber_100g: 0.0 }},
    { code: 'lvsdb-2572', product_name: 'Vitmögelost smaksatt fett ca 38 % ', brands: 'Pålägg', nutriments: { 'energy-kcal_100g': 371.0, proteins_100g: 15.5, carbohydrates_100g: 2.4, fat_100g: 33.6, fiber_100g: 0.4 }},
    { code: 'lvsdb-2573', product_name: 'Fruktyoghurt fett 3,6% berikad', brands: 'Mejeri', nutriments: { 'energy-kcal_100g': 91.0, proteins_100g: 3.0, carbohydrates_100g: 11.5, fat_100g: 3.7, fiber_100g: 0.0 }},
    { code: 'lvsdb-2574', product_name: 'Chips vete m. baconsmak', brands: 'Snacks', nutriments: { 'energy-kcal_100g': 461.0, proteins_100g: 6.2, carbohydrates_100g: 54.4, fat_100g: 23.7, fiber_100g: 2.6 }}
  ];


  const searchFood = (query, category = selectedCategory) => {
    setIsSearching(true);
    
    const queryLower = (query || '').toLowerCase().trim();
    
    // Filtrera på kategori först
    let matches = localFoodDatabase;
    if (category) {
      matches = matches.filter(food => food.brands === category);
    }
    
    // Sedan filtrera på sökterm (om det finns en)
    if (queryLower.length >= 2) {
      matches = matches.filter(food => 
        food.product_name.toLowerCase().includes(queryLower) ||
        food.brands.toLowerCase().includes(queryLower)
      );
    }
    
    // Om bara kategori vald (ingen sökterm), visa alla i kategorin
    if (!queryLower && category) {
      // Sortera alfabetiskt
      matches = matches.sort((a, b) => 
        a.product_name.localeCompare(b.product_name, 'sv')
      );
    } else if (queryLower) {
      // Sortera resultaten smart när det finns sökterm
      matches = matches.sort((a, b) => {
        const aName = a.product_name.toLowerCase();
        const bName = b.product_name.toLowerCase();
        
        if (aName === queryLower && bName !== queryLower) return -1;
        if (bName === queryLower && aName !== queryLower) return 1;
        
        const aStartsWord = aName.startsWith(queryLower + ' ');
        const bStartsWord = bName.startsWith(queryLower + ' ');
        if (aStartsWord && !bStartsWord) return -1;
        if (bStartsWord && !aStartsWord) return 1;
        
        const aStarts = aName.startsWith(queryLower);
        const bStarts = bName.startsWith(queryLower);
        if (aStarts && !bStarts) return -1;
        if (bStarts && !aStarts) return 1;
        
        return aName.length - bName.length;
      });
    }
    
    setFoodResults(matches.slice(0, 50));
    setIsSearching(false);
  };

  const debouncedSearch = useCallback(debounce(searchFood, 150), [selectedCategory]);

  const handleFoodSearch = (value) => {
    setFoodSearch(value);
    if (value.length >= 2 || selectedCategory) {
      debouncedSearch(value, selectedCategory);
      // Spara till sökhistorik när man söker
      if (value.length >= 2) {
        addToSearchHistory(value);
      }
    } else {
      setFoodResults([]);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Kör sökning direkt med ny kategori
    if (foodSearch.length >= 2 || categoryId) {
      searchFood(foodSearch, categoryId);
    } else {
      setFoodResults([]);
    }
  };

  const addToMeal = (food) => {
    const portion = portionSize || 100;
    const nutrients = food.nutriments || {};
    
    const mealItem = {
      id: Date.now(),
      name: food.product_name,
      brand: food.brands || '',
      portion: portion,
      calories: Math.round((nutrients['energy-kcal_100g'] || nutrients['energy-kcal'] || 0) * portion / 100),
      protein: Math.round((nutrients.proteins_100g || 0) * portion / 100 * 10) / 10,
      carbs: Math.round((nutrients.carbohydrates_100g || 0) * portion / 100 * 10) / 10,
      fat: Math.round((nutrients.fat_100g || 0) * portion / 100 * 10) / 10,
      fiber: Math.round((nutrients.fiber_100g || 0) * portion / 100 * 10) / 10,
    };
    
    setMealList([...mealList, mealItem]);
    setSelectedFood(null);
    setPortionSize(100);
  };

  const removeFromMeal = (id) => {
    setMealList(mealList.filter(item => item.id !== id));
  };

  const getTotals = () => {
    return mealList.reduce((totals, item) => ({
      calories: totals.calories + item.calories,
      protein: Math.round((totals.protein + item.protein) * 10) / 10,
      carbs: Math.round((totals.carbs + item.carbs) * 10) / 10,
      fat: Math.round((totals.fat + item.fat) * 10) / 10,
      fiber: Math.round((totals.fiber + item.fiber) * 10) / 10,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
  };

  const calculateConversion = () => {
    const value = parseFloat(fromValue) || 0;
    if (conversionType === 'weight') {
      const grams = value * conversionData.weight[fromUnit];
      return (grams / conversionData.weight[toUnit]).toFixed(2);
    } else {
      const ml = value * conversionData.volume[fromUnit];
      return (ml / conversionData.volume[toUnit]).toFixed(2);
    }
  };

  const getWeightUnits = () => {
    const base = ['kg', 'hg', 'g'];
    return showForeign ? [...base, 'lb', 'oz'] : base;
  };

  const getVolumeUnits = () => {
    const base = ['l', 'dl', 'cl', 'ml', 'msk', 'tsk', 'krm'];
    return showForeign ? [...base, 'cup'] : base;
  };

  const renderHome = () => (
    <div className="home-grid">
      <div className="menu-card" role="button" tabIndex="0" onClick={() => setActiveView('conversion')} onKeyDown={(e) => e.key === 'Enter' && setActiveView('conversion')}>
        <h2>Måttomvandling</h2>
        <p>Omvandla mellan vikt och volym</p>
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

  const renderCalories = () => {
    const totals = getTotals();
    
    return (
      <div className="calories-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>Kalorier & Näring</h1>
        <p className="api-credit">Data från Livsmedelsverkets livsmedelsdatabas</p>
        
        <div className="search-box">
          <input
            type="text"
            aria-label="Sök livsmedel" placeholder="Sök livsmedel (t.ex. 'mjölk', 'bröd', 'pasta')..."
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
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sökhistorik och favoriter - visas när inget annat visas */}
        {!foodSearch && !selectedCategory && !selectedFood && foodResults.length === 0 && (
          <div className="quick-access">
            {favorites.length > 0 && (
              <div className="favorites-section">
                <h3>⭐ Favoriter</h3>
                <div className="quick-access-list">
                  {favorites.slice(0, 5).map((food, idx) => (
                    <button 
                      key={food.code || idx}
                      className="quick-access-item"
                      onClick={() => setSelectedFood(food)}
                    >
                      {food.product_name}
                      <span className="quick-kcal">{Math.round(food.nutriments?.['energy-kcal_100g'] || 0)} kcal</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {searchHistory.length > 0 && (
              <div className="history-section">
                <h3>🕐 Senaste sökningar</h3>
                <div className="quick-access-list">
                  {searchHistory.slice(0, 5).map((term, idx) => (
                    <button 
                      key={idx}
                      className="quick-access-item history-item"
                      onClick={() => handleFoodSearch(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {isSearching && (
          <div className="searching-indicator">
            <span className="spinner"></span> Söker...
          </div>
        )}

        {foodResults.length > 0 && !selectedFood && (
          <div className="food-results">
            <h3>
              {selectedCategory 
                ? `${foodCategories.find(c => c.id === selectedCategory)?.label || selectedCategory} (${foodResults.length} st)`
                : `Sökresultat (${foodResults.length} st)`
              }
            </h3>
            <div className="results-list" aria-live="polite">
              {foodResults.map((food, idx) => (
                <div 
                  key={food.code || idx} 
                  className="food-result-item"
                  onClick={() => setSelectedFood(food)}
                >
                  {food.image_small_url && (
                    <img src={food.image_small_url} alt="" className="food-thumb" />
                  )}
                  <div className="food-info">
                    <span className="food-name">{food.product_name}</span>
                    {food.brands && <span className="food-brand">{food.brands}</span>}
                    {food.nutriments?.['energy-kcal_100g'] && (
                      <span className="food-kcal">
                        {Math.round(food.nutriments['energy-kcal_100g'])} kcal/100g
                      </span>
                    )}
                  </div>
                  <span className="item-arrow">"º</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedFood && (
          <div className="food-detail-card">
            <div className="food-detail-header">
              <h3>{selectedFood.product_name}</h3>
              <button 
                className={`favorite-btn ${isFavorite(selectedFood.code) ? 'active' : ''}`}
                onClick={() => toggleFavorite(selectedFood)}
                title={isFavorite(selectedFood.code) ? 'Ta bort från favoriter' : 'Lägg till i favoriter'}
              >
                {isFavorite(selectedFood.code) ? '★' : '☆'}
              </button>
            </div>
            {selectedFood.brands && <p className="detail-brand">{selectedFood.brands}</p>}
            
            <div className="nutrition-grid">
              <div className="nutrition-item">
                <span className="nutrition-value">
                  {Math.round(selectedFood.nutriments?.['energy-kcal_100g'] || 0)}
                </span>
                <span className="nutrition-label">kcal/100g</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">
                  {Math.round((selectedFood.nutriments?.proteins_100g || 0) * 10) / 10}g
                </span>
                <span className="nutrition-label">Protein</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">
                  {Math.round((selectedFood.nutriments?.carbohydrates_100g || 0) * 10) / 10}g
                </span>
                <span className="nutrition-label">Kolhydrater</span>
              </div>
              <div className="nutrition-item">
                <span className="nutrition-value">
                  {Math.round((selectedFood.nutriments?.fat_100g || 0) * 10) / 10}g
                </span>
                <span className="nutrition-label">Fett</span>
              </div>
            </div>

            <div className="portion-selector">
              <label>Portionsstorlek (gram):</label>
              <input
                type="number"
                value={portionSize}
                onChange={(e) => setPortionSize(parseInt(e.target.value) || 0)}
                min="1"
              />
            </div>

            <div className="portion-preview">
              <span>= {Math.round((selectedFood.nutriments?.['energy-kcal_100g'] || 0) * portionSize / 100)} kcal</span>
            </div>

            <div className="detail-actions">
              <button className="add-btn" onClick={() => addToMeal(selectedFood)}>
                + Lägg till i måltid
              </button>
              <button className="cancel-btn" onClick={() => setSelectedFood(null)}>
                Avbryt
              </button>
            </div>
          </div>
        )}

        {mealList.length > 0 && (
          <div className="meal-summary">
            <h3>Din måltid</h3>
            <div className="meal-items" aria-live="polite">
              {mealList.map((item) => (
                <div key={item.id} className="meal-item">
                  <div className="meal-item-info">
                    <span className="meal-item-name">{item.name}</span>
                    <span className="meal-item-portion">{item.portion}g</span>
                  </div>
                  <div className="meal-item-stats">
                    <span>{item.calories} kcal</span>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromMeal(item.id)}
                    >×</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="meal-totals">
              <div className="total-row main">
                <span>Totalt</span>
                <span className="total-calories">{totals.calories} kcal</span>
              </div>
              <div className="total-row">
                <span>Protein</span>
                <span>{totals.protein}g</span>
              </div>
              <div className="total-row">
                <span>Kolhydrater</span>
                <span>{totals.carbs}g</span>
              </div>
              <div className="total-row">
                <span>Fett</span>
                <span>{totals.fat}g</span>
              </div>
              {totals.fiber > 0 && (
                <div className="total-row">
                  <span>Fiber</span>
                  <span>{totals.fiber}g</span>
                </div>
              )}
            </div>

            <button 
              className="clear-meal-btn"
              onClick={() => setMealList([])}
            >
              Rensa måltid
            </button>
          </div>
        )}

        {!isSearching && (foodSearch || selectedCategory) && foodResults.length === 0 && (
          <div className="no-results">
            <p>Inga resultat hittades{foodSearch ? ` för "${foodSearch}"` : ''}{selectedCategory ? ` i kategorin ${foodCategories.find(c => c.id === selectedCategory)?.label}` : ''}</p>
            <p className="hint">Tips: Prova att välja en annan kategori eller ändra sökordet</p>
          </div>
        )}
      </div>
    );
  };

  const renderListView = (data, title) => {
    const categories = Object.keys(data);
    
    const filterItems = (items) => {
      if (!searchTerm) return items;
      return items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    };

    const totalFiltered = categories.reduce((sum, cat) => sum + filterItems(data[cat]).length, 0);

    if (selectedItem) {
      return (
        <div className="detail-view">
          <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setSelectedItem(null)}>
            ← Tillbaka
          </button>
          <h2>{selectedItem.name}</h2>
          <div className="detail-emoji">{selectedItem.image}</div>
          
          {activeView === 'temperatures' && (
            <div className="temp-details">
              <div className="temp-grid">
                {selectedItem.rare && (
                  <div className="temp-item rare">
                    <span className="temp-label">Rare/Blodig</span>
                    <span className="temp-value">{selectedItem.rare}°C</span>
                  </div>
                )}
                {selectedItem.medium && (
                  <div className="temp-item medium">
                    <span className="temp-label">Medium</span>
                    <span className="temp-value">{selectedItem.medium}°C</span>
                  </div>
                )}
                {selectedItem.wellDone && (
                  <div className="temp-item well-done">
                    <span className="temp-label">Genomstekt</span>
                    <span className="temp-value">{selectedItem.wellDone}°C</span>
                  </div>
                )}
              </div>
              {selectedItem.tips && (
                <div className="tips-box">
                  <h3>Tillagningstips:</h3>
                  <p>{selectedItem.tips}</p>
                </div>
              )}
              <div className="info-box">
                <p>💡 Temperaturen stiger 2-5°C efter att köttet tas från värmen. Ta ut det lite tidigare!</p>
              </div>
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
          ← Tillbaka
        </button>
        <h1>{title}</h1>
        
        <div className="search-box">
          <input
            type="text"
            aria-label="Sök" placeholder="Sök..."
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
                    <span className="item-arrow">"º</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderConversion = () => (
    <div className="conversion-view">
      <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
        ← Tillbaka
      </button>
      <h1>Måttomvandling</h1>
      
      <div className="conversion-tabs">
        <button 
          className={conversionType === 'weight' ? 'active' : ''}
          onClick={() => {
            setConversionType('weight');
            setFromUnit('kg');
            setToUnit('g');
          }}
        >
          Vikt - Vikt
        </button>
        <button 
          className={conversionType === 'volume' ? 'active' : ''}
          onClick={() => {
            setConversionType('volume');
            setFromUnit('dl');
            setToUnit('ml');
          }}
        >
          Volym - Volym
        </button>
      </div>

      <label className="foreign-toggle">
        <input
          type="checkbox"
          checked={showForeign}
          onChange={(e) => setShowForeign(e.target.checked)}
        />
        <span>Visa även utländska enheter</span>
      </label>

      <div className="converter-box">
        <div className="converter-row">
          <input
            type="number"
            value={fromValue}
            onChange={(e) => setFromValue(e.target.value)}
            className="value-input"
          />
          
          <div className="unit-selector">
            {(conversionType === 'weight' ? getWeightUnits() : getVolumeUnits()).map(unit => (
              <button
                key={unit}
                className={fromUnit === unit ? 'active' : ''}
                onClick={() => setFromUnit(unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>

        <div className="converter-arrow">←“ till ←“</div>

        <div className="converter-row">
          <div className="unit-selector">
            {(conversionType === 'weight' ? getWeightUnits() : getVolumeUnits()).map(unit => (
              <button
                key={unit}
                className={toUnit === unit ? 'active' : ''}
                onClick={() => setToUnit(unit)}
              >
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

      <div className="common-conversions">
        <h3>Vikt per dl (ungefärligt)</h3>
        <div className="conversion-list">
          {Object.entries(conversionData.weightToVolume).map(([ingredient, data]) => (
            <div key={ingredient} className="conversion-item">
              <span className="ingredient-name">{ingredient}</span>
              <span className="ingredient-value">{data.gPerDl} g/dl</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
            <h3>Gör så här</h3>
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
              {basicRecipesData[category].map((recipe, idx) => (
                <div 
                  key={idx} 
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

  const renderCreate = () => {
    // Enheter för volym (ml per enhet)
    const volumeUnits = {
      'g': { label: 'gram', mlPer: null },
      'dl': { label: 'dl', mlPer: 100 },
      'msk': { label: 'msk', mlPer: 15 },
      'tsk': { label: 'tsk', mlPer: 5 },
      'krm': { label: 'krm', mlPer: 1 },
      'st': { label: 'st', mlPer: null },
    };
    
    // Ungefärlig vikt per dl för olika livsmedelstyper
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
      return 100; // default
    };
    
    // Konvertera mängd till gram
    const convertToGrams = (amount, unit, foodName) => {
      if (unit === 'g') return amount;
      if (unit === 'st') return amount * 50; // uppskattning
      
      const mlPer = volumeUnits[unit]?.mlPer || 100;
      const totalMl = amount * mlPer;
      const gramsPerDl = getGramsPerDl(foodName);
      return Math.round(totalMl * gramsPerDl / 100);
    };
    
    // Sök ingrediens i databasen
    // Synonymer för vanliga söktermer - mappar till hur det står i databasen
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
      'tomat': ['tomat'],
    };
    
    const searchIngredient = (query) => {
      setIngredientSearch(query);
      if (query.length < 2) {
        setIngredientResults([]);
        return;
      }
      const queryLower = query.toLowerCase().trim();
      
      // Bygg upp söktermer inklusive synonymer
      let searchTerms = [queryLower];
      
      // Kolla exakt match först, sedan delvis match
      Object.entries(synonyms).forEach(([key, values]) => {
        if (queryLower === key || queryLower.includes(key)) {
          searchTerms = [...searchTerms, ...values];
        }
      });
      
      const results = localFoodDatabase
        .filter(food => {
          const name = food.product_name.toLowerCase();
          return searchTerms.some(term => name.includes(term));
        })
        .sort((a, b) => {
          const aName = a.product_name.toLowerCase();
          const bName = b.product_name.toLowerCase();
          
          // Prioritera råvaror (Kött, Mejeri, etc) över Rätter
          const aIsRaw = a.brands !== 'Rätter';
          const bIsRaw = b.brands !== 'Rätter';
          if (aIsRaw && !bIsRaw) return -1;
          if (!aIsRaw && bIsRaw) return 1;
          
          // Prioritera "rå" produkter (råvaror)
          const aIsRaa = aName.includes(' rå');
          const bIsRaa = bName.includes(' rå');
          if (aIsRaa && !bIsRaa) return -1;
          if (!aIsRaa && bIsRaa) return 1;
          
          // Kortare namn först (mer specifikt)
          return aName.length - bName.length;
        })
        .slice(0, 15);
      setIngredientResults(results);
    };
    
    const selectIngredient = (food) => {
      setSelectedIngredientFood({
        ...food,
        name: food.product_name,
        kcal: food.nutriments?.['energy-kcal_100g'] || 0
      });
      setIngredientSearch('');
      setIngredientResults([]);
      setIngredientAmount(100);
      setIngredientUnit('g');
    };
    
    const getCalculatedKcal = () => {
      if (!selectedIngredientFood) return 0;
      const grams = convertToGrams(ingredientAmount, ingredientUnit, selectedIngredientFood.name);
      return Math.round(selectedIngredientFood.kcal * grams / 100);
    };
    
    const addIngredientWithCalories = () => {
      if (selectedIngredientFood && ingredientAmount > 0) {
        const grams = convertToGrams(ingredientAmount, ingredientUnit, selectedIngredientFood.name);
        const totalKcal = Math.round(selectedIngredientFood.kcal * grams / 100);
        
        const newIng = {
          id: Date.now(),
          name: selectedIngredientFood.name,
          amount: ingredientAmount,
          unit: ingredientUnit,
          grams: grams,
          kcalPer100: selectedIngredientFood.kcal,
          totalKcal: totalKcal
        };
        
        setNewRecipe({
          ...newRecipe,
          ingredients: [...newRecipe.ingredients, newIng]
        });
        setSelectedIngredientFood(null);
        setIngredientAmount(100);
        setIngredientUnit('g');
      }
    };
    
    const addStep = () => {
      if (newStep.trim()) {
        setNewRecipe({
          ...newRecipe,
          steps: [...newRecipe.steps, newStep.trim()]
        });
        setNewStep('');
      }
    };
    
    const removeIngredient = (id) => {
      setNewRecipe({
        ...newRecipe,
        ingredients: newRecipe.ingredients.filter(ing => ing.id !== id)
      });
    };
    
    const removeStep = (idx) => {
      setNewRecipe({
        ...newRecipe,
        steps: newRecipe.steps.filter((_, i) => i !== idx)
      });
    };
    
    const getTotalCalories = () => {
      return newRecipe.ingredients.reduce((sum, ing) => sum + (ing.totalKcal || 0), 0);
    };
    
    const getCaloriesPerPortion = () => {
      const portions = parseInt(newRecipe.portions) || 1;
      return Math.round(getTotalCalories() / portions);
    };
    
    const saveRecipe = () => {
      if (newRecipe.name && newRecipe.ingredients.length > 0) {
        const recipeToSave = {
          ...newRecipe,
          id: editingRecipeId || Date.now(),
          totalKcal: getTotalCalories(),
          kcalPerPortion: getCaloriesPerPortion()
        };
        
        if (editingRecipeId) {
          // Uppdatera befintligt recept
          setSavedRecipes(savedRecipes.map(r => r.id === editingRecipeId ? recipeToSave : r));
          setEditingRecipeId(null);
        } else {
          // Spara nytt recept
          setSavedRecipes([...savedRecipes, recipeToSave]);
        }
        setNewRecipe({ name: '', portions: '4', ingredients: [], steps: [] });
      }
    };
    
    const cancelEdit = () => {
      setEditingRecipeId(null);
      setNewRecipe({ name: '', portions: '4', ingredients: [], steps: [] });
    };
    
    const deleteRecipe = (id) => {
      setSavedRecipes(savedRecipes.filter(r => r.id !== id));
    };
    
    const printRecipe = (recipe) => {
      const printWindow = window.open('', '_blank');
      const html = `
        <!DOCTYPE html>
        <html lang="sv">
        <head>
          <meta charset="UTF-8">
          <title>${recipe.name} - Köksguiden</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Source+Sans+3:wght@400;500;600&display=swap');
            
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body {
              font-family: 'Source Sans 3', Georgia, serif;
              max-width: 700px;
              margin: 0 auto;
              padding: 2rem;
              color: #2d2a26;
              line-height: 1.6;
            }
            
            .header {
              text-align: center;
              border-bottom: 2px solid #8b4c70;
              padding-bottom: 1.5rem;
              margin-bottom: 2rem;
            }
            
            h1 {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 2.5rem;
              color: #6b3a55;
              margin-bottom: 0.5rem;
            }
            
            .meta {
              display: flex;
              justify-content: center;
              gap: 2rem;
              color: #7a706f;
              font-size: 1rem;
            }
            
            .meta span {
              display: flex;
              align-items: center;
              gap: 0.25rem;
            }
            
            .section {
              margin-bottom: 2rem;
            }
            
            h2 {
              font-family: 'Playfair Display', Georgia, serif;
              font-size: 1.25rem;
              color: #6b3a55;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid #e8e0e5;
            }
            
            .ingredients-list {
              list-style: none;
            }
            
            .ingredients-list li {
              padding: 0.5rem 0;
              border-bottom: 1px dotted #e8e0e5;
              display: flex;
              justify-content: space-between;
            }
            
            .ingredients-list li:last-child {
              border-bottom: none;
            }
            
            .ing-name { font-weight: 500; }
            .ing-amount { color: #7a706f; }
            
            .steps-list {
              list-style: none;
              counter-reset: step;
            }
            
            .steps-list li {
              counter-increment: step;
              padding: 0.75rem 0;
              padding-left: 2.5rem;
              position: relative;
            }
            
            .steps-list li::before {
              content: counter(step);
              position: absolute;
              left: 0;
              width: 1.75rem;
              height: 1.75rem;
              background: #8b4c70;
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.875rem;
              font-weight: 600;
            }
            
            .nutrition-box {
              background: #faf5f8;
              border-radius: 8px;
              padding: 1rem 1.5rem;
              display: flex;
              justify-content: space-around;
              text-align: center;
            }
            
            .nutrition-item strong {
              display: block;
              font-size: 1.25rem;
              color: #6b3a55;
            }
            
            .nutrition-item span {
              font-size: 0.85rem;
              color: #7a706f;
            }
            
            .footer {
              margin-top: 3rem;
              padding-top: 1rem;
              border-top: 1px solid #e8e0e5;
              text-align: center;
              color: #c4b0bc;
              font-size: 0.85rem;
            }
            
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${recipe.name}</h1>
            <div class="meta">
              <span>🍽️ ${recipe.portions} portioner</span>
              <span>🔥 ${recipe.kcalPerPortion} kcal/portion</span>
            </div>
          </div>
          
          <div class="section">
            <h2>Ingredienser</h2>
            <ul class="ingredients-list">
              ${recipe.ingredients.map(ing => `
                <li>
                  <span class="ing-name">${ing.name}</span>
                  <span class="ing-amount">${ing.unit === 'g' ? ing.amount + ' g' : ing.amount + ' ' + ing.unit}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          
          ${recipe.steps && recipe.steps.length > 0 ? `
            <div class="section">
              <h2>Instruktioner</h2>
              <ol class="steps-list">
                ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
              </ol>
            </div>
          ` : ''}
          
          <div class="section">
            <h2>Näringsvärde</h2>
            <div class="nutrition-box">
              <div class="nutrition-item">
                <strong>${recipe.totalKcal}</strong>
                <span>kcal totalt</span>
              </div>
              <div class="nutrition-item">
                <strong>${recipe.kcalPerPortion}</strong>
                <span>kcal/portion</span>
              </div>
              <div class="nutrition-item">
                <strong>${recipe.ingredients.length}</strong>
                <span>ingredienser</span>
              </div>
            </div>
          </div>
          
          <div class="footer">
            Recept från Köksguiden • Data från Livsmedelsverket
          </div>
          
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;
      printWindow.document.write(html);
      printWindow.document.close();
    };
    
    const formatAmount = (ing) => {
      if (ing.unit === 'g') return `${ing.amount} g`;
      return `${ing.amount} ${ing.unit} (${ing.grams} g)`;
    };
    
    return (
      <div className="create-view">
        <button className="back-btn" aria-label="Gå tillbaka" onClick={() => setActiveView('home')}>
          ← Tillbaka
        </button>
        <h1>{editingRecipeId ? 'Redigera recept' : 'Skapa recept'}</h1>
        
        {editingRecipeId && (
          <button className="cancel-edit-btn" onClick={cancelEdit}>
            ← Avbryt redigering
          </button>
        )}
        
        <div className="create-form">
          <div className="form-row-2">
            <div className="form-group">
              <label>Receptnamn</label>
              <input
                type="text"
                value={newRecipe.name}
                onChange={(e) => setNewRecipe({...newRecipe, name: e.target.value})}
                placeholder="T.ex. Köttbullar"
              />
            </div>
            
            <div className="form-group small">
              <label>Portioner</label>
              <input
                type="number"
                value={newRecipe.portions}
                onChange={(e) => setNewRecipe({...newRecipe, portions: e.target.value})}
                min="1"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Lägg till ingrediens</label>
            {!selectedIngredientFood ? (
              <div className="ingredient-search-box">
                <input
                  type="text"
                  value={ingredientSearch}
                  onChange={(e) => searchIngredient(e.target.value)}
                  placeholder="Sök livsmedel..."
                />
                {ingredientResults.length > 0 && (
                  <div className="ingredient-dropdown">
                    {ingredientResults.map((food) => (
                      <div 
                        key={food.code} 
                        className="ingredient-option"
                        onClick={() => selectIngredient(food)}
                      >
                        <div className="option-info">
                          <span className="option-name">{food.product_name}</span>
                          <span className="option-category">{food.brands}</span>
                        </div>
                        <span className="option-kcal">{Math.round(food.nutriments?.['energy-kcal_100g'] || 0)} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="selected-ingredient-box">
                <div className="selected-info">
                  <span className="selected-name">{selectedIngredientFood.name}</span>
                  <span className="selected-kcal">{Math.round(selectedIngredientFood.kcal)} kcal/100g</span>
                </div>
                <div className="amount-row">
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
                    <option value="g">gram</option>
                    <option value="dl">dl</option>
                    <option value="msk">msk</option>
                    <option value="tsk">tsk</option>
                    <option value="krm">krm</option>
                    <option value="st">st</option>
                  </select>
                  <span className="amount-kcal">= {getCalculatedKcal()} kcal</span>
                </div>
                <div className="selected-actions">
                  <button onClick={addIngredientWithCalories} className="add-ingredient-btn">Lägg till</button>
                  <button onClick={() => setSelectedIngredientFood(null)} className="cancel-ingredient-btn">Avbryt</button>
                </div>
              </div>
            )}
          </div>
          
          {newRecipe.ingredients.length > 0 && (
            <div className="ingredients-list-box">
              <div className="ingredients-header">
                <span>Ingredienser</span>
                <span>Kalorier</span>
              </div>
              {newRecipe.ingredients.map((ing) => (
                <div key={ing.id} className="ingredient-row">
                  <div className="ingredient-info">
                    <span className="ing-name">{ing.name}</span>
                    <span className="ing-amount">{formatAmount(ing)}</span>
                  </div>
                  <div className="ingredient-kcal">
                    <span>{ing.totalKcal} kcal</span>
                    <button onClick={() => removeIngredient(ing.id)} className="remove-item">×</button>
                  </div>
                </div>
              ))}
              <div className="calories-summary">
                <div className="calories-row total">
                  <span>Totalt</span>
                  <span className="total-kcal">{getTotalCalories()} kcal</span>
                </div>
                {parseInt(newRecipe.portions) > 1 && (
                  <div className="calories-row per-portion">
                    <span>Per portion ({newRecipe.portions} st)</span>
                    <span>{getCaloriesPerPortion()} kcal</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Instruktioner (valfritt)</label>
            <div className="add-row">
              <input
                type="text"
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="T.ex. Blanda alla ingredienser..."
                onKeyDown={(e) => e.key === 'Enter' && addStep()}
              />
              <button onClick={addStep} className="add-btn-small">+</button>
            </div>
            {newRecipe.steps.length > 0 && (
              <ol className="editable-list numbered">
                {newRecipe.steps.map((step, idx) => (
                  <li key={idx}>
                    {step}
                    <button onClick={() => removeStep(idx)} className="remove-item">×</button>
                  </li>
                ))}
              </ol>
            )}
          </div>
          
          <button 
            onClick={saveRecipe} 
            className="save-recipe-btn"
            disabled={!newRecipe.name || newRecipe.ingredients.length === 0}
          >
            {editingRecipeId ? 'Uppdatera recept' : 'Spara recept'}
          </button>
        </div>
        
        {savedRecipes.length > 0 && (
          <div className="saved-recipes">
            <h2>Sparade recept</h2>
            <div className="saved-recipes-list">
              {savedRecipes.map(recipe => (
                <div key={recipe.id} className={`saved-recipe-card ${expandedRecipeId === recipe.id ? 'expanded' : ''}`}>
                  <div 
                    className="saved-recipe-header"
                    onClick={() => setExpandedRecipeId(expandedRecipeId === recipe.id ? null : recipe.id)}
                  >
                    <div className="saved-recipe-info">
                      <span className="saved-recipe-name">{recipe.name}</span>
                      <span className="saved-recipe-meta">
                        {recipe.portions} port • {recipe.kcalPerPortion} kcal/port
                      </span>
                    </div>
                    <span className="expand-arrow">{expandedRecipeId === recipe.id ? '▼' : '▶'}</span>
                  </div>
                  
                  {expandedRecipeId === recipe.id && (
                    <div className="saved-recipe-details">
                      {/* Portionsskalning */}
                      <div className="portion-scaler">
                        <label>Portioner:</label>
                        <div className="portion-controls">
                          <button 
                            className="portion-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = getScaledPortions(recipe.id, recipe.portions);
                              if (current > 1) {
                                setScaledPortions({...scaledPortions, [recipe.id]: current - 1});
                              }
                            }}
                          >−</button>
                          <span className="portion-value">{getScaledPortions(recipe.id, recipe.portions)}</span>
                          <button 
                            className="portion-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              const current = getScaledPortions(recipe.id, recipe.portions);
                              setScaledPortions({...scaledPortions, [recipe.id]: current + 1});
                            }}
                          >+</button>
                        </div>
                        {getScaledPortions(recipe.id, recipe.portions) !== parseInt(recipe.portions) && (
                          <button 
                            className="reset-portions"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newScaled = {...scaledPortions};
                              delete newScaled[recipe.id];
                              setScaledPortions(newScaled);
                            }}
                          >
                            Återställ
                          </button>
                        )}
                      </div>

                      <div className="recipe-section">
                        <h4>Ingredienser</h4>
                        <ul className="recipe-ingredients">
                          {recipe.ingredients.map((ing, idx) => {
                            const scaled = scaleIngredient(
                              ing.amount, 
                              recipe.portions, 
                              getScaledPortions(recipe.id, recipe.portions)
                            );
                            const isScaled = getScaledPortions(recipe.id, recipe.portions) !== parseInt(recipe.portions);
                            return (
                              <li key={idx}>
                                <span className="ing-name">{ing.name}</span>
                                <span className={`ing-amount ${isScaled ? 'scaled' : ''}`}>
                                  {scaled} {ing.unit}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      
                      {recipe.steps && recipe.steps.length > 0 && (
                        <div className="recipe-section">
                          <h4>Instruktioner</h4>
                          <ol className="recipe-steps">
                            {recipe.steps.map((step, idx) => (
                              <li key={idx}>{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                      
                      <div className="recipe-nutrition">
                        <span>
                          <strong>
                            {Math.round(recipe.totalKcal * getScaledPortions(recipe.id, recipe.portions) / parseInt(recipe.portions))}
                          </strong> kcal totalt
                        </span>
                        <span><strong>{recipe.kcalPerPortion}</strong> kcal/portion</span>
                      </div>
                      
                      <div className="saved-recipe-actions">
                        <button onClick={() => {
                          setEditingRecipeId(recipe.id);
                          setNewRecipe({
                            name: recipe.name,
                            portions: recipe.portions,
                            ingredients: [...recipe.ingredients],
                            steps: [...(recipe.steps || [])]
                          });
                          setExpandedRecipeId(null);
                        }} className="action-btn edit">
                          ✏️ Redigera
                        </button>
                        <button onClick={() => printRecipe({
                          ...recipe,
                          portions: getScaledPortions(recipe.id, recipe.portions),
                          ingredients: recipe.ingredients.map(ing => ({
                            ...ing,
                            amount: scaleIngredient(ing.amount, recipe.portions, getScaledPortions(recipe.id, recipe.portions))
                          })),
                          totalKcal: Math.round(recipe.totalKcal * getScaledPortions(recipe.id, recipe.portions) / parseInt(recipe.portions)),
                          kcalPerPortion: recipe.kcalPerPortion
                        })} className="action-btn print">
                          🖨️ Skriv ut
                        </button>
                        <button onClick={() => deleteRecipe(recipe.id)} className="action-btn delete">
                          🗑️ Ta bort
                        </button>
                      </div>
                    </div>
                  )}
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
          border-color: rgba(139, 76, 112, 0.2);
        }

        .menu-card:active {
          transform: scale(0.99);
        }

        .menu-card:focus {
          outline: 2px solid #8b4c70;
          outline-offset: 2px;
        }

        .menu-card:focus:not(:focus-visible) {
          outline: none;
        }

        .menu-card h2 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: #2d2a26;
          margin-bottom: 0.35rem;
          font-weight: 600;
        }

        .menu-card p {
          font-size: 0.9rem;
          color: #7a706f;
          line-height: 1.4;
          margin: 0;
        }

        .menu-arrow {
          position: absolute;
          right: 1.25rem;
          top: 50%;
          transform: translateY(-50%);
          color: #c4b0bc;
          font-size: 1.25rem;
          transition: transform 0.2s ease;
        }

        .menu-card:hover .menu-arrow {
          transform: translateY(-50%) translateX(3px);
          color: #8b4c70;
        }

        .back-btn {
          background: none;
          border: none;
          color: #8b4c70;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 0;
          margin-bottom: 1rem;
        }

        .back-btn:hover {
          color: #6b3a55;
        }

        .list-view h1,
        .conversion-view h1,
        .calories-view h1,
        .detail-view h2 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .api-credit {
          font-size: 0.85rem;
          color: #8b4c70;
          margin-bottom: 1rem;
        }

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
          background: white;
          transition: border-color 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .category-chip {
          padding: 0.4rem 0.75rem;
          border: 1.5px solid #e8e0e5;
          background: white;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
          color: #6b3a55;
        }

        .category-chip:hover {
          border-color: #8b4c70;
          background: #faf5f8;
        }

        .category-chip.active {
          background: #8b4c70;
          border-color: #8b4c70;
          color: white;
        }

        .clear-search {
          position: absolute;
          right: 12px;
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

        .searching-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          color: #8b4c70;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e8e0e5;
          border-top-color: #8b4c70;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .food-results h3,
        .meal-summary h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .results-list {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .food-result-item {
          display: flex;
          align-items: center;
          padding: 0.875rem 1rem;
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #f5f0f3;
          gap: 0.75rem;
        }

        .food-result-item:last-child {
          border-bottom: none;
        }

        .food-result-item:hover {
          background: #faf5f8;
        }

        .food-thumb {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 8px;
          flex-shrink: 0;
        }

        .food-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .food-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .food-brand {
          font-size: 0.75rem;
          color: white;
          background: #c4b0bc;
          padding: 0.15rem 0.5rem;
          border-radius: 10px;
          display: inline-block;
        }

        .food-kcal {
          font-size: 0.8rem;
          color: #8b4c70;
          font-weight: 600;
        }

        .food-detail-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          margin-bottom: 1.5rem;
        }

        .food-detail-card h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          margin-bottom: 0.25rem;
        }

        .detail-brand {
          color: #7a706f;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .nutrition-item {
          background: linear-gradient(135deg, #faf5f8 0%, #f5eef2 100%);
          border-radius: 10px;
          padding: 0.75rem 0.5rem;
          text-align: center;
        }

        .nutrition-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
          color: #6b3a55;
        }

        .nutrition-label {
          display: block;
          font-size: 0.7rem;
          color: #8b4c70;
          margin-top: 0.125rem;
        }

        .portion-selector {
          margin-bottom: 0.75rem;
        }

        .portion-selector label {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          color: #4a4541;
        }

        .portion-selector input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e8e0e5;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
        }

        .portion-selector input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .portion-preview {
          text-align: center;
          font-size: 1.25rem;
          font-weight: 600;
          color: #6b3a55;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: #fff9e6;
          border-radius: 8px;
        }

        .detail-actions {
          display: flex;
          gap: 0.75rem;
        }

        .add-btn {
          flex: 1;
          padding: 0.875rem;
          background: linear-gradient(135deg, #8b4c70 0%, #6b3a55 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          font-family: inherit;
        }

        .add-btn:hover {
          opacity: 0.9;
        }

        .cancel-btn {
          padding: 0.875rem 1.25rem;
          background: #e8e0e5;
          color: #6b3a55;
          border: none;
          border-radius: 10px;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
        }

        .meal-summary {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          margin-top: 1.5rem;
        }

        .meal-items {
          margin-bottom: 1rem;
        }

        .meal-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f5f0f3;
        }

        .meal-item:last-child {
          border-bottom: none;
        }

        .meal-item-info {
          display: flex;
          flex-direction: column;
        }

        .meal-item-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .meal-item-portion {
          font-size: 0.8rem;
          color: #7a706f;
        }

        .meal-item-stats {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .meal-item-stats span {
          font-weight: 600;
          color: #6b3a55;
        }

        .remove-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .meal-totals {
          background: linear-gradient(135deg, #faf5f8 0%, #f5eef2 100%);
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 0.375rem 0;
          font-size: 0.9rem;
        }

        .total-row.main {
          font-size: 1.1rem;
          font-weight: 600;
          padding-bottom: 0.75rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid rgba(139, 76, 112, 0.2);
        }

        .total-calories {
          color: #6b3a55;
        }

        .clear-meal-btn {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 2px solid #e8e0e5;
          border-radius: 10px;
          color: #7a706f;
          font-weight: 500;
          cursor: pointer;
          font-family: inherit;
        }

        .clear-meal-btn:hover {
          border-color: #dc2626;
          color: #dc2626;
        }

        .no-results {
          text-align: center;
          padding: 2rem 1rem;
          color: #7a706f;
        }

        .no-results .hint {
          font-size: 0.875rem;
          margin-top: 0.5rem;
          color: #8b4c70;
        }

        .search-results-count {
          font-size: 0.875rem;
          color: #8b4c70;
          margin-bottom: 1rem;
        }

        .category-section {
          margin-bottom: 1.5rem;
        }

        .category-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          color: #2d2a26;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e8e0e5;
          margin-bottom: 0.5rem;
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
          cursor: pointer;
          transition: background 0.15s;
          border-bottom: 1px solid #f5f0f3;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-row:hover {
          background: #faf5f8;
        }

        .item-emoji {
          font-size: 1.5rem;
          width: 40px;
          flex-shrink: 0;
        }

        .item-name {
          flex: 1;
          font-weight: 500;
        }

        .item-arrow {
          color: #c4b0bc;
          font-size: 1.5rem;
        }

        .detail-view {
          animation: slideIn 0.2s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .detail-emoji {
          font-size: 4rem;
          text-align: center;
          margin: 1.5rem 0;
        }

        .temp-grid {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .temp-item {
          background: white;
          border-radius: 12px;
          padding: 1rem 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .temp-label {
          font-weight: 500;
        }

        .temp-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #6b3a55;
        }

        .temp-item.rare {
          border-left: 4px solid #e57373;
        }

        .temp-item.medium {
          border-left: 4px solid #ffb74d;
        }

        .temp-item.well-done {
          border-left: 4px solid #8d6e63;
        }

        .tips-box {
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
        }

        .tips-box h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1rem;
          margin-bottom: 0.5rem;
        }

        .tips-box p {
          line-height: 1.6;
          color: #4a4541;
        }

        .info-box {
          background: #fff9e6;
          border-radius: 12px;
          padding: 1rem;
          border-left: 4px solid #ffc107;
        }

        .info-box p {
          font-size: 0.9rem;
          color: #5d4e00;
        }

        .oven-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .oven-setting {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .setting-label {
          font-size: 0.875rem;
          color: #8b4c70;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.25rem;
        }

        .setting-value {
          font-size: 1.5rem;
          font-weight: 600;
          color: #6b3a55;
        }

        .setting-note {
          font-size: 0.875rem;
          color: #7a706f;
          margin-top: 0.25rem;
        }

        .oven-setting.time {
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
        }

        .substitute-details {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .substitute-label {
          font-size: 0.875rem;
          color: #8b4c70;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }

        .substitute-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .substitute-tag {
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 500;
          color: #6b3a55;
        }

        .conversion-tabs {
          display: flex;
          background: #e8e0e5;
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1rem;
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
        }

        .result-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #6b3a55;
        }

        .result-equals {
          color: #c4b0bc;
        }

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

        /* Grundrecept styles */
        .recipe-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          background: linear-gradient(135deg, #f5eef2 0%, #faf5f8 100%);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          color: #6b3a55;
          font-weight: 500;
        }

        .recipe-description {
          color: #5a524f;
          font-style: italic;
          line-height: 1.5;
          margin-bottom: 1.5rem;
          padding: 0 0.25rem;
        }

        .recipe-section {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .recipe-section h3 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1.1rem;
          margin-bottom: 0.75rem;
        }

        .ingredient-list {
          list-style: none;
          padding: 0;
        }

        .ingredient-list li {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f5f0f3;
        }

        .ingredient-list li:last-child {
          border-bottom: none;
        }

        .steps-list {
          padding-left: 1.25rem;
          margin: 0;
        }

        .steps-list li {
          padding: 0.5rem 0;
          line-height: 1.5;
        }

        .item-meta {
          color: #8b4c70;
          font-size: 0.85rem;
          margin-right: 0.5rem;
        }

        /* Skapa recept styles */
        .create-view {
          animation: slideIn 0.2s ease;
        }

        .create-form {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #2d2a26;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e8e0e5;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .add-row {
          display: flex;
          gap: 0.5rem;
        }

        .add-row input {
          flex: 1;
        }

        .add-btn-small {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #8b4c70 0%, #6b3a55 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1.5rem;
          cursor: pointer;
          flex-shrink: 0;
        }

        .add-btn-small:hover {
          opacity: 0.9;
        }

        .editable-list {
          list-style: none;
          padding: 0;
          margin-top: 0.75rem;
        }

        .editable-list.numbered {
          list-style: decimal;
          padding-left: 1.25rem;
        }

        .editable-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #faf5f8;
          border-radius: 8px;
          margin-bottom: 0.5rem;
        }

        .editable-list.numbered li {
          display: list-item;
          position: relative;
          padding-right: 2.5rem;
        }

        .remove-item {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: #fee2e2;
          color: #dc2626;
          cursor: pointer;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .editable-list.numbered .remove-item {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
        }

        .save-recipe-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #8b4c70 0%, #6b3a55 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }

        .save-recipe-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .save-recipe-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Ingredienssökning och kaloriräkning */
        .form-row-2 {
          display: flex;
          gap: 1rem;
        }

        .form-row-2 .form-group {
          flex: 1;
        }

        .form-row-2 .form-group.small {
          flex: 0 0 100px;
        }

        .ingredient-search-box {
          position: relative;
        }

        .ingredient-search-box input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e8e0e5;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
        }

        .ingredient-search-box input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .ingredient-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e8e0e5;
          border-top: none;
          border-radius: 0 0 10px 10px;
          max-height: 250px;
          overflow-y: auto;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .ingredient-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid #f5f0f3;
        }

        .ingredient-option:last-child {
          border-bottom: none;
        }

        .ingredient-option:hover {
          background: #faf5f8;
        }

        .option-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .option-name {
          font-weight: 500;
          font-size: 0.95rem;
        }

        .option-category {
          font-size: 0.75rem;
          color: #8b4c70;
        }

        .option-kcal {
          color: #6b3a55;
          font-size: 0.85rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .selected-ingredient-box {
          background: #faf5f8;
          border-radius: 12px;
          padding: 1rem;
        }

        .selected-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .selected-name {
          font-weight: 600;
          color: #2d2a26;
        }

        .selected-kcal {
          color: #8b4c70;
          font-size: 0.9rem;
        }

        .amount-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .amount-input {
          width: 70px;
          padding: 0.5rem;
          border: 2px solid #e8e0e5;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          text-align: center;
        }

        .amount-input:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .unit-select {
          padding: 0.5rem 0.75rem;
          border: 2px solid #e8e0e5;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          background: white;
          cursor: pointer;
        }

        .unit-select:focus {
          outline: none;
          border-color: #8b4c70;
        }

        .amount-unit {
          color: #7a706f;
        }

        .amount-kcal {
          margin-left: auto;
          font-weight: 600;
          color: #6b3a55;
        }

        .selected-actions {
          display: flex;
          gap: 0.5rem;
        }

        .add-ingredient-btn {
          flex: 1;
          padding: 0.625rem;
          background: linear-gradient(135deg, #8b4c70 0%, #6b3a55 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
        }

        .cancel-ingredient-btn {
          padding: 0.625rem 1rem;
          background: white;
          border: 2px solid #e8e0e5;
          border-radius: 8px;
          color: #7a706f;
          cursor: pointer;
          font-family: inherit;
        }

        .ingredients-list-box {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .ingredients-header {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          color: #7a706f;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #f5f0f3;
          margin-bottom: 0.5rem;
        }

        .ingredient-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.625rem 0;
          border-bottom: 1px solid #f5f0f3;
        }

        .ingredient-row:last-of-type {
          border-bottom: none;
        }

        .ingredient-info {
          display: flex;
          flex-direction: column;
        }

        .ing-name {
          font-weight: 500;
        }

        .ing-amount {
          font-size: 0.85rem;
          color: #7a706f;
        }

        .ingredient-kcal {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ingredient-kcal span {
          color: #6b3a55;
          font-weight: 500;
        }

        .calories-summary {
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 2px solid #f5f0f3;
        }

        .calories-row {
          display: flex;
          justify-content: space-between;
          padding: 0.375rem 0;
        }

        .calories-row.total {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .total-kcal {
          color: #6b3a55;
        }

        .calories-row.per-portion {
          color: #7a706f;
          font-size: 0.9rem;
        }

        .saved-recipes {
          margin-top: 2rem;
        }

        .saved-recipes h2 {
          font-family: 'Playfair Display', serif;
          color: #6b3a55;
          font-size: 1.25rem;
          margin-bottom: 1rem;
        }

        .saved-recipes-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .saved-recipe-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
          overflow: hidden;
        }

        .saved-recipe-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          cursor: pointer;
          transition: background 0.15s;
        }

        .saved-recipe-header:hover {
          background: #faf5f8;
        }

        .saved-recipe-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .saved-recipe-name {
          font-weight: 600;
          color: #2d2a26;
        }

        .saved-recipe-meta {
          font-size: 0.85rem;
          color: #7a706f;
        }

        .expand-arrow {
          color: #8b4c70;
          font-size: 0.75rem;
          margin-left: 0.5rem;
        }

        .saved-recipe-details {
          padding: 0 1rem 1rem;
          border-top: 1px solid #f5f0f3;
        }

        .saved-recipe-details .recipe-section {
          margin-top: 1rem;
        }

        .saved-recipe-details h4 {
          font-size: 0.85rem;
          color: #8b4c70;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .recipe-ingredients {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .recipe-ingredients li {
          display: flex;
          justify-content: space-between;
          padding: 0.375rem 0;
          border-bottom: 1px dotted #e8e0e5;
          font-size: 0.95rem;
        }

        .recipe-ingredients li:last-child {
          border-bottom: none;
        }

        .recipe-ingredients .ing-name {
          color: #2d2a26;
        }

        .recipe-ingredients .ing-amount {
          color: #7a706f;
        }

        .recipe-steps {
          padding-left: 1.25rem;
          margin: 0;
        }

        .recipe-steps li {
          padding: 0.375rem 0;
          font-size: 0.95rem;
          color: #4a4541;
        }

        .recipe-nutrition {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
          padding: 0.75rem;
          background: #faf5f8;
          border-radius: 8px;
          font-size: 0.9rem;
          color: #6b3a55;
        }

        .saved-recipe-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.625rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.375rem;
          transition: background 0.15s;
        }

        .action-btn.print {
          background: #f0f9ff;
          color: #0369a1;
        }

        .action-btn.print:hover {
          background: #e0f2fe;
        }

        .action-btn.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: #fecaca;
        }

        .action-btn.edit {
          background: #fef3c7;
          color: #92400e;
        }

        .action-btn.edit:hover {
          background: #fde68a;
        }

        /* Portionsskalning */
        .portion-scaler {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #faf5f8;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .portion-scaler label {
          font-weight: 500;
          color: #6b3a55;
        }

        .portion-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .portion-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #8b4c70;
          background: white;
          color: #8b4c70;
          font-size: 1.25rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
        }

        .portion-btn:hover {
          background: #8b4c70;
          color: white;
        }

        .portion-value {
          font-weight: 600;
          font-size: 1.1rem;
          min-width: 2rem;
          text-align: center;
        }

        .reset-portions {
          margin-left: auto;
          padding: 0.25rem 0.5rem;
          border: none;
          background: transparent;
          color: #8b4c70;
          font-size: 0.8rem;
          cursor: pointer;
          text-decoration: underline;
        }

        .ing-amount.scaled {
          color: #8b4c70;
          font-weight: 600;
        }

        /* Cancel edit button */
        .cancel-edit-btn {
          background: transparent;
          border: none;
          color: #8b4c70;
          cursor: pointer;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          padding: 0;
        }

        .cancel-edit-btn:hover {
          text-decoration: underline;
        }

        /* Quick access (favorites & history) */
        .quick-access {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 1rem;
        }

        .favorites-section h3,
        .history-section h3 {
          font-size: 0.9rem;
          color: #7a706f;
          margin-bottom: 0.5rem;
        }

        .quick-access-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-access-item {
          padding: 0.5rem 0.75rem;
          background: white;
          border: 1px solid #e8e0e5;
          border-radius: 20px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .quick-access-item:hover {
          border-color: #8b4c70;
          background: #faf5f8;
        }

        .quick-access-item .quick-kcal {
          font-size: 0.75rem;
          color: #8b4c70;
        }

        .history-item {
          background: #f9fafb;
        }

        /* Food detail header with favorite */
        .food-detail-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .food-detail-header h3 {
          flex: 1;
        }

        .favorite-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: #faf5f8;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          color: #c4b0bc;
          transition: all 0.15s;
          flex-shrink: 0;
        }

        .favorite-btn:hover {
          background: #f5eef2;
        }

        .favorite-btn.active {
          color: #f59e0b;
          background: #fef3c7;
        }

        .app-footer {
          padding: 1.5rem;
          text-align: center;
        }

        .footer-credit {
          color: #8b4c70;
          font-size: 0.85rem;
        }

        @media (max-width: 600px) {
          .app-main {
            padding: 1rem;
          }
          
          .converter-box {
            padding: 1rem;
          }
          
          .unit-selector button {
            padding: 0.4rem 0.75rem;
            font-size: 0.9rem;
          }
          
          .meal-totals {
            padding: 0.75rem;
          }
        }

        @media (max-width: 400px) {
          .app-header h1 {
            font-size: 1.75rem;
          }
          
          .menu-card {
            padding: 1rem 1.25rem;
          }
          
          .menu-card h2 {
            font-size: 1.05rem;
          }
          
          .menu-card p {
            font-size: 0.85rem;
          }

          .nutrition-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .temp-grid {
            gap: 0.5rem;
          }
          
          .temp-item {
            padding: 0.75rem 1rem;
          }
          
          .result-box {
            flex-direction: column;
            gap: 0.25rem;
          }
          
          .result-equals {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
