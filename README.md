Thought for a second


```markdown
# IncidentApp-Next

Eine Next.js-App zum Erfassen, Anzeigen, Filtern, Aktualisieren und Löschen von Security-Incidents über MongoDB Atlas.

## 🚀 Features

- **Formular** (`/`): Neuer Incident (Titel, Beschreibung, Kategorie)
- **Liste** (`/reports`):
  - Volltextsuche & Kategorienfilter
  - Status-Dropdown (Offen, In Bearbeitung, Gelöst) mit Live-Update
  - Einträge löschen
- **Serverless API** unter `pages/api/*`
- Styling mit **Tailwind CSS**

## 📁 Struktur

```

.
├── package.json
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
├── .env.local         # nicht ins Repo
├── pages/
│   ├── \_app.js
│   ├── index.js
│   ├── reports.js
│   └── api/
│       ├── report.js
│       ├── getReports.js
│       ├── updateReport.js
│       └── deleteReport.js
└── styles/
└── globals.css

````

## ⚙️ Lokal starten

1. Klonen & ins Verzeichnis wechseln  
   ```bash
   git clone https://github.com/<you>/incident-app-next.git
   cd incident-app-next
````

2. Dependencies installieren

   ```bash
   npm install
   ```
3. `.env.local` anlegen

   ```
   MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/incidentsDB?retryWrites=true&w=majority&tls=true"
   ```
4. Dev-Server starten

   ```bash
   npm run dev
   ```
5. Öffne [http://localhost:3000](http://localhost:3000)

## 📡 Deployment mit Vercel

1. Push zu GitHub
2. Neu bei vercel.com → Add New Project → Repo wählen
3. Env-Var `MONGODB_URI` setzen
4. Deploy starten (Next.js wird automatisch erkannt)

## 🗂 API-Routen

| Route               | Methode | Zweck                         |
| ------------------- | ------- | ----------------------------- |
| `/api/report`       | POST    | Neuer Incident speichern      |
| `/api/getReports`   | GET     | Alle Incidents abfragen       |
| `/api/updateReport` | POST    | Status eines Incidents ändern |
| `/api/deleteReport` | POST    | Incident löschen              |

## 🛠 Troubleshooting

* **405 Method Not Allowed**
  Prüfe, dass `pages/api/updateReport.js` exakt so heißt (Case-sensitive) und `fetch('/api/updateReport')` verwendet wird.
* **Build-Errors `fs`/`dns`/…**
  Existiert `next.config.js` mit Webpack-Fallbacks für Node-Module?
* **Prerender-Error `setHeader`**
  `res.setHeader` darf **nur** in `pages/api/*.js` stehen, nicht in `pages/*.js`.

---

```
```
