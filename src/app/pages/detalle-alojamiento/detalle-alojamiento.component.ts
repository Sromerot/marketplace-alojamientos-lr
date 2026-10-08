import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { AlojamientoService } from '../../services/alojamiento.service';
import { CotizadorComponent } from '../../components/cotizador/cotizador.component';
import { GaleriaImagenesComponent } from '../../components/galeria-imagenes/galeria-imagenes.component';
import { ResenaCardComponent } from '../../components/resena-card/resena-card.component';
import { AlertaMensajeComponent } from '../../components/alerta-mensaje/alerta-mensaje.component';

@Component({
  imports: [
    RouterLink,
    CotizadorComponent,
    GaleriaImagenesComponent,
    ResenaCardComponent,
    AlertaMensajeComponent,
  ],
  selector: 'app-detalle-alojamiento',
  styleUrl: './detalle-alojamiento.component.css',
  templateUrl: './detalle-alojamiento.component.html',
})
export class DetalleAlojamientoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alojamientoService = inject(AlojamientoService);

  irAlCatalogo(): void {
    this.router.navigate(['/alojamientos']);
  }

  alojamiento = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.alojamientoService.obtenerPorId(id)),
    ),
    { initialValue: undefined },
  );

  resenas = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      switchMap((id) => this.alojamientoService.obtenerResenas(id)),
    ),
    { initialValue: [] },
  );
}
