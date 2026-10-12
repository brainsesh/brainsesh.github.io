/** Renders the 1200x630 social preview cards at build time. No external services. */
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const font = (pkg: string, file: string) =>
  fs.readFileSync(path.resolve(process.cwd(), 'node_modules/@fontsource', pkg, 'files', file));

const fonts = [
  { name: 'Literata', data: font('literata', 'literata-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Plex', data: font('ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Plex', data: font('ibm-plex-sans', 'ibm-plex-sans-latin-500-normal.woff'), weight: 500 as const, style: 'normal' as const },
];

type Node = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export interface CardInput {
  kicker: string;
  kickerColor: string;
  detail?: string;
  title: string;
  description?: string;
  author: string;
  host: string;
}

export async function renderCard(c: CardInput): Promise<Buffer> {
  const titleSize = c.title.length > 70 ? 52 : c.title.length > 42 ? 60 : 70;
  const tree = h(
    'div',
    { width: '100%', height: '100%', display: 'flex', background: '#ffffff', fontFamily: 'Plex' },
    [
      h('div', { width: 18, height: '100%', background: c.kickerColor }),
      h(
        'div',
        { display: 'flex', flexDirection: 'column', flex: 1, padding: '64px 72px 56px 64px' },
        [
          h('div', { display: 'flex', gap: 28, fontSize: 28, fontWeight: 500 }, [
            h('div', { color: c.kickerColor, display: 'flex' }, c.kicker),
            ...(c.detail ? [h('div', { color: '#625f78', display: 'flex' }, c.detail)] : []),
          ]),
          h(
            'div',
            {
              fontFamily: 'Literata',
              fontWeight: 600,
              fontSize: titleSize,
              lineHeight: 1.12,
              color: '#1d1b2e',
              marginTop: 36,
              letterSpacing: -1,
              display: 'flex',
            },
            c.title,
          ),
          ...(c.description
            ? [
                h(
                  'div',
                  { fontSize: 30, lineHeight: 1.4, color: '#45435a', marginTop: 24, display: 'flex' },
                  c.description.length > 140 ? c.description.slice(0, 137) + '…' : c.description,
                ),
              ]
            : []),
          h('div', { flex: 1, display: 'flex' }),
          h(
            'div',
            {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '2px solid #e4e2ee',
              paddingTop: 24,
            },
            [
              h('div', { fontFamily: 'Literata', fontWeight: 600, fontSize: 30, color: '#1d1b2e', display: 'flex' }, c.author),
              h('div', { fontSize: 24, color: '#625f78', display: 'flex' }, c.host),
            ],
          ),
        ],
      ),
    ],
  );
  const svg = await satori(tree as any, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
