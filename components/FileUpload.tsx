"use client";

import { IKImage, ImageKitProvider, IKUpload, IKVideo } from "imagekitio-next";
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
    const ikUploadRef = useRef(null);
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

    const onError = (error: any) => {
        console.log(error);

        toast({
            title: `${type} upload failed`,
            description: `Your ${type} could not be uploaded. Please try again.`,
            variant: "destructive",
        });
    };

    const onSuccess = (res: any) => {
        setFile(res);
        onFileChange(res.filePath);

        toast({
            title: `${type} uploaded successfully`,
            description: `${res.filePath} uploaded successfully!`,
        });
    };

    const onValidate = (file: File) => {
        if (type === "image") {
            if (file.size > 20 * 1024 * 1024) {
                toast({
                    title: "File size too large",
                    description: "Please upload a file that is less than 20MB in size",
                    variant: "destructive",
                });

                return false;
            }
        } else if (type === "video") {
            if (file.size > 50 * 1024 * 1024) {
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

    return (
        <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
        >
            <IKUpload
                ref={ikUploadRef}
                onError={onError}
                onSuccess={onSuccess}
                useUniqueFileName={true}
                validateFile={onValidate}
                onUploadStart={() => setProgress(0)}
                onUploadProgress={({ loaded, total }) => {
                    const percent = Math.round((loaded / total) * 100);

                    setProgress(percent);
                }}
                folder={folder}
                accept={accept}
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
                    if (ikUploadRef.current) {
                        // @ts-ignore
                        ikUploadRef.current?.click();
                    }
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
                        path={file.filePath!}
                        width={500}
                        height={300}
                    />
                ) : type === "video" ? (
                    <IKVideo
                        path={file.filePath!}
                        controls={true}
                        className="h-96 w-full rounded-xl"
                    />
                ) : null)}
        </ImageKitProvider>
    );
};

export default FileUpload;