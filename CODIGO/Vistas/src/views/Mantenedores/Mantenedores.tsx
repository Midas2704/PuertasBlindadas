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
  FileCheck2,
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
  Workflow,
} from 'lucide-react';
import { usarSesion } from '../../seguridad/Sesion';

type EstadoTarjeta = 'LISTO' | 'PRÓXIMAMENTE' | 'SIN ACCESO';

type TarjetaMantenedor = {
  nombre: string;
  descripcion: string;
  modulo: string;
  estado: Exclude<EstadoTarjeta, 'SIN ACCESO'>;
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
    id: 'operacion',
    nombre: 'Trabajo y producción',
    descripcion: 'Organiza las áreas y tareas que usa el equipo para fabricar.',
    tarjetas: [
      { nombre: 'Áreas de trabajo', descripcion: 'Crea áreas y revisa qué empleados trabajan en cada una.', modulo: 'M6 / Terreno', estado: 'LISTO', icono: Workflow, ruta: '/mantenedores/areas-trabajo', permisos: ['CU155', 'CU157'] },
      { nombre: 'Tareas de fabricación', descripcion: 'Define las tareas que se pueden agregar a una plantilla de fabricación.', modulo: 'M2 / Producción', estado: 'LISTO', icono: ClipboardCheck, ruta: '/mantenedores/tareas-fabricacion', permisos: ['CU360'] },
    ],
  },
  {
    id: 'comercial',
    nombre: 'Comercial',
    descripcion: 'Configura lo que se usa al preparar cotizaciones y ventas.',
    tarjetas: [
      { nombre: 'Productos y familias', descripcion: 'Crea productos, agrúpalos y define sus características.', modulo: 'M2', estado: 'LISTO', icono: Boxes, ruta: '/mantenedores/productos', permisos: ['CU360'] },
      { nombre: 'Precios de venta', descripcion: 'Define precios, fechas de vigencia y opciones adicionales.', modulo: 'M2', estado: 'LISTO', icono: Gauge, ruta: '/mantenedores/comercial?seccion=precios', permisos: ['CU360'] },
      { nombre: 'Precios de instalación', descripcion: 'Define dónde se instala y cuánto se cobra por región o comuna.', modulo: 'M2', estado: 'LISTO', icono: CircleDollarSign, ruta: '/mantenedores/comercial?seccion=tarifas', permisos: ['CU360'] },
      { nombre: 'Condiciones de venta', descripcion: 'Configura plazos, garantías y condiciones para empresas y personas.', modulo: 'M2', estado: 'LISTO', icono: ClipboardCheck, ruta: '/mantenedores/comercial?seccion=condiciones', permisos: ['CU360'] },
      { nombre: 'Formatos de documentos', descripcion: 'Revisa y actualiza los formatos usados en documentos comerciales.', modulo: 'M2', estado: 'LISTO', icono: FileText, ruta: '/mantenedores/documentos-comerciales?seccion=plantillas', permisos: ['CU360'] },
      { nombre: 'Carta para clientes', descripcion: 'Prepara y revisa la carta comercial general para clientes particulares.', modulo: 'M2', estado: 'LISTO', icono: FileCheck2, ruta: '/mantenedores/documentos-comerciales?seccion=carta-b2c', permisos: ['CU360'] },
      { nombre: 'Aviso de cotizaciones por vencer', descripcion: 'Elige cuántos días antes se mostrará el aviso de vencimiento.', modulo: 'M2', estado: 'LISTO', icono: FileClock, ruta: '/configuracion/umbral', permisos: ['CU41'] },
    ],
  },
  {
    id: 'clientes-pagos',
    nombre: 'Clientes y pagos',
    descripcion: 'Catálogos compartidos por clientes, recaudación y remuneraciones.',
    tarjetas: [
      { nombre: 'Tipos de cliente', descripcion: 'Clasificaciones disponibles para ordenar clientes y cotizaciones.', modulo: 'M1', estado: 'PRÓXIMAMENTE', icono: Users },
      { nombre: 'Formas de pago', descripcion: 'Configura efectivo, transferencia, tarjetas y sus requisitos.', modulo: 'M3 / M6', estado: 'LISTO', icono: WalletCards, ruta: '/parametros-remuneraciones', permisos: ['CU171'] },
      { nombre: 'Categorías de pago', descripcion: 'Ordena los pagos según su finalidad.', modulo: 'M3', estado: 'PRÓXIMAMENTE', icono: ReceiptText },
    ],
  },
  {
    id: 'proveedores-egresos',
    nombre: 'Proveedores y egresos',
    descripcion: 'Organiza gastos y avisos relacionados con proveedores.',
    tarjetas: [
      { nombre: 'Tipos de gasto', descripcion: 'Crea categorías para ordenar los egresos de la empresa.', modulo: 'M5', estado: 'LISTO', icono: Tags, ruta: '/categorias-egreso', permisos: ['CU134'] },
      { nombre: 'Avisos de cuentas por vencer', descripcion: 'Elige cuándo avisar que una cuenta de proveedor está próxima a vencer.', modulo: 'M5', estado: 'LISTO', icono: Banknote, ruta: '/cuentas-por-pagar', permisos: ['CU106'] },
    ],
  },
  {
    id: 'remuneraciones',
    nombre: 'Remuneraciones',
    descripcion: 'Configura cómo se calculan y organizan las remuneraciones.',
    tarjetas: [
      { nombre: 'Reglas de remuneración', descripcion: 'Configura cargos, tarifas, haberes y formas de cálculo.', modulo: 'M6', estado: 'LISTO', icono: BriefcaseBusiness, ruta: '/esquemas-remuneracionales', permisos: ['CU162', 'CU163', 'CU164', 'CU165', 'CU166'] },
      { nombre: 'Valores para remuneraciones', descripcion: 'Actualiza valores legales, previsionales, impuestos y repartos.', modulo: 'M6', estado: 'LISTO', icono: Landmark, ruta: '/parametros-remuneraciones', permisos: ['CU167', 'CU168', 'CU169', 'CU170'] },
    ],
  },
  {
    id: 'finanzas',
    nombre: 'Finanzas',
    descripcion: 'Ajusta límites y avisos usados para revisar las finanzas.',
    tarjetas: [
      { nombre: 'Margen mínimo', descripcion: 'Define el margen que activa una advertencia para Gerencia.', modulo: 'M7', estado: 'LISTO', icono: ChartNoAxesCombined, ruta: '/parametros-remuneraciones', permisos: ['CU246'] },
      { nombre: 'Límites de control financiero', descripcion: 'Configura avisos de liquidez, instalación y materiales sin movimiento.', modulo: 'M7', estado: 'LISTO', icono: CircleDollarSign, ruta: '/dashboard-m7/control', permisos: ['CU232', 'CU244', 'CU257'] },
    ],
  },
  {
    id: 'credito',
    nombre: 'Crédito',
    descripcion: 'Configuraciones globales separadas de las decisiones por cliente.',
    tarjetas: [
      { nombre: 'Límite total de crédito', descripcion: 'Define el monto máximo de crédito disponible para todos los clientes.', modulo: 'M8', estado: 'LISTO', icono: CreditCard, ruta: '/parametros-remuneraciones', permisos: ['CU268'] },
    ],
  },
  {
    id: 'auditoria',
    nombre: 'Auditoría',
    descripcion: 'Conservación y políticas sin desactivar controles obligatorios de M9.',
    tarjetas: [
      { nombre: 'Tiempo de conservación', descripcion: 'Define cuánto tiempo deben mantenerse los documentos.', modulo: 'M6', estado: 'LISTO', icono: FileClock, ruta: '/parametros-remuneraciones', permisos: ['CU170'] },
      { nombre: 'Avisos de auditoría', descripcion: 'Configura alertas para revisar operaciones importantes.', modulo: 'M9', estado: 'PRÓXIMAMENTE', icono: ShieldCheck },
      { nombre: 'Imágenes y documentos de productos', descripcion: 'Organiza archivos e imágenes usados en ventas y cotizaciones.', modulo: 'M2 / M9', estado: 'PRÓXIMAMENTE', icono: Images },
    ],
  },
];

const estilosEstado: Record<EstadoTarjeta, string> = {
  LISTO: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  'PRÓXIMAMENTE': 'border-amber-200 bg-amber-50 text-amber-900',
  'SIN ACCESO': 'border-gray-200 bg-gray-100 text-gray-600',
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
              <p className="text-xs font-black uppercase tracking-wide text-[#676767]">Administración</p>
              <h1 className="mt-1 text-2xl font-black text-black sm:text-3xl">Opciones del sistema</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                Elige qué información quieres configurar. Sólo verás las opciones habilitadas para tu cuenta.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-[#676767]">
              <span className="rounded-lg bg-orange-50 p-2 text-[#b85e00]"><Settings className="h-5 w-5" /></span>
              <span>Opciones según tu acceso</span>
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
                  const disponible = tarjeta.estado === 'LISTO' && permitido && Boolean(tarjeta.ruta);
                  const estado: EstadoTarjeta = tarjeta.estado === 'LISTO' && !permitido ? 'SIN ACCESO' : tarjeta.estado;
                  const Icono = permitido ? tarjeta.icono : LockKeyhole;
                  const contenido = (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <span className="rounded-lg bg-orange-50 p-2.5 text-[#b85e00]"><Icono className="h-5 w-5" /></span>
                        <span className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${estilosEstado[estado]}`}>{estado}</span>
                      </div>
                      <div className="mt-4">
                        <h3 className="mt-1 text-base font-black text-black">{tarjeta.nombre}</h3>
                        <p className="mt-2 text-sm leading-5 text-gray-600">{tarjeta.descripcion}</p>
                      </div>
                      <div className="mt-auto pt-5">
                        {disponible ? (
                          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#b85e00]">Abrir configuración <ChevronRight className="h-4 w-4" /></span>
                        ) : (
                          <span className="text-xs font-semibold text-gray-500">{estado === 'SIN ACCESO' ? 'Tu cuenta no tiene acceso' : 'Esta opción estará disponible más adelante'}</span>
                        )}
                      </div>
                    </>
                  );

                  return disponible ? (
                    <Link key={tarjeta.nombre} to={tarjeta.ruta!} className="flex min-h-56 flex-col border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#FE8F01] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#FE8F01] focus:ring-offset-2">
                      {contenido}
                    </Link>
                  ) : (
                    <article key={tarjeta.nombre} className="flex min-h-56 flex-col border border-gray-200 bg-white p-5 shadow-sm" aria-disabled={estado === 'SIN ACCESO'}>
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
