# Köksguiden 🍳

En svensk kökshjälp-app med näringsdatabas från Livsmedelsverket.

![React](https://img.shields.io/badge/React-18-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Funktioner

### 📏 Måttomvandling
- Omvandla mellan vikt (kg, hg, g) och volym (l, dl, msk, tsk, krm)
- Stöd för utländska enheter (lb, oz, cups)
- Referenstabell för vikt per dl för vanliga ingredienser

### 🌡️ Temperaturer
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
# Klona repot
git clone https://github.com/ditt-användarnamn/koksguiden.git

# Gå till mappen
cd koksguiden

# Installera dependencies
npm install

# Starta utvecklingsserver
npm start
```

Öppna [http://localhost:3000](http://localhost:3000) i webbläsaren.

## Publicera på GitHub Pages

### 1. Uppdatera homepage i package.json

Ändra `stenerstrom` till ditt GitHub-användarnamn:

```json
"homepage": "https://stenerstrom.github.io/koksguiden"
```

### 2. Pusha till GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/stenerstrom/koksguiden.git
git branch -M main
git push -u origin main
```

### 3. Deploya till GitHub Pages

```bash
npm run deploy
```

Detta bygger appen och publicerar den till `gh-pages` branchen.

### 4. Aktivera GitHub Pages

1. Gå till ditt repo på GitHub
2. Settings → Pages
3. Under "Source", välj `gh-pages` branch
4. Spara

Din app finns nu på: `https://stenerstrom.github.io/koksguiden`

## Teknologi

- **React 18** — UI-bibliotek
- **Livsmedelsverkets databas** — Näringsvärden för 2500+ livsmedel
- **localStorage** — Spara recept lokalt
- **CSS-in-JS** — Stilar inbäddade i komponenten
- **GitHub Pages** — Hosting

## Datakällor

Näringsvärden kommer från [Livsmedelsverkets livsmedelsdatabas](https://www.livsmedelsverket.se/livsmedel-och-innehall/naringsamne/livsmedelsdatabasen) (2025).

## Licens

MIT License — se [LICENSE](LICENSE) för detaljer.

## Bidra

Pull requests är välkomna! För större ändringar, öppna gärna ett issue först.

---

Skapat med ❤️ för svenska kök
