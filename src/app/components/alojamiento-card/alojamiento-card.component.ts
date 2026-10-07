import { CurrencyPipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Alojamiento } from '../../models/alojamiento';

@Component({
  imports: [RouterLink, CurrencyPipe],
  selector: 'app-alojamiento-card',
  styleUrl: './alojamiento-card.component.css',
  templateUrl: './alojamiento-card.component.html',
})
export class AlojamientoCardComponent {
  alojamiento = input.required<Alojamiento>();
  variante = input<'grande' | 'compacta'>('grande');
  imagenFallida = signal(false);
}
