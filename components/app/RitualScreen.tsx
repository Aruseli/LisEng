'use client';

import { Ritual } from "../icons/Ritual";
import { Button } from "./Buttons/Button";

interface RitualScreenProps {
  onComplete: () => void;
}

export function RitualScreen({ onComplete }: RitualScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full rounded-3xl bg-white shadow-xl p-6 text-center">
        <div className="flex flex-col items-center justify-center relative">
          <Ritual className="size-full mb-4 absolute opacity-20" />
          <div className="relative z-10">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">
              Начни день с маленького ритуала
            </h1>
            <p className="text-gray-600 mb-6">
              Подготовь тетрадь, ручку и сделай глубокий вдох. Вспомни, чему ты научилась вчера, и
              выбери одно маленькое улучшение, которое сделаешь сегодня.
            </p>
          </div>
        </div>
        <Button
          onClick={onComplete}
          variant='default'
        >
          Ритуал завершён — поехали!
        </Button>
      </div>
    </div>
  );
}


