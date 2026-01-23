"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "src"> {
    src?: string | null;
    fallbackText?: string;
}

export function SafeImage({ src, alt, className, fallbackText, ...props }: SafeImageProps) {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div
                className={cn(
                    "flex items-center justify-center bg-neutral-100 text-neutral-300 border border-neutral-200 overflow-hidden",
                    className
                )}
            >
                <span className="text-xs font-medium uppercase tracking-widest px-4 text-center">
                    {fallbackText || alt || "No Image"}
                </span>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
}
