import { parse } from 'yaml';
import { z } from 'astro/zod';

/** Parses one of the content/*.yaml files and checks it, naming the file and field on any mistake. */
export function loadYaml<T extends z.ZodType>(raw: string, schema: T, file: string): z.output<T> {
  const result = schema.safeParse(parse(raw));
  if (!result.success) throw new Error(`${file} has a problem:\n${z.prettifyError(result.error)}`);
  return result.data;
}

/** An optional field where an empty box (as the web editor may save it) means "not set". */
export const blank = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), schema.optional());

/** "2026-03" → "Mar 2026", "2019" → "2019". */
export function monthYear(v: string | undefined) {
  if (!v) return '';
  const [y, m] = v.split('-');
  if (!m) return y;
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-GB', { month: 'short' }) + ' ' + y;
}
