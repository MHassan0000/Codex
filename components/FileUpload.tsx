"use client";

import { Image as IKImage, Video as IKVideo, ImageKitProvider, upload } from "@imagekit/next";
import config from "@/lib/config";
import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
    env: {
        imagekit: { publicKey, urlEndpoint },
    },
} = config;

const authenticator = async () => {
    try {
        const response = await fetch(`${config.env.apiEndpoint}/api/auth/imagekit`);

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                `Request failed with status ${response.status}: ${errorText}`,
            );
        }

        const data = await response.json();

        const { signature, expire, token } = data;

        return { token, expire, signature };
    } catch (error: any) {
        throw new Error(`Authentication request failed: ${error.message}`);
    }
};

interface Props {
    type: "image" | "video";
    accept: string;
    placeholder: string;
    folder: string;
    variant: "dark" | "light";
    onFileChange: (filePath: string) => void;
    value?: string;
}

const FileUpload = ({
    type,
    accept,
    placeholder,
    folder,
    variant,
    onFileChange,
    value,
}: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<{ filePath: string | null }>({
        filePath: value ?? null,
    });
    const [progress, setProgress] = useState(0);

    const styles = {
        button:
            variant === "dark"
                ? "bg-dark-300"
                : "bg-light-600 border-gray-100 border",
        placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
        text: variant === "dark" ? "text-light-100" : "text-dark-400",
    };

    const onValidate = (selectedFile: File) => {
        if (type === "image") {
            if (selectedFile.size > 20 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description: "Please upload a file that is less than 20MB in size",
                    variant: "destructive",
                });

                return false;
            }
        } else if (type === "video") {
            if (selectedFile.size > 50 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description: "Please upload a file that is less than 50MB in size",
                    variant: "destructive",
                });
                return false;
            }
        }

        return true;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!onValidate(selectedFile)) return;

        setProgress(0);

        try {
            const authParams = await authenticator();

            const result = await upload({
                file: selectedFile,
                fileName: selectedFile.name,
                folder,
                useUniqueFileName: true,
                publicKey,
                ...authParams,
                onProgress: (event) => {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    setProgress(percent);
                },
            });

            if (result?.filePath) {
                setFile({ filePath: result.filePath });
                onFileChange(result.filePath);

                toast({
                    title: `${type} uploaded successfully`,
                    description: `${result.filePath} uploaded successfully!`,
                });
            }
        } catch (error: any) {
            console.log(error);
            toast({
                title: `${type} upload failed`,
                description: `Your ${type} could not be uploaded. Please try again.`,
                variant: "destructive",
            });
        }

        // Reset file input so same file can be re-selected
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <ImageKitProvider
            urlEndpoint={urlEndpoint}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="hidden"
            />

            <button
                className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 border border-dashed rounded-sm transition-colors duration-300 cursor-pointer",
                    variant === "dark"
                        ? "border-white/15 bg-white/3 hover:bg-white/5"
                        : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                )}
                onClick={(e) => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                }}
            >
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    variant === "dark" ? "bg-orange-accent/10" : "bg-orange-500/10"
                )}>
                    <Upload size={14} className={variant === "dark" ? "text-orange-accent" : "text-orange-500"} />
                </div>

                <p className={cn(
                    "text-sm truncate",
                    variant === "dark" ? "text-white/40" : "text-slate-400"
                )}>
                    {file.filePath ?? placeholder}
                </p>
            </button>

            {progress > 0 && progress !== 100 && (
                <div className={cn(
                    "w-full h-1.5 rounded-full overflow-hidden mt-1",
                    variant === "dark" ? "bg-white/10" : "bg-slate-200"
                )}>
                    <div
                        className={cn(
                            "h-full rounded-full transition-all duration-300",
                            variant === "dark" ? "bg-orange-accent" : "bg-orange-500"
                        )}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {file.filePath &&
                (type === "image" ? (
                    <IKImage
                        alt={file.filePath!}
                        src={file.filePath!}
                        width={500}
                        height={300}
                    />
                ) : type === "video" ? (
                    <IKVideo
                        src={file.filePath!}
                        controls={true}
                        className="h-96 w-full rounded-xl"
                    />
                ) : null)}
        </ImageKitProvider>
    );
};

export default FileUpload;