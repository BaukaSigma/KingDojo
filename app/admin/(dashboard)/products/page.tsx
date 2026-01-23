import { createClient } from "@/lib/supabase/server";
import { ProductsClient } from "./ProductsClient";

export const dynamic = 'force-dynamic';

export default async function ProductsValidPage() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

    return <ProductsClient initialProducts={products || []} />;
}
