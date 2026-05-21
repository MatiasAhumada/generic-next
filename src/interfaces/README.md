# Interfaces

Esta carpeta contiene **interfaces reutilizables** (contratos, estructuras de datos) de TypeScript.

## Propósito

Centralizar definiciones de interfaces para:
- Definir contratos claros
- Evitar duplicación de código
- Mantener un único punto de verdad
- Facilitar implementación de principios SOLID

## Qué va aquí

✅ **Interfaces de entidades**
```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}
```

✅ **DTOs (Data Transfer Objects)**
```typescript
export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}
```

✅ **Contratos de servicios**
```typescript
export interface IUserService {
  create(dto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<User>;
}
```

✅ **Props de componentes complejos**
```typescript
export interface DataTableProps<T> {
  data: T[];
  columns: Column[];
  onRowClick?: (item: T) => void;
}
```

## Qué NO va aquí

❌ **Type aliases** → Van en `/types`
❌ **Enums** → Van en `/constants`
❌ **Clases** → Van en sus respectivos módulos

## Convenciones

- Nombres en PascalCase
- Prefijo `I` para interfaces de contratos (ej: `IUserService`)
- Sin prefijo para entidades y DTOs (ej: `User`, `CreateUserDto`)
- Un archivo por dominio (ej: `user.interface.ts`, `auth.interface.ts`)
- Archivo `common.interface.ts` para interfaces genéricas
- Siempre exportar interfaces

## Ejemplo de uso

```typescript
// src/interfaces/user.interface.ts
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

// src/services/user.service.ts
import { User, CreateUserDto } from "@/interfaces/user.interface";

export const userService = {
  async create(dto: CreateUserDto): Promise<User> {
    // ...
  },
};
```

## Principio DRY (Don't Repeat Yourself)

❌ **Incorrecto** - Duplicar interfaces
```typescript
// archivo1.ts
interface User {
  id: string;
  name: string;
}

// archivo2.ts
interface User {
  id: string;
  name: string;
}
```

✅ **Correcto** - Importar desde interfaces/
```typescript
// src/interfaces/user.interface.ts
export interface User {
  id: string;
  name: string;
}

// archivo1.ts
import { User } from "@/interfaces/user.interface";

// archivo2.ts
import { User } from "@/interfaces/user.interface";
```
