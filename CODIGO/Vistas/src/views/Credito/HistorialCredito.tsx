/**
 * EF-02: presentación especializada de eventos de crédito.
 * No altera la API, los estados ni las operaciones financieras.
 */
type Registro = Record<string, unknown>;

type Evento = {
  tipo?: unknown;
  motivo?: unknown;
  anterior?: unknown;
  nuevo?: unknown;
  fecha?: unknown;
  responsable?: unknown;
};

type Solicitud = {
  id?: unknown;
  tipo?: unknown;
  estado?: unknown;
  decision?: unknown;
};

type DetalleCambio = { etiqueta: string; valor: string };

const esRegistro = (valor: unknown): valor is Registro =>
  Boolean(valor) && typeof valor === 'object' && !Array.isArray(valor);

const parsearValor = (valor: unknown): unknown => {
  if (typeof valor !== 'string') return valor;
  const limpio = valor.trim();
  if (/^true$/i.test(limpio)) return true;
  if (/^false$/i.test(limpio)) return false;
  if ((limpio.startsWith('{') || limpio.startsWith('[')) && limpio.length < 100_000) {
    try { return JSON.parse(limpio) as unknown; } catch { /* Valor histórico en texto libre. */ }
  }
  return limpio;
};

const nombresCampos: Record<string, string> = {
  cupo: 'Cupo', monto: 'Monto', montoCupo: 'Cupo',
  desde: 'Desde', hasta: 'Hasta',
  vigenciaDesde: 'Vigencia desde', vigenciaHasta: 'Vigencia hasta',
  suspendido: 'Suspendido', habilitado: 'Habilitado', credito_habilitado: 'Crédito habilitado',
  estado: 'Estado', motivo: 'Motivo', limite: 'Límite',
};

const etiquetaCampo = (clave: string) => nombresCampos[clave] ||
  clave.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/^./, letra => letra.toUpperCase());

const textoCorto = (valor: unknown): string => {
  if (valor === null || valor === undefined || valor === '') return '—';
  return String(valor).trim() || '—';
};

const fechaCivil = (valor: unknown): string => {
  const texto = textoCorto(valor);
  const captura = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(texto);
  if (!captura) return texto;
  return `${captura[3]}-${captura[2]}-${captura[1]}`;
};

const pesos = (valor: unknown): string => {
  const texto = textoCorto(valor);
  if (!/^-?\d+(?:\.\d+)?$/.test(texto)) return texto;
  const numero = Number(texto);
  return Number.isFinite(numero)
    ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(numero)
    : texto;
};

const describirValor = (valorOriginal: unknown, clave = '', profundidad = 0): string => {
  const valor = parsearValor(valorOriginal);
  if (valor === null || valor === undefined || valor === '') return '—';
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  if (/^(cupo|monto|montoCupo|limite|monto_limite)$/i.test(clave)) return pesos(valor);
  if (/^(desde|hasta|vigenciaDesde|vigenciaHasta|fecha)$/i.test(clave)) return fechaCivil(valor);
  if (profundidad < 3 && esRegistro(valor)) {
    return Object.entries(valor).map(([campo, dato]) =>
      `${etiquetaCampo(campo)}: ${describirValor(dato, campo, profundidad + 1)}`,
    ).join(' · ') || '—';
  }
  if (profundidad < 3 && Array.isArray(valor)) {
    return valor.map(dato => describirValor(dato, '', profundidad + 1)).join(' · ') || '—';
  }
  if (esRegistro(valor) || Array.isArray(valor)) return 'Detalle estructurado';
  return textoCorto(valor);
};

/** Exportada para pruebas unitarias, no para cambiar la API. */
export const formatearCambioCredito = (valorOriginal: unknown): DetalleCambio[] => {
  const valor = parsearValor(valorOriginal);
  if (esRegistro(valor)) {
    return Object.entries(valor).map(([clave, contenido]) => ({
      etiqueta: etiquetaCampo(clave),
      valor: describirValor(contenido, clave),
    }));
  }
  return [{ etiqueta: '', valor: describirValor(valor) }];
};

const nombreOperacion = (valor: unknown) => textoCorto(valor).replaceAll('_', ' ').toLocaleLowerCase('es-CL')
  .replace(/^./, letra => letra.toLocaleUpperCase('es-CL'));

const fechaEvento = (valor: unknown) => {
  const fecha = new Date(textoCorto(valor));
  if (Number.isNaN(fecha.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Santiago',
  }).format(fecha);
};

const Cambio = ({ titulo, valor }: { titulo: string; valor: unknown }) => (
  <div className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 p-3">
    <h5 className="mb-2 text-xs font-bold uppercase tracking-wide text-[#676767]">{titulo}</h5>
    <dl className="space-y-1.5">
      {formatearCambioCredito(valor).map((campo, indice) => (
        <div key={`${campo.etiqueta}-${indice}`} className="min-w-0 break-words text-sm text-gray-900 [overflow-wrap:anywhere]">
          {campo.etiqueta && <dt className="mr-1 inline font-semibold">{campo.etiqueta}:</dt>}
          <dd className="inline whitespace-pre-wrap">{campo.valor}</dd>
        </div>
      ))}
    </dl>
  </div>
);

/** Evita tablas horizontales con seis columnas dentro de un panel estrecho. */
export default function HistorialCredito({ valor }: { valor: unknown }) {
  const datos = esRegistro(valor) ? valor : {};
  const eventos = Array.isArray(datos.eventos) ? datos.eventos.filter(esRegistro) as Evento[] : [];
  const solicitudes = Array.isArray(datos.solicitudes) ? datos.solicitudes.filter(esRegistro) as Solicitud[] : [];

  return <div className="min-w-0 space-y-6">
    <section aria-label="Eventos crediticios" className="min-w-0 space-y-3">
      <h4 className="text-sm font-bold text-gray-950">Eventos ({eventos.length})</h4>
      {eventos.length ? eventos.map((evento, indice) => (
        <article key={`evento-${indice}`} className="min-w-0 space-y-3 rounded-xl border border-gray-200 p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <strong className="break-words text-sm text-gray-950">{nombreOperacion(evento.tipo)}</strong>
            <time className="shrink-0 text-xs text-[#676767]" dateTime={textoCorto(evento.fecha)}>
              {fechaEvento(evento.fecha)}
            </time>
          </div>
          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <Cambio titulo="Anterior" valor={evento.anterior}/>
            <Cambio titulo="Nuevo" valor={evento.nuevo}/>
          </div>
          {evento.motivo != null && textoCorto(evento.motivo) !== '—' &&
            <p className="break-words text-sm text-gray-700 [overflow-wrap:anywhere]"><strong>Motivo:</strong> {textoCorto(evento.motivo)}</p>}
          {evento.responsable != null &&
            <p className="break-words text-xs text-[#676767] [overflow-wrap:anywhere]">Responsable: {textoCorto(evento.responsable)}</p>}
        </article>
      )) : <p className="rounded-lg bg-gray-50 p-3 text-sm text-[#676767]">Sin eventos crediticios registrados.</p>}
    </section>

    <section aria-label="Solicitudes crediticias" className="min-w-0 space-y-3">
      <h4 className="text-sm font-bold text-gray-950">Solicitudes ({solicitudes.length})</h4>
      {solicitudes.length ? solicitudes.map((solicitud, indice) => (
        <article key={`solicitud-${indice}`} className="min-w-0 rounded-xl border border-gray-200 p-4 text-sm">
          <p className="font-bold">Solicitud #{textoCorto(solicitud.id)}</p>
          <dl className="mt-2 grid min-w-0 gap-2 sm:grid-cols-3">
            <div><dt className="text-xs text-[#676767]">Tipo</dt><dd className="break-words">{nombreOperacion(solicitud.tipo)}</dd></div>
            <div><dt className="text-xs text-[#676767]">Estado</dt><dd className="break-words">{nombreOperacion(solicitud.estado)}</dd></div>
            <div><dt className="text-xs text-[#676767]">Decisión</dt><dd className="break-words">{nombreOperacion(solicitud.decision)}</dd></div>
          </dl>
        </article>
      )) : <p className="rounded-lg bg-gray-50 p-3 text-sm text-[#676767]">Sin solicitudes crediticias registradas.</p>}
    </section>
  </div>;
}
