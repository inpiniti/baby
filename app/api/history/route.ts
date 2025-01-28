import { NextResponse } from "next/server";
import history from "@/supabase/history";

export async function GET() {
  const res = await history.get();
  return NextResponse.json(res, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      "Surrogate-Control": "no-store",
    },
  });
}
