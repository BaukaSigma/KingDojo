import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieName = process.env.ADMIN_COOKIE_NAME || "kingdojo_admin";

    const cookieStore = await cookies();
    cookieStore.delete(cookieName);

    return NextResponse.json({ ok: true });
}
