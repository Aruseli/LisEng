import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.sql(`
    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS current_level VARCHAR(10) DEFAULT 'A2',
      ADD COLUMN IF NOT EXISTS target_level VARCHAR(10) DEFAULT 'B2',
      ADD COLUMN IF NOT EXISTS exam_date DATE,
      ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE,
      ADD COLUMN IF NOT EXISTS study_time TIME DEFAULT '16:00:00',
      ADD COLUMN IF NOT EXISTS study_place VARCHAR(255),
      ADD COLUMN IF NOT EXISTS daily_goal_minutes INTEGER DEFAULT 40,
      ADD COLUMN IF NOT EXISTS reminder_enabled BOOLEAN DEFAULT true;
  `);
}

up();

