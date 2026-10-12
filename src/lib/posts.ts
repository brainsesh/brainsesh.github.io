import { getCollection, type CollectionEntry } from 'astro:content';
import getReadingTime from 'reading-time';
import { TOPICS, type TopicKey } from '../site.config';

export type Post = CollectionEntry<'writing'>;

/**
 * Posts that should appear on the site.
 * - Drafts appear only while running `npm run dev`.
 * - Posts dated in the future appear once that date arrives (the site rebuilds daily).
 */
export async function getPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection('writing', ({ data }) => {
    if (import.meta.env.DEV) return true;
    return !data.draft && data.pubDate.valueOf() <= now;
  });
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const postUrl = (post: Post) => `/writing/${post.id}/`;

export const topicUrl = (topic: TopicKey) => `/topics/${topic}/`;

export const tagSlug = (tag: string) =>
  tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const tagUrl = (tag: string) => `/tags/${tagSlug(tag)}/`;

export function topicOf(post: Post) {
  return TOPICS[post.data.topic];
}

/** Groups posts by year, newest first: [[2026, [...]], [2025, [...]]] */
export function groupByYear(posts: Post[]) {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear();
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()];
}

/** Every tag in use with its post count, most used first. */
export function tagCounts(posts: Post[]) {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const key = tagSlug(tag);
      const entry = counts.get(key) ?? { tag, count: 0 };
      entry.count += 1;
      counts.set(key, entry);
    }
  }
  return [...counts.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Up to `n` other posts, same topic first, then shared tags, then newest. */
export function relatedPosts(post: Post, all: Post[], n = 3) {
  const tags = new Set(post.data.tags.map(tagSlug));
  return all
    .filter((p) => p.id !== post.id)
    .map((p) => ({
      p,
      score:
        (p.data.topic === post.data.topic ? 10 : 0) +
        p.data.tags.filter((t) => tags.has(tagSlug(t))).length * 3,
    }))
    .sort((a, b) => b.score - a.score || b.p.data.pubDate.valueOf() - a.p.data.pubDate.valueOf())
    .slice(0, n)
    .map(({ p }) => p);
}

const dateFmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const shortFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });

export const formatDate = (d: Date) => dateFmt.format(d);
export const formatShortDate = (d: Date) => shortFmt.format(d);

/** Estimated minutes to read, from the post's Markdown source. */
export function minutesRead(post: Post) {
  const text = (post.body ?? '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\$\$[\s\S]*?\$\$/g, '');
  return Math.max(1, Math.round(getReadingTime(text).minutes));
}
