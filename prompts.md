# Prompts

---

## Prompt 1

**Modelo:** Sonet
**Herramienta:** Claude Code

```
 Analiza el proyecto actual.Tu objetivo es determinar lo que ya existe, para evitar rehacerlo y que el futuro desarrollo sea compatible con lo existente. Creame un resumen con toda la informacion, el resumen debe contener que capacidades tiene contruidas actualmente el proyecto, cual es el modelo de datos definido y cualquier otra consideracion que sea importante. 



---

## Prompt 2

**Modelo:** Sonet
**Herramienta:** Claude Code

```
 Sos un ingeniero de producto y te definen lo siguiente como nuevo producto: 
 "Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira."
 
 Teniendo en cuenta este resumen guardado en: @/home/andresa/.claude/plans/analiza-el-proyecto-actual-tu-snug-squirrel.md ,que contiene lo existente en en el proyecto, necesito me definas las 5 preguntas a realizar, asi puedo reducir la incentidumbre sobre los usuarios y el alcance. No bajes al modelo de datos o definiciones del endpoint. Estamos en la etapa de definicion de historias de usuario.


---

## Prompt 3

**Modelo:** Sonet
**Herramienta:** Claude Code

```
Queda estrictamente fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.
 Te paso todas las respuestas que tengo al respecto de este tema:
 Te paso todas estas definiciones para que busques respuestas, si alguna pregunta no es repondida decidilo vos y marcalo como supuesto. Inclui un resumen de todos los supuestos que definiste:
- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias


---

## Prompt 4

**Modelo:** Sonet
**Herramienta:** Claude Code

```
Proponeme un alcance en cinco bloques para el el MVP. Problema · usuarios · propuesta de valor · alcance · NO-alcance. Recorta todo lo que consideres que necesario, pero justificame cada exclusion que realices.


---

## Prompt 5

**Modelo:** Sonet
**Herramienta:** Claude Code

```
La funcionalidad de editar queda fuera del alcance porque asi evitamos conflictos de seguimiento de cambios entre usuarios. Si agrega la funcionalidad de Borrar, pero unicamente puede borrar una tarea el usuario que la tiene asignada




