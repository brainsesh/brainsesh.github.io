# Runbook

Everything needed to launch, write for, and look after this site. Keep it next to the code so it stays true.

- [Part 1. One-time launch](#part-1-one-time-launch)
- [Part 2. Writing and publishing](#part-2-writing-and-publishing)
- [Part 3. Routine maintenance](#part-3-routine-maintenance)
- [Part 4. Troubleshooting](#part-4-troubleshooting)
- [Part 5. How the site works](#part-5-how-the-site-works)

---

## Part 1. One-time launch

Do these in order. Steps 1 and 3 must happen before the pull request is merged.

### 1. Switch GitHub Pages to deploy from Actions (before merging)

The old site was published straight from the `main` branch by GitHub's built-in Jekyll. The new site is built by a workflow, so Pages has to be told to wait for it. If you merge first, GitHub's Jekyll will try to publish the raw source code for a few minutes.

1. Open the repository on GitHub, then **Settings > Pages**.
2. Under **Build and deployment > Source**, choose **GitHub Actions**.

The current site stays online; this only changes what publishes the next version.

### 2. Merge the pull request

1. Open the pull request and wait for the **Build and deploy / build** check to turn green.
2. Merge it.
3. Open the **Actions** tab. "Build and deploy" runs again on `main` and the deploy step publishes the site, in about two minutes.
4. Visit https://brainsesh.github.io. Old article links such as `/docs/dualformer/index.html` forward to their new addresses.

### 3. Create the newsletter on Buttondown

1. Sign up at https://buttondown.com and pick the username **brainsesh**. The signup forms on the site already post to `buttondown.com/brainsesh`.
   - If that username is taken, use another and change `newsletter.buttondown` in `src/site.config.ts`.
2. In Buttondown settings, set the newsletter name to **brainsesh**, add a short description, and upload the lightbulb logo if you like.
3. Test it: subscribe from the live site with a second email address and confirm.

Cost: Buttondown is free up to 100 subscribers. Sending emails automatically from the RSS feed is a paid add-on, so start by sending each email by hand (see [Part 2, step 7](#7-tell-subscribers)).

### 4. Point a custom domain at the site

Pick a name you will keep for a decade. Your name is the safest choice: `lavanyabasavaraju.com` or `.dev`. Avoid `.ai` unless you want it badly: it costs several times more per year.

1. **Buy the domain** at a registrar that charges a flat renewal price, such as Cloudflare Registrar, Porkbun or Namecheap. Turn on auto-renew and WHOIS privacy.
2. **Verify it with GitHub first** (prevents anyone else from claiming it on Pages): your GitHub account **Settings > Pages > Add a domain**. GitHub shows a TXT record; add it at your registrar, then click **Verify**.
3. **Add DNS records** at the registrar:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `brainsesh.github.io` |

   If you use Cloudflare DNS, set these records to **DNS only** (grey cloud), not proxied.
4. **Tell GitHub**: repository **Settings > Pages > Custom domain**, enter `yourdomain.com`, Save. Wait for the DNS check to pass (minutes to a few hours), then tick **Enforce HTTPS**.
5. **Tell the site**: in `src/site.config.ts` set `url: 'https://yourdomain.com'`. Commit and push. This fixes canonical links, the RSS feed, the sitemap and social cards.

GitHub automatically forwards `brainsesh.github.io` to the new domain, so no existing link breaks.

### 5. Register with search engines

1. Google Search Console (https://search.google.com/search-console): add a **Domain** property for your domain and verify it with the TXT record it gives you.
2. Submit the sitemap: `https://yourdomain.com/sitemap-index.xml`.
3. Optional: do the same in Bing Webmaster Tools, which can import from Google.

### 6. Optional: privacy-friendly analytics

GoatCounter is free for personal sites and sets no cookies.

1. Sign up at https://www.goatcounter.com and choose a code, for example `lavanya`.
2. Set `analytics.goatcounter: 'lavanya'` in `src/site.config.ts`. Commit and push.

### 7. Finish your profile

- `src/pages/about.astro` has an `EDIT ME` note. Add your current role, background, and any talks or publications.
- In `src/site.config.ts`, fill in `social.github`, `social.x` or `social.scholar` if you want them shown. Empty values are hidden.
- Update your LinkedIn "Website" field to the new domain.

### 8. A note on your old profile photo

The photo on the old site (`images/LB_photo.jpg`) still had the phone's GPS location in its metadata. The new site uses a cropped copy with all metadata removed, and the old file is no longer published once this merge is live. The old file still exists in the repository's history. If that matters to you, ask for help rewriting history with `git filter-repo`; it is a one-time, careful operation.

---

## Part 2. Writing and publishing

### The short version

```bash
npm run new -- "Title of the post" --type paper-review --topic ai-ml
npm run dev                         # write, and preview at localhost:4321
# set draft: false when ready
git add -A && git commit -m "Publish: Title of the post" && git push
```

The site is live about two minutes after the push.

### 1. Set up your computer (once)

1. Install Node.js 22 or newer from https://nodejs.org (the LTS version).
2. Clone and install:

   ```bash
   git clone https://github.com/brainsesh/brainsesh.github.io.git
   cd brainsesh.github.io
   npm install
   ```

3. Recommended editor: VS Code. It will offer the Astro and Markdown extensions listed in `.vscode/extensions.json`.

### 2. Start a post

```bash
npm run new -- "How Banks Use Graph Neural Networks for Fraud" --type deep-dive --topic finance
```

| `--type` | Use for | Template sections |
| --- | --- | --- |
| `paper-review` (default) | One paper, explained | Why it matters, core idea, how it works, experiments, limitations, my take |
| `deep-dive` | A system or industry problem; good for finance and healthcare | Real-world problem, where ML fits, constraints, evaluation, what to watch |
| `guide` | How to build or decide something | Short version, background, steps, trade-offs, references |
| `notes` | A talk, lecture or book | Main argument, ideas worth keeping, agree or disagree |
| `essay` | Everything else | Free form |

| `--topic` | Section |
| --- | --- |
| `ai-ml` (default) | AI & ML: models, papers, lectures, engineering, robotics |
| `finance` | AI in finance. Adds an "education only, not financial advice" note automatically |
| `healthcare` | AI in healthcare. Adds an "education only, not medical advice" note automatically |
| `essays` | Essays (formerly Mindset Reset) |

This creates `src/content/writing/<slug>/index.md` with `draft: true`. The folder name becomes the URL: `/writing/<slug>/`. Pass `--slug short-name` to choose it yourself. Keep slugs short; they are permanent.

No laptop? You can do the same on github.com: **Add file > Create new file**, type `src/content/writing/my-slug/index.md`, paste a template from `templates/`, and upload images into the same folder with **Add file > Upload files**.

### 3. Fill in the frontmatter

The block between the `---` lines at the top. The build checks every field and stops with a clear message if something is missing or misspelled.

```yaml
title: "MatFormer: Train Once, Deploy Infinitely"   # required, under 110 characters
description: "One line shown under the title and in lists."  # required
pubDate: 2026-11-03          # required; a future date publishes on that day
updatedDate: 2026-11-20      # optional; shows "Updated" on the post
topic: ai-ml                 # required: ai-ml, finance, healthcare, essays
type: paper-review           # required: paper-review, deep-dive, guide, notes, essay
tags: [transformers, efficient-inference]   # lowercase, reuse existing tags where possible
source:                      # optional; the paper or talk the piece is about
  kind: paper                # paper, talk, lecture, book, article
  title: "MatFormer: Nested Transformer for Elastic Inference"
  authors: "Devvrit, Kudugunta, Kusupati et al."
  venue: "NeurIPS 2024"
  year: 2024
  url: "https://arxiv.org/abs/2310.07707"
  code: "https://github.com/..."   # optional
tldr: "Two plain sentences shown in the 'In brief' box at the top."
takeaways:                   # optional; shown in a box at the end
  - "First point."
  - "Second point."
featured: false              # true pins it to "Start here" on the home page (one post at a time)
draft: true                  # false to publish
toc: true                    # false hides "On this page" (essays, short posts)
canonical: "https://..."     # only if it was first published elsewhere
```

Paper reviews and talk notes with a `source` appear automatically on the Papers page.

### 4. Write the body

Plain Markdown, plus a few extras:

**Images.** Put the file in the post's folder and reference it with `./`. The text in quotes becomes a caption. The alt text in brackets is read aloud by screen readers, so describe what the image shows.

```md
![MatFormer block with nested FFN neurons](./architecture.png "MatFormer architecture, training and inference")
```

Images are resized and converted to WebP automatically. Use PNG for diagrams and JPG for photos. Keep originals under about 2,000 px wide. Before adding a phone photo, export or screenshot it first so its GPS metadata is not stored in the repository.

**Math.** `$x^2$` inline and `$$ ... $$` on their own lines for display equations. Rendered with KaTeX at build time.

**Callouts.** GitHub-style alerts, which also preview correctly on GitHub:

```md
> [!KEY]
> The one idea to remember.

> [!WARNING] Where this breaks
> Text of the warning.
```

Types: `NOTE`, `TIP`, `KEY`, `IMPORTANT`, `WARNING`, `CAUTION`. Text after the marker replaces the default title.

**Code.** Fenced blocks with a language name get highlighting in light and dark themes:

````md
```python
print("hello")
```
````

**Headings.** Start sections at `##`. `##` and `###` build the table of contents.

**Interactive pieces.** Rename `index.md` to `index.mdx` to import components (charts, demos) into a post. Everything else stays the same.

### 5. Preview

```bash
npm run dev
```

Open http://localhost:4321. Drafts show up locally with a red "Draft" label; they never appear on the live site. The page reloads as you save.

Search only works on a full build: `npm run build && npm run preview`.

### 6. Publish

1. Change `draft: true` to `draft: false`. Check `pubDate`.
2. Commit and push:

   ```bash
   git add -A
   git commit -m "Publish: Title of the post"
   git push
   ```

3. Watch the **Actions** tab. Green means live in about two minutes. Red means the build caught a problem; open the run to see the message (see [Part 4](#part-4-troubleshooting)).

Prefer to check before going live? Push to a branch and open a pull request. The build runs on the pull request without deploying; merge when it is green.

**Scheduling.** Set `pubDate` to a future date with `draft: false` and push. The site rebuilds every morning and the post appears on its date.

### 7. Tell subscribers

On Buttondown's free plan, send each email by hand. It takes five minutes:

1. Buttondown > **Write**. Subject: the post title.
2. Body: two or three sentences on why you wrote it (the `tldr` works), then the link.
3. Send, or schedule it for the same morning.

When the list outgrows the free plan or this becomes a chore, Buttondown's RSS-to-email add-on can watch `https://yourdomain.com/rss.xml` and send automatically.

### 8. Share it

Every post gets a social preview card generated from its title, topic and description, so a plain link on LinkedIn or X looks finished. Check a card at `/og/<slug>.png` on the live site.

### 9. Edit a published post

Edit the Markdown, add or bump `updatedDate`, push. Never rename the folder of a published post: that changes its URL. If you must, add the old path to `redirects` in `astro.config.ts`.

### 10. Projects and reading list

- **Projects**: add entries to `src/data/projects.yaml`. The Projects page and menu link appear as soon as there is one.
- **Reading list**: add entries to `src/data/reading.yaml` with a `shelf` (`reading-now`, `queue`, `favorites`, `books`, `newsletters`, `podcasts`). Each shelf shows on the Papers page once it has an entry.

The build prints a warning while either file is empty. That is expected.

---

## Part 3. Routine maintenance

The site has no server, so there is nothing to patch for security at runtime. Maintenance is mostly keeping tools current so future upgrades stay small.

### Every post (5 minutes)

- [ ] Alt text on every image, captions where useful
- [ ] `description` reads well on its own (it is the search snippet)
- [ ] Tags reuse existing ones (see the list at the bottom of /writing/)
- [ ] Links open; paper `url` points to the abstract page, not a PDF
- [ ] Email subscribers; share the link

### Monthly (15 minutes)

- [ ] Dependabot opens one grouped pull request with updates. If its build is green, merge it. If red, leave it and note it for the quarterly session.
- [ ] Skim analytics: which posts people read, where they came from.
- [ ] Skim Search Console for crawl errors.

### Quarterly (1 hour)

- [ ] Major upgrades. Dependabot skips major versions on purpose. Run `npm outdated`; for Astro, read its upgrade guide (https://docs.astro.build/en/guides/upgrade-to/), then upgrade on a branch:

  ```bash
  git checkout -b upgrade-astro
  npx @astrojs/upgrade
  npm run check && npm run build && npm run preview
  ```

  Open a pull request and merge when green.
- [ ] Check for broken links across the site, for example with https://validator.w3.org/checklink or `npx linkinator https://yourdomain.com --recurse`.
- [ ] Refresh the About page, the reading list and the featured post.

### Yearly

- [ ] Confirm the domain auto-renews and the payment card is current.
- [ ] Review the topics: do they still match what you write? Topics live in `src/site.config.ts`.
- [ ] Back up the newsletter subscriber list (Buttondown > Subscribers > Export).

---

## Part 4. Troubleshooting

| Symptom | Cause and fix |
| --- | --- |
| Build fails: `... does not match the collection schema` | A frontmatter field is missing or misspelled. The message names the file and the field. Common ones: `topic` or `type` not in the allowed list, a date not written as `YYYY-MM-DD`, a `url` without `https://`. |
| Build fails: `Could not find requested image` | The image path is wrong. Paths are relative to the post folder and case-sensitive: `./Figure.PNG` is not `./figure.png`. |
| Pushed, but the site did not change | Check the Actions tab. If there is no run, Settings > Pages > Source must be "GitHub Actions". If the run is green, hard-refresh the browser. |
| Post missing from the live site | `draft` is still `true`, or `pubDate` is in the future. |
| Custom domain shows a certificate warning | HTTPS is still being issued. Wait up to a day, then tick "Enforce HTTPS". Check the DNS records match the table in Part 1. |
| Newsletter form shows an error page | The Buttondown username in `src/site.config.ts` does not match your account. |
| Search box is empty in `npm run dev` | Expected. Search is built from the finished site: `npm run build && npm run preview`. |
| Math shows as raw `$...$` | A `$` was escaped as `\$`, or there is a space right after the opening `$`. |

---

## Part 5. How the site works

**Stack.** Astro builds every page to plain HTML at build time. Posts are Markdown files in content collections with a typed schema (`src/content.config.ts`). KaTeX renders math and Shiki highlights code during the build, so readers download no JavaScript for either. Pagefind builds the search index after the site is built. Social cards are drawn at build time with Satori. GitHub Actions builds on every push and publishes to GitHub Pages.

**Why Astro instead of Hugo or Next.js.** Hugo is faster to build, but its Go templates are harder to customize, and at a few hundred posts build speed does not matter. Next.js (which Philipp Schmid's site runs on) is an application framework; a content site does not need its server features. Astro gives typed content, MDX for interactive posts, and zero JavaScript by default.

**Generated pages.**

| Path | What |
| --- | --- |
| `/` | Home: intro, featured post, latest writing, topics, newsletter |
| `/writing/` and `/writing/<slug>/` | Archive by year; each article |
| `/topics/<topic>/` and `/tags/<tag>/` | Topic hubs and tag lists |
| `/papers/` | Paper reviews and talk notes (automatic) plus the reading list |
| `/projects/`, `/about/`, `/newsletter/`, `/search/` | As named |
| `/rss.xml`, `/sitemap-index.xml`, `/robots.txt`, `/llms.txt` | Feeds and files for search engines and AI assistants |
| `/og/<slug>.png` | Social preview cards |
| `/docs/<old>/` | Redirects from the old site's article URLs |

**Files.**

```
src/
  site.config.ts        name, URL, links, newsletter, topics, menu
  content.config.ts     the frontmatter schema for posts, projects, reading list
  content/writing/      one folder per post
  data/                 projects.yaml, reading.yaml
  pages/                one file per route
  layouts/Article.astro the canonical article template
  components/           header, footer, post list, newsletter form, TOC, source card
  plugins/              Markdown extras: callouts, figure captions
  styles/global.css     design tokens: colors, fonts, type scale
  lib/                  post helpers, social card renderer
templates/              starting points for npm run new
scripts/new-post.mjs    the npm run new command
.github/workflows/      build and deploy
```
