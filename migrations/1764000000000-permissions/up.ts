// migrations/1764000000000-permissions/up.ts
import { Hasura } from 'hasyx/lib/hasura/hasura';

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'daily_tasks',
    operation: 'select',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['id','user_id','task_date','stage_id','type','title','description','duration_minutes','status','ai_enabled','ai_context','suggested_prompt','type_specific_payload','created_at','completed_at'],
  });

  await hasura.definePermission({
    schema: 'public',
    table: 'daily_tasks',
    operation: 'update',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    columns: ['status','completed_at','ai_context','suggested_prompt','type_specific_payload','duration_minutes','title','description','ai_enabled'],
  });

  // ...и так для остальных таблиц (users, ai_sessions, stage_progress, progress_metrics, achievements, vocabulary_cards)

  // Инсерт AI-сессий — добавьте пресеты:
  await hasura.definePermission({
    schema: 'public',
    table: 'ai_sessions',
    operation: 'insert',
    role: 'user',
    filter: { user_id: { _eq: 'X-Hasura-User-Id' } },
    check: { user_id: { _eq: 'X-Hasura-User-Id' } },
    set: { user_id: 'X-Hasura-User-Id' },
    columns: ['type','topic','conversation','started_at','feedback','duration_minutes','ended_at'],
  });
}

up();