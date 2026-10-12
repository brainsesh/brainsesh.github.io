import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { TOPIC_KEYS, POST_TYPE_KEYS } from './site.config';

/**
 * Writing: one folder per post, with the text in index.md (or index.mdx) and
 * its images next to it.
 *
 *   src/content/writing/my-post/index.md   ->  /writing/my-post/
 *   src/content/writing/my-post/figure.png
 *
 * If a field below is missing or misspelled, the build stops and tells you which
 * post and which field. That is on purpose: it keeps broken posts off the site.
 */
const writing = defineCollection({
  loader: glob({
    pattern: '**/index.{md,mdx}',
    base: './src/content/writing',
    generateId: ({ entry }) => entry.replace(/\/index\.mdx?$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(110),
      /** One-line subtitle shown under the title and in post lists. */
      description: z.string().max(220),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      topic: z.enum(TOPIC_KEYS),
      type: z.enum(POST_TYPE_KEYS),
      tags: z.array(z.string()).default([]),
      /** The paper, talk, lecture or book a review or notes piece is about. */
      source: z
        .object({
          kind: z.enum(['paper', 'talk', 'lecture', 'book', 'article']).default('paper'),
          title: z.string(),
          authors: z.string().optional(),
          venue: z.string().optional(),
          year: z.number().int().optional(),
          url: z.url(),
          code: z.url().optional(),
        })
        .optional(),
      /** One or two sentences: the whole piece in brief. Shown at the top. */
      tldr: z.string().optional(),
      /** 2 to 5 bullet points shown in a box at the end. */
      takeaways: z.array(z.string()).optional(),
      /** Optional cover image, used for the social preview card. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
      /** Pin to the top of the home page. */
      featured: z.boolean().default(false),
      /** Drafts show up locally with `npm run dev` but never on the live site. */
      draft: z.boolean().default(false),
      /** Show the table of contents. Turn off for short pieces. */
      toc: z.boolean().default(true),
      /** Set if this piece was first published somewhere else (e.g. LinkedIn, Substack). */
      canonical: z.url().optional(),
    }),
});

/** Projects: edit src/data/projects.yaml. The page hides itself while the list is empty. */
const projects = defineCollection({
  loader: file('src/data/projects.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    role: z.string().optional(),
    year: z.number().int().optional(),
    url: z.url().optional(),
    repo: z.url().optional(),
    topic: z.enum(TOPIC_KEYS).optional(),
    tags: z.array(z.string()).default([]),
  }),
});

/** Reading list: edit src/data/reading.yaml. Your own paper reviews are added automatically. */
const reading = defineCollection({
  loader: file('src/data/reading.yaml'),
  schema: z.object({
    id: z.string(),
    shelf: z.enum(['reading-now', 'queue', 'favorites', 'books', 'newsletters', 'podcasts']),
    title: z.string(),
    authors: z.string().optional(),
    year: z.number().int().optional(),
    url: z.url(),
    note: z.string().optional(),
    topic: z.enum(TOPIC_KEYS).optional(),
  }),
});

export const collections = { writing, projects, reading };
