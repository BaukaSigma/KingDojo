import { StudentForm } from "@/components/admin/students/StudentForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditStudentPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch student
    const { data: student } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

    if (!student) {
        notFound();
    }

    // Fetch awards
    const { data: awards } = await supabase
        .from("student_awards")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false });

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter mb-8">
                Редактирование
            </h1>
            <StudentForm initialData={student} initialAwards={awards || []} />
        </div>
    );
}
