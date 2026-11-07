import { NextResponse } from "next/server";
import { fetchGitHubTelemetry } from "@/lib/github";

export const revalidate = 3600; // Cache on edge/ISR for 1 hour

export async function GET() {
  try {
    const data = await fetchGitHubTelemetry();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("Error fetching GitHub telemetry:", err);
    return NextResponse.json([], { status: 200 });
  }
}
