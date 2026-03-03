# Köksguiden – Projektminne

## Projektinfo
- React SPA (Create React App), svenska
- Repo: https://github.com/stenerstrom/koksguiden.git
- Branch: main
- Build: `BUILD_PATH=/tmp/koksguiden-build node_modules/.bin/react-scripts build`
- Lokal dev: `npm start` → http://localhost:3000

## Filstruktur
- All kod i en enda fil: `src/App.jsx` (~10 000+ rader)
- Inga separata CSS-filer – stilar inbäddade i App.jsx

## Sous vide-sektionen

### Datakälla
All sous vide-data kommer från **Modernist Cuisine Vol 3, Best Bets-tabellerna**.
- Inga MC-referenser ska synas i UI (tips, afterCare, thickness-noter)
- `mcNote`-fältet finns i datan men renderas ALDRIG i UI – bara för intern dokumentation

### Datastruktur
```js
sousVideData = {
  'Kategori': [
    {
      name: 'Styckdetalj',
      rare:     { temp: 53, time: '1-2h' },  // eller null
      medium:   { temp: 57, time: '1-2h' },
      wellDone: { temp: 60, time: '1-2h' },  // eller null
      mcNote:   'Intern MC-referens (renderas ej)',
      tips:     'Visas i UI',
      afterCare:'Visas i UI'
    }
  ]
}
```

### Tjocklekslogik
- `sousVideThickness.heating` – uppvärmningstid per cm (minuter)
- `sousVideThickness.pasteurization` – pastöriseringstid per °C (minuter)
- `sousVideThickness.tenderizing` – minimitid för sega styckdelar (timmar)

**Tenderizing-styckdelar** (nycklar måste matcha exakt `name` i sousVideData):
Flankstek, Högrev, Nötbringa, Oxkind, Oxsvans, Revbensspjäll, Fläskmage,
Fläskbog (Pulled), Fläskkind, Fläsklägg, Spädgrisbog & -lägg, Kalvbröst,
Kaninbog, Lammlägg, Lammbog, Lammstek, Anklår (Confit), Bläckfisk, Åttafoting

### UI-regler
- **Ägg & Skaldjur**: visar `setting.time` direkt, ingen tjockleksslider
- **Tenderizing-styckdelar**: visar `setting.time` direkt, ingen tjockleksslider, noten säger "Tenderiseringstid – koktiden styrs av kollagen, inte tjocklek."
- **Övriga**: tjockleksslider visas, `calculateSousVideTime()` beräknar tid, noten visar "Tid för X cm tjock skiva..."
- Vattenbadet-tipset (`setting.temp + 1°C`) visas alltid utom för Ägg/Skaldjur

### Namnkonventioner
- Inga engelska namn inom parentes på styckdelar (t.ex. `Rostbiff` inte `Rostbiff (strip steak)`)
- Undantag som är ok: `Fläskbog (Pulled)`, `Anklår (Confit)`, `Räkor (stora)`, `Onsen-ägg (63°C)`

## Git
GitHub kräver Personal Access Token (PAT) eller SSH – inte lösenord.
Konfigurera SSH-nyckel eller PAT innan push.
