import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { eventEmitter, EVENTS } from "@/lib/events";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(session.user.id).select("-password").lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rank = await User.countDocuments({ clickCount: { $gt: user.clickCount } }) + 1;

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      instagramUsername: user.instagramUsername,
      clickCount: user.clickCount,
      avatarUrl: user.avatarUrl,
      themeColor: user.themeColor,
      customLink: user.customLink,
      rank,
    });
  } catch (error) {
    console.error("User GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();
    const allowedFields = ["name", "instagramUsername", "avatarUrl", "customLink"];
    const sanitized: Record<string, string> = {};

    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }

    await connectToDatabase();
    const user = await User.findByIdAndUpdate(session.user.id, sanitized, { new: true }).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Broadcast profile updates to all connected clients
    eventEmitter.emit(EVENTS.PROFILE_UPDATE, {
      type: "profile-update",
      userId: user._id.toString(),
      name: user.name,
      avatarUrl: user.avatarUrl,
      customLink: user.customLink,
      instagramUsername: user.instagramUsername,
    });

    return NextResponse.json({ message: "Profile updated", user });
  } catch (error) {
    console.error("User PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
