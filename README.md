# RedistribuiX

RedistribuiX este o aplicație web pentru managementul stocurilor și redistribuirea produselor între locații, care combină:

- un frontend modern React + Vite
- un backend REST API scris în ASP.NET Core
- un serviciu ML (FastAPI) pentru forecast de vânzări și clasificare a stocului
- o bază de date PostgreSQL

Toate serviciile sunt orchestrate cu Docker Compose.

## Structura proiectului

- `docker-compose.yml` – orchestrarea containerelor (PostgreSQL, Web API, ML API, Frontend)
- `RedistribuiXWeb/` – aplicația frontend (React + Vite)
- `RedistribuiXWebAPI/` – Web API-ul principal (ASP.NET Core)
- `RedistribuiXMLAPI/` – serviciul ML (FastAPI + model ML încărcat cu `joblib`)

### Frontend – RedistribuiXWeb

- Tech stack: React, Vite, React Router, Tailwind CSS, Leaflet / Mapbox pentru hartă.
- Punct de intrare: `src/main.jsx`, componenta principală: `src/App.jsx`.
- Pagini și componente pentru:
  - dashboard, locații, detaliu locație
  - categorii produse și vânzări zilnice
  - transferuri sugerate (folosind ML API)
  - autentificare și profil utilizator

### Backend – RedistribuiXWebAPI

- Tech stack: ASP.NET Core Web API.
- Punct de intrare: `RedistribuiXWebAPI/Program.cs`.
- Straturi/Proiecte:
  - `Domain/` – entități de domeniu, enum-uri, logică de bază
  - `Application/` – DTO-uri, servicii de aplicație, use case-uri
  - `Infrastructure/` – acces la date (repositories, EF Core, migrații), conexiune la PostgreSQL
  - `RedistribuiXWebAPI/` – proiectul Web API (controllers, configurarea pipeline-ului HTTP)
- Se conectează la PostgreSQL prin connection string-ul `DefaultConnection` și comunică cu ML API-ul prin `ML_API_BASE_URL`.

### ML API – RedistribuiXMLAPI

- Tech stack: FastAPI, Python, scikit-learn (sau model compatibil `joblib`).
- Punct de intrare: `ml_api.py`.
- Endpoint principal: `POST /forecast`
  - primește date despre locație, produs, ultimele 30 de zile de vânzări, profil client etc.
  - calculează un forecast autoregresiv pentru o perioadă configurabilă (`forecast_horizon`)
  - întoarce totalul prognozat, vânzările medii zilnice, zilele de stoc (`days_of_stock_ml`) și o clasificare a stocului (`DEAD_STOCK`, `STOCKOUT_RISK`, `NORMAL`).

## Rulare cu Docker Compose (recomandat)

Cerințe:
- Docker și Docker Compose instalate

Din directorul rădăcină al proiectului (unde se află `docker-compose.yml`):

```bash
docker-compose up --build
```

Aceasta va porni:
- `db` – PostgreSQL (port host: `5432`)
- `api` – RedistribuiX Web API (port host: `5056`)
- `mlapi` – ML API (port host: `8000`)
- `web` – frontend-ul RedistribuiX (port host: `5173`)

Apoi poți accesa aplicația web în browser la:

- http://localhost:5173

> Notă: La prima rulare, migrațiile bazei de date și inițializările pot dura câteva secunde.

## Rulare manuală (fără Docker)

### 1. Baza de date PostgreSQL

- Creează o bază de date `RedistribuX` locală.
- Asigură-te că user-ul și parola corespund connection string-ului folosit în Web API
  (implicit: user `postgres`, parola `paroladb`).

### 2. ML API (Python / FastAPI)

Din directorul `RedistribuiXMLAPI/`:

1. Creează și activează un mediu virtual (opțional, dar recomandat).
2. Instalează dependențele:

```bash
pip install -r requirements.txt
```

3. Pornește API-ul:

```bash
python ml_api.py
```

ML API-ul va rula implicit pe `http://127.0.0.1:8000`.

> Asigură-te că fișierul `model.pkl` există în folderul `RedistribuiXMLAPI/` pentru a avea predicții reale; altfel, API-ul folosește un fallback simplu.

### 3. Web API (.NET)

Din directorul `RedistribuiXWebAPI/` (soluția .sln):

1. Restaurează pachetele și construiește proiectul:

```bash
dotnet restore
dotnet build
```

2. Pornește proiectul Web API (din folderul `RedistribuiXWebAPI/RedistribuiXWebAPI` sau direct din soluție):

```bash
dotnet run --project RedistribuiXWebAPI/RedistribuiXWebAPI.csproj
```

API-ul va rula pe portul configurat (de ex. `https://localhost:5056` sau `http://localhost:5056`), în funcție de profilul de lansare.

AI grijă ca variabilele de mediu / appsettings să pointeze corect către:
- baza de date PostgreSQL
- ML API (de ex. `ML_API_BASE_URL = "http://localhost:8000/"`)

### 4. Frontend (React + Vite)

Din directorul `RedistribuiXWeb/`:

1. Instalează dependențele:

```bash
npm install
```

2. Pornește serverul de dezvoltare:

```bash
npm run dev
```

Implicit, aplicația va rula pe `http://localhost:5173`.

> Verifică fișierele de configurare (de ex. `src/constants/constants.js`) pentru a te asigura că URL-urile către API și ML API sunt corecte în modul local.

## Configurare și variabile de mediu

### Docker Compose

În `docker-compose.yml` sunt importante:

- serviciul `db` – configurarea bazei de date Postgres
- serviciul `api` – variabile de mediu
  - `ASPNETCORE_ENVIRONMENT=Development`
  - `ConnectionStrings__DefaultConnection` către containerul `db`
  - `ML_API_BASE_URL` către containerul `mlapi`

### Web API

Fișierul `appsettings.json` (în [RedistribuiXWebAPI/RedistribuiXWebAPI/appsettings.json](RedistribuiXWebAPI/RedistribuiXWebAPI/appsettings.json)) controlează:

- connection string-ul spre Postgres
- alte setări specifice aplicației.

### ML API

- Folosește `model.pkl` din folderul `RedistribuiXMLAPI/`.
- Poți controla host-ul și portul în apelul `uvicorn.run` din `ml_api.py` sau prin rularea cu `uvicorn` din linia de comandă.

## Testare rapidă a ML API

După ce ML API-ul rulează, poți testa endpoint-ul `/forecast` cu un request tipic:

```json
{
  "location_id": "LOC1",
  "product_id": "PROD1",
  "start_date": "2025-01-01",
  "recent_sales_30_days": [10, 12, 9, 11, 8, 10, 13, 9, 12, 11, 10, 9, 8, 7, 10, 11, 12, 10, 9, 8, 11, 12, 10, 9, 8, 7, 6, 8, 9, 10],
  "forecast_horizon": 30,
  "profile_type_encoded": 1,
  "purchasing_power_encoded": 2,
  "current_stock": 100
}
```

Poți trimite acest request cu Postman, curl sau direct din Web API, în funcție de implementare.

## Dezvoltare ulterioară

Câteva direcții posibile de extindere:

- autentificare și autorizare pe roluri (admin, stand manager etc.)
- îmbunătățirea modelului ML (feature engineering, retrain periodic)
- monitorizare și logging centralizat pentru toate serviciile
- pipeline CI/CD pentru build automat, testare și deploy.
