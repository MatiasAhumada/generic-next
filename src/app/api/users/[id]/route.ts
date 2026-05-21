import { NextRequest, NextResponse } from "next/server";
import clientAxios from "@/utils/clientAxios.util";
import { apiErrorHandler } from "@/utils/handlers";
import { BACKEND_ROUTES } from "@/constants/routes";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { data } = await clientAxios.get(BACKEND_ROUTES.USER_BY_ID(id));
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data } = await clientAxios.put(BACKEND_ROUTES.USER_BY_ID(id), body);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { data } = await clientAxios.delete(BACKEND_ROUTES.USER_BY_ID(id));
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}
