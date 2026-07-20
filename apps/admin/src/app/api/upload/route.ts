import { NextRequest } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth";
import { getAccessToken, getRefreshToken } from "@/lib/cookies";
import { uploadImage } from "@/lib/cloudinary";

/**
 * POST /api/upload
 * 
 * Authenticated image upload endpoint.
 * Accepts multipart/form-data with a "file" field.
 * Returns the Cloudinary secure URL.
 */
export async function POST(req: NextRequest) {
    try {
        // Auth check (allow if either token is valid, so they don't get stuck if access token expires during a session)
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();
        
        const isAuth = (accessToken && verifyAccessToken(accessToken)) || (refreshToken && verifyRefreshToken(refreshToken));
        
        if (!isAuth) {
            return Response.json(
                { success: false, message: "Authentication required", data: null },
                { status: 401 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json(
                { success: false, message: "No file provided", data: null },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            return Response.json(
                { success: false, message: "Only image files are allowed", data: null },
                { status: 400 }
            );
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return Response.json(
                { success: false, message: "Image must be under 5MB", data: null },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const result = await uploadImage(file);

        if (!result) {
            return Response.json(
                { success: false, message: "Upload failed. Please try again.", data: null },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: "Image uploaded successfully",
            data: { url: result.url, publicId: result.publicId },
        });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            { success: false, message: "Something went wrong", data: null },
            { status: 500 }
        );
    }
}
