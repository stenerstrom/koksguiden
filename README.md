# Köksguiden

En svensk kökshjälp-app med näringsdatabas från Livsmedelsverket.

![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Funktioner

### 🌡️ Sous vide-guide
- Temperatur och tid för 70+ råvaror: kött, fågel, fisk, skaldjur och ägg
- Tre tillagningsnivåer: Rare, Medium, Genomstekt
- Tjockleksbaserad tidsberäkning (uppvärmningstid + pastöriseringstid) för möra styckdelar
- Sega styckdelar (Högrev, Fläskbog, Oxsvans m.fl.) visar tenderiseringstid direkt utan tjockleksslider
- Tips och efterbehandling för varje råvara
- All data hämtad från **Modernist Cuisine Vol 3**, Best Bets-tabellerna

### 📏 Måttomvandling
- Omvandla mellan vikt (kg, hg, g) och volym (l, dl, msk, tsk, krm)
- Stöd för utländska enheter (lb, oz, cups)
- Referenstabell för vikt per dl för vanliga ingredienser

### 🌡️ Innertemperaturer (ugn/stekpanna)
- Innertemperaturer för kött, fågel och fisk
- Rare, medium och genomstekt
- Tillagningstips för varje styckdetalj

### 🔥 Kalorier & Näring
- Sök bland 2500+ livsmedel från Livsmedelsverkets databas
- Filtrera på kategori (mejeri, kött, grönsaker, etc.)
- Se kalorier, protein, kolhydrater, fett och fiber
- Bygg måltider och se totalt näringsinnehåll

### 📖 Grundrecept
- De fem klassiska grundsåserna (Bechamel, Velouté, Espagnole, Hollandaise, Tomatsås)
- Steg-för-steg instruktioner
- Ingredienslistor med mängder

### ✏️ Skapa recept
- Bygg egna recept med ingredienser från databasen
- Automatisk kaloriberäkning
- Välj mellan vikt (gram) och volym (dl, msk, tsk)
- Sparas lokalt i webbläsaren
- Utskriftsvänligt format

## Installation

```bash
git clone https://github.com/stenerstrom/koksguiden.git
cd koksguiden
npm install
npm start
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

## Publicera på GitHub Pages

```bash
# Bygg och deploya
npm run deploy
```

Aktivera GitHub Pages i repo-inställningarna (Settings → Pages → `gh-pages` branch).

Din app finns på: `https://stenerstrom.github.io/koksguiden`

## Teknologi

- **React 18** — UI-bibliotek
- **Livsmedelsverkets databas** — Näringsvärden för 2500+ livsmedel
- **Modernist Cuisine Vol 3** — Sous vide-data (Best Bets-tabellerna)
- **localStorage** — Spara recept lokalt
- **GitHub Pages** — Hosting

## Datakällor

- Näringsvärden: [Livsmedelsverkets livsmedelsdatabas](https://www.livsmedelsverket.se/livsmedel-och-innehall/naringsamne/livsmedelsdatabasen) (2025)
- Sous vide: Modernist Cuisine, Vol 3 — Best Bets-tabellerna

## Licens

MIT License — se [LICENSE](LICENSE) för detaljer.
