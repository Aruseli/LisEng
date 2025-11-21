import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';

dotenv.config();

const schema = 'public';

const tables: Record<string, Array<{ operation: 'select' | 'insert' | 'update' | 'delete'; role: string }>> = {
  irregular_verbs: [{ operation: 'select', role: 'user' }],
  verb_examples: [{ operation: 'select', role: 'user' }],
  verb_learning_progress: [
    { operation: 'select', role: 'user' },
    { operation: 'insert', role: 'user' },
    { operation: 'update', role: 'user' },
  ],
  verb_practice_sessions: [
    { operation: 'select', role: 'user' },
    { operation: 'insert', role: 'user' },
  ],
  verb_review_history: [
    { operation: 'select', role: 'user' },
    { operation: 'insert', role: 'user' },
  ],
};

export default async function down() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  for (const [table, perms] of Object.entries(tables)) {
    for (const permission of perms) {
      try {
        await hasura.deletePermission({
          schema,
          table,
          operation: permission.operation,
          role: permission.role,
        });
        console.log(`🗑️  Removed ${permission.operation} permission for ${permission.role} on ${table}`);
      } catch (error) {
        console.warn(
          `⚠️  Failed to remove ${permission.operation} permission for ${permission.role} on ${table}:`,
          (error as Error)?.message ?? error
        );
      }
    }
  }

  console.log('✅ Irregular verbs permissions roll back completed');
}

down();


