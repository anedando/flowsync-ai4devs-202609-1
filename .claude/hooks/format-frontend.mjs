// PostToolUse hook: formatea con Prettier los archivos editados dentro de frontend/.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { resolve, relative, extname, sep } from 'node:path'

const input = JSON.parse(readFileSync(0, 'utf8'))
const file = input.tool_input?.file_path
if (!file) process.exit(0)

const frontend = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd(), 'frontend')
const rel = relative(frontend, resolve(file))
if (rel.startsWith('..') || rel.split(sep).includes('node_modules')) process.exit(0)

const exts = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json', '.css', '.html', '.md']
if (!exts.includes(extname(file))) process.exit(0)

const r = spawnSync('npx', ['prettier', '--write', resolve(file)], { cwd: frontend, encoding: 'utf8' })
if (r.status !== 0) {
  console.error(r.stderr || r.stdout)
  process.exit(2)
}
