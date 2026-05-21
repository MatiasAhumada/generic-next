import { NextRequest, NextResponse } from "next/server";
import clientAxios from "@/utils/clientAxios.util";
import { apiErrorHandler } from "@/utils/handlers";

export async function GET() {
  try {
    const { data } = await clientAxios.get("/users");
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await clientAxios.post("/users", body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
