# Editing the website

The site is built with Astro. Pages are in `src/pages/`, the top menu and shared site details are in `src/site.config.ts`, and blog posts are Markdown files in `src/content/writing/`.

## Before you start

1. Open a terminal in the project folder.
2. Run `npm install` if this is a fresh checkout or dependencies are missing.
3. Run `npm run dev` and open the local address it prints (usually `http://localhost:4321/`) to preview your edits. Stop the server with Ctrl+C.
4. When you are ready, run `npm run check` and `npm run build`. Fix any reported errors before publishing.
5. Commit and push your changes to GitHub. The GitHub Actions workflow builds and publishes the site; check the **Actions** tab if the live site does not update.

## Change the About page

1. Open `src/pages/about.astro`.
2. Edit the text inside the page's HTML-like markup. Paragraphs are inside `<p>...</p>`, and section headings are inside `<h2>...</h2>`. Keep the surrounding tags and braces in place.
3. The portrait comes from `src/assets/lavanya.jpg`. Replace that image if needed, keeping the same filename, or update the import near the top of `about.astro` to use a differently named image.
4. The LinkedIn link and contact/social details are read from `src/site.config.ts`. Update `SITE.email`, `SITE.social.linkedin`, and any social profiles you want to show there. Empty optional social links are hidden.

## Change the front page

1. Open `src/pages/index.astro`.
2. Edit the hero headline inside `<h1 class="statement">` and the introduction inside `<p class="intro">`.
3. The portrait is also `src/assets/lavanya.jpg`; see the About steps to replace it.
4. The “Start here” article is automatic: edit a post's `featured` field to `true` in its frontmatter. Keep only one post featured.
5. The latest articles and topic list are generated from your posts and `src/site.config.ts`; they do not need to be manually copied into the page.

## Change the top menu

1. Open `src/site.config.ts` and find `export const NAV`.
2. Each menu item has an `href` (the page address) and `label` (the displayed text). Change the label or address, or copy a line such as `{ href: '/about/', label: 'About' }` and edit both values to add an item.
3. For a new menu destination, first create its page as an `.astro` file in `src/pages/`. For example, `src/pages/contact.astro` becomes `/contact/`. Then add its address to `NAV`.
4. To remove an item from the menu, delete only its line from `NAV`. This does not delete the page itself.

## Add a blog post

1. Create a post from one of the prepared templates:

   ```bash
   npm run new -- "Title of the post" --type paper-review --topic ai-ml
   ```

   Available types: `paper-review`, `deep-dive`, `guide`, `notes`, `essay`. Available topics: `ai-ml`, `finance`, `healthcare`, `essays`. Essays use the `essays` topic automatically. Omit `--type` and `--topic` to use the defaults (`paper-review` and `ai-ml`).

2. The command creates `src/content/writing/<slug>/index.md`. The folder name is part of the permanent URL, `/writing/<slug>/`; use a short, distinctive title or specify a URL slug with `--slug short-name`.
3. Open `index.md`. Fill in the frontmatter between the `---` lines: title, a short description, publication date, topic, type, and any type-specific fields such as the paper `source`. Replace the template text below the second `---` with your post. Keep required fields and use valid YAML indentation.
4. To add images, put them in the same post folder and link them from the Markdown, for example `![Description](./diagram.png "Caption")`.
5. Preview with `npm run dev` and open `/writing/<slug>/`. Drafts appear in local preview but not on the live site. When ready, change `draft: true` to `draft: false`, check the date, then run `npm run check` and `npm run build`.
6. To feature the post on the front page, set `featured: true` and make sure no other post is featured.

You can also copy a matching file from `templates/` into a new folder under `src/content/writing/` and fill it in manually, but `npm run new` handles the folder and starting frontmatter for you.

## Delete a blog post entirely

1. Find the post folder under `src/content/writing/`; the folder name is the last part of its address. For example, `/writing/my-post/` is `src/content/writing/my-post/`.
2. Delete that post's entire folder, including `index.md` and any images used only by that post. Do not delete the shared templates in `templates/`.
3. Run `npm run check` and `npm run build`, then commit and push the deletion.

Deleting the folder removes the post from the site and its generated listings, but its old URL will no longer work. If other sites or posts link to it, update those links or arrange a redirect before deleting it.
