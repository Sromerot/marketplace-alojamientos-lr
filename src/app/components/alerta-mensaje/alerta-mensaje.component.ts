import { Component, input, output } from '@angular/core';

export type TipoAlerta = 'info' | 'exito' | 'error' | 'advertencia';

@Component({
  imports: [],
  selector: 'app-alerta-mensaje',
  styleUrl: './alerta-mensaje.component.css',
  templateUrl: './alerta-mensaje.component.html',
})
export class AlertaMensajeComponent {
  tipo = input<TipoAlerta>('info');
  mensaje = input.required<string>();
  textoBoton = input<string>('');
  accion = output<void>();
}
