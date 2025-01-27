import { NextRequest, NextResponse } from "next/server";
import history from "@/supabase/history";

export async function GET(request: NextRequest) {
  const res = await history.get();

  console.log("res", res);

  return NextResponse.json(res);
}
