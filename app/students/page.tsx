import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { StudentsContent } from "@/components/students/StudentsContent";

// Revalidate once per minute
export const revalidate = 60;

export default async function StudentsPage() {
    const supabase = await createClient();

    // Fetch visible students
    const { data: students } = await supabase
        .from("students")
        .select("*")
        .eq("public_visible", true)
        .order("rating_points", { ascending: false });

    // Fetch awards for all visible students
    // We fetch all awards where student_id is in the list of student IDs
    // Since Supabase `in` filter has limits, and we might have many students, 
    // for now we'll fetch all awards related to these students.
    // Optimization: if list is huge, we'd paginate or load awards individually. 
    // Custom Logic: let's get all awards for now, client side filtering is fast enough for hundreds of items.

    let awards: any[] = [];
    if (students && students.length > 0) {
        const studentIds = students.map(s => s.id);
        const { data: awardsData } = await supabase
            .from("student_awards")
            .select("*")
            .in("student_id", studentIds)
            .order("created_at", { ascending: false });

        if (awardsData) awards = awardsData;
    }

    return (
        <main className="min-h-screen bg-[#0B0B0B] text-white">
            <NavBar />
            <div className="pt-32 pb-12 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        Наши Ученики
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
                        Гордость клуба. Путь воина начинается с белого пояса, но не заканчивается никогда.
                    </p>
                </div>

                <StudentsContent
                    students={students || []}
                    awards={awards || []}
                />
            </div>
            <Footer />
        </main>
    );
}
