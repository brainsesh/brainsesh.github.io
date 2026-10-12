import type { APIContext } from 'astro';
import { SITE, TOPICS } from '../site.config';
import { getPosts, postUrl } from '../lib/posts';

/** A plain-text index of the site for AI assistants and crawlers (https://llmstxt.org). */
export async function GET(context: APIContext) {
  const posts = await getPosts();
  const site = context.site!;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.description}`,
    '',
    ...Object.entries(TOPICS).flatMap(([key, t]) => {
      const inTopic = posts.filter((p) => p.data.topic === key);
      if (!inTopic.length) return [];
      return [
        `## ${t.label}`,
        '',
        ...inTopic.map((p) => `- [${p.data.title}](${new URL(postUrl(p), site).href}): ${p.data.description}`),
        '',
      ];
    }),
    '## About',
    '',
    `- [About ${SITE.name}](${new URL('/about/', site).href})`,
    `- [RSS feed](${new URL('/rss.xml', site).href})`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
