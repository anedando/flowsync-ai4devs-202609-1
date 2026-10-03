SHELL := /bin/sh

.PHONY: setup start check

check:
	@command -v node >/dev/null 2>&1 || { echo "Falta node: instálalo antes de continuar"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "Falta npm: instálalo antes de continuar"; exit 1; }

setup: check
	cd backend && npm install
	cd frontend && npm install
	@if [ ! -f backend/.env ]; then cp backend/.env.example backend/.env && echo "backend/.env creado"; fi
	@if grep -q '^APP_KEY=.' backend/.env; then echo "APP_KEY ya definida, no se regenera"; else cd backend && node ace generate:key; fi
	cd backend && node ace migration:run

start: check
	@trap 'kill 0' INT TERM; \
	(cd backend && npm run dev) & \
	(cd frontend && npm run dev) & \
	wait
