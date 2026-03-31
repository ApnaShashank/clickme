import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { eventEmitter, EVENTS } from "@/lib/events";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Broadcast the update to all connected clients
    eventEmitter.emit(EVENTS.CLICK_UPDATE, {
      type: "click-update",
      userId: user._id.toString(),
      clickCount: user.clickCount,
    });

    return NextResponse.json({
      clickCount: user.clickCount,
    });
  } catch (error) {
    console.error("Click error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
