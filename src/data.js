// Derived from: Fold Artists _ AI litigation tracker.xlsx
// Exposure estimates: based on statutory copyright damages (17 U.S.C. § 504, up to $150K/work)
// scaled to publicly reported scope of training data violations.

export const defendants = [
  {
    name: "OpenAI",
    cases: 14,
    exposureB: 20,
    size: "Behemoth",
    industries: ["Media", "Publishing", "Music", "Authors", "Platform"],
    status: { Ongoing: 14, Settled: 0, Won: 0, Lost: 0 },
    notable: [
      "New York Times", "Authors Guild", "Raw Story", "The Intercept",
      "Encyclopedia Britannica", "GEMA", "Center for Investigative Reporting",
      "Daily News", "California Newspaper Partnership", "Ziff Davis",
      "Tremblay", "Carreyrou", "Grace Note", "Asian News International"
    ]
  },
  {
    name: "Microsoft",
    cases: 9,
    exposureB: 12,
    size: "Behemoth",
    industries: ["Media", "Publishing", "Authors", "Platform"],
    status: { Ongoing: 9, Settled: 0, Won: 0, Lost: 0 },
    notable: [
      "New York Times", "Chicago Tribune", "Orlando Sentinel",
      "Center for Investigative Reporting", "California Newspaper Partnership",
      "Daily News", "Bird (Class Action)", "Book Authors Class Action",
      "Open-Source Developers Class Action"
    ]
  },
  {
    name: "Meta",
    cases: 10,
    exposureB: 8,
    size: "Behemoth",
    industries: ["Publishing", "Music", "Authors", "Platform", "Visual Art"],
    status: { Ongoing: 9, Settled: 0, Won: 0, Lost: 1 },
    notable: [
      "TED Entertainment", "Elsevier", "Chicken Soup For The Soul",
      "Epidemic Sound", "Wixen Music", "Eminem (Eight Mile Style)",
      "Beaulier", "Hobbs", "Kadrey (lost)", "National Publishing Union (France)"
    ]
  },
  {
    name: "Google",
    cases: 5,
    exposureB: 6,
    size: "Behemoth",
    industries: ["Publishing", "Authors", "Music", "Platform"],
    status: { Ongoing: 5, Settled: 0, Won: 0, Lost: 0 },
    notable: [
      "Penske Media", "Hachette Book Group", "Leovy", "Woulard", "Chegg"
    ]
  },
  {
    name: "Perplexity",
    cases: 9,
    exposureB: 2,
    size: "Medium",
    industries: ["Media", "Publishing", "Authors", "Platform"],
    status: { Ongoing: 9, Settled: 0, Won: 0, Lost: 0 },
    notable: [
      "New York Times", "Chicago Tribune", "CNN", "Dow Jones",
      "Encyclopedia Britannica", "Reddit", "Yomiuri Shimbun",
      "Nikkei & Asahi Shimbun", "Carreyrou"
    ]
  },
  {
    name: "Midjourney",
    cases: 5,
    exposureB: 1.2,
    size: "Large",
    industries: ["Motion Picture", "Visual Art"],
    status: { Ongoing: 5, Settled: 0, Won: 0, Lost: 0 },
    notable: [
      "Disney", "Universal Pictures", "Warner Bros.", "DreamWorks", "Andersen"
    ]
  },
  {
    name: "Suno",
    cases: 11,
    exposureB: 0.8,
    size: "Medium",
    industries: ["Music"],
    status: { Ongoing: 10, Settled: 1, Won: 0, Lost: 0 },
    notable: [
      "Sony Music", "Universal Music Group", "GEMA", "Koda", "Jamendo",
      "Warner Music Group (settled)", "OSA", "Justice", "Poseidon Wave",
      "Woulard", "Delgado class action"
    ]
  },
  {
    name: "Anthropic",
    cases: 8,
    exposureB: 0.5,
    size: "Large",
    industries: ["Music", "Authors", "Publishing", "Platform"],
    status: { Ongoing: 7, Settled: 1, Won: 0, Lost: 0 },
    notable: [
      "Concord", "BMG", "ABKCO", "Reddit", "Cognella",
      "Cruz", "Carreyrou", "Bartz (settled)"
    ]
  },
  {
    name: "Udio",
    cases: 3,
    exposureB: 0.4,
    size: "Small",
    industries: ["Music"],
    status: { Ongoing: 1, Settled: 2, Won: 0, Lost: 0 },
    notable: [
      "Sony Music", "Warner Music Group (settled)", "Universal Music Group (settled)"
    ]
  },
  {
    name: "Cohere",
    cases: 7,
    exposureB: 0.35,
    size: "Medium",
    industries: ["Media"],
    status: { Ongoing: 7, Settled: 0, Won: 0, Lost: 0 },
    notable: [
      "Forbes", "Condé Nast", "The Atlantic", "LA Times",
      "Politico", "Vox Media", "The Guardian"
    ]
  },
  {
    name: "NVIDIA",
    cases: 4,
    exposureB: 0.25,
    size: "Large",
    industries: ["Authors", "Music"],
    status: { Ongoing: 4, Settled: 0, Won: 0, Lost: 0 },
    notable: ["Dubus", "Jamendo", "O'Nan", "YouTuber Class Action"]
  },
  {
    name: "Stability AI",
    cases: 2,
    exposureB: 0.2,
    size: "Medium",
    industries: ["Platform", "Visual Art"],
    status: { Ongoing: 2, Settled: 0, Won: 0, Lost: 0 },
    notable: ["Getty Images", "Andersen"]
  },
  {
    name: "Apple",
    cases: 3,
    exposureB: 0.15,
    size: "Behemoth",
    industries: ["Authors", "Platform"],
    status: { Ongoing: 3, Settled: 0, Won: 0, Lost: 0 },
    notable: ["TED Entertainment", "Martinez-Conde", "Alexander"]
  },
  {
    name: "Eleven Labs",
    cases: 1,
    exposureB: 0.08,
    size: "Medium",
    industries: ["Authors"],
    status: { Ongoing: 0, Settled: 1, Won: 0, Lost: 0 },
    notable: ["Vacker (settled)"]
  },
  {
    name: "Ross Intelligence",
    cases: 1,
    exposureB: 0.062,
    size: "Small",
    industries: ["Publishing"],
    status: { Ongoing: 0, Settled: 0, Won: 0, Lost: 1 },
    notable: ["Thomson Reuters (plaintiff won $62.4M)"]
  },
  {
    name: "Warner Music Group",
    cases: 1,
    exposureB: 0.05,
    size: "Behemoth",
    industries: ["Music"],
    status: { Ongoing: 1, Settled: 0, Won: 0, Lost: 0 },
    notable: ["AFM (American Federation of Music)"]
  },
  {
    name: "Universal Music Group",
    cases: 1,
    exposureB: 0.05,
    size: "Behemoth",
    industries: ["Music"],
    status: { Ongoing: 1, Settled: 0, Won: 0, Lost: 0 },
    notable: ["AFM (American Federation of Music)"]
  },
  {
    name: "Databricks",
    cases: 1,
    exposureB: 0.04,
    size: "Large",
    industries: ["Authors"],
    status: { Ongoing: 1, Settled: 0, Won: 0, Lost: 0 },
    notable: ["O'Nan"]
  },
  {
    name: "Mureka",
    cases: 1,
    exposureB: 0.03,
    size: "Small",
    industries: ["Music"],
    status: { Ongoing: 1, Settled: 0, Won: 0, Lost: 0 },
    notable: ["Musician/Songwriter Class Action"]
  }
];

// All 96 plaintiff→defendant lawsuit links
export const caseLinks = [
  // OpenAI — 14 cases, all Ongoing
  { source: "New York Times",                  target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "Raw Story",                       target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "The Intercept",                   target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "Center for Investigative Rptg",   target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "California Newspaper Partnership",target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "Daily News",                      target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "Asian News International",        target: "OpenAI",            status: "Ongoing",  industry: "Media" },
  { source: "Encyclopedia Britannica",         target: "OpenAI",            status: "Ongoing",  industry: "Publishing" },
  { source: "Ziff Davis",                      target: "OpenAI",            status: "Ongoing",  industry: "Publishing" },
  { source: "GEMA",                            target: "OpenAI",            status: "Ongoing",  industry: "Music" },
  { source: "Authors Guild",                   target: "OpenAI",            status: "Ongoing",  industry: "Authors" },
  { source: "Tremblay",                        target: "OpenAI",            status: "Ongoing",  industry: "Authors" },
  { source: "Carreyrou",                       target: "OpenAI",            status: "Ongoing",  industry: "Authors" },
  { source: "Grace Note",                      target: "OpenAI",            status: "Ongoing",  industry: "Platform" },
  // Microsoft — 9 cases, all Ongoing
  { source: "New York Times",                  target: "Microsoft",         status: "Ongoing",  industry: "Media" },
  { source: "Chicago Tribune",                 target: "Microsoft",         status: "Ongoing",  industry: "Media" },
  { source: "Center for Investigative Rptg",   target: "Microsoft",         status: "Ongoing",  industry: "Media" },
  { source: "California Newspaper Partnership",target: "Microsoft",         status: "Ongoing",  industry: "Media" },
  { source: "Daily News",                      target: "Microsoft",         status: "Ongoing",  industry: "Media" },
  { source: "Orlando Sentinel",                target: "Microsoft",         status: "Ongoing",  industry: "Publishing" },
  { source: "Bird Class Action",               target: "Microsoft",         status: "Ongoing",  industry: "Authors" },
  { source: "Book Authors Class Action",       target: "Microsoft",         status: "Ongoing",  industry: "Authors" },
  { source: "Open-Source Dev Class Action",    target: "Microsoft",         status: "Ongoing",  industry: "Platform" },
  // Meta — 10 cases: 9 Ongoing, 1 Lost
  { source: "TED Entertainment",              target: "Meta",              status: "Ongoing",  industry: "Platform" },
  { source: "Chicken Soup For The Soul",      target: "Meta",              status: "Ongoing",  industry: "Publishing" },
  { source: "Elsevier",                       target: "Meta",              status: "Ongoing",  industry: "Publishing" },
  { source: "Epidemic Sound",                 target: "Meta",              status: "Ongoing",  industry: "Music" },
  { source: "Wixen Music",                    target: "Meta",              status: "Ongoing",  industry: "Music" },
  { source: "Eminem (Eight Mile Style)",      target: "Meta",              status: "Ongoing",  industry: "Music" },
  { source: "Beaulier",                       target: "Meta",              status: "Ongoing",  industry: "Visual Art" },
  { source: "Hobbs",                          target: "Meta",              status: "Ongoing",  industry: "Authors" },
  { source: "Kadrey",                         target: "Meta",              status: "Lost",     industry: "Authors" },
  { source: "National Publishing Union",      target: "Meta",              status: "Ongoing",  industry: "Authors" },
  // Google — 5 cases, all Ongoing
  { source: "Penske Media",                   target: "Google",            status: "Ongoing",  industry: "Publishing" },
  { source: "Hachette Book Group",            target: "Google",            status: "Ongoing",  industry: "Publishing" },
  { source: "Leovy",                          target: "Google",            status: "Ongoing",  industry: "Authors" },
  { source: "Woulard",                        target: "Google",            status: "Ongoing",  industry: "Music" },
  { source: "Chegg",                          target: "Google",            status: "Ongoing",  industry: "Platform" },
  // Perplexity — 9 cases, all Ongoing
  { source: "New York Times",                  target: "Perplexity",        status: "Ongoing",  industry: "Media" },
  { source: "Chicago Tribune",                 target: "Perplexity",        status: "Ongoing",  industry: "Media" },
  { source: "CNN",                             target: "Perplexity",        status: "Ongoing",  industry: "Media" },
  { source: "Yomiuri Shimbun",                 target: "Perplexity",        status: "Ongoing",  industry: "Media" },
  { source: "Nikkei & Asahi Shimbun",          target: "Perplexity",        status: "Ongoing",  industry: "Media" },
  { source: "Dow Jones",                       target: "Perplexity",        status: "Ongoing",  industry: "Platform" },
  { source: "Reddit",                          target: "Perplexity",        status: "Ongoing",  industry: "Platform" },
  { source: "Encyclopedia Britannica",         target: "Perplexity",        status: "Ongoing",  industry: "Publishing" },
  { source: "Carreyrou",                       target: "Perplexity",        status: "Ongoing",  industry: "Authors" },
  // Anthropic — 8 cases: 7 Ongoing, 1 Settled
  { source: "Concord",                         target: "Anthropic",         status: "Ongoing",  industry: "Music" },
  { source: "BMG",                             target: "Anthropic",         status: "Ongoing",  industry: "Music" },
  { source: "ABKCO",                           target: "Anthropic",         status: "Ongoing",  industry: "Music" },
  { source: "Reddit",                          target: "Anthropic",         status: "Ongoing",  industry: "Platform" },
  { source: "Cognella",                        target: "Anthropic",         status: "Ongoing",  industry: "Publishing" },
  { source: "Cruz",                            target: "Anthropic",         status: "Ongoing",  industry: "Authors" },
  { source: "Carreyrou",                       target: "Anthropic",         status: "Ongoing",  industry: "Authors" },
  { source: "Bartz",                           target: "Anthropic",         status: "Settled",  industry: "Authors" },
  // Cohere — 7 cases, all Ongoing
  { source: "Forbes",                          target: "Cohere",            status: "Ongoing",  industry: "Media" },
  { source: "Condé Nast",                      target: "Cohere",            status: "Ongoing",  industry: "Media" },
  { source: "The Atlantic",                    target: "Cohere",            status: "Ongoing",  industry: "Media" },
  { source: "LA Times",                        target: "Cohere",            status: "Ongoing",  industry: "Media" },
  { source: "Politico",                        target: "Cohere",            status: "Ongoing",  industry: "Media" },
  { source: "Vox Media",                       target: "Cohere",            status: "Ongoing",  industry: "Media" },
  { source: "The Guardian",                    target: "Cohere",            status: "Ongoing",  industry: "Media" },
  // Midjourney — 5 cases, all Ongoing
  { source: "Disney",                          target: "Midjourney",        status: "Ongoing",  industry: "Motion Picture" },
  { source: "Universal Pictures",             target: "Midjourney",        status: "Ongoing",  industry: "Motion Picture" },
  { source: "Warner Bros.",                    target: "Midjourney",        status: "Ongoing",  industry: "Motion Picture" },
  { source: "DreamWorks",                      target: "Midjourney",        status: "Ongoing",  industry: "Motion Picture" },
  { source: "Andersen",                        target: "Midjourney",        status: "Ongoing",  industry: "Visual Art" },
  // Suno — 11 cases: 10 Ongoing, 1 Settled
  { source: "Sony Music",                      target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Universal Music Group",           target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Koda",                            target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "GEMA",                            target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "OSA",                             target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Justice",                         target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Jamendo",                         target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Woulard",                         target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Poseidon Wave",                   target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Delgado Class Action",            target: "Suno",              status: "Ongoing",  industry: "Music" },
  { source: "Warner Music Group",              target: "Suno",              status: "Settled",  industry: "Music" },
  // Udio — 3 cases: 1 Ongoing, 2 Settled
  { source: "Sony Music",                      target: "Udio",              status: "Ongoing",  industry: "Music" },
  { source: "Warner Music Group",              target: "Udio",              status: "Settled",  industry: "Music" },
  { source: "Universal Music Group",           target: "Udio",              status: "Settled",  industry: "Music" },
  // NVIDIA — 4 cases, all Ongoing
  { source: "Dubus",                           target: "NVIDIA",            status: "Ongoing",  industry: "Authors" },
  { source: "O'Nan",                           target: "NVIDIA",            status: "Ongoing",  industry: "Authors" },
  { source: "Jamendo",                         target: "NVIDIA",            status: "Ongoing",  industry: "Music" },
  { source: "YouTuber Class Action",           target: "NVIDIA",            status: "Ongoing",  industry: "Music" },
  // Apple — 3 cases, all Ongoing
  { source: "TED Entertainment",              target: "Apple",             status: "Ongoing",  industry: "Platform" },
  { source: "Martinez-Conde",                  target: "Apple",             status: "Ongoing",  industry: "Authors" },
  { source: "Alexander",                       target: "Apple",             status: "Ongoing",  industry: "Authors" },
  // Stability AI — 2 cases, all Ongoing
  { source: "Getty Images",                    target: "Stability AI",      status: "Ongoing",  industry: "Platform" },
  { source: "Andersen",                        target: "Stability AI",      status: "Ongoing",  industry: "Visual Art" },
  // Ross Intelligence — 1 case, Won by plaintiff
  { source: "Thomson Reuters",                 target: "Ross Intelligence", status: "Won",      industry: "Publishing" },
  // Universal Music Group — 1 case (being sued by AFM)
  { source: "AFM",                             target: "Universal Music Group", status: "Ongoing", industry: "Music" },
  // Warner Music Group — 1 case (being sued by AFM)
  { source: "AFM",                             target: "Warner Music Group",    status: "Ongoing", industry: "Music" },
  // Mureka — 1 case
  { source: "Musician/Songwriter Class Action",target: "Mureka",           status: "Ongoing",  industry: "Music" },
  // Eleven Labs — 1 case, Settled
  { source: "Vacker",                          target: "Eleven Labs",       status: "Settled",  industry: "Authors" },
  // Databricks — 1 case
  { source: "O'Nan",                           target: "Databricks",        status: "Ongoing",  industry: "Authors" },
];

// Clearbit logo API domains — companies without entries fall back to colored circles
export const LOGO_DOMAINS = {
  // AI defendants
  'OpenAI':                 'openai.com',
  'Microsoft':              'microsoft.com',
  'Meta':                   'meta.com',
  'Google':                 'google.com',
  'Perplexity':             'perplexity.ai',
  'Anthropic':              'anthropic.com',
  'Cohere':                 'cohere.com',
  'Midjourney':             'midjourney.com',
  'Suno':                   'suno.com',
  'Udio':                   'udio.com',
  'NVIDIA':                 'nvidia.com',
  'Apple':                  'apple.com',
  'Stability AI':           'stability.ai',
  'Ross Intelligence':      'rossintelligence.com',
  'Universal Music Group':  'universalmusic.com',
  'Warner Music Group':     'wmg.com',
  'Databricks':             'databricks.com',
  'Mureka':                 'mureka.ai',
  'Eleven Labs':            'elevenlabs.io',
  // Plaintiffs
  'New York Times':                   'nytimes.com',
  'Sony Music':                       'sonymusic.com',
  'Disney':                           'disney.com',
  'Warner Bros.':                     'warnerbros.com',
  'Universal Pictures':               'universalpictures.com',
  'DreamWorks':                       'dreamworks.com',
  'Getty Images':                     'gettyimages.com',
  'Thomson Reuters':                  'thomsonreuters.com',
  'Forbes':                           'forbes.com',
  'Condé Nast':                       'condenast.com',
  'The Guardian':                     'theguardian.com',
  'CNN':                              'cnn.com',
  'Dow Jones':                        'dowjones.com',
  'Reddit':                           'reddit.com',
  'Chicago Tribune':                  'chicagotribune.com',
  'The Atlantic':                     'theatlantic.com',
  'Vox Media':                        'voxmedia.com',
  'Politico':                         'politico.com',
  'LA Times':                         'latimes.com',
  'Hachette Book Group':              'hachettebookgroup.com',
  'Penske Media':                     'pmc.com',
  'Encyclopedia Britannica':          'britannica.com',
  'Elsevier':                         'elsevier.com',
  'BMG':                              'bmg.com',
  'Concord':                          'concordmusic.com',
  'ABKCO':                            'abkco.com',
  'TED Entertainment':                'ted.com',
  'Chegg':                            'chegg.com',
  'Ziff Davis':                       'ziffdavis.com',
  'GEMA':                             'gema.de',
  'AFM':                              'afm.org',
  'Raw Story':                        'rawstory.com',
  'The Intercept':                    'theintercept.com',
  'Daily News':                       'nydailynews.com',
  'Orlando Sentinel':                 'orlandosentinel.com',
  'Koda':                             'koda.dk',
  'Cognella':                         'cognella.com',
  'Authors Guild':                    'authorsguild.org',
  'Epidemic Sound':                   'epidemicsound.com',
  'Wixen Music':                      'wixenmusic.com',
  'Center for Investigative Rptg':    'revealnews.org',
  'California Newspaper Partnership': 'californianewspapers.com',
  'Yomiuri Shimbun':                  'yomiuri.co.jp',
  'Nikkei & Asahi Shimbun':           'nikkei.com',
  'Jamendo':                          'jamendo.com',
};

export const industries = [
  { name: "Music",          cases: 27, color: "#3987e5" },
  { name: "Media",          cases: 24, color: "#d95926" },
  { name: "Authors",        cases: 19, color: "#199e70" },
  { name: "Publishing",     cases: 10, color: "#c98500" },
  { name: "Platform",       cases: 9,  color: "#d55181" },
  { name: "Motion Picture", cases: 4,  color: "#9085e9" },
  { name: "Visual Art",     cases: 3,  color: "#e66767" }
];

export const statusData = [
  { status: "Ongoing",           count: 89, pct: 92.7, color: "#3987e5" },
  { status: "Settled",           count: 5,  pct: 5.2,  color: "#c98500" },
  { status: "Won by Plaintiff",  count: 1,  pct: 1.0,  color: "#199e70" },
  { status: "Lost by Plaintiff", count: 1,  pct: 1.0,  color: "#e66767" }
];

export const TOTAL_CASES    = 96;
export const TOTAL_EXPOSURE = 51.6;   // $B
