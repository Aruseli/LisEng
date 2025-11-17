'use client';

import { Mic, Square, Loader2 } from 'lucide-react';

interface RecordButtonProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const RecordButton = ({
  isRecording,
  isProcessing,
  onStart,
  onStop,
}: RecordButtonProps) => {
  if (isProcessing) {
    return (
      <button
        disabled
        className="
          flex items-center gap-2 px-6 py-3 rounded-lg
          bg-gray-400 text-white font-medium
          cursor-not-allowed
        "
      >
        <Loader2 className="w-5 h-5 animate-spin" />
        Processing...
      </button>
    );
  }

  if (isRecording) {
    return (
      <button
        onClick={onStop}
        className="
          flex items-center gap-2 px-6 py-3 rounded-lg
          bg-red-500 hover:bg-red-600 text-white font-medium
          transition-colors duration-200 shadow-lg
          animate-pulse
        "
      >
        <Square className="w-5 h-5" />
        Stop Recording
      </button>
    );
  }

  return (
    <button
      onClick={onStart}
      className="
        flex items-center gap-2 px-6 py-3 rounded-lg
        bg-blue-500 hover:bg-blue-600 text-white font-medium
        transition-colors duration-200 shadow-lg
        hover:shadow-xl active:scale-95
      "
    >
      <Mic className="w-5 h-5" />
      Start Recording
    </button>
  );
};