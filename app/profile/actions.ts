"use server";
import { updateUser } from "@/lib/db/models/users";
import { revalidatePath } from "next/cache";

export async function updateBio(formData: FormData){
    const bio = formData.get("bio");
    const id = formData.get("id");

    await updateUser({
        bio: bio as string,
        id: id as string
    });

    revalidatePath("/profile");
}