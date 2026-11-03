// ====================================================================
// ARROW FLOW: Neon Tech Serverless PostgreSQL Driver
// Agency: Arrow Solutions
// ====================================================================

import { neon } from '@neondatabase/serverless';

export function getNeonSql() {
  const url =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_POOLED ||
    process.env.POSTGRES_URL;

  if (
    !url ||
    url.includes('********') ||
    url.includes('your-neon-database-url') ||
    url.includes('placeholder')
  ) {
    return null;
  }

  return neon(url);
}

export function isNeonConfigured(): boolean {
  return getNeonSql() !== null;
}
