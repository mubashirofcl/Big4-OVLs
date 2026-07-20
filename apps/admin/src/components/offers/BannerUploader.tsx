"use client";

import { useState, useRef, useCallback } from "react";
import Cropper, { type Area } from "react-easy-crop";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/ToastProvider";

interface BannerUploaderProps {
    currentImage?: string;
    currentImageMobile?: string;
    onImageChange: (url: string) => void;
    onMobileImageChange: (url: string) => void;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (err) => reject(err));
        img.setAttribute("crossOrigin", "anonymous");
        img.src = url;
    });
}

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve) => {
        canvas.toBlob(
            (blob) => {
                resolve(new File([blob!], "banner-cropped.jpg", { type: "image/jpeg" }));
            },
            "image/jpeg",
            0.92
        );
    });
}

async function compressImage(file: File): Promise<File> {
    const options = {
        maxSizeMB: 0.4, // Max 400KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
        fileType: "image/jpeg" as const,
    };
    return imageCompression(file, options);
}

export function BannerUploader({
    currentImage,
    currentImageMobile,
    onImageChange,
    onMobileImageChange,
    onUploadStart,
    onUploadEnd,
}: BannerUploaderProps) {
    const { toast } = useToast();
    const [image, setImage] = useState<string | null>(currentImage || null);
    const [mobileImage, setMobileImage] = useState<string | null>(currentImageMobile || null);
    
    const [uploading, setUploading] = useState(false);
    const [dragOverDesktop, setDragOverDesktop] = useState(false);
    const [dragOverMobile, setDragOverMobile] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [pendingUploadType, setPendingUploadType] = useState<"DESKTOP" | "MOBILE" | null>(null);

    const [cropSrc, setCropSrc] = useState<string | null>(null);
    const [cropStep, setCropStep] = useState<"DESKTOP" | "MOBILE" | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels);
    }, []);

    const uploadFile = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
        });

        const data = await res.json();
        if (!res.ok || !data.success) return null;

        return data.data.url;
    };

    const handleFiles = (files: FileList | File[]) => {
        const fileArr = Array.from(files);
        if (fileArr.length === 0) return;

        const file = fileArr[0];
        if (!ALLOWED_TYPES.includes(file.type)) {
            toast(`"${file.name}" is not a valid image`, "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setCropSrc(e.target?.result as string);
            setCropStep(pendingUploadType || "DESKTOP");
            setCrop({ x: 0, y: 0 });
            setZoom(1);
            setCroppedArea(null);
            setPendingUploadType(null);
        };
        reader.readAsDataURL(file);
    };

    const handleCropConfirm = async () => {
        if (!cropSrc || !croppedArea || !cropStep) return;

        const croppedFile = await getCroppedImg(cropSrc, croppedArea);

        setUploading(true);
        onUploadStart?.();
        
        let processedFile = croppedFile;
        try {
            processedFile = await compressImage(croppedFile);
        } catch {
            // ignore
        }

        const url = await uploadFile(processedFile);
        setUploading(false);
        onUploadEnd?.();

        if (url) {
            if (cropStep === "DESKTOP") {
                setImage(url);
                onImageChange(url);
                toast("Desktop banner uploaded successfully", "success");
                setCropStep(null);
                setCropSrc(null);
            } else {
                setMobileImage(url);
                onMobileImageChange(url);
                toast("Mobile banner uploaded successfully", "success");
                setCropStep(null);
                setCropSrc(null);
            }
        } else {
            toast("Failed to upload banner", "error");
        }
    };

    const handleSkipMobile = () => {
        setCropStep(null);
        setCropSrc(null);
        toast("Skipped mobile crop", "info");
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
                {/* Desktop Banner Display */}
                <div style={{ flex: "1 1 300px" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                        Desktop Banner (3:1)
                    </label>
                    {image ? (
                        <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-default)", aspectRatio: "3/1" }}>
                            <img src={image} alt="Desktop Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                                type="button"
                                onClick={() => {
                                    setImage(null);
                                    onImageChange("");
                                }}
                                style={{
                                    position: "absolute", top: 8, right: 8, width: 28, height: 28,
                                    borderRadius: "50%", border: "none", background: "var(--overlay-heavy)",
                                    color: "var(--text-inverse)", fontSize: 16, cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center"
                                }}
                                title="Remove"
                            >×</button>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                if (!uploading) {
                                    setPendingUploadType("DESKTOP");
                                    fileRef.current?.click();
                                }
                            }}
                            onDragOver={(e) => { e.preventDefault(); setDragOverDesktop(true); }}
                            onDragLeave={() => setDragOverDesktop(false)}
                            onDrop={(e) => { 
                                e.preventDefault(); 
                                setDragOverDesktop(false); 
                                if (!uploading) {
                                    setPendingUploadType("DESKTOP");
                                    handleFiles(e.dataTransfer.files); 
                                }
                            }}
                            style={{
                                border: `2px dashed ${dragOverDesktop ? "var(--hero-bg)" : "var(--border-strong)"}`,
                                borderRadius: 12, padding: "40px 20px", textAlign: "center",
                                cursor: uploading ? "wait" : "pointer", background: dragOverDesktop ? "var(--skeleton-base)" : "var(--bg-hover)",
                                aspectRatio: "3/1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}
                        >
                            {uploading ? (
                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Uploading banner…</div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: 28, marginBottom: 4 }}>📷</div>
                                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}>Upload Desktop Image</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Banner Display */}
                <div style={{ flex: "1 1 200px", maxWidth: "250px" }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>
                        Mobile Banner (4:5)
                    </label>
                    {mobileImage ? (
                        <div style={{ position: "relative", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border-default)", aspectRatio: "4/5" }}>
                            <img src={mobileImage} alt="Mobile Banner" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileImage(null);
                                    onMobileImageChange("");
                                }}
                                style={{
                                    position: "absolute", top: 8, right: 8, width: 28, height: 28,
                                    borderRadius: "50%", border: "none", background: "var(--overlay-heavy)",
                                    color: "var(--text-inverse)", fontSize: 16, cursor: "pointer", display: "flex",
                                    alignItems: "center", justifyContent: "center"
                                }}
                                title="Remove"
                            >×</button>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                if (!uploading) {
                                    setPendingUploadType("MOBILE");
                                    fileRef.current?.click();
                                }
                            }}
                            onDragOver={(e) => { e.preventDefault(); setDragOverMobile(true); }}
                            onDragLeave={() => setDragOverMobile(false)}
                            onDrop={(e) => { 
                                e.preventDefault(); 
                                setDragOverMobile(false); 
                                if (!uploading) {
                                    setPendingUploadType("MOBILE");
                                    handleFiles(e.dataTransfer.files); 
                                }
                            }}
                            style={{
                                border: `2px dashed ${dragOverMobile ? "var(--hero-bg)" : "var(--border-strong)"}`,
                                borderRadius: 12, padding: "40px 20px", textAlign: "center",
                                cursor: uploading ? "wait" : "pointer",
                                background: dragOverMobile ? "var(--skeleton-base)" : "var(--bg-canvas)",
                                aspectRatio: "4/5", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                            }}
                        >
                            {uploading ? (
                                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Uploading banner…</div>
                            ) : (
                                <div>
                                    <div style={{ fontSize: 24, marginBottom: 4, opacity: 0.5 }}>📱</div>
                                    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>Upload Mobile Image</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }} />

            {cropSrc && cropStep && (
                <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "var(--overlay)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                    <div className="responsive-modal" style={{ background: "var(--bg-card)", borderRadius: "var(--radius-xl)", width: "100%", maxWidth: 800, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "var(--shadow-drawer)", animation: "slide-up 250ms ease" }}>
                        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-default)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                                {cropStep === "DESKTOP" ? "Crop Desktop Banner (3:1)" : "Crop Mobile Banner (4:5)"}
                            </h3>
                            <button onClick={() => { setCropSrc(null); setCropStep(null); }} style={{ background: "transparent", border: "none", fontSize: 24, color: "var(--text-secondary)", cursor: "pointer", lineHeight: 1 }}>×</button>
                        </div>

                        <div style={{ position: "relative", width: "100%", height: "60vh", maxHeight: 500, background: "var(--bg-canvas)" }}>
                            <Cropper 
                                image={cropSrc} 
                                crop={crop} 
                                zoom={zoom} 
                                aspect={cropStep === "DESKTOP" ? 3 / 1 : 4 / 5} 
                                onCropChange={setCrop} 
                                onZoomChange={setZoom} 
                                onCropComplete={onCropComplete} 
                            />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "var(--bg-canvas)" }}>
                            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ width: 200, accentColor: "var(--hero-bg)" }} />
                            <div style={{ display: "flex", gap: 12 }}>
                                <button type="button" onClick={() => { setCropSrc(null); setCropStep(null); setPendingUploadType(null); }} style={{ padding: "10px 24px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-strong)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
                                <button type="button" onClick={handleCropConfirm} disabled={uploading} style={{ padding: "10px 24px", borderRadius: "var(--radius-pill)", border: "none", background: "var(--hero-bg)", color: "var(--hero-text)", fontSize: 14, fontWeight: 600, cursor: uploading ? "wait" : "pointer" }}>
                                    {uploading ? "Uploading..." : "Crop & Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
