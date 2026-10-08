import { Component, input } from '@angular/core';
import { Resena } from '../../models/resena';

@Component({
  imports: [],
  selector: 'app-resena-card',
  styleUrl: './resena-card.component.css',
  templateUrl: './resena-card.component.html',
})
export class ResenaCardComponent {
  resena = input.required<Resena>();
}
