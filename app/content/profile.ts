export const profile = {
  name: "Joshua Ryle Zamayla Bracho",
  shortName: "Ryle",
  tagline: "Web Developer, Mobile App Developer, Systems Integrator",
  intro:
    "A freelance developer for 5+ years, I build business systems end to end: Laravel back ends, Flutter apps that work offline, and integrations with Microsoft 365, Google Maps and NetSuite.",
  location: "Cagayan de Oro, Philippines",
  siteUrl: "https://rylezamayla.github.io",
  links: {
    github: "https://github.com/RyleZamayla",
    linkedin: "https://www.linkedin.com/in/joshua-ryle-bracho-5a7745304/",
    facebook: "https://www.facebook.com/RyleZamayla/",
    instagram: "https://www.instagram.com/rylezamayla/",
  },
  /** Freelance experience as shown on the site, in Ryle's own words. */
  freelanceYears: "5+",
  /** One-page resume, served from public/. */
  resume: { href: "/Bracho_Joshua_Ryle_Resume.pdf", label: "Resume (PDF)" },
  avatar: {
    src: "/profile.webp",
    width: 640,
    height: 800,
    alt: "Portrait of Joshua Ryle Zamayla Bracho (AI-generated)",
  },
  /** The character card in the hub. Everything here is in Ryle's own words. */
  character: [
    { label: "Class", value: "Systems Integrator" },
    { label: "Base", value: "Cagayan de Oro" },
    { label: "Freelance", value: "5+ years" },
    { label: "Side skill", value: "Motorcycle teardown and engine builds + PC setups & configurations" },
    { label: "Sports", value: "Badminton, pickleball, table tennis, chess" },
    { label: "Status", value: "Defying the odds of my torn ACL and meniscus, accompanied by mild scoliosis" },
  ],
  // Stored in two parts and joined only when someone presses "Copy email",
  // so the address never appears in the page's HTML for scrapers to collect.
  emailParts: ["joshuaryle4107", "gmail.com"] as const,
};
