import { getUserConversations } from "@/lib/db/models/conversations";
import { NextRequest, NextResponse } from "next/server";

// This route will fetch every conversations for a specific user
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const action = request.nextUrl.searchParams.get("action");
	if (action === "get-conversations") {
		const userId = (await params).id;
		const data = await getUserConversations(userId);
		return NextResponse.json({ success: true, message: "Conversations fetched", data });
	}
	return NextResponse.json({ success: false, message: "Invalid action" });
}