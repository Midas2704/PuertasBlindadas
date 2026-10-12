import { FilePlus2, ImageIcon, ImagePlus, LoaderCircle, LockKeyhole, ShieldAlert, TriangleAlert } from 'lucide-react';
import { useMemo, useState } from 'react';
import GaleriaProducto from './GaleriaProducto';
import HistorialDocumento from './HistorialDocumento';
import ListaDocumentosProducto from './ListaDocumentosProducto';
import VistaPreviaDocumento from './VistaPreviaDocumento';
import EstadoDocumentoVisual from './EstadoDocumentoVisual';
import ResumenUsoComercial from './ResumenUsoComercial';
import { capacidadesDocumentalesDeshabilitadas, type CapacidadesDocumentalesProducto, type DocumentoComercialProducto, type EstadoIntegracionDocumental, type ModoFichaDocumental } from './tipos';

type Propiedades = {
  modo: ModoFichaDocumental;
  productoId?: number | null;
  estado?: EstadoIntegracionDocumental;
  documentos?: readonly DocumentoComercialProducto[];
  capacidades?: CapacidadesDocumentalesProducto;
  error?: string | null;
};

export default function PanelDocumentosProducto({ modo, productoId, estado = 'NO_HABILITADA', documentos = [], capacidades = capacidadesDocumentalesDeshabilitadas, error }: Propiedades) {
  const [seleccionado, setSeleccionado] = useState<string | null>(null);
  const [historial, setHistorial] = useState<string | null>(null);
  const fotografias = useMemo(() => documentos.filter(documento => documento.tipo === 'FOTOGRAFIA_COMERCIAL'), [documentos]);
  const documentosComerciales = useMemo(() => documentos.filter(documento => documento.tipo !== 'FOTOGRAFIA_COMERCIAL'), [documentos]);
  const principal = fotografias.find(documento => documento.esImagenPrincipal) ?? null;
  const documentoSeleccionado = documentos.find(documento => documento.idDocumento === seleccionado) ?? null;
  const documentoHistorial = documentos.find(documento => documento.idDocumento === historial) ?? null;

  if (modo === 'crear' || !productoId) return <EstadoMarco icono={LockKeyhole} titulo="Documentación disponible después de crear el producto" descripcion="La documentación podrá asociarse una vez que el producto esté creado y la gestión documental se encuentre habilitada." detalle="Puedes continuar guardando la ficha comercial; esta condición no bloquea su creación." />;
  if (estado === 'CARGANDO') return <EstadoMarco icono={LoaderCircle} titulo="Cargando documentación autorizada…" descripcion="Estamos consultando únicamente metadatos habilitados para este producto." animado />;
  if (estado === 'ERROR') return <EstadoMarco icono={TriangleAlert} titulo="No fue posible consultar la documentación" descripcion={error || 'La consulta autorizada falló. Intenta nuevamente cuando la integración esté disponible.'} alerta />;
  if (estado === 'DENEGADO') return <EstadoMarco icono={ShieldAlert} titulo="Acceso documental no autorizado" descripcion="Tu sesión no posee una capacidad documental aprobada para consultar estos archivos." alerta />;

  const integracionPendiente = estado === 'NO_HABILITADA';
  const vacioConfirmado = estado === 'VACIO';
  const documentosVisibles = estado === 'LISTO' ? documentos : [];
  const fotosVisibles = estado === 'LISTO' ? fotografias : [];
  const comercialesVisibles = estado === 'LISTO' ? documentosComerciales : [];
  const principalVisible = estado === 'LISTO' ? principal : null;
  const previsualizable = capacidades.solicitarVistaPrevia && estado === 'LISTO';

  return <div className="space-y-6" data-estado-documental={estado}>
    <div className={`border-l-4 p-4 ${integracionPendiente ? 'border-[#FE8F01] bg-orange-50' : 'border-emerald-500 bg-emerald-50'}`} role="status"><p className="text-sm font-black text-black">{integracionPendiente ? 'Integración documental aún no habilitada' : vacioConfirmado ? 'Consulta completada: sin documentos asociados' : `${documentosVisibles.length} documento(s) autorizado(s)`}</p><p className="mt-1 text-xs leading-5 text-[#676767]">{integracionPendiente ? 'La estructura visual está preparada, pero no se consultan endpoints ni almacenamiento.' : vacioConfirmado ? 'Este producto no tiene documentos en la consulta autorizada actual.' : 'Los controles disponibles dependen de capacidades documentales entregadas por el backend.'}</p></div>

    <section className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(240px,.85fr)]" aria-labelledby="titulo-fotografia-principal"><div className="flex aspect-[16/9] min-h-52 items-center justify-center overflow-hidden rounded-xl bg-gray-100">{principalVisible?.vistaPrevia?.urlTemporal && principalVisible.estado === 'DISPONIBLE' ? <img src={principalVisible.vistaPrevia.urlTemporal} alt={principalVisible.titulo} loading="lazy" className="h-full w-full object-contain" /> : <div className="p-6 text-center text-[#676767]"><ImageIcon aria-hidden="true" className="mx-auto h-10 w-10" /><p className="mt-3 text-sm font-black text-black">Fotografía principal no disponible</p><p className="mt-1 text-xs">No se utiliza ninguna imagen ficticia como reemplazo.</p></div>}</div><div className="flex flex-col justify-center"><p className="text-xs font-black uppercase tracking-wider text-[#b85e00]">Presentación comercial</p><h3 id="titulo-fotografia-principal" className="mt-1 text-xl font-black text-black">Fotografía principal</h3>{principalVisible ? <div className="mt-4 space-y-3"><p className="text-sm font-bold">{principalVisible.titulo}</p><div className="flex flex-wrap items-center gap-2"><EstadoDocumentoVisual estado={principalVisible.estado} /><span className="text-xs font-semibold text-[#676767]">{principalVisible.versionActual === null ? 'Sin versión vigente' : `Versión ${principalVisible.versionActual}`}</span></div><ResumenUsoComercial documento={principalVisible} /></div> : <p className="mt-3 text-sm leading-6 text-[#676767]">La imagen principal aparecerá aquí cuando una integración autorizada confirme sus metadatos y vista previa.</p>}<div className="mt-5 flex flex-wrap gap-2"><BotonPreparado icono={ImagePlus} etiqueta="Agregar fotografía" /><BotonPreparado icono={FilePlus2} etiqueta="Agregar documento" /></div><p className="mt-2 text-[11px] leading-4 text-[#676767]">Acciones preparadas y deshabilitadas hasta aprobar permisos e integración.</p></div></section>

    <GaleriaProducto fotografias={fotosVisibles} puedePrevisualizar={previsualizable} consultaReal={estado === 'VACIO' || estado === 'LISTO'} seleccionar={setSeleccionado} />
    <ListaDocumentosProducto documentos={comercialesVisibles} puedePrevisualizar={previsualizable} puedeDescargar={capacidades.descargar && estado === 'LISTO'} puedeVerHistorial={capacidades.consultarVersiones && estado === 'LISTO'} consultaReal={estado === 'VACIO' || estado === 'LISTO'} seleccionar={setSeleccionado} verHistorial={setHistorial} />
    <HistorialDocumento documento={documentoHistorial} autorizado={capacidades.consultarVersiones && estado === 'LISTO'} />
    {documentoSeleccionado?.vistaPrevia?.urlTemporal && previsualizable && <VistaPreviaDocumento documento={documentoSeleccionado} fotografias={fotosVisibles} cerrar={() => setSeleccionado(null)} navegar={setSeleccionado} />}
  </div>;
}

function EstadoMarco({ icono: Icono, titulo, descripcion, detalle, animado = false, alerta = false }: { icono: typeof LockKeyhole; titulo: string; descripcion: string; detalle?: string; animado?: boolean; alerta?: boolean }) { return <div role={alerta ? 'alert' : 'status'} className={`rounded-xl border border-dashed px-5 py-10 text-center ${alerta ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}><Icono aria-hidden="true" className={`mx-auto h-9 w-9 ${alerta ? 'text-red-700' : 'text-[#FE8F01]'} ${animado ? 'animate-spin' : ''}`} /><h3 className="mt-4 text-lg font-black text-black">{titulo}</h3><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#676767]">{descripcion}</p>{detalle && <p className="mx-auto mt-2 max-w-2xl text-xs font-semibold text-[#676767]">{detalle}</p>}</div>; }
function BotonPreparado({ icono: Icono, etiqueta }: { icono: typeof ImagePlus; etiqueta: string }) { return <button type="button" disabled title={`${etiqueta}: integración pendiente`} className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-xs font-bold text-gray-400"><Icono aria-hidden="true" className="h-4 w-4" />{etiqueta}</button>; }
