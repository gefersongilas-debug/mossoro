import { NextResponse } from "next/server";

const MAKE_WEBHOOK = "https://hook.us1.make.celonis.com/4pvurd3te2u955ark27yqoxclb0bdqxt";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const response = await fetch(MAKE_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
    if (!response.ok) return NextResponse.json({ ok: false }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
}
