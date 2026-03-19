/** Public asset base path — matches next.config.ts basePath */
const BASE_PATH = "/tongshifu";

/** Prefix a public asset path with the basePath */
export function asset(path: string) {
  return `${BASE_PATH}${path}`;
}
