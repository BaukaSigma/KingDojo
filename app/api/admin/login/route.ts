import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const envUsername = process.env.ADMIN_USERNAME;
        const envPassword = process.env.ADMIN_PASSWORD;

        if (!envUsername || !envPassword) {
            console.error("ADMIN_USERNAME or ADMIN_PASSWORD not set in env");
            return NextResponse.json(
                { message: "Server configuration error" },
                { status: 500 }
            );
        }

        if (username !== envUsername || password !== envPassword) {
            return NextResponse.json(
                { message: "Неверный логин или пароль" },
                { status: 401 }
            );
        }

        const cookieName = process.env.ADMIN_COOKIE_NAME || "kingdojo_admin";
        const maxAgeDays = parseInt(process.env.ADMIN_COOKIE_MAX_AGE_DAYS || "30");
        const maxAge = maxAgeDays * 24 * 60 * 60;

        // Set secure cookie
        const cookieStore = await cookies();
        cookieStore.set({
            name: cookieName,
            value: "authenticated",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: maxAge,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
