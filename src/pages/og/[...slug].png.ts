import type { APIContext } from 'astro';
import { SITE, TOPICS, POST_TYPES } from '../../site.config';
import { getPosts, type Post } from '../../lib/posts';
import { renderCard } from '../../lib/og';

// Hex values for the cards (CSS variables do not exist inside an image).
const TOPIC_HEX: Record<string, string> = {
  'ai-ml': '#4b3fc4',
  finance: '#08745a',
  healthcare: '#b8323f',
  essays: '#8f5b00',
};

export async function getStaticPaths() {
  const posts = await getPosts();
  return [
    { params: { slug: 'site' }, props: { post: undefined } },
    ...posts.map((post) => ({ params: { slug: post.id }, props: { post } })),
  ];
}

export async function GET({ props, site }: APIContext<{ post?: Post }>) {
  const host = new URL(site!).host;
  const { post } = props;
  const png = post
    ? await renderCard({
        kicker: TOPICS[post.data.topic].label,
        kickerColor: TOPIC_HEX[post.data.topic],
        detail: POST_TYPES[post.data.type],
        title: post.data.title,
        description: post.data.description,
        author: SITE.name,
        host,
      })
    : await renderCard({
        kicker: SITE.name,
        kickerColor: TOPIC_HEX['ai-ml'],
        title: 'AI models and engineering, and how AI is changing finance and healthcare',
        description: 'Paper reviews, engineering guides and notes from talks and lectures.',
        author: SITE.name,
        host,
      });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
}
