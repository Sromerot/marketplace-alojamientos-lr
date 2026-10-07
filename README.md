# Marketplace de Alojamientos — Inversiones LR

Frontend de un marketplace de alojamientos temporales (plataforma **LR**). El huésped explora alojamientos, los filtra, consulta el detalle, obtiene una cotización, simula una reserva y consulta sus reservas. No tiene backend, login ni pagos: los datos salen de un JSON y las reservas se guardan en `localStorage`.

Proyecto académico — Desarrollo de Sistemas de Información 3, Universidad El Bosque.

## Integrantes

- (Escribe aquí tu nombre)

## Tecnologías

- Angular 22 (componentes standalone), TypeScript estricto
- Reactive Forms, Angular Router, HttpClient
- CSS puro (sin Bootstrap ni Angular Material)

## Requisitos

- Node.js v26.9.0 (la versión usada en el desarrollo)
- Angular CLI 22.2.2

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm start
```

Abre http://localhost:4200.

## Funcionalidades principales

_(Se completa a medida que avanzan los pasos.)_

Hasta ahora (paso 1): modelos, datos JSON, tokens de diseño y `AlojamientoService`.

## Estructura del proyecto

```
src/
├── assets/
│   ├── data/marketplace-data.json
│   └── images/
├── styles.css          tokens y estilos globales
└── app/
    ├── models/         alojamiento, resena, filtros, cotizacion, reserva
    ├── services/       alojamiento (los demás llegan en pasos siguientes)
    ├── app.routes.ts
    └── app.config.ts
```
