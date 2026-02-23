import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, GraduationCap, Medal } from "lucide-react";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function AdminStudentsPage() {
    const supabase = await createClient();
    const { data: students } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

    async function deleteStudent(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        const supabase = await createClient();
        await supabase.from("students").delete().eq("id", id);
        revalidatePath("/admin/students");
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black uppercase text-white tracking-tighter">
                    Ученики
                </h1>
                <Link href="/admin/students/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                        <Plus size={20} />
                        Добавить
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {students?.map((student) => (
                    <div
                        key={student.id}
                        className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-colors flex flex-col"
                    >
                        <div className="relative h-48 bg-black">
                            {student.photo_url ? (
                                <Image
                                    src={student.photo_url}
                                    alt={student.display_name}
                                    fill
                                    className="object-cover"
                                    style={{
                                        objectPosition: `${student.photo_pos_x ?? 50}% ${student.photo_pos_y ?? 50}%`,
                                        transformOrigin: `${student.photo_pos_x ?? 50}% ${student.photo_pos_y ?? 50}%`,
                                        transform: `scale(${(student.photo_scale ?? 100) / 100})`
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                                    <GraduationCap className="w-16 h-16 text-neutral-800" />
                                </div>
                            )}

                            {!student.public_visible && (
                                <div className="absolute top-2 right-2 bg-red-500/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase">
                                    Скрыт
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                                <h3 className="text-white font-bold text-lg leading-tight">{student.display_name}</h3>
                                <p className="text-primary text-sm font-medium">{student.belt || "Без пояса"}</p>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col gap-2">
                            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-400 mb-2">
                                <div>
                                    <span className="block text-neutral-500 uppercase text-[10px]">Рейтинг</span>
                                    <span className="text-white font-bold">{student.rating_points}</span>
                                </div>
                                <div>
                                    <span className="block text-neutral-500 uppercase text-[10px]">Посещаемость</span>
                                    <span className="text-white font-bold">
                                        {student.total_classes > 0
                                            ? Math.round((student.attended_classes / student.total_classes) * 100)
                                            : 0}%
                                    </span>
                                </div>
                            </div>

                            <div className="mt-auto flex items-center gap-2 pt-4 border-t border-white/5">
                                <Link href={`/admin/students/${student.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-primary hover:border-primary/50">
                                        <Pencil size={16} className="mr-2" />
                                        Изменить
                                    </Button>
                                </Link>
                                <form action={deleteStudent}>
                                    <input type="hidden" name="id" value={student.id} />
                                    <Button variant="outline" size="sm" type="submit" className="bg-transparent border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 px-3">
                                        <Trash2 size={16} />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!students || students.length === 0) && (
                <div className="text-center py-20 text-neutral-500">
                    <div className="bg-neutral-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <GraduationCap className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="text-xl font-bold mb-2">Список учеников пуст</p>
                    <p className="max-w-md mx-auto mb-6">Добавьте учеников, чтобы отслеживать их прогресс и достижения.</p>
                </div>
            )}
        </div>
    );
}
