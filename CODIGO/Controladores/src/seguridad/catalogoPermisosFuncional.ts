import { operacionesPermiso } from '../validaciones/permisos';

export const AREAS_FUNCIONALES_M4 = [
  'Clientes',
  'Cotizaciones y Ventas',
  'Productos y Familias',
  'Precios y Condiciones Comerciales',
  'Documentos Comerciales',
  'Pagos y Cobranza',
  'Proveedores y Compras',
  'Costos y Gastos',
  'Crédito',
  'Terreno',
  'Obras y Proyectos',
  'Órdenes de Trabajo y Producción',
  'Inventario',
  'Remuneraciones',
  'Usuarios y Seguridad',
  'Auditoría',
  'Dashboard y Gestión Financiera',
  'Configuración y Mantenedores',
] as const;

export type AreaFuncionalM4 = typeof AREAS_FUNCIONALES_M4[number];

export interface PermisoFuncionalM4 {
  codigo: string;
  area: AreaFuncionalM4;
  accion: string;
  descripcion: string;
  activo: boolean;
  requiereAdministrador: boolean;
}

const nombresExplicitos: Record<string, string> = {
  CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente',
  CU05:'Ver y buscar clientes', CU06:'Buscar clientes', CU07:'Filtrar clientes por estado', CU08:'Consultar información financiera del cliente', CU09:'Ver ficha del cliente',
  CU14:'Ver productos', CU15:'Ver inventario', CU18:'Emitir cotización', CU19:'Crear y guardar cotización', CU20:'Ver y editar cotizaciones',
  CU21:'Reactivar cotización', CU22:'Rechazar o descartar cotización', CU23:'Formalizar cliente particular', CU24:'Aprobar cotización y aceptar alternativa',
  CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta',
  CU37:'Anular Nota de Venta', CU38:'Revertir Nota de Venta', CU39:'Definir condiciones de cobro', CU40:'Configurar etapas de cobro', CU41:'Configurar umbral comercial',
  CU42:'Consultar contexto de pago', CU43:'Registrar pago', CU45:'Consultar catálogos de pago', CU47:'Consultar tipo de cambio', CU49:'Consultar saldo de venta',
  CU51:'Anular pago', CU52:'Revertir pago', CU54:'Aplicar saldo a favor', CU55:'Ver pago', CU56:'Consultar morosidad', CU57:'Generar comprobante', CU58:'Conciliar pago',
  CU59:'Crear usuarios y consultar catálogos', CU60:'Desactivar usuario', CU61:'Reactivar usuario', CU62:'Cambiar perfil de usuario',
  CU63:'Asignar permisos particulares', CU64:'Retirar permisos particulares', CU65:'Asignar rol Administrador', CU66:'Retirar rol Administrador', CU67:'Ver usuarios y accesos',
  CU68:'Consultar sesión propia', CU69:'Cambiar contraseña propia', CU70:'Cerrar sesión propia', CU71:'Restablecer contraseña de usuario',
  CU72:'Desbloquear usuario', CU73:'Consultar sesiones activas', CU74:'Cerrar sesión administrativamente',
  CU155:'Ver empleados y áreas de trabajo', CU156:'Crear empleado', CU157:'Editar empleado y gestionar áreas de trabajo',
  CU199:'Crear visitas y ver obras', CU200:'Asignar responsables de visita', CU201:'Ver tareas propias de Terreno', CU202:'Gestionar levantamientos y panel de Terreno',
  CU203:'Corregir levantamiento', CU204:'Generar orden de trabajo desde levantamiento', CU205:'Ajustar y liberar órdenes de trabajo', CU206:'Generar tareas de producción',
  CU207:'Gestionar tareas de producción', CU208:'Ejecutar tareas de producción', CU209:'Aprobar ejecución y rectificaciones', CU210:'Preparar salida e instalaciones',
  CU211:'Registrar resultado de visita', CU212:'Registrar incidencias de Terreno', CU213:'Revisar incidencias de Terreno',
  CU355:'Consultar auditoría', CU359:'Exportar auditoría',
  CU360:'Ver catálogo comercial', CU361:'Crear productos, familias y tareas', CU362:'Editar productos, familias y plantillas',
  CU363:'Desactivar productos, familias y tareas', CU364:'Reactivar productos, familias y tareas', CU365:'Publicar versiones de producto y fabricación',
  CU366:'Vincular producto comercial', CU367:'Consultar historial comercial y documental', CU368:'Gestionar precios y servicios comerciales',
  CU369:'Gestionar opcionales comerciales', CU370:'Gestionar tarifas de instalación', CU371:'Gestionar condiciones comerciales', CU372:'Publicar condiciones comerciales',
  CU373:'Cargar y reemplazar documentos comerciales', CU374:'Gestionar fotografías y documentos de producto', CU375:'Ver vista previa de documentos',
  CU376:'Descargar documentos e históricos', CU378:'Crear y editar plantillas documentales', CU379:'Publicar plantillas documentales',
  CU380:'Crear y editar carta comercial B2C', CU381:'Publicar carta comercial B2C',
};

const primeraOperacionPorCodigo = new Map<string,string>();
for (const [operacion,codigo] of Object.entries(operacionesPermiso)) if (!primeraOperacionPorCodigo.has(codigo)) primeraOperacionPorCodigo.set(codigo,operacion);

const humanizar = (valor: string) => {
  const separado = valor.replace(/([a-záéíóúñ])([A-Z])/g,'$1 $2').replace(/M[1-9]$/,'').trim();
  const palabras = separado.replace(/\bCotizacion\b/gi,'cotización').replace(/\bConfiguracion\b/gi,'configuración').replace(/\bHistorico\b/gi,'histórico')
    .replace(/\bAuditoria\b/gi,'auditoría').replace(/\bCredito\b/gi,'crédito').replace(/\bOperacion\b/gi,'operación').replace(/\bRemuneracion\b/gi,'remuneración')
    .replace(/\bInstalacion\b/gi,'instalación').replace(/\bCatalogos\b/gi,'catálogos').replace(/\bArticulo\b/gi,'artículo').replace(/\bTecnica\b/gi,'técnica');
  return palabras ? palabras.charAt(0).toUpperCase()+palabras.slice(1) : 'Acción autorizada';
};

export const areaPermisoM4 = (codigo: string): AreaFuncionalM4 => {
  const numero=Number(codigo.slice(2));
  if(numero>=1&&numero<=11)return 'Clientes';
  if([14,15].includes(numero)||numero>=360&&numero<=367)return 'Productos y Familias';
  if(numero>=12&&numero<=41)return 'Cotizaciones y Ventas';
  if(numero>=42&&numero<=58)return 'Pagos y Cobranza';
  if(numero>=59&&numero<=74)return 'Usuarios y Seguridad';
  if(numero>=75&&numero<=110)return 'Proveedores y Compras';
  if(numero>=111&&numero<=133)return 'Pagos y Cobranza';
  if(numero>=134&&numero<=154)return 'Costos y Gastos';
  if(numero>=155&&numero<=198)return 'Remuneraciones';
  if(numero===199)return 'Obras y Proyectos';
  if(numero>=200&&numero<=205)return 'Terreno';
  if(numero>=206&&numero<=209)return 'Órdenes de Trabajo y Producción';
  if(numero>=210&&numero<=213)return 'Terreno';
  if(numero===214)return 'Remuneraciones';
  if(numero>=215&&numero<=246)return 'Dashboard y Gestión Financiera';
  if(numero>=247&&numero<=253)return 'Órdenes de Trabajo y Producción';
  if(numero>=254&&numero<=258)return 'Inventario';
  if(numero>=259&&numero<=274)return 'Crédito';
  if(numero===355||numero===359)return 'Auditoría';
  if(numero>=368&&numero<=372)return 'Precios y Condiciones Comerciales';
  if(numero>=373&&numero<=381)return 'Documentos Comerciales';
  return 'Configuración y Mantenedores';
};

export const clasificarPermisoM4 = (entrada:{codigo:string;descripcion?:string|null;activo:boolean;requiereAdministrador:boolean}):PermisoFuncionalM4 => {
  const operacion=primeraOperacionPorCodigo.get(entrada.codigo);
  const accion=nombresExplicitos[entrada.codigo] || (operacion ? humanizar(operacion) : humanizar(entrada.descripcion || 'Acción autorizada'));
  return {...entrada,area:areaPermisoM4(entrada.codigo),accion,descripcion:entrada.descripcion?.trim() || accion};
};
