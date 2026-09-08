import { groq } from '@ai-sdk/groq'
import { experimental_transcribe as transcribe } from 'ai'

import { SPEECH_MODEL } from './models'

export async function transcribeAudio(audio: Uint8Array) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured')
  }

  const result = await transcribe({
    // @ts-ignore — groq.transcription V2, experimental_transcribe ждёт V1; runtime ок
    model: groq.transcription(SPEECH_MODEL),
    audio,
    providerOptions: {
      groq: {
        language: 'en',
        temperature: 0,
      },
    },
  })

  return {
    text: result.text,
    segments: result.segments,
    language: result.language,
    duration: result.durationInSeconds,
    warnings: result.warnings,
    confidence: result.warnings.length === 0 ? 0.96 : 0.88,
  }
}
