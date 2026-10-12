#!/usr/bin/env node
/**
 * Start a new post from a template.
 *
 *   npm run new -- "Title of my post"
 *   npm run new -- "Title of my post" --type paper-review --topic finance
 *
 * Types:  paper-review, deep-dive, guide, notes, essay   (default: paper-review)
 * Topics: ai-ml, finance, healthcare, essays              (default: ai-ml)
 *
 * Creates src/content/writing/<slug>/index.md with draft: true.
 */
import fs from 'node:fs';
import path from 'node:path';

const TYPES = ['paper-review', 'deep-dive', 'guide', 'notes', 'essay'];
const TOPICS = ['ai-ml', 'finance', 'healthcare', 'essays'];

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const title = args.find((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));

if (!title) {
  console.log('Usage: npm run new -- "Title of my post" [--type paper-review] [--topic ai-ml] [--slug short-name]');
  console.log(`Types:  ${TYPES.join(', ')}`);
  console.log(`Topics: ${TOPICS.join(', ')}`);
  process.exit(1);
}

const type = flag('type', 'paper-review');
const topic = type === 'essay' ? 'essays' : flag('topic', 'ai-ml');
if (!TYPES.includes(type)) {
  console.error(`Unknown type "${type}". Use one of: ${TYPES.join(', ')}`);
  process.exit(1);
}
if (!TOPICS.includes(topic)) {
  console.error(`Unknown topic "${topic}". Use one of: ${TOPICS.join(', ')}`);
  process.exit(1);
}

const slug =
  flag('slug') ??
  title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .split('-')
    .slice(0, 8)
    .join('-');

const dir = path.join('src/content/writing', slug);
if (fs.existsSync(dir)) {
  console.error(`A post already exists at ${dir}. Pick another title or pass --slug.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const template = fs.readFileSync(path.join('templates', `${type}.md`), 'utf8');
const body = template
  .replaceAll('{{title}}', title.replaceAll('"', '\\"'))
  .replaceAll('{{date}}', today)
  .replaceAll('{{year}}', today.slice(0, 4))
  .replaceAll('{{topic}}', topic);

fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'index.md'), body);

console.log(`Created ${path.join(dir, 'index.md')}`);
console.log(`Preview: run "npm run dev" and open http://localhost:4321/writing/${slug}/`);
console.log('It stays hidden on the live site until you change "draft: true" to "draft: false".');
