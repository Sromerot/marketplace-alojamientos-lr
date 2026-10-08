import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Reserva } from '../../models/reserva';
import { ReservaService } from '../../services/reserva.service';
import { AlertaMensajeComponent } from '../../components/alerta-mensaje/alerta-mensaje.component';

@Component({
  imports: [CurrencyPipe, RouterLink, AlertaMensajeComponent],
  selector: 'app-mis-reservas',
  styleUrl: './mis-reservas.component.css',
  templateUrl: './mis-reservas.component.html',
})
export class MisReservasComponent implements OnInit {
  private readonly reservaService = inject(ReservaService);
  private readonly router = inject(Router);

  reservas = signal<Reserva[]>([]);

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservas.set(this.reservaService.listar());
  }

  cancelarReserva(id: string): void {
    if (this.reservaService.cancelar(id)) {
      this.cargarReservas();
    }
  }

  irAAlojamientos(): void {
    this.router.navigate(['/alojamientos']);
  }
}
