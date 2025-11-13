import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql(`
    ALTER TABLE users
      DROP COLUMN IF EXISTS current_level,
      DROP COLUMN IF EXISTS target_level,
      DROP COLUMN IF EXISTS exam_date,
      DROP COLUMN IF EXISTS start_date,
      DROP COLUMN IF EXISTS study_time,
      DROP COLUMN IF EXISTS study_place,
      DROP COLUMN IF EXISTS daily_goal_minutes,
      DROP COLUMN IF EXISTS reminder_enabled;
  `);
}

down();

