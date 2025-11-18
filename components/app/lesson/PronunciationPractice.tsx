'use client';

import { useMemo, useState } from 'react';

import { useSpeechRecognition } from '@/components/speachComponents/hooks_useSpeechRecognition';
import {
  usePronunciationAnalysis,
  Word,
} from '@/components/speachComponents/hooks_usePronunciationAnalysis';
import { useSpeechSynthesis } from '@/components/speachComponents/hooks_useSpeechSynthesis';
import { RecordButton } from '@/components/speachComponents/PronunciationChecker/RecordButton';
import { AccuracyScore } from '@/components/speachComponents/PronunciationChecker/AccuracyScore';
import { WordDisplay } from '@/components/speachComponents/PronunciationChecker/WordDisplay';
import { Button } from '@/components/app/Buttons/Button';

interface PronunciationPracticeProps {
  script: string;
  targetWords?: string[];
  onResultChange?: (result: {
    accuracy: number | null;
    lowAccuracyWords: string[];
    flaggedWords: string[];
  }) => void;
}

export function PronunciationPractice({
  script,
  targetWords = [],
  onResultChange,
}: PronunciationPracticeProps) {
  const [manualFlags, setManualFlags] = useState<string[]>([]);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const { words, accuracy, analyze, reset } = usePronunciationAnalysis();
  const { speak } = useSpeechSynthesis();

  const { isRecording, isProcessing, recognizedText, startRecording, stopRecording, resetRecognition } =
    useSpeechRecognition({
      onTranscriptionComplete: (text) => {
        analyze(script, text);
        setAnalysisComplete(true);
      },
    });

  const lowAccuracyWords = useMemo(() => {
    return words.filter((word) => word.confidence < 0.95).map((word) => word.text);
  }, [words]);

  const allFlaggedWords = useMemo(() => {
    const unique = new Set<string>([...manualFlags, ...lowAccuracyWords]);
    return Array.from(unique);
  }, [manualFlags, lowAccuracyWords]);

  const handleReset = () => {
    resetRecognition();
    reset();
    setAnalysisComplete(false);
  };

  const toggleManualFlag = (word: string) => {
    setManualFlags((prev) => {
      if (prev.includes(word)) {
        return prev.filter((item) => item !== word);
      }
      return [...prev, word];
    });
  };

  if (analysisComplete && onResultChange) {
    onResultChange({
      accuracy,
      lowAccuracyWords,
      flaggedWords: allFlaggedWords,
    });
  }

  return (
    <section className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Практика произношения</h3>
        <p className="text-sm text-gray-500">
          Прочитай текст вслух, затем посмотри слова, которые нужно подучить.
        </p>
      </header>

      <div className="space-y-4 rounded-2xl bg-indigo-50/60 p-4 text-sm text-indigo-900">
        <p className="font-medium text-indigo-950">Текст для чтения</p>
        <p className="whitespace-pre-line">{script}</p>
        {targetWords.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {targetWords.map((word) => {
              const isFlagged = manualFlags.includes(word);
              return (
                <button
                  key={word}
                  onClick={() => toggleManualFlag(word)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    isFlagged ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-700 shadow'
                  }`}
                >
                  {word} {isFlagged ? '×' : '+'}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <RecordButton
          isRecording={isRecording}
          isProcessing={isProcessing}
          onStart={startRecording}
          onStop={stopRecording}
        />
        {analysisComplete && accuracy !== null && <AccuracyScore accuracy={accuracy} />}
        {analysisComplete && (
          <Button variant="outline" onClick={handleReset}>
            Записать снова
          </Button>
        )}
      </div>

      {recognizedText && (
        <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Распознанный текст
          </p>
          <p>{recognizedText}</p>
        </div>
      )}

      {words.length > 0 && (
        <div className="space-y-3 rounded-2xl border border-gray-100 p-4">
          <p className="text-sm font-semibold text-gray-700">Анализ слов</p>
          <div className="flex flex-wrap">
            {words.map((word: Word) => (
              <WordDisplay key={word.text} word={word} onPlayWord={(text) => speak(text)} />
            ))}
          </div>
          {lowAccuracyWords.length > 0 && (
            <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-semibold">Слова, которые стоит повторить (точность &lt; 95%):</p>
              <p>{lowAccuracyWords.join(', ')}</p>
            </div>
          )}
          {manualFlags.length > 0 && (
            <div className="rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-semibold">Отмеченные тобой слова:</p>
              <p>{manualFlags.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}


