export const profile = {
  name: "Joshua Ryle Zamayla Bracho",
  shortName: "Ryle",
  tagline: "Web Developer, Mobile App Developer, Systems Integrator",
  intro:
    "I build the systems that keep field work moving: Laravel back ends, Flutter apps that work offline, and the integrations that connect them to Microsoft 365, maps and finance tools. I also build small tools that give me back time.",
  location: "Cagayan de Oro, Philippines",
  siteUrl: "https://rylezamayla.github.io",
  links: {
    github: "https://github.com/RyleZamayla",
    linkedin: "https://www.linkedin.com/in/joshua-ryle-bracho-5a7745304/",
  },
  // Stored in two parts and joined only when someone presses "Copy email",
  // so the address never appears in the page's HTML for scrapers to collect.
  emailParts: ["joshuaryle4107", "gmail.com"] as const,
};
