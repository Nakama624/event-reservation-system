import Link from "next/link";
import React from "react";

interface LinkButtonProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export default function LinkButton({
    href,
    children,
    className = "",
}: LinkButtonProps) {
    return (
        <Link
            href={href}
            className={`inline-block rounded px-4 py-2 text-sm ${className}`}
        >
            {children}
        </Link>
    );
}
