import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find({})
      .select("name instagramUsername clickCount avatarUrl themeColor customLink")
      .sort({ clickCount: -1 })
      .limit(100)
      .lean();

    const leaderboard = users.map((user, index) => ({
      id: user._id.toString(),
      name: user.name,
      instagramUsername: user.instagramUsername,
      clickCount: user.clickCount,
      avatarUrl: user.avatarUrl,
      themeColor: user.themeColor,
      customLink: user.customLink,
      rank: index + 1,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
