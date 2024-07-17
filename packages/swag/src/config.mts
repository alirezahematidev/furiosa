import chalk from 'chalk';
import { SwagConfig } from './types.mjs';
import { z } from 'zod';

const schema = z.array(
  z.object({
    url: z.string().url(),
    output: z.string(),
    reactHooks: z.boolean().optional().default(false),
    generateEnumAsType: z.boolean().optional().default(false),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    useQuery: z.array(z.string()).optional(),
    useInfiniteQuery: z.array(z.string()).optional(),
    language: z.enum(['javascript', 'typescript']).optional().default('typescript'),
    prefix: z.string().startsWith('/', 'Prefix must starts with /').optional(),
  }),
);

function errorMessageText(issue: z.ZodIssue) {
  const paths = issue.path.filter((p) => typeof p === 'string').join(', ');

  return `ERROR [${paths}]: ${issue.message}\n`;
}

function defineConfig(options: SwagConfig | Array<SwagConfig>) {
  const opt = Array.isArray(options) ? options : [options];

  const { success, error } = schema.safeParse(opt);

  if (!success) {
    const issues = error.issues.map(errorMessageText);

    return void console.log(chalk.redBright(issues.join()));
  }

  return opt;
}

export { defineConfig };
