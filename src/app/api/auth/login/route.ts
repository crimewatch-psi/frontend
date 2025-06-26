import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/service/supabase";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", role)
      .eq("status", "active")
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { message: "Invalid email or role" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    await supabase
      .from("users")
      .update({ last_login: new Date().toISOString() })
      .eq("id", user.id);

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        organization: user.organization,
      },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production",
      { expiresIn: "24h" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
