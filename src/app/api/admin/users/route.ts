import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/service/supabase";
import bcrypt from "bcryptjs";

function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const token =
    authHeader?.replace("Bearer ", "") ||
    request.cookies.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production"
    ) as any;

    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const admin = verifyAdminToken(request);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select(
        "id, email, name, role, organization, status, last_login, created_at"
      )
      .neq("role", "admin")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { message: "Failed to fetch users" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      users: users || [],
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const admin = verifyAdminToken(request);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { email, password, name, role, organization } = await request.json();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create new user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        name,
        role,
        organization,
        password_hash: passwordHash,
        status: "active",
        last_login: null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        organization: newUser.organization,
        status: newUser.status,
        last_login: newUser.last_login,
        created_at: newUser.created_at,
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const admin = verifyAdminToken(request);

  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, status } = await request.json();

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({ status })
      .eq("id", userId)
      .select()
      .single();

    if (error || !updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        organization: updatedUser.organization,
        status: updatedUser.status,
        last_login: updatedUser.last_login,
        created_at: updatedUser.created_at,
      },
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
