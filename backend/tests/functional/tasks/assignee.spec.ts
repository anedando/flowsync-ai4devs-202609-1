import Task from '#models/task'
import User from '#models/user'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Lo que cada tarea muestra de su responsable. Cubre los tres scenarios del
 * requisito «Lo que cada tarea muestra de su responsable» de
 * `openspec/specs/tasks/spec.md`: responsable identificable, la tarea que no
 * filtra datos de cuenta (suelta y en la lista) y el responsable sin nombre.
 */
test.group('Tasks | responsable', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const HOY = '2026-10-13'

  async function sesion(client: any, fullName: string | null, email = 'ada@example.com') {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  test('el responsable llega con su nombre y sus iniciales', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    const task = await Task.create({ title: 'Escribir el motor', assigneeId: user.id })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.equal(response.body().data.assignee.fullName, 'Ada Lovelace')
    assert.equal(response.body().data.assignee.initials, 'AL')
  })

  test('la tarea suelta no incluye el email del responsable', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    const task = await Task.create({ title: 'Escribir el motor', assigneeId: user.id })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.notProperty(response.body().data.assignee, 'email')
    assert.notInclude(JSON.stringify(response.body()), 'ada@example.com')
  })

  test('la tarea de la lista no incluye el email del responsable', async ({ client, assert }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    await Task.create({ title: 'Escribir el motor', assigneeId: user.id })

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    const tareas = response.body().data as Array<{ assignee: object }>
    assert.isNotEmpty(tareas)
    for (const tarea of tareas) {
      assert.notProperty(tarea.assignee, 'email')
    }
    assert.notInclude(JSON.stringify(response.body()), 'ada@example.com')
  })

  test('el responsable sin nombre llega con nombre nulo e iniciales', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, null)
    const task = await Task.create({ title: 'Escribir el motor', assigneeId: user.id })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today: HOY })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    assert.isNull(response.body().data.assignee.fullName)
    assert.equal(response.body().data.assignee.initials, 'AE')
  })
})
