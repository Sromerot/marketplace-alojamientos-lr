import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-galeria-imagenes',
  styleUrl: './galeria-imagenes.component.css',
  templateUrl: './galeria-imagenes.component.html',
})
export class GaleriaImagenesComponent {
  imagenes = input<string[]>([]);
  nombre = input<string>('');
}
