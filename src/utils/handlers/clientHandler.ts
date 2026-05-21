import { AxiosError } from "axios";
import {
  toastSuccess,
  toastError,
  toastWarning,
  toastInfo,
} from "@/utils/toast.util";
import { ERROR_MESSAGES } from "@/constants/error-messages.constant";

interface HandlerOptions {
  logToConsole?: boolean;
  showToast?: boolean;
  messagePrefix?: string;
  defaultMessage?: string;
  toastOptions?: { description?: string; duration?: number };
}

interface ErrorLike {
  message?: unknown;
}

function isErrorLike(value: unknown): value is ErrorLike {
  return (
    value !== undefined &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, "message")
  );
}

function isStringRecord(value: unknown): value is Record<string, unknown> {
  return (
    value !== undefined &&
    value !== null &&
    Object.prototype.toString.call(value) === "[object Object]"
  );
}

function normalizeError(error: unknown): Error {
  if (error instanceof AxiosError) {
    const isNetworkError = !error.response;
    return {
      name: "AxiosError",
      message: isNetworkError
        ? "Error de conexión"
        : error.response?.data?.error?.message || error.message,
      stack: error.response?.data?.error?.stack || error.stack,
    };
  }

  if (error instanceof Error) return error;

  if (typeof error === "string") return new Error(error);

  if (isStringRecord(error) && !isErrorLike(error)) {
    return new Error(ERROR_MESSAGES.FORM_VALIDATION);
  }

  if (isErrorLike(error) && typeof error.message === "string") {
    return new Error(error.message);
  }

  if (isStringRecord(error)) {
    return new Error(JSON.stringify(error));
  }

  return new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
}

export function clientErrorHandler(
  error: unknown,
  callback = () => {},
  {
    logToConsole = true,
    showToast = true,
    messagePrefix = "",
    defaultMessage = "Error desconocido",
    toastOptions = {},
  }: HandlerOptions = {},
): void {
  const normalizedError = normalizeError(error);

  if (logToConsole) console.error(normalizedError);
  if (showToast) {
    const displayMessage = normalizedError.message || defaultMessage;
    toastError(`${messagePrefix}${displayMessage}`, toastOptions);
  }

  callback();
}

export function clientSuccessHandler(
  message: string,
  callback = () => {},
  {
    logToConsole = false,
    showToast = true,
    messagePrefix = "",
    toastOptions = {},
  }: Omit<HandlerOptions, "defaultMessage"> = {},
): void {
  const formattedMessage = message.replace(/\. /g, ".\n");
  if (logToConsole) console.log(formattedMessage);
  if (showToast) {
    toastSuccess(`${messagePrefix}${formattedMessage}`, toastOptions);
  }

  callback();
}

export function clientWarningHandler(
  message: string,
  callback = () => {},
  {
    logToConsole = true,
    showToast = true,
    messagePrefix = "",
    toastOptions = {},
  }: Omit<HandlerOptions, "defaultMessage"> = {},
): void {
  if (logToConsole) console.warn(message);
  if (showToast) {
    toastWarning(`${messagePrefix}${message}`, toastOptions);
  }

  callback();
}

export function clientInfoHandler(
  message: string,
  callback = () => {},
  {
    logToConsole = false,
    showToast = true,
    messagePrefix = "",
    toastOptions = {},
  }: Omit<HandlerOptions, "defaultMessage"> = {},
): void {
  if (logToConsole) console.info(message);
  if (showToast) {
    toastInfo(`${messagePrefix}${message}`, toastOptions);
  }

  callback();
}

export default clientErrorHandler;
