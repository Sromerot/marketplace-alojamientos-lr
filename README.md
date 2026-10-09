# LR — Marketplace de Alojamientos

## Descripción

Aplicación web (solo frontend) desarrollada con Angular para **Inversiones LR**, una empresa que administra propiedades de alojamiento temporal. Permite que un huésped explore los alojamientos disponibles, los filtre, consulte el detalle de cada uno, elija fechas, obtenga una cotización, registre una reserva de forma simulada y consulte sus reservas.

No hay backend: los datos iniciales viven en un archivo JSON que se consulta a través de un servicio de Angular, y las reservas se guardan en el navegador (localStorage).

Proyecto del curso **Desarrollo de Sistemas de Información 3**, Ingeniería de Sistemas, Universidad El Bosque.

## Integrantes

- Samuel Romero Torres

## Tecnologías utilizadas

- Angular (componentes standalone)
- TypeScript
- HTML y CSS puro (variables CSS, flexbox y grid)
- Angular Router (navegación entre pantallas)
- HttpClient (lectura del archivo JSON)
- Reactive Forms (cotizador y formulario de reserva)
- localStorage (persistencia de las reservas)
- Google Fonts (Inria Serif)
- Git y GitHub (control de versiones)
- Figma y draw.io (prototipos)

## Requisitos

- Node.js v26.9.0 y npm
- Angular CLI 22.2.2
- Git

## Instalación

```bash
git clone https://github.com/Sromerot/marketplace-alojamientos-lr.git
cd marketplace-alojamientos-lr
npm install
```

## Ejecución

```bash
npm start
```

Abre http://localhost:4200 en el navegador. Para detener el servidor, usa `Ctrl + C`.

Para generar la versión de producción:

```bash
npx ng build
```

## Funcionalidades principales

- **Inicio:** nombre de la plataforma, descripción, alojamientos destacados y acceso a la búsqueda.
- **Catálogo:** listado de alojamientos activos con imagen, nombre, ciudad, tipo, capacidad, precio por noche, calificación, servicios y mapa decorativo de cobertura.
- **Filtros:** por ciudad, número de huéspedes, tipo de alojamiento y precio máximo, con actualización inmediata y botón para limpiar.
- **Búsqueda por fechas:** valida el rango de fechas y oculta los alojamientos ya reservados en esas fechas, con mensajes cuando no hay resultados.
- **Detalle del alojamiento:** descripción, ubicación, capacidad, habitaciones, camas, baños, servicios, reglas, calificación, reseñas y galería de imágenes.
- **Cotización:** a partir de las fechas y los huéspedes calcula noches, subtotal, tarifa de limpieza, tarifa de servicio (10 %) y total.
- **Reserva simulada:** solicita nombre y correo, y registra la reserva con estado CONFIRMADA.
- **Mis reservas:** lista las reservas realizadas, con un mensaje cuando no hay ninguna y opción de cancelar.
- **Reglas de negocio:** validación de fechas y de capacidad, y los alojamientos inactivos nunca se muestran.

## Prototipos

- **Figma** (pantallas a color y sistema de diseño): [Ver prototipo](https://www.figma.com/design/u27I4sLIfkzZjeczBFWLmX/MOCKUP?node-id=0-1&t=egw541DHOWOYnuD1-1)
- **draw.io** (wireframes y estructura de navegación): [Ver wireframes](https://drive.google.com/file/d/1iohwFb3q4B_xPc0Flk41_40VDalLWDt3/view?usp=sharing)

## Estructura del proyecto

```
src/
├── assets/
│   ├── data/marketplace-data.json   # Datos de alojamientos y reseñas
│   └── images/                      # Imágenes de los alojamientos y mapa
├── styles.css                       # Variables de diseño y estilos globales
└── app/
    ├── models/                      # Interfaces de TypeScript (alojamiento, cotización, reserva)
    ├── services/                    # Acceso a datos, cálculo de cotización y manejo de reservas
    ├── components/                  # Componentes reutilizables (navbar, tarjetas, cotizador, mapa, etc.)
    ├── pages/                       # Una página por ruta
    │   ├── inicio/
    │   ├── catalogo/
    │   ├── detalle-alojamiento/
    │   ├── formulario-reserva/
    │   └── mis-reservas/
    ├── app.routes.ts                # Rutas de la aplicación
    └── app.config.ts                # Configuración global
```