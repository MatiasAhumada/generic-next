# Mensajes Centralizados

Sistema de mensajes reutilizables para mantener consistencia en toda la aplicación.

## 📁 Ubicación

```
src/constants/error-messages.constant.ts
```

## 🎯 Propósito

Centralizar todos los mensajes de la aplicación para:
- ✅ Evitar hardcodeo de strings
- ✅ Mantener consistencia en mensajes
- ✅ Facilitar internacionalización (i18n)
- ✅ Simplificar mantenimiento
- ✅ Reutilizar mensajes comunes

## 📦 Categorías

### 🔴 ERROR_MESSAGES

Mensajes de error para manejo de excepciones.

```typescript
import { ERROR_MESSAGES } from "@/constants/error-messages.constant";

// Errores HTTP
ERROR_MESSAGES.UNAUTHORIZED
ERROR_MESSAGES.FORBIDDEN
ERROR_MESSAGES.NOT_FOUND
ERROR_MESSAGES.VALIDATION_ERROR
ERROR_MESSAGES.INTERNAL_SERVER_ERROR

// Errores de red
ERROR_MESSAGES.NETWORK_ERROR
ERROR_MESSAGES.TIMEOUT_ERROR
ERROR_MESSAGES.EXTERNAL_API_ERROR

// Errores de usuario
ERROR_MESSAGES.USER_NOT_FOUND
ERROR_MESSAGES.USER_EMAIL_EXISTS
ERROR_MESSAGES.USER_INVALID_CREDENTIALS
ERROR_MESSAGES.USER_INACTIVE
ERROR_MESSAGES.USER_BLOCKED

// Errores de autenticación
ERROR_MESSAGES.SESSION_EXPIRED
ERROR_MESSAGES.SESSION_INVALID
ERROR_MESSAGES.TOKEN_INVALID
ERROR_MESSAGES.TOKEN_EXPIRED
ERROR_MESSAGES.PERMISSION_DENIED

// Errores de validación
ERROR_MESSAGES.FORM_VALIDATION
ERROR_MESSAGES.INVALID_FORMAT
ERROR_MESSAGES.REQUIRED_FIELD
ERROR_MESSAGES.DUPLICATE_ENTRY
ERROR_MESSAGES.RESOURCE_IN_USE

// Errores de archivos
ERROR_MESSAGES.FILE_TOO_LARGE
ERROR_MESSAGES.FILE_INVALID_TYPE
ERROR_MESSAGES.IMAGE_UPLOAD_FAILED
ERROR_MESSAGES.IMAGE_DELETE_FAILED
ERROR_MESSAGES.IMAGE_OPTIMIZATION_FAILED

// Errores generales
ERROR_MESSAGES.UNKNOWN_ERROR
ERROR_MESSAGES.DATABASE_ERROR
```

### 🟢 SUCCESS_MESSAGES

Mensajes de éxito para operaciones completadas.

```typescript
import { SUCCESS_MESSAGES } from "@/constants/error-messages.constant";

// CRUD
SUCCESS_MESSAGES.CREATED
SUCCESS_MESSAGES.UPDATED
SUCCESS_MESSAGES.DELETED
SUCCESS_MESSAGES.SAVED

// Operaciones
SUCCESS_MESSAGES.SENT
SUCCESS_MESSAGES.UPLOADED
SUCCESS_MESSAGES.DOWNLOADED
SUCCESS_MESSAGES.OPERATION_SUCCESS

// Autenticación
SUCCESS_MESSAGES.LOGIN_SUCCESS
SUCCESS_MESSAGES.LOGOUT_SUCCESS
SUCCESS_MESSAGES.REGISTER_SUCCESS
SUCCESS_MESSAGES.PASSWORD_CHANGED
SUCCESS_MESSAGES.EMAIL_SENT
```

### 🟡 WARNING_MESSAGES

Mensajes de advertencia para situaciones que requieren atención.

```typescript
import { WARNING_MESSAGES } from "@/constants/error-messages.constant";

WARNING_MESSAGES.UNSAVED_CHANGES
WARNING_MESSAGES.LOW_STOCK
WARNING_MESSAGES.EXPIRING_SOON
WARNING_MESSAGES.PENDING_APPROVAL
WARNING_MESSAGES.INCOMPLETE_DATA
```

### 🔵 INFO_MESSAGES

Mensajes informativos para estados de carga y datos.

```typescript
import { INFO_MESSAGES } from "@/constants/error-messages.constant";

INFO_MESSAGES.LOADING
INFO_MESSAGES.PROCESSING
INFO_MESSAGES.SAVING
INFO_MESSAGES.UPLOADING
INFO_MESSAGES.DOWNLOADING
INFO_MESSAGES.PLEASE_WAIT
INFO_MESSAGES.NO_DATA
INFO_MESSAGES.EMPTY_LIST
```

## 💡 Ejemplos de Uso

### En Handlers

```typescript
import { clientErrorHandler, clientSuccessHandler } from "@/utils/handlers";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "@/constants/error-messages.constant";

try {
  await userService.create(data);
  clientSuccessHandler(SUCCESS_MESSAGES.CREATED);
} catch (error) {
  clientErrorHandler(error, undefined, {
    defaultMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
  });
}
```

### En API Routes

```typescript
import { ApiError } from "@/utils/handlers";
import { ERROR_MESSAGES } from "@/constants/error-messages.constant";
import httpStatus from "http-status";

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.email) {
    throw new ApiError({
      status: httpStatus.BAD_REQUEST,
      message: ERROR_MESSAGES.REQUIRED_FIELD,
      details: { field: "email" },
    });
  }
  
  try {
    const { data } = await clientAxios.post("/users", body);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiErrorHandler(error);
  }
}
```

### En Componentes

```typescript
import { WARNING_MESSAGES, INFO_MESSAGES } from "@/constants/error-messages.constant";
import { clientWarningHandler, clientInfoHandler } from "@/utils/handlers";

const handleSubmit = () => {
  if (hasUnsavedChanges) {
    clientWarningHandler(WARNING_MESSAGES.UNSAVED_CHANGES);
    return;
  }
  
  clientInfoHandler(INFO_MESSAGES.PROCESSING);
  // ... lógica de submit
};
```

### Mensajes Personalizados

```typescript
import { ERROR_MESSAGES } from "@/constants/error-messages.constant";

// Combinar con contexto específico
const message = `${ERROR_MESSAGES.USER_NOT_FOUND}: ${userId}`;

// Usar como base para mensajes dinámicos
const getErrorMessage = (field: string) => 
  `${ERROR_MESSAGES.REQUIRED_FIELD}: ${field}`;
```

## 🔧 Extender Mensajes

Para agregar mensajes específicos de tu dominio:

```typescript
// src/constants/error-messages.constant.ts

export const ERROR_MESSAGES = {
  // ... mensajes existentes
  
  // Mensajes específicos de tu dominio
  PRODUCT_NOT_FOUND: "Producto no encontrado",
  PRODUCT_SKU_EXISTS: "El SKU ya está registrado",
  PRODUCT_OUT_OF_STOCK: "Producto sin stock",
  ORDER_NOT_FOUND: "Pedido no encontrado",
  ORDER_ALREADY_PROCESSED: "El pedido ya fue procesado",
  PAYMENT_FAILED: "Error al procesar el pago",
  SHIPPING_ADDRESS_REQUIRED: "Dirección de envío requerida",
} as const;
```

## 🌐 Internacionalización (i18n)

Para soportar múltiples idiomas en el futuro:

```typescript
// src/constants/messages/es.ts
export const ERROR_MESSAGES_ES = {
  UNAUTHORIZED: "No autorizado",
  // ...
};

// src/constants/messages/en.ts
export const ERROR_MESSAGES_EN = {
  UNAUTHORIZED: "Unauthorized",
  // ...
};

// src/constants/messages/index.ts
import { ERROR_MESSAGES_ES } from "./es";
import { ERROR_MESSAGES_EN } from "./en";

const locale = "es"; // Obtener del contexto o configuración

export const ERROR_MESSAGES = locale === "es" 
  ? ERROR_MESSAGES_ES 
  : ERROR_MESSAGES_EN;
```

## ✅ Ventajas

- **Mantenibilidad**: Cambiar un mensaje en un solo lugar
- **Consistencia**: Mismo mensaje en toda la app
- **Type Safety**: TypeScript autocompleta los mensajes
- **Testeable**: Fácil verificar mensajes en tests
- **i18n Ready**: Base para internacionalización
- **DRY**: No repetir strings en el código

## ❌ Anti-patrones

```typescript
// ❌ MAL - Hardcodear mensajes
throw new Error("Usuario no encontrado");
toast.error("Error al guardar");

// ✅ BIEN - Usar constantes
throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
clientErrorHandler(error, undefined, {
  defaultMessage: ERROR_MESSAGES.UNKNOWN_ERROR,
});
```

## 🎯 Reglas

1. **NUNCA** hardcodear mensajes de usuario en el código
2. **SIEMPRE** usar constantes de mensajes
3. **AGREGAR** nuevos mensajes cuando sea necesario
4. **MANTENER** mensajes claros y descriptivos
5. **AGRUPAR** mensajes por categoría (error, success, warning, info)
