import React from "react";

interface FormButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    className?: string;
    disabled?: boolean;
}

export default function FormButton({
    children,
    onClick,
    type = "button",
    className = "",
    disabled = false,
}: FormButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`rounded px-4 py-2 text-sm ${className}`}
        >
            {children}
        </button>
    );
}
