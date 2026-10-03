SHELL := /bin/sh

.PHONY: setup start _check

# AdonisJS 7 exige Node >= 24. En WSL se rechaza el node de Windows (/mnt/...).
_check:
	@command -v node >/dev/null 2>&1 || { echo "Falta node (>= 24): instálalo antes de continuar"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "Falta npm: instálalo antes de continuar"; exit 1; }
	@case "$$(command -v node)" in /mnt/*) echo "node apunta a Windows ($$(command -v node)): instala node dentro de WSL"; exit 1;; esac
	@[ "$$(node -p 'process.versions.node.split(".")[0]')" -ge 24 ] || { echo "Se necesita Node >= 24 (hay $$(node -v))"; exit 1; }
	@case "$(CURDIR)" in /mnt/*) echo "Aviso: el repo está en $(CURDIR); en WSL conviene clonarlo dentro de ~/ (si no, no hay HMR y npm es muy lento)";; esac

setup: _check
	cd backend && npm ci
	cd frontend && npm ci
	@if [ ! -f backend/.env ]; then tr -d '\r' < backend/.env.example > backend/.env && echo "backend/.env creado"; fi
	@if tr -d '\r' < backend/.env | grep -Eq "^APP_KEY=[^[:space:]\"']"; then echo "APP_KEY ya definida, no se regenera"; else cd backend && node ace generate:key; fi
	cd backend && node ace migration:run

start: _check
	@[ -f backend/.env ] && [ -d backend/node_modules ] && [ -d frontend/node_modules ] || { echo "Falta preparar el proyecto: corre 'make setup' primero"; exit 1; }
	@echo "Backend: http://localhost:3333  Frontend: http://localhost:5173  (Ctrl+C detiene ambos)"
	@alive() { s=$$(ps -o stat= -p "$$1" 2>/dev/null); [ -n "$$s" ] && [ "$${s#Z}" = "$$s" ]; }; \
	(cd backend && exec node ace serve --hmr) & BACK=$$!; \
	(cd frontend && exec node_modules/.bin/vite) & FRONT=$$!; \
	trap 'trap - INT TERM; kill -INT $$BACK $$FRONT 2>/dev/null; wait; exit 130' INT TERM; \
	while alive $$BACK && alive $$FRONT; do sleep 1; done; \
	echo "Un servicio terminó; deteniendo el otro"; \
	kill -INT $$BACK $$FRONT 2>/dev/null; wait; exit 1
