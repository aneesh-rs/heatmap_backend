import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { join } from 'path';
import Handlebars from 'handlebars';

const compiledTemplates = new Map<string, HandlebarsTemplateDelegate>();

export function resolveTemplateDir(): string {
  const candidates = [
    join(__dirname, '..', 'templates'),
    join(process.cwd(), 'dist', 'templates'),
    join(process.cwd(), 'src', 'templates'),
  ];

  for (const dir of candidates) {
    if (existsSync(dir)) {
      return dir;
    }
  }

  return join(__dirname, '..', 'templates');
}

export async function renderTemplate(
  name: string,
  context: Record<string, unknown>,
): Promise<string> {
  let compile = compiledTemplates.get(name);
  if (!compile) {
    const filePath = join(resolveTemplateDir(), `${name}.hbs`);
    const source = await readFile(filePath, 'utf8');
    compile = Handlebars.compile(source, { strict: true });
    compiledTemplates.set(name, compile);
  }

  return compile(context);
}
