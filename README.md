
# Gestor estratégico de tareas

Aplicación web de gestión de tareas (SPA) desarrollada como Proyecto Integrador del Módulo 4 de Henry, a partir de una consigna ficticia de la startup MateCode. Cada usuario se registra, inicia sesión y administra sus propias tareas. Además puede recibir por email un resumen de su lista.

- **Aplicación en producción:** https://proyecto-todo-app.vercel.app
- **Repositorio:** https://github.com/scarfcarob/ProyectoM4_CarolinaBetlienski
- **Autora:** Carolina S. Betlienski

> Importante: el código de la aplicación vive en la subcarpeta `proyecto-todo-app/`, no en la raíz del repositorio. Todos los comandos de este README se ejecutan desde esa carpeta.

## Índice

1. [Funcionalidades](#funcionalidades)
2. [Instrucciones de uso](#instrucciones-de-uso)
3. [Stack tecnológico](#stack-tecnológico)
4. [Arquitectura y decisiones técnicas](#arquitectura-y-decisiones-técnicas)
5. [Requisitos y ejecución en local](#requisitos-y-ejecución-en-local)
6. [Testing](#testing)
7. [Despliegue en Vercel](#despliegue-en-vercel)
8. [Seguridad](#seguridad)
9. [Limitaciones conocidas](#limitaciones-conocidas)
10. [Mejoras futuras](#mejoras-futuras)
11. [Uso crítico de IA](#uso-crítico-de-ia)

## Funcionalidades

- Registro e inicio de sesión con email y contraseña, y con Google.
- Confirmación de contraseña en el registro y botón para mostrar u ocultar la contraseña.
- Rutas protegidas: `/tasks` solo es accesible con sesión iniciada. Las rutas públicas son `/login` y `/register`.
- Cierre de sesión con confirmación previa.
- CRUD de tareas (crear, ver, editar, completar y eliminar), guardadas en Firestore y filtradas por usuario, con actualización en tiempo real.
- Contadores de tareas totales, pendientes y completadas.
- Envío por email de un resumen de tareas, usando AWS SES desde una función serverless.
- Mensajes de error traducidos al español, y estados de carga y error en las operaciones asíncronas.
- Diseño mobile-first.

## Instrucciones de uso

Esta es la guía para quien usa la aplicación, ya sea en producción (https://proyecto-todo-app.vercel.app) o en local.

1. **Crear una cuenta.** En `/register`, ingresar un email válido, una contraseña de al menos 6 caracteres y repetirla en "Confirmar contraseña". Si las dos contraseñas no coinciden, el formulario muestra un error y no se envía. También se puede registrar con el botón "Continuar con Google".
2. **Iniciar sesión.** En `/login`, con email y contraseña o con Google. El ícono de ojo a la derecha del campo de contraseña permite mostrarla u ocultarla. Si se intenta entrar a `/tasks` sin sesión, la aplicación redirige a `/login`.
3. **Agregar una tarea.** En "Agregar nueva tarea", escribir un título (obligatorio, hasta 100 caracteres) y, si se quiere, una descripción (hasta 500 caracteres). Luego presionar "Agregar tarea".
4. **Completar, editar o eliminar.** Cada tarea se marca como completada con su casilla, se edita desde su tarjeta (con las mismas validaciones que al crearla) y se elimina con el botón correspondiente. Los contadores de tareas totales, pendientes y completadas se actualizan solos.
5. **Recibir el resumen por email.** El botón "Enviar resumen por email" manda a la dirección de la cuenta un resumen con la cantidad de tareas totales, completadas y pendientes. Por una limitación de AWS SES, solo llega a direcciones verificadas (ver "Limitaciones conocidas").
6. **Cerrar sesión.** El botón "Cerrar sesión" pide confirmación: "Cancelar" mantiene la sesión abierta y "Aceptar" la cierra y lleva a `/login`.

Cada usuario ve únicamente sus propias tareas.

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite 8 |
| Estilos | Tailwind CSS v4 |
| Navegación | React Router v7 |
| Autenticación y base de datos | Firebase Authentication y Cloud Firestore |
| Email | AWS SES (`@aws-sdk/client-ses`) |
| Backend | Vercel Functions (serverless) |
| Hosting | Vercel |
| Testing | Vitest, React Testing Library y jsdom |

## Arquitectura y decisiones técnicas

### Estructura de carpetas

Todo el código vive dentro de `proyecto-todo-app/`:

```
proyecto-todo-app/
├── .vercel/                     # Configuración local que crea la CLI de Vercel al vincular el proyecto
├── api/
│   └── send-email.ts            # Función serverless que envía el resumen con AWS SES
├── dist/                        # Build de producción (se genera con npm run build)
├── node_modules/                # Dependencias instaladas (se genera con npm install)
├── public/                      # Archivos estáticos (por ejemplo, el favicon)
├── src/
│   ├── assets/                  # Recursos estáticos importados por el código
│   ├── components/
│   │   ├── ErrorMessage.tsx     # Muestra un mensaje de error
│   │   ├── PasswordInput.tsx    # Campo de contraseña con botón para mostrar u ocultar
│   │   ├── ProtectedRoute.tsx   # Redirige a /login si no hay sesión
│   │   ├── SendSummaryButton.tsx # Botón que envía el resumen por email
│   │   ├── Spinner.tsx          # Indicador de carga
│   │   ├── TaskCard.tsx         # Tarjeta de una tarea, con edición y borrado
│   │   ├── TaskForm.tsx         # Formulario para agregar una tarea
│   │   └── TaskList.tsx         # Lista de tareas
│   ├── context/
│   │   ├── AuthContext.ts       # Contexto de autenticación y su hook de acceso
│   │   └── AuthProvider.tsx     # Provee el estado de sesión a toda la app
│   ├── hooks/
│   │   ├── useAuth.ts           # Lógica de sesión: login, registro, logout y errores
│   │   └── useTasks.ts          # Suscripción a las tareas del usuario y operaciones CRUD
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── TasksPage.tsx
│   ├── routes/
│   │   └── AppRoutes.tsx        # Definición de rutas públicas y protegidas
│   ├── services/
│   │   ├── authService.ts       # Acceso a Firebase Authentication
│   │   ├── emailService.ts      # Llamada a la función /api/send-email
│   │   ├── firebaseConfig.ts    # Inicialización de Firebase
│   │   └── tasksService.ts      # Acceso a Firestore
│   ├── types/
│   │   ├── task.ts
│   │   └── user.ts
│   ├── utils/
│   │   ├── authErrors.ts        # Traducción de los errores de Firebase Auth
│   │   ├── formatDate.ts        # Formato de fechas
│   │   └── validators.ts        # Validaciones de formularios (funciones puras)
│   ├── App.tsx
│   ├── index.css                # Estilos globales
│   └── main.tsx                 # Punto de entrada de React
├── tests/
│   ├── components/
│   │   ├── PasswordInput.test.tsx
│   │   ├── ProtectedRoute.test.tsx
│   │   ├── SendSummaryButton.test.tsx
│   │   ├── TaskForm.test.tsx
│   │   └── TaskList.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.tsx
│   │   └── useTasks.test.tsx
│   ├── unit/
│   │   ├── authErrors.test.ts
│   │   ├── formatDate.test.ts
│   │   └── validators.test.ts
│   └── setup.ts                 # Configuración global de los tests
├── .env                         # Variables de entorno locales (no se sube al repositorio)
├── .env.example                 # Plantilla de variables, sin valores
├── .gitignore
├── eslint.config.js             # Configuración de ESLint
├── firestore.rules              # Reglas de seguridad de Firestore
├── index.html                   # HTML de entrada de Vite
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json                # Configuración de TypeScript (con tsconfig.app.json y tsconfig.node.json)
├── tsconfig.app.json
├── tsconfig.node.json
├── vercel.json                  # Rewrite para la SPA
├── vite.config.ts               # Configuración de Vite (incluye el proxy de /api para desarrollo)
└── vitest.config.ts             # Configuración de Vitest
```

**Responsabilidad de cada capa**

- `pages/` arma cada pantalla y `components/` reúne las piezas reutilizables, que reciben datos y funciones por props.
- `hooks/` y `context/` concentran el estado y la lógica de sesión y de tareas, de modo que los componentes no repiten esa lógica.
- `services/` es la única capa que habla con Firebase y con la API de email.
- `utils/` y `types/` contienen funciones puras y tipos, sin dependencia de React.
- `tests/` replica esa organización: los tests de `unit/` no usan mocks, los de `components/` y `hooks/` mockean los servicios.

### Decisiones principales

- **Separación por capas.** Los componentes y páginas no hablan directo con Firebase: lo hacen a través de `services/` y de los hooks. Así la lógica de datos queda en un solo lugar y se puede mockear en los tests.
- **Una sola suscripción de autenticación.** El estado de sesión vive en `AuthContext`, y tanto las páginas como `useTasks` lo consumen desde ahí. `useTasks` espera a que termine de cargar la sesión antes de suscribirse a Firestore, para no abrir conexiones duplicadas ni consultar sin usuario.
- **Validaciones como funciones puras.** Las reglas de los formularios están en `utils/validators.ts`, sin depender de React, lo que permite testearlas sin renderizar nada. El formulario de registro usa `validatePasswordMatch` para comparar la contraseña con su confirmación.
- **El envío de email pasa por una función serverless.** Las credenciales de AWS solo existen en el servidor (variables de entorno de Vercel) y nunca llegan al navegador. La función solo acepta `POST`, valida el formato del email destinatario y que los contadores sean numéricos, y ante un fallo de SES responde con un mensaje genérico, sin devolver el detalle interno del error.
- **Reglas de Firestore.** Cada usuario solo puede leer y modificar sus propias tareas, y tampoco se permite reescribir la fecha de creación (`createdAt`) desde el cliente. Las reglas usan las funciones `isOwner` (comprueba que haya sesión y que el `uid` coincida con el dueño del documento) y `hasValidTaskShape` (valida la forma de los datos de la tarea). Se probaron en el Rules Playground de Firebase: un usuario ajeno editando una tarea ajena es denegado, el dueño cambiando `createdAt` es denegado y una edición normal es permitida.
- **`createdAt` puede ser `null` localmente.** `serverTimestamp()` deja el campo en `null` en el snapshot local hasta que el servidor confirma, por eso el tipo es `Timestamp | null`.
- **Rewrite en `vercel.json`.** Todas las rutas que no empiezan con `/api/` se redirigen a `index.html`, para que recargar `/tasks` en producción no devuelva un 404.
- **Confirmación al cerrar sesión con `window.confirm`.** Elegí el cuadro nativo del navegador en lugar de un modal propio: es más simple, tiene menos superficie de errores y cumple el objetivo de evitar un cierre de sesión accidental.
- **Stack definido por la consigna.** React, TypeScript, Tailwind, Firebase, AWS SES, Vercel y Vitest venían indicados por la consigna del proyecto; las decisiones propias están en cómo se organizó el código y en los puntos de esta lista.
- **Errores traducidos y estados explícitos.** Los códigos de error de Firebase Auth se traducen al español en `utils/authErrors.ts`, y las operaciones asíncronas muestran estados de carga y de error en lugar de fallar en silencio.
- **Tests aislados de servicios externos.** Los tests mockean `authService`, `tasksService` y `emailService`, por lo que no necesitan conexión a Firebase ni credenciales de AWS para ejecutarse.

## Requisitos y ejecución en local

### Requisitos

- **Node.js 24 y npm.** Es la versión con la que se desarrolló y probó el proyecto.
- **Git.**
- **Un proyecto de Firebase** con Authentication (email/contraseña y Google) y Firestore.
- **Una cuenta de AWS con SES**, para el envío del resumen por email.
- No hace falta instalar la CLI de Vercel de forma global: ya está incluida como dependencia de desarrollo y `npm run dev:all` la usa.

### Configuración de los servicios externos

**Firebase**

1. En la consola de Firebase, crear un proyecto.
2. En Authentication → Sign-in method, habilitar "Correo electrónico/contraseña" y "Google".
3. Crear una base de Firestore y publicar en la pestaña "Reglas" el contenido del archivo `firestore.rules` del repositorio.
4. En la configuración del proyecto, registrar una app web y copiar sus valores a las seis variables `VITE_FIREBASE_*` del archivo `.env`.
5. `localhost` ya figura entre los dominios autorizados por defecto, así que el login con Google funciona en local sin pasos extra.

**AWS SES**

1. Elegir una región de SES y usar ese mismo valor en `AWS_REGION`.
2. Verificar en SES la dirección que se usará como remitente (`SES_SENDER_EMAIL`).
3. Mientras la cuenta esté en modo sandbox, verificar también cada dirección que vaya a recibir el resumen.
4. Crear unas credenciales de acceso (`AWS_ACCESS_KEY_ID` y `AWS_SECRET_ACCESS_KEY`). Se recomienda un usuario de IAM con permiso únicamente para enviar email con SES, no una cuenta con permisos amplios. En este proyecto se usó una política de IAM acotada, con permiso únicamente para enviar email. Estas credenciales nunca se suben al repositorio.

### Pasos para ejecutar en local

```bash
git clone https://github.com/scarfcarob/ProyectoM4_CarolinaBetlienski.git
cd ProyectoM4_CarolinaBetlienski/proyecto-todo-app
npm install
cp .env.example .env
```

En Windows PowerShell, el equivalente de `cp` es `Copy-Item .env.example .env`.

Después:

1. Completar el archivo `.env` con los valores de Firebase y AWS (tabla de la sección siguiente).
2. Ejecutar `npm run dev` para trabajar solo con el frontend, o `npm run dev:all` si también se quiere probar el envío de email (ver más abajo).
3. Abrir `http://localhost:5173`.

Antes de cualquier comando, comprobar que la terminal está parada dentro de `proyecto-todo-app/` (el código no está en la raíz del repositorio). Instalar paquetes desde la carpeta equivocada genera un `node_modules` y un `package.json` duplicados, y eso rompe cosas (ver "Si fallan los tests" en la sección de Testing).

### Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_FIREBASE_API_KEY` | Configuración de Firebase (cliente) |
| `VITE_FIREBASE_AUTH_DOMAIN` | Configuración de Firebase (cliente) |
| `VITE_FIREBASE_PROJECT_ID` | Configuración de Firebase (cliente) |
| `VITE_FIREBASE_STORAGE_BUCKET` | Configuración de Firebase (cliente) |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Configuración de Firebase (cliente) |
| `VITE_FIREBASE_APP_ID` | Configuración de Firebase (cliente) |
| `AWS_ACCESS_KEY_ID` | Credencial de AWS (solo servidor) |
| `AWS_SECRET_ACCESS_KEY` | Credencial de AWS (solo servidor) |
| `AWS_REGION` | Región de SES (solo servidor) |
| `SES_SENDER_EMAIL` | Remitente verificado en SES (solo servidor) |

Las variables con prefijo `VITE_` quedan incluidas en el código del navegador, por eso son únicamente la configuración pública de Firebase. Las de AWS no llevan ese prefijo y solo las lee la función de `api/`. El archivo `.env` está en `.gitignore` y no se sube al repositorio.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el frontend con Vite en `localhost:5173` |
| `npm run dev:all` | Levanta el frontend y la función serverless juntos |
| `npm run build` | Chequea tipos (`tsc -b`) y genera el build de producción |
| `npm run preview` | Sirve el build generado |
| `npm run lint` | Ejecuta ESLint |
| `npm run test` | Ejecuta todos los tests una vez |
| `npm run test:watch` | Ejecuta los tests en modo observación |

### Desarrollo local con la función de email

`npm run dev` solo sirve el frontend, así que el botón de resumen por email necesita además la función de `api/`. Para eso se usa `npm run dev:all`, que corre Vite (puerto 5173) y `vercel dev` (puerto 3001) a la vez. Vite reenvía las peticiones a `/api` al puerto 3001. Se separan en dos puertos porque correr `vercel dev` solo interfiere con las rutas internas de Vite por el rewrite global de `vercel.json`. En producción es un único servidor y esto no aplica.

La primera vez, `vercel dev` puede pedir iniciar sesión y vincular el proyecto existente. Es posible que la consola del puerto 3001 muestre un error interno de Vite al leer `index.html`; no afecta a la aplicación que se abre en `localhost:5173`.

## Testing

La suite tiene **49 tests en 10 archivos**, con Vitest, React Testing Library y el entorno jsdom.

| Tipo | Archivos | Qué cubren |
|---|---|---|
| Unitarios (sin mocks) | `validators`, `formatDate`, `authErrors` | Funciones puras, incluida la validación de confirmación de contraseña |
| Componentes sin Firebase | `TaskForm`, `TaskList`, `PasswordInput` | Interacción del usuario, validaciones y casos de error |
| Componente con servicio mockeado | `SendSummaryButton` | Estados de éxito y falla del envío (mock de `emailService`) |
| Hooks con Firebase mockeada | `useAuth`, `useTasks` | Carga, errores, suscripción y casos borde (mock de los servicios) |
| Rutas | `ProtectedRoute` | Acceso con y sin sesión (contexto falso) |

Hay al menos un caso de error o borde por cada área, por ejemplo: login con credenciales inválidas, `onAdd` rechazado por una falla de red, o `useTasks` que no se suscribe mientras la sesión sigue cargando. La configuración está en `vitest.config.ts` y `tests/setup.ts`.

No hay tests automáticos de las páginas (`LoginPage`, `RegisterPage`, `TasksPage`) ni de la función `api/send-email.ts`. Esas partes se verificaron manualmente.

### Cómo ejecutar los tests

Desde `proyecto-todo-app/`:

```bash
npm run test          # ejecuta toda la suite una vez
npm run test:watch    # modo observación: vuelve a correr al guardar cambios
```

Para correr un solo archivo o un solo test:

```bash
npx vitest run tests/unit/validators.test.ts
npx vitest run -t "marca error si el título está vacío"
```

El resultado esperado es `Test Files 10 passed (10)` y `Tests 49 passed (49)`. Los tests no necesitan el archivo `.env` ni credenciales, porque Firebase y los servicios externos están mockeados. El aviso de Vitest "jsdom was created N times" es solo una nota de rendimiento y no indica un error.

**Si fallan los tests.** Un error "Invalid hook call" en todos los tests que renderizan componentes suele indicar que hay más de una copia de React en el proyecto. Para comprobarlo, ejecutar `npm ls react react-dom @testing-library/react` desde `proyecto-todo-app/` y verificar que haya una sola versión de cada paquete, y revisar que no exista un `node_modules` ni un `package.json` en la carpeta superior. Si existen, y las dependencias de testing están declaradas en el `package.json` del proyecto, esas copias sobrantes se pueden apartar.

## Despliegue en Vercel

La aplicación se despliega en Vercel con integración continua desde GitHub: un push a una rama genera un Preview y un push a `main` actualiza producción.

### Requisitos previos

- El repositorio subido a GitHub.
- Una cuenta de Vercel conectada a GitHub.
- Firebase y AWS SES configurados como se explica en "Requisitos y ejecución en local".

### Pasos

1. En Vercel, elegir "Add New → Project" e importar el repositorio de GitHub.
2. En la configuración del proyecto, definir **Root Directory** como `proyecto-todo-app`, porque ahí vive el código. Vercel detecta Vite por sí solo: el comando de build es `npm run build` y la carpeta de salida es `dist`.
3. En **Environment Variables**, cargar las 10 variables de la tabla de variables de entorno (las 6 de Firebase y las 4 de AWS). Habilitarlas para **Production y también para Preview**: si solo se habilitan para Production, los Previews no pueden enviar emails ni conectarse a Firebase.
4. Ejecutar el deploy. Cuando el estado del deploy figure como **Ready**, la aplicación ya tiene una URL pública.
5. En Firebase, ir a Authentication → Configuración → Dominios autorizados y agregar el dominio de producción (por ejemplo `proyecto-todo-app.vercel.app`), sin `https://`. Sin este paso el login con Google falla en Vercel.

El archivo `vercel.json` del proyecto redirige todas las rutas que no empiezan con `/api/` a `index.html`. Esto es lo que evita el 404 al recargar páginas como `/tasks`, y no hay que modificarlo para desplegar.

### Previews y flujo de trabajo

- Cada rama genera un Preview con una URL única por deploy y una URL estable por rama, del estilo `proyecto-todo-app-git-<rama>-<cuenta>.vercel.app`.
- Para probar Google en un Preview, agregar en Firebase esa URL exacta. Conviene autorizar la URL estable de la rama y no la de cada deploy, para no repetir el paso en cada push. Se agregan dominios exactos y no comodines (como `vercel.app`), para no habilitar otras aplicaciones alojadas en Vercel.
- Cada conjunto de cambios se desarrolló en su propia rama (por ejemplo `fix/hardening-m4` y `feat/confirm-password`), con commits pequeños siguiendo Conventional Commits (`feat(m4):`, `fix(m4):`, `chore(m4):`, `test(m4):`), y se probó en el Preview antes de integrarlo a `main`.
- Si se cambia una variable de entorno en Vercel, hay que volver a desplegar para que el cambio se aplique.

### Lista de verificación después del deploy

1. Iniciar sesión con email y con Google.
2. Registrar una cuenta, probando que el error de contraseñas distintas aparezca.
3. Crear, editar, completar y eliminar una tarea.
4. Recargar `/tasks` y comprobar que no da 404.
5. Enviar el resumen por email a una dirección verificada en SES.
6. Cerrar sesión con la confirmación.

### Problemas frecuentes

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| El login con Google muestra "Ocurrió un error inesperado" | El dominio desde el que se abrió la página no está en los dominios autorizados de Firebase. La consola del navegador lo indica con un aviso de OAuth | Agregar ese dominio en Firebase y abrir la aplicación desde él |
| El resumen por email dice "enviado" pero no llega | El correo está en spam o el destinatario no está verificado en SES | Revisar spam, y revisar en la consola de SES (en la misma región que `AWS_REGION`) los envíos y rebotes |
| El resumen falla en un Preview pero anda en producción | Las variables de entorno no están habilitadas para Preview | Habilitarlas y volver a desplegar |
| Error 404 al recargar `/tasks` | Falta el rewrite de `vercel.json`, o Root Directory mal configurado | Verificar que `vercel.json` esté en `proyecto-todo-app/` y que sea el Root Directory |

## Seguridad

- Las credenciales de AWS se usan únicamente en la función serverless; no están en el código del cliente.
- `.env` está ignorado por git, y `.env.example` solo contiene los nombres de las variables, sin valores.
- La función de email no devuelve al cliente los mensajes internos de AWS.
- Las reglas de Firestore restringen el acceso de cada usuario a sus propios datos.

## Limitaciones conocidas

- **AWS SES en modo sandbox.** SES solo entrega a direcciones verificadas, así que el resumen por email llega únicamente a destinatarios previamente verificados. Si se intenta enviar a otra dirección, la aplicación muestra un error controlado sin exponer detalles internos. Además, los correos de prueba pueden terminar en la carpeta de spam. Para enviar a cualquier destinatario habría que pedir a AWS la salida del sandbox.
- **La función de email no verifica al usuario.** El destinatario lo manda el navegador y `api/send-email.ts` no comprueba que quien llama haya iniciado sesión. Hoy el sandbox de SES limita el alcance, pero si se saliera del sandbox, cualquiera podría usar el endpoint para enviar correos a cualquier dirección. La mejora sería verificar el token de Firebase del usuario en la función (por ejemplo con `firebase-admin`) y tomar el email de ahí. En esta etapa se decidió no hacerlo, porque con SES en modo sandbox el riesgo real es acotado y la verificación sumaba una dependencia y complejidad innecesarias.
- **Tamaño del bundle.** El build advierte que el archivo JavaScript supera los 500 kB (Firebase y el SDK de AWS son librerías grandes). No afecta el funcionamiento; una posible mejora es dividir el código con importaciones dinámicas.
- **Sin tests automáticos de páginas ni de la función `api/`**, como se indicó en la sección de testing.

## Mejoras futuras

- Verificar el token de Firebase en la función de email (ver limitaciones).
- Mostrar un `Spinner` en `ProtectedRoute` en lugar del texto "Cargando...".
- Unificar el voseo en los textos de `TaskList`.
- Eliminar el campo `updatedAt`, que hoy no se usa en `Task`.
- Redirigir desde `/login` y `/register` a `/tasks` si ya hay una sesión activa.
- Traducir el error `auth/unauthorized-domain` en `utils/authErrors.ts`, que hoy cae en el mensaje genérico.
- Reemplazar `window.confirm` por un modal propio con el estilo de la aplicación.

## Uso crítico de IA

### Herramientas utilizadas y para qué

Usé Claude (de Anthropic) como asistente a lo largo de todo el proyecto, en etapas distintas:

- **Diseño y seguridad:** definir la interfaz `Task` y los tipos de usuario, la estructura de carpetas y las reglas de Firestore (`isOwner`, `hasValidTaskShape`), que probé en el Rules Playground.
- **CRUD de tareas:** armar `TaskForm`, `TaskCard` y `TaskList` conectados a `useTasks()` con `onSnapshot`, y diagnosticar un bug de un checkbox que no respondía.
- **Email:** configurar AWS SES con una política de IAM acotada y escribir la función serverless `api/send-email.ts`.
- **Interfaz:** migrar el diseño a Tailwind CSS v4 con enfoque mobile-first y agregar el login con Google.
- **Deploy:** diagnosticar un error de build en Vercel.
- **Testing:** resolver un problema de dependencias y llegar a los 49 tests en verde.
- **Mejoras finales:** mostrar y ocultar la contraseña, confirmación al cerrar sesión y confirmación de contraseña en el registro.
- **Revisión contra la rúbrica** antes de los commits finales, y redacción de este README.

Las decisiones sobre qué aceptar, qué descartar y cuándo integrar a producción fueron mías (ver "Qué decidí yo").

### Cómo trabajé con la IA

- **Le pasaba el código real y la salida real de la consola.** En lugar de describir los problemas de memoria, pegaba mis archivos (`RegisterPage.tsx`, `LoginPage.tsx`, `TasksPage.tsx`, `validators.ts`, `package.json`) y capturas de la terminal, del navegador y del panel de Problemas de VS Code.
- **Pedía el porqué antes de aplicar una sugerencia.** Por ejemplo, cuando me indicó renombrar una carpeta y un `package.json` de la carpeta superior, pregunté para qué era necesario cada comando antes de correrlo.
- **Consultaba antes de commitear.** Confirmaba qué archivos agregar y si el `git status` era el esperado.
- **Pedía ver el resultado antes de aplicarlo**, por ejemplo una imagen de cómo se vería el formulario con el campo nuevo.
- **Pedía los archivos completos** para pegarlos y probarlos, y no fragmentos sueltos.

### Prompts que mejor funcionaron

1. **El error exacto, el contexto y lo que ya había probado.** Cuando describí el bug del checkbox con el comportamiento puntual que veía, se llegó rápido a la causa real (el traductor de Chrome interfiriendo con el DOM), algo difícil de adivinar con un pedido genérico como "no me funciona el checkbox". Con el error de Vercel, pegar el mensaje literal (`vite: command not found`) llevó directo a la causa: el Root Directory mal configurado.
2. **Código real y capturas, no descripciones.** Adjuntar el panel de Problemas o las herramientas de desarrollador en vez de explicar el síntoma con palabras evitó diagnósticos genéricos.
3. **Preguntas concretas sobre el impacto de un cambio.** Por ejemplo: "si hago estas modificaciones, ¿tendría que volver a crear los tests?". La respuesta me ayudó a entender qué tests se rompen a propósito y cuáles protegen lo que ya funcionaba.
4. **Pedir una revisión contra un criterio externo.** Revisar el código contra la rúbrica funcionó mejor que preguntar "¿está bien mi código?", porque da una vara objetiva.

### Errores y problemas detectados

Los primeros casos son problemas que detecté yo mientras probaba; los últimos surgieron al revisar el código generado con ayuda de la IA.

| Caso | Qué pasó | Cómo se detectó y qué enseña |
|---|---|---|
| Checkbox que no se tildaba | La lógica corría, pero el checkbox de "completada" no cambiaba de estado visualmente. La causa fue el traductor de Chrome interfiriendo con el DOM. | Lo detecté probando la app a mano, no por un error de consola. Enseña que un bug visual puede venir del entorno del navegador y no del código. |
| Advertencias de Tailwind | El editor marcaba `cssConflict` y `suggestCanonicalClasses` en las clases de Tailwind. | Las vi en el panel de Problemas de VS Code antes de preguntar. Enseña a leer las advertencias del editor. |
| Header que parecía no apilarse en mobile | A 440px el encabezado no parecía apilarse. | Al volver a probar con zoom al 100% en lugar de "Fit to window", vi que era un artefacto de la herramienta de captura y no un error de responsive. Enseña a confirmar que el síntoma sea real antes de cambiar código. |
| Error de build en Vercel | El deploy fallaba con `vite: command not found`. | Lo detecté al intentar desplegar y leer el log de build. La causa era el Root Directory mal configurado. |
| Fallas de envío de email | Había que comprobar qué pasa si el envío del resumen falla. | Reproduje las fallas a propósito, probando con y sin conexión a internet, y verifiqué que la aplicación muestra un error controlado. |
| Tests que pasaban en el entorno de la IA y fallaban en el mío | Los 41 tests pasaban donde la IA los probó, pero en mi máquina daban "Invalid hook call". La causa final fue que `vitest`, `jsdom` y Testing Library estaban declarados en un `package.json` de la carpeta superior y no en el del proyecto, que los tomaba de ahí con otra copia de `react-dom`. | Se detectó ejecutando comandos de diagnóstico (`npm ls`, `Test-Path` y `Get-Content package.json`) y comparando los dos `package.json`. Enseña que Node busca dependencias subiendo de carpeta si no las encuentra, y que un test que pasa en el entorno de la IA no garantiza que pase en el mío. |
| Script `dev` inexistente | La IA me indicó correr `npm run dev` sin comprobar que ese script existiera. | Al ejecutarlo apareció `Missing script: "dev"`; revisé el `package.json`, vi que solo estaba `dev:all` y agregué `"dev": "vite"`. Enseña a verificar cada comando en el propio proyecto. |
| Tipo de evento inexistente | `TaskForm` usaba `React.SubmitEvent`, un tipo que no existe y sin importar `React`. Se corrigió a `FormEvent<HTMLFormElement>` importado de `react`. | Surgió en la revisión del código contra la rúbrica y se verificó con `tsc -b`, `eslint` y `vite build`. Enseña que el código generado puede compilar en la cabeza de la IA y no en el proyecto real. |
| Fuga de información interna | `api/send-email.ts` devolvía `error.message` de AWS al cliente. Se cambió por un mensaje genérico y el detalle se registra solo en el servidor. | Surgió en la misma revisión. Enseña que los errores internos de un servicio externo no deben llegar al navegador. |
| Suscripción duplicada | `useTasks` usaba `useAuth()`, que abría una segunda suscripción a Firebase. Se pasó a `useAuthContext()` y a esperar `authLoading`. | Surgió en la misma revisión. Enseña a compartir un único estado de sesión en lugar de duplicar suscripciones. |
| Errores sin capturar | `onDelete={removeTask}` no manejaba fallos, y `TaskCard` solo hacía `.trim()` en vez de validar. Se agregó manejo de errores y `validateTask`. | Surgió en la misma revisión. Enseña que cada operación asíncrona necesita su propio manejo de errores. |

### Qué decidí yo

Decisiones que tomé revisando las opciones que me daba la IA:

- **No agregar `firebase-admin` a la función de email.** La IA sugirió validar el token de Firebase dentro de `api/send-email.ts`, para que no cualquiera que conozca la URL pueda dispararla. Evalué que, con SES en modo sandbox, el riesgo real es acotado, y que `firebase-admin` sumaba una dependencia y complejidad que no eran necesarias en esta etapa. Prioricé la simplicidad y dejé la limitación documentada en este README.
- **Elegir el camino más conservador con el dinero.** Al crear la cuenta de AWS elegí un medio de pago prepago con límite de gasto en lugar de una tarjeta de crédito, aunque implicara un paso extra, y usé una política de IAM acotada en vez de permisos amplios.
- **Hacer las tres mejoras de interfaz antes del README**, agrupadas en una sola rama con un único merge a `main` y un commit por mejora. La IA me había sugerido cerrar primero el merge y el README y dejar las mejoras cosméticas para después. Prefería que el README reflejara el estado final.
- Elegir `window.confirm` en lugar de un modal propio para la confirmación al cerrar sesión.
- Autorizar en Firebase solo los dominios exactos de cada deploy y no un comodín, para no habilitar otras aplicaciones de Vercel.
- No modificar `vercel.json` para resolver un problema de desarrollo local, porque esa regla evita el 404 en producción.
- Probar cada cambio en el Preview de Vercel antes de integrarlo a producción.

### Cómo verifiqué lo que generó la IA

- Ejecuté `npm run test` y `npm run build` después de cada cambio.
- Probé manualmente cada funcionalidad en local y en el Preview de Vercel, incluyendo los casos de error y los envíos de email con y sin conexión.
- Probé las reglas de Firestore en el Rules Playground con casos permitidos y denegados.
- Revisé el código contra la rúbrica de evaluación antes de los commits finales.
- Antes de cada commit revisé `git status` y `git diff`, y agregué los archivos por nombre y no con `git add .`, para no subir las carpetas apartadas. Por ejemplo, confirmé que el cambio de `.env.example` era solo una línea en blanco, sin ningún valor.
- Cuando el login con Google falló en un Preview con "Ocurrió un error inesperado", no lo di por un error de código: abrí la consola del navegador, vi que el dominio no estaba autorizado en Firebase y lo agregué.
- Cuando el resumen figuraba como enviado pero no llegaba, no lo di por un error de código: revisé la entrega del correo hasta confirmar que llegaba y documenté la limitación del modo sandbox de SES.

### Qué entiendo del código

Dos fragmentos que puedo explicar con mis palabras.

**Regla de Firestore `isOwner`**

```js
function isOwner(userId) {
  return request.auth != null && request.auth.uid == userId;
}
```

Esta función chequea dos cosas antes de dejar pasar una operación sobre un documento. Primero, que `request.auth` no sea `null`, es decir, que la persona esté efectivamente logueada (si no lo está, Firebase no le asigna ningún `auth`). Segundo, que el `uid` del usuario logueado coincida con el `userId` guardado en el documento que intenta leer o modificar. Así, aunque alguien esté autenticado, no puede tocar tareas que no le pertenecen: es la regla que hace que cada usuario solo vea y edite sus propias tareas.

**Estilo dinámico en `TaskCard.tsx`**

```tsx
<li className={`group border rounded-2xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 ${
  task.completed
    ? 'bg-gray-50/60 border-gray-200'
    : 'bg-white border-gray-200 hover:border-violet-200 hover:shadow-md'
}`}>
```

El `className` cambia según el estado `completed` de la tarea. Si está completada se ve con fondo gris apagado y sin efecto al pasar el mouse; si está pendiente tiene fondo blanco y reacciona al hover con borde violeta y sombra. Así se distingue de un vistazo qué tareas siguen activas, sin necesidad de leer el texto.
