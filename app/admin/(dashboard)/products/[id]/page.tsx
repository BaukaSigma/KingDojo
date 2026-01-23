import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

    if (!product) {
        return notFound();
    }

    return (
        <div className="flex-1 space-y-4">
            <ProductForm initialData={product} />
        </div>
    );
}
