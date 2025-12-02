import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        id: "current_user",
        username: "Chrome_Tester",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chrome_Tester",
        level: 1,
        reputation: "Newbie",
        followers: "0",
        bio: "Testing in progress..."
    });
}
