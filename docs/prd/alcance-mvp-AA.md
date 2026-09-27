1. Problema

La ronda de "¿en qué estás?" en la daily (y su equivalente por chat/Slack durante el día) consume tiempo y no evita el problema real: sin visibilidad del estado del equipo, dos personas pueden chocar sobre el mismo trabajo sin saberlo (episodio concreto: dos devs tocaron el mismo módulo la misma semana, dos días perdidos). Nadie puede ver en qué está el equipo sin interrumpir a alguien o esperar a la reunión.

2. Usuarios

Equipos remotos pequeños (3–10 personas), roles planos, sin jerarquía de permisos. El valor lo cobran los pares — quien evita re-trabajo y quien deja de ser interrumpido — no un manager ni un reporte hacia arriba. Caso de estudio (no cliente real): equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado + daily de 15 minutos por videollamada.

3. Propuesta de valor

Ver el estado de las tareas del equipo fresco, sin preguntar y sin reunión, para no empezar algo que otro ya está tocando y elegir lo siguiente sabiendo qué está libre. Se sostiene porque actualizar cuesta dos clics sobre la misma lista que la persona ya usa como su cola de trabajo — no es un favor que le hace a los demás, es su propia herramienta de trabajo.

4. Alcance (actualizado)

- Registro/login (ya existe en el repo) → cae directo en el único espacio compartido del equipo.
- Crear tarea: título, responsable, fecha de vencimiento.
- Cambiar el estado de cualquier tarea (propia o ajena) en pocos clics, sin campos obligatorios extra.
- Borrar una tarea — solo el responsable de esa tarea puede borrarla.
- Ver la lista completa de tareas del equipo con estado, responsable y vencimiento.
- Filtrar la lista por estado.
- Resaltar de un vistazo las tareas vencidas.
- La lista se ve fresca al abrirla / mientras está abierta, sin necesidad de refrescar manualmente.

Nota de consistencia: como ya no hay edición, el responsable de una tarea queda fijado en el momento de creación — no hay forma de reasignarla después salvo borrándola y creándola de nuevo (con el mismo dueño del borrado: solo el responsable).

5. No-alcance 

┌────────────────────────────────────────────────────────────┬─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                          Excluido                          │                                                                                 Por qué                                                                                 │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Edición/reasignación de tareas (título, responsable,       │ Riesgo de conflicto entre miembros: cualquiera podía cambiar el responsable o el contenido de la tarea de otro sin su acuerdo. Se prefiere inmutabilidad post-creación  │
│ fecha)                                                     │ + borrado acotado al dueño antes que abrir esa fricción social sin validar.                                                                                             │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Borrado por cualquier miembro                              │ Reemplazado por borrado restringido al responsable — evita que alguien borre trabajo de otra persona por error o desacuerdo.                                            │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Múltiples equipos/espacios                                 │ El caso validado es un único equipo compartido; agregar la entidad "equipo" multiplica permisos y onboarding sin usuario que lo haya pedido. Se anota como supuesto, no │
│                                                            │  se construye.                                                                                                                                                          │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Roles/permisos jerárquicos                                 │ El dolor es entre pares, no hacia un manager; no hay comprador para reportes hacia arriba.                                                                              │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Notificaciones push / actualización vía websockets         │ La señal buscada es "resumen que espera", no aviso que interrumpe — construir push es infraestructura para un valor que el propio caso rechaza.                         │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Integración con Slack                                      │ Reintroduce el mismo canal de interrupción que el producto busca eliminar, más OAuth de terceros sin validar aún el loop base.                                          │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Estado derivado de Git/PRs/CI/calendario                   │ Es "otro producto": requiere OAuth e integraciones. El MVP depende de que actualizar sea manual y barato (2 clics), no automatizado.                                    │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Comentarios/adjuntos en tareas                             │ El objetivo es frescura de estado, no colaboración documental — reintroduce la conversación por tarea que el producto quiere evitar.                                    │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Sprints, backlog priorizado, épicas, estimaciones,         │ Explícitamente fuera: el usuario objetivo no planifica así, y cada uno es una superficie de configuración que contradice "menos rollo que Jira".                        │
│ informes/analítica                                         │                                                                                                                                                                         │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Indicadores de presencia ("quién está online")             │ Rechazado a propósito: el estado es de la tarea, no de la persona — eso es vigilancia.                                                                                  │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Recordatorios/nudges automáticos                           │ No fue pedido y es un paso hacia automatismos que el MVP evita.                                                                                                         │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Historial/auditoría de cambios de estado                   │ Nadie pidió trazabilidad; el objetivo es el estado actual, no el histórico.                                                                                             │
├────────────────────────────────────────────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Recuperación de contraseña, verificación de email, gestión │ Ya fuera del starter actual; no es parte del problema a validar.                                                                                                        │
│  avanzada de cuenta                                        │                                                                                                                                                                         │
└────────────────────────────────────────────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘



Mis 3 lineas 

1- La IA propuso 8 cosas dentro del alcance. Finalmente quedaron 8 pero agregue y quite cosas
2- 3 cosas que deje afuera:
    Historial/auditoría de cambios de estado - Nadie pidio trazabilidad
    Recuperación de contraseña, verificación de email - No es parte del problema a validar
    Edición/reasignación de tareas -  Creo que esta fuera del MVP porque requiere seguimiento de cambios en las tareas y manejo de resolucion de conflictos
3- El recorte que mas dudas me dio, es el quitar la edicion de tareas y dejar solo el alta y la baja. Al pedirse una herramienta simple, permitir editar y cambiar asignaciones pueden generar conflictos entre Devs.Se podria agregar mas adelante una vez superado el MVP
