# Grammar Correction App

A full-stack application focused on correcting grammar in long text.

## Stack
- Frontend: Next.js App Router, React, TypeScript, Tailwind CSS
- Backend: Django REST Framework
- Auth: JWT with Simple JWT
- Database: MySQL
- AI: OpenAI-compatible API called from the Django backend

## Project structure
- `frontend/` — landing page, About, AI Agent, History, Register, Login
- `backend/` — Django REST API, JWT auth, correction endpoint, saved history
- `docker-compose.yml` — MySQL service for local development

## 1. Configure environment
Copy `.env.example` to `.env` and set `OPENAI_API_KEY` if you want live AI corrections.
The API key must remain on the backend.
Set `MYSQL_ROOT_PASSWORD` to the password for the MySQL `root` account. Django and the local MySQL container both use this value.
`FRONTEND_ORIGINS` is a comma-separated list of allowed frontend origins for Django CORS. Update it to match the browser address used to open the frontend if your computer's LAN IP changes.

## 2. Start MySQL
```bash
docker compose up -d db
```
The container is available from the host at `127.0.0.1:${MYSQL_PORT:-3306}`. In MySQL Workbench, use hostname `localhost`, port `3306` (or the configured `MYSQL_PORT`), username `root`, and the same password as `MYSQL_ROOT_PASSWORD`. The database/schema name is `finalApp`.

## 3. Start backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations corrections
python manage.py migrate
python manage.py runserver
```
Backend runs at `http://127.0.0.1:8000`.

## 4. Start frontend
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:3000`.

## Notes
- Register and login use JWT tokens stored in local storage in this starter. For production, prefer secure HttpOnly cookies and add CSRF protections.
- History is saved only for authenticated users.
- The AI correction endpoint uses the OpenAI Responses API when `OPENAI_API_KEY` is configured. Without a key, it returns a clear configuration error.
- Set `MAX_TEXT_LENGTH` to your intended limit. Very large documents may need chunking and request timeouts.

## MySQL notes
- `.env.example` is configured for the `finalApp` database and MySQL root account on `127.0.0.1:3306`, matching the Workbench connection shown above.
- If you use an existing local MySQL server instead of the Compose container, set `MYSQL_ROOT_PASSWORD` in `.env` to that server's actual root password.
- MySQL keeps initialized accounts and passwords in its persistent volume. Changing `.env` does not change an existing volume's root password; use the password already configured for that volume or intentionally reset it without deleting data you need.
- The backend uses PyMySQL, so a separate MySQL client library or development headers are not required.
- Django is configured to use MySQL; ensure the MySQL service is running before starting the backend.
