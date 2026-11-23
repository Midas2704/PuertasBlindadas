/** Catálogo técnico de operaciones implementadas. */
export declare const operacionesPermiso: Record<string, string>;
export declare const permisosDeOperacion: (operacion: string) => string[];
export declare const permiteOperacion: (operacion: string, permisos: string[]) => boolean;
/** Operaciones sobre cuentas y seguridad ajenas: Gerencia por sí sola no basta. */
export declare const codigosQueRequierenAdministrador: Set<string>;
export declare const operacionesQueRequierenAdministrador: Set<string>;
export declare const permisosM4: string[];
export declare const codigosImplementados: string[];
/** El perfil Administrador representa acceso integral a la matriz de CU implementados. */
export declare const codigosTodosLosCU: string[];
export declare const codigosAdministrador: string[];
export declare const moduloPermiso: (codigo: string) => "INVENTARIO" | "M2" | "M11" | "M7" | "M9" | "M8" | "M6" | "M5" | "M4" | "M3" | "M1";
export declare const dependenciasPermiso: Record<string, string[]>;
type PerfilFuncional = 'gerencia' | 'secretaria' | 'contador';
/** Matriz funcional completa según los actores de cada CU en el flujo vigente. */
export declare const matrizPermisosPorCU: Record<string, readonly PerfilFuncional[]>;
export declare const codigosGerencia: string[];
export declare const codigosSecretaria: string[];
export declare const codigosContador: string[];
export {};
//# sourceMappingURL=permisos.d.ts.map