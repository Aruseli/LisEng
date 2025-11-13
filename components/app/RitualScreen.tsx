'use client';

interface RitualScreenProps {
  onComplete: () => void;
}

export function RitualScreen({ onComplete }: RitualScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-3xl bg-white shadow-xl p-10 text-center">
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">
          Начни день с маленького ритуала
        </h1>
        <p className="text-gray-600 mb-6">
          Подготовь тетрадь, ручку и сделай глубокий вдох. Вспомни, чему ты научилась вчера, и
          выбери одно маленькое улучшение, которое сделаешь сегодня.
        </p>
        <button
          onClick={onComplete}
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-white font-medium transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
        >
          Ритуал завершён — поехали!
        </button>
      </div>
    </div>
  );
}


