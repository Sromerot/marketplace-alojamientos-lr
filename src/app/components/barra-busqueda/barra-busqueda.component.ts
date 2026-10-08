import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FiltrosAlojamiento } from '../../models/filtros-alojamiento';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-barra-busqueda',
  styleUrl: './barra-busqueda.component.css',
  templateUrl: './barra-busqueda.component.html',
})
export class BarraBusquedaComponent {
  private readonly cotizacionService = inject(CotizacionService);

  tipos = input<string[]>([]);
  filtrosIniciales = input<FiltrosAlojamiento>({});
  mostrarSecundarios = input<boolean>(true);
  mostrarBotonBuscar = input<boolean>(false);
  filtrosChange = output<FiltrosAlojamiento>();
  buscar = output<FiltrosAlojamiento>();

  erroresFechas = signal<string[]>([]);

  formulario = new FormGroup({
    ciudad: new FormControl<string>('', { nonNullable: true }),
    llegada: new FormControl<string>('', { nonNullable: true }),
    salida: new FormControl<string>('', { nonNullable: true }),
    huespedes: new FormControl<number | null>(null),
    tipo: new FormControl<string>('', { nonNullable: true }),
    precioMax: new FormControl<number | null>(null),
  });

  constructor() {
    effect(() => {
      const iniciales = this.filtrosIniciales();
      this.formulario.patchValue(
        {
          ciudad: iniciales.ciudad ?? '',
          llegada: iniciales.llegada ?? '',
          salida: iniciales.salida ?? '',
          huespedes: iniciales.huespedes ?? null,
          tipo: iniciales.tipo ?? '',
          precioMax: iniciales.precioMax ?? null,
        },
        { emitEvent: false },
      );
      this.validarFechas();
    });

    this.formulario.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      if (this.validarFechas()) {
        this.filtrosChange.emit(this.construirFiltros());
      }
    });
  }

  ejecutarBuscar(): void {
    if (this.validarFechas()) {
      this.buscar.emit(this.construirFiltros());
    }
  }

  limpiar(): void {
    this.formulario.reset({
      ciudad: '',
      llegada: '',
      salida: '',
      huespedes: null,
      tipo: '',
      precioMax: null,
    });
  }

  private validarFechas(): boolean {
    const valor = this.formulario.getRawValue();
    const errores = this.cotizacionService.validarRangoFechas(valor.llegada, valor.salida);
    this.erroresFechas.set(errores);
    return errores.length === 0;
  }

  private construirFiltros(): FiltrosAlojamiento {
    const valor = this.formulario.getRawValue();
    return {
      ciudad: valor.ciudad.trim() || undefined,
      llegada: valor.llegada || undefined,
      salida: valor.salida || undefined,
      huespedes: valor.huespedes && valor.huespedes > 0 ? valor.huespedes : undefined,
      tipo: valor.tipo || undefined,
      precioMax: valor.precioMax && valor.precioMax > 0 ? valor.precioMax : undefined,
    };
  }
}
