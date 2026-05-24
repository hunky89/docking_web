import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";

  const res = await fetch(`${BACKEND_URL}/convert`, {
    method: "POST",
    body: req.body,
    headers: { "content-type": contentType },
    // @ts-expect-error duplex required for request body streaming
    duplex: "half",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
