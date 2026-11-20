export interface Project {
  title: string
  type: string
  status?: string
  description: string
  tech: string[]
  image?: string
  /** 'contain' voor logo's die niet bijgesneden mogen worden */
  imageFit?: 'cover' | 'contain'
  /** achtergrondkleur achter een logo */
  imageBg?: string
  github?: string
  demo?: string
  /** tekst op de demoknop, standaard "Live demo" */
  demoLabel?: string
  /** wat ik zelf gebouwd heb (handig bij teamprojecten) */
  contributions?: string[]
}

export const projects: Project[] = [
  {
    title: 'MVC Blessé',
    type: 'Eigen project · Webshop',
    description:
      'Bestelsite voor de koekenverkoop van mijn minivoetbalploeg, met bestelformulier, levering of afhalen en online betalen via QR-code.',
    tech: ['Vue', 'Vite', 'Cloudflare Workers'],
    image: '/projects/mvc-blesse.jpg',
    demo: 'https://mvc-blesse.noah-di-silvio7.workers.dev/',
  },
  {
    title: 'Restje',
    type: 'Mobile app',
    status: 'In ontwikkeling',
    description: 'App die een boodschappenlijst maakt op basis van je weekmenu en voorraad.',
    tech: ['Flutter'],
    image: '/projects/restje.png',
  },
  {
    title: "Sven's Frozen Delight",
    type: 'Teamproject · Full-stack',
    description:
      'Webshop voor een ijsmaker met bestelformulier, admin-dashboard en live tracking van de ijskarren via WebSockets.',
    tech: ['TypeScript', 'PHP', 'MySQL', 'WebSockets'],
    image: '/projects/sven-frozen-delight.png',
    github: 'https://github.com/NoahDiSilvio/svens-frozen-delight',
    demo: 'https://noahdisilvio.github.io/svens-frozen-delight/',
  },
  {
    title: 'Kompas Bakkerij',
    type: 'Teamproject · Agile',
    status: 'In ontwikkeling',
    description: 'Een webplatform waarop klanten online brood en gebak kunnen bestellen bij een bakkerij en ophalen op een gekozen dag.',
    tech: ['Vue', 'Laravel'],
    image: '/projects/kompas.png',
    imageFit: 'contain',
    imageBg: '#ffffff',
    demo: 'https://dadij6n7f8tjx.cloudfront.net/',
    demoLabel: 'Bekijk staging',
    contributions: [
      'Contactpagina',
      'Inloggen en registreren',
      'Een bestelling aanpassen',
      'Profielbeheer voor ingelogde gebruikers',
    ],
  },
]
