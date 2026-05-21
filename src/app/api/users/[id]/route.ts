import { NextRequest, NextResponse } from "next/server";
import clientAxios from "@/utils/clientAxios.util";
import { apiErrorHandler } from "@/utils/handlers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { data } = await clientAxios.get(`/users/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { data } = await clientAxios.put(`/users/${id}`, body);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { data } = await clientAxios.delete(`/users/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}
