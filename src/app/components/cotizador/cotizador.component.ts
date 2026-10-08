import { CurrencyPipe } from '@angular/common';
import { Component, inject, input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Alojamiento } from '../../models/alojamiento';
import { Cotizacion } from '../../models/cotizacion';
import { CotizacionService } from '../../services/cotizacion.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe],
  selector: 'app-cotizador',
  styleUrl: './cotizador.component.css',
  templateUrl: './cotizador.component.html',
})
export class CotizadorComponent {
  private readonly cotizacionService = inject(CotizacionService);
  private readonly reservaService = inject(ReservaService);
  private readonly router = inject(Router);

  alojamiento = input.required<Alojamiento>();

  formulario = new FormGroup({
    fechaLlegada: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    fechaSalida: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    huespedes: new FormControl<number>(1, { nonNullable: true, validators: [Validators.required, Validators.min(1)] }),
  });

  cotizacion = signal<Cotizacion | null>(null);
  errores = signal<string[]>([]);

  constructor() {
    this.formulario.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        if (this.cotizacion() !== null || this.errores().length > 0) {
          this.cotizacion.set(null);
          this.errores.set([]);
          this.reservaService.limpiarCotizacion();
        }
      });
  }

  cotizar(): void {
    const val = this.formulario.getRawValue();

    if (this.reservaService.estaOcupado(this.alojamiento().id, val.fechaLlegada, val.fechaSalida)) {
      this.cotizacion.set(null);
      this.errores.set(['Estas fechas ya están reservadas para este alojamiento.']);
      this.reservaService.limpiarCotizacion();
      return;
    }

    const resultado = this.cotizacionService.calcular(
      this.alojamiento(),
      val.fechaLlegada,
      val.fechaSalida,
      val.huespedes,
    );

    if (resultado.valido && resultado.cotizacion) {
      this.cotizacion.set(resultado.cotizacion);
      this.errores.set([]);
      this.reservaService.guardarCotizacion(resultado.cotizacion);
    } else {
      this.cotizacion.set(null);
      this.errores.set(resultado.errores);
      this.reservaService.limpiarCotizacion();
    }
  }

  reservar(): void {
    const c = this.cotizacion();
    if (!c) return;

    this.reservaService.guardarCotizacion(c);
    this.router.navigate(['/reservar', this.alojamiento().id]);
  }
}
