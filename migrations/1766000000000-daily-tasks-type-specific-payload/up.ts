import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql(`
    ALTER TABLE daily_tasks
      ADD COLUMN IF NOT EXISTS type_specific_payload JSONB;
  `);
}

up();

