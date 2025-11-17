import { generateJSON } from "@/lib/ai/llm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { topic, level } = await req.json();
        const exercises = await generateJSON<any>(`
            Generate grammar drill exercises for the following request:
            Topic: ${topic}
            Level: ${level}
            Return a JSON object with an "exercises" array.
        `);
        return NextResponse.json({ exercises });
    } catch (error) {
        console.error("Error in grammar-drill API:", error);
        return NextResponse.json({ error: "Failed to generate grammar drill" }, { status: 500 });
    }
}