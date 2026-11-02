# Reglas de Arquitectura y Estándares de Ingeniería - React Native (Alta Escalabilidad)

Este documento establece las reglas obligatorias de arquitectura, tipado estricto, manejo de estado (Zustand), navegación y rendimiento para la aplicación móvil en React Native y TypeScript.

---

## 1. Arquitectura Modular por Flujos de Dominio (Feature-Driven Mobile)

Se reemplaza la carpeta plana `screens/` por **`features/`**. Cada feature representa un módulo de negocio completo que puede contener una o varias pantallas relacionadas (Stacks/Modals), compartiendo sus propios componentes, hooks, servicios, estilos y estado local sin contaminar el directorio raíz.

### Estructura Oficial del Proyecto

```text
├── src/
│   ├── app/                      # Punto de entrada, Providers, ErrorBoundary global
│   ├── assets/                   # Fuentes, imágenes estáticas, animaciones Lottie, SVGs
│   ├── components/               # UI Kit Global (Átomos y moléculas reutilizables en toda la app)
│   │   ├── ui/                   # Button, Text, Input, Avatar, BottomSheet, Loader
│   │   └── layout/               # SafeAreaContainer, KeyboardAvoidingWrapper, Header
│   │
│   ├── config/                   # Variables de entorno validadas, constantes, rutas de API
│   ├── hooks/                    # Hooks globales agnósticos (useAppState, useKeyboard, useNetInfo)
│   ├── lang/                     # Configuración i18n y diccionarios de idiomas (es.json, en.json)
│   ├── lib/                      # Instancias de SDKs externos (httpClient, socketClient, storageMMKV)
│   ├── navigation/               # Configuración raíz de React Navigation
│   │   ├── RootNavigator.tsx     # Switch entre AuthStack y MainTabNavigator
│   │   ├── MainTabNavigator.tsx  # Barra inferior principal
│   │   ├── linking.ts            # Configuración de Deep Links
│   │   └── types.ts              # Tipado maestro de rutas (RootStackParamList)
│   │
│   ├── store/                    # Estado Global Transversal con Zustand (SOLO datos de toda la app)
│   │   ├── useAuthStore.ts       # Token, sesión activa, datos básicos del usuario logueado
│   │   └── useAppConfigStore.ts  # Tema (Dark/Light), idioma actual, estado de conexión
│   │
│   ├── theme/                    # Sistema de Diseño (Tokens de colores, espaciados, tipografía)
│   │   ├── colors.ts
│   │   ├── spacing.ts
│   │   ├── typography.ts
│   │   └── index.ts
│   │
│   ├── types/                    # Contratos globales (ApiResponse<T>, PaginatedResponse<T>, AppError)
│   ├── utils/                    # Funciones puras (formateo de fechas, monedas, validadores)
│   │
│   └── features/                 # Módulos de Negocio (Reemplaza a 'screens/')
│       ├── home/                 # Ejemplo: Módulo de un solo flujo
│       │   ├── api/              # Llamadas HTTP exclusivas de Home (antes 'services/')
│       │   ├── components/       # Sub-componentes exclusivos de Home
│       │   ├── hooks/            # Lógica de vista y llamadas a api/ (ej. useHomeFeed.ts)
│       │   ├── screens/          # Vistas del módulo
│       │   │   └── HomeScreen/
│       │   │       ├── index.tsx
│       │   │       └── styles.ts
│       │   ├── store/            # Store de Zustand exclusivo del módulo (si aplica)
│       │   ├── types/            # Interfaces y DTOs exclusivos de Home
│       │   ├── utils/            # Funciones puras exclusivas de Home (antes 'helpers/')
│       │   └── index.ts          # API pública del módulo (exporta las pantallas al Navigator)
│       │
│       ├── videocalls/           # Ejemplo: Módulo Multi-Pantalla (Lobby, Llamada, Resumen)
│       │   ├── api/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── screens/
│       │   │   ├── LobbyScreen/
│       │   │   │   ├── index.tsx
│       │   │   │   └── styles.ts
│       │   │   └── ActiveCallScreen/
│       │   │       ├── index.tsx
│       │   │       └── styles.ts
│       │   ├── store/            # Ej. useCallSessionStore.ts
│       │   ├── types/
│       │   └── index.ts
│       │
│       ├── auth/
│       ├── coins/                # Compras integradas, billetera virtual y paquetes
│       ├── discovery/            # Matching y perfiles
│       └── profile/
```

---

## 2. Estandarización de Formularios e Inputs (React Hook Form)

**Regla Mandatoria**: Todo formulario e input en la aplicación **DEBE** gestionarse mediante **React Hook Form**.

### Estándares Obligatorios:

1. **Componentes Globales Obligatorios**:
   - Todo campo de texto en formularios debe utilizar **`ControlledInput`** (o `AppInput` si es un input no controlado/independiente fuera de formularios) ubicado en `src/components/ui/`.
   - Prohibido el uso directo de `<TextInput>` de React Native con múltiples `useState` dispersos dentro de pantallas y formularios.
2. **Conexión Declarativa**:
   - Se debe conectar cada campo mediante la prop `control` de `useForm` y la prop `name`.
   - Las reglas de validación o esquemas deben registrarse en las `rules` de cada campo o mediante resolvers.
3. **Manejo Centralizado de Errores y Estados**:
   - Los mensajes de error deben mostrarse automáticamente a través de `ControlledInput`, alimentados del estado del formulario (`fieldState.error?.message`).
   - Todos los textos y mensajes de validación deben provenir de `i18n` (`t(...)`).
4. **Ejemplo de Implementación Estándar**:

```tsx
import { useForm } from "react-hook-form";
import { ControlledInput } from "@/components";

interface LoginFormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { control, handleSubmit } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormData) => {
    // Lógica de submit
  };

  return (
    <>
      <ControlledInput
        control={control}
        name="email"
        label="Correo electrónico"
        placeholder="tu@email.com"
        rules={{
          required: "El correo es obligatorio",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Ingresa un correo electrónico válido",
          },
        }}
      />
    </>
  );
};
```
