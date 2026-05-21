# Error Handlers

Sistema centralizado de manejo de errores para frontend y API routes.

## 📁 Estructura

```
src/utils/handlers/
├── apiError.handler.ts      # Manejo de errores en API routes
├── clientHandler.ts          # Manejo de errores en cliente
├── clientError.handler.ts    # Re-exports de clientHandler
└── index.ts                  # Exports centralizados
```

## 🔴 Client Error Handler

Maneja errores en el lado del cliente (componentes React, servicios frontend).

### Características

- ✅ Normalización automática de errores (AxiosError, Error, string, unknown)
- ✅ Soporte para errores de red y backend
- ✅ Toasts automáticos con Sonner
- ✅ Type guards seguros sin `any`
- ✅ Logging opcional a consola
- ✅ Callbacks personalizados

### Uso Básico

```typescript
import { clientErrorHandler } from "@/utils/handlers";

try {
  await userService.create(data);
} catch (error) {
  clientErrorHandler(error);
}
```

### Opciones Avanzadas

```typescript
clientErrorHandler(error, () => {
  // Callback después de mostrar error
  router.push("/login");
}, {
  showToast: true,
  logToConsole: true,
  messagePrefix: "Error al crear usuario: ",
  defaultMessage: "No se pudo completar la operación",
  toastOptions: {
    description: "Intenta nuevamente",
    duration: 5000,
  },
});
```

### Handlers Adicionales

```typescript
import {
  clientSuccessHandler,
  clientWarningHandler,
  clientInfoHandler,
} from "@/utils/handlers";

// Éxito
clientSuccessHandler("Usuario creado exitosamente");

// Advertencia
clientWarningHandler("El stock está bajo");

// Información
clientInfoHandler("Procesando solicitud...");
```

## 🟠 API Error Handler

Maneja errores en API routes (Next.js Route Handlers).

### Características

- ✅ Normalización de errores de Axios y backend externo
- ✅ Respuestas HTTP estandarizadas
- ✅ Stack traces en desarrollo
- ✅ Códigos de error internos
- ✅ Detalles adicionales opcionales

### Uso en Route Handlers

```typescript
import { NextRequest, NextResponse } from "next/server";
import clientAxios from "@/utils/clientAxios.util";
import { apiErrorHandler } from "@/utils/handlers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await clientAxios.post("/users", body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
```

### Lanzar Errores Personalizados

```typescript
import { ApiError } from "@/utils/handlers";
import httpStatus from "http-status";

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization");
  
  if (!token) {
    throw new ApiError({
      status: httpStatus.UNAUTHORIZED,
      message: "Token no proporcionado",
      internalCode: "AUTH_001",
    });
  }
  
  try {
    const { data } = await clientAxios.get("/protected");
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}
```

### Respuesta de Error

```json
{
  "error": {
    "message": "Usuario no encontrado",
    "status": 404,
    "internalCode": "USER_NOT_FOUND",
    "details": { "userId": "123" },
    "stack": "Error: Usuario no encontrado\n    at ..." // Solo en desarrollo
  }
}
```

## 🔄 Flujo de Errores

### Frontend → Backend Externo

```
Cliente (React)
    ↓ try/catch
userService.create()
    ↓ axios
Backend Externo (error 400)
    ↓ AxiosError
clientErrorHandler()
    ↓ normalizeError()
Toast Error + Console
```

### Frontend → API Route → Backend Externo

```
Cliente (React)
    ↓ try/catch
fetch("/api/users")
    ↓
API Route Handler
    ↓ try/catch
clientAxios.post("/users")
    ↓ AxiosError
apiErrorHandler()
    ↓ normalizeApiError()
NextResponse.json({ error })
    ↓
Cliente recibe error
    ↓
clientErrorHandler()
    ↓
Toast Error
```

## 🎯 Normalización de Errores

### Client Handler

```typescript
// AxiosError → Error con mensaje del backend
error.response?.data?.error?.message

// Error de red → "Error de conexión"
!error.response

// Error nativo → Se mantiene
error instanceof Error

// String → new Error(string)
typeof error === "string"

// Objeto sin message → ERROR_MESSAGES.FORM_VALIDATION
isStringRecord(error) && !isErrorLike(error)

// Objeto con message → new Error(error.message)
isErrorLike(error)

// Unknown → ERROR_MESSAGES.UNKNOWN_ERROR
```

### API Handler

```typescript
// ApiError → Se mantiene
error instanceof ApiError

// AxiosError → ApiError con datos del backend
error.response?.data?.error

// Error nativo → ApiError con isOperational: false
error instanceof Error

// Unknown → ApiError genérico
```

## 🛡️ Type Safety

Todos los handlers usan type guards seguros:

```typescript
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
```

❌ **No se usa `any` ni `typeof` en ningún lugar**

## 📝 Ejemplos Completos

### Servicio Frontend

```typescript
import { userService } from "@/services/user.service";
import { clientErrorHandler, clientSuccessHandler } from "@/utils/handlers";

const handleCreateUser = async (formData: CreateUserDto) => {
  try {
    await userService.create(formData);
    clientSuccessHandler("Usuario creado exitosamente", () => {
      router.push("/users");
    });
  } catch (error) {
    clientErrorHandler(error, undefined, {
      messagePrefix: "Error al crear usuario: ",
    });
  }
};
```

### API Route Completo

```typescript
import { NextRequest, NextResponse } from "next/server";
import clientAxios from "@/utils/clientAxios.util";
import { apiErrorHandler, ApiError } from "@/utils/handlers";
import httpStatus from "http-status";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    if (!id) {
      throw new ApiError({
        status: httpStatus.BAD_REQUEST,
        message: "ID es requerido",
      });
    }
    
    const { data } = await clientAxios.get(`/users/${id}`);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}
```

## 🔧 Configuración

Los handlers usan constantes centralizadas:

```typescript
// src/constants/error-messages.constant.ts
export const ERROR_MESSAGES = {
  UNKNOWN_ERROR: "Error desconocido",
  FORM_VALIDATION: "Error de validación del formulario",
  NETWORK_ERROR: "Error de conexión",
};

// src/constants/config.constant.ts
export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
};
```

## ✅ Ventajas

- **Consistencia**: Mismo formato de error en toda la app
- **Type Safety**: Sin `any`, con type guards robustos
- **DRY**: Lógica centralizada, sin duplicación
- **UX**: Toasts automáticos con mensajes claros
- **Debug**: Stack traces en desarrollo
- **Extensible**: Fácil agregar nuevos tipos de error
