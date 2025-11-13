import dotenv from 'dotenv';
import { Hasura } from 'hasyx/lib/hasura/hasura';
import { readFileSync } from 'fs';
import { join } from 'path';
import { spawn } from 'child_process';

dotenv.config();

/**
 * Парсит SQL файл, разбивая на отдельные запросы
 * Простой подход: разбиваем по ; но сохраняем DO блоки и функции целиком
 */
function parseSQLStatements(sqlContent: string): string[] {
  // Удаляем однострочные комментарии (но сохраняем содержимое строк)
  const lines = sqlContent.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    // Удаляем комментарии в конце строки
    const commentIdx = line.indexOf('--');
    if (commentIdx >= 0) {
      cleanedLines.push(line.substring(0, commentIdx));
    } else {
      cleanedLines.push(line);
    }
  }
  
  const cleaned = cleanedLines.join('\n');
  
  // Разбиваем на блоки: сначала извлекаем DO блоки и функции
  const statements: string[] = [];
  let remaining = cleaned;
  
  // Извлекаем DO блоки
  const doBlockRegex = /DO\s+\$\$[\s\S]*?END\s+\$\$\s*;/gi;
  let doMatch;
  const doBlocks: Array<{ start: number; end: number; content: string }> = [];
  
  while ((doMatch = doBlockRegex.exec(cleaned)) !== null) {
    doBlocks.push({
      start: doMatch.index,
      end: doMatch.index + doMatch[0].length,
      content: doMatch[0].trim(),
    });
  }
  
  // Извлекаем функции
  const funcRegex = /CREATE\s+OR\s+REPLACE\s+FUNCTION[\s\S]*?\$\$\s+LANGUAGE\s+\w+\s*;/gi;
  let funcMatch;
  const functions: Array<{ start: number; end: number; content: string }> = [];
  
  while ((funcMatch = funcRegex.exec(cleaned)) !== null) {
    functions.push({
      start: funcMatch.index,
      end: funcMatch.index + funcMatch[0].length,
      content: funcMatch[0].trim(),
    });
  }
  
  // Объединяем и сортируем блоки
  const allBlocks = [...doBlocks, ...functions].sort((a, b) => a.start - b.start);
  
  // Разбиваем остальное по точкам с запятой
  let lastPos = 0;
  for (const block of allBlocks) {
    // Добавляем текст до блока, разбивая по ;
    const beforeBlock = cleaned.substring(lastPos, block.start);
    const beforeStatements = beforeBlock.split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    statements.push(...beforeStatements);
    
    // Добавляем сам блок
    statements.push(block.content);
    
    lastPos = block.end;
  }
  
  // Добавляем оставшийся текст
  const remainingText = cleaned.substring(lastPos);
  const remainingStatements = remainingText.split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  statements.push(...remainingStatements);
  
  return statements.filter(s => s.length > 0);
}

export default async function up() {
  const hasura = new Hasura({
    url: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_URL!,
    secret: process.env.HASURA_ADMIN_SECRET!,
  });

  // Read SQL from DB.sql
  const dbSqlPath = join(process.cwd(), 'DB.sql');
  const sqlContent = readFileSync(dbSqlPath, 'utf-8');

  // Parse and execute statements
  const statements = parseSQLStatements(sqlContent);
  
  console.log(`📝 Found ${statements.length} SQL statements to execute`);
  
  try {
    // Execute statements in transaction
    await hasura.sql('BEGIN');
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await hasura.sql(statement);
        console.log(`✅ Executed statement ${i + 1}/${statements.length}`);
      } catch (error: any) {
        // Пропускаем ошибки "already exists" для idempotency
        if (error?.message?.includes('already exists') || 
            error?.message?.includes('duplicate key')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
          continue;
        }
        console.error(`❌ Error in statement ${i + 1}:`, statement.substring(0, 100));
        throw error;
      }
    }
    
    await hasura.sql('COMMIT');
    console.log('✅ LisEng schema migration completed successfully');
    
    // Track tables in Hasura and generate schema
    console.log('🔄 Tracking tables in Hasura...');
    const tablesToTrack = [
      'users',
      'study_stages',
      'weekly_structure',
      'daily_tasks',
      'vocabulary_cards',
      'review_history',
      'error_log',
      'ai_sessions',
      'progress_metrics',
      'streaks',
      'achievements',
      'stage_progress',
      'stage_tests',
      'stage_requirements',
    ];
    
    for (const table of tablesToTrack) {
      try {
        await hasura.defineTable({ schema: 'public', table });
        console.log(`  ✅ Tracked table: ${table}`);
      } catch (error: any) {
        // Игнорируем ошибки, если таблица уже отслеживается
        if (error?.message?.includes('already tracked') || 
            error?.message?.includes('already exists')) {
          console.log(`  ⚠️  Table ${table} already tracked`);
        } else {
          console.warn(`  ⚠️  Could not track table ${table}:`, error?.message || error);
        }
      }
    }
    
    // Generate Hasura schema
    console.log('🔄 Generating Hasura schema...');
    await new Promise<void>((resolve, reject) => {
      const child = spawn('npm', ['run', 'schema'], {
        stdio: 'inherit',
        cwd: process.cwd(),
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log('✅ Hasura schema generated successfully');
          resolve();
        } else {
          console.warn(`⚠️  Schema generation exited with code ${code}, but migration completed`);
          resolve(); // Не прерываем миграцию, если схема не сгенерировалась
        }
      });
      
      child.on('error', (err) => {
        console.warn('⚠️  Could not run schema generation:', err.message);
        resolve(); // Не прерываем миграцию
      });
    });
    
  } catch (error) {
    await hasura.sql('ROLLBACK').catch(() => {}); // Ignore rollback errors
    console.error('❌ LisEng schema migration failed:', error);
    throw error;
  }
}

up();