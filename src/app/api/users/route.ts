import { NextRequest, NextResponse } from "next/server";
import clientAxios from "@/utils/clientAxios.util";
import { apiErrorHandler } from "@/utils/handlers";
import { BACKEND_ROUTES } from "@/constants/routes";

export async function GET() {
  try {
    const { data } = await clientAxios.get(BACKEND_ROUTES.USERS);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await clientAxios.post(BACKEND_ROUTES.USERS, body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
