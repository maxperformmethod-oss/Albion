/**
 * Projekcia mapy — jediné miesto, kde sa počíta, kde čo na mape leží.
 *
 * Mapa má dve vrstvy: zapečený obraz (`public/images/map-*`) a inline SVG nad
 * ním. Musia sedieť na pixel, takže obe používajú tento modul. Keby mal každá
 * vrstva vlastný prepočet, rozišli by sa pri prvej zmene výrezu.
 *
 * Reťaz: WGS84 → lokálne metre → izometria → viewBox.
 */

export const COS30 = Math.cos(Math.PI / 6);
export const SIN30 = Math.sin(Math.PI / 6);

/**
 * Smer svetla v metrovom priestore — zhora zľava, teda od severozápadu.
 * Stena je osvetlená, keď jej vonkajšia normála mieri proti tomuto vektoru.
 */
export const LIGHT = { x: 1, y: 1 };

/**
 * Koľko pixelov (v mierke pôdorysu) je jeden meter výšky.
 * Nie je to 1 — pri skutočnej izometrii by boli bloky neúmerne vysoké
 * a mapa by sa stratila v stenách.
 */
export const Z_SCALE = 0.55;

export function createProjection({ center, radiusM, view }) {
  /** Lokálna rovinná projekcia okolo stredu. Metre, x na východ, y na juh. */
  const toMetres = (point) => ({
    x: (point.lon - center.lng) * 111320 * Math.cos((center.lat * Math.PI) / 180),
    y: (center.lat - point.lat) * 110540,
  });

  /** Izometrické skosenie. */
  const isometric = ({ x, y }) => ({
    x: (x - y) * COS30,
    y: (x + y) * SIN30,
  });

  /** Mierka sa počíta z polomeru výrezu, aby výrez vždy sadol do viewBoxu. */
  const scale = (view.w * 0.46) / (radiusM * COS30);

  const toView = (metres) => {
    const iso = isometric(metres);
    return { x: view.w / 2 + iso.x * scale, y: view.h / 2 + iso.y * scale };
  };

  /** Výška v metroch → posun v pixeloch nahor. */
  const zOffset = (heightM) => heightM * scale * Z_SCALE;

  return { center, radiusM, view, scale, toMetres, isometric, toView, zOffset };
}
