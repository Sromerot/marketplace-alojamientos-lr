import { Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DetalleAlojamientoComponent } from './pages/detalle-alojamiento/detalle-alojamiento.component';
import { FormularioReservaComponent } from './pages/formulario-reserva/formulario-reserva.component';
import { MisReservasComponent } from './pages/mis-reservas/mis-reservas.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'alojamientos', component: CatalogoComponent },
  { path: 'alojamientos/:id', component: DetalleAlojamientoComponent },
  { path: 'reservar/:id', component: FormularioReservaComponent },
  { path: 'mis-reservas', component: MisReservasComponent },
  { path: '**', redirectTo: '' },
];
