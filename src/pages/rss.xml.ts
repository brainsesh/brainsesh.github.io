import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE, TOPICS } from '../site.config';
import { getPosts, postUrl } from '../lib/posts';

/** Full-site feed. Buttondown can watch this to email subscribers when a post goes live. */
export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.tldr ?? post.data.description,
      pubDate: post.data.pubDate,
      link: postUrl(post),
      categories: [TOPICS[post.data.topic].label, ...post.data.tags],
      author: `${SITE.email} (${SITE.name})`,
    })),
    customData: `<language>en-us</language>`,
  });
}
