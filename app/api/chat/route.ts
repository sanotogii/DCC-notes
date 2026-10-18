import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { prompt, channel_id } = await req.json();
  const url = process.env.N8N_WEBHOOK_URL;

  if (!prompt || !channel_id) {
    return NextResponse.json({ type: "text", message: "Missing prompt." }, { status: 400 });
  }
  if (!url) {
    return NextResponse.json({ type: "text", message: "An error happened on our side." }, { status: 500 });
  }

      try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, channel_id }),
      signal: AbortSignal.timeout(55_000),
    });
    const text = await res.text();
    return new NextResponse(text, {
      status: res.ok ? 200 : 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { type: "text", message: "Couldn't reach the workflow. Is it active?" },
      { status: 502 }
    );

  }
}
