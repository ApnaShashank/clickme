import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // 0. Rate Limiting Protection (Anti-Spam)
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    const limiter = rateLimit(ip, 3, 900000); // 3 requests per 15 mins for recovery
    
    if (!limiter.success) {
      return NextResponse.json({ 
        error: "RECOVERY_THROTTLED: TOO_MANY_REQUESTS" 
      }, { status: 429 });
    }

    const body = await req.json();
    
    // 1. Validate Email with Zod
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "INVALID_FIELD", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { email } = validation.data;

    await connectToDatabase();

    // 2. Find User
    const user = await User.findOne({ email });

    // SECURITY: Always return success to prevent account enumeration
    if (!user) {
      return NextResponse.json({ 
        message: "If an account exists, a reset link will be sent." 
      });
    }

    // 3. Generate Reset Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // 4. Hash Token (Never store raw tokens in DB)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 5. Update User Record
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
    await user.save();

    // 6. MOCK EMAIL: Log the reset link to the console
    const host = req.headers.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const origin = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
    const resetUrl = `${origin}/reset-password/${resetToken}`;
    
    console.log("\n--- [SECURITY_LINK] ---");
    console.log(`FORGOT_PASSWORD_REQUEST: ${email}`);
    console.log(`RESET_URL: ${resetUrl}`);
    console.log("------------------------\n");

    return NextResponse.json({ 
      message: "If an account exists, a reset link will be sent." 
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "INTERNAL_SECURITY_FAILURE" }, { status: 500 });
  }
}
