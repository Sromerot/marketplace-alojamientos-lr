import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Alojamiento } from '../../models/alojamiento';
import { Cotizacion } from '../../models/cotizacion';
import { Reserva } from '../../models/reserva';
import { AlojamientoService } from '../../services/alojamiento.service';
import { ReservaService } from '../../services/reserva.service';
import { AlertaMensajeComponent } from '../../components/alerta-mensaje/alerta-mensaje.component';

@Component({
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink, AlertaMensajeComponent],
  selector: 'app-formulario-reserva',
  styleUrl: './formulario-reserva.component.css',
  templateUrl: './formulario-reserva.component.html',
})
export class FormularioReservaComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alojamientoService = inject(AlojamientoService);
  private readonly reservaService = inject(ReservaService);

  alojamiento = signal<Alojamiento | null>(null);
  cotizacion = signal<Cotizacion | null>(null);
  reservaConfirmada = signal<Reserva | null>(null);

  formulario = new FormGroup({
    nombre: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^(?!\s*$).+/)],
    }),
    correo: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  intentadoEnviar = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const cotizacion = this.reservaService.obtenerCotizacion();

    if (!cotizacion || cotizacion.alojamientoId !== id) {
      this.router.navigate(['/alojamientos', id]);
      return;
    }

    this.cotizacion.set(cotizacion);

    this.alojamientoService.obtenerPorId(id).subscribe((a) => {
      if (!a) {
        this.router.navigate(['/alojamientos']);
        return;
      }
      this.alojamiento.set(a);
    });
  }

  confirmarReserva(): void {
    this.intentadoEnviar.set(true);

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const c = this.cotizacion();
    const a = this.alojamiento();
    if (!c || !a) return;

    const val = this.formulario.getRawValue();
    const nuevaReserva = this.reservaService.crear(c, a, val.nombre, val.correo);
    this.reservaConfirmada.set(nuevaReserva);
  }

  get errorNombre(): string | null {
    const control = this.formulario.controls.nombre;
    if ((control.touched || this.intentadoEnviar()) && control.invalid) {
      return 'El nombre es obligatorio.';
    }
    return null;
  }

  get errorCorreo(): string | null {
    const control = this.formulario.controls.correo;
    if ((control.touched || this.intentadoEnviar()) && control.invalid) {
      if (control.errors?.['required']) {
        return 'El correo es obligatorio.';
      }
      return 'Ingresa un correo válido.';
    }
    return null;
  }
}
