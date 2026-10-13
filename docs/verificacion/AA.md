# Matriz de trazabilidad — «Lo que cada tarea muestra de su responsable»

Spec: `openspec/specs/tasks/spec.md` (capability `tasks`).

- **Scenarios del requisito:** 3
- **Scenarios cubiertos:** 0

| Scenario | Test que lo cubre | Estado | Qué faltó para decidirlo |
|---|---|---|---|
| Al obtener una tarea cuyo responsable es "Ada Lovelace", su `assignee` trae el nombre y las iniciales ("AL") | | No cubierto | |
| Al obtener cualquier tarea (suelta o en la lista), su `assignee` no incluye el email ni otro dato de acceso | | No cubierto | |
| Si el responsable se registró sin nombre, su `assignee` trae el nombre nulo y las iniciales siguen llegando | | No lo sé | Existe `sin nombre, las iniciales salen del email` (`auth/initials.spec.ts`), pero comprueba el login, no el `assignee` de una tarea, y no mira el nombre nulo |

## Notas

- La suite solo contiene tests functional de `auth` (`signup`, `login`, `session`, `initials`). Ningún test crea ni consulta tareas, así que no hay ninguno que toque `assignee`.
- Los tres tests de `initials.spec.ts` prueban el cálculo de iniciales de la cuenta vía `POST /api/v1/auth/login`; sirven de apoyo indirecto a las iniciales, pero no son un test del requisito.
- No se ha modificado código ni tests: solo se ha evaluado la cobertura.



------
Mis 3 lineas 

1- No habia scenarios para el Tasks, o sea creia que habia 0 cubiertos. Pero 1 el del "responsable se registro sin nombre" estaba.
2-El del resposable sin nombre. puede sacar las iniciales de quien esta logueado, pero no de del Asignee
3-si, la task "la tarea de la lista no incluye el email del responsable"

