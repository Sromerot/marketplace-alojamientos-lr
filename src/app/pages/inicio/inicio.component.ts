import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AlojamientoService } from '../../services/alojamiento.service';
import { FiltrosAlojamiento } from '../../models/filtros-alojamiento';
import { AlojamientoCardComponent } from '../../components/alojamiento-card/alojamiento-card.component';
import { BarraBusquedaComponent } from '../../components/barra-busqueda/barra-busqueda.component';

@Component({
  imports: [AlojamientoCardComponent, BarraBusquedaComponent],
  selector: 'app-inicio',
  styleUrl: './inicio.component.css',
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly router = inject(Router);

  destacados = toSignal(this.alojamientoService.obtenerDestacados(), { initialValue: [] });
  economicos = toSignal(this.alojamientoService.obtenerEconomicos(), { initialValue: [] });

  buscarAlojamientos(filtros: FiltrosAlojamiento): void {
    const queryParams: Record<string, string | number> = {};
    if (filtros.ciudad) queryParams['ciudad'] = filtros.ciudad;
    if (filtros.llegada) queryParams['llegada'] = filtros.llegada;
    if (filtros.salida) queryParams['salida'] = filtros.salida;
    if (filtros.huespedes) queryParams['huespedes'] = filtros.huespedes;
    if (filtros.tipo) queryParams['tipo'] = filtros.tipo;
    if (filtros.precioMax) queryParams['precioMax'] = filtros.precioMax;

    this.router.navigate(['/alojamientos'], { queryParams });
  }
}
