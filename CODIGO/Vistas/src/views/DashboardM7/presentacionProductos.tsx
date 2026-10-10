import { useId, useState } from 'react';
import { createPortal } from 'react-dom';

export const PALETA_PRODUCTOS = ['#FE8F01', '#676767', '#A3A3A3', '#C76A00', '#111827', '#D1D5DB', '#8B5E34'];

export function limpiarNombreProducto(valor: unknown) {
  const original = String(valor || 'Sin producto').trim();
  const limpio = original.replace(/^\s*(?:(?:DEMO-UI|DEMO|TEST)\s*(?:\||:|—|-)\s*)+/i, '').trim();
  return limpio || original;
}

type PosicionTooltip = { izquierda: number; arriba: number; invertir: boolean };

export function NombreProducto({ nombre, color }: { nombre: string; color?: string }) {
  const id = useId();
  const [posicion, setPosicion] = useState<PosicionTooltip | null>(null);
  const mostrar = (elemento: HTMLElement) => {
    const rectangulo = elemento.getBoundingClientRect();
    const ancho = Math.min(288, window.innerWidth - 24);
    const izquierda = Math.max(12, Math.min(rectangulo.left, window.innerWidth - ancho - 12));
    const invertir = rectangulo.bottom > window.innerHeight - 110;
    setPosicion({ izquierda, arriba: invertir ? rectangulo.top - 8 : rectangulo.bottom + 8, invertir });
  };
  return <span className="flex min-w-0 items-center gap-2">
    {color && <i aria-hidden="true" className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: color }} />}
    <span
      tabIndex={0}
      aria-describedby={posicion ? id : undefined}
      className="block min-w-0 max-w-[15rem] truncate font-semibold outline-none focus-visible:ring-2 focus-visible:ring-[#FE8F01]"
      onMouseEnter={evento => mostrar(evento.currentTarget)}
      onMouseLeave={() => setPosicion(null)}
      onFocus={evento => mostrar(evento.currentTarget)}
      onBlur={() => setPosicion(null)}
    >{nombre}</span>
    {posicion && createPortal(<span id={id} role="tooltip" className="pointer-events-none fixed z-[100] max-w-72 rounded-md border border-gray-200 bg-gray-950 px-3 py-2 text-xs font-medium leading-5 text-white shadow-xl" style={{ left: posicion.izquierda, top: posicion.arriba, transform: posicion.invertir ? 'translateY(-100%)' : undefined }}>{nombre}</span>, document.body)}
  </span>;
}
