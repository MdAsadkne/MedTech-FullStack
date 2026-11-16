# MedTech | Medicine catalogue demo

A portfolio project built with **React, Vite, Java 17, Spring Boot, Spring Data JPA, and H2**. Browse and search a sample medicine catalogue, inspect product details, and add or remove demo entries. The React app runs as a local browser demo by default and can connect to the Spring REST API when `VITE_API_BASE_URL` is configured.

> **Educational demo only.** This project is not a pharmacy, does not sell medicines, and does not provide medical advice. All catalogue entries and prices are fictional examples. Do not use this application to make treatment decisions.

## Live demo

**[Open the MedTech demo](https://mdasadkne.github.io/MedTech-FullStack/)** — GitHub Pages deploys the React app when changes reach `main`. In the hosted demo, edits are stored in your browser. The backend is not hosted by GitHub Pages.

## Features

- Responsive React catalogue with search, category filters, and product details.
- Add and delete sample entries in demo mode; browser storage keeps changes on that device.
- Spring Boot REST API supports listing, searching, viewing, creating, updating, and deleting entries.
- H2 file database for local backend runs; no separate database server required.
- Accessible labels, keyboard-friendly controls, loading and error states.

## Technology

| Area | Stack |
| --- | --- |
| Frontend | React 19, Vite 8, CSS |
| Backend | Java 17, Spring Boot 4.1, Spring Web MVC, Spring Data JPA, Validation |
| Database | H2 |
| Automation | GitHub Actions (frontend build, backend package, Pages deployment) |

## Run the browser demo

Requirements: Node.js 20 or newer and npm.

```bash
cd frontend
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`. With no API URL configured, the app uses sample data stored in browser `localStorage`.

## Run with the Spring Boot API

Requirements: Java 17 or newer and Maven 3.9 or newer.

```bash
cd backend
mvn spring-boot:run
```

In a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env.local` with:

```dotenv
VITE_API_BASE_URL=http://localhost:8080/api
```

Then run `npm run dev`. The backend serves the API at `http://localhost:8080/api/medicines`; the H2 console is at `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:file:./data/medtechdb`, username `sa`, blank password).

## API

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/medicines` | List entries; optional `?search=term` searches name and category |
| `GET` | `/api/medicines/{id}` | Read one entry |
| `POST` | `/api/medicines` | Create an entry |
| `PUT` | `/api/medicines/{id}` | Replace editable fields |
| `DELETE` | `/api/medicines/{id}` | Delete an entry |

Example request body:

```json
{
  "name": "Vitamin C 500 mg",
  "description": "Fictional catalogue example.",
  "category": "Supplements",
  "price": 99.00,
  "prescriptionRequired": false
}
```

## Project layout

```text
frontend/    React application and GitHub Pages build
backend/     Spring Boot REST API and H2 configuration
.github/     CI and Pages workflows
```

## Scope and security

This is an educational catalogue, not a production healthcare system. It has no accounts, prescription processing, order checkout, or real medicine data. The H2 console is enabled for local development only. A production deployment would need authentication, authorization, privacy and security review, licensed data, and applicable regulatory approval.

## License

MIT — see [LICENSE](LICENSE).
