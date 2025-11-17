'use client';

interface AccuracyScoreProps {
  accuracy: number;
}

export const AccuracyScore = ({ accuracy }: AccuracyScoreProps) => {
  const getColorClasses = () => {
    if (accuracy >= 90) return 'text-green-600 bg-green-100';
    if (accuracy >= 75) return 'text-blue-600 bg-blue-100';
    if (accuracy >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMessage = () => {
    if (accuracy >= 90) return '🌟 Превосходно!';
    if (accuracy >= 75) return '😊 Отлично!';
    if (accuracy >= 60) return '👍 Хорошо!';
    return '💪 Попробуй еще раз!';
  };

  return (
    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg ${getColorClasses()}`}>
      <span className="text-3xl font-bold">{accuracy}%</span>
      <span className="text-lg font-medium">{getMessage()}</span>
    </div>
  );
};