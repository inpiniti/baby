import { NextRequest, NextResponse } from "next/server";
import history from "@/supabase/history";

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    await history.post(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error posting history:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
