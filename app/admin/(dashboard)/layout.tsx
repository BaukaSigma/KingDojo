import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    // ALLOWLIST CHECK
    // use Service Role to bypass RLS
    const { createServiceClient } = await import("@/lib/supabase/service");
    const serviceClient = createServiceClient();

    const { data: allowed, error: allowError } = await serviceClient
        .from("admin_allowlist")
        .select("email")
        .eq("email", user.email)
        .single();

    // Debug log server-side
    console.log("Admin Allowlist Check:", {
        email: user.email,
        found: !!allowed,
        error: allowError
    });

    if (!allowed) {
        // User is logged in but not allowed
        // Sign them out or show "Unauthorized"
        // We can't sign out from server component easily without a client interaction or route handler, 
        // but we can prevent rendering.
        return (
            <div className="h-screen flex items-center justify-center flex-col gap-4 p-4 text-center">
                <h1 className="text-2xl font-bold text-destructive">Отказано в доступе</h1>
                <p>Ваш email ({user.email}) не в списке администраторов.</p>

                {allowError && (
                    <div className="bg-neutral-100 p-4 rounded text-xs font-mono text-left w-full max-w-lg overflow-auto mt-4">
                        <p className="font-bold">Database Error Details:</p>
                        <pre>{JSON.stringify(allowError, null, 2)}</pre>
                        <p className="mt-2 text-muted-foreground">Looking for: {user.email}</p>
                    </div>
                )}

                <Link href="/" className="underline mt-4">На главную</Link>
                <form action={async () => {
                    "use server";
                    const sb = await createClient();
                    await sb.auth.signOut();
                    redirect("/admin/login");
                }}>
                    <Button variant="outline" size="sm" type="submit" className="mt-2">Выйти и сменить аккаунт</Button>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row text-neutral-100 font-sans">
            <AdminSidebar />
            <main className="flex-1 p-8 overflow-y-auto h-screen scrollbar-hide">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
