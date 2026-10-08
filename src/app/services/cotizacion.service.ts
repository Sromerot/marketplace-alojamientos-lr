import { Service } from '@angular/core';
import { Alojamiento } from '../models/alojamiento';
import { Cotizacion } from '../models/cotizacion';

export interface ResultadoCotizacion {
  valido: boolean;
  cotizacion?: Cotizacion;
  errores: string[];
}

@Service()
export class CotizacionService {
  calcular(
    alojamiento: Alojamiento,
    fechaLlegada: string,
    fechaSalida: string,
    huespedes: number,
  ): ResultadoCotizacion {
    const errores: string[] = [];

    if (!fechaLlegada || !fechaSalida) {
      if (!fechaLlegada) errores.push('Selecciona también la fecha de llegada.');
      if (!fechaSalida) errores.push('Selecciona también la fecha de salida.');
      return { valido: false, errores };
    }

    errores.push(...this.validarRangoFechas(fechaLlegada, fechaSalida));

    const llegada = this.parsearFecha(fechaLlegada);
    const salida = this.parsearFecha(fechaSalida);

    if (!huespedes || huespedes <= 0) {
      errores.push('Ingresa al menos 1 huésped.');
    } else if (huespedes > alojamiento.capacidad) {
      errores.push(`Este alojamiento admite máximo ${alojamiento.capacidad} huéspedes.`);
    }

    if (alojamiento.precioNoche <= 0) {
      errores.push('El precio por noche debe ser mayor que cero.');
    }

    if (errores.length > 0) {
      return { valido: false, errores };
    }

    const diffMs = salida.getTime() - llegada.getTime();
    const noches = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const subtotal = noches * alojamiento.precioNoche;
    const tarifaLimpieza = alojamiento.tarifaLimpieza;
    const tarifaServicio = Math.round(subtotal * 0.1);
    const total = subtotal + tarifaLimpieza + tarifaServicio;

    const cotizacion: Cotizacion = {
      alojamientoId: alojamiento.id,
      fechaLlegada,
      fechaSalida,
      huespedes,
      noches,
      precioNoche: alojamiento.precioNoche,
      subtotal,
      tarifaLimpieza,
      tarifaServicio,
      total,
    };

    return { valido: true, cotizacion, errores: [] };
  }

  validarRangoFechas(fechaLlegada: string, fechaSalida: string): string[] {
    if (!fechaLlegada && !fechaSalida) {
      return [];
    }
    if (!fechaLlegada) {
      return ['Selecciona también la fecha de llegada.'];
    }
    if (!fechaSalida) {
      return ['Selecciona también la fecha de salida.'];
    }

    const errores: string[] = [];
    const llegada = this.parsearFecha(fechaLlegada);
    const salida = this.parsearFecha(fechaSalida);

    if (llegada < this.obtenerHoyMedianoche()) {
      errores.push('La fecha de llegada no puede ser anterior a hoy.');
    }
    if (salida <= llegada) {
      errores.push('La fecha de salida debe ser posterior a la de llegada.');
    }
    return errores;
  }

  private parsearFecha(fechaStr: string): Date {
    const partes = fechaStr.split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }

  private obtenerHoyMedianoche(): Date {
    const hoy = new Date();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  }
}
