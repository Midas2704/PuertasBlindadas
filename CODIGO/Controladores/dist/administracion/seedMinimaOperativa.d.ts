import { type PrismaClient } from '@prisma/client';
export declare const CODIGO_MANIFIESTO_DEMO = "DEMO_UI_MANIFIESTO_V2";
export declare const PREFIJO_SEED_MINIMA = "DEMO-CAT-";
export declare const BASE_OPERATIVA_AUTORIZADA = "pblindadas_finanzas";
export type ModoSeedMinima = 'audit' | 'dry-run' | 'apply' | 'verify';
export interface ProductoMinimo {
    codigo: string;
    nombre: string;
    itemExistente: string;
    familia: 'DEMO-CAT-PUERTAS-BLINDADAS' | 'DEMO-CAT-PUERTAS-COMERCIALES';
    descripcionB2b: string;
    descripcionB2c: string;
    precioB2b: string;
    precioB2c: string;
}
export declare const CATALOGO_MINIMO: Readonly<{
    familias: {
        codigo: string;
        nombre: string;
    }[];
    productos: ({
        codigo: string;
        nombre: string;
        itemExistente: string;
        familia: "DEMO-CAT-PUERTAS-BLINDADAS";
        descripcionB2b: string;
        descripcionB2c: string;
        precioB2b: string;
        precioB2c: string;
    } | {
        codigo: string;
        nombre: string;
        itemExistente: string;
        familia: "DEMO-CAT-PUERTAS-COMERCIALES";
        descripcionB2b: string;
        descripcionB2c: string;
        precioB2b: string;
        precioB2c: string;
    })[];
    opcionales: {
        codigo: string;
        nombre: string;
        precioB2b: string;
        precioB2c: string;
    }[];
    servicios: {
        codigo: string;
        nombre: string;
        unidad: string;
        precioB2b: string;
        precioB2c: string;
    }[];
    condiciones: {
        codigo: string;
        nombre: string;
        segmento: string;
    }[];
    categoriasPago: string[];
    cuotas: number[];
    inventario: {
        unidades: string[];
        categoriasGenerales: string[];
        categoriasFuncionales: string[];
    };
}>;
interface ConteosProtegidos {
    cotizaciones: number;
    notasVenta: number;
    pagos: number;
    usuarios: number;
    permisos: number;
}
interface AccionPlan {
    modulo: string;
    entidad: string;
    clave: string;
    accion: 'CREAR' | 'CONSERVAR' | 'PENDIENTE_CONFIGURACION';
    motivo?: string;
}
export declare function validarDefinicionCatalogoMinimo(): boolean;
export declare function prioridadesDesdeAuditoria(catalogos: Record<string, {
    total_registros?: number;
}>): readonly [{
    readonly modulo: "M2";
    readonly catalogo: "Productos, familias, versiones y precios";
    readonly estado: "CONSERVAR" | "COMPLETAR";
    readonly prioridad: "ALTA";
}, {
    readonly modulo: "M2";
    readonly catalogo: "Opcionales y compatibilidades";
    readonly estado: "CONSERVAR" | "COMPLETAR";
    readonly prioridad: "ALTA";
}, {
    readonly modulo: "M2";
    readonly catalogo: "Servicios comerciales";
    readonly estado: "CONSERVAR" | "COMPLETAR";
    readonly prioridad: "ALTA";
}, {
    readonly modulo: "M2";
    readonly catalogo: "Condiciones y cobertura";
    readonly estado: "CONSERVAR" | "COMPLETAR";
    readonly prioridad: "ALTA";
}, {
    readonly modulo: "M3";
    readonly catalogo: "Categorías de pago y cuotas";
    readonly estado: "CONSERVAR" | "COMPLETAR";
    readonly prioridad: "MEDIA";
}, {
    readonly modulo: "M5";
    readonly catalogo: "Proveedores";
    readonly estado: "CONSERVAR" | "REVISAR_MANUAL";
    readonly prioridad: "BAJA";
}, {
    readonly modulo: "M6";
    readonly catalogo: "Honorarios";
    readonly estado: "CONSERVAR" | "REVISAR_MANUAL";
    readonly prioridad: "BAJA";
}, {
    readonly modulo: "M6";
    readonly catalogo: "Remuneraciones y parámetros legales";
    readonly estado: "CONSERVAR_SIN_MODIFICAR_NORMATIVA" | "PENDIENTE_FUENTE_OFICIAL";
    readonly prioridad: "BAJA";
}, {
    readonly modulo: "Inventario";
    readonly catalogo: "Materiales y bodegas";
    readonly estado: "CONSERVAR" | "REVISAR_MANUAL";
    readonly prioridad: "BAJA";
}, {
    readonly modulo: "Inventario";
    readonly catalogo: "Unidades y categorías";
    readonly estado: "CONSERVAR" | "COMPLETAR";
    readonly prioridad: "MEDIA";
}];
export declare function auditarSeedMinima(cliente: PrismaClient): Promise<{
    modo: string;
    base: string;
    migraciones: {
        aplicadas: number;
        fallidas: number;
        ultima: string | null;
    };
    protegidos: ConteosProtegidos;
    manifiesto: {
        presente: boolean;
        id: number;
        estado: string;
        firmaValida: boolean;
    } | {
        presente: boolean;
        id?: undefined;
        estado?: undefined;
        firmaValida?: undefined;
    };
    cuentaRaiz: {
        cantidad: number;
    };
    catalogosActuales: {
        productosB2bUtilizables: number;
        productosB2cUtilizables: number;
        prestadoresHonorarios: number;
        esquemasRemuneracionales: number;
        proveedores: number;
        materiales: number;
    };
    plan: AccionPlan[];
    resumen: {
        crear: number;
        conservar: number;
        pendientes: number;
    };
}>;
export declare function aplicarSeedMinima(cliente: PrismaClient, entorno?: NodeJS.ProcessEnv): Promise<{
    creados: number;
    porEntidad: Record<string, number>;
    modo: string;
    seguridad: {
        base: string;
        respaldo: string;
        manifiesto: {
            id: number;
            version: number;
            meses: number | undefined;
        };
        migraciones: {
            aplicadas: number;
            fallidas: number;
            ultima: string | null;
        };
    };
    antes: ConteosProtegidos;
    despues: ConteosProtegidos;
}>;
export declare function verificarSeedMinima(cliente: PrismaClient): Promise<{
    estado: string;
    productosB2b: number;
    productosB2c: number;
    serviciosB2b: number;
    serviciosB2c: number;
    categoriasPago: number;
    cuotas: number;
}>;
export declare function ejecutarSeedMinima(cliente: PrismaClient, modo: ModoSeedMinima, entorno?: NodeJS.ProcessEnv): Promise<{
    modo: string;
    base: string;
    migraciones: {
        aplicadas: number;
        fallidas: number;
        ultima: string | null;
    };
    protegidos: ConteosProtegidos;
    manifiesto: {
        presente: boolean;
        id: number;
        estado: string;
        firmaValida: boolean;
    } | {
        presente: boolean;
        id?: undefined;
        estado?: undefined;
        firmaValida?: undefined;
    };
    cuentaRaiz: {
        cantidad: number;
    };
    catalogosActuales: {
        productosB2bUtilizables: number;
        productosB2cUtilizables: number;
        prestadoresHonorarios: number;
        esquemasRemuneracionales: number;
        proveedores: number;
        materiales: number;
    };
    plan: AccionPlan[];
    resumen: {
        crear: number;
        conservar: number;
        pendientes: number;
    };
} | {
    creados: number;
    porEntidad: Record<string, number>;
    modo: string;
    seguridad: {
        base: string;
        respaldo: string;
        manifiesto: {
            id: number;
            version: number;
            meses: number | undefined;
        };
        migraciones: {
            aplicadas: number;
            fallidas: number;
            ultima: string | null;
        };
    };
    antes: ConteosProtegidos;
    despues: ConteosProtegidos;
} | {
    estado: string;
    productosB2b: number;
    productosB2c: number;
    serviciosB2b: number;
    serviciosB2c: number;
    categoriasPago: number;
    cuotas: number;
}>;
export {};
//# sourceMappingURL=seedMinimaOperativa.d.ts.map