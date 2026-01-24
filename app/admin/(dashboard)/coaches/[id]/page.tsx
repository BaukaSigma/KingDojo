import { createClient } from "@/lib/supabase/server";
import { CoachForm } from "@/components/admin/coaches/CoachForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditCoachPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: coach } = await supabase
        .from("coaches")
        .select("*")
        .eq("id", params.id)
        .single();

    if (!coach) {
        notFound();
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <Link
                    href="/admin/coaches"
                    className="text-neutral-500 hover:text-white flex items-center gap-2 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Назад к списку
                </Link>
                <h1 className="text-3xl font-black uppercase text-white">Редактировать тренера</h1>
            </div>

            <CoachForm initialData={coach} />
        </div>
    );
}
