import React from 'react';
import { Link } from 'react-router-dom';
import {
  Banknote,
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileClock,
  FileText,
  Gauge,
  Images,
  Landmark,
  LockKeyhole,
  ReceiptText,
  Settings,
  ShieldCheck,
  Tags,
  Users,
  WalletCards,
} from 'lucide-react';
import { usarSesion } from '../../seguridad/Sesion';

type EstadoTarjeta = 'DISPONIBLE' | 'EN DESARROLLO' | 'PENDIENTE DE DEFINICIÓN' | 'RESTRINGIDO';

type TarjetaMantenedor = {
  nombre: string;
  descripcion: string;
  modulo: string;
  estado: Exclude<EstadoTarjeta, 'RESTRINGIDO'>;
  icono: React.ComponentType<{ className?: string }>;
  ruta?: string;
  permisos?: string[];
};

type CategoriaMantenedor = {
  id: string;
  nombre: string;
  descripcion: string;
  tarjetas: TarjetaMantenedor[];
};

const categorias: CategoriaMantenedor[] = [
  {
    id: 'comercial',
    nombre: 'Comercial',
    descripcion: 'Configuraciones que apoyan cotizaciones y presentación comercial.',
    tarjetas: [
      { nombre: 'Productos y familias', descripcion: 'Catálogo comercial, familias y características de presentación.', modulo: 'M2', estado: 'PENDIENTE DE DEFINICIÓN', icono: Boxes },
      { nombre: 'Parámetros comerciales', descripcion: 'Márgenes sugeridos, vigencias y valores administrativos.', modulo: 'M2', estado: 'PENDIENTE DE DEFINICIÓN', icono: Gauge },
      { nombre: 'Condiciones comerciales', descripcion: 'Plazos, garantías y condiciones diferenciadas B2B y B2C.', modulo: 'M2', estado: 'PENDIENTE DE DEFINICIÓN', icono: ClipboardCheck },
      { nombre: 'Plantillas documentales', descripcion: 'Formatos comerciales y versiones de documentos emitidos.', modulo: 'M2', estado: 'PENDIENTE DE DEFINICIÓN', icono: FileText },
      { nombre: 'Vencimiento de cotizaciones', descripcion: 'Días hábiles utilizados para destacar cotizaciones próximas a vencer.', modulo: 'M2', estado: 'DISPONIBLE', icono: FileClock, ruta: '/configuracion/umbral', permisos: ['CU41'] },
    ],
  },
  {
    id: 'clientes-pagos',
    nombre: 'Clientes y pagos',
    descripcion: 'Catálogos compartidos por clientes, recaudación y remuneraciones.',
    tarjetas: [
      { nombre: 'Tipos de cliente', descripcion: 'Clasificaciones comerciales utilizadas por clientes y cotizaciones.', modulo: 'M1', estado: 'PENDIENTE DE DEFINICIÓN', icono: Users },
      { nombre: 'Medios de pago', descripcion: 'Medios habilitados y requisito de respaldo para operaciones financieras.', modulo: 'M3 / M6', estado: 'DISPONIBLE', icono: WalletCards, ruta: '/parametros-remuneraciones', permisos: ['CU171'] },
      { nombre: 'Categorías de pago', descripcion: 'Clasificación administrativa de pagos y cuotas.', modulo: 'M3', estado: 'PENDIENTE DE DEFINICIÓN', icono: ReceiptText },
    ],
  },
  {
    id: 'proveedores-egresos',
    nombre: 'Proveedores y egresos',
    descripcion: 'Clasificaciones y alertas administradas por el módulo de proveedores.',
    tarjetas: [
      { nombre: 'Categorías y reclasificación', descripcion: 'Categorías de egreso y umbral de reclasificación según permisos.', modulo: 'M5', estado: 'DISPONIBLE', icono: Tags, ruta: '/categorias-egreso', permisos: ['CU134'] },
      { nombre: 'Alertas de vencimiento', descripcion: 'Umbral para cuentas de proveedores próximas a vencer.', modulo: 'M5', estado: 'DISPONIBLE', icono: Banknote, ruta: '/cuentas-por-pagar', permisos: ['CU106'] },
    ],
  },
  {
    id: 'remuneraciones',
    nombre: 'Remuneraciones',
    descripcion: 'Esquemas, conceptos y parámetros con vigencia histórica.',
    tarjetas: [
      { nombre: 'Esquemas, tarifas y conceptos', descripcion: 'Esquemas remuneracionales, cargos, tarifas y haberes.', modulo: 'M6', estado: 'DISPONIBLE', icono: BriefcaseBusiness, ruta: '/esquemas-remuneracionales', permisos: ['CU162', 'CU163', 'CU164', 'CU165', 'CU166'] },
      { nombre: 'Parámetros remuneracionales', descripcion: 'Parámetros legales, previsionales, tributarios y prorrateo.', modulo: 'M6', estado: 'DISPONIBLE', icono: Landmark, ruta: '/parametros-remuneraciones', permisos: ['CU167', 'CU168', 'CU169', 'CU170'] },
    ],
  },
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    descripcion: 'Parámetros gerenciales conservando las fórmulas propietarias de M7.',
    tarjetas: [
      { nombre: 'Margen crítico y presupuesto', descripcion: 'Umbral gerencial y partidas presupuestarias con vigencia.', modulo: 'M7', estado: 'DISPONIBLE', icono: ChartNoAxesCombined, ruta: '/parametros-remuneraciones', permisos: ['CU246'] },
      { nombre: 'Control financiero', descripcion: 'Umbrales de liquidez, costos de instalación y stock inmóvil.', modulo: 'M7', estado: 'DISPONIBLE', icono: CircleDollarSign, ruta: '/dashboard-m7/control', permisos: ['CU232', 'CU244', 'CU257'] },
    ],
  },
  {
    id: 'credito',
    nombre: 'Crédito',
    descripcion: 'Configuraciones globales separadas de las decisiones por cliente.',
    tarjetas: [
      { nombre: 'Límite global de crédito', descripcion: 'Capacidad global, vigencia y motivo de cada modificación.', modulo: 'M8', estado: 'DISPONIBLE', icono: CreditCard, ruta: '/parametros-remuneraciones', permisos: ['CU268'] },
    ],
  },
  {
    id: 'auditoria',
    nombre: 'Auditoría',
    descripcion: 'Conservación y políticas sin desactivar controles obligatorios de M9.',
    tarjetas: [
      { nombre: 'Conservación documental', descripcion: 'Criterios documentales registrados sin ejecutar tratamientos automáticos.', modulo: 'M6', estado: 'DISPONIBLE', icono: FileClock, ruta: '/parametros-remuneraciones', permisos: ['CU170'] },
      { nombre: 'Políticas de auditoría', descripcion: 'Administración controlada de alertas y políticas de retención.', modulo: 'M9', estado: 'PENDIENTE DE DEFINICIÓN', icono: ShieldCheck },
      { nombre: 'Imágenes y documentos comerciales', descripcion: 'Archivos versionados para productos y futuras cotizaciones.', modulo: 'M2 / M9', estado: 'PENDIENTE DE DEFINICIÓN', icono: Images },
    ],
  },
];

const estilosEstado: Record<EstadoTarjeta, string> = {
  DISPONIBLE: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'EN DESARROLLO': 'border-blue-200 bg-blue-50 text-blue-800',
  'PENDIENTE DE DEFINICIÓN': 'border-amber-200 bg-amber-50 text-amber-900',
  RESTRINGIDO: 'border-gray-200 bg-gray-100 text-gray-600',
};

const Mantenedores: React.FC = () => {
  const { sesion } = usarSesion();
  const tienePermiso = (permisos: string[] | undefined) =>
    !permisos || permisos.some((permiso) => sesion?.permisos.includes(permiso));

  return (
    <div className="min-h-full bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#676767]">Administración central</p>
              <h1 className="mt-1 text-2xl font-black text-black sm:text-3xl">Mantenedores</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                Accede a las configuraciones autorizadas sin trasladar las reglas de negocio de sus módulos propietarios.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#676767]">
              <span className="rounded-lg bg-orange-50 p-2 text-[#b85e00]"><Settings className="h-5 w-5" /></span>
              <span>Accesos según permisos vigentes</span>
            </div>
          </div>
        </header>

        <div className="mt-6 space-y-7">
          {categorias.map((categoria) => (
            <section key={categoria.id} aria-labelledby={`categoria-${categoria.id}`}>
              <div className="mb-3">
                <h2 id={`categoria-${categoria.id}`} className="text-lg font-black text-black sm:text-xl">{categoria.nombre}</h2>
                <p className="mt-1 text-sm text-[#676767]">{categoria.descripcion}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {categoria.tarjetas.map((tarjeta) => {
                  const permitido = tienePermiso(tarjeta.permisos);
                  const disponible = tarjeta.estado === 'DISPONIBLE' && permitido && Boolean(tarjeta.ruta);
                  const estado: EstadoTarjeta = tarjeta.estado === 'DISPONIBLE' && !permitido ? 'RESTRINGIDO' : tarjeta.estado;
                  const Icono = permitido ? tarjeta.icono : LockKeyhole;
                  const contenido = (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-lg bg-orange-50 p-2.5 text-[#b85e00]"><Icono className="h-5 w-5" /></span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${estilosEstado[estado]}`}>{estado}</span>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-bold uppercase tracking-wide text-[#676767]">{tarjeta.modulo}</p>
                        <h3 className="mt-1 text-base font-black text-black">{tarjeta.nombre}</h3>
                        <p className="mt-2 text-sm leading-5 text-gray-600">{tarjeta.descripcion}</p>
                      </div>
                      <div className="mt-auto pt-5">
                        {disponible ? (
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#b85e00]">Abrir mantenedor <ChevronRight className="h-4 w-4" /></span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-500">{estado === 'RESTRINGIDO' ? 'Acceso no habilitado para tu cuenta' : 'Sin acción operativa en este bloque'}</span>
                        )}
                      </div>
                    </>
                  );

                  return disponible ? (
                    <Link key={tarjeta.nombre} to={tarjeta.ruta!} className="flex min-h-56 flex-col border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FE8F01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FE8F01] focus:ring-offset-2">
                      {contenido}
                    </Link>
                  ) : (
                    <article key={tarjeta.nombre} className="flex min-h-56 flex-col border border-gray-200 bg-white p-5 shadow-sm" aria-disabled={estado === 'RESTRINGIDO'}>
                      {contenido}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Mantenedores;
