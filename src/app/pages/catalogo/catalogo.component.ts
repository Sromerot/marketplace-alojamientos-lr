import { Component, computed, inject, signal, viewChild } from '@angular/core';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AlojamientoService } from '../../services/alojamiento.service';
import { CotizacionService } from '../../services/cotizacion.service';
import { FiltrosAlojamiento } from '../../models/filtros-alojamiento';
import { AlojamientoCardComponent } from '../../components/alojamiento-card/alojamiento-card.component';
import { BarraBusquedaComponent } from '../../components/barra-busqueda/barra-busqueda.component';
import { AlertaMensajeComponent } from '../../components/alerta-mensaje/alerta-mensaje.component';

@Component({
  imports: [AlojamientoCardComponent, BarraBusquedaComponent, AlertaMensajeComponent, DatePipe],
  selector: 'app-catalogo',
  styleUrl: './catalogo.component.css',
  templateUrl: './catalogo.component.html',
})
export class CatalogoComponent {
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly cotizacionService = inject(CotizacionService);
  private readonly route = inject(ActivatedRoute);

  private readonly barra = viewChild(BarraBusquedaComponent);

  alojamientos = toSignal(this.alojamientoService.obtenerActivos(), { initialValue: [] });
  tipos = toSignal(this.alojamientoService.obtenerTipos(), { initialValue: [] });
  filtros = signal<FiltrosAlojamiento>({});

  resultados = computed(() => this.alojamientoService.filtrar(this.alojamientos(), this.filtros()));

  rangoFechas = computed(() => {
    const { llegada, salida } = this.filtros();
    if (!llegada || !salida) {
      return null;
    }
    return { llegada: this.aFecha(llegada), salida: this.aFecha(salida) };
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const huespedes = Number(params.get('huespedes'));
      const precioMax = Number(params.get('precioMax'));
      const llegada = params.get('llegada') ?? '';
      const salida = params.get('salida') ?? '';
      const fechasValidas =
        !!llegada && !!salida && this.cotizacionService.validarRangoFechas(llegada, salida).length === 0;

      this.filtros.set({
        ciudad: params.get('ciudad') || undefined,
        llegada: fechasValidas ? llegada : undefined,
        salida: fechasValidas ? salida : undefined,
        huespedes: huespedes > 0 ? huespedes : undefined,
        tipo: params.get('tipo') || undefined,
        precioMax: precioMax > 0 ? precioMax : undefined,
      });
    });
  }

  actualizarFiltros(filtros: FiltrosAlojamiento): void {
    this.filtros.set(filtros);
  }

  limpiarFiltros(): void {
    this.barra()?.limpiar();
  }

  private aFecha(texto: string): Date {
    const partes = texto.split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }
}
