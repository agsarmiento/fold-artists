# AI Litigation Tracker — Fold Artists

A data visualization dashboard tracking AI copyright litigation across the creative industries. Built with Vite and D3.js.

---

## Running the project

```bash
npm install
npm run dev       # development server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

---

## What the dashboard shows

The source data is the spreadsheet in `_assets/`. It covers 96 filed cases across 19 AI companies and 7 creative industries, spanning 2024–2026.

### KPI tiles

Four summary metrics at the top of the page:

| Tile | What it means |
|---|---|
| Active Cases Tracked | Total number of distinct filed cases in the dataset |
| Estimated Total Exposure | Sum of maximum statutory copyright damages across all cases — up to $150,000 per infringed work under 17 U.S.C. § 504, scaled to the publicly reported scope of each violation |
| Ongoing Litigation | Percentage of cases still active (not settled, won, or lost) |
| Industries Impacted | Number of distinct creative industry categories represented |

### Exposure bar chart

Horizontal bars ranked by estimated financial exposure per AI company (defendant). All bars use a single blue color — this is a magnitude comparison, not a categorical encoding. Hover over a bar for case details and notable plaintiffs.

### Cases by industry chart

Horizontal bars showing how many of the 96 cases originate from each creative sector. Single-color orange bars (magnitude comparison). Industry categories:

- **Music** — record labels, performing rights organizations, individual artists
- **Media** — newspapers, news agencies, online publishers
- **Authors** — individual writers, class actions by author groups
- **Publishing** — book publishers, academic publishers
- **Platform** — tech platforms suing over AI-generated competition
- **Motion Picture** — film studios and distributors
- **Visual Art** — illustrators, photographers, image libraries

### Case status overview

Four status tiles plus a proportional strip bar showing the breakdown of all 96 cases:

| Status | Meaning |
|---|---|
| Ongoing | Case is active in court |
| Settled | Parties reached a private agreement |
| Won | Plaintiff won a court ruling |
| Lost | Plaintiff's case was dismissed or ruled against |

---

## Litigation network graph

A force-directed graph showing every company as a node and every lawsuit as an edge.

### Node roles

| Appearance | Role | Who they are |
|---|---|---|
| Blue stroke ring | Defendant | AI companies being sued |
| Colored stroke ring (industry color) | Plaintiff | Creative companies / individuals filing suit |
| Gold stroke ring | Both | Companies that are both suing and being sued |

### Node size

**Defendant nodes** are sized by estimated financial exposure in USD billions — the larger the node, the greater the potential damages that company faces. The most-exposed defendant (OpenAI) starts at the center of the graph.

**Plaintiff nodes** are sized by how many defendants they are suing — a plaintiff suing three companies is slightly larger than one suing a single company.

Nodes without a recognizable brand logo (individual authors, class action groups, small organizations) display as a solid color fill rather than a white circle with a logo.

### Edge (link) colors and thickness

Each line represents one lawsuit. Color and thickness encode the case outcome:

| Color | Status | Thickness |
|---|---|---|
| Blue (faint) | Ongoing | 1.5 px |
| Gold | Settled | 2 px |
| Green | Won (plaintiff) | 2.5 px |
| Red | Lost (plaintiff) | 2.5 px |

### Node colors (plaintiff stroke rings)

Each plaintiff node's stroke ring is colored by industry:

| Color | Industry |
|---|---|
| Aqua | Music |
| Orange | Media |
| Magenta | Authors |
| Yellow | Publishing |
| Violet | Platform |
| Red | Motion Picture |
| Green | Visual Art |

### Logos

Defendant and well-known plaintiff nodes display their company logo fetched from Google's favicon service. If the favicon is unavailable, a local SVG letter mark is used as fallback. Nodes with no logo mapping (individual authors, class actions) show a solid color fill.

### Interactions

| Action | What it does |
|---|---|
| Hover a node | Highlights all connected nodes and edges; dims everything else; shows a tooltip with case details |
| Drag a node | Repositions it; releases when you let go |
| Scroll / pinch | Zooms in and out (0.25× – 5×) |
| Drag background | Pans the canvas |
| Reset zoom | Fits the entire graph back into view |
| Tooltip on/off | Toggles the hover tooltip panel |
| Fullscreen | Expands the graph to fill the entire screen; graph scales to fit |

---

## Theme

The dashboard supports dark and light themes. The toggle in the top-left of the header switches between them; the preference is saved in `localStorage` and restored on next visit.

---

## Tech stack

| Layer | Technology |
|---|---|
| Build tool | [Vite](https://vitejs.dev/) v5 |
| Visualization | [D3.js](https://d3js.org/) v7 |
| Language | Vanilla JavaScript (ES modules) |
| Fonts | Inter via Google Fonts |
| Logos | Google favicon service (`/s2/favicons`) + local SVG fallbacks |

---

## Project structure

```
fold-artists/
├── index.html          # App shell, KPI tiles, chart containers
├── src/
│   ├── main.js         # All D3 chart logic, force simulation, theme toggle
│   ├── data.js         # Defendants, case links, industry/status data, logo domain map
│   └── style.css       # Dark + light theme tokens, layout, component styles
├── public/
│   └── logos/          # SVG letter-mark fallbacks for ~57 companies
└── _assets/            # Source spreadsheet (not committed if .gitignored)
```

---

## Data notes

- Exposure figures are **estimates** based on maximum statutory copyright damages (17 U.S.C. § 504: up to $150,000 per work) scaled to publicly reported training data violation scope. They are not confirmed court awards.
- Case data covers publicly filed litigation records through mid-2026.
- For client use only — Fold Artists © 2026.
