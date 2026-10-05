# Spec viva: usuarios y accesos

## Purpose

Permite a una persona crear una cuenta en FlowSync, iniciar y cerrar sesión y consultar su perfil, mediante una API con tokens de acceso opacos (backend AdonisJS) y una SPA que gestiona la sesión (frontend React). Este documento describe el comportamiento observado en el código actual, no un diseño futuro.

## Requirements

### Requirement: Registro de cuenta en la API

El sistema SHALL exponer `POST /api/v1/auth/signup`, sin autenticación, que cree un usuario a partir de `fullName`, `email`, `password` y `passwordConfirmation`, y responda con `{ data: { user, token } }`.

#### Scenario: Registro correcto

- **WHEN** se envía un `email` no registrado, una `password` de 8 a 32 caracteres, una `passwordConfirmation` idéntica y un `fullName` (texto o `null`)
- **THEN** se crea el usuario con la contraseña almacenada hasheada, se emite un token de acceso y se responde con el usuario transformado (`id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`) y el token en claro

#### Scenario: Email ya registrado

- **WHEN** se envía un `email` que ya existe en la tabla `users`
- **THEN** la API responde 422 con un error de regla `database.unique` sobre el campo `email` y no crea ningún usuario

#### Scenario: Contraseña de longitud inválida

- **WHEN** la `password` tiene menos de 8 o más de 32 caracteres
- **THEN** la API responde 422 con errores de regla `minLength` o `maxLength` sobre `password`

#### Scenario: Confirmación distinta

- **WHEN** `passwordConfirmation` no coincide con `password`
- **THEN** la API responde 422 con un error de regla `sameAs` sobre `passwordConfirmation`

#### Scenario: Email mal formado o demasiado largo

- **WHEN** el `email` no tiene formato válido o supera los 254 caracteres
- **THEN** la API responde 422 con un error de regla `email` o `maxLength` sobre `email`

#### Scenario: Campos obligatorios ausentes

- **WHEN** falta `email`, `password`, `passwordConfirmation` o la clave `fullName` (que admite `null` pero debe estar presente)
- **THEN** la API responde 422 con un error de regla `required` sobre el campo ausente

### Requirement: Inicio de sesión en la API

El sistema SHALL exponer `POST /api/v1/auth/login`, sin autenticación, que verifique las credenciales y devuelva `{ data: { user, token } }` con un token de acceso nuevo.

#### Scenario: Credenciales correctas

- **WHEN** se envía un `email` registrado y su `password` correcta
- **THEN** se emite un nuevo token de acceso y se responde con el usuario transformado y el token en claro

#### Scenario: Credenciales incorrectas

- **WHEN** el `email` no existe o la `password` no corresponde al usuario
- **THEN** la API responde con un error de credenciales inválidas (código 400, sin campo asociado) y no emite token

#### Scenario: Payload inválido

- **WHEN** falta `email` o `password`, o el `email` no tiene formato válido
- **THEN** la API responde 422 con los errores de validación antes de comprobar credenciales

#### Scenario: Varias sesiones simultáneas

- **WHEN** el mismo usuario inicia sesión varias veces
- **THEN** cada inicio genera un token independiente y los anteriores siguen siendo válidos

### Requirement: Autenticación por token Bearer

El sistema SHALL autenticar las rutas del grupo `/api/v1/account` mediante el guard `api` (token opaco en la cabecera `Authorization: Bearer <token>`) y rechazar las peticiones sin credenciales válidas.

#### Scenario: Petición sin token

- **WHEN** se llama a una ruta de `/api/v1/account` sin cabecera `Authorization`
- **THEN** la API responde 401 y no ejecuta el controlador

#### Scenario: Token inválido o revocado

- **WHEN** se llama a una ruta de `/api/v1/account` con un token inexistente, manipulado o ya eliminado
- **THEN** la API responde 401

#### Scenario: Rutas de auth públicas

- **WHEN** se llama a `signup` o `login` sin token
- **THEN** la petición se procesa con normalidad, porque el middleware `auth` solo protege el grupo `account`

### Requirement: Consulta del perfil en la API

El sistema SHALL exponer `GET /api/v1/account/profile`, protegido, que devuelva los datos del usuario autenticado.

#### Scenario: Perfil de usuario autenticado

- **WHEN** se llama con un token válido
- **THEN** la API responde `{ data: { id, fullName, email, createdAt, updatedAt, initials } }` y nunca incluye la contraseña

#### Scenario: Iniciales calculadas

- **WHEN** el usuario tiene `fullName` con al menos dos palabras
- **THEN** `initials` son las mayúsculas de la primera letra de las dos primeras palabras

#### Scenario: Iniciales sin nombre

- **WHEN** el usuario no tiene `fullName`
- **THEN** `initials` se calculan a partir de la parte local del email, en mayúsculas, usando dos letras si no hay segundo término

### Requirement: Cierre de sesión en la API

El sistema SHALL exponer `POST /api/v1/account/logout`, protegido, que revoque el token con el que se hace la petición.

#### Scenario: Logout correcto

- **WHEN** se llama con un token válido
- **THEN** el token se elimina de `auth_access_tokens`, la API responde `{ message: 'Logged out successfully' }` y ese token deja de ser válido

#### Scenario: Otras sesiones no afectadas

- **WHEN** un usuario con varios tokens cierra sesión con uno de ellos
- **THEN** solo se elimina ese token y los demás siguen funcionando

#### Scenario: Logout sin sesión

- **WHEN** se llama sin token válido
- **THEN** la API responde 401

### Requirement: Formato uniforme de las respuestas

El sistema SHALL envolver las respuestas de éxito de signup, login y profile en `{ data: ... }` mediante `serialize()`, forzar JSON en todas las respuestas y permitir CORS desde cualquier origen en desarrollo.

#### Scenario: Envoltorio de datos

- **WHEN** una petición de signup, login o profile tiene éxito
- **THEN** el cuerpo es `{ data: ... }` con el usuario serializado por `UserTransformer`

#### Scenario: Cliente sin cabecera Accept

- **WHEN** una petición llega sin `Accept: application/json`
- **THEN** la respuesta, incluidos los errores, se devuelve igualmente en JSON

#### Scenario: Origen distinto en desarrollo

- **WHEN** el navegador hace una petición desde otro origen (p. ej. `http://localhost:5173`) con el entorno de desarrollo
- **THEN** CORS la permite, incluidas las cabeceras de la petición

### Requirement: Persistencia de usuarios y tokens

El sistema SHALL almacenar usuarios en la tabla `users` (email único de hasta 254 caracteres, `full_name` opcional, contraseña hasheada) y los tokens en `auth_access_tokens`, que se borran en cascada con el usuario.

#### Scenario: Unicidad de email a nivel de base de datos

- **WHEN** se intenta insertar un segundo usuario con el mismo email
- **THEN** la restricción `unique` de la columna lo rechaza, además de la validación de VineJS

#### Scenario: Token con hash

- **WHEN** se emite un token
- **THEN** solo se guarda su hash en la base de datos y el valor en claro se entrega una única vez en la respuesta

#### Scenario: Eliminación de usuario

- **WHEN** se borra un usuario
- **THEN** sus tokens de acceso se eliminan en cascada

### Requirement: Pantalla de registro

El frontend SHALL ofrecer en `/register` un formulario con nombre completo (opcional), email, contraseña y repetición de contraseña, que cree la cuenta y abra sesión.

#### Scenario: Registro correcto desde la UI

- **WHEN** la persona rellena el formulario con datos válidos y lo envía
- **THEN** se llama a `signup`, el token se guarda en `localStorage` bajo `flowsync.token`, el estado pasa a autenticado y la persona es redirigida a `/profile`

#### Scenario: Nombre vacío

- **WHEN** el nombre completo está vacío o solo tiene espacios
- **THEN** se envía `fullName: null` y la pantalla de perfil muestra «Sin nombre»

#### Scenario: Contraseñas distintas

- **WHEN** la contraseña y su repetición no coinciden
- **THEN** se muestra «Las contraseñas no coinciden.» bajo el campo de confirmación sin llamar al backend

#### Scenario: Errores del backend

- **WHEN** el backend responde 422 (p. ej. email ya registrado)
- **THEN** se muestra el mensaje en castellano bajo el campo correspondiente y el botón vuelve a habilitarse

#### Scenario: Envío en curso

- **WHEN** el formulario se está enviando
- **THEN** el botón se deshabilita y muestra «Creando cuenta…»

### Requirement: Pantalla de inicio de sesión

El frontend SHALL ofrecer en `/login` un formulario de email y contraseña que abra sesión contra la API.

#### Scenario: Login correcto desde la UI

- **WHEN** la persona envía credenciales válidas
- **THEN** el token se guarda en `localStorage`, el estado pasa a autenticado y se redirige a `/profile`

#### Scenario: Credenciales incorrectas

- **WHEN** el backend responde 400
- **THEN** se muestra en una alerta «El email o la contraseña no son correctos.»

#### Scenario: Backend no disponible

- **WHEN** la petición falla por red
- **THEN** se muestra «No se pudo conectar con el servidor. Comprueba que el backend está arrancado.»

#### Scenario: Motivo de sesión perdida

- **WHEN** una sesión previa se cayó al rehidratarse y no hay error del intento actual
- **THEN** la alerta del login muestra el motivo (`sessionError`), por ejemplo «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: Enlace cruzado

- **WHEN** la persona pulsa «Crea una» en el login o «Inicia sesión» en el registro
- **THEN** navega a la otra pantalla

### Requirement: Rehidratación de la sesión al cargar

El frontend SHALL validar contra `GET /account/profile` el token guardado en `localStorage` antes de dar la sesión por válida.

#### Scenario: Token guardado y válido

- **WHEN** la aplicación arranca con un token en `localStorage` que el backend acepta
- **THEN** el estado pasa de `loading` a `authenticated` con el usuario recibido, sin redirigir fuera de la ruta actual

#### Scenario: Token rechazado

- **WHEN** el backend responde 401 al validar el token guardado
- **THEN** se borra `flowsync.token`, el estado queda `anonymous` y se registra un `sessionError`

#### Scenario: Backend caído o error de servidor

- **WHEN** la validación falla por red o con un error distinto de 401
- **THEN** el estado queda `anonymous` en memoria, el token se conserva en `localStorage` y se registra un `sessionError`

#### Scenario: Sin token guardado

- **WHEN** no hay token en `localStorage`
- **THEN** el estado inicial es `anonymous` y no se llama al backend

### Requirement: Protección de rutas en el cliente

El frontend SHALL restringir `/profile` a sesiones autenticadas y `/login` y `/register` a visitantes anónimos, sin redirigir mientras la sesión se está resolviendo.

#### Scenario: Acceso anónimo a ruta protegida

- **WHEN** una persona sin sesión visita `/profile`
- **THEN** es redirigida a `/login`

#### Scenario: Acceso autenticado a rutas públicas

- **WHEN** una persona con sesión visita `/login` o `/register`
- **THEN** es redirigida a `/profile`

#### Scenario: Sesión en resolución

- **WHEN** el estado es `loading`
- **THEN** ambos guards muestran un cargador a pantalla completa y no redirigen

#### Scenario: Ruta desconocida

- **WHEN** se visita cualquier ruta no declarada
- **THEN** se redirige a `/profile`, que a su vez lleva a `/login` si no hay sesión

### Requirement: Pantalla de perfil

El frontend SHALL mostrar en `/profile` los datos del usuario autenticado y un botón para cerrar sesión.

#### Scenario: Datos mostrados

- **WHEN** hay sesión autenticada
- **THEN** se muestran las iniciales en un avatar, el nombre (o «Sin nombre»), el email y «Miembro desde» con `createdAt` formateado en `es-ES` con fecha larga

#### Scenario: Cerrar sesión

- **WHEN** la persona pulsa «Cerrar sesión»
- **THEN** el botón se deshabilita con «Cerrando sesión…», la sesión local se elimina (token en `localStorage`, usuario y estado) y es redirigida a `/login`

#### Scenario: Logout con fallo en el servidor

- **WHEN** la llamada a `POST /account/logout` falla o el token ya no es válido
- **THEN** la sesión local se cierra igualmente y el error se ignora

### Requirement: Cliente de API y traducción de errores

El frontend SHALL centralizar las llamadas de auth en `lib/api.ts`, adjuntar `Authorization: Bearer` cuando haya token, desenvolver `{ data }` y convertir los errores en `ApiError` con mensaje en castellano y errores por campo.

#### Scenario: Traducción de errores de validación

- **WHEN** el backend responde 422 con errores de VineJS
- **THEN** se traducen las reglas `database.unique`, `sameAs`, `email`, `required`, `minLength` y `maxLength` a frases en castellano y se indexan por campo (el primer error de cada campo)

#### Scenario: Error 401

- **WHEN** el backend responde 401
- **THEN** el mensaje es «Tu sesión ha caducado. Vuelve a iniciar sesión.»

#### Scenario: Error de servidor o respuesta no JSON

- **WHEN** el backend responde con otro estado de error o con un cuerpo que no es JSON
- **THEN** el mensaje es «Algo ha ido mal en el servidor. Inténtalo de nuevo en un momento.»

#### Scenario: URL de la API

- **WHEN** no se define `VITE_API_URL`
- **THEN** las peticiones se dirigen a `http://localhost:3333`

### Requirement: Reparto de errores en los formularios

El frontend SHALL mostrar los errores de campo bajo su input y los demás en una alerta general del formulario.

#### Scenario: Error de un campo visible

- **WHEN** todos los errores recibidos pertenecen a campos presentes en el formulario
- **THEN** se muestran bajo cada input (con `aria-invalid` y `aria-describedby`) y no se muestra alerta general

#### Scenario: Error de un campo no pintado o sin campo

- **WHEN** hay un error que no corresponde a ningún input del formulario
- **THEN** se muestra su mensaje en la alerta general

#### Scenario: Error inesperado

- **WHEN** la excepción no es un `ApiError`
- **THEN** se muestra «Algo ha ido mal. Inténtalo de nuevo.»

## Limitaciones observadas

- No existe edición de perfil, cambio ni recuperación de contraseña, verificación de email ni eliminación de cuenta.
- Los tokens emitidos no tienen caducidad configurada ni se limita su número por usuario.
- El guard `web` (sesión) está configurado pero ninguna ruta lo usa.
- No hay rate limiting en login ni en registro.
- El token se guarda en `localStorage`.
- No hay tests automatizados en backend ni en frontend.
