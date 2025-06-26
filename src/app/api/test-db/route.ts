import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/service/supabase";

export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("count(*)")
      .limit(1);

    if (error) {
      console.error("Database connection error:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Database connection failed",
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Database test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
