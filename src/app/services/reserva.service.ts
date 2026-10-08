import { Service } from '@angular/core';
import { Alojamiento } from '../models/alojamiento';
import { Cotizacion } from '../models/cotizacion';
import { Reserva } from '../models/reserva';

@Service()
export class ReservaService {
  private readonly STORAGE_KEY = 'lr_reservas';
  private cotizacionVigente: Cotizacion | null = null;

  guardarCotizacion(cotizacion: Cotizacion): void {
    this.cotizacionVigente = { ...cotizacion };
  }

  obtenerCotizacion(): Cotizacion | null {
    return this.cotizacionVigente;
  }

  limpiarCotizacion(): void {
    this.cotizacionVigente = null;
  }

  listar(): Reserva[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      const parseado = JSON.parse(data);
      return Array.isArray(parseado) ? parseado : [];
    } catch {
      return [];
    }
  }

  crear(
    cotizacion: Cotizacion,
    alojamiento: Alojamiento,
    nombreHuesped: string,
    correo: string,
  ): Reserva {
    const id = `RES-${Date.now()}`;
    const nuevaReserva: Reserva = {
      id,
      alojamientoId: alojamiento.id,
      alojamientoNombre: alojamiento.nombre,
      ciudad: alojamiento.ciudad,
      imagen: alojamiento.imagenPrincipal,
      fechaLlegada: cotizacion.fechaLlegada,
      fechaSalida: cotizacion.fechaSalida,
      huespedes: cotizacion.huespedes,
      noches: cotizacion.noches,
      total: cotizacion.total,
      nombreHuesped: nombreHuesped.trim(),
      correo: correo.trim(),
      estado: 'CONFIRMADA',
    };

    const reservas = this.listar();
    reservas.unshift(nuevaReserva);
    this.guardarEnStorage(reservas);

    this.limpiarCotizacion();
    return nuevaReserva;
  }

  cancelar(id: string): boolean {
    const reservas = this.listar();
    const indice = reservas.findIndex((r) => r.id === id);
    if (indice === -1) return false;

    reservas[indice] = {
      ...reservas[indice],
      estado: 'CANCELADA',
    };

    this.guardarEnStorage(reservas);
    return true;
  }

  estaOcupado(alojamientoId: number, llegada: string, salida: string): boolean {
    if (!llegada || !salida) return false;

    const fechaLlegada = this.parsearFecha(llegada);
    const fechaSalida = this.parsearFecha(salida);

    const reservas = this.listar().filter(
      (r) => r.alojamientoId === alojamientoId && r.estado === 'CONFIRMADA',
    );

    return reservas.some((r) => {
      const rLlegada = this.parsearFecha(r.fechaLlegada);
      const rSalida = this.parsearFecha(r.fechaSalida);
      return fechaLlegada < rSalida && fechaSalida > rLlegada;
    });
  }

  private guardarEnStorage(reservas: Reserva[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservas));
    } catch {
      // Ignora errores si la cuota de storage está excedida
    }
  }

  private parsearFecha(fechaStr: string): Date {
    const partes = fechaStr.split('-').map(Number);
    return new Date(partes[0], partes[1] - 1, partes[2]);
  }
}
