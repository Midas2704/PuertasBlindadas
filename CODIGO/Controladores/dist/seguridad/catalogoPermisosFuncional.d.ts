export declare const AREAS_FUNCIONALES_M4: readonly ["Clientes", "Cotizaciones y Ventas", "Productos y Familias", "Precios y Condiciones Comerciales", "Documentos Comerciales", "Pagos y Cobranza", "Proveedores y Compras", "Costos y Gastos", "Crédito", "Terreno", "Obras y Proyectos", "Órdenes de Trabajo y Producción", "Inventario", "Remuneraciones", "Usuarios y Seguridad", "Auditoría", "Dashboard y Gestión Financiera", "Configuración y Mantenedores"];
export type AreaFuncionalM4 = typeof AREAS_FUNCIONALES_M4[number];
export interface PermisoFuncionalM4 {
    codigo: string;
    area: AreaFuncionalM4;
    accion: string;
    descripcion: string;
    activo: boolean;
    requiereAdministrador: boolean;
}
export declare const areaPermisoM4: (codigo: string) => AreaFuncionalM4;
export declare const clasificarPermisoM4: (entrada: {
    codigo: string;
    descripcion?: string | null;
    activo: boolean;
    requiereAdministrador: boolean;
}) => PermisoFuncionalM4;
//# sourceMappingURL=catalogoPermisosFuncional.d.ts.map