import { useState, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onTranscriptionComplete?: (text: string) => void;
  onError?: (error: string) => void;
}

interface UseSpeechRecognitionReturn {
  isRecording: boolean;
  isProcessing: boolean;
  recognizedText: string;
  error: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  resetRecognition: () => void;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {}
): UseSpeechRecognitionReturn => {
  const { onTranscriptionComplete, onError } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setRecognizedText('');

      // Запрос доступа к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000, // Оптимально для Whisper
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Определяем поддерживаемый MIME type
      const mimeType = 
        MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
          ? 'audio/mp4'
          : 'audio/wav';

      // Создаем MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType,
      });

      audioChunksRef.current = [];

      // Обработчик получения данных
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // Обработчик остановки записи
      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);

        try {
          // Создаем Blob из записанных чанков
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

          // Создаем FormData для отправки
          const formData = new FormData();
          const fileName = `recording-${Date.now()}.${mimeType.split('/')[1].split(';')[0]}`;
          formData.append('audio', audioBlob, fileName);

          // Отправляем на сервер для транскрипции
          const response = await fetch('/api/listening/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.details || errorData.error || 'Transcription failed');
          }

          const result = await response.json();
          
          setRecognizedText(result.text);
          
          if (onTranscriptionComplete) {
            onTranscriptionComplete(result.text);
          }

        } catch (err: any) {
          const errorMessage = err.message || 'Failed to transcribe audio';
          setError(errorMessage);
          
          if (onError) {
            onError(errorMessage);
          }
          
          console.error('Transcription error:', err);
        } finally {
          setIsProcessing(false);
          
          // Останавливаем все треки
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      };

      // Обработчик ошибок MediaRecorder
      mediaRecorderRef.current.onerror = (event: any) => {
        const errorMessage = `Recording error: ${event.error?.message || 'Unknown error'}`;
        setError(errorMessage);
        setIsRecording(false);
        
        if (onError) {
          onError(errorMessage);
        }
      };

      // Начинаем запись
      mediaRecorderRef.current.start();
      setIsRecording(true);

    } catch (err: any) {
      const errorMessage = 
        err.name === 'NotAllowedError'
          ? 'Microphone access denied. Please allow microphone access in your browser settings.'
          : err.name === 'NotFoundError'
          ? 'No microphone found. Please connect a microphone and try again.'
          : `Failed to start recording: ${err.message}`;
      
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
      
      console.error('Failed to start recording:', err);
    }
  }, [onTranscriptionComplete, onError]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const resetRecognition = useCallback(() => {
    setRecognizedText('');
    setError(null);
    setIsProcessing(false);
    audioChunksRef.current = [];
  }, []);

  return {
    isRecording,
    isProcessing,
    recognizedText,
    error,
    startRecording,
    stopRecording,
    resetRecognition,
  };
};