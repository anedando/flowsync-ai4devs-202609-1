
## Prompt 1

**Modelo:** sonnet
**Herramienta:** Claude Code

```
Necesito revices el request «Lo que cada tarea muestra de su responsable» dentro de la specs Tasks,con el objetivo de que generes una matriz de trazabilidad, donde se pueda ver si los test definidos dentro del proyecto son suficientes para cada Scenario.
El formato de la matriz debe ser de una linea por scenario y cuatro columnas:

1- El scenario, en una línea. Qué se espera y en qué situación. 

2- Qué test lo cubre, con el nombre exacto que aparece en la suite. Si no hay un test concreto, la columna va vacía.

3- Estado: Cubierto / No cubierto / No lo sé. Los tres estados son válidos

4- Si pusiste "no lo sé", qué te faltó para decidirlo. Media línea. Suele ser una de dos: no encontraste dónde se comprueba, o encontraste algo que se le parece y no dice exactamente lo mismo.

Crea un archivo con la matriz en docs/verificacion/AA.md. Solo Concentrate en el request indicado y no trates de reparar ni ajustar nada en los test o en el codigo de la app.
```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
 Ran 4 shell commands

● Skill(commit)
Successfully loaded skill

  Ran 1 shell command

Estoy cerrando la tarea: el commit ya está hecho, pero el push falló y reviso el remoto.

  Ran 1 shell command

No he podido abrir el PR. El push a origin falló con Permission denied (publickey): este entorno no tiene credenciales SSH para GitHub. Por eso tampoco he lanzado el subagente adversarial-reviewer, que necesita el PR.

La matriz está hecha y commiteada en la rama trazabilidad-AA (commit 728c33f). Está en docs/verificacion/AA.md.

Lo que dice la matriz sobre «Lo que cada tarea muestra de su responsable», que tiene 3 scenarios:
- Cubiertos: 0.
- Responsable identificable: no cubierto. Ningún test crea ni consulta tareas.
- La tarea no filtra datos de cuenta: no cubierto, por lo mismo.
- Responsable sin nombre: "no lo sé". Hay un test parecido, sin nombre, las iniciales salen del email, pero comprueba el login y no el assignee de una tarea.

No toqué código ni tests.


## Prompt 2

**Modelo:** sonnet
**Herramienta:** Claude Code

```
escribe los test, uno por scenario, para el request «Lo que cada tarea muestra de su responsable» dentro de la specs Tasks.
Respeta el estilo de los que ya existen en el proyecto.
Los tests que escribas van en la carpeta  backend/tests/functional/tasks
No toques nada fuera de la carpeta de tests. 
```
**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.


Voy a localizar la spec de Tasks y los tests existentes.

  Ran 5 shell commands

La BD de desarrollo ya tiene tareas, porque los tests comparten fichero con ella. Hago la aserción independiente de ese estado.

  Ran 1 shell command

El test de la lista falla por un fallo real del producto, no del test. Corrijo solo el tipado.

  Ran 2 shell commands

● Skill(commit)
Successfully loaded skill

  Ran 3 shell commands

Los tests están escritos y commiteados, pero no pude abrir el PR. El git push falla con Permission denied (publickey): la clave SSH de este equipo no la acepta GitHub. gh sí está autenticado, pero por HTTPS no se sube nada sin cambiar el remoto.

- Tests: backend/tests/functional/tasks/assignee.spec.ts tiene un test por scenario del requisito, más uno extra. «La tarea no filtra datos de cuenta» cubre la tarea suelta y la lista, así que son dos tests. Lo único que toqué es la carpeta de tests.
- Estado: 23 de 24 tests de functional pasan, y lint y typecheck están limpios.
- Fallo real: el test de la lista falla. TaskTransformer usa UserTransformer en vez de TaskAssigneeTransformer, así que GET /api/v1/tasks devuelve el email del responsable. No lo arreglé porque pediste no tocar nada fuera de los tests.
- Rama y commit: está commiteado en feat/tests-responsable-tarea, con el trailer de atribución.
- Lo que falta: gh pr create y la revisión con adversarial-reviewer, que dependen del push.
