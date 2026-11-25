# Open Data Discover

[![Live Site](https://img.shields.io/badge/Live_Site-GitHub_Pages-2ea44f?style=flat-square&logo=github)](https://open-data-discover.github.io/open-data-discover/) [![V1 Project Board](https://img.shields.io/badge/Roadmap-V1_Project_Board-0969da?style=flat-square&logo=github)](https://github.com/users/MaanasArora/projects/2) [![Civic Tech Toronto](https://img.shields.io/badge/Community-Civic_Tech_Toronto-blue?style=flat-square)](https://civictech.ca/)

A discovery tool for **[City of Toronto Open Data](https://open.toronto.ca/)** designed to help people find relationships between data elements across the catalog.

Currently, the project uses a data-driven approach to identify joinable columns across datasets (e.g., columns likely to share the same domain of values), making it easier to see which datasets can be joined (Relational/SQL-style) around a column of interest.

| Quick Links | URL |
| :--- | :--- |
| **Deployment** | [open-data-discover.github.io/open-data-discover](https://open-data-discover.github.io/open-data-discover/) |
| **Project Board** | [github.com/users/MaanasArora/projects/2](https://github.com/users/MaanasArora/projects/2) |

---

## How to jump in

1. Check the **[V1 Project Board](https://github.com/users/MaanasArora/projects/2)** linked above for open issues.
2. **Comment on an issue** you'd like to take on and share a brief note on your approach or plan.
3. **Fork the repository**, create a working branch, and open a Pull Request referencing the issue when ready (marking work-in-progress PRs as **Draft** is encouraged).

### Good places to help right now

- **UI/UX polish and accessibility improvements** (e.g., keyboard navigation, contrast, clear visual cues)
- **Design and visual identity/branding work**
- **Bug fixes**
- **Validation** for the current algorithm
- **User feedback**
- **Refactors and improvements** of the code

### Future ideas (Out of scope for V1)

To keep V1 focused, the following are queued for later rather than V1:

- Major UI/UX overhauls
- Introducing databases or complex modifications/additions to the data model
- Workflows that significantly shift the user goal (such as interleaving across multiple datasets)
- Changes to the core evaluation/ranking approach (such as graph algorithms or language analysis)

> Have an idea in one of these areas? [Open an issue](https://github.com/open-data-discover/open-data-discover/issues/new) to discuss it—we'd love to hear your thoughts and figure out how it could fit into future versions.

---

## Local Development

1. Clone your fork and install dependencies:

```bash
git clone [https://github.com/](https://github.com/)<your-username>/open-data-discover.git
cd open-data-discover
npm install
```

2. Start the server:

```bash
npm run dev
```

---

## License

TBD.