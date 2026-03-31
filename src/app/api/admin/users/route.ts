import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IUser } from "@/lib/models/User";

const ADMIN_EMAIL = "shashank8808108802@gmail.com";

export async function GET() {
  try {
    const session = await auth();

    // Strict Security Gate
    if (!session || session.user?.email !== ADMIN_EMAIL) {
      return NextResponse.json(
        { error: "ACCESS_DENIED: UNAUTHORIZED" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Fetch all users
    const users = await User.find({}).lean() as IUser[];

    // Sort by clickCount (descending) to calculate accurate Rank
    const sortedUsers = [...users].sort((a, b) => b.clickCount - a.clickCount);

    const formattedUsers = sortedUsers.map((user, index) => ({
      _id: user._id?.toString(),
      name: user.name,
      email: user.email,
      instagramUsername: user.instagramUsername || "N/A",
      avatarUrl: user.avatarUrl,
      themeColor: user.themeColor || "#ffffff",
      clickCount: user.clickCount,
      rank: index + 1,
      loginCount: user.loginCount || 1, // Fallback for old accounts
      lastLogin: user.lastLogin || user.createdAt,
      createdAt: user.createdAt,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR: SYSTEM_FAILURE" },
      { status: 500 }
    );
  }
}
