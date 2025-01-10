"use server";
import { updateUser } from "@/lib/db/models/users";
import { revalidatePath } from "next/cache";

export async function updateBio(formData: FormData) {
    try {
        const bio = formData.get("bio");
        const id = formData.get("id");

        if (!bio || !id) {
            throw new Error("Missing required fields");
        }

        const updatedUser = await updateUser({
            id: id as string,
            bio: bio as string
        });

        if (!updatedUser) {
            throw new Error("Failed to update user");
        }

        revalidatePath("/profile");
        revalidatePath("/");
    } catch (error) {
        console.error('Error updating bio:', error);
        throw error;
    }
}
