type OpcionSelector = { valor: string; etiqueta: string };

type PropiedadesSelectorCatalogo = {
  etiqueta: string;
  valor: string;
  opciones: OpcionSelector[];
  cambiar: (valor: string) => void;
  placeholder: string;
  deshabilitado?: boolean;
  cargando?: boolean;
  error?: string;
  textoVacio?: string;
  obligatorio?: boolean;
  busqueda?: string;
  cambiarBusqueda?: (valor: string) => void;
  ayuda?: string;
};

export default function SelectorCatalogo({ etiqueta, valor, opciones, cambiar, placeholder, deshabilitado = false, cargando = false, error = '', textoVacio = 'No existen opciones disponibles', obligatorio = false, busqueda, cambiarBusqueda, ayuda }: PropiedadesSelectorCatalogo) {
  const id = etiqueta.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const inactivo = deshabilitado || cargando;
  return <div className="min-w-0">
    <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-[#676767]">{etiqueta}</label>
    {cambiarBusqueda && <input aria-label={`Buscar ${etiqueta.toLowerCase()}`} type="search" value={busqueda || ''} onChange={evento => cambiarBusqueda(evento.target.value)} placeholder={`Buscar ${etiqueta.toLowerCase()}`} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#FE8F01] focus:outline-none focus:ring-2 focus:ring-orange-100" />}
    <select id={id} aria-label={etiqueta} required={obligatorio} disabled={inactivo} value={valor} onChange={evento => cambiar(evento.target.value)} aria-describedby={`${id}-ayuda`} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-[#FE8F01] focus:outline-none focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500">
      <option value="">{cargando ? 'Cargando…' : placeholder}</option>
      {opciones.map(opcion => <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>)}
    </select>
    <p id={`${id}-ayuda`} className={`mt-1 min-h-4 text-xs ${error ? 'text-red-700' : 'text-gray-500'}`}>{error || ayuda || (!cargando && !opciones.length && !deshabilitado ? textoVacio : '')}</p>
  </div>;
}

export type { OpcionSelector };
