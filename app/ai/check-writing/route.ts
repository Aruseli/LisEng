import { NextRequest, NextResponse } from "next/server";
import { parseJSONResponse } from "@/lib/ai/llm";
import getAI from "@/lib/ai/llm";
import { WritingFeedback } from "@/types/writing-feedback";

export async function POST(req: NextRequest) {
    try {
        const { text, topic, level } = await req.json();

        const prompt = `
            You are a writing assistant.
            Your task is to check the writing quality of the following text:
            Text: ${text}
            Topic: ${topic}
            Level: ${level}
            Please provide a detailed feedback on the writing, including:
            - Overall quality (e.g., clarity, coherence, conciseness)
            - Specific areas for improvement (e.g., grammar, vocabulary, sentence structure)
            - Suggestions for better phrasing or word choice
            - Any potential errors or typos
            - Overall rating (1-5)
            Format your response as a JSON object with the following keys:
            {
              "overall_quality": "string",
              "specific_areas_for_improvement": "string[]",
              "suggestions": "string[]",
              "errors_or_typos": "string[]",
              "rating": "number"
            }
        `;

        const ai = getAI();
        const response = await ai.query({ role: 'user', content: prompt });

        if (!response) {
            console.error('[API /ai/check-writing] Empty response for prompt:', prompt.substring(0, 300));
            throw new Error("AI returned an empty response.");
        }

        const feedback = parseJSONResponse<WritingFeedback>(response);

        return NextResponse.json(feedback);
    } catch (error) {
        console.error('AI Writing Check Error:', error);
        return NextResponse.json(
            { error: 'Failed to check writing' },
            { status: 500 }
        );
    }
}
