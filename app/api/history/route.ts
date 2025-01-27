import { NextResponse } from "next/server";
import history from "@/supabase/history";

export async function GET() {
  const res = await history.get();
  return NextResponse.json(res);
}
