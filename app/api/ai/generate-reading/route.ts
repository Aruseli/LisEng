import { generateJSON } from "@/lib/ai/llm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { topic, level } = await req.json();
        const task = await generateJSON<any>(`
            Generate a reading task for the following request:
            Topic: ${topic}
            Level: ${level}
            Return a JSON object with the reading task details.
        `);
        return NextResponse.json({ task });
    } catch (error) {
        console.error("Error generating reading task:", error);
        return NextResponse.json({ error: "Failed to generate reading task" }, { status: 500 });
    }
}