/** Public asset base path — matches next.config.ts basePath */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "/drinksome";

/** Prefix a public asset path with the basePath */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}
