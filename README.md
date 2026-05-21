# Generic Next

> Plantilla profesional Next.js para acelerar el desarrollo de aplicaciones frontend

Una base sólida y reutilizable para proyectos Next.js, diseñada con los más altos estándares de la industria. Integra las mejores prácticas, patrones arquitectónicos escalables y componentes listos para producción.

## 🚀 Stack Tecnológico

| Categoría | Tecnologías |
|-----------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript 5 |
| **Estilos** | Tailwind CSS 4 |
| **Componentes** | shadcn/ui + Radix UI |
| **Iconos** | Hugeicons React |
| **Animaciones** | Framer Motion |
| **HTTP Client** | Axios |
| **Validación** | Zod |
| **Notificaciones** | Sonner |
| **Package Manager** | pnpm |

## ✨ Características Principales

### 🏗️ Arquitectura Escalable

```
src/
├── app/
│   ├── api/            # Route handlers (proxy a backend externo)
│   └── ...             # Páginas y layouts
├── components/          # Componentes React
│   ├── common/         # Componentes genéricos reutilizables
│   └── ui/             # Componentes de UI (shadcn)
├── constants/          # Constantes y configuraciones
├── lib/                # Utilidades y configuración de librerías
├── services/           # Servicios frontend (API client)
└── utils/              # Utilidades y helpers
    └── handlers/       # Manejadores de errores
```

### 🎯 Componentes Genéricos

**DataTable** - Tabla de datos con:
- Búsqueda integrada
- Animaciones con Framer Motion
- Contenido expandible
- Loading states
- Total de registros

**GenericModal** - Modal reutilizable con:
- Múltiples tamaños (sm, md, lg, xl, 2xl, 4xl)
- Variantes de tema (default, dark)
- Animaciones de entrada/salida
- ConfirmModal incluido para diálogos de confirmación

### 🔐 Manejo de Errores

**Frontend (`clientError.handler`)**
```typescript
clientErrorHandler(error, callback, {
  showToast: true,
  messagePrefix: "Error al guardar: ",
});
```

**API Routes (opcional)**
```typescript
import { apiErrorHandler } from "@/utils/handlers/apiError.handler";

export async function POST(request: NextRequest) {
  try {
    const { data } = await clientAxios.post("/users", body);
    return NextResponse.json(data);
  } catch (error) {
    return apiErrorHandler(error);
  }
}
```

### 📦 Patrones Implementados

- **Service Layer** - Servicios frontend para comunicación con API
- **API Client** - Axios con interceptores centralizados
- **Constantes Centralizadas** - Sin valores hardcodeados
- **Route Handlers** - Proxy opcional a backend externo

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor en puerto 3000

# Código
pnpm format           # Formatea con Prettier
pnpm lint             # Ejecuta ESLint
pnpm build            # Build de producción
```

## 📋 Primeros Pasos

### 1. Configurar Variables de Entorno

```bash
copy .env.example .env
```

Edita `.env` con tu configuración:

```env
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Iniciar Desarrollo

```bash
pnpm dev
```

Visita `http://localhost:3000`

## 🎨 Ejemplos de Uso

### DataTable Genérica

```tsx
import { DataTable } from "@/components/common";

<DataTable
  title="Usuarios"
  subtitle="Gestión de usuarios del sistema"
  columns={[
    { key: "name", label: "Nombre" },
    { key: "email", label: "Email" },
  ]}
  data={users}
  keyExtractor={(item) => item.id}
  onSearch={handleSearch}
  actions={
    <Button onClick={handleCreate}>Nuevo Usuario</Button>
  }
  onRowClick={(user) => handleEdit(user)}
/>
```

### Modal Genérico

```tsx
import { GenericModal, ConfirmModal } from "@/components/common";

<GenericModal
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Editar Usuario"
  description="Modifica los datos del usuario"
  size="lg"
>
  {/* Contenido del modal */}
</GenericModal>

<ConfirmModal
  open={showConfirm}
  onOpenChange={setShowConfirm}
  title="Eliminar Usuario"
  description="¿Estás seguro de eliminar este usuario?"
  onConfirm={handleDelete}
  variant="destructive"
/>
```

### Servicio Frontend

```tsx
import { userService } from "@/services/user.service";
import { clientErrorHandler, clientSuccessHandler } from "@/utils/handlers/clientError.handler";

const handleCreate = async (data: CreateUserDto) => {
  try {
    await userService.create(data);
    clientSuccessHandler("Usuario creado exitosamente");
  } catch (error) {
    clientErrorHandler(error);
  }
};
```

### API Route (Proxy Opcional)

```tsx
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { clientAxios } from "@/utils/clientAxios.util";
import { apiErrorHandler } from "@/utils/handlers/apiError.handler";

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
```

## 🔒 Reglas de Desarrollo

Este proyecto sigue estándares estrictos de calidad:

- ✅ TypeScript estricto (sin `any`)
- ✅ Sin comparaciones explícitas (`=== null`, `=== undefined`)
- ✅ Sin valores hardcodeados (todo en constantes)
- ✅ Nombres descriptivos y semánticos
- ✅ Funciones pequeñas con una sola responsabilidad
- ✅ Principios SOLID
- ✅ Endpoints REST compliant
- ✅ Manejo centralizado de errores

## 📁 Estructura de Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/constants/routes.ts` | Rutas de la app y API |
| `src/constants/config.constant.ts` | Configuración global |
| `src/constants/error-messages.constant.ts` | Mensajes de error |
| `src/utils/clientAxios.util.ts` | Instancia Axios configurada |
| `src/components/common/` | Componentes reutilizables |
| `src/app/api/` | Route handlers (proxy opcional) |

## 🎯 Cuándo Usar Esta Plantilla

Ideal para:

- ✅ Sistemas de gestión administrativa (frontend)
- ✅ Dashboards y paneles de control
- ✅ Aplicaciones SPA con backend separado
- ✅ Aplicaciones CRUD complejas
- ✅ Proyectos que requieren escalabilidad frontend

No recomendado para:

- ❌ Landing pages simples
- ❌ Blogs estáticos
- ❌ Prototipos rápidos sin necesidad de arquitectura

## 🤝 Contribución

Esta plantilla está diseñada para ser extendida. Para agregar nuevas funcionalidades:

1. **Servicios Frontend**: Crea en `src/services/`
2. **Componentes**: Agrega en `src/components/common/` si son reutilizables
3. **Constantes**: Centraliza en `src/constants/`
4. **API Routes** (opcional): Crea en `src/app/api/` si necesitas proxy

## 📄 Licencia

MIT - Libre uso para proyectos personales y comerciales.

---

**Desarrollado con ❤️ usando Next.js, TypeScript y las mejores prácticas de la industria.**
