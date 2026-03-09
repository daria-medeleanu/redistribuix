# RedistribuiX

RedistribuiX is a full-stack web application that helps **optimize stock distribution across multiple locations/stands** by combining a classic management system (products, locations, transfers) with an **ML-based forecasting service** that recommends transfer batches.

---

## Problem

In real-world retail/stand networks (e.g., malls or multiple points of sale), stock is often **unevenly distributed**:

- some locations run out of items even though other locations have surplus,
- decisions are made manually, late, and without visibility into demand trends,
- transfers are costly and need justification (logistics cost vs. expected sales value).

RedistribuiX addresses this by centralizing inventory context and adding a “recommended transfers” workflow powered by forecasting.

---

## Solution (High-level)

RedistribuiX provides:

- A **management platform** for products, locations, and stock movement.
- A **Transfer Batches workflow** (recommended → approved/rejected → completed) that records operational decisions.
- An **ML Forecast microservice** that predicts near-future sales and computes “days of stock”, which drives transfer recommendations.

---

## Technology Stack

### Backend (RedistribuiXWebAPI)

- **C# / .NET 9** — ASP.NET Core Web API
- **PostgreSQL** — primary database
- **Entity Framework Core 9** — ORM & persistence
- **JWT authentication** (JwtBearer)
- **BCrypt** — password hashing
- **MediatR** — CQRS style commands/queries
- **FluentValidation** — request validation
- **AutoMapper** — DTO mapping
- OpenAPI tooling (includes **Scalar.AspNetCore**)

### Frontend (RedistribuiXWeb)

- **React 19**
- **Vite** (dev server + build)
- **Tailwind CSS**
- **React Router**
- Mapping/geo:
  - **Leaflet / React-Leaflet**
  - **Mapbox GL / react-map-gl**
- **framer-motion** (UI animations)
- **xlsx** (spreadsheet import/export)

### ML Microservice (RedistribuiXMLAPI)

- **Python**
- **FastAPI**
- **joblib + model.pkl** (model loading)
- **pandas / numpy** (feature generation)
- **scikit-learn** — training & inference

---

## Architecture

The system is composed of three main services, orchestrated via Docker Compose:

- **db** — PostgreSQL 16 instance.
- **api** — .NET 9 Web API, connects to db and calls the ML API.
- **mlapi** — Python FastAPI service that exposes the forecasting model.
- **web** — React/Vite frontend served via nginx (Dockerfile) and talking to api.

---

## Services Overview

### 1) ML Forecast Service (RedistribuiX ML API)

RedistribuiX uses a separate Python FastAPI microservice to forecast demand and produce a decision-friendly metric: **Days of Stock**.

- **Endpoint:** `POST /forecast`
- **Inputs (conceptually):**
  - last 30 days of sales (per location + product),
  - location attributes (encoded profile & purchasing power),
  - current stock quantity,
  - forecast horizon (default 100 days).
- **Output (conceptually):**
  - total predicted quantity on the horizon,
  - predicted daily sales,
  - `days_of_stock_ml` and a stock status label.
- **How it works:** an autoregressive forecast loop using calendar features (weekday/weekend, month, after-payday) and lag/rolling statistics. The model is loaded from `model.pkl` at startup; if not present, a fallback heuristic is used.

This service is consumed by the .NET backend when building transfer recommendations.

---

### 2) Transfer Batches Service (Recommendations + Workflow)

A **Transfer Batch** is a proposed or executed movement of stock:

- **source location → destination location**
- contains one or more products with quantities
- has a lifecycle status (e.g., recommended/approved/rejected/completed)

Key capabilities:

- Store and query transfer batches and their product lines.
- Generate system recommendations via a backend “recommendation service”.
- Support manual decisions (approve/reject) and record outcomes (completed / denial reason).

#### How recommendations are generated

The .NET backend:

1. reads current stock information (stock velocities) across all locations,
2. calls the ML Forecast Service per (location, product) to estimate `days_of_stock_ml`,
3. identifies:
   - **low-stock locations** (below a threshold) → need stock
   - **high-stock locations** (above a threshold) → have surplus
4. proposes transfer batches from surplus → deficit, aiming to optimize availability while accounting for constraints like transport costs and avoiding duplicates for already manually-approved transfers.

The frontend exposes this workflow through pages like **Suggested Transfers** and **Completed Transfers**.

---

## Running the Project

### Using Docker (recommended)

Requirements:

- Docker
- Docker Compose

Steps:

1. Clone this repository.
2. From the project root, run:
   - `docker-compose up --build`
3. After the build finishes:
   - Backend API: http://localhost:5056
   - ML API: http://localhost:8000
   - Web app: http://localhost:5173

Docker will automatically start PostgreSQL, the .NET API, the ML API, and the frontend.
