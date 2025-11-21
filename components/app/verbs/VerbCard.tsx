'use client';

import { useState } from 'react';
import { Volume2, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '../Buttons/Button';
import { useVerbPronunciation } from '@/hooks/useVerbPronunciation';
import { useVerbFromLesson } from '@/hooks/useVerbFromLesson';
import type { VerbWithProgress } from '@/lib/verbs/verbs-service';

interface VerbCardProps {
  verb: VerbWithProgress;
  onRequestClose: () => void;
  onAddToQueue?: () => void;
}

export function VerbCard({ verb, onRequestClose, onAddToQueue }: VerbCardProps) {
  const { speakInfinitive, speakPast, speakParticiple, isSpeaking, cancel } =
    useVerbPronunciation();
  const { addToReviewQueue, isAdding } = useVerbFromLesson();
  const [showExamples, setShowExamples] = useState(true);

  const handleAddToQueue = async () => {
    try {
      await addToReviewQueue(verb.id);
      onAddToQueue?.();
    } catch (error) {
      console.error('Failed to add to queue:', error);
    }
  };

  const groupNames: Record<number, string> = {
    1: 'Все три формы одинаковые',
    2: 'Вторая и третья формы одинаковые',
    3: 'Паттерн i-a-u',
    4: 'Окончание -d/-t',
    5: 'Окончание -en/-n',
    6: 'Разные формы',
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-start space-x-8 mb-2">
          <div className="text-3xl font-bold text-gray-900">{verb.infinitive}</div>
          {verb.group_number && (
            <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              Группа {verb.group_number}
            </span>
          )}
        </div>
        <p className="text-xl text-gray-700 mb-2">
          {verb.past_simple} — {verb.past_participle}
        </p>
        {verb.group_number && (
          <p className="text-sm text-gray-500">{groupNames[verb.group_number]}</p>
        )}
      </div>

      {/* Pronunciation buttons */}
      <div className="flex gap-2">
            <Button
              onClick={() => speakInfinitive(verb.infinitive)}
              variant="outline"
              size="sm"
              disabled={isSpeaking}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {verb.infinitive}
            </Button>
            <Button
              onClick={() => speakPast(verb.past_simple)}
              variant="outline"
              size="sm"
              disabled={isSpeaking}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {verb.past_simple.split('/')[0]}
            </Button>
            <Button
              onClick={() => speakParticiple(verb.past_participle)}
              variant="outline"
              size="sm"
              disabled={isSpeaking}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {verb.past_participle.split('/')[0]}
            </Button>
            {isSpeaking && (
              <Button onClick={cancel} variant="outline" size="sm">
                Стоп
              </Button>
            )}
      </div>

      {/* Frequency and difficulty */}
      <div className="flex gap-4 text-sm">
            {verb.frequency && (
              <span className="text-gray-600">
                Частотность:{' '}
                <span className="font-medium">
                  {verb.frequency === 'must_know'
                    ? 'ОБЯЗАТЕЛЬНО'
                    : verb.frequency === 'high'
                    ? 'Высокая'
                    : verb.frequency === 'medium'
                    ? 'Средняя'
                    : 'Низкая'}
                </span>
              </span>
            )}
            {verb.difficulty && (
              <span className="text-gray-600">
                Сложность:{' '}
                <span className="font-medium">
                  {verb.difficulty === 'easy' ? 'Легкая' : verb.difficulty === 'medium' ? 'Средняя' : 'Сложная'}
                </span>
              </span>
            )}
      </div>

      {/* Mnemonic tip */}
      {verb.mnemonic_tip && (
            <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">Мнемоника</p>
                  <p className="text-sm text-yellow-800">{verb.mnemonic_tip}</p>
                </div>
              </div>
            </div>
      )}

      {/* Examples */}
      {verb.examples && verb.examples.length > 0 && (
            <div>
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
              >
                <BookOpen className="h-4 w-4" />
                Примеры {showExamples ? '▼' : '▶'}
              </button>
              {showExamples && (
                <div className="space-y-3">
                  {verb.examples.map((example) => (
                    <div
                      key={example.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {example.context || example.form_type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 mb-1">{example.sentence_en}</p>
                      <p className="text-sm text-gray-600 italic">{example.sentence_ru}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
      )}

      {/* Progress */}
      {verb.progress && (
            <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Прогресс</p>
              <div className="space-y-1 text-sm text-blue-800">
                <p>
                  Правильно: {verb.progress.correct_count} / Ошибок:{' '}
                  {verb.progress.incorrect_count}
                </p>
                {verb.progress.mastered && (
                  <p className="text-green-700 font-medium">✓ Освоено</p>
                )}
                {verb.progress.next_review_date && (
                  <p>
                    Следующее повторение:{' '}
                    {new Date(verb.progress.next_review_date).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleAddToQueue}
              disabled={isAdding}
              variant="outline"
              className="flex-1"
            >
              {isAdding ? 'Добавляем...' : 'Повторить позже'}
            </Button>
            <Button onClick={onRequestClose} variant="default" className="flex-1">
              Закрыть
            </Button>
          </div>
    </div>
  );
}

