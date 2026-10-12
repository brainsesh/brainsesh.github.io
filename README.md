# Lavanya Basavaraju: writing on AI, finance and healthcare

Source for my personal site: paper reviews, engineering guides, talk notes and essays on AI models and engineering, AI in finance and AI in healthcare.

Built with [Astro](https://astro.build), written in Markdown, deployed to GitHub Pages by GitHub Actions. No servers, no database, no monthly bill.

**How to write, publish and maintain the site: see [RUNBOOK.md](./RUNBOOK.md).**

## Quick start

```bash
npm install          # once, after cloning
npm run dev          # local preview at http://localhost:4321 (drafts included)
npm run new -- "My post title" --type paper-review --topic ai-ml
npm run build        # what CI runs: builds the site and the search index into dist/
```

Requires Node.js 22.12 or newer.

## Where things live

| You want to change | Edit |
| --- | --- |
| A post | `src/content/writing/<slug>/index.md` (images sit next to it) |
| Site name, links, newsletter, domain, topics, menu | `src/site.config.ts` |
| Projects page | `src/data/projects.yaml` |
| Reading list on the Papers page | `src/data/reading.yaml` |
| Colors and fonts | `src/styles/global.css` (tokens at the top) |
| Home page copy | `src/pages/index.astro` |
| About page | `src/pages/about.astro` |
| Article layout | `src/layouts/Article.astro` |
| Post templates used by `npm run new` | `templates/` |

## License

Writing and images: [CC BY 4.0](./LICENSE). Code: free to reuse.
