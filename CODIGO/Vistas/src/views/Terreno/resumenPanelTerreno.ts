type OrdenIndicador = { estado: string };
type VisitaIndicador = { estado: string | null; fecha: string | null };

export const resumirOrdenesTerreno = (ordenes: OrdenIndicador[]) => ({
  rectificacion: ordenes.filter((orden) => ['PENDIENTE_RECTIFICACION', 'RECTIFICACION_ASIGNADA', 'RECTIFICACION_EN_PROCESO', 'RECTIFICACION_DEVUELTA'].includes(orden.estado)).length,
  aprobacion: ordenes.filter((orden) => orden.estado === 'PENDIENTE_APROBACION_TECNICA').length,
  liberadas: ordenes.filter((orden) => orden.estado === 'LIBERADA').length,
  produccion: ordenes.filter((orden) => orden.estado === 'EN_PRODUCCION').length,
  finalizadas: ordenes.filter((orden) => orden.estado === 'FINALIZADA').length,
});

export const resumirVisitasTerreno = (visitas: VisitaIndicador[], hoy: string) => {
  const terminales = new Set(['FINALIZADA', 'CERRADA', 'CANCELADA']);
  const fecha = (visita: VisitaIndicador) => visita.fecha?.slice(0, 10) || null;
  const pendiente = (visita: VisitaIndicador) => !terminales.has((visita.estado || '').toLocaleUpperCase('es-CL'));
  return {
    visitasHoy: visitas.filter((visita) => fecha(visita) === hoy).length,
    proximasVisitas: visitas.filter((visita) => {
      const programada = fecha(visita);
      return pendiente(visita) && Boolean(programada && programada > hoy);
    }).length,
    visitasSinProgramar: visitas.filter((visita) => pendiente(visita) && !fecha(visita)).length,
    visitasPendientes: visitas.filter(pendiente).length,
  };
};
