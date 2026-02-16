"use client";

import React from "react";

interface FileUploadProps {
    type: string;
    accept: string;
    placeholder: string;
    folder: string;
    variant: string;
    onFileChange: (value: string) => void;
}

const FileUpload = ({
    placeholder,
    onFileChange,
}: FileUploadProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file.name);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center justify-center gap-3 w-full h-28 border border-dashed border-white/15 rounded-sm bg-white/2 hover:bg-white/4 transition-colors duration-300 cursor-pointer group">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-accent/10 flex items-center justify-center group-hover:bg-orange-accent/20 transition-colors duration-300">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1V13M1 7H13" stroke="#ff4d00" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="text-xs text-white/40">{placeholder}</span>
                </div>
            </label>
        </div>
    );
};

export default FileUpload;
