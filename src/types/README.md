# Types

Esta carpeta contiene **tipos reutilizables** (type aliases, unions, intersections) de TypeScript.

## Propósito

Centralizar definiciones de tipos para:
- Evitar duplicación de código
- Mantener un único punto de verdad
- Facilitar refactorización
- Mejorar mantenibilidad

## Qué va aquí

✅ **Type aliases**
```typescript
export type UserId = string;
export type UserRole = "admin" | "user" | "guest";
```

✅ **Union types**
```typescript
export type Status = "pending" | "active" | "inactive";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
```

✅ **Intersection types**
```typescript
export type Timestamped = {
  createdAt: string;
  updatedAt: string;
};
```

✅ **Utility types**
```typescript
export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};
```

## Qué NO va aquí

❌ **Interfaces** → Van en `/interfaces`
❌ **Clases** → Van en sus respectivos módulos
❌ **Enums** → Van en `/constants`

## Convenciones

- Nombres en PascalCase
- Un archivo por dominio (ej: `user.types.ts`, `auth.types.ts`)
- Archivo `common.types.ts` para tipos genéricos
- Siempre exportar tipos

## Ejemplo de uso

```typescript
// src/types/user.types.ts
export type UserId = string;
export type UserRole = "admin" | "user";

// src/services/user.service.ts
import { UserId, UserRole } from "@/types/user.types";

const getUserById = (id: UserId): Promise<User> => {
  // ...
};
```
