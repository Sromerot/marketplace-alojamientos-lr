import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { Alojamiento } from '../models/alojamiento';
import { Resena } from '../models/resena';
import { FiltrosAlojamiento } from '../models/filtros-alojamiento';

/** Forma del archivo JSON completo: dos listas. */
interface DatosMarketplace {
  alojamientos: Alojamiento[];
  resenas: Resena[];
}

/**
 * AlojamientoService: capa de ACCESO A DATOS.
 *
 * Analogía Java: un @Service/@Repository de Spring. El decorador `@Service()`
 * (generado por el CLI) registra la clase en el contenedor de inyección como un
 * singleton (como un @Bean): Angular crea UNA sola instancia y la entrega a quien
 * la pida. Ningún componente lee el JSON directamente; todos pasan por este servicio.
 */
@Service()
export class AlojamientoService {
  /**
   * `inject(HttpClient)` equivale a la inyección por constructor/@Autowired.
   * HttpClient es el cliente HTTP (como RestTemplate/WebClient).
   */
  private readonly http = inject(HttpClient);

  /** Ruta del JSON (se sirve desde src/assets gracias a angular.json). */
  private readonly urlDatos = 'assets/data/marketplace-data.json';

  /**
   * Observable = promesa "en flujo" de un dato futuro (parecido a un CompletableFuture
   * que además puede emitir varios valores). Nada ocurre hasta que alguien hace
   * `subscribe()`.
   * `shareReplay(1)` actúa como CACHÉ: la petición HTTP se hace una sola vez y
   * los siguientes suscriptores reciben el mismo resultado guardado.
   */
  private readonly datos$: Observable<DatosMarketplace> = this.http
    .get<DatosMarketplace>(this.urlDatos)
    .pipe(shareReplay(1));

  /** Solo los alojamientos activos (los inactivos, como el id 6, nunca se muestran). */
  obtenerActivos(): Observable<Alojamiento[]> {
    // `map` transforma el valor emitido, como Stream.map() en Java.
    // `filter` de arreglos es igual a Stream.filter().
    return this.datos$.pipe(map((d) => d.alojamientos.filter((a) => a.activo)));
  }

  /** Busca un alojamiento activo por id; emite `undefined` si no existe o está inactivo. */
  obtenerPorId(id: number): Observable<Alojamiento | undefined> {
    // `find` es como Stream.filter(...).findFirst() pero devuelve el valor o undefined
    // (en vez de Optional).
    return this.obtenerActivos().pipe(map((lista) => lista.find((a) => a.id === id)));
  }

  /** Reseñas de un alojamiento (puede ser una lista vacía). */
  obtenerResenas(alojamientoId: number): Observable<Resena[]> {
    return this.datos$.pipe(
      map((d) => d.resenas.filter((r) => r.alojamientoId === alojamientoId)),
    );
  }

  /** Tipos distintos de alojamiento activos, para llenar el filtro "Tipo". */
  obtenerTipos(): Observable<string[]> {
    // `Set` elimina duplicados (igual que HashSet en Java); `[...set]` lo vuelve lista.
    return this.obtenerActivos().pipe(map((lista) => [...new Set(lista.map((a) => a.tipo))]));
  }

  /**
   * Aplica los filtros a una lista ya cargada. Es una función PURA: no consulta
   * nada ni modifica la lista original, solo devuelve una nueva.
   * (Las fechas llegada/salida se agregarán en el paso 8 junto con la disponibilidad.)
   */
  filtrar(lista: Alojamiento[], filtros: FiltrosAlojamiento): Alojamiento[] {
    const ciudadBuscada = this.normalizar(filtros.ciudad ?? '');

    return lista.filter((a) => {
      // Ciudad: sin tildes ni mayúsculas y "contiene" (String.contains).
      if (ciudadBuscada && !this.normalizar(a.ciudad).includes(ciudadBuscada)) {
        return false;
      }
      // Huéspedes: la capacidad debe ser mayor o igual.
      if (filtros.huespedes && a.capacidad < filtros.huespedes) {
        return false;
      }
      // Tipo: igualdad exacta.
      if (filtros.tipo && a.tipo !== filtros.tipo) {
        return false;
      }
      // Precio máximo: precioNoche menor o igual.
      if (filtros.precioMax && a.precioNoche > filtros.precioMax) {
        return false;
      }
      return true;
    });
  }

  /** Los 3 mejor calificados. */
  obtenerDestacados(): Observable<Alojamiento[]> {
    // `[...lista]` copia el arreglo para no alterar el original al ordenar
    // (sort modifica el arreglo, como Collections.sort).
    return this.obtenerActivos().pipe(
      map((lista) => [...lista].sort((a, b) => b.calificacion - a.calificacion).slice(0, 3)),
    );
  }

  /** Los 3 de menor precio por noche. */
  obtenerEconomicos(): Observable<Alojamiento[]> {
    return this.obtenerActivos().pipe(
      map((lista) => [...lista].sort((a, b) => a.precioNoche - b.precioNoche).slice(0, 3)),
    );
  }

  /**
   * Quita tildes y pasa a minúsculas para comparar ("Bogotá" == "bogota").
   * `normalize('NFD')` separa la letra de su tilde y la expresión regular
   * borra las tildes (Analogía Java: java.text.Normalizer + replaceAll).
   */
  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
