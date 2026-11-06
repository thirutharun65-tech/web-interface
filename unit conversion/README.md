# ConvertX

**Fast, Accurate & Simple Unit Conversion** — a 100% client-side React + Vite app. No backend, no external APIs; every calculation runs locally in the browser.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## What's inside

- **12 categories**: Length, Weight/Mass, Temperature, Area, Volume, Time, Speed, Data Storage (decimal + binary), Pressure, Energy, Power, Angle
- Instant conversion as you type — no submit button
- Swap button that flips units and recalculates
- Configurable decimal precision (0–8 places) with smart number formatting (thousands separators, no scientific notation unless the number is extremely large/small)
- Conversion history (last 20), stored in `localStorage`
- Favorites — star any From→To pair for one-tap recall
- Quick conversion shortcuts
- Global unit search
- Copy result to clipboard with a toast confirmation
- Dark/light theme toggle, persisted in `localStorage`
- Responsive layout: sidebar + converter + history/favorites on desktop, stacked single column on mobile
- Friendly inline error handling for empty/invalid/negative-where-inappropriate input — the app never crashes on bad input

## Project structure

```
src/
├── components/   Header, CategorySelector, UnitSelector, ConversionInput,
│                 ResultDisplay, SwapButton, History, Favorites,
│                 QuickConversions, SearchUnits, Toast
├── data/         units.js — every category, unit, and conversion factor
├── utils/        converter.js (conversion engine), formatter.js (number
│                 formatting), storage.js (localStorage helpers)
├── pages/        Converter.jsx — the main page, owns all app state
├── App.jsx
├── main.jsx
└── index.css     design tokens + all styling
```

## How the conversion engine works

Every category except Temperature converts through a **base unit**: the input value is multiplied by the source unit's factor to get the base-unit value, then divided by the target unit's factor. Temperature (Celsius/Fahrenheit/Kelvin) isn't linear from zero, so it's handled with its own formulas in `utils/converter.js`.
