import { NextResponse } from "next/server";
import { predictPostPerformance } from "@/lib/predictive/predict";
import type { PredictRequest } from "@/lib/predictive/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PredictRequest;

    if (!body.caption?.trim()) {
      return NextResponse.json(
        { error: "Caption is required" },
        { status: 400 }
      );
    }

    const result = await predictPostPerformance(body);
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Prediction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
