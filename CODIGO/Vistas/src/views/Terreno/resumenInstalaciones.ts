import type { InstalacionTerreno } from '../GestionTerreno/tipos';

type InstalacionIndicador = { clasificacion: string; visita: { fecha: string | null } };

export const resumirInstalaciones = (datos: InstalacionTerreno[]) => ({
  total: datos.length,
  programadas: datos.filter((instalacion) => Boolean(instalacion.visita.fecha) && instalacion.clasificacion === 'PENDIENTE').length,
  pendientes: datos.filter((instalacion) => instalacion.clasificacion === 'PENDIENTE').length,
  realizadas: datos.filter((instalacion) => instalacion.clasificacion === 'INSTALACION_COMPLETADA').length,
  noCompletadas: datos.filter((instalacion) => ['PARCIALMENTE_REALIZADA', 'VISITA_NO_EJECUTADA', 'REPROGRAMACION_NECESARIA'].includes(instalacion.clasificacion)).length,
});

export const resumirInstalacionesTerreno = (instalaciones: InstalacionIndicador[]) => instalaciones.length
  ? {
      instalacionesProgramadas: instalaciones.filter((instalacion) => Boolean(instalacion.visita.fecha) && instalacion.clasificacion === 'PENDIENTE').length,
      instalacionesPendientes: instalaciones.filter((instalacion) => instalacion.clasificacion === 'PENDIENTE').length,
      instalacionesRealizadas: instalaciones.filter((instalacion) => instalacion.clasificacion === 'INSTALACION_COMPLETADA').length,
      instalacionesNoCompletadas: instalaciones.filter((instalacion) => ['PARCIALMENTE_REALIZADA', 'VISITA_NO_EJECUTADA', 'REPROGRAMACION_NECESARIA'].includes(instalacion.clasificacion)).length,
    }
  : {
      instalacionesProgramadas: 'Sin registros',
      instalacionesPendientes: 'Sin registros',
      instalacionesRealizadas: 'Sin registros',
      instalacionesNoCompletadas: 'Sin registros',
    };
