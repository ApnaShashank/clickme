import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { signupSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/rate-limit";

const THEME_COLORS = [
  "#0066FF", "#FF4757", "#2ED573", "#1E90FF", "#FF6B81", // Brand Blue, Red, Green, Blue, Pink
  "#FFA502", "#A29BFE", "#00CEC9", "#FDCB6E", "#E17055", // Orange, Purple, Teal, Amber, Coral
  "#6C5CE7", "#00B894", "#F39C12", "#E84393", "#0984E3", // Soft Purple, Jade, Mango, Rose, Deep Blue
  "#D63031", "#55E6C1", "#58B19F", "#4834D4", "#F0932B", // Scarlet, Mint, Pine, Slate-Blue, Sun
  "#EB4D4B", "#7ED6DF", "#22A6B3", "#BE2EDD", "#F9CA24", // Crimson, Sky, Peacock, Magenta, Yellow
  "#686DE0", "#30336B", "#95AFCO", "#FFBE76", "#FF7979", // Blurple, Deep-Sea, Slate, Peach, Salmon
  "#BADC58", "#6AB04C", "#DFF9FB", "#C7ECEE", "#FFFFFF", // Lime, Olive, Ice, Cloud, Pure
];

export async function POST(req: NextRequest) {
  try {
    // 0. Rate Limiting Protection (Anti-Spam)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = rateLimit(ip, 5, 900000); // 5 signups per 15 mins
    
    if (!limiter.success) {
      return NextResponse.json({ 
        error: "ACCESS_THROTTLED: TOO_MANY_REQUESTS" 
      }, { status: 429 });
    }

    const body = await req.json();

    // 1. Zod Validation
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      // Return the first specific error message for better UX
      const firstError = validation.error.issues[0]?.message || "VALIDATION_FAILED";
      return NextResponse.json({ 
        error: firstError,
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { name, email, password, instagramUsername, avatarUrl } = validation.data;

    await connectToDatabase();

    // 2. Check for Existing Identity
    const existingUser = await User.findOne({
      $or: [{ email }, { instagramUsername }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: "EMAIL_RECOGNIZED: ALREADY_MAPPED" }, { status: 400 });
      }
      return NextResponse.json({ error: "IDENTITY_TAKEN: USERNAME_ASSIGNED" }, { status: 400 });
    }

    // 3. Uniqueness Logic for Theme Colors
    const takenColorsObjects = await User.find({}).select("themeColor").lean();
    const takenColors = takenColorsObjects.map(u => u.themeColor);
    let pickedColor = THEME_COLORS.find(c => !takenColors.includes(c));

    if (!pickedColor) {
      let isUnique = false;
      while (!isUnique) {
        const randomHex = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`.toUpperCase();
        if (!takenColors.includes(randomHex)) {
          pickedColor = randomHex;
          isUnique = true;
        }
      }
    }

    // 4. Secure Hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Initialize Identity
    await User.create({
      name,
      email,
      password: hashedPassword,
      instagramUsername,
      themeColor: pickedColor,
      clickCount: 0,
      avatarUrl: avatarUrl || "",
      customLink: "",
    });

    return NextResponse.json({
      message: "IDENTITY_MAPPED: SUCCESS",
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "INTERNAL_IDENTITY_FAILURE" }, { status: 500 });
  }
}
