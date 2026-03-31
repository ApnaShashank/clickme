import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password, confirmPassword } = body;

    // 1. Zod Validation
    const validation = resetPasswordSchema.safeParse({ password, confirmPassword });
    if (!validation.success) {
      return NextResponse.json({ 
        error: "VALIDATION_FAILED", 
        details: validation.error.format() 
      }, { status: 400 });
    }

    if (!token) {
      return NextResponse.json({ error: "TOKEN_MISSING" }, { status: 400 });
    }

    // 2. Hash Token (Never Compare raw tokens)
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    await connectToDatabase();

    // 3. Find User by Hashed Token and check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ 
        error: "INVALID_OR_EXPIRED_TOKEN" 
      }, { status: 400 });
    }

    // 4. Hash and Update Password
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    
    // 5. Clear Reset Fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json({ 
      message: "PASSWORD_RESET_SUCCESSFUL: Identity Secure" 
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "INTERNAL_SECURITY_FAILURE" }, { status: 500 });
  }
}
