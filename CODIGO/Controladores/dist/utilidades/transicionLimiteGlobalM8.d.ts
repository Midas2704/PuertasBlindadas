/** La tabla usa fechas civiles UTC (@db.Date), no horas. */
export declare function transicionLimiteGlobalM8(vigenciaActual: Date, vigenciaNueva: Date): {
    tipo: 'sustitucion_mismo_dia';
} | {
    tipo: 'cierre_anterior';
    cierre: Date;
};
//# sourceMappingURL=transicionLimiteGlobalM8.d.ts.map