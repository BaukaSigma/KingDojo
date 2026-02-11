import { StudentForm } from "@/components/admin/students/StudentForm";

export default function NewStudentPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter mb-8">
                Добавить ученика
            </h1>
            <StudentForm />
        </div>
    );
}
