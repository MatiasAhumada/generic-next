import httpStatus from "http-status";
import { NextResponse } from "next/server";
import { CONFIG } from "@/constants/config.constant";
import { AxiosError } from "axios";

interface ApiErrorOptions {
  status?: number;
  message?: string;
  isOperational?: boolean;
  stack?: string;
  internalCode?: string;
  details?: object | null;
}

const statusMessages: Record<number, string> = httpStatus;

export class ApiError extends Error {
  public readonly stack?: string;
  public readonly status: number;
  public readonly isOperational: boolean;
  public readonly internalCode?: string;
  public readonly details?: object | null;

  constructor({
    status = httpStatus.INTERNAL_SERVER_ERROR,
    message = "",
    isOperational = true,
    stack,
    internalCode,
    details = null,
  }: ApiErrorOptions) {
    super(message);

    this.status = status;
    this.isOperational = isOperational;
    this.internalCode = internalCode;
    this.details = details;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this);
  }
}

interface ResponseError {
  message: string;
  status: number;
  stack?: string;
  internalCode?: string;
  details?: object | null;
}

function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const backendError = error.response?.data?.error;
    return new ApiError({
      status: error.response?.status || httpStatus.INTERNAL_SERVER_ERROR,
      message: backendError?.message || error.message,
      isOperational: true,
      stack: backendError?.stack || error.stack,
      internalCode: backendError?.internalCode,
      details: backendError?.details,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
      isOperational: false,
      stack: error.stack,
    });
  }

  return new ApiError({
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: "Error desconocido",
    isOperational: false,
  });
}

export function apiErrorHandler(
  error: unknown,
  fallbackMessage?: string,
): NextResponse {
  const normalizedError = normalizeApiError(error);
  let { status, message } = normalizedError;

  if (!normalizedError.isOperational) {
    status = httpStatus.INTERNAL_SERVER_ERROR;
    message =
      fallbackMessage ?? statusMessages[httpStatus.INTERNAL_SERVER_ERROR];
  }

  if (!message) message = fallbackMessage ?? statusMessages[status];

  const errorResponse: ResponseError = {
    message,
    status,
  };

  if (normalizedError.internalCode) {
    errorResponse.internalCode = normalizedError.internalCode;
  }

  if (normalizedError.details) {
    errorResponse.details = normalizedError.details;
  }

  if (normalizedError.stack && CONFIG.NODE_ENV === "development") {
    errorResponse.stack = normalizedError.stack;
  }

  console.error({ ...errorResponse });
  return NextResponse.json({ error: errorResponse }, { status });
}

export default apiErrorHandler;
