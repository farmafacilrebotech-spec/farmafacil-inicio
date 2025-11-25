export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { signUp } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, userType, nombre, telefono, whatsapp, direccion } =
      body;

    if (!email || !password || !userType || !nombre) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (userType !== "farmacia" && userType !== "cliente") {
      return NextResponse.json(
        { error: "Invalid user type" },
        { status: 400 }
      );
    }

    const result = await signUp(email, password, userType, {
      nombre,
      telefono,
      whatsapp,
      direccion,
    });

    return NextResponse.json({
      success: true,
      user: result.user,
      profile: result.profile,
      userType: result.userType,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
