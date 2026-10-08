import { Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FiltrosAlojamiento } from '../../models/filtros-alojamiento';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-barra-busqueda',
  styleUrl: './barra-busqueda.component.css',
  templateUrl: './barra-busqueda.component.html',
})
export class BarraBusquedaComponent {
  tipos = input<string[]>([]);
  filtrosIniciales = input<FiltrosAlojamiento>({});
  mostrarSecundarios = input<boolean>(true);
  mostrarBotonBuscar = input<boolean>(false);
  filtrosChange = output<FiltrosAlojamiento>();
  buscar = output<FiltrosAlojamiento>();

  formulario = new FormGroup({
    ciudad: new FormControl<string>('', { nonNullable: true }),
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
          huespedes: iniciales.huespedes ?? null,
          tipo: iniciales.tipo ?? '',
          precioMax: iniciales.precioMax ?? null,
        },
        { emitEvent: false },
      );
    });

    this.formulario.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.filtrosChange.emit(this.construirFiltros()));
  }

  ejecutarBuscar(): void {
    this.buscar.emit(this.construirFiltros());
  }

  limpiar(): void {
    this.formulario.reset({ ciudad: '', huespedes: null, tipo: '', precioMax: null });
  }

  private construirFiltros(): FiltrosAlojamiento {
    const valor = this.formulario.getRawValue();
    return {
      ciudad: valor.ciudad.trim() || undefined,
      huespedes: valor.huespedes || undefined,
      tipo: valor.tipo || undefined,
      precioMax: valor.precioMax || undefined,
    };
  }
}
