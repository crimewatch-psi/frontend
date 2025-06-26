import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/service/supabase";
import bcrypt from "bcryptjs";

const demoUsers = [
  {
    email: "admin@crimewatch.id",
    password: "admin123",
    name: "System Administrator",
    role: "admin",
    organization: "CrimeWatch",
  },
  {
    email: "gov@example.com",
    password: "password123",
    name: "Government Officer",
    role: "pemerintah",
    organization: "Local Government",
  },
  {
    email: "police@example.com",
    password: "password123",
    name: "Police Officer",
    role: "polri",
    organization: "Regional Police",
  },
  {
    email: "tourism@example.com",
    password: "password123",
    name: "Tourism Manager",
    role: "manajer_wisata",
    organization: "Tourism Board",
  },
];

export async function POST(request: NextRequest) {
  try {
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (checkError) {
      console.error("Error checking existing users:", checkError);
      return NextResponse.json(
        { message: "Database check failed" },
        { status: 500 }
      );
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({
        success: true,
        message: "Database already initialized",
      });
    }

    const usersToInsert = await Promise.all(
      demoUsers.map(async (user) => ({
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
        password_hash: await bcrypt.hash(user.password, 12),
        status: "active",
        last_login: null,
        created_at: new Date().toISOString(),
      }))
    );

    const { data: insertedUsers, error: insertError } = await supabase
      .from("users")
      .insert(usersToInsert)
      .select();

    if (insertError) {
      console.error("Error inserting demo users:", insertError);
      return NextResponse.json(
        { message: "Failed to initialize database" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      users: insertedUsers?.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        organization: user.organization,
      })),
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
