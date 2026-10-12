export const profile = {
  name: "Joshua Ryle Zamayla Bracho",
  shortName: "Ryle",
  tagline: "Web Developer, Mobile App Developer, Systems Integrator",
  intro:
    "I build business systems end to end: Laravel back ends, Flutter apps that work offline, and integrations with Microsoft 365, Google Maps and NetSuite.",
  location: "Cagayan de Oro, Philippines",
  siteUrl: "https://rylezamayla.github.io",
  links: {
    github: "https://github.com/RyleZamayla",
    linkedin: "https://www.linkedin.com/in/joshua-ryle-bracho-5a7745304/",
    facebook: "https://www.facebook.com/RyleZamayla/",
    instagram: "https://www.instagram.com/rylezamayla/",
  },
  // Stored in two parts and joined only when someone presses "Copy email",
  // so the address never appears in the page's HTML for scrapers to collect.
  emailParts: ["joshuaryle4107", "gmail.com"] as const,
};
