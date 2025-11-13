import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql(`
    ALTER TABLE daily_tasks
      DROP COLUMN IF EXISTS type_specific_payload;
  `);
}

down();

